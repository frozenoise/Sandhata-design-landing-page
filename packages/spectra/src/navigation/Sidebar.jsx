import React from "react";

const CollapseIcon = ({ collapsed }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: collapsed ? "rotate(180deg)" : "none" }}>
    <polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" />
  </svg>
);

/**
 * Sidebar — a collapsible navigation rail with grouped links. The current
 * route (`activeId`) gets a left accent border and the primary-blue icon
 * treatment; `collapsed` shrinks the rail to icon-only width.
 */
export function Sidebar({ groups = [], activeId, collapsed = false, onCollapse, width = 240, style = {} }) {
  const w = collapsed ? 72 : width;
  return (
    <nav style={{
      width: w, flexShrink: 0, display: "flex", flexDirection: "column",
      background: "var(--colour-neutral-0)", borderRight: "1px solid var(--colour-neutral-200)",
      height: "100%", transition: "width var(--duration-moderate-02) var(--ease-standard-productive)",
      overflow: "hidden", ...style,
    }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 8px" }}>
        {groups.map((group, gi) => (
          <div key={group.label || gi} style={{ marginBottom: 16 }}>
            {group.label && !collapsed && (
              <div style={{
                padding: "0 10px 6px", fontFamily: "var(--font-normal)", fontSize: 11, fontWeight: 700,
                letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--colour-neutral-500)",
              }}>
                {group.label}
              </div>
            )}
            {(group.items || []).map((item) => {
              const active = item.id === activeId;
              return (
                <a
                  key={item.id}
                  href={item.href || "#"}
                  aria-current={active ? "page" : undefined}
                  title={collapsed ? item.label : undefined}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: collapsed ? "10px" : "9px 10px", margin: "1px 0",
                    borderRadius: "var(--radius-sm)", textDecoration: "none",
                    borderLeft: active ? "3px solid var(--colour-primaryblue-500)" : "3px solid transparent",
                    background: active ? "var(--colour-neutral-200)" : "transparent",
                    color: active ? "var(--colour-neutral-900)" : "var(--colour-neutral-800)",
                    fontFamily: "var(--font-normal)", fontWeight: active ? 700 : 400, fontSize: "var(--body-medium-size)",
                    justifyContent: collapsed ? "center" : "flex-start",
                  }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "var(--colour-neutral-50)"; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
                >
                  {item.icon && (
                    <span style={{ display: "inline-flex", flexShrink: 0, color: active ? "var(--colour-primaryblue-500)" : "var(--colour-neutral-800)" }}>
                      {item.icon}
                    </span>
                  )}
                  {!collapsed && <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.label}</span>}
                  {!collapsed && item.badge != null && (
                    <span style={{
                      fontFamily: "var(--font-bold)", fontWeight: 700, fontSize: 11, padding: "1px 7px",
                      borderRadius: "var(--radius-pill)", background: "var(--colour-primaryblue-50)", color: "var(--colour-primaryblue-600)",
                    }}>
                      {item.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </div>
        ))}
      </div>

      {onCollapse && (
        <button
          type="button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => onCollapse(!collapsed)}
          style={{
            display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", gap: 8,
            padding: "12px 18px", border: "none", borderTop: "1px solid var(--colour-neutral-200)",
            background: "transparent", color: "var(--colour-neutral-800)", cursor: "pointer",
            fontFamily: "var(--font-normal)", fontSize: "var(--body-small-size)",
          }}
        >
          <CollapseIcon collapsed={collapsed} />
          {!collapsed && "Collapse"}
        </button>
      )}
    </nav>
  );
}
