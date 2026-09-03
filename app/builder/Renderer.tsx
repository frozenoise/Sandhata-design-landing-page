"use client";

import React from "react";
import {
  Button, Badge, Alert, Spinner, Avatar, Tag, StatCard, Card,
  Input, Textarea, Select, Switch, Checkbox, Radio, Tabs, Tooltip, IconButton,
} from "@sandhata/spectra";
// UINode + treeToJSX live in uiTree.ts (no React import) so server code —
// e.g. app/api/github/push — can reuse the exact same JSX pretty-printer
// without pulling a "use client" component module into a route handler.
// Re-exported here so existing imports of these from "./Renderer" keep working.
import { treeToJSX, type UINode } from "./uiTree";
export { treeToJSX, type UINode };

/* Design-system components the model may use. */
const DS: Record<string, any> = {
  Button, Badge, Alert, Spinner, Avatar, Tag, StatCard, Card,
  Input, Textarea, Select, Switch, Checkbox, Radio, Tabs, Tooltip, IconButton,
};

/* Layout primitives rendered as plain styled elements. */
const LAYOUT = new Set(["Stack", "Row", "Grid", "Text", "Heading", "Spacer", "Divider", "Box"]);

function layoutStyle(type: string, props: Record<string, any> = {}): React.CSSProperties {
  const gap = props.gap ?? 12;
  const sizing: React.CSSProperties = {
    width:     props.width,
    maxWidth:  props.maxWidth,
    minWidth:  props.minWidth,
    height:    props.height,
    maxHeight: props.maxHeight,
  };
  switch (type) {
    case "Stack": return { display: "flex", flexDirection: "column", gap, alignItems: props.align, ...sizing, ...props.style };
    case "Row":   return { display: "flex", flexDirection: "row", gap, alignItems: props.align ?? "center", flexWrap: props.wrap ? "wrap" : "nowrap", justifyContent: props.justify, ...sizing, ...props.style };
    case "Grid":  return { display: "grid", gridTemplateColumns: props.columns ? `repeat(${props.columns}, 1fr)` : props.templateColumns ?? `repeat(2, 1fr)`, gap, ...sizing, ...props.style };
    case "Box":   return { padding: props.padding ?? 0, ...sizing, ...props.style };
    default:      return { ...sizing, ...props.style };
  }
}

let keyCounter = 0;

export function RenderNode({ node }: { node: UINode }): React.ReactElement | null {
  if (!node || typeof node !== "object") return null;
  const { type, props = {}, children, id } = node;
  const key = `n${keyCounter++}`;
  // Purely structural — no handlers, no state, so the zero-arg call sites
  // (Preview tab, export/Code view) are completely unaffected. The visual
  // editor (app/builder/page.tsx, "edit" view) resolves clicks/hover via a
  // single delegated listener on its canvas wrapper using this attribute
  // (`e.target.closest('[data-node-id]')`) rather than this component
  // threading selection state/handlers through every branch below.
  const nodeAttrs = id ? { "data-node-id": id } : {};

  const kids = typeof children === "string"
    ? children
    : Array.isArray(children)
      ? children.map((c, i) => <RenderNode key={i} node={c} />)
      : null;

  // Layout primitives
  if (LAYOUT.has(type)) {
    if (type === "Text")    return <p key={key} {...nodeAttrs} style={{ margin: 0, color: "var(--text-body)", font: "14px/1.6 var(--font-normal)", ...props.style }}>{kids}</p>;
    if (type === "Heading") {
      const lvl = props.level ?? 2;
      const sizes: Record<number, string> = { 1: "28px", 2: "22px", 3: "18px", 4: "16px" };
      return <div key={key} {...nodeAttrs} style={{ font: `700 ${sizes[lvl] ?? "22px"}/1.25 var(--font-bold)`, color: "var(--text-title)", ...props.style }}>{kids}</div>;
    }
    if (type === "Spacer")  return <div key={key} {...nodeAttrs} style={{ height: props.size ?? 16 }} />;
    if (type === "Divider") return <div key={key} {...nodeAttrs} style={{ height: 1, background: "var(--border-subtle, #e5e7eb)", width: "100%", ...props.style }} />;
    return <div key={key} {...nodeAttrs} style={layoutStyle(type, props)}>{kids}</div>;
  }

  // Design-system components
  const Comp = DS[type];
  if (!Comp) {
    return <div key={key} {...nodeAttrs} style={{ padding: 8, border: "1px dashed #d1d5db", borderRadius: 6, font: "12px var(--font-mono)", color: "#9aa0ac" }}>Unknown: {type}</div>;
  }
  const { style, ...rest } = props;
  const comp = <Comp style={style} {...rest} {...nodeAttrs}>{kids}</Comp>;
  // Not every DS component forwards unrecognized props onto a clickable
  // element: some (Alert, Avatar, Tag, StatCard, Spinner, Tooltip) don't
  // spread `...rest` at all, and Switch/Checkbox/Radio spread it onto a
  // visually-hidden/overlay input rather than the element you actually see
  // and click — in both cases `{...nodeAttrs}` above lands on something the
  // visual editor's canvas delegation can never hit-test. A `display:contents`
  // wrapper carrying the same id is layout-transparent (renders as if it
  // weren't there — verified this doesn't change existing layout/CSS, only
  // adds a DOM node) but is always a real, always-clickable ancestor, so
  // selection works uniformly regardless of what the wrapped component does
  // internally. Only pays for itself once a tree actually has ids (i.e. edit
  // mode has been entered at least once for this tab) — id is undefined for
  // any tree that predates that, so this is a no-op wrapper-per-node most of
  // the time (Preview/Code, or any session that's never opened Edit).
  return id ? <span key={key} data-node-id={id} style={{ display: "contents" }}>{comp}</span> : comp;
}

export function RenderTree({ tree }: { tree: UINode | null }) {
  keyCounter = 0;
  if (!tree) return null;
  return <RenderNode node={tree} />;
}
