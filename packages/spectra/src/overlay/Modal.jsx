import React from "react";

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SIZES = { small: 400, medium: 560, large: 760 };

/**
 * Modal — a centred dialog over a page-dimming overlay. Renders nothing
 * when `open` is false. Pass `danger` for destructive-confirmation modals
 * (adds a top accent border in the error colour).
 */
export function Modal({ open, onClose, label, title, children, footer, danger = false, size = "medium", style = {} }) {
  if (!open) return null;
  const width = SIZES[size] || SIZES.medium;

  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--colour-neutral-500)",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(90vw, " + width + "px)", maxHeight: "85vh", display: "flex", flexDirection: "column",
          background: "var(--colour-neutral-0)", borderRadius: "var(--radius-lg)",
          border: "1px solid var(--colour-neutral-200)",
          borderTop: danger ? "3px solid var(--colour-error-500)" : "1px solid var(--colour-neutral-200)",
          boxShadow: "var(--shadow-overlay)", overflow: "hidden",
          ...style,
        }}
      >
        <div style={{
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12,
          padding: "18px 20px", background: "var(--colour-neutral-50)", borderBottom: "1px solid var(--colour-neutral-200)",
        }}>
          <div>
            {label && (
              <div style={{ fontFamily: "var(--font-normal)", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--colour-neutral-800)", marginBottom: 4 }}>
                {label}
              </div>
            )}
            {title && (
              <h2 style={{ margin: 0, fontFamily: "var(--font-bold)", fontWeight: 700, fontSize: "var(--heading-h2-size)", color: "var(--colour-neutral-900)" }}>
                {title}
              </h2>
            )}
          </div>
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

        <div style={{ padding: 20, overflow: "auto", color: "var(--colour-neutral-900)", fontFamily: "var(--font-normal)", fontSize: "var(--body-medium-size)", lineHeight: 1.6 }}>
          {children}
        </div>

        {footer && (
          <div style={{ padding: "14px 20px", background: "var(--colour-neutral-50)", borderTop: "1px solid var(--colour-neutral-200)", display: "flex", justifyContent: "flex-end", gap: 10 }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
