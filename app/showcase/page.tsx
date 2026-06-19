"use client";
import React from "react";
import "../globals.css";

const ACCENTS = [
  { name: "Sandhata", hex: "#0036DD" },
  { name: "Indigo",   hex: "#4F46E5" },
  { name: "Violet",   hex: "#7C3AED" },
  { name: "Teal",     hex: "#0D9488" },
  { name: "Amber",    hex: "#D97706" },
];
const RADII = [
  { label: "None", val: "0"  },
  { label: "SM",   val: "4"  },
  { label: "MD",   val: "8"  },
  { label: "LG",   val: "14" },
];

export default function ShowcasePage() {
  const [accent, setAccent] = React.useState("#0036DD");
  const [dark,   setDark  ] = React.useState(false);
  const [radius, setRadius] = React.useState("8");

  const preview: React.CSSProperties = {
    "--acc":     accent,
    "--r":       `${radius}px`,
    "--bg":      dark ? "#0d0d1a" : "#f1f2f7",
    "--card":    dark ? "#16162a" : "#ffffff",
    "--border":  dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
    "--text":    dark ? "#e8e8f4" : "#0a0a14",
    "--text2":   dark ? "#7878a0" : "#6b7280",
    "--sidebar": dark ? "#0a0a18" : "#f7f8fc",
    "--topnav":  dark ? "#12121f" : "#ffffff",
  } as React.CSSProperties;

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", fontFamily:"var(--font-normal)" }}>

      {/* ── Config panel ─────────────────────────────────────────── */}
      <aside style={{
        width:256, flexShrink:0, background:"#0c0c1e",
        display:"flex", flexDirection:"column", padding:"28px 20px",
        gap:36, overflowY:"auto", borderRight:"1px solid rgba(255,255,255,0.06)",
      }}>
        <img src="/assets/logo/sandhata-logo.svg" alt="Sandhata" style={{ height:30 }} />

        <section>
          <p style={{ color:"rgba(255,255,255,0.35)", fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:14 }}>Colour</p>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {ACCENTS.map(a => (
              <button key={a.hex} title={a.name} onClick={() => setAccent(a.hex)} style={{
                width:30, height:30, borderRadius:"50%", background:a.hex, border:"none", cursor:"pointer",
                outline: accent===a.hex ? "2.5px solid #fff" : "2.5px solid transparent",
                outlineOffset:2, transition:"outline .15s ease",
              }}/>
            ))}
          </div>
        </section>

        <section>
          <p style={{ color:"rgba(255,255,255,0.35)", fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:14 }}>Mode</p>
          <div style={{ display:"inline-flex", background:"rgba(255,255,255,0.07)", borderRadius:8, padding:3 }}>
            {["Light","Dark"].map(m => {
              const active = dark ? m==="Dark" : m==="Light";
              return (
                <button key={m} onClick={() => setDark(m==="Dark")} style={{
                  padding:"6px 18px", borderRadius:6, border:"none", cursor:"pointer", fontSize:13,
                  background: active ? "#fff" : "transparent",
                  color: active ? "#0a0a14" : "rgba(255,255,255,0.5)",
                  transition:"background .15s, color .15s", fontFamily:"var(--font-normal)",
                }}>{m}</button>
              );
            })}
          </div>
        </section>

        <section>
          <p style={{ color:"rgba(255,255,255,0.35)", fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:14 }}>Radius</p>
          <div style={{ display:"flex", gap:6 }}>
            {RADII.map(r => (
              <button key={r.val} onClick={() => setRadius(r.val)} style={{
                flex:1, padding:"6px 0", borderRadius:6, cursor:"pointer", fontSize:12,
                border:`1px solid ${radius===r.val ? accent : "rgba(255,255,255,0.1)"}`,
                background: radius===r.val ? accent : "transparent",
                color: radius===r.val ? "#fff" : "rgba(255,255,255,0.45)",
                transition:"all .15s", fontFamily:"var(--font-normal)",
              }}>{r.label}</button>
            ))}
          </div>
        </section>

        <div style={{ flex:1 }}/>
        <div>
          <a href="/" style={{ fontSize:12, color:"rgba(255,255,255,0.2)", textDecoration:"none" }}>← Back to home</a>
        </div>
      </aside>

      {/* ── App preview ──────────────────────────────────────────── */}
      <div style={{ flex:1, overflow:"auto", ...preview }}>
        <AppShell accent={accent} dark={dark} />
      </div>
    </div>
  );
}

