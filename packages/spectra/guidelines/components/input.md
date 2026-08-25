# Input

A labelled single-line text field with built-in helper text and error
handling — the standard Sandhata form control.

## Props

| Prop | Type | Notes |
|---|---|---|
| `label` | string | Rendered above the control |
| `helper` | string | Helper / instruction text below the field |
| `error` | string | Error message — shows red border + message, replaces `helper` when set |
| `required` | boolean | Shows a required asterisk after the label |
| `size` | `"small" \| "medium" \| "large"` | Default `"medium"` |
| `iconRight` | node | Trailing icon |
| `disabled` | boolean | |

## Anatomy

Label (+ optional required asterisk) → field (border, background, optional
trailing icon) → helper or error text.

## Do / Don't

- **Do** always pair a visible `label`, not just a `placeholder` — placeholder
  text disappears on input and isn't a substitute for a label.
- **Don't** show both `helper` and `error` at once — `error` replaces
  `helper` when present.

## Example

```jsx
import { Input } from "@sandhata/spectra";

<Input label="Email" placeholder="jane@example.com" helper="We'll never share this." />
<Input label="Email" required error="This is a mandatory field!" />
```
