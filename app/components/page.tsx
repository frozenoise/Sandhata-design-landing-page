"use client";

import React from "react";
import "../_docs/docs.css";
import { SdTopNav, SdSidebar, SdDocPage } from "../_docs/shell";
import { GROUPS } from "../_docs/data";

function AllComponents({ groups, setCurrent }) {
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  return (
    <div className="doc-main" style={{ maxWidth: 1020 }}>
      <header className="doc-head">
        <h1>Components</h1>
        <p>
          A complete library of {total} core components, each with documented variants,
          states, sizes, and copy-ready code snippets.
        </p>
      </header>
      <div className="doc-rule" />
      {groups.map((g) => (
        <section key={g.label} className="doc-section">
          <h2>{g.label}</h2>
          <div className="all-grid">
            {g.items.map((it) => (
              <button key={it.id} className="all-card" onClick={() => setCurrent(it.id)}>
                <div className="all-card-name">{it.name}</div>
                <div className="all-card-variants">{it.variants || it.description.slice(0, 60) + "…"}</div>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default function ComponentsPage() {
  const groups = GROUPS;
  const flat = groups.flatMap((g) => g.items);
  const [current, setCurrent] = React.useState("__all");
  React.useEffect(() => {
    const sc = document.querySelector(".doc-scroll");
    if (sc) sc.scrollTo({ top: 0 });
  }, [current]);
  const comp = flat.find((c) => c.id === current);
  return (
    <div className="doc-root">
      <SdTopNav active="Components" />
      <div className="doc-body">
        <SdSidebar
          groups={groups}
          current={current}
          setCurrent={setCurrent}
          topItem={{ id: "__all", label: "All Components" }}
          searchPlaceholder="Search components"
        />
        <main className="doc-scroll">
          {current === "__all" || !comp
            ? <AllComponents groups={groups} setCurrent={setCurrent} />
            : <SdDocPage page={comp} />}
        </main>
      </div>
    </div>
  );
}
