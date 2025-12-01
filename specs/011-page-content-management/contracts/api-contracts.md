# API Contracts: Page Content Management

**Date**: 2025-12-01  
**Feature**: 011-page-content-management

## Base URLs

- Admin API: `/api/settings/pages`
- Public API: `/api/pages`

---

## Admin Endpoints (Authentication Required)

### GET /api/settings/pages/:menuItemId

Get page content for a specific menu item.

**Request**:

- Method: `GET`
- Path: `/api/settings/pages/:menuItemId`
- Authentication: Required (Admin)

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| menuItemId | string | Yes | ID of the menu item |

**Response**:

#### Success (200 OK)

```json
{
  "id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "menuItemId": "65a1b2c3d4e5f6g7h8i9j0k2",
  "content": "<h1>Welcome</h1><p>This is the page content.</p>",
  "createdAt": "2025-12-01T10:00:00.000Z",
  "updatedAt": "2025-12-01T10:00:00.000Z"
}
```

#### Not Found (404)

```json
{
  "error": "Page content not found"
}
```

#### Unauthorized (401)

```json
{
  "error": "Authentication required"
}
```

---

### POST /api/settings/pages

Create page content for a menu item.

**Request**:

- Method: `POST`
- Path: `/api/settings/pages`
- Authentication: Required (Admin)
- Content-Type: `application/json`

**Request Body**:

```json
{
  "menuItemId": "65a1b2c3d4e5f6g7h8i9j0k2",
  "content": "<h1>Welcome</h1><p>This is the page content.</p>"
}
```

| Field      | Type   | Required | Constraints                  | Description            |
| ---------- | ------ | -------- | ---------------------------- | ---------------------- |
| menuItemId | string | Yes      | Valid MenuItem ID            | Reference to menu item |
| content    | string | Yes      | Non-empty, max 100,000 chars | HTML content           |

**Response**:

#### Success (201 Created)

```json
{
  "id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "menuItemId": "65a1b2c3d4e5f6g7h8i9j0k2",
  "content": "<h1>Welcome</h1><p>This is the page content.</p>",
  "createdAt": "2025-12-01T10:00:00.000Z",
  "updatedAt": "2025-12-01T10:00:00.000Z"
}
```

#### Validation Error (400)

```json
{
  "error": "Content is required"
}
```

```json
{
  "error": "Content exceeds maximum length"
}
```

#### Conflict (409)

```json
{
  "error": "Page content already exists for this menu item"
}
```

#### Not Found (404)

```json
{
  "error": "Menu item not found"
}
```

---

### PATCH /api/settings/pages/:menuItemId

Update page content for a menu item.

**Request**:

- Method: `PATCH`
- Path: `/api/settings/pages/:menuItemId`
- Authentication: Required (Admin)
- Content-Type: `application/json`

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| menuItemId | string | Yes | ID of the menu item |

**Request Body**:

```json
{
  "content": "<h1>Updated Welcome</h1><p>This is the updated content.</p>"
}
```

| Field   | Type   | Required | Constraints                  | Description          |
| ------- | ------ | -------- | ---------------------------- | -------------------- |
| content | string | Yes      | Non-empty, max 100,000 chars | Updated HTML content |

**Response**:

#### Success (200 OK)

```json
{
  "id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "menuItemId": "65a1b2c3d4e5f6g7h8i9j0k2",
  "content": "<h1>Updated Welcome</h1><p>This is the updated content.</p>",
  "createdAt": "2025-12-01T10:00:00.000Z",
  "updatedAt": "2025-12-01T11:00:00.000Z"
}
```

#### Not Found (404)

```json
{
  "error": "Page content not found"
}
```

#### Validation Error (400)

```json
{
  "error": "Content is required"
}
```

---

### DELETE /api/settings/pages/:menuItemId

Delete page content for a menu item.

**Request**:

- Method: `DELETE`
- Path: `/api/settings/pages/:menuItemId`
- Authentication: Required (Admin)

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| menuItemId | string | Yes | ID of the menu item |

**Response**:

#### Success (204 No Content)

No response body.

#### Not Found (404)

```json
{
  "error": "Page content not found"
}
```

---

## Public Endpoints (No Authentication)

### GET /api/pages/:menuItemId

Get published page content for public viewing.

**Request**:

- Method: `GET`
- Path: `/api/pages/:menuItemId`
- Authentication: Not required

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| menuItemId | string | Yes | ID of the menu item |

**Response**:

#### Success (200 OK)

```json
{
  "id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "menuItemId": "65a1b2c3d4e5f6g7h8i9j0k2",
  "content": "<h1>Welcome</h1><p>This is the page content.</p>"
}
```

#### Not Found (404)

```json
{
  "error": "Page not found"
}
```

---

## Error Response Format

All error responses follow this format:

```json
{
  "error": "Human-readable error message"
}
```

## HTTP Status Codes Summary

| Code | Meaning               | Usage                          |
| ---- | --------------------- | ------------------------------ |
| 200  | OK                    | Successful GET, PATCH          |
| 201  | Created               | Successful POST                |
| 204  | No Content            | Successful DELETE              |
| 400  | Bad Request           | Validation errors              |
| 401  | Unauthorized          | Missing/invalid authentication |
| 404  | Not Found             | Resource doesn't exist         |
| 409  | Conflict              | Duplicate resource             |
| 500  | Internal Server Error | Unexpected server errors       |
