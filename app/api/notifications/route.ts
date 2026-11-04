import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { claimInvites } from "@/lib/access";

// GET /api/notifications - projects other people have shared with the caller,
// newest first, for the builder's notification bell. Each membership row is
// one "X invited you to edit Y" item, unread until ProjectMember.seenAt is set
// (PATCH below), so read state follows the account across devices. Pending
// invites are claimed first, so someone who signs in with an invited address
// sees the invite on their very first load.
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  const userId = session.user.id;

  await claimInvites(userId, session.user.email);

  const memberships = await prisma.projectMember.findMany({
    where: { userId, addedById: { not: userId }, project: { deletedAt: null } },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      role: true,
      createdAt: true,
      seenAt: true,
      addedById: true,
      project: { select: { id: true, name: true } },
    },
  });

  const inviterIds = [...new Set(memberships.map(m => m.addedById))];
  const inviters = await prisma.user.findMany({
    where: { id: { in: inviterIds } },
    select: { id: true, name: true, email: true, image: true },
  });
  const byId = new Map(inviters.map(u => [u.id, u]));

  return NextResponse.json({
    notifications: memberships.map(m => {
      const by = byId.get(m.addedById);
      return {
        id: m.id,
        projectId: m.project.id,
        projectName: m.project.name,
        role: m.role,
        createdAt: m.createdAt,
        seen: m.seenAt !== null,
        invitedBy: { name: by?.name ?? null, email: by?.email ?? null, image: by?.image ?? null },
      };
    }),
  });
}

// PATCH /api/notifications { ids } - marks the caller's own notifications
// (membership ids) as seen. Ids belonging to anyone else are ignored.
export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const ids = Array.isArray(body.ids) ? body.ids.filter((x: unknown): x is string => typeof x === "string").slice(0, 100) : [];
  if (ids.length === 0) return NextResponse.json({ updated: 0 });

  const { count } = await prisma.projectMember.updateMany({
    where: { id: { in: ids }, userId: session.user.id, seenAt: null },
    data: { seenAt: new Date() },
  });
  return NextResponse.json({ updated: count });
}
