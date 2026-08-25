import * as React from "react";

/**
 * A trigger button that opens a dropdown option list (WAI-ARIA menu-button
 * pattern). Pass `dropdown={false}` for a plain nav link with no panel.
 */
export interface MenuProps {
  /** Trigger text. @default "Menu" */
  label?: string;
  /** Show the leading icon. @default true */
  icon?: boolean;
  /** Whether the trigger opens a dropdown panel at all. @default true */
  dropdown?: boolean;
  /** Option labels rendered in the dropdown panel. */
  options?: string[];
  onSelect?: (option: string) => void;
  style?: React.CSSProperties;
}
export function Menu(props: MenuProps): JSX.Element;
