# Quickstart: Text Alignment in Rich Text Editor

**Feature**: 013-text-align-editor  
**Date**: 2025-12-02

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Existing shower project setup

## Implementation Steps

### Step 1: Install Tiptap Text Align Extension

```bash
docker compose run --rm app npm install @tiptap/extension-text-align
```

### Step 2: Update TiptapEditor.tsx

**File**: `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`

1. Add import:

```typescript
import TextAlign from '@tiptap/extension-text-align';
import {
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiAlignJustify,
} from 'react-icons/fi';
```

2. Add extension to editor configuration:

```typescript
const editor = useEditor({
  extensions: [
    StarterKit,
    Image.configure({ ... }),
    Link.configure({ ... }),
    ThemeColorMark,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      alignments: ['left', 'center', 'right', 'justify'],
      defaultAlignment: 'left',
    }),
  ],
  // ... rest of config
});
```

3. Add alignment buttons to toolbar (after existing buttons):

```typescript
<IconButton
  aria-label="Align Left"
  size="sm"
  variant={editor.isActive({ textAlign: 'left' }) ? 'solid' : 'ghost'}
  color={editor.isActive({ textAlign: 'left' }) ? 'colorPalette.fg' : 'fg'}
  onClick={() => editor.chain().focus().setTextAlign('left').run()}
  disabled={disabled}
>
  <FiAlignLeft />
</IconButton>
// Repeat pattern for center, right, justify
```

### Step 3: Update Editor CSS

**File**: `src/presentation/admin/components/PageContentEditor/tiptap-styles.css`

Add at the end:

```css
/* Text alignment styles */
.tiptap-editor-wrapper .tiptap [style*='text-align: left'] {
  text-align: left;
}
.tiptap-editor-wrapper .tiptap [style*='text-align: center'] {
  text-align: center;
}
.tiptap-editor-wrapper .tiptap [style*='text-align: right'] {
  text-align: right;
}
.tiptap-editor-wrapper .tiptap [style*='text-align: justify'] {
  text-align: justify;
}
```

### Step 4: Update Public Page CSS

**File**: `src/presentation/shared/components/PublicPageContent/public-page-content.css`

Add at the end:

```css
/* Text alignment styles */
.public-page-content [style*='text-align: left'] {
  text-align: left;
}
.public-page-content [style*='text-align: center'] {
  text-align: center;
}
.public-page-content [style*='text-align: right'] {
  text-align: right;
}
.public-page-content [style*='text-align: justify'] {
  text-align: justify;
}
```

### Step 5: Update DOMPurify Configuration

**File**: `src/presentation/shared/components/PublicPageContent/PublicPageContent.tsx`

Add `'style'` to the allowed attributes:

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
  'style',  // Add this line
],
```

## Verification

1. Start the development server:

```bash
docker compose up app
```

2. Navigate to admin panel and edit a page
3. Verify alignment buttons appear in toolbar
4. Test each alignment option
5. Save the page
6. View the public page and verify alignment renders correctly
7. Test in both light and dark modes

## Files Changed

| File                      | Change Type                 |
| ------------------------- | --------------------------- |
| `package.json`            | Add dependency              |
| `TiptapEditor.tsx`        | Add extension + buttons     |
| `tiptap-styles.css`       | Add alignment CSS           |
| `public-page-content.css` | Add alignment CSS           |
| `PublicPageContent.tsx`   | Add 'style' to sanitization |

## Rollback

If issues occur:

1. Remove `@tiptap/extension-text-align` from package.json
2. Revert TiptapEditor.tsx changes
3. Remove CSS additions (optional - harmless if left)
4. Remove 'style' from ALLOWED_ATTR (optional)
