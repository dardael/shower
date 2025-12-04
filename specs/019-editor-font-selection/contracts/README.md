# API Contracts: Editor Font Selection

**Feature**: 019-editor-font-selection  
**Date**: 2025-12-04

## No New API Endpoints Required

This feature does not introduce new API endpoints. Font styling is embedded as inline CSS within the HTML content stored by the existing Page Content API.

## Existing Endpoints Used

### POST /api/settings/pages

Updates page content including font-styled HTML.

**Request Body** (unchanged):

```json
{
  "slug": "about",
  "content": "<p>Normal text <span style=\"font-family: 'Playfair Display'\">styled text</span></p>"
}
```

**Response** (unchanged):

```json
{
  "message": "Page content saved successfully",
  "page": {
    "slug": "about",
    "content": "<p>Normal text <span style=\"font-family: 'Playfair Display'\">styled text</span></p>"
  }
}
```

### GET /api/settings/pages/:slug

Retrieves page content including any font styling.

**Response** (unchanged):

```json
{
  "slug": "about",
  "content": "<p>Normal text <span style=\"font-family: 'Playfair Display'\">styled text</span></p>"
}
```

## HTML Content Format

Font styling is stored as inline CSS using the `font-family` property:

```html
<!-- Single font applied to text -->
<span style="font-family: 'Inter'">Inter text</span>

<!-- Multiple styles combined (font + color) -->
<span style="font-family: 'Playfair Display'; color: #3B82F6"
  >Blue serif text</span
>

<!-- Font applied to heading content -->
<h2>
  Heading with <span style="font-family: 'Dancing Script'">styled portion</span>
</h2>
```

## Font Names in Style Attribute

The font names used in the `font-family` style correspond to the `name` field from `AVAILABLE_FONTS`:

| Font Name        | CSS Value                         |
| ---------------- | --------------------------------- |
| Inter            | `font-family: 'Inter'`            |
| Playfair Display | `font-family: 'Playfair Display'` |
| Dancing Script   | `font-family: 'Dancing Script'`   |
| Fira Code        | `font-family: 'Fira Code'`        |

Note: The Tiptap FontFamily extension stores just the font name (e.g., `'Inter'`) not the full CSS font stack (e.g., `'Inter', sans-serif`). The fallback fonts are applied at render time via CSS.
