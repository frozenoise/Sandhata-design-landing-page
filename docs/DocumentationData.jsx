// Sandhata documentation — design-system pages (foundations, guidelines, theming).
// Same shape as the components registry: { id, name, description, sections:[...] }.

const Sw = ({ c, name, hex }) => (
  <div style={{ width: 96 }}>
    <div style={{ height: 52, borderRadius: "var(--radius-md)", background: c, border: "1px solid rgba(20,22,24,0.08)" }} />
    <div style={{ font: "700 12px/1.5 var(--font-bold)", color: "var(--text-title)", marginTop: 6 }}>{name}</div>
    <div style={{ font: "11px/1.4 var(--font-mono)", color: "var(--text-caption)" }}>{hex}</div>
  </div>
);
const SwRow = ({ children }) => <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>{children}</div>;

const docOverview = {
  id: "overview", name: "Overview",
  description: "Sandhata UI is a set of beautifully designed components that you can customise, extend, and build on. It spans colour, type, spacing and elevation tokens, reusable React primitives, and full product surfaces.",
  sections: [
    {
      id: "quick-start", title: "Quick start",
      bullets: [
        ["Link the stylesheet", "styles.css imports every token and font file"],
        ["Load the bundle", "components live on window.SandhataDesignSystem_081a0e"],
        ["Tokens first", "prefer semantic aliases over raw scale steps"],
      ],
      code: `<link rel="stylesheet" href="styles.css" />\n<script src="_ds_bundle.js"></script>\n\nconst { Button, Card } = window.SandhataDesignSystem_081a0e;\n\n<Button hierarchy="primary">Get started</Button>`,
    },
    {
      id: "whats-included", title: "What's included",
      bullets: [
        ["Foundations", "colour scales, type, 8-point spacing, radii, elevation, motion"],
        ["Components", "buttons, forms, data display, feedback and navigation primitives"],
        ["UI kit", "dashboard, forms and pricing surfaces built from the components"],
        ["Docs", "this site — component API references and these guidelines"],
      ],
    },
    {
      id: "principles", title: "Principles",
      bullets: [
        ["Crisp and enterprise-grade", "restrained radii, hairline borders, faint shadows"],
        ["White space dominates", "colour is used sparingly and purposefully"],
        ["Tokens first", "semantic aliases keep surfaces re-themeable"],
        ["Quiet motion", "fast, functional easing — no bounces, no decorative loops"],
      ],
    },
  ],
};

const docColour = {
  id: "colour", name: "Colour",
  description: "Clean, cool and corporate. A royal electric blue is the action colour; neutrals are slightly cool greys. Data visualisation leans on violet, blues and cyan.",
  sections: [
    {
      id: "brand-action", title: "Brand & action",
      bullets: [
        ["Primary blue 500", "the action colour — buttons, links, selected states"],
        ["Primary blue 400", "brighter emphasis variant"],
        ["Alternative purple 500", "focus ring and data-viz lead"],
        ["Secondary blue 500", "deep navy for dense chrome"],
      ],
      demo: () => (<SwRow>
        <Sw c="var(--colour-primaryblue-500)" name="primaryblue-500" hex="#0036DD" />
        <Sw c="var(--colour-primaryblue-400)" name="primaryblue-400" hex="#445CFF" />
        <Sw c="var(--colour-alternativepurple-500)" name="purple-500" hex="#602DEA" />
        <Sw c="var(--colour-secondaryblue-500)" name="secondaryblue-500" hex="#1F2A54" />
      </SwRow>),
    },
    {
      id: "neutrals", title: "Neutral scale",
      note: "Slightly cool greys, 0–950. Text sits at 600–900; borders at 200–300; surfaces at 0–100.",
      demo: () => (<SwRow>
        {[["0", "#FFFFFF"], ["50", "#F5F6F8"], ["100", "#E9EBEE"], ["200", "#D5DBDE"], ["300", "#C0C7CF"], ["500", "#98A3AD"], ["700", "#585F65"], ["900", "#202225"], ["950", "#141618"]].map(([s, hex]) => (
          <Sw key={s} c={`var(--colour-neutral-${s})`} name={`neutral-${s}`} hex={hex} />
        ))}
      </SwRow>),
    },
    {
      id: "status", title: "Status colours",
      demo: () => (<SwRow>
        <Sw c="var(--colour-success-500)" name="success-500" hex="#00A300" />
        <Sw c="var(--colour-error-500)" name="error-500" hex="#D21B00" />
        <Sw c="var(--colour-alert-500)" name="alert-500" hex="#FFC228" />
        <Sw c="var(--colour-info-500)" name="info-500" hex="#508FED" />
      </SwRow>),
    },
    {
      id: "semantic", title: "Semantic aliases",
      note: "Reference these in product UI, not the raw scales. Aliases re-map automatically in the dark theme.",
      table: {
        head: ["Token", "Maps to", "Use"],
        rows: [
          ["--surface-page", "neutral-0", "Page background"],
          ["--text-body", "neutral-800", "Body copy"],
          ["--text-action", "primaryblue-500", "Links and actions"],
          ["--background-action", "primaryblue-500", "Primary buttons"],
          ["--border-subtle", "neutral-200", "Hairlines and card borders"],
          ["--focus-ring", "purple-500", "Keyboard focus halo"],
        ],
        codeCol: 0,
      },
    },
    {
      id: "data-viz", title: "Data visualisation",
      note: "Charts run violet → blue → cyan, with soft area fills fading to transparent.",
      demo: () => (<SwRow>
        {[1, 2, 3, 4, 5, 6].map((n) => <Sw key={n} c={`var(--viz-${n})`} name={`viz-${n}`} hex={["#602DEA", "#445CFF", "#00D4D4", "#00208F", "#9A8AF5", "#608FEC"][n - 1]} />)}
      </SwRow>),
    },
    {
      id: "gradient", title: "Brand gradient",
      note: "Magenta → deep blue, reserved for brand and marketing surfaces. Product UI stays white.",
      demo: () => (<div style={{ height: 72, borderRadius: "var(--radius-lg)", background: "var(--gradient-brand)" }} />),
      code: `background: var(--gradient-brand);\n/* linear-gradient(114.77deg, #DF00C1 1.85%, #002289 98.15%) */`,
    },
  ],
};

