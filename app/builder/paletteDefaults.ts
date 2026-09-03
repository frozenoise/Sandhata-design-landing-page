// Phase 3 (component palette + drag-to-insert) — what the AI-generation
// route (app/api/generate/route.ts) is to a prompt, this is to a drag: the
// registry of insertable component types + sensible starting props/content
// for each, so a freshly-dropped element looks like something, not a blank
// husk. Categories mirror the real capability of app/builder/Renderer.tsx's
// LAYOUT/DS registries — NOT the full @sandhata/spectra catalogue (Accordion,
// Table, Menu, Sidebar, Drawer, Modal exist in the library but need runtime/
// controlled state the static JSON tree can't express, so the renderer never
// wires them up, and the palette must not offer what it can't render).
//
// IconButton and Tooltip are deliberately excluded: IconButton.icon is a
// required React.ReactNode — not a JSON-serializable value the tree format
// can hold (see UINode's own comment on `props` needing to survive Postgres/
// export round-trips), so a palette-dropped IconButton would always render
// with a missing required prop. Tooltip needs a `children` trigger element,
// not a props/text default — dropping a blank one would render invisible
// (nothing to hover). Both are real, documented gaps, not oversights.

import type { UINode } from "./uiTree";

export const PALETTE_CATEGORIES: { label: string; types: string[] }[] = [
  { label: "Layout",       types: ["Stack", "Row", "Grid", "Box", "Divider", "Spacer"] },
  { label: "Typography",   types: ["Heading", "Text"] },
  { label: "Actions",      types: ["Button"] },
  { label: "Forms",        types: ["Input", "Textarea", "Select", "Switch", "Checkbox", "Radio"] },
  { label: "Data Display", types: ["Card", "StatCard", "Badge", "Tag", "Avatar"] },
  { label: "Navigation",   types: ["Tabs"] },
  { label: "Feedback",     types: ["Alert", "Spinner"] },
];

type Defaults = { props?: Record<string, any>; children?: UINode[] | string };

export function paletteDefaults(type: string): Defaults {
  switch (type) {
    // Layout
    case "Stack":    return { props: { gap: 12 }, children: [] };
    case "Row":      return { props: { gap: 12, align: "center" }, children: [] };
    case "Grid":     return { props: { columns: 2, gap: 12 }, children: [] };
    case "Box":      return { props: { padding: 16 }, children: [] };
    case "Divider":  return {};
    case "Spacer":   return { props: { size: 16 } };
    // Typography
    case "Heading":  return { props: { level: 2 }, children: "Heading" };
    case "Text":     return { children: "Text content" };
    // Actions
    case "Button":   return { props: { hierarchy: "primary" }, children: "Button" };
    // Forms
    case "Input":    return { props: { label: "Label", placeholder: "Enter value" } };
    case "Textarea": return { props: { label: "Label", placeholder: "Enter value", rows: 3 } };
    case "Select":   return { props: { label: "Label", placeholder: "Select…", options: ["Option 1", "Option 2"] } };
    case "Switch":   return { props: { label: "Label" } };
    case "Checkbox": return { props: { label: "Label" } };
    case "Radio":    return { props: { label: "Label" } };
    // Data display
    case "Card":     return { props: { title: "Card title" }, children: [] };
    case "StatCard": return { props: { label: "Label", value: "0" } };
    case "Badge":    return { props: { tone: "neutral" }, children: "Badge" };
    case "Tag":      return { props: { tone: "neutral" }, children: "Tag" };
    case "Avatar":   return { props: { name: "AB", tone: "neutral" } };
    // Navigation
    case "Tabs":     return { props: { value: "tab-1", tabs: [{ value: "tab-1", label: "Tab 1" }, { value: "tab-2", label: "Tab 2" }] } };
    // Feedback
    case "Alert":    return { props: { tone: "info", title: "Alert title" }, children: "Alert message" };
    case "Spinner":  return {};
    default:         return {};
  }
}
