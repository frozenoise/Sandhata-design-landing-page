"use client";
// Builder start page for signed-in users (like Vzy's dashboard or Figma and
// Canva's file browsers): your projects as cards with a live thumbnail of
// their latest page, loose pages that aren't in a project, projects shared
// with you, and the Trash (deleted items, kept 30 days - see lib/trash.ts).
import * as React from "react";
import { RenderTree, type UINode } from "./Renderer";
import { summarise } from "./governance";

export type HomeProject = {
  id: string;
  name: string;
  updatedAt: string;
  sessionCount: number;
  role?: "owner" | "editor" | "viewer";
  ownerName?: string | null;
  shared?: boolean;
  preview?: UINode | null;
};
export type HomePage = { id: string; name: string; updatedAt: string; projectId?: string | null };

type TrashData = {
  projects: { id: string; name: string; deletedAt: string; purgeAt: string; pageCount: number }[];
  pages: { id: string; name: string; deletedAt: string; purgeAt: string; projectName: string | null }[];
};

const PlusIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>);
const SearchIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>);
const PageIcon = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="14 3 14 9 20 9"/></svg>);
const SparkIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.9 5.8L20 10l-6.1 2.2L12 18l-1.9-5.8L4 10l6.1-2.2z"/></svg>);
const GridIcon = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>);
const ListIcon = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>);
const MoreIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>);

function ago(iso: string) {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} day${d === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function daysLeft(iso: string) {
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000));
}

/** Live mini render of a design, scaled to fit the card. */
function Thumb({ tree }: { tree?: UINode | null }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(0.2);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / 1200));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div className="home-thumb" ref={ref} aria-hidden="true">
      {tree ? (
        <div className="home-thumb-inner" style={{ transform: `scale(${scale})` }}>
          <div className="bld-surface bld-surface--desktop light">
            <RenderTree tree={tree} />
          </div>
        </div>
      ) : (
        <span className="home-thumb-empty"><PageIcon /></span>
      )}
    </div>
  );
}

