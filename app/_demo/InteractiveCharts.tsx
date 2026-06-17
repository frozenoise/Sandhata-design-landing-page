// @ts-nocheck
"use client";
import React from "react";

/* ── helpers ─────────────────────────────────────────────────── */
function smoothPath(pts) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${p2[0]} ${p2[1]}`;
  }
  return d;
}
function series(seed, n) {
  let r = seed * 9301 + 49297;
  const rnd = () => { r = (r * 9301 + 49297) % 233280; return r / 233280; };
  return Array.from({ length: n }, (_, i) =>
    Math.min(0.94, Math.max(0.06, 0.3 + 0.5 * Math.abs(Math.sin(i * 0.55 + seed)) * (0.5 + 0.7 * rnd())))
  );
}

/* ── Line chart: gradient stroke, left→right wipe, hover tooltip,
      desktop/mobile dataset switch (re-animates via key) ───────── */
export function LineChartInteractive({ axis, active = "desktop" }) {
  const n = axis.length;
  const data = React.useMemo(
    () => series(active === "mobile" ? 42 : 7, n),
    [active, n]
  );
  const values = data.map((v) => Math.round(600 + v * 1900));
  const W = 900, H = 240, pad = 18;
  const pts = data.map((v, i) => [pad + (i / (n - 1)) * (W - 2 * pad), H - pad - v * (H - 2.4 * pad)]);
  const line = smoothPath(pts);
  const uid = React.useId().replace(/:/g, "");
  const [hi, setHi] = React.useState(null);
  const ref = React.useRef(null);
  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    let i = Math.round(((e.clientX - r.left) / r.width) * (n - 1));
    setHi(Math.max(0, Math.min(n - 1, i)));
  };
  return (
    <div ref={ref} style={{ position: "relative" }} onMouseMove={move} onMouseLeave={() => setHi(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: "100%", height: H, display: "block" }}>
        <defs>
          <linearGradient id={`l${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--colour-primaryblue-300)" />
            <stop offset="55%" stopColor="var(--colour-primaryblue-500)" />
            <stop offset="100%" stopColor="var(--colour-primaryblue-700)" />
          </linearGradient>
          <linearGradient id={`lf${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--colour-primaryblue-400)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--colour-primaryblue-400)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g key={active} className="wipe-lr">
          <path d={`${line} L ${W - pad} ${H - pad} L ${pad} ${H - pad} Z`} fill={`url(#lf${uid})`} stroke="none" />
          <path d={line} fill="none" stroke={`url(#l${uid})`} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        {hi != null && (
          <>
            <line x1={pts[hi][0]} y1={pad} x2={pts[hi][0]} y2={H - pad} stroke="var(--colour-primaryblue-300)" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx={pts[hi][0]} cy={pts[hi][1]} r="5.5" fill="#fff" stroke="var(--colour-primaryblue-500)" strokeWidth="2.5" />
          </>
        )}
      </svg>
      {hi != null && (
        <div className="ch-tip" style={{ left: `${(pts[hi][0] / W) * 100}%`, top: `${(pts[hi][1] / H) * 100}%` }}>
          <strong>{values[hi].toLocaleString()}</strong>
          <span>{axis[hi]} · {active}</span>
        </div>
      )}
    </div>
  );
}

