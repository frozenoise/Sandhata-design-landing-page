"use client";
import React from "react";
import "../globals.css";

/* ── Theme config ───────────────────────────────────────────────── */
const ACCENTS = [
  { name:"Sandhata", hex:"#0036DD" },
  { name:"Indigo",   hex:"#4F46E5" },
  { name:"Violet",   hex:"#7C3AED" },
  { name:"Teal",     hex:"#0D9488" },
  { name:"Amber",    hex:"#D97706" },
];
const RADII = [{ l:"None",v:"0" },{ l:"SM",v:"4" },{ l:"MD",v:"8" },{ l:"LG",v:"14" }];

export default function ShowcasePage() {
  const [accent, setAccent] = React.useState("#0036DD");
  const [dark,   setDark  ] = React.useState(false);
  const [radius, setRadius] = React.useState("8");

  const vars: React.CSSProperties = {
    "--acc":    accent,
    "--r":      `${radius}px`,
    "--bg":     dark ? "#0d0d1a" : "#f0f1f5",
    "--card":   dark ? "#16162a" : "#ffffff",
    "--border": dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
    "--text":   dark ? "#e8e8f4" : "#0a0a14",
    "--text2":  dark ? "#7878a0" : "#6b7280",
    "--muted":  dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
  } as React.CSSProperties;

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", fontFamily:"var(--font-normal)" }}>

      {/* ── Config panel ─────────────────────────────────────── */}
      <aside style={{
        width:240, flexShrink:0, background:"#0c0c1e",
        display:"flex", flexDirection:"column", padding:"24px 16px",
        gap:28, overflowY:"auto",
      }}>
        <img src="/assets/logo/sandhata-logo.svg" alt="Sandhata" style={{ height:28 }}/>

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 10px", background:"rgba(255,255,255,0.05)", borderRadius:"var(--r, 8px)" }}>
          <span style={{ fontSize:13, color:"rgba(255,255,255,0.7)", fontWeight:500 }}>Menu</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </div>

        {[
          { label:"Style", value:"Sandhata" },
          { label:"Font",  value:"IBM Plex Sans" },
          { label:"Icons", value:"Lucide" },
        ].map(r => (
          <div key={r.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0 2px" }}>
            <span style={{ fontSize:11, color:"rgba(255,255,255,0.35)", textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:700 }}>{r.label}</span>
            <span style={{ fontSize:13, color:"rgba(255,255,255,0.65)" }}>{r.value}</span>
          </div>
        ))}

        <div>
          <p style={{ fontSize:11, color:"rgba(255,255,255,0.35)", textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:700, marginBottom:12 }}>Colour</p>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {ACCENTS.map(a => (
              <button key={a.hex} title={a.name} onClick={() => setAccent(a.hex)} style={{
                width:26, height:26, borderRadius:"50%", background:a.hex, border:"none", cursor:"pointer",
                outline: accent===a.hex ? "2px solid #fff" : "2px solid transparent",
                outlineOffset:2, transition:"outline .15s",
              }}/>
            ))}
          </div>
        </div>

        <div>
          <p style={{ fontSize:11, color:"rgba(255,255,255,0.35)", textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:700, marginBottom:12 }}>Mode</p>
          <div style={{ display:"inline-flex", background:"rgba(255,255,255,0.07)", borderRadius:8, padding:3 }}>
            {["Light","Dark"].map(m => {
              const on = dark ? m==="Dark" : m==="Light";
              return <button key={m} onClick={() => setDark(m==="Dark")} style={{ padding:"5px 16px", borderRadius:6, border:"none", cursor:"pointer", fontSize:13, fontFamily:"var(--font-normal)", background:on?"#fff":"transparent", color:on?"#0a0a14":"rgba(255,255,255,0.5)", transition:"background .15s,color .15s" }}>{m}</button>;
            })}
          </div>
        </div>

        <div>
          <p style={{ fontSize:11, color:"rgba(255,255,255,0.35)", textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:700, marginBottom:12 }}>Radius</p>
          <div style={{ display:"flex", gap:5 }}>
            {RADII.map(r => (
              <button key={r.v} onClick={() => setRadius(r.v)} style={{ flex:1, padding:"5px 0", borderRadius:6, cursor:"pointer", fontSize:12, fontFamily:"var(--font-normal)", border:`1px solid ${radius===r.v?accent:"rgba(255,255,255,0.1)"}`, background:radius===r.v?accent:"transparent", color:radius===r.v?"#fff":"rgba(255,255,255,0.45)", transition:"all .15s" }}>{r.l}</button>
            ))}
          </div>
        </div>

        <div style={{ flex:1 }}/>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          <button style={{ padding:"8px", borderRadius:6, border:"1px solid rgba(255,255,255,0.12)", background:"transparent", color:"rgba(255,255,255,0.6)", fontSize:13, cursor:"pointer", fontFamily:"var(--font-normal)" }}>Shuffle</button>
          <button style={{ padding:"8px", borderRadius:6, border:"none", background:accent, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"var(--font-normal)" }}>Get Code</button>
        </div>
        <a href="/" style={{ fontSize:11, color:"rgba(255,255,255,0.2)", textDecoration:"none" }}>← Back to home</a>
      </aside>

      {/* ── Card grid ────────────────────────────────────────── */}
      <div style={{ flex:1, overflowY:"auto", background:"var(--bg)", ...vars, padding:"20px" }}>
        <div style={{ columns:5, columnGap:14 }}>
          <UsageHistory accent={accent}/>
          <CreateRelease accent={accent}/>
          <QRCard/>

          <PublishSettings accent={accent} dark={dark}/>
          <AvailableCredits accent={accent}/>
          <Preferences dark={dark}/>

          <DesignGoals accent={accent}/>
          <RecentActivity/>
          <NavTabs accent={accent}/>

          <DeployCard accent={accent} dark={dark}/>
          <MiniStats accent={accent}/>
          <TransferCard accent={accent} dark={dark}/>

          <AccountAccess accent={accent} dark={dark}/>
          <ComponentShowcase accent={accent}/>
          <PlatformShare accent={accent}/>
          <InviteTeam accent={accent} dark={dark}/>
          <Typography accent={accent}/>
          <ReportBug accent={accent} dark={dark}/>
        </div>
      </div>
    </div>
  );
}