export function BuilderHome({
  firstName, projects, pages, loading, accountSlot, templates, onPrompt, onTemplate,
  onOpenProject, onOpenPage, onCreateProject, onNewPage, onShare, onDeleteProject, onDeletePage, onTrashChanged,
}: {
  firstName: string | null;
  projects: HomeProject[];
  /** Pages that aren't in any project */
  pages: HomePage[];
  loading: boolean;
  /** Notifications bell and profile menu, rendered by the builder */
  accountSlot?: React.ReactNode;
  /** Ready-made starting points (built from the Insert panel's sections) */
  templates: { key: string; name: string; tree: UINode | null }[];
  /** "Describe your idea": new project, first page generated from the prompt */
  onPrompt: (prompt: string) => void;
  onTemplate: (key: string) => void;
  onOpenProject: (id: string) => void;
  onOpenPage: (page: HomePage) => void;
  onCreateProject: (name: string) => void;
  onNewPage: () => void;
  onShare: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onDeletePage: (id: string) => void;
  /** After a restore, so the parent reloads projects and pages */
  onTrashChanged: () => void;
}) {
  const [tab, setTab] = React.useState<"recent" | "shared" | "trash">("recent");
  const [query, setQuery] = React.useState("");
  const [naming, setNaming] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [menuId, setMenuId] = React.useState<string | null>(null);
  const [trash, setTrash] = React.useState<TrashData | null>(null);
  const [trashBusy, setTrashBusy] = React.useState(false);
  const [idea, setIdea] = React.useState("");
  // Sort and layout, remembered in this browser
  const [sort, setSort] = React.useState<"edited" | "name">("edited");
  const [layout, setLayout] = React.useState<"grid" | "list">("grid");
  React.useEffect(() => {
    try {
      const v = JSON.parse(localStorage.getItem("sd-builder-home-view") || "{}");
      if (v.sort === "name" || v.sort === "edited") setSort(v.sort);
      if (v.layout === "grid" || v.layout === "list") setLayout(v.layout);
    } catch {}
  }, []);
  React.useEffect(() => {
    try { localStorage.setItem("sd-builder-home-view", JSON.stringify({ sort, layout })); } catch {}
  }, [sort, layout]);

  const loadTrash = React.useCallback(async () => {
    const r = await fetch("/api/trash");
    if (r.ok) setTrash(await r.json());
  }, []);
  React.useEffect(() => { if (tab === "trash") loadTrash(); }, [tab, loadTrash]);
  React.useEffect(() => {
    if (!menuId) return;
    const close = () => setMenuId(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [menuId]);

  const q = query.trim().toLowerCase();
  const match = (name: string) => !q || name.toLowerCase().includes(q);
  const order = <T extends { name: string; updatedAt: string }>(xs: T[]) =>
    [...xs].sort((a, b) => (sort === "name" ? a.name.localeCompare(b.name) : b.updatedAt.localeCompare(a.updatedAt)));
  const own = order(projects.filter(p => (!p.role || p.role === "owner") && match(p.name)));
  const shared = order(projects.filter(p => p.role && p.role !== "owner" && match(p.name)));
  const loose = order(pages.filter(p => match(p.name)));
  const gridClass = `home-grid${layout === "list" ? " home-grid--list" : ""}`;

  async function restore(kind: "project" | "page", id: string) {
    setTrashBusy(true);
    await fetch("/api/trash", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind, id }) });
    await loadTrash();
    setTrashBusy(false);
    onTrashChanged();
  }
  async function deleteForever(kind: "project" | "page", id: string, name: string) {
    if (!window.confirm(`Delete "${name}" permanently? This can't be undone.`)) return;
    setTrashBusy(true);
    await fetch(`/api/trash?kind=${kind}&id=${encodeURIComponent(id)}`, { method: "DELETE" });
    await loadTrash();
    setTrashBusy(false);
  }

  function submitNew() {
    const name = newName.trim() || "Untitled project";
    setNaming(false); setNewName("");
    onCreateProject(name);
  }

  const projectCard = (p: HomeProject) => (
    <div key={p.id} className="home-card" role="button" tabIndex={0}
      onClick={() => onOpenProject(p.id)}
      onKeyDown={e => { if (e.key === "Enter") onOpenProject(p.id); }}>
      <Thumb tree={p.preview} />
      <div className="home-card-meta">
        <div className="home-card-text">
          <span className="home-card-name">{p.name}</span>
          <span className="home-card-sub">
            {p.ownerName ? `${p.ownerName} · ` : ""}{p.sessionCount} page{p.sessionCount === 1 ? "" : "s"} · Edited {ago(p.updatedAt)}
          </span>
        </div>
        {p.preview && (() => {
          const g = summarise(p.preview);
          const blocking = g.errors + g.warnings;
          return <span className={`home-gov${blocking ? " home-gov--issues" : ""}`} title={blocking ? `${blocking} design system issue${blocking === 1 ? "" : "s"} on the latest page` : "Latest page is fully on the design system"}>{g.score}%</span>;
        })()}
        {p.shared && <span className="home-badge">{p.role && p.role !== "owner" ? (p.role === "viewer" ? "View only" : "Can edit") : "Shared"}</span>}
        <div className="home-card-menu-wrap" onClick={e => e.stopPropagation()}>
          <button className="home-card-more" aria-label={`More actions for ${p.name}`} onClick={e => { e.stopPropagation(); setMenuId(m => (m === p.id ? null : p.id)); }}><MoreIcon /></button>
          {menuId === p.id && (
            <div className="home-menu" role="menu">
              <button role="menuitem" onClick={() => { setMenuId(null); onOpenProject(p.id); }}>Open</button>
              <button role="menuitem" onClick={() => { setMenuId(null); onShare(p.id); }}>{!p.role || p.role === "owner" ? "Share" : "Who has access"}</button>
              {(!p.role || p.role === "owner") && (
                <button role="menuitem" className="danger" onClick={() => { setMenuId(null); onDeleteProject(p.id); }}>Move to Trash</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="home">
      <div className="home-inner">
        <div className="home-head">
          <h1 className="home-title">{firstName ? `Hi ${firstName}` : "Your projects"}</h1>
          <div className="home-head-actions">
            <button className="home-btn" onClick={onNewPage}>New page</button>
            {naming ? (
              <div className="home-new">
                <input
                  autoFocus
                  placeholder="Project name"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") submitNew(); if (e.key === "Escape") { setNaming(false); setNewName(""); } }}
                />
                <button className="home-btn home-btn--primary" onClick={submitNew}>Create</button>
              </div>
            ) : (
              <button className="home-btn home-btn--primary" onClick={() => setNaming(true)}><PlusIcon /> New project</button>
            )}
            {accountSlot}
          </div>
        </div>

        {/* Describe your idea (Figma's home): the fastest way to start */}
        <form className="home-idea" onSubmit={e => { e.preventDefault(); if (idea.trim()) { onPrompt(idea.trim()); setIdea(""); } }}>
          <SparkIcon />
          <input
            value={idea}
            onChange={e => setIdea(e.target.value)}
            placeholder="Describe a page and Spectra builds it from the design system…"
            aria-label="Describe a page to build"
          />
          <button type="submit" className="home-btn home-btn--primary" disabled={!idea.trim()}>Build</button>
        </form>

        <div className="home-bar">
          <label className="home-search">
            <SearchIcon />
            <input type="search" placeholder="Search projects and pages" value={query} onChange={e => setQuery(e.target.value)} />
          </label>
          <div className="home-view" hidden={tab === "trash"}>
            <select aria-label="Sort" value={sort} onChange={e => setSort(e.target.value as "edited" | "name")}>
              <option value="edited">Last edited</option>
              <option value="name">Name A–Z</option>
            </select>
            <button className={layout === "grid" ? "on" : ""} onClick={() => setLayout("grid")} aria-label="Grid view" aria-pressed={layout === "grid"}><GridIcon /></button>
            <button className={layout === "list" ? "on" : ""} onClick={() => setLayout("list")} aria-label="List view" aria-pressed={layout === "list"}><ListIcon /></button>
          </div>
          <div className="home-tabs" role="tablist">
            {([["recent", "Recent"], ["shared", `Shared with you${projects.some(p => p.role && p.role !== "owner") ? ` (${projects.filter(p => p.role && p.role !== "owner").length})` : ""}`], ["trash", "Trash"]] as const).map(([k, label]) => (
              <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} data-label={label} onClick={() => setTab(k)}>{label}</button>
            ))}
          </div>
        </div>

        {tab === "recent" && !q && templates.length > 0 && (
          <>
            <h2 className="home-section">Start from a template</h2>
            <div className="home-grid">
              <div className="home-card" role="button" tabIndex={0}
                onClick={onNewPage} onKeyDown={e => { if (e.key === "Enter") onNewPage(); }}>
                <div className="home-thumb home-thumb--blank" aria-hidden="true"><PlusIcon /></div>
                <div className="home-card-meta"><div className="home-card-text"><span className="home-card-name">Blank page</span><span className="home-card-sub">Start from nothing</span></div></div>
              </div>
              {templates.map(t => (
                <div key={t.key} className="home-card" role="button" tabIndex={0}
                  onClick={() => onTemplate(t.key)} onKeyDown={e => { if (e.key === "Enter") onTemplate(t.key); }}>
                  <Thumb tree={t.tree} />
                  <div className="home-card-meta"><div className="home-card-text"><span className="home-card-name">{t.name}</span><span className="home-card-sub">Built from Spectra sections</span></div></div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "recent" && (
          <>
            <h2 className="home-section">Projects</h2>
            {own.length === 0 ? (
              loading ? (
                <div className="home-grid" aria-label="Loading your projects">
                  {[0, 1, 2].map(i => <div key={i} className="home-card home-card--skeleton"><div className="home-thumb" /><div className="home-skel-line" /></div>)}
                </div>
              ) : <p className="home-empty">{q ? "No projects match." : "No projects yet. Create one, or start from a template above."}</p>
            ) : (
              <div className={gridClass}>{own.map(projectCard)}</div>
            )}
            {loose.length > 0 && (
              <>
                <h2 className="home-section">Pages not in a project</h2>
                <div className={gridClass}>
                  {loose.map(pg => (
                    <div key={pg.id} className="home-card" role="button" tabIndex={0}
                      onClick={() => onOpenPage(pg)} onKeyDown={e => { if (e.key === "Enter") onOpenPage(pg); }}>
                      <Thumb />
                      <div className="home-card-meta">
                        <div className="home-card-text">
                          <span className="home-card-name">{pg.name}</span>
                          <span className="home-card-sub">Edited {ago(pg.updatedAt)}</span>
                        </div>
                        <div className="home-card-menu-wrap" onClick={e => e.stopPropagation()}>
                          <button className="home-card-more" aria-label={`More actions for ${pg.name}`} onClick={e => { e.stopPropagation(); setMenuId(m => (m === pg.id ? null : pg.id)); }}><MoreIcon /></button>
                          {menuId === pg.id && (
                            <div className="home-menu" role="menu">
                              <button role="menuitem" onClick={() => { setMenuId(null); onOpenPage(pg); }}>Open</button>
                              <button role="menuitem" className="danger" onClick={() => { setMenuId(null); onDeletePage(pg.id); }}>Move to Trash</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {tab === "shared" && (
          shared.length === 0
            ? <div className="home-empty-state"><span className="home-empty-icon" aria-hidden="true"><PageIcon /></span><p>{q ? "Nothing shared matches." : "Projects other people share with you show up here."}</p></div>
            : <div className={gridClass}>{shared.map(projectCard)}</div>
        )}

        {tab === "trash" && (
          <div className="home-trash">
            <p className="home-trash-note">Deleted projects and pages stay here for 30 days, then they&apos;re removed for good.</p>
            {!trash ? <p className="home-empty">Loading…</p> : trash.projects.length + trash.pages.length === 0 ? (
              <div className="home-empty-state"><span className="home-empty-icon" aria-hidden="true"><PageIcon /></span><p>Trash is empty. Deleted projects and pages wait here for 30 days.</p></div>
            ) : (
              <ul className="home-trash-list">
                {trash.projects.map(p => (
                  <li key={p.id}>
                    <span className="home-trash-name"><b>{p.name}</b> <span>Project · {p.pageCount} page{p.pageCount === 1 ? "" : "s"} · deleted {ago(p.deletedAt)} · {daysLeft(p.purgeAt)} days left</span></span>
                    <button disabled={trashBusy} onClick={() => restore("project", p.id)}>Restore</button>
                    <button disabled={trashBusy} className="danger" onClick={() => deleteForever("project", p.id, p.name)}>Delete forever</button>
                  </li>
                ))}
                {trash.pages.map(p => (
                  <li key={p.id}>
                    <span className="home-trash-name"><b>{p.name}</b> <span>Page{p.projectName ? ` in ${p.projectName}` : ""} · deleted {ago(p.deletedAt)} · {daysLeft(p.purgeAt)} days left</span></span>
                    <button disabled={trashBusy} onClick={() => restore("page", p.id)}>Restore</button>
                    <button disabled={trashBusy} className="danger" onClick={() => deleteForever("page", p.id, p.name)}>Delete forever</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
