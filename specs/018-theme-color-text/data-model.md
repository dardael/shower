# Data Model: Inline Text Color in Rich Text Editor

**Feature**: 018-theme-color-text  
**Date**: 2025-12-04

## Overview

This feature does not introduce new domain entities. The text color is stored inline within the existing PageContent HTML content using standard HTML `style` attributes.

## Existing Entities (No Changes)

### PageContent

The `PageContent` entity remains unchanged. Text color is embedded in the HTML content string.

```
PageContent
├── id: string (UUID)
├── menuItemId: string (reference to MenuItem)
├── content: PageContentBody (value object containing HTML string)
├── createdAt: Date
└── updatedAt: Date
```

### PageContentBody (Value Object)

The `PageContentBody` value object remains unchanged. It stores HTML content as a string with a maximum length of 100,000 characters.

## Data Representation

### Text Color in HTML Content

Colors are stored inline using the Tiptap `textStyle` mark:

```html
<!-- Before (existing ThemeColorMark) -->
<p>
  Normal text
  <span class="theme-color-text" data-theme-color="true">colored text</span>
</p>

<!-- After (new TextColor) -->
<p>Normal text <span style="color: #3B82F6">colored text</span></p>
```

### Storage Format

| Aspect       | Value                                     |
| ------------ | ----------------------------------------- |
| Format       | CSS `color` property in `style` attribute |
| Color Format | Hex RGB (#RRGGBB or #RGB)                 |
| Element      | `<span>` tag                              |
| Validation   | DOMPurify sanitization on render          |

## Preset Colors Constant

A presentation-layer constant defining available preset colors:

```typescript
// src/presentation/admin/components/PageContentEditor/ColorPicker.tsx

export const PRESET_COLORS: readonly string[] = [
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
] as const;
```

## Backward Compatibility

### Legacy ThemeColorMark Content

Existing content using the old `ThemeColorMark` will continue to work with fallback CSS:

```css
/* Fallback for legacy content */
.theme-color-text,
span[data-theme-color] {
  color: inherit;
}
```

This ensures old content remains readable (inherits parent color) while new content uses explicit inline colors.

## Security Considerations

| Concern                 | Mitigation                                             |
| ----------------------- | ------------------------------------------------------ |
| XSS via style attribute | DOMPurify sanitization with allowed `style` attribute  |
| CSS injection           | Tiptap only outputs `color` property; no arbitrary CSS |
| Hex validation          | Client-side validation before applying color           |

## No Database Changes

This feature requires no database schema changes. All color data is stored within the existing `content` field of PageContent documents.
