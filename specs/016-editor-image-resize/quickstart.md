# Quickstart: Editor Image Resize and Move

**Feature**: 016-editor-image-resize  
**Date**: 2025-12-03

## Prerequisites

- Feature 015 (editor-image-upload) implemented
- @tiptap/extension-image v3.11.1 installed (already in package.json)

## Implementation Steps

### Step 1: Update TiptapEditor Image Configuration

**File**: `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`

Update the Image extension configuration to enable resize:

```typescript
Image.configure({
  HTMLAttributes: {
    class: 'tiptap-image',
  },
  resize: {
    enabled: true,
    directions: ['top', 'bottom', 'left', 'right'],
    minWidth: 50,
    minHeight: 50,
    alwaysPreserveAspectRatio: true,
  },
});
```

### Step 2: Enable Image Dragging

**File**: `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`

Create a custom Image extension with draggable enabled:

```typescript
import Image from '@tiptap/extension-image';

const ResizableImage = Image.extend({
  draggable: true,
}).configure({
  HTMLAttributes: {
    class: 'tiptap-image',
  },
  resize: {
    enabled: true,
    directions: ['top', 'bottom', 'left', 'right'],
    minWidth: 50,
    minHeight: 50,
    alwaysPreserveAspectRatio: true,
  },
});
```

### Step 3: Add Resize Handle Styles

**File**: `src/presentation/admin/components/PageContentEditor/tiptap-styles.css`

Add styles for image selection and resize handles:

```css
/* Selected image outline */
.tiptap-editor-wrapper .tiptap .ProseMirror-selectednode img,
.tiptap-editor-wrapper .tiptap img.ProseMirror-selectednode {
  outline: 2px solid var(--chakra-colors-color-palette-solid);
  outline-offset: 2px;
}

/* Resize handles - adjust based on Tiptap's actual class names */
.tiptap-editor-wrapper .tiptap [data-node-view-wrapper] {
  display: inline-block;
}

/* Draggable cursor */
.tiptap-editor-wrapper .tiptap img {
  cursor: grab;
}

.tiptap-editor-wrapper .tiptap img:active {
  cursor: grabbing;
}
```

### Step 4: Verify Public Display

**File**: `src/presentation/shared/components/PublicPageContent/public-page-content.css`

Ensure inline width/height styles are respected (already supported):

```css
/* Images respect inline dimensions */
.public-page-content img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

/* When explicit dimensions set, respect them but cap at container */
.public-page-content img[style*='width'] {
  max-width: 100%;
}
```

## Testing Checklist

### Manual Testing

1. [ ] Open page content editor with an existing image
2. [ ] Click on image - resize handles appear
3. [ ] Drag corner handle - image resizes proportionally
4. [ ] Cannot resize below 50x50 pixels
5. [ ] Cannot resize wider than content area
6. [ ] Save page and reload - dimensions persist
7. [ ] View public page - image displays at resized dimensions
8. [ ] Drag image to new position - moves between paragraphs
9. [ ] Save and view public - image in new position
10. [ ] Test in dark mode - handles visible

### Device Testing

1. [ ] Desktop browser (Chrome, Firefox, Safari)
2. [ ] Tablet (touch resize and drag)

## Rollback Plan

If issues arise, revert to simple Image configuration:

```typescript
Image.configure({
  HTMLAttributes: {
    class: 'tiptap-image',
  },
});
```

## Dependencies

No new npm packages required. Uses existing @tiptap/extension-image capabilities.
