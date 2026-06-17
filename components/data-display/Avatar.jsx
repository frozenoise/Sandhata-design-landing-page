import React from "react";

/** Avatar — circular user marker. Shows `src` image or `name` initials. */
export function Avatar({ name = "", src, size = 36, tone = "action", style = {} }) {
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const tones = {
    action: { bg: "var(--colour-primaryblue-100)", fg: "var(--colour-primaryblue-700)" },
    purple: { bg: "var(--colour-alternativepurple-100)", fg: "var(--colour-alternativepurple-600)" },
    neutral:{ bg: "var(--colour-neutral-200)", fg: "var(--colour-neutral-700)" },
  };
  const t = tones[tone] || tones.action;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: size, height: size, borderRadius: "var(--radius-pill)", overflow: "hidden",
      background: t.bg, color: t.fg, flexShrink: 0,
      fontFamily: "var(--font-bold)", fontWeight: 700, fontSize: size * 0.36,
      ...style,
    }}>
      {src ? <img src={src} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials}
    </span>
  );
}
