// Common workspace: how a page's UINode tree is shared between people
// editing it at the same time. No React and no Liveblocks imports here, so
// the diff logic can be tested on its own (liveRoom.ts applies these ops to
// Liveblocks storage).
//
// The tree is stored flat ("normalized"): one entry per node, keyed by node
// id, with each container holding an ordered list of child ids. Every local
// edit is turned into the smallest set of per-node ops (change one prop,
// insert one child id...) rather than "replace the whole tree". That's what
// lets two people edit different elements of the same page at the same time
// without one overwriting the other: Liveblocks merges per field and per
// list position, so only edits to the very same field of the very same node
// are last-writer-wins.

import type { UINode } from "./uiTree";

export type NormNode = {
  type: string;
  props: Record<string, any>;
  /** Set when the node's children are a text string (Text, Button label...). */
  text: string | null;
  /** Set when the node's children are other nodes; null for text/leaf nodes. */
  children: string[] | null;
};
export type NormTree = { rootId: string | null; nodes: Record<string, NormNode> };

export type TreeOp =
  | { op: "setRoot"; rootId: string | null }
  | { op: "addNode"; id: string; node: NormNode }
  | { op: "removeNode"; id: string }
  | { op: "setType"; id: string; type: string }
  | { op: "setProp"; id: string; key: string; value: any }
  | { op: "deleteProp"; id: string; key: string }
  | { op: "setText"; id: string; text: string | null }
  | { op: "childInsert"; id: string; index: number; childId: string }
  | { op: "childDelete"; id: string; index: number }
  | { op: "childMove"; id: string; from: number; to: number }
  | { op: "childReplace"; id: string; children: string[] | null };

/** Flattens a tree. Every node must already have an id (run ensureIds first).
 * A repeated id keeps its first occurrence only, so a malformed tree can't
 * produce a node listed under two parents. */
export function normalize(tree: UINode | null): NormTree {
  const nodes: Record<string, NormNode> = {};
  if (!tree) return { rootId: null, nodes };
  function walk(n: UINode): string | null {
    if (!n.id || nodes[n.id]) return null;
    // undefined props are dropped: they don't survive JSON (or Liveblocks
    // storage) anyway, and keeping them would make every diff see a change.
    const props = Object.fromEntries(Object.entries(n.props ?? {}).filter(([, v]) => v !== undefined));
    const entry: NormNode = { type: n.type, props, text: null, children: null };
    nodes[n.id] = entry;
    if (typeof n.children === "string") entry.text = n.children;
    else if (Array.isArray(n.children)) entry.children = n.children.map(walk).filter((c): c is string => c !== null);
    return n.id;
  }
  return { rootId: walk(tree), nodes };
}

/** Rebuilds a tree from the flat form. Tolerates the states concurrent edits
 * can leave behind: a child id with no node (someone deleted it) is skipped,
 * and a node reachable twice (two people moved it to different places at the
 * same moment) is shown only at its first position. */
export function denormalize(norm: NormTree): UINode | null {
  if (!norm.rootId || !norm.nodes[norm.rootId]) return null;
  const seen = new Set<string>();
  function build(id: string): UINode | null {
    const n = norm.nodes[id];
    if (!n || seen.has(id)) return null;
    seen.add(id);
    const out: UINode = { id, type: n.type };
    if (Object.keys(n.props).length > 0) out.props = { ...n.props };
    if (n.text !== null) out.children = n.text;
    else if (n.children) out.children = n.children.map(build).filter((c): c is UINode => c !== null);
    return out;
  }
  return build(norm.rootId);
}

function sameJson(a: any, b: any): boolean {
  return a === b || JSON.stringify(a) === JSON.stringify(b);
}

/** Smallest list edit turning `prev` into `next`: one insert, one delete, one
 * move, or (anything bigger) a full replace. Single-step edits are what the
 * visual editor produces and are the ones worth merging precisely. */
