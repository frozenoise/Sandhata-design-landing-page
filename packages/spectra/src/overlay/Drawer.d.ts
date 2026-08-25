import * as React from "react";

/** A panel anchored to a screen edge. Renders nothing when `open` is false. */
export interface DrawerProps {
  open: boolean;
  onClose?: () => void;
  /** Edge to anchor to. @default "right" */
  align?: "top" | "bottom" | "left" | "right";
  title?: React.ReactNode;
  children?: React.ReactNode;
  /** Right-aligned action row. */
  footer?: React.ReactNode;
  style?: React.CSSProperties;
}
export function Drawer(props: DrawerProps): JSX.Element | null;
