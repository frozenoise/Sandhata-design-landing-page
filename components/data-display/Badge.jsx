import React from "react";

/**
 * Status Badge — small status pill. Tones map to the semantic palette.
 * `variant="subtle"` (default) uses a tinted background; "solid" fills.
 */
export function Badge({ children, tone = "neutral", variant = "subtle", dot = false, style = {} }) {
  const tones = {
    neutral: { subtleBg: "var(--colour-neutral-100)", subtleFg: "var(--colour-neutral-700)", solidBg: "var(--colour-neutral-700)" },
    info:    { subtleBg: "var(--colour-info-50)", subtleFg: "var(--colour-info-700)", solidBg: "var(--colour-info-500)" },
    success: { subtleBg: "var(--colour-success-50)", subtleFg: "var(--colour-success-700)", solidBg: "var(--colour-success-500)" },
    warning: { subtleBg: "var(--colour-alert-50)", subtleFg: "var(--colour-alert-700)", solidBg: "var(--colour-alert-500)" },
    error:   { subtleBg: "var(--colour-error-50)", subtleFg: "var(--colour-error-700)", solidBg: "var(--colour-error-500)" },
    action:  { subtleBg: "var(--colour-primaryblue-50)", subtleFg: "var(--colour-primaryblue-600)", solidBg: "var(--colour-primaryblue-500)" },
    highlight:{ subtleBg: "var(--colour-alternativepurple-50)", subtleFg: "var(--colour-alternativepurple-600)", solidBg: "var(--colour-alternativepurple-500)" },
  };
  const t = tones[tone] || tones.neutral;
  const solid = variant === "solid";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      height: 22, padding: "0 8px", borderRadius: "var(--radius-pill)",
      fontFamily: "var(--font-normal)", fontSize: "var(--caption-size)", lineHeight: 1,
      letterSpacing: "var(--caption-tracking)",
      background: solid ? t.solidBg : t.subtleBg,
      color: solid ? "var(--colour-neutral-0)" : t.subtleFg,
      ...style,
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: solid ? "var(--colour-neutral-0)" : t.solidBg }} />}
      {children}
    </span>
  );
}
