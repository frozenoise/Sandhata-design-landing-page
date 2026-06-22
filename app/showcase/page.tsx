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
/* NOTE: the default "Sandhata Blue" accent MUST use empty vars — remapping
   --colour-primaryblue-500 → var(--colour-primaryblue-500) is a self-
   referential (circular) custom property that computes to invalid, which
   collapses every primary button's background to transparent. */
const ACCENTS = [
  { name:"Sandhata Blue", token:"--colour-primaryblue-500", hex:"#0036DD", vars: {} as React.CSSProperties },
  { name:"Purple",        token:"--colour-alternativepurple-500", hex:"#602DEA", vars: ramp("alternativepurple") },
  { name:"Cyan",          token:"--colour-secondarycyan-500", hex:"#00D4D4", vars: ramp("secondarycyan") },
  { name:"Amber",         token:"--colour-alert-500",         hex:"#FFC228", vars: {
    "--colour-primaryblue-50":"var(--colour-alert-50)",
    "--colour-primaryblue-100":"var(--colour-alert-100)",
    "--colour-primaryblue-200":"var(--colour-alert-200)",
    "--colour-primaryblue-300":"var(--colour-alert-300)",
    "--colour-primaryblue-400":"var(--colour-alert-400)",
    "--colour-primaryblue-500":"var(--colour-alert-500)",
    "--colour-primaryblue-600":"var(--colour-alert-600)",
    "--colour-primaryblue-700":"var(--colour-alert-700)",
  } as React.CSSProperties },
  { name:"Crimson",       token:"--colour-error-500",         hex:"#D21B00", vars: {
    "--colour-primaryblue-50":"var(--colour-error-50)",
    "--colour-primaryblue-100":"var(--colour-error-100)",
    "--colour-primaryblue-200":"var(--colour-error-200)",
    "--colour-primaryblue-300":"var(--colour-error-300)",
    "--colour-primaryblue-400":"var(--colour-error-400)",
    "--colour-primaryblue-500":"var(--colour-error-500)",
    "--colour-primaryblue-600":"var(--colour-error-600)",
    "--colour-primaryblue-700":"var(--colour-error-700)",
  } as React.CSSProperties },
];

