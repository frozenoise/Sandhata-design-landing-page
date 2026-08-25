"use client";

import React from "react";

/**
 * Bend — wraps its children in a scroll container that folds content over
 * a rounded cube edge at the top/bottom of the viewport as it scrolls,
 * using Chrome's experimental HTML-in-Canvas API (`drawElementImage`,
 * origin-trial in Chrome 148–150 / `chrome://flags/#canvas-draw-element`).
 *
 * Chromium-only, feature-detected. On any browser that doesn't expose the
 * API, this renders `children` completely unwrapped — normal document flow,
 * normal scroll, zero behavioural change from not using Bend at all. The
 * WebGL fold path only activates when the API is actually available, so the
 * live site's current (overwhelming majority) of visitors are unaffected;
 * this is a progressive enhancement, not a required rewrite of the page's
 * scroll model.
 *
 * REQUIRED STRUCTURE (this is the part the first draft of this component
 * got wrong): the spec requires the captured element to be a direct child
 * of a `<canvas layoutsubtree>` — `drawElementImage` cannot capture an
 * arbitrary element elsewhere in the DOM. So the content div only ever
 * lives in one of two places: inside the `layoutsubtree` canvas (native
 * path) or as a plain sibling (fallback path) — never both, picked once at
 * mount via feature detection, not swapped live.
 *
 * KNOWN LIMITATION: content inside the fold's top/bottom zones is not
 * interactively clickable — real pointer coordinates land on the WebGL
 * output canvas, not on the DOM elements the fold is currently displaying,
 * so clicks/hovers on folded (not-flat) content don't reach the underlying
 * links/buttons. Remapping pointer events back through the inverse fold
 * transform to forward them to the right DOM element is a substantial
 * separate feature, intentionally out of scope for this pass — content in
 * the flat (unfolded) middle of the viewport is unaffected.
 *
 * The technique (own implementation): capture the content each paint via
 * `drawElementImage` into a 2D canvas, upload that as a WebGL texture, and
 * render a single fullscreen quad whose fragment shader remaps each output
 * pixel to a source texture coordinate. Near the top/bottom `zone`, that
 * remap follows a point on a circular arc (radius = `rounding`, swept up to
 * `angle`) projected through a pinhole-camera perspective (focal length =
 * `perspective`), so content visually recedes over a rounded edge instead of
 * being cut off. The forward direction (theta -> screen offset) is a closed
 * form; the shader needs the inverse (screen offset -> theta) to know what
 * to sample, so it bisects for it — 12 iterations, more than enough
 * precision for a `zone` a few hundred px tall. Scroll position, cursor
 * tilt, and overscroll "tumble" are all smoothed via simple exponential
 * decay (`k = 1 - exp(-dt / tau)`) on the JS side before being passed to
 * the shader as uniforms, so the motion settles instead of snapping.
 */

export interface BendProps {
  children: React.ReactNode;
  /** Folded region height in CSS px, top and bottom. @default 220 */
  zone?: number;
  /** Maximum fold angle in degrees. @default 78 */
  angle?: number;
  /** Arc radius for the fold crease in CSS px — 0 is a sharp hinge. @default 140 */
  rounding?: number;
  /** Camera focal length in CSS px — smaller is a more aggressive perspective. @default 900 */
  perspective?: number;
  /** Fold direction relative to the viewer. @default "out" */
  direction?: "out" | "in";
  /** Settling time in seconds after scroll/pointer input stops. @default 0.12 */
  smoothing?: number;
  /** Extra tip strength on overscroll, 0–1. @default 0.4 */
  tumble?: number;
  /** Cursor-following tilt strength, 0–1. @default 0.35 */
  tilt?: number;
  className?: string;
  style?: React.CSSProperties;
}

type PaintableCanvas = HTMLCanvasElement & {
  onpaint?: (() => void) | null;
  requestPaint?: () => void;
};
type ElementImageContext = CanvasRenderingContext2D & {
  drawElementImage?: (element: Element, x: number, y: number) => void;
};

function supportsHtmlInCanvas(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const probe = document.createElement("canvas") as PaintableCanvas;
    const ctx = probe.getContext("2d") as ElementImageContext | null;
    return !!ctx && typeof ctx.drawElementImage === "function" && typeof probe.requestPaint === "function";
  } catch {
    return false;
  }
}

const VERT_SRC = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