/* ── Card shell ─────────────────────────────────────────────────── */
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ breakInside:"avoid", marginBottom:14, background:"var(--card)", border:"1px solid var(--border)", borderRadius:"var(--r)", overflow:"hidden", ...style }}>
      {children}
    </div>
  );
}
function CardBody({ children, style }: { children:React.ReactNode; style?:React.CSSProperties }) {
  return <div style={{ padding:"18px 20px", ...style }}>{children}</div>;
}
function CardTitle({ children }: { children:React.ReactNode }) {
  return <p style={{ fontSize:14, fontWeight:600, color:"var(--text)", margin:"0 0 3px" }}>{children}</p>;
}
function CardSub({ children }: { children:React.ReactNode }) {
  return <p style={{ fontSize:12, color:"var(--text2)", margin:"0 0 14px" }}>{children}</p>;
}
function Inp({ placeholder, type="text", value, style }: { placeholder:string; type?:string; value?:string; style?:React.CSSProperties }) {
  return <input type={type} placeholder={placeholder} defaultValue={value} style={{ width:"100%", padding:"8px 11px", fontSize:13, borderRadius:"var(--r)", border:"1px solid var(--border)", background:"var(--muted)", color:"var(--text)", outline:"none", boxSizing:"border-box", fontFamily:"var(--font-normal)", ...style }}/>;
}
function Btn({ children, accent, secondary, style }: { children:React.ReactNode; accent?:string; secondary?:boolean; style?:React.CSSProperties }) {
  return (
    <button style={{ padding:"8px 16px", borderRadius:"var(--r)", border: secondary?"1px solid var(--border)":"none", background: secondary?"transparent":accent||"var(--text)", color: secondary?"var(--text)":"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"var(--font-normal)", ...style }}>
      {children}
    </button>
  );
}

/* ── Cards ──────────────────────────────────────────────────────── */

function UsageHistory({ accent }: { accent:string }) {
  const data = [58,72,45,88,64,95];
  const labels = ["Dec","Jan","Feb","Mar","Apr","May"];
  const max = Math.max(...data);
  return (
    <Card>
      <CardBody>
        <CardTitle>Usage History</CardTitle>
        <CardSub>Last 6 months of activity</CardSub>
        <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:90, marginBottom:8 }}>
          {data.map((v,i) => (
            <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4, height:"100%" }}>
              <div style={{ flex:1, width:"100%", display:"flex", alignItems:"flex-end" }}>
                <div style={{ width:"100%", borderRadius:"var(--r) var(--r) 0 0", background: i===data.length-1?accent:"rgba(0,0,0,0.12)", height:`${(v/max)*100}%`, transition:"height .3s ease" }}/>
              </div>
              <span style={{ fontSize:9, color:"var(--text2)" }}>{labels[i]}</span>
            </div>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:14, paddingTop:14, borderTop:"1px solid var(--border)" }}>
          <div>
            <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.06em", color:"var(--text2)", textTransform:"uppercase", margin:"0 0 4px" }}>UPCOMING</p>
            <p style={{ fontSize:14, fontWeight:700, color:"var(--text)", margin:"0 0 2px" }}>May 25, 2024</p>
            <p style={{ fontSize:11, color:"var(--text2)", margin:0 }}>$1,000 scheduled</p>
          </div>
          <div>
            <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.06em", color:"var(--text2)", textTransform:"uppercase", margin:"0 0 4px" }}>AUTO-SAVE PLAN</p>
            <p style={{ fontSize:14, fontWeight:700, color:"var(--text)", margin:"0 0 2px" }}>Accelerated</p>
            <p style={{ fontSize:11, color:"var(--text2)", margin:0 }}>Recurring weekly</p>
          </div>
        </div>
        <Btn accent={accent} style={{ width:"100%", marginTop:14, textAlign:"center" }}>View Full Report</Btn>
      </CardBody>
    </Card>
  );
}

