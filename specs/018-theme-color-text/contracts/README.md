# API Contracts: Inline Text Color in Rich Text Editor

**Feature**: 018-theme-color-text  
**Date**: 2025-12-04

## No API Changes Required

This feature does not require any API changes. The text color is stored inline within the HTML content of the existing `PageContent` entity.

### Existing Endpoints (Unchanged)

| Endpoint                  | Method | Description                                           |
| ------------------------- | ------ | ----------------------------------------------------- |
| `/api/pages/[menuItemId]` | GET    | Retrieve page content (includes colored text in HTML) |
| `/api/pages/[menuItemId]` | PUT    | Update page content (accepts colored text in HTML)    |

### Data Flow

1. **Editor → API**: TiptapEditor generates HTML with `<span style="color: #RRGGBB">` tags
2. **API → Database**: HTML stored as-is in PageContent.content field
3. **Database → API**: HTML retrieved as-is
4. **API → Public**: HTML rendered with DOMPurify sanitization (style attribute allowed)

### Content Example

```json
{
  "menuItemId": "abc123",
  "content": "<p>Normal text <span style=\"color: #3B82F6\">blue text</span> more text</p>"
}
```

No schema changes, no new endpoints, no contract modifications required.
