import * as React from "react";

export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  badge?: React.ReactNode;
}
export interface SidebarGroup {
  label?: string;
  items: SidebarItem[];
}

/** A collapsible navigation rail with grouped links. */
export interface SidebarProps {
  groups?: SidebarGroup[];
  /** Id of the current route/item. */
  activeId?: string;
  /** Collapsed (icon-only rail) mode. @default false */
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  /** Expanded width in px. @default 240 */
  width?: number;
  style?: React.CSSProperties;
}
export function Sidebar(props: SidebarProps): JSX.Element;
