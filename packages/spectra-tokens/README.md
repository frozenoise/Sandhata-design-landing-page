# @sandhata/spectra-tokens

Design tokens for the [Sandhata Design System](https://sandhata-design-landing-page.vercel.app) — colour, typography, and spacing as CSS custom properties. `@sandhata/spectra`'s components read these variables (`var(--colour-primaryblue-500)`, `var(--radius-md)`, `var(--text-title)`, etc.) instead of hardcoding values, so **this package must be loaded once at your app root** or the components render unstyled.

## Install

```bash
npm install @sandhata/spectra-tokens
```

## Use

```js
// once, at your app's entry point
import "@sandhata/spectra-tokens";
```

Or link it directly in plain HTML:

```html
<link rel="stylesheet" href="node_modules/@sandhata/spectra-tokens/dist/tokens.css" />
```

## Multi-tenant theming

Override the `--colour-primaryblue-*` scale (50→700) on a wrapper element to re-theme every component that consumes it — this is how Sandhata's own demo/showcase pages re-skin per client brand. Never remap a token to itself (e.g. `--colour-primaryblue-500: var(--colour-primaryblue-500)`); that's self-referential and resolves to `invalid`, silently making backgrounds transparent.

## What's in here

Generated from this repo's `tokens/*.css` (colour ramps + semantic aliases, typography scale, spacing scale, base resets) and the IBM Plex Sans/Mono Google Fonts `@import`. The root token files are the single source of truth — this package is a packaged, standalone copy of them for consumers outside the main repo. Run `npm run build` (`node scripts/build.mjs`) to regenerate `dist/tokens.css` after editing the source.
