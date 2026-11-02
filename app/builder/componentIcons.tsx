import * as React from "react";

// Small glyphs for the visual editor's Insert grid, Layers tree and
// Properties header: one per component type the renderer supports. Same
// 24-unit, 2px-stroke style as the other builder icons in page.tsx, drawn
// at 14px. Unknown types fall back to a plain square.

const P: Record<string, React.ReactNode> = {
  Stack:     <><rect x="4" y="4" width="16" height="5" rx="1.5"/><rect x="4" y="15" width="16" height="5" rx="1.5"/></>,
  Row:       <><rect x="4" y="4" width="5" height="16" rx="1.5"/><rect x="15" y="4" width="5" height="16" rx="1.5"/></>,
  Grid:      <><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></>,
  Box:       <rect x="4" y="4" width="16" height="16" rx="2"/>,
  Divider:   <><line x1="3" y1="12" x2="21" y2="12"/><path d="M8 7h8M8 17h8" strokeOpacity="0.4"/></>,
  Spacer:    <><path d="M12 4v16M8 7l4-3 4 3M8 17l4 3 4-3"/></>,
  Heading:   <><path d="M6 4v16M18 4v16M6 12h12"/></>,
  Text:      <><path d="M5 6h14M12 6v13M9 19h6"/></>,
  Button:    <><rect x="3" y="7" width="18" height="10" rx="5"/><line x1="9" y1="12" x2="15" y2="12"/></>,
  IconButton:<><circle cx="12" cy="12" r="8"/><path d="M12 9v6M9 12h6"/></>,
  Input:     <><rect x="3" y="7" width="18" height="10" rx="2"/><line x1="7" y1="10" x2="7" y2="14"/></>,
  Textarea:  <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h10M7 13h6M15 17l2-2"/></>,
  Select:    <><rect x="3" y="7" width="18" height="10" rx="2"/><polyline points="14 11 16 13 18 11"/></>,
  Switch:    <><rect x="3" y="7" width="18" height="10" rx="5"/><circle cx="16" cy="12" r="2.5"/></>,
  Checkbox:  <><rect x="4" y="4" width="16" height="16" rx="3"/><polyline points="8 12 11 15 16 9"/></>,
  Radio:     <><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></>,
  Card:      <><rect x="3" y="5" width="18" height="14" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></>,
  StatCard:  <><rect x="3" y="5" width="18" height="14" rx="2"/><polyline points="7 15 10 12 13 14 17 9"/></>,
  Badge:     <><rect x="4" y="8" width="16" height="8" rx="4"/></>,
  Tag:       <><path d="M3 12V4h8l9 9-8 8-9-9z"/><circle cx="7.5" cy="8.5" r="1"/></>,
  Avatar:    <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="10" r="3"/><path d="M6.5 18.5a6.5 6.5 0 0111 0"/></>,
  Tabs:      <><path d="M3 9h6V5h6v4h6v10H3z"/></>,
  Alert:     <><path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
  Spinner:   <><path d="M12 3a9 9 0 109 9"/></>,
  Tooltip:   <><path d="M4 5h16v10h-7l-4 4v-4H4z"/></>,
};

export function ComponentIcon({ type, size = 14 }: { type: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {P[type] ?? <rect x="5" y="5" width="14" height="14" rx="2"/>}
    </svg>
  );
}