const SURFACES = {
  white: { label:"Pure White", bg:"#f3f4f8", tokens:{
    "--surface-raised":    "#ffffff",
    "--surface-secondary": "#f5f6f8",
    "--surface-page":      "#ffffff",
  } as React.CSSProperties },
  warm:  { label:"Warm", bg:"#f3e9df", tokens:{
    "--surface-raised":    "#fdf7f1",
    "--surface-secondary": "#f6ebe0",
    "--surface-page":      "#fdf5f0",
    "--border-subtle":     "rgba(120,80,40,0.12)",
    "--border-default":    "rgba(120,80,40,0.20)",
    "--field-02":          "#fffaf5",
  } as React.CSSProperties },
  dark:  { label:"Ink Dark", bg:"#0d0d1a", tokens:{
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

/* Keeps theme cards bright even when the parent surface mode is Ink Dark */
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

/* Real per-client brands — mirrors the demo dashboard trio */
const CLIENT_THEMES = [
  {
    name:"TechNip Energies", sector:"Energy · throughput analytics",
    brandColor:"#00C2B8", vars: ramp("secondarycyan"),
    kpi:{ label:"Pipeline throughput", value:"812 kbpd", trend:"+4.1% vs target" },
    spark:[30,34,31,38,36,42,40,46,44,49],
    badges:[["success","On spec"],["action","6 sites live"]] as const,
    cta:"Export report",
  },
  {
    name:"Aviva Insurance", sector:"Financial · policy management",
    brandColor:"#12347e",
    vars: {
      "--colour-primaryblue-50":"#e8ecf5",
      "--colour-primaryblue-100":"#c8d1e8",
      "--colour-primaryblue-200":"#a3b3d9",
      "--colour-primaryblue-300":"#7a92c9",
      "--colour-primaryblue-400":"#42619e",
      "--colour-primaryblue-500":"#12347e",
      "--colour-primaryblue-600":"#0c2b66",
      "--colour-primaryblue-700":"#081f4e",
    } as React.CSSProperties,
    kpi:{ label:"Active policies", value:"48,920", trend:"+1.8% this month" },
    spark:[22,24,23,27,29,28,33,35,34,38],
    badges:[["success","Renewed"],["action","312 new claims"]] as const,
    cta:"New claim",
  },
  {
    name:"VodafoneThree", sector:"Telecom · network operations",
    brandColor:"#E60000",
    vars: {
      "--colour-primaryblue-50":"#ffe9e9",
      "--colour-primaryblue-100":"#ffc7c7",
      "--colour-primaryblue-200":"#ff9a9a",
      "--colour-primaryblue-300":"#ff6b6b",
      "--colour-primaryblue-400":"#f53434",
      "--colour-primaryblue-500":"#E60000",
      "--colour-primaryblue-600":"#bd0000",
      "--colour-primaryblue-700":"#8f0000",
    } as React.CSSProperties,
    kpi:{ label:"Network uptime", value:"99.98%", trend:"+0.04pt this week" },
    spark:[40,38,42,41,44,43,46,45,48,49],
    badges:[["success","Healthy"],["warning","2 incidents"]] as const,
    cta:"Open NOC",
  },
];

/* ── Tiny inline icons ───────────────────────────────────────────── */
const I = {
  home:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>,
  grid:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  chart:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/></svg>,
  brush:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="10.5" r="2.5"/><circle cx="8.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="12.5" r="2.5"/><path d="M12 22a4 4 0 0 0 0-8 4 4 0 0 1 0-8"/></svg>,
  type:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>,
  chevL:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  chevR:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  code:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  arrowL: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
};

const NAV = [
  { id:"sc-overview",    label:"Overview",    icon:I.home },
  { id:"sc-components",  label:"Components",  icon:I.grid },
  { id:"sc-data",        label:"Data viz",    icon:I.chart },
  { id:"sc-theming",     label:"Theming",     icon:I.brush },
  { id:"sc-foundations", label:"Foundations", icon:I.type },
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

/* ── RadarChart (capped width so it doesn't over-scale) ──────────── */
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
    <div style={{ position:"relative", maxWidth:240, margin:"4px auto 0", width:"100%" }}>
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

/* ── DonutChart (capped width) ───────────────────────────────────── */
function DonutChart() {
  const MONTHS = ["January","February","March","April","May","June"];
  const MONTH_DATA: Record<string,[number,number,number]> = {
    January:[186,62,48], February:[154,78,32], March:[201,55,60],
    April:[178,42,66], May:[220,85,38], June:[165,71,52],
  };
  const COLORS = ["var(--colour-primaryblue-500)","var(--colour-primaryblue-300)","var(--colour-primaryblue-100)"];
  const LABELS = ["Visitors","Page views","Conversions"];
  const [month, setMonth] = React.useState("January");
  const [open,  setOpen]  = React.useState(false);
  const [hiArc, setHiArc] = React.useState<number|null>(null);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
  }, []);
  const vals = MONTH_DATA[month], total = vals.reduce((a,b) => a+b, 0);
  const cx=80, cy=80, OR=63, Osw=13, IR=46, Isw=6, TICKS=72;
  const ir0=IR-Isw/2+0.5, ir1=IR+Isw/2-0.5;
  const GAP_RAD=(20/360)*Math.PI*2, ARC_RAD=Math.PI*2-GAP_RAD*vals.length;
  let angle=-Math.PI/2;
  const arcs = vals.map((v,i) => {
    const arc=(v/total)*ARC_RAD, sa=angle, ea=angle+arc; angle=ea+GAP_RAD;
    return { d:`M ${(cx+OR*Math.cos(sa)).toFixed(2)} ${(cy+OR*Math.sin(sa)).toFixed(2)} A ${OR} ${OR} 0 ${arc>Math.PI?1:0} 1 ${(cx+OR*Math.cos(ea)).toFixed(2)} ${(cy+OR*Math.sin(ea)).toFixed(2)}`, color:COLORS[i], label:LABELS[i], value:v };
  });
  return (
    <div ref={ref} style={{position:"relative"}}>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:4,position:"relative"}}>
        <button className="rtu-pill" onClick={()=>setOpen(o=>!o)}>{month} ▾</button>
        {open && (
          <div className="rtu-month-menu">
            {MONTHS.map(m=><button key={m} className={m===month?"on":""} onClick={()=>{setMonth(m);setOpen(false);}}>{m}</button>)}
          </div>
        )}
      </div>
      <div style={{ maxWidth:210, margin:"0 auto", width:"100%" }}>
        <svg viewBox="0 0 160 160" width="100%" style={{display:"block"}}>
          {Array.from({length:TICKS}).map((_,t)=>{const a=(t/TICKS)*Math.PI*2-Math.PI/2; return <line key={t} x1={(cx+ir0*Math.cos(a)).toFixed(2)} y1={(cy+ir0*Math.sin(a)).toFixed(2)} x2={(cx+ir1*Math.cos(a)).toFixed(2)} y2={(cy+ir1*Math.sin(a)).toFixed(2)} stroke="rgba(0,0,0,0.18)" strokeWidth="0.9"/>;}) }
          <circle cx={cx} cy={cy} r={OR} fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth={Osw}/>
          {arcs.map((arc,i)=><path key={`${month}-${i}`} d={arc.d} fill="none" stroke={arc.color} strokeWidth={hiArc===i?Osw+3:Osw} strokeLinecap="round" style={{cursor:"pointer",transition:"stroke-width .15s ease"}} onMouseEnter={()=>setHiArc(i)} onMouseLeave={()=>setHiArc(null)}/>)}
          <text x={cx} y={cy-10} textAnchor="middle" dominantBaseline="middle" fontSize="22" fontWeight="700" fill="#0a0a14" style={{fontFamily:"var(--font-bold)"}}>{vals[0]}</text>
          <text x={cx} y={cy+10} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#8a8f9b" style={{fontFamily:"var(--font-normal)"}}>Visitors</text>
        </svg>
      </div>
      {hiArc!==null && <div className="rtu-tip" style={{position:"absolute",left:"50%",top:"42%",transform:"translate(-50%,-50%)",pointerEvents:"none"}}>{arcs[hiArc]?.value}<span>{arcs[hiArc]?.label}</span></div>}
      <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:5}}>
        {arcs.map(arc=>(
          <div key={arc.label} style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{width:9,height:9,borderRadius:"50%",background:arc.color,flexShrink:0,display:"inline-block"}}/>
            <span className="rtu-card-sub" style={{margin:0,flex:1}}>{arc.label}</span>
            <span className="rtu-card-sub" style={{margin:0,color:"#0a0a14",fontWeight:600}}>{arc.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── BarChart ────────────────────────────────────────────────────── */
function LandingBarChart() {
  const data=[72,58,85,44,91,67,78,55], labels=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"];
  const W=260, H=110, pad=6, bw=(W-pad*2)/data.length-5, maxV=Math.max(...data);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{display:"block"}}>
      {data.map((v,i)=>{const bh=(v/maxV)*(H-pad*2-16),x=pad+i*(bw+5); return(<g key={i}><rect x={x} y={H-pad-16-bh} width={bw} height={bh} fill={i%2===0?"var(--colour-primaryblue-500)":"var(--colour-primaryblue-200)"} rx="3"/><text x={x+bw/2} y={H-4} fontSize="7" fill="#9aa0ac" textAnchor="middle">{labels[i]}</text></g>);})}
    </svg>
  );
}

/* ── Small trend line for the right column ───────────────────────── */
function MiniLineChart() {
  const [hi, setHi] = React.useState<number|null>(null);
  const W=400, H=90, pad=14;
  const raw=[42,58,51,74,68,85,72,79,65,88], labels=["Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May"];
  const maxV=Math.max(...raw), minV=Math.min(...raw);
  const pts=raw.map((v,i)=>[pad+(i/(raw.length-1))*(W-pad*2), H-pad-((v-minV)/(maxV-minV))*(H-pad*2)]);
  let d=`M ${pts[0][0]} ${pts[0][1]}`;
  for(let i=0;i<pts.length-1;i++){const cp=pts[i][0]+(pts[i+1][0]-pts[i][0])*0.5; d+=` C ${cp} ${pts[i][1]}, ${cp} ${pts[i+1][1]}, ${pts[i+1][0]} ${pts[i+1][1]}`;}
  const area=`${d} L ${W-pad} ${H-pad} L ${pad} ${H-pad} Z`;
  const ref=React.useRef<HTMLDivElement>(null);
  const onMove=(e:React.MouseEvent)=>{const r=ref.current!.getBoundingClientRect(); setHi(Math.max(0,Math.min(raw.length-1,Math.round(((e.clientX-r.left)/r.width)*(raw.length-1)))));};
  return(
    <div ref={ref} style={{position:"relative"}} onMouseMove={onMove} onMouseLeave={()=>setHi(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{display:"block",width:"100%",height:H}}>
        <defs><linearGradient id="mlg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--colour-primaryblue-400)" stopOpacity="0.22"/><stop offset="100%" stopColor="var(--colour-primaryblue-400)" stopOpacity="0"/></linearGradient></defs>
        <path d={area} fill="url(#mlg)"/>
        <path d={d} fill="none" stroke="var(--colour-primaryblue-500)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round"/>
        {hi!==null&&<line x1={pts[hi][0]} y1={pad} x2={pts[hi][0]} y2={H-pad} stroke="var(--colour-primaryblue-300)" strokeWidth="1" vectorEffect="non-scaling-stroke" strokeDasharray="3 3"/>}
      </svg>
      {hi!==null&&(<><div style={{position:"absolute",left:`${(pts[hi][0]/W)*100}%`,top:`${(pts[hi][1]/H)*100}%`,transform:"translate(-50%,-50%)",width:10,height:10,borderRadius:"50%",background:"#fff",border:"2px solid var(--colour-primaryblue-500)",pointerEvents:"none",zIndex:2}}/><div className="rtu-tip" style={{left:`${(pts[hi][0]/W)*100}%`,top:`${(pts[hi][1]/H)*100}%`}}>{raw[hi]}<span>{labels[hi]}</span></div></>)}
    </div>
  );
}

/* ── Interactive line chart — Desktop / Mobile toggle + hover ────── */
const LC_LABELS = ["Apr 5","Apr 10","Apr 15","Apr 20","Apr 25","Apr 30","May 5","May 10","May 15","May 20","May 25","May 30","Jun 4","Jun 9","Jun 14","Jun 19","Jun 24","Jun 30"];
const LC_SERIES = {
  desktop: { label:"Desktop", total:"24,828", data:[12,19,15,27,22,31,26,34,29,38,33,41,36,44,40,47,43,49] },
  mobile:  { label:"Mobile",  total:"25,010", data:[16,14,21,18,25,22,29,25,32,28,35,31,38,34,40,37,43,45] },
};
type SeriesKey = keyof typeof LC_SERIES;

function smoothPath(values:number[], W:number, H:number, pad:number, minV:number, maxV:number) {
  const pts = values.map((v,i)=>[pad+(i/(values.length-1))*(W-pad*2), H-pad-((v-minV)/(maxV-minV))*(H-pad*2)] as [number,number]);
  let d=`M ${pts[0][0]} ${pts[0][1]}`;
  for(let i=0;i<pts.length-1;i++){const cp=pts[i][0]+(pts[i+1][0]-pts[i][0])*0.5; d+=` C ${cp} ${pts[i][1]}, ${cp} ${pts[i+1][1]}, ${pts[i+1][0]} ${pts[i+1][1]}`;}
  return { d, pts };
}

function InteractiveLineChart() {
  const [active, setActive] = React.useState<SeriesKey>("desktop");
  const [hi, setHi] = React.useState<number|null>(null);
  const W=1000, H=220, pad=18;
  const all = [...LC_SERIES.desktop.data, ...LC_SERIES.mobile.data];
  const minV = Math.min(...all), maxV = Math.max(...all);
  const other:SeriesKey = active==="desktop" ? "mobile" : "desktop";
  const A = smoothPath(LC_SERIES[active].data, W, H, pad, minV, maxV);
  const O = smoothPath(LC_SERIES[other].data,  W, H, pad, minV, maxV);
  const area = `${A.d} L ${W-pad} ${H-pad} L ${pad} ${H-pad} Z`;
  const ref = React.useRef<HTMLDivElement>(null);
  const onMove=(e:React.MouseEvent)=>{const r=ref.current!.getBoundingClientRect(); setHi(Math.max(0,Math.min(LC_LABELS.length-1,Math.round(((e.clientX-r.left)/r.width)*(LC_LABELS.length-1)))));};
  const val = (k:SeriesKey,i:number)=>Math.round(LC_SERIES[k].data[i]*540).toLocaleString();
  return (
    <div className="cc rtu-line" style={{marginTop:20}}>
      <div className="rtu-line-head">
        <div>
          <div className="rtu-card-h">Line Chart · Interactive</div>
          <div className="rtu-card-sub">Total visitors over the last 3 months — click a series to switch</div>
        </div>
        <div className="rtu-line-stats">
          {(Object.keys(LC_SERIES) as SeriesKey[]).map(k=>(
            <button key={k} onClick={()=>setActive(k)} className={`rtu-stat${active===k?" on":""}`}
              style={{ border:"none", borderLeft:"1px solid rgba(10,10,20,0.08)", cursor:"pointer", background:active===k?"#f4f5f7":"transparent" }}>
              <span style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ width:8, height:8, borderRadius:"50%", background:active===k?"var(--colour-primaryblue-500)":"#c2c6cf" }}/>
                {LC_SERIES[k].label}
              </span>
              <strong>{LC_SERIES[k].total}</strong>
            </button>
          ))}
        </div>
      </div>

      <div ref={ref} style={{position:"relative"}} onMouseMove={onMove} onMouseLeave={()=>setHi(null)}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" preserveAspectRatio="none" style={{display:"block",height:H}}>
          <defs><linearGradient id="ilc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--colour-primaryblue-400)" stopOpacity="0.20"/><stop offset="100%" stopColor="var(--colour-primaryblue-400)" stopOpacity="0"/></linearGradient></defs>
          <path d={area} fill="url(#ilc)"/>
          <path d={O.d} fill="none" stroke="var(--colour-primaryblue-200)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" opacity="0.7"/>
          <path d={A.d} fill="none" stroke="var(--colour-primaryblue-500)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round"/>
          {hi!==null && <line x1={A.pts[hi][0]} y1={pad} x2={A.pts[hi][0]} y2={H-pad} stroke="var(--colour-primaryblue-300)" strokeWidth="1" vectorEffect="non-scaling-stroke" strokeDasharray="4 4"/>}
        </svg>
        {hi!==null && (
          <>
            <div style={{position:"absolute",left:`${(A.pts[hi][0]/W)*100}%`,top:`${(A.pts[hi][1]/H)*100}%`,transform:"translate(-50%,-50%)",width:11,height:11,borderRadius:"50%",background:"#fff",border:"2.5px solid var(--colour-primaryblue-500)",pointerEvents:"none",zIndex:2}}/>
            <div className="rtu-tip" style={{left:`${(A.pts[hi][0]/W)*100}%`,top:`${(A.pts[hi][1]/H)*100}%`}}>{val(active,hi)}<span>{LC_SERIES[active].label} · {LC_LABELS[hi]}</span></div>
          </>
        )}
      </div>
      <div className="rtu-axis">{LC_LABELS.map(l=><span key={l}>{l}</span>)}</div>
    </div>
  );
}

