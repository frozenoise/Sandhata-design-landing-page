"use client";

import React from "react";
import { sdHighlight } from "./highlight";

// Sandhata docs — shared shell: top nav (page links), sidebar, doc page with
// right-rail quick scroll navigation (scroll-spy). Loaded before each page's app.

function SdCodeBlock({ code }: any) {
  return <pre className="doc-code" dangerouslySetInnerHTML={{ __html: sdHighlight(code) }} />;
}

function SdExample({ section }: any) {
  return (
    <div className="doc-example">
      {section.demo && <div className="doc-preview">{section.demo()}</div>}
      {section.demo && section.code && <div className="doc-divider" />}
      {section.code && <SdCodeBlock code={section.code} />}
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
          {item.demo && <div className="doc-dodont-preview">{item.demo()}</div>}
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

function SdCopyForAI({ page }: any) {
  const [copied, setCopied] = React.useState(false);
  const onClick = async () => {
    const md = pageToMarkdown(page);
    try {
      await navigator.clipboard.writeText(md);
    } catch {
      // Clipboard API unavailable (permissions/insecure context) — fail quietly,
      // no toast dependency to lean on here.
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button type="button" className={"doc-copy-btn" + (copied ? " is-copied" : "")} onClick={onClick} title="Copy this page as Markdown for an AI assistant">
      {copied ? "Copied" : "Copy for AI"}
    </button>
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
