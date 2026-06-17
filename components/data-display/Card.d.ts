import * as React from "react";

/**
 * Base content surface: white layer, subtle border, soft shadow.
 *
 * @startingPoint section="Surfaces" subtitle="Content card with header" viewport="420x200"
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional header title. */
  title?: React.ReactNode;
  /** Optional header subtitle (light weight). */
  subtitle?: React.ReactNode;
  /** Trailing header slot (e.g. a menu button). */
  action?: React.ReactNode;
  /** Inner padding in px. @default 24 */
  padding?: number;
  children?: React.ReactNode;
}
export function Card(props: CardProps): JSX.Element;
