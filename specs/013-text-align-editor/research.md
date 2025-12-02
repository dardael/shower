# Research: Text Alignment in Rich Text Editor

**Feature**: 013-text-align-editor  
**Date**: 2025-12-02

## Research Questions

1. What Tiptap extension provides text alignment?
2. How to configure and use it?
3. How is alignment data stored?
4. How to detect alignment state for button feedback?
5. What icons to use for alignment buttons?

## Findings

### 1. Tiptap Text Align Extension

**Decision**: Use `@tiptap/extension-text-align` (official Tiptap extension)

**Rationale**:

- Official, well-maintained extension
- Provides all 4 alignment types (left, center, right, justify)
- Integrates seamlessly with existing Tiptap setup
- Includes keyboard shortcuts out of the box

**Alternatives Considered**:

- Custom extension: More work, no advantage
- CSS-only approach: Would not persist alignment in content

### 2. Installation & Configuration

**Decision**: Configure extension with paragraph and heading support

```typescript
import TextAlign from '@tiptap/extension-text-align';

TextAlign.configure({
  types: ['heading', 'paragraph'],
  alignments: ['left', 'center', 'right', 'justify'],
  defaultAlignment: 'left',
});
```

**Rationale**:

- Paragraphs and headings are the primary text blocks
- Left is the sensible default (matches browser default)
- All 4 alignments as specified in requirements

### 3. Data Storage

**Decision**: Alignment stored as inline style attribute

**How it works**:

- HTML output: `<p style="text-align: center">Text</p>`
- JSON output: `{ "type": "paragraph", "attrs": { "textAlign": "center" } }`

**Rationale**:

- No database schema changes needed
- Existing `content` field stores HTML with inline styles
- DOMPurify must allow `style` attribute for public rendering

### 4. State Detection

**Decision**: Use `editor.isActive({ textAlign: 'X' })` for button state

```typescript
// Check if center alignment is active
const isCenterActive = editor.isActive({ textAlign: 'center' });

// Apply alignment
editor.chain().focus().setTextAlign('center').run();
```

**Rationale**:

- Follows same pattern as existing bold/italic buttons
- Provides real-time feedback as user navigates

### 5. Icons

**Decision**: Use Feather icons from react-icons (`fi` prefix)

| Alignment | Icon             | Import           |
| --------- | ---------------- | ---------------- |
| Left      | `FiAlignLeft`    | `react-icons/fi` |
| Center    | `FiAlignCenter`  | `react-icons/fi` |
| Right     | `FiAlignRight`   | `react-icons/fi` |
| Justify   | `FiAlignJustify` | `react-icons/fi` |

**Rationale**:

- Consistent with existing toolbar icons (FiBold, FiItalic, FiList)
- Standard, recognizable alignment icons
- Already available in project dependencies

### 6. CSS Implementation

**Decision**: Add text-align styles to both editor and public CSS files

**Editor styles** (tiptap-styles.css):

```css
.tiptap-editor-wrapper .tiptap p[style*='text-align: left'],
.tiptap-editor-wrapper .tiptap h1[style*='text-align: left'],
.tiptap-editor-wrapper .tiptap h2[style*='text-align: left'],
.tiptap-editor-wrapper .tiptap h3[style*='text-align: left'] {
  text-align: left;
}
/* Repeat for center, right, justify */
```

**Public styles** (public-page-content.css):

```css
.public-page-content p[style*='text-align: center'] {
  text-align: center;
}
/* Repeat for all alignments and heading levels */
```

**Rationale**:

- CSS respects inline styles naturally, but explicit rules ensure consistency
- Matches existing CSS patterns in codebase

### 7. Sanitization Update

**Decision**: Add `'style'` to DOMPurify `ALLOWED_ATTR` array

**Current config** (PublicPageContent.tsx):

```typescript
ALLOWED_ATTR: [
  'href',
  'src',
  'alt',
  'title',
  'target',
  'rel',
  'class',
  'data-theme-color',
];
```

**Updated config**:

```typescript
ALLOWED_ATTR: [
  'href',
  'src',
  'alt',
  'title',
  'target',
  'rel',
  'class',
  'data-theme-color',
  'style',
];
```

**Rationale**:

- Required for text-align inline styles to render on public pages
- DOMPurify still sanitizes dangerous style properties
- Safe approach for this use case

## Summary

All NEEDS CLARIFICATION items resolved. The implementation requires:

1. Install `@tiptap/extension-text-align`
2. Add extension to TiptapEditor.tsx
3. Add 4 alignment buttons to toolbar
4. Add CSS styles to both stylesheets
5. Add `'style'` to sanitization whitelist
