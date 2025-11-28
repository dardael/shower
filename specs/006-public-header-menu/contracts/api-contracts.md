# API Contracts: Public Header Menu

**Feature**: 006-public-header-menu  
**Date**: 2025-11-28

## Public Endpoints

### GET /api/public/menu

Retrieves all configured menu items for public display.

**Authentication**: None required (public endpoint)

**Request**:

- Method: `GET`
- Headers:
  - `Content-Type: application/json`

**Response (Success - 200)**:

```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "text": "Home",
      "position": 0
    },
    {
      "id": "507f1f77bcf86cd799439012",
      "text": "About",
      "position": 1
    },
    {
      "id": "507f1f77bcf86cd799439013",
      "text": "Services",
      "position": 2
    },
    {
      "id": "507f1f77bcf86cd799439014",
      "text": "Contact",
      "position": 3
    }
  ]
}
```

**Response (Success - Empty Menu - 200)**:

```json
{
  "success": true,
  "data": []
}
```

**Response (Error - 500)**:

```json
{
  "success": false,
  "error": "Internal server error"
}
```

**Notes**:

- Items are always returned sorted by `position` (ascending)
- Empty array returned when no menu items configured
- Internal errors return generic message (no sensitive data exposure)

---

## TypeScript Interfaces

### Request/Response Types

```typescript
// Public Menu Item DTO
interface PublicMenuItem {
  id: string;
  text: string;
  position: number;
}

// API Response (Success)
interface PublicMenuSuccessResponse {
  success: true;
  data: PublicMenuItem[];
}

// API Response (Error)
interface PublicMenuErrorResponse {
  success: false;
  error: string;
}

// Combined Response Type
type PublicMenuResponse = PublicMenuSuccessResponse | PublicMenuErrorResponse;
```

---

## Caching Behavior

| Aspect              | Value                                              |
| ------------------- | -------------------------------------------------- |
| Cache Strategy      | Next.js Data Cache with tags                       |
| Cache Tag           | `menu-items`                                       |
| Cache Invalidation  | When admin updates menu via PUT /api/settings/menu |
| Client-Side Caching | None (fetch on mount)                              |

---

## Error Handling

| Scenario              | HTTP Status | Response                                             |
| --------------------- | ----------- | ---------------------------------------------------- |
| Success               | 200         | `{ success: true, data: [...] }`                     |
| Empty menu            | 200         | `{ success: true, data: [] }`                        |
| Internal fetch failed | 500         | `{ success: false, error: "Internal server error" }` |
| Database error        | 500         | `{ success: false, error: "Internal server error" }` |

**Note**: Detailed error messages are logged server-side but not exposed to public clients.
