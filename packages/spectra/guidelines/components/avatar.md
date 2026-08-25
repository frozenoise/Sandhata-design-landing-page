# Avatar

Circular user marker. Shows an image (`src`) or auto-generated initials from
`name`.

## Props

| Prop | Type | Notes |
|---|---|---|
| `name` | string | Used for initials + `alt` text — pass it even when `src` is set |
| `src` | string | Image URL |
| `size` | number | Diameter in px |
| `tone` | `"action" \| "purple" \| "neutral"` | Initials-fallback background colour |

## Example

```jsx
import { Avatar } from "@sandhata/spectra";

<Avatar name="John Adams" />
<Avatar name="Thomas Jefferson" tone="purple" />
```
