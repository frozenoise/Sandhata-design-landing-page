"use client";

/* Cursor-driven particle-dispersion hero heading.
 *
 * Mechanism adapted from componentry.dev's "Cursor-Driven Particle
 * Typography" (Canvas2D text → pixel sampling → spring-physics particles
 * that repel from the cursor and return to origin). The reference does a
 * single unwrapped fillText() of one short bold word; this adapts that
 * mechanism for Sandhata's full hero sentence — see the section comments
 * below for what changed and why.
 */

import React, { useEffect, useRef, useState } from "react";

/* ── Sparkle icon — kept as a real SVG, not rasterized into the particle
   field; positioned via ref after each layout pass (see init() below). ─ */
export const Sparkle = () => (
  <svg className="hero-sparkle" width="0.62em" height="0.62em" viewBox="0 0 64 64" fill="currentColor" aria-hidden="true">
    <path d="M42 4c1.6 9.8 5.4 13.6 15.2 15.2C47.4 20.8 43.6 24.6 42 34.4 40.4 24.6 36.6 20.8 26.8 19.2 36.6 17.6 40.4 13.8 42 4z"/>
    <path d="M16 30c1 6.4 3.5 8.9 9.9 9.9-6.4 1-8.9 3.5-9.9 9.9-1-6.4-3.5-8.9-9.9-9.9 6.4-1 8.9-3.5 9.9-9.9z"/>
  </svg>
);

/* ── Word tokens for the particle layout pass ──────────────────────
   Mirrors the static markup's text + two-colour split (base sentence vs.
   "clarity" in .hero h1 em's amber) and its &nbsp; join between "for" and
   "clarity" — `noBreak` on the "clarity" token means the wrap pass must
   never split that pair, same as the real non-breaking space does. */
const BASE_COLOR = "#000"; // must match .hero h1
const ACCENT_COLOR = "#d58b03"; // must match .hero h1 em
type Tok = { text: string; color: string; noBreak?: boolean; isClarity?: boolean };
const TOKENS: Tok[] = [
  { text: "The", color: BASE_COLOR },
  { text: "AI-ready", color: BASE_COLOR },
  { text: "design", color: BASE_COLOR },
  { text: "system", color: BASE_COLOR },
  { text: "built", color: BASE_COLOR },
  { text: "for", color: BASE_COLOR },
  { text: "clarity", color: ACCENT_COLOR, noBreak: true, isClarity: true },
];
const SENTENCE_TEXT = "The AI-ready design system built for clarity";

/* Below the hero's own tablet breakpoint (.hero h1 drops to 54px, then
   36px at 640px — see app/globals.css) the particle sampling step can't
   shrink enough to stay legible: live-tested at 36px the sampled sentence
   degraded to an illegible blob rather than readable letters. Rather than
   ship that, fall back to the plain static heading below 960px, same as
   the reduced-motion path — a pragmatic width cutoff instead of chasing
   per-breakpoint particle tuning for a heading that's this small anyway. */
const MIN_PARTICLE_WIDTH = 960;

