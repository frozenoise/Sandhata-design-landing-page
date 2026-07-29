import React from "react";

/** Radio button with label. Group several with a shared `name`. */
export function Radio({ label, checked = false, disabled = false, name, value, onChange, style = {}, ...rest }) {
  return (
    <label style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, ...style,
    }}>
      <span style={{
        position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 18, height: 18, flexShrink: 0, borderRadius: "var(--radius-pill)",
        background: "var(--field-02)",
        border: `1px solid ${checked ? "var(--colour-primaryblue-500)" : "var(--border-default)"}`,
        transition: "all var(--duration-fast)",
      }}>
        <input type="radio" name={name} value={value} checked={checked} disabled={disabled} onChange={onChange}
          style={{ position: "absolute", inset: 0, opacity: 0, margin: 0, cursor: "inherit" }} {...rest} />
        {checked && <span style={{ width: 8, height: 8, borderRadius: "var(--radius-pill)", background: "var(--colour-primaryblue-500)" }} />}
      </span>
      {label && <span style={{ fontFamily: "var(--font-normal)", fontSize: "var(--body-medium-size)", color: "var(--text-body)" }}>{label}</span>}
    </label>
  );
}
