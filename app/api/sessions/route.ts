import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/sessions — list user's builder sessions (most recent first).
// Includes projectId so the sidebar can group ungrouped-vs-in-project
// without a second request per session.
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const sessions = await prisma.builderSession.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    take: 50,
    select: { id: true, name: true, createdAt: true, updatedAt: true, projectId: true },
  });

  return NextResponse.json({ sessions });
}

// POST /api/sessions — create a new builder session, optionally inside a
// project (folder). projectId is verified to belong to the caller, same
// pattern as every other ownership check in this file — a session can't be
// silently created inside someone else's project via a guessed id.
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const body = await req.json();
  const { name, messages, tree, projectId } = body;
  if (!name || !messages) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  if (projectId) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: session.user.id },
      select: { id: true },
    });
    if (!project) return NextResponse.json({ error: "project_not_found" }, { status: 404 });
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
