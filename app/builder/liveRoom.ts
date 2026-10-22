"use client";

// Common workspace: keeps one open page in sync between everyone who has it
// open, through a Liveblocks room per page ("spectra:page:<sessionId>").
// The builder page keeps owning its own `tree` and `msgs` state exactly as
// before; this hook mirrors local changes into the room as per-node ops
// (realtimeTree.ts) and pushes everyone else's changes back into that state.
// When `roomId` is null (page not shared, signed out, unsaved draft) it does
// nothing at all, so single-user use is untouched.

import * as React from "react";
import { createClient, LiveList, LiveMap, LiveObject, type Json, type LsonObject } from "@liveblocks/client";
import type { UINode } from "./uiTree";
import { ensureIds } from "./uiTree";
import { normalize, denormalize, diffTrees, type NormTree, type NormNode, type TreeOp } from "./realtimeTree";

// Storage shape: { rootId, nodes: LiveMap<id, LiveObject<{ type, props:
// LiveObject, text, children: LiveList<string> | null }>>, msgs: LiveList }.
// Liveblocks' generic types are invariant in ways that reject this nesting,
// so storage is typed loosely here and accessed through the helpers below.
type LiveNode = LiveObject<LsonObject>;
type Storage = LsonObject;
type Presence = { selectedNodeId: string | null };
type UserMeta = { id: string; info: { name: string; avatar: string | null; color: string } };
type PageRoom = ReturnType<ReturnType<typeof createClient>["enterRoom"]>["room"];

export const ROOM_PREFIX = "spectra:page:";

export type Collaborator = { connectionId: number; name: string; avatar: string | null; color: string; selectedNodeId: string | null };
export type LiveStatus = "off" | "connecting" | "live" | "reconnecting" | "error";

let client: ReturnType<typeof createClient> | null = null;
function getClient() {
  if (!client) {
    client = createClient({
      authEndpoint: "/api/liveblocks-auth",
      // Set only when running against the local Liveblocks dev server
      // (`npm run dev:live`); production uses Liveblocks' own servers.
      baseUrl: process.env.NEXT_PUBLIC_LIVEBLOCKS_BASE_URL || undefined,
      throttle: 50,
    });
  }
  return client;
}

function toLiveNode(n: NormNode): LiveNode {
  return new LiveObject<LsonObject>({
    type: n.type,
    props: new LiveObject(n.props as Record<string, Json>) as any,
    text: n.text,
    children: n.children ? new LiveList<string>(n.children) as any : null,
  });
}
const nodesOf = (root: LiveObject<Storage>) => root.get("nodes") as unknown as LiveMap<string, LiveNode>;
const msgsOf = (root: LiveObject<Storage>) => root.get("msgs") as unknown as LiveList<Json>;
const propsOf = (n: LiveNode) => n.get("props") as unknown as LiveObject<Record<string, Json>>;
const kidsOf = (n: LiveNode | undefined) => (n?.get("children") ?? null) as unknown as LiveList<string> | null;

function initialStorage(tree: UINode | null, msgs: unknown[]): Storage {
  const norm = normalize(tree);
  return {
    rootId: norm.rootId,
    nodes: new LiveMap<string, LiveNode>(Object.entries(norm.nodes).map(([id, n]) => [id, toLiveNode(n)] as [string, LiveNode])) as any,
    msgs: new LiveList<Json>(msgs as Json[]) as any,
  };
}

function readNorm(root: LiveObject<Storage>): NormTree {
  const nodes: Record<string, NormNode> = {};
  nodesOf(root).forEach((n, id) => {
    const children = kidsOf(n);
    nodes[id] = {
      type: n.get("type") as string,
      props: { ...(propsOf(n).toJSON() as Record<string, any>) },
      text: (n.get("text") ?? null) as string | null,
      children: children ? children.map(c => c) : null,
    };
  });
  return { rootId: (root.get("rootId") ?? null) as string | null, nodes };
}

function applyOps(root: LiveObject<Storage>, ops: TreeOp[]) {
  const nodes = nodesOf(root);
  for (const o of ops) {
    const n = "id" in o ? nodes.get(o.id) : undefined;
    switch (o.op) {
      case "setRoot": root.set("rootId", o.rootId); break;
      case "addNode": nodes.set(o.id, toLiveNode(o.node)); break;
      case "removeNode": nodes.delete(o.id); break;
      case "setType": n?.set("type", o.type); break;
      case "setProp": if (n) propsOf(n).set(o.key, o.value as Json); break;
      case "deleteProp": if (n) propsOf(n).delete(o.key); break;
      case "setText": n?.set("text", o.text); break;
      case "childInsert": { const l = kidsOf(n); if (l) l.insert(o.childId, Math.min(o.index, l.length)); break; }
      case "childDelete": { const l = kidsOf(n); if (l && o.index < l.length) l.delete(o.index); break; }
      case "childMove": { const l = kidsOf(n); if (l && o.from < l.length) l.move(o.from, Math.min(o.to, l.length - 1)); break; }
      case "childReplace": n?.set("children", o.children ? new LiveList<string>(o.children) as any : null); break;
    }
  }
}

