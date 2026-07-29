import * as React from "react";

export type SelectOption = string | { value: string; label: string };

/** Styled native select with label, chevron, helper and error. */
export interface SelectProps {
  label?: string;
  helper?: string;
  error?: string;
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}
export function Select(props: SelectProps): JSX.Element;
