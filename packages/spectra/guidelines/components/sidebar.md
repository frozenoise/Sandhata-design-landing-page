# Sidebar

A collapsible navigation rail with grouped links, icons, and badges.

## Props

| Prop | Type | Notes |
|---|---|---|
| `groups` | `{ label?, items: { id, label, icon?, href?, badge? }[] }[]` | |
| `activeId` | string | Id of the current route/item |
| `collapsed` | boolean | Collapsed (icon-only rail) mode. Default `false` |
| `onCollapse` | `(collapsed: boolean) => void` | Passing this renders the collapse toggle button at the bottom of the rail |
| `width` | number | Expanded width in px, default 240 |

## Anatomy

Shell (fixed-width container) → nav group (optional uppercase label) → nav
item (icon + label + optional badge) → active indicator (blue left-border
strip on the current item) → collapse toggle at the bottom.

## Do / Don't

- **Do** group related destinations together under labelled sections — it
  reduces the cognitive load of scanning a long nav list.
- **Don't** put more than 7–8 top-level nav items in the sidebar — nest
  secondary links inside a parent item or move them to a sub-nav.
- **Don't** use Sidebar for a transient, contextual panel — use `Drawer` for
  that. Sidebar is for persistent, primary navigation.

## Example

```jsx
import { Sidebar } from "@sandhata/spectra";

<Sidebar
  activeId="dashboard"
  onCollapse={setCollapsed}
  groups={[
    { label: "Main", items: [{ id: "dashboard", label: "Dashboard", badge: 3 }, { id: "analytics", label: "Analytics" }] },
  ]}
/>
```
