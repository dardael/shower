# Data Model: Sheet Cell Formatting

**Feature**: 037-sheet-cell-format
**Date**: 2025-12-17

## Overview

This feature extends the existing Tiptap table implementation with custom HTML data attributes for border thickness and vertical alignment. No new database entities are required - data is stored within the existing HTML content structure.

## Entities

### Table Node (Extended)

Extends the existing Tiptap Table node with a new attribute.

| Attribute       | Type   | Default | Constraints      | Description                                     |
| --------------- | ------ | ------- | ---------------- | ----------------------------------------------- |
| borderThickness | number | 1       | 0-10 (inclusive) | Border thickness in pixels for all cell borders |

**HTML Representation**:

```html
<table class="tiptap-table" data-border-thickness="2">
  ...
</table>
```

**Validation Rules**:

- Value must be an integer between 0 and 10
- Values outside range are clamped to nearest valid value
- Missing attribute defaults to 1 (backward compatibility)

---

### TableCell Node (Extended)

Extends the existing Tiptap TableCell node with a new attribute.

| Attribute     | Type | Default | Constraints                   | Description                        |
| ------------- | ---- | ------- | ----------------------------- | ---------------------------------- |
| verticalAlign | enum | 'top'   | 'top' \| 'center' \| 'bottom' | Vertical alignment of cell content |

**HTML Representation**:

```html
<td data-vertical-align="center">Cell content</td>
```

**Validation Rules**:

- Value must be one of: 'top', 'center', 'bottom'
- Invalid values default to 'top'
- Missing attribute defaults to 'top' (backward compatibility)

---

### TableHeader Node (Extended)

Same extension as TableCell for consistency.

| Attribute     | Type | Default | Constraints                   | Description                               |
| ------------- | ---- | ------- | ----------------------------- | ----------------------------------------- |
| verticalAlign | enum | 'top'   | 'top' \| 'center' \| 'bottom' | Vertical alignment of header cell content |

**HTML Representation**:

```html
<th data-vertical-align="bottom">Header content</th>
```

## Type Definitions

```typescript
// src/presentation/admin/components/PageContentEditor/types.ts

export type VerticalAlignment = 'top' | 'center' | 'bottom';

export interface TableFormatAttributes {
  borderThickness: number;
}

export interface CellFormatAttributes {
  verticalAlign: VerticalAlignment;
}

export const BORDER_THICKNESS_MIN = 0;
export const BORDER_THICKNESS_MAX = 10;
export const BORDER_THICKNESS_DEFAULT = 1;
export const VERTICAL_ALIGN_DEFAULT: VerticalAlignment = 'top';
```

## State Transitions

### Border Thickness Update Flow

```
User clicks border thickness control
    ↓
User selects value (0-10)
    ↓
Editor command updates table node attribute
    ↓
Tiptap re-renders table with new data-border-thickness
    ↓
CSS applies border-width based on attribute
    ↓
onChange callback fires with updated HTML
    ↓
Parent component receives new content for persistence
```

### Vertical Alignment Update Flow

```
User positions cursor in cell
    ↓
User clicks alignment control (top/center/bottom)
    ↓
Editor command updates tableCell node attribute
    ↓
Tiptap re-renders cell with new data-vertical-align
    ↓
CSS applies vertical-align based on attribute
    ↓
onChange callback fires with updated HTML
    ↓
Parent component receives new content for persistence
```

## Backward Compatibility

### Existing Content Handling

Tables created before this feature will not have the new data attributes:

```html
<!-- Existing table (pre-feature) -->
<table class="tiptap-table">
  <tr>
    <td>Content</td>
  </tr>
</table>
```

**Behavior**:

- CSS defaults apply: `border-width: 1px`, `vertical-align: top`
- When edited, Tiptap adds default attribute values
- No migration required - graceful degradation

### Attribute Parsing

```typescript
// parseHTML handles missing attributes with defaults
parseHTML: element => element.getAttribute('data-border-thickness') || BORDER_THICKNESS_DEFAULT,
parseHTML: element => element.getAttribute('data-vertical-align') || VERTICAL_ALIGN_DEFAULT,
```

## Storage

No changes to existing storage mechanism:

- HTML content stored in `PageContent.body.value` (string field)
- MongoDB document structure unchanged
- New attributes embedded within HTML string

## Relationships

```
PageContent (existing)
    │
    └── body.value: string (HTML)
            │
            ├── <table data-border-thickness="N">
            │       │
            │       └── <td data-vertical-align="X">
            │       └── <th data-vertical-align="X">
            │
            └── (other HTML content)
```
