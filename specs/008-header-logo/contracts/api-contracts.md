# API Contracts: Header Logo Configuration

**Feature**: 008-header-logo  
**Date**: 2025-11-29

## Endpoints Overview

| Method | Endpoint           | Auth     | Description                 |
| ------ | ------------------ | -------- | --------------------------- |
| GET    | /api/settings/logo | Required | Get current logo (admin)    |
| POST   | /api/settings/logo | Required | Upload/replace logo         |
| DELETE | /api/settings/logo | Required | Remove logo                 |
| GET    | /api/public/logo   | None     | Get logo for public display |

---

## Admin Endpoints

### GET /api/settings/logo

Retrieves the current header logo configuration for admin display.

**Authentication**: Required (withApi wrapper)

**Request**: None

**Response 200 (Logo exists)**:

```json
{
  "logo": {
    "url": "http://localhost:3000/api/icons/logo-1732892400000-a3b2c1.png",
    "filename": "logo-1732892400000-a3b2c1.png",
    "originalName": "company-logo.png",
    "size": 45678,
    "format": "png",
    "mimeType": "image/png",
    "uploadedAt": "2025-11-29T12:00:00.000Z"
  }
}
```

**Response 200 (No logo)**:

```json
{
  "logo": null
}
```

**Response 500 (Error)**:

```json
{
  "logo": null
}
```

---

### POST /api/settings/logo

Uploads a new header logo or replaces the existing one.

**Authentication**: Required (withApi wrapper)

**Request**:

- Content-Type: multipart/form-data
- Body: FormData with `logo` field containing the image file

**Validation**:
| Field | Rule | Error |
| ----- | ---- | ----- |
| logo | Required | "No file provided" |
| logo.type | PNG, JPG, SVG, GIF, WebP | "Invalid file type. Only PNG, JPG, SVG, GIF, and WebP formats are allowed." |
| logo.size | <= 2MB | "File size too large. Maximum size is 2MB." |

**Response 200 (Success)**:

```json
{
  "message": "Header logo updated successfully",
  "logo": {
    "url": "http://localhost:3000/api/icons/logo-1732892400000-a3b2c1.png",
    "filename": "logo-1732892400000-a3b2c1.png",
    "originalName": "company-logo.png",
    "size": 45678,
    "format": "png",
    "mimeType": "image/png",
    "uploadedAt": "2025-11-29T12:00:00.000Z"
  }
}
```

**Response 400 (Validation Error)**:

```json
{
  "error": "Invalid file type. Only PNG, JPG, SVG, GIF, and WebP formats are allowed."
}
```

**Response 401 (Unauthorized)**:

```json
{
  "error": "Unauthorized"
}
```

**Response 500 (Server Error)**:

```json
{
  "error": "Failed to update header logo. Please try again later."
}
```

---

### DELETE /api/settings/logo

Removes the current header logo.

**Authentication**: Required (withApi wrapper)

**Request**: None

**Response 200 (Success)**:

```json
{
  "message": "Header logo removed successfully"
}
```

**Response 401 (Unauthorized)**:

```json
{
  "error": "Unauthorized"
}
```

**Response 500 (Server Error)**:

```json
{
  "error": "Failed to remove header logo. Please try again later."
}
```

---

## Public Endpoint

### GET /api/public/logo

Retrieves the header logo for public display. No authentication required.

**Authentication**: None

**Request**: None

**Response 200 (Logo exists)**:

```json
{
  "success": true,
  "data": {
    "url": "http://localhost:3000/api/icons/logo-1732892400000-a3b2c1.png",
    "filename": "logo-1732892400000-a3b2c1.png",
    "format": "png"
  }
}
```

**Response 200 (No logo)**:

```json
{
  "success": true,
  "data": null
}
```

**Response 500 (Error)**:

```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## TypeScript Types

### API Types

```typescript
// Admin logo metadata type (full metadata for management)
interface AdminLogoMetadata {
  url: string;
  filename: string;
  originalName: string;
  size: number;
  format: string;
  mimeType: string;
  uploadedAt: string;
}

// Public logo metadata type (minimal data for display)
interface PublicLogoMetadata {
  url: string;
  filename: string;
  format: string;
}

// Admin endpoint responses
interface GetLogoResponse {
  logo: AdminLogoMetadata | null;
}

interface UploadLogoResponse {
  message: string;
  logo: AdminLogoMetadata;
}

interface DeleteLogoResponse {
  message: string;
}

// Public endpoint response
interface PublicLogoResponse {
  success: boolean;
  data: PublicLogoMetadata | null;
  error?: string;
}
```

---

## Error Handling

### Client-Side Error Handling

| Status                | Action                                   |
| --------------------- | ---------------------------------------- |
| 200 with `logo: null` | Display upload area (no logo configured) |
| 200 with logo data    | Display logo preview                     |
| 400                   | Show validation error message to user    |
| 401                   | Redirect to login                        |
| 500                   | Show generic error, allow retry          |
| Network error         | Show connection error, allow retry       |

### Public Site Error Handling

| Status                | Action                                            |
| --------------------- | ------------------------------------------------- |
| 200 with `data: null` | Render header without logo                        |
| 200 with logo data    | Render logo in header                             |
| 500                   | Render header without logo (graceful degradation) |
| Network error         | Render header without logo (graceful degradation) |
