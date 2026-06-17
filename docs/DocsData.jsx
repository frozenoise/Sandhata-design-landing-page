// Sandhata docs — component documentation registry.
// Each component: { id, name, description, variants, sections:[...], props:[...] }
// "variants" is the short descriptor shown in the All Components grid.

const S = () => window.SandhataDesignSystem_081a0e;

const Plus   = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>);
const Pencil = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>);
const ArrowR = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>);
const Search = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>);

// ── Helper builders ──────────────────────────────────────────────────────────
function usage(demo, code) { return { id:"usage", title:"Usage", demo, code }; }
function comingSoon(name) {
  return [{
    id: "coming-soon", title: "Coming soon",
    demo: () => (
      <div style={{
        padding: "40px 24px", textAlign: "center",
        border: "1.5px dashed var(--border-subtle)", borderRadius: "var(--radius-lg)",
      }}>
        <div style={{ font:"700 15px/1 var(--font-bold)", color:"var(--text-title)", marginBottom:8 }}>
          {name}
        </div>
        <div style={{ font:"14px/1.5 var(--font-normal)", color:"var(--text-caption)" }}>
          This component is in progress. Live documentation will appear here when it ships.
        </div>
      </div>
    ),
  }];
}

// ── INPUTS & FORM CONTROLS ───────────────────────────────────────────────────

const Button = {
  id:"button", name:"Button", variants:"5 hierarchies · 3 sizes · 6 states",
  description:"Buttons trigger actions or events. They guide users toward key interactions and are used across forms, dialogs, and navigation flows.",
  sections:[
    {
      id:"when-to-use", title:"When to Use",
      bullets:[
        ["Container","Visual background and shape"],
        ["Label","Describes the action"],
        ["Left Icon (optional)","Supports recognition"],
        ["Right Icon (optional)","Indicates direction or outcome"],
      ],
      demo: () => { const { Button:B } = S(); return <B hierarchy="primary" iconLeft={<Plus/>} iconRight={<ArrowR/>}>Button</B>; },
      code:`import { Button } from "sandhata-ui";\n\nconst Example = () => (\n  <Button hierarchy="primary" iconLeft={<Plus/>}>Button</Button>\n);`,
    },
    {
      id:"hierarchy", title:"Hierarchy",
      bullets:[
        ["Primary","Main call-to-action on a page"],
        ["Secondary","Supporting actions"],
        ["Tertiary","Low emphasis actions"],
        ["Ghost","Minimal, no background"],
        ["Danger","Destructive actions (delete, remove)"],
      ],
      demo: () => { const { Button:B } = S(); return (
        <div style={{ display:"flex", gap:16, flexWrap:"wrap", alignItems:"center" }}>
          <B hierarchy="primary">Button</B><B hierarchy="secondary">Button</B>
          <B hierarchy="tertiary">Button</B><B hierarchy="ghost">Button</B>
          <B hierarchy="danger">Button</B>
        </div>
      ); },
      code:`<Button hierarchy="primary">Button</Button>\n<Button hierarchy="secondary">Button</Button>\n<Button hierarchy="tertiary">Button</Button>\n<Button hierarchy="ghost">Button</Button>\n<Button hierarchy="danger">Button</Button>`,
    },
    {
      id:"sizes", title:"Sizes",
      bullets:[
        ["Large","High emphasis, landing pages or key actions"],
        ["Medium","Default size for most use cases"],
        ["Small","Dense layouts (tables, modals)"],
      ],
      demo: () => { const { Button:B } = S(); return (
        <div style={{ display:"flex", gap:16, alignItems:"center" }}>
          <B size="large">Button</B><B size="medium">Button</B><B size="small">Button</B>
        </div>
      ); },
      code:`<Button size="large">Button</Button>\n<Button size="medium">Button</Button>\n<Button size="small">Button</Button>`,
    },
    {
      id:"states", title:"States",
      table:{
        head:["State","Description"],
        rows:[["Default","Normal state"],["Hover","On pointer hover"],["Active","On click / pressed"],["Focus","Keyboard focus state"],["Disabled","Non-interactive"]],
        codeCol:0,
      },
      note:"All hierarchies inherit these state behaviours.",
      demo: () => { const { Button:B } = S(); return (
        <div style={{ display:"flex", gap:16, flexWrap:"wrap", alignItems:"center" }}>
          <B hierarchy="primary">Default</B><B hierarchy="secondary">Hover</B>
          <B hierarchy="inverse">Active</B><B disabled>Disabled</B>
          <B hierarchy="primary" style={{ boxShadow:"var(--shadow-focus)" }}>Focus</B>
        </div>
      ); },
      code:`<Button hierarchy="primary">Default</Button>\n<Button disabled>Disabled</Button>\n// Focus: 3px violet ring via --shadow-focus`,
    },
    {
      id:"variants", title:"Variants & Modifiers",
      bullets:[["With Left Icon",""],["With Right Icon",""],["Text Only",""],["Icon Only",""]],
      demo: () => { const { Button:B, IconButton } = S(); return (
        <div style={{ display:"flex", gap:16, alignItems:"center" }}>
          <B iconLeft={<Plus/>}>Button</B><B iconRight={<ArrowR/>}>Button</B><B>Button</B>
          <IconButton icon={<Plus/>} ariaLabel="Add" hierarchy="primary" />
        </div>
      ); },
      code:`<Button iconLeft={<Plus/>}>Button</Button>\n<Button iconRight={<ArrowR/>}>Button</Button>\n<Button>Button</Button>\n<IconButton icon={<Plus/>} ariaLabel="Add" hierarchy="primary" />`,
    },
  ],
  props:[
    ["hierarchy","enum","Primary, Secondary, Tertiary, Ghost, Danger, Inverse"],
    ["size","enum","Large, Medium, Small"],
    ["iconLeft","node","Icon rendered before the label"],
    ["iconRight","node","Icon rendered after the label"],
    ["fullWidth","boolean","Stretch to fill the container width"],
    ["disabled","boolean","Non-interactive state"],
  ],
};

