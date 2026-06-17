import React from "react";

/** Toggle switch. Controlled via `checked` + `onChange`. */
export function Switch({ checked = false, disabled = false, onChange, label, style = {}, ...rest }) {
  return (
    <label style={{
      display: "inline-flex", alignItems: "center", gap: 10,
      cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, ...style,
    }}>
      <span
        onClick={() => { if (!disabled && onChange) onChange(!checked); }}
        style={{
          position: "relative", width: 40, height: 22, flexShrink: 0, borderRadius: "var(--radius-pill)",
          background: checked ? "var(--colour-primaryblue-500)" : "var(--colour-neutral-300)",
          transition: "background var(--duration-base) var(--ease-standard)",
        }}>
        <span style={{
          position: "absolute", top: 2, left: checked ? 20 : 2, width: 18, height: 18,
          borderRadius: "var(--radius-pill)", background: "var(--colour-neutral-0)",
          boxShadow: "var(--shadow-sm)", transition: "left var(--duration-base) var(--ease-standard)",
        }} />
      </span>
      {label && <span style={{ fontFamily: "var(--font-normal)", fontSize: "var(--body-medium-size)", color: "var(--text-body)" }}>{label}</span>}
      <input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange && onChange(e.target.checked)} style={{ display: "none" }} {...rest} />
    </label>
  );
}
