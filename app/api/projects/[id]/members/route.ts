import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { projectRole, MEMBER_ROLES } from "@/lib/access";

type Params = { params: Promise<{ id: string }> };

// GET /api/projects/:id/members - everyone with access to the project: the
// owner, members, and pending invites (emails with no account yet). Any
// member can see the list; only the owner can change it.
export async function GET(_req: Request, props: Params) {
  const params = await props.params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const role = await projectRole(session.user.id, params.id);
  if (!role) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    select: {
      user: { select: { id: true, name: true, email: true, image: true } },
      members: { orderBy: { createdAt: "asc" }, select: { id: true, role: true, user: { select: { id: true, name: true, email: true, image: true } } } },
      invites: { orderBy: { createdAt: "asc" }, select: { id: true, email: true, role: true } },
    },
  });
  if (!project) return NextResponse.json({ error: "not_found" }, { status: 404 });

  return NextResponse.json({
    role,
    owner: project.user,
    // Membership id last: spreading m.user first would otherwise overwrite it
    // with the user's id, and the dialog uses this id to change or remove access.
    members: project.members.map(m => ({ ...m.user, userId: m.user.id, id: m.id, role: m.role })),
    invites: project.invites,
  });
}

// POST /api/projects/:id/members - owner adds someone by email. If they
// already have an account they become a member straight away; otherwise a
// pending invite is stored and claimed when they first sign in with it.
export async function POST(req: Request, props: Params) {
  const params = await props.params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  if ((await projectRole(session.user.id, params.id)) !== "owner") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const email = String(body.email ?? "").trim().toLowerCase();
  const role = String(body.role ?? "editor");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }
  if (!(MEMBER_ROLES as readonly string[]).includes(role)) {
    return NextResponse.json({ error: "invalid_role" }, { status: 400 });
  }

  const user = await prisma.user.findFirst({ where: { email: { equals: email, mode: "insensitive" } }, select: { id: true } });
  if (user?.id === session.user.id) return NextResponse.json({ error: "is_owner" }, { status: 400 });

  if (user) {
    await prisma.projectMember.upsert({
      where: { projectId_userId: { projectId: params.id, userId: user.id } },
      create: { projectId: params.id, userId: user.id, role, addedById: session.user.id },
      update: { role },
    });
    return NextResponse.json({ status: "added" }, { status: 201 });
  }

  await prisma.projectInvite.upsert({
    where: { projectId_email: { projectId: params.id, email } },
    create: { projectId: params.id, email, role, invitedById: session.user.id },
    update: { role },
  });
  return NextResponse.json({ status: "invited" }, { status: 201 });
}
