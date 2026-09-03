import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

// GET /api/sessions/:id — load full session (messages + tree)
export async function GET(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const record = await prisma.builderSession.findFirst({
    where: { id: params.id, userId: session.user.id },
  });
  if (!record) return NextResponse.json({ error: "not_found" }, { status: 404 });

  return NextResponse.json({ session: record });
}

// PATCH /api/sessions/:id — update messages + tree (auto-save), or move the
// session into a different project / ungroup it (projectId: null).
export async function PATCH(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const body = await req.json();
  const { messages, tree, name, projectId } = body;

  const existing = await prisma.builderSession.findFirst({
    where: { id: params.id, userId: session.user.id },
    select: { id: true },
  });
  if (!existing) return NextResponse.json({ error: "not_found" }, { status: 404 });

  // Same ownership check as POST /api/sessions — `projectId: null` (ungroup)
  // is always allowed since it's not pointing at anyone's project.
  if (projectId !== undefined && projectId !== null) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: session.user.id },
      select: { id: true },
    });
    if (!project) return NextResponse.json({ error: "project_not_found" }, { status: 404 });
  }

  const updated = await prisma.builderSession.update({
    where: { id: params.id },
    data: {
      ...(messages !== undefined && { messages }),
      ...(tree !== undefined && { tree }),
      ...(name !== undefined && { name: String(name).slice(0, 120) }),
      ...(projectId !== undefined && { projectId }),
    },
    select: { id: true, name: true, updatedAt: true, projectId: true },
  });

  return NextResponse.json({ session: updated });
}

// DELETE /api/sessions/:id — remove a session
export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const existing = await prisma.builderSession.findFirst({
    where: { id: params.id, userId: session.user.id },
    select: { id: true },
  });
  if (!existing) return NextResponse.json({ error: "not_found" }, { status: 404 });

  await prisma.builderSession.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
