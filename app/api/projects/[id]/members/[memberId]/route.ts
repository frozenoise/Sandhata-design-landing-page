import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { projectRole, MEMBER_ROLES } from "@/lib/access";

type Params = { params: Promise<{ id: string; memberId: string }> };

// :memberId is either a ProjectMember id or a ProjectInvite id (pending), so
// the share dialog can treat both kinds of row the same way.

// PATCH /api/projects/:id/members/:memberId — owner changes a role.
export async function PATCH(req: Request, props: Params) {
  const params = await props.params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  if ((await projectRole(session.user.id, params.id)) !== "owner") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const role = String(body.role ?? "");
  if (!(MEMBER_ROLES as readonly string[]).includes(role)) {
    return NextResponse.json({ error: "invalid_role" }, { status: 400 });
  }

  const m = await prisma.projectMember.updateMany({ where: { id: params.memberId, projectId: params.id }, data: { role } });
  if (m.count === 0) {
    const i = await prisma.projectInvite.updateMany({ where: { id: params.memberId, projectId: params.id }, data: { role } });
    if (i.count === 0) return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

// DELETE /api/projects/:id/members/:memberId — the owner removes anyone;
// a member can remove themselves ("Leave project").
export async function DELETE(_req: Request, props: Params) {
  const params = await props.params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const role = await projectRole(session.user.id, params.id);
  if (!role) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const member = await prisma.projectMember.findFirst({ where: { id: params.memberId, projectId: params.id }, select: { userId: true } });
  const isSelf = member?.userId === session.user.id;
  if (role !== "owner" && !isSelf) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  if (member) {
    await prisma.projectMember.delete({ where: { id: params.memberId } });
    return NextResponse.json({ ok: true });
  }
  const i = await prisma.projectInvite.deleteMany({ where: { id: params.memberId, projectId: params.id } });
  if (i.count === 0) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
