"use client";

import React from "react";
import Lenis from "lenis";

/**
 * Scroll-bend (haoqi.design-style, DOM approximation): Lenis interpolates the
 * scroll position so motion is frame-smooth, and while scrolling the page
 * curls AWAY from the viewer at the top and bottom of the viewport — in BOTH
 * scroll directions, like the reference — settling flat at rest.
 *
 * Geometry: one bent sheet with a flat plateau — the central FLAT fraction of
 * the viewport stays untransformed and the curve ramps in beyond it. Content
 * is carved into strips (top-level sections, recursively subdivided while
 * they span a large part of the viewport) and each strip is a chord of the
 * sheet over its VISIBLE extent. scaleY(1/cosφ) puts each chord's endpoints
 * exactly on the sheet, so adjacent strips share edge positions in 3D and
 * their projections stay seam-free at any depth.
 *
 * Subdivided ancestors stay untransformed, flattened containers (paint order
 * remains DOM order — preserve-3d would hide receded strips behind their
 * section's own background); nested strips carry their own perspective().
 * A subdivided ancestor with an opaque background would paint it as a flat
 * un-bent band behind its curling children, so its background is moved onto
 * an injected proxy layer sliced into thin strips that bend with the sheet.
 *
 * Pass `scrollerRef` when the page scrolls inside an element (e.g. the
 * showcase's <main>) instead of the window. The wrapper must be the scroller's
 * single content child in that case. Respects prefers-reduced-motion.
 *
 * Elements with a `data-bend-exempt` attribute (and their subtrees) are never
 * transformed — use it for sections with their own scroll-driven scenes.
 */