export function diffChildren(id: string, prev: string[], next: string[]): TreeOp[] {
  if (prev.length === next.length && prev.every((c, i) => c === next[i])) return [];
  if (next.length === prev.length + 1) {
    for (let i = 0; i < next.length; i++) {
      if (prev.every((c, j) => c === next[j < i ? j : j + 1])) return [{ op: "childInsert", id, index: i, childId: next[i] }];
    }
  }
  if (prev.length === next.length + 1) {
    for (let i = 0; i < prev.length; i++) {
      if (next.every((c, j) => c === prev[j < i ? j : j + 1])) return [{ op: "childDelete", id, index: i }];
    }
  }
  if (prev.length === next.length && prev.length <= 80) {
    for (let from = 0; from < prev.length; from++) {
      const to = next.indexOf(prev[from]);
      if (to === -1 || to === from) continue;
      const moved = prev.slice();
      moved.splice(from, 1);
      moved.splice(to, 0, prev[from]);
      if (moved.every((c, i) => c === next[i])) return [{ op: "childMove", id, from, to }];
    }
  }
  return [{ op: "childReplace", id, children: next.slice() }];
}

/** Ops that turn `prev` into `next`. New nodes are added before anything
 * references them and removed nodes are deleted last, so applying the ops in
 * order never leaves a child id pointing at nothing mid-batch. */
export function diffTrees(prev: NormTree, next: NormTree): TreeOp[] {
  const ops: TreeOp[] = [];
  for (const [id, n] of Object.entries(next.nodes)) {
    if (!prev.nodes[id]) ops.push({ op: "addNode", id, node: { ...n, props: { ...n.props }, children: n.children ? n.children.slice() : null } });
  }
  for (const [id, n] of Object.entries(next.nodes)) {
    const p = prev.nodes[id];
    if (!p) continue;
    if (p.type !== n.type) ops.push({ op: "setType", id, type: n.type });
    for (const [k, v] of Object.entries(n.props)) if (!(k in p.props) || !sameJson(p.props[k], v)) ops.push({ op: "setProp", id, key: k, value: v });
    for (const k of Object.keys(p.props)) if (!(k in n.props)) ops.push({ op: "deleteProp", id, key: k });
    if (p.text !== n.text) ops.push({ op: "setText", id, text: n.text });
    if (p.children && n.children) ops.push(...diffChildren(id, p.children, n.children));
    else if (p.children !== n.children) ops.push({ op: "childReplace", id, children: n.children ? n.children.slice() : null });
  }
  if (prev.rootId !== next.rootId) ops.push({ op: "setRoot", rootId: next.rootId });
  for (const id of Object.keys(prev.nodes)) if (!next.nodes[id]) ops.push({ op: "removeNode", id });
  return ops;
}

/** Applies ops to a plain NormTree (mutating it). The Liveblocks version in
 * liveRoom.ts mirrors this one op for op; this one exists so the diff can be
 * tested by round-tripping (diff then apply must equal the target). */
export function applyOpsToNorm(norm: NormTree, ops: TreeOp[]): NormTree {
  for (const o of ops) {
    const n = "id" in o ? norm.nodes[o.id] : undefined;
    switch (o.op) {
      case "setRoot": norm.rootId = o.rootId; break;
      case "addNode": norm.nodes[o.id] = { ...o.node, props: { ...o.node.props }, children: o.node.children ? o.node.children.slice() : null }; break;
      case "removeNode": delete norm.nodes[o.id]; break;
      case "setType": if (n) n.type = o.type; break;
      case "setProp": if (n) n.props[o.key] = o.value; break;
      case "deleteProp": if (n) delete n.props[o.key]; break;
      case "setText": if (n) n.text = o.text; break;
      case "childInsert": if (n?.children) n.children.splice(Math.min(o.index, n.children.length), 0, o.childId); break;
      case "childDelete": if (n?.children) n.children.splice(o.index, 1); break;
      case "childMove": if (n?.children) { const [c] = n.children.splice(o.from, 1); n.children.splice(o.to, 0, c); } break;
      case "childReplace": if (n) n.children = o.children ? o.children.slice() : null; break;
    }
  }
  return norm;
}
