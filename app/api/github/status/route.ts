import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isGitHubAppConfigured, getInstallationOctokit } from "@/lib/github";

// GET /api/github/status?projectId=... — cheap ahead/behind check: compares
// Project.lastSyncedSha against the working branch's current head SHA on
// GitHub. Phase 1 has no pull/manifest, so this can only tell you "someone
// (or something) has moved the branch since our last push" (behind) — it
// can't yet tell you what changed or merge it back. That's Phase 2 scope.
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");
  if (!projectId) return NextResponse.json({ error: "bad_request", message: "projectId is required" }, { status: 400 });

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id },
    select: {
      repoOwner: true, repoName: true, workingBranch: true, defaultBranch: true,
      lastSyncedSha: true, lastSyncedAt: true, syncStatus: true, lastSyncError: true,
      githubInstallation: { select: { installationId: true } },
    },
  });
  if (!project) return NextResponse.json({ error: "project_not_found" }, { status: 404 });

  if (!project.repoOwner || !project.repoName || !project.githubInstallation) {
    return NextResponse.json({ connected: false });
  }

  if (!isGitHubAppConfigured()) {
    return NextResponse.json({ error: "github_app_not_configured" }, { status: 501 });
  }

  const branch = project.workingBranch || project.defaultBranch;
  if (!branch) {
    // Connected but never pushed yet — no branch to compare against.
    return NextResponse.json({
      connected: true, repoOwner: project.repoOwner, repoName: project.repoName,
      syncStatus: project.syncStatus, lastSyncedAt: project.lastSyncedAt, lastSyncError: project.lastSyncError,
      ahead: null, behind: null,
    });
  }

  try {
    const octokit = await getInstallationOctokit(project.githubInstallation.installationId);
    const { data: ref } = await octokit.rest.git.getRef({
      owner: project.repoOwner, repo: project.repoName, ref: `heads/${branch}`,
    });
    const remoteSha = ref.object.sha;
    const behind = !!project.lastSyncedSha && project.lastSyncedSha !== remoteSha;

    return NextResponse.json({
      connected: true,
      repoOwner: project.repoOwner,
      repoName: project.repoName,
      workingBranch: branch,
      remoteSha,
      lastSyncedSha: project.lastSyncedSha,
      syncStatus: project.syncStatus,
      lastSyncedAt: project.lastSyncedAt,
      lastSyncError: project.lastSyncError,
      // "behind" here means the branch moved on GitHub since our last push
      // (someone pushed directly, or force-pushed) — not a real 3-way diff.
      behind,
    });
  } catch (e: any) {
    if (e?.status === 404) {
      // Branch doesn't exist on GitHub yet (never pushed) — not an error.
      return NextResponse.json({
        connected: true, repoOwner: project.repoOwner, repoName: project.repoName,
        workingBranch: branch, syncStatus: project.syncStatus, lastSyncedAt: project.lastSyncedAt,
        lastSyncError: project.lastSyncError, ahead: null, behind: null, branchExists: false,
      });
    }
    return NextResponse.json({ error: "github_api_error", message: e?.message || "Failed to check status" }, { status: 502 });
  }
}
