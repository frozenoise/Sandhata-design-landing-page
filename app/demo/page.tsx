"use client";

import React from "react";
import "../_docs/docs.css";
import "../_demo/demo.css";
import { SdTopNav } from "../_docs/shell";
import { Input } from "@/components";
import {
  LineChartInteractive, AreaChartInteractive, RadarInteractive, DemoCalendar, DateField,
} from "../_demo/InteractiveCharts";

type Theme = { name: string; swatch: string; headerBg: string; statBg: string; statText: string; vars: React.CSSProperties };

const ramp = (base: string): React.CSSProperties => ({
  "--colour-primaryblue-50": `var(--colour-${base}-50)`,
  "--colour-primaryblue-100": `var(--colour-${base}-100)`,
  "--colour-primaryblue-200": `var(--colour-${base}-200)`,
  "--colour-primaryblue-300": `var(--colour-${base}-300)`,
  "--colour-primaryblue-400": `var(--colour-${base}-400)`,
  "--colour-primaryblue-500": `var(--colour-${base}-500)`,
  "--colour-primaryblue-600": `var(--colour-${base}-600)`,
  "--colour-primaryblue-700": `var(--colour-${base}-700)`,
} as React.CSSProperties);

const CLIENTS: Record<string, Theme> = {
  technip: { name: "TechNip Energies", swatch: "var(--colour-secondarycyan-600)", headerBg: "linear-gradient(90deg, var(--colour-secondarycyan-500), var(--colour-secondarycyan-700))", statBg: "var(--colour-secondarycyan-600)", statText: "#fff", vars: ramp("secondarycyan") },
  aviva: { name: "Aviva Insurance", swatch: "#0a2a66", headerBg: "linear-gradient(90deg, #0c2b66, #0a1f4a)", statBg: "#f5a623", statText: "#0a1f4a", vars: { ...ramp("primaryblue"), "--colour-primaryblue-500": "#12347e", "--colour-primaryblue-600": "#0c2b66", "--colour-primaryblue-700": "#0a1f4a" } as React.CSSProperties },
  vodafone: { name: "VodafoneThree", swatch: "#d61f26", headerBg: "linear-gradient(90deg, #d61f26, #a3141a)", statBg: "#d61f26", statText: "#fff", vars: ramp("alternativerosepink") },
};

const AXIS = ["Apr 5","Apr 10","Apr 15","Apr 20","Apr 25","Apr 30","May 5","May 10","May 15","May 20","May 25","May 30","Jun 4","Jun 9","Jun 14","Jun 19","Jun 24","Jun 30"];

function Chevron() { return <svg className="chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>; }
function CalIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>; }

