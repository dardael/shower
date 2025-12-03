# Data Model: Editor Image Upload

**Feature**: 015-editor-image-upload  
**Date**: 2025-12-03

## Overview

This feature does not introduce new persistent entities. Images are stored as files on the filesystem and referenced by URL within page content HTML. No database schema changes are required.

---

## Value Objects

### PageContentImageMetadata

Represents metadata for an uploaded page content image. Used in API responses and internal processing, not persisted to database.

| Field        | Type   | Description                                | Validation                |
| ------------ | ------ | ------------------------------------------ | ------------------------- |
| filename     | string | Generated unique filename                  | Required, non-empty       |
| originalName | string | Original upload filename                   | Required, non-empty       |
| size         | number | File size in bytes                         | Required, > 0, <= 5MB     |
| format       | enum   | File extension (png, jpg, jpeg, gif, webp) | Required, allowed formats |
| mimeType     | enum   | MIME type                                  | Required, allowed types   |
| uploadedAt   | Date   | Upload timestamp                           | Required                  |

**Allowed Formats**: `png`, `jpg`, `jpeg`, `gif`, `webp`

**Allowed MIME Types**: `image/png`, `image/jpeg`, `image/gif`, `image/webp`

---

## File Storage Structure

```
public/
└── page-content-images/
    ├── page-content-1733257200000-a1b2c3.png
    ├── page-content-1733257200001-d4e5f6.jpg
    └── ...
```

### Filename Pattern

`{prefix}-{timestamp}-{random}.{extension}`

- **prefix**: `page-content`
- **timestamp**: Unix timestamp in milliseconds
- **random**: 6-character alphanumeric string
- **extension**: Original file extension

---

## Existing Entity Impact

### PageContent (unchanged)

The existing `PageContent` entity stores HTML content that includes `<img>` tags with `src` attributes pointing to uploaded image URLs.

```html
<!-- Example stored content -->
<p>Welcome to our page</p>
<img
  src="http://localhost:3000/api/page-content-images/page-content-1733257200000-a1b2c3.png"
  class="tiptap-image"
/>
<p>More content here</p>
```

No schema changes required. Images are embedded as HTML markup.

---

## Configuration Constants

### Upload Configuration

| Constant        | Value                                                  | Description                    |
| --------------- | ------------------------------------------------------ | ------------------------------ |
| MAX_SIZE_BYTES  | 5,242,880                                              | 5MB maximum file size          |
| ALLOWED_TYPES   | ['image/png', 'image/jpeg', 'image/gif', 'image/webp'] | Accepted MIME types            |
| FILENAME_PREFIX | 'page-content'                                         | Prefix for generated filenames |
| STORAGE_DIR     | 'public/page-content-images'                           | Storage directory path         |
| API_PATH        | '/api/page-content-images'                             | API endpoint path              |

---

## State Transitions

### Image Upload Flow

```
[No Image]
    ↓ (user selects/drops/pastes file)
[Validating]
    ↓ (validation passes)
[Uploading]
    ↓ (upload completes)
[Inserted] → Image visible in editor
    ↓ (content saved)
[Persisted] → Image URL in page content HTML
```

### Error States

- **Validation Failed**: Invalid file type or size → Error toast, return to [No Image]
- **Upload Failed**: Network/server error → Error toast, return to [No Image]

---

## Relationships

```
┌─────────────────────┐     contains     ┌─────────────────────┐
│    PageContent      │ ───────────────→ │   Image References  │
│  (MongoDB entity)   │     (HTML)       │   (URL strings)     │
└─────────────────────┘                  └─────────────────────┘
                                                   │
                                                   │ points to
                                                   ↓
                                         ┌─────────────────────┐
                                         │   Image Files       │
                                         │   (filesystem)      │
                                         └─────────────────────┘
```

---

## Data Integrity

### Orphaned Images

Per spec, orphaned images (files no longer referenced in content) are not automatically cleaned up. This is explicitly out of scope.

### Image Availability

- Images must remain accessible at their URL as long as the file exists
- Deleting an image file would break references in page content
- No cascade delete mechanism required for this feature
