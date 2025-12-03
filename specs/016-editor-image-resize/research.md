# Research: Editor Image Resize and Move

**Feature**: 016-editor-image-resize  
**Date**: 2025-12-03

## Research Questions

### 1. How to implement image resize in Tiptap?

**Decision**: Use Tiptap's built-in `resize` configuration option for the Image extension.

**Rationale**:

- Tiptap v3.11.1 (already installed) includes native resize support via configuration
- No additional packages required - uses `Image.configure({ resize: { enabled: true, ... } })`
- Provides corner handles, aspect ratio preservation, and min/max constraints out of the box
- Integrates with Tiptap's undo/redo system

**Configuration**:

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

**Alternatives Considered**:

- `tiptap-extension-resize-image` package: Rejected - adds external dependency when built-in works
- Custom ProseMirror node view: Rejected - over-engineering for simple resize
- CSS-only resize: Rejected - doesn't persist dimensions in content

### 2. How to implement image drag-and-drop repositioning?

**Decision**: Use Tiptap's native node dragging with `draggable: true` on the Image extension.

**Rationale**:

- Tiptap nodes can be made draggable natively
- ProseMirror handles the drop position and content reordering
- No additional library needed (@dnd-kit exists but is overkill for this)
- Works with existing content structure

**Implementation**:

```typescript
Image.extend({
  draggable: true,
});
```

The `handleDrop` editor prop already exists for file drops - node dragging is separate and handled by ProseMirror's drag-and-drop system.

**Alternatives Considered**:

- @dnd-kit integration: Rejected - already used for menu items but ProseMirror's native dragging is better for editor content
- Custom drag implementation: Rejected - reinventing the wheel

### 3. How are image dimensions persisted?

**Decision**: Store dimensions as inline width/height styles in the HTML content.

**Rationale**:

- Tiptap's resize configuration automatically adds width/height attributes to `<img>` tags
- HTML content is already stored as a string in MongoDB (PageContentBody)
- DOMPurify in PublicPageContent already allows `style` attribute
- No database schema changes needed

**Example Output**:

```html
<img
  src="/api/page-content-images/..."
  style="width: 400px; height: 300px"
  class="tiptap-image"
/>
```

**Alternatives Considered**:

- Separate dimension storage in database: Rejected - over-engineering, breaks content encapsulation
- CSS classes for predefined sizes: Rejected - not flexible enough

### 4. How to style resize handles for light/dark mode?

**Decision**: Add CSS styles for resize handles with proper contrast in both themes.

**Rationale**:

- Tiptap's resize wraps image in a node view with resize handles
- Handles need visible borders/backgrounds against any image
- Use semi-transparent overlays with contrasting borders

**CSS Approach**:

```css
.tiptap-editor-wrapper .tiptap .ProseMirror-selectednode img {
  outline: 2px solid var(--chakra-colors-color-palette-solid);
}

/* Resize handles styling */
.tiptap-editor-wrapper .tiptap [data-resize-handle] {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid var(--chakra-colors-color-palette-solid);
}
```

### 5. Touch device support

**Decision**: Rely on Tiptap's built-in touch support.

**Rationale**:

- Tiptap's resize handles work with touch events
- No special implementation needed for tablets
- Touch-drag for repositioning works via ProseMirror

## Technical Findings

### Current Implementation (spec 015)

File: `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`

```typescript
// Current configuration (line 136-140)
Image.configure({
  HTMLAttributes: {
    class: 'tiptap-image',
  },
});
```

### Required Changes

1. **TiptapEditor.tsx**: Add resize configuration and make image draggable
2. **tiptap-styles.css**: Add styling for selected images and resize handles
3. **public-page-content.css**: Ensure inline styles render correctly (already supported)

### Dependencies

- No new packages required
- @tiptap/extension-image v3.11.1 already includes resize support

## Conclusion

The implementation is straightforward:

1. Configure `resize` option on existing Image extension
2. Extend Image to add `draggable: true`
3. Add CSS for resize handles visibility
4. No backend changes, no new dependencies
