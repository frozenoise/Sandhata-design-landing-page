"use client";

import React from "react";
import { sdHighlightLines } from "./highlight";

// Sandhata docs — shared shell: top nav (page links), sidebar, doc page with
// right-rail quick scroll navigation (scroll-spy). Loaded before each page's app.

/* Generic file/code icon for the code-block header — matches shadcn's
   rehype-pretty-code figcaption convention (an icon that stands in for "this
   is a code file"), not a per-language icon set — that would need a real
   language→icon map for a highlighter we're deliberately not swapping in. */
const SdCodeFileIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
  </svg>
);

/* None of the call sites in data.tsx/documentationData.tsx pass a language —
   the samples aren't tied to real files, so there's nothing to read a language
   off of except the snippet's own shape. This is a lightweight heuristic, not
   a parser: JSX/keyword hits win first, then CSS-shaped selector/declaration
   patterns, then a plain-text fallback, else default to "tsx" (the large
   majority of samples in this doc set). Good enough for a header label; not
   meant to be authoritative. */
function inferCodeLanguage(code: string): string {
  const s = String(code).trim();
  if (/<!--/.test(s)) return "html";
  if (/\b(import|export|const|let|return|function|useState)\b/.test(s)) return "tsx";
  if (/^<[A-Za-z]/.test(s)) return "tsx";
  if (/^[.:#]/.test(s) || /^[a-zA-Z][a-zA-Z0-9-]*\s*\{/.test(s) || /^[a-zA-Z-]+\s*:\s*[^;{]+;/.test(s)) return "css";
  if (!/[<>{};]/.test(s)) return "text";
  return "tsx";
}

/* Code block chrome, rebuilt to match ui.shadcn.com's real rehype-pretty-code
   markup (figure > figcaption[icon + language] > pre), adapted to this
   codebase's own tokens instead of Tailwind/zinc. The copy button lives
   outside the scrolling <pre> (absolutely positioned within the relative
   .doc-code-body), hidden until the parent .doc-example is hovered or the
   button itself gets keyboard focus — same reveal contract as shadcn's, same
   icon-swap-on-copy pattern as SdCopyForAI's SdCopyIcon/SdCopiedIcon. The
   highlighter underneath is unchanged: still the hand-rolled sdHighlight()
   regex tokenizer, not real Shiki — swapping that engine is a bigger,
   separate change than "make the chrome match". Each line renders through
   sdHighlightLines() into its own <span class="doc-code-line">, which owns
   a CSS counter (see docs.css) that draws the muted line number as
   generated ::before content — never a real DOM text node, so it can't be
   selected/copied as code text no matter what. */
function SdCodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = React.useState(false);
  const lang = language || inferCodeLanguage(code);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable (permissions/insecure context) — fail quietly.
    }
  };

  return (
    <figure className="doc-code-figure">
      <figcaption className="doc-code-caption" data-language={lang}>
        <SdCodeFileIcon />
        {lang}
      </figcaption>
      <div className="doc-code-body">
        <pre className="doc-code" data-language={lang}>
          <code className="doc-code-lines" dangerouslySetInnerHTML={{ __html: sdHighlightLines(code) }} />
        </pre>
        <button
          type="button"
          className={"doc-code-copy" + (copied ? " is-copied" : "")}
          onClick={onCopy}
          aria-label={copied ? "Copied to clipboard" : "Copy code"}
          title={copied ? "Copied" : "Copy code"}
        >
          {copied ? <SdCopiedIcon /> : <SdCopyIcon />}
        </button>
      </div>
    </figure>
  );
}

/* fn is rendered AS a component (<Demo/>), never called directly (fn()).
   Demo functions in data.tsx/documentationData.tsx often call React hooks
   (useState, etc.) — calling fn() inline would run those hooks against
   whatever component happens to be rendering at that point (this one),
   not their own instance. Since different demos call different numbers of
   hooks, navigating between two pages whose demos have different hook
   counts would violate the Rules of Hooks and crash intermittently —
   exactly the bug this fixes. Rendering fn as a component type instead
   gives each demo its own Fiber/hook state that mounts and unmounts
   cleanly when the page (and therefore the demo function reference)
   changes. */