const docTypography = {
  id: "typography", name: "Typography",
  description: "Akkurat throughout — Light for soft body and captions, Regular for UI, Bold for display and headings, Mono for code and numbers. The scale follows an 8-point rhythm.",
  sections: [
    {
      id: "families", title: "Families",
      bullets: [
        ["Akkurat Bold", "display and headings, tight negative tracking"],
        ["Akkurat Regular", "UI and body copy"],
        ["Akkurat Light", "soft body, captions, secondary copy"],
        ["Akkurat Mono", "code, tokens and tabular numbers"],
      ],
      demo: () => (<div style={{ display: "grid", gap: 14 }}>
        <div style={{ font: "700 32px/1.2 var(--font-bold)", letterSpacing: "-0.25px", color: "var(--text-title)" }}>Beautifully designed components</div>
        <div style={{ font: "16px/1.5 var(--font-normal)", color: "var(--text-body)" }}>Components you can customise, extend, and build on.</div>
        <div style={{ font: "300 16px/1.5 var(--font-light)", color: "var(--text-subtitle)" }}>Help or instruction text goes here.</div>
        <div style={{ font: "13px/1.5 var(--font-mono)", color: "var(--text-body)" }}>--colour-primaryblue-500: rgb(0, 54, 221);</div>
      </div>),
    },
    {
      id: "scale", title: "Type scale",
      table: {
        head: ["Token", "Size / line", "Tracking", "Family"],
        rows: [
          ["display-large", "48 / 64", "−1px", "Bold"],
          ["display-medium", "40 / 48", "−0.5px", "Bold"],
          ["display-small", "32 / 40", "−0.25px", "Bold"],
          ["heading-h1", "24 / 32", "−0.25px", "Bold"],
          ["heading-h2", "20 / 24", "−0.25px", "Bold"],
          ["heading-h3", "16 / 20", "0", "Bold"],
          ["body-large", "16 / 24", "0", "Regular"],
          ["body-medium", "14 / 20", "0", "Regular"],
          ["body-small", "12 / 16", "0", "Regular"],
          ["caption", "12 / 16", "0.1px", "Light"],
          ["label", "12 / 16", "0.5px", "Regular"],
          ["code", "12 / 16", "0", "Mono"],
        ],
        codeCol: 0,
      },
    },
    {
      id: "type-usage", title: "Usage",
      bullets: [
        ["Sentence case everywhere", "headings, buttons, labels, tabs — never Title Case"],
        ["Display sizes carry tight negative tracking", "body is neutral"],
        ["Comfortable line lengths", "body copy maxes around 720px"],
      ],
      code: `h1 { font: 700 var(--heading-h1-size)/var(--heading-h1-line) var(--font-bold); }\nbody { font: var(--body-medium-size)/var(--body-medium-line) var(--font-normal); }`,
    },
  ],
};

