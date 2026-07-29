import * as React from "react";

/** Inline alert / banner with tone-based colour and icon. */
export interface AlertProps {
  tone?: "info" | "success" | "warning" | "error";
  title?: React.ReactNode;
  /** Optional dismiss handler — renders a close button. */
  onClose?: () => void;
  children?: React.ReactNode;
}
export function Alert(props: AlertProps): JSX.Element;