class Particle {
  x: number; y: number; originX: number; originY: number;
  vx: number; vy: number; size: number; color: string;
  dispersion: number; returnSpd: number;
  constructor(x: number, y: number, size: number, color: string, dispersion: number, returnSpd: number) {
    this.x = x + (Math.random() - 0.5) * 10;
    this.y = y + (Math.random() - 0.5) * 10;
    this.originX = x; this.originY = y;
    this.vx = (Math.random() - 0.5) * 5; this.vy = (Math.random() - 0.5) * 5;
    this.size = size; this.color = color;
    this.dispersion = dispersion; this.returnSpd = returnSpd;
  }
  update(mouseX: number, mouseY: number) {
    const dx = mouseX - this.x, dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const interactionRadius = 120;
    if (distance < interactionRadius && mouseX !== -1000 && mouseY !== -1000) {
      const fx = dx / distance, fy = dy / distance;
      const force = (interactionRadius - distance) / interactionRadius;
      this.vx -= fx * force * this.dispersion;
      this.vy -= fy * force * this.dispersion;
    }
    this.vx += (this.originX - this.x) * this.returnSpd;
    this.vy += (this.originY - this.y) * this.returnSpd;
    this.vx *= 0.85; this.vy *= 0.85;
    const distToOrigin = Math.sqrt((this.x - this.originX) ** 2 + (this.y - this.originY) ** 2);
    if (distToOrigin < 1 && Math.random() > 0.95) {
      this.vx += (Math.random() - 0.5) * 0.2;
      this.vy += (Math.random() - 0.5) * 0.2;
    }
    this.x += this.vx; this.y += this.vy;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* Manual per-character advance so canvas text respects the hero's -2px
   letter-spacing. Canvas2D's native `ctx.letterSpacing` exists in modern
   Chrome/Firefox but not everywhere, so we do the kerning by hand instead
   of depending on it — this also gives us exact per-character x positions
   for free, which the wrap/centering math below needs anyway. */
function measureWord(ctx: CanvasRenderingContext2D, text: string, letterSpacing: number) {
  let w = 0;
  for (const ch of text) w += ctx.measureText(ch).width + letterSpacing;
  return w;
}
function drawWord(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, letterSpacing: number) {
  let cx = x;
  for (const ch of text) {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + letterSpacing;
  }
  return cx;
}

/* Real line-wrapping: greedy word-wrap against the container's actual
   rendered width, honouring `noBreak` tokens (the "for"/"clarity" nbsp
   pair) the same way the browser's own text layout would. */
function layoutLines(ctx: CanvasRenderingContext2D, tokens: Tok[], maxWidth: number, letterSpacing: number, spaceWidth: number) {
  const lines: Tok[][] = [[]];
  let lineWidth = 0;
  for (const tok of tokens) {
    const w = measureWord(ctx, tok.text, letterSpacing);
    const atLineStart = lines[lines.length - 1].length === 0;
    const addWidth = w + (atLineStart ? 0 : spaceWidth);
    if (!atLineStart && !tok.noBreak && lineWidth + addWidth > maxWidth) {
      lines.push([tok]);
      lineWidth = w;
    } else {
      lines[lines.length - 1].push(tok);
      lineWidth += addWidth;
    }
  }
  return lines;
}

export default function HeroParticleHeading() {
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparkleRef = useRef<HTMLSpanElement>(null);
  const [mode, setMode] = useState<"static" | "particles">("static");

  /* prefers-reduced-motion → plain static heading, no animation at all
     (same pattern as .hero-aurora's reduced-motion guard in globals.css).
     Narrow viewports (< MIN_PARTICLE_WIDTH) get the same static fallback —
     see the comment on that constant above. */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () => setMode(mq.matches || window.innerWidth < MIN_PARTICLE_WIDTH ? "static" : "particles");
    decide();
    mq.addEventListener("change", decide);
    window.addEventListener("resize", decide);
    return () => {
      mq.removeEventListener("change", decide);
      window.removeEventListener("resize", decide);
    };
  }, []);

