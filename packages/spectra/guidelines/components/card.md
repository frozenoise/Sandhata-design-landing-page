# Card

The base content surface: white layer, subtle border, soft shadow. Supports
an optional title/subtitle header and a trailing action slot.

## Props

| Prop | Type | Notes |
|---|---|---|
| `title` | node | Header title |
| `subtitle` | node | Header subtitle (light weight) |
| `action` | node | Trailing header slot — typically a small `Button` |
| `padding` | number | Inner padding, default 24 |

## Do / Don't

- **Don't** pass a margin/layout prop expecting `Card` to position itself —
  it has none. Wrap it in a `<div>` to control its position/margin.

## Example

```jsx
import { Card, Button } from "@sandhata/spectra";

<Card title="Line chart" subtitle="Last 3 months" action={<Button size="small" hierarchy="tertiary">Export</Button>}>
  Card body content goes here.
</Card>
```
