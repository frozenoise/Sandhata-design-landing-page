import * as React from "react";

/** Multi-line text field with label, helper and error states. */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helper?: string;
  error?: string;
  required?: boolean;
  rows?: number;
  disabled?: boolean;
}
export function Textarea(props: TextareaProps): JSX.Element;
