# API Contracts: Overlay Color Configuration

**Feature**: 024-overlay-color-config
**Date**: 2025-12-04

## Overview

This feature does **not** introduce new API endpoints. The overlay background color and opacity are stored as part of the page content HTML and persist through the existing page content API.

## Existing Endpoints Used

### PUT /api/pages/[slug]/content

The overlay configuration is embedded in the HTML content stored via this endpoint.

**Request Body** (unchanged structure):

```json
{
  "content": "<div class=\"image-with-overlay\" data-overlay-bg-color=\"#000000\" data-overlay-bg-opacity=\"50\">...</div>"
}
```

The new `data-overlay-bg-color` and `data-overlay-bg-opacity` attributes are added to the HTML content by the Tiptap editor and persisted as part of the content string.

## No New Endpoints Required

The feature leverages:

1. Tiptap's built-in serialization for HTML content
2. Existing page content save/load mechanisms
3. Client-side rendering for both editor and public views

All overlay configuration is handled entirely in the frontend presentation layer.
