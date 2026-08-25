# Badge

Small status pill. Tones map to the semantic palette; `subtle` is the default
look, `solid` for emphasis.

## Props

| Prop | Type | Notes |
|---|---|---|
| `tone` | `"neutral" \| "info" \| "success" \| "warning" \| "error" \| "action" \| "highlight"` | |
| `variant` | `"subtle" \| "solid"` | Default `"subtle"` |
| `dot` | boolean | Leading status dot |

## Example

```jsx
import { Badge } from "@sandhata/spectra";

<Badge tone="success" dot>Active</Badge>
<Badge tone="action" variant="solid">New</Badge>
```
