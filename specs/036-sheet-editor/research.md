# Research: Sheet Editor Feature

**Feature Branch**: `036-sheet-editor`  
**Date**: 2025-12-17

## Decision Summary

### 1. Table Extension Choice

**Decision**: Use `@tiptap/extension-table` with `TableKit` bundle

**Rationale**:

- Tiptap's official Table extension provides all required functionality out-of-the-box
- `TableKit` conveniently bundles Table, TableRow, TableCell, and TableHeader extensions
- Native support for merge/split cells, header rows/columns, row/column operations
- Seamless integration with existing Tiptap editor instance
- Well-documented API with TypeScript support

**Alternatives Considered**:

- Custom table implementation: Rejected - would require significant development effort and reinvent existing functionality
- Third-party table library: Rejected - integration complexity with Tiptap, potential maintenance burden
- Minimal setup (Table only without TableKit): Rejected - would require manual configuration of row/cell/header extensions

### 2. Table Operations Implementation

**Decision**: Use Tiptap's built-in table commands directly

**Available Commands (from Tiptap documentation)**:

- `insertTable({ rows, cols, withHeaderRow })` - Create table with dimensions
- `addRowBefore()` / `addRowAfter()` - Row insertion
- `addColumnBefore()` / `addColumnAfter()` - Column insertion
- `deleteRow()` / `deleteColumn()` - Row/column removal
- `deleteTable()` - Remove entire table
- `mergeCells()` - Merge selected cells
- `splitCell()` - Split merged cell
- `mergeOrSplit()` - Toggle merge/split based on selection
- `toggleHeaderCell()` - Toggle header status
- `goToNextCell()` / `goToPreviousCell()` - Navigation
- `setCellAttribute(name, value)` - Set cell attributes
- `fixTables()` - Auto-fix table structure inconsistencies

**Rationale**:

- Commands are optimized and tested by Tiptap maintainers
- Consistent behavior with other Tiptap operations
- Built-in undo/redo support
- Proper selection handling

### 3. Header Implementation

**Decision**: Use `TableHeader` extension with `toggleHeaderCell()` command

**Rationale**:

- Tiptap's TableHeader extension handles semantic `<th>` elements
- Toggle command allows flexible header assignment (not limited to first row)
- Visual distinction handled via CSS styling
- Proper accessibility with semantic HTML

**Configuration**:

```typescript
TableRow.extend({
  content: '(tableCell | tableHeader)*',
});
```

### 4. Integration with Existing Editor

**Decision**: Add TableKit to existing TiptapEditor extensions array

**Changes Required**:

1. Install packages: `@tiptap/extension-table`
2. Import TableKit in TiptapEditor.tsx
3. Add TableKit to extensions array with configuration
4. Add toolbar buttons for table operations
5. Add CSS styles for table rendering

**Current Editor Extensions** (to preserve):

- StarterKit
- ResizableImage (custom)
- ImageWithOverlay (custom)
- Link
- TextStyle
- Color
- FontFamily
- TextAlign

### 5. Table Toolbar UI

**Decision**: Add table toolbar section with IconButtons following existing pattern

**UI Components**:

- Insert Table button (opens dimension dialog)
- Table context toolbar (appears when cursor in table):
  - Add row above/below
  - Add column left/right
  - Delete row/column
  - Toggle header cell
  - Merge cells
  - Split cell
  - Delete table

**Pattern** (from existing toolbar):

```tsx
<IconButton
  aria-label="Action Label"
  size="sm"
  variant={editor.isActive('table') ? 'solid' : 'ghost'}
  onClick={() => editor.chain().focus().tableCommand().run()}
  disabled={!editor.can().tableCommand()}
/>
```

### 6. Table Styling

**Decision**: Add table styles to existing tiptap-styles.css

**Styling Requirements**:

- Table borders and cell padding
- Header cell distinction (bold, background color)
- Theme-aware colors using CSS custom properties
- Light/dark mode support
- Responsive behavior (horizontal scroll on mobile)

### 7. Public Side Rendering

**Decision**: Tables render as native HTML, styled via PublicPageContent CSS

**Rationale**:

- Tiptap outputs standard HTML table elements
- Existing PublicPageContent already sanitizes and renders HTML
- Add CSS styles for table elements in public view
- No additional components needed

### 8. Table Size Limits

**Decision**: Maximum 20x20 as specified in requirements

**Implementation**:

- Validate dimensions in insert dialog (1-20 for rows and columns)
- Prevent delete of last row/column via `editor.can()` checks
- No programmatic enforcement beyond UI (Tiptap handles internally)

## Technical Specifications

### NPM Package

```bash
npm install @tiptap/extension-table
```

**Note**: TableKit is exported from `@tiptap/extension-table` - single package install.

### Extension Configuration

```typescript
import { TableKit } from '@tiptap/extension-table';

const extensions = [
  // ... existing extensions
  TableKit.configure({
    resizable: false, // No column resizing for simplicity (YAGNI)
    HTMLAttributes: {
      class: 'tiptap-table',
    },
  }),
];
```

### HTML Output Structure

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
  </tbody>
</table>
```

### Merged Cell Attributes

Tiptap handles colspan/rowspan attributes automatically:

```html
<td colspan="2" rowspan="3">Merged content</td>
```

## Unknowns Resolved

| Unknown               | Resolution                                  |
| --------------------- | ------------------------------------------- |
| Table library choice  | Tiptap Table extension (official)           |
| Header implementation | TableHeader extension with toggleHeaderCell |
| Merge/split approach  | Built-in Tiptap commands                    |
| Styling approach      | CSS in tiptap-styles.css + public styles    |
| Maximum dimensions    | 20x20 enforced in UI dialog                 |
| Column resize         | Not included (YAGNI)                        |
| Cell content type     | Plain text only via default TableCell       |

## Next Steps

1. Install `@tiptap/extension-table` package
2. Add TableKit to TiptapEditor extensions
3. Create TableInsertDialog component for dimension input
4. Add table toolbar buttons
5. Add table CSS styles (editor + public)
6. Test all operations
