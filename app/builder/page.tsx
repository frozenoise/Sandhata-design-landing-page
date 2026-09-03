"use client";

import React from "react";
import JSZip from "jszip";
import { useSession, signIn, signOut } from "next-auth/react";
import "../_docs/docs.css";
import "./builder.css";
import { SdTopNav } from "../_docs/shell";
import { RenderTree, treeToJSX, type UINode } from "./Renderer";

type ChatMsg = {
  role: "user" | "assistant";
  content: string;
  label?: string;
  tree?: UINode;
  isError?: boolean;
  errorText?: string;
};

type HistoryItem = {
  id: string;
  name: string;
  updatedAt: string;
  createdAt: string;
  projectId: string | null;
};

type ProjectItem = {
  id: string;
  name: string;
  updatedAt: string;
  createdAt: string;
  sessionCount: number;
};

const EXAMPLES = [
  "A login form with email, password, remember me, and a primary sign-in button",
  "A pricing section with three plan cards and a recommended badge",
  "A settings panel with profile fields, notification switches, and save/cancel",
  "A dashboard header with three stat cards and a status alert",
];

const KEY_STORAGE        = "sd-builder-api-key";
const MSGS_STORAGE       = "sd-builder-msgs";
const TREE_STORAGE       = "sd-builder-tree";
const SESSION_ID_STORAGE = "sd-builder-session-id";
const PROJECT_ID_STORAGE = "sd-builder-project-id";

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const CheckIcon    = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>);
const SendIcon     = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>);
const MobileIcon   = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="7" y="2" width="10" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>);
const TabletIcon   = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>);
const DesktopIcon  = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>);
const HistoryIcon  = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>);
const UserIcon     = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const KeyIcon      = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="M10.5 12.5L21 2"/><path d="M18 5l3 3M15 8l3 3"/></svg>);
const XIcon        = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
const DownloadIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>);
const GoogleIcon   = () => (<svg width="14" height="14" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>);
const GithubIcon   = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>);
const FolderIcon   = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/></svg>);
const ChevronIcon  = () => (<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>);
const PlusIcon     = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>);

