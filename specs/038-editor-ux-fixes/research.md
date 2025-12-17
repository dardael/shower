# Research: Editor UX Fixes

**Feature**: 038-editor-ux-fixes
**Date**: 2025-12-17

## Research Summary

This feature involves three UI fixes with well-established solutions. No external research required as all solutions use existing Chakra UI and CSS patterns.

---

## Decision 1: Sticky Toolbar Implementation

**Decision**: Use CSS `position: sticky` on the toolbar HStack within the TiptapEditor component

**Rationale**:

- Native CSS solution with excellent browser support
- Sticks to top of editor container (not viewport) as per clarified requirement
- Simple implementation requiring only a few CSS properties
- Works consistently across all viewport sizes including mobile

**Alternatives Considered**:

- `position: fixed` with JavaScript calculations - Rejected: More complex, requires viewport tracking
- Intersection Observer API - Rejected: Overkill for this use case, adds unnecessary complexity
- Third-party sticky library - Rejected: Violates YAGNI principle

**Implementation Details**:

- Add `position="sticky"` and `top={0}` to the toolbar HStack
- Add `zIndex={10}` to ensure toolbar stays above editor content
- The parent Box already has `overflow` handling that supports sticky positioning

---

## Decision 2: Auto-Scroll to Editor

**Decision**: Use `useEffect` with `scrollIntoView()` when `editingContentItem` state changes in MenuConfigForm

**Rationale**:

- Native browser API with universal support
- Simple one-line implementation
- `behavior: 'smooth'` provides good UX
- `block: 'start'` ensures toolbar is visible at top of viewport

**Alternatives Considered**:

- Custom scroll animation with requestAnimationFrame - Rejected: Unnecessary complexity
- Scroll position calculation with window.scrollTo - Rejected: Less reliable, more code
- Focus management only - Rejected: Doesn't ensure visibility

**Implementation Details**:

- Add `useRef` to the PageContentEditor container Box
- Use `useEffect` to scroll when editor becomes visible
- Use `scrollIntoView({ behavior: 'smooth', block: 'start' })` for smooth scroll with toolbar visible

---

## Decision 3: Button Contrast Fix

**Decision**: Add explicit `colorPalette` prop to the Delete button to ensure proper contrast in both light and dark modes

**Rationale**:

- The Delete button uses `variant="outline"` with `colorPalette="red"` which may have contrast issues in certain theme configurations
- Adding explicit foreground color ensures text is always visible
- Follows Chakra UI v3 semantic color token patterns

**Alternatives Considered**:

- Custom CSS override - Rejected: Harder to maintain, breaks theme consistency
- Change button variant to "solid" - Rejected: May not match design intent
- Theme-level fix - Rejected: More invasive, affects other components

**Implementation Details**:

- Investigate actual button causing the issue (likely the outline variant)
- Apply proper color tokens or change variant to ensure contrast
- Test in both light and dark modes

---

## Technical Notes

### CSS Sticky Positioning Requirements

- Parent container must have defined height or overflow handling
- No `overflow: hidden` on ancestor elements that would clip sticky element
- Current TiptapEditor parent Box structure supports sticky positioning

### ScrollIntoView Browser Support

- Supported in all modern browsers
- `smooth` behavior supported in Chrome, Firefox, Safari, Edge
- Graceful degradation to instant scroll in older browsers

### Chakra UI v3 Button Variants

- `variant="solid"`: Filled background with contrasting text
- `variant="outline"`: Border with transparent background
- `variant="ghost"`: No border or background
- Outline variant may need explicit color in certain colorPalette combinations