/* ─── App shell ──────────────────────────────────────────────────── */
function AppShell({ accent, dark }: { accent:string; dark:boolean }) {
  const [activeNav, setActiveNav] = React.useState("Dashboard");
  return (
    <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh", background:"var(--bg)" }}>

      {/* TopNav */}
      <header style={{
        height:56, display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 24px", background:"var(--topnav)",
        borderBottom:"1px solid var(--border)", flexShrink:0, position:"sticky", top:0, zIndex:10,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <img src="/assets/logo/sandhata-logo.svg" alt="Sandhata" style={{ height:24 }} />
          <span style={{ width:1, height:18, background:"var(--border)" }}/>
          <span style={{ color:"var(--text2)", fontSize:13 }}>Design System</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{
            display:"flex", alignItems:"center", gap:8, padding:"6px 12px",
            background:dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.04)",
            border:"1px solid var(--border)", borderRadius:"var(--r)",
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" style={{color:"var(--text2)"}}><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <span style={{ fontSize:13, color:"var(--text2)" }}>Search...</span>
          </div>
          <button style={{ width:34, height:34, borderRadius:"var(--r)", border:"1px solid var(--border)", background:"transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{color:"var(--text2)"}}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </button>
          <div style={{ width:32, height:32, borderRadius:"50%", background:accent, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:13, fontWeight:700 }}>A</div>
        </div>
      </header>

      {/* Body */}
      <div style={{ display:"flex", flex:1 }}>
        {/* Sidebar */}
        <aside style={{
          width:216, flexShrink:0, background:"var(--sidebar)",
          borderRight:"1px solid var(--border)", padding:"20px 10px",
          display:"flex", flexDirection:"column", gap:28,
        }}>
          {[
            { section:"MAIN",     items:["Dashboard","Analytics","Components","Documentation"] },
            { section:"SETTINGS", items:["Theme","Account"] },
          ].map(({ section, items }) => (
            <div key={section}>
              <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.08em", color:"var(--text2)", marginBottom:6, paddingLeft:10 }}>{section}</p>
              {items.map(item => (
                <button key={item} onClick={() => setActiveNav(item)} style={{
                  display:"flex", alignItems:"center", width:"100%", padding:"8px 10px",
                  borderRadius:"var(--r)", border:"none", cursor:"pointer",
                  background: activeNav===item ? accent : "transparent",
                  color: activeNav===item ? "#fff" : "var(--text2)",
                  fontSize:13, fontWeight: activeNav===item ? 600 : 400,
                  transition:"background .15s, color .15s", marginBottom:2,
                  textAlign:"left", fontFamily:"var(--font-normal)",
                }}>{item}</button>
              ))}
            </div>
          ))}
        </aside>

        {/* Main */}
        <main style={{ flex:1, padding:28, display:"flex", flexDirection:"column", gap:22, overflowX:"hidden" }}>
          {/* Page header */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div>
              <h1 style={{ fontSize:22, fontWeight:700, color:"var(--text)", margin:0 }}>Overview</h1>
              <p style={{ fontSize:13, color:"var(--text2)", margin:"4px 0 0" }}>Welcome back — here's what's happening.</p>
            </div>
            <button style={{
              padding:"8px 20px", borderRadius:"var(--r)", border:"none",
              background:accent, color:"#fff", fontSize:13, fontWeight:600,
              cursor:"pointer", fontFamily:"var(--font-normal)",
            }}>+ New Report</button>
          </div>

          <StatCards />
          <ChartsRow accent={accent} dark={dark} />
          <BottomRow accent={accent} dark={dark} />
        </main>
      </div>
    </div>
  );
}

/* ─── Stat cards ─────────────────────────────────────────────────── */
function StatCards() {
  const stats = [
    { label:"Total Visitors", value:"24,521", delta:"+12.3%", up:true  },
    { label:"Page Views",     value:"108,420", delta:"+8.1%", up:true  },
    { label:"Conversions",    value:"3,847",  delta:"+4.2%",  up:true  },
    { label:"Avg Session",    value:"4m 32s", delta:"-1.8%",  up:false },
  ];
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
      {stats.map(s => (
        <div key={s.label} style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:"var(--r)", padding:"18px 20px" }}>
          <p style={{ fontSize:12, color:"var(--text2)", margin:"0 0 6px" }}>{s.label}</p>
          <p style={{ fontSize:22, fontWeight:700, color:"var(--text)", margin:"0 0 6px" }}>{s.value}</p>
          <span style={{ fontSize:11, fontWeight:600, color: s.up?"#10b981":"#ef4444" }}>{s.delta} vs last month</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Charts row ─────────────────────────────────────────────────── */
function ChartsRow({ accent, dark }: { accent:string; dark:boolean }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1.6fr 1fr", gap:14 }}>
      <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:"var(--r)", padding:"20px 24px" }}>
        <p style={{ fontSize:14, fontWeight:600, color:"var(--text)", margin:"0 0 2px" }}>Visitor Trend</p>
        <p style={{ fontSize:12, color:"var(--text2)", margin:"0 0 16px" }}>Last 12 months</p>
        <ShowcaseLineChart accent={accent} dark={dark} />
      </div>
      <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:"var(--r)", padding:"20px 24px" }}>
        <p style={{ fontSize:14, fontWeight:600, color:"var(--text)", margin:"0 0 2px" }}>Traffic Sources</p>
        <p style={{ fontSize:12, color:"var(--text2)", margin:"0 0 14px" }}>This month</p>
        <ShowcaseDonut accent={accent} />
      </div>
    </div>
  );
}

/* ─── Line chart ─────────────────────────────────────────────────── */
function ShowcaseLineChart({ accent, dark }: { accent:string; dark:boolean }) {
  const data   = [42,58,51,74,68,85,72,79,65,88,94,82];
  const labels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const [hi, setHi] = React.useState<number|null>(null);
  const W = 500, H = 110, pad = 10;
  const maxV = Math.max(...data), minV = Math.min(...data);
  const pts = data.map((v,i) => [
    pad + (i/(data.length-1))*(W-pad*2),
    H-pad - ((v-minV)/(maxV-minV))*(H-pad*2),
  ]);
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i=0; i<pts.length-1; i++) {
    const cpx = pts[i][0]+(pts[i+1][0]-pts[i][0])*0.5;
    d += ` C ${cpx} ${pts[i][1]}, ${cpx} ${pts[i+1][1]}, ${pts[i+1][0]} ${pts[i+1][1]}`;
  }
  const area = `${d} L ${W-pad} ${H-pad} L ${pad} ${H-pad} Z`;
  const ref = React.useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    setHi(Math.max(0, Math.min(data.length-1, Math.round(((e.clientX-r.left)/r.width)*(data.length-1)))));
  };
  return (
    <div ref={ref} style={{ position:"relative" }} onMouseMove={onMove} onMouseLeave={() => setHi(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display:"block", width:"100%", height:H }}>
        <defs>
          <linearGradient id="scl" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.22"/>
            <stop offset="100%" stopColor={accent} stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d={area} fill="url(#scl)"/>
        <path d={d} fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        {hi !== null && <line x1={pts[hi][0]} y1={pad} x2={pts[hi][0]} y2={H-pad} stroke={dark?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.08)"} strokeWidth="1" strokeDasharray="3 3"/>}
      </svg>
      {hi !== null && (
        <>
          <div style={{ position:"absolute", left:`${(pts[hi][0]/W)*100}%`, top:`${(pts[hi][1]/H)*100}%`, transform:"translate(-50%,-50%)", width:10, height:10, borderRadius:"50%", background:"#fff", border:`2px solid ${accent}`, pointerEvents:"none" }}/>
          <div className="rtu-tip" style={{ left:`${(pts[hi][0]/W)*100}%`, top:`${(pts[hi][1]/H)*100}%` }}>
            {data[hi]}k<span>{labels[hi]}</span>
          </div>
        </>
      )}
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
        {labels.map((l,i) => <span key={l} style={{ fontSize:10, color:"var(--text2)" }}>{i%3===0?l:""}</span>)}
      </div>
    </div>
  );
}

/* ─── Donut chart ────────────────────────────────────────────────── */
function ShowcaseDonut({ accent }: { accent:string }) {
  const segs = [
    { label:"Direct",   pct:0.42, alpha:"ff" },
    { label:"Organic",  pct:0.31, alpha:"99" },
    { label:"Referral", pct:0.27, alpha:"44" },
  ];
  const cx=60,cy=60,R=44,sw=11;
  const GAP=(20/360)*Math.PI*2;
  const ARC=Math.PI*2-GAP*segs.length;
  let a=-Math.PI/2;
  const arcs = segs.map(s => {
    const arc=s.pct*ARC, sa=a, ea=a+arc;
    a=ea+GAP;
    return {
      d:`M ${(cx+R*Math.cos(sa)).toFixed(1)} ${(cy+R*Math.sin(sa)).toFixed(1)} A ${R} ${R} 0 ${arc>Math.PI?1:0} 1 ${(cx+R*Math.cos(ea)).toFixed(1)} ${(cy+R*Math.sin(ea)).toFixed(1)}`,
      color: accent+s.alpha, label:s.label, pct:s.pct,
    };
  });
  return (
    <div style={{ display:"flex", alignItems:"center", gap:20 }}>
      <svg viewBox="0 0 120 120" style={{ width:110, flexShrink:0 }}>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={sw}/>
        {arcs.map((a,i) => <path key={i} d={a.d} fill="none" stroke={a.color} strokeWidth={sw} strokeLinecap="round"/>)}
        <text x={cx} y={cy-5} textAnchor="middle" dominantBaseline="middle" fontSize="14" fontWeight="700" fill="var(--text)">{Math.round(segs[0].pct*100)}%</text>
        <text x={cx} y={cy+10} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="var(--text2)">Direct</text>
      </svg>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {arcs.map(a => (
          <div key={a.label} style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ width:8, height:8, borderRadius:"50%", background:a.color, flexShrink:0 }}/>
            <span style={{ fontSize:12, color:"var(--text2)", flex:1 }}>{a.label}</span>
            <span style={{ fontSize:12, fontWeight:600, color:"var(--text)" }}>{Math.round(a.pct*100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Bottom row: table + form ───────────────────────────────────── */
function BottomRow({ accent, dark }: { accent:string; dark:boolean }) {
  const rows = [
    { name:"Button",    cat:"Action",  status:"Stable",      date:"Jun 12" },
    { name:"Input",     cat:"Form",    status:"Stable",      date:"Jun 10" },
    { name:"Badge",     cat:"Display", status:"Stable",      date:"Jun 08" },
    { name:"DataTable", cat:"Data",    status:"Coming soon", date:"Jun 05" },
    { name:"Accordion", cat:"Layout",  status:"Coming soon", date:"Jun 01" },
  ];
  const dot = (s: string) => s==="Stable" ? "#10b981" : "#f59e0b";
  const inp: React.CSSProperties = {
    width:"100%", padding:"8px 12px", fontSize:13,
    borderRadius:"var(--r)", border:"1px solid var(--border)",
    background: dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.03)",
    color:"var(--text)", outline:"none", boxSizing:"border-box",
    fontFamily:"var(--font-normal)",
  };
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:14 }}>
      {/* Table */}
      <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:"var(--r)", overflow:"hidden" }}>
        <div style={{ padding:"16px 20px", borderBottom:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <p style={{ fontSize:14, fontWeight:600, color:"var(--text)", margin:0 }}>Component Registry</p>
          <div style={{ display:"flex", alignItems:"center", gap:6, padding:"5px 10px", background:dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.04)", border:"1px solid var(--border)", borderRadius:"var(--r)", cursor:"pointer" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" style={{color:"var(--text2)"}}><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <span style={{ fontSize:12, color:"var(--text2)" }}>Filter</span>
          </div>
        </div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr>
              {["Component","Category","Status","Updated"].map(h => (
                <th key={h} style={{ textAlign:"left", padding:"8px 20px", fontSize:11, fontWeight:600, color:"var(--text2)", letterSpacing:"0.04em", borderBottom:"1px solid var(--border)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i) => (
              <tr key={r.name} style={{ borderBottom: i<rows.length-1?"1px solid var(--border)":"none" }}>
                <td style={{ padding:"11px 20px", fontSize:13, fontWeight:500, color:"var(--text)" }}>{r.name}</td>
                <td style={{ padding:"11px 20px", fontSize:13, color:"var(--text2)" }}>{r.cat}</td>
                <td style={{ padding:"11px 20px" }}>
                  <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11, fontWeight:600, color:dot(r.status) }}>
                    <span style={{ width:6, height:6, borderRadius:"50%", background:dot(r.status) }}/>
                    {r.status}
                  </span>
                </td>
                <td style={{ padding:"11px 20px", fontSize:12, color:"var(--text2)" }}>{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form */}
      <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:"var(--r)", padding:"20px 24px" }}>
        <p style={{ fontSize:14, fontWeight:600, color:"var(--text)", margin:"0 0 2px" }}>New Component</p>
        <p style={{ fontSize:12, color:"var(--text2)", margin:"0 0 20px" }}>Add to the registry</p>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div>
            <label style={{ display:"block", fontSize:12, fontWeight:500, color:"var(--text)", marginBottom:6 }}>Name</label>
            <input placeholder="e.g. DatePicker" style={inp}/>
          </div>
          <div>
            <label style={{ display:"block", fontSize:12, fontWeight:500, color:"var(--text)", marginBottom:6 }}>Category</label>
            <select style={{...inp, color:"var(--text2)"}}>
              <option>Select category...</option>
              <option>Action</option><option>Form</option><option>Display</option><option>Data</option><option>Layout</option>
            </select>
          </div>
          <div>
            <label style={{ display:"block", fontSize:12, fontWeight:500, color:"var(--text)", marginBottom:6 }}>Description</label>
            <textarea placeholder="Brief description..." rows={3} style={{...inp, resize:"none"}}/>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button style={{ flex:1, padding:"9px", borderRadius:"var(--r)", border:"1px solid var(--border)", background:"transparent", color:"var(--text)", fontSize:13, cursor:"pointer", fontFamily:"var(--font-normal)" }}>Cancel</button>
            <button style={{ flex:1, padding:"9px", borderRadius:"var(--r)", border:"none", background:accent, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"var(--font-normal)" }}>Add Component</button>
          </div>
        </div>
      </div>
    </div>
  );
}
