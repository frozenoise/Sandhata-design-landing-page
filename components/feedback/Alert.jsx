import React from "react";

/** Inline Alert / banner. Tone sets the colour and default icon. */
export function Alert({ tone = "info", title, children, onClose, style = {} }) {
  const tones = {
    info:    { bg: "var(--colour-info-50)", bd: "var(--colour-info-200)", fg: "var(--colour-info-700)", icon: "info" },
    success: { bg: "var(--colour-success-50)", bd: "var(--colour-success-200)", fg: "var(--colour-success-700)", icon: "check" },
    warning: { bg: "var(--colour-alert-50)", bd: "var(--colour-alert-300)", fg: "var(--colour-alert-700)", icon: "warn" },
    error:   { bg: "var(--colour-error-50)", bd: "var(--colour-error-200)", fg: "var(--colour-error-700)", icon: "warn" },
  };
  const t = tones[tone] || tones.info;
  const paths = {
    info: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></>,
    check: <><circle cx="12" cy="12" r="10" /><polyline points="8 12 11 15 16 9" /></>,
    warn: <><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>,
  };
  return (
    <div role="alert" style={{
      display: "flex", gap: 12, padding: "12px 14px",
      background: t.bg, border: `1px solid ${t.bd}`, borderRadius: "var(--radius-md)",
      color: "var(--text-body)", ...style,
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.fg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
        {paths[t.icon]}
      </svg>
      <div style={{ flex: 1 }}>
        {title && <div style={{ fontFamily: "var(--font-bold)", fontWeight: 700, fontSize: "var(--body-medium-size)", color: t.fg, marginBottom: children ? 2 : 0 }}>{title}</div>}
        {children && <div style={{ fontFamily: "var(--font-normal)", fontSize: "var(--body-medium-size)", color: "var(--text-subtitle)" }}>{children}</div>}
      </div>
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Dismiss" style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--icon-secondary)", padding: 0, height: 20 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      )}
    </div>
  );
}
