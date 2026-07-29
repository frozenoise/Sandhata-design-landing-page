import React from "react";

/** Checkbox with label. Supports checked / indeterminate / disabled. */
export function Checkbox({ label, checked = false, indeterminate = false, disabled = false, onChange, style = {}, ...rest }) {
  const active = checked || indeterminate;
  return (
    <label style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, ...style,
    }}>
      <span style={{
        position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 18, height: 18, flexShrink: 0,
        background: active ? "var(--colour-primaryblue-500)" : "var(--field-02)",
        border: `1px solid ${active ? "var(--colour-primaryblue-500)" : "var(--border-default)"}`,
        borderRadius: "var(--radius-xs)", transition: "all var(--duration-fast)",
      }}>
        <input type="checkbox" checked={checked} disabled={disabled} onChange={onChange}
          style={{ position: "absolute", inset: 0, opacity: 0, margin: 0, cursor: "inherit" }} {...rest} />
        {indeterminate ? (
          <svg width="12" height="12" viewBox="0 0 24 24" stroke="white" strokeWidth="3" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
        ) : checked ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        ) : null}
      </span>
      {label && <span style={{ fontFamily: "var(--font-normal)", fontSize: "var(--body-medium-size)", color: "var(--text-body)" }}>{label}</span>}
    </label>
  );
}