const IconButtonDoc = {
  id:"icon-button", name:"Icon Button", variants:"5 hierarchies · 3 sizes",
  description:"A square button holding a single icon. Use for toolbars, table row actions and compact controls. Always provide an accessible label.",
  sections:[usage(
    () => { const { IconButton } = S(); return (
      <div style={{ display:"flex", gap:12 }}>
        <IconButton icon={<Pencil/>} ariaLabel="Edit" hierarchy="tertiary" />
        <IconButton icon={<Pencil/>} ariaLabel="Edit" hierarchy="primary" />
        <IconButton icon={<Pencil/>} ariaLabel="Edit" hierarchy="danger" />
      </div>
    ); },
    `<IconButton icon={<Pencil/>} ariaLabel="Edit" hierarchy="tertiary" />\n<IconButton icon={<Pencil/>} ariaLabel="Edit" hierarchy="primary" />`
  )],
  props:[["icon","node","Icon node"],["ariaLabel","string","Accessible label (required)"],["hierarchy","enum","Primary, Secondary, Tertiary, Ghost, Danger"],["size","enum","Small, Medium, Large"]],
};

const Input = {
  id:"text-input", name:"Single-line Text input", variants:"7 variants · 5 states · 3 sizes",
  description:"A labelled text field with built-in helper text and error handling — the standard Sandhata form control.",
  sections:[usage(
    () => { const { Input:I } = S(); return (
      <div style={{ display:"flex", flexDirection:"column", gap:16, maxWidth:360 }}>
        <I label="Field label" placeholder="John Doe" helper="Help or instruction text goes here" />
        <I label="Mandatory field" required error="This is a mandatory field!" placeholder="John Doe" />
      </div>
    ); },
    `<Input label="Field label" placeholder="John Doe"\n  helper="Help or instruction text goes here" />\n<Input label="Mandatory field" required\n  error="This is a mandatory field!" />`
  )],
  props:[["label","string","Label rendered above the control"],["helper","string","Helper / instruction text"],["error","string","Error message (red border + message)"],["required","boolean","Show required asterisk"],["size","enum","Small, Medium, Large"],["iconRight","node","Trailing icon"]],
};

