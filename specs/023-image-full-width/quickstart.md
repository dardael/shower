# Quickstart: Image Full Width Button

**Feature**: 023-image-full-width
**Date**: 2025-12-04

## Overview

This feature adds a full-width toggle button to the rich text editor that allows administrators to expand images to 100% of the container width. It works with both plain images and images with text overlays.

## Key Files to Modify

### 1. TiptapEditor.tsx

**Path**: `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`

Add:

- Import `FiMaximize2` icon from react-icons
- `fullWidth` attribute to ResizableImage extension
- Full-width toggle button in toolbar (conditional on image selection)
- Handler function to toggle fullWidth attribute
- Helper function to check if current image has fullWidth active

### 2. ImageWithOverlay.ts

**Path**: `src/presentation/admin/components/PageContentEditor/extensions/ImageWithOverlay.ts`

Add:

- `fullWidth` attribute to node definition with parseHTML/renderHTML
- Update renderHTML to apply `width: 100%` style when fullWidth is true
- Add `data-full-width="true"` to wrapper element when active

### 3. tiptap-styles.css

**Path**: `src/presentation/admin/components/PageContentEditor/tiptap-styles.css`

Add:

- Styles for full-width images in editor preview
- Override for resize container when full-width is active

### 4. public-page-content.css

**Path**: `src/presentation/shared/components/PublicPageContent/public-page-content.css`

Add:

- Styles for `[data-full-width="true"]` images
- Styles for `.image-with-overlay[data-full-width="true"]`

### 5. Integration Test (NEW)

**Path**: `test/integration/image-full-width.integration.test.tsx`

Create:

- Tests for full-width plain images on public page
- Tests for full-width images with overlay on public page
- Follow existing pattern from `image-text-overlay.integration.test.tsx`

### 6. Unit Test (NEW)

**Path**: `test/unit/presentation/admin/components/PageContentEditor/FullWidthButton.test.tsx`

Create:

- Tests for button visibility
- Tests for button state
- Tests for toggle behavior

## Implementation Order

1. **Extend ImageWithOverlay node** with fullWidth attribute
2. **Extend ResizableImage** with fullWidth attribute
3. **Add CSS styles** for editor and public pages
4. **Add toolbar button** with toggle logic
5. **Write integration tests** for public page rendering
6. **Write unit tests** for button functionality

## Testing Commands

```bash
# Run all tests
docker compose run --rm app npm run test

# Run specific test file
docker compose run --rm app npm run test -- image-full-width

# Run with coverage
docker compose run --rm app npm run test -- --coverage
```

## Verification Checklist

- [x] Button appears when image is selected
- [x] Button hidden when no image selected
- [x] Button shows active state when fullWidth=true
- [x] Clicking button applies full width
- [x] Clicking again removes full width
- [x] Works with plain images
- [x] Works with images with overlay
- [x] Full width persists after save
- [x] Full width renders on public page
- [x] Manual resize removes full width setting
