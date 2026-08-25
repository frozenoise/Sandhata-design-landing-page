# Button

Triggers actions or events. The primary interactive control — used across
forms, dialogs, and navigation flows.

## Props

| Prop | Type | Notes |
|---|---|---|
| `hierarchy` | `"primary" \| "secondary" \| "tertiary" \| "ghost" \| "danger" \| "inverse"` | Default `"primary"` |
| `size` | `"small" \| "medium" \| "large"` | Default `"medium"` |
| `iconLeft` | node | Rendered before the label |
| `iconRight` | node | Rendered after the label |
| `fullWidth` | boolean | Stretch to fill the container width |
| `disabled` | boolean | |

## Anatomy

Container (background + shape) → optional left icon → label → optional right
icon.

## Hierarchy

- **Primary** — the one main action per screen.
- **Secondary** — supporting actions.
- **Tertiary** — low-emphasis actions, outlined.
- **Ghost** — minimal, no background or border.
- **Danger** — destructive actions (delete, remove). Solid red background,
  white text.
- **Inverse** — dark background, for use on light/coloured surfaces.

## Accessibility

- Enter and Space activate a focused button.
- Disabled buttons are removed from the tab order.
- Renders a native `<button>` — role and disabled state are exposed to
  assistive tech automatically, no extra ARIA needed.

## Do / Don't

- **Do** use Primary for the one main action per screen.
- **Don't** use multiple Primary buttons in the same view — it dilutes the
  hierarchy. Pair one Primary with a Secondary or Tertiary instead.

## Example

```jsx
import { Button } from "@sandhata/spectra";

<Button hierarchy="primary" iconLeft={<Plus />}>Add item</Button>
<Button hierarchy="danger">Delete</Button>
```
