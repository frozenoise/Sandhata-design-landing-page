"use client";

import React from "react";
import "../globals.css";
import { ThemeToggle } from "../_docs/ThemeToggle";
import { CookieSettingsLink } from "../_consent/CookieConsent";

// Cookie policy. Keep this in step with what the code actually stores: the
// NextAuth cookies (lib/auth.ts), the localStorage keys in app/builder and
// app/_docs/ThemeToggle, and the consent banner (app/_consent).
const ESSENTIAL: [string, string, string][] = [
  ["authjs.session-token", "Keeps you signed in to the builder.", "30 days, or until you sign out"],
  ["authjs.csrf-token", "Protects sign-in and sign-out forms from cross-site request forgery.", "Session"],
  ["authjs.callback-url", "Returns you to the page you were on after signing in.", "Session"],
  ["authjs.pkce.code_verifier, authjs.state", "Secure the Google or GitHub sign-in handshake.", "15 minutes"],
];

const STORAGE: [string, string][] = [
  ["sd-cookie-consent", "Your choice on this banner, so we don't ask again."],
  ["sd-theme", "Light or dark theme."],
  ["sd-builder-* (several keys)", "Your work in progress in the builder: open pages, the current design, chat, model choice and panel layout."],
  ["sd-builder-api-key", "Your Anthropic API key, only if you add one without signing in. It never leaves your browser except to make your own generation requests."],
  ["bld-getting-started-hidden", "Whether you minimised the Getting started checklist."],
];

const h2: React.CSSProperties = { font: "700 22px/1.3 var(--font-bold)", color: "var(--text-title)", margin: "40px 0 12px" };
const p: React.CSSProperties = { font: "16px/1.65 var(--font-normal)", color: "var(--text-body)", margin: "0 0 14px" };

export default function CookiePolicyPage() {
  return (
    <div>
      <header className="nav">
        <a className="nav-logo" href="/">
          <img src="/assets/logo/sandhata-logo.svg" alt="Sandhata" />
        </a>
        <nav className="nav-links">
          <a className="nl" href="/components">Components</a>
          <a className="nl" href="/documentation">Documentation</a>
          <a className="nl" href="/builder">Builder</a>
          <a className="nl" href="/showcase">Showcase</a>
        </nav>
        <ThemeToggle className="nav-theme-btn" />
      </header>

      <main style={{ background: "var(--page)", padding: "64px 24px 96px" }}>
        <article style={{ maxWidth: 760, margin: "0 auto" }}>
          <h1 style={{ font: "700 44px/1.15 var(--font-bold)", color: "var(--text-title)", letterSpacing: "-1px", margin: "0 0 12px" }}>
            Cookie policy
          </h1>
          <p style={{ ...p, color: "var(--text-caption)", fontSize: 14 }}>Last updated 4 November 2026</p>

          <p style={p}>
            Spectra, the Sandhata Design System site and AI builder, uses a small number of cookies and
            similar browser storage. This page lists them and explains the choice you have.
          </p>

          <h2 style={h2}>Essential cookies</h2>
          <p style={p}>
            These make sign-in and the builder work, so they don&apos;t need your consent. They are only
            set when you sign in. On the live site their names start with <code>__Secure-</code> or{" "}
            <code>__Host-</code>.
          </p>
          <table className="cookie-table">
            <thead><tr><th>Cookie</th><th>What it does</th><th>How long</th></tr></thead>
            <tbody>
              {ESSENTIAL.map(([name, what, how]) => (
                <tr key={name}><td><code>{name}</code></td><td>{what}</td><td>{how}</td></tr>
              ))}
            </tbody>
          </table>

          <h2 style={h2}>Storage in your browser</h2>
          <p style={p}>
            Spectra also saves a few things in your browser&apos;s local storage so your work and settings
            are still there next time. This stays on your device; clearing your browser data removes it.
          </p>
          <table className="cookie-table">
            <thead><tr><th>Key</th><th>What it stores</th></tr></thead>
            <tbody>
              {STORAGE.map(([key, what]) => (
                <tr key={key}><td><code>{key}</code></td><td>{what}</td></tr>
              ))}
            </tbody>
          </table>

          <h2 style={h2}>Analytics (optional)</h2>
          <p style={p}>
            If you choose &ldquo;Accept analytics&rdquo;, we load Vercel Web Analytics to count page views and
            see which pages are used. It doesn&apos;t set cookies. If you choose &ldquo;Essential only&rdquo;, it
            isn&apos;t loaded at all.
          </p>

          <h2 style={h2}>Other services</h2>
          <p style={p}>
            Fonts load from Google Fonts, so Google receives your IP address when a page loads. If you sign
            in with Google or GitHub, those sites set their own cookies on their own domains under their
            own policies.
          </p>

          <h2 style={h2}>Changing your choice</h2>
          <p style={p}>
            You can change your mind at any time: <CookieSettingsLink className="cookie-settings-inline" />.
            You can also block or delete cookies in your browser settings, but you won&apos;t be able to stay
            signed in to the builder without the essential ones.
          </p>
        </article>
      </main>
    </div>
  );
}
