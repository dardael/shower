# Research: Sheet Cell Formatting

**Feature**: 037-sheet-cell-format
**Date**: 2025-12-17

## Research Questions

### 1. How to extend Tiptap table extensions with custom attributes?

**Decision**: Use Tiptap's `extendNodeSchema` to add custom attributes to Table and TableCell nodes

**Rationale**:

- Tiptap extensions support adding custom HTML attributes via `addAttributes()` method
- The Table extension can be extended to add `data-border-thickness` at table level
- The TableCell extension can be extended to add `data-vertical-align` at cell level
- These attributes are preserved in the HTML output and can be targeted by CSS

**Implementation approach**:

```typescript
// Extend Table to add border thickness
const CustomTable = Table.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      borderThickness: {
        default: 1,
        parseHTML: (element) =>
          element.getAttribute('data-border-thickness') || 1,
        renderHTML: (attributes) => ({
          'data-border-thickness': attributes.borderThickness,
        }),
      },
    };
  },
});

// Extend TableCell to add vertical alignment
const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      verticalAlign: {
        default: 'top',
        parseHTML: (element) =>
          element.getAttribute('data-vertical-align') || 'top',
        renderHTML: (attributes) => ({
          'data-vertical-align': attributes.verticalAlign,
        }),
      },
    };
  },
});
```

**Alternatives considered**:

- Inline styles on elements: Rejected - harder to maintain, sanitization complexity
- CSS classes for each combination: Rejected - creates many class combinations, less flexible
- Separate state management: Rejected - violates KISS, Tiptap already handles this

### 2. How to update table/cell attributes programmatically in Tiptap?

**Decision**: Use Tiptap's `updateAttributes` command for cells and custom command for table-level attributes

**Rationale**:

- For cell-level attributes: `editor.chain().focus().updateAttributes('tableCell', { verticalAlign: 'center' }).run()`
- For table-level attributes: Need to find the table node and update its attributes
- Tiptap provides `findParentNode` utility to locate the table from current selection

**Implementation approach**:

```typescript
// Update border thickness on the table
const updateTableBorderThickness = (editor: Editor, thickness: number) => {
  const { state } = editor;
  const tableNode = findParentNode((node) => node.type.name === 'table')(
    state.selection
  );
  if (tableNode) {
    editor
      .chain()
      .focus()
      .updateAttributes('table', { borderThickness: thickness })
      .run();
  }
};

// Update vertical alignment on current cell
const updateCellVerticalAlign = (
  editor: Editor,
  align: 'top' | 'center' | 'bottom'
) => {
  editor
    .chain()
    .focus()
    .updateAttributes('tableCell', { verticalAlign: align })
    .run();
};
```

### 3. How to apply CSS styles based on data attributes?

**Decision**: Use CSS attribute selectors with CSS custom properties for dynamic styling

**Rationale**:

- CSS attribute selectors `[data-border-thickness="0"]` target specific values
- For border thickness, use inline style generation based on attribute value
- CSS can handle the range 0-10 with a single rule using `attr()` or specific selectors

**Implementation approach**:

```css
/* Border thickness - applied at table level */
.tiptap table[data-border-thickness='0'],
.tiptap table[data-border-thickness='0'] td,
.tiptap table[data-border-thickness='0'] th {
  border-width: 0;
}

/* For non-zero values, use inline style in renderHTML */
.tiptap table td,
.tiptap table th {
  border-style: solid;
  border-color: var(--chakra-colors-border);
}

/* Vertical alignment */
.tiptap td[data-vertical-align='top'],
.tiptap th[data-vertical-align='top'] {
  vertical-align: top;
}

.tiptap td[data-vertical-align='center'],
.tiptap th[data-vertical-align='center'] {
  vertical-align: middle;
}

.tiptap td[data-vertical-align='bottom'],
.tiptap th[data-vertical-align='bottom'] {
  vertical-align: bottom;
}
```

**Alternatives considered**:

- JavaScript-based style injection: Rejected - unnecessary complexity
- CSS-in-JS: Rejected - existing styles use CSS files, maintain consistency

### 4. DOMPurify configuration for custom attributes

**Decision**: Add `data-border-thickness` and `data-vertical-align` to allowed attributes list

**Rationale**:

- DOMPurify already allows certain data attributes for tables (`data-colwidth`)
- Custom data attributes are safe as they don't execute code
- Need to update the `ALLOWED_ATTR` configuration in PublicPageContent.tsx

**Implementation**:

```typescript
const sanitizedHtml = DOMPurify.sanitize(content, {
  ALLOWED_TAGS: [...existingTags],
  ALLOWED_ATTR: [
    ...existingAttrs,
    'data-border-thickness',
    'data-vertical-align',
  ],
});
```

### 5. UI component design for formatting controls

**Decision**: Add formatting controls to existing TableToolbar component

**Rationale**:

- TableToolbar already appears when user is editing a table
- Keeps all table-related controls in one location (within 2 clicks as per SC-005)
- Follow existing UI patterns with Chakra UI components

**Implementation approach**:

- Add a "Format" section to TableToolbar with:
  - Border thickness: NumberInput or Slider (0-10px range)
  - Vertical alignment: SegmentedControl or IconButton group (top/center/bottom icons)
- Use react-icons for alignment icons (similar to text alignment in existing editor)

## Resolved Clarifications

All technical questions resolved through codebase analysis. No NEEDS CLARIFICATION items remain.

## Key Technical Decisions Summary

| Decision          | Choice                  | Rationale                                            |
| ----------------- | ----------------------- | ---------------------------------------------------- |
| Attribute storage | HTML data attributes    | Preserved in content, CSS targetable, DOMPurify safe |
| Border scope      | Table-level             | Uniform borders across all cells per spec assumption |
| Alignment scope   | Cell-level              | Per-cell flexibility per spec FR-005                 |
| UI location       | TableToolbar            | Existing pattern, accessible within 2 clicks         |
| Styling approach  | CSS attribute selectors | Simple, maintainable, no JS required for rendering   |
