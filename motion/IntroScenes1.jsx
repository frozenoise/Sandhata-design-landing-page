// Sandhata intro film — shared helpers + scenes 1–3 (logo, colour, typography).
// Loaded after animations.jsx; exports to window for IntroScenes2/IntroApp.

const sdC = {
  blue: "#0036DD", blueBright: "#445CFF", blue50: "#EBEFFF", blue200: "#B8C4FF",
  purple: "#602DEA", navy: "#1F2A54",
  ink: "#141618", n900: "#202225", n700: "#585F65", n500: "#98A3AD",
  n300: "#C0C7CF", n200: "#D5DBDE", n100: "#E9EBEE", n50: "#F5F6F8",
  success: "#00A300", error: "#D21B00", alert: "#FFC228", info: "#508FED",
  cyan: "#00A4DC", orange: "#F68136", leafGrey: "#B7B7B6",
  viz: ["#602DEA", "#445CFF", "#00D4D4", "#00208F", "#9A8AF5", "#608FEC"],
};
const sdF = {
  bold: "var(--font-bold, 'Akkurat', sans-serif)",
  normal: "var(--font-normal, 'Akkurat', sans-serif)",
  light: "var(--font-light, 'Akkurat', sans-serif)",
  mono: "var(--font-mono, ui-monospace, monospace)",
};
const sdP = (lt, at, dur, ease = Easing.easeOutCubic) => ease(clamp((lt - at) / dur, 0, 1));

// Absolute-positioned element that rises + fades in at scene-local time `at`.
function SdItem({ x, y, at = 0, dur = 0.55, dy = 26, scaleFrom = null, ease = Easing.easeOutCubic, w, style, children }) {
  const { localTime } = useSprite();
  const o = clamp((localTime - at) / (dur * 0.6), 0, 1);
  const e = sdP(localTime, at, dur, ease);
  const s = scaleFrom == null ? 1 : scaleFrom + (1 - scaleFrom) * e;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, opacity: o, transform: `translateY(${(1 - e) * dy}px) scale(${s})`, transformOrigin: "center", willChange: "transform, opacity", ...style }}>
      {children}
    </div>
  );
}

// Scene shell: gates to [start,end], crossfades at both ends, slow camera zoom.
function SdScene({ start, end, zoomFrom = 1, zoomTo = 1.035, origin = "center", fadeIn = 0.35, fadeOut = 0.45, children }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration, progress }) => {
        const o = Math.min(clamp(localTime / fadeIn, 0, 1), clamp((duration - localTime) / fadeOut, 0, 1));
        const z = zoomFrom + (zoomTo - zoomFrom) * progress;
        return (
          <div style={{ position: "absolute", inset: 0, opacity: o, transform: `scale(${z})`, transformOrigin: origin }}>
            {children}
          </div>
        );
      }}
    </Sprite>
  );
}

// Numbered section label, top-left, with a hairline that draws across.
function SdSceneLabel({ num, title }) {
  const { localTime } = useSprite();
  const rule = sdP(localTime, 0.5, 0.9, Easing.easeInOutCubic);
  return (
    <div>
      <SdItem x={160} y={120} at={0.2}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
          <span style={{ fontFamily: sdF.mono, fontSize: 26, color: sdC.blue }}>{num}</span>
          <span style={{ fontFamily: sdF.bold, fontWeight: 700, fontSize: 46, letterSpacing: "-0.5px", color: sdC.ink }}>{title}</span>
        </div>
      </SdItem>
      <div style={{ position: "absolute", left: 160, top: 200, height: 1, width: 1600 * rule, background: sdC.n200 }} />
    </div>
  );
}