const Textarea = {
  id:"textarea", name:"Multi-line Text input", variants:"7 variants · 5 states · 3 sizes",
  description:"Multi-line text field with the same label / helper / error anatomy as the text input.",
  sections:[usage(
    () => { const { Textarea:T } = S(); return (
      <div style={{ maxWidth:380 }}>
        <T label="Notes" placeholder="Enter your text here" rows={3} helper="Help or instruction text goes here" />
      </div>
    ); },
    `<Textarea label="Notes" rows={3}\n  placeholder="Enter your text here"\n  helper="Help or instruction text goes here" />`
  )],
  props:[["label","string","Field label"],["helper","string","Helper text"],["error","string","Error message"],["rows","number","Visible rows"]],
};

const NumericalInput = {
  id:"numerical-input", name:"Numerical input", variants:"7 variants · 5 states · 3 sizes",
  description:"A number input with optional increment / decrement controls, min/max constraints and formatting.",
  sections: comingSoon("Numerical input"),
  props:[["label","string","Field label"],["value","number","Current value"],["min","number","Minimum allowed"],["max","number","Maximum allowed"],["step","number","Increment step"],["onChange","func","Change handler"]],
};

const SelectDoc = {
  id:"dropdown", name:"Dropdown", variants:"7 variants · 5 states · 3 sizes",
  description:"A styled native select with label, chevron, helper and error states.",
  sections:[usage(
    () => { const { Select } = S(); return (
      <div style={{ maxWidth:320 }}>
        <Select label="Party" placeholder="Select party" options={["Federalist","Democratic-Republican","Whig"]} />
      </div>
    ); },
    `<Select label="Party" placeholder="Select party"\n  options={["Federalist","Democratic-Republican","Whig"]} />`
  )],
  props:[["label","string","Field label"],["options","array","string[] or {value,label}[]"],["value","string","Selected value"],["onChange","func","Change handler"],["size","enum","Small, Medium, Large"]],
};

const CheckboxDoc = {
  id:"checkbox", name:"Checkbox", variants:"4 states",
  description:"Checkbox with label. Supports checked, indeterminate and disabled states.",
  sections:[usage(
    () => { const { Checkbox } = S(); return (
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        <Checkbox label="Checked" checked /><Checkbox label="Indeterminate" indeterminate />
        <Checkbox label="Unchecked" /><Checkbox label="Disabled" disabled />
      </div>
    ); },
    `<Checkbox label="Remember me" checked={on} onChange={e => setOn(e.target.checked)} />\n<Checkbox label="Indeterminate" indeterminate />`
  )],
  props:[["label","string","Label text"],["checked","boolean","Checked state"],["indeterminate","boolean","Dash state"],["disabled","boolean","Non-interactive"],["onChange","func","Change handler"]],
};

const RadioDoc = {
  id:"radio", name:"Radio button", variants:"3 states",
  description:"Radio button with label. Share a `name` across a group so only one can be selected.",
  sections:[usage(
    () => { const { Radio } = S(); return (
      <div style={{ display:"flex", gap:20 }}>
        <Radio name="plan" label="Basic" /><Radio name="plan" label="Pro" checked /><Radio name="plan" label="Team" />
      </div>
    ); },
    `<Radio name="plan" label="Basic" />\n<Radio name="plan" label="Pro" checked />\n<Radio name="plan" label="Team" />`
  )],
  props:[["label","string","Label text"],["name","string","Group name"],["value","string","Value"],["checked","boolean","Selected"],["onChange","func","Change handler"]],
};

