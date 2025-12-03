# API Contract: Settings Endpoint (Extended)

**Feature**: 017-background-color-config  
**Date**: 2025-12-03  
**Base URL**: `/api/settings`

---

## GET /api/settings

Retrieve website settings including background color.

### Response

**Status**: `200 OK`

```json
{
  "name": "My Website",
  "themeColor": "blue",
  "backgroundColor": "blue"
}
```

| Field             | Type              | Required | Description                 |
| ----------------- | ----------------- | -------- | --------------------------- |
| `name`            | `string`          | Yes      | Website display name        |
| `themeColor`      | `ThemeColorToken` | No       | Theme accent color          |
| `backgroundColor` | `ThemeColorToken` | No       | Body background color (NEW) |

**ThemeColorToken**: `"blue" | "red" | "green" | "purple" | "orange" | "teal" | "pink" | "cyan"`

### Error Response

**Status**: `500 Internal Server Error`

```json
{
  "error": "Internal server error"
}
```

---

## POST /api/settings

Update website settings including background color.

### Request

**Headers**:

- `Content-Type: application/json`
- Authentication required (admin only)

**Body**:

```json
{
  "name": "My Website",
  "themeColor": "blue",
  "backgroundColor": "purple"
}
```

| Field             | Type     | Required | Description                 |
| ----------------- | -------- | -------- | --------------------------- |
| `name`            | `string` | No       | Website display name        |
| `themeColor`      | `string` | No       | Theme accent color          |
| `backgroundColor` | `string` | No       | Body background color (NEW) |

### Response

**Status**: `200 OK`

```json
{
  "message": "Website settings updated successfully"
}
```

### Error Responses

**Status**: `400 Bad Request` (Invalid background color)

```json
{
  "error": "Invalid background color provided. Must be one of: blue, red, green, purple, orange, teal, pink, cyan"
}
```

**Status**: `401 Unauthorized` (Not authenticated)

```json
{
  "error": "Unauthorized"
}
```

**Status**: `500 Internal Server Error`

```json
{
  "error": "Internal server error"
}
```

---

## GET /api/settings/background-color

Dedicated endpoint for background color retrieval (optional, for public access).

### Response

**Status**: `200 OK`

```json
{
  "backgroundColor": "blue"
}
```

| Field             | Type              | Description                      |
| ----------------- | ----------------- | -------------------------------- |
| `backgroundColor` | `ThemeColorToken` | Current background color setting |

---

## TypeScript Types

```typescript
// Request/Response types for /api/settings

export interface GetSettingsResponse {
  name: string;
  themeColor?: ThemeColorToken;
  backgroundColor?: ThemeColorToken;
}

export interface UpdateSettingsRequest {
  name?: string;
  themeColor?: string;
  backgroundColor?: string;
}

export interface UpdateSettingsResponse {
  message: string;
}

export interface SettingsErrorResponse {
  error: string;
}

// Type for dedicated background color endpoint
export interface GetBackgroundColorResponse {
  backgroundColor: ThemeColorToken;
}
```

---

## Validation Rules

| Field             | Rule                          | Error Message                                                                                           |
| ----------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------- |
| `backgroundColor` | Must be valid ThemeColorToken | "Invalid background color provided. Must be one of: blue, red, green, purple, orange, teal, pink, cyan" |
| `backgroundColor` | Optional in request           | N/A (field can be omitted)                                                                              |

---

## Authentication

| Endpoint                         | Method | Auth Required |
| -------------------------------- | ------ | ------------- |
| `/api/settings`                  | GET    | No            |
| `/api/settings`                  | POST   | Yes (Admin)   |
| `/api/settings/background-color` | GET    | No            |