/* ── Brand mini-sparkline — auto-themed via primaryblue ramp ─────── */
function BrandSpark({ data }: { data:number[] }) {
  const W=200, H=46, pad=4;
  const maxV=Math.max(...data), minV=Math.min(...data);
  const pts=data.map((v,i)=>[pad+(i/(data.length-1))*(W-pad*2), H-pad-((v-minV)/(maxV-minV||1))*(H-pad*2)]);
  let d=`M ${pts[0][0]} ${pts[0][1]}`;
  for(let i=0;i<pts.length-1;i++){const cp=pts[i][0]+(pts[i+1][0]-pts[i][0])*0.5; d+=` C ${cp} ${pts[i][1]}, ${cp} ${pts[i+1][1]}, ${pts[i+1][0]} ${pts[i+1][1]}`;}
  const area=`${d} L ${W-pad} ${H-pad} L ${pad} ${H-pad} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{display:"block"}}>
      <defs><linearGradient id={`bs-${pts[0][1].toFixed(0)}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--colour-primaryblue-500)" stopOpacity="0.20"/><stop offset="100%" stopColor="var(--colour-primaryblue-500)" stopOpacity="0"/></linearGradient></defs>
      <path d={area} fill={`url(#bs-${pts[0][1].toFixed(0)})`}/>
      <path d={d} fill="none" stroke="var(--colour-primaryblue-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
