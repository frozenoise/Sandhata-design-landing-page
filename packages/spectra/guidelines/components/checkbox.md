# Checkbox

Checkbox with label. Supports checked, indeterminate, and disabled states.

## Props

| Prop | Type | Notes |
|---|---|---|
| `label` | string | |
| `checked` | boolean | |
| `indeterminate` | boolean | Dash state, visually distinct from checked |
| `disabled` | boolean | |
| `onChange` | func | Wraps a native `<input type="checkbox">` — receives a `React.ChangeEvent<HTMLInputElement>`. Read `e.target.checked`, **not** a bare boolean. |

## Do / Don't

- **Don't** confuse `Checkbox.onChange`'s event signature with `Switch.onChange`'s
  bare-boolean signature (see `switch.md`) — they're different, and mixing
  them up is a real, previously-made mistake in this codebase.

## Example

```jsx
import { Checkbox } from "@sandhata/spectra";

const [on, setOn] = useState(false);
<Checkbox label="Remember me" checked={on} onChange={(e) => setOn(e.target.checked)} />
```