function SdDemoRenderer({ fn }: { fn: () => React.ReactNode }) {
  const Demo = fn as React.ComponentType;
  return <Demo />;
}

function SdExample({ section }: any) {
  const hasDemo = !!section.demo;
  const hasCode = !!section.code;
  const [tab, setTab] = React.useState<"preview" | "code">("preview");
  if (!hasDemo && !hasCode) return null;
  return (
    <div className="doc-example">
      {hasDemo && hasCode && (
        <div className="doc-example-header">
          <div className="doc-example-tabs">
            <button className={"doc-tab-btn" + (tab === "preview" ? " on" : "")} onClick={() => setTab("preview")}>Preview</button>
            <button className={"doc-tab-btn" + (tab === "code" ? " on" : "")} onClick={() => setTab("code")}>React</button>
          </div>
        </div>
      )}
      {hasDemo && tab === "preview" && (
        <div className="doc-preview">
          <SdDemoRenderer fn={section.demo} />
        </div>
      )}
      {hasCode && (tab === "code" || !hasDemo) && <SdCodeBlock code={section.code} language={section.language} />}
    </div>
  );
}

function SdBullets({ items }: any) {
  return (
    <ul className="doc-bullets">
      {items.map(([term, desc], i) => (
        <li key={i}><b>{term}</b>{desc ? ` — ${desc}` : ""}</li>
      ))}
    </ul>
  );
}

function SdStatesTable({ table }: any) {
  return (
    <table className="doc-table">
      <thead><tr>{table.head.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
      <tbody>
        {table.rows.map((r, i) => (
          <tr key={i}>{r.map((c, j) => <td key={j} className={j === table.codeCol ? "mono-cell" : ""}>{c}</td>)}</tr>
        ))}
      </tbody>
    </table>
  );
}

const SdCheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
);
const SdCrossIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);

/* Copy-for-AI split button icons — same 24x24/stroke-2 convention as the
   Plus/Pencil/ArrowR/Search icons in data.tsx, sized down to sit inline
   with 13px button text. */
const SdCopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
const SdCopiedIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const SdChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/* Paired correct/incorrect example — anatomy/accessibility reuse bullets/table,
   but nothing existing represents a side-by-side "Do this, not that" pair. */
function SdDoDont({ pair }: any) {
  const cards = [
    { key: "do", cls: "is-do", label: "Do", icon: <SdCheckIcon />, item: pair.do },
    { key: "dont", cls: "is-dont", label: "Don't", icon: <SdCrossIcon />, item: pair.dont },
  ];
  return (
    <div className="doc-dodont">
      {cards.map(({ key, cls, label, icon, item }) => item && (
        <div key={key} className={`doc-dodont-card ${cls}`}>
          <div className="doc-dodont-head">
            <span className="doc-dodont-icon">{icon}</span>{label}
          </div>
          {item.demo && <div className="doc-dodont-preview"><SdDemoRenderer fn={item.demo} /></div>}
          {item.text && <p className="doc-dodont-text">{item.text}</p>}
        </div>
      ))}
    </div>
  );
}

/* Tokens used — which design tokens this component's own styling actually
   resolves to (code-token layer), read from the component's source/CSS.
   Colour tokens get a live swatch so the value is visible, not just named. */
