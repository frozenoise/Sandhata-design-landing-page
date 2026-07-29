import React from "react";

/** Multi-line text field with optional label, helper and error. */
export function Textarea({
  label, helper, error, required = false, rows = 4, disabled = false, id, style = {}, ...rest
}) {
  const fieldId = id || (label ? `sd-ta-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
  const borderColor = error ? "var(--border-error)" : "var(--border-default)";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%", ...style }}>
      {label && (
        <label htmlFor={fieldId} style={{
          fontFamily: "var(--font-normal)", fontSize: "var(--label-size)",
          letterSpacing: "var(--label-tracking)", fontWeight: 700, color: "var(--text-subtitle)",
        }}>
          {label}{required && <span style={{ color: "var(--text-error)" }}> *</span>}
        </label>
      )}
      <textarea
        id={fieldId}
        rows={rows}
        disabled={disabled}
        style={{
          width: "100%", padding: "10px 12px", resize: "vertical",
          fontFamily: "var(--font-normal)", fontSize: "var(--body-medium-size)",
          lineHeight: "var(--body-medium-line)", color: "var(--text-body)",
          background: disabled ? "var(--surface-disabled)" : "var(--field-02)",
          border: `1px solid ${borderColor}`, borderRadius: "var(--radius-sm)",
          outline: "none", boxSizing: "border-box",
          transition: "border-color var(--duration-fast), box-shadow var(--duration-fast)",
        }}
        onFocus={(e) => { if (!error) e.currentTarget.style.borderColor = "var(--border-action)"; e.currentTarget.style.boxShadow = "var(--shadow-focus)"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = borderColor; e.currentTarget.style.boxShadow = "none"; }}
        {...rest}
      />
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
