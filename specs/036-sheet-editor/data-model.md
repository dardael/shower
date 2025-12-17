# Data Model: Sheet Editor Feature

**Feature Branch**: `036-sheet-editor`  
**Date**: 2025-12-17

## Overview

This feature uses Tiptap's built-in Table extension which handles table data structures internally. No new domain entities are required as tables are stored as HTML within the existing `PageContent.content` field.

## Storage Format

Tables are persisted as standard HTML within the `PageContentBody` value object:

```html
<table class="tiptap-table">
  <tbody>
    <tr>
      <th>Header 1</th>
      <th>Header 2</th>
    </tr>
    <tr>
      <td>Cell 1</td>
      <td>Cell 2</td>
    </tr>
    <tr>
      <td colspan="2">Merged cell spanning 2 columns</td>
    </tr>
  </tbody>
</table>
```

## Tiptap Internal Structures

### Table Node

Tiptap's Table extension creates a ProseMirror node with these attributes:

| Attribute        | Type                     | Description                          |
| ---------------- | ------------------------ | ------------------------------------ |
| `HTMLAttributes` | `Record<string, string>` | Custom HTML attributes (e.g., class) |

### TableRow Node

Represents a single row in the table:

| Attribute | Type | Description               |
| --------- | ---- | ------------------------- |
| (none)    | -    | Row structure is implicit |

### TableCell Node

Represents a data cell (`<td>`):

| Attribute  | Type               | Default | Description                                  |
| ---------- | ------------------ | ------- | -------------------------------------------- |
| `colspan`  | `number`           | `1`     | Number of columns the cell spans             |
| `rowspan`  | `number`           | `1`     | Number of rows the cell spans                |
| `colwidth` | `number[] \| null` | `null`  | Column widths (not used - resizing disabled) |

### TableHeader Node

Represents a header cell (`<th>`):

| Attribute  | Type               | Default | Description                                  |
| ---------- | ------------------ | ------- | -------------------------------------------- |
| `colspan`  | `number`           | `1`     | Number of columns the cell spans             |
| `rowspan`  | `number`           | `1`     | Number of rows the cell spans                |
| `colwidth` | `number[] \| null` | `null`  | Column widths (not used - resizing disabled) |

## Existing Entities (Unchanged)

### PageContent Entity

Location: `src/domain/pages/entities/PageContent.ts`

The table HTML is stored within the existing `content` field:

```typescript
interface PageContent {
  id: string;
  menuItemId: string;
  content: PageContentBody; // Contains table HTML
  createdAt: Date;
  updatedAt: Date;
}
```

### PageContentBody Value Object

Location: `src/domain/pages/value-objects/PageContentBody.ts`

No changes required. Tables are valid HTML content within the 100,000 character limit.

## UI State (Component Level)

### TableInsertDialogState

Used only within the TableInsertDialog component:

```typescript
interface TableInsertDialogState {
  isOpen: boolean;
  rows: number; // 1-20
  columns: number; // 1-20
}
```

### TableToolbarState

Derived from Tiptap editor state:

```typescript
interface TableToolbarState {
  isInTable: boolean; // editor.isActive('table')
  canAddRow: boolean; // editor.can().addRowAfter()
  canDeleteRow: boolean; // editor.can().deleteRow()
  canAddColumn: boolean; // editor.can().addColumnAfter()
  canDeleteColumn: boolean; // editor.can().deleteColumn()
  canMergeCells: boolean; // editor.can().mergeCells()
  canSplitCell: boolean; // editor.can().splitCell()
  canToggleHeader: boolean; // editor.can().toggleHeaderCell()
}
```

## Validation Rules

| Rule             | Constraint                                       | Error Message                               |
| ---------------- | ------------------------------------------------ | ------------------------------------------- |
| Table dimensions | 1 ≤ rows ≤ 20, 1 ≤ columns ≤ 20                  | "Table dimensions must be between 1 and 20" |
| Delete row       | Table must have > 1 row                          | (button disabled)                           |
| Delete column    | Table must have > 1 column                       | (button disabled)                           |
| Merge cells      | Selection must span adjacent cells               | (button disabled)                           |
| Split cell       | Cell must be merged (colspan > 1 or rowspan > 1) | (button disabled)                           |

## State Transitions

```
┌─────────────────┐
│  No Table       │
│  (cursor in     │
│   paragraph)    │
└────────┬────────┘
         │ insertTable({rows, cols})
         ▼
┌─────────────────┐
│  Table Active   │◄─────────────────┐
│  (cursor in     │                  │
│   cell)         │                  │
└────────┬────────┴───────┐          │
         │                │          │
    Operations:       deleteTable()  │
    • addRow*             │          │
    • deleteRow           │          │
    • addColumn*          │          │
    • deleteColumn        │          │
    • mergeCells          │          │
    • splitCell           │          │
    • toggleHeader        │          │
         │                │          │
         └────────────────┼──────────┘
                          │
                          ▼
                  ┌───────────────┐
                  │   No Table    │
                  │   (deleted)   │
                  └───────────────┘
```

## Database Impact

**None** - This feature uses the existing `PageContent` storage mechanism. Tables are stored as HTML strings within the content field, which is already designed to handle arbitrary HTML content.

## Migration Requirements

**None** - No schema changes required. Existing pages without tables continue to work unchanged.
