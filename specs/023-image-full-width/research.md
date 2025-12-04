# Research: Image Full Width Button

**Feature**: 023-image-full-width
**Date**: 2025-12-04

## Research Areas

### 1. Tiptap Node Attribute Extension Pattern

**Decision**: Add `fullWidth` boolean attribute to both `image` and `imageWithOverlay` nodes

**Rationale**:

- Existing pattern in codebase: `textAlign` attribute already added to both node types
- Tiptap's `addAttributes()` method allows extending nodes with custom attributes
- Boolean attribute is simplest approach - stores `true`/`false` or `null`

**Alternatives Considered**:

- CSS-only approach (rejected: state not persisted, can't detect in editor)
- Separate width value like "100%" (rejected: overly complex, KISS violation)

### 2. HTML Data Attribute for Persistence

**Decision**: Use `data-full-width="true"` attribute on image wrapper/element

**Rationale**:

- Follows existing pattern: `data-text-align`, `data-overlay-*` attributes already used
- DOMPurify preserves data attributes in production browsers
- Easy to style with CSS attribute selector: `[data-full-width="true"]`

**Alternatives Considered**:

- Using a CSS class like `full-width-image` (rejected: less explicit, harder to parse)
- Inline style `width: 100%` (rejected: conflicts with resize functionality)

### 3. CSS Implementation for Full Width

**Decision**: Use `width: 100%` style on wrapper, disable fixed width when fullWidth is true

**Rationale**:

- Container already has `max-width: 100%` - just need to force `width: 100%`
- Must override any fixed width from resize handles
- Works for both plain images and images with overlay

**Implementation**:

```css
/* For plain images */
.public-page-content img[data-full-width='true'] {
  width: 100% !important;
  max-width: none;
}

/* For images with overlay */
.public-page-content .image-with-overlay[data-full-width='true'] {
  width: 100%;
}

.public-page-content .image-with-overlay[data-full-width='true'] img {
  width: 100%;
}
```

### 4. Button Implementation Pattern

**Decision**: Conditional IconButton in toolbar, visible only when image selected

**Rationale**:

- Follows existing pattern: "Add Text Overlay" button uses same conditional rendering
- Uses existing `selectedImagePos` and `selectedNodeType` state
- Button state (solid/ghost variant) indicates active full-width status

**Icon Choice**: `FiMaximize2` from react-icons (expand arrows icon)

### 5. Testing Strategy

**Decision**: Two test files as requested by user

**Test 1 - Integration Test (Public Page)**:

- Location: `test/integration/image-full-width.integration.test.tsx`
- Tests that full-width images render at 100% width on public pages
- Tests both plain images and images with text overlay
- Follows existing `image-text-overlay.integration.test.tsx` patterns

**Test 2 - Unit Test (Button Functionality)**:

- Location: `test/unit/presentation/admin/components/PageContentEditor/FullWidthButton.test.tsx`
- Tests button visibility when image selected/not selected
- Tests button state (active when fullWidth=true)
- Tests toggle behavior (apply and remove full width)

**Rationale**:

- User explicitly requested tests for button and public page rendering
- Constitution II allows tests when explicitly requested
- Follows existing test patterns in codebase

### 6. Interaction with Resize Handles

**Decision**: Manual resize removes fullWidth attribute

**Rationale**:

- FR-011 requires: "System MUST remove the full-width setting when the user manually resizes the image"
- Logical UX: user resizing implies they want specific dimensions
- Implementation: In resize handler, set `fullWidth: false` or remove attribute

### 7. Interaction with Image Alignment

**Decision**: Full-width takes visual precedence, alignment attribute preserved

**Rationale**:

- When `fullWidth=true`, image spans container - alignment is irrelevant
- Preserve alignment attribute so toggling off full-width restores previous alignment
- CSS for full-width overrides alignment margins

## Unknowns Resolved

All technical context items resolved. No NEEDS CLARIFICATION remaining.

## Summary

The implementation follows existing patterns in the codebase:

1. Extend Tiptap nodes with `fullWidth` boolean attribute
2. Persist via `data-full-width` HTML attribute
3. Style with CSS attribute selectors
4. Conditional toolbar button matching existing patterns
5. Two focused test files covering button and public rendering
