"use client";

import React from "react";
import {
  Button, Badge, Alert, Spinner, Avatar, Tag, StatCard, Card,
  Input, Textarea, Select, Switch, Checkbox, Radio, Tabs, Tooltip, IconButton,
} from "@/components";

/* A generated UI is a tree of these nodes. Only whitelisted component types
   are ever rendered — the model can never inject arbitrary code/markup. */
export type UINode = {
  type: string;
  props?: Record<string, any>;
  children?: UINode[] | string;
};

/* Design-system components the model may use. */
const DS: Record<string, any> = {
  Button, Badge, Alert, Spinner, Avatar, Tag, StatCard, Card,
  Input, Textarea, Select, Switch, Checkbox, Radio, Tabs, Tooltip, IconButton,
};

/* Layout primitives rendered as plain styled elements. */
const LAYOUT = new Set(["Stack", "Row", "Grid", "Text", "Heading", "Spacer", "Divider", "Box"]);

function layoutStyle(type: string, props: Record<string, any> = {}): React.CSSProperties {
  const gap = props.gap ?? 12;
  switch (type) {
    case "Stack": return { display: "flex", flexDirection: "column", gap, alignItems: props.align, ...props.style };
    case "Row":   return { display: "flex", flexDirection: "row", gap, alignItems: props.align ?? "center", flexWrap: props.wrap ? "wrap" : "nowrap", justifyContent: props.justify, ...props.style };
    case "Grid":  return { display: "grid", gridTemplateColumns: `repeat(${props.columns ?? 2}, 1fr)`, gap, ...props.style };
    case "Box":   return { padding: props.padding ?? 0, ...props.style };
    default:      return { ...props.style };
  }
}

let keyCounter = 0;

export function RenderNode({ node }: { node: UINode }): React.ReactElement | null {
  if (!node || typeof node !== "object") return null;
  const { type, props = {}, children } = node;
  const key = `n${keyCounter++}`;

  const kids = typeof children === "string"
    ? children
    : Array.isArray(children)
      ? children.map((c, i) => <RenderNode key={i} node={c} />)
      : null;

  // Layout primitives
  if (LAYOUT.has(type)) {
    if (type === "Text")    return <p key={key} style={{ margin: 0, color: "var(--text-body)", font: "14px/1.6 var(--font-normal)", ...props.style }}>{kids}</p>;
    if (type === "Heading") {
      const lvl = props.level ?? 2;
      const sizes: Record<number, string> = { 1: "28px", 2: "22px", 3: "18px", 4: "16px" };
      return <div key={key} style={{ font: `700 ${sizes[lvl] ?? "22px"}/1.25 var(--font-bold)`, color: "var(--text-title)", ...props.style }}>{kids}</div>;
    }
    if (type === "Spacer")  return <div key={key} style={{ height: props.size ?? 16 }} />;
    if (type === "Divider") return <div key={key} style={{ height: 1, background: "var(--border-subtle, #e5e7eb)", width: "100%", ...props.style }} />;
    return <div key={key} style={layoutStyle(type, props)}>{kids}</div>;
  }

  // Design-system components
  const Comp = DS[type];
  if (!Comp) {
    return <div key={key} style={{ padding: 8, border: "1px dashed #d1d5db", borderRadius: 6, font: "12px var(--font-mono)", color: "#9aa0ac" }}>Unknown: {type}</div>;
  }
  const { style, ...rest } = props;
  return <Comp key={key} style={style} {...rest}>{kids}</Comp>;
}

export function RenderTree({ tree }: { tree: UINode | null }) {
  keyCounter = 0;
  if (!tree) return null;
  return <RenderNode node={tree} />;
}

/* Pretty-print the tree as copyable JSX using the same component names. */
export function treeToJSX(node: UINode | null, depth = 0): string {
  if (!node) return "";
  const pad = "  ".repeat(depth);
  const { type, props = {}, children } = node;
  const attrs = Object.entries(props)
    .filter(([k]) => k !== "style")
    .map(([k, v]) =>
      typeof v === "string" ? `${k}="${v}"` :
      typeof v === "boolean" ? (v ? k : "") :
      `${k}={${JSON.stringify(v)}}`
    )
    .filter(Boolean)
    .join(" ");
  const open = `<${type}${attrs ? " " + attrs : ""}>`;
  const close = `</${type}>`;
  if (typeof children === "string") return `${pad}${open}${children}${close}`;
  if (Array.isArray(children) && children.length) {
    const inner = children.map((c) => treeToJSX(c, depth + 1)).join("\n");
    return `${pad}${open}\n${inner}\n${pad}${close}`;
  }
  return `${pad}<${type}${attrs ? " " + attrs : ""} />`;
}
