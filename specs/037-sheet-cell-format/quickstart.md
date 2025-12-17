# Quickstart: Sheet Cell Formatting

**Feature**: 037-sheet-cell-format
**Date**: 2025-12-17

## Overview

This guide provides the essential information needed to implement the sheet cell formatting feature, which adds border thickness control and vertical alignment options to the Tiptap table editor.

## Prerequisites

- Existing sheet editor (036-sheet-editor) implemented
- Familiarity with Tiptap editor extension system
- Understanding of Chakra UI v3 components

## Key Implementation Steps

### 1. Extend Tiptap Table Extensions

**File**: `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`

Create custom extensions that add data attributes:

```typescript
import { Table } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';

// Custom Table with border thickness
const CustomTable = Table.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      borderThickness: {
        default: 1,
        parseHTML: (element) =>
          parseInt(element.getAttribute('data-border-thickness') || '1', 10),
        renderHTML: (attributes) => ({
          'data-border-thickness': attributes.borderThickness,
          style: `--table-border-width: ${attributes.borderThickness}px`,
        }),
      },
    };
  },
});

// Custom TableCell with vertical alignment
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

// Same for TableHeader
const CustomTableHeader = TableHeader.extend({
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

### 2. Add UI Controls to TableToolbar

**File**: `src/presentation/admin/components/PageContentEditor/TableToolbar.tsx`

Add formatting controls section:

```typescript
// Border thickness control
<NumberInputRoot
  value={currentBorderThickness.toString()}
  min={0}
  max={10}
  onValueChange={(details) => updateTableBorderThickness(parseInt(details.value, 10))}
>
  <NumberInputField />
</NumberInputRoot>

// Vertical alignment buttons
<HStack>
  <IconButton onClick={() => updateCellVerticalAlign('top')} aria-label="Align top">
    <FiAlignTop />
  </IconButton>
  <IconButton onClick={() => updateCellVerticalAlign('center')} aria-label="Align center">
    <FiAlignVerticalCenter />
  </IconButton>
  <IconButton onClick={() => updateCellVerticalAlign('bottom')} aria-label="Align bottom">
    <FiAlignBottom />
  </IconButton>
</HStack>
```

### 3. Update CSS Styles

**Admin styles**: `src/presentation/admin/components/PageContentEditor/tiptap-styles.css`

```css
/* Border thickness using CSS variable */
.tiptap-editor-wrapper .tiptap table td,
.tiptap-editor-wrapper .tiptap table th {
  border-width: var(--table-border-width, 1px);
  border-style: solid;
  border-color: var(--chakra-colors-border);
}

/* Vertical alignment */
.tiptap-editor-wrapper .tiptap td[data-vertical-align='top'],
.tiptap-editor-wrapper .tiptap th[data-vertical-align='top'] {
  vertical-align: top;
}

.tiptap-editor-wrapper .tiptap td[data-vertical-align='center'],
.tiptap-editor-wrapper .tiptap th[data-vertical-align='center'] {
  vertical-align: middle;
}

.tiptap-editor-wrapper .tiptap td[data-vertical-align='bottom'],
.tiptap-editor-wrapper .tiptap th[data-vertical-align='bottom'] {
  vertical-align: bottom;
}
```

**Public styles**: `src/presentation/shared/components/PublicPageContent/public-page-content.css`

Same CSS rules for public view consistency.

### 4. Update DOMPurify Configuration

**File**: `src/presentation/shared/components/PublicPageContent/PublicPageContent.tsx`

Add new attributes to allowed list:

```typescript
const sanitizedHtml = DOMPurify.sanitize(content, {
  ALLOWED_ATTR: [
    // ... existing attributes
    'data-border-thickness',
    'data-vertical-align',
    'style', // For CSS variable injection
  ],
});
```

## Editor Commands

### Update Table Border Thickness

```typescript
const updateTableBorderThickness = (thickness: number): void => {
  editor
    .chain()
    .focus()
    .updateAttributes('table', { borderThickness: thickness })
    .run();
};
```

### Update Cell Vertical Alignment

```typescript
const updateCellVerticalAlign = (align: 'top' | 'center' | 'bottom'): void => {
  editor
    .chain()
    .focus()
    .updateAttributes('tableCell', { verticalAlign: align })
    .run();
};
```

### Get Current Values

```typescript
// Get border thickness from current table
const getCurrentBorderThickness = (): number => {
  const tableNode = findParentNode((node) => node.type.name === 'table')(
    editor.state.selection
  );
  return tableNode?.node.attrs.borderThickness ?? 1;
};

// Get vertical alignment from current cell
const getCurrentVerticalAlign = (): string => {
  return editor.getAttributes('tableCell').verticalAlign ?? 'top';
};
```

## Testing Checklist

- [ ] Border thickness 0px hides borders completely
- [ ] Border thickness 1-10px shows proportional borders
- [ ] Vertical alignment top/center/bottom positions content correctly
- [ ] Changes reflect immediately in editor preview
- [ ] Saved content renders correctly on public page
- [ ] Existing tables without attributes display with defaults
- [ ] Controls are accessible within 2 clicks from table editing

## Files to Modify

| File                      | Change                                                              |
| ------------------------- | ------------------------------------------------------------------- |
| `TiptapEditor.tsx`        | Replace standard Table/TableCell/TableHeader with custom extensions |
| `TableToolbar.tsx`        | Add border thickness input and vertical alignment buttons           |
| `tiptap-styles.css`       | Add CSS variable and attribute selector rules                       |
| `PublicPageContent.tsx`   | Add data attributes to DOMPurify allowed list                       |
| `public-page-content.css` | Mirror admin CSS rules for public view                              |

## Common Pitfalls

1. **Forgetting to extend TableHeader**: Both `td` and `th` need vertical alignment
2. **CSS specificity**: Ensure new rules override existing fixed styles
3. **DOMPurify stripping attributes**: Must explicitly allow new data attributes
4. **Style attribute for CSS variables**: Must allow `style` attribute in DOMPurify for inline CSS variable injection
