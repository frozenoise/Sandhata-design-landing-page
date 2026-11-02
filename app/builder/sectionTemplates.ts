import { cloneWithNewIds, type UINode } from "./uiTree";

// Ready-made sections for the visual editor's Insert panel (Vzy's "Add
// section" library). Each is built only from the components the renderer
// and the AI generator already know, so an inserted section edits, exports
// and round-trips through chat exactly like a generated one. Ids are added
// on insert (cloneWithNewIds), so the same template can go in many times.

export type SectionTemplate = {
  key: string;
  name: string;
  hint: string;
  build: () => UINode;
};

const n = (type: string, props?: Record<string, any>, children?: UINode[] | string): UINode => ({ type, props, children });
const text = (s: string) => n("Text", undefined, s);
const heading = (level: number, s: string) => n("Heading", { level }, s);

const TEMPLATES: SectionTemplate[] = [
  {
    key: "hero",
    name: "Hero",
    hint: "Headline, supporting line and two buttons",
    build: () => n("Stack", { gap: 16, align: "flex-start" }, [
      n("Badge", { tone: "action", variant: "subtle" }, "New"),
      heading(1, "Ship consistent interfaces, faster"),
      text("Everything your team needs to design, build and govern product UI in one place."),
      n("Row", { gap: 12 }, [
        n("Button", { hierarchy: "primary" }, "Get started"),
        n("Button", { hierarchy: "secondary" }, "Book a demo"),
      ]),
    ]),
  },
  {
    key: "features",
    name: "Feature grid",
    hint: "Three cards with a title and short description",
    build: () => n("Stack", { gap: 16 }, [
      heading(2, "Why teams choose us"),
      n("Grid", { columns: 3, gap: 16 }, [
        ["Built-in governance", "Every element comes from the design system, so pages stay on brand."],
        ["Live collaboration", "Invite your team and edit the same page together in real time."],
        ["Export anywhere", "Download clean code or push straight to your repository."],
      ].map(([t, d]) => n("Card", {}, [n("Stack", { gap: 8 }, [heading(4, t), text(d)])]))),
    ]),
  },
  {
    key: "stats",
    name: "Stats row",
    hint: "Four headline numbers with trends",
    build: () => n("Grid", { columns: 4, gap: 16 }, [
      ["Active users", "12,480", "+8%"],
      ["Conversion", "4.6%", "+0.4%"],
      ["Avg. session", "6m 12s", "+12%"],
      ["Churn", "1.8%", "-0.3%"],
    ].map(([label, value, trend]) => n("StatCard", { label, value, trend }))),
  },
  {
    key: "pricing",
    name: "Pricing",
    hint: "Three plans with a highlighted middle tier",
    build: () => n("Stack", { gap: 16 }, [
      heading(2, "Simple pricing"),
      n("Grid", { columns: 3, gap: 16 }, [
        ["Starter", "Free", "For individuals trying things out", "secondary", false],
        ["Team", "£24 / month", "For teams shipping together", "primary", true],
        ["Enterprise", "Talk to us", "For organisations with governance needs", "secondary", false],
      ].map(([plan, price, blurb, hierarchy, popular]) => n("Card", {}, [
        n("Stack", { gap: 10 }, [
          n("Row", { gap: 8 }, [heading(4, plan as string), ...(popular ? [n("Badge", { tone: "action", variant: "solid" }, "Popular")] : [])]),
          heading(2, price as string),
          text(blurb as string),
          n("Button", { hierarchy, fullWidth: true }, "Choose plan"),
        ]),
      ]))),
    ]),
  },
  {
    key: "testimonial",
    name: "Testimonial",
    hint: "A customer quote with name and role",
    build: () => n("Card", {}, [
      n("Stack", { gap: 14 }, [
        heading(3, "“We cut our design review time in half within a month.”"),
        n("Row", { gap: 12 }, [
          n("Avatar", { name: "Priya Shah", tone: "blue" }),
          n("Stack", { gap: 2 }, [n("Text", { style: { fontWeight: 700 } }, "Priya Shah"), text("Head of Product, Northwind")]),
        ]),
      ]),
    ]),
  },
  {
    key: "cta",
    name: "Call to action",
    hint: "Short pitch with one main button",
    build: () => n("Card", {}, [
      n("Row", { gap: 16, justify: "space-between", wrap: true }, [
        n("Stack", { gap: 6 }, [heading(3, "Ready to get started?"), text("Set up your first project in under five minutes.")]),
        n("Button", { hierarchy: "primary" }, "Start free trial"),
      ]),
    ]),
  },
  {
    key: "contact",
    name: "Contact form",
    hint: "Name, email, message and a send button",
    build: () => n("Card", {}, [
      n("Stack", { gap: 14 }, [
        heading(3, "Get in touch"),
        n("Grid", { columns: 2, gap: 12 }, [
          n("Input", { label: "Name", placeholder: "Your name" }),
          n("Input", { label: "Email", placeholder: "you@company.com", type: "email" }),
        ]),
        n("Textarea", { label: "Message", placeholder: "How can we help?" }),
        n("Row", { gap: 12, justify: "flex-end" }, [n("Button", { hierarchy: "primary" }, "Send message")]),
      ]),
    ]),
  },
  {
    key: "faq",
    name: "FAQ",
    hint: "Common questions with short answers",
    build: () => n("Stack", { gap: 12 }, [
      heading(2, "Frequently asked questions"),
      ...[
        ["Can I invite my team?", "Yes. Share a project and everyone you invite can edit its pages live."],
        ["Do I need to know how to code?", "No. Describe what you want, then fine-tune it visually."],
        ["Can I export my work?", "Download any page as a ZIP or push it to GitHub."],
      ].map(([q, a]) => n("Card", {}, [n("Stack", { gap: 6 }, [heading(4, q), text(a)])])),
    ]),
  },
];

export const SECTION_TEMPLATES = TEMPLATES;

/** A fresh, fully id'd copy of a template, ready to insert. */
export function buildSection(key: string): UINode | null {
  const t = TEMPLATES.find(t => t.key === key);
  return t ? cloneWithNewIds(t.build()) : null;
}