/* ── Area chart: gradient fill + animated stroke, left→right wipe ── */
export function AreaChartInteractive({ axis, seed = 9 }) {
  const n = axis?.length || 24;
  const data = React.useMemo(() => series(seed, n), [seed, n]);
  const W = 760, H = 180, pad = 12;
  const pts = data.map((v, i) => [pad + (i / (n - 1)) * (W - 2 * pad), H - pad - v * (H - 2.6 * pad)]);
  const line = smoothPath(pts);
  const area = `${line} L ${W - pad} ${H - pad} L ${pad} ${H - pad} Z`;
  const uid = React.useId().replace(/:/g, "");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: "100%", height: H, display: "block" }} className="wipe-lr">
      <defs>
        <linearGradient id={`a${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--colour-primaryblue-400)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--colour-primaryblue-400)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`as${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--colour-primaryblue-300)" />
          <stop offset="100%" stopColor="var(--colour-primaryblue-600)" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#a${uid})`} />
      <path d={line} fill="none" stroke={`url(#as${uid})`} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

/* ── Radar: scale-from-centre reveal, hover vertices show data ──── */
export function RadarInteractive({ size = 200 }) {
  const cx = size / 2, cy = size / 2 + 4, R = size * 0.34;
  const labels = ["January", "February", "March", "April", "May", "June"];
  const data = [0.82, 0.55, 0.72, 0.9, 0.5, 0.66];
  const vals = [820, 540, 720, 1180, 500, 700];
  const ang = (i) => -Math.PI / 2 + i * Math.PI / 3;
  const ring = (f) => data.map((_, i) => `${cx + R * f * Math.cos(ang(i))},${cy + R * f * Math.sin(ang(i))}`).join(" ");
  const dpts = data.map((v, i) => [cx + R * v * Math.cos(ang(i)), cy + R * v * Math.sin(ang(i))]);
  const [h, setH] = React.useState(null);
  return (
    <div style={{ position: "relative", width: size, maxWidth: "100%" }}>
      <svg viewBox={`0 0 ${size} ${size}`} style={{ width: "100%", display: "block", overflow: "visible" }}>
        {[0.34, 0.67, 1].map((f, i) => <polygon key={i} points={ring(f)} fill="none" stroke="rgba(10,10,20,0.10)" />)}
        {data.map((_, i) => <line key={i} x1={cx} y1={cy} x2={cx + R * Math.cos(ang(i))} y2={cy + R * Math.sin(ang(i))} stroke="rgba(10,10,20,0.07)" />)}
        <g className="radar-in">
          <polygon points={dpts.map((p) => p.join(",")).join(" ")} fill="var(--colour-primaryblue-500)" fillOpacity="0.18" stroke="var(--colour-primaryblue-500)" strokeWidth="1.6" />
          {dpts.map((p, i) => (
            <circle key={i} cx={p[0]} cy={p[1]} r={h === i ? 6 : 4} fill="var(--colour-primaryblue-500)"
              style={{ cursor: "pointer", transition: "r .12s" }}
              onMouseEnter={() => setH(i)} onMouseLeave={() => setH(null)} />
          ))}
        </g>
        {labels.map((l, i) => {
          const lx = cx + (R + 14) * Math.cos(ang(i)), ly = cy + (R + 14) * Math.sin(ang(i));
          return <text key={l} x={lx} y={ly} fontSize="8" fill="#8a8f9b" textAnchor="middle" dominantBaseline="middle">{l}</text>;
        })}
      </svg>
      {h != null && (
        <div className="ch-tip" style={{ left: `${(dpts[h][0] / size) * 100}%`, top: `${(dpts[h][1] / size) * 100}%` }}>
          <strong>{vals[h].toLocaleString()}</strong><span>{labels[h]}</span>
        </div>
      )}
    </div>
  );
}

/* ── Calendar with Day / Week / Month views ─────────────────────── */
const HOURS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00"];
const WD = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const EVENTS = [
  { day: 0, h: 0, len: 1, label: "Daily Standup", c: "var(--colour-primaryblue-500)" },
  { day: 1, h: 2, len: 2, label: "Design Review", c: "#f5a623" },
  { day: 3, h: 1, len: 1, label: "1:1 Sync", c: "#dc2626" },
  { day: 4, h: 3, len: 2, label: "Sprint Planning", c: "var(--colour-primaryblue-400)" },
];

export function DemoCalendar({ headerBg }) {
  const [view, setView] = React.useState("week");
  const [open, setOpen] = React.useState(false);
  const today = 4;

  return (
    <div>
      <div className="cal-head" style={{ background: headerBg }}>
        <span style={{ font: "700 13px/1 var(--font-bold)" }}>≡ 01-07 January 2022</span>
        <div style={{ position: "relative" }}>
          <button className="cal-viewbtn" onClick={() => setOpen((o) => !o)}>
            {view[0].toUpperCase() + view.slice(1)} ▾
          </button>
          {open && (
            <div className="cal-viewmenu">
              {["day", "week", "month"].map((v) => (
                <button key={v} className={v === view ? "on" : ""} onClick={() => { setView(v); setOpen(false); }}>
                  {v[0].toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {view === "month" && (
        <div style={{ padding: 16 }}>
          <div className="cal-month">
            {WD.map((d) => <span key={d} className="hd">{d}</span>)}
            {/* Jan 1 2022 = Saturday → 5 leading blanks (Mon-start) */}
            {Array.from({ length: 5 }).map((_, i) => <span key={`b${i}`} />)}
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
              const ev = EVENTS.find((e) => e.day === (d - 1) % 7 && d <= 7);
              return (
                <span key={d} className={`cell${d === today ? " today" : ""}`}>
                  {d}{ev && <i style={{ background: ev.c }} />}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {view !== "month" && (
        <div className="cal-week">
          <div className="cal-week-head">
            <span />
            {(view === "day" ? ["Tue"] : WD).map((d, i) => (
              <span key={d} className={i === today && view === "week" ? "on" : ""}>{d}</span>
            ))}
          </div>
          <div className="cal-week-body" style={{ gridTemplateColumns: view === "day" ? "48px 1fr" : "48px repeat(7, 1fr)" }}>
            {HOURS.map((hr, ri) => (
              <React.Fragment key={hr}>
                <span className="cal-hour">{hr}</span>
                {(view === "day" ? [3] : [0, 1, 2, 3, 4, 5, 6]).map((di) => {
                  const ev = EVENTS.find((e) => e.day === di && e.h === ri);
                  return (
                    <div key={di} className="cal-slot">
                      {ev && <div className="cal-event" style={{ background: ev.c, height: ev.len * 38 - 6 }}>{ev.label}</div>}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Date picker (Figma calendar 3872:11573 / small calendar) ───── */
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const WDAYS = ["m","t","w","t","f","s","s"];

export function DateField({ label = "Single date field", helper, required = false }) {
  const [open, setOpen] = React.useState(false);
  const [sel, setSel] = React.useState(null);            // selected Date
  const [view, setView] = React.useState(new Date(2022, 0, 1)); // shown month
  const ref = React.useRef(null);

  React.useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const y = view.getFullYear(), m = view.getMonth();
  const startOffset = (new Date(y, m, 1).getDay() + 6) % 7;   // Monday-start
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const prevDays = new Date(y, m, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push({ d: prevDays - startOffset + 1 + i, other: true });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ d, other: false });
  while (cells.length % 7 !== 0 || cells.length < 35) cells.push({ d: cells.length - (startOffset + daysInMonth) + 1, other: true });

  const pad = (n) => String(n).padStart(2, "0");
  const value = sel ? `${pad(sel.getDate())}/${pad(sel.getMonth() + 1)}/${sel.getFullYear()}` : "";
  const isSel = (d) => sel && !d.other && sel.getFullYear() === y && sel.getMonth() === m && sel.getDate() === d.d;
  const shift = (n) => setView(new Date(y, m + n, 1));

  return (
    <div className="dp" ref={ref}>
      <label className="dp-label">{label}{required && <span style={{ color: "var(--text-error,#dc2626)" }}> *</span>}</label>
      <button type="button" className={`dp-field${open ? " open" : ""}`} onClick={() => setOpen((o) => !o)}>
        <span className={value ? "" : "ph"}>{value || "DD/MM/YYYY"}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
      </button>
      {helper && <div className="dp-helper">{helper}</div>}
      {open && (
        <div className="dp-pop">
          <div className="dp-head">
            <button type="button" className="dp-nav" onClick={() => shift(-1)} aria-label="Previous month">‹</button>
            <span className="dp-title">{MONTHS[m]} {y}</span>
            <button type="button" className="dp-nav" onClick={() => shift(1)} aria-label="Next month">›</button>
          </div>
          <div className="dp-grid">
            {WDAYS.map((w, i) => <span key={i} className="dp-wd">{w}</span>)}
            {cells.map((c, i) => (
              <button
                key={i}
                type="button"
                className={`dp-day${c.other ? " muted" : ""}${isSel(c) ? " sel" : ""}`}
                onClick={() => { if (!c.other) { setSel(new Date(y, m, c.d)); setOpen(false); } }}
              >
                {pad(c.d)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
