# Switch

Toggle switch for binary on/off settings.

## Props

| Prop | Type | Notes |
|---|---|---|
| `checked` | boolean | On/off state |
| `onChange` | func | **`(next: boolean) => void`** — receives a bare boolean, not an event. Different from `Checkbox.onChange`. |
| `label` | string | |
| `disabled` | boolean | |

## Do / Don't

- **Don't** write `onChange={(e) => setOn(e.target.checked)}` on a `Switch` —
  that's the `Checkbox` pattern. `Switch` hands you the next boolean value
  directly: `onChange={setOn}` or `onChange={(next) => setOn(next)}`.

## Example

```jsx
import { Switch } from "@sandhata/spectra";

const [dark, setDark] = useState(true);
<Switch checked={dark} onChange={setDark} label="Dark mode" />
```
