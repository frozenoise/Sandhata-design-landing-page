# Setup

## Install

```bash
npm install @sandhata/spectra @sandhata/spectra-tokens
```

Both packages are required. `@sandhata/spectra-tokens` is not optional — it
ships the CSS custom properties (`--colour-*`, `--radius-*`, `--space-*`,
`--text-*`, etc.) that every component reads for its styling. Installing only
`@sandhata/spectra` renders every component completely unstyled.

## Import once, at the app root

```jsx
import "@sandhata/spectra-tokens";
```

Import this exactly once, as early as possible (the app root layout, or the
top-level entry file). Do not import it per-component or per-page.

## Import components

```jsx
import { Button, Card, Badge } from "@sandhata/spectra";
```

- No `Sd` prefix on any component name.
- Every component is a named export from the single package root — there is
  no per-component subpath import (`@sandhata/spectra/Button` does not exist).
- See `components/overview.md` for the full export list.

## Requirements

- **React 18+** and **ReactDOM 18+** (peer dependencies — bring your own).
- **Framework-agnostic.** No Next.js-specific imports anywhere in the
  component source (`next/image`, `next/link`, `next/navigation`, `next/font`
  are all absent) — every component works under Vite, plain CRA, or any React
  18 bundler.
- Every interactive component is `"use client"` — if the target framework has
  a server/client component split (Next.js App Router, for example), render
  these inside a client boundary.

## What each component actually is

Plain `.jsx` using inline `style` objects with `var(--token)` values — not
CSS Modules, not styled-components/emotion, not Tailwind classes. If you're
generating a *new* component to sit alongside these, match that pattern:
inline style objects referencing tokens, not a new styling approach.
