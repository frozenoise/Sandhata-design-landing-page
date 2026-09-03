import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isGitHubAppConfigured, getInstallationOctokit } from "@/lib/github";

// GET /api/github/repos?installationId=123 — list repos accessible to a
// GitHub App installation (GET /installation/repositories), using a
// minted installation token. installationId must belong to the caller —
// never trust it to imply access on its own.
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  if (!isGitHubAppConfigured()) {
    return NextResponse.json({ error: "github_app_not_configured" }, { status: 501 });
  }

  const { searchParams } = new URL(req.url);
  const installationIdRaw = searchParams.get("installationId");
  const installationId = installationIdRaw ? Number(installationIdRaw) : NaN;
  if (!Number.isFinite(installationId)) {
    return NextResponse.json({ error: "bad_request", message: "installationId is required" }, { status: 400 });
  }

  const owned = await prisma.gitHubInstallation.findFirst({
    where: { installationId, userId: session.user.id },
    select: { id: true },
  });
  if (!owned) return NextResponse.json({ error: "not_found" }, { status: 404 });

  try {
    const octokit = await getInstallationOctokit(installationId);
    const repos = await octokit.paginate(octokit.rest.apps.listReposAccessibleToInstallation, { per_page: 100 });
    return NextResponse.json({
      repos: repos.map((r: any) => ({
        id: r.id,
        owner: r.owner.login,
        name: r.name,
        fullName: r.full_name,
        private: r.private,
        defaultBranch: r.default_branch,
      })),
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "github_api_error", message: e?.message || "Failed to list repositories" },
      { status: 502 }
    );
  }
}
