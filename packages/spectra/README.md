# @sandhata/spectra

> One token set. Every client's brand. Zero forking.

React component primitives for the Sandhata Design System. Plain inline-style-object components styled entirely through CSS custom properties — no CSS-in-JS runtime, no Tailwind, framework-agnostic (no Next.js-specific imports; works under Vite or any React 18 bundler).

## Install

```bash
npm install @sandhata/spectra @sandhata/spectra-tokens
```

`@sandhata/spectra-tokens` is **required**, not optional — these components read `var(--colour-primaryblue-500)`-style custom properties for every colour, radius, and spacing value. Without it loaded, everything renders unstyled.

## Use

```jsx
import "@sandhata/spectra-tokens"; // once, at your app root
import { Button, Card, Badge } from "@sandhata/spectra";

function Example() {
  return (
    <Card>
      <Badge tone="success">Live</Badge>
      <Button hierarchy="primary">Get started</Button>
    </Card>
  );
}
```

## Components

Buttons — `Button`, `IconButton`
Data display — `Accordion`, `Avatar`, `Badge`, `Card`, `StatCard`, `Table`, `Tag`
Feedback — `Alert`, `Spinner`, `Tooltip`
Forms — `Checkbox`, `Input`, `Radio`, `Select`, `Switch`, `Textarea`
Navigation — `Menu`, `Sidebar`, `Tabs`
Overlay — `Drawer`, `Modal`

## Requirements

- React 18+, ReactDOM 18+ (peer dependencies)
- `@sandhata/spectra-tokens` loaded once, anywhere upstream

## Guidelines (for Figma Make / Dev Mode / anyone generating UI with this library)

`guidelines/` ships written guidelines in the format Figma Make Kits expect —
a `Guidelines.md` compass file plus `foundations/` (colour, typography,
spacing, motion, voice) and `components/` (one file per real component: its
actual props, anatomy, accessibility notes, and do/don't guidance). Drag
these files into a Figma Make project's own `guidelines/` folder to attach
them to a Make Kit built from this package.

## Build

`npm run build` (tsup) outputs CJS + ESM to `dist/`. `main`/`module`/`exports` resolve to `dist/index.js` / `dist/index.mjs`; `types` resolves to the hand-authored `src/index.d.ts` barrel (shipped as source, not generated — `files` whitelists both `dist` and `src`, and tsup's `dts: false` is deliberate, matching every component's hand-authored sibling `.d.ts`). `prepublishOnly` runs the build automatically before `npm publish`, so a stale/missing `dist` can't ship.

Inside this monorepo, `next.config.mjs` webpack-aliases `@sandhata/spectra` straight to `src/index.js`, on top of the npm workspace symlink — the app's own dev/build never depends on `dist` being fresh. Run `npm run build -w packages/spectra` whenever you touch a component and need `dist` in sync for an external consumer or before publishing.
