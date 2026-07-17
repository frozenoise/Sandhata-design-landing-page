"use client";

import React from "react";
import * as THREE from "three";
import Lenis from "lenis";

/**
 * Scroll-bend, haoqi.design's ACTUAL architecture (verified by runtime
 * layer-isolation of their site): the DOM never bends. Text scrolls flat
 * under Lenis; designated media blocks exist visually ONLY as textured
 * planes in a fixed full-viewport WebGL canvas, tracked each frame to their
 * DOM placeholders' rects. A vertex shader curls the planes away from the
 * viewer at the viewport's top and bottom edges, magnitude driven by
 * |scroll velocity| — the same Z(y) profile as the old DOM approximation,
 * but continuous per-vertex, so the parabola is pixel-smooth and the
 * perspective foreshortening is real instead of scaleX/scaleY compensation.
 *
 * Mark an element with:
 *   data-bend-media="/assets/bend/foo.png"  → PNG baked with a 20px margin
 *                                             (EXPAND below must match the
 *                                             bake script's margin)
 *   data-bend-media="video"                 → the element IS a <video> (or
 *                                             contains one); used live as a
 *                                             VideoTexture, no margin.
 *
 * The DOM original is hidden (visibility:hidden — it keeps its layout box,
 * so rect tracking and document flow are unaffected) once its texture is
 * ready. Reveal entrance animations still work: each plane multiplies its
 * opacity by the computed opacity of its nearest [data-reveal] ancestor,
 * and getBoundingClientRect naturally follows the reveal's translateY.
 *
 * Renders nothing (and leaves the DOM untouched) under prefers-reduced-
 * motion, on viewports narrower than 900px, or if WebGL is unavailable.
 */

const EXPAND = 20;   // must match scripts/bake-bend-textures.js margin
// Central fraction of the viewport that stays flat. Kept small enough that
// the curl is clearly visible in the band below the 100px sticky nav — the
// outermost pixels (where a quadratic ramp is strongest) sit behind it.
const FLAT = 0.38;
// Curl strength: full amplitude at this Lenis velocity (px/frame). Human
// wheel scrolling peaks around 20–40 px/frame — tune here, not in the shader.
const FULL_CURL_VELOCITY = 22;
// Edge displacement at full amplitude, as a fraction of the viewport height.
const CURL_AMPLITUDE = 0.22;

const VERT = /* glsl */ `
  uniform float uTop;    // plane top edge in viewport px (already expanded)
  uniform float uHeight; // plane height in px
  uniform float uViewH;  // viewport height in px
  uniform float uLeft;   // plane left edge in viewport px (already expanded)
  uniform float uWidth;  // plane width in px
  uniform float uViewW;  // viewport width in px
  uniform float uAmp;    // curl amplitude in px at the viewport edge
  varying vec2 vUv;

  void main() {
    vUv = uv;
    float flat_ = ${FLAT};

    // Y curl: top/bottom edges push outward along Y
    float screenY = uTop + (0.5 - position.y) * uHeight;
    float halfV = uViewH * 0.5;
    float my = min(abs(screenY - halfV) / halfV, 1.15);
    float dispY = 0.0;
    if (my > flat_) {
      float t = (my - flat_) / (1.0 - flat_);
      dispY = uAmp * t * t;
    }

    // X curl: left/right edges push outward along X
    float screenX = uLeft + (position.x + 0.5) * uWidth;
    float halfW = uViewW * 0.5;
    float mx = min(abs(screenX - halfW) / halfW, 1.15);
    float dispX = 0.0;
    if (mx > flat_) {
      float t = (mx - flat_) / (1.0 - flat_);
      dispX = uAmp * t * t;
    }

    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    mv.y += screenY < halfV ? dispY : -dispY;
    mv.x += screenX < halfW ? -dispX : dispX;
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    vec4 c = texture2D(uMap, vUv);
    gl_FragColor = vec4(c.rgb, c.a * uOpacity);
    #include <colorspace_fragment>
  }
`;

type Tracked = {
  el: HTMLElement;
  revealAncestor: HTMLElement | null;
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  isVideo: boolean;
  expand: number;
  hidden: boolean;
};

