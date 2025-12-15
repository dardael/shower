# API Contracts: Custom Loader Configuration

**Feature**: 034-custom-loader  
**Date**: 2025-12-15

## Endpoints Overview

| Endpoint                  | Method | Auth   | Purpose                           |
| ------------------------- | ------ | ------ | --------------------------------- |
| `/api/settings/loader`    | GET    | Admin  | Get current loader configuration  |
| `/api/settings/loader`    | PUT    | Admin  | Update loader configuration       |
| `/api/settings/loader`    | DELETE | Admin  | Remove custom loader              |
| `/api/public/loader`      | GET    | Public | Get loader URL for public display |
| `/api/loaders/[filename]` | GET    | Public | Serve loader file                 |

---

## Admin Endpoints

### GET /api/settings/loader

Get current custom loader configuration.

**Response 200**:

```json
{
  "loader": {
    "url": "/api/loaders/loader-1734567890123-a1b2c3.mp4",
    "metadata": {
      "type": "video",
      "filename": "my-loader.mp4",
      "mimeType": "video/mp4",
      "size": 524288,
      "uploadedAt": "2025-12-15T10:30:00.000Z"
    }
  }
}
```

**Response 200 (no loader configured)**:

```json
{
  "loader": null
}
```

**Response 401**: Unauthorized
**Response 500**: Server error

---

### PUT /api/settings/loader

Upload and configure a new custom loader. Uses `multipart/form-data`.

**Request**:

- Content-Type: `multipart/form-data`
- Body: `file` (required) - The loader file (GIF, MP4, or WebM)

**Response 200**:

```json
{
  "loader": {
    "url": "/api/loaders/loader-1734567890123-a1b2c3.mp4",
    "metadata": {
      "type": "video",
      "filename": "my-loader.mp4",
      "mimeType": "video/mp4",
      "size": 524288,
      "uploadedAt": "2025-12-15T10:30:00.000Z"
    }
  }
}
```

**Response 400**:

```json
{
  "error": "Invalid file type. Only GIF, MP4, and WebM files are allowed."
}
```

**Response 400**:

```json
{
  "error": "File size must be less than 10MB."
}
```

**Response 401**: Unauthorized
**Response 500**: Server error

---

### DELETE /api/settings/loader

Remove the custom loader and revert to default spinner.

**Response 200**:

```json
{
  "loader": null
}
```

**Response 401**: Unauthorized
**Response 500**: Server error

---

## Public Endpoints

### GET /api/public/loader

Get loader configuration for public display.

**Response 200**:

```json
{
  "loader": {
    "type": "video",
    "url": "/api/loaders/loader-1734567890123-a1b2c3.mp4"
  }
}
```

**Response 200 (no loader configured)**:

```json
{
  "loader": null
}
```

**Response 500**: Server error

---

### GET /api/loaders/[filename]

Serve the loader file with appropriate caching headers.

**Response 200**:

- Content-Type: `image/gif`, `video/mp4`, or `video/webm`
- Cache-Control: `public, max-age=31536000, immutable`
- Body: Binary file content

**Response 404**:

```json
{
  "error": "Loader file not found"
}
```

**Response 500**: Server error

---

## Type Definitions

```typescript
// Response types
interface CustomLoaderResponse {
  loader: CustomLoaderConfig | null;
}

interface CustomLoaderConfig {
  url: string;
  metadata: CustomLoaderMetadata;
}

interface CustomLoaderMetadata {
  type: 'gif' | 'video';
  filename: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

// Public response (simplified)
interface PublicLoaderResponse {
  loader: {
    type: 'gif' | 'video';
    url: string;
  } | null;
}
```
