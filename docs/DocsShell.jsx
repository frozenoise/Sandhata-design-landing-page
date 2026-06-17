// Sandhata docs — shared shell: top nav (page links), sidebar, doc page with
// right-rail quick scroll navigation (scroll-spy). Loaded before each page's app.

function SdCodeBlock({ code }) {
  return <pre className="doc-code" dangerouslySetInnerHTML={{ __html: window.sdHighlight(code) }} />;
}

function SdExample({ section }) {
  return (
    <div className="doc-example">
      {section.demo && <div className="doc-preview">{section.demo()}</div>}
      {section.demo && section.code && <div className="doc-divider" />}
      {section.code && <SdCodeBlock code={section.code} />}
    </div>
  );
}

function SdBullets({ items }) {
  return (
    <ul className="doc-bullets">
      {items.map(([term, desc], i) => (
        <li key={i}><b>{term}</b>{desc ? ` — ${desc}` : ""}</li>
      ))}
    </ul>
  );
}

function SdStatesTable({ table }) {
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

function SdPropsTable({ rows }) {
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

function SdSection({ section }) {
  return (
    <section id={`sec-${section.id}`} className="doc-section">
      <h2>{section.title}</h2>
      {section.bullets && <SdBullets items={section.bullets} />}
      {section.table && <SdStatesTable table={section.table} />}
      {section.note && <p className="doc-note">{section.note}</p>}
      {(section.demo || section.code) && <SdExample section={section} />}
    </section>
  );
}

/* A full doc page: title, sections, optional props table, and the right-rail
   quick nav. The rail tracks the scroll position (scroll-spy) and clicking a
   link scrolls smoothly to that section. */
function SdDocPage({ page }) {
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
          <h1>{page.name}</h1>
          <p>{page.description}</p>
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

function SdSidebar({ groups, current, setCurrent, topItem, searchPlaceholder }) {
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
              <a key={it.id} className={"doc-nav-item" + (current === it.id ? " on" : "")} onClick={() => setCurrent(it.id)}>{it.name}</a>
            ))}
          </div>
        );
      })}
    </nav>
  );
}

/* Top navigation — each tab is its own page. */
function SdTopNav({ active }) {
  const tabs = [
    ["Components", "index.html"],
    ["Documentation", "documentation.html"],
    ["Demo", "../ui_kits/showcase/index.html"],
  ];
  return (
    <header className="doc-topbar">
      <a className="doc-logo-link" href="index.html"><img src="../assets/logo/sandhata-logo.svg" alt="Sandhata" style={{ height: 28 }} /></a>
      <nav className="doc-topnav">
        {tabs.map(([label, href]) => (
          <a key={label} className={active === label ? "on" : ""} href={href}>{label}</a>
        ))}
      </nav>
    </header>
  );
}

Object.assign(window, {
  SdCodeBlock, SdExample, SdBullets, SdStatesTable, SdPropsTable,
  SdSection, SdDocPage, SdSidebar, SdTopNav,
});
