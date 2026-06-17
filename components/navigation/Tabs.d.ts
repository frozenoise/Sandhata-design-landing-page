import * as React from "react";

export interface TabItem {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
}

/**
 * Underline tab bar.
 *
 * @startingPoint section="Navigation" subtitle="Underline tab bar" viewport="480x60"
 */
export interface TabsProps {
  tabs: TabItem[];
  value: string;
  onChange?: (value: string) => void;
}
export function Tabs(props: TabsProps): JSX.Element;
