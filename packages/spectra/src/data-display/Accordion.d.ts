import * as React from "react";

export interface AccordionItem {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

/** A list of collapsible panels. Single-open by default. */
export interface AccordionProps {
  items?: AccordionItem[];
  /** Allow multiple panels open at once. @default false */
  multiple?: boolean;
  /** Panel ids open on mount. */
  defaultOpen?: string[];
  onToggle?: (id: string, open: boolean) => void;
  style?: React.CSSProperties;
}
export function Accordion(props: AccordionProps): JSX.Element;
