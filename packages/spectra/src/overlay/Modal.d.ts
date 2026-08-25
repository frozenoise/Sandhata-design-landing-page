import * as React from "react";

/** A centred dialog over a page-dimming overlay. Renders nothing when `open` is false. */
export interface ModalProps {
  open: boolean;
  onClose?: () => void;
  /** Small uppercase kicker above the title. */
  label?: React.ReactNode;
  title?: React.ReactNode;
  children?: React.ReactNode;
  /** Right-aligned action row. */
  footer?: React.ReactNode;
  /** Destructive-confirmation styling — red top accent. @default false */
  danger?: boolean;
  /** @default "medium" */
  size?: "small" | "medium" | "large";
  style?: React.CSSProperties;
}
export function Modal(props: ModalProps): JSX.Element | null;
