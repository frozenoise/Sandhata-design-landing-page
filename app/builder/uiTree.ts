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
  // Stable node identity for the visual editor (selection, property edits,
  // delete). Optional and additive — existing sessions' saved trees predate
  // this field, RenderNode/treeToJSX both ignore extra keys they don't know
  // about, and `ensureIds` below lazily backfills it the first time a tree
  // enters edit mode. Deliberately NOT nested inside `props`: `props` gets
  // spread via {...rest} onto real DS components' DOM/props in Renderer.tsx,
  // so an id living there could leak into e.g. an <input> as an invalid
  // attribute, or collide with a real component prop.
  id?: string;
};

// ── Visual editor: pure tree-mutation helpers ────────────────────────────
// All of these return a NEW tree (structural clone along the changed path,
// untouched siblings/subtrees reused) rather than mutating in place — `tree`
// lives in a single React.useState in app/builder/page.tsx, so every commit
// needs to be a fresh reference for React to see the change and for the
// undo/redo snapshot stack (also in page.tsx) to hold meaningfully distinct
// states.

let idCounter = 0;
// Not crypto.randomUUID(): this file is deliberately import-free (see the
// header comment) so it stays safe to use from any server runtime without
// assuming a particular global is present. Doesn't need to be
// cryptographically unique — only unique within one tree, for one editing
// session.
function genNodeId(): string {
  idCounter += 1;
  return `n${Date.now().toString(36)}${idCounter.toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/** Backfills `id` on every node that doesn't already have one. Returns the
 * same reference if the tree was already fully id'd (cheap no-op check),
 * otherwise a new tree — same immutability contract as the rest of this file. */
export function ensureIds(node: UINode): UINode {
  const kids = Array.isArray(node.children) ? node.children.map(ensureIds) : node.children;
  const kidsChanged = Array.isArray(node.children) && Array.isArray(kids)
    && kids.some((k, i) => k !== (node.children as UINode[])[i]);
  if (node.id && !kidsChanged) return node;
  return { ...node, id: node.id ?? genNodeId(), children: kids };
}

export function findNodeById(node: UINode | null, id: string): UINode | null {
  if (!node) return null;
  if (node.id === id) return node;
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
  }
  return null;
}

/** Merges `patch` into the target node's `props` (shallow merge — a field
 * set to `undefined` removes that prop, matching how the property panel's
 * "clear" affordance for an optional field should behave). */
export function updateNodeProps(node: UINode, id: string, patch: Record<string, any>): UINode {
  if (node.id === id) {
    const nextProps = { ...(node.props ?? {}), ...patch };
    for (const k of Object.keys(patch)) if (patch[k] === undefined) delete nextProps[k];
    return { ...node, props: nextProps };
  }
  if (Array.isArray(node.children)) {
    const nextChildren = node.children.map((c) => updateNodeProps(c, id, patch));
    if (nextChildren.some((c, i) => c !== (node.children as UINode[])[i])) {
      return { ...node, children: nextChildren };
    }
  }
  return node;
}

/** Replaces a leaf node's plain-string children (its text content) — kept
 * separate from updateNodeProps since `children` is a sibling field on
 * UINode, not something living inside `props`. */
export function updateNodeText(node: UINode, id: string, text: string): UINode {
  if (node.id === id) return { ...node, children: text };
  if (Array.isArray(node.children)) {
    const nextChildren = node.children.map((c) => updateNodeText(c, id, text));
    if (nextChildren.some((c, i) => c !== (node.children as UINode[])[i])) {
      return { ...node, children: nextChildren };
    }
  }
  return node;
}

/** Removes the node matching `id` from the tree. Returns `null` if `id`
 * matched the root itself (deleting the whole page) — callers should treat
 * that as "clear the canvas", same as the existing reset()/New flow. */
export function removeNodeById(node: UINode, id: string): UINode | null {
  if (node.id === id) return null;
  if (Array.isArray(node.children)) {
    const nextChildren = node.children
      .map((c) => (c.id === id ? null : removeNodeById(c, id)))
      .filter((c): c is UINode => c !== null);
    if (nextChildren.length !== node.children.length || nextChildren.some((c, i) => c !== (node.children as UINode[])[i])) {
      return { ...node, children: nextChildren };
    }
  }
  return node;
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
