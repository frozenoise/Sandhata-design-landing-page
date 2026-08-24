"use client";

import React from "react";

type ThemeMode = "auto" | "light" | "dark";

// Module-level cleanup handle for the system-preference listener
let _mqCleanup: (() => void) | null = null;

/**
 * Resolves which data-theme value to stamp on <html> and sets it.
 * - "light" / "dark" → set directly.
 * - "auto"           → read prefers-color-scheme, set "dark"/"light" accordingly,
 *                      and attach a MediaQueryList listener so live system changes
 *                      are reflected without a page reload.
 *
 * Always stamps an attribute (never removes it) so the [data-theme="dark"] selectors
 * in colors.css fire reliably — no media-query duplication required.
 */
export function applyTheme(mode: ThemeMode) {
  // Clean up any existing media-query listener
  if (_mqCleanup) { _mqCleanup(); _mqCleanup = null; }

  const html = document.documentElement;

  if (mode === "dark") {
    html.setAttribute("data-theme", "dark");
  } else if (mode === "light") {
    html.setAttribute("data-theme", "light");
  } else {
    // auto: resolve immediately, then track system changes
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    html.setAttribute("data-theme", mq.matches ? "dark" : "light");
    const handler = (e: MediaQueryListEvent) =>
      html.setAttribute("data-theme", e.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    _mqCleanup = () => mq.removeEventListener("change", handler);
  }
}

const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="2"  x2="12" y2="4"/>  <line x1="12" y1="20" x2="12" y2="22"/>
    <line x1="4.22" y1="4.22"  x2="5.64"  y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="2" y1="12" x2="4"  y2="12"/> <line x1="20" y1="12" x2="22" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64"  y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
const SystemIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/>
    <line x1="8"  y1="21" x2="16" y2="21"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);

/** Cycles: auto → light → dark → auto */
export function ThemeToggle({ className }: { className?: string }) {
  const [mode, setMode] = React.useState<ThemeMode>("auto");

  React.useEffect(() => {
    const saved = (localStorage.getItem("sd-theme") || "auto") as ThemeMode;
    setMode(saved);
    applyTheme(saved);
    return () => { if (_mqCleanup) { _mqCleanup(); _mqCleanup = null; } };
  }, []);

  function cycle() {
    const next: ThemeMode = mode === "auto" ? "light" : mode === "light" ? "dark" : "auto";
    setMode(next);
    localStorage.setItem("sd-theme", next);
    applyTheme(next);
  }

  const titles: Record<ThemeMode, string> = {
    auto:  "System theme — click for light",
    light: "Light mode — click for dark",
    dark:  "Dark mode — click for system",
  };

  return (
    <button
      className={className || "doc-theme-btn"}
      onClick={cycle}
      title={titles[mode]}
      aria-label={titles[mode]}
    >
      {mode === "auto" ? <SystemIcon /> : mode === "light" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
