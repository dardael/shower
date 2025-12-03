# Data Model: Editor Image Resize and Move

**Feature**: 016-editor-image-resize  
**Date**: 2025-12-03

## Overview

This feature does not introduce new entities or modify the database schema. Image dimensions are stored as inline HTML styles within the existing `PageContentBody` value object.

## Existing Entities (No Changes)

### PageContent

**Location**: `src/domain/pages/entities/PageContent.ts`

The `PageContent` entity stores page HTML content via its `PageContentBody` value object. No modifications needed.

### PageContentBody

**Location**: `src/domain/pages/value-objects/PageContentBody.ts`

The `PageContentBody` value object stores the HTML string. Image dimensions will be embedded as inline styles within `<img>` tags.

**Example Content Before**:

```html
<p>Welcome to our page!</p>
<img src="/api/page-content-images/1234567890-abc.jpg" class="tiptap-image" />
<p>More content here.</p>
```

**Example Content After (with resize)**:

```html
<p>Welcome to our page!</p>
<img
  src="/api/page-content-images/1234567890-abc.jpg"
  class="tiptap-image"
  style="width: 400px; height: 300px"
/>
<p>More content here.</p>
```

## Image Dimension Attributes

Image dimensions are stored as **inline styles** on `<img>` elements, not as separate database fields.

| Attribute | Type            | Description                    |
| --------- | --------------- | ------------------------------ |
| width     | CSS pixel value | Display width (e.g., "400px")  |
| height    | CSS pixel value | Display height (e.g., "300px") |

**Storage Format**: `style="width: Npx; height: Mpx"`

## Validation Rules

| Rule           | Constraint         | Enforced By                 |
| -------------- | ------------------ | --------------------------- |
| Minimum width  | 50px               | Tiptap resize configuration |
| Minimum height | 50px               | Tiptap resize configuration |
| Maximum width  | Content area width | Tiptap resize configuration |
| Aspect ratio   | Preserved          | Tiptap resize configuration |

## Data Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Admin User    │────▶│  TiptapEditor   │────▶│  PageContent    │
│  resizes image  │     │ (adds inline    │     │ (HTML stored    │
│                 │     │  style attrs)   │     │  in MongoDB)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                         │
                                                         ▼
                                                ┌─────────────────┐
                                                │ PublicPageContent│
                                                │ (renders HTML    │
                                                │  with styles)    │
                                                └─────────────────┘
```

## Impact Analysis

| Component                    | Impact   | Notes             |
| ---------------------------- | -------- | ----------------- |
| PageContent entity           | None     | No changes        |
| PageContentBody value object | None     | No changes        |
| MongoDB schema               | None     | No changes        |
| API endpoints                | None     | No changes        |
| TiptapEditor                 | Modified | Add resize config |
| CSS styles                   | Modified | Add handle styles |

## Conclusion

No database or domain model changes required. This is a presentation-layer-only feature where dimensions are stored as part of the HTML content string.
