import React from "react";

/**
 * StatCard — a KPI tile: label, large value and an optional trend.
 * Used across the Sandhata dashboard (e.g. Desktop / Mobile visitors).
 */
export function StatCard({ label, value, trend, trendDirection = "up", style = {} }) {
  const up = trendDirection === "up";
  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 6,
      padding: 20, minWidth: 140,
      background: "var(--surface-raised)", border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-lg)", ...style,
    }}>
      <span style={{ fontFamily: "var(--font-light)", fontWeight: 300, fontSize: "var(--body-medium-size)", color: "var(--text-caption)" }}>{label}</span>
      <span style={{ fontFamily: "var(--font-bold)", fontWeight: 700, fontSize: "var(--display-small-size)", lineHeight: 1.1, color: "var(--text-title)" }}>{value}</span>
      {trend && (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "var(--font-normal)", fontSize: "var(--body-small-size)", color: up ? "var(--text-success)" : "var(--text-error)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: up ? "none" : "scaleY(-1)" }}>
            <polyline points="3 17 9 11 13 15 21 7" /><polyline points="14 7 21 7 21 14" />
          </svg>
          {trend}
        </span>
      )}
    </div>
  );
}
