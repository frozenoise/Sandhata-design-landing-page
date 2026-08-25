# Modal

A centred dialog over a page-dimming overlay. Renders nothing when `open` is
`false`.

## Props

| Prop | Type | Notes |
|---|---|---|
| `open` | boolean | |
| `onClose` | func | |
| `label` | node | Small uppercase kicker above the title, e.g. `"CONFIRM"` |
| `title` | node | |
| `children` | node | |
| `footer` | node | Right-aligned action row, typically one or two `Button`s |
| `danger` | boolean | Destructive-confirmation styling — red top accent border. Default `false` |
| `size` | `"small" \| "medium" \| "large"` | Default `"medium"` |

## Anatomy

Full-screen dimming overlay → centred panel (top accent border when `danger`)
→ header (optional kicker label + title + close button) → scrollable body →
optional footer.

## Do / Don't

- **Do** set `danger` for destructive confirmations (delete, remove,
  irreversible actions) — it adds the red top accent that signals stakes.
- **Don't** use Modal for a lightweight, dismissible message — use `Alert`
  for that. Modal blocks the whole page and should be reserved for things
  that genuinely need the user's full attention before continuing.

## Example

```jsx
import { Modal, Button } from "@sandhata/spectra";

<Modal open={open} onClose={() => setOpen(false)} label="Confirm" title="Delete item" danger
  footer={<Button hierarchy="danger">Delete</Button>}>
  Are you sure you want to delete this item?
</Modal>
```
