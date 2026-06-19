"use client";
import React from "react";
import "../globals.css";
import {
  Button, Badge, Alert, Input, Select, Textarea,
  Switch, Checkbox, Radio, StatCard, Tooltip,
} from "@/components";

/* ── Token ramp helper (mirrors demo/page.tsx) ───────────────────── */
const ramp = (base: string): React.CSSProperties => ({
  "--colour-primaryblue-50":  `var(--colour-${base}-50)`,
  "--colour-primaryblue-100": `var(--colour-${base}-100)`,
  "--colour-primaryblue-200": `var(--colour-${base}-200)`,
  "--colour-primaryblue-300": `var(--colour-${base}-300)`,
  "--colour-primaryblue-400": `var(--colour-${base}-400)`,
  "--colour-primaryblue-500": `var(--colour-${base}-500)`,
  "--colour-primaryblue-600": `var(--colour-${base}-600)`,
  "--colour-primaryblue-700": `var(--colour-${base}-700)`,
} as React.CSSProperties);

/* ── Config constants ────────────────────────────────────────────── */
const ACCENTS = [
  { name:"Sandhata Blue", token:"--colour-primaryblue-500", hex:"#0036DD", vars: ramp("primaryblue") },
  { name:"Purple",        token:"--colour-alternativepurple-500", hex:"#602DEA", vars: ramp("alternativepurple") },
  { name:"Cyan",          token:"--colour-secondarycyan-500", hex:"#00D4D4", vars: ramp("secondarycyan") },
  { name:"Amber",         token:"--colour-alert-500",         hex:"#FFC228", vars: {
    "--colour-primaryblue-50":"var(--colour-alert-50)",
    "--colour-primaryblue-100":"var(--colour-alert-100)",
    "--colour-primaryblue-300":"var(--colour-alert-300)",
    "--colour-primaryblue-500":"var(--colour-alert-500)",
    "--colour-primaryblue-600":"var(--colour-alert-600)",
    "--colour-primaryblue-700":"var(--colour-alert-700)",
  } as React.CSSProperties },
  { name:"Crimson",       token:"--colour-error-500",         hex:"#D21B00", vars: {
    "--colour-primaryblue-50":"var(--colour-error-50)",
    "--colour-primaryblue-100":"var(--colour-error-100)",
    "--colour-primaryblue-300":"var(--colour-error-300)",
    "--colour-primaryblue-500":"var(--colour-error-500)",
    "--colour-primaryblue-600":"var(--colour-error-600)",
    "--colour-primaryblue-700":"var(--colour-error-700)",
  } as React.CSSProperties },
];

const SURFACES = {
  white: { label:"Pure White", bg:"#ffffff", tokens:{} as React.CSSProperties },
  warm:  { label:"Warm",       bg:"#fdf5f0", tokens:{} as React.CSSProperties },
  dark:  { label:"Ink Dark",   bg:"#0d0d1a", tokens:{
    "--surface-raised":    "#1a1a2e",
    "--surface-secondary": "#16162a",
    "--surface-disabled":  "rgba(255,255,255,0.08)",
    "--text-title":        "rgba(255,255,255,0.95)",
    "--text-body":         "rgba(255,255,255,0.78)",
    "--text-subtitle":     "rgba(255,255,255,0.60)",
    "--text-caption":      "rgba(255,255,255,0.38)",
    "--text-disabled":     "rgba(255,255,255,0.25)",
    "--border-subtle":     "rgba(255,255,255,0.07)",
    "--border-default":    "rgba(255,255,255,0.12)",
    "--field-02":          "rgba(255,255,255,0.06)",
  } as React.CSSProperties },
};

const RADII = [
  { label:"None", px:"0px",  vars:{ "--radius-xs":"0","--radius-sm":"0","--radius-md":"0","--radius-lg":"0","--radius-xl":"0","--radius-pill":"999px" } as React.CSSProperties },
  { label:"SM",   px:"4px",  vars:{ "--radius-xs":"2px","--radius-sm":"4px","--radius-md":"4px","--radius-lg":"6px","--radius-xl":"8px","--radius-pill":"999px" } as React.CSSProperties },
  { label:"MD",   px:"6px",  vars:{} as React.CSSProperties },
  { label:"LG",   px:"10px", vars:{ "--radius-xs":"4px","--radius-sm":"6px","--radius-md":"10px","--radius-lg":"14px","--radius-xl":"20px","--radius-pill":"999px" } as React.CSSProperties },
];