function CreateRelease({ accent }: { accent:string }) {
  return (
    <Card>
      <CardBody style={{ textAlign:"center", padding:"32px 20px" }}>
        <div style={{ width:36, height:36, borderRadius:"50%", border:"1.5px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px", color:"var(--text2)", fontSize:20 }}>+</div>
        <p style={{ fontSize:14, fontWeight:600, color:"var(--text)", margin:"0 0 6px" }}>Create Component</p>
        <p style={{ fontSize:12, color:"var(--text2)", margin:"0 0 16px" }}>Add your first component to start building your design system.</p>
        <Btn accent={accent} style={{ width:"100%" }}>Create Component</Btn>
      </CardBody>
    </Card>
  );
}

function QRCard() {
  return (
    <Card>
      <CardBody>
        <CardTitle>Scan to Connect</CardTitle>
        <CardSub>Open on your mobile device</CardSub>
        <div style={{ background:"#fff", borderRadius:"var(--r)", padding:12, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="80" height="80" viewBox="0 0 80 80">
            {/* Simple QR-like pattern */}
            {[0,1,2,3,4,5,6].map(r => [0,1,2,3,4,5,6].map(c => {
              const border = (r<3&&c<3)||(r<3&&c>3)||(r>3&&c<3);
              const inner = (r>=1&&r<=1&&c>=1&&c<=1)||(r>=1&&r<=1&&c>=5&&c<=5)||(r>=5&&r<=5&&c>=1&&c<=1);
              const fill = border || inner || (Math.sin(r*3+c*7)>0.3);
              return fill ? <rect key={`${r}${c}`} x={c*10+5} y={r*10+5} width={9} height={9} fill="#0a0a14" rx={1}/> : null;
            }))}
            <rect x={5} y={5} width={29} height={29} fill="none" stroke="#0a0a14" strokeWidth={3}/>
            <rect x={46} y={5} width={29} height={29} fill="none" stroke="#0a0a14" strokeWidth={3}/>
            <rect x={5} y={46} width={29} height={29} fill="none" stroke="#0a0a14" strokeWidth={3}/>
            <rect x={13} y={13} width={13} height={13} fill="#0a0a14"/>
            <rect x={54} y={13} width={13} height={13} fill="#0a0a14"/>
            <rect x={13} y={54} width={13} height={13} fill="#0a0a14"/>
          </svg>
        </div>
      </CardBody>
    </Card>
  );
}

function PublishSettings({ accent, dark }: { accent:string; dark:boolean }) {
  return (
    <Card>
      <CardBody style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <CardTitle>Publish Settings</CardTitle>
        <button style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text2)", fontSize:16, padding:0 }}>×</button>
      </CardBody>
      <div style={{ height:1, background:"var(--border)" }}/>
      <CardBody>
        <p style={{ fontSize:12, color:"var(--text2)", margin:"0 0 14px" }}>Configure how your components are published.</p>
        <div style={{ marginBottom:12 }}>
          <label style={{ fontSize:12, fontWeight:500, color:"var(--text)", display:"block", marginBottom:6 }}>Target Environment</label>
          <select style={{ width:"100%", padding:"8px 11px", fontSize:13, borderRadius:"var(--r)", border:"1px solid var(--border)", background:dark?"rgba(255,255,255,0.04)":"#fff", color:"var(--text)", fontFamily:"var(--font-normal)", outline:"none" }}>
            <option>Production</option><option>Staging</option><option>Development</option>
          </select>
        </div>
        <div style={{ marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            <span style={{ fontSize:12, fontWeight:500, color:"var(--text)" }}>Max Bundle Size</span>
            <span style={{ fontSize:13, fontWeight:700, color:"var(--text)" }}>250kb</span>
          </div>
          <div style={{ height:4, borderRadius:2, background:"var(--border)", overflow:"hidden" }}>
            <div style={{ width:"62%", height:"100%", background:accent, borderRadius:2 }}/>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
            <span style={{ fontSize:10, color:"var(--text2)" }}>50kb (MIN)</span>
            <span style={{ fontSize:10, color:"var(--text2)" }}>500kb (MAX)</span>
          </div>
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:12, fontWeight:500, color:"var(--text)", display:"block", marginBottom:6 }}>Notes</label>
          <textarea placeholder="Add any notes for this release..." rows={3} style={{ width:"100%", padding:"8px 11px", fontSize:13, borderRadius:"var(--r)", border:"1px solid var(--border)", background:"var(--muted)", color:"var(--text)", resize:"none", outline:"none", boxSizing:"border-box", fontFamily:"var(--font-normal)" }}/>
        </div>
        <Btn accent={accent} style={{ width:"100%", textAlign:"center" }}>Save Settings</Btn>
      </CardBody>
    </Card>
  );
}

function AvailableCredits({ accent }: { accent:string }) {
  return (
    <Card>
      <CardBody>
        <p style={{ fontSize:12, color:"var(--text2)", margin:"0 0 4px" }}>Available Credits</p>
        <p style={{ fontSize:32, fontWeight:700, color:"var(--text)", margin:"0 0 6px", letterSpacing:"-1px" }}>$0.00</p>
        <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11, fontWeight:600, color:"#f59e0b", marginBottom:16 }}>
          <span style={{ width:6, height:6, borderRadius:"50%", background:"#f59e0b" }}/> Pending Setup
        </span>
        {[
          { l:"Net Earnings",     v:"$0.00" },
          { l:"Processing Fee",   v:"-$0.00" },
          { l:"Ready to Claim",   v:"$0.00 USD" },
        ].map(r => (
          <div key={r.l} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid var(--border)" }}>
            <span style={{ fontSize:13, color:"var(--text2)" }}>{r.l}</span>
            <span style={{ fontSize:13, fontWeight:600, color:"var(--text)" }}>{r.v}</span>
          </div>
        ))}
        <p style={{ fontSize:11, color:"var(--text2)", marginTop:12, lineHeight:1.5 }}>Once your bank is connected, balances over $10.00 are automatically eligible for monthly distribution.</p>
      </CardBody>
    </Card>
  );
}