export function useScrollBend<T extends HTMLElement>(
  scrollerRef?: React.RefObject<HTMLElement>
) {
  const wrapRef = React.useRef<T>(null);

  React.useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const scroller = scrollerRef?.current ?? null;
    const lenis = new Lenis(
      scroller ? { wrapper: scroller, content: wrap, lerp: 0.1 } : { lerp: 0.1 }
    );

    const PERSPECTIVE = 800;
    const FLAT = 0.55;       // central fraction of the viewport that stays flat
    const MAX_DEPTH = 3;     // subdivision recursion limit
    // Hysteresis on the subdivision threshold: enter pass-through mode above
    // ENTER, drop back to a single chord below EXIT. Without the gap an
    // element crossing the boundary mid-scroll flips mode every few frames
    // and its transform snaps between parent and children.
    const SUBDIVIDE_ENTER = 0.45;
    const SUBDIVIDE_EXIT  = 0.38;

    wrap.style.perspective = `${PERSPECTIVE}px`;
    const prevWrapPosition = wrap.style.position;
    if (getComputedStyle(wrap).position === "static") wrap.style.position = "relative";

    // Layout top relative to the wrapper via the offsetParent chain — layout
    // values ignore transforms (measuring transformed rects feeds the
    // transform back into its own input and oscillates).
    const layoutTop = (el: HTMLElement): number => {
      let t = 0;
      let n: HTMLElement | null = el;
      while (n && n !== wrap) {
        t += n.offsetTop;
        n = n.offsetParent as HTMLElement | null;
      }
      return t;
    };

    // ── background proxies for subdivided ancestors ─────────────────────
    // A pass-through parent keeps painting its own background flat while its
    // children bend. For parents with an opaque, image-free background we
    // move the paint onto a z-index:-1 proxy sliced into thin strips that
    // apply() bends like any other content. isolation:isolate keeps the
    // negative z-index inside the parent.
    type ProxyRec = {
      proxy: HTMLDivElement;
      builtH: number;
      prevBg: string; prevPos: string; prevIso: string;
    };
    const proxies = new Map<HTMLElement, ProxyRec>();

    const buildSlices = (proxy: HTMLDivElement, h: number, viewH: number, color: string) => {
      proxy.textContent = "";
      const sliceH = Math.max(40, viewH * 0.1);
      const n = Math.min(30, Math.ceil(h / sliceH));
      const each = h / n;
      for (let i = 0; i < n; i++) {
        const s = document.createElement("div");
        s.style.cssText =
          `position:absolute;left:0;right:0;top:${(i * each).toFixed(2)}px;` +
          // 0.75px overlap hides hairline gaps where adjacent chords meet
          `height:${(each + 0.75).toFixed(2)}px;background:${color};`;
        proxy.appendChild(s);
      }
    };

    const activateProxy = (P: HTMLElement, viewH: number) => {
      let rec = proxies.get(P);
      if (!rec) {
        const cs = getComputedStyle(P);
        const transparent =
          cs.backgroundImage !== "none" ||
          cs.backgroundColor === "rgba(0, 0, 0, 0)" || cs.backgroundColor === "transparent";
        if (transparent) return; // nothing visible to re-home
        const proxy = document.createElement("div");
        proxy.setAttribute("data-bend-proxy", "");
        proxy.style.cssText =
          "position:absolute;inset:0;z-index:-1;pointer-events:none;" +
          `overflow:hidden;border-radius:${cs.borderRadius};`;
        rec = {
          proxy, builtH: 0,
          prevBg: P.style.backgroundColor, prevPos: P.style.position, prevIso: P.style.isolation,
        };
        P.insertBefore(proxy, P.firstChild);
        proxies.set(P, rec);
      }
      const cs = getComputedStyle(P);
      if (rec.builtH !== P.offsetHeight) {
        buildSlices(rec.proxy, P.offsetHeight, viewH, cs.backgroundColor);
        rec.builtH = P.offsetHeight;
      }
      rec.proxy.style.display = "";
      if (cs.position === "static") P.style.position = "relative";
      P.style.isolation = "isolate";
      P.style.backgroundColor = "transparent";
    };

    const deactivateProxies = () => {
      for (const [P, rec] of proxies) {
        rec.proxy.style.display = "none";
        P.style.backgroundColor = rec.prevBg;
        P.style.position = rec.prevPos;
        P.style.isolation = rec.prevIso;
      }
    };

    // Don't pass through an element whose transform comes from a stylesheet
    // (e.g. a data-reveal entrance mid-flight): children are chorded from
    // layout positions, so an external transform would shear them off the
    // sheet. Our own inline transform (it was a chord last frame) is fine.
    const canPassThrough = (el: HTMLElement): boolean => {
      if (el.children.length === 0) return false;
      if (el.style.transform !== "") return true;
      return getComputedStyle(el).transform === "none";
    };

    const touched    = new Set<HTMLElement>(); // everything we've styled
    const visited    = new Set<HTMLElement>(); // styled THIS frame
    const subdivided = new Set<HTMLElement>(); // currently in pass-through mode

    const resetEl = (el: HTMLElement) => {
      el.style.transform = "";
      el.style.transformOrigin = "";
      el.style.transition = "";
    };
    const resetAll = () => {
      for (const el of touched) resetEl(el);
      touched.clear();
      subdivided.clear();
      deactivateProxies();
    };

    let bend = 0; // degrees of away-curl at the viewport edge, always >= 0
    let raf  = 0;

    const tick = (time: number) => {
      lenis.raf(time);

      // |velocity| so the sheet curls AWAY at both edges in both scroll
      // directions (matches the reference) — and no zero-crossing lag when
      // the scroll direction flips.
      const target = Math.min(24, Math.abs(lenis.velocity) * 0.3);
      bend += (target - bend) * 0.12;

      if (bend > 0.05) {
        const viewH = scroller ? scroller.clientHeight : window.innerHeight;
        const half  = viewH / 2;
        // The wrapper itself is never transformed, so its rect is a stable
        // anchor for converting layout offsets into viewport coordinates.
        const wrapTop = wrap.getBoundingClientRect().top;
        wrap.style.perspectiveOrigin = `50% ${half - wrapTop}px`;

        const zK = Math.tan(bend * Math.PI / 180);
        const Z = (yPx: number) => {
          const m = Math.min(Math.abs((yPx - half) / half), 1.15);
          return m <= FLAT ? 0 : -zK * half * ((m - FLAT) ** 2) / (2 * (1 - FLAT));
        };

        const apply = (el: HTMLElement, depth: number) => {
          if (el.hasAttribute("data-bend-exempt")) return;
          const h   = el.offsetHeight;
          const top = wrapTop + layoutTop(el);
          const visTop = Math.max(top, 0);
          const visBot = Math.min(top + h, viewH);
          if (h <= 0 || visBot <= visTop) return;

          const extentRatio   = (visBot - visTop) / viewH;
          const wasSubdivided = subdivided.has(el);
          const threshold     = wasSubdivided ? SUBDIVIDE_EXIT : SUBDIVIDE_ENTER;

          if (depth < MAX_DEPTH && extentRatio > threshold && canPassThrough(el)) {
            subdivided.add(el);
            if (el.style.transform) { el.style.transform = ""; el.style.transformOrigin = ""; }
            if (!el.hasAttribute("data-bend-proxy")) activateProxy(el, viewH);
            touched.add(el);
            visited.add(el);
            for (const c of Array.from(el.children)) apply(c as HTMLElement, depth + 1);
            return;
          }

          subdivided.delete(el);

          const zT = Z(visTop);
          const zB = Z(visBot);
          const angleRad = Math.atan((zB - zT) / (visBot - visTop));
          const angle = angleRad * 180 / Math.PI;
          const z = (zT + zB) / 2;
          // scaleY(1/cosφ) stretches the strip to its chord length so both
          // endpoints land exactly on the sheet — neighbours share endpoints
          // in 3D, so projections stay joined at any depth.
          const sy = 1 / Math.cos(angleRad);
          // Receded rows foreshorten horizontally and would reveal the page
          // background at the sides; scaleX by the deepest visible row's
          // depth keeps the strip full-width.
          const depthBehind = Math.max(0, -Math.min(zT, zB));
          const sx = (PERSPECTIVE + depthBehind) / PERSPECTIVE;
          el.style.transformOrigin = `50% ${((visTop + visBot) / 2 - top).toFixed(1)}px`;
          // Suppress CSS transitions while driving the transform per frame
          // (entrance reveals transition `transform` and would tween-fight).
          el.style.transition = "none";
          el.style.transform =
            (depth > 0 ? `perspective(${PERSPECTIVE}px) ` : "") +
            `translateZ(${z.toFixed(2)}px) rotateX(${angle.toFixed(3)}deg) scale(${sx.toFixed(4)}, ${sy.toFixed(4)})`;
          touched.add(el);
          visited.add(el);
        };

        visited.clear();
        for (const child of Array.from(wrap.children)) apply(child as HTMLElement, 0);

        // Anything styled on an earlier frame but not this one gets reset so
        // no stale transforms linger. (Array.from: deleting while iterating
        // the live set skips entries.)
        for (const el of Array.from(touched)) {
          if (!visited.has(el)) { resetEl(el); touched.delete(el); subdivided.delete(el); }
        }
      } else if (touched.size > 0 || bend !== 0) {
        bend = 0;
        resetAll();
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      wrap.style.perspective = "";
      wrap.style.perspectiveOrigin = "";
      wrap.style.position = prevWrapPosition;
      resetAll();
      for (const [, rec] of proxies) rec.proxy.remove();
      proxies.clear();
    };
  }, [scrollerRef]);

  return wrapRef;
}