const SwitchDoc = {
  id:"switch", name:"Switch", variants:"2 states",
  description:"Toggle switch for binary on/off settings. Controlled via `checked` and `onChange(next)`.",
  sections:[usage(
    () => { const { Switch } = S(); const [a, setA] = React.useState(true); return (
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        <Switch checked={a} onChange={setA} label="Dark mode" /><Switch checked={false} label="Notifications" />
      </div>
    ); },
    `const [dark, setDark] = useState(true);\n<Switch checked={dark} onChange={setDark} label="Dark mode" />`
  )],
  props:[["checked","boolean","On/off state"],["onChange","func","(next: boolean) => void"],["label","string","Label text"],["disabled","boolean","Non-interactive"]],
};

const DateRangePicker = {
  id:"date-range-picker", name:"Date range picker", variants:"7 variants · 5 states · 3 sizes",
  description:"A two-field date range control — start and end — with a calendar popover. Supports keyboard navigation and locale formatting.",
  sections: comingSoon("Date range picker"),
  props:[["startLabel","string","Start date label"],["endLabel","string","End date label"],["value","object","{ start, end } date values"],["onChange","func","Change handler"],["minDate","string","Minimum selectable date"],["maxDate","string","Maximum selectable date"]],
};

const TagDoc = {
  id:"tag-input", name:"Tag input", variants:"2 tones",
  description:"Removable chips / tags. Pass `onRemove` to render a dismiss button.",
  sections:[usage(
    () => { const { Tag } = S(); return (
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        <Tag>Federalist</Tag><Tag tone="action" onRemove={() => {}}>Democratic-Republican</Tag><Tag onRemove={() => {}}>Whig</Tag>
      </div>
    ); },
    `<Tag>Federalist</Tag>\n<Tag tone="action" onRemove={() => drop(id)}>Democratic-Republican</Tag>`
  )],
  props:[["tone","enum","Neutral, Action"],["onRemove","func","Renders a dismiss button"]],
};

const UploadFiles = {
  id:"upload-files", name:"Upload files", variants:"3 variants · 4 states",
  description:"A drag-and-drop upload zone with file-type filtering, size limits and progress feedback.",
  sections: comingSoon("Upload files"),
  props:[["accept","string","MIME type filter (e.g. \"image/*\")"],["multiple","boolean","Allow multiple files"],["maxSize","number","Max file size in bytes"],["onFiles","func","Called with File[] on selection"],["label","string","Zone label"]],
};

// ── DATA DISPLAY ─────────────────────────────────────────────────────────────

const CardDoc = {
  id:"card", name:"Card", variants:"3 variants",
  description:"The base content surface: white layer, subtle border, soft shadow. Supports an optional title / subtitle header and a trailing action slot.",
  sections:[usage(
    () => { const { Card, Button:B } = S(); return (
      <div style={{ maxWidth:420 }}>
        <Card title="Line Chart" subtitle="Showing total visitors for the last 3 months" action={<B size="small" hierarchy="tertiary">Export</B>}>
          <div style={{ fontFamily:"var(--font-normal)", fontSize:14, color:"var(--text-body)" }}>Card body content goes here.</div>
        </Card>
      </div>
    ); },
    `<Card title="Line Chart" subtitle="Last 3 months" action={<Button size="small">Export</Button>}>\n  Card body content goes here.\n</Card>`
  )],
  props:[["title","node","Header title"],["subtitle","node","Header subtitle (light)"],["action","node","Trailing header slot"],["padding","number","Inner padding (default 24)"]],
};

