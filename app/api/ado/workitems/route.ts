import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decryptSecret } from "@/lib/crypto";
import { AdoApiError, createWorkItem, workItemWebUrl, builderStatusForState, type StateMappingForType } from "@/lib/ado";

// POST /api/ado/workitems — create-or-link a work item for a builder entity.
// body { projectId, builderItemId, builderItemKind, title, description? }
//
// Phase 1 only produces links for builderItemKind "project" | "page" — any
// other kind still works end-to-end (falls back to typeMapping.default) but
// nothing in the UI sends one yet, ahead of real task/RAID entities.
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const projectId = typeof body?.projectId === "string" ? body.projectId : "";
  const builderItemId = typeof body?.builderItemId === "string" ? body.builderItemId : "";
  const builderItemKind = typeof body?.builderItemKind === "string" ? body.builderItemKind : "";
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const description = typeof body?.description === "string" ? body.description : undefined;

  if (!projectId || !builderItemId || !builderItemKind || !title) {
    return NextResponse.json({ error: "bad_request", message: "projectId, builderItemId, builderItemKind, and title are all required." }, { status: 400 });
  }

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id },
    select: { id: true },
  });
  if (!project) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const conn = await prisma.adoConnection.findUnique({ where: { projectId } });
  if (!conn || !conn.active || !conn.patEnc) {
    return NextResponse.json({ error: "not_connected", message: "This project isn't connected to Azure DevOps yet." }, { status: 400 });
  }

  // Create-or-link: if this exact builder item already has a link under this
  // connection, return it instead of creating a duplicate ADO work item.
  const existingLink = await prisma.workItemLink.findFirst({
    where: { connectionId: conn.id, builderItemId, builderItemKind },
  });
  if (existingLink) {
    return NextResponse.json({ link: existingLink, created: false });
  }

  const typeMapping = conn.typeMapping as Record<string, string>;
  const stateMapping = conn.stateMapping as Record<string, StateMappingForType>;
  const type = typeMapping[builderItemKind] || typeMapping.default;
  if (!type) {
    return NextResponse.json({ error: "no_type_mapping", message: `No Azure DevOps work item type mapped for "${builderItemKind}".` }, { status: 400 });
  }
  const stateMappingForType = stateMapping[type];

  try {
    const pat = decryptSecret(conn.patEnc);
    const created = await createWorkItem(conn.organization, conn.adoProject, pat, type, { title, description });

    const link = await prisma.workItemLink.create({
      data: {
        connectionId: conn.id,
        builderSessionId: builderItemKind === "page" ? builderItemId : null,
        builderItemId,
        builderItemKind,
        adoWorkItemId: created.id,
        adoWorkItemType: type,
        adoUrl: workItemWebUrl(conn.organization, conn.adoProject, created.id),
        lastKnownState: created.state || "Unknown",
        lastKnownCategory: stateMappingForType ? builderStatusForState(stateMappingForType, created.state) : null,
        lastSyncedAt: new Date(),
      },
    });

    return NextResponse.json({ link, created: true }, { status: 201 });
  } catch (e) {
    if (e instanceof AdoApiError) {
      return NextResponse.json({ error: "ado_error", message: e.adoMessage || e.message }, { status: 502 });
    }
    return NextResponse.json({ error: "create_failed", message: e instanceof Error ? e.message : "Failed to create the work item." }, { status: 502 });
  }
}
