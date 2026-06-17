import * as React from "react";

/** Dark tooltip shown on hover/focus of its child trigger. */
export interface TooltipProps {
  label: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
}
export function Tooltip(props: TooltipProps): JSX.Element;
