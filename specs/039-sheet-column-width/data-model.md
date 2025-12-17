# Data Model: Sheet Column Width Configuration

**Feature**: 039-sheet-column-width
**Date**: 2025-12-17

## Overview

This feature modifies the existing table cell attributes in the Tiptap editor. No new database entities are created - column widths are stored as HTML attributes within the existing page content HTML string.

## Attribute Definitions

### TableCell / TableHeader Attributes

| Attribute  | Type             | Default | Description                                                     |
| ---------- | ---------------- | ------- | --------------------------------------------------------------- |
| `colwidth` | `number \| null` | `null`  | Column width in pixels. `null` means auto-adapt to table width. |

### HTML Representation

```html
<!-- Cell with explicit width -->
<td data-colwidth="[150]">Content</td>

<!-- Cell with auto width (default) -->
<td>Content</td>

<!-- Header cell with explicit width -->
<th data-colwidth="[200]">Header</th>
```

### Attribute Format

The `colwidth` attribute uses a JSON array format `[width]` to maintain compatibility with Tiptap's native handling of merged cells (which can have multiple widths for colspan scenarios).

**Parsing logic** (already in PublicPageContent.tsx):

```typescript
// Handles both "[150]" (array) and "150" (plain) formats
const colwidth = cell.getAttribute('data-colwidth');
if (colwidth) {
  try {
    const widths = JSON.parse(colwidth);
    if (Array.isArray(widths) && widths[0]) {
      cell.style.width = `${widths[0]}px`;
    }
  } catch {
    const width = parseInt(colwidth, 10);
    if (!isNaN(width) && width > 0) {
      cell.style.width = `${width}px`;
    }
  }
}
```

## Validation Rules

| Rule           | Description                                 |
| -------------- | ------------------------------------------- |
| Minimum width  | When set, must be >= 50 pixels              |
| Type           | Positive integer or null                    |
| Empty handling | Empty input sets value to null (auto-adapt) |

## State Transitions

```
null (auto) ──[user enters value >= 50]──> number (fixed width)
     │                                           │
     │                                           │
     └──────[user clears input]──────────────────┘
```

## Storage Location

Column widths are embedded in the HTML content string stored in the `PageContent` MongoDB collection. No schema changes required.

```
PageContent.content (HTML string)
  └── <table>
        └── <tr>
              └── <td data-colwidth="[150]">...</td>
```
