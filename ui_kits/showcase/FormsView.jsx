// Sandhata showcase — Forms view: small, standard and stepper forms.

function FormsView() {
  const { Card, Input, Textarea, Button, Badge } = window.SandhataDesignSystem_081a0e;
  const colTitle = (t) => <div style={{ fontFamily: "var(--font-normal)", fontSize: 13, color: "var(--text-caption)", marginBottom: 10 }}>{t}</div>;
  const FormHead = () => (
    <div style={{ marginBottom: 18 }}>
      <div className="sd-h2">Form Title</div>
      <div style={{ marginTop: 4, fontFamily: "var(--font-light)", fontWeight: 300, fontSize: 14, color: "var(--text-caption)" }}>A brief description of the form's purpose</div>
    </div>
  );
  const Upload = () => (
    <div style={{ border: "1.5px dashed var(--border-default)", borderRadius: "var(--radius-md)", padding: "26px 16px", textAlign: "center", color: "var(--text-caption)" }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--icon-action)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
      <div style={{ marginTop: 8, fontFamily: "var(--font-normal)", fontSize: 14, color: "var(--text-body)" }}><b style={{ color: "var(--text-action)" }}>Click to Upload</b> or drag and drop</div>
      <div style={{ fontFamily: "var(--font-normal)", fontSize: 12 }}>(Max. File size: 25 MB)</div>
    </div>
  );
  const Step = ({ n, label, state }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
      <span style={{ fontFamily: state === "done" || state === "active" ? "var(--font-bold)" : "var(--font-normal)", fontWeight: state === "done" || state === "active" ? 700 : 400, fontSize: 14, color: state === "active" ? "var(--text-action)" : state === "done" ? "var(--text-title)" : "var(--text-caption)" }}>Step {n}</span>
      {n < 3 && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--icon-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>}
    </div>
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.3fr", gap: 24, alignItems: "start" }}>
      {/* Small */}
      <div>
        {colTitle("Simple / Small Size Form")}
        <Card>
          <FormHead />
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input label="Field label" placeholder="John Doe" helper="Help or instruction text goes here" />
            <Input label="Field label" placeholder="John Doe" helper="Help or instruction text goes here" />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <Button hierarchy="tertiary">Cancel</Button>
              <Button hierarchy="primary">Submit</Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Standard */}
      <div>
        {colTitle("Standard / Mid Size Form")}
        <Card>
          <FormHead />
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input label="Single date field" placeholder="DD/MM/YYYY" iconRight={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>} helper="Help or instruction text goes here" />
            <Textarea label="Field label" placeholder="Enter your text here" rows={2} helper="Help or instruction text goes here" />
            <div>
              <div style={{ fontFamily: "var(--font-bold)", fontWeight: 700, fontSize: 16, color: "var(--text-title)", marginBottom: 8 }}>Upload files</div>
              <Upload />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <Button hierarchy="tertiary">Cancel</Button>
              <Button hierarchy="tertiary">Reset</Button>
              <Button hierarchy="primary">Submit</Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Stepper */}
      <div>
        {colTitle("Complex / Stepper Form")}
        <Card>
          <FormHead />
          <div style={{ display: "flex", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", padding: "10px 14px", marginBottom: 18 }}>
            <Step n={1} state="done" /><Step n={2} state="active" /><Step n={3} state="todo" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Input label="Single date field" placeholder="DD/MM/YYYY" helper="Help or instruction text goes here" />
            <Input label="Mandatory field label" required error="This is a mandatory field!" placeholder="John Doe" />
            <Input label="Field label" placeholder="Placeholder text" helper="Help or instruction text goes here" />
            <Input label="Field label" placeholder="John Doe" helper="Help or instruction text goes here" />
          </div>
          <div style={{ margin: "16px 0" }}>
            <div style={{ fontFamily: "var(--font-bold)", fontWeight: 700, fontSize: 16, color: "var(--text-title)", marginBottom: 8 }}>Upload files</div>
            <Upload />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button hierarchy="tertiary">Cancel</Button>
            <Button hierarchy="tertiary">Reset</Button>
            <Button hierarchy="primary" iconRight={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>}>Next</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

window.FormsView = FormsView;
