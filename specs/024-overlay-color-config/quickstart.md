# Quickstart: Overlay Color Configuration

**Feature**: 024-overlay-color-config
**Date**: 2025-12-04

## Quick Implementation Guide

### Step 1: Extend Domain Types

**File**: `src/domain/pages/types/ImageOverlay.ts`

Add new properties to the interface and defaults:

```typescript
export interface ImageTextOverlay {
  // ... existing properties
  bgColor: string; // Background color (hex)
  bgOpacity: number; // Background opacity (0-100)
}

export const DEFAULT_OVERLAY_CONFIG: Omit<ImageTextOverlay, 'text'> = {
  // ... existing defaults
  bgColor: '#000000',
  bgOpacity: 50,
};
```

### Step 2: Update Tiptap Extension

**File**: `src/presentation/admin/components/PageContentEditor/extensions/ImageWithOverlay.ts`

1. Add new attributes for `overlayBgColor` and `overlayBgOpacity`
2. Update `renderHTML` to use configurable background instead of auto-generated
3. Create `getOverlayBackground(bgColor, bgOpacity)` utility function

### Step 3: Update OverlayToolbar

**File**: `src/presentation/admin/components/PageContentEditor/OverlayToolbar.tsx`

1. Add `ColorPickerPopover` for background color selection
2. Add `Slider` component for opacity control (0-100)
3. Wire up handlers to update overlay attributes

### Step 4: Create Integration Tests

**File**: `test/integration/overlay-color-config.integration.test.tsx`

Test scenarios:

- Custom overlay background color renders correctly
- Custom overlay opacity renders correctly
- Default values applied when not configured
- Edge cases: 0% and 100% opacity

## Files to Modify

| File                                                                                 | Change                                             |
| ------------------------------------------------------------------------------------ | -------------------------------------------------- |
| `src/domain/pages/types/ImageOverlay.ts`                                             | Add `bgColor`, `bgOpacity` properties and defaults |
| `src/presentation/admin/components/PageContentEditor/extensions/ImageWithOverlay.ts` | Add attributes and update rendering                |
| `src/presentation/admin/components/PageContentEditor/OverlayToolbar.tsx`             | Add UI controls                                    |
| `test/integration/overlay-color-config.integration.test.tsx`                         | New integration tests                              |

## Testing Commands

```bash
# Run all tests
docker compose run --rm app npm run test

# Run specific integration test
docker compose run --rm app npm run test -- overlay-color-config.integration.test

# Type check
docker compose run --rm app npm run build:strict
```

## Verification Checklist

- [ ] Color picker appears in overlay toolbar
- [ ] Opacity slider appears in overlay toolbar
- [ ] Color changes reflect immediately in editor
- [ ] Opacity changes reflect immediately in editor
- [ ] Settings persist after save and reload
- [ ] Public page displays correct background color
- [ ] Public page displays correct opacity
- [ ] Existing overlays work with default values
- [ ] All integration tests pass
