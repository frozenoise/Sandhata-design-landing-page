import React from "react";
import { Checkbox } from "../forms/Checkbox.jsx";

function SortIcon({ direction, active }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ color: active ? "var(--colour-primaryblue-500)" : "var(--colour-neutral-800)", flexShrink: 0 }}>
      {direction === "desc"
        ? <polyline points="6 9 12 15 18 9" />
        : <polyline points="18 15 12 9 6 15" />}
    </svg>
  );
}

/**
 * Table — a sortable data table with optional row selection and striping.
 * `columns`: `{ key, label, sortable?, secondary? }[]`. `rows`: plain
 * objects read via `row[column.key]`, plus an `id` field when `selectable`.
 */
export function Table({
  columns = [],
  rows = [],
  sortKey,
  sortDirection = "asc",
  onSort,
  striped = false,
  selectable = false,
  selectedIds = [],
  onSelectRow,
  onSelectAll,
  emptyState = "No rows to display",
  style = {},
}) {
  const [hoverRow, setHoverRow] = React.useState(null);
  const selectedSet = new Set(selectedIds);
  const allSelected = rows.length > 0 && rows.every((r) => selectedSet.has(r.id));

  return (
    <div style={{ overflowX: "auto", border: "1px solid var(--colour-neutral-300)", borderRadius: "var(--radius-md)", ...style }}>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--colour-neutral-50)" }}>
        <thead style={{ background: "var(--colour-neutral-0)" }}>
          <tr>
            {selectable && (
              <th style={{ width: 40, padding: "10px 12px", borderBottom: "2px solid var(--colour-neutral-500)" }}>
                <Checkbox checked={allSelected} onChange={(e) => onSelectAll && onSelectAll(e.target.checked)} />
              </th>
            )}
            {columns.map((col) => {
              const active = col.key === sortKey;
              return (
                <th
                  key={col.key}
                  onClick={() => col.sortable && onSort && onSort(col.key)}
                  style={{
                    padding: "10px 12px", textAlign: "left", borderBottom: "2px solid var(--colour-neutral-500)",
                    color: "var(--colour-neutral-900)", fontFamily: "var(--font-bold)", fontWeight: 700,
                    fontSize: "var(--body-small-size)", cursor: col.sortable ? "pointer" : "default", userSelect: "none",
                  }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    {col.label}
                    {col.sortable && <SortIcon direction={active ? sortDirection : "asc"} active={active} />}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} style={{ padding: "32px 12px", textAlign: "center", color: "var(--colour-neutral-800)", fontFamily: "var(--font-normal)", fontSize: "var(--body-medium-size)" }}>
                {emptyState}
              </td>
            </tr>
          )}
          {rows.map((row, i) => {
            const selected = selectedSet.has(row.id);
            const hovered = hoverRow === row.id;
            const rowBg = selected || hovered ? "var(--colour-neutral-200)" : striped && i % 2 === 1 ? "var(--colour-neutral-0)" : "transparent";
            return (
              <tr
                key={row.id ?? i}
                onMouseEnter={() => setHoverRow(row.id)}
                onMouseLeave={() => setHoverRow(null)}
                style={{ background: rowBg, transition: "background var(--duration-fast-02)" }}
              >
                {selectable && (
                  <td style={{ width: 40, padding: "10px 12px", borderBottom: "1px solid var(--colour-neutral-300)" }}>
                    <Checkbox checked={selected} onChange={(e) => onSelectRow && onSelectRow(row.id, e.target.checked)} />
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{
                      padding: "10px 12px", borderBottom: "1px solid var(--colour-neutral-300)",
                      color: col.secondary ? "var(--colour-neutral-800)" : "var(--colour-neutral-900)",
                      fontFamily: "var(--font-normal)", fontSize: "var(--body-medium-size)",
                    }}
                  >
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
