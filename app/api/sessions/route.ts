import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/sessions — list user's builder sessions (most recent first)
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const sessions = await prisma.builderSession.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    take: 50,
    select: { id: true, name: true, createdAt: true, updatedAt: true },
  });

  return NextResponse.json({ sessions });
}

// POST /api/sessions — create a new builder session
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const body = await req.json();
  const { name, messages, tree } = body;
  if (!name || !messages) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const created = await prisma.builderSession.create({
    data: {
      userId: session.user.id,
      name: String(name).slice(0, 120),
      messages,
      tree: tree ?? null,
    },
    select: { id: true, name: true, createdAt: true, updatedAt: true },
  });

  return NextResponse.json({ session: created }, { status: 201 });
}