function Preferences({ dark }: { dark:boolean }) {
  return (
    <Card>
      <CardBody style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div><CardTitle>Preferences</CardTitle><p style={{ fontSize:12, color:"var(--text2)", margin:0 }}>Manage your account settings.</p></div>
        <button style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text2)", fontSize:16 }}>×</button>
      </CardBody>
      <div style={{ height:1, background:"var(--border)" }}/>
      <CardBody>
        {["Default Currency","Notifications","Language"].map(f => (
          <div key={f} style={{ marginBottom:12 }}>
            <label style={{ fontSize:12, fontWeight:500, color:"var(--text)", display:"block", marginBottom:6 }}>{f}</label>
            <select style={{ width:"100%", padding:"7px 11px", fontSize:13, borderRadius:"var(--r)", border:"1px solid var(--border)", background:dark?"rgba(255,255,255,0.04)":"#fff", color:"var(--text2)", fontFamily:"var(--font-normal)", outline:"none" }}>
              <option>{f==="Default Currency"?"USD — United States Dollar":f==="Language"?"English (UK)":"All Notifications"}</option>
            </select>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}

function DesignGoals({ accent }: { accent:string }) {
  const goals = [
    { label:"ACCESSIBILITY", value:"$420,000", pct:65, achieved:"$273,000" },
    { label:"COMPONENTS",    value:"$85,000",  pct:32, achieved:"$27,200"  },
  ];
  return (
    <Card>
      <CardBody style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div><CardTitle>Design Goals</CardTitle><p style={{ fontSize:12, color:"var(--text2)", margin:0 }}>Active milestones for 2024</p></div>
        <button style={{ padding:"5px 12px", borderRadius:"var(--r)", border:"1px solid var(--border)", background:"transparent", fontSize:12, color:"var(--text)", cursor:"pointer", fontFamily:"var(--font-normal)" }}>New Goal</button>
      </CardBody>
      <div style={{ height:1, background:"var(--border)" }}/>
      {goals.map((g,i) => (
        <CardBody key={g.label} style={{ borderBottom: i<goals.length-1?"1px solid var(--border)":"none" }}>
          <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.08em", color:"var(--text2)", margin:"0 0 6px" }}>{g.label}</p>
          <p style={{ fontSize:24, fontWeight:700, color:"var(--text)", margin:"0 0 10px", letterSpacing:"-0.5px" }}>{g.value}</p>
          <div style={{ height:4, borderRadius:2, background:"var(--border)", marginBottom:6 }}>
            <div style={{ width:`${g.pct}%`, height:"100%", background:accent, borderRadius:2 }}/>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontSize:12, color:"var(--text2)" }}>{g.pct}% achieved</span>
            <span style={{ fontSize:12, color:"var(--text2)" }}>{g.achieved}</span>
          </div>
        </CardBody>
      ))}
      <CardBody><p style={{ fontSize:12, color:"var(--text2)", margin:0 }}>You have not met your targets for this year.</p></CardBody>
    </Card>
  );
}

function RecentActivity() {
  const items = [
    { icon:"🛒", name:"Blue Bottle Coffee",    cat:"Food & Drink",   date:"Today, 10:24 AM", amt:"-$6.50",    pos:false },
    { icon:"🛒", name:"Whole Foods Market",     cat:"Groceries",      date:"Yesterday",        amt:"-$142.30",  pos:false },
    { icon:"💳", name:"Stripe Payout",          cat:"Income",         date:"Oct 12",           amt:"+$4,200.00",pos:true  },
    { icon:"🚗", name:"Uber Technologies",      cat:"Transport",      date:"Oct 11",           amt:"-$24.10",   pos:false },
    { icon:"📺", name:"Netflix Subscription",   cat:"Entertainment",  date:"Oct 10",           amt:"-$19.99",   pos:false },
  ];
  return (
    <Card>
      <CardBody style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div><CardTitle>Recent Activity</CardTitle><p style={{ fontSize:12, color:"var(--text2)", margin:0 }}>Your latest account activity.</p></div>
        <a href="#" style={{ fontSize:12, color:"var(--text2)", textDecoration:"none" }}>View All</a>
      </CardBody>
      <div style={{ height:1, background:"var(--border)" }}/>
      {items.map(it => (
        <div key={it.name} style={{ display:"flex", alignItems:"center", padding:"10px 20px", borderBottom:"1px solid var(--border)", gap:12 }}>
          <div style={{ width:34, height:34, borderRadius:"50%", background:"var(--muted)", border:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>{it.icon}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ fontSize:13, fontWeight:500, color:"var(--text)", margin:0, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{it.name}</p>
            <p style={{ fontSize:11, color:"var(--text2)", margin:0 }}>{it.cat}</p>
          </div>
          <div style={{ textAlign:"right", flexShrink:0 }}>
            <p style={{ fontSize:13, fontWeight:600, color:it.pos?"#10b981":"var(--text)", margin:0 }}>{it.amt}</p>
            <p style={{ fontSize:11, color:"var(--text2)", margin:0 }}>{it.date}</p>
          </div>
        </div>
      ))}
    </Card>
  );
}

function NavTabs({ accent }: { accent:string }) {
  const [tab, setTab] = React.useState("Overview");
  return (
    <Card>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", borderBottom:"1px solid var(--border)" }}>
        {["Overview","Account"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding:"12px", border:"none", background:"transparent", cursor:"pointer", fontSize:13, fontFamily:"var(--font-normal)", color: tab===t?"var(--text)":"var(--text2)", fontWeight: tab===t?600:400, borderBottom: tab===t?`2px solid ${accent}`:"2px solid transparent", transition:"all .15s" }}>{t}</button>
        ))}
      </div>
      <CardBody>
        {tab==="Overview"
          ? ["Dashboard","Transactions","Investments","Accounts"].map(i => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 0", borderBottom:"1px solid var(--border)" }}>
                <div style={{ width:16, height:16, borderRadius:3, background:"var(--muted)", border:"1px solid var(--border)" }}/>
                <span style={{ fontSize:13, color:"var(--text)" }}>{i}</span>
              </div>
            ))
          : ["Profile","Billing","Notifications","Security"].map(i => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 0", borderBottom:"1px solid var(--border)" }}>
                <div style={{ width:16, height:16, borderRadius:3, background:"var(--muted)", border:"1px solid var(--border)" }}/>
                <span style={{ fontSize:13, color:"var(--text)" }}>{i}</span>
              </div>
            ))
        }
      </CardBody>
    </Card>
  );
}

