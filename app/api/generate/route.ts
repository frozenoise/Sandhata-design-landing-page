import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decryptSecret } from "@/lib/crypto";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM = `You are a UI generator for the Sandhata Design System. Given a description, output a SINGLE JSON object describing an interface built ONLY from the allowed components. Output JSON only — no prose, no markdown fences.

The JSON is a recursive node:
{ "type": <ComponentName>, "props"?: {...}, "children"?: [<node>, ...] | "text" }

LAYOUT PRIMITIVES:
- "Stack"   props: { gap?:number, align?:"flex-start"|"center"|"flex-end"|"stretch", width?:string, maxWidth?:string }   vertical flex
- "Row"     props: { gap?:number, align?, justify?, wrap?:boolean, width?:string, maxWidth?:string }                      horizontal flex
- "Grid"    props: { columns?:number, templateColumns?:string, gap?:number, width?:string, maxWidth?:string }             CSS grid
- "Box"     props: { padding?:number, width?:string, maxWidth?:string, height?:string }
- "Heading" props: { level?:1|2|3|4 }  children: text
- "Text"    children: text
- "Divider"
- "Spacer"  props: { size?:number }

SIZING GUIDANCE:
- Mobile layout: root Stack maxWidth:"375px", single-column
- Tablet layout: root Stack maxWidth:"768px", 2-column Grid where appropriate
- Desktop layout: root Stack maxWidth:"100%", Grid columns:3 or 4, use Row for side-by-side panels

DESIGN-SYSTEM COMPONENTS (use real product UI, not lorem):
- "Button"   props: { hierarchy?:"primary"|"secondary"|"tertiary"|"danger"|"ghost"|"inverse", size?:"small"|"medium"|"large", fullWidth?:boolean }  children: label
- "Badge"    props: { tone?:"neutral"|"success"|"warning"|"error"|"info"|"action"|"highlight", variant?:"subtle"|"solid", dot?:boolean }  children: label
- "Alert"    props: { tone?:"info"|"success"|"warning"|"error", title?:string }  children: message
- "Card"     props: {}  children: nodes
- "Input"    props: { label?:string, placeholder?:string, type?:string }
- "Textarea" props: { label?:string, placeholder?:string }
- "Select"   props: { label?:string, options?:string[] }
- "Switch"   props: { label?:string, checked?:boolean }
- "Checkbox" props: { label?:string, checked?:boolean }
- "Radio"    props: { label?:string, name?:string }
- "Tag"      children: label
- "Avatar"   props: { name:string, tone?:"blue"|"purple"|"neutral" }
- "StatCard" props: { label:string, value:string, trend?:string }
- "Spinner"  props: { size?:number }
- "Tabs"     props: { tabs?:string[] }

RULES:
- Wrap the whole UI in a single "Stack" (or "Card") root with sensible gap.
- Use realistic copy relevant to the request.
- Prefer Card to group related content. Use Heading for titles.
- Keep it focused: 1 cohesive screen/section, not a whole site.
- When the user asks to modify or refine a previous design, your prior JSON is in the conversation history as your last assistant message. Modify it and return the COMPLETE updated JSON — never a partial diff.
- Keep the tree concise: avoid excessive nesting, merge sibling Text nodes, and don't repeat boilerplate. Aim for under 200 nodes total.
- Output ONLY the JSON object.`;

export async function POST(req: Request) {
  let messages: { role: string; content: string }[] = [];
  let clientKey = "";

  try {
    const body = await req.json();
    clientKey = body.apiKey || "";
    if (Array.isArray(body.messages) && body.messages.length) {
      messages = body.messages;
    } else if (typeof body.prompt === "string" && body.prompt.trim()) {
      messages = [{ role: "user", content: `Build this interface: ${body.prompt}` }];
    }
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  if (!messages.length) {
    return NextResponse.json({ error: "bad_request", message: "Provide a message." }, { status: 400 });
  }

  // Key precedence: explicit key sent with this request (BYO / local override)
  // > the signed-in user's account-linked key > the server's own key (dev only —
  // deliberately unset on Vercel, see CLAUDE.md).
  let key = typeof clientKey === "string" ? clientKey.trim() : "";

  if (!key) {
    try {
      const session = await auth();
      if (session?.user?.id) {
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { apiKeyEnc: true },
        });
        if (user?.apiKeyEnc) key = decryptSecret(user.apiKeyEnc);
      }
    } catch {
      // Account-key lookup is best-effort — fall through to the env/missing-key paths.
    }
  }

  if (!key) key = process.env.ANTHROPIC_API_KEY || "";
  if (!key) {
    return NextResponse.json(
      {
        error: "missing_key",
        message: "Enter your Anthropic API key to generate — it's sent only with this request and never stored on our server.",
      },
      { status: 503 }
    );
  }

  try {
    const client = new Anthropic({ apiKey: key });
    const msg = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      system: SYSTEM,
      messages: messages as any,
    });

    const text = msg.content
      .filter((b: any) => b.type === "text")
      .map((b: any) => b.text)
      .join("");

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1) {
      return NextResponse.json({ error: "generation_failed", message: "No JSON found in response." }, { status: 502 });
    }

    let tree;
    try {
      tree = JSON.parse(text.slice(start, end + 1));
    } catch {
      // Response was truncated — give the user a clear message
      return NextResponse.json(
        { error: "generation_failed", message: "The interface was too large to generate in one go. Try a simpler or more focused description." },
        { status: 502 }
      );
    }
    return NextResponse.json({ tree, raw: text.slice(start, end + 1) });
  } catch (e: any) {
    const status = e?.status === 401 ? 401 : 500;
    return NextResponse.json(
      {
        error: status === 401 ? "invalid_key" : "generation_failed",
        message: status === 401
          ? "That API key was rejected by Anthropic. Check it and try again."
          : e?.message ?? "Unknown error",
      },
      { status }
    );
  }
}
