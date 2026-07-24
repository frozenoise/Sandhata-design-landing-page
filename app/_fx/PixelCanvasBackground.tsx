"use client";

/* Ambient pixel-grid background for a dark section — a grid of small cells
 * that light up near the cursor and fade back out, giving the section's
 * flat navy background some life without competing with foreground content.
 *
 * This is an original implementation of a common "reactive pixel grid"
 * effect family (seen in various component libraries, e.g. componentry.dev's
 * "Pixel Canvas"). It was NOT built from that or any other site's source —
 * a live fetch of that page's docs only yielded its public prop surface
 * (cell size / decay speed / colour list / a couple of named variants), not
 * anything reproduced here; the grid math, cell model, colour blending, and
 * ambient-idle-shimmer behaviour below are this file's own.
 *
 * Renders nothing under prefers-reduced-motion — the section keeps its
 * plain flat navy background, same fallback pattern as .hero-aurora and
 * the hero particle heading.
 */

import React, { useEffect, useRef } from "react";

export interface PixelCanvasBackgroundProps {
  /** Grid cell size in px. */
  cellSize?: number;
  /** Per-frame fade-out fraction for a cell once it stops being targeted (0–1, higher = faster fade). */
  decay?: number;
  /** How many cells around the cursor light up, in cell units. */
  hoverRadius?: number;
  /** Fraction of cool cells per frame that get a faint unprompted flicker, keeping the grid alive when idle. */
  ambient?: number;
}

class GridCell {
  heat = 0;
  target = 0;
  constructor(public tint: number) {}
}

function hexToRgbTuple(input: string): [number, number, number] {
  // Accepts "#rrggbb" or "rgb(r, g, b)" (what getComputedStyle returns for
  // our rgb()-defined colour tokens) and normalises to an [r,g,b] tuple.
  if (input.startsWith("#")) {
    const n = parseInt(input.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const m = input.match(/[\d.]+/g);
  if (!m) return [0, 0, 0];
  return [parseFloat(m[0]), parseFloat(m[1]), parseFloat(m[2])];
}

export function PixelCanvasBackground({
  cellSize = 15,
  decay = 0.045,
  hoverRadius = 3.4,
  ambient = 0.05,
}: PixelCanvasBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    const section = canvas?.parentElement;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Base = the section's own flat background; tints = Sandhata's brand
    // ramp, read live from tokens rather than hardcoded, so a themed
    // wrapper (ramp("paletteName")) would carry through automatically.
    const rootStyle = getComputedStyle(document.documentElement);
    const base = hexToRgbTuple(getComputedStyle(section).backgroundColor || "#000921");
    const tints = [
      hexToRgbTuple(rootStyle.getPropertyValue("--colour-primaryblue-300").trim() || "rgb(122,133,255)"),
      hexToRgbTuple(rootStyle.getPropertyValue("--colour-primaryblue-400").trim() || "rgb(68,92,255)"),
      hexToRgbTuple(rootStyle.getPropertyValue("--colour-primaryblue-500").trim() || "rgb(0,54,221)"),
    ];

    let raf = 0;
    let cols = 0, rows = 0;
    let cells: GridCell[] = [];
    let w = 0, h = 0;
    let mouseX = -1, mouseY = -1;

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = section.clientWidth;
      h = section.clientHeight;
      if (!w || !h) return;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
      cols = Math.ceil(w / cellSize);
      rows = Math.ceil(h / cellSize);
      cells = Array.from({ length: cols * rows }, () => new GridCell(Math.floor(Math.random() * tints.length)));
    };

    const cellPad = cellSize * 0.18; // gap between cells, so it reads as a grid not a solid wash

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cell = cells[r * cols + c];
          const cx = c * cellSize + cellSize / 2;
          const cy = r * cellSize + cellSize / 2;

          if (mouseX >= 0) {
            const dx = (cx - mouseX) / cellSize, dy = (cy - mouseY) / cellSize;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < hoverRadius) cell.target = Math.max(cell.target, 1 - dist / hoverRadius);
          }
          if (cell.heat < 0.03 && cell.target < 0.03 && Math.random() < ambient / (cols * rows)) {
            cell.target = 0.4;
          }

          cell.heat += (cell.target - cell.heat) * 0.3;
          cell.target *= 1 - decay;

          if (cell.heat > 0.01) {
            const [tr, tg, tb] = tints[cell.tint];
            const t = Math.min(1, cell.heat);
            const r2 = base[0] + (tr - base[0]) * t;
            const g2 = base[1] + (tg - base[1]) * t;
            const b2 = base[2] + (tb - base[2]) * t;
            ctx.fillStyle = `rgb(${r2 | 0},${g2 | 0},${b2 | 0})`;
            const size = cellSize - cellPad;
            ctx.fillRect(cx - size / 2, cy - size / 2, size, size);
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };

    const handleMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    const handleLeave = () => { mouseX = -1; mouseY = -1; };

    build();
    raf = requestAnimationFrame(tick);
    const ro = new ResizeObserver(build);
    ro.observe(section);
    section.addEventListener("mousemove", handleMove);
    section.addEventListener("mouseleave", handleLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      section.removeEventListener("mousemove", handleMove);
      section.removeEventListener("mouseleave", handleLeave);
    };
  }, [cellSize, decay, hoverRadius, ambient]);

  return <canvas ref={canvasRef} aria-hidden="true" className="expect-pixel-bg" />;
}