// The Sandhata mark, self-assembling: cyan twist spins in, grey leaves rise, orange dot drops.
function SdLogoMark({ lt, width = 300, at = 0.2 }) {
  const swirl = sdP(lt, at, 0.9, Easing.easeOutBack);
  const swirlO = clamp((lt - at) / 0.4, 0, 1);
  const leaves = sdP(lt, at + 0.55, 0.6);
  const dot = sdP(lt, at + 0.85, 0.55, Easing.easeOutBack);
  const dotO = clamp((lt - at - 0.85) / 0.2, 0, 1);
  return (
    <svg width={width} viewBox="0 0 184 145" fill="none" style={{ display: "block", overflow: "visible" }}>
      <g transform="translate(44.655,51.555)" opacity={leaves}>
        <g style={{ transform: `translateY(${(1 - leaves) * 16}px)` }}>
          <path d="M 81.339 92.734 L 81.338 92.737 L 81.328 92.734 L 81.339 92.734 Z M 55.933 38.051 C 37.677 41.597 21.069 45.002 15.529 47.437 C 11.905 45.572 8.092 43.598 4.079 41.504 C -1.801 38.615 -0.563 32.713 3.015 27.607 C 12.551 22.485 26.12 18.831 40.844 15.665 C 43.298 19.358 45.819 23.082 48.339 26.807 C 50.898 30.587 53.459 34.366 55.933 38.051 Z M 123.793 19.186 C 112.883 25.871 97.472 29.795 79.895 33.378 C 75.854 27.056 71.468 20.577 67.083 14.098 L 64.904 10.88 C 86.556 6.704 107.275 2.614 111.93 0 C 114.136 1.165 116.395 2.363 118.72 3.601 C 125.137 6.641 128.332 13.028 123.793 19.186 Z" fill={sdC.leafGrey} fillRule="evenodd"></path>
        </g>
      </g>
      <g transform="translate(32.63,0)" opacity={swirlO}>
        <g style={{ transform: `scale(${0.7 + 0.3 * swirl}) rotate(${(1 - swirl) * -16}deg)`, transformBox: "fill-box", transformOrigin: "center" }}>
          <path d="M 130.745 55.156 C 73.126 24.485 52.721 16.054 51.203 18.906 C 49.559 21.998 64.324 43.819 79.108 65.654 C 97.718 93.144 116.345 120.668 108.441 135.837 C 100.785 150.53 77.151 150.584 5.62 113.23 C -2.472 108.633 -3.79 88.197 15.044 79.161 C 11.462 84.262 10.528 89.916 16.104 93.06 C 68.304 120.279 86.957 127.879 88.275 125.348 C 89.97 122.096 75.159 100.213 60.364 78.363 C 41.753 50.865 23.158 23.387 31.214 8.244 C 39.125 -6.626 68.813 -3.481 141.405 35.162 C 152.208 40.571 158.984 55.266 135.818 70.744 C 140.364 64.582 137.163 58.197 130.745 55.156 Z" fill={sdC.cyan} fillRule="evenodd"></path>
        </g>
      </g>
      <g transform="translate(0,24.687)" opacity={dotO}>
        <g style={{ transform: `translateY(${(1 - dot) * -80}px) scale(${0.5 + 0.5 * dot})`, transformBox: "fill-box", transformOrigin: "center" }}>
          <path d="M 19.023 0 C 29.53 0 38.049 8.521 38.049 19.031 C 38.049 29.539 29.53 38.061 19.023 38.061 C 8.518 38.059 0 29.539 0 19.031 C 0 8.52 8.518 0 19.023 0 Z" fill={sdC.orange} fillRule="evenodd"></path>
        </g>
      </g>
    </svg>
  );
}

