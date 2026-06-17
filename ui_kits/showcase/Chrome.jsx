// Sandhata showcase chrome: top bar, hero, category nav, view sub-nav, colour-scheme switcher.

const SchemeOptions = [
  { key: "blue", label: "Blue", color: "var(--colour-primaryblue-500)" },
  { key: "purple", label: "Purple", color: "var(--colour-alternativepurple-500)" },
  { key: "cyan", label: "Cyan", color: "var(--colour-secondarycyan-500)" },
  { key: "rose", label: "Rose", color: "var(--colour-alternativerosepink-500)" },
];

function Ico({ d, size = 16, stroke = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      {d}
    </svg>
  );
}

function TopBar() {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      height: 72, padding: "0 32px", borderBottom: "1px solid var(--border-subtle)",
      background: "var(--surface-page)",
    }}>
      <img src="../../assets/logo/sandhata-logo.svg" alt="Sandhata" style={{ height: 30 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8, width: 340, height: 38, padding: "0 12px",
          border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", color: "var(--icon-secondary)",
        }}>
          <Ico d={<><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>} />
          <span style={{ fontFamily: "var(--font-normal)", fontSize: 14, color: "var(--text-caption)" }}>Search anything here</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-subtitle)" }}>
          <Ico d={<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 21.13V25" />} size={18} />
          <span style={{ fontFamily: "var(--font-normal)", fontSize: 14 }}>95.7k</span>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  const [copied, setCopied] = React.useState(false);
  return (
    <div style={{ textAlign: "center", padding: "56px 24px 40px", background: "var(--gradient-hero)" }}>
      <h1 className="sd-display-md" style={{ margin: 0 }}>Sandhata Design System</h1>
      <p style={{ margin: "12px auto 28px", maxWidth: 460, fontFamily: "var(--font-normal)", fontSize: "var(--body-large-size)", color: "var(--text-subtitle)" }}>
        A set of beautifully designed components that you can customise, extend, and build on.
      </p>
      <div style={{ display: "flex", gap: 16, justifyContent: "center", alignItems: "center" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 12, height: 40, padding: "0 8px 0 14px",
          background: "var(--surface-raised)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)",
        }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-body)" }}>npm install sandhata-ui</span>
          <button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1200); }}
            style={{ display: "inline-flex", border: "none", background: "transparent", cursor: "pointer", color: "var(--icon-secondary)" }} aria-label="Copy">
            <Ico d={copied ? <polyline points="20 6 9 17 4 12" /> : <><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>} />
          </button>
        </div>
        <a href="../../docs/index.html" style={{ fontFamily: "var(--font-normal)", fontSize: 15, color: "var(--text-body)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
          View documentation <Ico d={<><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>} size={14} />
        </a>
      </div>
    </div>
  );
}

function CategoryNav({ scheme, setScheme }) {
  const cats = ["All components", "Base components", "Complex components", "Colour", "Templates"];
  const [active, setActive] = React.useState("Base components");
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px", background: "var(--surface-secondary)" }}>
      <div style={{ display: "flex", gap: 6 }}>
        {cats.map((c) => {
          const on = c === active;
          return (
            <button key={c} onClick={() => setActive(c)} style={{
              display: "inline-flex", alignItems: "center", gap: 8, height: 38, padding: "0 14px",
              border: `1px solid ${on ? "var(--border-default)" : "transparent"}`, borderRadius: "var(--radius-md)",
              background: on ? "var(--surface-raised)" : "transparent", cursor: "pointer",
              fontFamily: "var(--font-normal)", fontSize: 14, color: on ? "var(--text-title)" : "var(--text-caption)",
              boxShadow: on ? "var(--shadow-xs)" : "none",
            }}>
              <Ico d={<><path d="M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6l-8-4Z" /></>} size={15} />
              {c}
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontFamily: "var(--font-normal)", fontSize: 13, color: "var(--text-caption)" }}>Colour scheme</span>
        <div style={{ display: "flex", gap: 4, padding: 4, background: "var(--surface-raised)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)" }}>
          {SchemeOptions.map((s) => (
            <button key={s.key} onClick={() => setScheme(s.key)} title={s.label} aria-label={s.label} style={{
              width: 26, height: 26, borderRadius: "var(--radius-sm)", cursor: "pointer",
              border: `2px solid ${scheme === s.key ? "var(--text-title)" : "transparent"}`,
              background: s.color, padding: 0,
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Ico, TopBar, Hero, CategoryNav, SchemeOptions });
