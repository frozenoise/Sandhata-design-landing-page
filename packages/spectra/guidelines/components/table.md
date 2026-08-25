# Table

A sortable data table with optional row selection and striping.

## Props

| Prop | Type | Notes |
|---|---|---|
| `columns` | `{ key, label, sortable?, secondary? }[]` | `secondary: true` renders that column's cell text in the muted colour |
| `rows` | `Record<string, any>[]` | Plain objects read via `row[column.key]`; needs an `id` field when `selectable` |
| `sortKey` | string | Currently-sorted column key |
| `sortDirection` | `"asc" \| "desc"` | Default `"asc"` |
| `onSort` | `(key) => void` | Called when a sortable header is clicked — you own the actual sorting of `rows` |
| `striped` | boolean | Alternate row background |
| `selectable` | boolean | Adds a checkbox column, composing the real `Checkbox` component |
| `selectedIds` | `Array<string \| number>` | |
| `onSelectRow` | `(id, checked) => void` | |
| `onSelectAll` | `(checked) => void` | Header checkbox |
| `emptyState` | node | Shown when `rows` is empty |

## Do / Don't

- **Do** own the actual sort/filter logic yourself — `Table` is presentational
  and calls `onSort`, it doesn't sort `rows` internally.
- **Don't** expect built-in pagination or column resizing — this component
  covers sorting, selection, and striping only. If a layout needs pagination,
  build a separate pager and slice `rows` yourself.

## Example

```jsx
import { Table } from "@sandhata/spectra";

<Table
  columns={[{ key: "name", label: "Name", sortable: true }, { key: "role", label: "Role", secondary: true }]}
  rows={[{ id: 1, name: "Ada", role: "Engineer" }]}
  selectable
  selectedIds={selected}
  onSelectRow={(id, checked) => setSelected(prev => checked ? [...prev, id] : prev.filter(x => x !== id))}
  striped
/>
```