export default function BuilderPage() {
  const { data: session, status } = useSession();
  const isLoggedIn  = status === "authenticated";
  const authLoading = status === "loading";

  const [msgs,          setMsgs]          = React.useState<ChatMsg[]>([]);
  const [input,         setInput]         = React.useState("");
  const [loading,       setLoading]       = React.useState(false);
  const [apiKey,        setApiKey]        = React.useState("");
  const [keyDraft,      setKeyDraft]      = React.useState("");
  const [needsKey,      setNeedsKey]      = React.useState(false);
  const [tree,          setTree]          = React.useState<UINode | null>(null);
  const [view,          setView]          = React.useState<"preview" | "code">("preview");
  const [viewport,      setViewport]      = React.useState<"mobile" | "tablet" | "desktop">("tablet");
  const [dbSessionId,   setDbSessionId]   = React.useState<string | null>(null);
  const [history,       setHistory]       = React.useState<HistoryItem[]>([]);
  const [showHistory,   setShowHistory]   = React.useState(false);
  const [histLoading,   setHistLoading]   = React.useState(false);
  const [projects,        setProjects]        = React.useState<ProjectItem[]>([]);
  const [projLoading,     setProjLoading]     = React.useState(false);
  const [activeProjectId, setActiveProjectId] = React.useState<string | null>(null);
  const [expandedProjects, setExpandedProjects] = React.useState<Set<string>>(new Set());
  const [showNewProject,  setShowNewProject]  = React.useState(false);
  const [newProjectName,  setNewProjectName]  = React.useState("");
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [showProfile,   setShowProfile]   = React.useState(false);
  const [hasAccountKey, setHasAccountKey] = React.useState(false);
  const [keySaved,      setKeySaved]      = React.useState(false);

  const chatRef    = React.useRef<HTMLDivElement>(null);
  const inputRef   = React.useRef<HTMLTextAreaElement>(null);
  const profileRef = React.useRef<HTMLDivElement>(null);
  const keySaveTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Mount: restore localStorage ─────────────────────────────────────────
  React.useEffect(() => {
    const savedKey = localStorage.getItem(KEY_STORAGE) || "";
    setApiKey(savedKey);
    setKeyDraft(savedKey);

    try {
      const rawMsgs = localStorage.getItem(MSGS_STORAGE);
      if (rawMsgs) setMsgs(JSON.parse(rawMsgs));
    } catch {}

    try {
      const rawTree = localStorage.getItem(TREE_STORAGE);
      if (rawTree) setTree(JSON.parse(rawTree));
    } catch {}

    const savedId = localStorage.getItem(SESSION_ID_STORAGE);
    if (savedId) setDbSessionId(savedId);

    const savedProjectId = localStorage.getItem(PROJECT_ID_STORAGE);
    if (savedProjectId) setActiveProjectId(savedProjectId);
  }, []);

  // ── Auth modal: show once per session for unauthenticated users ────────
  React.useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) {
      const dismissed = sessionStorage.getItem("sd-builder-auth-modal-dismissed") === "1";
      if (!dismissed) setShowAuthModal(true);
    }
  }, [authLoading, isLoggedIn]);

  // ── Auto-dismiss modal when user successfully signs in ──────────────────
  React.useEffect(() => {
    if (isLoggedIn) setShowAuthModal(false);
  }, [isLoggedIn]);

  // ── Persist to localStorage on change ──────────────────────────────────
  React.useEffect(() => {
    msgs.length > 0
      ? localStorage.setItem(MSGS_STORAGE, JSON.stringify(msgs))
      : localStorage.removeItem(MSGS_STORAGE);
  }, [msgs]);

  React.useEffect(() => {
    tree
      ? localStorage.setItem(TREE_STORAGE, JSON.stringify(tree))
      : localStorage.removeItem(TREE_STORAGE);
  }, [tree]);

  React.useEffect(() => {
    activeProjectId
      ? localStorage.setItem(PROJECT_ID_STORAGE, activeProjectId)
      : localStorage.removeItem(PROJECT_ID_STORAGE);
  }, [activeProjectId]);

  // ── Load history + projects when authenticated ───────────────────────────
  React.useEffect(() => {
    if (isLoggedIn) { loadHistory(); loadProjects(); }
    else { setHistory([]); setProjects([]); }
  }, [isLoggedIn]);

  // ── Clear any pending debounced key-save on unmount ──────────────────────
  React.useEffect(() => () => { if (keySaveTimer.current) clearTimeout(keySaveTimer.current); }, []);

  // ── Load account-linked key status when authenticated ───────────────────
  React.useEffect(() => {
    if (!isLoggedIn) { setHasAccountKey(false); return; }
    fetch("/api/account/key")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setHasAccountKey(!!d.hasKey); })
      .catch(() => {});
  }, [isLoggedIn]);

  // ── Profile menu: close on outside click / Escape ────────────────────────
  React.useEffect(() => {
    if (!showProfile) return;
    const onDocDown = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setShowProfile(false); };
    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [showProfile]);

  // ── Scroll chat ─────────────────────────────────────────────────────────
  React.useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [msgs, loading]);

  // ── History helpers ─────────────────────────────────────────────────────
  async function loadHistory() {
    setHistLoading(true);
    try {
      const res = await fetch("/api/sessions");
      if (res.ok) {
        const d = await res.json();
        setHistory(d.sessions ?? []);
      }
    } finally {
      setHistLoading(false);
    }
  }

  async function loadSession(id: string) {
    setShowHistory(false);
    const res = await fetch(`/api/sessions/${id}`);
    if (!res.ok) return;
    const { session: s } = await res.json();
    const loadedMsgs: ChatMsg[] = s.messages ?? [];
    const lastTree = [...loadedMsgs].reverse().find(m => m.role === "assistant" && m.tree)?.tree ?? null;
    setMsgs(loadedMsgs);
    setTree(lastTree as UINode | null);
    setDbSessionId(id);
    setView("preview");
    localStorage.setItem(SESSION_ID_STORAGE, id);
    // Follow the session into its project's context — switching pages
    // within a project (the "quick switch" part of Projects v1) should
    // leave you positioned in that project, not wherever you were before.
    setActiveProjectId(s.projectId ?? null);
  }

  async function deleteSession(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    const deleted = history.find(s => s.id === id);
    await fetch(`/api/sessions/${id}`, { method: "DELETE" });
    setHistory(h => h.filter(s => s.id !== id));
    if (deleted?.projectId) {
      setProjects(ps => ps.map(p => p.id === deleted.projectId ? { ...p, sessionCount: Math.max(0, p.sessionCount - 1) } : p));
    }
    if (dbSessionId === id) reset();
  }

  // ── Project helpers ──────────────────────────────────────────────────────
  async function loadProjects() {
    setProjLoading(true);
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const d = await res.json();
        setProjects(d.projects ?? []);
      }
    } finally {
      setProjLoading(false);
    }
  }

  async function createProject() {
    const name = newProjectName.trim();
    if (!name) return;
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      const d = await res.json();
      setProjects(ps => [d.project, ...ps]);
      setActiveProjectId(d.project.id);
      setExpandedProjects(ex => new Set(ex).add(d.project.id));
    }
    setNewProjectName("");
    setShowNewProject(false);
  }

  async function deleteProject(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    const proj = projects.find(p => p.id === id);
    if (!window.confirm(`Delete "${proj?.name ?? "this project"}" and all ${proj?.sessionCount ?? 0} page(s) inside it? This can't be undone.`)) return;

    const containedIds = history.filter(s => s.projectId === id).map(s => s.id);
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setProjects(ps => ps.filter(p => p.id !== id));
    setHistory(h => h.filter(s => s.projectId !== id));
    if (activeProjectId === id) setActiveProjectId(null);
    if (dbSessionId && containedIds.includes(dbSessionId)) reset();
  }

  function toggleProjectExpand(id: string) {
    setExpandedProjects(ex => {
      const next = new Set(ex);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function selectProject(id: string | null) {
    setActiveProjectId(id);
    if (id) setExpandedProjects(ex => new Set(ex).add(id));
  }

  async function moveSessionToProject(sessionId: string, projectId: string | null) {
    const prevProjectId = history.find(s => s.id === sessionId)?.projectId ?? null;
    if (prevProjectId === projectId) return;
    const res = await fetch(`/api/sessions/${sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId }),
    });
    if (!res.ok) return;
    setHistory(h => h.map(s => s.id === sessionId ? { ...s, projectId } : s));
    setProjects(ps => ps.map(p => {
      if (p.id === prevProjectId) return { ...p, sessionCount: Math.max(0, p.sessionCount - 1) };
      if (p.id === projectId)     return { ...p, sessionCount: p.sessionCount + 1 };
      return p;
    }));
  }

  async function saveToDb(updatedMsgs: ChatMsg[], updatedTree: UINode, isFirst: boolean) {
    if (!isLoggedIn) return;
    const name = updatedMsgs.find(m => m.role === "user")?.content?.slice(0, 120) || "Untitled";
    try {
      if (isFirst || !dbSessionId) {
        const res = await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, messages: updatedMsgs, tree: updatedTree, projectId: activeProjectId }),
        });
        if (res.ok) {
          const d = await res.json();
          const newId = d.session.id;
          setDbSessionId(newId);
          localStorage.setItem(SESSION_ID_STORAGE, newId);
          setHistory(h => [d.session, ...h]);
          if (activeProjectId) {
            setProjects(ps => ps.map(p => p.id === activeProjectId ? { ...p, sessionCount: p.sessionCount + 1 } : p));
          }
        }
      } else {
        await fetch(`/api/sessions/${dbSessionId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: updatedMsgs, tree: updatedTree }),
        });
        setHistory(h =>
          h.map(s => s.id === dbSessionId ? { ...s, updatedAt: new Date().toISOString() } : s)
        );
      }
    } catch {}
  }

  // The profile-menu key input unmounts on outside-click (see the
  // showProfile effect) as soon as the mousedown fires — before the input's
  // own blur event gets a chance to run, so a plain onBlur-triggered save
  // races the unmount and silently drops the keystroke. Debounce on every
  // change instead: the timer lives on this always-mounted component, not
  // the input, so it fires regardless of what happens to the menu's DOM.
  function onKeyDraftChange(value: string) {
    setKeyDraft(value);
    if (keySaveTimer.current) clearTimeout(keySaveTimer.current);
    keySaveTimer.current = setTimeout(() => saveKey(value), 500);
  }

  function saveKey(key: string) {
    if (keySaveTimer.current) { clearTimeout(keySaveTimer.current); keySaveTimer.current = null; }
    const k = key.trim();
    setApiKey(k);
    setKeyDraft(k);
    k ? localStorage.setItem(KEY_STORAGE, k) : localStorage.removeItem(KEY_STORAGE);

    // Signed in: also link the key to the account so it follows the user
    // across devices/browsers, not just this one's localStorage.
    if (isLoggedIn && k) {
      fetch("/api/account/key", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: k }),
      })
        .then(r => r.ok ? r.json() : null)
        .then(d => { if (d) setHasAccountKey(!!d.hasKey); })
        .catch(() => {});
      setKeySaved(true);
      setTimeout(() => setKeySaved(false), 1600);
    }
  }

  function clearAccountKey() {
    fetch("/api/account/key", { method: "DELETE" }).catch(() => {});
    setHasAccountKey(false);
  }

  async function send(text?: string) {
    const txt = (text ?? input).trim();
    if (!txt || loading) return;
    setInput("");
    setNeedsKey(false);

    const userMsg: ChatMsg = { role: "user", content: txt };
    const next = [...msgs, userMsg];
    setMsgs(next);
    setLoading(true);

    try {
      const apiMessages = next.map(m => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, apiKey }),
      });
      const data = await res.json();

      if (!res.ok) {
        setNeedsKey(data.error === "missing_key" || data.error === "invalid_key");
        setMsgs(prev => [...prev, { role: "assistant", content: "", isError: true, errorText: data.message || data.error || "Generation failed" }]);
      } else {
        const newTree = data.tree as UINode;
        setTree(newTree);
        setView("preview");
        const isFirst = msgs.length === 0;
        const updatedMsgs: ChatMsg[] = [
          ...next,
          { role: "assistant", content: data.raw || JSON.stringify(newTree), label: isFirst ? "Interface generated" : "Interface updated", tree: newTree },
        ];
        setMsgs(updatedMsgs);
        await saveToDb(updatedMsgs, newTree, isFirst);
      }
    } catch (e: any) {
      setMsgs(prev => [...prev, { role: "assistant", content: "", isError: true, errorText: e?.message || "Network error" }]);
    } finally {
      setLoading(false);
    }
  }

  // Deliberately does NOT clear activeProjectId — "New" while inside a
  // project should start a fresh page still grouped under that project
  // (the "iterate across multiple pages in one project" workflow). To start
  // a genuinely ungrouped session, select "Ungrouped" in the sidebar first.
  function reset() {
    setMsgs([]);
    setTree(null);
    setNeedsKey(false);
    setInput("");
    setDbSessionId(null);
    localStorage.removeItem(MSGS_STORAGE);
    localStorage.removeItem(TREE_STORAGE);
    localStorage.removeItem(SESSION_ID_STORAGE);
  }

  const code = tree
    ? `import {\n  /* … */\n} from "sandhata-ui";\n\nexport default function Generated() {\n  return (\n${treeToJSX(tree, 2)}\n  );\n}`
    : "";

  async function exportZip() {
    if (!tree) return;
    const zip = new JSZip();
    zip.file("component.tsx", code);
    zip.file(
      "README.md",
      `# Generated Component\n\nGenerated by the [Sandhata AI Builder](https://sandhata.design/builder).\n\n## Usage\n\n\`\`\`tsx\nimport Generated from './component';\n\nexport default function App() {\n  return <Generated />;\n}\n\`\`\`\n\n## Requirements\n\nInstall the Sandhata UI library:\n\n\`\`\`bash\nnpm install sandhata-ui\n\`\`\`\n`
    );
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sandhata-component.zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function dismissAuthModal() {
    setShowAuthModal(false);
    sessionStorage.setItem("sd-builder-auth-modal-dismissed", "1");
  }

  const isEmpty = msgs.length === 0 && !loading;
  const ungroupedSessions = history.filter(s => !s.projectId);

  // Shared row markup for a session under a project group or the
  // "Ungrouped" bucket — the move-select lets you re-file an existing page
  // into a different project (or out of one) without deleting/recreating it.
  function renderSessionRow(s: HistoryItem) {
    return (
      <div key={s.id} className={`bld-history-item${s.id === dbSessionId ? " active" : ""}`} onClick={() => loadSession(s.id)}>
        <span className="bld-history-name">{s.name}</span>
        <div className="bld-history-meta">
          <span className="bld-history-time">{relativeTime(s.updatedAt)}</span>
          <select
            className="bld-history-move"
            value={s.projectId ?? ""}
            onClick={e => e.stopPropagation()}
            onChange={e => moveSessionToProject(s.id, e.target.value || null)}
            title="Move to project"
          >
            <option value="">Ungrouped</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button className="bld-history-del" onClick={(e) => deleteSession(s.id, e)} title="Delete">
            <XIcon />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="doc-root">
      <SdTopNav active="Builder" />

      {/* ── Auth modal ────────────────────────────────────────────── */}
      {showAuthModal && (
        <div className="bld-modal-overlay" onClick={dismissAuthModal}>
          <div className="bld-modal" onClick={e => e.stopPropagation()}>
            <button className="bld-modal-close" onClick={dismissAuthModal} title="Dismiss">
              <XIcon />
            </button>
            <div className="bld-modal-icon">✦</div>
            <h2 className="bld-modal-title">Sign in to save your work</h2>
            <p className="bld-modal-body">
              Your conversations and generated interfaces are saved automatically when you&apos;re signed in.
              Pick up right where you left off.
            </p>
            <div className="bld-modal-actions">
              <button className="bld-signin-btn bld-signin-btn--lg" onClick={() => signIn("google")}>
                <GoogleIcon /> Continue with Google
              </button>
              <button className="bld-signin-btn bld-signin-btn--lg" onClick={() => signIn("github")}>
                <GithubIcon /> Continue with GitHub
              </button>
            </div>
            <button className="bld-modal-skip" onClick={dismissAuthModal}>
              Continue without signing in
            </button>
          </div>
        </div>
      )}

      <div className="bld">

        {/* ── Left: chat + history panel ──────────────────────────── */}
        <aside className="bld-side">

          {/* Header row */}
          <div className="bld-header">
            <div className="bld-header-row">
              <div>
                <h1 className="bld-title">AI Builder</h1>
                {/* Tells you where "New" will file the next page — otherwise
                    silent context is easy to lose track of once you've been
                    switching between several projects. */}
                {isLoggedIn && activeProjectId && (
                  <div className="bld-active-project">
                    <FolderIcon /> {projects.find(p => p.id === activeProjectId)?.name ?? "Project"}
                  </div>
                )}
              </div>
              <div className="bld-header-actions">
                {isLoggedIn && (
                  <button
                    className={`bld-icon-btn${showHistory ? " active" : ""}`}
                    onClick={() => setShowHistory(v => !v)}
                    title="History"
                  >
                    <HistoryIcon />
                  </button>
                )}
                {msgs.length > 0 && (
                  <button className="bld-new-btn" onClick={reset}>New</button>
                )}

                {/* Profile menu — sign in/out + API key live here, off the main chat */}
                <div className="bld-profile" ref={profileRef}>
                  <button
                    className={`bld-profile-btn${showProfile ? " active" : ""}`}
                    onClick={() => setShowProfile(v => !v)}
                    title={isLoggedIn ? session?.user?.name || session?.user?.email || "Account" : "Sign in / API key"}
                  >
                    {isLoggedIn && session?.user?.image
                      ? <img src={session.user.image} alt="" className="bld-profile-avatar" />
                      : <UserIcon />}
                  </button>

                  {showProfile && (
                    <div className="bld-profile-menu">
                      {isLoggedIn ? (
                        <>
                          <div className="bld-profile-user">
                            {session?.user?.image && <img src={session.user.image} alt="" className="bld-profile-avatar bld-profile-avatar--lg" />}
                            <div className="bld-profile-user-text">
                              <span className="bld-profile-name">{session?.user?.name || "Signed in"}</span>
                              {session?.user?.email && <span className="bld-profile-email">{session.user.email}</span>}
                            </div>
                          </div>
                          <div className="bld-profile-divider" />
                        </>
                      ) : (
                        <>
                          <p className="bld-profile-hint">Sign in to save your work and link your API key to your account.</p>
                          <div className="bld-profile-signin">
                            <button className="bld-signin-btn" onClick={() => signIn("google")}><GoogleIcon /> Continue with Google</button>
                            <button className="bld-signin-btn" onClick={() => signIn("github")}><GithubIcon /> Continue with GitHub</button>
                          </div>
                          <div className="bld-profile-divider" />
                        </>
                      )}

                      <div className="bld-profile-section">
                        <div className="bld-profile-section-label"><KeyIcon /> Anthropic API key</div>
                        {hasAccountKey && !keyDraft ? (
                          <div className="bld-profile-key-linked">
                            <span>•••• linked to your account</span>
                            <button className="bld-key-clear" onClick={clearAccountKey}>Unlink</button>
                          </div>
                        ) : (
                          <>
                            <input
                              className="bld-key-input"
                              type="password"
                              placeholder="sk-ant-…"
                              value={keyDraft}
                              onChange={e => onKeyDraftChange(e.target.value)}
                              onBlur={() => saveKey(keyDraft)}
                              onKeyDown={e => { if (e.key === "Enter") saveKey(keyDraft); }}
                            />
                            <div className="bld-profile-key-row">
                              {apiKey
                                ? <button className="bld-key-clear" onClick={() => { saveKey(""); if (isLoggedIn) clearAccountKey(); }}>Clear</button>
                                : <a className="bld-key-link" href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer">Get a key →</a>
                              }
                              {keySaved && <span className="bld-profile-key-saved">Linked ✓</span>}
                            </div>
                          </>
                        )}
                        <p className="bld-profile-key-note">
                          {isLoggedIn
                            ? "Signed in — your key is linked to your account and follows you across devices."
                            : "Not signed in — your key is kept in this browser only."}
                        </p>
                      </div>

                      {isLoggedIn && (
                        <>
                          <div className="bld-profile-divider" />
                          <button className="bld-profile-signout" onClick={() => signOut()}>Sign out</button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Projects + history panel */}
          {showHistory && isLoggedIn && (
            <div className="bld-history">
              <div className="bld-history-header">
                <span className="bld-examples-label">Projects</span>
                {(histLoading || projLoading) && <span className="bld-history-loading">Loading…</span>}
              </div>

              {showNewProject ? (
                <div className="bld-project-new">
                  <input
                    className="bld-key-input"
                    placeholder="Project name…"
                    value={newProjectName}
                    onChange={e => setNewProjectName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter") createProject();
                      if (e.key === "Escape") { setShowNewProject(false); setNewProjectName(""); }
                    }}
                    autoFocus
                  />
                  <button className="bld-new-btn" onClick={createProject} disabled={!newProjectName.trim()}>Add</button>
                  <button className="bld-icon-btn" onClick={() => { setShowNewProject(false); setNewProjectName(""); }} title="Cancel">
                    <XIcon />
                  </button>
                </div>
              ) : (
                <button className="bld-chip bld-project-add" onClick={() => setShowNewProject(true)}>
                  <PlusIcon /> New project
                </button>
              )}

              {projects.length === 0 && history.length === 0 && !histLoading && !projLoading && (
                <p className="bld-history-empty">No projects or saved sessions yet.</p>
              )}

              {projects.map(p => (
                <div key={p.id} className="bld-project-group">
                  <div
                    className={`bld-project-head${activeProjectId === p.id ? " active" : ""}`}
                    onClick={() => { selectProject(p.id); toggleProjectExpand(p.id); }}
                  >
                    <span className={`bld-project-chevron${expandedProjects.has(p.id) ? " open" : ""}`}><ChevronIcon /></span>
                    <span className="bld-project-icon"><FolderIcon /></span>
                    <span className="bld-project-name">{p.name}</span>
                    <span className="bld-project-count">{p.sessionCount}</span>
                    <button className="bld-history-del" onClick={(e) => deleteProject(p.id, e)} title="Delete project">
                      <XIcon />
                    </button>
                  </div>
                  {expandedProjects.has(p.id) && (
                    <div className="bld-project-sessions">
                      {history.filter(s => s.projectId === p.id).map(renderSessionRow)}
                      {history.filter(s => s.projectId === p.id).length === 0 && (
                        <p className="bld-history-empty bld-project-empty">No pages yet — start one below.</p>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {ungroupedSessions.length > 0 && (
                <div className="bld-project-group">
                  <div
                    className={`bld-project-head${activeProjectId === null ? " active" : ""}`}
                    onClick={() => { selectProject(null); toggleProjectExpand("__ungrouped"); }}
                  >
                    <span className={`bld-project-chevron${expandedProjects.has("__ungrouped") ? " open" : ""}`}><ChevronIcon /></span>
                    <span className="bld-project-name">Ungrouped</span>
                    <span className="bld-project-count">{ungroupedSessions.length}</span>
                  </div>
                  {expandedProjects.has("__ungrouped") && (
                    <div className="bld-project-sessions">
                      {ungroupedSessions.map(renderSessionRow)}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Chat */}
          <div className="bld-chat" ref={chatRef}>
            {isEmpty && (
              <div className="bld-empty-state">
                <p className="bld-sub">
                  Describe an interface and it&apos;s built from Sandhata components.
                  Refine it with follow-up messages — context is preserved.
                </p>
                <div className="bld-examples-label">Start with an example</div>
                {EXAMPLES.map(ex => (
                  <button key={ex} className="bld-chip" onClick={() => send(ex)} disabled={loading}>{ex}</button>
                ))}
              </div>
            )}

            {msgs.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="bld-msg bld-msg-user">{m.content}</div>
              ) : m.isError ? (
                <div key={i} className="bld-msg bld-msg-error">
                  <span>{m.errorText}</span>
                  {needsKey && (
                    <div className="bld-key-inline">
                      <input
                        className="bld-key-input"
                        type="password"
                        placeholder="sk-ant-…"
                        value={keyDraft}
                        onChange={e => setKeyDraft(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") { saveKey(keyDraft); send(); } }}
                        autoFocus
                      />
                      <button className="bld-go-sm" onClick={() => { saveKey(keyDraft); send(); }} disabled={!keyDraft.trim()}>
                        Save &amp; retry
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div key={i} className="bld-msg bld-msg-bot">
                  <span className="bld-msg-check"><CheckIcon /></span>
                  <span>{m.label}</span>
                </div>
              )
            )}

            {loading && (
              <div className="bld-msg bld-msg-bot">
                <div className="bld-dot-pulse"><span /><span /><span /></div>
                <span>Thinking…</span>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="bld-input-area">
            <div className="bld-input-wrap">
              <textarea
                ref={inputRef}
                className="bld-input"
                placeholder={msgs.length > 0 ? "Describe a change…" : "Describe an interface…"}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") send(); }}
                rows={3}
                disabled={loading}
              />
              <button className="bld-send-btn" onClick={() => send()} disabled={loading || !input.trim()} title="Send (⌘ Enter)">
                <SendIcon />
              </button>
            </div>
            <div className="bld-input-hint">⌘ Enter to send</div>
          </div>

        </aside>

        {/* ── Right: canvas ───────────────────────────────────────── */}
        <main className="bld-main">
          <div className="bld-toolbar">
            <div className="bld-tabs">
              <button className={view === "preview" ? "on" : ""} onClick={() => setView("preview")}>Preview</button>
              <button className={view === "code" ? "on" : ""} onClick={() => setView("code")} disabled={!tree}>Code</button>
            </div>
            <div className="bld-toolbar-right">
              {view === "preview" && (
                <div className="bld-viewport">
                  {(["mobile","tablet","desktop"] as const).map(v => (
                    <button key={v} className={viewport === v ? "on" : ""} onClick={() => setViewport(v)} title={v==="mobile"?"375px":v==="tablet"?"768px":"Full width"}>
                      {v === "mobile" ? <MobileIcon /> : v === "tablet" ? <TabletIcon /> : <DesktopIcon />}
                    </button>
                  ))}
                </div>
              )}
              {tree && view === "code" && (
                <button className="bld-copy" onClick={() => navigator.clipboard.writeText(code)}>Copy</button>
              )}
              {tree && (
                <button className="bld-export-btn" onClick={exportZip} title="Download component as ZIP">
                  <DownloadIcon /> Export ZIP
                </button>
              )}
            </div>
          </div>

          <div className="bld-canvas">
            {!tree && !loading && (
              <div className="bld-state bld-empty">
                <span>Your generated interface will appear here.</span>
              </div>
            )}
            {!tree && loading && (
              <div className="bld-state">
                <div className="bld-spinner" />
                <span>Generating interface…</span>
              </div>
            )}
            {tree && (
              view === "preview" ? (
                <div
                  className={`bld-surface bld-surface--${viewport}`}
                  style={{ opacity: loading ? 0.55 : 1, transition: "opacity 0.2s" }}
                >
                  <RenderTree tree={tree} />
                </div>
              ) : (
                <pre className="bld-code">{code}</pre>
              )
            )}
          </div>
        </main>

      </div>
    </div>
  );
}
