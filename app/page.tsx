"use client";

import React from "react";
import {
  Button, Badge, Alert, Spinner, Avatar, Tag, StatCard, Switch, Checkbox,
} from "@/components";

/* ── Icons ────────────────────────────────────────────────────── */
const I = ({ d, size=16, sw=1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);
const SunIco   = () => <I size={15} d={<><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>}/>;
const Sparkle = () => (
  <svg className="hero-sparkle" width="0.62em" height="0.62em" viewBox="0 0 64 64" fill="currentColor" aria-hidden="true">
    {/* large four-point star */}
    <path d="M42 4c1.6 9.8 5.4 13.6 15.2 15.2C47.4 20.8 43.6 24.6 42 34.4 40.4 24.6 36.6 20.8 26.8 19.2 36.6 17.6 40.4 13.8 42 4z"/>
    {/* small four-point star */}
    <path d="M16 30c1 6.4 3.5 8.9 9.9 9.9-6.4 1-8.9 3.5-9.9 9.9-1-6.4-3.5-8.9-9.9-9.9 6.4-1 8.9-3.5 9.9-9.9z"/>
  </svg>
);
const SearchIco = () => <I size={15} d={<><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>}/>;
const ArrowR   = () => <I size={14} d={<><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>}/>;
const ChevD    = () => <I size={14} d={<polyline points="6 9 12 15 18 9"/>} sw={2}/>;
const GitH     = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);
const FigmaIco = () => <I size={15} sw={1.4} d={<><path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"/><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"/><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"/><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"/><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"/></>}/>;
const CodeIco  = () => <I size={15} sw={1.4} d={<><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></>}/>;
const LayersIco = () => <I size={18} d={<><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>}/>;
const BoxIco   = () => <I size={18} d={<><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>}/>;
const ZapIco   = () => <I size={18} d={<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>}/>;

/* ── Showcase charts (Ready-to-use section) ───────────────────── */
function RadarChart() {
  const cx = 90, cy = 92, R = 66;
  const ring = (f) => [0,1,2,3,4,5].map(i => {
    const a = -Math.PI/2 + i*Math.PI/3;
    return `${cx + R*f*Math.cos(a)},${cy + R*f*Math.sin(a)}`;
  }).join(" ");
  const data = [0.82,0.55,0.72,0.88,0.5,0.66];
  const dpts = data.map((v,i) => {
    const a = -Math.PI/2 + i*Math.PI/3;
    return `${cx + R*v*Math.cos(a)},${cy + R*v*Math.sin(a)}`;
  }).join(" ");
  const labels = ["January","February","March","April","May","June"];
  return (
    <svg viewBox="0 0 180 184" width="100%" style={{display:"block"}}>
      {[0.34,0.67,1].map((f,i) => (
        <polygon key={i} points={ring(f)} fill="none" stroke="rgba(10,10,20,0.10)" />
      ))}
      {ring(1).split(" ").map((p,i) => {
        const [x,y] = p.split(",");
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(10,10,20,0.07)" />;
      })}
      <polygon points={dpts} fill="rgba(0,54,221,0.16)" stroke="var(--colour-primaryblue-500)" strokeWidth="1.6" />
      {labels.map((l,i) => {
        const a = -Math.PI/2 + i*Math.PI/3;
        const lx = cx + (R+12)*Math.cos(a), ly = cy + (R+12)*Math.sin(a);
        return <text key={l} x={lx} y={ly} fontSize="8" fill="#8a8f9b" textAnchor="middle" dominantBaseline="middle">{l}</text>;
      })}
    </svg>
  );
}
function DonutChart() {
  const C = 2 * Math.PI * 58;
  return (
    <svg viewBox="0 0 160 160" width="100%" style={{display:"block"}}>
      <g transform="rotate(-90 80 80)">
        <circle cx="80" cy="80" r="58" fill="none" stroke="var(--colour-primaryblue-500)" strokeWidth="26" strokeDasharray={`${C*0.62} ${C}`} />
        <circle cx="80" cy="80" r="58" fill="none" stroke="#6f8ff0" strokeWidth="26" strokeDasharray={`${C*0.16} ${C}`} strokeDashoffset={`${-C*0.64}`} />
        <circle cx="80" cy="80" r="58" fill="none" stroke="#c7d4ff" strokeWidth="26" strokeDasharray={`${C*0.20} ${C}`} strokeDashoffset={`${-C*0.81}`} />
      </g>
      <text x="80" y="76" fontSize="26" fontWeight="700" fill="#0a0a14" textAnchor="middle" style={{fontFamily:"var(--font-bold)"}}>186</text>
      <text x="80" y="94" fontSize="10" fill="#8a8f9b" textAnchor="middle">Visitors</text>
    </svg>
  );
}
function LineChart() {
  // smooth pseudo-random waveform
  const W = 980, H = 200, n = 60;
  let seed = 7;
  const rnd = () => { seed = (seed*9301 + 49297) % 233280; return seed/233280; };
  const ys = Array.from({length:n}, () => 40 + rnd()*120);
  // simple smoothing
  const sm = ys.map((y,i) => (ys[i-1] ?? y)*0.25 + y*0.5 + (ys[i+1] ?? y)*0.25);
  const step = W/(n-1);
  const d = sm.map((y,i) => `${i===0?"M":"L"} ${(i*step).toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" preserveAspectRatio="none" style={{display:"block", height:200}}>
      <path d={d} fill="none" stroke="#8b8ff5" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Accordion panel content ──────────────────────────────────── */
function AnnBadge({ children }) {
  return (
    <span className="fp-lbl">{children}</span>
  );
}

function PanelComposable() {
  return (
    <div className="fp">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <span style={{ font:"700 12px/1 var(--font-bold)", color:"#0a0a14" }}>Delivery Information</span>
        <AnnBadge>Delivery Card</AnnBadge>
      </div>
      <div style={{ background:"#fff", border:"1px solid #eaebee", borderRadius:8, padding:"14px 14px 10px" }}>
        <div className="fp-field">
          <div className="fp-row"><div className="fp-field-label">Name</div><AnnBadge>Single-line Input</AnnBadge></div>
          <div className="fp-input">S Gungly</div>
        </div>
        <div className="fp-field">
          <div className="fp-row"><div className="fp-field-label">Address</div><AnnBadge>Multi-line Input</AnnBadge></div>
          <div className="fp-textarea">440 Division St, Kingston, ON K7K 4A9</div>
        </div>
        <div className="fp-field">
          <div className="fp-row"><div className="fp-field-label">Save as</div><AnnBadge>Radio</AnnBadge></div>
          <div className="fp-radios">
            {["Home","Work","School"].map((v,i) => (
              <div key={v} className="fp-radio">
                <div className={`fp-dot${i===0?" on":""}`}/>{v}
              </div>
            ))}
          </div>
        </div>
        <div className="fp-field">
          <div className="fp-row"><div className="fp-field-label">Delivery date</div><AnnBadge>Date Picker</AnnBadge></div>
          <div className="fp-input" style={{color:"#8a8f9b"}}>22 / 12 / 2026</div>
        </div>
        <div className="fp-row" style={{ alignItems:"center", marginTop:12 }}>
          <div style={{ display:"flex", gap:5 }}><AnnBadge>Secondary</AnnBadge><AnnBadge>Primary CTA</AnnBadge></div>
          <div className="fp-actions" style={{ marginTop:0 }}>
            <button className="fp-cancel">Cancel</button>
            <button className="fp-approve">Approve</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PanelTokens() {
  const rows = [
    { name:"Primary blue",  varName:"primaryblue",          steps:[50,100,200,300,400,500,600,700,800,900] },
    { name:"Purple",        varName:"alternativepurple",     steps:[50,100,200,300,400,500,600,700,800,900] },
    { name:"Neutral",       varName:"neutral",               steps:[50,100,200,300,400,500,600,700,800,900] },
    { name:"Rose pink",     varName:"alternativerosepink",   steps:[50,100,200,300,400,500,600,700,800,900] },
  ];
  return (
    <div className="tp">
      <div className="tp-title">Colour token palette</div>
      {rows.map(r => (
        <div key={r.name} className="palette-block" style={{marginBottom:12}}>
          <div className="palette-label">{r.name}</div>
          <div className="tp-swatches">
            {r.steps.map(s => <div key={s} className="tp-swatch" style={{background:`var(--colour-${r.varName}-${s})`}}/>)}
          </div>
        </div>
      ))}
      <div className="tp-code">
        <div><span className="tp-k">--colour-primaryblue-500</span>: <span className="tp-v">#0036DD</span>;</div>
        <div><span className="tp-k">--background-action</span>: <span className="tp-v">var(--colour-primaryblue-500)</span>;</div>
        <div><span className="tp-k">--text-link</span>: <span className="tp-v">var(--colour-primaryblue-500)</span>;</div>
      </div>
    </div>
  );
}

function PanelWCAG() {
  return (
    <div className="wp">
      <div className="wp-title">Accessibility at a glance</div>
      {[
        ["Text contrast",       "4.5:1 minimum on all body text"],
        ["Large text contrast", "3:1 minimum on heading text"],
        ["Focus indicator",     "3px focus ring on all interactive elements"],
        ["ARIA roles",          "Semantic role attributes on every component"],
      ].map(([l,s]) => (
        <div key={l} className="wc">
          <div className="wc-icon">✓</div>
          <div><div className="wc-lbl">{l}</div><div className="wc-sub">{s}</div></div>
        </div>
      ))}
      <div className="wc-ratio">
        <div><div className="wc-num">7.2:1</div><div className="wc-numl">Primary text ratio</div></div>
        <div style={{marginLeft:"auto",padding:"2px 8px",background:"#dbeafe",borderRadius:5,font:"700 11px/1 var(--font-bold)",color:"#1d4ed8"}}>AA Pass</div>
      </div>
    </div>
  );
}

function PanelDarkMode() {
  return (
    <div className="dmp">
      <div className="dmp-h" style={{background:"#fff"}}>
        <div className="dmp-bar">
          <span className="dmp-lbl lt">Light mode</span>
          <SunIco/>
        </div>
        <div className="dmp-card lt">
          <div className="dmp-line lt" style={{width:"60%"}}/>
          <div className="dmp-line lt" style={{width:"88%"}}/>
          <div className="dmp-line lt" style={{width:"72%"}}/>
          <button className="dmp-btn lt">Submit</button>
        </div>
        <div style={{marginTop:8,display:"flex",gap:5,flexWrap:"wrap"}}>
          <Badge tone="success" dot>Active</Badge>
          <Badge tone="warning">Pending</Badge>
          <Badge tone="info">Info</Badge>
        </div>
      </div>
      <div className="dmp-div"/>
      <div className="dmp-h dk">
        <div className="dmp-bar">
          <span className="dmp-lbl dk">Dark mode</span>
          <I size={14} sw={1.5} d={<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>}/>
        </div>
        <div className="dmp-card dk">
          <div className="dmp-line dk" style={{width:"60%"}}/>
          <div className="dmp-line dk" style={{width:"88%"}}/>
          <div className="dmp-line dk" style={{width:"72%"}}/>
          <button className="dmp-btn dk">Submit</button>
        </div>
        <div style={{marginTop:8,font:"11px/1.5 var(--font-normal)",color:"rgba(255,255,255,0.3)"}}>
          Add <code style={{fontFamily:"var(--font-mono)",fontSize:10,color:"rgba(255,255,255,0.5)"}}>data-theme="dark"</code> to any container.
        </div>
      </div>
    </div>
  );
}

function PanelFramework() {
  const [fw, setFw] = React.useState("React");
  const snippets = {
    React: (
      <div className="fwp-code">
        <div><span className="fk">import</span> {"{"} <span className="ff">Button</span> {"}"} <span className="fk">from</span> <span className="fs">'sandhata-ui'</span>;</div>
        <br/>
        <div><span className="fk">export function</span> <span className="ff">App</span>() {"{"}</div>
        <div style={{paddingLeft:16}}><span className="fk">return</span> (</div>
        <div style={{paddingLeft:32}}><span className="ft">{"<Button"}</span> <span className="ff">hierarchy</span>=<span className="fs">"primary"</span><span className="ft">{">"}</span>Submit<span className="ft">{"</Button>"}</span></div>
        <div style={{paddingLeft:16}}>);</div>
        <div>{"}"}</div>
      </div>
    ),
    Vue: (
      <div className="fwp-code">
        <div><span className="ft">{"<template>"}</span></div>
        <div style={{paddingLeft:16}}><span className="ft">{"<Button"}</span> <span className="ff">hierarchy</span>=<span className="fs">"primary"</span><span className="ft">{">"}</span>Submit<span className="ft">{"</Button>"}</span></div>
        <div><span className="ft">{"</template>"}</span></div>
        <br/>
        <div><span className="ft">{"<script"}</span> <span className="ff">setup</span><span className="ft">{">"}</span></div>
        <div style={{paddingLeft:16}}><span className="fk">import</span> {"{"} Button {"}"} <span className="fk">from</span> <span className="fs">'sandhata-ui/vue'</span></div>
        <div><span className="ft">{"</"}</span><span className="ft">{"script>"}</span></div>
      </div>
    ),
    HTML: (
      <div className="fwp-code">
        <div><span className="fc">{"<!-- Link tokens -->"}</span></div>
        <div><span className="ft">{"<link"}</span> <span className="ff">rel</span>=<span className="fs">"stylesheet"</span> <span className="ff">href</span>=<span className="fs">"styles.css"</span><span className="ft">{"/>"}</span></div>
        <br/>
        <div><span className="ft">{"<button"}</span> <span className="ff">class</span>=<span className="fs">"sd-btn sd-btn--primary"</span><span className="ft">{">"}</span></div>
        <div style={{paddingLeft:16}}>Submit</div>
        <div><span className="ft">{"</button>"}</span></div>
      </div>
    ),
  };
  return (
    <div className="fwp">
      <div style={{font:"700 13px/1 var(--font-bold)",color:"#0a0a14",marginBottom:12}}>Works with any framework</div>
      <div className="fwp-tabs">
        {["React","Vue","HTML"].map(f => (
          <button key={f} className={`fwp-tab${fw===f?" on":""}`} onClick={()=>setFw(f)}>{f}</button>
        ))}
      </div>
      {snippets[fw]}
      <div style={{font:"11px/1.5 var(--font-normal)",color:"#8a8f9b",marginTop:10}}>
        Token layer is plain CSS — pair it with any framework or no framework at all.
      </div>
    </div>
  );
}

function PanelFigmaSync() {
  return (
    <div className="figp">
      <div className="figp-title">One source of truth</div>
      <div className="figp-row">
        <div className="figp-ico fig"><FigmaIco/></div>
        <div>
          <div className="figp-lbl">Figma variable</div>
          <div className="figp-sub">--colour-primaryblue-500 = #0036DD</div>
        </div>
      </div>
      <div className="figp-arrow">↓</div>
      <div className="figp-row">
        <div className="figp-ico code"><CodeIco/></div>
        <div>
          <div className="figp-lbl">CSS custom property</div>
          <div className="figp-sub">var(--colour-primaryblue-500)</div>
        </div>
      </div>
      <div className="figp-ok">
        <div className="figp-dot"/>
        <span className="figp-txt">Token values materialised directly from Figma Variables</span>
      </div>
      <div style={{font:"11px/1.5 var(--font-normal)",color:"#8a8f9b",marginTop:10}}>
        Change a token in Figma and it flows to code automatically — no spreadsheets, no drift.
      </div>
    </div>
  );
}

const PANELS = [PanelComposable, PanelTokens, PanelWCAG, PanelDarkMode, PanelFramework, PanelFigmaSync];

const FEATURES = [
  { title:"Composable components",    body:"Simple primitives that snap together cleanly. Build complex interfaces without fighting the system." },
  { title:"Token-first architecture", body:"Colour, spacing, type and elevation live as CSS custom properties. Override one variable and re-skin the entire product." },
  { title:"WCAG 2.1 AA throughout",  body:"Contrast, focus rings, ARIA roles and keyboard navigation are built in — not bolted on after the fact." },
  { title:"Dark mode native",         body:"Add data-theme=\"dark\" to any container and every semantic token flips automatically. No extra stylesheets required." },
  { title:"Framework agnostic",       body:"The token layer is plain CSS. The bundle ships React 18 primitives, and the patterns work in Vue, Angular or vanilla HTML." },
  { title:"Figma-to-code sync",       body:"Token values are materialised directly from Figma Variables. Design and code share one source of truth." },
];

/* ── Avatar placeholders ──────────────────────────────────────── */
const INITIALS = ["AO","SK","MP","JL","RN","TE"];
const AV_COLOURS = ["#dbeafe","#fce7f3","#d1fae5","#fef3c7","#ede9fe","#fee2e2"];

/* ── Main app ─────────────────────────────────────────────────── */
export default function App() {
  const [open, setOpen] = React.useState(0);
  const ActivePanel = PANELS[open];

  // Smooth section entrance (progressive enhancement). The observer handles
  // below-fold elements on scroll; an initial pass reveals anything already
  // in view so content is never left hidden.
  React.useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const reveal = (el: HTMLElement) => el.classList.add("in");

    if (!("IntersectionObserver" in window)) {
      els.forEach(reveal);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { reveal(e.target as HTMLElement); io.unobserve(e.target); }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -10% 0px" }
    );
    els.forEach((el) => io.observe(el));

    // Safety net: reveal any in-viewport element the observer hasn't, after 2s.
    const fallback = window.setTimeout(() => {
      els.forEach((el) => {
        if (!el.classList.contains("in") && el.getBoundingClientRect().top < window.innerHeight) reveal(el);
      });
    }, 2000);

    return () => { clearTimeout(fallback); io.disconnect(); };
  }, []);

  return (
    <div>

      {/* NAV */}
      <header className="nav">
        <a className="nav-logo" href="index.html">
          <img src="/assets/logo/sandhata-logo.svg" alt="Sandhata"/>
        </a>
        <nav className="nav-links">
          <a className="nl" href="/components">Components</a>
          <a className="nl" href="/documentation">Documentation</a>
          <a className="nl" href="/builder">Builder</a>
          <a className="nl" href="/demo">Demo</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-aurora"/>
        <h1>
          The design system built for&nbsp;<em>clarity<Sparkle/></em>
        </h1>

        <p className="hero-sub">
          Everything your team needs to ship consistent, accessible interfaces
          components, tokens, and guidelines in one place.
        </p>

        <div className="hero-actions">
          <button className="btn-primary" onClick={()=>location.href="/demo"}>
            View Demo
          </button>
        </div>

        {/* BROWSER WINDOW — straddles the cut line at its halfmark */}
        <div className="browser-outer">
          <div className="browser-cut"/>
          <div className="browser">
            <div className="browser-bar">
              <div className="bdot" style={{background:"#ff5f57"}}/>
              <div className="bdot" style={{background:"#febc2e"}}/>
              <div className="bdot" style={{background:"#28c840"}}/>
            </div>
            <video className="browser-video" src="/assets/hero.mp4" autoPlay loop muted playsInline/>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats" data-reveal>
        <div className="stats-band">
          <hr className="stats-line"/>
          <div className="stats-inner">
            {[
              { num:"120", plus:true,  lbl:"Components" },
              { num:"1.2k", plus:true, lbl:"Design tokens" },
              { num:"AA",  plus:false, lbl:"Accessibility" },
            ].map((s,i) => (
              <div key={i} className="stat-cell">
                <span className="stat-val">{s.num}{s.plus && <em>+</em>}</span>
                <span className="stat-lbl">{s.lbl}</span>
              </div>
            ))}
          </div>
          <hr className="stats-line"/>
        </div>
      </section>

      {/* WHAT YOU CAN EXPECT */}
      <section className="expect">
        <div className="expect-card" data-reveal>
          <h2 className="expect-h">What you can<br/>expect</h2>
          <div className="expect-body">
            {/* Accordion */}
            <div>
              {FEATURES.map((f,i) => (
                <div key={i} className="acc-item">
                  <button className={`acc-btn${open===i?" open":""}`} onClick={()=>setOpen(i)}>
                    {f.title}
                    <span className="chev"><ChevD/></span>
                  </button>
                  {open===i && <div className="acc-body">{f.body}</div>}
                </div>
              ))}
            </div>
            {/* Dynamic right panel */}
            <div className="expect-panel">
              <ActivePanel/>
            </div>
          </div>
          <div className="expect-footer">
            <button className="btn-outline-blue" onClick={()=>location.href="/documentation"}>
              View documentation
            </button>
          </div>
        </div>
      </section>

      <div className="section-sep"/>

      {/* READY-TO-USE */}
      <section className="ready">
        <div className="ready-inner">
          <div className="ready-head">
            <span className="section-tag">Components</span>
            <h2 className="section-h">Ready-to-use</h2>
            <p className="section-sub">
              A growing library of styles, variables and 240+ components, all
              documented, tested, and ready to drop in.
            </p>
          </div>

          <div className="rtu">
            {/* row 1 — three chart cards */}
            <div className="rtu-charts" data-reveal>
              {[0,1,2].map(i => (
                i === 1 ? (
                  <div key={i} className="cc rtu-card">
                    <div className="rtu-card-tag">◷ Pie Chart</div>
                    <div className="rtu-card-h">Pie Chart - Interactive</div>
                    <div className="rtu-card-sub">January - June 2024</div>
                    <div style={{display:"flex",justifyContent:"flex-end",margin:"6px 0 4px"}}>
                      <span className="rtu-pill">January ▾</span>
                    </div>
                    <DonutChart/>
                  </div>
                ) : (
                  <div key={i} className="cc rtu-card">
                    <div className="rtu-card-tag">◎ Radar Chart</div>
                    <div className="rtu-card-h">Radar Chart</div>
                    <div className="rtu-card-sub">Showing total visitors for the last 6 months</div>
                    <RadarChart/>
                    <div className="rtu-card-foot">Trending up by 5.2% this month ↗</div>
                    <div className="rtu-card-sub" style={{textAlign:"center"}}>January - June 2024</div>
                  </div>
                )
              ))}
            </div>

            {/* row 2 — line chart card */}
            <div className="cc rtu-line" data-reveal>
              <div className="rtu-line-head">
                <div>
                  <div className="rtu-card-h">Line Chart - Interactive</div>
                  <div className="rtu-card-sub">Showing total visitors for the last 3 months</div>
                </div>
                <div className="rtu-line-stats">
                  <div className="rtu-stat on"><span>Desktop</span><strong>24,828</strong></div>
                  <div className="rtu-stat"><span>Mobile</span><strong>25,010</strong></div>
                </div>
              </div>
              <LineChart/>
              <div className="rtu-axis">
                {["Apr 5","Apr 10","Apr 15","Apr 20","Apr 25","Apr 30","May 5","May 10","May 15","May 20","May 25","May 30","Jun 4","Jun 9","Jun 14","Jun 19","Jun 24","Jun 30"].map(l =>
                  <span key={l}>{l}</span>)}
              </div>
            </div>

            {/* row 3 — data table modal card */}
            <div className="cc rtu-table" data-reveal>
              <div className="rtu-table-head">
                <div>
                  <div className="rtu-card-sub">Optional Label</div>
                  <div className="rtu-card-h" style={{fontSize:18}}>Progress Modal Title</div>
                  <div className="rtu-card-sub">Stepper component needs to be added here</div>
                </div>
                <button className="rtu-x" aria-label="Close">✕</button>
              </div>
              <div className="rtu-search">
                <input placeholder="Search" />
                <span className="rtu-filter">⚲</span>
              </div>
              <table className="rtu-tbl">
                <thead>
                  <tr><th style={{width:32}}><input type="checkbox" defaultChecked/></th><th>Name</th><th>Party</th><th>↑ Year</th></tr>
                </thead>
                <tbody>
                  {[
                    ["John Adams","None, Federalist","1789-1797"],
                    ["Thomas Jefferson","Democratic-Republican","1801-1809"],
                    ["James Madison","Democratic-Republican","1809-1817"],
                    ["James Monroe","Democratic-Republican","1817-1825"],
                    ["John Quincy Adams","Democratic-Republican","1825-1829"],
                    ["Andrew Jackson","Democrat","1829-1837"],
                    ["Martin van Buren","Democrat","1837-1841"],
                  ].map(([n,p,y]) => (
                    <tr key={n}><td><input type="checkbox"/></td><td>{n}</td><td>{p}</td><td>{y}</td></tr>
                  ))}
                </tbody>
              </table>
              <div className="rtu-table-foot">
                <button className="rtu-cancel">Cancel</button>
                <div style={{display:"flex",gap:10}}>
                  <button className="rtu-prev">Previous</button>
                  <button className="rtu-next">Next</button>
                </div>
              </div>
            </div>
          </div>

          {/* trusted by — real avatar photos */}
          <div className="trusted">
            <div className="trusted-avatars">
              {[1,2,3,4].map(i => (
                <img key={i} className="trusted-avatar" src={`/assets/avatars/a${i}.png`} alt="" width={30} height={30}/>
              ))}
              <span className="trusted-avatar trusted-more">+99</span>
            </div>
            <div className="trusted-divider"/>
            <p className="trusted-text">Trusted by <strong>300+</strong> Designer and Developers</p>
          </div>
        </div>
      </section>

      {/* START BUILDING TODAY */}
      <section className="build" data-reveal>
        <div className="build-inner">
          <h2 className="build-h">
            Start
            <span className="word-pill">
              <span className="word-track">
                <span>building</span>
                <span>designing</span>
                <span>shipping</span>
                <span>building</span>
              </span>
            </span>
            today
          </h2>
          <div className="build-steps">
            {[
              {
                n:"1", cls:"n1", title:"Design",
                body:"Enable the Sandhata UI library in Figma. Drag and drop pre-built components into your designs and configure them using variants.",
              },
              {
                n:"2", cls:"n2", title:"Build",
                body:"Install the npm package in your repository. Import the exact same components you used in Figma straight into your codebase.",
              },
              {
                n:"3", cls:"n3", title:"Ship",
                body:"Deploy your application with confidence.",
              },
            ].map(step => (
              <div key={step.n} className="bstep">
                <div className={`bstep-num ${step.cls}`}>{step.n}</div>
                <div>
                  <div className="bstep-h">{step.title}</div>
                  <p className="bstep-p">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="build-actions">
            <button className="build-btn-ghost" onClick={()=>location.href="/documentation"}>
              Read documentation
            </button>
            <button className="build-btn-primary" onClick={()=>location.href="/components"}>
              Browse components
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <img src="/assets/logo/sandhata-logo.svg" alt="Sandhata" style={{height:24,filter:"brightness(0) invert(1)",opacity:.85}}/>
              <p>Built to ensure clarity and consistency across every interaction.</p>
              <div className="footer-socials">
                <div className="footer-social">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </div>
                <div className="footer-social">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </div>
                <div className="footer-social">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.629 5.905-5.629zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </div>
              </div>
            </div>
            {[
              { h:"Product", links:[["Features","#"],["Pricing","#"],["Demo","/demo"]] },
              { h:"Support", links:[["Documentation","/documentation"],["Contact Us","#"]] },
              { h:"Legal",   links:[["Privacy Policy","#"],["Terms & Condition","#"]] },
            ].map(col => (
              <div key={col.h} className="footer-col">
                <h5>{col.h}</h5>
                {col.links.map(([l,href]) => <a key={l} href={href}>{l}</a>)}
              </div>
            ))}
          </div>
          <div className="footer-bottom" style={{justifyContent:"center"}}>
            <span className="footer-copy">© 2025 voi. All rights reserved by sandhata.design.system</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