function ClientPicker({ value, onChange }: { value: string; onChange: (k: string) => void }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div className="demo-client" ref={ref} style={{ position: "relative", width: "fit-content" }}>
      <div className="demo-client-label">Client</div>
      <div className="demo-select" onClick={() => setOpen((o) => !o)}>
        <span className="demo-dot" style={{ background: CLIENTS[value].swatch }} />
        {CLIENTS[value].name}<Chevron />
      </div>
      {open && (
        <div className="demo-menu">
          {Object.entries(CLIENTS).map(([k, t]) => (
            <button key={k} onClick={() => { onChange(k); setOpen(false); }}>
              <span className="demo-dot" style={{ background: t.swatch }} />{t.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DemoPage() {
  const [client, setClient] = React.useState("technip");
  const [dataset, setDataset] = React.useState<"desktop" | "mobile">("desktop");
  const [step, setStep] = React.useState(2);
  const t = CLIENTS[client];

  return (
    <div className="doc-root">
      <SdTopNav active="Demo" />
      <div className="demo-app">
        <div className="demo-wrap" style={t.vars}>
          <ClientPicker value={client} onChange={setClient} />

          {/* Line Chart — Interactive */}
          <div className="dcard demo-full" style={{ marginBottom: 18 }}>
            <div className="li-head" style={{ background: t.headerBg }}>
              <div>
                <div style={{ font: "700 15px/1.2 var(--font-bold)" }}>Line Chart - Interactive</div>
                <div style={{ font: "12px/1.4 var(--font-normal)", opacity: 0.9, marginTop: 3 }}>Showing total visitors for the last 3 months</div>
              </div>
              <div className="li-stats">
                <div className={`li-stat${dataset !== "desktop" ? " dim" : ""}`} onClick={() => setDataset("desktop")} style={{ background: dataset === "desktop" ? t.statBg : "transparent", color: dataset === "desktop" ? t.statText : "#fff", borderRadius: 8 }}>
                  <span>Desktop</span><strong>24,828</strong>
                </div>
                <div className={`li-stat${dataset !== "mobile" ? " dim" : ""}`} onClick={() => setDataset("mobile")} style={{ background: dataset === "mobile" ? t.statBg : "transparent", color: dataset === "mobile" ? t.statText : "#fff", borderRadius: 8 }}>
                  <span>Mobile</span><strong>25,010</strong>
                </div>
              </div>
            </div>
            <div style={{ padding: "8px 8px 0" }}>
              <LineChartInteractive axis={AXIS} active={dataset} />
            </div>
            <div className="demo-axis">{AXIS.map((a) => <span key={a}>{a}</span>)}</div>
          </div>

          {/* Radar + Form */}
          <div className="demo-grid" style={{ marginBottom: 18 }}>
            <div className="dcard dcard-pad">
              <div className="dcard-h">Radar Chart</div>
              <div className="dcard-sub">Showing total visitors for the last 6 months</div>
              <div style={{ display: "flex", justifyContent: "center", padding: "18px 0" }}><RadarInteractive size={210} /></div>
              <div className="dcard-foot">Trending up by 5.2% this month ↗</div>
              <div className="dcard-sub">January - June 2024</div>
            </div>

            <div className="dcard dcard-pad">
              <div className="dcard-h">Form Title</div>
              <div className="dcard-sub" style={{ marginBottom: 16 }}>A brief description of the form&apos;s purpose</div>
              <div className="stepper">
                {[1, 2, 3].map((n, i) => (
                  <React.Fragment key={n}>
                    {i > 0 && <span className="sep">›</span>}
                    <span className={`st${step === n ? " on" : ""}`} onClick={() => setStep(n)}>Step {n}</span>
                  </React.Fragment>
                ))}
              </div>
              <div className="fgrid">
                <DateField label="Single date field" helper="Help or instruction text goes here" />
                <Input label="Mandatory field label" required error="This is a mandatory field" defaultValue="John Doe" />
                <Input label="Field label" placeholder="Enter your text here" helper="Help or instruction text goes here" />
                <Input label="Field label" defaultValue="John Doe" />
              </div>
              <div style={{ marginTop: 16 }}>
                <div className="fl">Upload files</div>
                <div className="dropzone">
                  <div className="dropzone-t">⬆ Click to upload or drag and drop</div>
                  <div className="dropzone-s">Max. file size 10 MB</div>
                </div>
              </div>
            </div>
          </div>

          {/* Acknowledgment + Area chart */}
          <div className="demo-grid" style={{ marginBottom: 18 }}>
            <div className="dcard dcard-pad">
              <div className="dcard-sub">Optional Label</div>
              <div className="dcard-h" style={{ marginBottom: 12 }}>Acknowledgment Modal Title</div>
              <label style={{ display: "flex", gap: 8, alignItems: "flex-start", font: "12px/1.5 var(--font-normal)", color: "var(--text-body)", cursor: "pointer" }}>
                <input type="checkbox" style={{ marginTop: 2, accentColor: "var(--colour-primaryblue-500)" }} />
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </label>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}>
                <button style={{ height: 34, padding: "0 14px", border: "1px solid var(--border-subtle,#e5e7eb)", borderRadius: 6, background: "#fff", font: "700 12px/1 var(--font-bold)", cursor: "pointer" }}>← Back</button>
                <button style={{ height: 34, padding: "0 16px", border: "none", borderRadius: 6, background: t.statBg, color: t.statText, font: "700 12px/1 var(--font-bold)", cursor: "pointer" }}>Accept</button>
              </div>
            </div>
            <div className="dcard dcard-pad">
              <div className="dcard-h">Area Chart - Gradient</div>
              <div className="dcard-sub">Showing total visitors for the last 6 months</div>
              <div style={{ padding: "10px 0" }}><AreaChartInteractive axis={AXIS} seed={client === "vodafone" ? 5 : client === "aviva" ? 13 : 9} /></div>
              <div className="dcard-foot">Trending up by 5.2% this month ↗</div>
            </div>
          </div>

          {/* Calendar */}
          <div className="dcard demo-full">
            <DemoCalendar headerBg={t.headerBg} />
          </div>
        </div>
      </div>
    </div>
  );
}
