import * as React from "react";

/** Small status pill. */
export interface BadgeProps {
  tone?: "neutral" | "info" | "success" | "warning" | "error" | "action" | "highlight";
  variant?: "subtle" | "solid";
  /** Show a leading status dot. */
  dot?: boolean;
  children?: React.ReactNode;
}
export function Badge(props: BadgeProps): JSX.Element;
