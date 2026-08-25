# IconButton

A square button holding a single icon. Use for toolbars, table row actions,
and compact controls. Same five hierarchies as `Button`.

## Props

| Prop | Type | Notes |
|---|---|---|
| `icon` | node | The icon |
| `ariaLabel` | string | **Required** — IconButton has no visible label |
| `hierarchy` | `"primary" \| "secondary" \| "tertiary" \| "ghost" \| "danger"` | Default `"tertiary"` |
| `size` | `"small" \| "medium" \| "large"` | Default `"medium"`, 40px hit target |

## Do / Don't

- **Do** always pass `ariaLabel` — there's no other way for assistive tech to
  know what the button does.
- **Don't** use IconButton for a labelled primary action — use `Button` with
  `iconLeft`/`iconRight` instead so the action has a visible text label.

## Example

```jsx
import { IconButton } from "@sandhata/spectra";

<IconButton icon={<Pencil />} ariaLabel="Edit" hierarchy="tertiary" />
```