export default function ShowcasePage() {
  const [accentIdx,  setAccentIdx ] = React.useState(0);
  const [surface,    setSurface   ] = React.useState<"white"|"warm"|"dark">("white");
  const [radiusIdx,  setRadiusIdx ] = React.useState(2);
  const [showTokens, setShowTokens] = React.useState(false);
  const [collapsed,  setCollapsed ] = React.useState(false);
  const [navActive,  setNavActive ] = React.useState("sc-overview");

  const [sw,  setSw ] = React.useState(true);
  const [ck,  setCk ] = React.useState([true, false, false]);
  const [rv,  setRv ] = React.useState("opt1");
  const [dismissed, setDismissed] = React.useState<string[]>([]);

  const accent    = ACCENTS[accentIdx];
  const surfCfg   = SURFACES[surface];
  const radiusCfg = RADII[radiusIdx];

  const mainVars: React.CSSProperties = {
    ...accent.vars, ...surfCfg.tokens, ...radiusCfg.vars,
  } as React.CSSProperties;

  const go = (id:string) => {
    setNavActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth", block:"start" });
  };

  function ShowToken({ token, children, side="top" }: { token:string; children:React.ReactElement; side?:"top"|"bottom"|"left"|"right" }) {
    if (!showTokens) return children;
    return <Tooltip label={token} side={side}>{children}</Tooltip>;
  }

  const sidebarW = collapsed ? 76 : 256;

  /* ─ Hero ──────────────────────────────────────────────────────── */
  const HeroBand = () => (
    <section id="sc-overview" style={{ position:"relative", overflow:"hidden", padding:"64px 48px 52px", background:"#fdf5f0", scrollMarginTop:0 }}>
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
    <section id="sc-components" style={{ padding:"44px 48px", background:"var(--surface-raised, #fff)" }}>
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
              <p style={labelCap}>Default</p>
              <Input label="Project name" placeholder="Enter project name"/>
            </div>
            <div>
              <p style={labelCap}>Focus (active)</p>
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                <label style={{ fontFamily:"var(--font-normal)", fontWeight:700,
                  fontSize:"var(--label-size, 12px)", color:"var(--text-subtitle)",
                  letterSpacing:"var(--label-tracking, 0.01em)" }}>Search</label>
                <div style={{ height:40, padding:"0 12px", display:"flex", alignItems:"center",
                  border:"1.5px solid var(--colour-primaryblue-500)", borderRadius:"var(--radius-sm)",
                  background:"var(--field-02, #fff)", boxShadow:"0 0 0 3px var(--colour-primaryblue-100)",
                  fontFamily:"var(--font-normal)", fontSize:"var(--body-medium-size, 14px)",
                  color:"var(--text-body)" }}>design system</div>
              </div>
            </div>
            <div>
              <p style={labelCap}>Error</p>
              <Input label="Email address" error="Please enter a valid email" defaultValue="not-an-email"/>
            </div>
            <div>
              <p style={labelCap}>Disabled</p>
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
              <p style={labelCap}>Checkbox</p>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {["Export as PNG","Export as SVG","Export as PDF"].map((l,i) => (
                  <Checkbox key={l} label={l} checked={ck[i]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setCk(c => c.map((x: boolean,j: number) => j===i ? e.target.checked : x))}/>
                ))}
              </div>
            </div>
            <div>
              <p style={labelCap}>Radio</p>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {["Light mode","Dark mode","System"].map((l,i) => {
                  const val = `opt${i+1}`;
                  return <Radio key={l} name="sc-display" value={val} label={l}
                    checked={rv===val} onChange={() => setRv(val)}/>;
                })}
              </div>
            </div>
            <Select label="Environment" options={["Development","Staging","Production"]} placeholder="Select environment"/>
          </div>
        </div>
      </div>
    </section>
  );

  /* ─ Data ──────────────────────────────────────────────────────── */
  const DataBand = () => (
    <section id="sc-data" style={{ padding:"44px 48px", background:"var(--surface-secondary, #f5f6f8)" }}>
      <BandTag>Data visualisation · 5 chart types</BandTag>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:20 }}>
        <div><StatCard label="Revenue" value="£2.4M" trend="+12% vs last quarter" trendDirection="up"/></div>
        <div><StatCard label="Active Users" value="48,291" trend="+5.3% this week" trendDirection="up"/></div>
        <div><StatCard label="Customer Satisfaction" value="4.8 / 5" trend="+0.3pt this month" trendDirection="up"/></div>
      </div>

      <div className="rtu-charts">
        <div className="cc rtu-card">
          <div className="rtu-card-tag">◎ Radar Chart</div>
          <div className="rtu-card-h">Radar Chart</div>
          <div className="rtu-card-sub">Total visitors by month</div>
          <RadarChart/>
          <div className="rtu-card-foot">Trending up by 5.2% this month ↗</div>
          <div className="rtu-card-sub" style={{textAlign:"center"}}>January – June 2026</div>
        </div>

        <div className="cc rtu-card">
          <div className="rtu-card-tag">◷ Pie Chart</div>
          <div className="rtu-card-h">Pie Chart · Interactive</div>
          <div className="rtu-card-sub">January – June 2026</div>
          <DonutChart/>
        </div>

        <div className="rtu-right-col">
          <div className="cc rtu-card">
            <div className="rtu-card-tag">▪ Bar Chart</div>
            <div className="rtu-card-h">Bar Chart · Monthly</div>
            <div className="rtu-card-sub">Sessions by month, Jan–Aug 2024</div>
            <div style={{marginTop:10}}><LandingBarChart/></div>
            <div className="rtu-card-foot">Peak in May · 91 sessions ↑</div>
          </div>
          <div className="cc rtu-card">
            <div className="rtu-card-tag">— Line Chart</div>
            <div className="rtu-card-h">Trend Line</div>
            <div className="rtu-card-sub">Monthly sessions, Aug 2023–May 2024</div>
            <div style={{marginTop:8}}><MiniLineChart/></div>
          </div>
        </div>
      </div>

      <InteractiveLineChart/>
    </section>
  );

  /* ─ Themes — real per-brand dashboard modules ─────────────────── */
  const ThemesBand = () => (
    <section id="sc-theming" style={{ padding:"56px 48px", background:"#000921" }}>
      <div style={{ textAlign:"center", marginBottom:44 }}>
        <p style={{ fontFamily:"var(--font-normal)", fontSize:11, fontWeight:700, letterSpacing:"0.10em",
          textTransform:"uppercase", color:"rgba(255,255,255,0.28)", margin:"0 0 14px" }}>Multi-tenant Theming</p>
        <h2 style={{ fontFamily:"var(--font-bold)", fontSize:38, fontWeight:700, color:"#fff",
          letterSpacing:"-1px", margin:"0 0 14px" }}>
          One system.{" "}<span style={{ color:"#f68136" }}>Any brand.</span>
        </h2>
        <p style={{ fontFamily:"var(--font-normal)", fontSize:15, color:"rgba(255,255,255,0.40)",
          maxWidth:520, margin:"0 auto", lineHeight:1.6 }}>
          The exact same components — StatCard, charts, Button, Badge — re-skinned per client
          by overriding one token ramp. Three real products, three brands, zero forked code.
        </p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
        {CLIENT_THEMES.map(t => (
          <div key={t.name} style={{
            ...t.vars, ...LIGHT_RESETS,
            borderRadius:"var(--radius-xl)", background:"#ffffff",
            overflow:"hidden", border:"1px solid rgba(255,255,255,0.06)",
            boxShadow:"0 20px 50px rgba(0,0,0,0.35)",
          } as React.CSSProperties}>
            {/* brand header bar */}
            <div style={{ background:t.brandColor, padding:"14px 18px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <p style={{ fontFamily:"var(--font-bold)", fontWeight:700, fontSize:14, color:"#fff", margin:0 }}>{t.name}</p>
                <p style={{ fontFamily:"var(--font-normal)", fontSize:11, color:"rgba(255,255,255,0.78)", margin:"2px 0 0" }}>{t.sector}</p>
              </div>
              <span style={{ fontFamily:"var(--font-mono)", fontSize:10, color:"rgba(255,255,255,0.9)",
                background:"rgba(255,255,255,0.18)", padding:"3px 8px", borderRadius:6 }}>Live</span>
            </div>

            <div style={{ padding:20 }}>
              <div style={{ marginBottom:14 }}>
                <StatCard label={t.kpi.label} value={t.kpi.value} trend={t.kpi.trend} trendDirection="up"/>
              </div>
              <div style={{ marginBottom:14 }}>
                <p style={{ fontFamily:"var(--font-normal)", fontSize:11, color:"#8a8f9b", margin:"0 0 4px" }}>Last 10 periods</p>
                <BrandSpark data={t.spark}/>
              </div>
              <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                <Button hierarchy="primary" style={{ flex:1 }}>{t.cta}</Button>
                <Button hierarchy="tertiary">Filter</Button>
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {t.badges.map(([tone,txt]) => <Badge key={txt} tone={tone}>{txt}</Badge>)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  /* ─ System / foundations ──────────────────────────────────────── */
  const visibleAlerts = ([
    { id:"a1", tone:"info" as const,    title:"System update",  body:"Maintenance scheduled for Sunday 2–4 AM UTC." },
    { id:"a2", tone:"success" as const, title:"Deployed!",      body:"v2.4.1 is live on production." },
    { id:"a3", tone:"warning" as const, title:"Token drift",    body:"3 tokens have diverged from the Figma source." },
    { id:"a4", tone:"error" as const,   title:"Build failed",   body:"TypeScript errors in Button.d.ts — see CI log." },
  ]).filter(a => !dismissed.includes(a.id));

  const SystemBand = () => (
    <section id="sc-foundations" style={{ padding:"44px 48px", background:"var(--surface-raised, #fff)" }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:40, marginBottom:40 }}>

        {/* Alerts — dismissible */}
        <div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.10em", textTransform:"uppercase",
              color:"var(--text-caption)", fontFamily:"var(--font-normal)", margin:0 }}>Alert · 4 tones · dismissible</p>
            {dismissed.length > 0 && (
              <button onClick={()=>setDismissed([])} style={{ border:"none", background:"transparent", cursor:"pointer",
                fontFamily:"var(--font-normal)", fontSize:11, fontWeight:700, color:"var(--colour-primaryblue-500)" }}>
                Restore all
              </button>
            )}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {visibleAlerts.map(a => (
              <Alert key={a.id} tone={a.tone} title={a.title} onClose={()=>setDismissed(d=>[...d,a.id])}>{a.body}</Alert>
            ))}
            {visibleAlerts.length === 0 && (
              <p style={{ fontFamily:"var(--font-normal)", fontSize:13, color:"var(--text-caption)" }}>
                All alerts dismissed. Click “Restore all” to bring them back.
              </p>
            )}
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

  /* ── Sidebar ──────────────────────────────────────────────────── */
  const Sidebar = (
    <aside className="sc-sidebar" style={{ width:sidebarW }}>
      <div className="sc-scroll">

        {/* Top row: back-home + collapse */}
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18 }}>
          {!collapsed && (
            <a href="/" className="sc-homebtn" style={{ flex:1 }}>{I.arrowL}<span>Back to home</span></a>
          )}
          <button className="sc-iconbtn" onClick={()=>setCollapsed(c=>!c)}
            title={collapsed ? "Expand" : "Collapse"} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
            {collapsed ? I.chevR : I.chevL}
          </button>
        </div>

        {/* Logo */}
        {collapsed ? (
          <a href="/" className="sc-nav-item sc-rail-icon" title="Back to home" style={{ marginBottom:8 }}>{I.home}</a>
        ) : (
          <div style={{ marginBottom:20 }}>
            <img src="/assets/logo/sandhata-logo.svg" alt="Sandhata" style={{ height:26 }}/>
            <p style={{ fontSize:11, color:"rgba(255,255,255,0.38)", fontFamily:"var(--font-mono)", margin:"8px 0 0" }}>v1.0-stable</p>
          </div>
        )}

        {/* Navigate */}
        {!collapsed && <p className="sc-cap">Navigate</p>}
        <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
          {NAV.map(n => (
            <button key={n.id} className={`sc-nav-item${navActive===n.id?" on":""}${collapsed?" sc-rail-icon":""}`}
              onClick={()=>go(n.id)} title={n.label}>
              {n.icon}{!collapsed && <span>{n.label}</span>}
            </button>
          ))}
        </div>

        {!collapsed && (
          <>
            <div className="sc-divider"/>

            {/* Accent */}
            <p className="sc-cap">Accent colour</p>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {ACCENTS.map((a,i) => (
                <button key={a.hex} title={`${a.name} — ${a.token}`} onClick={() => setAccentIdx(i)} style={{
                  width:26, height:26, borderRadius:"50%", background:a.hex, border:"none", cursor:"pointer",
                  outline: accentIdx===i ? "2px solid #fff" : "2px solid transparent",
                  outlineOffset:2, transition:"outline .15s",
                }}/>
              ))}
            </div>
            <p style={{ fontFamily:"var(--font-mono)", fontSize:9, color:"rgba(255,255,255,0.30)",
              margin:"8px 0 0", wordBreak:"break-all" }}>{accent.token}</p>

            <div style={{ height:18 }}/>

            {/* Surface */}
            <p className="sc-cap">Surface</p>
            <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
              {(["white","warm","dark"] as const).map(s => (
                <button key={s} onClick={() => setSurface(s)} style={{
                  padding:"7px 11px", borderRadius:9, border:"none", cursor:"pointer",
                  fontFamily:"var(--font-normal)", fontSize:13,
                  background: surface===s ? "rgba(255,255,255,0.13)" : "transparent",
                  color: surface===s ? "#fff" : "rgba(255,255,255,0.50)",
                  textAlign:"left", transition:"background .15s,color .15s",
                }}>{SURFACES[s].label}</button>
              ))}
            </div>

            <div style={{ height:18 }}/>

            {/* Radius */}
            <p className="sc-cap">Radius</p>
            <div style={{ display:"flex", gap:4 }}>
              {RADII.map((r,i) => (
                <button key={r.label} onClick={() => setRadiusIdx(i)} style={{
                  flex:1, padding:"6px 0", borderRadius:8, cursor:"pointer",
                  fontFamily:"var(--font-normal)", fontSize:11, fontWeight:600,
                  border:`1px solid ${radiusIdx===i?"rgba(255,255,255,0.50)":"rgba(255,255,255,0.12)"}`,
                  background: radiusIdx===i ? "rgba(255,255,255,0.13)" : "transparent",
                  color: radiusIdx===i ? "#fff" : "rgba(255,255,255,0.42)",
                  transition:"all .15s",
                }}>{r.label}</button>
              ))}
            </div>

            <div className="sc-divider"/>

            {/* Token Inspector */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span style={{ fontSize:12, color:"rgba(255,255,255,0.62)" }}>Token Inspector</span>
              <Switch checked={showTokens} onChange={setShowTokens} label=""/>
            </div>

            <div style={{ height:22 }}/>

            {/* Footer CTAs */}
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <button className="sc-cta">Get the code</button>
              <a href="/components" style={{ display:"block", padding:"9px 14px", borderRadius:11,
                border:"1px solid rgba(255,255,255,0.14)", color:"rgba(255,255,255,0.66)",
                fontSize:13, textDecoration:"none", textAlign:"center", fontFamily:"var(--font-normal)" }}>
                Open Docs
              </a>
            </div>
          </>
        )}

        {collapsed && (
          <>
            <div className="sc-divider"/>
            <button className="sc-nav-item sc-rail-icon" title="Get the code">{I.code}</button>
          </>
        )}
      </div>
    </aside>
  );

  /* ── Assembly ────────────────────────────────────────────────── */
  return (
    <div className="sc-shell" style={{ fontFamily:"var(--font-normal)" }}>
      {Sidebar}

      <main style={{
        marginLeft: sidebarW + 32, height:"100vh", overflowY:"auto",
        background:surfCfg.bg, transition:"margin-left .34s cubic-bezier(.16,1,.3,1)",
        borderRadius:"18px 0 0 18px", ...mainVars,
      }}>
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

const labelCap: React.CSSProperties = {
  fontFamily:"var(--font-normal)", fontSize:10, fontWeight:700,
  color:"var(--text-caption)", letterSpacing:"0.06em", textTransform:"uppercase", margin:"0 0 8px",
};
