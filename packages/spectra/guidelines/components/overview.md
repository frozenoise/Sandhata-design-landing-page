# Component overview

All 23 components below are real, shipped, importable from `@sandhata/spectra`
— verified against the package source, not assumed. Each has its own
`components/<name>.md` file with its real props, anatomy, and do/don't
guidance; read that file before using the component.

## Buttons

| Component | Purpose |
|---|---|
| `Button` | The primary interactive control — five hierarchies, three sizes |
| `IconButton` | A square button holding a single icon, same hierarchies as Button |

## Data display

| Component | Purpose |
|---|---|
| `Accordion` | A list of collapsible panels, single-open by default |
| `Avatar` | Circular user marker — image or auto-generated initials |
| `Badge` | Small status pill, seven tones |
| `Card` | The base content surface — white layer, subtle border, soft shadow |
| `StatCard` | A KPI tile: label, large value, optional trend |
| `Table` | Sortable data table with optional row selection and striping |
| `Tag` | Removable chip/label, two tones |

## Feedback

| Component | Purpose |
|---|---|
| `Alert` | Inline banner with tone-based colour and icon |
| `Spinner` | Indeterminate loading indicator |
| `Tooltip` | Dark label shown on hover/focus of a child trigger |

## Forms

| Component | Purpose |
|---|---|
| `Checkbox` | Checkbox with label — checked/indeterminate/disabled |
| `Input` | Labelled single-line text field with helper/error states |
| `Radio` | Radio button with label, grouped by shared `name` |
| `Select` | Styled native select with label, chevron, helper/error states |
| `Switch` | Toggle switch for binary on/off settings |
| `Textarea` | Multi-line text field, same anatomy as Input |

## Navigation

| Component | Purpose |
|---|---|
| `Menu` | A trigger button that opens a dropdown option list |
| `Sidebar` | Collapsible navigation rail with grouped links |
| `Tabs` | Underline-style tab bar |

## Overlay

| Component | Purpose |
|---|---|
| `Drawer` | A panel anchored to a screen edge (filters, detail views) |
| `Modal` | A centred dialog over a page-dimming overlay |

## Not real components yet

These appear as illustrative reference material in this design system's own
documentation site, drawn from the Figma spec, but **have no importable
implementation** — do not `import` them from `@sandhata/spectra`. If a layout
needs one of these, either compose it from the real primitives above or flag
it as a gap rather than inventing an import that doesn't exist:

Timeline, Pagination, Carousel, Date range picker, Search bar, Upload files,
Numerical input (use `Input` with a numeric-friendly implementation instead),
Advanced data table (pagination/column-resizing beyond what `Table` does).
