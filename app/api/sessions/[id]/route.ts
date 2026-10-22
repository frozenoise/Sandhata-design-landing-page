import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sessionRole, projectRole, canEdit, isShared } from "@/lib/access";

type Params = { params: Promise<{ id: string }> };

// GET /api/sessions/:id — load full session (messages + tree)
export async function GET(_req: Request, props: Params) {
  const params = await props.params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const { role, projectId } = await sessionRole(session.user.id, params.id);
  if (!role) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const record = await prisma.builderSession.findUnique({ where: { id: params.id } });
  if (!record) return NextResponse.json({ error: "not_found" }, { status: 404 });

  // `role` decides whether the page opens editable or view-only; `live`
  // tells the builder to open its Liveblocks room (common workspace).
  // `live` additionally needs Liveblocks configured on this deployment;
  // without it a shared page still works, just without live co-editing.
  const shared = projectId ? await isShared(projectId) : false;
  const live = shared && !!process.env.LIVEBLOCKS_SECRET_KEY;
  return NextResponse.json({ session: record, access: { role, shared, live } });
}

// PATCH /api/sessions/:id — update messages + tree (auto-save), or move the
// session into a different project / ungroup it (projectId: null).
export async function PATCH(req: Request, props: Params) {
  const params = await props.params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const body = await req.json();
  const { messages, tree, name, projectId } = body;

  const { role } = await sessionRole(session.user.id, params.id);
  if (!role) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!canEdit(role)) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  // Moving a page between projects (or out of one) is for the page's owner
  // or the project owner only — an editor can change a shared page's content
  // but not take it out of the shared project. The target must be a project
  // the caller can edit; `projectId: null` (ungroup) needs no target check.
  if (projectId !== undefined) {
    if (role !== "owner") return NextResponse.json({ error: "forbidden" }, { status: 403 });
    if (projectId !== null && !canEdit(await projectRole(session.user.id, projectId))) {
      return NextResponse.json({ error: "project_not_found" }, { status: 404 });
    }
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
export async function DELETE(_req: Request, props: Params) {
  const params = await props.params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  // Only the page's creator or the project owner can delete a page.
  const { role } = await sessionRole(session.user.id, params.id);
  if (!role) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (role !== "owner") return NextResponse.json({ error: "forbidden" }, { status: 403 });

  await prisma.builderSession.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
