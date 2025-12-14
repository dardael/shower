# Data Model: Image Full Bleed Layout

**Feature**: 029-image-full-bleed  
**Date**: 2025-12-14

## Entity Changes

### Image Node (ResizableImage Extension)

**Location**: `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`

| Attribute     | Type                          | Default   | Description                           |
| ------------- | ----------------------------- | --------- | ------------------------------------- |
| src           | string                        | required  | Image source URL                      |
| alt           | string                        | ''        | Alt text                              |
| title         | string                        | ''        | Title attribute                       |
| width         | number                        | null      | Fixed width in pixels                 |
| textAlign     | 'left' \| 'center' \| 'right' | 'center'  | Horizontal alignment                  |
| fullWidth     | boolean                       | false     | 100% container width (existing)       |
| **fullBleed** | **boolean**                   | **false** | **Break out to viewport edges (NEW)** |

**HTML Representation**:

```html
<img src="..." data-full-bleed="true" data-full-width="false" />
```

### ImageWithOverlay Node

**Location**: `src/presentation/admin/components/PageContentEditor/extensions/ImageWithOverlay.ts`

| Attribute         | Type                          | Default   | Description                           |
| ----------------- | ----------------------------- | --------- | ------------------------------------- |
| src               | string                        | required  | Image source URL                      |
| alt               | string                        | ''        | Alt text                              |
| title             | string                        | ''        | Title attribute                       |
| width             | number                        | null      | Fixed width in pixels                 |
| textAlign         | 'left' \| 'center' \| 'right' | 'center'  | Horizontal alignment                  |
| fullWidth         | boolean                       | false     | 100% container width (existing)       |
| **fullBleed**     | **boolean**                   | **false** | **Break out to viewport edges (NEW)** |
| overlayText       | string                        | ''        | Text overlay content                  |
| overlayColor      | string                        | '#ffffff' | Text color                            |
| overlayFontFamily | string                        | 'inherit' | Font family                           |
| overlayFontSize   | string                        | '24px'    | Font size                             |
| overlayPosition   | string                        | 'center'  | Vertical position                     |
| overlayAlign      | string                        | 'center'  | Text alignment                        |
| overlayBgColor    | string                        | '#000000' | Background color                      |
| overlayBgOpacity  | number                        | 0.5       | Background opacity                    |

**HTML Representation**:

```html
<div class="image-with-overlay" data-full-bleed="true" data-full-width="false">
  <img src="..." />
  <div class="overlay">...</div>
</div>
```

## Validation Rules

- `fullBleed` must be boolean
- When `fullBleed` is true, `fullWidth` behavior is implicitly included (full-bleed is wider than full-width)
- Both attributes can be stored independently for flexibility

## State Transitions

```
[Normal Image] --enable fullBleed--> [Full Bleed Image]
[Full Bleed Image] --disable fullBleed--> [Normal Image]
[Full Width Image] --enable fullBleed--> [Full Bleed Image]
[Full Bleed Image] --disable fullBleed--> [Full Width Image] (if fullWidth was true)
```

## Database Impact

**None** - Content is stored as HTML string in existing `PageContent` entity. The new `data-full-bleed` attribute is automatically preserved in the HTML.
