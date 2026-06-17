import * as React from "react";

/** Square icon-only button. Provide an accessible `ariaLabel`. */
export interface IconButtonProps {
  /** Icon node (e.g. an <svg> or icon component). */
  icon: React.ReactNode;
  hierarchy?: "primary" | "secondary" | "tertiary" | "ghost" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  /** Accessible label, required for icon-only controls. */
  ariaLabel?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export function IconButton(props: IconButtonProps): JSX.Element;
