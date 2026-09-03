import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isGitHubAppConfigured } from "@/lib/github";

// GET /api/github/installations — list this user's saved GitHub App
// installations (accountLogin/accountType only — no token minted here).
// Not called out as its own route in the original plan, but the repo-picker
// UI ("if one exists, shows a repo picker") needs a way to discover an
// existing installationId across visits/projects without re-running the
// install flow each time — this is the minimal read that makes that
// possible. See HANDOFF note in the final report for why this was added.
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  if (!isGitHubAppConfigured()) {
    return NextResponse.json({ error: "github_app_not_configured" }, { status: 501 });
  }

  const installations = await prisma.gitHubInstallation.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, installationId: true, accountLogin: true, accountType: true },
  });

  return NextResponse.json({ installations });
}