function SdTokensTable({ tokens }: any) {
  return (
    <table className="doc-table doc-tokens-table">
      <thead><tr><th>Token</th><th>Used for</th></tr></thead>
      <tbody>
        {tokens.map((t, i) => (
          <tr key={i}>
            <td>
              <span className="token-cell">
                {t.name.startsWith("--colour-") && (
                  <span className="token-swatch" style={{ background: `var(${t.name})` }} />
                )}
                <code className="prop-pill">{t.name}</code>
              </span>
            </td>
            <td>{t.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SdPropsTable({ rows }: any) {
  return (
    <table className="doc-table">
      <thead><tr><th>Prop</th><th>Type</th><th>Description</th></tr></thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}><td><code className="prop-pill">{r[0]}</code></td><td className="type-cell">{r[1]}</td><td>{r[2]}</td></tr>
        ))}
      </tbody>
    </table>
  );
}

/* ── Copy for AI ─────────────────────────────────────────────────────────────
   Serialises a doc page's own data (not its rendered DOM) to clean Markdown —
   the format an LLM parses cleanly, but the button is labelled by what a
   reader would actually use it for, not the wire format underneath. Matches
   the site's "AI-ready design system" positioning: every page is structured
   for humans and LLMs alike. `demo` is a React element/function and can't be
   serialised, so it's skipped; its adjacent `code` snippet (the same
   information, already as text) is kept. */
function escapeCell(v: any) {
  return String(v ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function mdTable(head: string[], rows: any[][]) {
  const headLine = `| ${head.map(escapeCell).join(" | ")} |`;
  const sepLine = `| ${head.map(() => "---").join(" | ")} |`;
  const bodyLines = rows.map((r) => `| ${r.map(escapeCell).join(" | ")} |`);
  return [headLine, sepLine, ...bodyLines].join("\n");
}

function sectionToMarkdown(section: any) {
  const parts = [`## ${section.title}`];

  if (section.bullets) {
    parts.push(
      section.bullets.map(([term, desc]: string[]) => `- **${term}**${desc ? ` — ${desc}` : ""}`).join("\n")
    );
  }

  if (section.table) {
    parts.push(mdTable(section.table.head, section.table.rows));
  }

  if (section.note) {
    parts.push(`> ${section.note}`);
  }

  if (section.doDont) {
    const lines: string[] = [];
    if (section.doDont.do?.text) lines.push(`**Do:** ${section.doDont.do.text}`);
    if (section.doDont.dont?.text) lines.push(`**Don't:** ${section.doDont.dont.text}`);
    if (lines.length) parts.push(lines.join("\n\n"));
  }

  if (section.tokens) {
    parts.push(mdTable(["Token", "Used for"], section.tokens.map((t: any) => [t.name, t.role])));
  }

  // section.demo is a React element factory — not serialisable, so it's
  // intentionally skipped; the code sample beside it carries the same intent.
  if (section.code) {
    parts.push("```\n" + section.code + "\n```");
  }

  return parts.join("\n\n");
}

function pageToMarkdown(page: any) {
  const parts = [`# ${page.name}`];
  if (page.description) parts.push(page.description);
  for (const s of page.sections || []) parts.push(sectionToMarkdown(s));
  if (page.props) parts.push(["## Props", mdTable(["Prop", "Type", "Description"], page.props)].join("\n\n"));
  return parts.join("\n\n") + "\n";
}

/* Split button: main segment copies markdown to the clipboard (cross-fading
   icon+label between "Copy for AI" and "Copied"); chevron segment opens a
   small menu of export destinations. All three menu destinations reuse the
   exact same pageToMarkdown(page) string — one canonical export, several
   redirect targets. */
function SdCopyForAI({ page }: any) {
  const [copied, setCopied] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const groupRef = React.useRef<HTMLDivElement>(null);

  const copyToClipboard = async (md: string) => {
    try {
      await navigator.clipboard.writeText(md);
    } catch {
      // Clipboard API unavailable (permissions/insecure context) — fail quietly,
      // no toast dependency to lean on here.
    }
  };

  const onCopyClick = async () => {
    await copyToClipboard(pageToMarkdown(page));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const onViewMarkdown = () => {
    const blob = new Blob([pageToMarkdown(page)], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    // Give the new tab time to actually load the blob before it's revoked.
    setTimeout(() => URL.revokeObjectURL(url), 30000);
    setOpen(false);
  };

  // Both chatgpt.com/?q= and claude.ai/new?q= accept an unofficial, undocumented
  // query-string prefill param — not part of either platform's public API, so it
  // could change or disappear without notice. Decided against silently-succeeds-
  // but-looks-broken (clipboard-only landing on an empty input) after live testing
  // confirmed chatgpt.com/?q= prefills AND auto-submits, while claude.ai/new?q=
  // prefills the draft box only (no auto-submit) — that asymmetry is a platform
  // difference, not a bug in this code.
  //
  // MAX_PREFILL_LENGTH guards the encoded string (not raw markdown) against
  // unreasonably long URLs — browsers/servers commonly choke well before ~8k
  // chars. 6000 comfortably covers a fully-documented single component page
  // (e.g. Button's current doc set) while still falling back safely for
  // anything longer, rather than risking a silently-truncated or rejected URL.
  const MAX_PREFILL_LENGTH = 6000;

  const onOpenInChatGPT = async () => {
    const md = pageToMarkdown(page);
    const encoded = encodeURIComponent(md);
    if (encoded.length > MAX_PREFILL_LENGTH) {
      // Too long to trust in a URL — fall back to the original clipboard-only behavior.
      await copyToClipboard(md);
      window.open("https://chatgpt.com/", "_blank", "noopener,noreferrer");
      setOpen(false);
      return;
    }
    // Copy is kept as a safety net even on the prefill path, in case the ?q=
    // param stops working or the user wants to paste it again elsewhere.
    await copyToClipboard(md);
    window.open(`https://chatgpt.com/?q=${encoded}`, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  const onOpenInClaude = async () => {
    const md = pageToMarkdown(page);
    const encoded = encodeURIComponent(md);
    if (encoded.length > MAX_PREFILL_LENGTH) {
      // Too long to trust in a URL — fall back to the original clipboard-only behavior.
      await copyToClipboard(md);
      window.open("https://claude.ai/new", "_blank", "noopener,noreferrer");
      setOpen(false);
      return;
    }
    // Copy is kept as a safety net even on the prefill path, in case the ?q=
    // param stops working or the user wants to paste it again elsewhere.
    await copyToClipboard(md);
    window.open(`https://claude.ai/new?q=${encoded}`, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (groupRef.current && !groupRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div className="doc-copy-group" ref={groupRef}>
      <div className="doc-copy-pill">
        <button
          type="button"
          className={"doc-copy-btn doc-copy-main" + (copied ? " is-copied" : "")}
          onClick={onCopyClick}
          title="Copy this page as Markdown for an AI assistant"
        >
          <span className="doc-copy-fade">
            <span className={"doc-copy-state" + (!copied ? " is-visible" : "")}>
              <SdCopyIcon />Copy for AI
            </span>
            <span className={"doc-copy-state" + (copied ? " is-visible" : "")}>
              <SdCopiedIcon />Copied
            </span>
          </span>
        </button>
        <span className="doc-copy-divider" aria-hidden="true" />
        <button
          type="button"
          className="doc-copy-btn doc-copy-chevron"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label="More export options"
          onClick={() => setOpen((o) => !o)}
        >
          <SdChevronDownIcon />
        </button>
      </div>
      {open && (
        <div className="doc-copy-menu" role="menu">
          <button type="button" role="menuitem" className="doc-copy-menu-item" onClick={onViewMarkdown}>View as Markdown</button>
          <button type="button" role="menuitem" className="doc-copy-menu-item" onClick={onOpenInChatGPT}>Open in ChatGPT</button>
          <button type="button" role="menuitem" className="doc-copy-menu-item" onClick={onOpenInClaude}>Open in Claude</button>
        </div>
      )}
    </div>
  );
}

function SdSection({ section }: any) {
  return (
    <section id={`sec-${section.id}`} className="doc-section">
      <h2>{section.title}</h2>
      {section.bullets && <SdBullets items={section.bullets} />}
      {section.table && <SdStatesTable table={section.table} />}
      {section.note && <p className="doc-note">{section.note}</p>}
      {section.doDont && <SdDoDont pair={section.doDont} />}
      {section.tokens && <SdTokensTable tokens={section.tokens} />}
      {(section.demo || section.code) && <SdExample section={section} />}
    </section>
  );
}

/* A full doc page: title, sections, optional props table, and the right-rail
   quick nav. The rail tracks the scroll position (scroll-spy) and clicking a
   link scrolls smoothly to that section. */
function SdDocPage({ page }: any) {
  const toc = (page.sections || [])
    .map((s) => ({ id: s.id, title: s.title }))
    .concat(page.props ? [{ id: "props", title: "Props" }] : []);
  const [active, setActive] = React.useState(toc[0] && toc[0].id);

  React.useEffect(() => {
    const sc = document.querySelector(".doc-scroll");
    if (!sc) return;
    const onScroll = () => {
      let cur = toc[0] && toc[0].id;
      for (const t of toc) {
        const el = document.getElementById(`sec-${t.id}`);
        if (el && el.offsetTop - 80 <= sc.scrollTop) cur = t.id;
      }
      setActive(cur);
    };
    onScroll();
    sc.addEventListener("scroll", onScroll, { passive: true });
    return () => sc.removeEventListener("scroll", onScroll);
  }, [page.id]);

  const jump = (id) => {
    const el = document.getElementById(`sec-${id}`);
    const sc = document.querySelector(".doc-scroll");
    if (el && sc) sc.scrollTo({ top: el.offsetTop - 24, behavior: "smooth" });
  };

  return (
    <div className="doc-page-wrap">
      <div className="doc-main">
        <header className="doc-head">
          <div className="doc-head-row">
            <div className="doc-head-text">
              <h1>{page.name}</h1>
              <p>{page.description}</p>
            </div>
            <SdCopyForAI page={page} />
          </div>
        </header>
        <div className="doc-rule" />
        {(page.sections || []).map((s) => <SdSection key={s.id} section={s} />)}
        {page.props && (
          <section id="sec-props" className="doc-section">
            <h2>Props</h2>
            <SdPropsTable rows={page.props} />
          </section>
        )}
      </div>
      <aside className="doc-toc">
        <div className="toc-inner">
          {toc.map((t) => (
            <a key={t.id} className={active === t.id ? "on" : ""} onClick={() => jump(t.id)}>{t.title}</a>
          ))}
        </div>
      </aside>
    </div>
  );
}

function SdSidebar({ groups, current, setCurrent, topItem, searchPlaceholder }: any) {
  const [q, setQ] = React.useState("");
  const ql = q.trim().toLowerCase();
  return (
    <nav className="doc-sidebar">
      <div className="doc-search">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        <input placeholder={searchPlaceholder || "Search"} value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {topItem && (
        <a className={"doc-nav-all" + (current === topItem.id ? " on" : "")} onClick={() => setCurrent(topItem.id)}>{topItem.label}</a>
      )}
      {groups.map((g) => {
        const items = g.items.filter((it) => !ql || it.name.toLowerCase().includes(ql));
        if (!items.length) return null;
        return (
          <div key={g.label} className="doc-group">
            <div className="doc-group-label">{g.label}</div>
            {items.map((it) => (
              <a key={it.id} className={"doc-nav-item" + (current === it.id ? " on" : "")} onClick={() => setCurrent(it.id)}>
                {it.name}
                {(it as any).sections?.[0]?.id === "coming-soon" && (
                  <span className="cs-badge">Soon</span>
                )}
              </a>
            ))}
          </div>
        );
      })}
    </nav>
  );
}

/* Top navigation — each tab is its own page. */
function SdTopNav({ active }: any) {
  const tabs = [
    ["Components", "/components"],
    ["Icons", "/icons"],
    ["Documentation", "/documentation"],
    ["Builder", "/builder"],
    ["Demo", "/demo"],
    ["Showcase", "/showcase"],
  ];
  return (
    <header className="doc-topbar">
      <a className="doc-logo-link" href="/"><img src="/assets/logo/sandhata-logo.svg" alt="Sandhata" style={{ height: 28 }} /></a>
      <nav className="doc-topnav">
        {tabs.map(([label, href]) => (
          <a key={label} className={active === label ? "on" : ""} href={href}>{label}</a>
        ))}
      </nav>
    </header>
  );
}

export {
  SdCodeBlock, SdExample, SdBullets, SdStatesTable, SdPropsTable, SdDoDont,
  SdTokensTable, SdSection, SdDocPage, SdSidebar, SdTopNav,
  SdCopyForAI, pageToMarkdown,
};