// Own derivation: a point at angle theta around a circular fold of radius R
// sits at local (y, z) = (R*sin(theta), R*(1-cos(theta))*dir) relative to the
// crease. A pinhole camera at z=perspective projects that to a screen-space
// offset of y * perspective / (perspective - z). screenOffsetAt() is that
// forward map; findTheta() bisects it since the shader needs the inverse
// (given a screen offset, which theta produced it) and the closed form
// isn't solvable for theta directly once the perspective divide is in play.
const FRAG_SRC = `
precision highp float;
varying vec2 vUv;

uniform sampler2D uTex;
uniform vec2 uResolution;   // viewport px
uniform vec2 uContentSize;  // full scrollable content px
uniform float uScrollY;     // smoothed scroll offset, px
uniform float uMaxScroll;   // content height - viewport height
uniform float uZone;        // px
uniform float uAngleMax;    // radians
uniform float uRounding;    // px
uniform float uPerspective; // px
uniform float uDirection;   // -1 (out) or 1 (in)
uniform float uTiltX;
uniform float uTiltY;
uniform float uTumbleTop;   // 0..1, extra angle budget from top overscroll
uniform float uTumbleBot;

float screenOffsetAt(float theta, float R) {
  float y = R * sin(theta);
  float z = R * (1.0 - cos(theta)) * uDirection;
  return (y * uPerspective) / max(uPerspective - z, 1.0);
}

// Bisection: screenOffsetAt() is monotonic increasing over [0, angleMax] as
// long as z never reaches the camera plane (rounding is kept well below
// uPerspective by the component's own prop clamping), so a fixed-iteration
// bisection converges reliably without needing a derivative.
float findTheta(float targetOffset, float angleMax, float R) {
  float lo = 0.0;
  float hi = angleMax;
  for (int i = 0; i < 12; i++) {
    float mid = (lo + hi) * 0.5;
    if (screenOffsetAt(mid, R) < targetOffset) { lo = mid; } else { hi = mid; }
  }
  return (lo + hi) * 0.5;
}

void main() {
  vec2 px = vec2(vUv.x * uResolution.x, (1.0 - vUv.y) * uResolution.y);
  float R = max(uRounding, 1.0);

  float sourceY;
  float alpha = 1.0;
  float shade = 1.0;

  float distTop = px.y;
  float distBot = uResolution.y - px.y;
  float angleTop = uAngleMax + uAngleMax * uTumbleTop * 0.5;
  float angleBot = uAngleMax + uAngleMax * uTumbleBot * 0.5;

  if (distTop < uZone && uScrollY > 0.5) {
    float target = uZone - distTop;
    float theta = findTheta(target, angleTop, R);
    float arcLen = R * theta;
    sourceY = uScrollY - arcLen;
    shade = mix(1.0, 0.82, sin(theta));
    alpha = 1.0 - smoothstep(angleTop * 0.92, angleTop, theta);
  } else if (distBot < uZone && uScrollY < uMaxScroll - 0.5) {
    float target = uZone - distBot;
    float theta = findTheta(target, angleBot, R);
    float arcLen = R * theta;
    sourceY = uScrollY + uResolution.y + arcLen;
    shade = mix(1.0, 0.82, sin(theta));
    alpha = 1.0 - smoothstep(angleBot * 0.92, angleBot, theta);
  } else {
    sourceY = uScrollY + px.y;
  }

  float tiltShift = (uTiltX * (vUv.x - 0.5) + uTiltY * (vUv.y - 0.5)) * 14.0;
  sourceY += tiltShift;

  vec2 srcUv = vec2(px.x / uContentSize.x, 1.0 - (sourceY / uContentSize.y));

  if (srcUv.y < 0.0 || srcUv.y > 1.0 || srcUv.x < 0.0 || srcUv.x > 1.0) {
    discard;
  }

  vec4 color = texture2D(uTex, srcUv);
  gl_FragColor = vec4(color.rgb * shade, color.a * alpha);
}
`;

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error("Bend shader compile failed: " + info);
  }
  return sh;
}

function BendContent({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "auto" }}>
      {children}
    </div>
  );
}

