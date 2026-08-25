# Sandhata Spectra — Guidelines

You are generating UI with **@sandhata/spectra**, Sandhata Technologies' production
React component library. This file is a compass — read it first, then follow it to
the file that actually answers your question. Don't guess at a value or a component
API; every real one is documented in this folder.

## MUST READ before writing any code

1. `setup.md` — package names, imports, peer requirements, the one thing that
   breaks silently if you skip it.
2. `foundations/color.md` — the palette, semantic aliases, and the one naming
   trap that has broken this exact system before (`radius/medium` ≠ `--radius-md`).
3. `components/overview.md` — the full component catalogue, grouped by category,
   with the honest state of each (real vs. not yet built).

## Read on demand

- `foundations/typography.md` — type scale, families, usage rules.
- `foundations/spacing-and-shape.md` — the 8-point grid, radius scale, shadows.
- `foundations/motion.md` — duration and easing tokens.
- `foundations/voice-and-content.md` — copy tone, sentence case, British spelling.
- `components/<name>.md` — one file per component, its real props, anatomy, and
  do/don't guidance.

## Product character

- **Crisp and enterprise-grade, not playful.** Restrained corner radii (2–12px
  on containers, never fully rounded except pills/avatars), hairline 1px
  borders, soft low-contrast shadows — never heavy elevation or bright glows.
- **White space dominates.** Colour is used sparingly and purposefully. A
  royal electric blue (`--colour-primaryblue-500`, `#0036DD`) is the one
  action colour — it means "this is clickable and important," so don't spend
  it on decoration.
- **Tokens first, always.** Every colour, radius, spacing, and duration value
  in a real component is a `var(--token-name)` reference, never a raw hex or
  pixel number. Match that — a generated component that hardcodes `#0036DD`
  instead of `var(--colour-primaryblue-500)` is wrong even if it renders
  identically today, because it silently opts out of theming and dark mode.
- **Quiet motion.** Fast, functional easing. No bounces, no springs, no
  infinite decorative loops. See `foundations/motion.md` for the real duration
  scale — don't invent a `300ms ease-in-out` that isn't one of the named steps.
- **Compose, don't reimplement.** If a real component exists for something
  (a checkbox, a button, a tag), use it. Don't hand-roll a second checkbox
  inside a new composite component — see `components/table.md` for an example
  of a component that composes `Checkbox` for its row-selection column rather
  than reinventing one.

## Workflow

Before using any component:

1. Check `components/overview.md` — confirm the component is real (not one of
   the "documented but not implemented" entries) and note its category.
2. Read that component's `components/<name>.md` file for its actual prop
   names and types. Prop names here are the real, shipped API — don't infer
   one from a similar library (e.g. this is `hierarchy`, not `variant`, on
   `Button`).
3. Read `foundations/color.md` and `foundations/spacing-and-shape.md` if the
   layout needs a colour or spacing decision the component itself doesn't make
   for you (e.g. gaps between components, page background).
4. Follow every Do/Don't listed for that component before shipping the layout.

## Hard rules

- Every component import comes from `@sandhata/spectra`, with **no `Sd`
  prefix** on the component name (`Button`, not `SdButton`).
- `@sandhata/spectra-tokens` must be imported once at the app root before any
  component renders — components read CSS custom properties and render
  completely unstyled without it. See `setup.md`.
- Never write `--colour-primaryblue-500: var(--colour-primaryblue-500)` or any
  other self-referential token remap — it resolves to an invalid CSS value
  and silently makes the element transparent. This has happened before in
  this exact system's multi-tenant re-theming code.
- Copy is sentence case and British-spelled (`colour`, `customise`,
  `organise`) — see `foundations/voice-and-content.md` before writing any UI
  text, button label, or error message.
