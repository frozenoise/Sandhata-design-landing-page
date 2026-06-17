// Sandhata showcase — Product Cards view: pricing tiers (Basic / Extra / Pro).

function ProductCardsView() {
  const { Button } = window.SandhataDesignSystem_081a0e;
  const [cycle, setCycle] = React.useState("yearly");
  const Check = ({ light }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={light ? "#fff" : "var(--colour-primaryblue-500)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12" /></svg>
  );
  const plans = [
    { name: "Basic", featured: false },
    { name: "Extra", featured: true },
    { name: "Pro", featured: false },
  ];
  const Plan = ({ name, featured }) => (
    <div style={{
      padding: 24, borderRadius: "var(--radius-xl)",
      background: featured ? "var(--colour-alternativepurple-400)" : "var(--surface-secondary)",
      border: featured ? "none" : "1px solid var(--border-subtle)",
      color: featured ? "#fff" : "var(--text-body)",
      display: "flex", flexDirection: "column", gap: 18,
      boxShadow: featured ? "var(--shadow-lg)" : "none",
    }}>
      <div>
        <div style={{ fontFamily: "var(--font-bold)", fontWeight: 700, fontSize: 22, color: featured ? "#fff" : "var(--text-title)" }}>{name}</div>
        <div style={{ fontFamily: "var(--font-light)", fontWeight: 300, fontSize: 14, opacity: featured ? 0.85 : 1, color: featured ? "#fff" : "var(--text-caption)" }}>3 team members</div>
      </div>
      <div style={{ fontFamily: "var(--font-bold)", fontWeight: 700, fontSize: 34, color: featured ? "#fff" : "var(--text-title)" }}>
        ${cycle === "yearly" ? (name === "Basic" ? 0 : name === "Extra" ? 12 : 24) : (name === "Basic" ? 0 : name === "Extra" ? 15 : 29)}<span style={{ fontSize: 16, fontWeight: 400 }}>/mo</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {["Unlimited projects", "Advanced analytics", "Priority support"].map((f) => (
          <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-normal)", fontSize: 14 }}>
            <Check light={featured} />{f}
          </div>
        ))}
      </div>
      {featured
        ? <button style={{ height: 40, border: "none", borderRadius: "var(--radius-md)", background: "#fff", color: "var(--colour-alternativepurple-600)", fontFamily: "var(--font-normal)", fontSize: 14, cursor: "pointer", fontWeight: 700 }}>Get started</button>
        : <Button hierarchy="primary" fullWidth>Get started</Button>}
    </div>
  );

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h2 className="sd-display-sm" style={{ margin: 0 }}>Pricing</h2>
        <p style={{ margin: "8px 0 18px", fontFamily: "var(--font-normal)", fontSize: 15, color: "var(--text-subtitle)" }}>
          No credit card required. Every plan includes a 30-day trial of all Pro features.
        </p>
        <div style={{ display: "inline-flex", gap: 4, padding: 4, background: "var(--surface-secondary)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)" }}>
          {["monthly", "yearly"].map((c) => (
            <button key={c} onClick={() => setCycle(c)} style={{
              height: 32, padding: "0 16px", border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer",
              textTransform: "capitalize", fontFamily: "var(--font-normal)", fontSize: 14,
              background: cycle === c ? "var(--surface-raised)" : "transparent",
              color: cycle === c ? "var(--text-title)" : "var(--text-caption)",
              boxShadow: cycle === c ? "var(--shadow-xs)" : "none",
            }}>{c}</button>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, alignItems: "center" }}>
        {plans.map((p) => <Plan key={p.name} {...p} />)}
      </div>
    </div>
  );
}

window.ProductCardsView = ProductCardsView;