export function useLivePage<M>({
  roomId, loadSeed, canWrite, tree, setTree, msgs, setMsgs, selectedNodeId,
}: {
  roomId: string | null;
  /** The page as saved in the database. Only used to seed a room that has
   * no storage yet; never seeded from whatever the browser happens to hold,
   * which may be empty or stale (e.g. a tab restored from localStorage). */
  loadSeed: () => Promise<{ tree: UINode | null; msgs: M[] } | null>;
  canWrite: boolean;
  tree: UINode | null;
  setTree: (t: UINode | null) => void;
  msgs: M[];
  setMsgs: (m: M[]) => void;
  selectedNodeId: string | null;
}) {
  const [status, setStatus] = React.useState<LiveStatus>("off");
  const [others, setOthers] = React.useState<Collaborator[]>([]);
  const [canUndo, setCanUndo] = React.useState(false);
  const [canRedo, setCanRedo] = React.useState(false);
  const roomRef = React.useRef<PageRoom | null>(null);
  const rootRef = React.useRef<LiveObject<Storage> | null>(null);
  // The last tree / msgs this hook itself put into React state from the
  // room. A local change is anything else, and only that gets pushed — this
  // is what stops a remote update from echoing straight back as an edit.
  const appliedTreeRef = React.useRef<UINode | null | undefined>(undefined);
  const appliedMsgsRef = React.useRef<M[] | undefined>(undefined);
  const loadSeedRef = React.useRef(loadSeed);
  loadSeedRef.current = loadSeed;

  React.useEffect(() => {
    if (!roomId) { setStatus("off"); setOthers([]); return; }
    setStatus("connecting");
    let cancelled = false;
    let leave: (() => void) | null = null;
    const unsubs: Array<() => void> = [];

    (async () => {
      // initialStorage is applied by Liveblocks only if the room has no storage
      // yet (the first person to open this shared page), atomically, so two
      // people opening it at once can't both seed it.
      const seed = await loadSeedRef.current().catch(() => null);
      if (cancelled) return;
      if (!seed) { setStatus("error"); return; }
      const entered = getClient().enterRoom<Presence, Storage>(roomId, {
        initialPresence: { selectedNodeId: null },
        initialStorage: initialStorage(seed.tree ? ensureIds(seed.tree) : null, seed.msgs as unknown[]),
      });
      const room = entered.room;
      leave = entered.leave;
      roomRef.current = room;

      const pull = () => {
        const root = rootRef.current;
        if (!root) return;
        const t = denormalize(readNorm(root));
        const m = msgsOf(root).toJSON() as unknown as M[];
        appliedTreeRef.current = t;
        appliedMsgsRef.current = m;
        setTree(t);
        setMsgs(m);
      };

      unsubs.push(room.subscribe("status", s => {
        if (s === "connected") setStatus("live");
        else if (s === "reconnecting") setStatus("reconnecting");
        else if (s === "disconnected") setStatus("error");
      }));
      unsubs.push(room.subscribe("others", list => {
        setOthers(list.map(o => ({
          connectionId: o.connectionId,
          name: String(o.info?.name ?? "Someone"),
          avatar: o.info?.avatar ? String(o.info.avatar) : null,
          color: String(o.info?.color ?? "#3B68FF"),
          selectedNodeId: o.presence?.selectedNodeId ?? null,
        })));
      }));
      unsubs.push(room.subscribe("history", h => { setCanUndo(h.canUndo); setCanRedo(h.canRedo); }));
      unsubs.push(room.subscribe("error", () => setStatus("error")));

      room.getStorage().then(({ root }) => {
        if (cancelled) return;
        rootRef.current = root;
        pull();
        unsubs.push(room.subscribe(root, pull, { isDeep: true }));
      }).catch(() => { if (!cancelled) setStatus("error"); });
    })();

    return () => {
      cancelled = true;
      unsubs.forEach(u => u());
      leave?.();
      roomRef.current = null;
      rootRef.current = null;
      appliedTreeRef.current = undefined;
      appliedMsgsRef.current = undefined;
      setOthers([]);
      setCanUndo(false);
      setCanRedo(false);
    };
    // setTree/setMsgs are React state setters (stable).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  // Push local tree changes as per-node ops, one batch (= one undo step) each.
  React.useEffect(() => {
    const room = roomRef.current, root = rootRef.current;
    if (!room || !root || !canWrite || tree === appliedTreeRef.current) return;
    const withIds = tree ? ensureIds(tree) : null;
    if (withIds !== tree) { setTree(withIds); return; } // ids first; this effect re-runs
    const ops = diffTrees(readNorm(root), normalize(tree));
    if (ops.length > 0) room.batch(() => applyOps(root, ops));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tree, canWrite]);

  // Push chat messages. Normally new messages are appended, which merges
  // cleanly when two people send at once; anything else (cleared chat,
  // rewritten history) replaces the list.
  React.useEffect(() => {
    const room = roomRef.current, root = rootRef.current;
    if (!room || !root || !canWrite || msgs === appliedMsgsRef.current) return;
    const list = msgsOf(root);
    const remote = list.toJSON() as unknown[];
    const sameStart = remote.length <= msgs.length && remote.every((r, i) => JSON.stringify(r) === JSON.stringify(msgs[i]));
    room.batch(() => {
      if (sameStart) msgs.slice(remote.length).forEach(m => list.push(m as unknown as Json));
      else { list.clear(); msgs.forEach(m => list.push(m as unknown as Json)); }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msgs, canWrite]);

  React.useEffect(() => {
    roomRef.current?.updatePresence({ selectedNodeId });
  }, [selectedNodeId, status]);

  const undo = React.useCallback(() => roomRef.current?.history.undo(), []);
  const redo = React.useCallback(() => roomRef.current?.history.redo(), []);
  // Called when entering Edit view, so undo there only walks back edits made
  // in that visit (same scope as the single-user undo stack), never an
  // earlier chat message append.
  const clearHistory = React.useCallback(() => roomRef.current?.history.clear(), []);

  return { live: status !== "off", status, others, canUndo, canRedo, undo, redo, clearHistory };
}
