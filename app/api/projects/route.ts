import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/projects — list user's projects, most recently updated first,
// each with its session ("page") count so the sidebar can show a badge
// without a second round trip.
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { sessions: true } },
      // GitHub push integration (Phase 1) — surfaced here so the sidebar can
      // render each project's connected/disconnected state without a
      // separate round trip per project.
      repoOwner: true,
      repoName: true,
      defaultBranch: true,
      workingBranch: true,
      syncStatus: true,
      lastSyncedAt: true,
      lastSyncError: true,
    },
  });

  return NextResponse.json({
    projects: projects.map(p => ({
      id: p.id,
      name: p.name,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      sessionCount: p._count.sessions,
      repoOwner: p.repoOwner,
      repoName: p.repoName,
      defaultBranch: p.defaultBranch,
      workingBranch: p.workingBranch,
      syncStatus: p.syncStatus,
      lastSyncedAt: p.lastSyncedAt,
      lastSyncError: p.lastSyncError,
    })),
  });
}

// POST /api/projects — create a new project (folder)
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const body = await req.json();
  const { name } = body;
  if (!name || !String(name).trim()) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const created = await prisma.project.create({
    data: {
      userId: session.user.id,
      name: String(name).trim().slice(0, 120),
    },
    select: { id: true, name: true, createdAt: true, updatedAt: true },
  });

  return NextResponse.json({ project: { ...created, sessionCount: 0 } }, { status: 201 });
}
