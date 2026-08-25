# Tooltip

Dark label shown on hover/focus of its child trigger.

## Props

| Prop | Type | Notes |
|---|---|---|
| `label` | node | Tooltip text |
| `side` | `"top" \| "bottom" \| "left" \| "right"` | Default `"top"` |

## Do / Don't

- **Do** wrap a single focusable child (a `Button`/`IconButton`, or something
  else that can receive hover/focus) — `Tooltip` shows on both mouse hover
  and keyboard focus of its child.
- **Don't** expect a visible arrow/caret pointing at the trigger, or a focus
  ring on the tooltip itself — this component doesn't render either.

## Example

```jsx
import { Tooltip, IconButton } from "@sandhata/spectra";

<Tooltip label="Copy to clipboard" side="top">
  <IconButton icon={<Copy />} ariaLabel="Copy" />
</Tooltip>
```
