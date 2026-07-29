import React from "react";

/** Native select styled to match Sandhata fields, with chevron + label. */
export function Select({
  label, helper, error, options = [], value, onChange, placeholder = "Select…",
  size = "medium", disabled = false, id, style = {}, ...rest
}) {
  const heights = { small: 32, medium: 40, large: 48 };
  const h = heights[size] || 40;
  const fieldId = id || (label ? `sd-sel-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
  const borderColor = error ? "var(--border-error)" : "var(--border-default)";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%", ...style }}>
      {label && (
        <label htmlFor={fieldId} style={{
          fontFamily: "var(--font-normal)", fontSize: "var(--label-size)",
          letterSpacing: "var(--label-tracking)", fontWeight: 700, color: "var(--text-subtitle)",
        }}>{label}</label>
      )}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <select
          id={fieldId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          style={{
            width: "100%", height: h, padding: "0 36px 0 12px", appearance: "none",
            fontFamily: "var(--font-normal)", fontSize: "var(--body-medium-size)",
            color: value ? "var(--text-body)" : "var(--text-caption)",
            background: disabled ? "var(--surface-disabled)" : "var(--field-02)",
            border: `1px solid ${borderColor}`, borderRadius: "var(--radius-sm)",
            outline: "none", cursor: disabled ? "not-allowed" : "pointer", boxSizing: "border-box",
          }}
          {...rest}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((o) => {
            const opt = typeof o === "string" ? { value: o, label: o } : o;
            return <option key={opt.value} value={opt.value}>{opt.label}</option>;
          })}
        </select>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ position: "absolute", right: 10, color: "var(--icon-secondary)", pointerEvents: "none" }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      {(helper || error) && (
        <span style={{
          fontFamily: "var(--font-normal)", fontSize: "var(--helper-size)",
          lineHeight: "var(--helper-line)", letterSpacing: "var(--helper-tracking)",
          color: error ? "var(--text-error)" : "var(--text-caption)",
        }}>{error || helper}</span>
      )}
    </div>
  );
}