function DeployCard({ accent, dark }: { accent:string; dark:boolean }) {
  return (
    <Card>
      <CardBody>
        <CardTitle>Deploy Component</CardTitle>
        <CardSub>Push to your registry</CardSub>
        <div style={{ position:"relative", marginBottom:12 }}>
          <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", fontSize:13, color:"var(--text2)" }}>v</span>
          <Inp placeholder="1.0.0" style={{ paddingLeft:28 }}/>
        </div>
        <select style={{ width:"100%", padding:"8px 11px", fontSize:13, borderRadius:"var(--r)", border:"1px solid var(--border)", background:dark?"rgba(255,255,255,0.04)":"#fff", color:"var(--text)", fontFamily:"var(--font-normal)", outline:"none", marginBottom:12 }}>
          <option>Release Type — Minor</option><option>Major</option><option>Patch</option>
        </select>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14, padding:"12px 0", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)" }}>
          {[["Affected Components","12"],["Bundle Delta","+4.2kb"]].map(([l,v]) => (
            <div key={l}><p style={{ fontSize:11, color:"var(--text2)", margin:"0 0 2px" }}>{l}</p><p style={{ fontSize:16, fontWeight:700, color:"var(--text)", margin:0 }}>{v}</p></div>
          ))}
        </div>
        <Btn accent={accent} style={{ width:"100%", textAlign:"center" }}>Review Release</Btn>
        <p style={{ fontSize:11, color:"var(--text2)", textAlign:"center", marginTop:8 }}>Components publish within seconds of release.</p>
      </CardBody>
    </Card>
  );
}

