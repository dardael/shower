# API Contracts: Image Full Width Button

**Feature**: 023-image-full-width
**Date**: 2025-12-04

## No New API Endpoints

This feature does not require any new API endpoints or modifications to existing ones.

**Rationale**:

- Page content is stored as HTML string in the existing `pageContent.content` field
- The `data-full-width="true"` attribute is embedded in the HTML content
- Existing `/api/pages/[id]/content` endpoint handles saving/loading unchanged
- No new data entities requiring dedicated API operations

## Existing Endpoints Used (Unchanged)

| Method | Endpoint                  | Purpose                                        |
| ------ | ------------------------- | ---------------------------------------------- |
| GET    | `/api/pages/[id]/content` | Load page content (includes full-width images) |
| PUT    | `/api/pages/[id]/content` | Save page content (includes full-width images) |

The full-width attribute is transparently persisted as part of the HTML content.
