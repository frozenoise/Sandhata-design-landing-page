import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/github/disconnect { projectId } — clears the repo link on a
// project. Does not touch the GitHub-side installation (the App stays
// installed; other projects may still use it) and does not delete the
// branch/commits already pushed to the repo — this is a Sandhata-side
// unlink only. Doesn't require GITHUB_APP_ID etc. to be configured since
// it's a pure DB write with no GitHub API call.
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const { projectId } = body || {};
  if (!projectId) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const project = await prisma.project.findFirst({ where: { id: projectId, userId: session.user.id }, select: { id: true } });
  if (!project) return NextResponse.json({ error: "project_not_found" }, { status: 404 });

  await prisma.project.update({
    where: { id: projectId },
    data: {
      githubInstallationId: null,
      repoOwner: null,
      repoName: null,
      defaultBranch: null,
      workingBranch: null,
      lastSyncedSha: null,
      lastSyncedAt: null,
      syncStatus: null,
      lastSyncError: null,
    },
  });

  return NextResponse.json({ ok: true });
}
