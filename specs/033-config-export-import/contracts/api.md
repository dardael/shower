# API Contracts: Configuration Export/Import

**Feature**: 033-config-export-import | **Date**: 2025-12-14

## Overview

RESTful API endpoints for configuration export and import. All endpoints require admin authentication via existing `withApi` wrapper.

---

## Endpoints

### GET /api/config/export

**Description**: Generate and download a complete configuration export package.

**Authentication**: Required (admin only)

**Request**: No body required

**Response**:

- **200 OK**: ZIP file download
  - Content-Type: `application/zip`
  - Content-Disposition: `attachment; filename="export-{timestamp}.zip"`
  - Body: Binary ZIP stream

- **401 Unauthorized**:

  ```json
  { "error": "Authentication required" }
  ```

- **500 Internal Server Error**:
  ```json
  { "error": "Export failed: {reason}" }
  ```

---

### POST /api/config/import/preview

**Description**: Upload and validate an export package, returning a preview of what will be imported.

**Authentication**: Required (admin only)

**Request**:

- Content-Type: `multipart/form-data`
- Body:
  - `file`: ZIP file (required)

**Response**:

- **200 OK**:

  ```json
  {
    "valid": true,
    "manifest": {
      "schemaVersion": "1.0",
      "exportDate": "2025-12-14T10:30:00.000Z",
      "sourceIdentifier": "test-environment",
      "summary": {
        "menuItemCount": 5,
        "pageContentCount": 5,
        "settingsCount": 8,
        "socialNetworkCount": 3,
        "imageCount": 12,
        "totalSizeBytes": 2048576
      }
    },
    "warnings": ["This will replace all existing configuration"]
  }
  ```

- **400 Bad Request** (invalid package):

  ```json
  {
    "valid": false,
    "error": "Invalid package: {reason}",
    "details": {
      "missingFiles": ["data/menu-items.json"],
      "corruptedFiles": []
    }
  }
  ```

- **400 Bad Request** (version mismatch):

  ```json
  {
    "valid": false,
    "error": "Version incompatible",
    "details": {
      "packageVersion": "2.0",
      "currentVersion": "1.0",
      "suggestion": "Please export from a compatible application version"
    }
  }
  ```

- **401 Unauthorized**:
  ```json
  { "error": "Authentication required" }
  ```

---

### POST /api/config/import

**Description**: Apply a previously validated export package.

**Authentication**: Required (admin only)

**Request**:

- Content-Type: `multipart/form-data`
- Body:
  - `file`: ZIP file (required)
  - `confirmed`: "true" (required - explicit confirmation)

**Response**:

- **200 OK**:

  ```json
  {
    "success": true,
    "message": "Configuration imported successfully",
    "imported": {
      "menuItems": 5,
      "pageContents": 5,
      "settings": 8,
      "socialNetworks": 3,
      "images": 12
    }
  }
  ```

- **400 Bad Request** (no confirmation):

  ```json
  { "error": "Import requires explicit confirmation" }
  ```

- **400 Bad Request** (validation failed):

  ```json
  {
    "success": false,
    "error": "Import validation failed: {reason}"
  }
  ```

- **500 Internal Server Error** (import failed, backup restored):

  ```json
  {
    "success": false,
    "error": "Import failed: {reason}",
    "restored": true,
    "message": "Previous configuration has been restored"
  }
  ```

- **401 Unauthorized**:
  ```json
  { "error": "Authentication required" }
  ```

---

## Error Codes Summary

| Status | Meaning                                                               |
| ------ | --------------------------------------------------------------------- |
| 200    | Success                                                               |
| 400    | Invalid request (bad package, missing confirmation, version mismatch) |
| 401    | Not authenticated                                                     |
| 500    | Server error (export/import failed)                                   |

---

## Rate Limiting

- Export: No specific limit (existing session-based concurrency control)
- Import: One import operation per session at a time
- Preview: No specific limit

---

## File Size Limits

- Maximum upload size: 100MB (configurable via Next.js config)
- Recommended for typical configurations: < 50MB
