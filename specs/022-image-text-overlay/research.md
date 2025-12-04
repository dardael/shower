# Research: Image Text Overlay

**Feature**: 022-image-text-overlay  
**Date**: 2025-12-04

## Research Questions

### 1. How to store text overlay data on images?

**Decision**: Use data attributes on the image element within a wrapper container

**Rationale**:

- The existing ResizableImage extension already uses `data-text-align` for image alignment
- Data attributes are preserved in HTML content and persisted with page content
- DOMPurify sanitization is already configured to allow `data-*` attributes
- This approach follows the established pattern for image metadata storage

**Alternatives Considered**:

- **Separate overlay entity in database**: Rejected - adds complexity, requires syncing with image element, breaks the current HTML-based content model
- **Inline styles only**: Rejected - harder to parse and extract for rendering, less semantic
- **Custom Tiptap node type**: Rejected - more complex than extending existing image extension

**Implementation Pattern**:

```html
<div
  class="image-with-overlay"
  data-overlay-text="Hello"
  data-overlay-color="#ffffff"
  data-overlay-font="Roboto"
  data-overlay-size="large"
  data-overlay-position="center"
  data-overlay-align="center"
>
  <img src="..." />
  <div class="text-overlay">Hello</div>
</div>
```

### 2. How to extend the Tiptap ResizableImage extension for overlay support?

**Decision**: Create a new custom node type `imageWithOverlay` that wraps the image with overlay capabilities

**Rationale**:

- The current `ResizableImage` extension only handles image nodes
- A wrapper node allows for overlay text rendering within the editor
- Follows Tiptap's extension architecture pattern
- Maintains separation of concerns between image and overlay functionality

**Implementation Pattern**:

```typescript
const ImageWithOverlay = Node.create({
  name: 'imageWithOverlay',
  group: 'block',
  content: 'image',
  addAttributes() {
    return {
      overlayText: { default: null },
      overlayColor: { default: '#ffffff' },
      overlayFontFamily: { default: 'Inter' },
      overlayFontSize: { default: 'medium' },
      overlayPosition: { default: 'center' },
      overlayAlign: { default: 'center' },
    };
  },
  // ... parsing and rendering
});
```

### 3. How to render text overlay in the editor with live preview?

**Decision**: Use CSS absolute positioning within the wrapper container

**Rationale**:

- Consistent with how overlays work in web design
- Allows precise control over text positioning (top/center/bottom, left/center/right)
- Text scales with container when image is resized
- CSS handles responsive behavior automatically

**CSS Pattern**:

```css
.image-with-overlay {
  position: relative;
  display: inline-block;
}

.text-overlay {
  position: absolute;
  left: 0;
  right: 0;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
}

.text-overlay[data-position='top'] {
  top: 0;
}
.text-overlay[data-position='center'] {
  top: 50%;
  transform: translateY(-50%);
}
.text-overlay[data-position='bottom'] {
  bottom: 0;
}
```

### 4. How to integrate font family selection for overlays?

**Decision**: Reuse the existing FontPicker component and font infrastructure

**Rationale**:

- `AvailableFonts.ts` already provides a curated list of 30+ Google Fonts
- `loadGoogleFont.ts` handles dynamic font loading
- `extractFontsFromHtml.ts` can be extended to extract overlay fonts
- `FontPicker.tsx` provides a proven UI pattern

**Integration Points**:

- Editor: Use FontPicker in overlay toolbar for font selection
- Public: Extract fonts from `data-overlay-font` attributes and load via `loadGoogleFont()`

### 5. How to render text overlay on public pages?

**Decision**: Extend PublicPageContent CSS and ensure overlay HTML structure is preserved

**Rationale**:

- Current DOMPurify config allows `data-*` attributes and `style`
- CSS-based rendering matches the editor preview exactly
- No additional JavaScript required for overlay rendering
- Responsive behavior handled by CSS

**Implementation Requirements**:

1. Update DOMPurify config to allow wrapper `<div>` elements with overlay classes
2. Add CSS for `.image-with-overlay` and `.text-overlay` in `public-page-content.css`
3. Extend `extractFontsFromHtml.ts` to detect overlay font attributes

### 6. How to handle overlay styling toolbar?

**Decision**: Create dedicated overlay toolbar that appears when an image with overlay is selected

**Rationale**:

- Follows established pattern of contextual toolbars (alignment buttons for images)
- Keeps toolbar organized and not cluttered
- Provides focused UX for overlay-specific options

**Toolbar Components**:

- Text input for overlay content
- ColorPicker for text color (reuse existing component)
- FontPicker for font family (reuse existing component)
- Font size selector (small/medium/large/extra-large)
- Vertical position selector (top/center/bottom)
- Horizontal alignment selector (left/center/right)
- Remove overlay button

### 7. Font size mapping

**Decision**: Use predefined pixel values for font sizes

**Mapping**:
| Size | Pixel Value | Use Case |
|------|-------------|----------|
| small | 14px | Captions, subtle text |
| medium | 18px | Standard overlay text |
| large | 24px | Prominent headings |
| extra-large | 32px | Hero banners, titles |

**Rationale**:

- Predefined sizes ensure consistency across overlays
- Simplified UI compared to arbitrary pixel input
- Values chosen for readability at various image sizes

### 8. Semi-transparent background color

**Decision**: Automatically compute contrasting background based on text color

**Algorithm**:

- Light text color (luminance > 0.5) → dark background: `rgba(0, 0, 0, 0.6)`
- Dark text color (luminance ≤ 0.5) → light background: `rgba(255, 255, 255, 0.6)`

**Rationale**:

- Ensures readability without requiring user to set background
- Follows accessibility-first design principle
- Simple luminance calculation: `(0.299*R + 0.587*G + 0.114*B) / 255`

## Technical Dependencies

### Existing Components to Reuse

- `ColorPicker.tsx` - for text color selection
- `FontPicker.tsx` - for font family selection
- `loadGoogleFont.ts` - for dynamic font loading
- `extractFontsFromHtml.ts` - extend for overlay fonts
- `AvailableFonts.ts` - font configuration

### New Components Required

- `ImageWithOverlay` Tiptap extension
- `OverlayToolbar.tsx` - toolbar for overlay controls
- CSS for overlay rendering (editor and public)

### Files to Modify

- `TiptapEditor.tsx` - add overlay extension and toolbar integration
- `tiptap-styles.css` - add overlay styles for editor
- `PublicPageContent.tsx` - ensure overlay HTML is preserved
- `public-page-content.css` - add overlay styles for public view
- DOMPurify configuration - allow overlay elements and attributes

## Resolved Clarifications

All technical unknowns have been resolved through research:

- Data storage: Data attributes on wrapper element
- Editor rendering: CSS absolute positioning
- Font integration: Reuse existing infrastructure
- Public rendering: CSS-based with proper sanitization
