"use client";

import React from "react";
import "../_docs/docs.css";
import { SdTopNav } from "../_docs/shell";
import { ICON_DATA, IconStyle } from "./icon-data";

const STYLES: IconStyle[] = ["Stroke", "Broken", "Line Two Tone", "Filled", "Two Tone", "Glass"];

const STROKE_STYLES = new Set<IconStyle>(["Stroke", "Broken", "Line Two Tone"]);

function getSvgWrapper(style: IconStyle, size: number, content: string): string {
  const fill = STROKE_STYLES.has(style) ? ' fill="none"' : "";
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24"${fill} xmlns="http://www.w3.org/2000/svg">${content}</svg>`;
}

function IconTile({ name, content, style, size }: { name: string; content: string; style: IconStyle; size: number }) {
  const [copied, setCopied] = React.useState(false);

  const copy = () => {
    const svg = getSvgWrapper(style, size, content);
    navigator.clipboard.writeText(svg).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const fillAttr = STROKE_STYLES.has(style) ? "none" : undefined;

  return (
    <button
      onClick={copy}
      title={`Copy ${name} SVG`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        padding: "16px 10px",
        border: "1px solid",
        borderColor: copied ? "var(--colour-primaryblue-200)" : "var(--doc-line)",
        borderRadius: "var(--radius-lg)",
        background: copied ? "var(--colour-primaryblue-50)" : "var(--doc-surface)",
        cursor: "pointer",
        minWidth: 82,
        transition: "background 0.1s, border-color 0.1s",
      }}
      onMouseEnter={e => {
        if (!copied) {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.background = "var(--colour-neutral-50)";
          el.style.borderColor = "var(--border-default)";
        }
      }}
      onMouseLeave={e => {
        if (!copied) {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.background = "var(--doc-surface)";
          el.style.borderColor = "var(--doc-line)";
        }
      }}
    >
      {copied ? (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polyline
            points="20 6 9 17 4 12"
            stroke="var(--colour-primaryblue-500)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={fillAttr}
          xmlns="http://www.w3.org/2000/svg"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
      <span
        style={{
          fontFamily: "var(--font-normal)",
          fontSize: 10,
          fontWeight: copied ? 600 : 400,
          color: copied ? "var(--colour-primaryblue-500)" : "var(--text-caption)",
          textAlign: "center",
          lineHeight: 1.3,
          wordBreak: "break-word",
          maxWidth: 72,
        }}
      >
        {copied ? "Copied!" : name}
      </span>
    </button>
  );
}

export default function IconsPage() {
  const [style, setStyle] = React.useState<IconStyle>("Stroke");
  const [q, setQ] = React.useState("");
  const [size, setSize] = React.useState(24);

  const styleData = ICON_DATA[style] ?? {};
  const allNames = Object.keys(styleData);
  const ql = q.trim().toLowerCase();
  const names = ql ? allNames.filter(n => n.toLowerCase().includes(ql)) : allNames;

  return (
    <div className="doc-root">
      <SdTopNav active="Icons" />
      <main className="doc-scroll">
        <div style={{ maxWidth: 1024, margin: "0 auto" }}>
          <header className="doc-head">
            <h1>Icon Library</h1>
            <p>
              {allNames.length} icons across 6 styles. Click any icon to copy its SVG. Icons inherit{" "}
              <code style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>currentColor</code> — set{" "}
              <code style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>color</code> on the parent to tint.
            </p>
          </header>
          <div className="doc-rule" />

          {/* Style tabs */}
          <div style={{ display: "flex", gap: 4, marginBottom: 24, flexWrap: "wrap" }}>
            {STYLES.map(s => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                style={{
                  padding: "7px 14px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid",
                  borderColor: style === s ? "var(--colour-primaryblue-500)" : "var(--doc-line)",
                  background: style === s ? "var(--colour-primaryblue-500)" : "var(--doc-surface)",
                  color: style === s ? "#fff" : "var(--text-body)",
                  font: "13px/1 var(--font-normal)",
                  cursor: "pointer",
                  transition: "all 0.1s",
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Search + size */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 32, flexWrap: "wrap" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                height: 38,
                padding: "0 12px",
                background: "var(--doc-surface)",
                border: "1px solid var(--doc-line)",
                borderRadius: "var(--radius-md)",
                flex: 1,
                maxWidth: 320,
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Search icons…"
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  width: "100%",
                  font: "14px/1 var(--font-normal)",
                  color: "var(--text-body)",
                }}
              />
              {q && (
                <button
                  onClick={() => setQ("")}
                  style={{ border: "none", background: "none", cursor: "pointer", padding: 0, color: "var(--text-caption)", fontSize: 16, lineHeight: 1 }}
                >
                  ×
                </button>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ font: "13px/1 var(--font-normal)", color: "var(--text-caption)" }}>Size</span>
              {([16, 20, 24] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  style={{
                    width: 36,
                    height: 30,
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid",
                    borderColor: size === s ? "var(--colour-primaryblue-500)" : "var(--doc-line)",
                    background: size === s ? "var(--colour-primaryblue-500)" : "var(--doc-surface)",
                    color: size === s ? "#fff" : "var(--text-body)",
                    font: "12px/1 var(--font-mono)",
                    cursor: "pointer",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            <span style={{ font: "13px/1 var(--font-normal)", color: "var(--text-caption)", marginLeft: "auto" }}>
              {names.length} icon{names.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Icon grid */}
          {names.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {names.map(name => (
                <IconTile key={name} name={name} content={styleData[name]} style={style} size={size} />
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "80px 0",
                font: "14px/1 var(--font-normal)",
                color: "var(--text-caption)",
              }}
            >
              No icons match &ldquo;{q}&rdquo; in {style} style
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
