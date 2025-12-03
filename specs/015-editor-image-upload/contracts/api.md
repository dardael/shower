# API Contracts: Editor Image Upload

**Feature**: 015-editor-image-upload  
**Date**: 2025-12-03

## Endpoints Overview

| Method | Endpoint                            | Description             | Auth Required |
| ------ | ----------------------------------- | ----------------------- | ------------- |
| POST   | /api/page-content-images            | Upload a new image      | Yes (Admin)   |
| GET    | /api/page-content-images/[filename] | Serve an uploaded image | No (Public)   |

---

## POST /api/page-content-images

Upload an image file for use in page content.

### Request

**Content-Type**: `multipart/form-data`

**Headers**:
| Header | Value | Required |
|--------|-------|----------|
| Cookie | Session cookie | Yes |

**Body**:
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| image | File | Image file to upload | Required, max 5MB, allowed types: image/png, image/jpeg, image/gif, image/webp |

### Response

**Success (201 Created)**:

```json
{
  "message": "Image uploaded successfully",
  "image": {
    "url": "http://localhost:3000/api/page-content-images/page-content-1733257200000-a1b2c3.png",
    "filename": "page-content-1733257200000-a1b2c3.png",
    "originalName": "my-photo.png",
    "size": 245760,
    "format": "png",
    "mimeType": "image/png",
    "uploadedAt": "2025-12-03T18:00:00.000Z"
  }
}
```

**Error (400 Bad Request)** - Validation errors:

```json
{
  "error": "Invalid file type. Only PNG, JPG, GIF, and WebP files are allowed."
}
```

```json
{
  "error": "File size must be less than 5MB."
}
```

```json
{
  "error": "No image file provided."
}
```

**Error (401 Unauthorized)** - Not authenticated:

```json
{
  "error": "Unauthorized"
}
```

**Error (500 Internal Server Error)** - Server failure:

```json
{
  "error": "Failed to upload image. Please try again."
}
```

### Example Request

```bash
curl -X POST http://localhost:3000/api/page-content-images \
  -H "Cookie: session=..." \
  -F "image=@/path/to/photo.png"
```

---

## GET /api/page-content-images/[filename]

Retrieve an uploaded image by filename.

### Request

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| filename | string | The filename of the uploaded image |

### Response

**Success (200 OK)**:

- **Content-Type**: `image/png`, `image/jpeg`, `image/gif`, or `image/webp` (based on file)
- **Cache-Control**: `public, max-age=31536000, immutable`
- **Body**: Binary image data

**Error (400 Bad Request)** - Invalid filename:

```json
{
  "error": "Invalid filename"
}
```

**Error (404 Not Found)** - File doesn't exist:

```json
{
  "error": "Image not found"
}
```

### Example Request

```bash
curl http://localhost:3000/api/page-content-images/page-content-1733257200000-a1b2c3.png
```

---

## TypeScript Interfaces

### Request/Response Types

```typescript
// Upload request (FormData)
interface UploadPageContentImageRequest {
  image: File;
}

// Upload response
interface UploadPageContentImageResponse {
  message: string;
  image: PageContentImageMetadata;
}

// Image metadata
interface PageContentImageMetadata {
  url: string;
  filename: string;
  originalName: string;
  size: number;
  format: 'png' | 'jpg' | 'jpeg' | 'gif' | 'webp';
  mimeType: 'image/png' | 'image/jpeg' | 'image/gif' | 'image/webp';
  uploadedAt: string;
}

// Error response
interface ErrorResponse {
  error: string;
}
```

---

## Client Usage

### Upload Image Function

```typescript
async function uploadPageContentImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('/api/page-content-images', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  const data = await response.json();
  return data.image.url;
}
```

---

## Validation Rules

### File Type Validation

- Accept only: `image/png`, `image/jpeg`, `image/gif`, `image/webp`
- Validate both on client (for UX) and server (for security)

### File Size Validation

- Maximum: 5,242,880 bytes (5MB)
- Validate both on client (for UX) and server (for security)

### Filename Sanitization

- Remove path traversal characters
- Use generated filename, not original
- Pattern: `page-content-{timestamp}-{random}.{ext}`

---

## Security Considerations

1. **Authentication**: Upload endpoint requires admin session
2. **File Type**: Server-side MIME type validation
3. **File Size**: Server-side size limit enforcement
4. **Path Traversal**: Sanitize and validate filenames before serving
5. **Directory Access**: Only serve files from designated directory