function MiniStats({ accent }: { accent:string }) {
  const data = [3,5,4,7,5,6,4,8,7,9,6,8];
  const months = ["J","F","M","A","M","J","J","A","S","O","N","D"];
  const max = Math.max(...data);
  return (
    <>
      <Card>
        <CardBody style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:0 }}>
          <div style={{ paddingRight:16, borderRight:"1px solid var(--border)" }}>
            <p style={{ fontSize:11, color:"var(--text2)", margin:"0 0 4px" }}>Token Balance</p>
            <p style={{ fontSize:18, fontWeight:700, color:"var(--text)", margin:0, letterSpacing:"-0.5px" }}>US$12.94</p>
            <p style={{ fontSize:11, color:"var(--text2)", margin:"4px 0 0" }}>US$11,337.06 Available</p>
          </div>
          <div style={{ paddingLeft:16 }}>
            <p style={{ fontSize:11, color:"var(--text2)", margin:"0 0 4px" }}>Due Date</p>
            <p style={{ fontSize:18, fontWeight:700, color:"var(--text)", margin:0 }}>1 Apr</p>
            <a href="#" style={{ fontSize:11, color:accent, textDecoration:"none" }}>Pay Early</a>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
            <p style={{ fontSize:13, fontWeight:600, color:"var(--text)", margin:0 }}>Yearly Activity</p>
            <span style={{ fontSize:11, fontWeight:600, color:"#10b981" }}>+$0.25 Daily</span>
          </div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:3, height:44 }}>
            {data.map((v,i) => (
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                <div style={{ width:"100%", background: i===data.length-1?accent:"rgba(0,0,0,0.1)", borderRadius:"2px 2px 0 0", height:`${(v/max)*100}%` }}/>
                <span style={{ fontSize:8, color:"var(--text2)" }}>{months[i]}</span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </>
  );
}

function TransferCard({ accent, dark }: { accent:string; dark:boolean }) {
  const sel: React.CSSProperties = { width:"100%", padding:"8px 11px", fontSize:13, borderRadius:"var(--r)", border:"1px solid var(--border)", background:dark?"rgba(255,255,255,0.04)":"#fff", color:"var(--text)", fontFamily:"var(--font-normal)", outline:"none" };
  return (
    <Card>
      <CardBody style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div><CardTitle>Transfer Tokens</CardTitle><p style={{ fontSize:12, color:"var(--text2)", margin:0 }}>Move between your connected accounts</p></div>
        <button style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text2)", fontSize:16 }}>×</button>
      </CardBody>
      <div style={{ height:1, background:"var(--border)" }}/>
      <CardBody style={{ display:"flex", flexDirection:"column", gap:12 }}>
        <div><label style={{ fontSize:12, fontWeight:500, color:"var(--text)", display:"block", marginBottom:6 }}>Amount to Transfer</label><Inp placeholder="$ 1,200.00"/></div>
        <div><label style={{ fontSize:12, fontWeight:500, color:"var(--text)", display:"block", marginBottom:6 }}>From Account</label><select style={sel}><option>Main Account (–8402) — $12,450.00</option></select></div>
        <div><label style={{ fontSize:12, fontWeight:500, color:"var(--text)", display:"block", marginBottom:6 }}>To Account</label><select style={sel}><option>Savings (–1192) — $42,100.00</option></select></div>
        <Btn accent={accent} style={{ width:"100%", textAlign:"center", marginTop:4 }}>Transfer Now</Btn>
      </CardBody>
    </Card>
  );
}

