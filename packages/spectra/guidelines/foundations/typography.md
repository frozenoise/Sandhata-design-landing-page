# Typography

IBM Plex throughout. Light for soft body and captions, Regular for UI, Bold
for display and headings, Mono for code and numbers. The scale follows an
8-point rhythm and is aligned to Atlassian's published type scale (Display
maps onto Atlassian's Heading XXL/XL/L; Heading H1–H3 maps onto Heading M/S/XS).

## Families

| Token | Weight | Use |
|---|---|---|
| `--font-bold` | 700 | Display, headings — pair with tight negative tracking |
| `--font-normal` | 400 | UI and body copy |
| `--font-light` | 300 | Soft body, captions, secondary copy |
| `--font-mono` | — | Code, tokens, tabular numbers |

All three Sans weights resolve to the same family name (`"IBM Plex Sans"`) —
the weight comes from `font-weight`, not a different family string. Mono is
`"IBM Plex Mono"`.

## Type scale

| Token | Size / line | Tracking | Family |
|---|---|---|---|
| `display-large` | 32 / 36 | −1px | Bold |
| `display-medium` | 28 / 32 | −0.5px | Bold |
| `display-small` | 24 / 28 | −0.25px | Bold |
| `heading-h1` | 20 / 24 | −0.25px | Bold |
| `heading-h2` | 16 / 20 | −0.25px | Bold |
| `heading-h3` | 14 / 20 | 0 | Bold |
| `body-large` | 16 / 24 | 0 | Regular |
| `body-medium` | 14 / 20 | 0 | Regular |
| `body-small` | 12 / 16 | 0 | Regular |
| `caption` | 12 / 16 | 0.1px | Light |
| `label` | 12 / 16 | 0.5px | Regular |
| `code` | 12 / 20 | 0 | Mono |

Reference as `var(--{token}-size)` / `var(--{token}-line)`, e.g.:

```css
h1 { font: 700 var(--heading-h1-size)/var(--heading-h1-line) var(--font-bold); }
body { font: var(--body-medium-size)/var(--body-medium-line) var(--font-normal); }
```

## Usage rules

- **Sentence case everywhere** — headings, buttons, labels, tabs. Never Title
  Case.
- Display sizes carry tight negative tracking; body stays neutral (no
  tracking adjustment).
- Comfortable line lengths — body copy maxes around 720px wide.
