# Drawer

A panel anchored to a screen edge — used for detail views, filter panels, and
secondary content. Renders nothing when `open` is `false`.

## Props

| Prop | Type | Notes |
|---|---|---|
| `open` | boolean | |
| `onClose` | func | |
| `align` | `"top" \| "bottom" \| "left" \| "right"` | Default `"right"` |
| `title` | node | |
| `children` | node | |
| `footer` | node | Right-aligned action row |

## Anatomy

Full-screen dimming overlay → panel anchored to `align` edge → drag handle
(left/right drawers only) → header (title + close button) → scrollable body
→ optional footer.

## Do / Don't

- **Do** use bottom or right alignment for detail views that supplement the
  main content — the user should be able to see both simultaneously.
- **Don't** use Drawer as a navigation panel — use `Sidebar` for that. Drawer
  is for contextual detail and secondary content that co-exists with the main
  view, not primary navigation.

## Example

```jsx
import { Drawer } from "@sandhata/spectra";

<Drawer open={open} onClose={() => setOpen(false)} title="Filters">
  Drawer body content goes here.
</Drawer>
```
