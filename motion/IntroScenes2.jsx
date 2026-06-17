// Sandhata intro film — scenes 4–6 (components, surfaces, outro).
// Uses helpers from IntroScenes1.jsx (sdC, sdF, sdP, SdItem, SdScene, …).

// ── Scene 4 · Components (17.5–24.5) ────────────────────────────────────────
// A primary button assembles from tokens, then the wider kit pops in around it.

function SdCallout({ lt, at, x, y, text, lineTo }) {
  const e = sdP(lt, at, 0.5);
  const out = 1 - sdP(lt, 3.55, 0.4, Easing.easeInQuad); // all callouts retire together
  const o = clamp(e * out, 0, 1);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
      <div style={{ fontFamily: sdF.mono, fontSize: 22, color: sdC.purple, whiteSpace: "nowrap" }}>{text}</div>
      {lineTo && (
        <div style={{ position: "absolute", left: lineTo.x, top: lineTo.y, width: lineTo.w * e, height: 1, background: sdC.n300, transformOrigin: "left" }} />
      )}
    </div>
  );
}

function SdScene4() {
  return (
    <SdScene start={17.5} end={24.5} zoomFrom={1.07} zoomTo={1} origin="50% 48%">
      <SdSceneLabel num="03" title="Components" />
      <Sprite start={17.5} end={24.5} keepMounted>
        {({ localTime: lt }) => {
          const outline = sdP(lt, 0.6, 0.5);
          const fill = sdP(lt, 1.15, 0.5);
          const label = sdP(lt, 1.55, 0.4);
          const settle = sdP(lt, 3.55, 0.6, Easing.easeOutBack); // little confirm-pop when callouts leave
          const pop = (at) => ({ e: sdP(lt, at, 0.55, Easing.easeOutBack), o: clamp((lt - at) / 0.25, 0, 1) });
          const sat = (at, style = {}) => {
            const { e, o } = pop(at);
            return { opacity: o, transform: `translateY(${(1 - e) * 18}px) scale(${0.7 + 0.3 * e})`, transformOrigin: "center", ...style };
          };
          const knob = sdP(lt, 5.2, 0.35, Easing.easeInOutCubic);
          const halo = sdP(lt, 5.45, 0.4);
          return (
            <div>
              {/* The button, mid-assembly */}
              <div style={{ position: "absolute", left: 820, top: 504, width: 280, height: 72, borderRadius: 8, border: `2px dashed ${sdC.blue200}`, opacity: outline * (1 - fill), transform: `scale(${0.92 + 0.08 * outline})` }} />
              <div style={{ position: "absolute", left: 820, top: 504, width: 280, height: 72, borderRadius: 8, background: sdC.blue, opacity: fill, transform: `scale(${1 + 0.05 * Math.sin(settle * Math.PI)})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(0,54,221,0.25)" }}>
                <span style={{ fontFamily: sdF.bold, fontWeight: 700, fontSize: 28, color: "#fff", opacity: label }}>Get started</span>
              </div>
              {/* Token callouts */}
              <SdCallout lt={lt} at={1.9} x={1150} y={420} text="--radius-md: 6px" lineTo={{ x: -10, y: 40, w: -0 }} />
              <SdCallout lt={lt} at={2.15} x={500} y={530} text="--background-action" lineTo={{ x: 250, y: 14, w: 60 }} />
              <SdCallout lt={lt} at={2.4} x={830} y={620} text="font: 700 16px var(--font-bold)" />
              {/* The kit pops in around it */}
              <div style={{ position: "absolute", left: 648, top: 386, ...sat(3.9) }}>
                <span style={{ fontFamily: sdF.bold, fontWeight: 700, fontSize: 20, color: sdC.blue, background: sdC.blue50, borderRadius: 999, padding: "8px 22px" }}>New</span>
              </div>
              <div style={{ position: "absolute", left: 1218, top: 372, ...sat(4.05) }}>
                <div style={{ width: 68, height: 68, borderRadius: 999, background: sdC.navy, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: sdF.bold, fontWeight: 700, fontSize: 24 }}>SD</div>
              </div>
              <div style={{ position: "absolute", left: 1268, top: 548, ...sat(4.2) }}>
                <div style={{ width: 84, height: 48, borderRadius: 999, background: knob > 0.5 ? sdC.blue : sdC.n300, transition: "background 200ms", position: "relative" }}>
                  <div style={{ position: "absolute", top: 5, left: 6 + knob * 36, width: 38, height: 38, borderRadius: 999, background: "#fff", boxShadow: "0 1px 3px rgba(20,22,24,0.3)" }} />
                </div>
              </div>
              <div style={{ position: "absolute", left: 420, top: 656, ...sat(4.35) }}>
                <div style={{ fontFamily: sdF.normal, fontSize: 19, color: sdC.n700, marginBottom: 8 }}>Email</div>
                <div style={{ width: 330, height: 58, borderRadius: 6, border: `1.5px solid ${halo > 0.1 ? sdC.purple : sdC.n300}`, background: "#fff", display: "flex", alignItems: "center", padding: "0 18px", fontFamily: sdF.normal, fontSize: 22, color: sdC.n500, boxShadow: `0 0 0 ${4 * halo}px rgba(96,45,234,0.18)` }}>
                  you@company.com
                </div>
              </div>
              <div style={{ position: "absolute", left: 700, top: 812, ...sat(4.5) }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 12, fontFamily: sdF.normal, fontSize: 21, color: sdC.n900, background: sdC.n100, borderRadius: 999, padding: "10px 24px" }}>
                  Design tokens <span style={{ color: sdC.n500, fontSize: 24, lineHeight: 0 }}>×</span>
                </span>
              </div>
              <div style={{ position: "absolute", left: 1080, top: 776, ...sat(4.65) }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, border: `1px solid ${sdC.n200}`, borderLeft: `3px solid ${sdC.success}`, borderRadius: 8, background: "#fff", padding: "16px 26px", boxShadow: "0 2px 8px rgba(20,22,24,0.07)" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={sdC.success} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 12.5l2.6 2.6L16 9.5" /></svg>
                  <span style={{ fontFamily: sdF.normal, fontSize: 22, color: sdC.n900 }}>Changes saved</span>
                </div>
              </div>
            </div>
          );
        }}
      </Sprite>
    </SdScene>
  );
}

// ── Scene 5 · Surfaces (24.5–30.5) ──────────────────────────────────────────
// A mini dashboard assembles itself: sidebar, stats, a chart drawing on.

function SdStat({ label, value, delta, up }) {
  return (
    <div style={{ flex: 1, border: `1px solid ${sdC.n200}`, borderRadius: 8, padding: "16px 20px", background: "#fff" }}>
      <div style={{ fontFamily: sdF.normal, fontSize: 14, color: sdC.n500 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 6 }}>
        <span style={{ fontFamily: sdF.bold, fontWeight: 700, fontSize: 30, letterSpacing: "-0.5px", color: sdC.ink }}>{value}</span>
        <span style={{ fontFamily: sdF.mono, fontSize: 14, color: up ? sdC.success : sdC.error }}>{delta}</span>
      </div>
    </div>
  );
}

function SdScene5() {
  const navItems = ["Overview", "Pipelines", "Releases", "Environments", "Settings"];
  const s1 = "0,150 80,138 160,142 240,110 320,118 400,88 480,96 560,62 640,70 720,40 800,52 880,22 960,30";
  const s2 = "0,190 80,184 160,170 240,176 320,150 400,158 480,132 560,140 640,118 720,126 800,100 880,110 960,86";
  return (
    <SdScene start={24.5} end={30.5} zoomFrom={1} zoomTo={1.12} origin="58% 40%">
      <SdSceneLabel num="04" title="Surfaces" />
      <Sprite start={24.5} end={30.5} keepMounted>
        {({ localTime: lt }) => {
          const frame = sdP(lt, 0.25, 0.7);
          const side = sdP(lt, 0.55, 0.6);
          const head = sdP(lt, 0.8, 0.5);
          const draw = sdP(lt, 1.7, 1.5, Easing.easeInOutCubic);
          const area = sdP(lt, 2.6, 0.8);
          return (
            <div style={{ position: "absolute", left: 340, top: 246, width: 1240, height: 700, opacity: frame, transform: `scale(${0.96 + 0.04 * frame})`, transformOrigin: "center", borderRadius: 12, border: `1px solid ${sdC.n200}`, background: "#fff", boxShadow: "0 24px 64px rgba(20,22,24,0.12)", overflow: "hidden", display: "flex" }}>
              {/* Sidebar */}
              <div style={{ width: 230, borderRight: `1px solid ${sdC.n100}`, background: sdC.n50, padding: "20px 14px", transform: `translateX(${(side - 1) * 230}px)`, flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 10px 18px" }}>
                  <img src="../assets/logo/sandhata-mark.svg" alt="" style={{ height: 22 }} />
                  <span style={{ fontFamily: sdF.bold, fontWeight: 700, fontSize: 16, color: sdC.ink }}>Sandhata</span>
                </div>
                {navItems.map((n, i) => (
                  <div key={n} style={{ padding: "10px 12px", borderRadius: 6, marginBottom: 2, background: i === 1 ? sdC.blue50 : "transparent", fontFamily: i === 1 ? sdF.bold : sdF.normal, fontWeight: i === 1 ? 700 : 400, fontSize: 15, color: i === 1 ? sdC.blue : sdC.n700, opacity: clamp((side - 0.3) * 2 - i * 0.12, 0, 1) }}>{n}</div>
                ))}
              </div>
              {/* Main */}
              <div style={{ flex: 1, padding: "22px 28px", minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", opacity: head, transform: `translateY(${(1 - head) * 14}px)` }}>
                  <span style={{ fontFamily: sdF.bold, fontWeight: 700, fontSize: 24, letterSpacing: "-0.25px", color: sdC.ink }}>Pipelines</span>
                  <span style={{ fontFamily: sdF.bold, fontWeight: 700, fontSize: 15, color: "#fff", background: sdC.blue, borderRadius: 6, padding: "10px 18px" }}>New pipeline</span>
                </div>
                <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
                  {[
                    { label: "Active pipelines", value: "24,828", delta: "+12%", up: true, at: 1.0 },
                    { label: "Deployments today", value: "312", delta: "+4%", up: true, at: 1.15 },
                    { label: "Failed runs", value: "7", delta: "−18%", up: true, at: 1.3 },
                  ].map((s) => {
                    const e = sdP(lt, s.at, 0.5, Easing.easeOutBack);
                    return (
                      <div key={s.label} style={{ flex: 1, opacity: clamp(e * 2, 0, 1), transform: `translateY(${(1 - e) * 16}px)`, display: "flex" }}>
                        <SdStat {...s} />
                      </div>
                    );
                  })}
                </div>
                {/* Chart card */}
                <div style={{ border: `1px solid ${sdC.n200}`, borderRadius: 8, marginTop: 16, padding: "18px 22px", opacity: sdP(lt, 1.45, 0.5) }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{ fontFamily: sdF.bold, fontWeight: 700, fontSize: 17, color: sdC.ink }}>Throughput</span>
                    <span style={{ fontFamily: sdF.mono, fontSize: 13, color: sdC.n500 }}>last 90 days</span>
                  </div>
                  <svg width="100%" height="220" viewBox="0 0 960 220" preserveAspectRatio="none" style={{ display: "block" }}>
                    {[55, 110, 165].map((y) => <line key={y} x1="0" y1={y} x2="960" y2={y} stroke={sdC.n100} strokeWidth="1" />)}
                    <polygon points={`${s1} 960,220 0,220`} fill={sdC.purple} opacity={0.07 * area} />
                    <polyline points={s1} fill="none" stroke={sdC.purple} strokeWidth="3" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - draw} strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points={s2} fill="none" stroke={sdC.blueBright} strokeWidth="3" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - sdP(lt, 1.9, 1.5, Easing.easeInOutCubic)} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          );
        }}
      </Sprite>
      <SdItem x={160} y={990} at={3.4} dur={0.6}>
        <div style={{ fontFamily: sdF.light, fontWeight: 300, fontSize: 26, color: sdC.n700 }}>Whole surfaces, assembled from the same tokens.</div>
      </SdItem>
    </SdScene>
  );
}

// ── Scene 6 · Outro (30.5–36) ───────────────────────────────────────────────
function SdScene6() {
  return (
    <SdScene start={30.5} end={36} zoomFrom={1} zoomTo={1.03} fadeOut={0.01}>
      <Sprite start={30.5} end={36} keepMounted>
        {({ localTime }) => (
          <div style={{ position: "absolute", left: 960, top: 300, transform: "translateX(-50%)" }}>
            <SdLogoMark lt={localTime + 1.4} width={170} at={0} />
          </div>
        )}
      </Sprite>
      <SdItem x={0} y={490} at={0.5} dur={0.7} w={1920} style={{ textAlign: "center" }}>
        <div style={{ fontFamily: sdF.bold, fontWeight: 700, fontSize: 80, letterSpacing: "-1.5px", color: sdC.ink }}>Sandhata Design System</div>
      </SdItem>
      <SdItem x={0} y={610} at={1.0} dur={0.7} w={1920} style={{ textAlign: "center" }}>
        <div style={{ fontFamily: sdF.light, fontWeight: 300, fontSize: 32, color: sdC.n700 }}>Tokens, components and full surfaces — ready to build on.</div>
      </SdItem>
      <Sprite start={30.5} end={36} keepMounted>
        {({ localTime }) => (
          <div style={{ position: "absolute", left: 0, top: 720, width: 1920, display: "flex", justifyContent: "center", gap: 20 }}>
            {["Components", "Documentation", "Demo"].map((n, i) => {
              const e = sdP(localTime, 1.5 + i * 0.14, 0.5, Easing.easeOutBack);
              return (
                <span key={n} style={{ opacity: clamp(e * 2, 0, 1), transform: `scale(${0.7 + 0.3 * e})`, fontFamily: sdF.normal, fontSize: 24, color: i === 0 ? "#fff" : sdC.n900, background: i === 0 ? sdC.blue : "#fff", border: `1px solid ${i === 0 ? sdC.blue : sdC.n200}`, borderRadius: 999, padding: "14px 34px" }}>{n}</span>
              );
            })}
          </div>
        )}
      </Sprite>
    </SdScene>
  );
}

Object.assign(window, { SdScene4, SdScene5, SdScene6 });
