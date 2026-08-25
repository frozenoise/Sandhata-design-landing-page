# Motion

Quiet and functional. Productive easing for everyday UI, expressive easing for
moments that should feel considered. No bounces, no springs, no infinite
decorative loops.

## Duration

| Token | Value | Use |
|---|---|---|
| `--duration-fast-01` | 70ms | Micro state changes |
| `--duration-fast-02` | 110ms | Hovers, small state changes — the most common one |
| `--duration-moderate-01` | 150ms | Small reveals |
| `--duration-moderate-02` | 240ms | Toggles, reveals |
| `--duration-slow-01` | 400ms | Large surfaces |
| `--duration-slow-02` | 700ms | Overlays, full-screen transitions |

## Easing

| Token | Curve | Use |
|---|---|---|
| `--ease-standard-productive` | `cubic-bezier(0.2, 0, 0.38, 0.9)` | Default for everyday transitions — the most common one |
| `--ease-standard-expressive` | `cubic-bezier(0.4, 0.14, 0.3, 1)` | Default with more character |
| `--ease-entrance-productive` | `cubic-bezier(0, 0, 0.38, 0.9)` | Elements entering, functional |
| `--ease-entrance-expressive` | `cubic-bezier(0, 0, 0.3, 1)` | Elements entering, expressive |
| `--ease-exit-productive` | `cubic-bezier(0.2, 0, 1, 0.9)` | Elements leaving, functional |
| `--ease-exit-expressive` | `cubic-bezier(0.4, 0.14, 1, 1)` | Elements leaving, expressive |

```css
transition: background var(--duration-fast-02) var(--ease-standard-productive);
```

## Rules

- Never write a raw `ms` value or a raw `cubic-bezier(...)` in a component —
  always one of the named tokens above.
- Hover/small state changes → `--duration-fast-02` +
  `--ease-standard-productive`. This pair covers the large majority of
  interactive-state transitions in this system.
- A component that doesn't implement hover/focus/active transitions at all
  (several real components in this library don't — check the component's own
  guidelines file) shouldn't have one invented for it as part of an unrelated
  change; note it as a gap instead.
