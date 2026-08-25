"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

export const Sparkle = () => (
  <svg className="hero-sparkle" width="0.62em" height="0.62em" viewBox="0 0 64 64" fill="currentColor" aria-hidden="true">
    <path d="M42 4c1.6 9.8 5.4 13.6 15.2 15.2C47.4 20.8 43.6 24.6 42 34.4 40.4 24.6 36.6 20.8 26.8 19.2 36.6 17.6 40.4 13.8 42 4z"/>
    <path d="M16 30c1 6.4 3.5 8.9 9.9 9.9-6.4 1-8.9 3.5-9.9 9.9-1-6.4-3.5-8.9-9.9-9.9 6.4-1 8.9-3.5 9.9-9.9z"/>
  </svg>
);

const ACCENT_COLOR = "#d58b03";
type Tok = { text: string; color: string; noBreak?: boolean; isClarity?: boolean };

/** Read the current hero text color from the CSS token (theme-aware).
 * Queries .hero itself, not document.documentElement — --hero-text-color
 * is set scoped to .hero (e.g. forced white when the Grainient hero
 * background is active), and custom properties only cascade downward, so
 * reading from the <html> root (an ancestor of .hero) would silently miss
 * anything set below it. */
function getBaseColor(): string {
  if (typeof document === "undefined") return "#0a0a14";
  const scope = document.querySelector(".hero") ?? document.documentElement;
  return (
    getComputedStyle(scope)
      .getPropertyValue("--hero-text-color")
      .trim() || "#0a0a14"
  );
}

function buildTokens(baseColor: string): Tok[] {
  return [
    { text: "The",      color: baseColor },
    { text: "AI-ready", color: baseColor },
    { text: "design",   color: baseColor },
    { text: "system",   color: baseColor },
    { text: "built",    color: baseColor },
    { text: "for",      color: baseColor },
    { text: "clarity",  color: ACCENT_COLOR, noBreak: true, isClarity: true },
  ];
}
const SENTENCE_TEXT    = "The AI-ready design system built for clarity";
const MIN_PARTICLE_WIDTH = 960;
const ENTRANCE_LERP      = 0.08;   // exponential decay — no overshoot possible
const ENTRANCE_DURATION  = 1200;   // ms

/* ─── Particle ─────────────────────────────────────────────────────────── */
class Particle {
  x: number; y: number;
  originX: number; originY: number;
  vx = 0; vy = 0;
  size: number; color: string;
  dispersion: number; returnSpd: number;

  constructor(
    originX: number, originY: number,
    scatterX: number, scatterY: number,
    size: number, color: string,
    dispersion: number, returnSpd: number
  ) {
    this.x = scatterX; this.y = scatterY;
    this.originX = originX; this.originY = originY;
    this.size = size; this.color = color;
    this.dispersion = dispersion; this.returnSpd = returnSpd;
  }

