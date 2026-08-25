# Colour

Clean, cool and corporate. A royal electric blue is the one action colour;
neutrals are slightly cool greys. Reference semantic aliases in product UI —
reach for a raw numbered scale step only when no semantic alias fits.

## Brand & action

| Token | Hex | Use |
|---|---|---|
| `--colour-primaryblue-500` | `#0036DD` | The action colour — buttons, links, selected states |
| `--colour-primaryblue-400` | `#445CFF` | Brighter emphasis variant |
| `--colour-alternativepurple-500` | `#602DEA` | Focus ring, data-viz lead |
| `--colour-secondaryblue-500` | `#1F2A54` | Deep navy for dense chrome |

## Neutral scale

0–950, slightly cool greys. **Text sits at 600–900, borders at 200–300,
surfaces at 0–100.**

| Step | Hex | Step | Hex |
|---|---|---|---|
| 0 | `#FFFFFF` | 300 | `#C0C7CF` |
| 50 | `#F5F6F8` | 500 | `#98A3AD` |
| 100 | `#E9EBEE` | 700 | `#585F65` |
| 200 | `#D5DBDE` | 900 | `#202225` |
| | | 950 | `#141618` |

## Status colours

| Token | Hex |
|---|---|
| `--colour-success-500` | `#00A300` |
| `--colour-error-500` | `#D21B00` |
| `--colour-alert-500` | `#FFC228` |
| `--colour-info-500` | `#508FED` |

Each status family has its own 50→900 ramp — use the 50 step for tinted
backgrounds, 500 for the primary status colour (icons, borders), 700 for text
on a tinted background (better contrast than 500 for body text).

## Semantic aliases — prefer these over raw scale steps

| Token | Maps to | Use |
|---|---|---|
| `--surface-page` | neutral-0 | Page background |
| `--text-body` | neutral-800 | Body copy |
| `--text-subtitle` | neutral-700 | Secondary text, form labels |
| `--text-caption` | neutral-600 | Helper text, captions |
| `--text-action` | primaryblue-500 | Links and actions |
| `--background-action` | primaryblue-500 | Primary buttons |
| `--border-default` | neutral-300 | Default input/control borders |
| `--border-subtle` | neutral-200 | Hairlines and card borders |
| `--focus-ring` (`--shadow-focus`) | purple-500 @ 35% | Keyboard focus halo — `0 0 0 3px rgba(96,45,234,0.35)` |

Aliases re-map automatically in the dark theme (`data-theme="dark"`) — always
prefer an alias over a raw `--colour-neutral-800` when one exists, so dark
mode keeps working without touching the component.

## Data visualisation

Charts run violet → blue → cyan, with soft area fills fading to transparent:
`--viz-1` through `--viz-6` (`#602DEA`, `#445CFF`, `#00D4D4`, `#00208F`,
`#9A8AF5`, `#608FEC`).

## Brand gradient

`var(--gradient-brand)` — magenta → deep blue
(`linear-gradient(114.77deg, #DF00C1 1.85%, #002289 98.15%)`), reserved for
brand and marketing surfaces only. Product UI stays white/neutral.

## The one naming trap to know

Figma's `radius/medium` variable is 12px, which maps to code's
`--radius-xl` — **not** `--radius-md` (which is 6px). Verify a Figma variable's
*resolved value* against the CSS token table before assuming the names line up.
