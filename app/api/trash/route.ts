import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { purgeExpiredTrash, purgeAfter } from "@/lib/trash";

// The builder's Trash: projects and pages the caller deleted in the last 30
// days. Only owners see and act on them - a project's owner, or a page's
// creator / its project's owner, the same people who could delete them.
// Pages inside a trashed project aren't listed separately; they come back
// with the project.

async function ownedTrash(userId: string) {
  const [projects, sessions] = await Promise.all([
    prisma.project.findMany({
      where: { userId, deletedAt: { not: null } },
      orderBy: { deletedAt: "desc" },
      select: { id: true, name: true, deletedAt: true, _count: { select: { sessions: true } } },
    }),
    prisma.builderSession.findMany({
      where: {
        deletedAt: { not: null },
        OR: [{ projectId: null }, { project: { deletedAt: null } }],
        AND: [{ OR: [{ userId }, { project: { userId } }] }],
      },
      orderBy: { deletedAt: "desc" },
      select: { id: true, name: true, deletedAt: true, project: { select: { id: true, name: true } } },
    }),
  ]);
  return { projects, sessions };
}

// GET /api/trash - what's in the caller's Trash, with when each item goes for good
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  await purgeExpiredTrash();
  const { projects, sessions } = await ownedTrash(session.user.id);
  return NextResponse.json({
    projects: projects.map(p => ({ id: p.id, name: p.name, deletedAt: p.deletedAt, purgeAt: purgeAfter(p.deletedAt!), pageCount: p._count.sessions })),
    pages: sessions.map(s => ({ id: s.id, name: s.name, deletedAt: s.deletedAt, purgeAt: purgeAfter(s.deletedAt!), projectId: s.project?.id ?? null, projectName: s.project?.name ?? null })),
  });
}

async function findOwned(userId: string, kind: string, id: string) {
  if (kind === "project") {
    return prisma.project.findFirst({ where: { id, userId, deletedAt: { not: null } }, select: { id: true } });
  }
  if (kind === "page") {
    return prisma.builderSession.findFirst({
      where: { id, deletedAt: { not: null }, OR: [{ userId }, { project: { userId } }] },
      select: { id: true },
    });
  }
  return null;
}

// POST /api/trash { kind: "project" | "page", id } - restore it
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const kind = String(body.kind ?? ""), id = String(body.id ?? "");

  if (!(await findOwned(session.user.id, kind, id))) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (kind === "project") await prisma.project.update({ where: { id }, data: { deletedAt: null } });
  else await prisma.builderSession.update({ where: { id }, data: { deletedAt: null } });
  return NextResponse.json({ ok: true });
}

// DELETE /api/trash?kind=project|page&id=… - delete it permanently now
export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  const url = new URL(req.url);
  const kind = url.searchParams.get("kind") ?? "", id = url.searchParams.get("id") ?? "";

  if (!(await findOwned(session.user.id, kind, id))) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (kind === "project") await prisma.project.delete({ where: { id } });
  else await prisma.builderSession.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
