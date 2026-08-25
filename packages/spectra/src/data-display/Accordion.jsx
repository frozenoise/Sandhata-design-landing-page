import React from "react";

function ChevronIcon({ open }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform var(--duration-fast-02) var(--ease-standard-productive)", flexShrink: 0 }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/**
 * Accordion — a list of collapsible panels. Single-open by default;
 * pass `multiple` to allow more than one panel open at once.
 */
export function Accordion({ items = [], multiple = false, defaultOpen = [], onToggle, style = {} }) {
  const [openIds, setOpenIds] = React.useState(defaultOpen);

  const toggle = (id, disabled) => {
    if (disabled) return;
    setOpenIds((prev) => {
      const isOpen = prev.includes(id);
      const next = isOpen ? prev.filter((x) => x !== id) : multiple ? [...prev, id] : [id];
      onToggle && onToggle(id, !isOpen);
      return next;
    });
  };

  return (
    <div style={{ border: "1px solid var(--colour-neutral-200)", borderRadius: "var(--radius-md)", overflow: "hidden", ...style }}>
      {items.map((item, i) => {
        const open = openIds.includes(item.id);
        return (
          <div key={item.id} style={{ borderTop: i === 0 ? "none" : "1px solid var(--colour-neutral-200)" }}>
            <button
              type="button"
              disabled={item.disabled}
              aria-expanded={open}
              onClick={() => toggle(item.id, item.disabled)}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                padding: "14px 16px", background: "var(--colour-neutral-0)", border: "none",
                borderLeft: open ? "3px solid var(--colour-primaryblue-500)" : "3px solid transparent",
                textAlign: "left", cursor: item.disabled ? "not-allowed" : "pointer",
                color: item.disabled ? "var(--colour-neutral-300)" : "var(--colour-neutral-900)",
                fontFamily: "var(--font-bold)", fontWeight: 700, fontSize: "var(--body-medium-size)",
                transition: "background var(--duration-fast-02)",
              }}
              onMouseEnter={(e) => { if (!item.disabled) e.currentTarget.style.background = "var(--colour-neutral-50)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--colour-neutral-0)"; }}
            >
              <span>{item.title}</span>
              <span style={{ color: "var(--colour-primaryblue-500)", display: "inline-flex" }}><ChevronIcon open={open} /></span>
            </button>
            {open && (
              <div style={{ padding: "0 16px 16px", color: "var(--colour-neutral-800)", fontFamily: "var(--font-normal)", fontSize: "var(--body-medium-size)", lineHeight: 1.6 }}>
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