const StatCardDoc = {
  id:"stat-card", name:"Stat Card", variants:"2 variants",
  description:"A KPI tile: label, large value and an optional trend indicator.",
  sections:[usage(
    () => { const { StatCard } = S(); return (
      <div style={{ display:"flex", gap:16 }}>
        <StatCard label="Desktop" value="24,828" trend="5.2% this month" />
        <StatCard label="Mobile" value="25,010" trend="1.1% this month" trendDirection="down" />
      </div>
    ); },
    `<StatCard label="Desktop" value="24,828" trend="5.2% this month" />\n<StatCard label="Mobile" value="25,010" trend="1.1% this month" trendDirection="down" />`
  )],
  props:[["label","string","KPI label"],["value","node","Large value"],["trend","string","Trend text"],["trendDirection","enum","up, down"]],
};

const BadgeDoc = {
  id:"badge", name:"Badge", variants:"7 tones · 2 variants",
  description:"Small status pill. Tones map to the semantic palette; `subtle` is the default look, `solid` for emphasis.",
  sections:[usage(
    () => { const { Badge } = S(); return (
      <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
        <Badge tone="success" dot>Active</Badge><Badge tone="warning">Pending</Badge>
        <Badge tone="error" dot>Failed</Badge><Badge tone="info">Info</Badge>
        <Badge tone="action" variant="solid">New</Badge><Badge tone="highlight">Beta</Badge>
      </div>
    ); },
    `<Badge tone="success" dot>Active</Badge>\n<Badge tone="action" variant="solid">New</Badge>`
  )],
  props:[["tone","enum","neutral, info, success, warning, error, action, highlight"],["variant","enum","subtle, solid"],["dot","boolean","Leading status dot"]],
};

const AvatarDoc = {
  id:"avatar", name:"Avatar", variants:"3 tones",
  description:"Circular user marker. Shows an image (`src`) or auto-generated initials from `name`.",
  sections:[usage(
    () => { const { Avatar } = S(); return (
      <div style={{ display:"flex", gap:12 }}>
        <Avatar name="John Adams" /><Avatar name="Thomas Jefferson" tone="purple" /><Avatar name="James Madison" tone="neutral" />
      </div>
    ); },
    `<Avatar name="John Adams" />\n<Avatar name="Thomas Jefferson" tone="purple" />`
  )],
  props:[["name","string","Used for initials + alt"],["src","string","Image URL"],["size","number","Diameter in px"],["tone","enum","action, purple, neutral"]],
};

const DataTable = {
  id:"data-table", name:"Data table", variants:"7 variants · 5 states · 3 sizes",
  description:"A sortable, paginated data table with checkbox selection, column resizing, and action rows.",
  sections: comingSoon("Data table"),
  props:[["columns","array","Column definitions: { key, label, sortable? }[]"],["rows","array","Row data objects"],["selectable","boolean","Enable row checkbox selection"],["onSort","func","Sort handler"],["onSelect","func","Selection change handler"]],
};

const AdvancedDataTable = {
  id:"advanced-data-table", name:"Advanced data table", variants:"7 variants · 5 states · 3 sizes",
  description:"Extends the data table with column filters, grouping, row expansion, and bulk actions.",
  sections: comingSoon("Advanced data table"),
  props:[["columns","array","Column definitions"],["rows","array","Row data objects"],["filterable","boolean","Enable column filters"],["groupBy","string","Column key to group by"],["expandable","boolean","Enable row expansion"]],
};

const Timeline = {
  id:"timeline", name:"Timeline", variants:"3 variants",
  description:"A vertical timeline for displaying chronological events, activity feeds, and process steps.",
  sections: comingSoon("Timeline"),
  props:[["items","array","{ date, title, body, icon? }[]"],["orientation","enum","left, right, alternating"]],
};

// ── NAVIGATION ───────────────────────────────────────────────────────────────

