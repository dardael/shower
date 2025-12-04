# Research: Inline Text Color in Rich Text Editor

**Feature**: 018-theme-color-text  
**Date**: 2025-12-04

## Research Areas

### 1. Tiptap Text Color Extension

**Decision**: Use `@tiptap/extension-color` with `@tiptap/extension-text-style` for text coloring.

**Rationale**:

- Official Tiptap extension provides battle-tested implementation
- Uses the `textStyle` mark with a `color` attribute
- Renders as `<span style="color: #RRGGBB">` which is XSS-safe when sanitized
- Integrates seamlessly with existing Tiptap setup

**Alternatives considered**:

- Custom mark extension (like current ThemeColorMark) - More code to maintain, reinventing the wheel
- CSS classes with data attributes - Requires CSS variables, less flexible for arbitrary colors

**Implementation**:

```bash
npm install @tiptap/extension-color @tiptap/extension-text-style
```

### 2. Color Picker Component

**Decision**: Create a custom `ColorPicker` component using Chakra UI with preset palette + HexColorInput.

**Rationale**:

- Chakra UI v3 does not have a built-in color picker
- Preset palette provides quick access to common colors (per spec requirement)
- HexColorInput allows custom color entry (per spec requirement)
- Simple implementation aligns with KISS principle

**Alternatives considered**:

- `react-colorful` library - Additional dependency, overkill for simple use case
- Browser native `<input type="color">` only - No preset palette, inconsistent UX across browsers

**Implementation approach**:

- Grid of preset color swatches (clickable)
- Text input for hex color with validation
- Popover UI triggered from toolbar button

### 3. Preset Color Palette

**Decision**: Use a minimal set of 12 commonly used colors.

**Rationale**:

- Covers primary, secondary, and neutral colors
- Small enough for quick selection
- Aligned with typical web design needs

**Colors**:

```typescript
const PRESET_COLORS = [
  '#000000', // Black
  '#FFFFFF', // White
  '#EF4444', // Red
  '#F97316', // Orange
  '#EAB308', // Yellow
  '#22C55E', // Green
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#6B7280', // Gray
  '#78716C', // Brown
];
```

### 4. DOMPurify Configuration

**Decision**: Keep `style` attribute in ALLOWED_ATTR (already present) - no changes needed.

**Rationale**:

- The `style` attribute is already allowed in PublicPageContent.tsx
- Tiptap's color extension outputs `<span style="color: #RRGGBB">`
- DOMPurify will sanitize any malicious CSS

**Current configuration** (no change needed):

```typescript
ALLOWED_ATTR: [
  'href',
  'src',
  'alt',
  'title',
  'target',
  'rel',
  'class',
  'data-theme-color',
  'style',
];
```

### 5. Migration from ThemeColorMark

**Decision**: Replace ThemeColorMark with the new TextColor extension.

**Rationale**:

- ThemeColorMark only supports theme color, not arbitrary colors
- New feature supersedes the old functionality
- Existing content with `theme-color-text` class will need migration or fallback styling

**Migration approach**:

- Remove ThemeColorMark.ts
- Remove theme-color-text CSS styling
- Add fallback CSS for legacy content: `.theme-color-text { color: inherit; }`

### 6. Toolbar UI

**Decision**: Replace the theme color button with a color picker dropdown.

**Rationale**:

- Same toolbar position (after italic button)
- Dropdown/popover provides access to palette + custom color
- Button shows current text color or default icon

**UX Flow**:

1. Select text in editor
2. Click color button in toolbar
3. Popover opens with preset palette grid + custom hex input
4. Click a color or enter hex → color applied immediately
5. Popover closes on selection or click outside

## Dependencies to Install

```bash
npm install @tiptap/extension-color @tiptap/extension-text-style
```

## Files to Modify

| File                      | Action    | Description                                                                   |
| ------------------------- | --------- | ----------------------------------------------------------------------------- |
| `TiptapEditor.tsx`        | UPDATE    | Add Color + TextStyle extensions, replace theme color button with ColorPicker |
| `ColorPicker.tsx`         | CREATE    | New component for color selection UI                                          |
| `ThemeColorMark.ts`       | DELETE    | No longer needed                                                              |
| `tiptap-styles.css`       | UPDATE    | Add fallback for legacy theme-color-text                                      |
| `public-page-content.css` | UPDATE    | Add fallback for legacy theme-color-text                                      |
| `PublicPageContent.tsx`   | NO CHANGE | style attribute already allowed                                               |

## Risk Assessment

| Risk                                        | Likelihood | Impact | Mitigation                                       |
| ------------------------------------------- | ---------- | ------ | ------------------------------------------------ |
| Legacy content with theme-color-text breaks | Medium     | Low    | Add CSS fallback to inherit color                |
| Color picker popover positioning issues     | Low        | Low    | Use Chakra UI Popover with proper placement      |
| Hex validation edge cases                   | Low        | Low    | Simple regex validation, accept 3 or 6 digit hex |

## Testing Strategy

**Decision**: Unit tests for color application, removal, and public rendering.

**Rationale**:

- Tests explicitly requested by user
- Focus on behavior, not implementation details
- Avoid over-mocking per constitution

### Test Cases

#### ColorPicker Component Tests (`ColorPicker.test.tsx`)

1. **Apply color to text**
   - Render ColorPicker with mock editor
   - Click a preset color
   - Verify `setColor` command is called with correct hex value

2. **Remove color from text**
   - Render ColorPicker with mock editor (text has color)
   - Click "remove color" option
   - Verify `unsetColor` command is called

3. **Custom hex color input**
   - Render ColorPicker
   - Enter valid hex color in input
   - Verify color is applied

#### PublicPageContent Tests (`PublicPageContent.test.tsx`)

1. **Render colored text**
   - Render with HTML containing `<span style="color: #3B82F6">text</span>`
   - Verify span element has correct inline style

2. **Render text without color**
   - Render with plain HTML `<p>text</p>`
   - Verify text renders without explicit color style

3. **Sanitize malicious content**
   - Render with HTML containing XSS attempt in style
   - Verify content is sanitized (DOMPurify removes malicious code)

### Test Files

| File                                                                                    | Description                  |
| --------------------------------------------------------------------------------------- | ---------------------------- |
| `test/unit/presentation/admin/components/PageContentEditor/ColorPicker.test.tsx`        | ColorPicker unit tests       |
| `test/unit/presentation/shared/components/PublicPageContent/PublicPageContent.test.tsx` | PublicPageContent unit tests |
