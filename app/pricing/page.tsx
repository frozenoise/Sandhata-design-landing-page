"use client";

import React from "react";
import "../globals.css";

export default function PricingPage() {
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
          <a className="nl" href="/demo">Demo</a>
        </nav>
      </header>

      <section style={{
        minHeight: "calc(100vh - 100px)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "80px 40px", textAlign: "center",
        background: "var(--page)",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "5px 14px", borderRadius: 20,
          background: "#EEF3FF", color: "#0036DD",
          font: "700 12px/1 'IBM Plex Sans', system-ui",
          letterSpacing: "0.5px", marginBottom: 32,
        }}>
          Coming soon
        </div>

        <h1 style={{
          font: "700 64px/1.1 'IBM Plex Sans', system-ui",
          color: "#0a0a14", letterSpacing: "-2px",
          maxWidth: 580, marginBottom: 20,
        }}>
          Pricing
        </h1>

        <p style={{
          font: "400 18px/1.6 'IBM Plex Sans', system-ui",
          color: "#6b7280", maxWidth: 440, marginBottom: 48,
        }}>
          We are working on our pricing plans. Check back soon — or get notified when we launch.
        </p>

        <a href="/" style={{
          display: "inline-flex", alignItems: "center", height: 48,
          padding: "0 32px", borderRadius: 4,
          background: "#0036DD", color: "#fff",
          font: "700 16px/1 'IBM Plex Sans', system-ui",
          textDecoration: "none",
          transition: "background .12s",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "#0029b0")}
        onMouseLeave={e => (e.currentTarget.style.background = "#0036DD")}
        >
          Back to home
        </a>
      </section>
    </div>
  );
}