const TabsDoc = {
  id:"tabs", name:"Tabs", variants:"2 variants",
  description:"Underline-style tab bar — the Sandhata navigation pattern. Active tab is bold + blue with a 2px underline.",
  sections:[usage(
    () => { const { Tabs } = S(); const [t, setT] = React.useState("dashboard"); return (
      <Tabs value={t} onChange={setT} tabs={[
        { value:"dashboard", label:"Dashboard" },{ value:"forms", label:"Forms" },{ value:"cards", label:"Product Cards" },
      ]} />
    ); },
    `const [tab, setTab] = useState("dashboard");\n<Tabs value={tab} onChange={setTab} tabs={[\n  { value: "dashboard", label: "Dashboard" },\n  { value: "forms", label: "Forms" },\n]} />`
  )],
  props:[["tabs","array","{ value, label, icon? }[]"],["value","string","Active value"],["onChange","func","(value) => void"]],
};

const Sidebar = {
  id:"sidebar", name:"Sidebar", variants:"2 variants · 3 states",
  description:"A collapsible navigation sidebar with grouped links, icons and a search field. Supports pinned and auto-collapse modes.",
  sections: comingSoon("Sidebar"),
  props:[["groups","array","{ label, items: { id, label, icon?, href? }[] }[]"],["collapsed","boolean","Collapsed state"],["onCollapse","func","Toggle handler"]],
};

const Menu = {
  id:"menu", name:"Menu", variants:"2 variants",
  description:"A dropdown context menu with keyboard navigation, icons, separators, and nested sub-menus.",
  sections: comingSoon("Menu"),
  props:[["items","array","{ label, icon?, onClick?, divider? }[]"],["trigger","node","Element that opens the menu"],["side","enum","bottom, top, left, right"]],
};

const Pagination = {
  id:"pagination", name:"Pagination", variants:"2 variants",
  description:"Page navigation control with previous / next buttons, numbered pages, and a per-page selector.",
  sections: comingSoon("Pagination"),
  props:[["page","number","Current page (1-indexed)"],["total","number","Total item count"],["perPage","number","Items per page"],["onChange","func","Page change handler"]],
};

const SearchBar = {
  id:"search-bar", name:"Search bar", variants:"3 variants · 3 sizes",
  description:"A prominent search input with optional shortcut badge, clear button, and results dropdown.",
  sections:[usage(
    () => (
      <div style={{ maxWidth:340, position:"relative" }}>
        <div style={{
          display:"flex", alignItems:"center", gap:8, height:38, padding:"0 12px",
          border:"1px solid var(--border-default)", borderRadius:"var(--radius-md)",
          background:"var(--surface-page)",
        }}>
          <Search />
          <input
            placeholder="Search anything here"
            style={{ border:"none", outline:"none", background:"transparent", width:"100%", font:"14px/1 var(--font-normal)", color:"var(--text-body)" }}
          />
          <span style={{ font:"11px/1 var(--font-mono)", background:"var(--colour-neutral-100)", color:"var(--text-caption)", padding:"3px 6px", borderRadius:"var(--radius-xs)" }}>⌘K</span>
        </div>
      </div>
    ),
    `<SearchBar placeholder="Search anything here" shortcut="⌘K" onSearch={q => search(q)} />`
  )],
  props:[["placeholder","string","Input placeholder text"],["shortcut","string","Keyboard shortcut badge"],["onSearch","func","Called with the query string"],["size","enum","Small, Medium, Large"]],
};

// ── FEEDBACK & STATUS ────────────────────────────────────────────────────────

const AlertDoc = {
  id:"tooltip-alert", name:"Alert", variants:"4 tones",
  description:"Inline alert / banner with tone-based colour and icon. Pass `onClose` for a dismissible banner.",
  sections:[usage(
    () => { const { Alert } = S(); return (
      <div style={{ display:"flex", flexDirection:"column", gap:10, maxWidth:460 }}>
        <Alert tone="success" title="Saved">Your changes were saved successfully.</Alert>
        <Alert tone="warning" title="Heads up" onClose={() => {}}>Your trial ends in 3 days.</Alert>
        <Alert tone="error">Something went wrong. Try again.</Alert>
      </div>
    ); },
    `<Alert tone="success" title="Saved">Your changes were saved.</Alert>\n<Alert tone="warning" title="Heads up" onClose={dismiss}>Trial ends soon.</Alert>`
  )],
  props:[["tone","enum","info, success, warning, error"],["title","node","Bold heading"],["onClose","func","Renders a dismiss button"]],
};

