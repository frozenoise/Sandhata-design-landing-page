import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { encryptSecret } from "@/lib/crypto";

// GET /api/account/key — whether the signed-in user has an account-linked
// API key saved. Never returns the plaintext key.
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { apiKeyEnc: true },
  });

  return NextResponse.json({ hasKey: !!user?.apiKeyEnc });
}

// PUT /api/account/key — encrypt and save an API key against the signed-in user.
export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const apiKey = typeof body?.apiKey === "string" ? body.apiKey.trim() : "";
  if (!apiKey) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { apiKeyEnc: encryptSecret(apiKey) },
  });

  return NextResponse.json({ hasKey: true });
}

// DELETE /api/account/key — unlink the API key from the signed-in user.
export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { apiKeyEnc: null },
  });

  return NextResponse.json({ hasKey: false });
}
