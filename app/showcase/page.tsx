"use client";
import React from "react";
import { motion, useInView, animate } from "motion/react";
import "../globals.css";
import {
  Button, Badge, Alert, Input, Select, Textarea,
  Switch, Checkbox, Radio, StatCard, Tooltip,
  Tag, Avatar, Card, Spinner, Tabs,
} from "@/components";

/* ── Token ramp helper ─────────────────────────────────────── */
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

/* ── Constants ─────────────────────────────────────────────── */
const ACCENTS = [
  { name:"Sandhata Blue", token:"--colour-primaryblue-500", hex:"#0036DD", vars:{} as React.CSSProperties },
  { name:"Purple",        token:"--colour-alternativepurple-500", hex:"#602DEA", vars:ramp("alternativepurple") },
  { name:"Cyan",          token:"--colour-secondarycyan-500", hex:"#00D4D4", vars:ramp("secondarycyan") },
  { name:"Amber",         token:"--colour-alert-500",         hex:"#FFC228", vars:{
    "--colour-primaryblue-50":"var(--colour-alert-50)",
    "--colour-primaryblue-100":"var(--colour-alert-100)",
    "--colour-primaryblue-200":"var(--colour-alert-200)",
    "--colour-primaryblue-300":"var(--colour-alert-300)",
    "--colour-primaryblue-400":"var(--colour-alert-400)",
    "--colour-primaryblue-500":"var(--colour-alert-500)",
    "--colour-primaryblue-600":"var(--colour-alert-600)",
    "--colour-primaryblue-700":"var(--colour-alert-700)",
  } as React.CSSProperties },
  { name:"Crimson",       token:"--colour-error-500",         hex:"#D21B00", vars:{
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
    "--surface-raised":"#ffffff","--surface-secondary":"#f5f6f8","--surface-page":"#ffffff",
  } as React.CSSProperties },
  warm:  { label:"Warm", bg:"#f3e9df", tokens:{
    "--surface-raised":"#fdf7f1","--surface-secondary":"#f6ebe0","--surface-page":"#fdf5f0",
    "--border-subtle":"rgba(120,80,40,0.12)","--border-default":"rgba(120,80,40,0.20)","--field-02":"#fffaf5",
  } as React.CSSProperties },
  dark:  { label:"Ink Dark", bg:"#0d0d1a", tokens:{
    "--surface-raised":"#1a1a2e","--surface-secondary":"#16162a","--surface-disabled":"rgba(255,255,255,0.08)",
    "--text-title":"rgba(255,255,255,0.95)","--text-body":"rgba(255,255,255,0.78)",
    "--text-subtitle":"rgba(255,255,255,0.60)","--text-caption":"rgba(255,255,255,0.38)",
    "--text-disabled":"rgba(255,255,255,0.25)","--border-subtle":"rgba(255,255,255,0.07)",
    "--border-default":"rgba(255,255,255,0.12)","--field-02":"rgba(255,255,255,0.06)",
  } as React.CSSProperties },
};

const RADII = [
  { label:"None", px:"0px",  vars:{"--radius-xs":"0","--radius-sm":"0","--radius-md":"0","--radius-lg":"0","--radius-xl":"0","--radius-pill":"999px"} as React.CSSProperties },
  { label:"SM",   px:"4px",  vars:{"--radius-xs":"2px","--radius-sm":"4px","--radius-md":"4px","--radius-lg":"6px","--radius-xl":"8px","--radius-pill":"999px"} as React.CSSProperties },
  { label:"MD",   px:"6px",  vars:{} as React.CSSProperties },
  { label:"LG",   px:"10px", vars:{"--radius-xs":"4px","--radius-sm":"6px","--radius-md":"10px","--radius-lg":"14px","--radius-xl":"20px","--radius-pill":"999px"} as React.CSSProperties },
];

const LIGHT_RESETS: React.CSSProperties = {
  "--surface-raised":"#ffffff","--surface-page":"#ffffff",
  "--text-title":"#202225","--text-body":"#3c4044","--text-subtitle":"#585f65",
  "--text-caption":"#777880","--border-subtle":"rgba(20,22,24,0.08)",
  "--border-default":"rgba(20,22,24,0.14)","--field-02":"#ffffff",
} as React.CSSProperties;

const CLIENT_THEMES = [
  {
    id:"technip", layout:"pipeline" as const,
    name:"TechNip Energies", sector:"Energy · throughput analytics",
    brandColor:"#00C2B8", vars:ramp("secondarycyan"),
    kpis:[
      { label:"Pipeline throughput", value:812, suffix:" kbpd", trend:"+4.1% vs target", dir:"up" as const },
      { label:"Active sites",        value:6,   suffix:" live",  trend:"+1 this month",  dir:"up" as const },
      { label:"Efficiency",          value:94,  suffix:"%",      trend:"+0.8pt",         dir:"up" as const },
    ],
    chartData:[30,34,31,38,36,42,40,46,44,49,52,55],
    chartLabels:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    activity:[
      { id:"PA-001", title:"Pipeline Alpha", detail:"812 kbpd · 3 sites",   status:"success" as const },
      { id:"PB-007", title:"Pipeline Beta",  detail:"Maintenance window",    status:"warning" as const },
      { id:"PG-012", title:"Pipeline Gamma", detail:"320 kbpd · 2 sites",   status:"success" as const },
    ],
    actions:["Export report","View analytics"],
  },
  {
    id:"aviva", layout:"insurance" as const,
    name:"Aviva Insurance", sector:"Financial · policy management",
    brandColor:"#12347e",
    vars:{ "--colour-primaryblue-50":"#e8ecf5","--colour-primaryblue-100":"#c8d1e8","--colour-primaryblue-200":"#a3b3d9",
           "--colour-primaryblue-300":"#7a92c9","--colour-primaryblue-400":"#42619e","--colour-primaryblue-500":"#12347e",
           "--colour-primaryblue-600":"#0c2b66","--colour-primaryblue-700":"#081f4e" } as React.CSSProperties,
    kpis:[
      { label:"Active policies",  value:48920, suffix:"",   trend:"+1.8% this month", dir:"up" as const },
      { label:"New claims",       value:312,   suffix:"",   trend:"This month",        dir:"up" as const },
      { label:"Avg settlement",   value:2840,  suffix:"",   trend:"-3.2% vs avg",     dir:"down" as const },
    ],
    chartData:[22,24,23,27,29,28,33,35,34,38,40,42],
    chartLabels:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    policyTypes:[
      { label:"Motor",    count:18420, pct:38 },
      { label:"Property", count:14200, pct:29 },
      { label:"Life",     count:10800, pct:22 },
      { label:"Travel",   count:5500,  pct:11 },
    ],
    activity:[
      { id:"CLM-1204", title:"Motor claim",    detail:"£1,240 · M. Johnson", status:"success" as const },
      { id:"CLM-1198", title:"Property claim", detail:"£8,500 · S. Patel",   status:"warning" as const },
      { id:"CLM-1187", title:"Life claim",     detail:"£22,000 · T. Brown",  status:"success" as const },
    ],
    actions:["New claim","Policy renewal"],
  },
  {
    id:"vodafone", layout:"network" as const,
    name:"VodafoneThree", sector:"Telecom · network operations",
    brandColor:"#E60000",
    vars:{ "--colour-primaryblue-50":"#ffe9e9","--colour-primaryblue-100":"#ffc7c7","--colour-primaryblue-200":"#ff9a9a",
           "--colour-primaryblue-300":"#ff6b6b","--colour-primaryblue-400":"#f53434","--colour-primaryblue-500":"#E60000",
           "--colour-primaryblue-600":"#bd0000","--colour-primaryblue-700":"#8f0000" } as React.CSSProperties,
    kpis:[
      { label:"Network uptime",  value:99.98, suffix:"%",  trend:"+0.04pt this week", dir:"up" as const },
      { label:"Active incidents",value:2,     suffix:"",   trend:"-3 vs last week",   dir:"up" as const },
      { label:"Coverage",        value:98,    suffix:"%",  trend:"UK population",     dir:"up" as const },
    ],
    chartData:[40,38,42,41,44,43,46,45,48,49,48,50],
    chartLabels:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    activity:[
      { id:"INC-0042", title:"Mast offline – Leeds",     detail:"3G/4G · Est. 2hr",  status:"error" as const },
      { id:"INC-0038", title:"Core latency – SE England",detail:"+12ms · Monitoring", status:"warning" as const },
      { id:"INC-0031", title:"Fibre cut – Birmingham",   detail:"Resolved 14:32",    status:"success" as const },
    ],
    actions:["Open NOC","View map"],
  },
];

