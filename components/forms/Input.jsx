import React from "react";

/**
 * Sandhata text Input — field with optional label, helper text, and
 * error/disabled states. Matches the Figma form-field anatomy.
 */
export function Input({
  label,
  helper,
  error,
  required = false,
  size = "medium",
  iconRight = null,
  disabled = false,
  id,
  style = {},
  ...rest
}) {
  const heights = { small: 32, medium: 40, large: 48 };
  const h = heights[size] || 40;
  const fieldId = id || (label ? `sd-input-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
  const borderColor = error ? "var(--border-error)" : "var(--border-default)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%", ...style }}>
      {label && (
        <label htmlFor={fieldId} style={{
          fontFamily: "var(--font-normal)", fontSize: "var(--label-size)",
          letterSpacing: "var(--label-tracking)", fontWeight: 700,
          color: "var(--text-subtitle)",
        }}>
          {label}{required && <span style={{ color: "var(--text-error)" }}> *</span>}
        </label>
      )}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <input
          id={fieldId}
          disabled={disabled}
          style={{
            width: "100%",
            height: h,
            padding: iconRight ? "0 36px 0 12px" : "0 12px",
            fontFamily: "var(--font-normal)",
            fontSize: "var(--body-medium-size)",
            color: "var(--text-body)",
            background: disabled ? "var(--surface-disabled)" : "var(--field-02)",
            border: `1px solid ${borderColor}`,
            borderRadius: "var(--radius-sm)",
            outline: "none",
            transition: "border-color var(--duration-fast), box-shadow var(--duration-fast)",
            cursor: disabled ? "not-allowed" : "text",
            boxSizing: "border-box",
          }}
          onFocus={(e) => {
            if (!error) e.currentTarget.style.borderColor = "var(--border-action)";
            e.currentTarget.style.boxShadow = "var(--shadow-focus)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = borderColor;
            e.currentTarget.style.boxShadow = "none";
          }}
          {...rest}
        />
        {iconRight && (
          <span style={{ position: "absolute", right: 10, display: "inline-flex", color: "var(--icon-secondary)", pointerEvents: "none" }}>
            {iconRight}
          </span>
        )}
      </div>
      {(helper || error) && (
        <span style={{
          fontFamily: "var(--font-normal)", fontSize: "var(--helper-size)",
          lineHeight: "var(--helper-line)", letterSpacing: "var(--helper-tracking)",
          color: error ? "var(--text-error)" : "var(--text-caption)",
        }}>
          {error || helper}
        </span>
      )}
    </div>
  );
}
