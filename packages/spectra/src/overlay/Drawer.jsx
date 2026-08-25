import React from "react";

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const EDGE = {
  right:  { side: "right",  dim: "width",  size: 420, axis: "X" },
  left:   { side: "left",   dim: "width",  size: 420, axis: "X" },
  top:    { side: "top",    dim: "height", size: 320, axis: "Y" },
  bottom: { side: "bottom", dim: "height", size: 320, axis: "Y" },
};

/**
 * Drawer — a panel anchored to a screen edge (right by default), used for
 * detail views, filter panels, and secondary content. Renders nothing when
 * `open` is false. A drag handle marks the resizable edge for left/right
 * drawers (matches the Figma "dragger pill" anatomy).
 */
export function Drawer({ open, onClose, align = "right", title, children, footer, style = {} }) {
  if (!open) return null;
  const edge = EDGE[align] || EDGE.right;
  const vertical = edge.axis === "X";

  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "var(--colour-neutral-500)" }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute", [edge.side]: 0,
          ...(vertical ? { top: 0, bottom: 0, [edge.dim]: edge.size, maxWidth: "90vw" } : { left: 0, right: 0, [edge.dim]: edge.size, maxHeight: "90vh" }),
          display: "flex", flexDirection: "column",
          background: "var(--colour-neutral-0)",
          borderLeft: align === "right" ? "1px solid var(--colour-neutral-200)" : "none",
          borderRight: align === "left" ? "1px solid var(--colour-neutral-200)" : "none",
          borderTop: align === "bottom" ? "1px solid var(--colour-neutral-200)" : "none",
          borderBottom: align === "top" ? "1px solid var(--colour-neutral-200)" : "none",
          boxShadow: "var(--shadow-overlay)",
          ...style,
        }}
      >
        {vertical && (
          <div style={{
            position: "absolute", top: "50%", [align === "right" ? "left" : "right"]: -3, transform: "translateY(-50%)",
            width: 6, height: 48, borderRadius: "var(--radius-pill)", background: "var(--colour-neutral-300)",
          }} />
        )}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          padding: "18px 20px", background: "var(--colour-neutral-50)", borderBottom: "1px solid var(--colour-neutral-200)",
        }}>
          {title && (
            <h2 style={{ margin: 0, fontFamily: "var(--font-bold)", fontWeight: 700, fontSize: "var(--heading-h2-size)", color: "var(--colour-neutral-900)" }}>
              {title}
            </h2>
          )}
          {onClose && (
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                width: 28, height: 28, padding: 0, border: "none", borderRadius: "var(--radius-sm)",
                background: "transparent", color: "var(--colour-primaryblue-500)", cursor: "pointer",
                transition: "background var(--duration-fast-02)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--colour-neutral-50)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <CloseIcon />
            </button>
          )}
        </div>

        <div style={{ padding: 20, overflow: "auto", flex: 1, color: "var(--colour-neutral-900)", fontFamily: "var(--font-normal)", fontSize: "var(--body-medium-size)", lineHeight: 1.6 }}>
          {children}
        </div>

        {footer && (
          <div style={{ padding: "14px 20px", borderTop: "1px solid var(--colour-neutral-200)", display: "flex", justifyContent: "flex-end", gap: 10 }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
