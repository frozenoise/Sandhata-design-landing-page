import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { accessibleProjectIds, projectRole, canEdit } from "@/lib/access";

// GET /api/sessions - list the user's builder sessions plus every page in a
// project shared with them (most recent first). Includes projectId so the
// sidebar can group ungrouped-vs-in-project without a second request.
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const projectIds = await accessibleProjectIds(session.user.id);
  const sessions = await prisma.builderSession.findMany({
    // Own ungrouped pages, plus every page in a project the user can access.
    // (Not "every page I created": a page in a project I was removed from
    // belongs to that project now.)
    where: { deletedAt: null, OR: [{ userId: session.user.id, projectId: null }, { projectId: { in: projectIds } }] },
    orderBy: { updatedAt: "desc" },
    take: 100,
    select: { id: true, name: true, createdAt: true, updatedAt: true, projectId: true },
  });

  return NextResponse.json({ sessions });
}

// POST /api/sessions - create a new builder session, optionally inside a
// project (folder). projectId is verified against the caller's role (owner or
// editor) - a session can't be created inside a project they can't edit via a
// guessed id.
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const body = await req.json();
  const { name, messages, tree, projectId } = body;
  if (!name || !messages) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  if (projectId) {
    // Owners and editors can add pages to a project; viewers can't.
    const role = await projectRole(session.user.id, projectId);
    if (!role) return NextResponse.json({ error: "project_not_found" }, { status: 404 });
    if (!canEdit(role)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const created = await prisma.builderSession.create({
    data: {
      userId: session.user.id,
      name: String(name).slice(0, 120),
      messages,
      tree: tree ?? null,
      projectId: projectId ?? null,
    },
    select: { id: true, name: true, createdAt: true, updatedAt: true, projectId: true },
  });

  return NextResponse.json({ session: created }, { status: 201 });
}
