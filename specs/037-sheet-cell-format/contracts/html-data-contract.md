# Contracts: Sheet Cell Formatting

**Feature**: 037-sheet-cell-format
**Date**: 2025-12-17

## Overview

This feature does not introduce new API endpoints. All data is stored within the existing page content HTML structure and persisted through the existing page content API.

## No New Endpoints Required

The sheet cell formatting feature extends the existing Tiptap editor with custom HTML attributes. The data flow uses existing infrastructure:

1. **Save**: Page content (including formatted tables) saved via existing `PUT /api/pages/[id]/content` endpoint
2. **Load**: Page content retrieved via existing `GET /api/pages/[id]/content` endpoint
3. **Public View**: Content rendered from existing page data fetching

## HTML Data Contract

The feature adds the following HTML data attributes to table elements:

### Table Element

```html
<table
  class="tiptap-table"
  data-border-thickness="[0-10]"
  style="--table-border-width: [0-10]px"
></table>
```

| Attribute               | Type    | Range | Default                     | Description                   |
| ----------------------- | ------- | ----- | --------------------------- | ----------------------------- |
| `data-border-thickness` | integer | 0-10  | 1                           | Border thickness in pixels    |
| `style`                 | string  | CSS   | `--table-border-width: 1px` | CSS variable for border width |

### Cell Elements (td, th)

```html
<td data-vertical-align="[top|center|bottom]"></td>
<th data-vertical-align="[top|center|bottom]"></th>
```

| Attribute             | Type | Values                    | Default | Description                        |
| --------------------- | ---- | ------------------------- | ------- | ---------------------------------- |
| `data-vertical-align` | enum | `top`, `center`, `bottom` | `top`   | Vertical alignment of cell content |

## Existing API Used

### Save Page Content

**Endpoint**: `PUT /api/pages/[slug]/content`

No changes to request/response schema. The HTML content string now includes the new data attributes.

**Example content with formatting**:

```json
{
  "content": "<table class=\"tiptap-table\" data-border-thickness=\"2\" style=\"--table-border-width: 2px\"><tbody><tr><td data-vertical-align=\"center\">Centered content</td><td data-vertical-align=\"bottom\">Bottom aligned</td></tr></tbody></table>"
}
```

### Get Page Content

**Endpoint**: `GET /api/pages/[slug]/content`

No changes to response schema. Returns HTML with new data attributes if present.

## Backward Compatibility

Existing content without the new attributes will:

- Parse successfully (missing attributes use defaults)
- Render with default styling (1px border, top alignment)
- Gain attributes when edited and saved
