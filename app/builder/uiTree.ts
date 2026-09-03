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

// Phase 2 (drag-to-reorder): node types that legitimately hold children for
// layout purposes, i.e. valid drop-*inside* targets — everything else (a
// Button, a Badge, an Input…) can still be dragged and reordered as a
// sibling ("before"/"after"), but can't receive a node dropped *inside* it.
// This is deliberately an editor-side allowlist, not a schema constraint —
// the UINode type itself places no restriction on what can parent what (see
// the type's own comment); enforcing it here keeps drag-drop from producing
// a structurally nonsensical tree (e.g. a Card nested inside a Badge) without
// having to validate/reject that shape everywhere else the tree is used.
export const CONTAINER_TYPES = new Set(["Stack", "Row", "Grid", "Box", "Card"]);

/** Moves the node matching `nodeId` to a new position relative to `targetId`
 * — "before"/"after" as a sibling of the target, or "inside" as the target's
 * last child (only meaningful when the target is a CONTAINER_TYPES type,
 * enforced by the caller, not this function). Returns the tree UNCHANGED
 * (not a partially-mutated one) if the move can't be completed — most
 * importantly, if `targetId` turns out to be `nodeId` itself or live inside
 * the subtree being moved (dropping a container into its own child), the
 * extract-then-reinsert below would otherwise silently delete the dragged
 * node instead of moving it, since the target it's searching for to
 * reinsert next to would no longer exist in the tree post-extraction. This
 * function refuses that outcome itself rather than relying on every caller
 * to pre-check it correctly. */
export function moveNode(tree: UINode, nodeId: string, targetId: string, position: "before" | "after" | "inside"): UINode {
  if (nodeId === targetId) return tree;

  let extracted: UINode | null = null;
  function extract(node: UINode): UINode {
    if (!Array.isArray(node.children)) return node;
    const idx = node.children.findIndex((c) => c.id === nodeId);
    if (idx !== -1) {
      extracted = node.children[idx];
      return { ...node, children: [...node.children.slice(0, idx), ...node.children.slice(idx + 1)] };
    }
    const nextChildren = node.children.map(extract);
    return nextChildren.some((c, i) => c !== (node.children as UINode[])[i]) ? { ...node, children: nextChildren } : node;
  }
  const withoutNode = extract(tree);
  if (!extracted) return tree; // nodeId not found, or was the tree root itself

  let inserted = false;
  function insertRel(node: UINode): UINode {
    if (node.id === targetId && position === "inside") {
      inserted = true;
      const kids = Array.isArray(node.children) ? node.children : [];
      return { ...node, children: [...kids, extracted as UINode] };
    }
    if (!Array.isArray(node.children)) return node;
    const idx = node.children.findIndex((c) => c.id === targetId);
    if (idx !== -1 && position !== "inside") {
      inserted = true;
      const at = position === "before" ? idx : idx + 1;
      return { ...node, children: [...node.children.slice(0, at), extracted as UINode, ...node.children.slice(at)] };
    }
    const nextChildren = node.children.map(insertRel);
    return nextChildren.some((c, i) => c !== (node.children as UINode[])[i]) ? { ...node, children: nextChildren } : node;
  }
  const result = insertRel(withoutNode);
  return inserted ? result : tree; // target vanished (e.g. was inside the dragged subtree) — refuse, don't lose the node
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
