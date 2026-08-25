# Alert

Inline alert / banner with tone-based colour and icon. Pass `onClose` for a
dismissible banner.

## Props

| Prop | Type | Notes |
|---|---|---|
| `tone` | `"info" \| "success" \| "warning" \| "error"` | |
| `title` | node | Bold heading |
| `onClose` | func | Renders a dismiss button — **Alert only shows a working close button when you pass this** |

## Do / Don't

- **Don't** expect a close button to appear without `onClose` — it's the
  callback that both renders the button and handles the dismissal; there's
  no separate `dismissible` boolean.

## Example

```jsx
import { Alert } from "@sandhata/spectra";

<Alert tone="success" title="Saved">Your changes were saved successfully.</Alert>
<Alert tone="warning" title="Heads up" onClose={() => setShow(false)}>Your trial ends in 3 days.</Alert>
```