const docSpacing = {
  id: "spacing", name: "Spacing & layout",
  description: "A strict 8-point grid with half-steps. Generous internal card padding and a centred max-width container keep layouts calm and consistent.",
  sections: [
    {
      id: "grid", title: "8-point grid",
      demo: () => (<div style={{ display: "grid", gap: 10 }}>
        {[["space-1", 4], ["space-2", 8], ["space-3", 12], ["space-4", 16], ["space-6", 24], ["space-8", 32], ["space-12", 48], ["space-16", 64]].map(([t, px]) => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <code style={{ font: "12px/1 var(--font-mono)", color: "var(--c-kw)", width: 84, flexShrink: 0 }}>{t}</code>
            <div style={{ width: px, height: 16, background: "var(--colour-primaryblue-200)", borderRadius: 2, flexShrink: 0 }} />
            <span style={{ font: "12px/1 var(--font-mono)", color: "var(--text-caption)" }}>{px}px</span>
          </div>
        ))}
      </div>),
    },
    {
      id: "layout", title: "Layout",
      bullets: [
        ["Container", "centred max-width 1320px with 24px gutters"],
        ["Card padding", "24px internal padding as the default"],
        ["Gutters", "24–32px between major regions"],
      ],
      code: `.container { max-width: var(--container-max); padding: 0 var(--container-pad); margin: 0 auto; }`,
    },
  ],
};

