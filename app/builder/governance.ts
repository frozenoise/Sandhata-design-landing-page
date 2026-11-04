// Design system governance: checks a page against Spectra's real component
// contract and design tokens, for the builder's Report view, the toolbar
// badge, the start page cards and the report included in Export.
//
// The contract comes from propSchema.ts (itself read off packages/spectra's
// .d.ts files), plus the few props that exist but have no panel editor yet
// (EXTRA_PROPS below). Rules, most serious first:
//   error    unknown-component  not a Spectra component or layout primitive
//   warning  unknown-prop       prop the component doesn't have
//   warning  invalid-value      value outside the component's allowed set
//   warning  hard-coded-colour  colour in `style` instead of a token
//   warning  custom-font        font in `style` instead of the type tokens
//   warning  missing-label      control people can't identify (accessibility)
//   info     off-grid-spacing   spacing that isn't on the 4px grid
// Most can be fixed automatically: the fix removes the offending override so
// the component falls back to its design-system default.
import { PROP_SCHEMA } from "./propSchema";
import { KNOWN_TYPES, type UINode } from "./uiTree";

export type Severity = "error" | "warning" | "info";
export type RuleId =
  | "unknown-component" | "unknown-prop" | "invalid-value"
  | "hard-coded-colour" | "custom-font" | "missing-label" | "off-grid-spacing";

export type GovernanceIssue = {
  rule: RuleId;
  severity: Severity;
  nodeId: string | null;
  type: string;
  path: string;
  message: string;
  /** What the automatic fix does, when there is one */
  fix?: { kind: "remove-prop"; key: string } | { kind: "remove-style"; key: string } | { kind: "snap"; key: string; inStyle: boolean; value: number };
};

export const RULES: Record<RuleId, { title: string; severity: Severity; why: string }> = {
  "unknown-component": { title: "Not a Spectra component", severity: "error", why: "It isn't in the design system, so it can't render as a real component and won't ship." },
  "unknown-prop": { title: "Prop the component doesn't have", severity: "warning", why: "The component ignores it, so the design and the shipped UI can drift apart." },
  "invalid-value": { title: "Value outside the design system", severity: "warning", why: "Only the variants the component defines are supported and tested." },
  "hard-coded-colour": { title: "Hard-coded colour", severity: "warning", why: "Colours should come from tokens so themes, dark mode and rebrands apply." },
  "custom-font": { title: "Custom font", severity: "warning", why: "Type should come from the Spectra type tokens (IBM Plex)." },
  "missing-label": { title: "Missing accessible label", severity: "warning", why: "Screen reader users can't tell what the control is for." },
  "off-grid-spacing": { title: "Spacing off the 4px grid", severity: "info", why: "Spectra spacing steps are multiples of 4." },
};

// Props that exist on the components but have no editor in the panel yet
const EXTRA_PROPS: Record<string, string[]> = {
  Stack: ["width", "maxWidth", "minWidth", "height", "maxHeight"],
  Row: ["width", "maxWidth", "minWidth", "height", "maxHeight"],
  Grid: ["templateColumns", "width", "maxWidth", "minWidth", "height", "maxHeight"],
  Box: ["width", "maxWidth", "minWidth", "height", "maxHeight"],
  Input: ["type", "value", "defaultValue", "name"],
  Textarea: ["value", "defaultValue", "name"],
  Select: ["options", "value", "defaultValue", "name"],
  Tabs: ["tabs"],
  IconButton: ["icon"],
  Button: ["type", "iconLeft", "iconRight"],
};
const ALWAYS_OK = new Set(["style", "key", "className", "id"]);

const SPACING_PROPS = new Set(["gap", "padding", "size"]);
const SPACING_STYLE = /^(gap|rowGap|columnGap|padding|paddingTop|paddingBottom|paddingLeft|paddingRight|margin|marginTop|marginBottom|marginLeft|marginRight)$/;
const COLOUR_STYLE = /colou?r|background|border(Top|Bottom|Left|Right)?Color|^border$|fill|stroke|boxShadow|outline/i;
const COLOUR_VALUE = /#[0-9a-f]{3,8}\b|\brgba?\(|\bhsla?\(|\b(red|blue|green|black|white|gray|grey|orange|purple|yellow|pink)\b/i;

function allowedProps(type: string): Set<string> | null {
  const schema = PROP_SCHEMA[type];
  if (!schema && !EXTRA_PROPS[type]) return KNOWN_TYPES.has(type) ? new Set() : null;
  return new Set([...(schema ?? []).map(f => f.key), ...(EXTRA_PROPS[type] ?? [])]);
}

function enumFor(type: string, key: string): string[] | null {
  const f = PROP_SCHEMA[type]?.find(x => x.key === key);
  return f && f.kind === "select" ? f.options : null;
}

function textOf(node: UINode): string {
  if (typeof node.children === "string") return node.children;
  if (Array.isArray(node.children)) return node.children.map(textOf).join(" ");
  return "";
}