const TooltipDoc = {
  id:"tooltip", name:"Tooltip", variants:"4 sides",
  description:"Dark label shown on hover / focus of its child trigger.",
  sections:[usage(
    () => { const { Tooltip, Button:B } = S(); return (
      <Tooltip label="This is a tooltip"><B hierarchy="tertiary">Hover me</B></Tooltip>
    ); },
    `<Tooltip label="Copy to clipboard" side="top">\n  <IconButton icon={<Copy/>} ariaLabel="Copy" />\n</Tooltip>`
  )],
  props:[["label","node","Tooltip text"],["side","enum","top, bottom, left, right"]],
};

const SpinnerDoc = {
  id:"spinner", name:"Spinner", variants:"3 sizes",
  description:"Indeterminate loading indicator in brand blue.",
  sections:[usage(
    () => { const { Spinner } = S(); return (
      <div style={{ display:"flex", gap:18, alignItems:"center" }}>
        <Spinner size={18} /><Spinner size={24} /><Spinner size={32} />
      </div>
    ); },
    `<Spinner size={20} />`
  )],
  props:[["size","number","Diameter in px"],["stroke","number","Stroke width"],["color","string","Override colour"]],
};

// ── LAYOUT & STRUCTURE ───────────────────────────────────────────────────────

const Accordion = {
  id:"accordion", name:"Accordion", variants:"2 variants",
  description:"Collapsible content panels for organising information into expandable sections.",
  sections: comingSoon("Accordion"),
  props:[["items","array","{ id, title, content }[]"],["multiple","boolean","Allow multiple panels open"],["defaultOpen","array","Open panel IDs on mount"]],
};

const Drawer = {
  id:"drawer", name:"Drawer", variants:"4 sides · 3 sizes",
  description:"A panel that slides in from the edge of the screen — used for secondary navigation, forms, and detail views.",
  sections: comingSoon("Drawer"),
  props:[["open","boolean","Controlled open state"],["onClose","func","Close handler"],["side","enum","left, right, top, bottom"],["title","node","Drawer header title"],["size","enum","Small, Medium, Large"]],
};

// ── MEDIA & INTERACTIVE ──────────────────────────────────────────────────────

const Carousel = {
  id:"carousel", name:"Carousel", variants:"2 variants",
  description:"A horizontal scroll container with navigation arrows, dot indicators and optional auto-advance.",
  sections: comingSoon("Carousel"),
  props:[["items","array","Slide content nodes"],["autoPlay","boolean","Auto-advance slides"],["interval","number","Auto-advance interval in ms"],["showDots","boolean","Show dot indicators"],["showArrows","boolean","Show prev / next arrows"]],
};

// ── Groups (mirrors the Figma "Components home" sidebar) ─────────────────────
const GROUPS = [
  {
    label:"Inputs & Form Controls",
    items:[Input, Textarea, NumericalInput, CheckboxDoc, RadioDoc, SwitchDoc, SelectDoc, DateRangePicker, TagDoc, UploadFiles],
  },
  {
    label:"Actions",
    items:[Button, IconButtonDoc],
  },
  {
    label:"Data Display",
    items:[CardDoc, StatCardDoc, BadgeDoc, AvatarDoc, DataTable, AdvancedDataTable, Timeline],
  },
  {
    label:"Navigation",
    items:[TabsDoc, Sidebar, Menu, Pagination, SearchBar],
  },
  {
    label:"Feedback & Status",
    items:[AlertDoc, TooltipDoc, SpinnerDoc],
  },
  {
    label:"Layout & Structure",
    items:[Accordion, Drawer],
  },
  {
    label:"Media & Interactive Content",
    items:[Carousel],
  },
];

window.SANDHATA_DOCS = GROUPS;
