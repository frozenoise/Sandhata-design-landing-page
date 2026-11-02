// Pure, server-safe UINode tree helpers - no React, no "use client" directive,
// so this file can be imported from API route handlers (e.g. app/api/github/push)
// as well as from the client-side Renderer/page. Keep it that way: don't add
// a React or @sandhata/spectra import here - that's what Renderer.tsx is for.

/* A generated UI is a tree of these nodes. Only whitelisted component types
   are ever rendered - the model can never inject arbitrary code/markup. */
export type UINode = {
  type: string;
  props?: Record<string, any>;
  children?: UINode[] | string;
  // Stable node identity for the visual editor (selection, property edits,
  // delete). Optional and additive - existing sessions' saved trees predate
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
// untouched siblings/subtrees reused) rather than mutating in place - `tree`
// lives in a single React.useState in app/builder/page.tsx, so every commit
// needs to be a fresh reference for React to see the change and for the
// undo/redo snapshot stack (also in page.tsx) to hold meaningfully distinct
// states.

let idCounter = 0;
// Not crypto.randomUUID(): this file is deliberately import-free (see the
// header comment) so it stays safe to use from any server runtime without
// assuming a particular global is present. Doesn't need to be
// cryptographically unique - only unique within one tree, for one editing
// session.
function genNodeId(): string {
  idCounter += 1;
  return `n${Date.now().toString(36)}${idCounter.toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/** Builds a fresh node with a real id - the palette's insert-a-new-component
 * path (Phase 3) uses this instead of writing `{ id: undefined, ... }` and
 * relying on a later ensureIds pass, since the node needs a real id
 * immediately (to select it right after insertion, before any re-render). */
export function createNode(type: string, props?: Record<string, any>, children?: UINode[] | string): UINode {
  return { id: genNodeId(), type, props, children };
}

/** Backfills `id` on every node that doesn't already have one. Returns the
 * same reference if the tree was already fully id'd (cheap no-op check),
 * otherwise a new tree - same immutability contract as the rest of this file. */
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

/** The node whose children include `id`, or null for the root / a missing id. */
export function findParent(node: UINode | null, id: string): UINode | null {
  if (!node || !Array.isArray(node.children)) return null;
  for (const child of node.children) {
    if (child.id === id) return node;
    const found = findParent(child, id);
    if (found) return found;
  }
  return null;
}

/** Deep copy with fresh ids on every node, so a duplicate never shares
 * identity (selection, live-room entries) with the original. */
export function cloneWithNewIds(node: UINode): UINode {
  return {
    ...node,
    id: genNodeId(),
    props: node.props ? { ...node.props } : node.props,
    children: Array.isArray(node.children) ? node.children.map(cloneWithNewIds) : node.children,
  };
}

/** First text found in a subtree (depth-first), for short human labels. */
export function firstText(node: UINode | null): string | null {
  if (!node) return null;
  if (typeof node.children === "string") return node.children;
  if (Array.isArray(node.children)) {
    for (const c of node.children) { const t = firstText(c); if (t) return t; }
  }
  for (const k of ["title", "label", "placeholder"]) {
    if (typeof node.props?.[k] === "string" && node.props[k]) return node.props[k];
  }
  return null;
}

/** Merges `patch` into the target node's `props` (shallow merge - a field
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

/** Replaces a leaf node's plain-string children (its text content) - kept
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
 * matched the root itself (deleting the whole page) - callers should treat
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
// layout purposes, i.e. valid drop-*inside* targets - everything else (a
// Button, a Badge, an Input…) can still be dragged and reordered as a
// sibling ("before"/"after"), but can't receive a node dropped *inside* it.
// This is deliberately an editor-side allowlist, not a schema constraint -
// the UINode type itself places no restriction on what can parent what (see
// the type's own comment); enforcing it here keeps drag-drop from producing
// a structurally nonsensical tree (e.g. a Card nested inside a Badge) without
// having to validate/reject that shape everywhere else the tree is used.
export const CONTAINER_TYPES = new Set(["Stack", "Row", "Grid", "Box", "Card"]);

/** Shared by moveNode (Phase 2) and insertNodeAt (Phase 3) - both ultimately
 * do the same "place this node before/after/inside a target" walk, just with
 * a node that already existed elsewhere in the tree (moveNode, after
 * extracting it) vs. one that's brand new (insertNodeAt). Kept as one
 * function so the two never drift out of sync with each other. */
function insertRelativeTo(tree: UINode, targetId: string, position: "before" | "after" | "inside", node: UINode): { tree: UINode; inserted: boolean } {
  let inserted = false;
  function walk(n: UINode): UINode {
    if (n.id === targetId && position === "inside") {
      inserted = true;
      const kids = Array.isArray(n.children) ? n.children : [];
      return { ...n, children: [...kids, node] };
    }
    if (!Array.isArray(n.children)) return n;
    const idx = n.children.findIndex((c) => c.id === targetId);
    if (idx !== -1 && position !== "inside") {
      inserted = true;
      const at = position === "before" ? idx : idx + 1;
      return { ...n, children: [...n.children.slice(0, at), node, ...n.children.slice(at)] };
    }
    const nextChildren = n.children.map(walk);
    return nextChildren.some((c, i) => c !== (n.children as UINode[])[i]) ? { ...n, children: nextChildren } : n;
  }
  return { tree: walk(tree), inserted };
}

/** Inserts a brand-new node (from the Phase 3 component palette - build one
 * with `createNode`, not by hand, so it gets a real id) relative to
 * `targetId`. Returns the tree UNCHANGED if `targetId` doesn't exist. */
export function insertNodeAt(tree: UINode, targetId: string, position: "before" | "after" | "inside", node: UINode): UINode {
  const { tree: result, inserted } = insertRelativeTo(tree, targetId, position, node);
  return inserted ? result : tree;
}

/** Moves the node matching `nodeId` to a new position relative to `targetId`
 * - "before"/"after" as a sibling of the target, or "inside" as the target's
 * last child (only meaningful when the target is a CONTAINER_TYPES type,
 * enforced by the caller, not this function). Returns the tree UNCHANGED
 * (not a partially-mutated one) if the move can't be completed - most
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

  const { tree: result, inserted } = insertRelativeTo(withoutNode, targetId, position, extracted);
  return inserted ? result : tree; // target vanished (e.g. was inside the dragged subtree) - refuse, don't lose the node
}

/* Pretty-print the tree as copyable JSX using the same component names. */
// ── Design-system audit ──────────────────────────────────────────────────
// The single source of truth for "what counts as a governed element" - kept
// here (not in Renderer.tsx) so this file's own no-React/no-@sandhata/spectra
// constraint (see header) still lets a server route reuse it, and so there's
// exactly one list to update when a component is added. Renderer.tsx imports
// LAYOUT_TYPES/DS_COMPONENT_TYPES rather than redeclaring them, and asserts
// in dev that its own DS component map agrees - see the comment there.
export const LAYOUT_TYPES = ["Stack", "Row", "Grid", "Text", "Heading", "Spacer", "Divider", "Box"] as const;
export const DS_COMPONENT_TYPES = [
  "Button", "Badge", "Alert", "Spinner", "Avatar", "Tag", "StatCard", "Card",
  "Input", "Textarea", "Select", "Switch", "Checkbox", "Radio", "Tabs", "Tooltip", "IconButton",
] as const;
export const KNOWN_TYPES: ReadonlySet<string> = new Set<string>([...LAYOUT_TYPES, ...DS_COMPONENT_TYPES]);

export type AuditIssue = {
  nodeId: string | null;
  type: string;
  /** Breadcrumb of ancestor types down to and including this node, e.g. "Stack > Row > WeirdWidget". */
  path: string;
};

/** Walks a generated/edited tree and reports every node whose `type` isn't
 * a governed Spectra component or layout primitive - i.e. something outside
 * the design system. This is the same check Renderer.tsx's "Unknown: {type}"
 * fallback makes per-node at render time, surfaced instead as a standalone
 * report a human (or CI) can act on. Order is depth-first, matching render
 * order, so the report reads top-to-bottom the way the canvas does. */
export function auditTree(node: UINode | null, ancestry: string[] = []): AuditIssue[] {
  if (!node || typeof node !== "object" || !node.type) return [];
  const here = [...ancestry, node.type];
  const issues: AuditIssue[] = [];
  if (!KNOWN_TYPES.has(node.type)) {
    issues.push({ nodeId: node.id ?? null, type: node.type, path: here.join(" > ") });
  }
  if (Array.isArray(node.children)) {
    for (const child of node.children) issues.push(...auditTree(child, here));
  }
  return issues;
}

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