  update(mouseX: number, mouseY: number, entering: boolean) {
    if (entering) {
      // Pure lerp — mathematically cannot overshoot
      this.x += (this.originX - this.x) * ENTRANCE_LERP;
      this.y += (this.originY - this.y) * ENTRANCE_LERP;
      this.vx = 0; this.vy = 0;
      return;
    }
    const dx = mouseX - this.x, dy = mouseY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const R = 120;
    if (dist < R && mouseX !== -1000) {
      const f = (R - dist) / R;
      this.vx -= (dx / dist) * f * this.dispersion;
      this.vy -= (dy / dist) * f * this.dispersion;
    }
    this.vx += (this.originX - this.x) * this.returnSpd;
    this.vy += (this.originY - this.y) * this.returnSpd;
    this.vx *= 0.85; this.vy *= 0.85;
    if (Math.hypot(this.x - this.originX, this.y - this.originY) < 1 && Math.random() > 0.95) {
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

/* ─── Text layout helpers ───────────────────────────────────────────────── */
function measureWord(ctx: CanvasRenderingContext2D, word: string, ls: number) {
  let w = 0;
  for (const ch of word) w += ctx.measureText(ch).width + ls;
  return w;
}
function drawWord(ctx: CanvasRenderingContext2D, word: string, x: number, y: number, ls: number) {
  let cx = x;
  for (const ch of word) { ctx.fillText(ch, cx, y); cx += ctx.measureText(ch).width + ls; }
  return cx;
}
function layoutLines(ctx: CanvasRenderingContext2D, tokens: Tok[], maxW: number, ls: number, spW: number) {
  const lines: Tok[][] = [[]]; let lw = 0;
  for (const tok of tokens) {
    const w = measureWord(ctx, tok.text, ls);
    const start = lines[lines.length - 1].length === 0;
    const add = w + (start ? 0 : spW);
    if (!start && !tok.noBreak && lw + add > maxW) { lines.push([tok]); lw = w; }
    else { lines[lines.length - 1].push(tok); lw += add; }
  }
  return lines;
}

/* Return a random point on one of the four viewport edges */
function viewportEdge(vw: number, vh: number): [number, number] {
  const edge = Math.floor(Math.random() * 4);
  switch (edge) {
    case 0: return [Math.random() * vw,               -40 - Math.random() * 60];         // top
    case 1: return [vw + 40 + Math.random() * 60,      Math.random() * vh];              // right
    case 2: return [Math.random() * vw,                vh + 40 + Math.random() * 60];    // bottom
    default: return [-40 - Math.random() * 60,         Math.random() * vh];              // left
  }
}

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function HeroParticleHeading() {
  const h1Ref      = useRef<HTMLHeadingElement>(null);
  const wrapRef    = useRef<HTMLDivElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);   // cursor-repulsion canvas (post-entrance)
  const sparkleRef = useRef<HTMLSpanElement>(null);
  const [mode, setMode] = useState<"static" | "particles">("static");
  const enteringRef = useRef(true);

  /* useLayoutEffect fires after hydration but BEFORE the browser paints →
     mode is set to "particles" before the user ever sees the static text.   */
  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () =>
      setMode(mq.matches || window.innerWidth < MIN_PARTICLE_WIDTH ? "static" : "particles");
    decide();
    mq.addEventListener("change", decide);
    window.addEventListener("resize", decide);
    return () => { mq.removeEventListener("change", decide); window.removeEventListener("resize", decide); };
  }, []);

