"use client";

/* Cursor-driven particle-dispersion hero heading.
 *
 * Mechanism adapted from componentry.dev's "Cursor-Driven Particle
 * Typography" (Canvas2D text → pixel sampling → spring-physics particles
 * that repel from the cursor and return to origin). The reference does a
 * single unwrapped fillText() of one short bold word; this adapts that
 * mechanism for Sandhata's full hero sentence — see the section comments
 * below for what changed and why.
 *
 * Entrance animation (2026-07-27): on first load particles start at random
 * scatter positions and converge to their origin (text) positions over
 * ~ENTRANCE_DURATION ms before cursor-repulsion physics engage.
 */

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
  { text: "The", color: BASE_COLOR },
  { text: "AI-ready", color: BASE_COLOR },
  { text: "design", color: BASE_COLOR },
  { text: "system", color: BASE_COLOR },
  { text: "built", color: BASE_COLOR },
  { text: "for", color: BASE_COLOR },
  { text: "clarity", color: ACCENT_COLOR, noBreak: true, isClarity: true },
];
const SENTENCE_TEXT = "The AI-ready design system built for clarity";
const MIN_PARTICLE_WIDTH = 960;

/* How long the forming-entrance lasts before cursor physics engage. */
const ENTRANCE_DURATION = 1400;

class Particle {
  x: number; y: number; originX: number; originY: number;
  vx: number; vy: number; size: number; color: string;
  dispersion: number; returnSpd: number;

  constructor(
    originX: number, originY: number,
    scatterX: number, scatterY: number,
    size: number, color: string, dispersion: number, returnSpd: number
  ) {
    this.x = scatterX;
    this.y = scatterY;
    this.originX = originX;
    this.originY = originY;
    this.vx = (Math.random() - 0.5) * 3;
    this.vy = (Math.random() - 0.5) * 3;
    this.size = size;
    this.color = color;
    this.dispersion = dispersion;
    this.returnSpd = returnSpd;
  }

  update(mouseX: number, mouseY: number, entering: boolean) {
    if (entering) {
      /* During entrance: strong attractive pull toward origin, no cursor
         interaction. Spring coefficient + damping chosen so particles
         visibly fly across the canvas and settle within ENTRANCE_DURATION. */
      this.vx += (this.originX - this.x) * 0.055;
      this.vy += (this.originY - this.y) * 0.055;
      this.vx *= 0.86;
      this.vy *= 0.86;
      this.x += this.vx;
      this.y += this.vy;
      return;
    }

    /* Normal mode: cursor repulsion + spring return. */
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
    this.vx *= 0.85;
    this.vy *= 0.85;
    const distToOrigin = Math.sqrt((this.x - this.originX) ** 2 + (this.y - this.originY) ** 2);
    if (distToOrigin < 1 && Math.random() > 0.95) {
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
  const enteringRef = useRef(true);

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
    enteringRef.current = true;

    const init = () => {
      const computed = window.getComputedStyle(h1);
      const fontSizePx = parseFloat(computed.fontSize) || 80;
      const lineHeightPx = parseFloat(computed.lineHeight) || fontSizePx * 1.2;
      const letterSpacing = parseFloat(computed.letterSpacing) || 0;
      const fontFamily = computed.fontFamily;
      cssWidth = wrap.clientWidth;
      if (!cssWidth) return;

      const dpr = window.devicePixelRatio || 1;
      ctx.font = `400 ${fontSizePx}px ${fontFamily}`;
      const spaceWidth = measureWord(ctx, " ", letterSpacing);
      const lines = layoutLines(ctx, TOKENS, cssWidth, letterSpacing, spaceWidth);
      cssHeight = lines.length * lineHeightPx;

      canvas.width = cssWidth * dpr;
      canvas.height = cssHeight * dpr;
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;
      wrap.style.height = `${cssHeight}px`;
      ctx.scale(dpr, dpr);
      ctx.font = `400 ${fontSizePx}px ${fontFamily}`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.clearRect(0, 0, cssWidth, cssHeight);

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

      const step = Math.max(1, Math.round((fontSizePx / 80) * 1.8 * dpr));
      const particleSize = Math.max(0.6, 1.0 * (fontSizePx / 80));
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      particles = [];

      /* Each particle's scatter position: uniformly random across the canvas
         area (plus a margin so some particles visibly fly in from outside the
         text block). This produces the "cloud assembles into text" look. */
      const scatterPadX = cssWidth * 0.3;
      const scatterPadY = cssHeight * 1.5;

      for (let py = 0; py < imgData.height; py += step) {
        for (let px = 0; px < imgData.width; px += step) {
          const idx = (py * imgData.width + px) * 4;
          const alpha = imgData.data[idx + 3];
          if (alpha > 128) {
            const r = imgData.data[idx], g = imgData.data[idx + 1], b = imgData.data[idx + 2];
            const scatterX = -scatterPadX + Math.random() * (cssWidth + scatterPadX * 2);
            const scatterY = -scatterPadY + Math.random() * (cssHeight + scatterPadY * 2);
            particles.push(new Particle(
              px / dpr, py / dpr,
              scatterX, scatterY,
              particleSize, `rgb(${r},${g},${b})`, 13, 0.12
            ));
          }
        }
      }

      const sparkle = sparkleRef.current;
      if (sparkle) {
        const size = fontSizePx * 0.62;
        sparkle.style.left = `${clarityEndX + 2}px`;
        sparkle.style.top = `${clarityCenterY - size * 0.75}px`;
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, cssWidth, cssHeight);
      const entering = enteringRef.current;
      particles.forEach((p) => { p.update(mouseX, mouseY, entering); p.draw(ctx); });
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

    const initTimeout = setTimeout(() => {
      init();
      animate();
      /* End entrance phase after ENTRANCE_DURATION — by then particles have
         converged close enough to origin that the physics transition is seamless. */
      setTimeout(() => { enteringRef.current = false; }, ENTRANCE_DURATION);
    }, 100);

    const resizeObserver = new ResizeObserver(() => {
      enteringRef.current = false; // skip re-entrance on resize
      init();
    });
    resizeObserver.observe(wrap);

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleLeave);
    canvas.addEventListener("touchstart", handleTouch);
    canvas.addEventListener("touchmove", handleTouch);
    canvas.addEventListener("touchend", handleLeave);

    return () => {
      clearTimeout(initTimeout);
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
