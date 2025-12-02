# API Contracts: Text Alignment in Rich Text Editor

**Feature**: 013-text-align-editor  
**Date**: 2025-12-02

## Overview

This feature requires **no API changes**. Text alignment is stored within the existing HTML content field and uses the existing page content API endpoints.

## Existing Endpoints (No Changes)

### Save Page Content

**POST** `/api/settings/pages` (create new)  
**PATCH** `/api/settings/pages/{menuItemId}` (update existing)

**Request Body**:

```json
{
  "menuItemId": "string",
  "content": "<p style=\"text-align: center\">Centered text</p>"
}
```

**Response**: `200 OK` or `201 Created`

### Load Page Content

**GET** `/api/settings/pages/{menuItemId}`

**Response**:

```json
{
  "id": "string",
  "menuItemId": "string",
  "content": "<p style=\"text-align: center\">Centered text</p>"
}
```

## Content Format

The `content` field contains HTML with inline styles for alignment:

```html
<!-- Before alignment feature -->
<p>Regular paragraph</p>

<!-- After alignment feature -->
<p>Left aligned (default)</p>
<p style="text-align: center">Centered paragraph</p>
<p style="text-align: right">Right aligned paragraph</p>
<p style="text-align: justify">Justified paragraph</p>
<h1 style="text-align: center">Centered heading</h1>
```

## Why No API Changes?

1. **Transparent Storage**: Alignment is embedded in HTML, not a separate field
2. **Existing Validation**: Content field validation (max 100,000 chars) still applies
3. **Backward Compatible**: Existing content without alignment works unchanged
4. **No New Operations**: No need to query or filter by alignment

## Security Consideration

The public-facing page uses DOMPurify to sanitize content. The `style` attribute must be added to the allowed attributes list to render alignment on public pages.

```typescript
ALLOWED_ATTR: [...existing, 'style'];
```

DOMPurify automatically sanitizes dangerous CSS properties while allowing safe ones like `text-align`.
