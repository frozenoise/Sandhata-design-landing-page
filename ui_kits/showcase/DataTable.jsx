// Sandhata showcase — interactive data table (bulk-edit pattern from the dashboard).

function DataTable() {
  const { Checkbox, IconButton, Badge, Button } = window.SandhataDesignSystem_081a0e;
  const seed = [
    { name: "John Adams", party: "None, Federalist", year: "1789–1797" },
    { name: "Thomas Jefferson", party: "Democratic-Republican", year: "1801–1809" },
    { name: "James Madison", party: "Democratic-Republican", year: "1809–1817" },
    { name: "Andrew Jackson", party: "Democrat", year: "1829–1837" },
    { name: "William H. Harrison", party: "Whig", year: "1841" },
    { name: "Abraham Lincoln", party: "Republican", year: "1861–1865" },
  ];
  const [sel, setSel] = React.useState({});
  const [page, setPage] = React.useState(1);
  const allOn = seed.every((_, i) => sel[i]);
  const Th = ({ children, w }) => (
    <th style={{ textAlign: "left", padding: "12px 16px", width: w, fontFamily: "var(--font-bold)", fontWeight: 700, fontSize: 13, color: "var(--text-subtitle)", borderBottom: "1px solid var(--border-subtle)" }}>{children}</th>
  );
  const Td = ({ children, muted }) => (
    <td style={{ padding: "12px 16px", fontFamily: "var(--font-normal)", fontSize: 14, color: muted ? "var(--text-caption)" : "var(--text-body)", borderBottom: "1px solid var(--border-subtle)" }}>{children}</td>
  );
  const Edit = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>;
  const Trash = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>;
  const Dots = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="12" cy="19" r="1.6" /></svg>;

  return (
    <div style={{ border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--surface-raised)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid var(--border-subtle)" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-bold)", fontWeight: 700, fontSize: 14, color: "var(--text-title)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7h18M3 12h18M3 17h12" /></svg>
          Bulk Edit
        </span>
        <Button size="small" hierarchy="primary">Add row</Button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <Th w="44"><Checkbox checked={allOn} onChange={() => { const v = !allOn; const next = {}; seed.forEach((_, i) => next[i] = v); setSel(next); }} /></Th>
            <Th>Name</Th><Th>Party</Th><Th>Year</Th><Th w="120">Actions</Th>
          </tr>
        </thead>
        <tbody>
          {seed.map((r, i) => {
            const on = !!sel[i];
            return (
              <tr key={i} style={{ background: on ? "var(--colour-primaryblue-50)" : "transparent" }}>
                <Td><Checkbox checked={on} onChange={() => setSel({ ...sel, [i]: !on })} /></Td>
                <Td>{r.name}</Td>
                <Td muted>{r.party}</Td>
                <Td muted>{r.year}</Td>
                <Td>
                  <div style={{ display: "flex", gap: 2 }}>
                    <IconButton size="small" icon={<Edit />} ariaLabel="Edit" hierarchy="ghost" />
                    <IconButton size="small" icon={<Trash />} ariaLabel="Delete" hierarchy="danger" />
                    <IconButton size="small" icon={<Dots />} ariaLabel="More" hierarchy="ghost" />
                  </div>
                </Td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 16, padding: "12px 16px" }}>
        <span style={{ fontFamily: "var(--font-normal)", fontSize: 13, color: "var(--text-caption)" }}>Rows per page 6</span>
        <div style={{ display: "flex", gap: 4 }}>
          {[1, 2, 3, 4, 5].map((p) => (
            <button key={p} onClick={() => setPage(p)} style={{
              width: 30, height: 30, borderRadius: "var(--radius-sm)", cursor: "pointer",
              border: `1px solid ${p === page ? "var(--colour-primaryblue-500)" : "var(--border-default)"}`,
              background: p === page ? "var(--colour-primaryblue-500)" : "transparent",
              color: p === page ? "#fff" : "var(--text-body)", fontFamily: "var(--font-normal)", fontSize: 13,
            }}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

window.DataTable = DataTable;
