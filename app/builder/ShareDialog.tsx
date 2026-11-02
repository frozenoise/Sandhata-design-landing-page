"use client";

// Common workspace: the "Share project" dialog. The owner adds people by
// email as Editor or Viewer, changes roles and removes people; everyone else
// sees who has access and can leave. Adding an email with no account yet
// stores a pending invite, which turns into a membership the first time that
// person signs in with that address (see lib/access.ts claimInvites).

import * as React from "react";

type Person = { id: string; userId?: string; name: string | null; email: string | null; image: string | null; role: string };
type MembersResponse = {
  role: "owner" | "editor" | "viewer";
  owner: { id: string; name: string | null; email: string | null; image: string | null };
  members: Person[];
  invites: { id: string; email: string; role: string }[];
};

const ERRORS: Record<string, string> = {
  invalid_email: "That doesn't look like an email address.",
  is_owner: "That's you: you already own this project.",
  forbidden: "Only the project owner can change who has access.",
};

export function ShareDialog({ projectId, projectName, currentUserId, onClose, onChanged }: {
  projectId: string;
  projectName: string;
  currentUserId: string | null;
  onClose: () => void;
  /** Called after any change, so the sidebar can refresh shared badges. */
  onChanged: () => void;
}) {
  const [data, setData] = React.useState<MembersResponse | null>(null);
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState("editor");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    const res = await fetch(`/api/projects/${projectId}/members`);
    if (res.ok) setData(await res.json());
    else setError("Couldn't load who has access.");
  }, [projectId]);

  React.useEffect(() => { load(); }, [load]);

  const isOwner = data?.role === "owner";

  async function add() {
    if (!email.trim() || busy) return;
    setBusy(true); setError(null); setNotice(null);
    const res = await fetch(`/api/projects/${projectId}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), role }),
    });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setError(ERRORS[d.error] ?? "Couldn't add them. Try again."); return; }
    setNotice(d.status === "invited"
      ? `Invite saved. ${email.trim()} gets access the first time they sign in with that address.`
      : `${email.trim()} now has access.`);
    setEmail("");
    await load();
    onChanged();
  }

  async function changeRole(id: string, next: string) {
    setError(null);
    const res = await fetch(`/api/projects/${projectId}/members/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: next }),
    });
    if (!res.ok) setError("Couldn't change the role.");
    await load();
  }

  async function remove(id: string, isSelf: boolean) {
    setError(null);
    const res = await fetch(`/api/projects/${projectId}/members/${id}`, { method: "DELETE" });
    if (!res.ok) { setError("Couldn't remove them."); return; }
    onChanged();
    if (isSelf) { onClose(); return; }
    await load();
  }

  const avatar = (p: { name: string | null; email: string | null; image: string | null }) =>
    p.image
      ? <img src={p.image} alt="" className="bld-share-avatar" />
      : <span className="bld-share-avatar bld-share-avatar--initial">{(p.name || p.email || "?").slice(0, 1).toUpperCase()}</span>;

  return (
    <div className="bld-modal-overlay" onClick={() => !busy && onClose()}>
      <div className="bld-modal bld-modal--share" onClick={e => e.stopPropagation()}>
        <button className="bld-modal-close" onClick={onClose} title="Close" disabled={busy}>×</button>
        <h2 className="bld-modal-title">Share “{projectName}”</h2>
        <p className="bld-modal-body">
          People with access can open every page in this project. Editors can change pages and add new ones, and see each other&apos;s edits live. Viewers can only look.
        </p>

        {isOwner && (
          <div className="bld-share-add">
            <input
              className="bld-key-input"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") add(); }}
              disabled={busy}
              autoFocus
            />
            <select className="bld-share-role" value={role} onChange={e => setRole(e.target.value)} disabled={busy}>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
            <button className="bld-share-add-btn" onClick={add} disabled={busy || !email.trim()}>Add</button>
          </div>
        )}
        {error && <div className="bld-msg-error bld-share-msg"><span>{error}</span></div>}
        {notice && <p className="bld-share-notice">{notice}</p>}

        {!data ? (
          <p className="bld-share-loading">Loading…</p>
        ) : (
          <ul className="bld-share-list">
            <li className="bld-share-row">
              {avatar(data.owner)}
              <span className="bld-share-who">
                <span className="bld-share-name">{data.owner.name || data.owner.email}{data.owner.id === currentUserId ? " (you)" : ""}</span>
                {data.owner.name && data.owner.email && <span className="bld-share-email">{data.owner.email}</span>}
              </span>
              <span className="bld-share-badge">Owner</span>
            </li>
            {data.members.map(m => {
              const isSelf = m.userId === currentUserId;
              return (
                <li key={m.id} className="bld-share-row">
                  {avatar(m)}
                  <span className="bld-share-who">
                    <span className="bld-share-name">{m.name || m.email}{isSelf ? " (you)" : ""}</span>
                    {m.name && m.email && <span className="bld-share-email">{m.email}</span>}
                  </span>
                  {isOwner ? (
                    <select className="bld-share-role" value={m.role} onChange={e => changeRole(m.id, e.target.value)}>
                      <option value="editor">Editor</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  ) : (
                    <span className="bld-share-badge">{m.role === "editor" ? "Editor" : "Viewer"}</span>
                  )}
                  {(isOwner || isSelf) && (
                    <button className="bld-share-remove" onClick={() => remove(m.id, isSelf)} title={isSelf ? "Leave this project" : "Remove access"}>
                      {isSelf ? "Leave" : "Remove"}
                    </button>
                  )}
                </li>
              );
            })}
            {data.invites.map(i => (
              <li key={i.id} className="bld-share-row bld-share-row--pending">
                <span className="bld-share-avatar bld-share-avatar--initial">{i.email.slice(0, 1).toUpperCase()}</span>
                <span className="bld-share-who">
                  <span className="bld-share-name">{i.email}</span>
                  <span className="bld-share-email">Invited, hasn&apos;t signed in yet</span>
                </span>
                {isOwner ? (
                  <select className="bld-share-role" value={i.role} onChange={e => changeRole(i.id, e.target.value)}>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                ) : (
                  <span className="bld-share-badge">{i.role === "editor" ? "Editor" : "Viewer"}</span>
                )}
                {isOwner && <button className="bld-share-remove" onClick={() => remove(i.id, false)} title="Cancel invite">Remove</button>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
