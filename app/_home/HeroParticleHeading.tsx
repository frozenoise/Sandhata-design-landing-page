"use client";

import React, { useEffect, useRef, useState } from "react";

export const Sparkle = () => (
  <svg className="hero-sparkle" width="0.62em" height="0.62em" viewBox="0 0 64 64" fill="currentColor" aria-hidden="true">
    <path d="M42 4c1.6 9.8 5.4 13.6 15.2 15.2C47.4 20.8 43.6 24.6 42 34.4 40.4 24.6 36.6 20.8 26.8 19.2 36.6 17.6 40.4 13.8 42 4z"/>
    <path d="M16 30c1 6.4 3.5 8.9 9.9 9.9-6.4 1-8.9 3.5-9.9 9.9-1-6.4-3.5-8.9-9.9-9.9 6.4-1 8.9-3.5 9.9-9.9z"/>
  </svg>
);

const BASE_COLOR = "#000";
const ACCENT_COLOR = "#d58b03";
type Tok = { text: string; color: string; noBreak?: boolean; isClarity?: boolean };
const TOKENS: Tok[] = [
  { text: "The",      color: BASE_COLOR },
  { text: "AI-ready", color: BASE_COLOR },
  { text: "design",   color: BASE_COLOR },
  { text: "system",   color: BASE_COLOR },
  { text: "built",    color: BASE_COLOR },
  { text: "for",      color: BASE_COLOR },
  { text: "clarity",  color: ACCENT_COLOR, noBreak: true, isClarity: true },
];
const SENTENCE_TEXT = "The AI-ready design system built for clarity";
const MIN_PARTICLE_WIDTH = 960;

/* Lerp factor per frame during entrance. 0.09 at 60fps → ~95% converged
   by 0.8s, fully settled by 1.1s. No spring = no bounce. */
const ENTRANCE_LERP  = 0.09;
const ENTRANCE_DURATION = 1100; // ms until cursor physics engage

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
    this.x = scatterX;
    this.y = scatterY;
    this.originX = originX;
    this.originY = originY;
    this.size = size;
    this.color = color;
    this.dispersion = dispersion;
    this.returnSpd = returnSpd;
  }

  update(mouseX: number, mouseY: number, entering: boolean) {
    if (entering) {
      /* Pure exponential lerp — no velocity accumulation, no overshoot. */
      this.x += (this.originX - this.x) * ENTRANCE_LERP;
      this.y += (this.originY - this.y) * ENTRANCE_LERP;
      this.vx = 0;
      this.vy = 0;
      return;
    }

    /* Normal mode: cursor repulsion + spring return. */
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
    this.vx *= 0.85;
    this.vy *= 0.85;
    if (Math.hypot(this.x - this.originX, this.y - this.originY) < 1 && Math.random() > 0.95) {
      this.vx += (Math.random() - 0.5) * 0.2;
      this.vy += (Math.random() - 0.5) * 0.2;
    }
    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

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
  const lines: Tok[][] = [[]];
  let lw = 0;
  for (const tok of tokens) {
    const w = measureWord(ctx, tok.text, ls);
    const start = lines[lines.length - 1].length === 0;
    const add = w + (start ? 0 : spW);
    if (!start && !tok.noBreak && lw + add > maxW) { lines.push([tok]); lw = w; }
    else { lines[lines.length - 1].push(tok); lw += add; }
  }
  return lines;
}

/* Given the canvas's bounding rect on screen, return a random position on
   one of the four viewport edges expressed in canvas-local coordinates.
   Particles placed here are off-canvas (invisible) and fly inward. */
function viewportEdgeScatter(rect: DOMRect): [number, number] {
  const vw = window.innerWidth, vh = window.innerHeight;
  const edge = Math.floor(Math.random() * 4); // 0 top 1 right 2 bottom 3 left
  switch (edge) {
    case 0: return [Math.random() * vw - rect.left, -rect.top - Math.random() * 80];
    case 1: return [vw - rect.left + Math.random() * 80, Math.random() * vh - rect.top];
    case 2: return [Math.random() * vw - rect.left, vh - rect.top + Math.random() * 80];
    default: return [-rect.left - Math.random() * 80, Math.random() * vh - rect.top];
  }
}