export function BendCanvas() {
  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth < 900) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return; // no WebGL — DOM stays as-is
    }

    const canvas = renderer.domElement;
    canvas.style.cssText =
      "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:50;";
    document.body.appendChild(canvas);

    const scene = new THREE.Scene();
    // Orthographic: 1 world unit == 1 css px, no horizontal foreshortening
    // when the curl displaces vertices (haoqi's curled cards keep full width).
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 2000);
    const sizeCamera = () => {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h);
      camera.left = -w / 2;
      camera.right = w / 2;
      camera.top = h / 2;
      camera.bottom = -h / 2;
      camera.position.set(0, 0, 100);
      camera.updateProjectionMatrix();
    };
    sizeCamera();
    window.addEventListener("resize", sizeCamera);

    const lenis = new Lenis({ lerp: 0.1 });

    const tracked: Tracked[] = [];
    const texLoader = new THREE.TextureLoader();

    const makeMesh = (map: THREE.Texture) => {
      map.colorSpace = THREE.SRGBColorSpace;
      const mat = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms: {
          uMap: { value: map },
          uOpacity: { value: 1 },
          uTop: { value: 0 },
          uHeight: { value: 1 },
          uViewH: { value: window.innerHeight },
          uLeft: { value: 0 },
          uWidth: { value: 1 },
          uViewW: { value: window.innerWidth },
          uAmp: { value: 0 },
        },
        transparent: true,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 64, 64), mat);
      mesh.frustumCulled = false;
      return mesh;
    };

    for (const el of Array.from(
      document.querySelectorAll<HTMLElement>("[data-bend-media]")
    )) {
      const spec = el.getAttribute("data-bend-media")!;
      const revealAncestor = el.closest<HTMLElement>("[data-reveal]");
      if (spec === "video") {
        const video =
          el instanceof HTMLVideoElement ? el : el.querySelector("video");
        if (!video) continue;
        const tex = new THREE.VideoTexture(video);
        const mesh = makeMesh(tex);
        scene.add(mesh);
        tracked.push({ el, revealAncestor, mesh, isVideo: true, expand: 0, hidden: false });
      } else {
        const rec: Tracked = {
          el, revealAncestor,
          mesh: null as unknown as Tracked["mesh"],
          isVideo: false, expand: EXPAND, hidden: false,
        };
        texLoader.load(spec, (tex) => {
          rec.mesh = makeMesh(tex);
          scene.add(rec.mesh);
        });
        tracked.push(rec);
      }
    }
    if (tracked.length === 0) {
      // nothing to bend — tear down silently
      window.removeEventListener("resize", sizeCamera);
      lenis.destroy();
      renderer.dispose();
      canvas.remove();
      return;
    }

    let curl = 0; // 0..1 amplitude fraction
    let raf = 0;

    const tick = (time: number) => {
      lenis.raf(time);

      const target = Math.min(1, Math.abs(lenis.velocity) / FULL_CURL_VELOCITY);
      curl += (target - curl) * 0.14;
      const ampPx = curl * CURL_AMPLITUDE * window.innerHeight;

      const viewW = window.innerWidth;
      const viewH = window.innerHeight;

      for (const t of tracked) {
        if (!t.mesh) continue; // texture still loading
        if (!t.hidden) {
          // hide the DOM original only once its plane can replace it
          t.el.style.visibility = "hidden";
          t.hidden = true;
        }
        const r = t.el.getBoundingClientRect();
        const w = r.width + t.expand * 2;
        const h = r.height + t.expand * 2;
        const cx = r.left + r.width / 2 - viewW / 2;
        const cy = viewH / 2 - (r.top + r.height / 2);
        t.mesh.position.set(cx, cy, 0);
        t.mesh.scale.set(w, h, 1);
        const u = t.mesh.material.uniforms;
        u.uTop.value = r.top - t.expand;
        u.uHeight.value = h;
        u.uViewH.value = viewH;
        u.uLeft.value = r.left - t.expand;
        u.uWidth.value = w;
        u.uViewW.value = viewW;
        u.uAmp.value = ampPx;
        u.uOpacity.value = t.revealAncestor
          ? parseFloat(getComputedStyle(t.revealAncestor).opacity) || 0
          : 1;
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", sizeCamera);
      lenis.destroy();
      for (const t of tracked) {
        if (t.hidden) t.el.style.visibility = "";
        if (t.mesh) {
          t.mesh.geometry.dispose();
          (t.mesh.material.uniforms.uMap.value as THREE.Texture).dispose();
          t.mesh.material.dispose();
        }
      }
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  return null;
}
