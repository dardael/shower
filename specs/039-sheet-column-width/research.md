# Research: Sheet Column Width Configuration

**Feature**: 039-sheet-column-width
**Date**: 2025-12-17

## Research Summary

All technical unknowns have been resolved. The existing codebase infrastructure fully supports the column width feature.

## Findings

### 1. Column Width Attribute Support

**Decision**: Use the existing Tiptap `colwidth` attribute pattern with `data-colwidth` HTML attribute.

**Rationale**:

- Tiptap's table extension already supports `colwidth` as a standard attribute
- The public side (`PublicPageContent.tsx`) already parses and applies `data-colwidth` attributes
- Following the existing `verticalAlign` attribute pattern ensures consistency

**Alternatives Considered**:

- Custom CSS class-based approach → Rejected: Would require more complex parsing and storage
- Inline style injection → Rejected: Less semantic, harder to parse on public side

### 2. Toolbar Control Pattern

**Decision**: Add a numeric input field in `TableToolbar.tsx` following the border thickness control pattern.

**Rationale**:

- Border thickness uses the same `Input` + `updateAttributes()` pattern
- Provides immediate visual feedback via Tiptap's reactive updates
- Consistent UX with existing toolbar controls

**Alternatives Considered**:

- Drag-resize handles → Rejected by user: Preferred numeric input for precision
- Popup dialog → Rejected: Adds extra clicks, inconsistent with other toolbar controls

### 3. Attribute Persistence Format

**Decision**: Store column width as `data-colwidth="[150]"` (JSON array format) for single-column width per cell.

**Rationale**:

- Matches Tiptap's native colwidth format (array of widths for merged cells)
- Public side already parses both JSON array `[150]` and plain `150` formats
- Consistent with how Tiptap handles colspan scenarios

**Alternatives Considered**:

- Plain integer string → Acceptable but less compatible with merged cell scenarios

### 4. Real-time Visual Feedback

**Decision**: Use `editor.chain().focus().updateAttributes()` on input change for immediate updates.

**Rationale**:

- Tiptap automatically re-renders the editor on attribute changes
- Same pattern used by border thickness and vertical alignment
- No additional state management or debouncing needed

**Alternatives Considered**:

- Debounced updates → Rejected: User explicitly requested real-time feedback while typing

### 5. Empty Input / Auto-adapt Behavior

**Decision**: When input is empty or cleared, set `colwidth` attribute to `null` to trigger default table layout.

**Rationale**:

- Setting attribute to `null` removes the `data-colwidth` attribute from HTML
- Table with `table-layout: fixed` will distribute columns equally when no explicit widths set
- Matches user expectation: empty input = auto-adapt

**Alternatives Considered**:

- Set to `0` → Rejected: Would be interpreted as 0px width
- Set to `'auto'` string → Rejected: Would require parsing changes on public side

### 6. Minimum Width Enforcement

**Decision**: Enforce 50px minimum width in the input validation logic.

**Rationale**:

- Prevents columns from becoming too narrow for content
- Spec requirement FR-006
- Applied only when an explicit value is set (empty = auto-adapt, not subject to minimum)

**Alternatives Considered**:

- No minimum → Rejected: Would allow unusable column widths
- CSS-based min-width → Would work but input validation provides better UX feedback

## Technical Implementation Notes

1. **Files to modify**:
   - `tableFormatTypes.ts`: Add `createColumnWidthAttribute()` helper
   - `CustomTableCell.ts`: Add `colwidth` attribute to extension
   - `CustomTableHeader.ts`: Add `colwidth` attribute to extension
   - `TableToolbar.tsx`: Add column width input control

2. **Files NOT needing changes**:
   - `PublicPageContent.tsx`: Already handles `data-colwidth` parsing
   - No API routes: Column widths stored in HTML content string

3. **Key pattern to follow** (from border thickness):

   ```typescript
   // State
   const [columnWidth, setColumnWidth] = useState<string>('');

   // Getter
   const width = editor.getAttributes('tableCell').colwidth;

   // Setter
   editor
     .chain()
     .focus()
     .updateAttributes('tableCell', { colwidth: value })
     .updateAttributes('tableHeader', { colwidth: value })
     .run();
   ```
