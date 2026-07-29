import React from "react";

/**
 * Tooltip — dark label on hover/focus. Wraps its child trigger.
 * `side` controls placement. Matches the Figma dark tooltip chip.
 */
export function Tooltip({ label, side = "top", children, style = {} }) {
  const [open, setOpen] = React.useState(false);
  const pos = {
    top:    { bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" },
    bottom: { top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" },
    left:   { right: "calc(100% + 8px)", top: "50%", transform: "translateY(-50%)" },
    right:  { left: "calc(100% + 8px)", top: "50%", transform: "translateY(-50%)" },
  };
  return (
    <span
      style={{ position: "relative", display: "inline-flex", ...style }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && (
        <span role="tooltip" style={{
          position: "absolute", zIndex: 50, whiteSpace: "nowrap",
          ...pos[side],
          padding: "6px 10px", borderRadius: "var(--radius-sm)",
          background: "var(--colour-neutral-900)", color: "var(--colour-neutral-0)",
          fontFamily: "var(--font-normal)", fontSize: "var(--body-small-size)", lineHeight: 1.3,
          boxShadow: "var(--shadow-md)", pointerEvents: "none",
        }}>{label}</span>
      )}
    </span>
  );
}
