# Quickstart: Image Text Overlay

**Feature**: 022-image-text-overlay  
**Date**: 2025-12-04

## Overview

This feature adds the ability for administrators to add styled text overlays on images in the page content editor, with the overlays visible on the public-facing pages.

## Prerequisites

- Existing page content editor with image upload (spec 015)
- Existing image resize functionality (spec 016)
- Google Fonts integration already in place
- FontPicker and ColorPicker components available

## Implementation Order

### Phase 1: Core Tiptap Extension (P1)

1. **Create ImageWithOverlay Tiptap Extension**
   - Location: `src/presentation/admin/components/PageContentEditor/extensions/ImageWithOverlay.ts`
   - Extend base Image extension with overlay attributes
   - Handle HTML parsing and rendering

2. **Add Overlay CSS for Editor**
   - Location: `src/presentation/admin/components/PageContentEditor/tiptap-styles.css`
   - Position overlay text absolutely within wrapper
   - Handle vertical position (top/center/bottom)
   - Handle horizontal alignment (left/center/right)

### Phase 2: Overlay Toolbar (P1)

3. **Create OverlayToolbar Component**
   - Location: `src/presentation/admin/components/PageContentEditor/OverlayToolbar.tsx`
   - Text input for overlay content
   - Integrate ColorPicker for text color
   - Integrate FontPicker for font family
   - Font size selector (dropdown)
   - Position selector (top/center/bottom)
   - Alignment selector (left/center/right)
   - Remove overlay button

4. **Integrate Toolbar into TiptapEditor**
   - Location: `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`
   - Show overlay toolbar when image is selected
   - Add "Add Text Overlay" button to image options

### Phase 3: Public Rendering (P1)

5. **Update PublicPageContent CSS**
   - Location: `src/presentation/shared/components/PublicPageContent/public-page-content.css`
   - Mirror overlay CSS from editor
   - Ensure responsive behavior

6. **Extend Font Extraction**
   - Location: `src/presentation/shared/utils/extractFontsFromHtml.ts`
   - Extract fonts from `data-overlay-font` attributes
   - Load fonts for overlay text

7. **Update DOMPurify Configuration**
   - Location: `src/presentation/shared/components/PublicPageContent/PublicPageContent.tsx`
   - Allow overlay data attributes
   - Allow overlay wrapper elements

### Phase 4: Edit/Remove Overlay (P2)

8. **Enable Overlay Editing**
   - Click on overlay text to edit
   - Update toolbar state when editing

9. **Add Remove Overlay Functionality**
   - Remove button in toolbar
   - Convert back to plain image

### Phase 5: Integration Testing

10. **Create Integration Test**
    - Location: `test/integration/image-text-overlay.integration.test.tsx`
    - Test overlay rendering on public page
    - Verify configured styles are applied

## Key Files to Create

```
src/
├── presentation/
│   ├── admin/
│   │   └── components/
│   │       └── PageContentEditor/
│   │           ├── extensions/
│   │           │   └── ImageWithOverlay.ts      # NEW: Tiptap extension
│   │           └── OverlayToolbar.tsx           # NEW: Toolbar component
│   └── shared/
│       └── components/
│           └── PublicPageContent/
│               └── public-page-content.css      # MODIFY: Add overlay styles

test/
└── integration/
    └── image-text-overlay.integration.test.tsx  # NEW: Integration test
```

## Key Files to Modify

```
src/
├── presentation/
│   ├── admin/
│   │   └── components/
│   │       └── PageContentEditor/
│   │           ├── TiptapEditor.tsx             # Add overlay extension, toolbar
│   │           └── tiptap-styles.css            # Add overlay styles
│   └── shared/
│       ├── components/
│       │   └── PublicPageContent/
│       │       └── PublicPageContent.tsx        # Update sanitization config
│       └── utils/
│           └── extractFontsFromHtml.ts          # Extract overlay fonts
```

## Testing Strategy

### Unit Tests (if requested)

- OverlayToolbar component rendering
- Font size mapping validation
- Color contrast calculation

### Integration Test (requested by user)

- Render page with image containing text overlay
- Verify overlay text is displayed
- Verify configured styles (color, font, size, position) are applied
- Test responsive behavior

## Quick Validation Steps

1. **Admin Side**:
   - Upload an image in page content editor
   - Click on image, click "Add Text Overlay"
   - Enter text, change color, font, size, position
   - Save page content
   - Reload editor - overlay should persist

2. **Public Side**:
   - Navigate to the public page
   - Verify overlay text appears on image
   - Verify all styles match editor preview
   - Test on mobile viewport

## Dependencies

- `@tiptap/core` - For extension creation
- `@tiptap/extension-image` - Base image extension
- Existing `ColorPicker`, `FontPicker` components
- Existing `loadGoogleFont` utility
