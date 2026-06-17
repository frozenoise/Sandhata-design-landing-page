import React from "react";

/**
 * Tabs — underline-style tab bar. Controlled via `value` + `onChange`.
 * Each tab: { value, label, icon? }.
 */
export function Tabs({ tabs = [], value, onChange, style = {} }) {
  return (
    <div role="tablist" style={{
      display: "flex", gap: 4, borderBottom: "1px solid var(--border-subtle)", ...style,
    }}>
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange && onChange(t.value)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 14px", border: "none", background: "transparent",
              cursor: "pointer", position: "relative",
              fontFamily: active ? "var(--font-bold)" : "var(--font-normal)",
              fontWeight: active ? 700 : 400,
              fontSize: "var(--body-medium-size)",
              color: active ? "var(--colour-primaryblue-600)" : "var(--text-caption)",
              transition: "color var(--duration-fast)",
            }}
          >
            {t.icon && <span style={{ display: "inline-flex" }}>{t.icon}</span>}
            {t.label}
            <span style={{
              position: "absolute", left: 0, right: 0, bottom: -1, height: 2,
              background: active ? "var(--colour-primaryblue-500)" : "transparent",
              borderRadius: "2px 2px 0 0",
            }} />
          </button>
        );
      })}
    </div>
  );
}
