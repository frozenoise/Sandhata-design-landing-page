import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { encryptSecret } from "@/lib/crypto";
import {
  AdoApiError,
  listWorkItemTypes,
  listWorkItemTypeStates,
  pickDefaultWorkItemType,
  buildStateMapping,
} from "@/lib/ado";

// GET /api/ado/connect?projectId= — connection status only, never the PAT.
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
    select: { organization: true, adoProject: true, lastValidatedAt: true, active: true, patEnc: true },
  });

  if (!conn || !conn.active || !conn.patEnc) {
    return NextResponse.json({ connected: false });
  }

  return NextResponse.json({
    connected: true,
    organization: conn.organization,
    adoProject: conn.adoProject,
    lastValidatedAt: conn.lastValidatedAt,
  });
}

// POST /api/ado/connect — body { projectId, organization, adoProject, pat }
// Validates the PAT against a cheap ADO endpoint, derives the Phase-1
// default type/state mapping, encrypts the PAT, and upserts the connection.
// Refuses to save anything if the PAT doesn't check out.
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const projectId = typeof body?.projectId === "string" ? body.projectId : "";
  const organization = typeof body?.organization === "string" ? body.organization.trim() : "";
  const adoProject = typeof body?.adoProject === "string" ? body.adoProject.trim() : "";
  const pat = typeof body?.pat === "string" ? body.pat.trim() : "";

  if (!projectId || !organization || !adoProject || !pat) {
    return NextResponse.json({ error: "bad_request", message: "projectId, organization, adoProject, and pat are all required." }, { status: 400 });
  }

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id },
    select: { id: true },
  });
  if (!project) return NextResponse.json({ error: "not_found" }, { status: 404 });

  try {
    // Validate the PAT + discover real work item types in one call.
    const types = await listWorkItemTypes(organization, adoProject, pat);
    const defaultType = pickDefaultWorkItemType(types);
    const states = await listWorkItemTypeStates(organization, adoProject, pat, defaultType.name);
    const stateMappingForType = buildStateMapping(states);

    const typeMapping = {
      project: defaultType.name,
      page: defaultType.name,
      default: defaultType.name,
    };
    const stateMapping = {
      [defaultType.name]: stateMappingForType,
    };

    const conn = await prisma.adoConnection.upsert({
      where: { projectId },
      create: {
        projectId,
        organization,
        adoProject,
        patEnc: encryptSecret(pat),
        active: true,
        connectedByUserId: session.user.id,
        typeMapping,
        stateMapping,
        lastValidatedAt: new Date(),
      },
      update: {
        organization,
        adoProject,
        patEnc: encryptSecret(pat),
        active: true,
        connectedByUserId: session.user.id,
        typeMapping,
        stateMapping,
        lastValidatedAt: new Date(),
      },
      select: { organization: true, adoProject: true, lastValidatedAt: true },
    });

    return NextResponse.json({ connected: true, ...conn });
  } catch (e) {
    if (e instanceof AdoApiError) {
      return NextResponse.json(
        { error: "ado_error", message: e.adoMessage || e.message, status: e.status },
        { status: e.status === 401 || e.status === 403 ? 401 : 502 }
      );
    }
    return NextResponse.json(
      { error: "connect_failed", message: e instanceof Error ? e.message : "Failed to connect to Azure DevOps." },
      { status: 502 }
    );
  }
}

// DELETE /api/ado/connect?projectId= — soft-disconnect: null out the PAT and
// flip `active` off, but keep the row (and its WorkItemLink history) so
// reconnecting later doesn't orphan already-linked work items.
export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const projectId = new URL(req.url).searchParams.get("projectId");
  if (!projectId) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id },
    select: { id: true },
  });
  if (!project) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const existing = await prisma.adoConnection.findUnique({ where: { projectId }, select: { id: true } });
  if (!existing) return NextResponse.json({ connected: false });

  await prisma.adoConnection.update({
    where: { projectId },
    data: { patEnc: null, active: false },
  });

  return NextResponse.json({ connected: false });
}
