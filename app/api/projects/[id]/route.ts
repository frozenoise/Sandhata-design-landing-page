import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

// GET /api/projects/:id — project + its sessions (id/name/updatedAt only,
// same shape as /api/sessions' list — the sidebar loads full session content
// lazily via /api/sessions/:id, same as it does today for ungrouped ones)
export async function GET(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const project = await prisma.project.findFirst({
    where: { id: params.id, userId: session.user.id },
    include: {
      sessions: {
        orderBy: { updatedAt: "desc" },
        select: { id: true, name: true, createdAt: true, updatedAt: true },
      },
    },
  });
  if (!project) return NextResponse.json({ error: "not_found" }, { status: 404 });

  return NextResponse.json({ project });
}

// PATCH /api/projects/:id — rename a project
export async function PATCH(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const body = await req.json();
  const { name } = body;
  if (!name || !String(name).trim()) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const existing = await prisma.project.findFirst({
    where: { id: params.id, userId: session.user.id },
    select: { id: true },
  });
  if (!existing) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const updated = await prisma.project.update({
    where: { id: params.id },
    data: { name: String(name).trim().slice(0, 120) },
    select: { id: true, name: true, updatedAt: true },
  });

  return NextResponse.json({ project: updated });
}

// DELETE /api/projects/:id — delete a project AND the sessions inside it
// (folder semantics — see the cascade comment on the Prisma relation).
export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const existing = await prisma.project.findFirst({
    where: { id: params.id, userId: session.user.id },
    select: { id: true },
  });
  if (!existing) return NextResponse.json({ error: "not_found" }, { status: 404 });

  await prisma.project.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
