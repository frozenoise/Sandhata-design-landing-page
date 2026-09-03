import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isGitHubAppConfigured, getInstallationOctokit, slugify } from "@/lib/github";
import { treeToJSX, type UINode } from "@/app/builder/uiTree";

// POST /api/github/push { projectId, sessionIds?: string[] }
// Commits the derived .tsx for each session (default: every session in the
// project that has a generated tree) to the project's working branch via
// the Git Data API — one atomic multi-file commit, not one commit per file.
// No .sandhata/*.json manifest yet (that's Phase 2) — this is push-only,
// last-write-wins, single repo.
//
// Git Data API sequence (see plan): ref → base commit → base tree → blobs
// → tree → commit → update ref (or create the ref, branching off the
// repo's default branch, on first push).

function fileContentFor(sessionName: string, tree: UINode): string {
  const componentName = pascalCase(sessionName) || "Generated";
  return `import {\n  /* … */\n} from "sandhata-ui";\n\nexport default function ${componentName}() {\n  return (\n${treeToJSX(tree, 2)}\n  );\n}\n`;
}

function pascalCase(s: string): string {
  const words = s.replace(/[^a-zA-Z0-9]+/g, " ").trim().split(/\s+/).filter(Boolean);
  return words.map(w => w[0].toUpperCase() + w.slice(1)).join("").slice(0, 64) || "Generated";
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  if (!isGitHubAppConfigured()) {
    return NextResponse.json(
      { error: "github_app_not_configured", message: "GitHub integration isn't set up yet." },
      { status: 501 }
    );
  }

  const body = await req.json().catch(() => null);
  const { projectId, sessionIds } = body || {};
  if (!projectId) return NextResponse.json({ error: "bad_request", message: "projectId is required" }, { status: 400 });

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id },
    include: {
      githubInstallation: { select: { installationId: true } },
      sessions: {
        where: Array.isArray(sessionIds) && sessionIds.length ? { id: { in: sessionIds } } : undefined,
        select: { id: true, name: true, tree: true },
      },
    },
  });
  if (!project) return NextResponse.json({ error: "project_not_found" }, { status: 404 });

  if (!project.repoOwner || !project.repoName || !project.githubInstallation) {
    return NextResponse.json({ error: "not_connected", message: "This project isn't connected to a GitHub repository yet." }, { status: 400 });
  }

  const pages = project.sessions.filter(s => s.tree) as { id: string; name: string; tree: UINode }[];
  if (pages.length === 0) {
    return NextResponse.json({ error: "nothing_to_push", message: "No generated pages to push yet." }, { status: 400 });
  }

  const { repoOwner: owner, repoName: repo } = project;
  const installationId = project.githubInstallation.installationId;

  try {
    const octokit = await getInstallationOctokit(installationId);

    // Branch strategy: first push for a project creates/reuses
    // sandhata/<project-slug>, never the repo's default branch directly.
    let branch = project.workingBranch;
    if (!branch) {
      branch = `sandhata/${slugify(project.name)}`;
    }

    let baseCommitSha: string;
    try {
      const { data: ref } = await octokit.rest.git.getRef({ owner, repo, ref: `heads/${branch}` });
      baseCommitSha = ref.object.sha;
    } catch (e: any) {
      if (e?.status !== 404) throw e;
      // Branch doesn't exist yet — branch it off the repo's current default-branch head.
      const { data: repoData } = await octokit.rest.repos.get({ owner, repo });
      const defaultBranch = repoData.default_branch;
      const { data: defaultRef } = await octokit.rest.git.getRef({ owner, repo, ref: `heads/${defaultBranch}` });
      baseCommitSha = defaultRef.object.sha;
      await octokit.rest.git.createRef({ owner, repo, ref: `refs/heads/${branch}`, sha: baseCommitSha });
    }

    const { data: baseCommit } = await octokit.rest.git.getCommit({ owner, repo, commit_sha: baseCommitSha });
    const baseTreeSha = baseCommit.tree.sha;

    // Dedupe file paths — two sessions with the same slugified name would
    // otherwise silently overwrite each other in the tree.
    const usedPaths = new Set<string>();
    const files = pages.map(p => {
      let base = slugify(p.name);
      let path = `src/generated/${base}.tsx`;
      let n = 2;
      while (usedPaths.has(path)) {
        path = `src/generated/${base}-${n}.tsx`;
        n++;
      }
      usedPaths.add(path);
      return { path, content: fileContentFor(p.name, p.tree) };
    });

    const blobs = await Promise.all(
      files.map(async f => {
        const { data: blob } = await octokit.rest.git.createBlob({ owner, repo, content: f.content, encoding: "utf-8" });
        return { path: f.path, sha: blob.sha };
      })
    );

    const { data: newTree } = await octokit.rest.git.createTree({
      owner, repo, base_tree: baseTreeSha,
      tree: blobs.map(b => ({ path: b.path, mode: "100644" as const, type: "blob" as const, sha: b.sha })),
    });

    const names = pages.map(p => p.name).join(", ");
    const message = `Sandhata: sync ${pages.length} page(s) — ${names}\n\nGenerated-by: Sandhata AI Builder`;

    const { data: newCommit } = await octokit.rest.git.createCommit({
      owner, repo, message, tree: newTree.sha, parents: [baseCommitSha],
    });

    await octokit.rest.git.updateRef({ owner, repo, ref: `heads/${branch}`, sha: newCommit.sha });

    const updated = await prisma.project.update({
      where: { id: project.id },
      data: {
        workingBranch: branch,
        lastSyncedSha: newCommit.sha,
        lastSyncedAt: new Date(),
        syncStatus: "synced",
        lastSyncError: null,
      },
      select: { workingBranch: true, lastSyncedSha: true, lastSyncedAt: true, syncStatus: true },
    });

    return NextResponse.json({
      ok: true,
      commitSha: newCommit.sha,
      branch,
      filesPushed: files.map(f => f.path),
      project: updated,
    });
  } catch (e: any) {
    const message = e?.message || "Push failed";
    await prisma.project.update({
      where: { id: project.id },
      data: { syncStatus: "error", lastSyncError: message },
    }).catch(() => {});
    return NextResponse.json({ error: "github_api_error", message }, { status: 502 });
  }
}
