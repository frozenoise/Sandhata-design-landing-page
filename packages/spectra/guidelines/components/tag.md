# Tag

Removable chip / label.

## Props

| Prop | Type | Notes |
|---|---|---|
| `tone` | `"neutral" \| "action"` | Default `"neutral"` |
| `onRemove` | func | Passing this renders a dismiss (×) button |

## Do / Don't

- **Don't** add a leading icon, hover state, or "selected" state — the real
  component doesn't implement any of these; if the layout needs them, that's
  a gap to flag, not something to fake with inline styles on top of `Tag`.

## Example

```jsx
import { Tag } from "@sandhata/spectra";

<Tag>Federalist</Tag>
<Tag tone="action" onRemove={() => remove(id)}>Democratic-Republican</Tag>
```
