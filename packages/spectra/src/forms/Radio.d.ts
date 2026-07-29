import * as React from "react";

/** Radio button with label. Share a `name` across a group. */
export interface RadioProps {
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  name?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}
export function Radio(props: RadioProps): JSX.Element;
