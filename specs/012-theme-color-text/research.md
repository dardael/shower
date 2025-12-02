# Research: Theme Color Text Formatting

**Feature**: 012-theme-color-text  
**Date**: 2025-12-02

## Research Summary

### 1. Tiptap Custom Mark Extension Pattern

**Decision**: Create a custom Tiptap mark extension using `Mark.create()` from `@tiptap/core`

**Rationale**:

- Tiptap marks are the standard way to apply inline text formatting (like bold, italic)
- Custom marks support toggle behavior out of the box via `toggleMark` command
- Mark extensions integrate seamlessly with existing StarterKit extensions
- No additional packages required - `@tiptap/core` is already included via `@tiptap/react`

**Alternatives Considered**:

- **@tiptap/extension-color**: Uses inline styles with specific hex colors. Rejected because we need CSS variable-based colors that update dynamically with theme changes.
- **@tiptap/extension-text-style**: Base extension for custom text styling. Not needed since a simple mark with CSS class achieves our goal more simply.
- **Inline style approach**: Applying color directly as inline style. Rejected because it would not update when theme color changes.

### 2. Color Application Strategy

**Decision**: Apply a CSS class (`theme-color-text`) that uses Chakra UI CSS variables

**Rationale**:

- CSS variables automatically update when theme color changes
- Consistent with existing link styling in tiptap-styles.css which uses `var(--chakra-colors-color-palette-solid)`
- Works in both admin editor and public page views
- Maintains separation between content structure (HTML) and presentation (CSS)
- Proper fallback for SSR and non-Chakra contexts

**CSS Implementation**:

```css
.theme-color-text {
  color: var(--chakra-colors-color-palette-solid);
}
```

**Alternatives Considered**:

- **Data attribute only**: Using `data-theme-color` without class. Rejected because CSS class is more semantic and easier to style.
- **Hardcoded color values**: Rejected because colors would not update with theme changes.
- **JavaScript color injection**: Rejected for complexity - CSS variables handle dynamic colors elegantly.

### 3. Toolbar Button Icon

**Decision**: Use `MdFormatColorText` from `react-icons/md` (Material Design)

**Rationale**:

- Material Design icons are already used in the project (LuHeading1, etc. from Lucide)
- `MdFormatColorText` is a recognizable "text color" icon with an underline indicator
- Consistent size and style with existing toolbar buttons
- Available in react-icons package already installed

**Alternatives Considered**:

- **FiType** (Feather): Less recognizable as color formatting
- **IoColorPalette** (Ionicons): Too generic, suggests full color picker
- **Custom icon**: Unnecessary complexity

### 4. HTML Output Structure

**Decision**: Render as `<span class="theme-color-text" data-theme-color="true">text</span>`

**Rationale**:

- `span` is semantic for inline text styling
- CSS class enables styling
- `data-theme-color` attribute provides explicit identification for parsing
- Both attributes in `parseHTML` ensures backwards compatibility

**HTML Output Example**:

```html
<p>
  This is
  <span class="theme-color-text" data-theme-color="true">colored</span> text.
</p>
```

### 5. Public Page Rendering

**Decision**: Add theme-color-text styles to tiptap-styles.css (already imported in editor and can be imported for public pages)

**Rationale**:

- Public pages render stored HTML content
- CSS class will be present in stored HTML
- Chakra CSS variables are available in both admin and public contexts via the provider chain
- Single source of truth for the styling

**Implementation Notes**:

- The CSS uses `var(--chakra-colors-color-palette-solid)` which is set by Chakra's `colorPalette` in globalCss
- This variable is already used for links in tiptap-styles.css, confirming the pattern works

### 6. Toggle Behavior

**Decision**: Use Tiptap's built-in `toggleMark` command

**Rationale**:

- Standard Tiptap pattern used by bold, italic, etc.
- Automatically handles:
  - Applying mark to selection
  - Removing mark from already-marked text
  - Extending mark when typing at mark boundary
- Consistent with existing button behavior in TiptapEditor

**Command API**:

```typescript
editor.chain().focus().toggleThemeColor().run();
editor.isActive('themeColor'); // Check if mark is active
```

## Dependencies Verification

| Package       | Current Version | Required | Notes                       |
| ------------- | --------------- | -------- | --------------------------- |
| @tiptap/react | 3.11.1          | Yes      | Already installed           |
| @tiptap/core  | (via react)     | Yes      | Included with @tiptap/react |
| react-icons   | Installed       | Yes      | Already installed           |

**No new dependencies required.**

## Risk Assessment

| Risk                                       | Likelihood | Impact | Mitigation                                         |
| ------------------------------------------ | ---------- | ------ | -------------------------------------------------- |
| CSS variable not available on public pages | Low        | Medium | Verify provider chain includes theme color context |
| Mark conflicts with other marks            | Low        | Low    | Standard Tiptap mark behavior handles combinations |
| SSR hydration issues                       | Low        | Low    | Mark uses simple HTML output, no client-side state |

## Conclusion

The implementation approach is straightforward:

1. Create `ThemeColorMark.ts` custom extension (~40 lines)
2. Add button to TiptapEditor toolbar (~10 lines)
3. Add CSS rule to tiptap-styles.css (~5 lines)

Total estimated code changes: ~55 lines of new/modified code.