function AccountAccess({ accent, dark }: { accent:string; dark:boolean }) {
  return (
    <Card>
      <CardBody>
        <CardTitle>Account Access</CardTitle>
        <CardSub>Update your credentials or re-authenticate.</CardSub>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div>
            <label style={{ fontSize:12, fontWeight:500, color:"var(--text)", display:"block", marginBottom:6 }}>Email Address</label>
            <Inp placeholder="Email" value="designer@sandhata.com"/>
          </div>
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <label style={{ fontSize:12, fontWeight:500, color:"var(--text)" }}>Current Password</label>
              <a href="#" style={{ fontSize:12, color:"var(--text2)", textDecoration:"none" }}>FORGOT?</a>
            </div>
            <Inp placeholder="••••••••••" type="password"/>
          </div>
          <Btn accent={accent} style={{ width:"100%", textAlign:"center" }}>🔒 Update Security</Btn>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0 0", borderTop:"1px solid var(--border)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ color:"#ef4444", fontSize:14 }}>⊘</span>
              <div>
                <p style={{ fontSize:13, fontWeight:500, color:"#ef4444", margin:0 }}>Danger Zone</p>
                <p style={{ fontSize:11, color:"var(--text2)", margin:0 }}>Archive account and remove...</p>
              </div>
            </div>
            <span style={{ color:"var(--text2)" }}>→</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function ComponentShowcase({ accent }: { accent:string }) {
  const [tog, setTog] = React.useState(false);
  return (
    <Card>
      <CardBody>
        <CardTitle>Component Variants</CardTitle>
        <CardSub>Sandhata DS component preview</CardSub>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
          {[["Primary",true],["Secondary",false],["Outline",false],["Ghost",false]].map(([l,p]) => (
            <button key={l as string} style={{ padding:"6px 14px", borderRadius:"var(--r)", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"var(--font-normal)", background:p?accent:"transparent", color:p?"#fff":"var(--text)", border:p?"none":`1px solid ${l==="Outline"?"var(--border)":"transparent"}` }}>{l}</button>
          ))}
        </div>
        <div style={{ padding:"10px 12px", border:"1px solid var(--border)", borderRadius:"var(--r)", marginBottom:10 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <p style={{ fontSize:13, fontWeight:500, color:"var(--text)", margin:"0 0 2px" }}>Two-factor authentication</p>
              <p style={{ fontSize:12, color:"var(--text2)", margin:0 }}>Verify via email or phone number.</p>
            </div>
            <button style={{ padding:"5px 12px", borderRadius:"var(--r)", border:`1px solid ${accent}`, background:"transparent", color:accent, fontSize:12, cursor:"pointer", fontFamily:"var(--font-normal)" }}>Enable</button>
          </div>
        </div>
        <div style={{ position:"relative", marginBottom:10 }}>
          <Inp placeholder="Search components..."/>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" style={{ position:"absolute", right:11, top:"50%", transform:"translateY(-50%)", color:"var(--text2)", pointerEvents:"none" }}><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
          {[["Badge",true],["Secondary",false],["Outline",false]].map(([l,p]) => (
            <span key={l as string} style={{ padding:"3px 10px", borderRadius:100, fontSize:11, fontWeight:600, background:p?accent:"transparent", color:p?"#fff":"var(--text)", border:p?"none":`1px solid var(--border)` }}>{l}</span>
          ))}
          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:12, color:"var(--text2)" }}>Toggle</span>
            <div onClick={() => setTog(!tog)} style={{ width:36, height:20, borderRadius:10, background:tog?accent:"rgba(0,0,0,0.15)", cursor:"pointer", position:"relative", transition:"background .2s" }}>
              <div style={{ position:"absolute", top:2, left:tog?18:2, width:16, height:16, borderRadius:"50%", background:"#fff", transition:"left .2s" }}/>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function PlatformShare({ accent }: { accent:string }) {
  const segs = [
    { l:"Chrome",  p:0.52, c:accent },
    { l:"Firefox", p:0.19, c:accent+"99" },
    { l:"Safari",  p:0.18, c:accent+"55" },
    { l:"Edge",    p:0.11, c:accent+"33" },
  ];
  const cx=55,cy=55,R=40,sw=10;
  const GAP=(18/360)*Math.PI*2;
  const ARC=Math.PI*2-GAP*segs.length;
  let a=-Math.PI/2;
  const arcs = segs.map(s => {
    const arc=s.p*ARC,sa=a,ea=a+arc; a=ea+GAP;
    return { d:`M ${(cx+R*Math.cos(sa)).toFixed(1)} ${(cy+R*Math.sin(sa)).toFixed(1)} A ${R} ${R} 0 ${arc>Math.PI?1:0} 1 ${(cx+R*Math.cos(ea)).toFixed(1)} ${(cy+R*Math.sin(ea)).toFixed(1)}`, ...s };
  });
  return (
    <Card>
      <CardBody>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
          <CardTitle>Browser Share</CardTitle>
          <span style={{ fontSize:13, fontWeight:600, color:"var(--text)" }}>Firefox</span>
        </div>
        <CardSub>January - June 2026</CardSub>
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:12 }}>
          <svg viewBox="0 0 110 110" style={{ width:90, flexShrink:0 }}>
            <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={sw}/>
            {arcs.map((a,i) => <path key={i} d={a.d} fill="none" stroke={a.c} strokeWidth={sw} strokeLinecap="round"/>)}
            <text x={cx} y={cy-5} textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="700" fill="var(--text)">935</text>
            <text x={cx} y={cy+10} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="var(--text2)">Visitors</text>
          </svg>
          <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
            {segs.map(s => (
              <div key={s.l} style={{ display:"flex", alignItems:"center", gap:7 }}>
                <span style={{ width:7, height:7, borderRadius:"50%", background:s.c, flexShrink:0 }}/>
                <span style={{ fontSize:12, color:"var(--text2)", flex:1 }}>{s.l}</span>
                <span style={{ fontSize:12, fontWeight:600, color:"var(--text)" }}>{Math.round(s.p*100)}%</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
            <span style={{ fontSize:12, color:"var(--text2)" }}>Firefox</span>
            <span style={{ fontSize:12, fontWeight:600, color:"var(--text)" }}>19%</span>
          </div>
          <div style={{ height:4, borderRadius:2, background:"var(--border)" }}>
            <div style={{ width:"19%", height:"100%", borderRadius:2, background:accent+"99" }}/>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function InviteTeam({ accent, dark }: { accent:string; dark:boolean }) {
  return (
    <Card>
      <CardBody>
        <CardTitle>Invite Team</CardTitle>
        <CardSub>Add members to your workspace</CardSub>
        {["alex@example.com","sam@example.com"].map((e,i) => (
          <div key={e} style={{ display:"flex", gap:8, marginBottom:8 }}>
            <Inp placeholder="Email" value={e} style={{ flex:1 }}/>
            <select style={{ padding:"8px 10px", fontSize:12, borderRadius:"var(--r)", border:"1px solid var(--border)", background:dark?"rgba(255,255,255,0.04)":"#fff", color:"var(--text)", fontFamily:"var(--font-normal)", outline:"none" }}>
              <option>{i===0?"Editor":"Viewer"}</option><option>Editor</option><option>Admin</option>
            </select>
          </div>
        ))}
        <a href="#" style={{ fontSize:13, color:accent, textDecoration:"none", display:"block", marginBottom:14 }}>+ Add another</a>
        <div style={{ padding:"12px", border:"1px solid var(--border)", borderRadius:"var(--r)", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <span style={{ fontSize:12, color:"var(--text2)" }}>https://sandhata.design/invite/x8f2k</span>
          <button style={{ background:"none", border:"none", cursor:"pointer", fontSize:14, color:"var(--text2)" }}>⎘</button>
        </div>
        <Btn accent={accent} style={{ width:"100%", textAlign:"center" }}>Send Invites</Btn>
      </CardBody>
    </Card>
  );
}

function Typography({ accent }: { accent:string }) {
  return (
    <Card>
      <CardBody>
        <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", color:"var(--text2)", textTransform:"uppercase", marginBottom:8 }}>IBM PLEX SANS</p>
        <h2 style={{ fontSize:22, fontWeight:700, color:"var(--text)", margin:"0 0 12px", lineHeight:1.2 }}>Designing with rhythm and hierarchy.</h2>
        <p style={{ fontSize:13, color:"var(--text2)", lineHeight:1.6, marginBottom:16 }}>A strong body style keeps long-form content readable and balances the visual weight of headings. Thoughtful spacing helps paragraphs scan quickly without feeling dense.</p>
        <Btn accent={accent} style={{ width:"100%", textAlign:"center" }}>Share Feedback</Btn>
      </CardBody>
    </Card>
  );
}

function ReportBug({ accent, dark }: { accent:string; dark:boolean }) {
  const sel: React.CSSProperties = { padding:"7px 11px", fontSize:13, borderRadius:"var(--r)", border:"1px solid var(--border)", background:dark?"rgba(255,255,255,0.04)":"#fff", color:"var(--text)", fontFamily:"var(--font-normal)", outline:"none", flex:1 };
  return (
    <Card>
      <CardBody>
        <CardTitle>Report Bug</CardTitle>
        <CardSub>Help us fix issues faster.</CardSub>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <div><label style={{ fontSize:12, fontWeight:500, color:"var(--text)", display:"block", marginBottom:5 }}>Title</label><Inp placeholder="Brief description of the issue"/></div>
          <div style={{ display:"flex", gap:8 }}>
            <div style={{ flex:1 }}><label style={{ fontSize:12, fontWeight:500, color:"var(--text)", display:"block", marginBottom:5 }}>Severity</label><select style={sel}><option>Medium</option><option>Low</option><option>High</option><option>Critical</option></select></div>
            <div style={{ flex:1 }}><label style={{ fontSize:12, fontWeight:500, color:"var(--text)", display:"block", marginBottom:5 }}>Component</label><select style={sel}><option>Button</option><option>Input</option><option>Table</option></select></div>
          </div>
          <div><label style={{ fontSize:12, fontWeight:500, color:"var(--text)", display:"block", marginBottom:5 }}>Steps to reproduce</label><textarea placeholder="1. Go to 2. Click on 3. Observe..." rows={3} style={{ width:"100%", padding:"8px 11px", fontSize:13, borderRadius:"var(--r)", border:"1px solid var(--border)", background:"var(--muted)", color:"var(--text)", resize:"none", outline:"none", boxSizing:"border-box", fontFamily:"var(--font-normal)" }}/></div>
          <div style={{ display:"flex", gap:8 }}>
            <Btn secondary style={{ flex:1, textAlign:"center" }}>Attach File</Btn>
            <Btn accent={accent} style={{ flex:1, textAlign:"center" }}>Submit Bug</Btn>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