const LIGHT_RESETS: React.CSSProperties = {
  "--surface-raised":  "#ffffff",
  "--surface-page":    "#ffffff",
  "--text-title":      "#202225",
  "--text-body":       "#3c4044",
  "--text-subtitle":   "#585f65",
  "--text-caption":    "#777880",
  "--border-subtle":   "rgba(20,22,24,0.08)",
  "--border-default":  "rgba(20,22,24,0.14)",
  "--field-02":        "#ffffff",
} as React.CSSProperties;

const CLIENT_THEMES = [
  {
    name:"TechNip Energies", sector:"Energy sector · enterprise analytics",
    brandColor:"#00D4C8", vars: ramp("secondarycyan"),
  },
  {
    name:"Aviva Insurance",  sector:"Financial services · policy management",
    brandColor:"#12347e",
    vars: {
      "--colour-primaryblue-50":"#e8ecf5",
      "--colour-primaryblue-100":"#c8d1e8",
      "--colour-primaryblue-300":"#7a92c9",
      "--colour-primaryblue-500":"#12347e",
      "--colour-primaryblue-600":"#0c2b66",
      "--colour-primaryblue-700":"#081f4e",
    } as React.CSSProperties,
  },
  {
    name:"Sandhata Default", sector:"Design system · reference implementation",
    brandColor:"#0036DD", vars: ramp("primaryblue"),
  },
];

/* ── Shared helpers ──────────────────────────────────────────────── */
function GradientRule() {
  return <div style={{ height:3, background:"linear-gradient(90deg,#f68136 0%,#ff0083 50%,#5636f6 100%)" }}/>;
}
function BandTag({ children }: { children:React.ReactNode }) {
  return (
    <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.10em", textTransform:"uppercase",
      color:"var(--text-caption)", fontFamily:"var(--font-normal)", margin:"0 0 18px" }}>
      {children}
    </p>
  );
}

/* ── Inline RadarChart (copied from app/page.tsx, uses .rtu-tip) ─── */
function RadarChart() {
  const [hi, setHi] = React.useState<number|null>(null);
  const cx = 90, cy = 92, R = 66;
  const data   = [0.82, 0.55, 0.72, 0.88, 0.50, 0.66];
  const values = [820,  550,  720,  880,  500,  660];
  const labels = ["January","February","March","April","May","June"];
  const ang = (i: number) => -Math.PI/2 + i*Math.PI/3;
  const ring = (f: number) => [0,1,2,3,4,5].map(i => {
    const a = ang(i);
    return `${cx + R*f*Math.cos(a)},${cy + R*f*Math.sin(a)}`;
  }).join(" ");
  const pts = data.map((v,i) => [cx + R*v*Math.cos(ang(i)), cy + R*v*Math.sin(ang(i))]);
  const dpts = pts.map(p => p.join(",")).join(" ");
  return (
    <div style={{ position:"relative" }}>
      <svg viewBox="0 0 180 184" width="100%" style={{ display:"block" }}>
        {[0.34,0.67,1].map((f,i) => (
          <polygon key={i} points={ring(f)} fill="none" stroke="rgba(10,10,20,0.10)"/>
        ))}
        {[0,1,2,3,4,5].map(i => {
          const a = ang(i), ex = cx + R*Math.cos(a), ey = cy + R*Math.sin(a);
          return <line key={i} x1={cx} y1={cy} x2={ex} y2={ey} stroke="rgba(10,10,20,0.07)"/>;
        })}
        <polygon points={dpts} fill="rgba(0,54,221,0.14)" stroke="var(--colour-primaryblue-500)" strokeWidth="1.6"/>
        {pts.map((p,i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r={hi===i ? 5.5 : 3.5}
            fill={hi===i ? "var(--colour-primaryblue-500)" : "#fff"}
            stroke="var(--colour-primaryblue-500)" strokeWidth="1.6"
            style={{ cursor:"pointer", transition:"r .15s ease" }}
            onMouseEnter={() => setHi(i)} onMouseLeave={() => setHi(null)}
          />
        ))}
        {labels.map((l,i) => {
          const a = ang(i), lx = cx + (R+13)*Math.cos(a), ly = cy + (R+13)*Math.sin(a);
          return <text key={l} x={lx} y={ly} fontSize="8"
            fill={hi===i?"var(--colour-primaryblue-500)":"#8a8f9b"}
            textAnchor="middle" dominantBaseline="middle"
            style={{ transition:"fill .15s" }}>{l}</text>;
        })}
      </svg>
      {hi !== null && (
        <div className="rtu-tip" style={{ left:`${(pts[hi][0]/180)*100}%`, top:`${(pts[hi][1]/184)*100}%` }}>
          {values[hi].toLocaleString()}<span>{labels[hi]}</span>
        </div>
      )}
    </div>
  );
}

