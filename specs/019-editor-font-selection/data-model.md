# Data Model: Editor Font Selection

**Feature**: 019-editor-font-selection  
**Date**: 2025-12-04

## Overview

This feature does not introduce new entities or database schema changes. Font styling is stored as inline CSS within the existing HTML content field of the PageContent entity.

## Existing Entities (No Changes)

### PageContent

The existing PageContent entity stores HTML content that will now include font-family inline styles.

**Location**: `src/domain/pages/entities/PageContent.ts`

**Relevant Fields**:
| Field | Type | Description |
| ------- | ------ | ------------------------------------------------------ |
| content | string | HTML content including font styling via inline styles |

**HTML Content Format (with font styling)**:

```html
<p>
  Normal text
  <span style="font-family: 'Playfair Display'">styled with serif font</span>
</p>
<h2>
  Heading with <span style="font-family: 'Dancing Script'">fancy text</span>
</h2>
```

## Reused Domain Constants

### AVAILABLE_FONTS

**Location**: `src/domain/settings/constants/AvailableFonts.ts`

This constant is reused from the website font configuration feature. Contains 31 curated Google Fonts.

**Interface**:

```typescript
interface FontMetadata {
  name: string; // Display name: "Inter", "Playfair Display"
  family: string; // CSS value: "'Inter', sans-serif"
  category: FontCategory; // "sans-serif" | "serif" | "display" | "handwriting" | "monospace"
  weights: number[]; // [400, 500, 600, 700]
}
```

**Usage in Feature**:

- Font selector dropdown displays fonts using `AVAILABLE_FONTS`
- Font categories used to group fonts in UI
- Font family CSS value used when applying font via Tiptap

## Data Flow

### 1. Applying Font in Editor

```
User selects font in FontPicker
    ↓
Tiptap FontFamily extension applies mark
    ↓
HTML updated: <span style="font-family: 'Font Name'">text</span>
    ↓
onChange callback fires with new HTML
    ↓
PageContent state updated
```

### 2. Saving Page Content

```
User clicks Save
    ↓
PageContent (with font-styled HTML) sent to API
    ↓
POST /api/settings/pages
    ↓
MongoDB stores HTML string (including font styles)
```

### 3. Loading Saved Content in Editor

```
GET /api/settings/pages/:id
    ↓
HTML content with font styles returned
    ↓
Tiptap editor parses HTML
    ↓
TextStyle marks with font-family attributes restored
    ↓
Editor displays styled text
```

### 4. Rendering on Public Page

```
GET /api/settings/pages/:id (or server-side fetch)
    ↓
PublicPageContent receives HTML
    ↓
Extract unique font names from style attributes
    ↓
Load Google Fonts via <link> elements
    ↓
DOMPurify sanitizes HTML (preserves font-family styles)
    ↓
Render styled content
```

## Font Extraction Utility

A utility function to extract font names from HTML content for public page rendering:

```typescript
/**
 * Extracts unique font family names from HTML content
 * @param html - HTML content with inline font-family styles
 * @returns Array of unique font names
 */
function extractFontsFromHtml(html: string): string[] {
  const fontFamilyRegex = /font-family:\s*'([^']+)'/g;
  const fonts = new Set<string>();
  let match;
  while ((match = fontFamilyRegex.exec(html)) !== null) {
    fonts.add(match[1]);
  }
  return Array.from(fonts);
}
```

## Validation

### Font Name Validation

Fonts applied via the editor are validated against `AVAILABLE_FONTS`:

- Only fonts from the predefined list can be selected in the UI
- No API validation needed (font styling is embedded in HTML)

### HTML Sanitization

PublicPageContent uses DOMPurify which:

- Allows `style` attribute on `<span>` elements
- Preserves `font-family` CSS property
- Removes potentially dangerous attributes/elements

## No Schema Migration Required

Since font styling is stored as inline CSS within the existing `content` field, no database migration is needed. The feature is fully backward compatible:

- Existing content without font styling continues to work
- New content with font styling is stored in the same field
