# Quickstart: Sheet Column Width Configuration

**Feature**: 039-sheet-column-width
**Date**: 2025-12-17

## Overview

This feature adds a column width input to the table toolbar, allowing administrators to set fixed pixel widths for table columns. The implementation follows existing patterns from border thickness and vertical alignment controls.

## Prerequisites

- Development environment running (`docker compose up app`)
- Access to admin dashboard at `/admin/pages`

## Implementation Approach

### Files to Modify

1. **`src/presentation/admin/components/PageContentEditor/extensions/tableFormatTypes.ts`**
   - Add `createColumnWidthAttribute()` helper function

2. **`src/presentation/admin/components/PageContentEditor/extensions/CustomTableCell.ts`**
   - Register `colwidth` attribute using the new helper

3. **`src/presentation/admin/components/PageContentEditor/extensions/CustomTableHeader.ts`**
   - Register `colwidth` attribute using the new helper

4. **`src/presentation/admin/components/PageContentEditor/TableToolbar.tsx`**
   - Add column width input control
   - Add state management for column width
   - Add getter/setter functions following border thickness pattern

### Key Implementation Pattern

Follow the existing border thickness implementation:

```typescript
// 1. Add state
const [columnWidth, setColumnWidth] = useState<string>('');

// 2. Get current value on selection change
useEffect(() => {
  const cellAttrs = editor.getAttributes('tableCell');
  const headerAttrs = editor.getAttributes('tableHeader');
  const width = cellAttrs.colwidth || headerAttrs.colwidth;
  setColumnWidth(width ? String(width) : '');
}, [editor.state.selection]);

// 3. Update on change
const handleColumnWidthChange = (value: string): void => {
  setColumnWidth(value);
  const numWidth = parseInt(value, 10);
  const validWidth = value === '' ? null : numWidth >= 50 ? numWidth : 50;

  editor
    .chain()
    .focus()
    .updateAttributes('tableCell', { colwidth: validWidth })
    .updateAttributes('tableHeader', { colwidth: validWidth })
    .run();
};
```

## Verification Steps

1. **Admin Side**:
   - Create a page with a 2-column table
   - Select a cell in the first column
   - Verify column width input appears in toolbar
   - Enter "200" in the input
   - Verify column resizes immediately
   - Clear the input
   - Verify column returns to auto width

2. **Public Side**:
   - Save the page with a fixed column width
   - View the public page
   - Verify the column displays at the configured width

3. **Multi-sheet Alignment**:
   - Create 5 tables with 2 columns each
   - Set first column of all tables to 200px
   - Verify all first columns align vertically

## Testing Commands

```bash
# Run linting
docker compose run --rm app npm run lint

# Run type check
docker compose run --rm app npm run build:strict

# Run build
docker compose run --rm app npm run build
```

## Notes

- No API changes required - column widths are stored in HTML content
- Public side already supports `data-colwidth` attribute parsing
- Minimum width of 50px is enforced when a value is set
- Empty input = auto-adapt to table width (default behavior)
