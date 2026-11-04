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

const ROLES = [
  { value: "editor", label: "Editor", hint: "Can change pages and edit live" },
  { value: "viewer", label: "Viewer", hint: "Can only look" },
];

const ChevronIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
);
const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);

// Styled stand-in for a native select: the OS popup ignores the page's fonts
// and colours (macOS draws its own tick and accent highlight).
function RoleMenu({ value, onChange, disabled, compact }: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  /** Text-only trigger for the people list; boxed trigger for the add row. */
  compact?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { e.stopPropagation(); setOpen(false); } };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey, true);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey, true); };
  }, [open]);
  const current = ROLES.find(r => r.value === value) ?? ROLES[0];
  return (
    <div className="bld-role" ref={ref}>
      <button
        type="button"
        className={`bld-role-trigger${compact ? " bld-role-trigger--compact" : ""}`}
        onClick={() => setOpen(o => !o)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {current.label} <ChevronIcon />
      </button>
      {open && (
        <ul className="bld-role-menu" role="listbox">
          {ROLES.map(r => (
            <li key={r.value}>
              <button
                type="button"
                role="option"
                aria-selected={r.value === value}
                className={`bld-role-option${r.value === value ? " bld-role-option--on" : ""}`}
                onClick={() => { setOpen(false); if (r.value !== value) onChange(r.value); }}
              >
                <span className="bld-role-check">{r.value === value && <CheckIcon />}</span>
                <span className="bld-role-text">
                  <span className="bld-role-label">{r.label}</span>
                  <span className="bld-role-hint">{r.hint}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

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
  // The app sends no email, so after adding someone the owner gets a ready
  // message (link straight to the project) to copy or open in their mail app.
  const [letKnow, setLetKnow] = React.useState<{ email: string; role: string } | null>(null);
  const [copied, setCopied] = React.useState(false);

  const load = React.useCallback(async () => {
    const res = await fetch(`/api/projects/${projectId}/members`);
    if (res.ok) setData(await res.json());
    else setError("Couldn't load who has access.");
  }, [projectId]);

  React.useEffect(() => { load(); }, [load]);

  const isOwner = data?.role === "owner";

  async function add() {
    if (!email.trim() || busy) return;
    setBusy(true); setError(null); setNotice(null); setLetKnow(null); setCopied(false);
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
      : `${email.trim()} now has access. They'll see it in their notifications.`);
    setLetKnow({ email: email.trim(), role });
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

  const projectLink = typeof window !== "undefined" ? `${window.location.origin}/builder?project=${projectId}` : "";
  const inviteMessage = (to: { email: string; role: string }) =>
    `I've shared "${projectName}" with you in the Spectra builder, as ${to.role === "editor" ? "an editor" : "a viewer"}.\n\n` +
    `Open it here: ${projectLink}\n\nSign in with ${to.email} (Google or GitHub) to get access.`;
  async function copyMessage() {
    if (!letKnow) return;
    try { await navigator.clipboard.writeText(inviteMessage(letKnow)); setCopied(true); }
    catch { setError("Couldn't copy. Select the link and copy it instead."); }
  }

  const avatar = (p: { name: string | null; email: string | null; image: string | null }) =>
    p.image
      ? <img src={p.image} alt="" className="bld-share-avatar" />
      : <span className="bld-share-avatar bld-share-avatar--initial">{(p.name || p.email || "?").slice(0, 1).toUpperCase()}</span>;

  return (
    <div className="bld-modal-overlay" onClick={() => !busy && onClose()}>
      <div className="bld-modal bld-modal--share" onClick={e => e.stopPropagation()}>
        <div className="bld-share-head">
          <h2 className="bld-modal-title" title={projectName}>Share “{projectName}”</h2>
          <button className="bld-share-close" onClick={onClose} title="Close" aria-label="Close" disabled={busy}><CloseIcon /></button>
        </div>
        <p className="bld-modal-body">
          People with access can open every page in this project. Editors can change pages and add new ones, and see each other&apos;s edits live. Viewers can only look.
        </p>

        {isOwner && (
          <div className="bld-share-add">
            <input
              className="bld-share-input"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") add(); }}
              disabled={busy}
              autoFocus
            />
            <RoleMenu value={role} onChange={setRole} disabled={busy} />
            <button className="bld-share-add-btn" onClick={add} disabled={busy || !email.trim()}>Add</button>
          </div>
        )}
        {error && <div className="bld-msg-error bld-share-msg"><span>{error}</span></div>}
        {notice && <p className="bld-share-notice">{notice}</p>}
        {letKnow && (
          <div className="bld-share-letknow">
            <span className="bld-share-letknow-label">Let them know</span>
            <div className="bld-share-letknow-actions">
              <button type="button" onClick={copyMessage}>{copied ? <><CheckIcon /> Copied</> : "Copy invite message"}</button>
              <a
                href={`mailto:${encodeURIComponent(letKnow.email)}?subject=${encodeURIComponent(`You've been invited to "${projectName}" in Spectra`)}&body=${encodeURIComponent(inviteMessage(letKnow))}`}
              >Email invite</a>
            </div>
          </div>
        )}

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
                    <RoleMenu compact value={m.role} onChange={v => changeRole(m.id, v)} />
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
                  <RoleMenu compact value={i.role} onChange={v => changeRole(i.id, v)} />
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
