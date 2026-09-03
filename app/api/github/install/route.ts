import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isGitHubAppConfigured, githubAppSlug, signInstallState } from "@/lib/github";

// GET /api/github/install — kicks off the GitHub App install/authorize flow.
// This is a full-page navigation target (the UI does `window.location.href =
// "/api/github/install"`, not a fetch), since it has to end with the browser
// on github.com. Optional ?projectId=... is folded into the signed state so
// /api/github/install/callback can redirect the user straight back into that
// project's repo picker instead of a generic "connected" landing.
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/builder", req.url));
  }

  if (!isGitHubAppConfigured()) {
    // Defensive fallback — the UI is expected to check /api/github/config and
    // disable this entry point before it's ever clicked, so reaching here
    // means either a stale UI or a direct hit. JSON is fine for that case.
    return NextResponse.json(
      { error: "github_app_not_configured", message: "GitHub integration isn't set up yet." },
      { status: 501 }
    );
  }

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId") || undefined;
  const state = signInstallState(session.user.id, projectId);

  const installUrl = new URL(`https://github.com/apps/${githubAppSlug()}/installations/new`);
  installUrl.searchParams.set("state", state);

  return NextResponse.redirect(installUrl);
}
