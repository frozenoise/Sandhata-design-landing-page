// Sandhata showcase — Dashboard view: stat header, charts, data table.

function DashboardView() {
  const { Card, StatCard, Badge } = window.SandhataDesignSystem_081a0e;
  const Trend = () => (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "var(--font-normal)", fontSize: 12, color: "var(--text-success)" }}>
      Trending up by 5.2% this month
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 17 9 11 13 15 21 7" /><polyline points="14 7 21 7 21 14" /></svg>
    </span>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Interactive line chart */}
      <Card padding={0}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "20px 24px 0" }}>
          <div>
            <div className="sd-h2">Line Chart — Interactive</div>
            <div style={{ marginTop: 4, fontFamily: "var(--font-light)", fontWeight: 300, fontSize: 14, color: "var(--text-caption)" }}>Showing total visitors for the last 3 months</div>
          </div>
          <div style={{ display: "flex", gap: 0, border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
            <div style={{ padding: "10px 22px", borderRight: "1px solid var(--border-subtle)", background: "var(--surface-secondary)" }}>
              <div style={{ fontFamily: "var(--font-normal)", fontSize: 12, color: "var(--text-caption)" }}>Desktop</div>
              <div style={{ fontFamily: "var(--font-bold)", fontWeight: 700, fontSize: 22, color: "var(--text-title)" }}>24,828</div>
            </div>
            <div style={{ padding: "10px 22px" }}>
              <div style={{ fontFamily: "var(--font-normal)", fontSize: 12, color: "var(--text-caption)" }}>Mobile</div>
              <div style={{ fontFamily: "var(--font-bold)", fontWeight: 700, fontSize: 22, color: "var(--text-title)" }}>25,010</div>
            </div>
          </div>
        </div>
        <div style={{ padding: "8px 12px 16px" }}>
          <window.LineChart height={210} color="var(--colour-alternativepurple-400)" seed={3} />
          <div style={{ display: "flex", justifyContent: "space-between", padding: "0 12px", fontFamily: "var(--font-normal)", fontSize: 11, color: "var(--text-caption)" }}>
            {["Apr 5","Apr 15","Apr 25","May 5","May 15","May 25","Jun 4","Jun 14","Jun 24"].map((m) => <span key={m}>{m}</span>)}
          </div>
        </div>
      </Card>

      {/* Three chart cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
        <Card>
          <div className="sd-h3" style={{ fontFamily: "var(--font-bold)", fontWeight: 700 }}>Radar Chart</div>
          <div style={{ fontFamily: "var(--font-light)", fontWeight: 300, fontSize: 13, color: "var(--text-caption)", marginBottom: 8 }}>Last 6 months</div>
          <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}><window.RadarChart /></div>
          <Trend />
        </Card>
        <Card>
          <div className="sd-h3" style={{ fontFamily: "var(--font-bold)", fontWeight: 700 }}>Radial Chart</div>
          <div style={{ fontFamily: "var(--font-light)", fontWeight: 300, fontSize: 13, color: "var(--text-caption)", marginBottom: 8 }}>January – June 2024</div>
          <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}><window.RadialChart /></div>
          <Trend />
        </Card>
        <Card>
          <div className="sd-h3" style={{ fontFamily: "var(--font-bold)", fontWeight: 700 }}>Pie Chart</div>
          <div style={{ fontFamily: "var(--font-light)", fontWeight: 300, fontSize: 13, color: "var(--text-caption)", marginBottom: 8 }}>January – June 2024</div>
          <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}><window.PieChart /></div>
          <Trend />
        </Card>
      </div>

      {/* Data table */}
      <window.DataTable />
    </div>
  );
}

window.DashboardView = DashboardView;