  /* ── Entrance: full-viewport fixed canvas ─────────────────────────────
     Particles start at actual screen edges and travel visibly across the
     whole viewport. A regular canvas inside the h1 would clip them. */
  useEffect(() => {
    if (mode !== "particles") return;
    const h1   = h1Ref.current;
    const wrap = wrapRef.current;
    if (!h1 || !wrap) return;

    const dpr = window.devicePixelRatio || 1;
    const vw  = window.innerWidth;
    const vh  = window.innerHeight;

    /* Scratch canvas: sample the text glyphs to get pixel positions.
       Sized to the h1's own rendered dimensions. */
    const scratch = document.createElement("canvas");
    const sCtx    = scratch.getContext("2d", { willReadFrequently: true });
    if (!sCtx) return;

    const cs   = window.getComputedStyle(h1);
    const fs   = parseFloat(cs.fontSize)      || 80;
    const lh   = parseFloat(cs.lineHeight)    || fs * 1.2;
    const ls   = parseFloat(cs.letterSpacing) || 0;
    const ff   = cs.fontFamily;
    const cssW = wrap.clientWidth;
    if (!cssW) return;

    sCtx.font = `400 ${fs}px ${ff}`;
    const spW   = measureWord(sCtx, " ", ls);
    const TOKENS = buildTokens(getBaseColor());
    const lines = layoutLines(sCtx, TOKENS, cssW, ls, spW);
    const cssH  = lines.length * lh;

    scratch.width  = cssW * dpr;
    scratch.height = cssH * dpr;
    sCtx.scale(dpr, dpr);
    sCtx.font         = `400 ${fs}px ${ff}`;
    sCtx.textAlign    = "left";
    sCtx.textBaseline = "middle";
    sCtx.clearRect(0, 0, cssW, cssH);

    let clarityEndX = 0, clarityCY = 0;
    lines.forEach((line, li) => {
      const y = li * lh + lh / 2;
      const lw = line.reduce((s, t, i) => s + measureWord(sCtx, t.text, ls) + (i > 0 ? spW : 0), 0);
      let x = (cssW - lw) / 2;
      line.forEach((tok, i) => {
        if (i > 0) x += spW;
        sCtx.fillStyle = tok.color;
        x = drawWord(sCtx, tok.text, x, y, ls);
        if (tok.isClarity) { clarityEndX = x; clarityCY = y; }
      });
    });

    /* h1's position in the viewport: used to offset sampled pixel coords
       so origins land exactly on the rendered text in viewport space. */
    const h1Rect = h1.getBoundingClientRect();
    const offX   = h1Rect.left + (h1Rect.width - cssW) / 2;
    const offY   = h1Rect.top;

    /* Sample glyphs → build particles with viewport-space origins */
    const step   = Math.max(1, Math.round((fs / 80) * 1.8 * dpr));
    const pSize  = Math.max(0.6, fs / 80);
    const img    = sCtx.getImageData(0, 0, scratch.width, scratch.height);
    const particles: Particle[] = [];

    for (let py = 0; py < img.height; py += step) {
      for (let px = 0; px < img.width; px += step) {
        const i = (py * img.width + px) * 4;
        if (img.data[i + 3] > 128) {
          const [sx, sy] = viewportEdge(vw, vh);
          particles.push(new Particle(
            offX + px / dpr, offY + py / dpr,
            sx, sy,
            pSize, `rgb(${img.data[i]},${img.data[i+1]},${img.data[i+2]})`,
            13, 0.12
          ));
        }
      }
    }

    /* Full-viewport fixed canvas — particles visible across the entire screen */
    const ec = document.createElement("canvas");
    ec.width  = vw * dpr;
    ec.height = vh * dpr;
    ec.style.cssText = `position:fixed;inset:0;z-index:9999;pointer-events:none;`;
    ec.style.width   = `${vw}px`;
    ec.style.height  = `${vh}px`;
    document.body.appendChild(ec);
    const ectx = ec.getContext("2d")!;
    ectx.scale(dpr, dpr);

    let raf = 0;
    let entering = true;

    const animate = () => {
      ectx.clearRect(0, 0, vw, vh);
      for (const p of particles) { p.update(-1000, -1000, entering); p.draw(ectx); }
      raf = requestAnimationFrame(animate);
    };
    animate();

    /* After entrance: fade out the full-viewport canvas, start cursor-
       repulsion on the regular (text-block) canvas. */
    const endEntrance = setTimeout(() => {
      entering = false;
      /* Quick fade-out */
      ec.style.transition = "opacity 0.3s ease";
      ec.style.opacity    = "0";
      setTimeout(() => { cancelAnimationFrame(raf); ec.remove(); }, 350);

      /* Hand off to the cursor-repulsion canvas */
      startCursorCanvas();
    }, ENTRANCE_DURATION);

    return () => {
      clearTimeout(endEntrance);
      cancelAnimationFrame(raf);
      ec.remove();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  /* ── Cursor-repulsion canvas (text-block size, post-entrance) ────────── */
  const cursorRafRef      = useRef(0);
  const cursorCleanupRef  = useRef<(() => void) | null>(null);

  const startCursorCanvas = () => {
    const h1     = h1Ref.current;
    const wrap   = wrapRef.current;
    const canvas = canvasRef.current;
    if (!h1 || !wrap || !canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let particles: Particle[] = [];
    let mouseX = -1000, mouseY = -1000;
    let cssWidth = 0, cssHeight = 0;

    const init = () => {
      const cs   = window.getComputedStyle(h1);
      const fs   = parseFloat(cs.fontSize)      || 80;
      const lh   = parseFloat(cs.lineHeight)    || fs * 1.2;
      const ls   = parseFloat(cs.letterSpacing) || 0;
      const ff   = cs.fontFamily;
      cssWidth = wrap.clientWidth;
      if (!cssWidth) return;

      const dpr = window.devicePixelRatio || 1;
      ctx.font = `400 ${fs}px ${ff}`;
      const spW   = measureWord(ctx, " ", ls);
      const TOKENS = buildTokens(getBaseColor());
      const lines = layoutLines(ctx, TOKENS, cssWidth, ls, spW);
      cssHeight = lines.length * lh;

      canvas.width  = cssWidth  * dpr;
      canvas.height = cssHeight * dpr;
      canvas.style.width  = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;
      wrap.style.height   = `${cssHeight}px`;
      ctx.scale(dpr, dpr);
      ctx.font = `400 ${fs}px ${ff}`;
      ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.clearRect(0, 0, cssWidth, cssHeight);

      let clarityEndX = 0, clarityCY = 0;
      lines.forEach((line, li) => {
        const y = li * lh + lh / 2;
        const lw = line.reduce((s, t, i) => s + measureWord(ctx, t.text, ls) + (i > 0 ? spW : 0), 0);
        let x = (cssWidth - lw) / 2;
        line.forEach((tok, i) => {
          if (i > 0) x += spW;
          ctx.fillStyle = tok.color;
          x = drawWord(ctx, tok.text, x, y, ls);
          if (tok.isClarity) { clarityEndX = x; clarityCY = y; }
        });
      });

      const step  = Math.max(1, Math.round((fs / 80) * 1.8 * dpr));
      const pSize = Math.max(0.6, fs / 80);
      const img   = ctx.getImageData(0, 0, canvas.width, canvas.height);
      particles = [];
      for (let py = 0; py < img.height; py += step) {
        for (let px = 0; px < img.width; px += step) {
          const i = (py * img.width + px) * 4;
          if (img.data[i + 3] > 128) {
            particles.push(new Particle(
              px / dpr, py / dpr,
              px / dpr, py / dpr,   // no scatter — already at origin post-entrance
              pSize, `rgb(${img.data[i]},${img.data[i+1]},${img.data[i+2]})`,
              13, 0.12
            ));
          }
        }
      }

      const sparkle = sparkleRef.current;
      if (sparkle) {
        const sz = fs * 0.62;
        sparkle.style.left = `${clarityEndX + 2}px`;
        sparkle.style.top  = `${clarityCY - sz * 0.75}px`;
      }
    };

    init();

    const tick = () => {
      ctx.clearRect(0, 0, cssWidth, cssHeight);
      for (const p of particles) { p.update(mouseX, mouseY, false); p.draw(ctx); }
      cursorRafRef.current = requestAnimationFrame(tick);
    };
    tick();

    const onMove  = (e: MouseEvent) => { const r = canvas.getBoundingClientRect(); mouseX = e.clientX - r.left; mouseY = e.clientY - r.top; };
    const onLeave = () => { mouseX = -1000; mouseY = -1000; };
    const onTouch = (e: TouchEvent) => { if (!e.touches[0]) return; const r = canvas.getBoundingClientRect(); mouseX = e.touches[0].clientX - r.left; mouseY = e.touches[0].clientY - r.top; };

    canvas.addEventListener("mousemove",  onMove);
    canvas.addEventListener("mouseleave", onLeave);
    canvas.addEventListener("touchstart", onTouch, { passive: true });
    canvas.addEventListener("touchmove",  onTouch, { passive: true });
    canvas.addEventListener("touchend",   onLeave);

    const ro = new ResizeObserver(() => init());
    ro.observe(wrap);

    cursorCleanupRef.current = () => {
      cancelAnimationFrame(cursorRafRef.current);
      canvas.removeEventListener("mousemove",  onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      canvas.removeEventListener("touchstart", onTouch);
      canvas.removeEventListener("touchmove",  onTouch);
      canvas.removeEventListener("touchend",   onLeave);
      ro.disconnect();
    };
  };

  /* Cleanup cursor canvas on unmount */
  useEffect(() => () => { cursorCleanupRef.current?.(); }, []);

  return (
    <h1 ref={h1Ref}>
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
