// Property-panel field definitions for the visual editor's "edit" view
// (app/builder/page.tsx). Grounded in the REAL prop contracts from
// packages/spectra/src/**/*.d.ts (hand-authored, not generated — same
// convention followed here), not the AI generation route's reduced/simplified
// prop subset (app/api/generate/route.ts) — the editor should let you reach
// every prop the real component actually supports, even ones the model
// itself is never told to use.
//
// Deliberately excludes: ReactNode-typed props (icons, custom children
// slots), array/object-shaped props (Select.options, Tabs.tabs), and event
// handlers — none of those have a sane generic editor in this pass. A field
// not listed here simply isn't editable from the panel yet; that's a known,
// acceptable Phase 1 gap, not a bug.

export type PropField =
  | { key: string; label: string; kind: "text" }
  | { key: string; label: string; kind: "number" }
  | { key: string; label: string; kind: "boolean" }
  | { key: string; label: string; kind: "select"; options: string[] };

export const PROP_SCHEMA: Record<string, PropField[]> = {
  // ── Layout primitives (LAYOUT set in Renderer.tsx) ───────────────────────
  Stack: [
    { key: "gap", label: "Gap", kind: "number" },
    { key: "align", label: "Align", kind: "select", options: ["flex-start", "center", "flex-end", "stretch"] },
  ],
  Row: [
    { key: "gap", label: "Gap", kind: "number" },
    { key: "align", label: "Align", kind: "select", options: ["flex-start", "center", "flex-end", "stretch"] },
    { key: "justify", label: "Justify", kind: "select", options: ["flex-start", "center", "flex-end", "space-between", "space-around"] },
    { key: "wrap", label: "Wrap", kind: "boolean" },
  ],
  Grid: [
    { key: "columns", label: "Columns", kind: "number" },
    { key: "gap", label: "Gap", kind: "number" },
  ],
  Box: [
    { key: "padding", label: "Padding", kind: "number" },
  ],
  Heading: [
    { key: "level", label: "Level", kind: "select", options: ["1", "2", "3", "4"] },
  ],
  Spacer: [
    { key: "size", label: "Size", kind: "number" },
  ],
  // Text, Divider: no editable props beyond content/style — content is
  // handled generically (any node with plain-string children gets a Text
  // Content field in the panel, not driven by this schema).

  // ── Design-system components (DS map in Renderer.tsx) ────────────────────
  Button: [
    { key: "hierarchy", label: "Hierarchy", kind: "select", options: ["primary", "secondary", "tertiary", "inverse", "danger", "ghost"] },
    { key: "size", label: "Size", kind: "select", options: ["small", "medium", "large"] },
    { key: "fullWidth", label: "Full width", kind: "boolean" },
    { key: "disabled", label: "Disabled", kind: "boolean" },
  ],
  IconButton: [
    { key: "hierarchy", label: "Hierarchy", kind: "select", options: ["primary", "secondary", "tertiary", "ghost", "danger"] },
    { key: "size", label: "Size", kind: "select", options: ["small", "medium", "large"] },
    { key: "ariaLabel", label: "Accessible label", kind: "text" },
    { key: "disabled", label: "Disabled", kind: "boolean" },
  ],
  Badge: [
    { key: "tone", label: "Tone", kind: "select", options: ["neutral", "info", "success", "warning", "error", "action", "highlight"] },
    { key: "variant", label: "Variant", kind: "select", options: ["subtle", "solid"] },
    { key: "dot", label: "Show dot", kind: "boolean" },
  ],
  Alert: [
    { key: "tone", label: "Tone", kind: "select", options: ["info", "success", "warning", "error"] },
    { key: "title", label: "Title", kind: "text" },
  ],
  Avatar: [
    { key: "name", label: "Name", kind: "text" },
    { key: "src", label: "Image URL", kind: "text" },
    { key: "size", label: "Size", kind: "number" },
    { key: "tone", label: "Tone", kind: "select", options: ["action", "purple", "neutral"] },
  ],
  Tag: [
    { key: "tone", label: "Tone", kind: "select", options: ["neutral", "action"] },
  ],
  StatCard: [
    { key: "label", label: "Label", kind: "text" },
    { key: "value", label: "Value", kind: "text" },
    { key: "trend", label: "Trend text", kind: "text" },
    { key: "trendDirection", label: "Trend direction", kind: "select", options: ["up", "down"] },
  ],
  Card: [
    { key: "title", label: "Title", kind: "text" },
    { key: "subtitle", label: "Subtitle", kind: "text" },
    { key: "padding", label: "Padding", kind: "number" },
  ],
  Input: [
    { key: "label", label: "Label", kind: "text" },
    { key: "placeholder", label: "Placeholder", kind: "text" },
    { key: "helper", label: "Helper text", kind: "text" },
    { key: "error", label: "Error message", kind: "text" },
    { key: "required", label: "Required", kind: "boolean" },
    { key: "size", label: "Size", kind: "select", options: ["small", "medium", "large"] },
    { key: "disabled", label: "Disabled", kind: "boolean" },
  ],
  Textarea: [
    { key: "label", label: "Label", kind: "text" },
    { key: "placeholder", label: "Placeholder", kind: "text" },
    { key: "helper", label: "Helper text", kind: "text" },
    { key: "error", label: "Error message", kind: "text" },
    { key: "required", label: "Required", kind: "boolean" },
    { key: "rows", label: "Rows", kind: "number" },
    { key: "disabled", label: "Disabled", kind: "boolean" },
  ],
  Select: [
    { key: "label", label: "Label", kind: "text" },
    { key: "placeholder", label: "Placeholder", kind: "text" },
    { key: "helper", label: "Helper text", kind: "text" },
    { key: "error", label: "Error message", kind: "text" },
    { key: "size", label: "Size", kind: "select", options: ["small", "medium", "large"] },
    { key: "disabled", label: "Disabled", kind: "boolean" },
    // `options` (array) is intentionally not editable here — Phase 2+.
  ],
  Switch: [
    { key: "label", label: "Label", kind: "text" },
    { key: "checked", label: "Checked", kind: "boolean" },
    { key: "disabled", label: "Disabled", kind: "boolean" },
  ],
  Checkbox: [
    { key: "label", label: "Label", kind: "text" },
    { key: "checked", label: "Checked", kind: "boolean" },
    { key: "indeterminate", label: "Indeterminate", kind: "boolean" },
    { key: "disabled", label: "Disabled", kind: "boolean" },
  ],
  Radio: [
    { key: "label", label: "Label", kind: "text" },
    { key: "checked", label: "Checked", kind: "boolean" },
    { key: "name", label: "Group name", kind: "text" },
    { key: "value", label: "Value", kind: "text" },
    { key: "disabled", label: "Disabled", kind: "boolean" },
  ],
  Tabs: [
    { key: "value", label: "Active tab value", kind: "text" },
    // `tabs` (array of {value,label,icon}) is intentionally not editable
    // here — Phase 2+.
  ],
  Tooltip: [
    { key: "label", label: "Tooltip text", kind: "text" },
    { key: "side", label: "Side", kind: "select", options: ["top", "bottom", "left", "right"] },
  ],
  Spinner: [
    { key: "size", label: "Size", kind: "number" },
    { key: "stroke", label: "Stroke width", kind: "number" },
    { key: "color", label: "Colour", kind: "text" },
  ],
};