export default function HeroParticleHeading() {
  const h1Ref    = useRef<HTMLHeadingElement>(null);
  const wrapRef  = useRef<HTMLDivElement>(null);
  const canvasRef= useRef<HTMLCanvasElement>(null);
  const sparkleRef = useRef<HTMLSpanElement>(null);
  const [mode, setMode] = useState<"static" | "particles">("static");
  const enteringRef = useRef(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () => setMode(
      mq.matches || window.innerWidth < MIN_PARTICLE_WIDTH ? "static" : "particles"
    );
    decide();
    mq.addEventListener("change", decide);
    window.addEventListener("resize", decide);
    return () => { mq.removeEventListener("change", decide); window.removeEventListener("resize", decide); };
  }, []);

  useEffect(() => {
    if (mode !== "particles") return;
    const h1 = h1Ref.current, wrap = wrapRef.current, canvas = canvasRef.current;
    if (!h1 || !wrap || !canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let raf = 0, particles: Particle[] = [];
    let mouseX = -1000, mouseY = -1000;
    let cssWidth = 0, cssHeight = 0;
    enteringRef.current = true;

    const init = (isResize = false) => {
      const cs = window.getComputedStyle(h1);
      const fs   = parseFloat(cs.fontSize)    || 80;
      const lh   = parseFloat(cs.lineHeight)  || fs * 1.2;
      const ls   = parseFloat(cs.letterSpacing) || 0;
      const ff   = cs.fontFamily;
      cssWidth = wrap.clientWidth;
      if (!cssWidth) return;

      const dpr = window.devicePixelRatio || 1;
      ctx.font = `400 ${fs}px ${ff}`;
      const spW = measureWord(ctx, " ", ls);
      const lines = layoutLines(ctx, TOKENS, cssWidth, ls, spW);
      cssHeight = lines.length * lh;

      canvas.width  = cssWidth  * dpr;
      canvas.height = cssHeight * dpr;
      canvas.style.width  = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;
      wrap.style.height   = `${cssHeight}px`;
      ctx.scale(dpr, dpr);
      ctx.font = `400 ${fs}px ${ff}`;
      ctx.textAlign    = "left";
      ctx.textBaseline = "middle";
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

      const step = Math.max(1, Math.round((fs / 80) * 1.8 * dpr));
      const pSize = Math.max(0.6, fs / 80);
      const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const rect = canvas.getBoundingClientRect();
      particles = [];

      for (let py = 0; py < img.height; py += step) {
        for (let px = 0; px < img.width; px += step) {
          const i = (py * img.width + px) * 4;
          if (img.data[i + 3] > 128) {
            const [sx, sy] = isResize
              ? [px / dpr, py / dpr]           // no re-entrance on resize
              : viewportEdgeScatter(rect);      // fly in from screen edges on load
            particles.push(new Particle(
              px / dpr, py / dpr,
              sx, sy,
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

    const animate = () => {
      ctx.clearRect(0, 0, cssWidth, cssHeight);
      const entering = enteringRef.current;
      for (const p of particles) { p.update(mouseX, mouseY, entering); p.draw(ctx); }
      raf = requestAnimationFrame(animate);
    };

    const onMove  = (e: MouseEvent) => { const r = canvas.getBoundingClientRect(); mouseX = e.clientX - r.left; mouseY = e.clientY - r.top; };
    const onLeave = () => { mouseX = -1000; mouseY = -1000; };
    const onTouch = (e: TouchEvent) => { if (!e.touches[0]) return; const r = canvas.getBoundingClientRect(); mouseX = e.touches[0].clientX - r.left; mouseY = e.touches[0].clientY - r.top; };

    const t = setTimeout(() => {
      init(false);
      animate();
      setTimeout(() => { enteringRef.current = false; }, ENTRANCE_DURATION);
    }, 80);

    const ro = new ResizeObserver(() => { init(true); });
    ro.observe(wrap);

    canvas.addEventListener("mousemove",  onMove);
    canvas.addEventListener("mouseleave", onLeave);
    canvas.addEventListener("touchstart", onTouch, { passive: true });
    canvas.addEventListener("touchmove",  onTouch, { passive: true });
    canvas.addEventListener("touchend",   onLeave);

    return () => {
      clearTimeout(t);
      ro.disconnect();
      canvas.removeEventListener("mousemove",  onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      canvas.removeEventListener("touchstart", onTouch);
      canvas.removeEventListener("touchmove",  onTouch);
      canvas.removeEventListener("touchend",   onLeave);
      cancelAnimationFrame(raf);
    };
  }, [mode]);

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
