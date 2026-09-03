import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decryptSecret } from "@/lib/crypto";
import { AdoApiError, getWorkItemsBatch, builderStatusForState, type StateMappingForType } from "@/lib/ado";

// GET /api/ado/workitems/sync?projectId= — on-load reconciliation: batch
// GET every WorkItemLink under this project's connection and refresh the
// cached state. Returns the updated list (does not fail the whole request
// if ADO is unreachable — it returns the cached links with a top-level
// error note instead, since a reconciliation failure shouldn't block the
// rest of the builder UI from rendering).
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const projectId = new URL(req.url).searchParams.get("projectId");
  if (!projectId) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id },
    select: { id: true },
  });
  if (!project) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const conn = await prisma.adoConnection.findUnique({
    where: { projectId },
    include: { workItemLinks: true },
  });
  if (!conn || !conn.active || !conn.patEnc) {
    return NextResponse.json({ links: [], connected: false });
  }

  if (conn.workItemLinks.length === 0) {
    return NextResponse.json({ links: [], connected: true });
  }

  try {
    const pat = decryptSecret(conn.patEnc);
    const ids = conn.workItemLinks.map(l => l.adoWorkItemId);
    const remote = await getWorkItemsBatch(conn.organization, conn.adoProject, pat, ids);
    const remoteById = new Map(remote.map(w => [w.id, w]));
    const stateMapping = conn.stateMapping as Record<string, StateMappingForType>;

    const updated = await Promise.all(
      conn.workItemLinks.map(async link => {
        const fresh = remoteById.get(link.adoWorkItemId);
        if (!fresh) {
          // Work item no longer visible (deleted/moved) — leave the cached
          // row as-is but flag it rather than guessing.
          return prisma.workItemLink.update({
            where: { id: link.id },
            data: { lastSyncError: "Work item not found in Azure DevOps (deleted or moved?)." },
          });
        }
        const stateMappingForType = stateMapping[link.adoWorkItemType];
        return prisma.workItemLink.update({
          where: { id: link.id },
          data: {
            lastKnownState: fresh.state,
            lastKnownCategory: stateMappingForType ? builderStatusForState(stateMappingForType, fresh.state) : null,
            lastSyncedAt: new Date(),
            lastSyncError: null,
          },
        });
      })
    );

    return NextResponse.json({ links: updated, connected: true });
  } catch (e) {
    const message = e instanceof AdoApiError ? (e.adoMessage || e.message) : (e instanceof Error ? e.message : "Failed to reach Azure DevOps.");
    return NextResponse.json({ links: conn.workItemLinks, connected: true, syncError: message });
  }
}
