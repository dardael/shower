# API Contracts: Edit Menu Item

**Feature**: 009-edit-menu-item  
**Date**: 2025-01-30

## Overview

This feature adds one new endpoint to the existing menu API. All existing endpoints remain unchanged.

---

## New Endpoint: Update Menu Item Text

### PATCH /api/settings/menu/[id]

Updates the display text of an existing menu item.

**Authentication**: Required (admin only)

#### Path Parameters

| Parameter | Type   | Required | Description                       |
| --------- | ------ | -------- | --------------------------------- |
| id        | string | Yes      | MongoDB ObjectId of the menu item |

#### Request

```typescript
interface UpdateMenuItemRequest {
  text: string; // New display text (1-100 chars, trimmed)
}
```

**Example Request**:

```json
{
  "text": "Contact Us"
}
```

#### Response

**Success (200 OK)**:

```typescript
interface UpdateMenuItemResponse {
  message: string;
  item: MenuItemDTO;
}

interface MenuItemDTO {
  id: string;
  text: string;
  position: number;
}
```

**Example Response**:

```json
{
  "message": "Menu item updated successfully",
  "item": {
    "id": "507f1f77bcf86cd799439011",
    "text": "Contact Us",
    "position": 2
  }
}
```

#### Error Responses

**400 Bad Request** - Invalid input:

```json
{
  "error": "Menu item text is required"
}
```

```json
{
  "error": "Menu item text cannot be empty"
}
```

```json
{
  "error": "Menu item text cannot exceed 100 characters"
}
```

**401 Unauthorized** - Not authenticated:

```json
{
  "error": "Unauthorized"
}
```

**404 Not Found** - Menu item doesn't exist:

```json
{
  "error": "Menu item not found"
}
```

**500 Internal Server Error** - Server error:

```json
{
  "error": "Failed to update menu item"
}
```

---

## Type Definitions

Add to `src/app/api/settings/menu/types.ts`:

```typescript
// Request type
export interface UpdateMenuItemRequest {
  text: string;
}

// Response type
export interface UpdateMenuItemResponse {
  message: string;
  item: MenuItemDTO;
}
```

---

## Existing Endpoints (Unchanged)

For reference, the existing menu endpoints:

| Method    | Endpoint                    | Description                     |
| --------- | --------------------------- | ------------------------------- |
| GET       | /api/settings/menu          | Get all menu items              |
| POST      | /api/settings/menu          | Add new menu item               |
| PUT       | /api/settings/menu          | Reorder menu items              |
| DELETE    | /api/settings/menu/[id]     | Delete menu item                |
| **PATCH** | **/api/settings/menu/[id]** | **Update menu item text (NEW)** |

---

## Implementation Notes

### Route Handler Location

Add PATCH handler to existing file: `src/app/api/settings/menu/[id]/route.ts`

This file already contains the DELETE handler, so PATCH will be added alongside it.

### Handler Pattern

Follow the existing pattern from POST handler:

```typescript
export const PATCH = withApi(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    // 1. Extract id from params
    // 2. Parse and validate request body
    // 3. Call UpdateMenuItem use case
    // 4. Return success response with updated item
    // 5. Handle errors (400, 404, 500)
  },
  { requireAuth: true }
);
```

### Validation Flow

```
Request → Parse body → Validate text exists → Use case validates via MenuItemText → Repository updates
```

Validation errors from MenuItemText.create() are caught and returned as 400 responses.
