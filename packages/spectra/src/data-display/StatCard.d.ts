/** KPI tile with label, value and optional trend indicator. */
export interface StatCardProps {
  label: string;
  value: React.ReactNode;
  /** Trend text, e.g. "5.2% this month". */
  trend?: string;
  trendDirection?: "up" | "down";
}
export function StatCard(props: StatCardProps): JSX.Element;
