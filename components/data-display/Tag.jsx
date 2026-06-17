import React from "react";

/** Tag / chip — a removable label. Pass `onRemove` to show the × button. */
export function Tag({ children, onRemove, tone = "neutral", style = {} }) {
  const tones = {
    neutral: { bg: "var(--colour-neutral-100)", fg: "var(--colour-neutral-800)", bd: "var(--colour-neutral-200)" },
    action:  { bg: "var(--colour-primaryblue-50)", fg: "var(--colour-primaryblue-700)", bd: "var(--colour-primaryblue-100)" },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      height: 26, padding: onRemove ? "0 6px 0 10px" : "0 10px",
      borderRadius: "var(--radius-sm)", background: t.bg, color: t.fg,
      border: `1px solid ${t.bd}`,
      fontFamily: "var(--font-normal)", fontSize: "var(--body-small-size)", lineHeight: 1,
      ...style,
    }}>
      {children}
      {onRemove && (
        <button type="button" onClick={onRemove} aria-label="Remove" style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 16, height: 16, padding: 0, border: "none", background: "transparent",
          color: "inherit", cursor: "pointer", borderRadius: "var(--radius-xs)", opacity: 0.7,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      )}
    </span>
  );
}
