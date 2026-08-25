import React from "react";

const DotsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
  </svg>
);
const ChevIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/**
 * Menu — a trigger button that opens a dropdown option list. Follows the
 * WAI-ARIA menu-button pattern (`aria-haspopup`, `aria-expanded`,
 * `role="menu"`/`role="menuitem"`), closes on outside click and Escape.
 * Pass `dropdown={false}` to render a plain nav link with no chevron/panel
 * (for horizontal-nav-bar layouts).
 */
export function Menu({ label = "Menu", icon = true, dropdown = true, options = [], onSelect, style = {} }) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (option) => {
    setOpen(false);
    onSelect && onSelect(option);
  };

  if (!dropdown) {
    return (
      <a href="#" style={{
        display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 12px",
        borderRadius: "var(--radius-sm)", color: "var(--colour-neutral-900)",
        fontFamily: "var(--font-normal)", fontSize: "var(--body-medium-size)", textDecoration: "none",
        ...style,
      }}>
        {icon && <span style={{ display: "inline-flex", color: "var(--colour-primaryblue-500)" }}><DotsIcon /></span>}
        {label}
      </a>
    );
  }

  return (
    <div ref={rootRef} style={{ position: "relative", display: "inline-block", ...style }}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 12px",
          border: "1px solid var(--colour-neutral-300)", borderRadius: "var(--radius-sm)",
          background: "var(--colour-neutral-0)", color: "var(--colour-neutral-900)",
          fontFamily: "var(--font-normal)", fontSize: "var(--body-medium-size)", cursor: "pointer",
        }}
      >
        {icon && <span style={{ display: "inline-flex", color: "var(--colour-primaryblue-500)" }}><DotsIcon /></span>}
        {label}
        <span style={{ display: "inline-flex", color: "var(--colour-neutral-800)", transform: open ? "rotate(180deg)" : "none", transition: "transform var(--duration-fast-02)" }}>
          <ChevIcon />
        </span>
      </button>

      {open && (
        <div role="menu" style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, minWidth: 180, zIndex: 100,
          background: "var(--colour-neutral-0)", border: "1px solid var(--colour-neutral-300)",
          borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-md)", padding: 4,
        }}>
          {options.map((option, i) => (
            <button
              key={option + i}
              role="menuitem"
              type="button"
              onClick={() => choose(option)}
              style={{
                width: "100%", textAlign: "left", padding: "8px 10px", border: "none",
                background: "transparent", borderRadius: "var(--radius-sm)", cursor: "pointer",
                color: "var(--colour-neutral-900)", fontFamily: "var(--font-normal)", fontSize: "var(--body-medium-size)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--colour-primaryblue-50)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
