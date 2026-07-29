import React from "react";

/**
 * Sandhata Card — the base surface for grouped content. White layer,
 * subtle border, small radius and a faint shadow. Optional title /
 * subtitle header and a trailing `action` slot.
 */
export function Card({ title, subtitle, action, children, padding = 24, style = {}, ...rest }) {
  return (
    <div
      style={{
        background: "var(--surface-raised)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-sm)",
        overflow: "hidden",
        ...style,
      }}
      {...rest}
    >
      {(title || action) && (
        <div style={{
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          gap: 16, padding: `${padding}px ${padding}px 0`,
        }}>
          <div>
            {title && <div className="sd-h2" style={{ fontFamily: "var(--font-bold)", fontSize: "var(--heading-h2-size)", lineHeight: "var(--heading-h2-line)", color: "var(--text-title)" }}>{title}</div>}
            {subtitle && <div style={{ marginTop: 4, fontFamily: "var(--font-light)", fontWeight: 300, fontSize: "var(--body-medium-size)", color: "var(--text-caption)" }}>{subtitle}</div>}
          </div>
          {action && <div style={{ flexShrink: 0 }}>{action}</div>}
        </div>
      )}
      <div style={{ padding }}>{children}</div>
    </div>
  );
}
