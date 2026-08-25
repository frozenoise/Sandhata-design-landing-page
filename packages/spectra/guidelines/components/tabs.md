# Tabs

Underline-style tab bar — the Sandhata navigation pattern. Active tab is bold
and blue with a 2px underline.

## Props

| Prop | Type | Notes |
|---|---|---|
| `tabs` | `{ value, label, icon? }[]` | |
| `value` | string | Active value |
| `onChange` | `(value) => void` | |

## Example

```jsx
import { Tabs } from "@sandhata/spectra";

const [tab, setTab] = useState("dashboard");
<Tabs value={tab} onChange={setTab} tabs={[
  { value: "dashboard", label: "Dashboard" },
  { value: "forms", label: "Forms" },
]} />
```
