# Sandhata Design System

A comprehensive, enterprise-grade UI design system for **Sandhata** — presented
shadcn-style as **Sandhata UI**: "a set of beautifully designed components that
you can customise, extend, and build on." The system spans low-level foundations
(colour, type, spacing, elevation), reusable React primitives, and full
product-surface recreations (dashboard, forms, pricing).

> **This project IS the design system.** A compiler reads it on every turn and
> regenerates `_ds_bundle.js`, `_ds_manifest.json` and the adherence config —
> never edit those by hand. Consumers link the single root `styles.css` and read
> components from `window.SandhataDesignSystem_081a0e`.

---

## Sources

- **Figma:** "New Sandhata Design system.fig" (attached, mounted read-only).
  Key pages used: `Colour` (token tables), `Typography`, `Icons`, `Cards`,
  `Forms-Draft`, and `POC` (the dashboard / forms / pricing showcase recreated as
  the UI kit). Colour + type values were materialised from the Figma Variables.
- **Fonts:** Akkurat (Light / Regular / Bold / Mono) + Akkurat Pro, supplied as
  the uploaded `.ttf` / `.otf` files in `uploads/` and shipped from `assets/fonts/`.
- No codebase or live URL was provided; everything derives from the Figma file
  and uploaded fonts.

---

## Index / manifest

| Path | What it is |
|---|---|
| `styles.css` | Global entry — `@import`s every token + font file. Link this. |
| `tokens/colors.css` | Base palettes (50→950) + semantic aliases + dark theme. |
| `tokens/typography.css` | Type families, weights and the full type scale. |
| `tokens/spacing.css` | 8-pt spacing, radius, border, elevation, motion tokens. |
| `tokens/fonts.css` | `@font-face` for Akkurat. |
| `tokens/base.css` | Element defaults + `.sd-*` typography utility classes. |
| `components/buttons/` | `Button`, `IconButton` |
| `components/forms/` | `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch` |
| `components/data-display/` | `Card`, `StatCard`, `Badge`, `Tag`, `Avatar` |
| `components/feedback/` | `Alert`, `Tooltip`, `Spinner` |
| `components/navigation/` | `Tabs` |
| `ui_kits/showcase/` | Interactive Sandhata UI landing (dashboard / forms / pricing). |
| `docs/` | Atlaskit-style component documentation site (sidebar nav, live previews + code, props tables). |
| `foundations/` | Specimen cards rendered in the Design System tab. |
| `assets/logo/` | `sandhata-logo.svg` (lockup), `sandhata-mark.svg` (mark). |
| `assets/fonts/` | Akkurat font binaries. |
| `assets/icons/` | `github.svg`. |
| `SKILL.md` | Agent Skill manifest (Claude Code compatible). |

Namespace for `@dsCard` HTML and consumers: **`window.SandhataDesignSystem_081a0e`**.

---

## CONTENT FUNDAMENTALS

How Sandhata writes copy.

- **Voice:** confident, plain, builder-to-builder. The flagship line —
  *"A set of beautifully designed components that you can customise, extend, and
  build on."* — is the template: short, active, benefit-first.
- **Person:** addresses the reader as **you** ("components **you** can customise").
  Avoids "we"/"our" in product copy.
- **Casing:** **Sentence case** everywhere — headings, buttons, labels, tabs.
  Title Case is not used. Proper nouns only ("Sandhata", "Pro", "Dashboard").
- **Tone:** calm and instructional. Helper text is literally
  *"Help or instruction text goes here"* — neutral, descriptive, never cute.
