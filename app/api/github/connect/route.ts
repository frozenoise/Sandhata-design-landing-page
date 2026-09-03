import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isGitHubAppConfigured, getInstallationOctokit } from "@/lib/github";

// POST /api/github/connect { projectId, installationId, owner, repo }
// Links a project to a specific repo within an installation the caller owns.
// Never trusts the client-supplied owner/repo blindly — re-fetches the
// installation's accessible-repos list server-side and checks membership
// before writing anything. workingBranch/lastSyncedSha are deliberately left
// unset here: the sandhata/<slug> branch is created lazily on first push
// (see app/api/github/push), not at connect time.
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  if (!isGitHubAppConfigured()) {
    return NextResponse.json({ error: "github_app_not_configured" }, { status: 501 });
  }

  const body = await req.json().catch(() => null);
  const { projectId, installationId, owner, repo } = body || {};
  if (!projectId || !installationId || !owner || !repo) {
    return NextResponse.json({ error: "bad_request", message: "projectId, installationId, owner, and repo are required" }, { status: 400 });
  }

  const project = await prisma.project.findFirst({ where: { id: projectId, userId: session.user.id }, select: { id: true } });
  if (!project) return NextResponse.json({ error: "project_not_found" }, { status: 404 });

  const installation = await prisma.gitHubInstallation.findFirst({
    where: { installationId: Number(installationId), userId: session.user.id },
    select: { id: true },
  });
  if (!installation) return NextResponse.json({ error: "installation_not_found" }, { status: 404 });

  try {
    const octokit = await getInstallationOctokit(Number(installationId));

    // Confirm this repo is actually in the installation's accessible list
    // (not just any repo the App happens to have JWT-level visibility into) —
    // the authoritative "is this repo really reachable" check.
    const accessible = await octokit.paginate(octokit.rest.apps.listReposAccessibleToInstallation, { per_page: 100 });
    const match = accessible.find((r: any) => r.owner.login === owner && r.name === repo);
    if (!match) {
      return NextResponse.json({ error: "repo_not_accessible", message: "That repository isn't accessible to this GitHub App installation." }, { status: 403 });
    }

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: {
        githubInstallationId: installation.id,
        repoOwner: owner,
        repoName: repo,
        defaultBranch: match.default_branch,
        // Reset any stale sync state from a previous connection to a
        // different repo — this connection has no sync history yet.
        workingBranch: null,
        lastSyncedSha: null,
        lastSyncedAt: null,
        syncStatus: null,
        lastSyncError: null,
      },
      select: { id: true, repoOwner: true, repoName: true, defaultBranch: true, workingBranch: true, syncStatus: true },
    });

    return NextResponse.json({ project: updated });
  } catch (e: any) {
    if (e?.status === 404 || e?.status === 403) {
      return NextResponse.json({ error: "repo_not_accessible", message: "That repository isn't accessible to this GitHub App installation." }, { status: 403 });
    }
    return NextResponse.json({ error: "github_api_error", message: e?.message || "Failed to connect repository" }, { status: 502 });
  }
}
