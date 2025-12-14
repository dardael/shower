# Quickstart Guide: Image Full Bleed Layout

**Feature**: 029-image-full-bleed  
**Date**: 2025-12-14

## Overview

This guide provides step-by-step implementation instructions for adding the full-bleed image feature to the Tiptap editor and public page rendering.

## Prerequisites

- Existing `fullWidth` feature (spec 023) is implemented
- Familiarity with Tiptap editor extensions
- Understanding of CSS negative margin technique for container breakout

## Implementation Steps

### Step 1: Add fullBleed Attribute to ResizableImage Extension

**File**: `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`

Add the `fullBleed` attribute to the ResizableImage extension configuration:

```typescript
const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      // ... existing attributes ...
      fullBleed: {
        default: false,
        parseHTML: (element) =>
          element.getAttribute('data-full-bleed') === 'true',
        renderHTML: (attributes) => {
          if (!attributes.fullBleed) return {};
          return { 'data-full-bleed': 'true' };
        },
      },
    };
  },
});
```

### Step 2: Add fullBleed Attribute to ImageWithOverlay Extension

**File**: `src/presentation/admin/components/PageContentEditor/extensions/ImageWithOverlay.ts`

Add the `fullBleed` attribute following the same pattern as `fullWidth`:

```typescript
fullBleed: {
  default: false,
  parseHTML: (element) => element.getAttribute('data-full-bleed') === 'true',
  renderHTML: (attributes) => {
    if (!attributes.fullBleed) return {};
    return { 'data-full-bleed': 'true' };
  },
},
```

### Step 3: Add Toggle Functions

**File**: `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`

Add helper functions similar to existing `fullWidth` functions:

```typescript
const isFullBleedActive = (
  editor: Editor,
  position: number | null
): boolean => {
  if (position === null) return false;
  const node = editor.state.doc.nodeAt(position);
  if (!node) return false;
  return node.attrs.fullBleed === true;
};

const toggleFullBleed = (editor: Editor, position: number | null): void => {
  if (position === null) return;
  const node = editor.state.doc.nodeAt(position);
  if (!node) return;

  const newValue = !node.attrs.fullBleed;
  editor
    .chain()
    .focus()
    .updateAttributes(node.type.name, { fullBleed: newValue })
    .run();
};
```

### Step 4: Add Toolbar Button

**File**: `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`

Add button after the existing fullWidth button:

```tsx
<IconButton
  aria-label="Toggle Full Bleed"
  title="Full Bleed (edge-to-edge)"
  variant={isFullBleedActive(editor, selectedImagePos) ? 'solid' : 'ghost'}
  onClick={() => toggleFullBleed(editor, selectedImagePos)}
>
  <LuExpand /> {/* or appropriate icon from react-icons */}
</IconButton>
```

### Step 5: Add Editor Styles

**File**: `src/presentation/admin/components/PageContentEditor/tiptap-styles.css`

Add visual indication for full-bleed images in editor:

```css
/* Full Bleed indicator in editor */
.ProseMirror img[data-full-bleed='true'],
.ProseMirror .image-with-overlay[data-full-bleed='true'] {
  outline: 2px dashed var(--chakra-colors-blue-400);
  outline-offset: 2px;
}
```

### Step 6: Add Public Page Styles

**File**: `src/presentation/shared/components/PublicPageContent/public-page-content.css`

Add CSS for full-bleed breakout:

```css
/* Full Bleed - breaks out of container to viewport edges */
.public-page-content img[data-full-bleed='true'] {
  width: 100vw;
  max-width: none;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  border-radius: 0;
}

.public-page-content .image-with-overlay[data-full-bleed='true'] {
  width: 100vw;
  max-width: none;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  border-radius: 0;
}

.public-page-content .image-with-overlay[data-full-bleed='true'] img {
  width: 100%;
  border-radius: 0;
}
```

## Testing Checklist

- [ ] Toggle button appears in image toolbar
- [ ] Button state reflects fullBleed attribute
- [ ] Editor shows visual indication when fullBleed is enabled
- [ ] Content saves and loads with fullBleed attribute preserved
- [ ] Public page renders full-bleed images edge-to-edge
- [ ] No background color visible on sides of full-bleed images
- [ ] Text overlays render correctly on full-bleed images
- [ ] Works correctly on mobile viewports

## Key Files Modified

1. `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`
2. `src/presentation/admin/components/PageContentEditor/extensions/ImageWithOverlay.ts`
3. `src/presentation/admin/components/PageContentEditor/tiptap-styles.css`
4. `src/presentation/shared/components/PublicPageContent/public-page-content.css`
