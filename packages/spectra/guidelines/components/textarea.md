# Textarea

Multi-line text field with the same label / helper / error anatomy as
`Input`.

## Props

| Prop | Type | Notes |
|---|---|---|
| `label` | string | |
| `helper` | string | |
| `error` | string | |
| `rows` | number | Visible rows |

## Example

```jsx
import { Textarea } from "@sandhata/spectra";

<Textarea label="Notes" rows={3} placeholder="Enter your text here" helper="Help or instruction text goes here" />
```
