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

// Nav icons used in Sidebar / Menu demos
const IcHome     = (s=16) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>);
const IcChart    = (s=16) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>);
const IcUsers    = (s=16) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const IcGrid     = (s=16) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>);
const IcSettings = (s=16) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>);
const IcLogout   = (s=16) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>);
const IcChevDn   = (s=14) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>);

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
      demo: () => {
        const [start, setStart] = React.useState("");
        const [end, setEnd] = React.useState("");
        const fieldStyle: React.CSSProperties = { height:38, padding:"0 10px", border:"1px solid var(--border-default)", borderRadius:"var(--radius-sm)", background:"var(--surface-page)", font:"14px/38px var(--font-normal)", color:"var(--text-title)", width:"100%", cursor:"pointer", outline:"none", boxSizing:"border-box" as const };
        return (
          <div style={{ display:"flex", flexDirection:"column", gap:16, maxWidth:440 }}>
            <div style={{ display:"flex", gap:24 }}>
              {([["Start date",start,setStart],["End date",end,setEnd]] as const).map(([lbl,val,set]) => (
                <div key={lbl} style={{ flex:1 }}>
                  <div style={{ font:"700 12px/1 var(--font-bold)", color:"var(--text-title)", marginBottom:6, letterSpacing:"0.4px" }}>{lbl}</div>
                  <input type="date" value={val} onChange={e => set(e.target.value)} style={fieldStyle} />
                </div>
              ))}
            </div>
            {start && end && new Date(start) <= new Date(end) && (
              <div style={{ font:"12px/1 var(--font-normal)", color:"var(--text-caption)", background:"var(--colour-primaryblue-50)", padding:"6px 10px", borderRadius:"var(--radius-sm)" }}>
                {Math.round((new Date(end).getTime()-new Date(start).getTime())/86400000)+1} days selected
              </div>
            )}
          </div>
        );
      },
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
    () => { const { Tag } = S(); const [tags, setTags] = React.useState(["Federalist","Democratic-Republican","Whig"]); const [inp, setInp] = React.useState(""); const add = (e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter" && inp.trim()) { setTags(t => [...t, inp.trim()]); setInp(""); } }; return (
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
          {tags.map((t,i) => <Tag key={i} onRemove={() => setTags(ts => ts.filter((_,j) => j !== i))}>{t}</Tag>)}
        </div>
        <input value={inp} onChange={e => setInp(e.target.value)} onKeyDown={add} placeholder="Type and press Enter to add a tag…" style={{ padding:"6px 10px", border:"1px solid var(--border-default)", borderRadius:"var(--radius-sm)", font:"14px/1 var(--font-normal)", color:"var(--text-title)", background:"var(--surface-page)", width:280, outline:"none" }} />
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
      demo: () => {
        const inputRef = React.useRef<HTMLInputElement>(null);
        const [files, setFiles] = React.useState<{name:string,size:number}[]>([]);
        const [drag, setDrag] = React.useState(false);
        const addFiles = (fl: FileList | null) => { if (!fl) return; setFiles(f => [...f, ...Array.from(fl).map(x => ({name:x.name, size:x.size}))]); };
        return (
          <div style={{ maxWidth:380 }}>
            <div
              onDrop={e => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
              onDragOver={e => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onClick={() => inputRef.current?.click()}
              style={{ border:`1.5px dashed ${drag ? "var(--colour-primaryblue-500)" : "var(--border-default)"}`, borderRadius:"var(--radius-lg)", padding:"32px 24px", textAlign:"center", background: drag ? "var(--colour-primaryblue-50)" : "var(--colour-neutral-50)", cursor:"pointer", transition:"background 0.15s,border-color 0.15s" }}
            >
              <input ref={inputRef} type="file" multiple accept="image/*,.pdf" style={{ display:"none" }} onChange={e => { addFiles(e.target.files); e.target.value = ""; }} />
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-caption)" strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom:12 }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <div style={{ font:"14px/1.5 var(--font-normal)", color:"var(--text-body)" }}>
                Drag files here or <span style={{ color:"var(--text-action)", textDecoration:"underline" }}>browse</span>
              </div>
              <div style={{ font:"12px/1.4 var(--font-light)", color:"var(--text-caption)", marginTop:4 }}>PNG, JPG, PDF up to 10 MB</div>
            </div>
            {files.length > 0 && (
              <div style={{ marginTop:8, border:"1px solid var(--border-subtle)", borderRadius:"var(--radius-md)", overflow:"hidden" }}>
                {files.map((f,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px", borderBottom: i < files.length-1 ? "1px solid var(--border-subtle)" : "none", background:"var(--surface-page)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-caption)" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <span style={{ flex:1, font:"13px/1 var(--font-normal)", color:"var(--text-title)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{f.name}</span>
                    <span style={{ font:"12px/1 var(--font-mono)", color:"var(--text-caption)" }}>{(f.size/1024).toFixed(0)} KB</span>
                    <button onClick={e => { e.stopPropagation(); setFiles(fs => fs.filter((_,j) => j !== i)); }} style={{ border:"none", background:"none", cursor:"pointer", color:"var(--text-caption)", padding:0, display:"flex" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      },
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
        const [hovered, setHovered] = React.useState<number | null>(null);
        const [sortDir, setSortDir] = React.useState<"asc"|"desc">("asc");
        const cols = ["Name","Role","Status"];
        const allRows = [["Alice Chen","Engineer","Active"],["Bob Okafor","Designer","Active"],["Carla Vega","Manager","Away"]];
        const rows = [...allRows].sort((a,b) => sortDir === "asc" ? a[0].localeCompare(b[0]) : b[0].localeCompare(a[0]));
        const cellStyle: React.CSSProperties = { padding:"12px", font:"300 14px/20px var(--font-light)", color:"var(--text-body)", borderBottom:"1px solid var(--border-default)" };
        const headStyle: React.CSSProperties = { padding:"12px", font:"400 12px/16px var(--font-normal)", color:"var(--text-title)", borderBottom:"1px solid var(--border-default)", textAlign:"left", letterSpacing:"0.3px", background:"var(--colour-primaryblue-50)", cursor:"pointer", userSelect:"none" as const };
        return (
          <div style={{ overflowX:"auto" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", borderBottom:"1px solid var(--border-subtle)" }}>
              <span style={{ font:"600 14px/1 var(--font-normal)", color:"var(--text-title)" }}>Team members</span>
              <span style={{ font:"12px/1 var(--font-normal)", color:"var(--text-caption)" }}>{rows.length} records</span>
            </div>
            <table style={{ width:"100%", borderCollapse:"collapse", border:"1px solid var(--border-default)", borderRadius:"4px 4px 0 0", overflow:"hidden" }}>
              <thead><tr>{cols.map((c,ci) => <th key={c} style={headStyle} onClick={ci===0 ? () => setSortDir(d => d==="asc"?"desc":"asc") : undefined}>{c}{ci===0 ? <span style={{ marginLeft:4, fontSize:10 }}>{sortDir==="asc"?"↑":"↓"}</span> : null}</th>)}</tr></thead>
              <tbody>{rows.map((r,i) => (
                <tr key={i} style={{ background: hovered===i ? "var(--colour-neutral-50)" : "var(--surface-page)", transition:"background 0.1s", cursor:"pointer" }} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                  {r.map((c,j) => <td key={j} style={cellStyle}>{c}</td>)}
                </tr>
              ))}</tbody>
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
          ["Selected","var(--background-highlight) tint (#7d61f1 / alternativepurple-400), checkbox checked"],
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
      demo: () => {
        const [expanded, setExpanded] = React.useState<string | null>(null);
        const [selected, setSelected] = React.useState<string[]>([]);
        const rows = [
          { id:"r1", name:"Alice Chen", dept:"Engineering", status:"Active" },
          { id:"r2", name:"Bob Okafor", dept:"Engineering", status:"Away" },
          { id:"r3", name:"Carla Vega", dept:"Design", status:"Active" },
        ];
        const cols = ["","Name","Department","Status",""];
        const thStyle: React.CSSProperties = { padding:12, font:"400 12px/16px var(--font-normal)", color:"var(--text-body)", textAlign:"left", borderBottom:"1px solid var(--border-default)", background:"var(--colour-primaryblue-50)", whiteSpace:"nowrap" };
        const tdStyle: React.CSSProperties = { padding:12, font:"300 14px/20px var(--font-normal)", color:"var(--text-title)", borderBottom:"1px solid var(--border-default)" };
        return (
          <div style={{ overflowX:"auto" }}>
            {/* Active filter chips */}
            <div style={{ display:"flex", gap:8, marginBottom:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:4, padding:"3px 10px", borderRadius:"var(--radius-pill)", background:"var(--colour-primaryblue-50)", border:"1px solid var(--colour-primaryblue-200)", font:"12px/1 var(--font-normal)", color:"var(--text-action)" }}>
                Dept: Engineering <span style={{ marginLeft:4, cursor:"pointer" }}>×</span>
              </div>
            </div>
            {/* Bulk action bar (shows when rows selected) */}
            {selected.length > 0 && (
              <div style={{ display:"flex", alignItems:"center", gap:12, padding:"8px 12px", background:"var(--colour-primaryblue-50)", borderRadius:"var(--radius-xl)", marginBottom:8, font:"13px/1 var(--font-normal)", color:"var(--text-action)" }}>
                <span>{selected.length} selected</span>
                <button style={{ padding:"4px 12px", borderRadius:"var(--radius-sm)", background:"var(--colour-primaryblue-500)", color:"#fff", border:"none", cursor:"pointer", font:"12px/1 var(--font-normal)" }}>Export</button>
                <button style={{ padding:"4px 12px", borderRadius:"var(--radius-sm)", background:"var(--colour-error-500)", color:"#fff", border:"none", cursor:"pointer", font:"12px/1 var(--font-normal)" }}>Delete</button>
              </div>
            )}
            <table style={{ width:"100%", borderCollapse:"collapse", borderRadius:"var(--radius-sm)", overflow:"hidden", border:"1px solid var(--border-default)" }}>
              <thead>
                <tr>{cols.map((c,i) => <th key={i} style={thStyle}>{c}</th>)}</tr>
                {/* Filter row */}
                <tr style={{ background:"var(--surface-secondary)" }}>
                  <td style={{ ...tdStyle, padding:"6px 12px" }} />
                  <td style={{ ...tdStyle, padding:"4px 8px" }}><input placeholder="Filter name…" style={{ width:"100%", padding:"4px 8px", border:"1px solid var(--border-default)", borderRadius:"var(--radius-sm)", font:"12px/1 var(--font-normal)", background:"var(--surface-page)" }} /></td>
                  <td style={{ ...tdStyle, padding:"4px 8px" }}><select style={{ width:"100%", padding:"4px 8px", border:"1px solid var(--border-default)", borderRadius:"var(--radius-sm)", font:"12px/1 var(--font-normal)", background:"var(--surface-page)" }}><option>All</option><option>Engineering</option><option>Design</option></select></td>
                  <td style={{ ...tdStyle, padding:"4px 8px" }} />
                  <td style={{ ...tdStyle, padding:"4px 8px" }} />
                </tr>
                {/* Group header */}
                <tr style={{ background:"var(--colour-neutral-100)" }}>
                  <td colSpan={5} style={{ padding:"8px 12px", font:"400 12px/16px var(--font-normal)", color:"var(--text-caption)" }}>Engineering — 2 rows</td>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <React.Fragment key={r.id}>
                    <tr style={{ background: selected.includes(r.id) ? "var(--colour-primaryblue-50)" : "var(--surface-page)" }}>
                      <td style={{ ...tdStyle, width:36 }}>
                        <input type="checkbox" checked={selected.includes(r.id)} onChange={e => setSelected(s => e.target.checked ? [...s, r.id] : s.filter(x => x !== r.id))} />
                      </td>
                      <td style={tdStyle}>{r.name}</td>
                      <td style={tdStyle}>{r.dept}</td>
                      <td style={tdStyle}>{r.status}</td>
                      <td style={{ ...tdStyle, width:36, cursor:"pointer", textAlign:"center" }} onClick={() => setExpanded(expanded === r.id ? null : r.id)}>
                        <span style={{ display:"inline-block", transform: expanded === r.id ? "rotate(90deg)" : "none", transition:"transform 0.15s" }}>›</span>
                      </td>
                    </tr>
                    {expanded === r.id && (
                      <tr><td colSpan={5} style={{ padding:"12px 24px", background:"var(--colour-neutral-50)", font:"13px/1.5 var(--font-normal)", color:"var(--text-body)", borderBottom:"1px solid var(--border-default)" }}>Expanded detail panel for {r.name} — any content can go here: sub-tables, forms, charts.</td></tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        );
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
  description:"A step navigation component — a vertical or horizontal list of labelled steps with directional separators. Used for wizards, process flows, and multi-step navigation.",
  sections:[
    {
      id:"anatomy", title:"Anatomy",
      table:{
        head:["Part","Role"],
        rows:[
          ["Container","White panel with a right-side border track (vertical) or bottom border (horizontal)"],
          ["Step item","Clickable row: label text (14px Regular) with 16px H / 8px V padding"],
          ["Separator","24px chevron icon (↓ between steps, › at the active/next branch)"],
          ["Active indicator","Step item highlighted with `background-active` fill and action-colour text"],
          ["Hover state","Step item background shifts to `background-hover` (#f5f6f8)"],
        ],
      },
      demo: () => {
        const steps = ["Overview","Details","Review","Confirm"];
        const [active, setActive] = React.useState(1);
        return (
          <div style={{ display:"flex", flexDirection:"column", background:"var(--surface-page)", borderRight:"1px solid var(--border-strong)", width:200 }}>
            {steps.map((s, i) => (
              <React.Fragment key={i}>
                <button
                  onClick={() => setActive(i)}
                  style={{ display:"flex", alignItems:"center", padding:"8px 16px", background: i === active ? "var(--colour-neutral-300)" : "var(--surface-page)", border:"none", cursor:"pointer", font:`14px/16px var(--font-normal)`, color: i === active ? "var(--text-action)" : "var(--text-title)", textAlign:"left" }}
                >
                  {s}
                </button>
                {i < steps.length - 1 && (
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", width:24, height:24, alignSelf:"center", color:"var(--text-caption)", fontSize:16, lineHeight:1 }}>
                    {i === active ? "›" : "↓"}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        );
      },
      code:`<Timeline\n  steps={["Overview","Details","Review","Confirm"]}\n  activeIndex={1}\n  orientation="vertical"\n  onStepClick={i => setStep(i)}\n/>`,
    },
    {
      id:"variants", title:"Variants",
      bullets:[
        ["Vertical (default)","Steps listed top-to-bottom; right-side border track; chevrons point downward (↓) between steps"],
        ["Horizontal","Steps listed left-to-right; bottom border track; chevrons point right (›) between steps"],
        ["With tooltip","Hovering a step shows a tooltip with the step description"],
      ],
    },
    {
      id:"states", title:"Item states",
      table:{
        head:["State","Background","Text"],
        rows:[
          ["Default","Surface page (white)","text-primary (#202225)"],
          ["Hover","background-hover (#f5f6f8)","text-primary"],
          ["Active / selected","background-active (#c0c7cf)","text-action (#0036dd) + › icon"],
          ["Tooltip","Surface raised + tooltip label","—"],
        ],
      },
    },
    {
      id:"accessibility", title:"Accessibility",
      bullets:[
        ["Role","Render as <nav> with aria-label; each step is a <button> or <a>"],
        ["Active step","aria-current=\"step\" on the active item"],
        ["Separators","Chevron icons are aria-hidden — they are decorative direction cues, not actions"],
      ],
    },
    {
      id:"do-dont", title:"Do / Don't",
      doDont:{
        do:{ text:"Use Timeline for sequential flows where order matters — onboarding wizards, checkout steps, or multi-stage forms." },
        dont:{ text:"Don't use it as a general-purpose menu — Sidebar is the right component for non-sequential navigation." },
      },
    },
  ],
  props:[["steps","array","Step label strings or { label, description? }[]"],["activeIndex","number","0-indexed active step"],["orientation","enum","vertical, horizontal"],["onStepClick","func","(index: number) => void"]],
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
        const [active, setActive] = React.useState("analytics");
        const items = [
          { id:"dashboard", label:"Dashboard", icon: IcHome(16) },
          { id:"analytics", label:"Analytics", icon: IcChart(16), sub:["Overview","Traffic","Conversions"] },
          { id:"users", label:"Users", icon: IcUsers(16) },
        ];
        const iconColor = (id: string) => id === active ? "var(--text-action)" : "var(--text-caption)";
        return (
          <div style={{ display:"flex", height:320, borderRadius:"var(--radius-xl)", overflow:"hidden" }}>
            <nav style={{ width:245, background:"var(--surface-page)", borderRight:"1px solid var(--border-strong)", display:"flex", flexDirection:"column", justifyContent:"space-between", flexShrink:0 }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:16, borderBottom:"1px solid var(--border-subtle)" }}>
                  <span style={{ font:"300 20px/28px var(--font-normal)", color:"var(--text-title)" }}>Workspace</span>
                  <span style={{ color:"var(--text-caption)" }}>{IcGrid(16)}</span>
                </div>
                {items.map(it => (
                  <div key={it.id}>
                    <button onClick={() => setActive(it.id)} style={{ width:"100%", display:"flex", alignItems:"center", gap:8, padding:"8px 16px", background: it.id === active ? "var(--colour-neutral-300)" : "var(--surface-page)", borderLeft: it.id === active ? "2px solid var(--colour-primaryblue-500)" : "2px solid transparent", border:"none", cursor:"pointer" }}>
                      <span style={{ color: iconColor(it.id), flexShrink:0, display:"flex" }}>{it.icon}</span>
                      <span style={{ font:"300 16px/24px var(--font-normal)", color: it.id === active ? "var(--colour-primaryblue-600)" : "var(--text-title)", flex:1, textAlign:"left" }}>{it.label}</span>
                      {it.sub && <span style={{ color:"var(--text-caption)", display:"flex", transform: it.id === active ? "rotate(180deg)" : "none", transition:"transform 0.2s" }}>{IcChevDn(14)}</span>}
                    </button>
                    {it.id === active && it.sub && it.sub.map((s, si) => (
                      <div key={si} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 16px 6px 40px", background:"var(--surface-page)" }}>
                        <span style={{ font:"300 14px/20px var(--font-normal)", color:"var(--text-body)" }}>{s}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div style={{ borderTop:"1px solid var(--border-subtle)", padding:"8px 0" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 16px", cursor:"pointer" }}>
                  <span style={{ color:"var(--text-caption)", display:"flex" }}>{IcSettings(16)}</span>
                  <span style={{ font:"300 16px/24px var(--font-normal)", color:"var(--text-title)" }}>Settings</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 16px", cursor:"pointer" }}>
                  <span style={{ color:"var(--colour-error-600)", display:"flex" }}>{IcLogout(16)}</span>
                  <span style={{ font:"300 16px/24px var(--font-normal)", color:"var(--colour-error-600)" }}>Logout</span>
                </div>
              </div>
            </nav>
            <div style={{ flex:1, padding:24, background:"var(--surface-secondary)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ font:"14px/1.5 var(--font-normal)", color:"var(--text-caption)" }}>Page content</span>
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
  description:"A sidebar navigation item — a single row with an icon, label, and optional expand arrow. Used inside the Sidebar component to build navigation groups with collapsible sub-menus.",
  sections:[
    {
      id:"anatomy", title:"Anatomy",
      table:{
        head:["Part","Role"],
        rows:[
          ["Icon","14px icon on the left of the label"],
          ["Label","IBM Plex Sans Light 16px/24px text — the nav destination name"],
          ["Arrow","14px trailing icon that rotates 180° when the item expands to show sub-items"],
          ["Sub-items","Indented rows (24px left padding vs 16px) shown when the parent is expanded"],
          ["Selected indicator","2px solid blue left border + background-active fill (#c0c7cf) + action text colour"],
        ],
      },
      demo: () => {
        const [expanded, setExpanded] = React.useState(true);
        const [selected, setSelected] = React.useState("sub1");
        return (
          <div style={{ width:245, background:"var(--surface-page)", border:"1px solid var(--border-subtle)", borderRadius:"var(--radius-xl)", overflow:"hidden" }}>
            {/* Default item */}
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 16px", borderLeft:"2px solid transparent" }}>
              <span style={{ color:"var(--text-caption)", display:"flex", flexShrink:0 }}>{IcHome(16)}</span>
              <span style={{ font:"300 16px/24px var(--font-normal)", color:"var(--text-title)", flex:1 }}>Dashboard</span>
            </div>
            {/* Expanded item */}
            <button onClick={() => setExpanded(e => !e)} style={{ width:"100%", display:"flex", alignItems:"center", gap:8, padding:"8px 16px", background:"var(--colour-neutral-50)", border:"none", borderLeft:"2px solid transparent", cursor:"pointer" }}>
              <span style={{ color:"var(--colour-primaryblue-600)", display:"flex", flexShrink:0 }}>{IcChart(16)}</span>
              <span style={{ font:"300 16px/24px var(--font-normal)", color:"var(--colour-primaryblue-600)", flex:1, textAlign:"left" }}>Analytics</span>
              <span style={{ color:"var(--text-caption)", display:"flex", transform: expanded ? "rotate(180deg)" : "none", transition:"transform 0.2s" }}>{IcChevDn(14)}</span>
            </button>
            {expanded && ["Overview","Traffic","Conversions"].map((s, i) => (
              <button key={i} onClick={() => setSelected(`sub${i+1}`)} style={{ width:"100%", display:"flex", alignItems:"center", gap:8, padding:"8px 16px 8px 40px", background: selected === `sub${i+1}` ? "var(--colour-neutral-300)" : "var(--surface-page)", borderLeft: selected === `sub${i+1}` ? "2px solid var(--colour-primaryblue-500)" : "2px solid transparent", border:"none", cursor:"pointer" }}>
                <span style={{ font:"300 14px/20px var(--font-normal)", color: selected === `sub${i+1}` ? "var(--text-action)" : "var(--text-body)" }}>{s}</span>
              </button>
            ))}
            {/* Link item */}
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 16px", borderLeft:"2px solid transparent" }}>
              <span style={{ color:"var(--text-caption)", display:"flex", flexShrink:0 }}>{IcUsers(16)}</span>
              <span style={{ font:"300 16px/24px var(--font-normal)", color:"var(--text-title)" }}>Users</span>
            </div>
          </div>
        );
      },
      code:`<Menu property1="Default">\n  <MenuIcon />\n  Menu\n</Menu>\n\n<Menu property1="Clicked / Expand">\n  <MenuIcon />\n  Menu\n  <SubMenu items={["Sub-Menu 1","Sub-Menu 2","Sub-Menu 3"]} />\n</Menu>`,
    },
    {
      id:"variants", title:"Variants",
      bullets:[
        ["Default","White background, icon + label + arrow icon; not selected"],
        ["Hover","Background shifts to background-hover (#f5f6f8)"],
        ["Selected","background-active (#c0c7cf) + 2px blue left border + action-colour text"],
        ["Clicked / Expand","Selected + reveals sub-item rows indented to 24px; arrow rotates 180°"],
        ["Link","Label only, no arrow — used for simple flat nav links (e.g. Settings, Logout)"],
      ],
    },
    {
      id:"keyboard", title:"Keyboard interaction",
      table:{
        head:["Key","Action"],
        rows:[
          ["Enter / Space","Toggle expansion on expandable items"],
          ["↑ / ↓","Move focus between menu items"],
          ["Tab","Move focus to next focusable element"],
        ],
      },
    },
    {
      id:"accessibility", title:"Accessibility",
      bullets:[
        ["Role","Each menu item is a <button> (expandable) or <a> (link)"],
        ["Expanded state","Expandable items have aria-expanded reflecting the open/closed state"],
        ["Selected","Active route item has aria-current=\"page\""],
        ["Sub-items","Hidden sub-items are removed from the DOM (not just visually hidden) when collapsed"],
      ],
    },
    {
      id:"do-dont", title:"Do / Don't",
      doDont:{
        do:{ text:"Use Menu inside Sidebar to build grouped navigation — it is not a standalone floating dropdown." },
        dont:{ text:"Don't put more than 3 sub-items under one Menu item; use a separate Sidebar group instead." },
      },
    },
  ],
  props:[["property1","enum","Default, Hover, Selected, Clicked / Expand, Link"],["icon","node","14px icon on the leading edge"],["label","string","Nav item label"],["subItems","array","Sub-menu item labels (shown when expanded)"]],
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
        const TOTAL = 10;
        const [page, setPage] = React.useState(1);
        const getPages = (cur: number, tot: number) => {
          const SIB = 2;
          const left = Math.max(2, cur - SIB);
          const right = Math.min(tot - 1, cur + SIB);
          const result: (number|null)[] = [1];
          if (left > 2) result.push(null);
          for (let i = left; i <= right; i++) result.push(i);
          if (right < tot - 1) result.push(null);
          if (tot > 1) result.push(tot);
          return result;
        };
        const pages = getPages(page, TOTAL);
        const btnStyle = (p: number): React.CSSProperties => ({
          minWidth:28, height:28, borderRadius:"var(--radius-xl)", background: p === page ? "var(--colour-neutral-200)" : "transparent",
          border:"none", cursor:"pointer", font:`12px/28px var(--font-mono)`, color:"var(--text-title)", padding:"0 6px", fontVariantNumeric:"tabular-nums"
        });
        const navBtn = (disabled: boolean): React.CSSProperties => ({
          width:28, height:28, borderRadius:"var(--radius-xl)", background:"transparent", border:"none",
          cursor: disabled ? "not-allowed" : "pointer", display:"flex", alignItems:"center", justifyContent:"center",
          color: disabled ? "var(--text-disabled)" : "var(--text-body)"
        });
        return (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <nav aria-label="Pagination" style={{ display:"flex", alignItems:"center", gap:2 }}>
              <button style={{ ...navBtn(page===1), font:"12px/1 var(--font-normal)", width:"auto", padding:"0 6px" }} disabled={page===1} onClick={() => setPage(1)}>First</button>
              <button style={navBtn(page===1)} disabled={page===1} onClick={() => setPage(p => p-1)}>
                <span style={{ transform:"rotate(180deg)", display:"inline-block", fontSize:14 }}>›</span>
              </button>
              <div style={{ display:"flex", alignItems:"center", gap:2 }}>
                {pages.map((p, i) =>
                  p === null
                    ? <span key={`e${i}`} style={{ width:28, textAlign:"center", font:"12px/1 var(--font-mono)", color:"var(--text-caption)" }}>…</span>
                    : <button key={p} onClick={() => setPage(p)} style={btnStyle(p)}>{p}</button>
                )}
              </div>
              <button style={navBtn(page===TOTAL)} disabled={page===TOTAL} onClick={() => setPage(p => p+1)}>
                <span style={{ fontSize:14 }}>›</span>
              </button>
              <button style={{ ...navBtn(page===TOTAL), font:"12px/1 var(--font-normal)", width:"auto", padding:"0 6px" }} disabled={page===TOTAL} onClick={() => setPage(TOTAL)}>Last</button>
            </nav>
            <div style={{ font:"12px/1 var(--font-normal)", color:"var(--text-caption)" }}>Showing {(page-1)*10+1}–{Math.min(page*10,100)} of 100 results</div>
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
    () => { const { Alert } = S(); const [show, setShow] = React.useState(true); return (
      <div style={{ display:"flex", flexDirection:"column", gap:10, maxWidth:460 }}>
        <Alert tone="success" title="Saved">Your changes were saved successfully.</Alert>
        {show && <Alert tone="warning" title="Heads up" onClose={() => setShow(false)}>Your trial ends in 3 days — click × to dismiss.</Alert>}
        {!show && <div style={{ font:"12px/1 var(--font-normal)", color:"var(--text-caption)" }}>Alert dismissed. Reload to restore.</div>}
        <Alert tone="error">Something went wrong. Please try again.</Alert>
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
      <div style={{ padding:"48px 32px 32px", display:"flex", gap:20, flexWrap:"wrap", alignItems:"center" }}>
        <Tooltip label="Tooltip — top" side="top"><B hierarchy="tertiary">Top</B></Tooltip>
        <Tooltip label="Tooltip — right" side="right"><B hierarchy="tertiary">Right</B></Tooltip>
        <Tooltip label="Tooltip — bottom" side="bottom"><B hierarchy="tertiary">Bottom</B></Tooltip>
        <Tooltip label="Tooltip — left" side="left"><B hierarchy="tertiary">Left</B></Tooltip>
      </div>
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
          { id:"q1", title:"This is an Accordion", body:"This is the accordion text. It describes the section content in more detail using IBM Plex Sans Light at 16px." },
          { id:"q2", title:"This is an Accordion", body:"This is the accordion text. Use accordions to progressively reveal secondary or optional content." },
        ];
        return (
          <div style={{ display:"flex", flexDirection:"column", gap:8, maxWidth:618 }}>
            {items.map(it => (
              <button
                key={it.id}
                onClick={() => setOpen(open === it.id ? null : it.id)}
                style={{ width:"100%", background: open === it.id ? "var(--surface-page)" : "var(--surface-page)", border:"1px solid var(--border-default)", borderRadius:"var(--radius-xl)", padding:"20px 24px", cursor:"pointer", textAlign:"left", display:"flex", flexDirection:"column", gap: open === it.id ? 20 : 0 }}
              >
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <span style={{ width:24, height:24, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, font:"300 24px/1 var(--font-normal)", color:"var(--text-title)" }}>{open === it.id ? "−" : "+"}</span>
                  <span style={{ font:"300 20px/28px var(--font-normal)", color:"var(--text-title)", flex:1 }}>{it.title}</span>
                </div>
                {open === it.id && (
                  <div style={{ paddingLeft:32, font:"300 16px/24px var(--font-normal)", color:"var(--text-body)" }}>{it.body}</div>
                )}
              </button>
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
  id:"drawer", name:"Drawer", variants:"4 sides · Open=True",
  description:"A resizable panel anchored to a screen edge — used for detail views, filter panels, and secondary content. A drag handle (dragger pill) marks the resizable edge. Content is an instance slot with 32px padding.",
  sections:[
    {
      id:"anatomy", title:"Anatomy",
      table:{
        head:["Part","Role"],
        rows:[
          ["Panel","White surface (background/background) anchored to an edge; padding 32px; gap 24px between dragger and content"],
          ["Dragger","Pill-shaped resize handle: 64×8px (top/bottom) or 8×64px (left/right); background layer-accent-01 (#e9ebee); border-radius full (999px)"],
          ["Instance slot","Content placeholder area — receives any component or layout (form, list, detail view)"],
        ],
      },
      demo: () => {
        const [side, setSide] = React.useState<"right"|"bottom">("right");
        return (
          <div style={{ position:"relative", height:260, border:"1px solid var(--border-subtle)", borderRadius:"var(--radius-xl)", overflow:"hidden", background:"var(--surface-secondary)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => setSide("right")} style={{ padding:"6px 14px", borderRadius:"var(--radius-xl)", border:"1px solid var(--border-default)", background: side==="right" ? "var(--colour-primaryblue-500)" : "var(--surface-page)", color: side==="right" ? "#fff" : "var(--text-body)", cursor:"pointer", font:"12px/1 var(--font-normal)" }}>Right</button>
              <button onClick={() => setSide("bottom")} style={{ padding:"6px 14px", borderRadius:"var(--radius-xl)", border:"1px solid var(--border-default)", background: side==="bottom" ? "var(--colour-primaryblue-500)" : "var(--surface-page)", color: side==="bottom" ? "#fff" : "var(--text-body)", cursor:"pointer", font:"12px/1 var(--font-normal)" }}>Bottom</button>
            </div>
            {/* Right drawer — user detail panel */}
            {side === "right" && (
              <div style={{ position:"absolute", top:0, right:0, bottom:0, width:260, background:"var(--surface-page)", display:"flex", flexDirection:"row" }}>
                <div style={{ width:8, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <div style={{ width:8, height:64, background:"var(--colour-neutral-200)", borderRadius:999 }} />
                </div>
                <div style={{ flex:1, padding:"24px 20px", display:"flex", flexDirection:"column", gap:16, overflowY:"auto" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:40, height:40, borderRadius:"50%", background:"var(--colour-primaryblue-100)", display:"flex", alignItems:"center", justifyContent:"center", font:"600 16px/1 var(--font-normal)", color:"var(--colour-primaryblue-600)", flexShrink:0 }}>AC</div>
                    <div>
                      <div style={{ font:"600 14px/1.2 var(--font-normal)", color:"var(--text-title)" }}>Alice Chen</div>
                      <div style={{ font:"12px/1 var(--font-normal)", color:"var(--text-caption)", marginTop:3 }}>alice@sandhata.io</div>
                    </div>
                  </div>
                  <div style={{ borderTop:"1px solid var(--border-subtle)", paddingTop:12, display:"flex", flexDirection:"column", gap:8 }}>
                    {[["Role","Senior Engineer"],["Team","Platform"],["Status","Active"],["Joined","Jan 2022"]].map(([k,v]) => (
                      <div key={k} style={{ display:"flex", justifyContent:"space-between" }}>
                        <span style={{ font:"12px/1 var(--font-normal)", color:"var(--text-caption)" }}>{k}</span>
                        <span style={{ font:"12px/1 var(--font-normal)", color:"var(--text-title)" }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button style={{ flex:1, padding:"7px 0", background:"var(--colour-primaryblue-500)", color:"#fff", border:"none", borderRadius:"var(--radius-sm)", font:"12px/1 var(--font-normal)", cursor:"pointer" }}>Edit</button>
                    <button style={{ flex:1, padding:"7px 0", background:"transparent", color:"var(--colour-error-600)", border:"1px solid var(--colour-error-200)", borderRadius:"var(--radius-sm)", font:"12px/1 var(--font-normal)", cursor:"pointer" }}>Remove</button>
                  </div>
                </div>
              </div>
            )}
            {/* Bottom drawer — quick filters */}
            {side === "bottom" && (
              <div style={{ position:"absolute", left:0, right:0, bottom:0, height:140, background:"var(--surface-page)", display:"flex", flexDirection:"column" }}>
                <div style={{ padding:"16px 24px", flex:1, display:"flex", flexDirection:"column", gap:12 }}>
                  <div style={{ font:"600 13px/1 var(--font-normal)", color:"var(--text-title)" }}>Filters</div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    {["Active","Pending","Archived"].map(f => (
                      <button key={f} style={{ padding:"5px 12px", borderRadius:"var(--radius-pill)", border:"1px solid var(--border-default)", background:"var(--surface-page)", font:"12px/1 var(--font-normal)", color:"var(--text-body)", cursor:"pointer" }}>{f}</button>
                    ))}
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button style={{ padding:"6px 16px", background:"var(--colour-primaryblue-500)", color:"#fff", border:"none", borderRadius:"var(--radius-sm)", font:"12px/1 var(--font-normal)", cursor:"pointer" }}>Apply</button>
                    <button style={{ padding:"6px 16px", background:"transparent", color:"var(--text-caption)", border:"none", font:"12px/1 var(--font-normal)", cursor:"pointer" }}>Clear</button>
                  </div>
                </div>
                <div style={{ display:"flex", justifyContent:"center", padding:"8px 0" }}>
                  <div style={{ width:64, height:8, background:"var(--colour-neutral-200)", borderRadius:999 }} />
                </div>
              </div>
            )}
          </div>
        );
      },
      code:`<Drawer align="Right" open="True">\n  {/* Instance slot — any content */}\n  <YourFormOrDetailView />\n</Drawer>`,
    },
    {
      id:"variants", title:"Alignment variants",
      bullets:[
        ["Top","Panel drops from the top; horizontal dragger pill below the content; width: full viewport"],
        ["Bottom (default)","Panel rises from the bottom; horizontal dragger pill above the content; width: full viewport"],
        ["Left","Panel slides from the left; vertical dragger pill on the right edge; height: full viewport, width: 385px"],
        ["Right","Panel slides from the right; vertical dragger pill on the left edge; height: full viewport, width: 385px"],
      ],
    },
    {
      id:"dragger", title:"Dragger pill",
      table:{
        head:["Alignment","Dragger size","Position"],
        rows:[
          ["Top / Bottom","64×8px (W×H)","Between content and the screen edge"],
          ["Left / Right","8×64px (W×H)","Between content and the screen edge"],
        ],
      },
      note:"The dragger pill is always background `layer-accent-01` (#e9ebee) with border-radius `full` (999px). On hover it shifts to `layer-hover-01` (#d5dbde).",
    },
    {
      id:"accessibility", title:"Accessibility",
      bullets:[
        ["Role","Panel has role=\"complementary\" or role=\"dialog\" depending on use case"],
        ["Dragger","Dragger has role=\"separator\" with aria-orientation and aria-valuenow for resize value"],
        ["Focus","When opened programmatically, move focus to the first interactive element inside the panel"],
      ],
    },
    {
      id:"do-dont", title:"Do / Don't",
      doDont:{
        do:{ text:"Use Bottom or Right alignment for detail views that supplement the main content — the user should be able to see both simultaneously." },
        dont:{ text:"Don't use Drawer as a navigation panel — use Sidebar. Drawer is for contextual detail and secondary content that co-exists with the main view." },
      },
    },
  ],
  props:[["align","enum","Top, Bottom, Left, Right"],["open","enum","True (only Open=True variants exist; Open=False is TODO in design)"],["children","node","Instance slot content"]],
};

const Carousel = {
  id:"carousel", name:"Carousel", variants:"10 slide variants",
  description:"A full-width image carousel with prev/next navigation controls positioned at the top-right. Slides are full-bleed images with border-radius large (16px). Up to 10 slide variants. AutoPlay and indicator controls are planned (TODO in design).",
  sections:[
    {
      id:"anatomy", title:"Anatomy",
      table:{
        head:["Part","Role"],
        rows:[
          ["Carousel root","Flex column, full width; gap 24px between control row and slide"],
          ["Control row","Right-aligned row of prev/next icon buttons; sits ABOVE the slide area"],
          ["Prev button","24×24px icon button; disabled state: `var(--button/button-disabled, #a9b5bf)` fill; active state: 2px secondary border"],
          ["Next button","24×24px icon button; same styling as Prev, enabled when not on last slide"],
          ["Slide container","overflow:clip, full width, height 665px; clips the active slide"],
          ["Slide","Full-bleed image, border-radius `var(--radius/large, 16px)`; positioned absolutely and shifted by 1328px × slide index"],
        ],
      },
      demo: () => {
        const [slide, setSlide] = React.useState(0);
        const total = 3;
        const colours = ["var(--colour-neutral-100)","var(--colour-neutral-200)","var(--colour-neutral-300)"];
        return (
          <div style={{ display:"flex", flexDirection:"column", gap:24, width:"100%" }}>
            {/* Control row — top right */}
            <div style={{ display:"flex", gap:12, justifyContent:"flex-end", alignItems:"center" }}>
              <button
                disabled={slide === 0}
                onClick={() => setSlide(s => s-1)}
                style={{ width:24, height:24, borderRadius:"var(--radius-sm)", border: slide === 0 ? "none" : "2px solid var(--colour-primaryblue-50)", background: slide === 0 ? "var(--colour-neutral-400)" : "transparent", cursor: slide === 0 ? "not-allowed" : "pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
              >
                <span style={{ font:"11px/1 var(--font-mono)", color: slide === 0 ? "var(--surface-page)" : "var(--text-body)", transform:"rotate(180deg)", display:"inline-block" }}>›</span>
              </button>
              <button
                disabled={slide === total-1}
                onClick={() => setSlide(s => s+1)}
                style={{ width:24, height:24, borderRadius:"var(--radius-sm)", border: slide === total-1 ? "none" : "2px solid var(--colour-primaryblue-50)", background: slide === total-1 ? "var(--colour-neutral-400)" : "transparent", cursor: slide === total-1 ? "not-allowed" : "pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
              >
                <span style={{ font:"11px/1 var(--font-mono)", color: slide === total-1 ? "var(--surface-page)" : "var(--text-body)" }}>›</span>
              </button>
            </div>
            {/* Slide */}
            <div style={{ width:"100%", height:160, overflow:"hidden", borderRadius:16, position:"relative" }}>
              <div style={{ display:"flex", position:"absolute", top:0, left:`-${slide * 100}%`, width:`${total * 100}%`, height:"100%", transition:"left 0.3s ease" }}>
                {colours.map((c, i) => (
                  <div key={i} style={{ width:`${100/total}%`, height:"100%", background:c, borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <span style={{ font:"12px/1 var(--font-mono)", color:"var(--text-caption)" }}>Slide {i+1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      },
      code:`<Carousel slide="1" />\n{/* slide prop: "1"–"10" — controls which image is shown */}\n{/* TODO: AutoPlay and Indicators properties (not yet in design) */}`,
    },
    {
      id:"variants", title:"Variants",
      bullets:[
        ["Slides 1–10","Each slide variant (prop: slide=\"1\" to slide=\"10\") shows a different image in the active position"],
        ["Prev disabled","On slide 1, the prev button renders as disabled (filled background-disabled, no border)"],
        ["Next disabled","On the last slide, the next button renders as disabled"],
      ],
      note:"AutoPlay and indicator controls (dots) are planned as a Type property in a future design update.",
    },
    {
      id:"accessibility", title:"Accessibility",
      bullets:[
        ["Region","Wrap in <section> with aria-label='Image carousel'"],
        ["Live region","Active slide change is announced via aria-live='polite' on a visually hidden element"],
        ["Prev/Next","Buttons have descriptive aria-label ('Previous slide' / 'Next slide'); aria-disabled on boundary slides"],
        ["Reduced motion","Slide transition is instant when prefers-reduced-motion is set"],
      ],
    },
    {
      id:"do-dont", title:"Do / Don't",
      doDont:{
        do:{ text:"Use full-bleed images that have a consistent aspect ratio — the 665px height is fixed, so images should be cropped to fit at 16:9 or wider." },
        dont:{ text:"Don't use the Carousel for interactive content (forms, lists, tables) — it is an image display component only." },
      },
    },
  ],
  props:[["slide","enum","\"1\" – \"10\" — active slide index"],["autoPlay","boolean","TODO: not yet in design — do not implement"],["showDots","boolean","TODO: not yet in design — do not implement"]],
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
