# Spacing & shape

## 8-point grid

A strict 8-point grid with half-steps for finer control.

| Token | Value |
|---|---|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-10` | 40px |
| `--space-12` | 48px |
| `--space-14` | 56px |
| `--space-16` | 64px |

## Layout

- **Container**: centred, max-width 1320px, 24px gutters
  (`var(--container-max)` / `var(--container-pad)`).
- **Card padding**: 24px internal padding as the default.
- **Gutters**: 24–32px between major page regions.

```css
.container { max-width: var(--container-max); padding: 0 var(--container-pad); margin: 0 auto; }
```

## Border radius

Restrained corners — small and crisp, never heavily rounded except pills and
avatars.

| Token | Value | Use |
|---|---|---|
| `--radius-xs` | 2px | Code pills, tiny chips |
| `--radius-sm` | 4px | Inputs, inner elements |
| `--radius-md` | 6px | Buttons |
| `--radius-lg` | 8px | Cards |
| `--radius-xl` | 12px | Featured / pricing cards |
| `--radius-pill` | 999px | Badges, avatars, toggles |

## Shadows

Soft neutral shadows only (`rgba(20,22,24,…)`). The only coloured glow in the
system is the focus ring — a 3px violet halo, never used for anything else.

| Token | Use |
|---|---|
| `--shadow-xs` | Barely-there lift |
| `--shadow-sm` | Cards, dropdowns |
| `--shadow-md` | Popovers, tooltips |
| `--shadow-lg` | Modals, drawers |
| `--shadow-overlay` | Full-screen overlay panels |
| `--shadow-focus` | Keyboard focus ring (`0 0 0 3px rgba(96,45,234,0.35)`) |

## Borders & dividers

- Hairlines: 1px `neutral-200`/`neutral-300` for dividers and card borders.
- Tables: bordered grids with hairline rows.
- Emphasis: 2px for tab underlines and selected accents (e.g. the active
  Sidebar item's left border).