// ── Scene 1 · Logo open (0–5.5) ─────────────────────────────────────────────
function SdScene1() {
  return (
    <SdScene start={0} end={5.5} zoomFrom={1.02} zoomTo={1} fadeIn={0.01}>
      <Sprite start={0} end={5.5} keepMounted>
        {({ localTime }) => (
          <div style={{ position: "absolute", left: 960, top: 330, transform: "translateX(-50%)" }}>
            <SdLogoMark lt={localTime} width={310} at={0.3} />
          </div>
        )}
      </Sprite>
      <SdItem x={0} y={620} at={2.1} dur={0.7} w={1920} style={{ textAlign: "center" }}>
        <div style={{ fontFamily: sdF.bold, fontWeight: 700, fontSize: 96, letterSpacing: "-2px", color: sdC.ink }}>Sandhata UI</div>
      </SdItem>
      <SdItem x={0} y={760} at={2.7} dur={0.7} w={1920} style={{ textAlign: "center" }}>
        <div style={{ fontFamily: sdF.light, fontWeight: 300, fontSize: 34, color: sdC.n700 }}>
          Beautifully designed components you can customise, extend, and build on.
        </div>
      </SdItem>
    </SdScene>
  );
}

// ── Scene 2 · Colour (5.5–11.5) ─────────────────────────────────────────────
function SdSwatchCard({ x, y, at, color, name, hex }) {
  return (
    <SdItem x={x} y={y} at={at} dur={0.6} dy={34}>
      <div style={{ width: 300 }}>
        <div style={{ height: 210, borderRadius: 12, background: color, boxShadow: "0 1px 2px rgba(20,22,24,0.06)" }} />
        <div style={{ fontFamily: sdF.bold, fontWeight: 700, fontSize: 24, color: sdC.ink, marginTop: 18 }}>{name}</div>
        <div style={{ fontFamily: sdF.mono, fontSize: 20, color: sdC.n500, marginTop: 6 }}>{hex}</div>
      </div>
    </SdItem>
  );
}

function SdScene2() {
  const neutrals = [["0", "#FFFFFF"], ["50", sdC.n50], ["100", sdC.n100], ["200", sdC.n200], ["300", sdC.n300], ["500", sdC.n500], ["700", sdC.n700], ["900", sdC.n900], ["950", sdC.ink]];
  const status = [["Success", sdC.success], ["Error", sdC.error], ["Alert", sdC.alert], ["Info", sdC.info]];
  return (
    <SdScene start={5.5} end={11.5}>
      <SdSceneLabel num="01" title="Colour" />
      <SdSwatchCard x={160} y={300} at={0.6} color={sdC.blue} name="primaryblue-500" hex="#0036DD" />
      <SdSwatchCard x={593} y={300} at={0.75} color={sdC.blueBright} name="primaryblue-400" hex="#445CFF" />
      <SdSwatchCard x={1026} y={300} at={0.9} color={sdC.purple} name="purple-500" hex="#602DEA" />
      <SdSwatchCard x={1459} y={300} at={1.05} color={sdC.navy} name="secondaryblue-500" hex="#1F2A54" />
      {/* Neutral ramp */}
      <Sprite start={5.5} end={11.5} keepMounted>
        {({ localTime }) => (
          <div style={{ position: "absolute", left: 160, top: 660, display: "flex" }}>
            {neutrals.map(([step, hex], i) => {
              const e = sdP(localTime, 1.9 + i * 0.09, 0.5);
              return (
                <div key={step} style={{ opacity: e, transform: `translateY(${(1 - e) * 22}px)` }}>
                  <div style={{ width: 178, height: 96, background: hex, border: "1px solid rgba(20,22,24,0.08)", borderRadius: i === 0 ? "10px 0 0 10px" : i === neutrals.length - 1 ? "0 10px 10px 0" : 0 }} />
                  <div style={{ fontFamily: sdF.mono, fontSize: 18, color: sdC.n500, marginTop: 12 }}>{step}</div>
                </div>
              );
            })}
          </div>
        )}
      </Sprite>
      <SdItem x={160} y={850} at={3.1} dur={0.5}>
        <div style={{ fontFamily: sdF.light, fontWeight: 300, fontSize: 26, color: sdC.n700 }}>A cool neutral scale — colour is used sparingly and purposefully.</div>
      </SdItem>
      {/* Status colours */}
      <Sprite start={5.5} end={11.5} keepMounted>
        {({ localTime }) => (
          <div style={{ position: "absolute", left: 160, top: 930, display: "flex", gap: 28 }}>
            {status.map(([name, hex], i) => {
              const e = sdP(localTime, 3.6 + i * 0.12, 0.5, Easing.easeOutBack);
              return (
                <div key={name} style={{ opacity: clamp(e * 2, 0, 1), transform: `scale(${0.6 + 0.4 * e})`, display: "flex", alignItems: "center", gap: 12, border: `1px solid ${sdC.n200}`, borderRadius: 999, padding: "12px 26px", background: "#fff" }}>
                  <span style={{ width: 16, height: 16, borderRadius: 999, background: hex, display: "block" }} />
                  <span style={{ fontFamily: sdF.normal, fontSize: 22, color: sdC.n900 }}>{name}</span>
                </div>
              );
            })}
          </div>
        )}
      </Sprite>
    </SdScene>
  );
}

