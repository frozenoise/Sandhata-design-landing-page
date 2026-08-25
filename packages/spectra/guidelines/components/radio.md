# Radio

Radio button with label. Share a `name` across a group so only one can be
selected.

## Props

| Prop | Type | Notes |
|---|---|---|
| `label` | string | |
| `name` | string | Group name — must match across all radios in the same group |
| `value` | string | |
| `checked` | boolean | |
| `onChange` | func | Wraps a native `<input type="radio">` — receives a `React.ChangeEvent<HTMLInputElement>` |

## Example

```jsx
import { Radio } from "@sandhata/spectra";

<Radio name="plan" label="Basic" />
<Radio name="plan" label="Pro" checked />
<Radio name="plan" label="Team" />
```
