"use client";

import React from "react";
import "../_docs/docs.css";
import { SdTopNav } from "../_docs/shell";

export default function DemoPage() {
  return (
    <div className="doc-root">
      <SdTopNav active="Demo" />
      <main className="doc-scroll" style={{ display: "grid", placeItems: "center" }}>
        <div style={{ maxWidth: 520, textAlign: "center", padding: "64px 24px" }}>
          <h1 style={{ font: "700 28px/1.2 var(--font-bold)", color: "var(--text-title)", marginBottom: 12 }}>
            Demo showcase
          </h1>
          <p style={{ font: "16px/1.6 var(--font-normal)", color: "var(--text-subtitle)", marginBottom: 28 }}>
            The full product showcase (dashboard, forms, data tables, charts) is being
            migrated into this route. It currently lives as the standalone build under{" "}
            <code style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>ui_kits/showcase</code>.
          </p>
          <a
            href="/components"
            style={{
              display: "inline-flex", alignItems: "center", height: 44, padding: "0 22px",
              borderRadius: "var(--radius-md)", background: "var(--colour-primaryblue-500)",
              color: "#fff", font: "700 14px/1 var(--font-bold)", textDecoration: "none",
            }}
          >
            Browse components
          </a>
        </div>
      </main>
    </div>
  );
}