// ── Scene 3 · Typography (11.5–17.5) ────────────────────────────────────────
function SdScene3() {
  const rows = [
    { label: "Light", family: sdF.light, weight: 300, text: "Soft body and captions", at: 1.7 },
    { label: "Regular", family: sdF.normal, weight: 400, text: "Interface and body copy", at: 1.9 },
    { label: "Bold", family: sdF.bold, weight: 700, text: "Display and headings", at: 2.1 },
  ];
  const scaleLine = "display-large 48/64   ·   heading-h1 24/32   ·   body-medium 14/20   ·   caption 12/16";
  return (
    <SdScene start={11.5} end={17.5}>
      <SdSceneLabel num="02" title="Typography" />
      {/* Giant specimen — tracking settles from loose to tight */}
      <Sprite start={11.5} end={17.5} keepMounted>
        {({ localTime }) => {
          const e = sdP(localTime, 0.5, 1.3, Easing.easeOutQuart);
          const o = clamp((localTime - 0.5) / 0.6, 0, 1);
          return (
            <div style={{ position: "absolute", left: 160, top: 270, opacity: o, fontFamily: sdF.bold, fontWeight: 700, fontSize: 210, lineHeight: 1, color: sdC.ink, letterSpacing: `${0.09 - 0.095 * e}em`, whiteSpace: "nowrap" }}>
              Akkurat
            </div>
          );
        }}
      </Sprite>
      {rows.map((r, i) => (
        <SdItem key={r.label} x={160} y={570 + i * 92} at={r.at} dur={0.6}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 32 }}>
            <span style={{ fontFamily: sdF.mono, fontSize: 20, color: sdC.blue, width: 110 }}>{r.label}</span>
            <span style={{ fontFamily: r.family, fontWeight: r.weight, fontSize: 46, color: sdC.n900 }}>{r.text}</span>
          </div>
        </SdItem>
      ))}
      <SdItem x={160} y={570 + 3 * 92} at={2.3} dur={0.6}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 32 }}>
          <span style={{ fontFamily: sdF.mono, fontSize: 20, color: sdC.blue, width: 110 }}>Mono</span>
          <span style={{ fontFamily: sdF.mono, fontSize: 38, color: sdC.n900 }}>Code and tabular numbers — 24,828</span>
        </div>
      </SdItem>
      {/* Type scale ticker, typed on */}
      <Sprite start={11.5} end={17.5} keepMounted>
        {({ localTime }) => {
          const n = Math.floor(sdP(localTime, 3.4, 1.6, Easing.linear) * scaleLine.length);
          return (
            <div style={{ position: "absolute", left: 160, top: 968, fontFamily: sdF.mono, fontSize: 22, color: sdC.n500, whiteSpace: "pre" }}>
              {scaleLine.slice(0, n)}
              <span style={{ opacity: n < scaleLine.length ? 1 : 0, color: sdC.blue }}>▌</span>
            </div>
          );
        }}
      </Sprite>
    </SdScene>
  );
}

Object.assign(window, { sdC, sdF, sdP, SdItem, SdScene, SdSceneLabel, SdLogoMark, SdScene1, SdScene2, SdScene3 });