function MiniSparkline() {
  const raw = [40,28,34,12,22,8,18,5,15,3,10,2];
  const max = Math.max(...raw);
  const W = 240, H = 52;
  const pts = raw.map((v,i) => [i*(W/(raw.length-1)), H - (v/max)*H*0.88 - 4]);
  const d = "M " + pts.map(p => p.join(",")).join(" L ");
  const area = `${d} L ${W},${H} L 0,${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:52, display:"block" }}>
      <defs>
        <linearGradient id="spkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--colour-primaryblue-500)" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="var(--colour-primaryblue-500)" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spkGrad)"/>
      <path d={d} fill="none" stroke="var(--colour-primaryblue-500)" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function MiniBarChart() {
  const data = [0.45,0.60,0.50,0.82,0.65,0.90,0.74,1.0,0.76,0.68,0.88,0.93];
  const labels = ["J","F","M","A","M","J","J","A","S","O","N","D"];
  const W = 220, H = 52;
  const bw = W/data.length - 3;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:52, display:"block" }}>
      {data.map((v,i) => {
        const h = v * (H - 12);
        const x = i*(W/data.length);
        return (
          <g key={i}>
            <rect x={x+1} y={H-h-4} width={bw} height={h}
              fill={i===data.length-1 ? "var(--colour-primaryblue-500)" : "var(--colour-primaryblue-100)"}
              rx={2}/>
            <text x={x+1+bw/2} y={H-1} textAnchor="middle" fontSize="7" fill="var(--text-caption)">{labels[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
export default function ShowcasePage() {
  const [accentIdx,  setAccentIdx ] = React.useState(0);
  const [surface,    setSurface   ] = React.useState<"white"|"warm"|"dark">("white");
  const [radiusIdx,  setRadiusIdx ] = React.useState(2);
  const [showTokens, setShowTokens] = React.useState(false);

  const [sw,  setSw ] = React.useState(true);
  const [ck,  setCk ] = React.useState([true, false, false]);
  const [rv,  setRv ] = React.useState("opt1");

  const accent    = ACCENTS[accentIdx];
  const surfCfg   = SURFACES[surface];
  const radiusCfg = RADII[radiusIdx];

  const mainVars: React.CSSProperties = {
    ...accent.vars,
    ...surfCfg.tokens,
    ...radiusCfg.vars,
  } as React.CSSProperties;

  function ShowToken({ token, children, side="top" }: { token:string; children:React.ReactElement; side?:"top"|"bottom"|"left"|"right" }) {
    if (!showTokens) return children;
    return <Tooltip label={token} side={side}>{children}</Tooltip>;
  }

  /* ─ Hero ──────────────────────────────────────────────────────── */
  const HeroBand = () => (
    <section style={{ position:"relative", overflow:"hidden", padding:"64px 48px 52px", background:"#fdf5f0" }}>
      <div className="hero-aurora"/>
      <div style={{ position:"relative", zIndex:1, textAlign:"center" }}>
        <p style={{ fontFamily:"var(--font-normal)", fontSize:11, fontWeight:700, letterSpacing:"0.10em",
          textTransform:"uppercase", color:"rgba(0,0,0,0.35)", margin:"0 0 16px" }}>
          SANDHATA DESIGN SYSTEM
        </p>
        <h1 style={{ fontFamily:"var(--font-bold)", fontSize:48, fontWeight:700, lineHeight:1.1,
          letterSpacing:"-1.5px", color:"#0a0a14", margin:"0 0 16px" }}>
          The design system,{" "}
          <em style={{ fontStyle:"normal", color:"#d58b03" }}>alive.</em>
        </h1>
        <p style={{ fontFamily:"var(--font-normal)", fontSize:16, color:"#585f65",
          maxWidth:460, margin:"0 auto 32px", lineHeight:1.6 }}>
          120+ components, 1.2k tokens, WCAG AA. Built for enterprise teams that ship.
        </p>
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
          {[["120+","Components"],["1.2k","Design Tokens"],["WCAG","AA Compliant"],["v1.0","Stable"]].map(([val,label]) => (
            <div key={label} style={{ display:"inline-flex", alignItems:"center", gap:8,
              padding:"8px 18px", background:"rgba(255,255,255,0.70)", backdropFilter:"blur(8px)",
              WebkitBackdropFilter:"blur(8px)", border:"1px solid rgba(20,22,24,0.08)",
              borderRadius:"var(--radius-pill)" }}>
              <span style={{ fontFamily:"var(--font-bold)", fontWeight:700, fontSize:14, color:"#0a0a14" }}>{val}</span>
              <span style={{ fontFamily:"var(--font-normal)", fontSize:13, color:"#585f65" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  /* ─ Atoms ─────────────────────────────────────────────────────── */
  const AtomsBand = () => (
    <section style={{ padding:"44px 48px", background:"var(--surface-raised, #fff)" }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:40 }}>

        {/* Buttons */}
        <div>
          <BandTag>Button · 6 hierarchies</BandTag>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {(["primary","secondary","tertiary","ghost","inverse","danger"] as const).map(h => (
              <div key={h} style={{ display:"flex", alignItems:"center", gap:10 }}>
                <ShowToken token={`hierarchy="${h}"`}>
                  <Button hierarchy={h} size="small">{h.charAt(0).toUpperCase()+h.slice(1)}</Button>
                </ShowToken>
                <span style={{ fontFamily:"var(--font-mono)", fontSize:10, color:"var(--text-caption)" }}>{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div>
          <BandTag>Badge · 7 semantic tones</BandTag>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {(["neutral","info","success","warning","error","action","highlight"] as const).map(t => (
              <div key={t} style={{ display:"flex", alignItems:"center", gap:10 }}>
                <ShowToken token={`tone="${t}"`} side="right">
                  <Badge tone={t} dot>{t}</Badge>
                </ShowToken>
                <span style={{ fontFamily:"var(--font-mono)", fontSize:10, color:"var(--text-caption)" }}>{t}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop:14, display:"flex", gap:6 }}>
            <Badge tone="action" variant="solid">Solid</Badge>
            <Badge tone="highlight" variant="solid">Solid</Badge>
          </div>
        </div>

        {/* Input states */}
        <div>
          <BandTag>Input · 4 states</BandTag>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

            <div>
              <p style={{ fontFamily:"var(--font-normal)", fontSize:10, fontWeight:700,
                color:"var(--text-caption)", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:6 }}>
                Default
              </p>
              <Input label="Project name" placeholder="Enter project name"/>
            </div>

            <div>
              <p style={{ fontFamily:"var(--font-normal)", fontSize:10, fontWeight:700,
                color:"var(--text-caption)", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:6 }}>
                Focus (active)
              </p>
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                <label style={{ fontFamily:"var(--font-bold)", fontWeight:700,
                  fontSize:"var(--label-size, 12px)", color:"var(--text-subtitle)",
                  letterSpacing:"var(--label-tracking, 0.01em)" }}>Search</label>
                <div style={{ height:40, padding:"0 12px", display:"flex", alignItems:"center",
                  border:"1.5px solid var(--colour-primaryblue-500)", borderRadius:"var(--radius-sm)",
                  background:"var(--field-02, #fff)", boxShadow:"0 0 0 3px rgba(0,54,221,0.18)",
                  fontFamily:"var(--font-normal)", fontSize:"var(--body-medium-size, 14px)",
                  color:"var(--text-body)" }}>design system</div>
              </div>
            </div>

            <div>
              <p style={{ fontFamily:"var(--font-normal)", fontSize:10, fontWeight:700,
                color:"var(--text-caption)", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:6 }}>
                Error
              </p>
              <Input label="Email address" error="Please enter a valid email" defaultValue="not-an-email"/>
            </div>

            <div>
              <p style={{ fontFamily:"var(--font-normal)", fontSize:10, fontWeight:700,
                color:"var(--text-caption)", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:6 }}>
                Disabled
              </p>
              <Input label="API Key" disabled defaultValue="sk-••••••••••••••••"/>
            </div>
          </div>
        </div>

        {/* Selection controls */}
        <div>
          <BandTag>Selection controls</BandTag>
          <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
            <Switch checked={sw} onChange={setSw} label={sw ? "Notifications on" : "Notifications off"}/>
            <div>
              <p style={{ fontFamily:"var(--font-normal)", fontSize:10, fontWeight:700,
                color:"var(--text-caption)", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:8 }}>
                Checkbox
              </p>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {["Export as PNG","Export as SVG","Export as PDF"].map((l,i) => (
                  <Checkbox key={l} label={l} checked={ck[i]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setCk(c => c.map((x: boolean,j: number) => j===i ? e.target.checked : x))}/>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontFamily:"var(--font-normal)", fontSize:10, fontWeight:700,
                color:"var(--text-caption)", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:8 }}>
                Radio
              </p>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {["Light mode","Dark mode","System"].map((l,i) => {
                  const val = `opt${i+1}`;
                  return <Radio key={l} name="sc-display" value={val} label={l}
                    checked={rv===val} onChange={() => setRv(val)}/>;
                })}
              </div>
            </div>
            <Select label="Environment"
              options={["Development","Staging","Production"]}
              placeholder="Select environment"/>
          </div>
        </div>
      </div>
    </section>
  );

  /* ─ Data ──────────────────────────────────────────────────────── */
  const DataBand = () => (
    <section style={{ padding:"44px 48px", background:"var(--surface-secondary, #f5f6f8)" }}>
      <BandTag>Data visualisation</BandTag>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 200px", gap:16, marginBottom:16 }}>
        <StatCard label="Revenue" value="£2.4M" trend="+12% vs last quarter" trendDirection="up"/>
        <StatCard label="Active Users" value="48,291" trend="+5.3% this week" trendDirection="up"/>
        <StatCard label="Customer Satisfaction" value="4.8 / 5" trend="+0.3pt this month" trendDirection="up"/>
        <div style={{ background:"var(--surface-raised, #fff)", border:"1px solid var(--border-subtle)",
          borderRadius:"var(--radius-lg)", padding:"14px 16px" }}>
          <p style={{ fontFamily:"var(--font-normal)", fontSize:10, fontWeight:700, letterSpacing:"0.08em",
            textTransform:"uppercase", color:"var(--text-caption)", margin:"0 0 4px" }}>Visitors · Radar</p>
          <RadarChart/>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <div style={{ background:"var(--surface-raised, #fff)", border:"1px solid var(--border-subtle)",
          borderRadius:"var(--radius-lg)", padding:"20px 20px 14px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <p style={{ fontFamily:"var(--font-bold)", fontWeight:700, fontSize:14, color:"var(--text-title)", margin:0 }}>Revenue trend</p>
            <Badge tone="success" dot>Live</Badge>
          </div>
          <MiniSparkline/>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
            <span style={{ fontFamily:"var(--font-normal)", fontSize:11, color:"var(--text-caption)" }}>Jan 2026</span>
            <span style={{ fontFamily:"var(--font-normal)", fontSize:11, color:"var(--text-caption)" }}>Dec 2026</span>
          </div>
        </div>
        <div style={{ background:"var(--surface-raised, #fff)", border:"1px solid var(--border-subtle)",
          borderRadius:"var(--radius-lg)", padding:"20px 20px 14px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <p style={{ fontFamily:"var(--font-bold)", fontWeight:700, fontSize:14, color:"var(--text-title)", margin:0 }}>Component usage</p>
            <span style={{ fontFamily:"var(--font-normal)", fontSize:11, color:"var(--text-caption)" }}>Last 12 months</span>
          </div>
          <MiniBarChart/>
        </div>
      </div>
    </section>
  );

  /* ─ Themes ────────────────────────────────────────────────────── */
  const ThemesBand = () => (
    <section style={{ padding:"56px 48px", background:"#000921" }}>
      <div style={{ textAlign:"center", marginBottom:44 }}>
        <p style={{ fontFamily:"var(--font-normal)", fontSize:11, fontWeight:700, letterSpacing:"0.10em",
          textTransform:"uppercase", color:"rgba(255,255,255,0.28)", margin:"0 0 14px" }}>Multi-tenant Theming</p>
        <h2 style={{ fontFamily:"var(--font-bold)", fontSize:38, fontWeight:700, color:"#fff",
          letterSpacing:"-1px", margin:"0 0 14px" }}>
          One system.{" "}<span style={{ color:"#f68136" }}>Any brand.</span>
        </h2>
        <p style={{ fontFamily:"var(--font-normal)", fontSize:15, color:"rgba(255,255,255,0.40)",
          maxWidth:460, margin:"0 auto", lineHeight:1.6 }}>
          The same components, tokens, and structure — skinned to any client brand in minutes.
          Change one CSS variable; the whole product re-colours.
        </p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
        {CLIENT_THEMES.map(t => (
          <div key={t.name} style={{
            ...t.vars, ...LIGHT_RESETS,
            borderRadius:"var(--radius-xl)", background:"#ffffff",
            overflow:"hidden", border:"1px solid rgba(255,255,255,0.06)",
          } as React.CSSProperties}>
            <div style={{ height:4, background:t.brandColor }}/>
            <div style={{ padding:24 }}>
              <p style={{ fontFamily:"var(--font-bold)", fontWeight:700, fontSize:14, color:"#202225", margin:"0 0 2px" }}>{t.name}</p>
              <p style={{ fontFamily:"var(--font-normal)", fontSize:12, color:"#585f65", margin:"0 0 16px" }}>{t.sector}</p>
              <div style={{ marginBottom:12 }}>
                <StatCard label="Projects" value="142" trend="+12% this month" trendDirection="up"/>
              </div>
              <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                <Button hierarchy="primary" style={{ flex:1 }}>Create Report</Button>
                <Button hierarchy="tertiary">Filter</Button>
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                <Badge tone="action">Active</Badge>
                <Badge tone="success">Synced</Badge>
                <Badge tone="neutral">14 members</Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  /* ─ System ────────────────────────────────────────────────────── */
  const SystemBand = () => (
    <section style={{ padding:"44px 48px", background:"var(--surface-raised, #fff)" }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:40, marginBottom:40 }}>

        {/* Alerts */}
        <div>
          <BandTag>Alert · 4 tones</BandTag>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <Alert tone="info"    title="System update">Maintenance scheduled for Sunday 2–4 AM UTC.</Alert>
            <Alert tone="success" title="Deployed!">v2.4.1 is live on production.</Alert>
            <Alert tone="warning" title="Token drift">3 tokens have diverged from the Figma source.</Alert>
            <Alert tone="error"   title="Build failed">TypeScript errors in Button.d.ts — see CI log.</Alert>
          </div>
        </div>

        {/* Form anatomy */}
        <div>
          <BandTag>Form anatomy</BandTag>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <Input label="Full name" required placeholder="Jane Smith" helper="As shown on your passport"/>
            <Select label="Country" options={["United Kingdom","Ireland","France","Germany"]} placeholder="Select country"/>
            <Textarea label="Notes" rows={3} placeholder="Any additional context…"/>
            <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
              <Button hierarchy="tertiary">Cancel</Button>
              <Button hierarchy="primary">Submit</Button>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div>
          <BandTag>IBM Plex Sans · type scale</BandTag>
          <div style={{ display:"flex", flexDirection:"column" }}>
            {[
              { label:"Display · 48px",    s:{ fontFamily:"var(--font-bold)", fontWeight:700, fontSize:"var(--display-large-size, 48px)", lineHeight:1.1, letterSpacing:"-1.5px", color:"var(--text-title)" } },
              { label:"Heading 1 · 24px",  s:{ fontFamily:"var(--font-bold)", fontWeight:700, fontSize:"var(--heading-h1-size, 24px)", lineHeight:1.25, letterSpacing:"-0.25px", color:"var(--text-title)" } },
              { label:"Heading 2 · 20px",  s:{ fontFamily:"var(--font-bold)", fontWeight:700, fontSize:"var(--heading-h2-size, 20px)", lineHeight:1.3, color:"var(--text-title)" } },
              { label:"Body large · 16px", s:{ fontFamily:"var(--font-normal)", fontSize:"var(--body-large-size, 16px)", lineHeight:1.5, color:"var(--text-body)" } },
              { label:"Body · 14px",       s:{ fontFamily:"var(--font-normal)", fontSize:"var(--body-medium-size, 14px)", lineHeight:1.5, color:"var(--text-body)" } },
              { label:"Caption · 12px",    s:{ fontFamily:"var(--font-normal)", fontSize:"var(--caption-size, 12px)", letterSpacing:"0.04em", color:"var(--text-caption)" } },
              { label:"Mono · 12px",       s:{ fontFamily:"var(--font-mono)", fontSize:"var(--code-size, 12px)", lineHeight:1.5, color:"var(--text-caption)" } },
            ].map(({ label, s }) => (
              <div key={label} style={{ padding:"10px 0", borderBottom:"1px solid var(--border-subtle)" }}>
                <p style={{ ...s, margin:0 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Colour token grid */}
      <div style={{ paddingTop:32, borderTop:"1px solid var(--border-subtle)" }}>
        <BandTag>Data-viz palette · 6 tokens</BandTag>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:10 }}>
          {[
            { name:"viz-1", label:"Purple",   color:"var(--viz-1, #602DEA)", hex:"#602DEA" },
            { name:"viz-2", label:"Blue",     color:"var(--viz-2, #445CFF)", hex:"#445CFF" },
            { name:"viz-3", label:"Cyan",     color:"var(--viz-3, #00D4D4)", hex:"#00D4D4" },
            { name:"viz-4", label:"Navy",     color:"var(--viz-4, #00208F)", hex:"#00208F" },
            { name:"viz-5", label:"Lavender", color:"var(--viz-5, #9A8AF5)", hex:"#9A8AF5" },
            { name:"viz-6", label:"Steel",    color:"var(--viz-6, #608FEC)", hex:"#608FEC" },
          ].map(t => (
            <div key={t.name}>
              <div style={{ height:40, borderRadius:"var(--radius-md)", background:t.color, marginBottom:6 }}/>
              <p style={{ fontFamily:"var(--font-mono)", fontSize:9, color:"var(--text-caption)", margin:"0 0 2px" }}>
                {t.name} · {t.label}
              </p>
              <p style={{ fontFamily:"var(--font-mono)", fontSize:9, color:"var(--text-disabled, rgba(0,0,0,0.25))", margin:0 }}>
                {t.hex}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  /* ── Assembly ────────────────────────────────────────────────── */
  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", fontFamily:"var(--font-normal)" }}>

      {/* Sidebar */}
      <aside style={{ width:240, flexShrink:0, background:"#0c0c1e", display:"flex",
        flexDirection:"column", padding:"24px 16px", gap:24, overflowY:"auto" }}>

        <img src="/assets/logo/sandhata-logo.svg" alt="Sandhata" style={{ height:28 }}/>

        <div>
          <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase",
            color:"rgba(255,255,255,0.28)", margin:"0 0 3px" }}>Design System</p>
          <p style={{ fontSize:11, color:"rgba(255,255,255,0.38)", fontFamily:"var(--font-mono)", margin:0 }}>v1.0-stable</p>
        </div>

        {/* Accent */}
        <div>
          <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase",
            color:"rgba(255,255,255,0.28)", margin:"0 0 10px" }}>Accent colour</p>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {ACCENTS.map((a,i) => (
              <button key={a.hex} title={`${a.name} — ${a.token}`} onClick={() => setAccentIdx(i)} style={{
                width:26, height:26, borderRadius:"50%", background:a.hex, border:"none", cursor:"pointer",
                outline: accentIdx===i ? "2px solid #fff" : "2px solid transparent",
                outlineOffset:2, transition:"outline .15s",
              }}/>
            ))}
          </div>
          <p style={{ fontFamily:"var(--font-mono)", fontSize:9, color:"rgba(255,255,255,0.22)",
            marginTop:8, wordBreak:"break-all" }}>{accent.token}</p>
        </div>

        {/* Surface */}
        <div>
          <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase",
            color:"rgba(255,255,255,0.28)", margin:"0 0 10px" }}>Surface</p>
          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            {(["white","warm","dark"] as const).map(s => (
              <button key={s} onClick={() => setSurface(s)} style={{
                padding:"6px 10px", borderRadius:6, border:"none", cursor:"pointer",
                fontFamily:"var(--font-normal)", fontSize:13,
                background: surface===s ? "rgba(255,255,255,0.12)" : "transparent",
                color: surface===s ? "#fff" : "rgba(255,255,255,0.42)",
                textAlign:"left", transition:"background .15s,color .15s",
              }}>{SURFACES[s].label}</button>
            ))}
          </div>
        </div>

        {/* Radius */}
        <div>
          <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase",
            color:"rgba(255,255,255,0.28)", margin:"0 0 10px" }}>Radius</p>
          <div style={{ display:"flex", gap:4 }}>
            {RADII.map((r,i) => (
              <button key={r.label} onClick={() => setRadiusIdx(i)} style={{
                flex:1, padding:"5px 0", borderRadius:5, cursor:"pointer",
                fontFamily:"var(--font-normal)", fontSize:11, fontWeight:600,
                border:`1px solid ${radiusIdx===i?"rgba(255,255,255,0.50)":"rgba(255,255,255,0.10)"}`,
                background: radiusIdx===i ? "rgba(255,255,255,0.12)" : "transparent",
                color: radiusIdx===i ? "#fff" : "rgba(255,255,255,0.36)",
                transition:"all .15s",
              }}>{r.label}</button>
            ))}
          </div>
          <p style={{ fontFamily:"var(--font-mono)", fontSize:9, color:"rgba(255,255,255,0.20)", marginTop:6 }}>
            --radius-md: {RADII[radiusIdx].px}
          </p>
        </div>

        {/* Token Inspector */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"8px 0", borderTop:"1px solid rgba(255,255,255,0.06)",
          borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          <span style={{ fontSize:12, color:"rgba(255,255,255,0.55)" }}>Token Inspector</span>
          <Switch checked={showTokens} onChange={setShowTokens} label=""/>
        </div>

        <div style={{ flex:1 }}/>

        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          <a href="/components" style={{ display:"block", padding:"8px 14px", borderRadius:6,
            border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.60)",
            fontSize:13, textDecoration:"none", textAlign:"center", fontFamily:"var(--font-normal)" }}>
            Open Docs
          </a>
          <button style={{ padding:"9px", borderRadius:6, border:"none",
            background:"var(--colour-primaryblue-500, #0036DD)", color:"#fff",
            fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"var(--font-normal)" }}>
            Get Code
          </button>
        </div>

        <a href="/" style={{ fontSize:11, color:"rgba(255,255,255,0.18)", textDecoration:"none" }}>
          ← Back to home
        </a>
      </aside>

      {/* Main */}
      <main style={{ flex:1, overflowY:"auto", background:surfCfg.bg, ...mainVars }}>
        <HeroBand/>
        <GradientRule/>
        <AtomsBand/>
        <GradientRule/>
        <DataBand/>
        <GradientRule/>
        <ThemesBand/>
        <GradientRule/>
        <SystemBand/>
      </main>
    </div>
  );
}
