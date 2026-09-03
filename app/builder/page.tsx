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
  // GitHub push integration (Phase 1) — all optional/null until connected.
  repoOwner?: string | null;
  repoName?: string | null;
  defaultBranch?: string | null;
  workingBranch?: string | null;
  syncStatus?: string | null;
  lastSyncedAt?: string | null;
  lastSyncError?: string | null;
};

type GithubInstallationItem = {
  id: string;
  installationId: number;
  accountLogin: string;
  accountType: string;
};

type GithubRepoItem = {
  owner: string;
  name: string;
  fullName: string;
  private: boolean;
  defaultBranch: string;
};

// ── Azure DevOps integration (Phase 1) ──────────────────────────────────────
type AdoStatus = {
  connected: boolean;
  organization?: string;
  adoProject?: string;
  lastValidatedAt?: string | null;
};

type WorkItemLinkItem = {
  id: string;
  builderItemId: string;
  builderItemKind: string; // "project" | "page" in Phase 1
  adoWorkItemId: number;
  adoWorkItemType: string;
  adoUrl: string;
  lastKnownState: string;
  lastKnownCategory: string | null; // "new" | "in_progress" | "completed" | null
  lastSyncError?: string | null;
};

type AdoStatusValue = "new" | "in_progress" | "completed";
const ADO_STATUSES: { value: AdoStatusValue; label: string }[] = [
  { value: "new", label: "New" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

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
const AdoIcon      = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>);
const ExternalIcon = () => (<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>);

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

  // ── Azure DevOps (Phase 1: manual PAT connect, per-project) ────────────
  const [adoStatus,     setAdoStatus]     = React.useState<AdoStatus | null>(null);
  const [adoLoading,    setAdoLoading]    = React.useState(false);
  const [adoLinks,      setAdoLinks]      = React.useState<WorkItemLinkItem[]>([]);
  const [adoModalOpen,  setAdoModalOpen]  = React.useState(false);
  const [adoOrgDraft,   setAdoOrgDraft]   = React.useState("");
  const [adoProjDraft,  setAdoProjDraft]  = React.useState("");
  const [adoPatDraft,   setAdoPatDraft]   = React.useState("");
  const [adoConnecting, setAdoConnecting] = React.useState(false);
  const [adoConnectErr, setAdoConnectErr] = React.useState<string | null>(null);
  const [adoLinking,    setAdoLinking]    = React.useState<"project" | "page" | null>(null);
  const [adoUpdating,   setAdoUpdating]   = React.useState<"project" | "page" | null>(null);
  const [adoRowErrors,  setAdoRowErrors]  = React.useState<{ project?: string; page?: string }>({});

  // ── GitHub push integration (Phase 1) ────────────────────────────────────
  // null = not checked yet (treated as "unknown", not "unavailable" — avoids
  // a flash of the disabled state before the first /api/github/config reply).
  const [githubConfigured,     setGithubConfigured]     = React.useState<boolean | null>(null);
  const [githubInstallations,  setGithubInstallations]  = React.useState<GithubInstallationItem[]>([]);
  const [githubModalProjectId, setGithubModalProjectId] = React.useState<string | null>(null);
  const [githubRepoPickerInstallationId, setGithubRepoPickerInstallationId] = React.useState<number | null>(null);
  const [githubRepos,        setGithubRepos]        = React.useState<GithubRepoItem[]>([]);
  const [githubReposLoading, setGithubReposLoading] = React.useState(false);
  const [githubConnecting,   setGithubConnecting]   = React.useState(false);
  const [githubPushing,      setGithubPushing]      = React.useState<string | null>(null); // projectId currently pushing
  const [githubModalError,   setGithubModalError]   = React.useState<string | null>(null);
  const [githubNotice,       setGithubNotice]       = React.useState<{ type: "success" | "error"; text: string } | null>(null);

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

  // ── GitHub: check App configuration + load saved installations ──────────
  React.useEffect(() => {
    if (isLoggedIn) { loadGithubConfig(); loadGithubInstallations(); }
    else { setGithubConfigured(null); setGithubInstallations([]); }
  }, [isLoggedIn]);

  // ── GitHub: handle the /api/github/install/callback redirect back here ──
  // Plain window.location parsing (not next/navigation's useSearchParams) —
  // this page is already all-client-side, and this sidesteps needing a
  // Suspense boundary just for a one-time query-param read on mount.
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const gh = params.get("github");
    const ghErr = params.get("github_error");
    const instId = params.get("installationId");
    const connectProject = params.get("connectProject");
    if (!gh && !ghErr) return;

    if (gh === "connected") {
      setGithubNotice({ type: "success", text: "GitHub account connected." });
      loadGithubInstallations();
      if (connectProject) {
        setShowHistory(true);
        setExpandedProjects(ex => new Set(ex).add(connectProject));
        openGithubModal(connectProject);
        const idNum = instId ? Number(instId) : NaN;
        if (Number.isFinite(idNum)) openRepoPicker(idNum);
      }
    } else if (ghErr) {
      setGithubNotice({ type: "error", text: githubErrorMessage(ghErr) });
    }
    window.history.replaceState({}, "", "/builder");
  }, []);

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

  // ── Azure DevOps helpers ─────────────────────────────────────────────────
  // Connections are per-Project (not per-user), so everything here keys off
  // activeProjectId — Ungrouped sessions have no ADO surface at all.
  React.useEffect(() => {
    if (!isLoggedIn || !activeProjectId) {
      setAdoStatus(null);
      setAdoLinks([]);
      setAdoRowErrors({});
      return;
    }
    loadAdoForProject(activeProjectId);
  }, [isLoggedIn, activeProjectId]);

  async function loadAdoForProject(projectId: string) {
    setAdoLoading(true);
    try {
      const res = await fetch(`/api/ado/connect?projectId=${projectId}`);
      const d = res.ok ? await res.json() : { connected: false };
      setAdoStatus(d);
      if (d.connected) {
        const syncRes = await fetch(`/api/ado/workitems/sync?projectId=${projectId}`);
        if (syncRes.ok) {
          const sd = await syncRes.json();
          setAdoLinks(sd.links ?? []);
        }
      } else {
        setAdoLinks([]);
      }
    } catch {
      setAdoStatus({ connected: false });
      setAdoLinks([]);
    } finally {
      setAdoLoading(false);
    }
  }

  async function connectAdo() {
    if (!activeProjectId) return;
    setAdoConnecting(true);
    setAdoConnectErr(null);
    try {
      const res = await fetch("/api/ado/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: activeProjectId,
          organization: adoOrgDraft.trim(),
          adoProject: adoProjDraft.trim(),
          pat: adoPatDraft.trim(),
        }),
      });
      const d = await res.json();
      if (!res.ok) {
        setAdoConnectErr(d.message || d.error || "Failed to connect to Azure DevOps.");
        return;
      }
      setAdoStatus(d);
      setAdoLinks([]);
      setAdoPatDraft("");
      setAdoModalOpen(false);
    } catch (e: any) {
      setAdoConnectErr(e?.message || "Network error");
    } finally {
      setAdoConnecting(false);
    }
  }

  async function disconnectAdo() {
    if (!activeProjectId) return;
    if (!window.confirm("Disconnect this project from Azure DevOps? Already-linked work items stay linked for reference, but status pushes stop working until you reconnect.")) return;
    await fetch(`/api/ado/connect?projectId=${activeProjectId}`, { method: "DELETE" }).catch(() => {});
    setAdoStatus({ connected: false });
    setAdoLinks([]);
  }

  async function linkAdoWorkItem(kind: "project" | "page") {
    if (!activeProjectId) return;
    const builderItemId = kind === "project" ? activeProjectId : dbSessionId;
    if (!builderItemId) return;
    const title = kind === "project"
      ? (projects.find(p => p.id === activeProjectId)?.name || "Project")
      : (history.find(s => s.id === dbSessionId)?.name || "Page");

    setAdoLinking(kind);
    setAdoRowErrors(er => ({ ...er, [kind]: undefined }));
    try {
      const res = await fetch("/api/ado/workitems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: activeProjectId, builderItemId, builderItemKind: kind, title }),
      });
      const d = await res.json();
      if (res.ok) {
        setAdoLinks(links => {
          const exists = links.some(l => l.id === d.link.id);
          return exists ? links.map(l => (l.id === d.link.id ? d.link : l)) : [d.link, ...links];
        });
      } else {
        setAdoRowErrors(er => ({ ...er, [kind]: d.message || d.error || "Failed to link." }));
      }
    } catch (e: any) {
      setAdoRowErrors(er => ({ ...er, [kind]: e?.message || "Network error" }));
    } finally {
      setAdoLinking(null);
    }
  }

  // Optimistic status push with rollback on ADO rejection (e.g. an illegal
  // state transition) — errors surface inline via bld-msg-error styling
  // rather than being swallowed.
  async function pushAdoStatus(kind: "project" | "page", link: WorkItemLinkItem, status: AdoStatusValue) {
    const prevLinks = adoLinks;
    setAdoUpdating(kind);
    setAdoRowErrors(er => ({ ...er, [kind]: undefined }));
    setAdoLinks(links => links.map(l => (l.id === link.id ? { ...l, lastKnownCategory: status } : l)));
    try {
      const res = await fetch(`/api/ado/workitems/${link.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const d = await res.json();
      if (res.ok) {
        setAdoLinks(links => links.map(l => (l.id === link.id ? d.link : l)));
      } else {
        setAdoLinks(prevLinks);
        setAdoRowErrors(er => ({ ...er, [kind]: d.message || d.error || "Azure DevOps rejected the status change." }));
      }
    } catch (e: any) {
      setAdoLinks(prevLinks);
      setAdoRowErrors(er => ({ ...er, [kind]: e?.message || "Network error" }));
    } finally {
      setAdoUpdating(null);
    }
  }
  // ── GitHub push integration (Phase 1) helpers ────────────────────────────
  function githubErrorMessage(code: string): string {
    switch (code) {
      case "not_configured":          return "GitHub integration isn't set up yet.";
      case "invalid_state":           return "That GitHub connection link expired — try again.";
      case "install_requested":       return "Installation request sent — waiting on approval from an organization owner.";
      case "missing_installation_id": return "GitHub didn't return an installation id — try again.";
      case "installation_not_found":  return "Couldn't find that GitHub installation.";
      case "callback_failed":         return "Connecting to GitHub failed — try again.";
      case "unauthenticated":         return "Sign in, then try connecting GitHub again.";
      default:                        return "Something went wrong connecting GitHub.";
    }
  }

  async function loadGithubConfig() {
    try {
      const res = await fetch("/api/github/config");
      setGithubConfigured(res.ok ? !!(await res.json()).configured : false);
    } catch {
      setGithubConfigured(false);
    }
  }

  async function loadGithubInstallations() {
    try {
      const res = await fetch("/api/github/installations");
      if (res.ok) {
        const d = await res.json();
        setGithubInstallations(d.installations ?? []);
      }
    } catch {}
  }

  function openGithubModal(projectId: string) {
    setGithubModalProjectId(projectId);
    setGithubModalError(null);
    setGithubRepos([]);
    setGithubRepoPickerInstallationId(null);
  }

  function closeGithubModal() {
    setGithubModalProjectId(null);
    setGithubRepoPickerInstallationId(null);
    setGithubRepos([]);
    setGithubModalError(null);
  }

  // Full-page navigation (not fetch) — the route redirects the browser to
  // github.com, so this has to leave the SPA. GitHub's own install picker
  // handles "install fresh" vs "use an existing installation" from here.
  function startGithubInstall(projectId: string) {
    window.location.href = `/api/github/install?projectId=${encodeURIComponent(projectId)}`;
  }

  async function openRepoPicker(installationId: number) {
    setGithubRepoPickerInstallationId(installationId);
    setGithubReposLoading(true);
    setGithubModalError(null);
    try {
      const res = await fetch(`/api/github/repos?installationId=${installationId}`);
      const d = await res.json();
      if (!res.ok) { setGithubModalError(d.message || "Failed to load repositories."); setGithubRepos([]); }
      else setGithubRepos(d.repos ?? []);
    } catch {
      setGithubModalError("Failed to load repositories.");
    } finally {
      setGithubReposLoading(false);
    }
  }

  async function connectRepo(projectId: string, installationId: number, owner: string, repo: string) {
    setGithubConnecting(true);
    setGithubModalError(null);
    try {
      const res = await fetch("/api/github/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, installationId, owner, repo }),
      });
      const d = await res.json();
      if (!res.ok) { setGithubModalError(d.message || "Failed to connect repository."); return; }
      setProjects(ps => ps.map(p => p.id === projectId ? { ...p, ...d.project } : p));
      closeGithubModal();
    } catch {
      setGithubModalError("Failed to connect repository.");
    } finally {
      setGithubConnecting(false);
    }
  }

  async function disconnectRepo(projectId: string) {
    if (!window.confirm("Disconnect this project from GitHub? This won't delete anything on GitHub.")) return;
    await fetch("/api/github/disconnect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId }),
    }).catch(() => {});
    setProjects(ps => ps.map(p => p.id === projectId
      ? { ...p, repoOwner: null, repoName: null, defaultBranch: null, workingBranch: null, syncStatus: null, lastSyncError: null }
      : p
    ));
    closeGithubModal();
  }

  async function pushToGithub(projectId: string) {
    setGithubPushing(projectId);
    try {
      const res = await fetch("/api/github/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
      const d = await res.json();
      if (!res.ok) {
        setProjects(ps => ps.map(p => p.id === projectId ? { ...p, syncStatus: "error", lastSyncError: d.message || d.error } : p));
        return;
      }
      setProjects(ps => ps.map(p => p.id === projectId ? { ...p, ...d.project } : p));
    } catch (e: any) {
      setProjects(ps => ps.map(p => p.id === projectId ? { ...p, syncStatus: "error", lastSyncError: e?.message || "Push failed" } : p));
    } finally {
      setGithubPushing(null);
    }
  }

  // Auto-select the (usually only) installation once the modal is open for
  // a not-yet-connected project, so the common single-account case doesn't
  // need an extra click to reach the repo list.
  React.useEffect(() => {
    if (!githubModalProjectId) return;
    const proj = projects.find(p => p.id === githubModalProjectId);
    if (!proj || proj.repoOwner) return;
    if (githubInstallations.length > 0 && githubRepoPickerInstallationId === null) {
      openRepoPicker(githubInstallations[0].installationId);
    }
  }, [githubModalProjectId, githubInstallations]);

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

  // The currently-open page only gets ADO "page" controls when it actually
  // belongs to the active project — activeProjectId can be changed in the
  // sidebar independently of what's currently loaded in the chat/canvas.
  const currentPageInActiveProject =
    !!dbSessionId && history.find(s => s.id === dbSessionId)?.projectId === activeProjectId;
  const adoProjectLink = activeProjectId
    ? adoLinks.find(l => l.builderItemKind === "project" && l.builderItemId === activeProjectId)
    : undefined;
  const adoPageLink = currentPageInActiveProject
    ? adoLinks.find(l => l.builderItemKind === "page" && l.builderItemId === dbSessionId)
    : undefined;

  // Shared status-control + link-row renderer for the "project" and "page"
  // ADO rows — visually similar weight to the preview/code bld-tabs toggle.
  function renderAdoRow(kind: "project" | "page", link: WorkItemLinkItem | undefined, label: string) {
    const isLinking = adoLinking === kind;
    const isUpdating = adoUpdating === kind;
    const error = adoRowErrors[kind];
    return (
      <div className="bld-ado-row">
        <span className="bld-ado-row-label">{label}</span>
        {link ? (
          <>
            <a className="bld-ado-item-link" href={link.adoUrl} target="_blank" rel="noopener noreferrer" title={`${link.adoWorkItemType} #${link.adoWorkItemId} — open in Azure DevOps`}>
              #{link.adoWorkItemId} <ExternalIcon />
            </a>
            <div className="bld-ado-status">
              {ADO_STATUSES.map(s => (
                <button
                  key={s.value}
                  className={link.lastKnownCategory === s.value ? "on" : ""}
                  onClick={() => pushAdoStatus(kind, link, s.value)}
                  disabled={isUpdating}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <button className="bld-ado-link-action" onClick={() => linkAdoWorkItem(kind)} disabled={isLinking}>
            {isLinking ? "Linking…" : "Link to Azure DevOps"}
          </button>
        )}
        {error && <div className="bld-msg-error bld-ado-row-error"><span>{error}</span></div>}
      </div>
    );
  }

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

      {/* ── Azure DevOps connect modal ───────────────────────────────── */}
      {adoModalOpen && (
        <div className="bld-modal-overlay" onClick={() => !adoConnecting && setAdoModalOpen(false)}>
          <div className="bld-modal" onClick={e => e.stopPropagation()}>
            <button className="bld-modal-close" onClick={() => setAdoModalOpen(false)} title="Dismiss" disabled={adoConnecting}>
              <XIcon />
            </button>
            <div className="bld-modal-icon"><AdoIcon /></div>
            <h2 className="bld-modal-title">Connect Azure DevOps</h2>
            <p className="bld-modal-body">
              Paste a personal access token with <strong>Work Items (Read &amp; Write)</strong> scope.
              It&apos;s encrypted at rest and used only to push status for this project.
            </p>
            <div className="bld-ado-form">
              <input
                className="bld-key-input"
                placeholder="Organization (e.g. contoso)"
                value={adoOrgDraft}
                onChange={e => setAdoOrgDraft(e.target.value)}
                disabled={adoConnecting}
                autoFocus
              />
              <input
                className="bld-key-input"
                placeholder="Project name (e.g. Website)"
                value={adoProjDraft}
                onChange={e => setAdoProjDraft(e.target.value)}
                disabled={adoConnecting}
              />
              <input
                className="bld-key-input"
                type="password"
                placeholder="Personal access token"
                value={adoPatDraft}
                onChange={e => setAdoPatDraft(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") connectAdo(); }}
                disabled={adoConnecting}
              />
            </div>
            {adoConnectErr && (
              <div className="bld-msg-error bld-ado-modal-error"><span>{adoConnectErr}</span></div>
            )}
            <div className="bld-modal-actions">
              <button
                className="bld-go-sm"
                onClick={connectAdo}
                disabled={adoConnecting || !adoOrgDraft.trim() || !adoProjDraft.trim() || !adoPatDraft.trim()}
              >
                {adoConnecting ? "Connecting…" : "Connect"}
              </button>
            </div>
            <a className="bld-key-link" href="https://learn.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate" target="_blank" rel="noopener noreferrer">
              How do I create a PAT? →
            </a>
          </div>
        </div>
      )}
      {/* ── GitHub connect/push modal — project-scoped, opened from the
          project group header's GitHub button ─────────────────────────── */}
      {githubModalProjectId && (() => {
        const proj = projects.find(p => p.id === githubModalProjectId);
        if (!proj) return null;
        const connected = !!(proj.repoOwner && proj.repoName);
        return (
          <div className="bld-modal-overlay" onClick={closeGithubModal}>
            <div className="bld-modal bld-modal--github" onClick={e => e.stopPropagation()}>
              <button className="bld-modal-close" onClick={closeGithubModal} title="Close">
                <XIcon />
              </button>
              <div className="bld-modal-icon"><GithubIcon /></div>
              <h2 className="bld-modal-title">GitHub — {proj.name}</h2>

              {githubConfigured === false && (
                <p className="bld-modal-body">
                  GitHub integration isn&apos;t set up yet — a Sandhata admin needs to register the
                  GitHub App before projects can push to a repository.
                </p>
              )}

              {githubConfigured === null && (
                <p className="bld-modal-body">Checking GitHub availability…</p>
              )}

              {githubConfigured && !connected && (
                <div className="bld-github-connect">
                  <p className="bld-modal-body">
                    Connect this project to a GitHub repository to push its generated pages there.
                  </p>

                  {githubInstallations.length === 0 ? (
                    <button className="bld-signin-btn bld-signin-btn--lg" onClick={() => startGithubInstall(proj.id)}>
                      <GithubIcon /> Connect GitHub account
                    </button>
                  ) : (
                    <div className="bld-github-repos">
                      {githubInstallations.length > 1 && (
                        <select
                          className="bld-key-input bld-github-install-select"
                          value={githubRepoPickerInstallationId ?? ""}
                          onChange={e => openRepoPicker(Number(e.target.value))}
                        >
                          {githubInstallations.map(inst => (
                            <option key={inst.id} value={inst.installationId}>
                              {inst.accountLogin} ({inst.accountType})
                            </option>
                          ))}
                        </select>
                      )}

                      {githubReposLoading && (
                        <div className="bld-msg-bot">
                          <div className="bld-dot-pulse"><span /><span /><span /></div>
                          <span>Loading repositories…</span>
                        </div>
                      )}

                      {!githubReposLoading && githubRepos.length > 0 && (
                        <div className="bld-github-repo-list">
                          {githubRepos.map(r => (
                            <button
                              key={r.fullName}
                              className="bld-github-repo-item"
                              disabled={githubConnecting}
                              onClick={() => connectRepo(proj.id, githubRepoPickerInstallationId!, r.owner, r.name)}
                            >
                              <span>{r.fullName}</span>
                              {r.private && <span className="bld-github-repo-private">Private</span>}
                            </button>
                          ))}
                        </div>
                      )}

                      {!githubReposLoading && githubRepos.length === 0 && !githubModalError && (
                        <p className="bld-history-empty">
                          No repositories accessible — grant this App access to a repo from GitHub&apos;s installation settings.
                        </p>
                      )}

                      <button className="bld-key-clear" onClick={() => startGithubInstall(proj.id)}>
                        Manage installation / add repos →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {connected && (
                <div className="bld-github-connected">
                  <div className="bld-github-repo-badge">
                    <GithubIcon />
                    <span>{proj.repoOwner}/{proj.repoName}</span>
                    <span className="bld-github-branch">{proj.workingBranch || `sandhata/${proj.name}`}</span>
                  </div>
                  {proj.lastSyncedAt && (
                    <p className="bld-profile-key-note">Last synced {relativeTime(proj.lastSyncedAt)}</p>
                  )}
                  {proj.syncStatus === "error" && proj.lastSyncError && (
                    <div className="bld-msg-error"><span>{proj.lastSyncError}</span></div>
                  )}
                  <div className="bld-modal-actions">
                    <button
                      className="bld-go-sm"
                      onClick={() => pushToGithub(proj.id)}
                      disabled={githubPushing === proj.id}
                    >
                      {githubPushing === proj.id ? (
                        <span className="bld-msg-bot" style={{ color: "#fff" }}>
                          <div className="bld-dot-pulse"><span /><span /><span /></div> Pushing…
                        </span>
                      ) : "Push to GitHub"}
                    </button>
                    <button className="bld-key-clear" onClick={() => disconnectRepo(proj.id)}>Disconnect</button>
                  </div>
                </div>
              )}

              {githubModalError && (
                <div className="bld-msg-error"><span>{githubModalError}</span></div>
              )}
            </div>
          </div>
        );
      })()}

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

            {/* Azure DevOps — project-scoped connect + link/status controls.
                Lives near the project context line above, not gated behind
                the History panel, so it stays visible whatever the sidebar
                is showing. */}
            {isLoggedIn && activeProjectId && (
              <div className="bld-ado-strip">
                {adoLoading && !adoStatus ? (
                  <span className="bld-ado-loading">Checking Azure DevOps…</span>
                ) : adoStatus?.connected ? (
                  <>
                    <div className="bld-ado-conn">
                      <span className="bld-ado-badge"><AdoIcon /> {adoStatus.organization}/{adoStatus.adoProject}</span>
                      <button className="bld-key-clear" onClick={disconnectAdo}>Disconnect</button>
                    </div>
                    {renderAdoRow("project", adoProjectLink, "Project")}
                    {currentPageInActiveProject && renderAdoRow("page", adoPageLink, "This page")}
                  </>
                ) : (
                  <button className="bld-ado-connect-btn" onClick={() => { setAdoConnectErr(null); setAdoModalOpen(true); }}>
                    <AdoIcon /> Connect Azure DevOps
                  </button>
                )}
              </div>
            )}
          </div>

          {/* GitHub connect/push result banner — driven by the query params
              /api/github/install/callback redirects back with, cleared on
              read (see the mount effect above). */}
          {githubNotice && (
            <div className={`bld-github-notice bld-github-notice--${githubNotice.type}`}>
              <span>{githubNotice.text}</span>
              <button onClick={() => setGithubNotice(null)} title="Dismiss"><XIcon /></button>
            </div>
          )}

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
                    <button
                      className={`bld-project-github-btn${p.repoOwner ? " connected" : ""}${p.syncStatus === "error" ? " error" : ""}`}
                      onClick={(e) => { e.stopPropagation(); openGithubModal(p.id); }}
                      title={p.repoOwner ? `${p.repoOwner}/${p.repoName}${p.syncStatus === "error" ? " — last push failed" : ""}` : "Connect GitHub"}
                    >
                      <GithubIcon />
                    </button>
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
