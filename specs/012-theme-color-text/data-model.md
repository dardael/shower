# Data Model: Theme Color Text Formatting

**Feature**: 012-theme-color-text  
**Date**: 2025-12-02

## Overview

This feature does not introduce new entities or database changes. It extends existing page content with inline HTML markup that is styled via CSS.

## Content Structure Changes

### Page Content (Existing)

Page content is stored as an HTML string in the existing Page entity. This feature adds a new inline element type within that HTML content.

**Before** (plain text):

```html
<p>This is important text.</p>
```

**After** (with theme color applied):

```html
<p>
  This is
  <span class="theme-color-text" data-theme-color="true">important</span> text.
</p>
```

### HTML Mark Structure

| Attribute          | Value              | Purpose                             |
| ------------------ | ------------------ | ----------------------------------- |
| `class`            | `theme-color-text` | CSS styling hook                    |
| `data-theme-color` | `true`             | Semantic identification for parsing |

## Entity Impact

### Page Entity (No Changes)

The existing Page entity stores content as an HTML string. No schema changes required.

```typescript
// Existing structure - unchanged
interface Page {
  id: string;
  title: string;
  slug: string;
  content: string; // HTML string - now may contain theme-color-text spans
  // ... other fields
}
```

### ThemeColor Value Object (No Changes)

The existing ThemeColor value object and related settings infrastructure remain unchanged. The CSS styling references the theme color via Chakra CSS variables that are already configured.

## CSS Variable Dependencies

The feature depends on existing Chakra UI CSS variables:

| Variable                              | Source                              | Purpose             |
| ------------------------------------- | ----------------------------------- | ------------------- |
| `--chakra-colors-color-palette-solid` | theme.ts → globalCss → colorPalette | Primary theme color |

These variables are already set up in `src/presentation/shared/theme.ts` via the `createDynamicThemeConfig` function.

## Migration

**No migration required.** Existing content without theme-colored text continues to work unchanged. The new mark is purely additive.

## Validation Rules

| Rule                             | Description                                                                |
| -------------------------------- | -------------------------------------------------------------------------- |
| Mark can wrap any inline content | Theme color can be applied to text within paragraphs, headings, list items |
| Mark combines with other marks   | Can coexist with bold, italic, links (standard Tiptap behavior)            |
| Mark is optional                 | Content without theme color marks renders normally                         |
