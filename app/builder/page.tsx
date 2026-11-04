"use client";

import React from "react";
import JSZip from "jszip";
import { useSession, signIn, signOut } from "next-auth/react";
import "../_docs/docs.css";
import "./builder.css";
import { SdTopNav } from "../_docs/shell";
import { sdHighlightLines } from "../_docs/highlight";
import { RenderTree, treeToJSX, INSERT_PLACEHOLDER, type UINode } from "./Renderer";
import { BuilderHome } from "./BuilderHome";
import { ensureIds, findNodeById, findParent, cloneWithNewIds, firstText, updateNodeProps, updateNodeText, removeNodeById, moveNode, insertNodeAt, createNode, CONTAINER_TYPES, auditTree, type AuditIssue } from "./uiTree";
import { PROP_SCHEMA, type PropField } from "./propSchema";
import { PALETTE_CATEGORIES, paletteDefaults } from "./paletteDefaults";
import { useLivePage, ROOM_PREFIX } from "./liveRoom";
import { ShareDialog } from "./ShareDialog";
import { ComponentIcon } from "./componentIcons";
import { SECTION_TEMPLATES, buildSection } from "./sectionTemplates";

type ChatMsg = {
  role: "user" | "assistant";
  content: string;
  label?: string;
  tree?: UINode;
  /** When this turn was made (ISO). Older transcripts don't have it. */
  at?: string;
  isError?: boolean;
  errorText?: string;
};

type InviteNote = {
  id: string;            // ProjectMember id
  projectId: string;
  projectName: string;
  role: string;          // "editor" | "viewer"
  createdAt: string;
  seen: boolean;
  invitedBy: { name: string | null; email: string | null; image: string | null };
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
  // Common workspace: the caller's role, the owner's name when someone else
  // owns it (shared with me), and whether anyone besides the owner has access.
  role?: "owner" | "editor" | "viewer";
  ownerName?: string | null;
  shared?: boolean;
  // GitHub push integration (Phase 1) - all optional/null until connected.
  repoOwner?: string | null;
  repoName?: string | null;
  defaultBranch?: string | null;
  workingBranch?: string | null;
  syncStatus?: string | null;
  lastSyncedAt?: string | null;
  lastSyncError?: string | null;
  // Latest page's design, for the start page's card thumbnail
  preview?: UINode | null;
};

// Left icon rail in the editor (Vzy style): which panel is open beside it.
type RailTab = "projects" | "pages" | "insert" | "layers" | "settings";

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

const MODEL_STORAGE      = "sd-builder-model";
// Mirrors the server's ALLOWED_MODELS allowlist (app/api/generate/route.ts)
// - kept in sync by hand since the client and route are separate bundles.
// The route re-validates against its own copy regardless, so a stale list
// here only limits what shows in the picker, never a real trust boundary.
const AVAILABLE_MODELS = [
  { id: "claude-sonnet-5",             label: "Claude Sonnet 5" },
  { id: "claude-opus-5",               label: "Claude Opus 5" },
  { id: "claude-fable-5",              label: "Claude Fable 5" },
  { id: "claude-haiku-4-5-20251001",   label: "Claude Haiku 4.5" },
];
const DEFAULT_MODEL = AVAILABLE_MODELS[0].id;
const KEY_STORAGE        = "sd-builder-api-key";
const MSGS_STORAGE       = "sd-builder-msgs";
const TREE_STORAGE       = "sd-builder-tree";
const SESSION_ID_STORAGE = "sd-builder-session-id";
const PROJECT_ID_STORAGE = "sd-builder-project-id";
const GS_HIDDEN_STORAGE = "bld-getting-started-hidden";
const OPEN_TABS_STORAGE  = "sd-builder-open-tabs";
// The canvas keeps its own light/dark theme, independent of the site toggle,
// so switching the docs chrome never changes the design being edited.
const CANVAS_THEME_STORAGE = "sd-builder-canvas-theme";
const PALETTE_COLLAPSED_STORAGE = "sd-builder-palette-collapsed";
// Deliberately separate from SESSION_ID_STORAGE: that key only ever gets set
// for a tab that's a real saved DB session (openTab's cache-hit branch,
// loadSession's success path, or saveToDb) - a pure local draft tab (most of
// signed-out use, or any brand-new page before its first successful save)
// never touches it. Falling back to SESSION_ID_STORAGE to restore "which tab
// was active" is wrong whenever the active tab was a draft: it'd resolve to
// some other (or no) tab while msgs/tree correctly restore the real one,
// activeTabId now disagreeing with what's on screen.
const ACTIVE_TAB_STORAGE = "sd-builder-active-tab-id";

/** A short page title from a prompt ("deesign a dashboard for Varun's fleet
 * management" becomes "Dashboard for Varun's Fleet Management"): drops the
 * instruction verb and filler, keeps the first few words, Title Case. */
function shortTitle(prompt: string): string {
  let t = prompt.trim().replace(/\s+/g, " ");
  t = t.replace(/^(please\s+)?(can you\s+)?(create|de+sign|make|build|generate|draft|add|give me|i need|i want)\s+(me\s+)?/i, "");
  t = t.replace(/^(a|an|the)\s+/i, "");
  t = t.split(/[.,;:!?]|\s(?:that|which|with|where|showing)\s/i)[0];
  const small = /^(a|an|the|for|of|and|to|in|on|with)$/i;
  const words = t.split(" ").filter(Boolean).slice(0, 6);
  const out = words.map((w, i) => (i > 0 && small.test(w) ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1))).join(" ");
  return out.slice(0, 60) || "Untitled";
}

// Starting points on the start page, assembled from the Insert panel's
// ready-made sections (sectionTemplates.ts), so they stay on the design system.
const PAGE_TEMPLATES: { key: string; name: string; sections: string[] }[] = [
  { key: "landing", name: "Landing page", sections: ["hero", "features", "stats", "testimonial", "cta"] },
  { key: "pricing", name: "Pricing page", sections: ["hero", "pricing", "faq", "cta"] },
  { key: "contact", name: "Contact page", sections: ["hero", "contact", "faq"] },
];
function buildTemplate(key: string): UINode | null {
  const t = PAGE_TEMPLATES.find(x => x.key === key);
  if (!t) return null;
  const sections = t.sections.map(k => buildSection(k)).filter((n): n is UINode => !!n);
  return ensureIds({ type: "Stack", props: { gap: 48 }, children: sections });
}

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
/** "just now", "5 min ago", "3 h ago", else "2 Nov, 13:05". */
function formatWhen(iso: string): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "";
  const mins = Math.round((Date.now() - t) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  if (mins < 24 * 60) return `${Math.round(mins / 60)} h ago`;
  return new Date(t).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

const HistoryIcon  = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>);
const UserIcon     = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const KeyIcon      = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="M10.5 12.5L21 2"/><path d="M18 5l3 3M15 8l3 3"/></svg>);
const HomeIcon     = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1z"/></svg>);
const GearIcon     = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>);
const PlayIcon     = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>);
const SignInIcon   = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>);
const RailFolderIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/></svg>);
const PagesIcon    = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z"/><polyline points="14 3 14 8 19 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>);
const InsertIcon   = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>);
const LayersIcon   = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>);
const BellIcon     = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>);
const ChevronUpIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>);
const ChevronDownIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>);
const XIcon        = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
const DownloadIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>);
const GoogleIcon   = () => (<svg width="14" height="14" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>);
const GithubIcon   = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>);
const FolderIcon   = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/></svg>);
const ChevronIcon  = () => (<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>);
const PlusIcon     = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>);
const AdoIcon      = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>);
const ExternalIcon = () => (<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>);
const EyeIcon      = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>);
const CodeIcon     = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>);
const EditIcon     = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>);
const ShareIcon    = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>);
const ShieldIcon   = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>);
const UndoIcon     = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 010 11H11"/></svg>);
const RedoIcon     = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14l5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 000 11H13"/></svg>);
const SunIcon      = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>);
const MoonIcon     = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>);
const SearchIcon   = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>);
const SparkleIcon  = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></svg>);
const MoreIcon     = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>);
const BackIcon     = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>);
const TrashIcon    = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>);