const NAV = [
  { id:"sc-overview",    label:"Overview",    icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg> },
  { id:"sc-components",  label:"Components",  icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
  { id:"sc-data",        label:"Data viz",    icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/></svg> },
  { id:"sc-theming",     label:"Theming",     icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="10.5" r="2.5"/><circle cx="8.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="12.5" r="2.5"/><path d="M12 22a4 4 0 0 0 0-8 4 4 0 0 1 0-8"/></svg> },
  { id:"sc-foundations", label:"Foundations", icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg> },
];

const I_arrowL = <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
const I_chevL  = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const I_chevR  = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const I_code   = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;

/* ── Shared helpers ─────────────────────────────────────────── */
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

/* Module-level ShowToken — avoids stale-closure issues, gets enabled as explicit prop */
function ShowToken({ token, children, side="top", enabled }: {
  token: string; children: React.ReactElement;
  side?: "top"|"bottom"|"left"|"right"; enabled: boolean;
}) {
  if (!enabled) return children;
  return <Tooltip label={token} side={side}>{children}</Tooltip>;
}

/* ── Animated counter ───────────────────────────────────────── */
function AnimatedCounter({ to, prefix="", suffix="" }: { to:number; prefix?:string; suffix?:string }) {
  const spanRef = React.useRef<HTMLSpanElement>(null);
  const wrapRef = React.useRef<HTMLSpanElement>(null);
  const inView  = useInView(wrapRef, { once:true });
  React.useEffect(() => {
    if (!inView || !spanRef.current) return;
    const isFloat = !Number.isInteger(to);
    const controls = animate(0, to, {
      duration: 1.5, ease: "easeOut",
      onUpdate: (v) => {
        if (spanRef.current)
          spanRef.current.textContent = prefix + (isFloat ? v.toFixed(2) : Math.round(v).toLocaleString()) + suffix;
      },
    });
    return controls.stop;
  }, [inView, to, prefix, suffix]);
  return <span ref={wrapRef}><span ref={spanRef}>{prefix}{Number.isInteger(to) ? to.toLocaleString() : to.toFixed(2)}{suffix}</span></span>;
}

/* ── Animated bar chart — bars grow from bottom baseline ────── */
function AnimatedBarChart({ data, labels, color="var(--colour-primaryblue-500)" }:
  { data:number[]; labels:string[]; color?:string }) {
  const ref    = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once:true, margin:"-60px" });
  const max    = Math.max(...data);
  const BAR_H  = 80;
  return (
    <div ref={ref}>
      {/* Bar area — bars grow upward from a shared baseline */}
      <div style={{ display:"flex", alignItems:"flex-end", gap:5, height:BAR_H }}>
        {data.map((v, i) => (
          <motion.div key={i}
            initial={{ height:0 }}
            animate={{ height: inView ? Math.max((v/max)*BAR_H, 3) : 0 }}
            transition={{ duration:0.55, delay:i*0.04, ease:[0.16,1,0.3,1] }}
            style={{ flex:1, background:i%2===0 ? color : color.replace("500","300"),
              borderRadius:"4px 4px 0 0", alignSelf:"flex-end" }}
          />
        ))}
      </div>
      {/* Baseline rule */}
      <div style={{ height:1, background:"rgba(20,22,24,0.08)", margin:"0 0 4px" }}/>
      {/* Labels */}
      <div style={{ display:"flex", gap:5 }}>
        {labels.map((l, i) => (
          <div key={i} style={{ flex:1, textAlign:"center" }}>
            <span style={{ fontSize:7, color:"#9aa0ac", fontFamily:"var(--font-normal)" }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Gauge chart (SVG + motion pathLength) ──────────────────── */
function GaugeChart({ value, max=100, label }: { value:number; max?:number; label:string }) {
  const ref    = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once:true });
  const cx=80, cy=72, R=54;
  const trackD = `M ${cx-R} ${cy} A ${R} ${R} 0 0 1 ${cx+R} ${cy}`;
  return (
    <div ref={ref} style={{ maxWidth:170, margin:"0 auto" }}>
      <svg viewBox="0 0 160 104" width="100%" style={{ display:"block" }}>
        <path d={trackD} fill="none" stroke="rgba(10,10,20,0.08)" strokeWidth="13" strokeLinecap="round"/>
        <motion.path d={trackD} fill="none" stroke="var(--colour-primaryblue-500)" strokeWidth="13" strokeLinecap="round"
          initial={{ pathLength:0 }} animate={{ pathLength: inView ? value/max : 0 }}
          transition={{ duration:1.2, ease:"easeOut", delay:0.15 }}/>
        <text x={cx} y={cy-4} textAnchor="middle" dominantBaseline="middle"
          fontSize="20" fontWeight="700" fill="#0a0a14" fontFamily="var(--font-bold)">{value}%</text>
        <text x={cx} y={cy+14} textAnchor="middle" dominantBaseline="middle"
          fontSize="9" fill="#8a8f9b" fontFamily="var(--font-normal)">{label}</text>
      </svg>
    </div>
  );
}

/* ── RadarChart ─────────────────────────────────────────────── */
function RadarChart() {
  const [hi, setHi] = React.useState<number|null>(null);
  const cx=90, cy=92, R=66;
  const data=[0.82,0.55,0.72,0.88,0.50,0.66];
  const values=[820,550,720,880,500,660];
  const labels=["January","February","March","April","May","June"];
  const ang = (i:number) => -Math.PI/2+i*Math.PI/3;
  const ring = (f:number) => [0,1,2,3,4,5].map(i=>{const a=ang(i);return `${cx+R*f*Math.cos(a)},${cy+R*f*Math.sin(a)}`;}).join(" ");
  const pts = data.map((v,i)=>[cx+R*v*Math.cos(ang(i)), cy+R*v*Math.sin(ang(i))]);
  const dpts = pts.map(p=>p.join(",")).join(" ");
  return (
    <div style={{ position:"relative", maxWidth:240, margin:"4px auto 0", width:"100%" }}>
      <svg viewBox="0 0 180 184" width="100%" style={{ display:"block" }}>
        {[0.34,0.67,1].map((f,i)=><polygon key={i} points={ring(f)} fill="none" stroke="rgba(10,10,20,0.10)"/>)}
        {[0,1,2,3,4,5].map(i=>{const a=ang(i);return <line key={i} x1={cx} y1={cy} x2={cx+R*Math.cos(a)} y2={cy+R*Math.sin(a)} stroke="rgba(10,10,20,0.07)"/>;}) }
        <polygon points={dpts} fill="rgba(0,54,221,0.14)" stroke="var(--colour-primaryblue-500)" strokeWidth="1.6"/>
        {pts.map((p,i)=>(
          <circle key={i} cx={p[0]} cy={p[1]} r={hi===i?5.5:3.5}
            fill={hi===i?"var(--colour-primaryblue-500)":"#fff"} stroke="var(--colour-primaryblue-500)" strokeWidth="1.6"
            style={{ cursor:"pointer", transition:"r .15s ease" }}
            onMouseEnter={()=>setHi(i)} onMouseLeave={()=>setHi(null)}/>
        ))}
        {labels.map((l,i)=>{const a=ang(i),lx=cx+(R+13)*Math.cos(a),ly=cy+(R+13)*Math.sin(a);
          return <text key={l} x={lx} y={ly} fontSize="8" fill={hi===i?"var(--colour-primaryblue-500)":"#8a8f9b"}
            textAnchor="middle" dominantBaseline="middle" style={{ transition:"fill .15s" }}>{l}</text>;})}
      </svg>
      {hi!==null&&<div className="rtu-tip" style={{ left:`${(pts[hi][0]/180)*100}%`, top:`${(pts[hi][1]/184)*100}%` }}>{values[hi].toLocaleString()}<span>{labels[hi]}</span></div>}
    </div>
  );
}

/* ── DonutChart ─────────────────────────────────────────────── */
function DonutChart() {
  const MONTHS=["January","February","March","April","May","June"];
  const MONTH_DATA: Record<string,[number,number,number]> = {
    January:[186,62,48],February:[154,78,32],March:[201,55,60],
    April:[178,42,66],May:[220,85,38],June:[165,71,52],
  };
  const COLORS=["var(--colour-primaryblue-500)","var(--colour-primaryblue-300)","var(--colour-primaryblue-100)"];
  const LABELS=["Visitors","Page views","Conversions"];
  const [month,setMonth]=React.useState("January");
  const [open,setOpen]=React.useState(false);
  const [hiArc,setHiArc]=React.useState<number|null>(null);
  const ref=React.useRef<HTMLDivElement>(null);
  React.useEffect(()=>{const h=(e:MouseEvent)=>{if(ref.current&&!ref.current.contains(e.target as Node))setOpen(false);};document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h);},[]);
  const vals=MONTH_DATA[month],total=vals.reduce((a,b)=>a+b,0);
  const cx=80,cy=80,OR=63,Osw=13,IR=46,Isw=6,TICKS=72;
  const ir0=IR-Isw/2+0.5,ir1=IR+Isw/2-0.5;
  const GAP_RAD=(20/360)*Math.PI*2,ARC_RAD=Math.PI*2-GAP_RAD*vals.length;
  let angle=-Math.PI/2;
  const arcs=vals.map((v,i)=>{const arc=(v/total)*ARC_RAD,sa=angle,ea=angle+arc;angle=ea+GAP_RAD;
    return{d:`M ${(cx+OR*Math.cos(sa)).toFixed(2)} ${(cy+OR*Math.sin(sa)).toFixed(2)} A ${OR} ${OR} 0 ${arc>Math.PI?1:0} 1 ${(cx+OR*Math.cos(ea)).toFixed(2)} ${(cy+OR*Math.sin(ea)).toFixed(2)}`,color:COLORS[i],label:LABELS[i],value:v};});
  return (
    <div ref={ref} style={{ position:"relative" }}>
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:4, position:"relative" }}>
        <button className="rtu-pill" onClick={()=>setOpen(o=>!o)}>{month} ▾</button>
        {open&&<div className="rtu-month-menu">{MONTHS.map(m=><button key={m} className={m===month?"on":""} onClick={()=>{setMonth(m);setOpen(false);}}>{m}</button>)}</div>}
      </div>
      <div style={{ maxWidth:210, margin:"0 auto", width:"100%" }}>
        <svg viewBox="0 0 160 160" width="100%" style={{ display:"block" }}>
          {Array.from({length:TICKS}).map((_,t)=>{const a=(t/TICKS)*Math.PI*2-Math.PI/2;return<line key={t} x1={(cx+ir0*Math.cos(a)).toFixed(2)} y1={(cy+ir0*Math.sin(a)).toFixed(2)} x2={(cx+ir1*Math.cos(a)).toFixed(2)} y2={(cy+ir1*Math.sin(a)).toFixed(2)} stroke="rgba(0,0,0,0.18)" strokeWidth="0.9"/>;}) }
          <circle cx={cx} cy={cy} r={OR} fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth={Osw}/>
          {arcs.map((arc,i)=><path key={`${month}-${i}`} d={arc.d} fill="none" stroke={arc.color} strokeWidth={hiArc===i?Osw+3:Osw} strokeLinecap="round" style={{ cursor:"pointer", transition:"stroke-width .15s ease" }} onMouseEnter={()=>setHiArc(i)} onMouseLeave={()=>setHiArc(null)}/>)}
          <text x={cx} y={cy-10} textAnchor="middle" dominantBaseline="middle" fontSize="22" fontWeight="700" fill="#0a0a14" style={{ fontFamily:"var(--font-bold)" }}>{vals[0]}</text>
          <text x={cx} y={cy+10} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#8a8f9b" style={{ fontFamily:"var(--font-normal)" }}>Visitors</text>
        </svg>
      </div>
      {hiArc!==null&&<div className="rtu-tip" style={{ position:"absolute",left:"50%",top:"42%",transform:"translate(-50%,-50%)",pointerEvents:"none" }}>{arcs[hiArc]?.value}<span>{arcs[hiArc]?.label}</span></div>}
      <div style={{ marginTop:10, display:"flex", flexDirection:"column", gap:5 }}>
        {arcs.map(arc=>(<div key={arc.label} style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ width:9,height:9,borderRadius:"50%",background:arc.color,flexShrink:0,display:"inline-block" }}/>
          <span className="rtu-card-sub" style={{ margin:0,flex:1 }}>{arc.label}</span>
          <span className="rtu-card-sub" style={{ margin:0,color:"#0a0a14",fontWeight:600 }}>{arc.value}</span>
        </div>))}
      </div>
    </div>
  );
}

