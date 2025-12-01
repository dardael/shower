# API Contracts: Menu Item URL Configuration

**Feature**: 010-menu-item-url  
**Date**: 2025-12-01

## Data Transfer Objects

### MenuItemDTO (Updated)

```typescript
interface MenuItemDTO {
  id: string;
  text: string;
  url: string; // NEW
  position: number;
}
```

### Request/Response Types

```typescript
// Create menu item
interface AddMenuItemRequest {
  text: string;
  url: string; // NEW - required
}

interface AddMenuItemResponse {
  message: string;
  item: MenuItemDTO;
}

// Update menu item
interface UpdateMenuItemRequest {
  text: string;
  url: string; // NEW - required
}

interface UpdateMenuItemResponse {
  message: string;
  item: MenuItemDTO;
}

// List menu items (unchanged structure, now includes url)
interface GetMenuItemsResponse {
  items: MenuItemDTO[];
}

// Error response (unchanged)
interface MenuErrorResponse {
  error: string;
}
```

## Admin Endpoints

### POST /api/settings/menu

Create a new menu item with text and URL.

**Request**:

```json
{
  "text": "About Us",
  "url": "/about"
}
```

**Response (201)**:

```json
{
  "message": "Menu item added successfully",
  "item": {
    "id": "abc123",
    "text": "About Us",
    "url": "/about",
    "position": 0
  }
}
```

**Error Responses**:

- 400: `{ "error": "Text and URL are required" }`
- 400: `{ "error": "Menu item text cannot be empty" }`
- 400: `{ "error": "Menu item URL cannot be empty" }`
- 400: `{ "error": "Menu item URL must be a relative path" }`
- 401: Unauthorized
- 500: `{ "error": "Failed to add menu item" }`

### PATCH /api/settings/menu/[id]

Update an existing menu item's text and URL.

**Request**:

```json
{
  "text": "About",
  "url": "/about-us"
}
```

**Response (200)**:

```json
{
  "message": "Menu item updated successfully",
  "item": {
    "id": "abc123",
    "text": "About",
    "url": "/about-us",
    "position": 0
  }
}
```

**Error Responses**:

- 400: `{ "error": "ID, text, and URL are required" }`
- 400: `{ "error": "Menu item URL cannot be empty" }`
- 400: `{ "error": "Menu item URL must be a relative path" }`
- 404: `{ "error": "Menu item not found" }`
- 401: Unauthorized
- 500: `{ "error": "Failed to update menu item" }`

### GET /api/settings/menu

List all menu items (unchanged endpoint, response now includes url).

**Response (200)**:

```json
{
  "items": [
    {
      "id": "abc123",
      "text": "Home",
      "url": "/",
      "position": 0
    },
    {
      "id": "def456",
      "text": "About",
      "url": "/about",
      "position": 1
    }
  ]
}
```

## Public Endpoints

### GET /api/public/menu

Fetch menu items for public display (unchanged endpoint, response now includes url).

**Response (200)**:

```json
{
  "items": [
    {
      "id": "abc123",
      "text": "Home",
      "url": "/",
      "position": 0
    },
    {
      "id": "def456",
      "text": "About",
      "url": "/about",
      "position": 1
    }
  ]
}
```

## Validation Rules Summary

| Field | Rule           | Error Message                                 |
| ----- | -------------- | --------------------------------------------- |
| text  | Non-empty      | "Menu item text cannot be empty"              |
| text  | Max 100 chars  | "Menu item text cannot exceed 100 characters" |
| url   | Non-empty      | "Menu item URL cannot be empty"               |
| url   | Relative path  | "Menu item URL must be a relative path"       |
| url   | Max 2048 chars | "Menu item URL cannot exceed 2048 characters" |
