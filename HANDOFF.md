# Sandhata Design System — Developer Handoff

A handoff guide for picking up the **Sandhata Design System** website. This is the
practical "how do I run it and where is everything" doc. (The older `readme.md`
describes the original pre-Next.js compiler architecture and is now out of date —
use **this** file to get started.)

Repo: https://github.com/frozenoise/Sandhata-design-landing-page
Live: deployed on Vercel.

---

## 1. What this is

A marketing + documentation site for the Sandhata Design System, built as a
**Next.js 14 (App Router) + TypeScript** app. It ships the design system's React
primitives, design tokens, full landing page, docs, an AI "prompt → UI" builder,
and an interactive component showcase.

- **Framework:** Next.js `14.2.18` (App Router), React `18.3.1`, TypeScript `^5`
- **Styling:** plain CSS — design tokens as CSS custom properties + per-page CSS.
  No Tailwind, no CSS-in-JS library (components use inline `style` objects).
- **Fonts:** IBM Plex Sans + IBM Plex Mono (loaded via Google Fonts in
  `app/layout.tsx`, overriding the `--font-*` tokens).

---

## 2. Quick start

```bash
git clone https://github.com/frozenoise/Sandhata-design-landing-page.git
cd "Sandhata-design-landing-page"
npm install
npm run dev          # http://localhost:3000 (or next free port, e.g. 3001)
```

Scripts (`package.json`):

| Script | Does |
|---|---|
| `npm run dev` | Start the dev server (hot reload) |
| `npm run build` | Production build (`next build`) |
| `npm run start` | Serve the production build |
| `npm run lint` | `next lint` |

> ⚠️ **Don't run `npm run build` while `npm run dev` is running** — they share the
> `.next` folder and it corrupts (CSS 404s). Stop dev first, or build in a clean
> checkout. Restart dev after a build.

### Environment (optional)

Only the AI builder (`/builder`) needs a key. Without it the page shows a friendly
"add your key" prompt — everything else works.

```bash
cp .env.local.example .env.local
# then set:
ANTHROPIC_API_KEY=sk-ant-...      # from https://console.anthropic.com
```

`.env.local` is gitignored. The key is intentionally **not** set on Vercel, so the
hosted `/builder` asks visitors to supply their own.

---

## 3. Routes

| Route | File | What it is |
|---|---|---|
| `/` | `app/page.tsx` | Landing page (hero, components, charts, data table, CTA) |
| `/components` | `app/components/page.tsx` | Component gallery / docs |
| `/documentation` | `app/documentation/page.tsx` | Long-form docs |
| `/demo` | `app/demo/page.tsx` | Client-themed dashboard demo (re-skins per client) |
| `/builder` | `app/builder/page.tsx` | AI "prompt → UI" builder (calls Claude) |
| `/showcase` | `app/showcase/page.tsx` | Interactive component showcase + theming playground |
| `/pricing` | `app/pricing/page.tsx` | "Coming soon" page |
| `/api/generate` | `app/api/generate/route.ts` | Builder API route (Node runtime, calls Claude) |

Shared docs internals live in private folders `app/_docs/` and `app/_demo/`.

---

## 4. Project structure

```
app/
  layout.tsx          # root layout: fonts, <Analytics/>, globals.css
  globals.css         # @imports ../styles.css then ALL page CSS (landing, docs,
                      #   charts, the showcase liquid-glass sidebar, etc.)
  page.tsx            # landing page (source of truth for the chart components)
  showcase/page.tsx   # the showcase (see §6)
  <route>/page.tsx    # other routes
  _docs/ , _demo/     # shared, route-private helpers (shell, data, css)
  api/generate/route.ts

components/           # the design system primitives (React, .jsx + sibling .d.ts)
  index.js            # BARREL — import everything from here ("use client")
  buttons/  forms/  data-display/  feedback/  navigation/

tokens/               # CSS custom-property source of truth
  colors.css          # palettes (50→700) + semantic aliases + dark theme
  typography.css  spacing.css  fonts.css  base.css
styles.css            # manifest that @imports the token files

public/assets/        # logo, fonts, hero.mp4, avatars
```

### Importing components

Import from the barrel, **without** an `Sd` prefix:

```tsx
import { Button, Badge, Alert, Input, Select, StatCard, Switch } from "@/components";
```