const docShape = {
  id: "shape", name: "Radius & elevation",
  description: "Restrained corners and soft, low-contrast shadows. Cards lean on a 1px subtle border with a faint shadow — never heavy elevation.",
  sections: [
    {
      id: "radius", title: "Border radius",
      table: {
        head: ["Token", "Value", "Use"],
        rows: [
          ["--radius-xs", "2px", "Code pills, tiny chips"],
          ["--radius-sm", "4px", "Inputs, inner elements"],
          ["--radius-md", "6px", "Buttons"],
          ["--radius-lg", "8px", "Cards"],
          ["--radius-xl", "12px", "Featured / pricing cards"],
          ["--radius-pill", "999px", "Badges, avatars, toggles"],
        ],
        codeCol: 0,
      },
      demo: () => (<SwRow>
        {[["sm", "4px"], ["md", "6px"], ["lg", "8px"], ["xl", "12px"], ["pill", "999px"]].map(([t, v]) => (
          <div key={t} style={{ textAlign: "center" }}>
            <div style={{ width: 72, height: 52, background: "var(--colour-primaryblue-50)", border: "1px solid var(--colour-primaryblue-200)", borderRadius: `var(--radius-${t})` }} />
            <div style={{ font: "11px/1.6 var(--font-mono)", color: "var(--text-caption)", marginTop: 6 }}>{t} · {v}</div>
          </div>
        ))}
      </SwRow>),
    },
    {
      id: "shadows", title: "Shadows",
      note: "Soft neutral shadows, rgba(20,22,24,…). The only coloured glow is the focus ring — a 3px violet halo.",
      demo: () => (<SwRow>
        {["xs", "sm", "md", "lg"].map((s) => (
          <div key={s} style={{ width: 110, height: 64, background: "#fff", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", boxShadow: `var(--shadow-${s})`, display: "flex", alignItems: "center", justifyContent: "center", font: "12px/1 var(--font-mono)", color: "var(--text-caption)" }}>shadow-{s}</div>
        ))}
        <div style={{ width: 110, height: 64, background: "#fff", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-focus)", display: "flex", alignItems: "center", justifyContent: "center", font: "12px/1 var(--font-mono)", color: "var(--text-caption)" }}>focus</div>
      </SwRow>),
    },
    {
      id: "borders", title: "Borders & dividers",
      bullets: [
        ["Hairlines", "1px neutral-200/300 for dividers and card borders"],
        ["Tables", "bordered grids with hairline rows"],
        ["Emphasis", "2px for tab underlines and selected accents"],
      ],
    },
  ],
};

const docMotion = {
  id: "motion", name: "Motion",
  description: "Quiet and functional. Standard easing, fast for hovers, base for toggles. No bounces, no infinite decorative loops.",
  sections: [
    {
      id: "tokens", title: "Easing & duration",
      table: {
        head: ["Token", "Value", "Use"],
        rows: [
          ["--ease-standard", "cubic-bezier(0.2, 0, 0, 1)", "Default for most transitions"],
          ["--ease-entrance", "cubic-bezier(0, 0, 0.2, 1)", "Elements entering"],
          ["--ease-exit", "cubic-bezier(0.4, 0, 1, 1)", "Elements leaving"],
          ["--duration-fast", "120ms", "Hovers, small state changes"],
          ["--duration-base", "200ms", "Toggles, reveals"],
          ["--duration-slow", "320ms", "Large surfaces, overlays"],
        ],
        codeCol: 0,
      },
      code: `transition: background var(--duration-fast) var(--ease-standard);`,
    },
  ],
};

const docContent = {
  id: "content", name: "Content & voice",
  description: "Confident, plain, builder-to-builder. Short, active, benefit-first copy that addresses the reader as you.",
  sections: [
    {
      id: "voice", title: "Voice & tone",
      bullets: [
        ["Benefit-first", "\u201cA set of beautifully designed components that you can customise, extend, and build on.\u201d"],
        ["Second person", "components you can customise — avoid \u201cwe\u201d and \u201cour\u201d"],
        ["Calm and instructional", "helper text is neutral and descriptive, never cute"],
        ["No emoji", "in UI or copy, ever"],
      ],
    },
    {
      id: "mechanics", title: "Mechanics",
      bullets: [
        ["Sentence case", "headings, buttons, labels, tabs — proper nouns only"],
        ["British spelling", "colour, customise, organise"],
        ["Numbers", "grouped with commas (24,828); compact currency ($0/mo)"],
        ["Errors", "direct — \u201cThis is a mandatory field!\u201d"],
        ["CTAs", "verb-first and short — Submit, Get started, View documentation"],
      ],
    },
  ],
};

const docBrand = {
  id: "brand", name: "Iconography & brand",
  description: "A custom icon library drawn on a 24px grid; the dominant UI style is a clean 1.5–2px single-weight stroke with rounded caps and joins.",
  sections: [
    {
      id: "logo", title: "Logo",
      bullets: [
        ["Lockup", "sandhata-logo.svg for headers and marketing"],
        ["Mark", "sandhata-mark.svg — cyan twist + orange dot — for square and favicon use"],
        ["Mark colours", "cyan #00A4DC, orange #F68136, ink #48484F"],
      ],
      demo: () => (<div style={{ display: "flex", alignItems: "center", gap: 40 }}>
        <img src="../assets/logo/sandhata-logo.svg" alt="Sandhata logo" style={{ height: 36 }} />
        <img src="../assets/logo/sandhata-mark.svg" alt="Sandhata mark" style={{ height: 44 }} />
      </div>),
    },
    {
      id: "icons", title: "Icons",
      bullets: [
        ["24px grid", "1.5–2px strokes, rounded caps and joins"],
        ["Style", "Light (Stroke) is the dominant UI set; Lucide-style icons are the closest substitute"],
        ["No glyph icons", "never use emoji or unicode characters as icons"],
      ],
      code: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"\n     stroke="currentColor" stroke-width="2" stroke-linecap="round">\n  <line x1="12" y1="5" x2="12" y2="19" />\n  <line x1="5" y1="12" x2="19" y2="12" />\n</svg>`,
    },
  ],
};

const docTheming = {
  id: "theming", name: "Theming",
  description: "Every surface reads semantic aliases, so re-theming is a matter of remapping tokens. A dark theme ships with the system.",
  sections: [
    {
      id: "dark", title: "Dark theme",
      note: "Apply data-theme=\"dark\" (or class .dark) to any container; the semantic aliases remap automatically.",
      demo: () => (<div className="dark" style={{ background: "var(--surface-page)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: 24 }}>
        <div style={{ font: "700 16px/1.4 var(--font-bold)", color: "var(--text-title)", marginBottom: 6 }}>Dark surface</div>
        <div style={{ font: "14px/1.5 var(--font-normal)", color: "var(--text-subtitle)" }}>Same components, same aliases — remapped values.</div>
      </div>),
      code: `<body data-theme="dark">\n  <!-- or scope it: -->\n  <section class="dark">…</section>\n</body>`,
    },
    {
      id: "accent", title: "Re-skinning the action colour",
      bullets: [
        ["Override --background-action and friends", "the showcase's accent switcher does exactly this"],
        ["Keep contrast", "action colours should pass 4.5:1 on white"],
      ],
      code: `:root[data-accent="purple"] {\n  --background-action: var(--colour-alternativepurple-500);\n  --background-action-hover: var(--colour-alternativepurple-700);\n  --text-action: var(--colour-alternativepurple-500);\n}`,
    },
  ],
};

window.SANDHATA_DOC_PAGES = [
  { label: "Getting started", items: [docOverview] },
  { label: "Foundations", items: [docColour, docTypography, docSpacing, docShape, docMotion] },
  { label: "Guidelines", items: [docContent, docBrand, docTheming] },
];