export default function BuilderPage() {
  const { data: session, status } = useSession();
  const isLoggedIn  = status === "authenticated";
  const authLoading = status === "loading";
  const userId      = (session?.user as { id?: string } | undefined)?.id ?? null;

  // Notifications: projects other people have shared with you. Read state is
  // stored on the membership (seenAt), so it follows the account.
  const [notes,       setNotes]       = React.useState<InviteNote[]>([]);
  const [showNotes,   setShowNotes]   = React.useState(false);
  const [notesFresh,  setNotesFresh]  = React.useState<Set<string>>(new Set());
  const [inviteBannerDismissed, setInviteBannerDismissed] = React.useState(false);
  const notesRef      = React.useRef<HTMLDivElement>(null);
  const pendingProjectRef = React.useRef<string | null>(null);
  // Chat card at the bottom of the canvas: minimised shows just the input row.
  const [chatMin, setChatMin] = React.useState(false);
  // Getting started card minimised out of the sidebar (still in the profile
  // menu). Remembered in this browser.
  const [gsHidden, setGsHidden] = React.useState(false);
  React.useEffect(() => { try { setGsHidden(localStorage.getItem(GS_HIDDEN_STORAGE) === "1"); } catch {} }, []);

  const [msgs,          setMsgs]          = React.useState<ChatMsg[]>([]);
  const [input,         setInput]         = React.useState("");
  const [loading,       setLoading]       = React.useState(false);
  const [apiKey,        setApiKey]        = React.useState("");
  const [model,         setModel]         = React.useState(DEFAULT_MODEL);
  const [keyDraft,      setKeyDraft]      = React.useState("");
  const [needsKey,      setNeedsKey]      = React.useState(false);
  const [tree,          setTree]          = React.useState<UINode | null>(null);
  const [view,          setView]          = React.useState<"preview" | "code" | "edit" | "report">("edit");
  const [viewport,      setViewport]      = React.useState<"mobile" | "tablet" | "desktop">("tablet");
  const [canvasTheme,   setCanvasTheme]   = React.useState<"light" | "dark">("light");
  // Insert tab: filters the component grid by name.
  const [paletteQuery,  setPaletteQuery]  = React.useState("");
  // Insert panel groups the viewer has folded away (remembered per browser).
  // First visit: Sections and Layout open, the rest folded, to keep the
  // list short.
  const [collapsedCats, setCollapsedCats] = React.useState<Set<string>>(
    () => new Set(["Typography", "Actions", "Forms", "Data Display", "Navigation", "Feedback"]),
  );
  // Visual edits not yet folded into the transcript (autosaved after a pause).
  const [editsDirty,    setEditsDirty]    = React.useState(false);
  // Version history: the panel, and which version (index into msgs) is on
  // the canvas for a look before restoring.
  const [showVersions,  setShowVersions]  = React.useState(false);
  const [viewingVersion, setViewingVersion] = React.useState<number | null>(null);
  // ── Visual editor (edit view) - Phase 1: select + property-panel editing.
  // Undo/redo is a snapshot stack, not a diff log - trees here are small
  // (the AI's own system prompt caps them around ~200 nodes), so a
  // structuredClone-cheap approach is simpler than a command log and doesn't
  // need to be.
  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(null);
  const [hoveredNodeId,  setHoveredNodeId]  = React.useState<string | null>(null);
  const [editHistory,    setEditHistory]    = React.useState<UINode[]>([]);
  const [editRedoStack,  setEditRedoStack]  = React.useState<UINode[]>([]);
  // ── Phase 2: drag-to-reorder. Native HTML5 drag-and-drop, delegated on the
  // canvas wrapper (same philosophy as click/hover selection above) rather
  // than a per-node drag library - RenderNode already only needs one extra
  // conditional attribute (`draggable`, gated on `editable`) to support this,
  // with all position math and the actual tree mutation living here.
  const [draggingNodeId, setDraggingNodeId] = React.useState<string | null>(null);
  const [dropTarget, setDropTarget] = React.useState<{ id: string; position: "before" | "after" | "inside" } | null>(null);
  // ── Phase 3: component palette + drag-to-insert. A drag is either an
  // existing node (draggingNodeId, Phase 2) or a fresh palette chip
  // (draggingPaletteType) - never both; onDragStart on each source clears
  // the other. Both share the same onDragOver/onDrop position math and
  // dropTarget state, branching only at the very end on which one is set.
  const [draggingPaletteType, setDraggingPaletteType] = React.useState<string | null>(null);
  // Insert and Layers share one tabbed panel in the left column while
  // editing; the selected element's editor sits on the right.
  const [rail, setRail] = React.useState<RailTab>("insert");
  // The panel beside the rail; clicking the open tab's icon again folds it.
  const [panelOpen, setPanelOpen] = React.useState(true);
  // Signed-in users land on the start page (projects); the editor opens a
  // project or page. Signed-out use goes straight to the editor.
  // "boot" until sign-in status is known, so neither screen flashes first.
  const [screen, setScreen] = React.useState<"boot" | "home" | "editor">("boot");
  const initialSearchRef = React.useRef(typeof window !== "undefined" ? window.location.search : "");
  const screenInitRef = React.useRef(false);
  // With an element selected the panel becomes that element's editor
  // (Vzy/Framer style), split into what it says (Content) and how it looks
  // (Style).
  const [propTab, setPropTab] = React.useState<"content" | "style" | "advanced">("content");
  // Canvas zoom (Edit and Preview), Figma/Framer style
  const [zoom, setZoom] = React.useState(1);
  // Page row ⋯ menu and the canvas right-click menu
  const [pageMenuId, setPageMenuId] = React.useState<string | null>(null);
  const [ctxMenu, setCtxMenu] = React.useState<{ x: number; y: number; id: string } | null>(null);
  // Selected element's name chip on the canvas
  const [selRect, setSelRect] = React.useState<{ top: number; left: number } | null>(null);
  // Start page prompt or template, run once the new project's page is open
  const pendingStartRef = React.useRef<{ prompt?: string; template?: string } | null>(null);
  const [projectNameDraft, setProjectNameDraft] = React.useState("");
  // Section bar: the top-level block under the cursor, its open "more" menu,
  // and where a click in the Insert grid should land (set by the bar's +).
  const [sectionHoverId, setSectionHoverId] = React.useState<string | null>(null);
  const [sectionMenuId, setSectionMenuId] = React.useState<string | null>(null);
  const [insertTarget, setInsertTarget] = React.useState<{ id: string; position: "before" | "after" } | null>(null);
  const [sectionRect, setSectionRect] = React.useState<{ top: number; left: number; width: number } | null>(null);
  const canvasWrapRef = React.useRef<HTMLDivElement>(null);
  // Layers tab: which container nodes are collapsed, by id. Starts empty
  // (everything expanded) - a generated tree is capped around ~200 nodes by
  // the AI's own system prompt, so a full expand-by-default is cheap and,
  // more importantly, means a freshly-inserted node is never hidden inside
  // a container the user forgot they'd collapsed.
  const [collapsedLayerIds, setCollapsedLayerIds] = React.useState<Set<string>>(() => new Set());
  const [dbSessionId,   setDbSessionId]   = React.useState<string | null>(null);
  // ── Common workspace: per saved page, the caller's role and whether it
  // opens a live room (from GET /api/sessions/:id). Keyed by session id so a
  // cached tab switch (openTab's fast path, no refetch) still knows it.
  const [pageAccess, setPageAccess] = React.useState<Record<string, { role: "owner" | "editor" | "viewer"; shared: boolean; live: boolean }>>({});
  const [shareProjectId, setShareProjectId] = React.useState<string | null>(null);
  const [history,       setHistory]       = React.useState<HistoryItem[]>([]);
  const [showHistory,   setShowHistory]   = React.useState(false);
  const [histLoading,   setHistLoading]   = React.useState(false);
  // ── Tabs: multiple open "instances" above the canvas, so switching between
  // pages you're actively iterating on is one click, not a trip into History.
  // tabCacheRef holds each open tab's msgs/tree in memory (a ref, not state -
  // it doesn't need to trigger a render on its own) so re-focusing a tab you
  // already visited this session is instant, no re-fetch.
  const [openTabs,   setOpenTabs]   = React.useState<HistoryItem[]>([]);
  const [activeTabId, setActiveTabId] = React.useState<string | null>(null);
  const tabCacheRef = React.useRef<Record<string, { msgs: ChatMsg[]; tree: UINode | null }>>({});
  // Double-click a tab to rename it. renamingTabId gates which tab (if any)
  // currently shows an input instead of its name span; renameDraft is that
  // input's live value, committed on blur/Enter, discarded on Escape.
  const [renamingTabId, setRenamingTabId] = React.useState<string | null>(null);
  const [renameDraft,   setRenameDraft]   = React.useState("");
  // React doesn't reliably fire onBlur when the focused input itself
  // unmounts (browser-dependent), so Escape can't just clear renamingTabId
  // and trust blur to stay quiet - a stray blur could still land on the old
  // closure and commit renameDraft anyway. This ref makes Escape's "discard,
  // don't commit" explicit regardless of whether that blur fires.
  const skipRenameCommitRef = React.useRef(false);
  const [projects,        setProjects]        = React.useState<ProjectItem[]>([]);
  const [projLoading,     setProjLoading]     = React.useState(false);
  const [activeProjectId, setActiveProjectId] = React.useState<string | null>(null);
  const [expandedProjects, setExpandedProjects] = React.useState<Set<string>>(new Set());
  const [showNewProject,  setShowNewProject]  = React.useState(false);
  const [newProjectName,  setNewProjectName]  = React.useState("");
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [showProfile,   setShowProfile]   = React.useState(false);
  const [hasAccountKey, setHasAccountKey] = React.useState(false);
  // Whether this deployment has its own Anthropic key (it doesn't on Vercel)
  const [serverKey, setServerKey] = React.useState<boolean | null>(null);
  React.useEffect(() => {
    fetch("/api/generate").then(r => (r.ok ? r.json() : null)).then(d => setServerKey(d ? !!d.serverKey : null)).catch(() => {});
  }, []);
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
  // null = not checked yet (treated as "unknown", not "unavailable" - avoids
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

    const savedModel = localStorage.getItem(MODEL_STORAGE) || "";
    if (AVAILABLE_MODELS.some(m => m.id === savedModel)) setModel(savedModel);

    if (localStorage.getItem(CANVAS_THEME_STORAGE) === "dark") setCanvasTheme("dark");
    try {
      const rawCats = localStorage.getItem(PALETTE_COLLAPSED_STORAGE);
      if (rawCats) setCollapsedCats(new Set(JSON.parse(rawCats)));
    } catch {}

    let hadRestoredMsgs = false;
    try {
      const rawMsgs = localStorage.getItem(MSGS_STORAGE);
      if (rawMsgs) { setMsgs(JSON.parse(rawMsgs)); hadRestoredMsgs = JSON.parse(rawMsgs).length > 0; }
    } catch {}

    try {
      const rawTree = localStorage.getItem(TREE_STORAGE);
      if (rawTree) setTree(JSON.parse(rawTree));
    } catch {}

    const savedId = localStorage.getItem(SESSION_ID_STORAGE);
    if (savedId) setDbSessionId(savedId);

    const savedProjectId = localStorage.getItem(PROJECT_ID_STORAGE);
    if (savedProjectId) setActiveProjectId(savedProjectId);

    let restoredTabs: HistoryItem[] = [];
    try {
      const rawTabs = localStorage.getItem(OPEN_TABS_STORAGE);
      if (rawTabs) restoredTabs = JSON.parse(rawTabs);
    } catch {}
    // Back-compat for a reload from before tabs existed - a saved session or
    // an unsent draft that was active but never made it into a tab list -
    // seed a single tab from whatever was restored above, rather than
    // showing an empty tab strip while the canvas clearly has content in it.
    if (restoredTabs.length === 0 && (savedId || hadRestoredMsgs)) {
      const seedId = savedId ?? `draft-${Date.now()}`;
      restoredTabs = [{ id: seedId, name: "Untitled", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), projectId: savedProjectId ?? null }];
    }
    if (restoredTabs.length > 0) {
      setOpenTabs(restoredTabs);
      // The tab that was actually on screen at reload time, NOT whichever
      // one happens to be a real saved session - see the ACTIVE_TAB_STORAGE
      // comment above for why SESSION_ID_STORAGE alone isn't reliable here.
      const savedActiveTabId = localStorage.getItem(ACTIVE_TAB_STORAGE);
      setActiveTabId(savedActiveTabId ?? savedId ?? restoredTabs[0].id);
    }
  }, []);

  React.useEffect(() => {
    activeTabId
      ? localStorage.setItem(ACTIVE_TAB_STORAGE, activeTabId)
      : localStorage.removeItem(ACTIVE_TAB_STORAGE);
  }, [activeTabId]);

  React.useEffect(() => {
    openTabs.length > 0
      ? localStorage.setItem(OPEN_TABS_STORAGE, JSON.stringify(openTabs))
      : localStorage.removeItem(OPEN_TABS_STORAGE);
  }, [openTabs]);

  // Continuously mirrors the active tab's live content into tabCacheRef.
  // Without this, only tabs that went through loadSession (a real DB fetch)
  // or saveToDb (signed-in only) ever got cached - an unsaved draft tab
  // (most of the signed-out flow, and any brand-new page before its first
  // successful save) had nothing written for it, so switching back to it
  // silently no-opped instead of restoring its content. This is what
  // actually makes "switch between several open pages" work regardless of
  // login/save state, not just for already-persisted sessions.
  React.useEffect(() => {
    if (!activeTabId) return;
    tabCacheRef.current[activeTabId] = { msgs, tree };
  }, [activeTabId, msgs, tree]);

  // ── Visual editor: enter/leave "edit" view ──────────────────────────────
  // Existing saved sessions' trees predate the `id` field on UINode - backfill
  // lazily the moment edit mode is actually entered, rather than migrating
  // every session up front. ensureIds returns the same reference if nothing
  // needed adding, so this is a no-op re-render for an already-id'd tree.
  React.useEffect(() => {
    if (view !== "edit" || !tree) return;
    const withIds = ensureIds(tree);
    if (withIds !== tree) setTree(withIds);
  }, [view, tree]);

  // Undo/redo is scoped per open tab (matching tabCacheRef's per-tab
  // caching) - switching tabs with edit history still pending would
  // otherwise let you undo INTO a different page's tree.
  React.useEffect(() => {
    setSelectedNodeId(null);
    setHoveredNodeId(null);
    setEditHistory([]);
    setEditRedoStack([]);
    setDraggingNodeId(null);
    setDraggingPaletteType(null);
    setDropTarget(null);
    // A page with a design opens with the chat folded, so the design shows
    setChatMin(true);
    setEditsDirty(false);
    setViewingVersion(null);
    setShowVersions(false);
  }, [activeTabId]);

  // Selecting something (by click, or right after a palette insert below)
  // brings the inspector to Properties automatically - you shouldn't have to
  // manually flip the tab every time just to see what you clicked.
  React.useEffect(() => {
    if (selectedNodeId) { setPropTab("content"); setInsertTarget(null); setPanelOpen(true); }
  }, [selectedNodeId]);

  const selectedNode = React.useMemo(
    () => (tree && selectedNodeId ? findNodeById(tree, selectedNodeId) : null),
    [tree, selectedNodeId]
  );

  // ── Common workspace: live co-editing of shared pages ───────────────────
  // Only a saved page in a shared project (and only while it's the tab on
  // screen) joins a live room; everything else stays on the single-user path.
  const activeAccess = dbSessionId && activeTabId === dbSessionId ? pageAccess[dbSessionId] : undefined;
  const readOnly = activeAccess?.role === "viewer";
  const liveRoomId = isLoggedIn && dbSessionId && activeAccess?.live ? `${ROOM_PREFIX}${dbSessionId}` : null;
  const livePage = useLivePage<ChatMsg>({
    roomId: liveRoomId,
    loadSeed: async () => {
      if (!dbSessionId) return null;
      const res = await fetch(`/api/sessions/${dbSessionId}`);
      if (!res.ok) return null;
      const { session: s } = await res.json();
      const seedMsgs: ChatMsg[] = s.messages ?? [];
      // Same "latest tree = last assistant message's tree" rule as loadSession.
      const seedTree = ([...seedMsgs].reverse().find(m => m.role === "assistant" && m.tree)?.tree ?? null) as UINode | null;
      return { tree: seedTree, msgs: seedMsgs };
    },
    canWrite: !readOnly,
    tree, setTree, msgs, setMsgs,
    selectedNodeId: view === "edit" ? selectedNodeId : null,
  });

  // Every structural/property edit goes through this - pushes the
  // pre-edit tree onto the undo stack, clears redo (a fresh edit
  // invalidates whatever "future" redo pointed at), and commits.
  function commitTreeEdit(nextTree: UINode | null) {
    if (!tree) return;
    setEditHistory(h => [...h, tree].slice(-50));
    setEditRedoStack([]);
    setTree(nextTree);
    setEditsDirty(true);
  }

  function undoEdit() {
    // In a live room, undo goes through Liveblocks so it only reverts my own
    // edits, never someone else's that landed after mine.
    setEditsDirty(true);
    if (livePage.live) { livePage.undo(); return; }
    if (!tree || editHistory.length === 0) return;
    const prev = editHistory[editHistory.length - 1];
    setEditHistory(h => h.slice(0, -1));
    setEditRedoStack(r => [...r, tree]);
    setTree(prev);
  }

  function redoEdit() {
    setEditsDirty(true);
    if (livePage.live) { livePage.redo(); return; }
    if (!tree || editRedoStack.length === 0) return;
    const next = editRedoStack[editRedoStack.length - 1];
    setEditRedoStack(r => r.slice(0, -1));
    setEditHistory(h => [...h, tree]);
    setTree(next);
  }

  function updateSelectedProp(key: string, value: any) {
    if (!tree || !selectedNodeId) return;
    commitTreeEdit(updateNodeProps(tree, selectedNodeId, { [key]: value }));
  }

  function updateSelectedText(text: string) {
    if (!tree || !selectedNodeId) return;
    commitTreeEdit(updateNodeText(tree, selectedNodeId, text));
  }

  function deleteSelectedNode() {
    if (!tree || !selectedNodeId) return;
    const next = removeNodeById(tree, selectedNodeId);
    setSelectedNodeId(null);
    // next === null means the root itself was deleted (cleared canvas) -
    // commitTreeEdit accepts that directly; it still goes through
    // history/redo and gets flushed back into the chat like any other edit.
    commitTreeEdit(next);
  }

  // ── Sections: the root container's direct children ─────────────────────
  // What Vzy calls sections. Each gets a hover bar on the canvas with add,
  // AI and a move/duplicate/delete menu. A root that isn't a container is
  // treated as the only section.
  const sectionIds = React.useMemo<string[]>(() => {
    if (!tree) return [];
    if (Array.isArray(tree.children) && CONTAINER_TYPES.has(tree.type)) {
      return tree.children.map(c => c.id).filter((id): id is string => !!id);
    }
    return tree.id ? [tree.id] : [];
  }, [tree]);

  /** The section containing `id` (itself if it is one), or null. */
  function sectionOf(id: string | null): string | null {
    if (!tree || !id) return null;
    let cur: string | null = id;
    while (cur) {
      if (sectionIds.includes(cur)) return cur;
      cur = findParent(tree, cur)?.id ?? null;
    }
    return null;
  }

  // The project the page on screen belongs to (sharing is per project).
  const activePageProjectId = history.find(h => h.id === activeTabId)?.projectId ?? openTabs.find(t => t.id === activeTabId)?.projectId ?? null;

  const barSectionId = readOnly ? null : (sectionMenuId ?? sectionHoverId ?? sectionOf(selectedNodeId));

  // Position the bar on the section's top edge, relative to the canvas
  // wrapper (which scrolls with the canvas, so only layout changes matter).
  React.useLayoutEffect(() => {
    function measure() {
      const wrap = canvasWrapRef.current;
      if (!wrap || !barSectionId) { setSectionRect(null); return; }
      const el = wrap.querySelector(`[data-node-id="${barSectionId}"]`) as HTMLElement | null;
      if (!el) { setSectionRect(null); return; }
      const w = wrap.getBoundingClientRect();
      // Design-system components are wrapped in a display:contents <span>
      // that carries the node id but has no box of its own, so measure the
      // union of its children instead.
      let r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0 && el.children.length > 0) {
        const rects = Array.from(el.children).map(c => c.getBoundingClientRect());
        const top = Math.min(...rects.map(x => x.top));
        const left = Math.min(...rects.map(x => x.left));
        const right = Math.max(...rects.map(x => x.right));
        r = { top, left, width: right - left } as DOMRect;
      }
      setSectionRect({ top: r.top - w.top, left: r.left - w.left, width: r.width });
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [barSectionId, tree, viewport, view]);

  function moveSection(id: string, dir: -1 | 1) {
    if (!tree) return;
    const i = sectionIds.indexOf(id);
    const target = sectionIds[i + dir];
    if (i < 0 || !target) return;
    commitTreeEdit(moveNode(tree, id, target, dir < 0 ? "before" : "after"));
  }

  function duplicateSection(id: string) {
    if (!tree) return;
    const node = findNodeById(tree, id);
    if (!node) return;
    const copy = cloneWithNewIds(node);
    if (id === tree.id) return; // the root can't have a sibling
    commitTreeEdit(insertNodeAt(tree, id, "after", copy));
    setSelectedNodeId(copy.id ?? null);
  }

  /** Duplicate any element (not just a section), placed right after it. */
  function duplicateNode(id: string) {
    if (!tree || readOnly || id === tree.id) return;
    const node = findNodeById(tree, id);
    if (!node) return;
    const copy = cloneWithNewIds(node);
    commitTreeEdit(insertNodeAt(tree, id, "after", copy));
    setSelectedNodeId(copy.id ?? null);
  }

  /** Move an element up or down among its siblings. */
  function moveNodeBy(id: string, dir: -1 | 1) {
    if (!tree || readOnly) return;
    const parent = findParent(tree, id);
    const kids = parent && Array.isArray(parent.children) ? parent.children : [];
    const i = kids.findIndex(k => k.id === id);
    const target = kids[i + dir];
    if (i < 0 || !target?.id) return;
    commitTreeEdit(moveNode(tree, id, target.id, dir < 0 ? "before" : "after"));
  }

  function deleteSection(id: string) {
    if (!tree) return;
    if (sectionOf(selectedNodeId) === id) setSelectedNodeId(null);
    setSectionHoverId(null);
    commitTreeEdit(removeNodeById(tree, id));
  }

  /** Starts a chat message scoped to one section, for the AI to change. */
  function askAiAboutSection(id: string) {
    const node = tree ? findNodeById(tree, id) : null;
    if (!node) return;
    const label = firstText(node);
    const short = label && label.length > 40 ? `${label.slice(0, 40)}…` : label;
    setInput(`In the ${node.type} section${short ? ` ("${short}")` : ""}, `);
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
    });
  }

  /** The bar's +: the Insert grid's next click lands above this section. */
  function openInsertAt(id: string) {
    setSelectedNodeId(null);
    setRail("insert");
    setPanelOpen(true);
    setInsertTarget({ id, position: "before" });
  }

  // The edit canvas renders a copy with a placeholder where the next insert
  // will land, so the spot is visible before you pick what to add. The real
  // tree (saved, exported, audited) never contains it.
  const canvasTree = React.useMemo(() => {
    if (!tree || !insertTarget || !findNodeById(tree, insertTarget.id)) return tree;
    return insertNodeAt(tree, insertTarget.id, insertTarget.position, { type: INSERT_PLACEHOLDER });
  }, [tree, insertTarget]);

  // ── Editor shortcuts (Figma/Framer): undo/redo, delete, duplicate, move,
  // zoom. Ignored while typing in a field.
  React.useEffect(() => {
    if (screen !== "editor") return;
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable)) return;
      const mod = e.metaKey || e.ctrlKey;
      if (view === "preview" && e.key === "Escape" && !readOnly) { e.preventDefault(); changeView("edit"); return; }
      if ((view === "edit" || view === "preview") && mod && (e.key === "=" || e.key === "+")) { e.preventDefault(); setZoom(z => Math.min(2, +(z + 0.1).toFixed(2))); return; }
      if ((view === "edit" || view === "preview") && mod && e.key === "-") { e.preventDefault(); setZoom(z => Math.max(0.25, +(z - 0.1).toFixed(2))); return; }
      if ((view === "edit" || view === "preview") && mod && e.key === "0") { e.preventDefault(); setZoom(1); return; }
      if (view !== "edit" || readOnly) return;
      if (mod && e.key.toLowerCase() === "z") { e.preventDefault(); if (e.shiftKey) redoEdit(); else undoEdit(); return; }
      if (!selectedNodeId) return;
      if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); deleteSelectedNode(); return; }
      if (mod && e.key.toLowerCase() === "d") { e.preventDefault(); duplicateNode(selectedNodeId); return; }
      if (e.altKey && e.key === "ArrowUp") { e.preventDefault(); moveNodeBy(selectedNodeId, -1); return; }
      if (e.altKey && e.key === "ArrowDown") { e.preventDefault(); moveNodeBy(selectedNodeId, 1); return; }
      if (e.key === "Escape" && !insertTarget) { setSelectedNodeId(null); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  // Close the page ⋯ menu and the canvas right-click menu on outside click
  React.useEffect(() => {
    if (!pageMenuId && !ctxMenu) return;
    const close = () => { setPageMenuId(null); setCtxMenu(null); };
    const t = setTimeout(() => document.addEventListener("click", close), 0);
    return () => { clearTimeout(t); document.removeEventListener("click", close); };
  }, [pageMenuId, ctxMenu]);

  // Name chip on the selected element (Elementor/Framer), measured like the
  // section bar: relative to the canvas wrapper.
  React.useLayoutEffect(() => {
    const wrap = canvasWrapRef.current;
    if (!wrap || !selectedNodeId || view !== "edit") { setSelRect(null); return; }
    const el = wrap.querySelector(`[data-node-id="${selectedNodeId}"]`) as HTMLElement | null;
    if (!el) { setSelRect(null); return; }
    let r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0 && el.firstElementChild) r = el.firstElementChild.getBoundingClientRect();
    const w = wrap.getBoundingClientRect();
    setSelRect({ top: r.top - w.top, left: r.left - w.left });
  }, [selectedNodeId, tree, viewport, view, zoom, panelOpen]);

  // Start page prompt or template: once the new project's first page is
  // open, generate from the prompt or drop the template in.
  React.useEffect(() => {
    const start = pendingStartRef.current;
    if (!start || screen !== "editor" || !activeTabId?.startsWith("draft-") || loading) return;
    pendingStartRef.current = null;
    if (start.prompt) { send(start.prompt); return; }
    if (start.template) {
      const t = buildTemplate(start.template);
      const name = PAGE_TEMPLATES.find(x => x.key === start.template)?.name ?? "Template";
      if (!t) return;
      const m: ChatMsg[] = [{ role: "assistant", content: JSON.stringify(t), label: `Started from the ${name} template`, tree: t, at: new Date().toISOString() }];
      setTree(t);
      setMsgs(m);
      setView("edit");
      saveToDb(m, t, true, activeTabId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, activeTabId, loading]);

  React.useEffect(() => {
    if (!insertTarget) return;
    const raf = requestAnimationFrame(() => {
      document.querySelector(".bld-insert-placeholder")?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setInsertTarget(null); };
    document.addEventListener("keydown", onKey);
    return () => { cancelAnimationFrame(raf); document.removeEventListener("keydown", onKey); };
  }, [insertTarget]);

  /** Click-to-insert from the Insert grid (dragging still works too): at the
   * section bar's spot if one is set, else after the selection, else at the
   * end of the page. */
  function insertFromPalette(type: string) {
    if (!tree || readOnly) return;
    const d = paletteDefaults(type);
    const node = createNode(type, d.props, d.children);
    let next: UINode = tree;
    if (insertTarget && findNodeById(tree, insertTarget.id)) next = insertNodeAt(tree, insertTarget.id, insertTarget.position, node);
    else if (selectedNodeId && selectedNodeId !== tree.id) next = insertNodeAt(tree, selectedNodeId, "after", node);
    else if (tree.id && CONTAINER_TYPES.has(tree.type)) next = insertNodeAt(tree, tree.id, "inside", node);
    if (next === tree) return;
    commitTreeEdit(next);
    setInsertTarget(null);
    setSelectedNodeId(node.id ?? null);
  }

  /** Collapsible group header for the Insert panel. While searching every
   * group with a match is open, so the header can't fold it. */
  function catHeader(label: string, count: number) {
    const searching = !!paletteQuery.trim();
    const open = searching || !collapsedCats.has(label);
    return (
      <button className="bld-cat-head" onClick={() => toggleCat(label)} aria-expanded={open} disabled={searching}>
        <span className={`bld-cat-chevron${open ? " open" : ""}`}><ChevronIcon /></span>
        <span className="bld-cat-label">{label}</span>
        <span className="bld-cat-count">{count}</span>
      </button>
    );
  }

  function toggleCat(label: string) {
    setCollapsedCats(prev => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      try { localStorage.setItem(PALETTE_COLLAPSED_STORAGE, JSON.stringify([...next])); } catch {}
      return next;
    });
  }

  /** Drops a ready-made section in as a top-level block: above the "+"
   * target, else after the section holding the selection, else at the end. */
  function insertSection(key: string) {
    if (!tree || readOnly) return;
    const node = buildSection(key);
    if (!node) return;
    let next: UINode = tree;
    const after = sectionOf(selectedNodeId);
    if (insertTarget && findNodeById(tree, insertTarget.id)) next = insertNodeAt(tree, insertTarget.id, insertTarget.position, node);
    else if (after && after !== tree.id) next = insertNodeAt(tree, after, "after", node);
    else if (tree.id && CONTAINER_TYPES.has(tree.type)) next = insertNodeAt(tree, tree.id, "inside", node);
    if (next === tree) return;
    commitTreeEdit(next);
    setInsertTarget(null);
    setSelectedNodeId(node.id ?? null);
  }

  /** Panel back arrow: up to the parent element, or clear the selection. */
  function selectParent() {
    if (!tree || !selectedNodeId) return;
    const parent = findParent(tree, selectedNodeId);
    setSelectedNodeId(parent && parent.id !== tree.id ? parent.id ?? null : null);
  }

  // Folds visual edits back into the chat transcript as a synthetic
  // assistant turn ("Edited visually"), which is also what version history
  // lists. Not on every commit, which would spam the transcript: after a few
  // seconds' pause (autosave below), on leaving Edit and on switching tabs.
  // A burst of edits within a few minutes updates the same turn rather than
  // adding a new one. This is deliberately NOT a parallel mutation path:
  // send()'s system prompt already tells the model its prior JSON is its own
  // last assistant message, so a visually-edited tree just becomes the AI's
  // next starting point, and it goes through the same saveToDb() as chat.
  function saveVisualEdits() {
    if (!editsDirty || !tree) return;
    setEditsDirty(false);
    const now = new Date().toISOString();
    const last = msgs[msgs.length - 1];
    const coalesce = last?.role === "assistant" && last.label === "Edited visually" && !!last.at
      && Date.now() - Date.parse(last.at) < 5 * 60 * 1000;
    const turn: ChatMsg = { role: "assistant", content: JSON.stringify(tree), label: "Edited visually", tree, at: now };
    const updatedMsgs: ChatMsg[] = coalesce ? [...msgs.slice(0, -1), turn] : [...msgs, turn];
    setMsgs(updatedMsgs);
    saveToDb(updatedMsgs, tree, msgs.length === 0, activeTabId);
  }

  function flushVisualEditsToChat() {
    saveVisualEdits();
    setEditHistory([]);
    setEditRedoStack([]);
  }

  // Autosave: Edit is the default view now, so edits can't wait for the
  // user to leave it.
  React.useEffect(() => {
    if (!editsDirty || readOnly) return;
    const t = setTimeout(saveVisualEdits, 3000);
    return () => clearTimeout(t);
    // Re-arms on each edit (tree) so it fires 3s after the last one.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editsDirty, tree, msgs, readOnly]);

  // ── Version history ────────────────────────────────────────────────────
  // Every assistant turn with a tree is a version: generated, updated by
  // chat, edited visually, or restored.
  const versions = React.useMemo(() => {
    const out: { idx: number; num: number; label: string; prompt: string | null; at?: string }[] = [];
    let prompt: string | null = null;
    msgs.forEach((m, idx) => {
      if (m.role === "user") { prompt = m.content; return; }
      if (!m.tree) return;
      out.push({ idx, num: out.length + 1, label: m.label ?? "Version", prompt: m.label === "Edited visually" || m.label?.startsWith("Restored") ? null : prompt, at: m.at });
      prompt = null;
    });
    return out;
  }, [msgs]);

  function restoreVersion(idx: number) {
    const v = versions.find(v => v.idx === idx);
    const vTree = msgs[idx]?.tree;
    if (!v || !vTree || !tree || readOnly) return;
    const restored = ensureIds(vTree);
    setEditHistory(h => [...h, tree].slice(-50));
    setEditRedoStack([]);
    setTree(restored);
    setEditsDirty(false);
    const updatedMsgs: ChatMsg[] = [...msgs, { role: "assistant", content: JSON.stringify(restored), label: `Restored version ${v.num}`, tree: restored, at: new Date().toISOString() }];
    setMsgs(updatedMsgs);
    saveToDb(updatedMsgs, restored, false, activeTabId);
    setViewingVersion(null);
    setShowVersions(false);
    setView("edit");
  }

  function changeView(next: "preview" | "code" | "edit" | "report") {
    if (next === "edit" && readOnly) return;
    if (next === "edit" && view !== "edit") livePage.clearHistory();
    if (view === "edit" && next !== "edit") flushVisualEditsToChat();
    setViewingVersion(null);
    setView(next);
  }

  // Pages open in Edit; a view-only page drops to Preview once its access
  // has loaded.
  React.useEffect(() => {
    if (readOnly && view === "edit") setView("preview");
  }, [readOnly, view]);

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
    // Installations only exist once the GitHub App is registered; asking
    // before that just gets a 501 (and a console error) on every load.
    if (isLoggedIn) { loadGithubConfig().then(configured => { if (configured) loadGithubInstallations(); }); }
    else { setGithubConfigured(null); setGithubInstallations([]); }
  }, [isLoggedIn]);

  // ── GitHub: handle the /api/github/install/callback redirect back here ──
  // Plain window.location parsing (not next/navigation's useSearchParams) -
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
  }, [msgs, loading, chatMin]);

  // ── Notifications: projects shared with you ─────────────────────────────
  React.useEffect(() => {
    if (!isLoggedIn) { setNotes([]); return; }
    fetch("/api/notifications")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setNotes(d.notifications ?? []); })
      .catch(() => {});
  }, [isLoggedIn, userId]);

  /** Marks notifications read for this account (optimistic; the bell clears
   * straight away and the server catches up). */
  function markNotesSeen(ids: string[]) {
    if (ids.length === 0) return;
    setNotes(ns => ns.map(n => (ids.includes(n.id) ? { ...n, seen: true } : n)));
    fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    }).catch(() => {});
  }

  const unreadNotes = notes.filter(n => !n.seen);
  // Newest unseen invite, shown as a banner on sign-in so it can't be missed.
  const inviteBanner = !inviteBannerDismissed ? unreadNotes[0] ?? null : null;

  function toggleNotes() {
    if (showNotes) { setShowNotes(false); return; }
    // Keep this opening's unread items highlighted, then count them as seen.
    setNotesFresh(new Set(unreadNotes.map(n => n.id)));
    markNotesSeen(unreadNotes.map(n => n.id));
    setShowNotes(true);
  }

  /** Opens a project someone shared with you in the Projects panel. */
  function openSharedProject(projectId: string) {
    setShowNotes(false);
    loadProjects();
    loadHistory();
    openProject(projectId);
  }

  // ── Start page ↔ editor ──────────────────────────────────────────────────
  // If the sign-in check never answers (network trouble), don't leave people
  // on a spinner: open the editor as if signed out.
  React.useEffect(() => {
    if (screen !== "boot") return;
    const t = setTimeout(() => { if (!screenInitRef.current) { screenInitRef.current = true; setScreen("editor"); } }, 8000);
    return () => clearTimeout(t);
  }, [screen]);
  React.useEffect(() => {
    if (authLoading || screenInitRef.current) return;
    screenInitRef.current = true;
    const params = new URLSearchParams(initialSearchRef.current);
    const deepLink = params.has("project") || params.has("page") || params.has("github") || params.has("github_error");
    setScreen(isLoggedIn && !deepLink ? "home" : "editor");
    setRail(isLoggedIn ? "pages" : "insert");
  }, [authLoading, isLoggedIn]);

  React.useEffect(() => {
    const onPop = () => {
      const id = new URLSearchParams(window.location.search).get("project");
      if (!id) setScreen("home");
      else if (id !== activeProjectId) openProject(id, false);
      else setScreen("editor");
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  });

  function goHome() {
    saveVisualEdits();
    setScreen("home");
    window.history.pushState({}, "", "/builder");
    loadProjects();
    loadHistory();
  }

  /** Opens a project in the editor: its most recent page, or a fresh page if
   * it has none. The URL (/builder?project=…) keeps you there on reload. */
  async function openProject(id: string, push = true) {
    saveVisualEdits();
    setActiveProjectId(id);
    setScreen("editor");
    setSelectedNodeId(null);
    setRail("pages");
    setPanelOpen(true);
    if (push) window.history.pushState({}, "", `/builder?project=${id}`);
    const current = openTabs.find(t => t.id === activeTabId);
    const emptyDraft = !!current?.id.startsWith("draft-") && msgs.length === 0;
    if (current && (current.projectId ?? null) === id && !emptyDraft) return;
    const d = await fetch(`/api/projects/${id}`).then(r => (r.ok ? r.json() : null)).catch(() => null);
    const pages: HistoryItem[] = (d?.project?.sessions ?? []).map((x: HistoryItem) => ({ ...x, projectId: id }));
    if (pages[0]) openTab(pages[0]); else newTab(id);
  }

  /** A page that isn't in any project, from the start page. */
  function openLoosePage(item: HistoryItem) {
    setScreen("editor");
    setRail("pages");
    setPanelOpen(true);
    window.history.pushState({}, "", "/builder?page=1");
    openTab({ ...item, projectId: null });
  }

  async function createProjectAndOpen(name: string) {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) return;
    const d = await res.json();
    setProjects(ps => [d.project, ...ps]);
    saveVisualEdits();
    setActiveProjectId(d.project.id);
    setScreen("editor");
    setRail("pages");
    setPanelOpen(true);
    window.history.pushState({}, "", `/builder?project=${d.project.id}`);
    newTab(d.project.id);
  }

  /** Opens the profile menu with the cursor in the API key field. */
  function openKeyField() {
    setShowProfile(true);
    requestAnimationFrame(() => (document.querySelector(".bld-profile-menu .bld-key-input") as HTMLInputElement | null)?.focus());
  }

  /** Start page: describe an idea; a project named after it opens and the
   * first page is generated straight away. */
  function startFromPrompt(prompt: string) {
    pendingStartRef.current = { prompt };
    createProjectAndOpen(shortTitle(prompt));
  }

  function startFromTemplate(key: string) {
    pendingStartRef.current = { template: key };
    createProjectAndOpen(PAGE_TEMPLATES.find(t => t.key === key)?.name ?? "New project");
  }

  async function renameProject(id: string, name: string) {
    const clean = name.trim().slice(0, 120);
    if (!clean) return;
    setProjects(ps => ps.map(p => (p.id === id ? { ...p, name: clean } : p)));
    await fetch(`/api/projects/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: clean }) }).catch(() => {});
  }

  /** Rail icon: opens its panel, or folds the panel if it's already showing. */
  function showRail(t: RailTab) {
    if (t === rail && panelOpen && !selectedNodeId) { setPanelOpen(false); return; }
    setSelectedNodeId(null);
    setRail(t);
    setPanelOpen(true);
  }

  React.useEffect(() => {
    if (!showNotes) return;
    const onDown = (e: MouseEvent) => { if (notesRef.current && !notesRef.current.contains(e.target as Node)) setShowNotes(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setShowNotes(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [showNotes]);

  // ── Invite link: /builder?project=<id> opens that project ────────────────
  React.useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("project");
    if (id) pendingProjectRef.current = id;
  }, []);
  React.useEffect(() => {
    const id = pendingProjectRef.current;
    if (!id || authLoading) return;
    if (!isLoggedIn) {
      setGithubNotice({ type: "success", text: "Sign in with the email address you were invited with to open the shared project." });
      return;
    }
    if (projects.length === 0) return;   // wait for the list (claims invites first)
    pendingProjectRef.current = null;
    if (projects.some(p => p.id === id)) {
      setGithubNotice(null);
      openProject(id, false);
    } else {
      window.history.replaceState({}, "", "/builder");
      setScreen("home");
      setGithubNotice({ type: "error", text: "That project isn't shared with this account. Check you signed in with the address you were invited with." });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, authLoading, projects]);

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

  // Fetches a session's full content from the network and applies it as the
  // active tab. Populates tabCacheRef so re-visiting this tab later this
  // session skips the fetch entirely - call openTab() for that fast path,
  // not this directly, unless you specifically need a forced refetch.
  async function loadSession(id: string) {
    setShowHistory(false);
    const res = await fetch(`/api/sessions/${id}`);
    if (!res.ok) return;
    const { session: s, access } = await res.json();
    if (access) setPageAccess(a => ({ ...a, [id]: access }));
    const loadedMsgs: ChatMsg[] = s.messages ?? [];
    const lastTree = [...loadedMsgs].reverse().find(m => m.role === "assistant" && m.tree)?.tree ?? null;
    tabCacheRef.current[id] = { msgs: loadedMsgs, tree: lastTree as UINode | null };
    setMsgs(loadedMsgs);
    setTree(lastTree as UINode | null);
    setDbSessionId(id);
    setActiveTabId(id);
    setView("edit");
    localStorage.setItem(SESSION_ID_STORAGE, id);
    // Follow the session into its project's context - switching pages
    // within a project (the "quick switch" part of Projects v1) should
    // leave you positioned in that project, not wherever you were before.
    setActiveProjectId(s.projectId ?? null);
    // Race with renameTab(): a double-click's two plain `click`s (fired
    // before the `dblclick` that actually opens the rename input) can
    // trigger this fetch for a not-yet-cached tab at the same moment the
    // user renames it. If this resolves after that rename commits, using
    // the server's `s.name` here would silently revert it - the local
    // state (openTabs) is always at least as fresh as whatever this GET
    // returned, since a rename updates it directly and optimistically.
    // Only a brand-new tab entry (not already in openTabs) has no local
    // name to defer to, so only that case falls back to `s.name`.
    setOpenTabs(tabs => {
      const existing = tabs.find(t => t.id === id);
      const entry: HistoryItem = existing
        ? { ...existing, createdAt: s.createdAt, updatedAt: s.updatedAt, projectId: s.projectId ?? null }
        : { id, name: s.name, createdAt: s.createdAt, updatedAt: s.updatedAt, projectId: s.projectId ?? null };
      return existing ? tabs.map(t => (t.id === id ? entry : t)) : [...tabs, entry];
    });
  }

  // A saved page restored from localStorage on reload never went through
  // loadSession, so it has no access info yet: fetch it, or a shared page
  // reopened from a previous visit wouldn't join its live room until clicked.
  React.useEffect(() => {
    if (isLoggedIn && dbSessionId && activeTabId === dbSessionId && !pageAccess[dbSessionId]) refreshPageAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, dbSessionId, activeTabId]);

  // Re-reads the open page's role/live flags without reloading its content -
  // after sharing changes, so a page that just became shared goes live (and
  // one that stopped being shared drops out of its room) straight away.
  async function refreshPageAccess() {
    if (!dbSessionId) return;
    const res = await fetch(`/api/sessions/${dbSessionId}`);
    if (!res.ok) return;
    const { access } = await res.json();
    if (access) setPageAccess(a => ({ ...a, [dbSessionId]: access }));
  }

  // Opens (or focuses, if already open) a tab for the given session. Restores
  // instantly from tabCacheRef when available - the actual "quick switch
  // between several pages you're iterating on" payoff of having tabs at all -
  // and only falls back to loadSession's network fetch on a genuine first open.
  function openTab(item: HistoryItem) {
    if (item.id !== activeTabId) saveVisualEdits();
    setShowHistory(false);
    setOpenTabs(tabs => (tabs.some(t => t.id === item.id) ? tabs : [...tabs, item]));
    const cached = tabCacheRef.current[item.id];
    if (cached) {
      setMsgs(cached.msgs);
      setTree(cached.tree);
      setDbSessionId(item.id);
      setActiveTabId(item.id);
      setView("edit");
      localStorage.setItem(SESSION_ID_STORAGE, item.id);
      setActiveProjectId(item.projectId ?? null);
    } else {
      loadSession(item.id);
    }
  }

  // Closes a tab (just removes it from the strip - the saved session itself
  // is untouched). If it was the active tab, focuses a neighbor, or clears
  // the canvas if that was the last tab open.
  function closeTab(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    delete tabCacheRef.current[id];
    const idx = openTabs.findIndex(t => t.id === id);
    const next = openTabs.filter(t => t.id !== id);
    setOpenTabs(next);
    if (activeTabId === id) {
      const neighbor = next[idx] ?? next[idx - 1] ?? null;
      if (neighbor) openTab(neighbor); else reset();
    }
  }

  // Opens a new blank draft tab. Distinct from reset() (which just clears the
  // canvas with no tab bookkeeping) - this is the user-facing "+" action.
  function newTab(projectId: string | null = activeProjectId) {
    saveVisualEdits();
    const draftId = `draft-${Date.now()}`;
    const draft: HistoryItem = { id: draftId, name: "Untitled", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), projectId };
    setActiveProjectId(projectId);
    setOpenTabs(tabs => [...tabs, draft]);
    reset();
    setActiveTabId(draftId);
  }

  /** Commits a tab rename: updates openTabs (what the strip reads) and
   * history (what the sidebar reads) so both agree without a re-fetch, and
   * - for a tab already backed by a real session (id isn't the `draft-…`
   * local-only form) - persists it server-side. A draft tab's name lives
   * only in local state/localStorage until its first message creates the
   * real session (see the name-precedence comment in saveToDb below); no
   * network call needed yet, and none is made. */
  function renameTab(id: string, rawName: string) {
    const name = rawName.trim().slice(0, 120) || "Untitled";
    setOpenTabs(tabs => tabs.map(t => (t.id === id ? { ...t, name } : t)));
    setHistory(h => h.map(s => (s.id === id ? { ...s, name } : s)));
    if (!id.startsWith("draft-")) {
      fetch(`/api/sessions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      }).catch(() => {});
    }
  }

  async function deleteSession(id: string, e?: React.MouseEvent) {
    e?.stopPropagation();
    const deleted = history.find(s => s.id === id);
    await fetch(`/api/sessions/${id}`, { method: "DELETE" });
    setHistory(h => h.filter(s => s.id !== id));
    if (deleted?.projectId) {
      setProjects(ps => ps.map(p => p.id === deleted.projectId ? { ...p, sessionCount: Math.max(0, p.sessionCount - 1) } : p));
    }
    delete tabCacheRef.current[id];
    const idx = openTabs.findIndex(t => t.id === id);
    if (idx !== -1) {
      const next = openTabs.filter(t => t.id !== id);
      setOpenTabs(next);
      if (activeTabId === id) {
        const neighbor = next[idx] ?? next[idx - 1] ?? null;
        if (neighbor) openTab(neighbor); else reset();
      }
    } else if (dbSessionId === id) {
      reset();
    }
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

  async function deleteProject(id: string, e?: React.MouseEvent) {
    e?.stopPropagation();
    const proj = projects.find(p => p.id === id);
    if (!window.confirm(`Move "${proj?.name ?? "this project"}" and its ${proj?.sessionCount ?? 0} page(s) to the Trash? You can restore it from the start page for 30 days.`)) return;

    const containedIds = history.filter(s => s.projectId === id).map(s => s.id);
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setProjects(ps => ps.filter(p => p.id !== id));
    setHistory(h => h.filter(s => s.projectId !== id));
    if (activeProjectId === id) { setActiveProjectId(null); if (screen === "editor") goHome(); }
    containedIds.forEach(cid => delete tabCacheRef.current[cid]);
    const remainingTabs = openTabs.filter(t => !containedIds.includes(t.id));
    setOpenTabs(remainingTabs);
    if (dbSessionId && containedIds.includes(dbSessionId)) {
      if (remainingTabs[0]) openTab(remainingTabs[0]); else reset();
    }
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

  // Share from the editor. Access is per project, so a loose page first gets
  // a project of its own (named after the page), then the invite dialog opens.
  const [sharingPage, setSharingPage] = React.useState(false);
  async function shareCurrentPage() {
    if (activePageProjectId) { setShareProjectId(activePageProjectId); return; }
    if (!dbSessionId || sharingPage) return;
    setSharingPage(true);
    try {
      const pageName = history.find(h => h.id === dbSessionId)?.name ?? openTabs.find(t => t.id === dbSessionId)?.name ?? "Untitled";
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: pageName }),
      });
      if (!res.ok) return;
      const { project } = await res.json();
      setProjects(ps => [project, ...ps]);
      await moveSessionToProject(dbSessionId, project.id);
      setOpenTabs(tabs => tabs.map(t => t.id === dbSessionId ? { ...t, projectId: project.id } : t));
      setActiveProjectId(project.id);
      setExpandedProjects(ex => new Set(ex).add(project.id));
      setShareProjectId(project.id);
    } finally {
      setSharingPage(false);
    }
  }

  // ── Azure DevOps helpers ─────────────────────────────────────────────────
  // Connections are per-Project (not per-user), so everything here keys off
  // activeProjectId - Ungrouped sessions have no ADO surface at all.
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
      return d;
    } catch {
      setAdoStatus({ connected: false });
      setAdoLinks([]);
      return { connected: false };
    } finally {
      setAdoLoading(false);
    }
  }

  // Sidebar row trigger (mirrors openGithubModal) - selects the project so
  // its ADO strip becomes visible, then only pops the connect modal if that
  // project genuinely isn't connected yet. Avoids showing the raw "Connect"
  // form over an existing connection, since (unlike the GitHub modal) the ADO
  // modal has no "already connected" branch of its own.
  async function openAdoConnect(projectId: string) {
    selectProject(projectId);
    const status = await loadAdoForProject(projectId);
    if (!status?.connected) {
      setAdoConnectErr(null);
      setAdoModalOpen(true);
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
  // state transition) - errors surface inline via bld-msg-error styling
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
      case "invalid_state":           return "That GitHub connection link expired. Try again.";
      case "install_requested":       return "Installation request sent. Waiting on approval from an organization owner.";
      case "missing_installation_id": return "GitHub didn't return an installation id. Try again.";
      case "installation_not_found":  return "Couldn't find that GitHub installation.";
      case "callback_failed":         return "Connecting to GitHub failed. Try again.";
      case "unauthenticated":         return "Sign in, then try connecting GitHub again.";
      default:                        return "Something went wrong connecting GitHub.";
    }
  }

  async function loadGithubConfig(): Promise<boolean> {
    try {
      const res = await fetch("/api/github/config");
      const configured = res.ok ? !!(await res.json()).configured : false;
      setGithubConfigured(configured);
      return configured;
    } catch {
      setGithubConfigured(false);
      return false;
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

  // Full-page navigation (not fetch) - the route redirects the browser to
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

  // `currentTabId` is passed explicitly rather than read from the
  // `activeTabId` closure: when called from send() right after that same
  // call created a draft tab, the state update hasn't flushed into this
  // closure yet (same synchronous invocation, not yet re-rendered) - reading
  // `activeTabId` here would still see the pre-draft value (often null).
  async function saveToDb(updatedMsgs: ChatMsg[], updatedTree: UINode, isFirst: boolean, currentTabId: string | null) {
    if (!isLoggedIn) return;
    const firstPrompt = updatedMsgs.find(m => m.role === "user")?.content;
    const autoName = firstPrompt ? shortTitle(firstPrompt) : (updatedMsgs[0]?.label?.replace(/^Started from the /, "").replace(/ template$/, "") || "Untitled");
    try {
      if (isFirst || !dbSessionId) {
        const oldTabId = currentTabId ?? dbSessionId ?? activeTabId; // the draft tab this content was living under
        // A rename made before the first message would otherwise be lost -
        // this is the only place a fresh session's name gets set, and it
        // defaults to deriving one from the first message. Prefer a name
        // the user already typed on this tab (renameTab, called pre-save)
        // over that derived default.
        const renamedAlready = oldTabId && openTabs.find(t => t.id === oldTabId)?.name;
        const name = renamedAlready && renamedAlready !== "Untitled" ? renamedAlready : autoName;
        const res = await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, messages: updatedMsgs, tree: updatedTree, projectId: activeProjectId }),
        });
        if (res.ok) {
          const d = await res.json();
          const newId = d.session.id;
          setDbSessionId(newId);
          setActiveTabId(newId);
          localStorage.setItem(SESSION_ID_STORAGE, newId);
          setHistory(h => [d.session, ...h]);
          if (!activeProjectId && d.session.projectId) { setActiveProjectId(d.session.projectId); loadProjects(); }
          if (activeProjectId) {
            setProjects(ps => ps.map(p => p.id === activeProjectId ? { ...p, sessionCount: p.sessionCount + 1 } : p));
          }
          // The draft tab's synthetic id needs to become the real session id
          // now that one exists - same tab, same open position, real identity.
          // Falls back to appending rather than silently dropping the tab if,
          // for some reason, no tab was tracking this content yet.
          tabCacheRef.current[newId] = { msgs: updatedMsgs, tree: updatedTree };
          if (oldTabId) delete tabCacheRef.current[oldTabId];
          setOpenTabs(tabs => {
            const matched = tabs.some(t => t.id === oldTabId);
            return matched
              ? tabs.map(t => (t.id === oldTabId ? { ...d.session, name } : t))
              : [...tabs, { ...d.session, name }];
          });
        }
      } else {
        await fetch(`/api/sessions/${dbSessionId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: updatedMsgs, tree: updatedTree }),
        });
        tabCacheRef.current[dbSessionId] = { msgs: updatedMsgs, tree: updatedTree };
        setHistory(h =>
          h.map(s => s.id === dbSessionId ? { ...s, updatedAt: new Date().toISOString() } : s)
        );
        setOpenTabs(tabs => tabs.map(t => (t.id === dbSessionId ? { ...t, updatedAt: new Date().toISOString() } : t)));
      }
    } catch {}
  }

  // The profile-menu key input unmounts on outside-click (see the
  // showProfile effect) as soon as the mousedown fires - before the input's
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

  function chooseModel(id: string) {
    setModel(id);
    localStorage.setItem(MODEL_STORAGE, id);
  }

  async function send(text?: string) {
    const txt = (text ?? input).trim();
    if (!txt || loading || readOnly) return;
    setInput("");
    setNeedsKey(false);

    // A first message sent with no tab open yet (page just loaded, nothing
    // clicked "+" or opened from History) still needs one - otherwise the
    // session this creates has nowhere to show up in the tab strip. Resolve
    // synchronously into a local var: setActiveTabId below won't be visible
    // via the `activeTabId` closure until next render, so saveToDb (called
    // later in this same invocation) needs it passed explicitly, not re-read.
    let currentTabId = activeTabId;
    if (!currentTabId) {
      currentTabId = `draft-${Date.now()}`;
      setActiveTabId(currentTabId);
      setOpenTabs(tabs => [...tabs, { id: currentTabId!, name: "Untitled", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), projectId: activeProjectId }]);
    }

    // With an element selected in Edit, the prompt is scoped to it (the chip
    // above the input shows which), like Figma's AI with a selection.
    const scope = view === "edit" && selectedNode && tree && selectedNode.id !== tree.id ? selectedNode : null;
    const scoped = scope ? (() => {
      const label = firstText(scope);
      const short = label && label.length > 40 ? `${label.slice(0, 40)}…` : label;
      return `In the ${scope.type}${short ? ` ("${short}")` : ""}: ${txt}`;
    })() : txt;
    const userMsg: ChatMsg = { role: "user", content: scoped, at: new Date().toISOString() };
    const next = [...msgs, userMsg];
    setMsgs(next);
    setLoading(true);

    try {
      const apiMessages = next.map(m => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, apiKey, model }),
      });
      const data = await res.json();

      if (!res.ok) {
        setNeedsKey(data.error === "missing_key" || data.error === "invalid_key");
        setMsgs(prev => [...prev, { role: "assistant", content: "", isError: true, errorText: data.message || data.error || "Generation failed" }]);
      } else {
        const newTree = data.tree as UINode;
        setTree(newTree);
        setView("edit");
        const isFirst = msgs.length === 0;
        const updatedMsgs: ChatMsg[] = [
          ...next,
          { role: "assistant", content: data.raw || JSON.stringify(newTree), label: isFirst ? "Interface generated" : "Interface updated", tree: newTree, at: new Date().toISOString() },
        ];
        setMsgs(updatedMsgs);
        // Get out of the way so the result is visible; focusing the input
        // opens the conversation again.
        setChatMin(true);
        await saveToDb(updatedMsgs, newTree, isFirst, currentTabId);
      }
    } catch (e: any) {
      setMsgs(prev => [...prev, { role: "assistant", content: "", isError: true, errorText: e?.message || "Network error" }]);
    } finally {
      setLoading(false);
    }
  }

  // Deliberately does NOT clear activeProjectId - "New" while inside a
  // project should start a fresh page still grouped under that project
  // (the "iterate across multiple pages in one project" workflow). To start
  // a genuinely ungrouped session, select "Ungrouped" in the sidebar first.
  function reset() {
    setMsgs([]);
    setTree(null);
    setNeedsKey(false);
    setInput("");
    setDbSessionId(null);
    setActiveTabId(null);
    localStorage.removeItem(MSGS_STORAGE);
    localStorage.removeItem(TREE_STORAGE);
    localStorage.removeItem(SESSION_ID_STORAGE);
  }

  const code = tree
    ? `import {\n  /* … */\n} from "sandhata-ui";\n\nexport default function Generated() {\n  return (\n${treeToJSX(tree, 2)}\n  );\n}`
    : "";

  // Report tab: every node whose type isn't a governed Spectra component or
  // layout primitive - same check Renderer.tsx's "Unknown: {type}" fallback
  // makes per-node, recomputed only when the tree actually changes.
  const auditIssues: AuditIssue[] = React.useMemo(() => (tree ? auditTree(tree) : []), [tree]);

  /** Jump to an audited element: switch to Edit view and select it, same as
   * clicking it on the canvas. Elements inserted before the visual editor's
   * id-backfill (ensureIds) ran won't have a nodeId yet - those still show
   * in the report (type + path), just without a clickable jump. */
  function goToAuditIssue(issue: AuditIssue) {
    if (!issue.nodeId) return;
    setView("edit");
    setSelectedNodeId(issue.nodeId);
  }

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
  const promptCount = msgs.filter(m => m.role === "user").length;
  const homeTemplates = React.useMemo(() => PAGE_TEMPLATES.map(t => ({ key: t.key, name: t.name, tree: buildTemplate(t.key) })), []);
  // The panel shows the selected element's editor instead of the rail tab
  const editingSelection = !!tree && viewingVersion === null && view === "edit" && !!selectedNode;
  // The chat only folds away once there's a design to look at
  const chatCollapsed = chatMin && !!tree;
  // Preview hides the editing interface (panels, chat, tabs, edit tools)
  const previewing = !!tree && viewingVersion === null && view === "preview";

  // ── Getting started: create a project, generate a page, invite someone ──
  // (GitHub and Azure DevOps aren't live yet, so they live in Settings and
  // don't count here.)
  const gsSteps = [
    { key: "project", label: "Create a project", done: projects.some(p => !p.role || p.role === "owner") },
    { key: "page", label: "Generate your first page", done: history.length > 0 },
    { key: "invite", label: "Invite a teammate", done: projects.some(p => p.shared) },
  ];
  const gsDoneCount   = gsSteps.filter(x => x.done).length;
  const gsOutstanding = isLoggedIn && !projLoading && !histLoading && gsDoneCount < gsSteps.length;

  function gsAction(key: string) {
    setShowProfile(false);
    setScreen("editor");
    if (key === "project") { setSelectedNodeId(null); setRail("projects"); setPanelOpen(true); setShowNewProject(true); }
    else if (key === "page") { setChatMin(false); requestAnimationFrame(() => inputRef.current?.focus()); }
    else if (key === "invite") {
      const pid = activeProjectId ?? projects.find(p => !p.role || p.role === "owner")?.id ?? null;
      if (pid) setShareProjectId(pid); else { setRail("projects"); setPanelOpen(true); setShowNewProject(true); }
    }
  }

  function setGsHiddenPersist(hidden: boolean) {
    setGsHidden(hidden);
    try { hidden ? localStorage.setItem(GS_HIDDEN_STORAGE, "1") : localStorage.removeItem(GS_HIDDEN_STORAGE); } catch {}
  }

  /** The checklist card: in the sidebar ("card", minimisable) or inside the
   * profile menu ("menu"). */
  function renderGettingStarted(where: "card" | "menu") {
    const r = 8;
    const circumference = 2 * Math.PI * r;
    const offset = circumference * (1 - gsDoneCount / gsSteps.length);
    return (
      <div className={`bld-gs-card bld-gs-card--${where}`}>
        <div className="bld-gs-header">
          <span className="bld-gs-title">Getting started</span>
          <span className="bld-gs-progress">
            <span className="bld-gs-count">{gsDoneCount}/{gsSteps.length}</span>
            <svg width="20" height="20" viewBox="0 0 20 20" className="bld-gs-ring">
              <circle cx="10" cy="10" r={r} className="bld-gs-ring-track" />
              <circle cx="10" cy="10" r={r} className="bld-gs-ring-fill" strokeDasharray={circumference} strokeDashoffset={offset} />
            </svg>
          </span>
          {where === "card" && (
            <button className="bld-gs-min" onClick={() => setGsHiddenPersist(true)} title="Minimise (still in your profile menu)" aria-label="Minimise Getting started"><ChevronUpIcon /></button>
          )}
        </div>
        <div className="bld-gs-list">
          {gsSteps.map(step => step.done ? (
            <div key={step.key} className="bld-gs-row bld-gs-row--done"><CheckIcon /> <span>{step.label}</span></div>
          ) : (
            <button key={step.key} className="bld-gs-action" onClick={() => gsAction(step.key)}>{step.label}</button>
          ))}
        </div>
        {where === "menu" && gsHidden && <button className="bld-gs-pin" onClick={() => setGsHiddenPersist(false)}>Show in sidebar</button>}
      </div>
    );
  }
  const ungroupedSessions = history.filter(s => !s.projectId);

  // The currently-open page only gets ADO "page" controls when it actually
  // belongs to the active project - activeProjectId can be changed in the
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
  // ADO rows - visually similar weight to the preview/code bld-tabs toggle.
  function renderAdoRow(kind: "project" | "page", link: WorkItemLinkItem | undefined, label: string) {
    const isLinking = adoLinking === kind;
    const isUpdating = adoUpdating === kind;
    const error = adoRowErrors[kind];
    return (
      <div className="bld-ado-row">
        <span className="bld-ado-row-label">{label}</span>
        {link ? (
          <>
            <a className="bld-ado-item-link" href={link.adoUrl} target="_blank" rel="noopener noreferrer" title={`${link.adoWorkItemType} #${link.adoWorkItemId}: open in Azure DevOps`}>
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
  // "Ungrouped" bucket - the move-select lets you re-file an existing page
  // into a different project (or out of one) without deleting/recreating it.
  async function duplicatePage(id: string) {
    setPageMenuId(null);
    const d = await fetch(`/api/sessions/${id}`).then(r => (r.ok ? r.json() : null)).catch(() => null);
    const src = d?.session;
    if (!src) return;
    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: `Copy of ${src.name}`.slice(0, 120), messages: src.messages, tree: src.tree, projectId: src.projectId }),
    });
    if (res.ok) { loadHistory(); loadProjects(); }
  }

  // Vzy-style page row: name and time, everything else behind ⋯
  function renderSessionRow(s: HistoryItem) {
    const canManage = !projects.find(p => p.id === s.projectId)?.role || projects.find(p => p.id === s.projectId)?.role !== "viewer";
    return (
      <div key={s.id} className={`bld-page-row${s.id === dbSessionId ? " active" : ""}`} onClick={() => renamingTabId !== s.id && openTab(s)}>
        {renamingTabId === s.id ? (
          <input
            className="bld-page-rename"
            value={renameDraft}
            autoFocus
            onFocus={e => e.currentTarget.select()}
            onClick={e => e.stopPropagation()}
            onChange={e => setRenameDraft(e.target.value)}
            onBlur={() => { renameTab(s.id, renameDraft); setRenamingTabId(null); }}
            onKeyDown={e => { if (e.key === "Enter") e.currentTarget.blur(); if (e.key === "Escape") setRenamingTabId(null); }}
          />
        ) : (
          <span className="bld-page-row-name" title={s.name}>{s.name}</span>
        )}
        <span className="bld-page-row-time">{relativeTime(s.updatedAt)}</span>
        {canManage && (
          <div className="bld-page-row-menu" onClick={e => e.stopPropagation()}>
            <button className="bld-page-row-more" aria-label={`Actions for ${s.name}`} aria-haspopup="menu" aria-expanded={pageMenuId === s.id}
              onClick={() => setPageMenuId(m => (m === s.id ? null : s.id))}><MoreIcon /></button>
            {pageMenuId === s.id && (
              <div className="bld-menu" role="menu">
                <button role="menuitem" onClick={() => { setPageMenuId(null); setRenameDraft(s.name); setRenamingTabId(s.id); }}>Rename</button>
                <button role="menuitem" onClick={() => duplicatePage(s.id)}>Duplicate</button>
                {projects.filter(p => p.id !== s.projectId && (!p.role || p.role !== "viewer")).length > 0 && (
                  <>
                    <span className="bld-menu-label">Move to</span>
                    {projects.filter(p => p.id !== s.projectId && (!p.role || p.role !== "viewer")).map(p => (
                      <button key={p.id} role="menuitem" onClick={() => { setPageMenuId(null); moveSessionToProject(s.id, p.id); }}>{p.name}</button>
                    ))}
                  </>
                )}
                <button role="menuitem" className="danger" onClick={() => { setPageMenuId(null); deleteSession(s.id); }}>Move to Trash</button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // One field row in the visual editor's property panel. Text/number fields
  // commit on blur (not per-keystroke - an undo entry per keystroke would
  // make undo useless), keyed on selectedNodeId+field.key so switching the
  // selected node remounts the input with the new node's current value
  // instead of an uncontrolled input carrying over stale text mid-edit.
  function renderPropField(field: PropField, node: UINode) {
    const current = node.props?.[field.key];
    const fieldKey = `${node.id}:${field.key}`;
    const inputId = `prop-${fieldKey}`;
    let control: React.ReactNode;
    if (field.kind === "boolean") {
      // Yes/No segmented control rather than a bare checkbox, same as the
      // inspector in Framer/Figma: both states visible, one click to flip.
      control = (
        <div className="bld-prop-segmented" role="group" aria-label={field.label}>
          <button type="button" className={current ? "on" : ""} onClick={() => updateSelectedProp(field.key, true)}>Yes</button>
          <button type="button" className={!current ? "on" : ""} onClick={() => updateSelectedProp(field.key, false)}>No</button>
        </div>
      );
    } else if (field.kind === "select" && field.options.length <= 4 && field.options.every(o => o.length <= 8)) {
      // Short option sets as a segmented control (Framer/Vzy style); click
      // the active option again to go back to the component's default.
      const short: Record<string, string> = { small: "S", medium: "M", large: "L" };
      control = (
        <div className="bld-prop-segmented" role="group" aria-label={field.label} style={{ gridTemplateColumns: `repeat(${field.options.length}, 1fr)` }}>
          {field.options.map(o => {
            const on = String(current ?? "") === o;
            const label = short[o] ?? (field.key === "level" ? `H${o}` : o);
            return (
              <button key={o} type="button" className={on ? "on" : ""} title={o} onClick={() => updateSelectedProp(field.key, on ? undefined : (field.key === "level" ? Number(o) : o))}>
                {label}
              </button>
            );
          })}
        </div>
      );
    } else if (field.kind === "select") {
      control = (
        <select id={inputId} className="bld-prop-input" value={current ?? ""} onChange={e => updateSelectedProp(field.key, e.target.value || undefined)}>
          <option value="">Default</option>
          {field.options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      );
    } else {
      // Text and number commit on blur (or Enter), not per keystroke: an undo
      // entry per keystroke would make undo useless.
      control = (
        <input
          id={inputId} key={fieldKey} className="bld-prop-input" type={field.kind === "number" ? "number" : "text"}
          defaultValue={current ?? ""}
          onKeyDown={e => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
          onBlur={e => updateSelectedProp(
            field.key,
            e.target.value === "" ? undefined : field.kind === "number" ? Number(e.target.value) : e.target.value,
          )}
        />
      );
    }
    return (
      <div key={fieldKey} className="bld-prop-row">
        <label htmlFor={field.kind === "boolean" ? undefined : inputId}>{field.label}</label>
        {control}
      </div>
    );
  }

  // Layers tab: a collapsible tree of the whole document, so a node that's
  // hard to reach on canvas (behind another element, inside an empty-looking
  // container) can still be found and selected. Clicking a row reuses the
  // exact same selectedNodeId/hoveredNodeId state canvas click/hover already
  // drive - the outline-highlight CSS and the auto-flip-to-Properties effect
  // both keep working unmodified, this is just a second way to set them.
  function renderLayerRow(node: UINode, depth: number): React.ReactNode {
    const id = node.id;
    if (!id) return null;
    const hasChildren = Array.isArray(node.children) && node.children.length > 0;
    const collapsed = collapsedLayerIds.has(id);
    const textPreview = typeof node.children === "string" ? node.children : null;
    return (
      <div key={id}>
        <div
          className={`bld-layer-row${selectedNodeId === id ? " bld-layer-row--selected" : ""}${hoveredNodeId === id && selectedNodeId !== id ? " bld-layer-row--hovered" : ""}`}
          style={{ paddingLeft: 8 + depth * 14 }}
          onClick={() => setSelectedNodeId(id)}
          onMouseEnter={() => setHoveredNodeId(id)}
          onMouseLeave={() => setHoveredNodeId(prev => (prev === id ? null : prev))}
        >
          {hasChildren ? (
            <button
              className={`bld-layer-toggle${collapsed ? " bld-layer-toggle--collapsed" : ""}`}
              onClick={(e) => {
                e.stopPropagation(); // toggling shouldn't also select the row
                setCollapsedLayerIds(prev => {
                  const next = new Set(prev);
                  if (next.has(id)) next.delete(id); else next.add(id);
                  return next;
                });
              }}
              title={collapsed ? "Expand" : "Collapse"}
            >
              <ChevronIcon />
            </button>
          ) : (
            <span className="bld-layer-toggle-spacer" />
          )}
          <span className="bld-layer-icon"><ComponentIcon type={node.type} size={13} /></span>
          <span className="bld-layer-type">{node.type}</span>
          {textPreview && <span className="bld-layer-text">{textPreview}</span>}
        </div>
        {hasChildren && !collapsed && (node.children as UINode[]).map(child => renderLayerRow(child, depth + 1))}
      </div>
    );
  }

  /** Notifications bell and profile menu: in the editor's rail and on the
   * start page. */
  function renderAccount(where: "rail" | "home") {
    return (
      <div className={`bld-account bld-account--${where}`}>
          {isLoggedIn && (
            <div className="bld-notes" ref={notesRef}>
              <button
                className={`bld-icon-btn${showNotes ? " active" : ""}`}
                onClick={toggleNotes}
                title="Notifications"
                aria-label={unreadNotes.length ? `Notifications, ${unreadNotes.length} new` : "Notifications"}
                aria-expanded={showNotes}
              >
                <BellIcon />
                {unreadNotes.length > 0 && <span className="bld-notes-badge">{unreadNotes.length}</span>}
              </button>
              {showNotes && (
                <div className="bld-notes-menu" role="dialog" aria-label="Notifications">
                  <div className="bld-notes-head">Notifications</div>
                  {notes.length === 0 ? (
                    <p className="bld-notes-empty">Nothing yet. When someone shares a project with you, it shows up here.</p>
                  ) : (
                    <ul className="bld-notes-list">
                      {notes.map(n => {
                        const who = n.invitedBy.name || n.invitedBy.email || "Someone";
                        return (
                          <li key={n.id} className={`bld-note${notesFresh.has(n.id) ? " bld-note--new" : ""}`}>
                            {n.invitedBy.image
                              ? <img src={n.invitedBy.image} alt="" className="bld-note-avatar" />
                              : <span className="bld-note-avatar bld-note-avatar--initial">{who.slice(0, 1).toUpperCase()}</span>}
                            <div className="bld-note-body">
                              <span className="bld-note-text">
                                <b>{who}</b> invited you to {n.role === "editor" ? "edit" : "view"} <b>{n.projectName}</b>
                              </span>
                              <span className="bld-note-time">{new Date(n.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short" })}</span>
                            </div>
                            <button className="bld-note-open" onClick={() => openSharedProject(n.projectId)}>Open</button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}
          {/* Profile menu - sign in/out + API key live here, off the main chat */}
          <div className="bld-profile" ref={profileRef}>
            <button
              className={`bld-profile-btn${showProfile ? " active" : ""}${!isLoggedIn && !authLoading ? " bld-profile-btn--signin" : ""}`}
              onClick={() => setShowProfile(v => !v)}
              title={isLoggedIn ? `${session?.user?.name || session?.user?.email || "Account"}${gsOutstanding ? " (setup steps left)" : ""}` : "Sign in or add an API key"}
              aria-label={isLoggedIn ? "Account" : "Sign in or add an API key"}
            >
              {isLoggedIn && session?.user?.image
                ? <img src={session.user.image} alt="" className="bld-profile-avatar" />
                : isLoggedIn ? <UserIcon /> : <SignInIcon />}
            </button>
            {/* Blue dot: Getting started steps left (GitHub / Azure DevOps) */}
            {gsOutstanding && <span className="bld-profile-dot" aria-hidden="true" />}

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
                    {gsOutstanding && (
                      <>
                        {renderGettingStarted("menu")}
                        <div className="bld-profile-divider" />
                      </>
                    )}
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
                        autoComplete="off"
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
                      ? "Signed in. Your key is linked to your account and follows you across devices."
                      : "Not signed in. Your key is kept in this browser only."}
                  </p>
                </div>

                <div className="bld-profile-divider" />

                <div className="bld-profile-section">
                  <div className="bld-profile-section-label">Model</div>
                  <select
                    className="bld-key-input"
                    value={model}
                    onChange={e => chooseModel(e.target.value)}
                  >
                    {AVAILABLE_MODELS.map(m => (
                      <option key={m.id} value={m.id}>{m.label}</option>
                    ))}
                  </select>
                  <p className="bld-profile-key-note">Saved in this browser, applies to every generation from here on.</p>
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
      {shareProjectId && (
        <ShareDialog
          projectId={shareProjectId}
          projectName={projects.find(p => p.id === shareProjectId)?.name ?? "project"}
          currentUserId={(session?.user as { id?: string } | undefined)?.id ?? null}
          onClose={() => setShareProjectId(null)}
          onChanged={() => { loadProjects(); loadHistory(); refreshPageAccess(); }}
        />
      )}

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
      {/* ── GitHub connect/push modal - project-scoped, opened from the
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
              <h2 className="bld-modal-title">GitHub: {proj.name}</h2>

              {githubConfigured === false && (
                <p className="bld-modal-body">
                  GitHub integration isn&apos;t set up yet. A Sandhata admin needs to register the
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
                          No repositories accessible. Grant this App access to a repo from GitHub&apos;s installation settings.
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

      {screen === "boot" ? (
        <div className="bld-boot" role="status" aria-label="Loading the builder"><div className="bld-spinner" /></div>
      ) : screen === "home" && isLoggedIn ? (
        <BuilderHome
          firstName={session?.user?.name?.split(" ")[0] ?? null}
          projects={projects}
          pages={ungroupedSessions}
          loading={projLoading || histLoading}
          accountSlot={renderAccount("home")}
          templates={homeTemplates}
          onPrompt={startFromPrompt}
          onTemplate={startFromTemplate}
          onOpenProject={id => openProject(id)}
          onOpenPage={pg => { const item = history.find(h => h.id === pg.id); if (item) openLoosePage(item); }}
          onCreateProject={name => createProjectAndOpen(name)}
          onNewPage={() => { setScreen("editor"); setRail("pages"); setPanelOpen(true); window.history.pushState({}, "", "/builder?page=1"); newTab(null); }}
          onShare={id => setShareProjectId(id)}
          onDeleteProject={id => deleteProject(id)}
          onDeletePage={id => deleteSession(id)}
          onTrashChanged={() => { loadProjects(); loadHistory(); }}
        />
      ) : (
      <div className={`bld${previewing ? " bld--preview" : ""}`}>

        {/* ── Left: projects, notifications, Insert / Layers ─────────── */}
        <aside className={`bld-side${panelOpen ? "" : " bld-side--folded"}`}>
          {/* Icon rail (Vzy style): Home, Projects and Pages when signed in,
              then Insert and Layers for the canvas, account at the bottom.
              Clicking the open panel's icon folds the panel away. */}
          <nav className="bld-rail" aria-label="Builder panels">
            {isLoggedIn && (
              <>
                <button className="bld-rail-btn" onClick={goHome} data-tip="All projects" aria-label="All projects"><HomeIcon /></button>
                <button className={`bld-rail-btn${panelOpen && rail === "projects" && !editingSelection ? " on" : ""}`} onClick={() => showRail("projects")} data-tip="Projects" aria-label="Projects"><RailFolderIcon /></button>
                <button className={`bld-rail-btn${panelOpen && rail === "pages" && !editingSelection ? " on" : ""}`} onClick={() => showRail("pages")} data-tip="Pages" aria-label="Pages"><PagesIcon /></button>
                <span className="bld-rail-sep" />
              </>
            )}
            <button className={`bld-rail-btn${panelOpen && rail === "insert" && !editingSelection ? " on" : ""}`} onClick={() => showRail("insert")} data-tip="Insert" aria-label="Insert"><InsertIcon /></button>
            <button className={`bld-rail-btn${panelOpen && rail === "layers" && !editingSelection ? " on" : ""}`} onClick={() => showRail("layers")} data-tip="Layers" aria-label="Layers"><LayersIcon /></button>
            {isLoggedIn && activeProjectId && (
              <button className={`bld-rail-btn${panelOpen && rail === "settings" && !editingSelection ? " on" : ""}`} onClick={() => showRail("settings")} data-tip="Project settings" aria-label="Project settings"><GearIcon /></button>
            )}
            <span className="bld-rail-spacer" />
            {renderAccount("rail")}
          </nav>

          {panelOpen && (
          <div className="bld-panel">
          {githubNotice && (
            <div className={`bld-github-notice bld-github-notice--${githubNotice.type}`}>
              <span>{githubNotice.text}</span>
              <button onClick={() => setGithubNotice(null)} title="Dismiss"><XIcon /></button>
            </div>
          )}
          {inviteBanner && (
            <div className="bld-invite-banner">
              <BellIcon />
              <span>
                <b>{inviteBanner.invitedBy.name || inviteBanner.invitedBy.email || "Someone"}</b> invited you to {inviteBanner.role === "editor" ? "edit" : "view"} <b>{inviteBanner.projectName}</b>
              </span>
              <button className="bld-invite-banner-open" onClick={() => { markNotesSeen([inviteBanner.id]); openSharedProject(inviteBanner.projectId); }}>Open</button>
              <button className="bld-invite-banner-close" onClick={() => { markNotesSeen([inviteBanner.id]); setInviteBannerDismissed(true); }} title="Dismiss" aria-label="Dismiss"><XIcon /></button>
            </div>
          )}

            {tree && viewingVersion === null && view === "edit" && selectedNode ? (
            <div className="bld-side-panel bld-side-panel--props">
              {selectedNode ? (() => {
                // Element editor: Content is what it says (text and
                // text-valued props), Style is how it looks (everything
                // else). Tabs only appear when both have something.
                const fields = PROP_SCHEMA[selectedNode.type] ?? [];
                const contentFields = fields.filter(f => f.kind === "text");
                const styleFields = fields.filter(f => f.kind !== "text");
                const hasText = typeof selectedNode.children === "string";
                const hasContent = hasText || contentFields.length > 0;
                const hasStyle = styleFields.length > 0;
                const tabs = ([hasContent && "content", hasStyle && "style", "advanced"] as const).filter(Boolean) as ("content" | "style" | "advanced")[];
                const tab = tabs.includes(propTab) ? propTab : tabs[0];
                const style = (selectedNode.props?.style ?? {}) as Record<string, any>;
                const setStyle = (k: string, v: number | null) => {
                  const next = { ...style };
                  if (v === null || Number.isNaN(v)) delete next[k]; else next[k] = v;
                  updateSelectedProp("style", Object.keys(next).length ? next : undefined);
                };
                const parent = tree ? findParent(tree, selectedNode.id ?? "") : null;
                return (
                  <>
                    <div className="bld-prop-panel-head">
                      <button className="bld-prop-back" onClick={selectParent} title={parent && parent.id !== tree.id ? `Back to ${parent.type}` : "Back"} aria-label="Back"><BackIcon /></button>
                      <span className="bld-prop-type-icon"><ComponentIcon type={selectedNode.type} /></span>
                      <span className="bld-prop-title">
                        <span className="bld-prop-type">{selectedNode.type}</span>
                        {parent && <span className="bld-prop-parent">in {parent.type}</span>}
                      </span>
                      {!readOnly && (
                        <button className="bld-prop-delete" onClick={deleteSelectedNode} title="Delete element" aria-label="Delete element">
                          <TrashIcon />
                        </button>
                      )}
                    </div>
                    <div className="bld-prop-tabs" role="tablist">
                      {tabs.map(t => (
                        <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? "on" : ""} onClick={() => setPropTab(t)}>
                          {t === "content" ? "Content" : t === "style" ? "Style" : "Advanced"}
                        </button>
                      ))}
                    </div>
                    {tab === "advanced" && (
                      <div className="bld-prop-section">
                        <p className="bld-prop-hint">Spacing in pixels. Leave empty for the component&apos;s default.</p>
                        {([["padding", "Padding"], ["marginTop", "Space above"], ["marginBottom", "Space below"]] as const).map(([k, label]) => (
                          <div key={`${selectedNode.id}:${k}`} className="bld-prop-row">
                            <label className="bld-prop-label" htmlFor={`adv-${k}`}>{label}</label>
                            <input
                              id={`adv-${k}`}
                              type="number" min={0} step={4}
                              className="bld-prop-input"
                              defaultValue={typeof style[k] === "number" ? style[k] : ""}
                              placeholder="Auto"
                              onBlur={e => setStyle(k, e.currentTarget.value === "" ? null : Number(e.currentTarget.value))}
                              onKeyDown={e => { if (e.key === "Enter") e.currentTarget.blur(); }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    {tab === "content" && hasContent && (
                      <div className="bld-prop-section">
                        {hasText && (
                          <div className="bld-prop-row bld-prop-row--stacked">
                            <label className="bld-prop-label" htmlFor="prop-text">Text</label>
                            <textarea
                              id="prop-text"
                              key={`${selectedNode.id}:__text`} className="bld-prop-input bld-prop-textarea"
                              defaultValue={selectedNode.children as string}
                              rows={2}
                              aria-label="Text"
                              onBlur={e => updateSelectedText(e.target.value)}
                              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); (e.target as HTMLTextAreaElement).blur(); } }}
                            />
                          </div>
                        )}
                        {contentFields.map(field => renderPropField(field, selectedNode))}
                      </div>
                    )}
                    {tab === "style" && hasStyle && (
                      <div className="bld-prop-section">
                        {styleFields.map(field => renderPropField(field, selectedNode))}
                      </div>
                    )}
                  </>
                );
              })() : null}
            </div>
            ) : rail === "projects" && isLoggedIn ? (
              <div className="bld-pane">
                <div className="bld-pane-head">
                  <span className="bld-pane-title">Projects</span>
                  <button className="bld-pane-icon-btn" onClick={() => setShowNewProject(true)} title="New project" aria-label="New project"><PlusIcon /></button>
                </div>
                {showNewProject && (
                  <div className="bld-project-new">
                    <input
                      className="bld-key-input"
                      placeholder="Project name…"
                      value={newProjectName}
                      onChange={e => setNewProjectName(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter" && newProjectName.trim()) { createProjectAndOpen(newProjectName.trim()); setNewProjectName(""); setShowNewProject(false); }
                        if (e.key === "Escape") { setShowNewProject(false); setNewProjectName(""); }
                      }}
                      autoFocus
                    />
                    <button className="bld-new-btn" onClick={() => { createProjectAndOpen(newProjectName.trim()); setNewProjectName(""); setShowNewProject(false); }} disabled={!newProjectName.trim()}>Add</button>
                  </div>
                )}
                <div className="bld-pane-list">
                  {projects.map(p => (
                    <div
                      key={p.id}
                      className={`bld-pane-row${activeProjectId === p.id ? " active" : ""}`}
                      role="button" tabIndex={0}
                      onClick={() => openProject(p.id)}
                      onKeyDown={e => { if (e.key === "Enter") openProject(p.id); }}
                      title={p.ownerName ? `Shared by ${p.ownerName}` : p.name}
                    >
                      <span className="bld-project-icon"><FolderIcon /></span>
                      <span className="bld-pane-row-name">{p.name}</span>
                      {p.role && p.role !== "owner" && <span className="bld-project-shared">{p.role === "viewer" ? "View" : "Shared"}</span>}
                      <span className="bld-project-count">{p.sessionCount}</span>
                    </div>
                  ))}
                  {ungroupedSessions.length > 0 && (
                    <div
                      className={`bld-pane-row${activeProjectId === null ? " active" : ""}`}
                      role="button" tabIndex={0}
                      onClick={() => { setActiveProjectId(null); setRail("pages"); }}
                      onKeyDown={e => { if (e.key === "Enter") { setActiveProjectId(null); setRail("pages"); } }}
                    >
                      <span className="bld-project-icon"><PagesIcon /></span>
                      <span className="bld-pane-row-name">Pages not in a project</span>
                      <span className="bld-project-count">{ungroupedSessions.length}</span>
                    </div>
                  )}
                  {projects.length === 0 && ungroupedSessions.length === 0 && !projLoading && (
                    <p className="bld-history-empty">No projects yet. Use + to create one.</p>
                  )}
                </div>
              </div>
            ) : rail === "settings" && isLoggedIn && activeProjectId ? (() => {
              const proj = projects.find(p => p.id === activeProjectId) ?? null;
              if (!proj) return <p className="bld-side-hint">Loading project…</p>;
              const isOwner = !proj.role || proj.role === "owner";
              return (
              <div className="bld-pane">
                <div className="bld-pane-head"><span className="bld-pane-title">Project settings</span></div>
                <div className="bld-setting">
                  <label className="bld-setting-label" htmlFor="bld-project-name">Name</label>
                  <input
                    id="bld-project-name"
                    key={proj.id}
                    className="bld-setting-input"
                    defaultValue={proj.name}
                    disabled={!isOwner}
                    onFocus={e => setProjectNameDraft(e.currentTarget.value)}
                    onBlur={e => { if (e.currentTarget.value.trim() && e.currentTarget.value !== proj.name) renameProject(proj.id, e.currentTarget.value); }}
                    onKeyDown={e => { if (e.key === "Enter") e.currentTarget.blur(); if (e.key === "Escape") { e.currentTarget.value = projectNameDraft; e.currentTarget.blur(); } }}
                  />
                </div>
                <div className="bld-setting">
                  <span className="bld-setting-label">People</span>
                  <button className="bld-setting-btn" onClick={() => setShareProjectId(proj.id)}><ShareIcon /> {isOwner ? (proj.shared ? "Manage who has access" : "Invite people") : "See who has access"}</button>
                </div>
                <div className="bld-setting">
                  <span className="bld-setting-label">Integrations</span>
                  <div className="bld-setting-row">
                    <span className="bld-setting-row-name"><GithubIcon /> GitHub</span>
                    {githubConfigured === false ? (
                      <span className="bld-setting-note">Not available yet</span>
                    ) : proj.repoOwner ? (
                      <button className="bld-setting-link" onClick={() => openGithubModal(proj.id)}>{proj.repoOwner}/{proj.repoName}</button>
                    ) : isOwner ? (
                      <button className="bld-setting-link" onClick={() => openGithubModal(proj.id)}>Connect</button>
                    ) : <span className="bld-setting-note">Not connected</span>}
                  </div>
                  <div className="bld-setting-row">
                    <span className="bld-setting-row-name"><AdoIcon /> Azure DevOps</span>
                    {adoStatus?.connected ? (
                      <span className="bld-setting-note">{adoStatus.organization}/{adoStatus.adoProject}</span>
                    ) : isOwner ? (
                      <button className="bld-setting-link" onClick={() => openAdoConnect(proj.id)}>Connect</button>
                    ) : <span className="bld-setting-note">Not connected</span>}
                  </div>
                </div>
                {isOwner && (
                  <button className="bld-pane-danger" onClick={() => deleteProject(proj.id)}>Move project to Trash</button>
                )}
              </div>
              );
            })() : rail === "pages" && isLoggedIn ? (() => {
              const proj = projects.find(p => p.id === activeProjectId) ?? null;
              const isOwner = !!proj && (!proj.role || proj.role === "owner");
              const pagesHere = history.filter(h => (h.projectId ?? null) === activeProjectId);
              return (
              <div className="bld-pane">
                <div className="bld-pane-head">
                  <span className="bld-pane-title" title={proj?.name}>{proj ? proj.name : "Pages not in a project"}</span>
                  {proj && (
                    <button
                      className={`bld-project-share-btn${proj.shared ? " shared" : ""}`}
                      onClick={() => setShareProjectId(proj.id)}
                      title={isOwner ? (proj.shared ? "Shared: manage who has access" : "Share this project") : "Who has access"}
                      aria-label="Share project"
                    ><ShareIcon /></button>
                  )}
                </div>
                {gsOutstanding && !gsHidden && renderGettingStarted("card")}
                {isLoggedIn && activeProjectId && adoStatus?.connected && (
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

                <button className="bld-pane-add" onClick={() => newTab(activeProjectId)} disabled={proj?.role === "viewer"}>
                  <PlusIcon /> Add page
                </button>
                <div className="bld-pane-list">
                  {pagesHere.map(renderSessionRow)}
                  {pagesHere.length === 0 && <p className="bld-history-empty">No saved pages yet. Describe one in the chat, or add a page.</p>}
                </div>
              </div>
              );
            })() : tree && viewingVersion === null && view === "edit" ? (
              <div className="bld-side-panel">
                <div className="bld-pane-head bld-pane-head--tool"><span className="bld-pane-title">{rail === "layers" ? "Layers" : "Insert"}</span></div>
                {rail === "layers" ? (
                  <div className="bld-layers">
                    {renderLayerRow(tree, 0)}
                  </div>
                ) : (
                  <div className="bld-palette">
                    {insertTarget && (
                      <div className="bld-insert-target">
                        <span>Adding above <b>{findNodeById(tree, insertTarget.id)?.type ?? "section"}</b></span>
                        <button onClick={() => setInsertTarget(null)}>Cancel</button>
                      </div>
                    )}
                    <label className="bld-palette-search">
                      <SearchIcon />
                      <input
                        type="search"
                        placeholder="Search sections and components"
                        value={paletteQuery}
                        onChange={e => setPaletteQuery(e.target.value)}
                      />
                    </label>
                    {(() => {
                      const q = paletteQuery.trim().toLowerCase();
                      const secs = SECTION_TEMPLATES.filter(t => !q || t.name.toLowerCase().includes(q) || t.hint.toLowerCase().includes(q));
                      if (secs.length === 0) return null;
                      return (
                        <div className="bld-palette-cat">
                          {catHeader("Sections", secs.length)}
                          {(q || !collapsedCats.has("Sections")) && <div className="bld-section-list">
                            {secs.map(t => (
                              <button key={t.key} className="bld-section-item" onClick={() => insertSection(t.key)} title={`Add a ${t.name.toLowerCase()} section`}>
                                <span className="bld-section-item-name">{t.name}</span>
                                <span className="bld-section-item-hint">{t.hint}</span>
                              </button>
                            ))}
                          </div>}
                        </div>
                      );
                    })()}
                    {(() => {
                      const q = paletteQuery.trim().toLowerCase();
                      const cats = PALETTE_CATEGORIES
                        .map(cat => ({ ...cat, types: q ? cat.types.filter(t => t.toLowerCase().includes(q)) : cat.types }))
                        .filter(cat => cat.types.length > 0);
                      if (cats.length === 0) return <p className="bld-prop-empty">No components match &ldquo;{paletteQuery}&rdquo;.</p>;
                      return cats.map(cat => (
                        <div key={cat.label} className="bld-palette-cat">
                          {catHeader(cat.label, cat.types.length)}
                          {(q || !collapsedCats.has(cat.label)) && <div className="bld-palette-grid">
                            {cat.types.map(type => (
                              <div
                                key={type}
                                className="bld-palette-item"
                                role="button"
                                tabIndex={0}
                                draggable
                                title={`Add ${type} (click, or drag onto the canvas)`}
                                onClick={() => insertFromPalette(type)}
                                onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); insertFromPalette(type); } }}
                                onDragStart={(e) => {
                                  setDraggingPaletteType(type);
                                  setDraggingNodeId(null); // mutually exclusive with reordering an existing node
                                  e.dataTransfer.effectAllowed = "copy";
                                  e.dataTransfer.setData("text/plain", `palette:${type}`);
                                }}
                                onDragEnd={() => { setDraggingPaletteType(null); setDropTarget(null); }}
                              >
                                <span className="bld-palette-item-icon"><ComponentIcon type={type} /></span>
                                <span className="bld-palette-item-label">{type}</span>
                              </div>
                            ))}
                          </div>}
                        </div>
                      ));
                    })()}
                    <p className="bld-panel-hint">Click to add, or drag onto the canvas.</p>
                  </div>
                )}
              </div>
            ) : !isLoggedIn && !tree ? (
              <div className="bld-pane bld-welcome">
                <div className="bld-pane-head"><span className="bld-pane-title">Welcome to Spectra</span></div>
                <p>Describe a page in the chat and it&apos;s built from Sandhata&apos;s design system components, ready to edit here.</p>
                <p className="bld-welcome-strong">Sign in to save your pages, group them into projects and share them with your team.</p>
                <div className="bld-welcome-actions">
                  <button className="bld-signin-btn" onClick={() => signIn("google")}><GoogleIcon /> Continue with Google</button>
                  <button className="bld-signin-btn" onClick={() => signIn("github")}><GithubIcon /> Continue with GitHub</button>
                </div>
                <p className="bld-welcome-note">
                  Just trying it? You need your own Anthropic API key to generate. It stays in this browser.{" "}
                  <button className="bld-setting-link" onClick={openKeyField}>Add an API key</button>
                </p>
              </div>
            ) : (
              <p className="bld-side-hint">{tree ? "Switch to Edit view (toolbar at the bottom) to add sections and see layers." : "Describe an interface in the chat at the bottom of the canvas to get started."}</p>
            )}
          </div>
          )}
        </aside>

        {/* ── Middle: chat dock + canvas ───────────────────────────── */}
        <main className={`bld-main${chatCollapsed ? "" : " bld-main--chat-open"}`}>
          {/* Instance tabs - replaces having to dig into History to switch
              between pages you're actively working on. Each tab caches its
              own msgs/tree (tabCacheRef) so re-focusing one already visited
              this session is instant, not a re-fetch. Not gated behind
              isLoggedIn: an unsent draft still gets a tab, matching how the
              canvas already worked pre-tabs for signed-out use. */}
          {/* Top bar (Figma/Vzy): project ▾ / page name on the left, people,
              Preview and Share on the right. Pages are switched from the
              Pages panel, so there are no page tabs. */}
          <div className="bld-topbar">
            {isLoggedIn && (
              <>
                <button className="bld-project-btn" onClick={() => showRail("projects")} title="Switch project">
                  <FolderIcon />
                  <span>{projects.find(p => p.id === activeProjectId)?.name ?? "No project"}</span>
                  <ChevronDownIcon />
                </button>
                <span className="bld-crumb-sep" aria-hidden="true">/</span>
              </>
            )}
            {(() => {
              const cur = openTabs.find(t => t.id === activeTabId);
              const name = cur?.name ?? "Untitled";
              return renamingTabId === activeTabId && activeTabId ? (
                <input
                  className="bld-crumb-rename"
                  value={renameDraft}
                  autoFocus
                  onFocus={e => e.currentTarget.select()}
                  onChange={e => setRenameDraft(e.target.value)}
                  onBlur={() => { if (activeTabId) renameTab(activeTabId, renameDraft); setRenamingTabId(null); }}
                  onKeyDown={e => { if (e.key === "Enter") e.currentTarget.blur(); if (e.key === "Escape") setRenamingTabId(null); }}
                />
              ) : (
                <button
                  className="bld-crumb-page"
                  title="Rename page"
                  disabled={!activeTabId || readOnly}
                  onClick={() => { if (activeTabId) { setRenameDraft(name); setRenamingTabId(activeTabId); } }}
                >{name}</button>
              );
            })()}
            {isLoggedIn && (
              <button className="bld-topbar-icon" onClick={() => newTab()} title="New page in this project" aria-label="New page in this project"><PlusIcon /></button>
            )}
            <span className="bld-topbar-spacer" />
            {livePage.live && (
              <div
                className="bld-presence"
                onClick={() => activePageProjectId && setShareProjectId(activePageProjectId)}
                data-tip={livePage.status === "live" ? "Live: changes sync as you make them" : livePage.status === "error" ? "Live editing isn't connected" : "Connecting…"}
              >
                <span className={`bld-presence-dot bld-presence-dot--${livePage.status}`} />
                {livePage.others.slice(0, 4).map(o => (
                  o.avatar
                    ? <img key={o.connectionId} src={o.avatar} alt={o.name} className="bld-presence-avatar" style={{ borderColor: o.color }} />
                    : <span key={o.connectionId} className="bld-presence-avatar bld-presence-avatar--initial" style={{ background: o.color }}>{o.name.slice(0, 1).toUpperCase()}</span>
                ))}
                {livePage.others.length > 4 && <span className="bld-presence-more">+{livePage.others.length - 4}</span>}
              </div>
            )}
            <button className="bld-topbar-preview" onClick={() => changeView(view === "preview" ? "edit" : "preview")} disabled={!tree || (readOnly && view === "preview")}>
              <PlayIcon /> Preview
            </button>
            {isLoggedIn && (() => {
              // Invite people straight from the page (Vzy's Collaboration
              // panel). A page outside a project gets one on first share.
              const pid = activePageProjectId;
              const owner = !activeAccess?.role || activeAccess.role === "owner";
              return (
                <button
                  className="bld-share-page-btn"
                  disabled={(!pid && !dbSessionId) || sharingPage}
                  onClick={shareCurrentPage}
                  data-tip={!pid && !dbSessionId ? "Send a first prompt to save this page, then share it" : owner ? "Invite people to edit this page" : "See who has access"}
                >
                  <ShareIcon /> {owner ? "Share" : "People"}
                </button>
              );
            })()}
          </div>
          {previewing && !readOnly && (
            <button className="bld-exit-preview" onClick={() => changeView("edit")}>Exit preview <kbd>Esc</kbd></button>
          )}
          {/* Chat: a floating card at the bottom of the canvas, just above
              the toolbar, so talking to the design feels like a
              conversation with it. Kept short so it covers little of the
              canvas; minimise leaves only the input row. */}
          <section className={`bld-dock${chatCollapsed ? " bld-dock--min" : ""}${!tree ? " bld-dock--start" : ""}`} aria-label="Chat">
            <div className="bld-dock-head">
              <span className="bld-dock-title">Chat</span>
              {promptCount > 0 && <span className="bld-dock-count">{promptCount} prompt{promptCount === 1 ? "" : "s"}</span>}
              {chatCollapsed && loading && <span className="bld-dock-status"><span className="bld-dot-pulse"><span /><span /><span /></span> Thinking…</span>}
              {tree && (
                <button
                  className="bld-dock-toggle"
                  onClick={() => setChatMin(!chatCollapsed)}
                  title={chatCollapsed ? "Expand chat" : "Minimise chat"}
                  aria-label={chatCollapsed ? "Expand chat" : "Minimise chat"}
                  aria-expanded={!chatCollapsed}
                >{chatCollapsed ? <ChevronUpIcon /> : <ChevronDownIcon />}</button>
              )}
            </div>
            {/* Messages */}
            {!chatCollapsed && (
            <div className="bld-chat" ref={chatRef}>
              {isEmpty && (
                <div className="bld-empty-state">
                  <p className="bld-sub">
                    Describe an interface and it&apos;s built from Sandhata components.
                    Refine it with follow-up messages. Context is preserved.
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
                    {!needsKey && /key/i.test(m.errorText ?? "") && (
                      <button className="bld-go-sm bld-msg-fix" onClick={openKeyField}>Update API key</button>
                    )}
                    {needsKey && (
                      <div className="bld-key-inline">
                        <input
                          className="bld-key-input"
                          type="password"
                          placeholder="sk-ant-…"
                        autoComplete="off"
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
            )}

            {view === "edit" && selectedNode && tree && selectedNode.id !== tree.id && !readOnly && (
              <div className="bld-chat-scope">
                <span>Editing <b>{selectedNode.type}</b>: your next prompt changes just this element</span>
                <button onClick={() => setSelectedNodeId(null)} aria-label="Stop scoping to this element" title="Change the whole page instead"><XIcon /></button>
              </div>
            )}
            {/* No key anywhere: say so before the first prompt fails */}
            {serverKey === false && !apiKey && !(isLoggedIn && hasAccountKey) && !authLoading && (
              <div className="bld-key-notice">
                <span>
                  {isLoggedIn
                    ? "Generating needs an Anthropic API key. Add yours once and it's linked to your account."
                    : "Generating needs an Anthropic API key. Add yours (it stays in this browser), or sign in to link it to an account."}
                </span>
                <span className="bld-key-notice-actions">
                  <button onClick={openKeyField}>Add API key</button>
                  {!isLoggedIn && <button onClick={() => setShowAuthModal(true)}>Sign in</button>}
                </span>
              </div>
            )}

            {/* Input */}
            <div className="bld-input-area">
              <div className="bld-input-wrap">
                <textarea
                  ref={inputRef}
                  className="bld-input"
                  placeholder={readOnly ? "You have view-only access to this page" : msgs.length > 0 ? "Describe a change…" : "Describe an interface…"}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") send(); }}
                onFocus={() => { if (chatCollapsed && msgs.length > 0) setChatMin(false); }}
                  rows={chatCollapsed ? 1 : 2}
                  disabled={loading || readOnly}
                />
                <button className="bld-send-btn" onClick={() => send()} disabled={loading || readOnly || !input.trim()} title="Send (⌘ Enter)">
                  <SendIcon />
                </button>
              </div>
              {!chatCollapsed && <div className="bld-input-hint">⌘ Enter to send</div>}
            </div>
          </section>
          {/* Floating canvas toolbar, bottom centre like Framer's. Everything
              that used to sit in the top toolbar lives here so the canvas
              gets the full height: view switch (Edit / Preview / Code /
              Report), undo/redo while editing, viewport sizes in preview,
              canvas light/dark, then Share and Export. Icon-only buttons
              show their label on hover (data-tip), as in Vzy. */}
          {tree && (
            <div className="bld-float-toolbar" role="toolbar" aria-label="Canvas tools">
              <div className="bld-float-group" role="group" aria-label="View">
                <button
                  className={view === "edit" ? "on" : ""}
                  onClick={() => changeView("edit")}
                  disabled={readOnly}
                  data-tip={readOnly ? "View only: the owner gave you view access" : "Edit"}
                  aria-label="Edit" aria-pressed={view === "edit"}
                ><EditIcon /></button>
                <button
                  className={view === "preview" ? "on" : ""}
                  onClick={() => changeView("preview")}
                  data-tip="Preview" aria-label="Preview" aria-pressed={view === "preview"}
                ><EyeIcon /></button>
                <button
                  className={view === "code" ? "on" : ""}
                  onClick={() => changeView("code")}
                  data-tip="Code" aria-label="Code" aria-pressed={view === "code"}
                ><CodeIcon /></button>
                <button
                  className={view === "report" ? "on" : ""}
                  onClick={() => changeView("report")}
                  data-tip={auditIssues.length ? `Design system report (${auditIssues.length} to fix)` : "Design system report"}
                  aria-label="Design system report" aria-pressed={view === "report"}
                >
                  <ShieldIcon />
                  {auditIssues.length > 0 && <span className="bld-float-badge">{auditIssues.length}</span>}
                </button>
              </div>

              {view === "edit" && (
                <>
                  <span className="bld-float-toolbar-sep" aria-hidden="true" />
                  <button onClick={undoEdit} disabled={livePage.live ? !livePage.canUndo : editHistory.length === 0} data-tip="Undo" aria-label="Undo"><UndoIcon /></button>
                  <button onClick={redoEdit} disabled={livePage.live ? !livePage.canRedo : editRedoStack.length === 0} data-tip="Redo" aria-label="Redo"><RedoIcon /></button>
                </>
              )}
              {(view === "preview" || view === "edit") && (
                <>
                  <span className="bld-float-toolbar-sep" aria-hidden="true" />
                  {(["mobile","tablet","desktop"] as const).map(v => (
                    <button
                      key={v}
                      className={viewport === v ? "on" : ""}
                      onClick={() => setViewport(v)}
                      data-tip={v === "mobile" ? "Mobile (375px)" : v === "tablet" ? "Tablet (768px)" : "Desktop (full width)"}
                      aria-label={v} aria-pressed={viewport === v}
                    >
                      {v === "mobile" ? <MobileIcon /> : v === "tablet" ? <TabletIcon /> : <DesktopIcon />}
                    </button>
                  ))}
                  <span className="bld-float-toolbar-sep" aria-hidden="true" />
                  <button onClick={() => setZoom(z => Math.max(0.25, +(z - 0.1).toFixed(2)))} data-tip="Zoom out (⌘ −)" aria-label="Zoom out">−</button>
                  <button className="bld-float-text bld-zoom-value" onClick={() => setZoom(1)} data-tip="Reset to 100% (⌘ 0)" aria-label={`Zoom ${Math.round(zoom * 100)}%, reset`}>{Math.round(zoom * 100)}%</button>
                  <button onClick={() => setZoom(z => Math.min(2, +(z + 0.1).toFixed(2)))} data-tip="Zoom in (⌘ +)" aria-label="Zoom in">+</button>
                </>
              )}
              {view === "code" && (
                <>
                  <span className="bld-float-toolbar-sep" aria-hidden="true" />
                  <button className="bld-float-text" onClick={() => navigator.clipboard.writeText(code)} data-tip="Copy code to clipboard">Copy</button>
                </>
              )}
              {/* Preview shows only the view switch and the viewport sizes:
                  everything below is for working on the page. */}
              {!previewing && <>
              {view === "edit" && (
                <button
                  onClick={() => {
                    const next = canvasTheme === "light" ? "dark" : "light";
                    setCanvasTheme(next);
                    try { localStorage.setItem(CANVAS_THEME_STORAGE, next); } catch {}
                  }}
                  data-tip={canvasTheme === "light" ? "Dark canvas" : "Light canvas"}
                  aria-label={canvasTheme === "light" ? "Switch canvas to dark" : "Switch canvas to light"}
                >
                  {canvasTheme === "light" ? <SunIcon /> : <MoonIcon />}
                </button>
              )}

              <span className="bld-float-toolbar-sep" aria-hidden="true" />
              <button
                className={showVersions ? "on" : ""}
                onClick={() => { setShowVersions(v => !v); if (!showVersions) setChatMin(true); }}
                disabled={versions.length === 0}
                data-tip={showVersions ? undefined : "Version history"}
                aria-label="Version history" aria-expanded={showVersions}
              ><HistoryIcon /></button>
              <button onClick={exportZip} data-tip="Export ZIP" aria-label="Export ZIP"><DownloadIcon /></button>
              </>}
            </div>
          )}
          {tree && showVersions && (
            <div className="bld-versions" role="dialog" aria-label="Version history">
              <div className="bld-versions-head">
                <span>Version history</span>
                <button onClick={() => { setShowVersions(false); setViewingVersion(null); }} aria-label="Close version history"><XIcon /></button>
              </div>
              <ul className="bld-versions-list">
                {[...versions].reverse().map((v, i) => {
                  const current = i === 0;
                  const on = viewingVersion === v.idx || (current && viewingVersion === null);
                  return (
                    <li key={v.idx}>
                      <button
                        className={`bld-version${on ? " on" : ""}`}
                        onClick={() => {
                          if (current) { setViewingVersion(null); return; }
                          if (view === "edit") flushVisualEditsToChat();
                          setViewingVersion(v.idx);
                        }}
                      >
                        <span className="bld-version-top">
                          <span className="bld-version-num">v{v.num}</span>
                          <span className="bld-version-label">{v.label}</span>
                          {current && <span className="bld-version-current">Current</span>}
                        </span>
                        {v.prompt && <span className="bld-version-prompt">{v.prompt}</span>}
                        {v.at && <span className="bld-version-time">{formatWhen(v.at)}</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          <div className={`bld-canvas${tree && view === "edit" && viewingVersion === null ? " bld-canvas--edit" : ""}`}>
            {tree && viewingVersion !== null && msgs[viewingVersion]?.tree && (() => {
              const v = versions.find(x => x.idx === viewingVersion);
              return (
                <div className="bld-version-view" style={{ maxWidth: viewport === "mobile" ? 375 : viewport === "tablet" ? 768 : undefined }}>
                  <div className="bld-version-banner">
                    <span>Viewing <b>v{v?.num}</b>{v?.label ? `: ${v.label}` : ""}{v?.at ? `, ${formatWhen(v.at)}` : ""}</span>
                    <span className="bld-version-banner-actions">
                      <button onClick={() => setViewingVersion(null)}>Back to current</button>
                      {!readOnly && <button className="primary" onClick={() => restoreVersion(viewingVersion)}>Restore this version</button>}
                    </span>
                  </div>
                  <div className={`bld-surface bld-surface--${viewport} ${canvasTheme}`} style={{ zoom }}>
                    <RenderTree tree={msgs[viewingVersion].tree!} />
                  </div>
                </div>
              );
            })()}
            {!tree && !loading && (
              <div className="bld-state bld-empty">
                <span>Your generated interface will appear here. Describe it in the chat below.</span>
              </div>
            )}
            {!tree && loading && (
              <div className="bld-state">
                <div className="bld-spinner" />
                <span>Generating interface…</span>
              </div>
            )}
            {tree && viewingVersion === null && view === "preview" && (
              <div
                className={`bld-surface bld-surface--${viewport} ${canvasTheme}`}
                style={{ zoom, opacity: loading ? 0.55 : 1, transition: "opacity 0.2s" }}
              >
                <RenderTree tree={tree} />
              </div>
            )}
            {tree && viewingVersion === null && view === "code" && (
              <pre className="bld-code">
                {/* Same hand-rolled tokenizer + Cursor-sourced colours as the
                    docs code blocks (app/_docs/highlight.ts) - reused rather
                    than duplicated, see the .c-* overrides in builder.css for
                    why the colour values themselves are redeclared locally. */}
                <code className="doc-code-lines" dangerouslySetInnerHTML={{ __html: sdHighlightLines(code) }} />
              </pre>
            )}
            {tree && viewingVersion === null && view === "report" && (
              <div className="bld-report">
                {auditIssues.length === 0 ? (
                  <div className="bld-report-clean">
                    <ShieldIcon />
                    <span>Every element in this page uses a governed Spectra component. Nothing outside the design system.</span>
                  </div>
                ) : (
                  <>
                    <p className="bld-report-summary">
                      {auditIssues.length} element{auditIssues.length === 1 ? "" : "s"} outside the design system, not a real Spectra/Sandhata component.
                    </p>
                    <div className="bld-report-list">
                      {auditIssues.map((issue, i) => (
                        <div className="bld-report-row" key={issue.nodeId ?? `${issue.type}-${i}`}>
                          <div className="bld-report-row-main">
                            <span className="bld-report-type">{issue.type}</span>
                            <span className="bld-report-path">{issue.path}</span>
                          </div>
                          <button
                            className="bld-report-jump"
                            onClick={() => goToAuditIssue(issue)}
                            disabled={!issue.nodeId}
                            title={issue.nodeId ? "Select in Edit view" : "Enter Edit view once to make this selectable"}
                          >
                            Select
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
            {tree && viewingVersion === null && view === "edit" && (
              <div className="bld-edit-layout">
                {/* Selection/hover resolved via a single delegated listener
                    here, using RenderNode's data-node-id attribute - not
                    handlers threaded through every Renderer.tsx branch. This
                    also blocks the underlying component's own interactivity
                    (a Switch toggling, a link navigating) while in edit mode:
                    stopPropagation on the capture phase never lets the click
                    reach the real element's own bubble-phase handler. */}
                <div className="bld-edit-scroll">
                <div
                  className="bld-edit-canvas-wrap"
                  ref={canvasWrapRef}
                  onContextMenu={(e) => {
                    if (readOnly) return;
                    const el = (e.target as HTMLElement).closest("[data-node-id]");
                    const id = el?.getAttribute("data-node-id");
                    if (!id) return;
                    e.preventDefault();
                    setSelectedNodeId(id);
                    setCtxMenu({ x: e.clientX, y: e.clientY, id });
                  }}
                  onClickCapture={(e) => {
                    // The section bar sits inside this wrapper; its buttons
                    // handle their own clicks and must not change selection.
                    if ((e.target as HTMLElement).closest(".bld-section-bar")) return;
                    // Clicking the insert placeholder keeps the spot (it isn't
                    // a real element to select).
                    if ((e.target as HTMLElement).closest(".bld-insert-placeholder")) { e.preventDefault(); e.stopPropagation(); return; }
                    // A real drag ends with a native `dragend`/`drop`, not a
                    // `click` - but some browsers still fire a trailing click
                    // right after, which would otherwise re-select whatever's
                    // under the cursor at drop time. Swallow it once.
                    if (draggingNodeId) { e.preventDefault(); e.stopPropagation(); return; }
                    const el = (e.target as HTMLElement).closest("[data-node-id]");
                    if (!el) { setSelectedNodeId(null); return; }
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedNodeId(el.getAttribute("data-node-id"));
                  }}
                  onMouseOver={(e) => {
                    if ((e.target as HTMLElement).closest(".bld-section-bar")) return; // keep the bar while using it
                    const el = (e.target as HTMLElement).closest("[data-node-id]");
                    const id = el ? el.getAttribute("data-node-id") : null;
                    setHoveredNodeId(id);
                    setSectionHoverId(sectionOf(id));
                  }}
                  onMouseLeave={() => { setHoveredNodeId(null); setSectionHoverId(null); }}
                  onDragStart={(e) => {
                    const el = (e.target as HTMLElement).closest("[data-node-id]");
                    const id = el?.getAttribute("data-node-id");
                    if (!id) return;
                    setSelectedNodeId(id);
                    setDraggingNodeId(id);
                    setDraggingPaletteType(null); // mutually exclusive with a palette drag
                    e.dataTransfer.effectAllowed = "move";
                    // Firefox requires setData to actually start a drag; the
                    // payload itself is unused - the real source of truth is
                    // `draggingNodeId` React state, read directly in onDrop.
                    e.dataTransfer.setData("text/plain", id);
                  }}
                  onDragOver={(e) => {
                    // One position calculation serves both drag sources
                    // (Phase 2 reorder and Phase 3 palette insert) - same
                    // "hover a real node, read before/after/inside from
                    // cursor position within it" logic either way.
                    if ((!draggingNodeId && !draggingPaletteType) || !tree) return;
                    e.preventDefault(); // required for onDrop to ever fire
                    const el = (e.target as HTMLElement).closest("[data-node-id]") as HTMLElement | null;
                    const targetId = el?.getAttribute("data-node-id");
                    if (!el || !targetId || targetId === draggingNodeId) { setDropTarget(null); return; }
                    const targetNode = findNodeById(tree, targetId);
                    if (!targetNode) { setDropTarget(null); return; }
                    const rect = el.getBoundingClientRect();
                    const relY = rect.height > 0 ? (e.clientY - rect.top) / rect.height : 0.5;
                    const isContainer = CONTAINER_TYPES.has(targetNode.type);
                    // A container gets a dead zone in its middle 50% that means
                    // "drop inside me" - its top/bottom quarters still mean
                    // "insert as my sibling", same as a non-container leaf.
                    const position: "before" | "after" | "inside" =
                      isContainer ? (relY < 0.25 ? "before" : relY > 0.75 ? "after" : "inside")
                                   : (relY < 0.5 ? "before" : "after");
                    setDropTarget(prev => (prev?.id === targetId && prev.position === position ? prev : { id: targetId, position }));
                  }}
                  onDragLeave={(e) => {
                    if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) setDropTarget(null);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (dropTarget && tree) {
                      if (draggingPaletteType) {
                        const defaults = paletteDefaults(draggingPaletteType);
                        const newNode = createNode(draggingPaletteType, defaults.props, defaults.children);
                        commitTreeEdit(insertNodeAt(tree, dropTarget.id, dropTarget.position, newNode));
                        setSelectedNodeId(newNode.id ?? null); // see what you just placed, right away
                      } else if (draggingNodeId) {
                        // Refuse a drop that would nest the dragged subtree
                        // inside itself - moveNode() already guards against
                        // silently losing the node in that case, but checking
                        // here first avoids even attempting a doomed move.
                        const draggedNode = findNodeById(tree, draggingNodeId);
                        const dropsIntoOwnSubtree = draggedNode ? !!findNodeById(draggedNode, dropTarget.id) : true;
                        if (!dropsIntoOwnSubtree) {
                          commitTreeEdit(moveNode(tree, draggingNodeId, dropTarget.id, dropTarget.position));
                        }
                      }
                    }
                    setDraggingNodeId(null);
                    setDraggingPaletteType(null);
                    setDropTarget(null);
                  }}
                  onDragEnd={() => { setDraggingNodeId(null); setDraggingPaletteType(null); setDropTarget(null); }}
                >
                  {/* Highlight via a scoped attribute-selector rule rather
                      than threading selected/hovered state into RenderNode -
                      the whole tree already re-renders on every edit anyway,
                      so this stays correct for free with no extra plumbing. */}
                  <style>{[
                    selectedNodeId && `.bld-edit-canvas-wrap [data-node-id="${selectedNodeId}"] { outline: 2px solid var(--colour-primaryblue-400) !important; outline-offset: 1px; }`,
                    hoveredNodeId && hoveredNodeId !== selectedNodeId && !draggingNodeId && `.bld-edit-canvas-wrap [data-node-id="${hoveredNodeId}"] { outline: 1px dashed var(--colour-primaryblue-300) !important; outline-offset: 1px; }`,
                    draggingNodeId && `.bld-edit-canvas-wrap [data-node-id="${draggingNodeId}"] { opacity: 0.4; }`,
                    // Drop indicator: a solid edge for a before/after sibling
                    // insert, a dashed outline for dropping inside a container
                    // - inset box-shadow rather than border/outline so it
                    // doesn't shift layout or fight the selection/hover outline
                    // on the same element.
                    dropTarget?.position === "before" && `.bld-edit-canvas-wrap [data-node-id="${dropTarget.id}"] { box-shadow: inset 0 3px 0 0 var(--colour-primaryblue-500) !important; }`,
                    dropTarget?.position === "after" && `.bld-edit-canvas-wrap [data-node-id="${dropTarget.id}"] { box-shadow: inset 0 -3px 0 0 var(--colour-primaryblue-500) !important; }`,
                    dropTarget?.position === "inside" && `.bld-edit-canvas-wrap [data-node-id="${dropTarget.id}"] { outline: 2px dashed var(--colour-primaryblue-500) !important; outline-offset: -2px; }`,
                    // Other people's selections (live rooms): their colour,
                    // so you can see what someone else is working on.
                    ...livePage.others
                      .filter(o => o.selectedNodeId && o.selectedNodeId !== selectedNodeId && /^[\w-]+$/.test(o.selectedNodeId))
                      .map(o => `.bld-edit-canvas-wrap [data-node-id="${o.selectedNodeId}"] { outline: 2px solid ${/^#[0-9a-fA-F]{3,8}$/.test(o.color) ? o.color : "#3B68FF"} !important; outline-offset: 1px; }`),
                  ].filter(Boolean).join("\n")}</style>
                  <div className={`bld-surface bld-surface--${viewport} ${canvasTheme}`} style={{ zoom }}>
                    <RenderTree tree={canvasTree} editable />
                  </div>
                  {selRect && selectedNode && (
                    <span className="bld-sel-chip" style={{ top: Math.max(0, selRect.top - 20), left: selRect.left }} aria-hidden="true">{selectedNode.type}</span>
                  )}
                  {barSectionId && sectionRect && (() => {
                    const idx = sectionIds.indexOf(barSectionId);
                    const isRoot = barSectionId === tree.id;
                    return (
                      <div
                        className="bld-section-bar"
                        style={{ top: sectionRect.top, left: sectionRect.left, width: sectionRect.width }}
                      >
                        <div className="bld-section-bar-pill" role="toolbar" aria-label="Section actions">
                          <button onClick={() => openInsertAt(barSectionId)} data-tip="Add section above" aria-label="Add above this section"><PlusIcon /></button>
                          <button onClick={() => askAiAboutSection(barSectionId)} data-tip="Edit with AI" aria-label="Ask AI to change this section"><SparkleIcon /></button>
                          <button
                            className={sectionMenuId === barSectionId ? "on" : ""}
                            onClick={() => setSectionMenuId(m => (m === barSectionId ? null : barSectionId))}
                            data-tip={sectionMenuId === barSectionId ? undefined : "More actions"} aria-label="More section actions" aria-haspopup="menu" aria-expanded={sectionMenuId === barSectionId}
                          ><MoreIcon /></button>
                          {sectionMenuId === barSectionId && (
                            <div className="bld-section-menu" role="menu" onMouseLeave={() => setSectionMenuId(null)}>
                              <button role="menuitem" disabled={idx <= 0} onClick={() => { moveSection(barSectionId, -1); setSectionMenuId(null); }}>Move up</button>
                              <button role="menuitem" disabled={idx < 0 || idx >= sectionIds.length - 1} onClick={() => { moveSection(barSectionId, 1); setSectionMenuId(null); }}>Move down</button>
                              <button role="menuitem" disabled={isRoot} onClick={() => { duplicateSection(barSectionId); setSectionMenuId(null); }}>Duplicate</button>
                              <button role="menuitem" onClick={() => { setSelectedNodeId(barSectionId); setSectionMenuId(null); }}>Select</button>
                              <button role="menuitem" className="danger" onClick={() => { deleteSection(barSectionId); setSectionMenuId(null); }}>Delete</button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
                </div>

              </div>
            )}
          </div>
          {ctxMenu && tree && (
            <div className="bld-menu bld-ctx-menu" role="menu" style={{ top: ctxMenu.y, left: ctxMenu.x }} onClick={e => e.stopPropagation()}>
              <button role="menuitem" onClick={() => { duplicateNode(ctxMenu.id); setCtxMenu(null); }} disabled={ctxMenu.id === tree.id}>Duplicate <kbd>⌘D</kbd></button>
              <button role="menuitem" onClick={() => { moveNodeBy(ctxMenu.id, -1); setCtxMenu(null); }}>Move up <kbd>⌥↑</kbd></button>
              <button role="menuitem" onClick={() => { moveNodeBy(ctxMenu.id, 1); setCtxMenu(null); }}>Move down <kbd>⌥↓</kbd></button>
              <button role="menuitem" onClick={() => { const par = findParent(tree, ctxMenu.id); setSelectedNodeId(par && par.id !== tree.id ? par.id ?? null : null); setCtxMenu(null); }}>Select parent</button>
              <button role="menuitem" onClick={() => { setInsertTarget({ id: sectionOf(ctxMenu.id) ?? ctxMenu.id, position: "before" }); setSelectedNodeId(null); setRail("insert"); setPanelOpen(true); setCtxMenu(null); }}>Add section above</button>
              <button role="menuitem" className="danger" onClick={() => { setSelectedNodeId(ctxMenu.id); setCtxMenu(null); requestAnimationFrame(() => deleteSelectedNode()); }} disabled={ctxMenu.id === tree.id}>Delete <kbd>⌫</kbd></button>
            </div>
          )}
        </main>


      </div>
      )}
    </div>
  );
}
