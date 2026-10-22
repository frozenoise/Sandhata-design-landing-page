import { NextResponse } from "next/server";
import { Liveblocks } from "@liveblocks/node";
import { auth } from "@/lib/auth";
import { sessionRole, canEdit } from "@/lib/access";

// POST /api/liveblocks-auth — issues a Liveblocks token for one shared page's
// live room. The room id names the page ("spectra:page:<sessionId>"), and
// access comes from the same rules as the REST routes (lib/access.ts):
// owners and editors get full access, viewers read-only, anyone else nothing.

const ROOM_PREFIX = "spectra:page:";

// A soft palette for presence avatars/outlines, picked per user id so the
// same person keeps the same colour across pages and reloads.
const COLOURS = ["#3B68FF", "#E5594B", "#16A34A", "#D97706", "#9333EA", "#0891B2", "#DB2777", "#4F46E5"];
function colourFor(id: string) {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return COLOURS[h % COLOURS.length];
}

export async function POST(req: Request) {
  const secret = process.env.LIVEBLOCKS_SECRET_KEY;
  if (!secret) return NextResponse.json({ error: "live_editing_not_configured" }, { status: 503 });

  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const room = String(body.room ?? "");
  if (!room.startsWith(ROOM_PREFIX)) return NextResponse.json({ error: "bad_room" }, { status: 400 });

  const { role } = await sessionRole(session.user.id, room.slice(ROOM_PREFIX.length));
  if (!role) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const liveblocks = new Liveblocks({ secret, baseUrl: process.env.LIVEBLOCKS_BASE_URL || undefined });
  const lb = liveblocks.prepareSession(session.user.id, {
    userInfo: {
      name: session.user.name || session.user.email || "Someone",
      // Liveblocks accepts a string or no key at all, not null.
      ...(session.user.image ? { avatar: session.user.image } : {}),
      color: colourFor(session.user.id),
    },
  });
  lb.allow(room, canEdit(role) ? lb.FULL_ACCESS : lb.READ_ACCESS);
  const { status, body: token } = await lb.authorize();
  return new Response(token, { status });
}
