import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isGitHubAppConfigured } from "@/lib/github";

// GET /api/github/config — lets the builder UI know whether the GitHub App
// has been registered yet (env vars set) *before* rendering an interactive
// "Connect GitHub" button, so the disabled/"not available" state is driven
// by a real check instead of the button just failing when clicked.
// Not sensitive (a single boolean) but still auth-gated for consistency with
// every other route under app/api/github/**.
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  return NextResponse.json({ configured: isGitHubAppConfigured() });
}
