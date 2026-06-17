import React from "react";

/**
 * Sandhata IconButton — a square button holding a single icon.
 * Same hierarchies as Button. Sizes keep a 40px hit target by default.
 */
export function IconButton({
  icon,
  hierarchy = "tertiary",
  size = "medium",
  disabled = false,
  ariaLabel,
  style = {},
  ...rest
}) {
  const dims = { small: 32, medium: 40, large: 48 };
  const palettes = {
    primary:   { bg: "var(--colour-primaryblue-500)", hover: "var(--colour-primaryblue-700)", fg: "var(--colour-neutral-0)", bd: "transparent" },
    secondary: { bg: "var(--colour-primaryblue-50)", hover: "var(--colour-primaryblue-100)", fg: "var(--colour-primaryblue-600)", bd: "transparent" },
    tertiary:  { bg: "transparent", hover: "var(--colour-neutral-100)", fg: "var(--colour-neutral-700)", bd: "var(--colour-neutral-300)" },
    ghost:     { bg: "transparent", hover: "var(--colour-neutral-100)", fg: "var(--colour-neutral-700)", bd: "transparent" },
    danger:    { bg: "transparent", hover: "var(--colour-error-50)", fg: "var(--colour-error-500)", bd: "transparent" },
  };
  const d = dims[size] || 40;
  const p = palettes[hierarchy] || palettes.tertiary;

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: d,
        height: d,
        color: p.fg,
        background: p.bg,
        border: `1px solid ${p.bd}`,
        borderRadius: "var(--radius-md)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        transition: "background var(--duration-fast) var(--ease-standard)",
        ...style,
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = p.hover; }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.background = p.bg; }}
      {...rest}
    >
      {icon}
    </button>
  );
}