/* ── MiniLineChart ──────────────────────────────────────────── */
function MiniLineChart() {
  const [hi,setHi]=React.useState<number|null>(null);
  const W=400,H=90,pad=14;
  const raw=[42,58,51,74,68,85,72,79,65,88],labels=["Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May"];
  const maxV=Math.max(...raw),minV=Math.min(...raw);
  const pts=raw.map((v,i)=>[pad+(i/(raw.length-1))*(W-pad*2),H-pad-((v-minV)/(maxV-minV))*(H-pad*2)]);
  let d=`M ${pts[0][0]} ${pts[0][1]}`;
  for(let i=0;i<pts.length-1;i++){const cp=pts[i][0]+(pts[i+1][0]-pts[i][0])*0.5;d+=` C ${cp} ${pts[i][1]}, ${cp} ${pts[i+1][1]}, ${pts[i+1][0]} ${pts[i+1][1]}`;}
  const area=`${d} L ${W-pad} ${H-pad} L ${pad} ${H-pad} Z`;
  const ref=React.useRef<HTMLDivElement>(null);
  const onMove=(e:React.MouseEvent)=>{const r=ref.current!.getBoundingClientRect();setHi(Math.max(0,Math.min(raw.length-1,Math.round(((e.clientX-r.left)/r.width)*(raw.length-1)))));};
  return(
    <div ref={ref} style={{ position:"relative" }} onMouseMove={onMove} onMouseLeave={()=>setHi(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display:"block",width:"100%",height:H }}>
        <defs><linearGradient id="mlg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--colour-primaryblue-400)" stopOpacity="0.22"/><stop offset="100%" stopColor="var(--colour-primaryblue-400)" stopOpacity="0"/></linearGradient></defs>
        <path d={area} fill="url(#mlg)"/>
        <path d={d} fill="none" stroke="var(--colour-primaryblue-500)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round"/>
        {hi!==null&&<line x1={pts[hi][0]} y1={pad} x2={pts[hi][0]} y2={H-pad} stroke="var(--colour-primaryblue-300)" strokeWidth="1" vectorEffect="non-scaling-stroke" strokeDasharray="3 3"/>}
      </svg>
      {hi!==null&&(<><div style={{ position:"absolute",left:`${(pts[hi][0]/W)*100}%`,top:`${(pts[hi][1]/H)*100}%`,transform:"translate(-50%,-50%)",width:10,height:10,borderRadius:"50%",background:"#fff",border:"2px solid var(--colour-primaryblue-500)",pointerEvents:"none",zIndex:2 }}/><div className="rtu-tip" style={{ left:`${(pts[hi][0]/W)*100}%`,top:`${(pts[hi][1]/H)*100}%` }}>{raw[hi]}<span>{labels[hi]}</span></div></>)}
    </div>
  );
}

/* ── InteractiveLineChart ───────────────────────────────────── */
const LC_LABELS=["Apr 5","Apr 10","Apr 15","Apr 20","Apr 25","Apr 30","May 5","May 10","May 15","May 20","May 25","May 30","Jun 4","Jun 9","Jun 14","Jun 19","Jun 24","Jun 30"];
const LC_SERIES={ desktop:{label:"Desktop",total:"24,828",data:[12,19,15,27,22,31,26,34,29,38,33,41,36,44,40,47,43,49]}, mobile:{label:"Mobile",total:"25,010",data:[16,14,21,18,25,22,29,25,32,28,35,31,38,34,40,37,43,45]} };
type SeriesKey = keyof typeof LC_SERIES;
function smoothPath(values:number[],W:number,H:number,pad:number,minV:number,maxV:number){
  const pts=values.map((v,i)=>[pad+(i/(values.length-1))*(W-pad*2),H-pad-((v-minV)/(maxV-minV))*(H-pad*2)] as [number,number]);
  let d=`M ${pts[0][0]} ${pts[0][1]}`;
  for(let i=0;i<pts.length-1;i++){const cp=pts[i][0]+(pts[i+1][0]-pts[i][0])*0.5;d+=` C ${cp} ${pts[i][1]}, ${cp} ${pts[i+1][1]}, ${pts[i+1][0]} ${pts[i+1][1]}`;}
  return{d,pts};
}
function InteractiveLineChart() {
  const [active,setActive]=React.useState<SeriesKey>("desktop");
  const [hi,setHi]=React.useState<number|null>(null);
  const W=1000,H=220,pad=18;
  const all=[...LC_SERIES.desktop.data,...LC_SERIES.mobile.data];
  const minV=Math.min(...all),maxV=Math.max(...all);
  const other:SeriesKey=active==="desktop"?"mobile":"desktop";
  const A=smoothPath(LC_SERIES[active].data,W,H,pad,minV,maxV);
  const O=smoothPath(LC_SERIES[other].data,W,H,pad,minV,maxV);
  const area=`${A.d} L ${W-pad} ${H-pad} L ${pad} ${H-pad} Z`;
  const ref=React.useRef<HTMLDivElement>(null);
  const onMove=(e:React.MouseEvent)=>{const r=ref.current!.getBoundingClientRect();setHi(Math.max(0,Math.min(LC_LABELS.length-1,Math.round(((e.clientX-r.left)/r.width)*(LC_LABELS.length-1)))));};
  const val=(k:SeriesKey,i:number)=>Math.round(LC_SERIES[k].data[i]*540).toLocaleString();
  return (
    <div className="cc rtu-line" style={{ marginTop:20 }}>
      <div className="rtu-line-head">
        <div><div className="rtu-card-h">Line Chart · Interactive</div><div className="rtu-card-sub">Total visitors over 3 months — click a series to switch</div></div>
        <div className="rtu-line-stats">
          {(Object.keys(LC_SERIES) as SeriesKey[]).map(k=>(
            <button key={k} onClick={()=>setActive(k)} className={`rtu-stat${active===k?" on":""}`}
              style={{ border:"none",borderLeft:"1px solid rgba(10,10,20,0.08)",cursor:"pointer",background:active===k?"#f4f5f7":"transparent" }}>
              <span style={{ display:"flex",alignItems:"center",gap:6 }}>
                <span style={{ width:8,height:8,borderRadius:"50%",background:active===k?"var(--colour-primaryblue-500)":"#c2c6cf" }}/>
                {LC_SERIES[k].label}
              </span>
              <strong>{LC_SERIES[k].total}</strong>
            </button>
          ))}
        </div>
      </div>
      <div ref={ref} style={{ position:"relative" }} onMouseMove={onMove} onMouseLeave={()=>setHi(null)}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" preserveAspectRatio="none" style={{ display:"block",height:H }}>
          <defs><linearGradient id="ilc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--colour-primaryblue-400)" stopOpacity="0.20"/><stop offset="100%" stopColor="var(--colour-primaryblue-400)" stopOpacity="0"/></linearGradient></defs>
          <path d={area} fill="url(#ilc)"/>
          <path d={O.d} fill="none" stroke="var(--colour-primaryblue-200)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" opacity="0.7"/>
          <path d={A.d} fill="none" stroke="var(--colour-primaryblue-500)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round"/>
          {hi!==null&&<line x1={A.pts[hi][0]} y1={pad} x2={A.pts[hi][0]} y2={H-pad} stroke="var(--colour-primaryblue-300)" strokeWidth="1" vectorEffect="non-scaling-stroke" strokeDasharray="4 4"/>}
        </svg>
        {hi!==null&&(<>
          <div style={{ position:"absolute",left:`${(A.pts[hi][0]/W)*100}%`,top:`${(A.pts[hi][1]/H)*100}%`,transform:"translate(-50%,-50%)",width:11,height:11,borderRadius:"50%",background:"#fff",border:"2.5px solid var(--colour-primaryblue-500)",pointerEvents:"none",zIndex:2 }}/>
          <div className="rtu-tip" style={{ left:`${(A.pts[hi][0]/W)*100}%`,top:`${(A.pts[hi][1]/H)*100}%` }}>{val(active,hi)}<span>{LC_SERIES[active].label} · {LC_LABELS[hi]}</span></div>
        </>)}
      </div>
      <div className="rtu-axis">{LC_LABELS.map(l=><span key={l}>{l}</span>)}</div>
    </div>
  );
}

/* ── BrandSpark ─────────────────────────────────────────────── */
function BrandSpark({ data, height=46 }: { data:number[]; height?:number }) {
  const W=400,H=height,pad=4;
  const maxV=Math.max(...data),minV=Math.min(...data);
  const pts=data.map((v,i)=>[pad+(i/(data.length-1))*(W-pad*2),H-pad-((v-minV)/(maxV-minV||1))*(H-pad*2)]);
  let d=`M ${pts[0][0]} ${pts[0][1]}`;
  for(let i=0;i<pts.length-1;i++){const cp=pts[i][0]+(pts[i+1][0]-pts[i][0])*0.5;d+=` C ${cp} ${pts[i][1]}, ${cp} ${pts[i+1][1]}, ${pts[i+1][0]} ${pts[i+1][1]}`;}
  const area=`${d} L ${W-pad} ${H-pad} L ${pad} ${H-pad} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display:"block" }}>
      <defs><linearGradient id={`bs-${H}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--colour-primaryblue-500)" stopOpacity="0.20"/><stop offset="100%" stopColor="var(--colour-primaryblue-500)" stopOpacity="0"/></linearGradient></defs>
      <path d={area} fill={`url(#bs-${H})`}/>
      <path d={d} fill="none" stroke="var(--colour-primaryblue-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Custom DS-styled dropdown (replaces native <select>) ────── */
