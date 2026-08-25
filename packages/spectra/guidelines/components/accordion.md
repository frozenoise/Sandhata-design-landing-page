# Accordion

A list of collapsible panels. Single-open by default.

## Props

| Prop | Type | Notes |
|---|---|---|
| `items` | `{ id, title, content, disabled? }[]` | |
| `multiple` | boolean | Allow more than one panel open at once. Default `false` |
| `defaultOpen` | `string[]` | Panel ids open on mount |
| `onToggle` | `(id, open) => void` | |

## Anatomy

Row: left accent border (blue, only when open) → title (bold) → chevron
(rotates 180° when open) → content panel (only rendered when open).

## Do / Don't

- **Do** use Accordion for secondary/supplementary content — FAQs, optional
  configuration, progressive disclosure in long forms.
- **Don't** hide critical information inside a closed panel by default — if
  the user must read it, show it open or don't put it in an accordion.

## Example

```jsx
import { Accordion } from "@sandhata/spectra";

<Accordion items={[
  { id: "1", title: "What's included?", content: "Everything in the starter plan." },
  { id: "2", title: "Can I cancel anytime?", content: "Yes, no questions asked." },
]} />
```