export function auditGovernance(node: UINode | null, ancestry: string[] = []): GovernanceIssue[] {
  if (!node || typeof node !== "object" || !node.type) return [];
  const here = [...ancestry, node.type];
  const path = here.join(" > ");
  const id = node.id ?? null;
  const props = (node.props ?? {}) as Record<string, any>;
  const out: GovernanceIssue[] = [];
  const add = (rule: RuleId, message: string, fix?: GovernanceIssue["fix"]) =>
    out.push({ rule, severity: RULES[rule].severity, nodeId: id, type: node.type, path, message, fix });

  const allowed = allowedProps(node.type);
  if (!allowed) {
    add("unknown-component", `"${node.type}" isn't a Spectra component.`);
  } else {
    for (const [key, value] of Object.entries(props)) {
      if (ALWAYS_OK.has(key) || value === undefined) continue;
      if (!allowed.has(key)) { add("unknown-prop", `${node.type} has no "${key}" prop.`, { kind: "remove-prop", key }); continue; }
      const options = enumFor(node.type, key);
      if (options && !options.includes(String(value))) {
        add("invalid-value", `${node.type} ${key} "${value}" isn't one of: ${options.join(", ")}.`, { kind: "remove-prop", key });
      }
      if (SPACING_PROPS.has(key) && node.type !== "Avatar" && node.type !== "Spinner" && typeof value === "number" && value % 4 !== 0) {
        add("off-grid-spacing", `${key} ${value}px isn't on the 4px grid.`, { kind: "snap", key, inStyle: false, value: Math.round(value / 4) * 4 });
      }
    }
  }

  // Inline style overrides: colours and fonts should come from tokens
  const style = (props.style ?? {}) as Record<string, any>;
  for (const [key, raw] of Object.entries(style)) {
    const value = String(raw);
    if (COLOUR_STYLE.test(key) && COLOUR_VALUE.test(value) && !value.includes("var(--")) {
      add("hard-coded-colour", `style.${key} is "${value}", not a colour token.`, { kind: "remove-style", key });
    } else if (/^font(Family)?$/.test(key) && !value.includes("var(--")) {
      add("custom-font", `style.${key} sets "${value}" instead of a type token.`, { kind: "remove-style", key });
    } else if (SPACING_STYLE.test(key) && typeof raw === "number" && raw % 4 !== 0) {
      add("off-grid-spacing", `style.${key} ${raw}px isn't on the 4px grid.`, { kind: "snap", key, inStyle: true, value: Math.round(raw / 4) * 4 });
    }
  }

  // Accessibility: controls need a name
  if (node.type === "IconButton" && !props.ariaLabel) add("missing-label", "Icon button has no accessible label.");
  if ((node.type === "Input" || node.type === "Textarea" || node.type === "Select") && !props.label && !props.placeholder) {
    add("missing-label", `${node.type} has no label.`);
  }
  if ((node.type === "Switch" || node.type === "Checkbox" || node.type === "Radio") && !props.label && !textOf(node).trim()) {
    add("missing-label", `${node.type} has no label.`);
  }

  if (Array.isArray(node.children)) {
    for (const child of node.children) out.push(...auditGovernance(child, here));
  }
  return out;
}

export function countNodes(node: UINode | null): number {
  if (!node || typeof node !== "object") return 0;
  return 1 + (Array.isArray(node.children) ? node.children.reduce((n, c) => n + countNodes(c), 0) : 0);
}

export type GovernanceSummary = {
  issues: GovernanceIssue[];
  total: number;
  /** Share of elements with no error or warning, 0 to 100 */
  score: number;
  errors: number;
  warnings: number;
  infos: number;
  fixable: number;
};

export function summarise(tree: UINode | null): GovernanceSummary {
  const issues = auditGovernance(tree);
  const total = countNodes(tree);
  const blocking = new Set(issues.filter(i => i.severity !== "info").map(i => i.nodeId ?? `${i.path}`));
  const score = total === 0 ? 100 : Math.round(((total - blocking.size) / total) * 100);
  return {
    issues, total, score,
    errors: issues.filter(i => i.severity === "error").length,
    warnings: issues.filter(i => i.severity === "warning").length,
    infos: issues.filter(i => i.severity === "info").length,
    fixable: issues.filter(i => i.fix).length,
  };
}

/** Applies the automatic fixes for the given issues and returns a new tree. */
export function applyGovernanceFixes(tree: UINode, issues: GovernanceIssue[]): UINode {
  const byNode = new Map<string, GovernanceIssue[]>();
  for (const i of issues) if (i.fix && i.nodeId) byNode.set(i.nodeId, [...(byNode.get(i.nodeId) ?? []), i]);
  const walk = (n: UINode): UINode => {
    let next = n;
    const fixes = n.id ? byNode.get(n.id) : undefined;
    if (fixes) {
      const props = { ...(n.props ?? {}) } as Record<string, any>;
      const style = { ...(props.style ?? {}) } as Record<string, any>;
      for (const { fix } of fixes) {
        if (!fix) continue;
        if (fix.kind === "remove-prop") delete props[fix.key];
        else if (fix.kind === "remove-style") delete style[fix.key];
        else if (fix.kind === "snap") { if (fix.inStyle) style[fix.key] = fix.value; else props[fix.key] = fix.value; }
      }
      if (Object.keys(style).length) props.style = style; else delete props.style;
      next = { ...n, props };
    }
    if (Array.isArray(next.children)) next = { ...next, children: next.children.map(walk) };
    return next;
  };
  return walk(tree);
}

/** Plain-text report for Export, so the governance result travels with the code. */
export function governanceMarkdown(pageName: string, s: GovernanceSummary): string {
  const lines = [
    `# Design system report: ${pageName}`,
    "",
    `Governance score: ${s.score}% of ${s.total} elements fully on the design system.`,
    `Errors: ${s.errors} · Warnings: ${s.warnings} · Notes: ${s.infos}`,
    "",
  ];
  if (s.issues.length === 0) lines.push("Every element uses a Spectra component as defined, with token colours and type.");
  for (const rule of Object.keys(RULES) as RuleId[]) {
    const list = s.issues.filter(i => i.rule === rule);
    if (!list.length) continue;
    lines.push(`## ${RULES[rule].title} (${list.length})`, "", RULES[rule].why, "");
    for (const i of list) lines.push(`- ${i.message} (${i.path})`);
    lines.push("");
  }
  lines.push(`Generated by the Spectra builder on ${new Date().toISOString().slice(0, 10)}.`);
  return lines.join("\n");
}
