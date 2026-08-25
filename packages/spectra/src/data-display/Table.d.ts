import * as React from "react";

export interface TableColumn {
  key: string;
  label: React.ReactNode;
  sortable?: boolean;
  /** Muted/secondary text colour for this column's cells. */
  secondary?: boolean;
}

/** A sortable data table with optional row selection and striping. */
export interface TableProps {
  columns?: TableColumn[];
  /** Plain objects read via `row[column.key]`; needs an `id` field when `selectable`. */
  rows?: Record<string, any>[];
  sortKey?: string;
  /** @default "asc" */
  sortDirection?: "asc" | "desc";
  onSort?: (key: string) => void;
  /** @default false */
  striped?: boolean;
  /** @default false */
  selectable?: boolean;
  selectedIds?: Array<string | number>;
  onSelectRow?: (id: string | number, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  /** Shown when `rows` is empty. */
  emptyState?: React.ReactNode;
  style?: React.CSSProperties;
}
export function Table(props: TableProps): JSX.Element;
