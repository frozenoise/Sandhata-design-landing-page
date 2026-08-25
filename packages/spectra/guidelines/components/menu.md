# Menu

A bordered dropdown-trigger button — icon, label, chevron — that opens a
panel of options below it. A trigger for a small options panel, **not**
sidebar navigation — see `sidebar.md` for primary, multi-level navigation.

## Props

| Prop | Type | Notes |
|---|---|---|
| `label` | string | Trigger text. Default `"Menu"` |
| `icon` | boolean | Show the leading icon. Default `true` |
| `dropdown` | boolean | Whether the trigger opens a panel at all — `false` renders a plain nav link with no chevron, for a horizontal-nav-bar layout. Default `true` |
| `options` | `string[]` | Option labels rendered in the dropdown panel |
| `onSelect` | `(option: string) => void` | Called when an option row is chosen |

## Anatomy

Icon (14px) → label → chevron (rotates 180° open) → dropdown panel (bordered,
anchored below trigger) → option rows.

## Accessibility

Follows the WAI-ARIA menu-button pattern: `aria-haspopup`, `aria-expanded` on
the trigger, `role="menu"`/`role="menuitem"` on the panel/rows. Closes on
outside click and on Escape.

## Do / Don't

- **Do** use Menu for a secondary or nested navigation menu with a handful of
  options — a page-level "more actions" trigger, a filter, or a sub-section
  switcher.
- **Don't** use Menu as a replacement for `Sidebar`'s primary navigation —
  it's a single dropdown trigger with an option list, not a multi-level nav
  tree.

## Example

```jsx
import { Menu } from "@sandhata/spectra";

<Menu label="Actions" options={["Edit", "Duplicate", "Delete"]} onSelect={(option) => handle(option)} />
```