- **Field & error language:** labels are terse nouns ("Field label", "Single date
  field"). Required errors are direct: *"This is a mandatory field!"*.
- **Numbers:** grouped with commas (`24,828`), trends phrased as
  *"Trending up by 5.2% this month"*. Currency is compact: `$0/mo`.
- **British spelling** in system vocabulary — **"Colour"**, "customise",
  "organise". Keep it.
- **Emoji:** none. The brand never uses emoji in UI or copy.
- **CTAs:** verb-first and short — "Submit", "Get started", "View documentation",
  "Add row", "Next".

---

## VISUAL FOUNDATIONS

- **Colour vibe:** clean, cool and corporate. A **royal/electric blue**
  (`primaryblue-500 = #0036DD`, with a brighter `#445CFF` for emphasis) is the
  action colour. Neutrals are slightly cool greys. Data-viz leans on **violet**
  (`alternativepurple`) + blues + cyan. White space dominates; colour is used
  sparingly and purposefully.
- **Signature gradient:** a magenta→deep-blue diagonal
  (`--gradient-brand`, 114.77°, `#DF00C1 → #002289`) used on brand/marketing
  surfaces (e.g. the Type Tokens cover). Product UI stays mostly white with a very
  soft `--gradient-hero` (white → faint blue) behind the hero.
- **Type:** **Akkurat** throughout — Light for soft body/captions, Regular for UI,
  Bold for display & headings, Mono for code/numbers. Display sizes carry tight
  negative tracking (−0.25 to −1px); body is neutral.
- **Spacing:** strict **8-point grid** (4/8/12/16/24/32…). Generous internal card
  padding (24px), comfortable line lengths.
- **Corner radii:** **restrained** — `sm 4px` for inputs/buttons-inner, `md 6px`
  for buttons, `lg 8px` for cards, `xl 12px` for featured/pricing cards, pill for
  badges/avatars/toggles. Nothing is heavily rounded; the system reads crisp.
- **Cards:** white surface + **1px subtle neutral border** (`--border-subtle`) +
  a **faint** shadow (`--shadow-sm`). Cards lean on the border, not heavy
  elevation. Featured pricing card is the exception: solid violet fill + larger
  shadow.
- **Borders & dividers:** hairline 1px neutral-200/300. Tables and token tables
  are bordered grids.
- **Shadows:** soft, low-contrast, neutral (`rgba(20,22,24,…)`). No coloured
  glows except the **focus ring** — a 3px violet halo (`--shadow-focus`, the
  brand focus colour is `alternativepurple-500`).
- **Hover states:** buttons darken to the `-700` step; subtle/ghost controls fill
  with `neutral-100`; nav items gain a tinted blue background + border.
- **Press / selected:** selected rows/tabs use `primaryblue-50` tint with a
  `primaryblue-500` accent (2px underline on tabs, left fill on rows).
- **Transparency & blur:** used lightly — modal scrim is `rgba(20,22,24,0.6)`;
  no glassmorphism in product UI.
- **Animation:** quiet and functional. Standard easing
  `cubic-bezier(0.2,0,0,1)`, fast (120ms) for hovers, base (200ms) for toggles.
  No bounces, no infinite decorative loops.
- **Imagery:** the system is largely illustration-free; the visual interest comes
  from **data visualisation** (line/area, pie, radial, radar charts) in the
  violet→blue palette. Charts use soft area-fill gradients fading to transparent.
- **Layout:** centred max-width container (`--container-max 1320px`), 24–32px
  gutters. Sticky top bar, hero, category nav, then content.

---

## ICONOGRAPHY

- Sandhata ships a **custom icon library** in Figma with multiple styles —
  *Filled, Line Two-Tone, Broken, Light (Stroke), Glass*, plus dedicated
  *Arrows & Directions* and *User Interface* sets — drawn on a **24px** grid.
  The dominant UI style is **Light (Stroke)**: clean 1.5–2px single-weight strokes
  with rounded caps/joins.
- **Substitution (FLAGGED):** the Figma icons are stored as decomposed vector
  primitives (separate Rectangle/Line/Ellipse layers per icon), which cannot be
  cleanly copied as single SVGs. This system therefore draws inline SVG icons in
  the **Lucide** style (24px, ~2px stroke, rounded) — the closest match to
  Sandhata's "Light (Stroke)" set — within components and the UI kit.
  **If you have the real Sandhata icon SVGs/font, drop them into `assets/icons/`
  and swap the inline icons for them.**
- **Logo / brand marks** (real, copied from Figma) live in `assets/logo/`:
  `sandhata-logo.svg` (full lockup) and `sandhata-mark.svg` (the cyan twist +
  orange dot, for square/favicon use). The mark colours are cyan `#00A4DC`,
  orange `#F68136`, ink `#48484F`.
- `assets/icons/github.svg` is the GitHub glyph used in the showcase top bar.
- **No emoji**; **no unicode glyphs** used as icons.

---

## Using this system

- **Web / HTML:** link `styles.css`, then read components from
  `window.SandhataDesignSystem_081a0e` after loading `_ds_bundle.js`.
- **Tokens first:** prefer the semantic aliases (`--text-body`, `--surface-card`,
  `--background-action`, `--border-subtle`) over raw scale steps.
- **Themes:** add `data-theme="dark"` (or class `.dark`) to a container for dark
  mode; the showcase's accent switcher shows how to re-skin the action colour.

See **`SANDHATA_AI_GUIDE.md`** for prompting an AI agent to build with this system.
