import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decryptSecret } from "@/lib/crypto";
import { AdoApiError, updateWorkItemState, type BuilderStatus, type StateMappingForType } from "@/lib/ado";

type Params = { params: { linkId: string } };

const VALID_STATUSES: BuilderStatus[] = ["new", "in_progress", "completed"];

// PATCH /api/ado/workitems/:linkId/status — body { status: "new" | "in_progress" | "completed" }
// Resolves through the connection's cached stateMapping (never a literal ADO
// state name) and does the real PATCH to Azure DevOps. On an ADO validation
// error (e.g. an illegal state transition for that work item's workflow),
// the ADO message is passed straight through rather than swallowed.
export async function PATCH(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const status = body?.status as BuilderStatus | undefined;
  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "bad_request", message: `status must be one of: ${VALID_STATUSES.join(", ")}` }, { status: 400 });
  }

  const link = await prisma.workItemLink.findFirst({
    where: { id: params.linkId, connection: { project: { userId: session.user.id } } },
    include: { connection: true },
  });
  if (!link) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const conn = link.connection;
  if (!conn.active || !conn.patEnc) {
    return NextResponse.json({ error: "not_connected", message: "This project's Azure DevOps connection is disconnected." }, { status: 400 });
  }

  const stateMapping = conn.stateMapping as Record<string, StateMappingForType>;
  const stateMappingForType = stateMapping[link.adoWorkItemType];
  const targetState = stateMappingForType?.[status];
  if (!targetState) {
    return NextResponse.json(
      { error: "no_state_mapping", message: `No Azure DevOps state mapped for "${status}" on work item type "${link.adoWorkItemType}".` },
      { status: 400 }
    );
  }

  try {
    const pat = decryptSecret(conn.patEnc);
    const result = await updateWorkItemState(conn.organization, conn.adoProject, pat, link.adoWorkItemId, targetState);

    const updated = await prisma.workItemLink.update({
      where: { id: link.id },
      data: {
        lastKnownState: result.state || targetState,
        lastKnownCategory: status,
        lastSyncedAt: new Date(),
        lastSyncError: null,
      },
    });

    return NextResponse.json({ link: updated });
  } catch (e) {
    const message = e instanceof AdoApiError ? (e.adoMessage || e.message) : (e instanceof Error ? e.message : "Failed to update Azure DevOps.");

    // Record the failed attempt so on-load reconciliation / the UI can show
    // it wasn't silently dropped, without touching lastKnownState (the ADO
    // side didn't actually change).
    await prisma.workItemLink.update({
      where: { id: link.id },
      data: { lastSyncError: message },
    }).catch(() => {});

    if (e instanceof AdoApiError) {
      return NextResponse.json({ error: "ado_error", message }, { status: 502 });
    }
    return NextResponse.json({ error: "update_failed", message }, { status: 502 });
  }
}