Available primitives: `Button`, `IconButton`, `Avatar`, `Badge`, `Card`,
`StatCard`, `Tag`, `Alert`, `Spinner`, `Tooltip`, `Checkbox`, `Input`, `Radio`,
`Select`, `Switch`, `Textarea`, `Tabs`.

---

## 5. Design-system conventions (read before editing)

- **Tokens over hex.** Colours/spacing/radius/type all come from CSS variables.
  e.g. `var(--colour-primaryblue-500)`, `var(--radius-md)`, `var(--text-title)`,
  `var(--surface-raised)`. Defined in `tokens/*.css`.
- **Brand colour is `--colour-primaryblue-*`** (50→700). Most components key their
  primary look off `--colour-primaryblue-500`.
- **Multi-tenant theming via a token ramp.** To re-skin a subtree to another brand,
  override the `--colour-primaryblue-*` scale on a wrapper. The `ramp()` helper
  (in `app/demo/page.tsx` and `app/showcase/page.tsx`) maps the primaryblue scale
  onto another palette, e.g. `ramp("secondarycyan")`. This is how `/demo` and the
  showcase's "One system, any brand" section work.
- **Components take a `style` prop** (merged last) but most do **not** accept
  arbitrary layout props — wrap them in a `<div>` for positioning. `StatCard` in
  particular has no `style`-driven margins; wrap it.
- **`Checkbox` is a native `<input type="checkbox">`** — its `onChange` is a
  `React.ChangeEvent<HTMLInputElement>` (use `e.target.checked`), NOT `(v:boolean)`.
  `Switch.onChange`, by contrast, gives you a boolean.
- **`Alert` supports `onClose`** — pass it to render a working dismiss button.

### ⚠️ The circular-variable gotcha (cost us real time)

Do **not** remap a token to itself. `ramp("primaryblue")` produces
`--colour-primaryblue-500: var(--colour-primaryblue-500)`, a self-referential
custom property that CSS computes as *invalid* — which silently collapses every
primary button's background to transparent. For the "default / unchanged" brand,
use **empty vars `{}`**, not a self-ramp.

---

## 6. The `/showcase` page (most recently worked on)

`app/showcase/page.tsx` is a single-file interactive showcase. Structure:

- **Floating liquid-glass sidebar** (`.sc-sidebar` in `globals.css`) — collapsible
  (default expanded), with a scroll-to-section nav, accent/surface/radius controls,
  and a Token Inspector toggle.
- **Bands:** Hero → Atoms (buttons/badges/inputs/selection) → Data viz → Theming
  (per-brand dashboard modules) → Foundations (alerts/forms/type/colour).
- **Charts** are inline SVG, ported from `app/page.tsx`: `RadarChart`, `DonutChart`
  (with month picker), `LandingBarChart`, `MiniLineChart`, and an
  `InteractiveLineChart` (Desktop/Mobile series toggle + hover tooltip). They use
  the `.rtu-*` / `.cc` CSS classes in `globals.css`.
- The config sidebar drives `--colour-primaryblue-*` (accent), surface tokens
  (white/warm/dark), and `--radius-*` on the `<main>` element.

The landing page (`app/page.tsx`) is the **source of truth** for the chart
components — if you change a chart, keep both in sync (or factor them out).

---

## 7. Deploy

- Hosted on **Vercel**, auto-deploys on push to `main`.
- `ANTHROPIC_API_KEY` is deliberately unset on Vercel (see §2).
- Vercel Web Analytics is wired via `<Analytics />` (`@vercel/analytics/react`) in
  `app/layout.tsx`.

---

## 8. Gotchas / housekeeping

- `*.md` is **gitignored** except `readme.md` and this `HANDOFF.md` (see
  `.gitignore`). If you add docs, whitelist them there or they won't be tracked.
- Old reference material that is **not** the live site still lives in the repo:
  `readme.md` (old architecture), `docs/*.jsx`, `ui_kits/`, `index.html`,
  `_ds_bundle.js`. Safe to ignore; don't wire them into the Next app.
- Interactive git flags (`-i`) aren't used here; commits go straight to `main`
  (Vercel deploys from it). Branch if you want PR review.

---

## 9. Good first things to pick up

- The sidebar **"Get the code"** button in `/showcase` is a visual placeholder with
  no handler yet.
- Charts are duplicated between `app/page.tsx` and `app/showcase/page.tsx` — a
  shared `app/_charts/` module would remove the drift risk.
- `/pricing` is a "coming soon" stub.

Questions on intent or design decisions: check the Figma referenced in `readme.md`,
or ping the repo owner.
