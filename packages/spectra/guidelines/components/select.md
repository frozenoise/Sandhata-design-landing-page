# Select

A styled native `<select>` with label, chevron, helper and error states.

## Props

| Prop | Type | Notes |
|---|---|---|
| `label` | string | |
| `options` | array | `string[]` or `{ value, label }[]` |
| `value` | string | Selected value |
| `onChange` | func | Passed straight to a native `<select>` — receives a `React.ChangeEvent<HTMLSelectElement>`, so read `e.target.value`, not a bare value |
| `size` | `"small" \| "medium" \| "large"` | Default `"medium"` |

## Do / Don't

- **Do** use `Select` for a short, familiar list of options (under ~10).
- **Don't** use `Select` as a substitute for `Menu` — `Select` is a form
  control that produces a value, `Menu` is an action trigger.

## Example

```jsx
import { Select } from "@sandhata/spectra";

<Select label="Country" placeholder="Select a country" options={["Canada", "France", "Japan"]} />
```
