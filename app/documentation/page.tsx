"use client";

import React from "react";
import "../_docs/docs.css";
import { SdTopNav, SdSidebar, SdDocPage } from "../_docs/shell";
import { DOC_PAGES } from "../_docs/documentationData";

export default function DocumentationPage() {
  const groups = DOC_PAGES;
  const flat = groups.flatMap((g) => g.items);
  const [current, setCurrent] = React.useState("overview");
  React.useEffect(() => {
    const sc = document.querySelector(".doc-scroll");
    if (sc) sc.scrollTo({ top: 0 });
  }, [current]);
  const page = flat.find((p) => p.id === current) || flat[0];
  return (
    <div className="doc-root">
      <SdTopNav active="Documentation" />
      <div className="doc-body">
        <SdSidebar
          groups={groups}
          current={current}
          setCurrent={setCurrent}
          searchPlaceholder="Search documentation"
        />
        <main className="doc-scroll">
          <SdDocPage page={page} />
        </main>
      </div>
    </div>
  );
}
