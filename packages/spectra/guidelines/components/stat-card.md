# StatCard

A KPI tile: label, large value, and an optional trend indicator.

## Props

| Prop | Type | Notes |
|---|---|---|
| `label` | string | KPI label |
| `value` | node | The large value |
| `trend` | string | Trend text |
| `trendDirection` | `"up" \| "down"` | |

## Do / Don't

- **Don't** expect `StatCard` to position or size itself in a grid — like
  `Card`, it has no layout props. Wrap it in a `<div>` for grid/flex placement.

## Example

```jsx
import { StatCard } from "@sandhata/spectra";

<StatCard label="Desktop" value="24,828" trend="5.2% this month" />
<StatCard label="Mobile" value="25,010" trend="1.1% this month" trendDirection="down" />
```
