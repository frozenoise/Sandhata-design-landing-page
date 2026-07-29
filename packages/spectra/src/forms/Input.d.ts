import * as React from "react";

/**
 * Text input field with built-in label, helper text and error state.
 *
 * @startingPoint section="Forms" subtitle="Labelled text field" viewport="360x90"
 */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Field label rendered above the control. */
  label?: string;
  /** Helper / instruction text below the control. */
  helper?: string;
  /** Error message — turns the border red and replaces the helper. */
  error?: string;
  /** Show a required asterisk next to the label. */
  required?: boolean;
  size?: "small" | "medium" | "large";
  /** Icon node pinned to the right edge (e.g. calendar, copy). */
  iconRight?: React.ReactNode;
  disabled?: boolean;
}

export function Input(props: InputProps): JSX.Element;
