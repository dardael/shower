# Research: Overlay Color Configuration

**Feature**: 024-overlay-color-config
**Date**: 2025-12-04

## Research Tasks Completed

### 1. Existing Overlay Implementation Pattern

**Decision**: Extend existing `ImageWithOverlay` Tiptap extension with two new attributes

**Rationale**:

- The current implementation already handles overlay attributes as HTML data attributes (`data-overlay-*`)
- The `getContrastBackground()` function currently auto-generates background color based on text luminance
- Adding `overlayBgColor` and `overlayBgOpacity` follows the established pattern
- The existing `OverlayToolbar.tsx` already uses `ColorPickerPopover` for text color

**Alternatives considered**:

- Create new extension: Rejected - unnecessary complexity, violates DRY
- Store in separate database field: Rejected - breaks content portability, over-engineering

### 2. Opacity Control Implementation

**Decision**: Use Chakra UI Slider component for opacity control (0-100 percentage)

**Rationale**:

- Chakra UI v3 provides accessible slider components
- Percentage (0-100) is more intuitive for users than decimal (0-1)
- Convert to CSS opacity (0-1) at render time
- Slider provides better UX than numeric input for continuous values

**Alternatives considered**:

- Numeric input only: Rejected - less intuitive, harder to use
- Dropdown with presets: Rejected - limits flexibility, users expect continuous control

### 3. Background Color vs Text Color

**Decision**: Add separate `overlayBgColor` and `overlayBgOpacity` distinct from existing `overlayColor` (text color)

**Rationale**:

- `overlayColor` = text color (existing, stays as-is)
- `overlayBgColor` = background overlay color (new)
- `overlayBgOpacity` = background overlay opacity (new)
- Clear separation of concerns, no confusion

**Alternatives considered**:

- Rename existing overlayColor: Rejected - breaks backward compatibility
- Single RGBA value: Rejected - separating color and opacity provides better UX

### 4. Default Values for Backward Compatibility

**Decision**:

- `overlayBgColor`: Default to `#000000` (black)
- `overlayBgOpacity`: Default to `50` (50%)

**Rationale**:

- Matches current auto-generated behavior for light text on dark background
- Existing overlays without these attributes will render identically
- Users can then customize from this baseline

**Alternatives considered**:

- No defaults (require explicit config): Rejected - breaks existing overlays
- White default: Rejected - doesn't match most use cases, poor contrast on typical images

### 5. CSS Background Rendering

**Decision**: Generate `background: rgba(r, g, b, opacity)` inline style from hex color + opacity

**Rationale**:

- Inline styles survive DOMPurify sanitization on public pages
- Single computed value is cleaner than separate CSS properties
- Consistent with existing overlay style generation pattern

**Alternatives considered**:

- CSS custom properties: Rejected - DOMPurify may strip them
- Separate background-color and opacity: Rejected - CSS opacity affects children too

### 6. Testing Strategy

**Decision**: Create integration tests for public page rendering of overlay color/opacity

**Rationale**:

- User explicitly requested tests for this feature
- Integration tests verify end-to-end rendering on public side
- Follow existing pattern from `image-text-overlay.integration.test.tsx`
- Focus on verifying inline styles are correctly applied

**Test Coverage**:

- Custom overlay background color renders correctly
- Custom overlay opacity renders correctly
- Default values applied when not configured
- Multiple images with different overlay configurations
- Edge cases: 0% opacity (transparent), 100% opacity (opaque)

**Alternatives considered**:

- Unit tests only: Rejected - need to verify full render pipeline
- E2E tests: Rejected - too heavy for this feature, integration sufficient

## Implementation Notes

1. **Attribute naming convention**:
   - HTML data attribute: `data-overlay-bg-color`, `data-overlay-bg-opacity`
   - Node attribute: `overlayBgColor`, `overlayBgOpacity`

2. **Opacity conversion**:
   - Store: Integer 0-100 (user-friendly percentage)
   - Render: Divide by 100 for CSS opacity (0-1)

3. **Color utility**:
   - Reuse or adapt existing `hexToRgba()` utility if available
   - Or create simple hex-to-rgba converter for this feature

4. **UI placement**:
   - Add controls to existing `OverlayToolbar.tsx`
   - Group with existing styling controls (color, font, size, position)
