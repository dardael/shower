# Research: Editor Font Selection

**Feature**: 019-editor-font-selection  
**Date**: 2025-12-04

## Summary

Research findings for implementing font selection in the Tiptap rich text editor.

## Research Items

### 1. Tiptap FontFamily Extension

**Decision**: Use `@tiptap/extension-font-family` (now bundled in `@tiptap/extension-text-style`)

**Rationale**:

- Official Tiptap extension specifically designed for font family styling
- Uses the existing TextStyle mark (already installed in project)
- Provides `setFontFamily()` and `unsetFontFamily()` commands
- Applies font as inline style: `<span style="font-family: 'Font Name'">`
- Consistent with how Color extension works (also uses TextStyle)

**Alternatives Considered**:

- Custom extension with fontFamily attribute: More work, no added benefit
- Direct inline styles without extension: Less maintainable, harder to track active state

**Implementation Notes**:

- FontFamily extension is now part of `@tiptap/extension-text-style` package
- Import: `import { FontFamily } from '@tiptap/extension-text-style/font-family'`
- Alternatively use `TextStyleKit` which bundles TextStyle + FontFamily + other styling extensions
- Commands: `editor.commands.setFontFamily('Inter')`, `editor.commands.unsetFontFamily()`
- Check active: `editor.isActive('textStyle', { fontFamily: 'Inter' })`

### 2. Font Loading Strategy for Editor Preview

**Decision**: Dynamic Google Fonts loading via link elements

**Rationale**:

- Same approach used by existing FontSelector component for website font config
- Loads fonts on-demand when dropdown is opened
- No additional package dependencies required
- Works reliably across all browsers

**Implementation Pattern**:

```typescript
const loadGoogleFont = (fontName: string): void => {
  const linkId = `google-font-${fontName.replace(/\s+/g, '-')}`;
  if (!document.getElementById(linkId)) {
    const link = document.createElement('link');
    link.id = linkId;
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;500;600;700&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
};
```

### 3. Font Selector UI Pattern

**Decision**: Popover dropdown following ColorPicker pattern

**Rationale**:

- Consistent with existing ColorPicker component in the editor toolbar
- Uses Chakra UI Popover for accessible, well-tested dropdown behavior
- Familiar interaction pattern for users
- Keeps toolbar compact

**UI Structure**:

- Trigger button with font icon (TbFont from react-icons/tb)
- Popover content with fonts grouped by category
- Each font option displayed in its own typeface
- "Default" option at top to remove font formatting
- Currently active font highlighted

### 4. Font Persistence in HTML Content

**Decision**: Font styling stored as inline styles in HTML content

**Rationale**:

- FontFamily extension automatically generates `<span style="font-family: ...">` markup
- Consistent with how Color extension stores color styling
- No additional storage mechanism needed
- Works with existing PageContent save/load flow

**HTML Output Example**:

```html
<p>
  Normal text
  <span style="font-family: 'Playfair Display'">styled text</span> more text
</p>
```

### 5. Public Page Font Rendering

**Decision**: Extract unique fonts from content and load via Google Fonts API

**Rationale**:

- PublicPageContent component already sanitizes HTML via DOMPurify
- Font-family styles are allowed by DOMPurify (part of style attribute)
- Need to dynamically load fonts used in content for proper rendering

**Implementation Pattern**:

- Parse HTML content for font-family inline styles
- Extract unique font names
- Load each font via Google Fonts link element
- Can be done in useEffect when content loads

### 6. Available Fonts Reuse

**Decision**: Reuse existing `AVAILABLE_FONTS` constant from `src/domain/settings/constants/AvailableFonts.ts`

**Rationale**:

- DRY principle: fonts already defined for website font configuration
- 31 curated fonts organized by category
- Includes metadata (name, family, category, weights)
- Already validated and tested

**Categories**:

- Sans-serif (10 fonts): Inter, Roboto, Open Sans, etc.
- Serif (7 fonts): Playfair Display, Merriweather, Lora, etc.
- Display (5 fonts): Oswald, Bebas Neue, Anton, etc.
- Handwriting (5 fonts): Dancing Script, Pacifico, Caveat, etc.
- Monospace (4 fonts): Fira Code, Source Code Pro, JetBrains Mono, etc.

### 7. Testing Strategy

**Decision**: Unit tests for FontPicker component + Integration tests for persistence

**Required Tests (as per user request)**:

1. **TR-003**: Integration test to verify font is saved when configuring page content
2. **TR-004**: Integration test to verify font is displayed when editing saved content
3. **TR-005**: Integration test to verify font renders on public page

**Unit Test Coverage**:

- FontPicker renders with all available fonts
- Font selection applies correct font-family
- Remove font option works correctly
- Current font is indicated in selector

**Integration Test Pattern** (following website-font.integration.test.tsx):

- Mock fetch for API calls
- Test save flow: apply font → save content → verify API called with styled HTML
- Test reload flow: load saved content → verify font styling preserved in editor
- Test public display: render PublicPageContent with font-styled HTML → verify font applied

## Dependencies

### Required Installation

```bash
# FontFamily is now bundled in text-style package - no additional install needed
# The project already has @tiptap/extension-text-style installed
```

### Package Verification

```bash
npm ls @tiptap/extension-text-style
# Already installed in project
```

## Risk Assessment

| Risk                         | Likelihood | Impact | Mitigation                                           |
| ---------------------------- | ---------- | ------ | ---------------------------------------------------- |
| Font loading lag in editor   | Low        | Low    | Preload fonts on popover open, show loading state    |
| Font not rendering on public | Low        | Medium | Extract fonts from content and load before rendering |
| Browser compatibility        | Very Low   | Low    | Using standard CSS font-family property              |
| Performance with many fonts  | Low        | Low    | Lazy load fonts only when selected in dropdown       |

## Conclusion

The implementation is straightforward using existing Tiptap extensions and following established patterns in the codebase. Key points:

1. Use FontFamily extension from @tiptap/extension-text-style package
2. Create FontPicker component following ColorPicker pattern
3. Reuse AVAILABLE_FONTS constant for font list
4. Font styling stored as inline styles in HTML (no schema changes)
5. Dynamic font loading on both editor and public pages