export function Bend({
  children,
  zone = 220,
  angle = 78,
  rounding = 140,
  perspective = 900,
  direction = "out",
  smoothing = 0.12,
  tumble = 0.4,
  tilt = 0.35,
  className,
  style = {},
}: BendProps) {
  // Starts false unconditionally (matching what the server always renders,
  // since `document` doesn't exist there) and is only ever flipped to true
  // inside an effect, i.e. strictly after hydration. Checking synchronously
  // during the initial client render (a plain `useState(() =>
  // supportsHtmlInCanvas())` lazy initializer) would make that very first
  // client render diverge from the server-sent HTML whenever the API is
  // actually available — a real <canvas> structure hydrating onto a
  // server-rendered plain <div> — which React can't reconcile in place and
  // has to discard and rebuild, silently breaking the canvas/layoutsubtree
  // setup rather than throwing a clean error. Deferring to an effect avoids
  // that mismatch entirely: hydration always completes on the div branch
  // first, then a normal (non-hydrating) re-render swaps to the canvas
  // branch once refs are safe to depend on.
  const [supported, setSupported] = React.useState(false);
  React.useEffect(() => { setSupported(supportsHtmlInCanvas()); }, []);

  const wrapRef = React.useRef<HTMLDivElement>(null);
  const sourceCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const glCanvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (!supported) return;
    const wrap = wrapRef.current;
    const sourceCanvas = sourceCanvasRef.current;
    const content = contentRef.current;
    const glCanvas = glCanvasRef.current;
    if (!wrap || !sourceCanvas || !content || !glCanvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tau = Math.max(smoothing, 0.001);

    const gl = glCanvas.getContext("webgl", { alpha: true, premultipliedAlpha: false }) as WebGLRenderingContext | null;
    const sourceCtx = sourceCanvas.getContext("2d") as ElementImageContext | null;
    if (!gl || !sourceCtx || typeof sourceCtx.drawElementImage !== "function") return;

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error("Bend program link failed: " + gl.getProgramInfoLog(program));
    }
    gl.useProgram(program);

    const quad = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const u = {
      tex: gl.getUniformLocation(program, "uTex"),
      resolution: gl.getUniformLocation(program, "uResolution"),
      contentSize: gl.getUniformLocation(program, "uContentSize"),
      scrollY: gl.getUniformLocation(program, "uScrollY"),
      maxScroll: gl.getUniformLocation(program, "uMaxScroll"),
      zone: gl.getUniformLocation(program, "uZone"),
      angleMax: gl.getUniformLocation(program, "uAngleMax"),
      rounding: gl.getUniformLocation(program, "uRounding"),
      perspective: gl.getUniformLocation(program, "uPerspective"),
      direction: gl.getUniformLocation(program, "uDirection"),
      tiltX: gl.getUniformLocation(program, "uTiltX"),
      tiltY: gl.getUniformLocation(program, "uTiltY"),
      tumbleTop: gl.getUniformLocation(program, "uTumbleTop"),
      tumbleBot: gl.getUniformLocation(program, "uTumbleBot"),
    };

    let scrollCurrent = 0;
    let scrollTarget = 0;
    let tiltXCurrent = 0, tiltXTarget = 0;
    let tiltYCurrent = 0, tiltYTarget = 0;
    let tumbleTop = 0, tumbleBot = 0;
    let contentDirty = true;
    let raf = 0;
    let lastT = performance.now();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const paintable = sourceCanvas as PaintableCanvas;
    paintable.onpaint = () => {
      try {
        sourceCtx.reset();
        sourceCtx.drawElementImage!(content, 0, 0);
        contentDirty = true;
        if (!rafActive) startLoop();
      } catch {
        // drawElementImage can throw on a mid-navigation/detached element —
        // skip this paint, the next one will pick up the current state.
      }
    };

    const resize = () => {
      const w = wrap.clientWidth, h = wrap.clientHeight;
      glCanvas.width = Math.round(w * dpr);
      glCanvas.height = Math.round(h * dpr);
      sourceCanvas.width = Math.round(w * dpr);
      sourceCanvas.height = Math.round(Math.max(content.scrollHeight, h) * dpr);
      gl.viewport(0, 0, glCanvas.width, glCanvas.height);
      paintable.requestPaint?.();
    };

    const onScroll = () => {
      const max = Math.max(content.scrollHeight - wrap.clientHeight, 0);
      scrollTarget = Math.min(Math.max(content.scrollTop, 0), max);
      if (!rafActive) startLoop();
    };
    const onPointerMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      tiltXTarget = ((e.clientX - rect.left) / rect.width - 0.5) * 2 * tilt;
      tiltYTarget = ((e.clientY - rect.top) / rect.height - 0.5) * 2 * tilt;
      if (!rafActive) startLoop();
    };
    const onPointerLeave = () => { tiltXTarget = 0; tiltYTarget = 0; };

    content.addEventListener("scroll", onScroll, { passive: true });
    wrap.addEventListener("pointermove", onPointerMove);
    wrap.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", resize);

    let rafActive = false;

    const frame = (now: number) => {
      const dt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;
      const k = reducedMotion ? 1 : 1 - Math.exp(-dt / tau);

      const max = Math.max(content.scrollHeight - wrap.clientHeight, 0);
      const atTop = scrollTarget <= 0.5;
      const atBottom = scrollTarget >= max - 0.5;
      const tumbleTargetTop = atTop ? tumble : 0;
      const tumbleTargetBot = atBottom ? tumble : 0;

      scrollCurrent += (scrollTarget - scrollCurrent) * k;
      tiltXCurrent += (tiltXTarget - tiltXCurrent) * k;
      tiltYCurrent += (tiltYTarget - tiltYCurrent) * k;
      tumbleTop += (tumbleTargetTop - tumbleTop) * k;
      tumbleBot += (tumbleTargetBot - tumbleBot) * k;

      const moving =
        Math.abs(scrollTarget - scrollCurrent) > 0.05 ||
        Math.abs(tiltXTarget - tiltXCurrent) > 0.0005 ||
        Math.abs(tiltYTarget - tiltYCurrent) > 0.0005 ||
        Math.abs(tumbleTargetTop - tumbleTop) > 0.001 ||
        Math.abs(tumbleTargetBot - tumbleBot) > 0.001;

      if (contentDirty) {
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceCanvas);
        contentDirty = false;
      }

      gl.useProgram(program);
      gl.uniform1i(u.tex, 0);
      gl.uniform2f(u.resolution, glCanvas.width / dpr, glCanvas.height / dpr);
      gl.uniform2f(u.contentSize, sourceCanvas.width / dpr, sourceCanvas.height / dpr);
      gl.uniform1f(u.scrollY, scrollCurrent);
      gl.uniform1f(u.maxScroll, max);
      gl.uniform1f(u.zone, zone);
      gl.uniform1f(u.angleMax, (angle * Math.PI) / 180);
      gl.uniform1f(u.rounding, Math.min(rounding, perspective * 0.6));
      gl.uniform1f(u.perspective, perspective);
      gl.uniform1f(u.direction, direction === "in" ? 1 : -1);
      gl.uniform1f(u.tiltX, tiltXCurrent);
      gl.uniform1f(u.tiltY, tiltYCurrent);
      gl.uniform1f(u.tumbleTop, tumbleTop);
      gl.uniform1f(u.tumbleBot, tumbleBot);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      if (moving) {
        raf = requestAnimationFrame(frame);
      } else {
        rafActive = false;
      }
    };

    function startLoop() {
      rafActive = true;
      lastT = performance.now();
      raf = requestAnimationFrame(frame);
    }

    resize();
    startLoop();

    return () => {
      rafActive = false;
      cancelAnimationFrame(raf);
      content.removeEventListener("scroll", onScroll);
      wrap.removeEventListener("pointermove", onPointerMove);
      wrap.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", resize);
      paintable.onpaint = null;
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
      gl.deleteTexture(tex);
    };
  }, [supported, zone, angle, rounding, perspective, direction, smoothing, tumble, tilt]);

  // Unsupported: render children completely unwrapped — normal document
  // flow, normal scroll, no behavioural change from not using Bend at all.
  if (!supported) {
    return <div className={className} style={style}>{children}</div>;
  }

  return (
    <div ref={wrapRef} className={className} style={{ position: "relative", overflow: "hidden", ...style }}>
      <canvas
        ref={sourceCanvasRef}
        // @ts-expect-error experimental html-in-canvas attribute, no React/DOM types yet
        layoutsubtree="true"
        suppressHydrationWarning
        style={{ display: "none" }}
      >
        <div ref={contentRef} style={{ position: "relative", width: "100%", height: "100%", overflow: "auto" }}>
          {children}
        </div>
      </canvas>
      <canvas ref={glCanvasRef} aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
    </div>
  );
}
