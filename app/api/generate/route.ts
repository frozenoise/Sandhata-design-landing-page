import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM = `You are a UI generator for the Sandhata Design System. Given a description, you output a SINGLE JSON object describing an interface built ONLY from the allowed components. Output JSON only — no prose, no markdown fences.

The JSON is a recursive node:
{ "type": <ComponentName>, "props"?: {...}, "children"?: [<node>, ...] | "text" }

LAYOUT PRIMITIVES:
- "Stack"   props: { gap?:number, align?:"flex-start"|"center"|"flex-end"|"stretch" }   vertical flex
- "Row"     props: { gap?:number, align?, justify?, wrap?:boolean }                       horizontal flex
- "Grid"    props: { columns?:number, gap?:number }
- "Box"     props: { padding?:number }
- "Heading" props: { level?:1|2|3|4 }  children: text
- "Text"    children: text
- "Divider"
- "Spacer"  props: { size?:number }

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
- Output ONLY the JSON object.`;

export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "missing_key", message: "Set ANTHROPIC_API_KEY in .env.local and restart the dev server." },
      { status: 503 }
    );
  }

  let prompt = "";
  try {
    ({ prompt } = await req.json());
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "bad_request", message: "Provide a prompt." }, { status: 400 });
  }

  try {
    const client = new Anthropic({ apiKey: key });
    const msg = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: SYSTEM,
      messages: [{ role: "user", content: `Build this interface: ${prompt}` }],
    });

    const text = msg.content
      .filter((b: any) => b.type === "text")
      .map((b: any) => b.text)
      .join("");

    // Extract the JSON object (strip any stray fences/prose defensively)
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1) {
      return NextResponse.json({ error: "parse_error", raw: text }, { status: 502 });
    }
    const tree = JSON.parse(text.slice(start, end + 1));
    return NextResponse.json({ tree });
  } catch (e: any) {
    return NextResponse.json(
      { error: "generation_failed", message: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
