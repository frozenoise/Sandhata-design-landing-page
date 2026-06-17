import React from "react";

/** Spinner — indeterminate loading indicator in brand blue. */
export function Spinner({ size = 20, stroke = 2.5, color = "var(--colour-primaryblue-500)", style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ animation: "sd-spin 0.7s linear infinite", ...style }}>
      <style>{`@keyframes sd-spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="12" cy="12" r="9" fill="none" stroke="var(--colour-neutral-200)" strokeWidth={stroke} />
      <path d="M12 3 a9 9 0 0 1 9 9" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
    </svg>
  );
}
