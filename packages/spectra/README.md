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
Data display — `Avatar`, `Badge`, `Card`, `StatCard`, `Tag`
Feedback — `Alert`, `Spinner`, `Tooltip`
Forms — `Checkbox`, `Input`, `Radio`, `Select`, `Switch`, `Textarea`
Navigation — `Tabs`

## Requirements

- React 18+, ReactDOM 18+ (peer dependencies)
- `@sandhata/spectra-tokens` loaded once, anywhere upstream

## Build

`npm run build` (tsup) outputs CJS + ESM to `dist/`. The package currently resolves `main`/`module`/`exports` to source (`src/index.js`) for fast local workspace linking inside the main Sandhata repo — point these at `dist` before publishing externally.
