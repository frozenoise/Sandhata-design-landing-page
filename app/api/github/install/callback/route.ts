import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isGitHubAppConfigured, verifyInstallState, getInstallationAccount } from "@/lib/github";

// GET /api/github/install/callback — GitHub redirects here after the user
// installs/authorizes the App, with `installation_id`, `setup_action`
// ("install" | "update" | "request"), and the `state` we signed in
// /api/github/install. Always resolves by redirecting back into /builder
// (never a bare JSON error page) so the user lands somewhere useful whether
// this succeeded or not — the outcome is carried as a query param the
// builder UI reads once and clears.
function redirectToBuilder(req: Request, params: Record<string, string>) {
  const url = new URL("/builder", req.url);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return NextResponse.redirect(url);
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return redirectToBuilder(req, { github_error: "unauthenticated" });

  if (!isGitHubAppConfigured()) {
    return redirectToBuilder(req, { github_error: "not_configured" });
  }

  const { searchParams } = new URL(req.url);
  const installationIdRaw = searchParams.get("installation_id");
  const state = searchParams.get("state");
  const setupAction = searchParams.get("setup_action");

  if (setupAction === "request") {
    // Installation requires org-owner approval — nothing to persist yet.
    return redirectToBuilder(req, { github_error: "install_requested" });
  }

  const installationId = installationIdRaw ? Number(installationIdRaw) : NaN;
  if (!Number.isFinite(installationId)) {
    return redirectToBuilder(req, { github_error: "missing_installation_id" });
  }

  const verified = verifyInstallState(state);
  if (!verified || verified.userId !== session.user.id) {
    return redirectToBuilder(req, { github_error: "invalid_state" });
  }

  try {
    const account = await getInstallationAccount(installationId);
    if (!account) return redirectToBuilder(req, { github_error: "installation_not_found" });

    const installation = await prisma.gitHubInstallation.upsert({
      where: { installationId },
      // If this installationId was previously linked to a different
      // Sandhata user (e.g. re-installed under a shared org account by a
      // teammate), the most recent linker wins — same "last write wins"
      // simplicity as the rest of Phase 1's single-repo, single-commit scope.
      update: { userId: session.user.id, accountLogin: account.login, accountType: account.type },
      create: {
        userId: session.user.id,
        installationId,
        accountLogin: account.login,
        accountType: account.type,
      },
    });

    return redirectToBuilder(req, {
      github: "connected",
      installationId: String(installation.installationId),
      ...(verified.projectId ? { connectProject: verified.projectId } : {}),
    });
  } catch (e: any) {
    return redirectToBuilder(req, { github_error: "callback_failed" });
  }
}
