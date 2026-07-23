"use client";

import React from "react";
import * as DS from "@/components";

// Sandhata docs — component documentation registry.
// Each component: { id, name, description, variants, sections:[...], props:[...] }
// "variants" is the short descriptor shown in the All Components grid.

const S = () => DS;

const Plus   = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>);
const Pencil = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>);
const ArrowR = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>);
const Search = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>);

// A doc section can mix any of these shapes (bullets/table/note/demo+code,
// or the doDont pair) — kept loose/optional throughout so TS doesn't try to
// force every component's sections into one narrow discriminated union.
type DocSection = {
  id: string;
  title: string;
  bullets?: string[][];
  table?: { head: string[]; rows: string[][]; codeCol?: number };
  note?: string;
  demo?: () => JSX.Element;
  code?: string;
  // Design tokens this component's own styling actually resolves to — pulled
  // from the component's source/CSS, not the Figma variable layer (a
  // different naming scheme tracked separately in the Figma Component
  // Tokens collection).
  tokens?: { name: string; role: string }[];
  doDont?: {
    do?: { text?: string; demo?: () => JSX.Element };
    dont?: { text?: string; demo?: () => JSX.Element };
  };
};

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
      id:"anatomy", title:"Anatomy",
      table:{
        head:["Part","Role"],
        rows:[
          ["Container","Visual background and shape"],
          ["Label","Describes the action"],
          ["Left Icon (optional)","Supports recognition"],
          ["Right Icon (optional)","Indicates direction or outcome"],
        ],
      },
      demo: () => { const { Button:B } = S(); return <B hierarchy="primary" iconLeft={<Plus/>} iconRight={<ArrowR/>}>Button</B>; },
      code:`import { Button } from "@/components";\n\nconst Example = () => (\n  <Button hierarchy="primary" iconLeft={<Plus/>}>Button</Button>\n);`,
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
    {
      id:"tokens-used", title:"Tokens used",
      note:"Read directly from components/buttons/Button.jsx — this is the code-token layer a developer here actually consumes, not the Figma variable layer (tracked separately in the Figma Component Tokens collection).",
      tokens:[
        { name:"--colour-primaryblue-500", role:"Primary background" },
        { name:"--colour-primaryblue-700", role:"Primary background (hover)" },
        { name:"--colour-primaryblue-50", role:"Secondary background" },
        { name:"--colour-primaryblue-100", role:"Secondary background (hover)" },
        { name:"--colour-primaryblue-600", role:"Secondary / Ghost label colour" },
        { name:"--colour-neutral-0", role:"Label colour on filled buttons (Primary, Inverse, Danger)" },
        { name:"--colour-neutral-100", role:"Tertiary / Ghost background (hover)" },
        { name:"--colour-neutral-300", role:"Tertiary border" },
        { name:"--colour-neutral-800", role:"Tertiary label colour" },
        { name:"--colour-neutral-900", role:"Inverse background" },
        { name:"--colour-neutral-700", role:"Inverse background (hover)" },
        { name:"--colour-error-500", role:"Danger background" },
        { name:"--colour-error-700", role:"Danger background (hover)" },
        { name:"--radius-md", role:"Corner radius — all sizes and hierarchies" },
        { name:"--font-normal", role:"Label font family" },
        { name:"--body-small-size", role:"Label font size when size=\"small\"" },
        { name:"--body-medium-size", role:"Label font size when size=\"medium\" (default)" },
        { name:"--body-large-size", role:"Label font size when size=\"large\"" },
        { name:"--duration-fast", role:"Background / box-shadow transition duration" },
        { name:"--ease-standard", role:"Transition easing curve" },
      ],
    },
    {
      id:"accessibility", title:"Accessibility",
      bullets:[
        ["Keyboard","Enter and Space activate a focused button"],
        ["Focus","Disabled buttons are removed from the tab order and cannot receive focus"],
        ["Role","Renders a native <button> element, so the button role and disabled state are exposed to assistive tech automatically — no extra ARIA attributes needed"],
      ],
    },
    {
      id:"do-dont", title:"Do / Don't",
      doDont:{
        do:{
          text:"Use Primary for the one main action per screen — it should be obvious where a user's next step is.",
          demo: () => { const { Button:B } = S(); return <B hierarchy="primary">Save changes</B>; },
        },
        dont:{
          text:"Don't use multiple Primary buttons in the same view — it competes for attention and dilutes the hierarchy.",
          demo: () => { const { Button:B } = S(); return (
            <div style={{ display:"flex", gap:12 }}>
              <B hierarchy="primary">Save</B><B hierarchy="primary">Cancel</B>
            </div>
          ); },
        },
      },
    },
  ] as DocSection[],
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
  sections:[
    {
      id:"anatomy", title:"Anatomy",
      table:{
        head:["Part","Role"],
        rows:[
          ["Label","Describes the expected value"],
          ["Decrement button","Reduces the value by the step amount"],
          ["Input field","Shows and accepts the numeric value directly"],
          ["Increment button","Increases the value by the step amount"],
          ["Unit label (optional)","Suffix indicating the unit (e.g. kg, %)"],
          ["Helper text","Guidance shown beneath the field"],
          ["Error message","Validation feedback — replaces helper text"],
        ],
      },
      demo: () => (
        <div style={{ maxWidth:260 }}>
          <div style={{ font:"700 12px/1 var(--font-bold)", color:"var(--text-title)", marginBottom:6, letterSpacing:"0.4px" }}>Quantity</div>
          <div style={{ display:"flex", alignItems:"stretch", border:"1px solid var(--border-default)", borderRadius:"var(--radius-sm)", overflow:"hidden", height:38 }}>
            <button style={{ width:38, border:"none", borderRight:"1px solid var(--border-subtle)", background:"var(--colour-neutral-50)", cursor:"pointer", font:"18px/1 var(--font-normal)", color:"var(--text-body)", flexShrink:0 }}>−</button>
            <input type="number" defaultValue={12} style={{ flex:1, border:"none", outline:"none", textAlign:"center", font:"14px/1 var(--font-normal)", color:"var(--text-body)", background:"transparent", minWidth:0 }} />
            <button style={{ width:38, border:"none", borderLeft:"1px solid var(--border-subtle)", background:"var(--colour-neutral-50)", cursor:"pointer", font:"18px/1 var(--font-normal)", color:"var(--text-body)", flexShrink:0 }}>+</button>
          </div>
          <div style={{ font:"12px/1.4 var(--font-light)", color:"var(--text-caption)", marginTop:5 }}>Min 1 · Max 100</div>
        </div>
      ),
      code:`<NumericalInput label="Quantity" value={qty} onChange={setQty} min={1} max={100} step={1} />`,
    },
    {
      id:"variants", title:"Variants",
      bullets:[
        ["Default","Input field flanked by decrement and increment buttons"],
        ["With unit","Suffix label appended inside the field (kg, %, px)"],
        ["Without steppers","Plain number field — no ± buttons"],
        ["Read-only","Non-interactive display of a numeric value"],
      ],
      code:`<NumericalInput label="Weight" value={70} unit="kg" />\n<NumericalInput label="Opacity" value={100} unit="%" min={0} max={100} />`,
    },
    {
      id:"states", title:"States",
      table:{
        head:["State","Description"],
        rows:[
          ["Default","Neutral border"],
          ["Focus","Blue border, 3px focus ring"],
          ["Filled","Value present, neutral border"],
          ["Disabled","Muted colours, non-interactive, cursor not-allowed"],
          ["Error","Red border, error message shown below"],
        ],
      },
    },
    {
      id:"accessibility", title:"Accessibility",
      bullets:[
        ["Role","Native <input type=\"number\"> — spinner role is implicit"],
        ["Keyboard","↑ / ↓ increment and decrement by step; Home / End jump to min / max"],
        ["Labels","Label associated via htmlFor; unit suffix linked via aria-describedby"],
        ["Range announcement","min and max attributes let screen readers announce the allowed range"],
      ],
    },
    {
      id:"do-dont", title:"Do / Don't",
      doDont:{
        do:{ text:"Always set explicit min, max, and step so the control can validate and screen readers can announce the range." },
        dont:{ text:"Don't use a numerical input for free-form text entry — use a plain text input instead." },
      },
    },
  ],
  props:[["label","string","Field label"],["value","number","Current value"],["min","number","Minimum allowed"],["max","number","Maximum allowed"],["step","number","Increment step"],["unit","string","Unit suffix (e.g. kg, %)"],["onChange","func","Change handler"],["disabled","boolean","Non-interactive"],["error","string","Error message"],["helper","string","Helper text"],["size","enum","Small, Medium, Large"]],
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
  sections:[
    {
      id:"anatomy", title:"Anatomy",
      table:{
        head:["Part","Role"],
        rows:[
          ["Start field","Date input for the range start; opens the popover on focus"],
          ["End field","Date input for the range end"],
          ["Calendar icon","Secondary trigger to open the popover"],
          ["Calendar popover","Month grid for picking start and end dates visually"],
          ["Month navigation","Previous/next arrows and month/year label in the popover header"],
          ["Day grid","Clickable date cells; range fills highlighted between start and end"],
          ["Clear button","Resets both fields"],
        ],
      },
      demo: () => (
        <div style={{ display:"flex", gap:8, alignItems:"center", maxWidth:420 }}>
          {["Start date","End date"].map((lbl) => (
            <div key={lbl} style={{ flex:1 }}>
              <div style={{ font:"700 12px/1 var(--font-bold)", color:"var(--text-title)", marginBottom:6, letterSpacing:"0.4px" }}>{lbl}</div>
              <div style={{ display:"flex", alignItems:"center", gap:8, height:38, padding:"0 10px", border:"1px solid var(--border-default)", borderRadius:"var(--radius-sm)", background:"var(--surface-page)" }}>
                <span style={{ font:"14px/1 var(--font-normal)", color:"var(--text-caption)", flex:1 }}>DD / MM / YYYY</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
            </div>
          ))}
        </div>
      ),
      code:`<DateRangePicker\n  startLabel="Start date"\n  endLabel="End date"\n  value={{ start, end }}\n  onChange={({ start, end }) => setRange({ start, end })}\n/>`,
    },
    {
      id:"variants", title:"Variants",
      bullets:[
        ["Date range","Start + end fields (default)"],
        ["Single date","One field only — same calendar interaction"],
        ["With presets","Quick-select chips above the calendar (Today, Last 7 days, This month)"],
        ["Read-only","Non-interactive display of the selected range"],
      ],
    },
    {
      id:"states", title:"States",
      table:{
        head:["State","Description"],
        rows:[
          ["Idle","Both fields empty, popover closed"],
          ["Open","Popover visible, start field active"],
          ["Selecting","Start date chosen, hovering over end date highlights the range"],
          ["Selected","Both dates set, range shown in fields"],
          ["Disabled","Muted colours, fields non-interactive"],
          ["Error","Red border, error message on the field(s) with invalid input"],
        ],
      },
    },
    {
      id:"accessibility", title:"Accessibility",
      bullets:[
        ["Keyboard","Tab moves between start and end fields; arrow keys navigate the calendar grid; Enter selects a date"],
        ["Escape","Closes the popover without committing a selection"],
        ["ARIA","Popover has role=\"dialog\"; calendar has role=\"grid\"; each day cell has aria-label with the full date"],
        ["Screen reader","Selected range is announced as a live region update when both dates are set"],
      ],
    },
    {
      id:"do-dont", title:"Do / Don't",
      doDont:{
        do:{ text:"Provide preset range options (Today, Last 7 days) when users commonly pick relative ranges — it dramatically reduces interaction cost." },
        dont:{ text:"Don't use a date range picker for single-date entry — use a plain date input or single-date picker instead." },
      },
    },
  ],
  props:[["startLabel","string","Start date label"],["endLabel","string","End date label"],["value","object","{ start: string, end: string } ISO date strings"],["onChange","func","({ start, end }) => void"],["minDate","string","Minimum selectable date (ISO)"],["maxDate","string","Maximum selectable date (ISO)"],["presets","array","Quick-select chips: { label, range }[]"],["disabled","boolean","Non-interactive"]],
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
  sections:[
    {
      id:"anatomy", title:"Anatomy",
      table:{
        head:["Part","Role"],
        rows:[
          ["Drop zone","Dashed border container that accepts dragged files"],
          ["Upload icon","Visual affordance indicating file drop or browse"],
          ["Primary label","Main instruction (e.g. 'Drag files here or browse')"],
          ["File type hint","Sub-label listing accepted types and max size"],
          ["Browse link","Inline text trigger that opens the native file picker"],
          ["File list","Uploaded file rows with name, size and remove button"],
          ["Progress bar","Per-file upload progress indicator"],
          ["Error message","Shown for oversized, wrong-type or failed uploads"],
        ],
      },
      demo: () => (
        <div style={{ border:"1.5px dashed var(--border-default)", borderRadius:"var(--radius-lg)", padding:"32px 24px", textAlign:"center", background:"var(--colour-neutral-50)", maxWidth:380 }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-caption)" strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom:12 }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <div style={{ font:"14px/1.5 var(--font-normal)", color:"var(--text-body)" }}>
            Drag files here or <span style={{ color:"var(--text-action)", cursor:"pointer" }}>browse</span>
          </div>
          <div style={{ font:"12px/1.4 var(--font-light)", color:"var(--text-caption)", marginTop:4 }}>PNG, JPG, PDF up to 10 MB</div>
        </div>
      ),
      code:`<UploadFiles\n  label="Drag files here or browse"\n  accept="image/*,.pdf"\n  maxSize={10 * 1024 * 1024}\n  multiple\n  onFiles={files => upload(files)}\n/>`,
    },
    {
      id:"variants", title:"Variants",
      bullets:[
        ["Default","Full drop zone with browse link"],
        ["Compact","Single-line upload row — file name + browse button, no large zone"],
        ["With preview","Image thumbnail previews shown after selection"],
      ],
    },
    {
      id:"states", title:"States",
      table:{
        head:["State","Description"],
        rows:[
          ["Idle","Dashed border, upload icon, browse link"],
          ["Drag-over","Border turns blue, background tints — file is hovering above the zone"],
          ["Uploading","Progress bar per file; zone remains active for additional drops"],
          ["Error","File row shows red error text (wrong type, too large, network failure)"],
        ],
      },
    },
    {
      id:"accessibility", title:"Accessibility",
      bullets:[
        ["Keyboard","The browse link and remove buttons are keyboard-focusable and activated with Enter / Space"],
        ["ARIA","Drop zone has role=\"button\" with an aria-label; progress bar uses role=\"progressbar\" with aria-valuenow"],
        ["Errors","Error messages are linked to the relevant file row via aria-describedby"],
        ["Motion","Upload progress animation respects prefers-reduced-motion"],
      ],
    },
    {
      id:"do-dont", title:"Do / Don't",
      doDont:{
        do:{ text:"Always show the accepted file types and size limit inside the zone — users should not have to guess and retry." },
        dont:{ text:"Don't silently reject files after upload starts — show an inline error on the specific file row immediately." },
      },
    },
  ],
  props:[["accept","string","MIME type filter (e.g. \"image/*,.pdf\")"],["multiple","boolean","Allow multiple files"],["maxSize","number","Max file size in bytes"],["onFiles","func","Called with File[] on selection"],["label","string","Zone label text"],["compact","boolean","Single-line compact layout"]],
};

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
  sections:[
    {
      id:"anatomy", title:"Anatomy",
      table:{
        head:["Part","Role"],
        rows:[
          ["Table header","Column labels with optional sort controls"],
          ["Sort indicator","Up/down chevron on sortable columns; active column shows direction"],
          ["Row checkbox","Optional per-row selection; header checkbox selects all / deselects all"],
          ["Table row","Data row; hover state tints the background"],
          ["Row action slot","Trailing cell for per-row actions (edit, delete, etc.)"],
          ["Empty state","Centred message shown when there are no rows to display"],
          ["Pagination","Page navigation below the table — see Pagination component"],
        ],
      },
      demo: () => {
        const cols = ["Name","Role","Status"];
        const rows = [["Alice Chen","Engineer","Active"],["Bob Okafor","Designer","Active"],["Carla Vega","Manager","Away"]];
        const cellStyle: React.CSSProperties = { padding:"10px 14px", font:"13px/1.4 var(--font-normal)", color:"var(--text-body)", borderBottom:"1px solid var(--border-subtle)" };
        const headStyle: React.CSSProperties = { padding:"10px 14px", font:"700 12px/1 var(--font-bold)", color:"var(--text-title)", borderBottom:"2px solid var(--border-default)", textAlign:"left", letterSpacing:"0.3px" };
        return (
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", border:"1px solid var(--border-subtle)", borderRadius:"var(--radius-lg)", overflow:"hidden" }}>
              <thead><tr style={{ background:"var(--colour-neutral-50)" }}>{cols.map(c => <th key={c} style={headStyle}>{c}</th>)}</tr></thead>
              <tbody>{rows.map((r,i) => <tr key={i} style={{ background:"var(--surface-page)" }}>{r.map((c,j) => <td key={j} style={cellStyle}>{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
        );
      },
      code:`<DataTable\n  columns={[\n    { key:"name", label:"Name", sortable:true },\n    { key:"role", label:"Role" },\n    { key:"status", label:"Status" },\n  ]}\n  rows={data}\n  selectable\n  onSort={({ key, dir }) => sort(key, dir)}\n/>`,
    },
    {
      id:"column-types", title:"Column types",
      bullets:[
        ["Text","Default — left-aligned string value"],
        ["Numeric","Right-aligned with tabular-nums formatting"],
        ["Status","Badge component rendered in cell"],
        ["Action","Trailing column with IconButton row actions"],
        ["Sortable","Column header is clickable; active column shows sort direction"],
      ],
    },
    {
      id:"row-states", title:"Row states",
      table:{
        head:["State","Description"],
        rows:[
          ["Default","Neutral background"],
          ["Hover","Subtle neutral-50 tint"],
          ["Selected","Blue-50 tint, checkbox checked"],
          ["Disabled","Muted text, checkbox non-interactive"],
          ["Loading","Skeleton shimmer rows while data fetches"],
        ],
      },
    },
    {
      id:"accessibility", title:"Accessibility",
      bullets:[
        ["Role","Native <table> with <thead>/<tbody> — structure exposed to assistive tech automatically"],
        ["Sort","Sortable headers use aria-sort (\"ascending\" | \"descending\" | \"none\")"],
        ["Selection","Row checkboxes have aria-label with the row's primary identifier"],
        ["Select all","Header checkbox uses aria-label=\"Select all rows\" and aria-checked=\"mixed\" for partial selection"],
        ["Keyboard","Tab moves between interactive cells; row checkboxes activated with Space"],
      ],
    },
    {
      id:"do-dont", title:"Do / Don't",
      doDont:{
        do:{ text:"Provide an empty state with a clear message and a call to action — users need to know why there are no rows and what to do next." },
        dont:{ text:"Don't show more than 50 rows without pagination — long DOM trees are slow to render and overwhelming to scan." },
      },
    },
  ],
  props:[["columns","array","Column definitions: { key, label, sortable?, numeric?, width? }[]"],["rows","array","Row data objects"],["selectable","boolean","Enable row checkbox selection"],["onSort","func","({ key, dir }) => void"],["onSelect","func","(selectedIds) => void"],["loading","boolean","Show skeleton rows"],["emptyMessage","string","Empty state text"]],
};

const AdvancedDataTable = {
  id:"advanced-data-table", name:"Advanced data table", variants:"7 variants · 5 states · 3 sizes",
  description:"Extends the data table with column filters, grouping, row expansion, and bulk actions.",
  sections:[
    {
      id:"anatomy", title:"Anatomy",
      note:"Inherits all DataTable anatomy. The following parts are additive.",
      table:{
        head:["Part","Role"],
        rows:[
          ["Filter row","Per-column text/select filter inputs rendered below the header row"],
          ["Active filter chips","Summary of applied filters above the table; each chip has a clear button"],
          ["Group header row","Spans all columns; shows the group key value and a row count"],
          ["Expand toggle","Chevron in the first cell; opens an inline detail panel below the row"],
          ["Detail panel","Full-width row slot for expanded content (sub-tables, forms, rich detail)"],
          ["Bulk action bar","Appears above the table when rows are selected — contains batch actions"],
        ],
      },
      code:`<AdvancedDataTable\n  columns={columns}\n  rows={data}\n  filterable\n  groupBy="department"\n  expandable\n  selectable\n  bulkActions={[\n    { label:"Export", onClick:exportSelected },\n    { label:"Delete", onClick:deleteSelected, tone:"danger" },\n  ]}\n/>`,
    },
    {
      id:"features", title:"Features",
      bullets:[
        ["Column filters","Per-column inline filter — text match for strings, range for numbers, select for enums"],
        ["Grouping","Rows collapsed under group headers; groups expand / collapse independently"],
        ["Row expansion","Inline detail panel below any row — arbitrary content"],
        ["Bulk actions","Action bar emerges when ≥1 row is selected; cleared on deselect all"],
        ["Column resizing","Drag handle on column borders to adjust widths"],
      ],
    },
    {
      id:"when-to-use", title:"When to use",
      bullets:[
        ["Use Advanced","When users need to filter, group, or drill into row detail without leaving the table"],
        ["Use DataTable","For read-only or simply sorted/paginated data that doesn't need filtering or expansion"],
      ],
    },
    {
      id:"accessibility", title:"Accessibility",
      bullets:[
        ["Filter inputs","Associated with their column header via aria-label or aria-labelledby"],
        ["Expand toggle","aria-expanded reflects open/closed; aria-controls points to the detail panel id"],
        ["Bulk bar","Announced as a live region when it appears; action buttons are keyboard-focusable"],
        ["Group headers","role=\"rowgroup\" with an aria-label summarising the group"],
      ],
    },
    {
      id:"do-dont", title:"Do / Don't",
      doDont:{
        do:{ text:"Show active filter chips above the table so users always know what's filtering their view and can clear filters individually." },
        dont:{ text:"Don't enable all features at once — only expose filterable, expandable, and groupBy when the data actually warrants each one." },
      },
    },
  ],
  props:[["columns","array","Column definitions (same shape as DataTable)"],["rows","array","Row data objects"],["filterable","boolean","Enable per-column filter row"],["groupBy","string","Column key to group rows by"],["expandable","boolean","Enable row expansion"],["bulkActions","array","{ label, onClick, tone? }[]"],["selectable","boolean","Enable row selection (required for bulkActions)"]],
};

const Timeline = {
  id:"timeline", name:"Timeline", variants:"3 variants",
  description:"A vertical timeline for displaying chronological events, activity feeds, and process steps.",
  sections:[
    {
      id:"anatomy", title:"Anatomy",
      table:{
        head:["Part","Role"],
        rows:[
          ["Track","Vertical line connecting all timeline nodes"],
          ["Node","Dot or icon marking the event position on the track"],
          ["Date/time label","Timestamp shown beside the node"],
          ["Title","Short event headline"],
          ["Body","Optional supporting detail text or rich content"],
          ["Connector line","Segment of the track between two nodes; dashed for pending events"],
        ],
      },
      demo: () => {
        const items = [
          { date:"10 Jul 2026", title:"Order placed", done:true },
          { date:"12 Jul 2026", title:"Shipped", done:true },
          { date:"14 Jul 2026", title:"Out for delivery", done:false },
        ];
        return (
          <div style={{ display:"flex", flexDirection:"column", gap:0, paddingLeft:8 }}>
            {items.map((item, i) => (
              <div key={i} style={{ display:"flex", gap:16, position:"relative" }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
                  <div style={{ width:12, height:12, borderRadius:"50%", background: item.done ? "var(--colour-primaryblue-500)" : "var(--colour-neutral-300)", border:"2px solid var(--surface-page)", boxShadow:"0 0 0 2px " + (item.done ? "var(--colour-primaryblue-500)" : "var(--colour-neutral-300)"), marginTop:4 }} />
                  {i < items.length - 1 && <div style={{ width:2, flex:1, minHeight:32, background: item.done ? "var(--colour-primaryblue-200)" : "var(--colour-neutral-200)", margin:"4px 0" }} />}
                </div>
                <div style={{ paddingBottom:i < items.length - 1 ? 20 : 0 }}>
                  <div style={{ font:"11px/1 var(--font-mono)", color:"var(--text-caption)", marginBottom:3 }}>{item.date}</div>
                  <div style={{ font:"700 13px/1.4 var(--font-bold)", color: item.done ? "var(--text-title)" : "var(--text-caption)" }}>{item.title}</div>
                </div>
              </div>
            ))}
          </div>
        );
      },
      code:`<Timeline\n  items={[\n    { date:"10 Jul 2026", title:"Order placed", body:"Payment confirmed." },\n    { date:"12 Jul 2026", title:"Shipped", icon:<TruckIcon/> },\n    { date:"14 Jul 2026", title:"Delivery expected" },\n  ]}\n/>`,
    },
    {
      id:"variants", title:"Variants",
      bullets:[
        ["Left-aligned","All content to the right of the track (default)"],
        ["Right-aligned","All content to the left of the track"],
        ["Alternating","Content alternates left/right on each node — used for history or process flows"],
      ],
    },
    {
      id:"node-states", title:"Node states",
      table:{
        head:["State","Visual"],
        rows:[
          ["Complete","Filled blue dot or success icon; solid connector below"],
          ["Current","Filled blue dot with a pulsing ring"],
          ["Pending","Empty/outline dot; dashed connector below"],
          ["Error","Red dot or error icon; red connector"],
        ],
      },
    },
    {
      id:"accessibility", title:"Accessibility",
      bullets:[
        ["Role","Render as an ordered <ol> list — each item is an <li> with semantic date and title"],
        ["Icons","Decorative node icons have aria-hidden=\"true\"; state-bearing icons carry an aria-label"],
        ["Order","Visual order must match DOM order so screen readers narrate events chronologically"],
      ],
    },
    {
      id:"do-dont", title:"Do / Don't",
      doDont:{
        do:{ text:"Use clear date labels — relative timestamps ('3 days ago') are fine for activity feeds, but absolute dates are better for audit trails." },
        dont:{ text:"Don't nest timelines — a single linear track per view is always clearer than branching or nested structures." },
      },
    },
  ],
  props:[["items","array","{ date, title, body?, icon?, state? }[] — state: complete | current | pending | error"],["orientation","enum","left, right, alternating"],["connector","enum","solid, dashed"]],
};

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
  sections:[
    {
      id:"anatomy", title:"Anatomy",
      table:{
        head:["Part","Role"],
        rows:[
          ["Shell","Fixed-width container that holds all navigation structure"],
          ["Logo slot","Top-left branding area; shrinks to icon-only when collapsed"],
          ["Nav group","Labelled section of related nav items"],
          ["Nav item","A single destination: icon + label + optional badge"],
          ["Active indicator","Blue left-border strip marking the current route"],
          ["Collapse toggle","Button at the bottom of the rail that toggles expanded/collapsed"],
          ["Overlay (mobile)","Dark backdrop behind the open drawer on narrow viewports"],
        ],
      },
      demo: () => {
        const items = [
          { icon:"▦", label:"Dashboard", active:true },
          { icon:"↗", label:"Analytics" },
          { icon:"⊞", label:"Components" },
          { icon:"◈", label:"Settings" },
        ];
        return (
          <div style={{ display:"flex", height:220, borderRadius:"var(--radius-lg)", overflow:"hidden", border:"1px solid var(--border-subtle)" }}>
            <nav style={{ width:200, background:"var(--surface-raised)", borderRight:"1px solid var(--border-subtle)", display:"flex", flexDirection:"column", padding:"12px 0" }}>
              <div style={{ padding:"0 16px 12px", font:"700 13px/1 var(--font-bold)", color:"var(--text-title)" }}>Sandhata</div>
              <div style={{ padding:"4px 8px", font:"10px/1 var(--font-normal)", color:"var(--text-caption)", letterSpacing:"0.06em", textTransform:"uppercase" }}>Navigation</div>
              {items.map((it, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 16px", margin:"1px 0", background: it.active ? "var(--colour-primaryblue-50)" : "transparent", borderLeft: it.active ? "2px solid var(--colour-primaryblue-500)" : "2px solid transparent", cursor:"pointer" }}>
                  <span style={{ fontSize:14, color: it.active ? "var(--colour-primaryblue-500)" : "var(--text-caption)" }}>{it.icon}</span>
                  <span style={{ font:`${it.active ? "600" : "400"} 13px/1 var(--font-normal)`, color: it.active ? "var(--text-title)" : "var(--text-body)" }}>{it.label}</span>
                </div>
              ))}
            </nav>
            <div style={{ flex:1, padding:20, background:"var(--surface-page)" }}>
              <div style={{ font:"14px/1.5 var(--font-normal)", color:"var(--text-caption)" }}>Main content area</div>
            </div>
          </div>
        );
      },
      code:`<Sidebar\n  groups={[{\n    label:"Navigation",\n    items:[\n      { id:"dashboard", label:"Dashboard", icon:<Grid/>, href:"/" },\n      { id:"analytics", label:"Analytics", icon:<BarChart/>, href:"/analytics" },\n    ],\n  }]}\n  activeId="dashboard"\n/>`,
    },
    {
      id:"variants", title:"Variants",
      bullets:[
        ["Expanded","Full width (240px default) with icon + label per item; nav group labels visible"],
        ["Collapsed (rail)","Icon-only strip (56px) with tooltip labels on hover — saves horizontal space"],
      ],
    },
    {
      id:"states", title:"States",
      bullets:[
        ["Default","Expanded, no item active (landing before route resolves)"],
        ["Active item","Current route highlighted with blue border and tinted background"],
        ["Collapsed","Rail mode; logo collapses to icon; group labels hidden"],
      ],
    },
    {
      id:"keyboard", title:"Keyboard interaction",
      table:{
        head:["Key","Action"],
        rows:[
          ["Tab","Move focus through nav items"],
          ["Enter / Space","Navigate to the focused item"],
          ["[ (bracket)","Toggle collapse / expand"],
          ["Escape","Close mobile overlay"],
        ],
      },
    },
    {
      id:"accessibility", title:"Accessibility",
      bullets:[
        ["Role","Render as <nav> with an aria-label (e.g. 'Main navigation')"],
        ["Active item","Current page item has aria-current=\"page\""],
        ["Collapse","Toggle button has aria-expanded and aria-label describing the action"],
        ["Tooltips","Collapsed icon items show tooltip labels with role=\"tooltip\" on focus/hover"],
      ],
    },
    {
      id:"do-dont", title:"Do / Don't",
      doDont:{
        do:{ text:"Group related destinations together under labelled sections — it reduces the cognitive load of scanning a long nav list." },
        dont:{ text:"Don't put more than 7–8 top-level nav items in the sidebar — nest secondary links inside a parent item or move them to a sub-nav." },
      },
    },
  ],
  props:[["groups","array","{ label?, items: { id, label, icon?, href?, badge? }[] }[]"],["activeId","string","Active item id"],["collapsed","boolean","Collapsed (rail) mode"],["onCollapse","func","Toggle handler"],["width","number","Expanded width in px (default 240)"]],
};

const Menu = {
  id:"menu", name:"Menu", variants:"2 variants",
  description:"A dropdown context menu with keyboard navigation, icons, separators, and nested sub-menus.",
  sections:[
    {
      id:"anatomy", title:"Anatomy",
      table:{
        head:["Part","Role"],
        rows:[
          ["Trigger","The button or element the user interacts with to open the menu"],
          ["Menu panel","Floating container with a subtle shadow; aligns to the trigger"],
          ["Menu item","Row with optional icon, label, and keyboard shortcut hint"],
          ["Divider","Horizontal rule grouping related items"],
          ["Sub-menu arrow","Trailing chevron indicating a nested panel will open"],
          ["Checked state","Leading checkmark on selected items in a selection menu"],
          ["Disabled item","Muted text; not keyboard-focusable"],
        ],
      },
      demo: () => {
        const items = [
          { label:"Edit", shortcut:"⌘E" },
          { label:"Duplicate", shortcut:"⌘D" },
          null,
          { label:"Export as PDF" },
          { label:"Export as PNG" },
          null,
          { label:"Delete", danger:true },
        ];
        return (
          <div style={{ position:"relative", display:"inline-block" }}>
            <div style={{ padding:"6px 14px", border:"1px solid var(--border-default)", borderRadius:"var(--radius-md)", font:"13px/1 var(--font-normal)", color:"var(--text-body)", background:"var(--surface-page)", cursor:"pointer", display:"inline-flex", alignItems:"center", gap:6 }}>
              Actions <span style={{ fontSize:10 }}>▾</span>
            </div>
            <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, background:"var(--surface-raised)", border:"1px solid var(--border-subtle)", borderRadius:"var(--radius-md)", boxShadow:"0 4px 16px rgba(0,0,0,0.10)", minWidth:180, zIndex:10, padding:"4px 0" }}>
              {items.map((it, i) =>
                it === null
                  ? <div key={i} style={{ height:1, background:"var(--border-subtle)", margin:"4px 0" }} />
                  : <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 14px", cursor:"pointer", color: it.danger ? "var(--colour-error-600)" : "var(--text-body)", font:"13px/1 var(--font-normal)" }}>
                      <span>{it.label}</span>
                      {it.shortcut && <span style={{ font:"11px/1 var(--font-mono)", color:"var(--text-caption)" }}>{it.shortcut}</span>}
                    </div>
              )}
            </div>
          </div>
        );
      },
      code:`<Menu\n  trigger={<Button hierarchy="tertiary">Actions ▾</Button>}\n  items={[\n    { label:"Edit", shortcut:"⌘E", onClick: edit },\n    { label:"Duplicate", shortcut:"⌘D", onClick: duplicate },\n    { divider: true },\n    { label:"Delete", danger: true, onClick: remove },\n  ]}\n/>`,
    },
    {
      id:"variants", title:"Variants",
      bullets:[
        ["Default","Standard dropdown with icons and keyboard shortcuts"],
        ["Selection","Checkmark items; one or many can be selected at once (radio or multi-check mode)"],
      ],
    },
    {
      id:"keyboard", title:"Keyboard interaction",
      table:{
        head:["Key","Action"],
        rows:[
          ["Enter / Space","Open menu from trigger"],
          ["↑ / ↓","Move focus through items"],
          ["→ / Enter","Open sub-menu (if applicable)"],
          ["← / Escape","Close sub-menu; Escape closes root menu"],
          ["Home / End","Jump to first / last item"],
          ["Type-ahead","Focus first item matching typed character(s)"],
        ],
      },
    },
    {
      id:"accessibility", title:"Accessibility",
      bullets:[
        ["Role","Menu panel has role=\"menu\"; each item has role=\"menuitem\" (or \"menuitemcheckbox\" for selection menus)"],
        ["Trigger","Has aria-haspopup=\"menu\" and aria-expanded"],
        ["Disabled items","aria-disabled=\"true\"; still rendered in DOM for screen readers but skipped by keyboard navigation"],
        ["Shortcut hints","Keyboard shortcut labels are aria-hidden — the shortcut itself is the accessible action"],
      ],
    },
    {
      id:"do-dont", title:"Do / Don't",
      doDont:{
        do:{ text:"Group related actions with dividers and keep the menu under 8 items — long flat lists are hard to scan." },
        dont:{ text:"Don't use a menu for primary actions — use a Button or action bar so the action is always visible without a click." },
      },
    },
  ],
  props:[["items","array","{ label, icon?, shortcut?, onClick?, divider?, danger?, disabled?, items? }[]"],["trigger","node","Element that opens the menu"],["side","enum","bottom, top, left, right"],["align","enum","start, center, end"]],
};

const Pagination = {
  id:"pagination", name:"Pagination", variants:"2 variants",
  description:"Page navigation control with previous / next buttons, numbered pages, and a per-page selector.",
  sections:[
    {
      id:"anatomy", title:"Anatomy",
      table:{
        head:["Part","Role"],
        rows:[
          ["Previous button","Navigate to the prior page; disabled on page 1"],
          ["Page button","Numbered button for jumping to a specific page"],
          ["Ellipsis","Indicates hidden page numbers between edges and the current page"],
          ["Active page","Current page highlighted with filled blue background"],
          ["Next button","Navigate to the next page; disabled on the last page"],
          ["Per-page selector","Optional <Select> to change how many rows appear per page"],
          ["Summary label","Optional text: 'Showing 1–10 of 234 results'"],
        ],
      },
      demo: () => {
        const pages = [1, 2, 3, null, 12];
        const active = 2;
        return (
          <div style={{ display:"flex", alignItems:"center", gap:4 }}>
            <button disabled style={{ width:32, height:32, borderRadius:"var(--radius-md)", border:"1px solid var(--border-default)", background:"var(--surface-page)", color:"var(--text-caption)", cursor:"not-allowed", font:"13px/1 var(--font-normal)" }}>‹</button>
            {pages.map((p, i) =>
              p === null
                ? <span key={i} style={{ width:32, textAlign:"center", color:"var(--text-caption)", font:"13px/1 var(--font-normal)" }}>…</span>
                : <button key={i} style={{ width:32, height:32, borderRadius:"var(--radius-md)", border: p === active ? "none" : "1px solid var(--border-default)", background: p === active ? "var(--colour-primaryblue-500)" : "var(--surface-page)", color: p === active ? "#fff" : "var(--text-body)", font: p === active ? "600 13px/1 var(--font-bold)" : "13px/1 var(--font-normal)", cursor:"pointer" }}>{p}</button>
            )}
            <button style={{ width:32, height:32, borderRadius:"var(--radius-md)", border:"1px solid var(--border-default)", background:"var(--surface-page)", color:"var(--text-body)", cursor:"pointer", font:"13px/1 var(--font-normal)" }}>›</button>
          </div>
        );
      },
      code:`<Pagination\n  page={2}\n  total={234}\n  perPage={10}\n  onChange={p => setPage(p)}\n/>`,
    },
    {
      id:"variants", title:"Variants",
      bullets:[
        ["Numbered","Full page number list with ellipsis truncation (default)"],
        ["Simple","Previous / Next buttons only with a 'Page X of Y' label — best for mobile or very long lists"],
      ],
    },
    {
      id:"accessibility", title:"Accessibility",
      bullets:[
        ["Role","Wrap in <nav> with aria-label=\"Pagination\""],
        ["Active page","aria-current=\"page\" on the active button"],
        ["Prev/Next","Descriptive aria-label (\"Previous page\" / \"Next page\"); aria-disabled when at the boundary"],
        ["Ellipsis","<span> with aria-hidden=\"true\" so screen readers don't read it as a button"],
      ],
    },
    {
      id:"do-dont", title:"Do / Don't",
      doDont:{
        do:{ text:"Always include the total count summary — users need to know how deep the list is to decide whether to filter before paginating." },
        dont:{ text:"Don't show pagination for lists under ~15 items — just render all rows; the extra chrome adds noise without benefit." },
      },
    },
  ],
  props:[["page","number","Current page (1-indexed)"],["total","number","Total item count"],["perPage","number","Items per page"],["onChange","func","(page: number) => void"],["perPageOptions","array","Available per-page values (default [10,25,50])"],["showSummary","boolean","Show 'X–Y of Z results' label"]],
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
  sections:[
    {
      id:"anatomy", title:"Anatomy",
      table:{
        head:["Part","Role"],
        rows:[
          ["Accordion root","List container holding all panels"],
          ["Panel header","Clickable / focusable row: title + trailing chevron"],
          ["Chevron","Rotates 180° when the panel is open; communicates state visually"],
          ["Panel body","Content area that collapses to 0 height when closed"],
          ["Divider","Separator line between panels"],
          ["Disabled panel","Header is non-interactive; slightly muted"],
        ],
      },
      demo: () => {
        const [open, setOpen] = React.useState<string | null>("q1");
        const items = [
          { id:"q1", title:"What is a design system?", body:"A design system is a collection of reusable components, guidelines, and standards that help teams build consistent digital products faster." },
          { id:"q2", title:"How do I contribute?", body:"Open a pull request against the main branch. All components require anatomy docs, variants, accessibility notes, and a demo before merging." },
          { id:"q3", title:"What token naming convention do you use?", body:"Tokens follow a three-layer model: Primitives → Alias → Component. Use alias tokens in components, never raw primitives." },
        ];
        return (
          <div style={{ maxWidth:480, border:"1px solid var(--border-subtle)", borderRadius:"var(--radius-lg)", overflow:"hidden" }}>
            {items.map((it, i) => (
              <div key={it.id} style={{ borderBottom: i < items.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
                <button
                  onClick={() => setOpen(open === it.id ? null : it.id)}
                  style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 18px", background:"transparent", border:"none", cursor:"pointer", font:"600 13px/1.4 var(--font-bold)", color:"var(--text-title)", textAlign:"left" }}
                >
                  {it.title}
                  <span style={{ transform: open === it.id ? "rotate(180deg)" : "rotate(0deg)", transition:"transform 0.2s", color:"var(--text-caption)", flexShrink:0 }}>▾</span>
                </button>
                {open === it.id && (
                  <div style={{ padding:"0 18px 16px", font:"13px/1.6 var(--font-normal)", color:"var(--text-body)" }}>{it.body}</div>
                )}
              </div>
            ))}
          </div>
        );
      },
      code:`<Accordion\n  defaultOpen={["q1"]}\n  items={[\n    { id:"q1", title:"What is a design system?", content:<p>A design system is...</p> },\n    { id:"q2", title:"How do I contribute?", content:<p>Open a PR...</p> },\n  ]}\n/>`,
    },
    {
      id:"variants", title:"Variants",
      bullets:[
        ["Single","Only one panel can be open at a time — opening a new panel closes the current one"],
        ["Multiple","Multiple panels can be open simultaneously (pass multiple prop)"],
      ],
    },
    {
      id:"keyboard", title:"Keyboard interaction",
      table:{
        head:["Key","Action"],
        rows:[
          ["Enter / Space","Toggle the focused panel open or closed"],
          ["↓","Move focus to the next panel header"],
          ["↑","Move focus to the previous panel header"],
          ["Home","Move focus to the first panel header"],
          ["End","Move focus to the last panel header"],
        ],
      },
    },
    {
      id:"accessibility", title:"Accessibility",
      bullets:[
        ["Role","Panel headers are <button> elements; the body region has role=\"region\" with aria-labelledby pointing to its header"],
        ["Expanded","Each button has aria-expanded reflecting the panel's open state"],
        ["Animation","Height transition respects prefers-reduced-motion — collapses instantly when reduced-motion is set"],
      ],
    },
    {
      id:"do-dont", title:"Do / Don't",
      doDont:{
        do:{ text:"Use accordion for secondary / supplementary content — FAQs, optional config, or progressive disclosure in long forms." },
        dont:{ text:"Don't hide critical information inside a closed panel by default — if the user must read it, show it." },
      },
    },
  ],
  props:[["items","array","{ id, title, content: ReactNode, disabled? }[]"],["multiple","boolean","Allow multiple panels open at once"],["defaultOpen","array","Panel IDs open on mount"]],
};

const Drawer = {
  id:"drawer", name:"Drawer", variants:"4 sides · 3 sizes",
  description:"A panel that slides in from the edge of the screen — used for secondary navigation, forms, and detail views.",
  sections:[
    {
      id:"anatomy", title:"Anatomy",
      table:{
        head:["Part","Role"],
        rows:[
          ["Backdrop","Dark overlay covering the rest of the screen; click to dismiss"],
          ["Panel","The slide-in surface containing header, body, and footer"],
          ["Header","Title + optional subtitle + close button (always present)"],
          ["Body","Scrollable content area"],
          ["Footer","Sticky action bar at the bottom of the panel (optional)"],
          ["Close button","× icon button in the header; always accessible via Escape as well"],
        ],
      },
      demo: () => {
        const [open, setOpen] = React.useState(false);
        return (
          <div>
            <button
              onClick={() => setOpen(true)}
              style={{ padding:"8px 18px", background:"var(--colour-primaryblue-500)", color:"#fff", borderRadius:"var(--radius-md)", border:"none", cursor:"pointer", font:"600 13px/1 var(--font-bold)" }}
            >Open Drawer</button>
            {open && (
              <div style={{ position:"fixed", inset:0, zIndex:50, display:"flex" }}>
                <div style={{ flex:1, background:"rgba(0,0,0,0.45)" }} onClick={() => setOpen(false)} />
                <div style={{ width:360, background:"var(--surface-page)", boxShadow:"-4px 0 24px rgba(0,0,0,0.14)", display:"flex", flexDirection:"column" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"18px 24px", borderBottom:"1px solid var(--border-subtle)" }}>
                    <span style={{ font:"700 15px/1 var(--font-bold)", color:"var(--text-title)" }}>Edit profile</span>
                    <button onClick={() => setOpen(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text-caption)", font:"18px/1 var(--font-normal)" }}>✕</button>
                  </div>
                  <div style={{ flex:1, padding:24, font:"13px/1.6 var(--font-normal)", color:"var(--text-body)" }}>Drawer body content goes here. This area scrolls independently of the rest of the page.</div>
                  <div style={{ padding:"14px 24px", borderTop:"1px solid var(--border-subtle)", display:"flex", gap:10, justifyContent:"flex-end" }}>
                    <button onClick={() => setOpen(false)} style={{ padding:"8px 16px", borderRadius:"var(--radius-md)", border:"1px solid var(--border-default)", background:"var(--surface-page)", color:"var(--text-body)", cursor:"pointer", font:"13px/1 var(--font-normal)" }}>Cancel</button>
                    <button style={{ padding:"8px 16px", borderRadius:"var(--radius-md)", border:"none", background:"var(--colour-primaryblue-500)", color:"#fff", cursor:"pointer", font:"600 13px/1 var(--font-bold)" }}>Save</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      },
      code:`<Drawer\n  open={open}\n  onClose={() => setOpen(false)}\n  side="right"\n  title="Edit profile"\n  size="Medium"\n  footer={<>\n    <Button hierarchy="secondary" onClick={close}>Cancel</Button>\n    <Button onClick={save}>Save</Button>\n  </>}\n>\n  {/* form content */}\n</Drawer>`,
    },
    {
      id:"variants", title:"Variants",
      bullets:[
        ["Right (default)","Slides in from the right — most common for detail panels and edit forms"],
        ["Left","Slides in from the left — secondary navigation or filter panels"],
        ["Top","Drops from the top — notifications or global messages on mobile"],
        ["Bottom","Rises from the bottom — mobile action sheets and quick settings"],
      ],
    },
    {
      id:"sizes", title:"Sizes",
      table:{
        head:["Size","Width (right/left)","Height (top/bottom)"],
        rows:[
          ["Small","320px","30vh"],
          ["Medium","480px","50vh"],
          ["Large","640px","80vh"],
        ],
      },
    },
    {
      id:"keyboard", title:"Keyboard interaction",
      table:{
        head:["Key","Action"],
        rows:[
          ["Escape","Close the drawer"],
          ["Tab","Cycle focus within the drawer (focus is trapped while open)"],
          ["Shift+Tab","Reverse cycle within the drawer"],
        ],
      },
    },
    {
      id:"accessibility", title:"Accessibility",
      bullets:[
        ["Role","Panel has role=\"dialog\" with aria-modal=\"true\" and aria-labelledby pointing to the header title"],
        ["Focus trap","Focus is locked inside the drawer while it is open; returns to the trigger element on close"],
        ["Scroll lock","Body scroll is disabled while the drawer is open to prevent disorienting background movement"],
      ],
    },
    {
      id:"do-dont", title:"Do / Don't",
      doDont:{
        do:{ text:"Use a sticky footer for primary actions (Save, Apply) — users scroll long forms and should not have to scroll back up to submit." },
        dont:{ text:"Don't nest drawers — if secondary actions are needed, use a modal or a new page instead of layering panels." },
      },
    },
  ],
  props:[["open","boolean","Controlled open state"],["onClose","func","Close handler (Escape or backdrop click)"],["side","enum","left, right, top, bottom"],["size","enum","Small, Medium, Large"],["title","node","Header title"],["footer","node","Sticky footer content (actions)"]],
};

const Carousel = {
  id:"carousel", name:"Carousel", variants:"2 variants",
  description:"A horizontal scroll container with navigation arrows, dot indicators and optional auto-advance.",
  sections:[
    {
      id:"anatomy", title:"Anatomy",
      table:{
        head:["Part","Role"],
        rows:[
          ["Track","Horizontal overflow container holding all slides"],
          ["Slide","Individual content panel; typically card or image"],
          ["Previous arrow","Circular icon button navigating to the prior slide"],
          ["Next arrow","Circular icon button navigating to the next slide"],
          ["Dot indicators","Row of dots below the track; filled dot marks the active slide"],
          ["Auto-play indicator","Optional progress bar or animated dot showing time until next slide"],
        ],
      },
      demo: () => {
        const [active, setActive] = React.useState(0);
        const slides = [
          { bg:"var(--colour-primaryblue-50)", label:"Slide 1 — Welcome" },
          { bg:"var(--colour-success-50)", label:"Slide 2 — Features" },
          { bg:"var(--colour-warning-50)", label:"Slide 3 — Pricing" },
        ];
        return (
          <div style={{ maxWidth:400 }}>
            <div style={{ position:"relative", borderRadius:"var(--radius-lg)", overflow:"hidden" }}>
              <div style={{ background: slides[active].bg, height:140, display:"flex", alignItems:"center", justifyContent:"center", transition:"background 0.3s" }}>
                <span style={{ font:"600 14px/1 var(--font-bold)", color:"var(--text-title)" }}>{slides[active].label}</span>
              </div>
              <button
                onClick={() => setActive(a => (a - 1 + slides.length) % slides.length)}
                style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", width:28, height:28, borderRadius:"50%", background:"var(--surface-raised)", border:"1px solid var(--border-subtle)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", font:"13px/1 var(--font-normal)", color:"var(--text-body)" }}
              >‹</button>
              <button
                onClick={() => setActive(a => (a + 1) % slides.length)}
                style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", width:28, height:28, borderRadius:"50%", background:"var(--surface-raised)", border:"1px solid var(--border-subtle)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", font:"13px/1 var(--font-normal)", color:"var(--text-body)" }}
              >›</button>
            </div>
            <div style={{ display:"flex", justifyContent:"center", gap:6, marginTop:12 }}>
              {slides.map((_, i) => (
                <button key={i} onClick={() => setActive(i)} style={{ width: i === active ? 20 : 8, height:8, borderRadius:4, background: i === active ? "var(--colour-primaryblue-500)" : "var(--colour-neutral-300)", border:"none", cursor:"pointer", transition:"width 0.2s, background 0.2s", padding:0 }} />
              ))}
            </div>
          </div>
        );
      },
      code:`<Carousel\n  showArrows\n  showDots\n  autoPlay\n  interval={4000}\n  items={[\n    <Card>Slide 1</Card>,\n    <Card>Slide 2</Card>,\n    <Card>Slide 3</Card>,\n  ]}\n/>`,
    },
    {
      id:"variants", title:"Variants",
      bullets:[
        ["Single-slide","One full-width slide visible at a time (default) — best for hero banners, onboarding steps"],
        ["Peek","Adjacent slides partially visible at the sides — signals there is more to scroll"],
      ],
    },
    {
      id:"accessibility", title:"Accessibility",
      bullets:[
        ["Role","Track has role=\"region\" with aria-label (e.g. 'Image carousel, slide 1 of 3')"],
        ["Live region","Slide change is announced via aria-live=\"polite\" on a visually hidden element"],
        ["Arrows","Previous / Next buttons have descriptive aria-label ('Previous slide' / 'Next slide')"],
        ["Auto-play","Must pause on hover, focus, or when prefers-reduced-motion is set. Provide a visible pause button."],
        ["Dots","Each dot button has aria-label ('Go to slide N') and aria-current='true' on the active one"],
      ],
    },
    {
      id:"do-dont", title:"Do / Don't",
      doDont:{
        do:{ text:"Always provide arrows and dots together — arrows are faster for keyboard users, dots show position at a glance for pointer users." },
        dont:{ text:"Don't use auto-play for anything other than visual content (images, hero banners) — rotating interactive content causes missed interactions and accessibility issues." },
      },
    },
  ],
  props:[["items","array","Slide content nodes (ReactNode[])"],["autoPlay","boolean","Auto-advance slides"],["interval","number","Auto-advance interval in ms (default 4000)"],["showDots","boolean","Show dot indicators"],["showArrows","boolean","Show prev / next arrow buttons"],["variant","enum","single, peek"]],
};

const GROUPS: any[] = [
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

export { GROUPS };
