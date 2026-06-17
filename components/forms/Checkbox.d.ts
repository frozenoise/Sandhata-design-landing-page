import * as React from "react";

/** Checkbox with label; supports indeterminate. */
export interface CheckboxProps {
  label?: string;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}
export function Checkbox(props: CheckboxProps): JSX.Element;
