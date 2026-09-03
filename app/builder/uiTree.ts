// Pure, server-safe UINode tree helpers — no React, no "use client" directive,
// so this file can be imported from API route handlers (e.g. app/api/github/push)
// as well as from the client-side Renderer/page. Keep it that way: don't add
// a React or @sandhata/spectra import here — that's what Renderer.tsx is for.

/* A generated UI is a tree of these nodes. Only whitelisted component types
   are ever rendered — the model can never inject arbitrary code/markup. */
export type UINode = {
  type: string;
  props?: Record<string, any>;
  children?: UINode[] | string;
};

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
