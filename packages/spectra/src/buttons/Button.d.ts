import * as React from "react";

/**
 * Sandhata primary button. Five hierarchies, three sizes, optional icons.
 *
 * @startingPoint section="Buttons" subtitle="Primary action control" viewport="320x80"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual hierarchy. @default "primary" */
  hierarchy?: "primary" | "secondary" | "tertiary" | "inverse" | "danger" | "ghost";
  /** Control size. @default "medium" */
  size?: "small" | "medium" | "large";
  /** Icon node rendered before the label. */
  iconLeft?: React.ReactNode;
  /** Icon node rendered after the label. */
  iconRight?: React.ReactNode;
  /** Stretch to fill the container width. @default false */
  fullWidth?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function Button(props: ButtonProps): JSX.Element;