  useEffect(() => {
    if (mode !== "particles") return;
    const h1 = h1Ref.current, wrap = wrapRef.current, canvas = canvasRef.current;
    if (!h1 || !wrap || !canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let raf = 0;
    let particles: Particle[] = [];
    let mouseX = -1000, mouseY = -1000;
    let cssWidth = 0, cssHeight = 0;

    const init = () => {
      // Read the hero heading's own live computed type (font-size,
      // line-height, letter-spacing, font-family) instead of hardcoding
      // numbers here — this is what makes the layout track .hero h1's
      // 80px/54px/36px responsive breakpoints in globals.css automatically,
      // with no separate JS media-query logic to keep in sync.
      const computed = window.getComputedStyle(h1);
      const fontSizePx = parseFloat(computed.fontSize) || 80;
      const lineHeightPx = parseFloat(computed.lineHeight) || fontSizePx * 1.2;
      const letterSpacing = parseFloat(computed.letterSpacing) || 0;
      const fontFamily = computed.fontFamily;
      cssWidth = wrap.clientWidth;
      if (!cssWidth) return;

      const dpr = window.devicePixelRatio || 1;
      ctx.font = `400 ${fontSizePx}px ${fontFamily}`; // 400 = Regular; never bold (unlike the reference)
      const spaceWidth = measureWord(ctx, " ", letterSpacing);
      const lines = layoutLines(ctx, TOKENS, cssWidth, letterSpacing, spaceWidth);
      cssHeight = lines.length * lineHeightPx;

      canvas.width = cssWidth * dpr;
      canvas.height = cssHeight * dpr;
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;
      wrap.style.height = `${cssHeight}px`;
      ctx.scale(dpr, dpr); // canvas.width/height assignment above already reset the transform
      ctx.font = `400 ${fontSizePx}px ${fontFamily}`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.clearRect(0, 0, cssWidth, cssHeight);

      // Draw each colour segment in its own fillStyle (per-segment colour,
      // adaptation #2) — particles below read colour straight back off the
      // rendered pixels rather than tagging by bounding box, so kerning and
      // anti-aliasing can't cause a particle to pick up the wrong colour.
      let clarityEndX = 0, clarityCenterY = 0;
      lines.forEach((line, li) => {
        const y = li * lineHeightPx + lineHeightPx / 2;
        const lineWidth = line.reduce(
          (sum, tok, i) => sum + measureWord(ctx, tok.text, letterSpacing) + (i > 0 ? spaceWidth : 0), 0
        );
        let x = (cssWidth - lineWidth) / 2;
        line.forEach((tok, i) => {
          if (i > 0) x += spaceWidth;
          ctx.fillStyle = tok.color;
          x = drawWord(ctx, tok.text, x, y, letterSpacing);
          if (tok.isClarity) { clarityEndX = x; clarityCenterY = y; }
        });
      });

      // Sample rendered glyphs into particles — dense preset. Step scales
      // with font-size so the 54px/36px responsive breakpoints don't
      // under-sample into an illegible blob. Note: componentry.dev's docs
      // page shows a "Fine Particles (High Density)" preview but doesn't
      // publish its config (confirmed live — only the default preset's code
      // is shown), and no "ParticleTypographyDense" export exists on that
      // site; there's nothing to import here. This is our own dense preset:
      // a smaller step than the earlier default (was 3x) and a smaller
      // per-particle size so the finer sampling reads as crisp grain rather
      // than overlapping blobs, re-verified live for legibility + 60fps.
      const step = Math.max(1, Math.round((fontSizePx / 80) * 1.8 * dpr));
      const particleSize = Math.max(0.6, 1.0 * (fontSizePx / 80));
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      particles = [];
      for (let py = 0; py < imgData.height; py += step) {
        for (let px = 0; px < imgData.width; px += step) {
          const idx = (py * imgData.width + px) * 4;
          const alpha = imgData.data[idx + 3];
          if (alpha > 128) {
            const r = imgData.data[idx], g = imgData.data[idx + 1], b = imgData.data[idx + 2];
            particles.push(new Particle(px / dpr, py / dpr, particleSize, `rgb(${r},${g},${b})`, 13, 0.12));
          }
        }
      }

      // Position the real SVG sparkle just past "clarity"'s sampled end
      // (adaptation #4 — never rasterized into the particle field).
      const sparkle = sparkleRef.current;
      if (sparkle) {
        const size = fontSizePx * 0.62;
        sparkle.style.left = `${clarityEndX + 2}px`;
        sparkle.style.top = `${clarityCenterY - size * 0.75}px`;
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, cssWidth, cssHeight);
      particles.forEach((p) => { p.update(mouseX, mouseY); p.draw(ctx); });
      raf = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    const handleLeave = () => { mouseX = -1000; mouseY = -1000; };
    const handleTouch = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const rect = canvas.getBoundingClientRect();
      mouseX = e.touches[0].clientX - rect.left;
      mouseY = e.touches[0].clientY - rect.top;
    };

    const timeoutId = setTimeout(() => { init(); animate(); }, 100);
    const resizeObserver = new ResizeObserver(() => init());
    resizeObserver.observe(wrap);

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleLeave);
    canvas.addEventListener("touchstart", handleTouch);
    canvas.addEventListener("touchmove", handleTouch);
    canvas.addEventListener("touchend", handleLeave);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleLeave);
      canvas.removeEventListener("touchstart", handleTouch);
      canvas.removeEventListener("touchmove", handleTouch);
      canvas.removeEventListener("touchend", handleLeave);
      cancelAnimationFrame(raf);
    };
  }, [mode]);

  return (
    <h1 ref={h1Ref}>
      {/* Single source of truth for assistive tech + no-JS crawlers. The
          visible presentation below (static text OR canvas) is always
          aria-hidden so it's never double-announced, in either mode. */}
      <span className="hero-particle-srtext">{SENTENCE_TEXT}</span>

      {mode === "static" ? (
        <span aria-hidden="true">
          The AI-ready design system built for&nbsp;<em>clarity<Sparkle/></em>
        </span>
      ) : (
        <div ref={wrapRef} aria-hidden="true" className="hero-particle-wrap">
          <canvas ref={canvasRef} className="hero-particle-canvas" />
          <span ref={sparkleRef} className="hero-particle-sparkle"><Sparkle/></span>
        </div>
      )}
    </h1>
  );
}
