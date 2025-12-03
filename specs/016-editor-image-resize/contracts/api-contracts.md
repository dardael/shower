# API Contracts: Editor Image Resize and Move

**Feature**: 016-editor-image-resize  
**Date**: 2025-12-03

## Overview

This feature does not introduce new API endpoints or modify existing ones. Image resize and move operations are handled entirely in the frontend (Tiptap editor), with dimensions stored as inline HTML styles within the existing page content.

## Existing Endpoints (No Changes)

### PUT /api/settings/pages/{menuItemId}

The existing endpoint for saving page content continues to work unchanged. The request body contains HTML content with embedded image dimensions.

**Request Body** (unchanged):

```json
{
  "content": "<p>Text</p><img src=\"...\" style=\"width: 400px; height: 300px\">..."
}
```

### GET /api/settings/pages/{menuItemId}

The existing endpoint returns page content with embedded dimensions. No changes needed.

**Response Body** (unchanged):

```json
{
  "content": "<p>Text</p><img src=\"...\" style=\"width: 400px; height: 300px\">..."
}
```

## HTML Contract

Images with resize dimensions follow this HTML structure:

```html
<img
  src="/api/page-content-images/{filename}"
  class="tiptap-image"
  style="width: {N}px; height: {M}px"
/>
```

| Attribute | Required | Description                      |
| --------- | -------- | -------------------------------- |
| src       | Yes      | Image URL                        |
| class     | Yes      | "tiptap-image" for styling       |
| style     | Optional | Inline width/height when resized |

## Conclusion

No new API contracts. This is a frontend-only feature that leverages existing save/load mechanisms.
