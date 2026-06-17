import React from "react";

/**
 * Sandhata Button — the primary interactive control.
 * Hierarchies map to the Figma button set: primary (royal blue),
 * secondary (tinted), tertiary (ghost), inverse (dark) and danger (red).
 */
export function Button({
  children,
  hierarchy = "primary",
  size = "medium",
  iconLeft = null,
  iconRight = null,
  fullWidth = false,
  disabled = false,
  type = "button",
  style = {},
  ...rest
}) {
  const sizes = {
    small:  { height: 32, padding: "0 12px", font: "var(--body-small-size)", gap: 6 },
    medium: { height: 40, padding: "0 16px", font: "var(--body-medium-size)", gap: 8 },
    large:  { height: 48, padding: "0 24px", font: "var(--body-large-size)", gap: 8 },
  };

  const palettes = {
    primary: {
      "--bg": "var(--colour-primaryblue-500)",
      "--bg-hover": "var(--colour-primaryblue-700)",
      "--fg": "var(--colour-neutral-0)",
      "--bd": "transparent",
    },
    secondary: {
      "--bg": "var(--colour-primaryblue-50)",
      "--bg-hover": "var(--colour-primaryblue-100)",
      "--fg": "var(--colour-primaryblue-600)",
      "--bd": "transparent",
    },
    tertiary: {
      "--bg": "transparent",
      "--bg-hover": "var(--colour-neutral-100)",
      "--fg": "var(--colour-neutral-800)",
      "--bd": "var(--colour-neutral-300)",
    },
    inverse: {
      "--bg": "var(--colour-neutral-900)",
      "--bg-hover": "var(--colour-neutral-700)",
      "--fg": "var(--colour-neutral-0)",
      "--bd": "transparent",
    },
    danger: {
      "--bg": "var(--colour-error-500)",
      "--bg-hover": "var(--colour-error-700)",
      "--fg": "var(--colour-neutral-0)",
      "--bd": "transparent",
    },
    ghost: {
      "--bg": "transparent",
      "--bg-hover": "var(--colour-neutral-100)",
      "--fg": "var(--colour-primaryblue-600)",
      "--bd": "transparent",
    },
  };

  const s = sizes[size] || sizes.medium;
  const p = palettes[hierarchy] || palettes.primary;

  return (
    <button
      type={type}
      disabled={disabled}
      style={{
        ...p,
        display: fullWidth ? "flex" : "inline-flex",
        width: fullWidth ? "100%" : "auto",
        alignItems: "center",
        justifyContent: "center",
        gap: s.gap,
        height: s.height,
        padding: s.padding,
        fontFamily: "var(--font-normal)",
        fontSize: s.font,
        lineHeight: 1,
        fontWeight: 400,
        color: "var(--fg)",
        background: "var(--bg)",
        border: "1px solid var(--bd)",
        borderRadius: "var(--radius-md)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        transition: "background var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast)",
        whiteSpace: "nowrap",
        ...style,
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = "var(--bg-hover)"; }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.background = "var(--bg)"; }}
      {...rest}
    >
      {iconLeft && <span style={{ display: "inline-flex", flexShrink: 0 }}>{iconLeft}</span>}
      {children}
      {iconRight && <span style={{ display: "inline-flex", flexShrink: 0 }}>{iconRight}</span>}
    </button>
  );
}