function ShowcaseSelect({ label, options, value: vProp, onChange, placeholder }: {
  label?: string; options: string[]; value?: string;
  onChange?: (v: string) => void; placeholder?: string;
}) {
  const [internal, setInternal] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [hovOpt, setHovOpt] = React.useState<string|null>(null);
  const ref = React.useRef<HTMLDivElement>(null);
  const controlled = vProp !== undefined;
  const value = controlled ? vProp! : internal;
  React.useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const pick = (opt: string) => { if (controlled) onChange!(opt); else setInternal(opt); setOpen(false); };
  return (
    <div>
      {label && <p style={{ fontFamily:"var(--font-bold)", fontWeight:700, fontSize:13, color:"var(--text-body)", margin:"0 0 6px" }}>{label}</p>}
      <div ref={ref} style={{ position:"relative" }}>
        <button onClick={() => setOpen(o => !o)} style={{
          width:"100%", height:40, padding:"0 36px 0 12px", boxSizing:"border-box",
          background:"var(--field-02,#f4f5f7)",
          border:`1px solid ${open ? "var(--colour-primaryblue-500,#0036DD)" : "var(--border-default,rgba(20,22,24,0.14))"}`,
          boxShadow: open ? "0 0 0 3px rgba(0,54,221,0.12)" : "none",
          borderRadius:"var(--radius-sm,6px)", cursor:"pointer", textAlign:"left", outline:"none",
          fontFamily:"var(--font-normal)", fontSize:14, display:"block",
          color: value ? "var(--text-body,#1a1d21)" : "var(--text-disabled,#9aa0ac)",
          transition:"border-color .15s, box-shadow .15s",
        }}>
          {value || placeholder || "Select…"}
          <span style={{ position:"absolute", right:10, top:"50%", pointerEvents:"none",
            transform: open ? "translateY(-50%) rotate(180deg)" : "translateY(-50%)",
            transition:"transform .15s", color:"var(--text-caption,#6b7280)", lineHeight:0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
          </span>
        </button>
        {open && (
          <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, right:0, zIndex:200,
            background:"var(--surface-raised,#fff)", borderRadius:"var(--radius-md,8px)",
            border:"1px solid var(--border-default,rgba(20,22,24,0.12))",
            boxShadow:"0 10px 32px rgba(20,22,24,0.16), 0 2px 8px rgba(20,22,24,0.06)",
            overflow:"hidden", padding:"4px 0" }}>
            {options.map(opt => (
              <button key={opt} onClick={() => pick(opt)}
                onMouseEnter={() => setHovOpt(opt)}
                onMouseLeave={() => setHovOpt(null)}
                style={{
                  display:"block", width:"100%", textAlign:"left", border:"none", outline:"none",
                  padding:"10px 14px", cursor:"pointer", fontFamily:"var(--font-normal)", fontSize:14,
                  background: opt === value ? "rgba(0,54,221,0.06)" : hovOpt === opt ? "rgba(20,22,24,0.04)" : "transparent",
                  color: opt === value ? "var(--colour-primaryblue-600,#0029b0)" : "var(--text-body)",
                  fontWeight: opt === value ? 600 : 400,
                  transition:"background .12s",
                }}>{opt}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Interactive pipeline line chart (TechNip dashboard) ─────── */
/* Uses ResizeObserver so viewBox always equals rendered pixel size — no
   squashing or letterboxing at any viewport width. */
function PipelineChart({ data, labels, color="#0036DD" }: {
  data: number[]; labels: string[]; color?: string;
}) {
  const [hover, setHover] = React.useState<number|null>(null);
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [W, setW] = React.useState(600);

  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new ResizeObserver(entries => setW(Math.round(entries[0].contentRect.width)));
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* H is proportional to W, capped so it never exceeds 200px */
  const H  = Math.min(Math.round(W * 0.30), 200);
  const pL = 34, pR = 10, pT = 12, pB = 26;
  const cW = W - pL - pR;
  const cH = H - pT - pB;
  const n  = data.length;
  const maxV = Math.max(...data);
  const minV = Math.min(...data);
  const rng  = maxV - minV || 1;
  const xS   = cW / (n - 1);
  const pts  = data.map((v,i) => [pL + i*xS, pT + (1-(v-minV)/rng)*cH] as [number,number]);

  let line = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i=0; i<n-1; i++) {
    const mx = (pts[i][0]+pts[i+1][0])/2;
    line += ` C ${mx.toFixed(1)} ${pts[i][1].toFixed(1)} ${mx.toFixed(1)} ${pts[i+1][1].toFixed(1)} ${pts[i+1][0].toFixed(1)} ${pts[i+1][1].toFixed(1)}`;
  }
  const area = `${line} L ${pts[n-1][0].toFixed(1)} ${pT+cH} L ${pts[0][0].toFixed(1)} ${pT+cH} Z`;

  const hex = (color.startsWith("#") && color.length===7) ? color : "#0036DD";
  const rr=parseInt(hex.slice(1,3),16), gg=parseInt(hex.slice(3,5),16), bb=parseInt(hex.slice(5,7),16);
  const fillTop=`rgba(${rr},${gg},${bb},0.16)`, fillBot=`rgba(${rr},${gg},${bb},0.01)`;
  const yTicks = [maxV, Math.round((maxV+minV)/2), minV];

  /* Mouse coords are already in CSS pixels = viewBox units (scale=1) */
  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const idx  = Math.round((e.clientX - rect.left - pL) / xS);
    setHover(idx >= 0 && idx < n ? idx : null);
  };

  return (
    <div ref={wrapRef} style={{ width:"100%" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}
        style={{ display:"block", width:"100%", cursor:"crosshair", overflow:"visible" }}
        onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
        <defs>
          <linearGradient id="pchart-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fillTop}/>
            <stop offset="100%" stopColor={fillBot}/>
          </linearGradient>
        </defs>
        {yTicks.map((v,i) => { const y=pT+(1-(v-minV)/rng)*cH; return (
          <g key={i}>
            <line x1={pL} y1={y} x2={W-pR} y2={y} stroke="rgba(20,22,24,0.07)" strokeWidth="1"/>
            <text x={pL-5} y={y} textAnchor="end" dominantBaseline="middle"
              fontSize="11" fill="#9aa0ac" fontFamily="var(--font-mono)">{v}</text>
          </g>
        ); })}
        <line x1={pL} y1={pT+cH} x2={W-pR} y2={pT+cH} stroke="rgba(20,22,24,0.10)" strokeWidth="1"/>
        {labels.map((l,i) => (
          <text key={i} x={pL+i*xS} y={H-5} textAnchor="middle" dominantBaseline="auto"
            fontSize="11" fill="#9aa0ac" fontFamily="var(--font-normal)">{l}</text>
        ))}
        <path d={area} fill="url(#pchart-grad)"/>
        <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        {hover !== null && (
          <g>
            <line x1={pts[hover][0]} y1={pT} x2={pts[hover][0]} y2={pT+cH}
              stroke={color} strokeWidth="1.5" strokeDasharray="4 3" strokeOpacity="0.45"/>
            <circle cx={pts[hover][0]} cy={pts[hover][1]} r="5" fill={color} stroke="#fff" strokeWidth="2.5"/>
            {(() => {
              const tx = Math.min(pts[hover][0]+10, W-68);
              const ty = Math.max(pts[hover][1]-28, pT);
              return (
                <g transform={`translate(${tx},${ty})`}>
                  <rect width="64" height="22" rx="5" fill="#1a2035" opacity="0.92"/>
                  <text x="32" y="11" textAnchor="middle" dominantBaseline="middle"
                    fontSize="11" fontWeight="700" fill="#fff" fontFamily="var(--font-bold)">
                    {data[hover]} kbpd
                  </text>
                </g>
              );
            })()}
          </g>
        )}
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
export default function ShowcasePage() {
  const [accentIdx,  setAccentIdx ] = React.useState(0);
  const [surface,    setSurface   ] = React.useState<"white"|"warm"|"dark">("white");
  const [radiusIdx,  setRadiusIdx ] = React.useState(2);
  const [showTokens, setShowTokens] = React.useState(false);
  const [collapsed,  setCollapsed ] = React.useState(false);
  const [navActive,  setNavActive ] = React.useState("sc-overview");
  const [brandTab,   setBrandTab  ] = React.useState("technip");
  const [sw,   setSw ] = React.useState(true);
  const [ck,   setCk ] = React.useState([true,false,false]);
  const [rv,   setRv ] = React.useState("opt1");
  const [dismissed, setDismissed] = React.useState<string[]>([]);
  const [tags, setTags] = React.useState(["Design system","React","TypeScript","Tokens"]);
  const [toast, setToast] = React.useState<string|null>(null);
  const [envVal, setEnvVal] = React.useState("");

  const showToast = React.useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  }, []);

  /* Mobile detection */
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* Scroll-spy */
  const mainRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onScroll = () => {
      const scrollTop = el.scrollTop;
      const viewH = el.clientHeight;
      for (let i = NAV.length - 1; i >= 0; i--) {
        const sec = document.getElementById(NAV[i].id);
        if (sec && sec.offsetTop - viewH * 0.35 <= scrollTop) {
          setNavActive(NAV[i].id);
          return;
        }
      }
      setNavActive(NAV[0].id);
    };
    el.addEventListener("scroll", onScroll, { passive:true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const accent    = ACCENTS[accentIdx];
  const surfCfg   = SURFACES[surface];
  const radiusCfg = RADII[radiusIdx];
  const mainVars  = { ...accent.vars, ...surfCfg.tokens, ...radiusCfg.vars } as React.CSSProperties;
  const sidebarW  = collapsed ? 76 : 256;
  const lpad      = isMobile ? 20 : sidebarW + 48;

  const go = (id:string) => {
    setNavActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth", block:"start" });
  };

  /* ─ Band content wrapper ─ */
  const bandPad = (extra: React.CSSProperties = {}) => ({
    paddingLeft:  lpad, paddingRight: 48, paddingTop: 44, paddingBottom: 44,
    transition: "padding-left .34s cubic-bezier(.16,1,.3,1)",
    ...extra,
  } as React.CSSProperties);

  /* ─ Hero ──────────────────────────────────────────────── */
  const heroBand = (
    <section id="sc-overview" style={{ position:"relative", overflow:"hidden", background:"#fdf5f0", scrollMarginTop:0, minHeight:"50vh" }}>
      <div className="hero-aurora"/>
      <div className="sc-band-content" style={{ ...bandPad({ paddingTop:84, paddingBottom:70 }), position:"relative", zIndex:1, textAlign:"center" }}>
        <p style={{ fontFamily:"var(--font-normal)", fontSize:11, fontWeight:700, letterSpacing:"0.10em",
          textTransform:"uppercase", color:"rgba(0,0,0,0.35)", margin:"0 0 16px" }}>SANDHATA DESIGN SYSTEM</p>
        <h1 style={{ fontFamily:"var(--font-bold)", fontSize:48, fontWeight:700, lineHeight:1.1,
          letterSpacing:"-1.5px", color:"#0a0a14", margin:"0 0 16px" }}>
          The design system,{" "}<em style={{ fontStyle:"normal", color:"#d58b03" }}>alive.</em>
        </h1>
        <p style={{ fontFamily:"var(--font-normal)", fontSize:16, color:"#585f65", maxWidth:460, margin:"0 auto 32px", lineHeight:1.6 }}>
          120+ components, 1.2k tokens, WCAG AA. Built for enterprise teams that ship.
        </p>
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
          {[["120+","Components"],["1.2k","Design Tokens"],["WCAG","AA Compliant"],["v1.0","Stable"]].map(([val,label])=>(
            <div key={label} style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"8px 18px",
              background:"rgba(255,255,255,0.70)", backdropFilter:"blur(8px)", WebkitBackdropFilter:"blur(8px)",
              border:"1px solid rgba(20,22,24,0.08)", borderRadius:"var(--radius-pill)" }}>
              <span style={{ fontFamily:"var(--font-bold)", fontWeight:700, fontSize:14, color:"#0a0a14" }}>{val}</span>
              <span style={{ fontFamily:"var(--font-normal)", fontSize:13, color:"#585f65" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  /* ─ Components ────────────────────────────────────────── */
  const atomsBand = (
    <section id="sc-components" style={{ background:"var(--surface-raised,#fff)" }}>
      <div className="sc-band-content" style={bandPad()}>
        {/* Row 1: Buttons | Badges | Input | Selection */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:40, marginBottom:40 }}>
          <div>
            <BandTag>Button · 6 hierarchies</BandTag>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {(["primary","secondary","tertiary","ghost","inverse","danger"] as const).map(h=>(
                <div key={h} style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <ShowToken token={`hierarchy="${h}"`} enabled={showTokens}>
                    <Button hierarchy={h} size="small">{h.charAt(0).toUpperCase()+h.slice(1)}</Button>
                  </ShowToken>
                  <span style={{ fontFamily:"var(--font-mono)", fontSize:10, color:"var(--text-caption)" }}>{h}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <BandTag>Badge · 7 semantic tones</BandTag>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {(["neutral","info","success","warning","error","action","highlight"] as const).map(t=>(
                <div key={t} style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <ShowToken token={`tone="${t}"`} side="right" enabled={showTokens}>
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
          <div>
            <BandTag>Input · 4 states</BandTag>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div><p style={labelCap}>Default</p><Input label="Project name" placeholder="Enter name"/></div>
              <div>
                <p style={labelCap}>Focus</p>
                <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                  <label style={{ fontFamily:"var(--font-normal)", fontWeight:700, fontSize:"var(--label-size,12px)", color:"var(--text-subtitle)", letterSpacing:"var(--label-tracking,0.01em)" }}>Search</label>
                  <div style={{ height:40, padding:"0 12px", display:"flex", alignItems:"center", border:"1.5px solid var(--colour-primaryblue-500)", borderRadius:"var(--radius-sm)", background:"var(--field-02,#fff)", boxShadow:"0 0 0 3px var(--colour-primaryblue-100)", fontFamily:"var(--font-normal)", fontSize:"var(--body-medium-size,14px)", color:"var(--text-body)" }}>design system</div>
                </div>
              </div>
              <div><p style={labelCap}>Error</p><Input label="Email" error="Please enter a valid email" defaultValue="not-an-email"/></div>
              <div><p style={labelCap}>Disabled</p><Input label="API Key" disabled defaultValue="sk-••••••••••••••••"/></div>
            </div>
          </div>
          <div>
            <BandTag>Selection controls</BandTag>
            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:10, cursor:"pointer" }}
                onClick={() => setSw(s => !s)}>
                <div style={{ width:40, height:22, borderRadius:999, position:"relative", flexShrink:0,
                  background: sw ? "var(--colour-primaryblue-500,#0036DD)" : "var(--colour-neutral-300,#c0c7cf)",
                  transition:"background .18s" }}>
                  <div style={{ position:"absolute", top:2, left:sw?20:2, width:18, height:18,
                    borderRadius:"50%", background:"#fff", boxShadow:"0 1px 4px rgba(0,0,0,0.20)",
                    transition:"left .18s" }}/>
                </div>
                <span style={{ fontFamily:"var(--font-normal)", fontSize:14, color:"var(--text-body)" }}>
                  {sw?"Notifications on":"Notifications off"}
                </span>
              </div>
              <div>
                <p style={labelCap}>Checkbox</p>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {["Export as PNG","Export as SVG","Export as PDF"].map((l,i)=>(
                    <Checkbox key={l} label={l} checked={ck[i]}
                      onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setCk(c=>c.map((x:boolean,j:number)=>j===i?e.target.checked:x))}/>
                  ))}
                </div>
              </div>
              <div>
                <p style={labelCap}>Radio</p>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {["Light mode","Dark mode","System"].map((l,i)=>{const val=`opt${i+1}`;return<Radio key={l} name="sc-display" value={val} label={l} checked={rv===val} onChange={()=>setRv(val)}/>;}) }
                </div>
              </div>
              <ShowcaseSelect label="Environment" options={["Development","Staging","Production"]} value={envVal} onChange={v => setEnvVal(v)} placeholder="Select environment"/>
            </div>
          </div>
        </div>

        {/* Row 2: Tags + Avatars | Card | Spinner + Tooltip | Textarea */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:40, paddingTop:32, borderTop:"1px solid var(--border-subtle)" }}>
          <div>
            <BandTag>Tag · removable chips</BandTag>
            <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:20 }}>
              {tags.map(t=>(
                <Tag key={t} tone="action" onRemove={()=>setTags(tt=>tt.filter(x=>x!==t))}>{t}</Tag>
              ))}
              {tags.length===0&&<Button hierarchy="tertiary" size="small" onClick={()=>setTags(["Design system","React","TypeScript","Tokens"])}>Restore</Button>}
            </div>
            <BandTag>Avatar · initials + image</BandTag>
            <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
              {[{name:"Ayo Paul",tone:"action"},{name:"Sandra Kim",tone:"purple"},{name:"James Chen",tone:"neutral"}].map(a=>(
                <ShowToken key={a.name} token={`name="${a.name}" tone="${a.tone}"`} enabled={showTokens}>
                  <Avatar name={a.name} tone={a.tone as any} size={36}/>
                </ShowToken>
              ))}
              <Avatar name="Ayo Paul" size={48}/>
              <Avatar name="AK" size={28} tone="purple"/>
            </div>
          </div>

          <div>
            <BandTag>Card · surface container</BandTag>
            <Card title="Q2 Summary" subtitle="April – June 2025"
              action={<Badge tone="success" dot>Live</Badge>}>
              <p style={{ fontFamily:"var(--font-normal)", fontSize:13, color:"var(--text-body)", margin:"0 0 12px", lineHeight:1.5 }}>
                Revenue up 12% vs Q1. Customer satisfaction at an all-time high of 4.8/5.
              </p>
              <div style={{ display:"flex", gap:8 }}>
                <Button hierarchy="primary" size="small">View report</Button>
                <Button hierarchy="tertiary" size="small">Share</Button>
              </div>
            </Card>
          </div>

          <div>
            <BandTag>Spinner · loading states</BandTag>
            <div style={{ display:"flex", gap:16, alignItems:"center", marginBottom:20 }}>
              {([16,24,36] as const).map(s=><Spinner key={s} size={s}/>)}
            </div>
            <div style={{ display:"flex", gap:8, marginBottom:24 }}>
              <Button hierarchy="primary" size="small"><Spinner size={14}/>&nbsp;Loading…</Button>
              <Button hierarchy="secondary" size="small" disabled><Spinner size={14}/>&nbsp;Saving</Button>
            </div>
            <BandTag>Tooltip</BandTag>
            <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
              {(["top","bottom","right"] as const).map(s=>(
                <Tooltip key={s} label={`Placed ${s}`} side={s}>
                  <Button hierarchy="tertiary" size="small">{s}</Button>
                </Tooltip>
              ))}
            </div>
          </div>

          <div>
            <BandTag>Textarea + full form</BandTag>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <Input label="Subject" placeholder="Bug report…" required/>
              <Textarea label="Description" rows={3} placeholder="Describe the issue in detail…"/>
              <ShowcaseSelect label="Priority" options={["Low","Medium","High","Critical"]} placeholder="Select priority"/>
              <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
                <Button hierarchy="tertiary" size="small">Cancel</Button>
                <Button hierarchy="primary" size="small" onClick={() => showToast("Ticket submitted. We will be in touch shortly")}>Submit</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  /* ─ Data viz ──────────────────────────────────────────── */
  const dataBand = (
    <section id="sc-data" style={{ background:"var(--surface-secondary,#f5f6f8)" }}>
      <div className="sc-band-content" style={bandPad()}>
        <BandTag>Data visualisation · animated on scroll · 6 chart types</BandTag>

        {/* Animated KPI counters */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:24 }}>
          {[
            { label:"Revenue",               to:2400000, prefix:"£",   suffix:"",   trend:"+12% vs last quarter", dir:"up" as const },
            { label:"Active Users",           to:48291,   prefix:"",    suffix:"",   trend:"+5.3% this week",      dir:"up" as const },
            { label:"Customer Satisfaction",  to:4.8,     prefix:"",    suffix:" / 5", trend:"+0.3pt this month", dir:"up" as const },
          ].map(k=>(
            <div key={k.label}>
              <StatCard label={k.label}
                value={<AnimatedCounter to={k.to} prefix={k.prefix} suffix={k.suffix}/>}
                trend={k.trend} trendDirection={k.dir}/>
            </div>
          ))}
        </div>

        {/* Chart grid */}
        <div className="rtu-charts">
          <div className="cc rtu-card">
            <div className="rtu-card-tag">◎ Radar</div>
            <div className="rtu-card-h">Radar Chart</div>
            <div className="rtu-card-sub">Total visitors by month</div>
            <RadarChart/>
            <div className="rtu-card-foot">Trending up 5.2% ↗</div>
          </div>
          <div className="cc rtu-card">
            <div className="rtu-card-tag">◷ Donut</div>
            <div className="rtu-card-h">Pie Chart · Interactive</div>
            <div className="rtu-card-sub">January – June 2026</div>
            <DonutChart/>
          </div>
          <div className="rtu-right-col">
            <div className="cc rtu-card">
              <div className="rtu-card-tag">▪ Bar · Animated</div>
              <div className="rtu-card-h">Bar Chart</div>
              <div className="rtu-card-sub">Sessions Jan–Aug · animates on scroll</div>
              <AnimatedBarChart data={[72,58,85,44,91,67,78,55]} labels={["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"]}/>
              <div className="rtu-card-foot">Peak May · 91 sessions ↑</div>
            </div>
            <div className="cc rtu-card">
              <div className="rtu-card-tag">— Trend</div>
              <div className="rtu-card-h">Trend Line</div>
              <div className="rtu-card-sub">Monthly sessions Aug 2023–May 2024</div>
              <div style={{ marginTop:8 }}><MiniLineChart/></div>
            </div>
          </div>
        </div>

        <InteractiveLineChart/>

        {/* New row: Animated bar (brand) + Gauge */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginTop:20 }}>
          <div className="cc rtu-card">
            <div className="rtu-card-tag">▪ Animated · Motion</div>
            <div className="rtu-card-h">Quarterly targets</div>
            <div className="rtu-card-sub">Q1–Q4 performance vs target</div>
            <AnimatedBarChart
              data={[88,76,92,71,95,83,89,78,94,68,97,85]}
              labels={["J","F","M","A","M","J","J","A","S","O","N","D"]}
              color="var(--colour-alternativepurple-500)"/>
          </div>
          <div className="cc rtu-card" style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
            <div className="rtu-card-tag" style={{ alignSelf:"flex-end" }}>◯ Gauge · Motion</div>
            <div className="rtu-card-h" style={{ alignSelf:"flex-start" }}>Customer satisfaction</div>
            <div className="rtu-card-sub" style={{ alignSelf:"flex-start", marginBottom:12 }}>Animates on first view</div>
            <GaugeChart value={96} label="NPS Score"/>
          </div>
          <div className="cc rtu-card">
            <div className="rtu-card-tag">≡ Stacked</div>
            <div className="rtu-card-h">Channel split</div>
            <div className="rtu-card-sub">Traffic sources this month</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginTop:12 }}>
              {[["Direct","var(--colour-primaryblue-500)",42],["Organic","var(--colour-secondarycyan-500)",31],["Referral","var(--colour-alternativepurple-500)",18],["Paid","var(--colour-alert-500)",9]].map(([label,color,pct])=>(
                <div key={label as string}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontSize:12, fontFamily:"var(--font-normal)", color:"var(--text-body)" }}>{label}</span>
                    <span style={{ fontSize:12, fontFamily:"var(--font-bold)", fontWeight:700, color:"var(--text-title)" }}>{pct}%</span>
                  </div>
                  <div style={{ height:6, borderRadius:3, background:"var(--border-subtle)" }}>
                    <motion.div initial={{ width:0 }} whileInView={{ width:`${pct}%` }} viewport={{ once:true, margin:"-40px" }}
                      transition={{ duration:0.7, ease:[0.16,1,0.3,1] }}
                      style={{ height:"100%", borderRadius:3, background:color as string }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  /* ─ Theming — tabbed brand dashboards ────────────────── */
  const activeBrand = CLIENT_THEMES.find(t=>t.id===brandTab)!;

  /* Shared brand header */
  const BrandHeader = ({ brand }: { brand: typeof CLIENT_THEMES[0] }) => (
    <div className="sc-brand-header" style={{ background:brand.brandColor }}>
      <div>
        <p style={{ fontFamily:"var(--font-bold)", fontWeight:700, fontSize:16, color:"#fff", margin:0 }}>{brand.name}</p>
        <p style={{ fontFamily:"var(--font-normal)", fontSize:12, color:"rgba(255,255,255,0.78)", margin:"2px 0 0" }}>{brand.sector}</p>
      </div>
      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
        <Badge tone="success" variant="solid">Live</Badge>
        <span style={{ fontFamily:"var(--font-mono)", fontSize:10, color:"rgba(255,255,255,0.9)",
          background:"rgba(255,255,255,0.18)", padding:"3px 8px", borderRadius:6 }}>v2.4.1</span>
      </div>
    </div>
  );

  /* Layout: pipeline (TechNip) — wide chart + activity side-by-side */
  const PipelineLayout = ({ brand }: { brand: typeof CLIENT_THEMES[0] }) => (
    <>
      <BrandHeader brand={brand}/>
      <div className="sc-brand-kpis">
        {brand.kpis.map((k,i)=>(
          <div key={i}><StatCard label={k.label}
            value={<AnimatedCounter key={`${brand.id}-${i}`} to={k.value} suffix={k.suffix}/>}
            trend={k.trend} trendDirection={k.dir}/></div>
        ))}
      </div>
      <div className="sc-brand-body">
        <div>
          <p style={{ fontFamily:"var(--font-normal)", fontSize:11, color:"#8a8f9b", margin:"0 0 6px" }}>12-month throughput (kbpd)</p>
          <div className="sc-brand-chart-wrap">
            <PipelineChart data={brand.chartData} color={brand.brandColor}
              labels={["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].slice(0,brand.chartData.length)}/>
          </div>
          <div style={{ display:"flex", gap:8, marginTop:16 }}>
            {brand.actions.map(a=><Button key={a} hierarchy="primary" style={{ flex:1 }}>{a}</Button>)}
            <Button hierarchy="tertiary">Filter</Button>
          </div>
        </div>
        <div>
          <p style={{ fontFamily:"var(--font-normal)", fontSize:11, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", color:"var(--text-caption)", margin:"0 0 10px" }}>Live pipelines</p>
          <div className="sc-brand-feed">
            {brand.activity.map(item=>(
              <div key={item.id} className="sc-brand-feed-item">
                <Badge tone={item.status as any} dot/>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontFamily:"var(--font-bold)", fontWeight:700, fontSize:13, color:"var(--text-title)", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.title}</p>
                  <p style={{ fontFamily:"var(--font-normal)", fontSize:11, color:"var(--text-caption)", margin:"2px 0 0" }}>{item.detail}</p>
                </div>
                <span style={{ fontFamily:"var(--font-mono)", fontSize:9, color:"var(--text-disabled)" }}>{item.id}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  /* Layout: insurance (Aviva) — KPI column + policy breakdown + claims table */
  const InsuranceLayout = ({ brand }: { brand: typeof CLIENT_THEMES[1] }) => {
    const maxPct = Math.max(...(brand.policyTypes||[]).map((p: any)=>p.pct));
    return (
      <>
        <BrandHeader brand={brand}/>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1.6fr", gap:0 }}>
          {/* Left: stacked KPIs */}
          <div style={{ borderRight:"1px solid var(--border-subtle)", padding:"20px 22px", display:"flex", flexDirection:"column", gap:16 }}>
            <p style={{ fontFamily:"var(--font-normal)", fontSize:11, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", color:"var(--text-caption)", margin:"0 0 4px" }}>Key metrics</p>
            {brand.kpis.map((k,i)=>(
              <div key={i} style={{ paddingBottom:14, borderBottom:i<brand.kpis.length-1?"1px solid var(--border-subtle)":"none" }}>
                <p style={{ fontFamily:"var(--font-normal)", fontSize:11, color:"var(--text-caption)", margin:"0 0 4px" }}>{k.label}</p>
                <p style={{ fontFamily:"var(--font-bold)", fontWeight:700, fontSize:22, color:"var(--text-title)", margin:"0 0 4px", letterSpacing:"-0.5px" }}>
                  <AnimatedCounter key={`${brand.id}-${i}`} to={k.value} suffix={k.suffix}/>
                </p>
                <Badge tone={k.dir==="up"?"success":"warning"}>{k.trend}</Badge>
              </div>
            ))}
            <div style={{ display:"flex", gap:8, marginTop:"auto" }}>
              {brand.actions.map(a=><Button key={a} hierarchy="primary" size="small" style={{ flex:1 }}>{a}</Button>)}
            </div>
          </div>
          {/* Right: policy breakdown + claims */}
          <div style={{ padding:"20px 22px" }}>
            <p style={{ fontFamily:"var(--font-normal)", fontSize:11, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", color:"var(--text-caption)", margin:"0 0 12px" }}>Policy breakdown</p>
            <div style={{ display:"flex", flexDirection:"column", gap:9, marginBottom:20 }}>
              {(brand.policyTypes||[]).map((p: any)=>(
                <div key={p.label}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontSize:12, fontFamily:"var(--font-normal)", color:"var(--text-body)" }}>{p.label}</span>
                    <span style={{ fontSize:12, fontFamily:"var(--font-bold)", fontWeight:700, color:"var(--text-title)" }}>{p.count.toLocaleString()}</span>
                  </div>
                  <div style={{ height:6, borderRadius:3, background:"var(--border-subtle)" }}>
                    <motion.div initial={{ width:0 }} whileInView={{ width:`${(p.pct/maxPct)*100}%` }} viewport={{ once:true, margin:"-20px" }}
                      transition={{ duration:0.6, ease:[0.16,1,0.3,1] }}
                      style={{ height:"100%", borderRadius:3, background:"var(--colour-primaryblue-500)" }}/>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontFamily:"var(--font-normal)", fontSize:11, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", color:"var(--text-caption)", margin:"0 0 10px" }}>Recent claims</p>
            <div className="sc-brand-feed">
              {brand.activity.map(item=>(
                <div key={item.id} className="sc-brand-feed-item">
                  <Badge tone={item.status as any} dot/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontFamily:"var(--font-bold)", fontWeight:700, fontSize:13, color:"var(--text-title)", margin:0 }}>{item.title}</p>
                    <p style={{ fontFamily:"var(--font-normal)", fontSize:11, color:"var(--text-caption)", margin:"2px 0 0" }}>{item.detail}</p>
                  </div>
                  <span style={{ fontFamily:"var(--font-mono)", fontSize:9, color:"var(--text-disabled)" }}>{item.id}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  /* Layout: network (Vodafone) — two gauges + incident board */
  const NetworkLayout = ({ brand }: { brand: typeof CLIENT_THEMES[2] }) => (
    <>
      <BrandHeader brand={brand}/>
      {/* Gauge row */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1.4fr", gap:0, borderBottom:"1px solid var(--border-subtle)" }}>
        <div style={{ padding:"20px 24px", borderRight:"1px solid var(--border-subtle)", display:"flex", flexDirection:"column", alignItems:"center" }}>
          <p style={{ fontFamily:"var(--font-normal)", fontSize:11, color:"var(--text-caption)", margin:"0 0 4px", alignSelf:"flex-start" }}>Network uptime</p>
          <GaugeChart value={99} label="Uptime %"/>
        </div>
        <div style={{ padding:"20px 24px", borderRight:"1px solid var(--border-subtle)", display:"flex", flexDirection:"column", alignItems:"center" }}>
          <p style={{ fontFamily:"var(--font-normal)", fontSize:11, color:"var(--text-caption)", margin:"0 0 4px", alignSelf:"flex-start" }}>Population coverage</p>
          <GaugeChart value={98} label="Coverage %"/>
        </div>
        {/* Right: KPI summary + trend */}
        <div style={{ padding:"20px 22px" }}>
          <p style={{ fontFamily:"var(--font-normal)", fontSize:11, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", color:"var(--text-caption)", margin:"0 0 10px" }}>Monthly capacity</p>
          <AnimatedBarChart data={brand.chartData} labels={brand.chartLabels}/>
          <div style={{ display:"flex", gap:8, marginTop:14 }}>
            {brand.actions.map(a=><Button key={a} hierarchy="primary" size="small" style={{ flex:1 }}>{a}</Button>)}
          </div>
        </div>
      </div>
      {/* Incident board */}
      <div style={{ padding:"16px 22px" }}>
        <p style={{ fontFamily:"var(--font-normal)", fontSize:11, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", color:"var(--text-caption)", margin:"0 0 10px" }}>Active incidents</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
          {brand.activity.map(item=>(
            <div key={item.id} style={{ padding:"12px 14px", borderRadius:10, border:"1px solid var(--border-subtle)", background:"var(--surface-secondary,#f5f6f8)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
                <Badge tone={item.status as any} dot/>
                <span style={{ fontFamily:"var(--font-mono)", fontSize:9, color:"var(--text-disabled)" }}>{item.id}</span>
              </div>
              <p style={{ fontFamily:"var(--font-bold)", fontWeight:700, fontSize:12, color:"var(--text-title)", margin:"0 0 2px" }}>{item.title}</p>
              <p style={{ fontFamily:"var(--font-normal)", fontSize:11, color:"var(--text-caption)", margin:0 }}>{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const themesBand = (
    <section id="sc-theming" style={{ background:"#000921" }}>
      <div className="sc-band-content" style={{ ...bandPad({ paddingTop:56, paddingBottom:56 }) }}>
        <div style={{ textAlign:"center", marginBottom:44 }}>
          <p style={{ fontFamily:"var(--font-normal)", fontSize:11, fontWeight:700, letterSpacing:"0.10em",
            textTransform:"uppercase", color:"rgba(255,255,255,0.28)", margin:"0 0 14px" }}>Multi-tenant Theming</p>
          <h2 style={{ fontFamily:"var(--font-bold)", fontSize:38, fontWeight:700, color:"#fff", letterSpacing:"-1px", margin:"0 0 14px" }}>
            One system.{" "}<span style={{ color:"#f68136" }}>Any brand.</span>
          </h2>
          <p style={{ fontFamily:"var(--font-normal)", fontSize:15, color:"rgba(255,255,255,0.40)", maxWidth:520, margin:"0 auto 32px", lineHeight:1.6 }}>
            The same components re-skinned per client by overriding one token ramp. Each client gets a bespoke dashboard layout. Zero forked code.
          </p>
        </div>

        {/* Brand tab selector */}
        <div style={{ display:"flex", gap:8, marginBottom:32, justifyContent:"center" }}>
          {CLIENT_THEMES.map(t=>(
            <button key={t.id} onClick={()=>setBrandTab(t.id)}
              onMouseEnter={e=>{if(brandTab!==t.id)(e.currentTarget as HTMLButtonElement).style.background="rgba(255,255,255,0.15)";}}
              onMouseLeave={e=>{if(brandTab!==t.id)(e.currentTarget as HTMLButtonElement).style.background="rgba(255,255,255,0.08)";}}
              style={{
                padding:"9px 20px", borderRadius:"var(--radius-pill)", border:"none", cursor:"pointer",
                fontFamily:"var(--font-normal)", fontSize:13, fontWeight:600,
                background: brandTab===t.id ? t.brandColor : "rgba(255,255,255,0.08)",
                color: brandTab===t.id ? "#fff" : "rgba(255,255,255,0.55)",
                transition:"background .18s, color .18s",
              }}>{t.name}</button>
          ))}
        </div>

        {/* Dashboard with brand glow behind it */}
        <div style={{ position:"relative" }}>
          {/* Ambient glow — just behind the card */}
          <div style={{
            position:"absolute", top:"30%", left:"50%", transform:"translate(-50%,-50%)",
            width:"60%", height:"50%", pointerEvents:"none", zIndex:0,
            background:`radial-gradient(ellipse, ${activeBrand.brandColor}55 0%, transparent 70%)`,
            filter:"blur(52px)",
          }}/>
          <motion.div key={brandTab} initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.38, ease:[0.16,1,0.3,1] }}
            style={{ position:"relative", zIndex:1,
              ...(activeBrand.vars as React.CSSProperties), ...LIGHT_RESETS,
              background:"#ffffff",
              borderRadius:16, overflow:"hidden",
              border:"1px solid rgba(255,255,255,0.12)", boxShadow:`0 30px 70px rgba(0,0,0,0.55), 0 0 0 1px ${activeBrand.brandColor}40` }}>
            {activeBrand.layout==="pipeline" && <PipelineLayout brand={activeBrand as any}/>}
            {activeBrand.layout==="insurance" && <InsuranceLayout brand={activeBrand as any}/>}
            {activeBrand.layout==="network"   && <NetworkLayout brand={activeBrand as any}/>}
          </motion.div>
        </div>
      </div>
    </section>
  );

  /* ─ Foundations — atomic design ──────────────────────── */
  const visibleAlerts = ([
    { id:"a1", tone:"info" as const,    title:"System update", body:"Maintenance Sunday 2–4 AM UTC." },
    { id:"a2", tone:"success" as const, title:"Deployed!",     body:"v2.4.1 is live on production." },
    { id:"a3", tone:"warning" as const, title:"Token drift",   body:"3 tokens diverged from Figma." },
    { id:"a4", tone:"error" as const,   title:"Build failed",  body:"TypeScript errors in Button.d.ts." },
  ]).filter(a=>!dismissed.includes(a.id));

  const systemBand = (
    <section id="sc-foundations" style={{ background:"var(--surface-raised,#fff)" }}>
      <div className="sc-band-content" style={bandPad()}>
        <BandTag>Foundations · atomic design system</BandTag>

        {/* ── ATOMS ── */}
        <div className="sc-atomic-tier">
          <div className="sc-atomic-label">Atoms — raw design decisions</div>
          <div className="sc-atomic-grid">
            {/* Color tokens */}
            <div className="sc-atom-box" style={{ minWidth:120 }}>
              <div style={{ display:"flex", gap:4 }}>
                {["50","200","400","500","600","700"].map(s=>(
                  <div key={s} style={{ width:14, height:14, borderRadius:3, background:`var(--colour-primaryblue-${s})` }}/>
                ))}
              </div>
              Colour scale
            </div>
            {/* Type tokens */}
            <div className="sc-atom-box" style={{ minWidth:130 }}>
              <div style={{ textAlign:"left", width:"100%" }}>
                <p style={{ fontFamily:"var(--font-bold)", fontSize:16, color:"var(--text-title)", margin:"0 0 2px", lineHeight:1.2 }}>Heading</p>
                <p style={{ fontFamily:"var(--font-normal)", fontSize:12, color:"var(--text-body)", margin:"0 0 2px" }}>Body copy</p>
                <p style={{ fontFamily:"var(--font-mono)", fontSize:10, color:"var(--text-caption)", margin:0 }}>mono</p>
              </div>
              Type scale
            </div>
            {/* Spacing */}
            <div className="sc-atom-box" style={{ minWidth:120 }}>
              <div style={{ display:"flex", flexDirection:"column", gap:3, width:"100%" }}>
                {[4,8,12,16,24].map(s=>(
                  <div key={s} style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <div style={{ width:s, height:6, background:"var(--colour-primaryblue-300)", borderRadius:2, flexShrink:0 }}/>
                    <span style={{ fontSize:8, color:"var(--text-caption)", fontFamily:"var(--font-mono)" }}>{s}px</span>
                  </div>
                ))}
              </div>
              Spacing
            </div>
            {/* Radius */}
            <div className="sc-atom-box">
              <div style={{ display:"flex", gap:5 }}>
                {[0,4,8,12,999].map(r=>(
                  <div key={r} style={{ width:20, height:20, background:"var(--colour-primaryblue-100)", border:"1px solid var(--colour-primaryblue-300)", borderRadius:r }}/>
                ))}
              </div>
              Border radius
            </div>
            {/* Individual atoms */}
            <div className="sc-atom-box"><Button hierarchy="primary" size="small">Button</Button></div>
            <div className="sc-atom-box"><Switch checked={true} onChange={()=>{}} label=""/></div>
            <div className="sc-atom-box"><Badge tone="success" dot>Live</Badge></div>
            <div className="sc-atom-box"><Spinner size={22}/></div>
          </div>
        </div>

        {/* ── MOLECULES ── */}
        <div className="sc-atomic-tier">
          <div className="sc-atomic-label">Molecules — atoms combined into functional units</div>
          <div className="sc-atomic-grid">
            <div className="sc-molecule-box">
              <p style={labelCap}>Form field</p>
              <Input label="Email address" placeholder="you@company.com" helper="We'll never share your email" required/>
            </div>
            <div className="sc-molecule-box">
              <p style={labelCap}>Labelled toggle</p>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                <Switch checked={sw} onChange={setSw} label="Enable notifications"/>
                <Switch checked={false} onChange={()=>{}} label="Auto-publish" disabled/>
              </div>
            </div>
            <div className="sc-molecule-box">
              <p style={labelCap}>Avatar + identity</p>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {[{name:"Ayo Paul",role:"Admin"},{name:"Sandra Kim",role:"Editor"}].map(u=>(
                  <div key={u.name} style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <Avatar name={u.name} size={32}/>
                    <div>
                      <p style={{ fontFamily:"var(--font-bold)", fontSize:13, fontWeight:700, color:"var(--text-title)", margin:0 }}>{u.name}</p>
                      <p style={{ fontFamily:"var(--font-normal)", fontSize:11, color:"var(--text-caption)", margin:0 }}>{u.role}</p>
                    </div>
                    <div style={{ marginLeft:"auto" }}><Badge tone={u.role==="Admin"?"action":"neutral"}>{u.role}</Badge></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="sc-molecule-box">
              <p style={labelCap}>Button states</p>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                <Button hierarchy="primary">Submit form</Button>
                <Button hierarchy="primary" style={{ opacity:0.7 }}><Spinner size={14}/>&nbsp;Saving…</Button>
                <Button hierarchy="danger">Delete record</Button>
              </div>
            </div>
          </div>
        </div>

        {/* ── ORGANISMS ── */}
        <div className="sc-atomic-tier">
          <div className="sc-atomic-label">Organisms — complete, reusable UI patterns</div>
          <div className="sc-atomic-grid" style={{ alignItems:"stretch" }}>
            <div className="sc-organism-box">
              <p style={labelCap}>Alert system · 4 tones · dismissible</p>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {visibleAlerts.map(a=>(
                  <Alert key={a.id} tone={a.tone} title={a.title} onClose={()=>setDismissed(d=>[...d,a.id])}>{a.body}</Alert>
                ))}
                {visibleAlerts.length===0&&(
                  <div style={{ textAlign:"center", padding:"12px 0" }}>
                    <p style={{ fontFamily:"var(--font-normal)", fontSize:13, color:"var(--text-caption)", margin:"0 0 8px" }}>All dismissed.</p>
                    <Button hierarchy="tertiary" size="small" onClick={()=>setDismissed([])}>Restore all</Button>
                  </div>
                )}
              </div>
            </div>
            <div className="sc-organism-box">
              <p style={labelCap}>Full form pattern</p>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                <Input label="Full name" required placeholder="Jane Smith" helper="As shown on your passport"/>
                <ShowcaseSelect label="Country" options={["United Kingdom","Ireland","France","Germany"]} placeholder="Select country"/>
                <Textarea label="Notes" rows={3} placeholder="Any additional context…"/>
                <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
                  <Button hierarchy="tertiary">Cancel</Button>
                  <Button hierarchy="primary" onClick={() => showToast("Form submitted successfully")}>Submit</Button>
                </div>
              </div>
            </div>
            <div className="sc-organism-box">
              <p style={labelCap}>Data card pattern</p>
              <Card title="Pipeline Alpha" subtitle="North Sea · Active"
                action={<Badge tone="success" dot>Online</Badge>}>
                <div style={{ marginBottom:12 }}>
                  <StatCard label="Throughput" value="812 kbpd" trend="+4.1% vs target" trendDirection="up"/>
                </div>
                <BrandSpark data={[30,34,31,38,36,42,40,46,44,49]} height={36}/>
                <div style={{ display:"flex", gap:8, marginTop:12 }}>
                  <Button hierarchy="primary" size="small" style={{ flex:1 }}>Export</Button>
                  <Button hierarchy="tertiary" size="small">Details</Button>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Colour token grid */}
        <div style={{ paddingTop:36, borderTop:"1px solid var(--border-subtle)", marginTop:8 }}>
          <BandTag>Data-viz palette · 6 semantic tokens</BandTag>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:14 }}>
            {[
              { name:"--viz-1", label:"Purple",   hex:"#602DEA", light:"#ede7fd" },
              { name:"--viz-2", label:"Blue",     hex:"#445CFF", light:"#e6eaff" },
              { name:"--viz-3", label:"Cyan",     hex:"#00D4D4", light:"#e0fafa" },
              { name:"--viz-4", label:"Navy",     hex:"#00208F", light:"#e0e5f5" },
              { name:"--viz-5", label:"Lavender", hex:"#9A8AF5", light:"#f0eefe" },
              { name:"--viz-6", label:"Steel",    hex:"#608FEC", light:"#e8eeff" },
            ].map((t,i)=>(
              <div key={t.name} style={{ borderRadius:14, overflow:"hidden", border:"1px solid rgba(20,22,24,0.07)", boxShadow:"0 2px 10px rgba(20,22,24,0.06)" }}>
                <div style={{ height:96, background:`linear-gradient(155deg, ${t.hex} 0%, ${t.light} 100%)`, position:"relative", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"10px 12px" }}>
                  <span style={{ fontFamily:"var(--font-bold)", fontWeight:700, fontSize:15, color:"#fff", textShadow:"0 1px 6px rgba(0,0,0,0.28)", letterSpacing:"-0.3px" }}>{t.label}</span>
                  <span style={{ position:"absolute", top:10, right:10, width:8, height:8, borderRadius:"50%", background:"rgba(255,255,255,0.55)", boxShadow:"0 0 0 2px rgba(255,255,255,0.25)" }}/>
                  {i===0&&<span style={{ position:"absolute", top:8, left:8, fontFamily:"var(--font-mono)", fontSize:7, fontWeight:700, letterSpacing:".08em", color:"rgba(255,255,255,0.70)", textTransform:"uppercase" }}>Primary</span>}
                </div>
                <div style={{ padding:"9px 12px", background:"var(--surface-raised,#fff)" }}>
                  <p style={{ fontFamily:"var(--font-mono)", fontSize:9, fontWeight:600, color:"var(--text-body,#3c4044)", margin:"0 0 2px", letterSpacing:".02em" }}>{t.name}</p>
                  <p style={{ fontFamily:"var(--font-mono)", fontSize:8, color:"var(--text-caption,#777880)", margin:0, letterSpacing:".04em" }}>{t.hex}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  /* ─ Sidebar ───────────────────────────────────────────── */
  const Sidebar = (
    <aside className="sc-sidebar" style={{ width:sidebarW }}>
      <div className="sc-glass-blur"/>
      <div className="sc-glass-spec"/>
      <div className="sc-scroll">
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18 }}>
          {!collapsed&&<a href="/" className="sc-homebtn" style={{ flex:1 }}>{I_arrowL}<span>Back to home</span></a>}
          <button className="sc-iconbtn" onClick={()=>setCollapsed(c=>!c)}
            title={collapsed?"Expand":"Collapse"} aria-label={collapsed?"Expand sidebar":"Collapse sidebar"}>
            {collapsed?I_chevR:I_chevL}
          </button>
        </div>
        {collapsed?(
          <a href="/" className="sc-nav-item sc-rail-icon" title="Back to home" style={{ marginBottom:8 }}>{NAV[0].icon}</a>
        ):(
          <div style={{ marginBottom:20 }}>
            <img src="/assets/logo/sandhata-logo.svg" alt="Sandhata" style={{ height:26 }}/>
            <p style={{ fontSize:11, color:"rgba(20,22,24,0.36)", fontFamily:"var(--font-mono)", margin:"8px 0 0" }}>v1.0-stable</p>
          </div>
        )}
        {!collapsed&&<p className="sc-cap">Navigate</p>}
        <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
          {NAV.map(n=>(
            <button key={n.id} className={`sc-nav-item${navActive===n.id?" on":""}${collapsed?" sc-rail-icon":""}`}
              onClick={()=>go(n.id)} title={n.label}>
              {n.icon}{!collapsed&&<span>{n.label}</span>}
            </button>
          ))}
        </div>
        {!collapsed&&(<>
          <div className="sc-divider"/>
          <p className="sc-cap">Accent colour</p>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {ACCENTS.map((a,i)=>(
              <button key={a.hex} title={`${a.name} — ${a.token}`} onClick={()=>setAccentIdx(i)} style={{
                width:26, height:26, borderRadius:"50%", background:a.hex, border:"none", cursor:"pointer",
                outline:accentIdx===i?"2px solid rgba(20,22,24,0.60)":"2px solid transparent", outlineOffset:2, transition:"outline .15s",
              }}/>
            ))}
          </div>
          <p style={{ fontFamily:"var(--font-mono)", fontSize:9, color:"rgba(20,22,24,0.30)", margin:"8px 0 0", wordBreak:"break-all" }}>{accent.token}</p>
          <div style={{ height:18 }}/>
          <p className="sc-cap">Surface</p>
          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            {(["white","warm","dark"] as const).map(s=>(
              <button key={s} onClick={()=>setSurface(s)} style={{
                padding:"7px 11px", borderRadius:9, border:"none", cursor:"pointer",
                fontFamily:"var(--font-normal)", fontSize:13,
                background:surface===s?"rgba(20,22,24,0.08)":"transparent",
                color:surface===s?"rgba(20,22,24,0.95)":"rgba(20,22,24,0.50)",
                fontWeight:surface===s?600:400,
                textAlign:"left", transition:"background .15s,color .15s",
              }}>{SURFACES[s].label}</button>
            ))}
          </div>
          <div style={{ height:18 }}/>
          <p className="sc-cap">Radius</p>
          <div style={{ display:"flex", gap:4 }}>
            {RADII.map((r,i)=>(
              <button key={r.label} onClick={()=>setRadiusIdx(i)} style={{
                flex:1, padding:"6px 0", borderRadius:8, cursor:"pointer",
                fontFamily:"var(--font-normal)", fontSize:11, fontWeight:600,
                border:`1px solid ${radiusIdx===i?"rgba(20,22,24,0.40)":"rgba(20,22,24,0.12)"}`,
                background:radiusIdx===i?"rgba(20,22,24,0.08)":"transparent",
                color:radiusIdx===i?"rgba(20,22,24,0.95)":"rgba(20,22,24,0.40)", transition:"all .15s",
              }}>{r.label}</button>
            ))}
          </div>
          <div className="sc-divider"/>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
            <span style={{ fontSize:12, color:"rgba(20,22,24,0.60)", fontFamily:"var(--font-normal)" }}>Token Inspector</span>
            <button onClick={() => setShowTokens(t => !t)} style={{
              width:40, height:22, borderRadius:999, border:"none", cursor:"pointer", flexShrink:0, padding:0, position:"relative",
              background:showTokens?"var(--colour-primaryblue-500,#0036DD)":"rgba(20,22,24,0.20)",
              transition:"background .18s",
            }}>
              <span style={{
                position:"absolute", top:2, left:showTokens?20:2, width:18, height:18,
                borderRadius:"50%", background:"#fff",
                boxShadow:"0 1px 4px rgba(0,0,0,0.22)", transition:"left .18s",
              }}/>
            </button>
          </div>
          {showTokens&&<p style={{ fontFamily:"var(--font-mono)", fontSize:9, color:"rgba(20,22,24,0.38)", margin:"4px 0 0", lineHeight:1.4 }}>Hover any component to see its token</p>}
          <div style={{ height:22 }}/>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            <button className="sc-cta">Get the code</button>
            <a href="/components" style={{ display:"block", padding:"9px 14px", borderRadius:11,
              border:"1px solid rgba(20,22,24,0.12)", color:"rgba(20,22,24,0.60)",
              fontSize:13, textDecoration:"none", textAlign:"center", fontFamily:"var(--font-normal)" }}>Open Docs</a>
          </div>
        </>)}
        {collapsed&&(<>
          <div className="sc-divider"/>
          <button className="sc-nav-item sc-rail-icon" title="Get the code">{I_code}</button>
        </>)}
      </div>
    </aside>
  );

  /* ─ Mobile bottom nav ─────────────────────────────────── */
  const mobileNav = (
    <nav className="sc-mobile-nav" aria-label="Showcase navigation">
      {NAV.map(n=>(
        <button key={n.id} className={`sc-mob-btn${navActive===n.id?" on":""}`}
          onClick={()=>go(n.id)} title={n.label} aria-label={n.label}>
          {n.icon}
        </button>
      ))}
    </nav>
  );

  /* ── Assembly ─────────────────────────────────────────── */
  return (
    <div className="sc-shell" style={{ fontFamily:"var(--font-normal)" }}>
      <svg style={{ position:"absolute", width:0, height:0, overflow:"hidden" }} aria-hidden="true">
        <defs>
          <filter id="lg-distort" x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.005 0.007" numOctaves="2" seed="42" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="7" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </defs>
      </svg>
      {Sidebar}
      {mobileNav}
      {toast && (
        <motion.div className="sc-toast" initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-16 }}
          transition={{ duration:0.28, ease:[0.16,1,0.3,1] }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          {toast}
        </motion.div>
      )}
      <main ref={mainRef} className="sc-main-wrap" style={{ marginLeft:0, height:"100vh", overflowY:"auto", background:surfCfg.bg, ...mainVars }}>
        {heroBand}
        <GradientRule/>
        {atomsBand}
        <GradientRule/>
        {dataBand}
        <GradientRule/>
        {themesBand}
        <GradientRule/>
        {systemBand}
      </main>
    </div>
  );
}

const labelCap: React.CSSProperties = {
  fontFamily:"var(--font-normal)", fontSize:10, fontWeight:700,
  color:"var(--text-caption)", letterSpacing:"0.06em", textTransform:"uppercase", margin:"0 0 8px",
};
