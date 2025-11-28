# API Contracts: Menu Configuration

**Branch**: `005-menu-config` | **Date**: 2025-01-28

## Base URL

```
/api/settings/menu
```

## Authentication

All endpoints require admin authentication via the `withApi` wrapper with `requireAuth: true`.

---

## Endpoints

### GET /api/settings/menu

**Description**: Retrieve all menu items ordered by position.

**Request**: No body required

**Response** (200 OK):

```typescript
interface GetMenuItemsResponse {
  items: Array<{
    id: string;
    text: string;
    position: number;
  }>;
}
```

**Example Response**:

```json
{
  "items": [
    { "id": "abc123", "text": "Home", "position": 0 },
    { "id": "def456", "text": "About", "position": 1 },
    { "id": "ghi789", "text": "Contact", "position": 2 }
  ]
}
```

**Error Responses**:
| Status | Body | Cause |
|--------|------|-------|
| 401 | `{ "error": "Unauthorized" }` | Missing/invalid authentication |
| 500 | `{ "error": "Internal server error" }` | Server error |

---

### POST /api/settings/menu

**Description**: Add a new menu item. Item is added at the end (highest position + 1).

**Request**:

```typescript
interface AddMenuItemRequest {
  text: string; // Required, 1-100 characters
}
```

**Example Request**:

```json
{
  "text": "Services"
}
```

**Response** (201 Created):

```typescript
interface AddMenuItemResponse {
  message: string;
  item: {
    id: string;
    text: string;
    position: number;
  };
}
```

**Example Response**:

```json
{
  "message": "Menu item added successfully",
  "item": {
    "id": "xyz999",
    "text": "Services",
    "position": 3
  }
}
```

**Error Responses**:
| Status | Body | Cause |
|--------|------|-------|
| 400 | `{ "error": "Menu item text cannot be empty" }` | Empty text |
| 400 | `{ "error": "Menu item text cannot exceed 100 characters" }` | Text too long |
| 401 | `{ "error": "Unauthorized" }` | Missing/invalid authentication |
| 500 | `{ "error": "Internal server error" }` | Server error |

---

### PUT /api/settings/menu

**Description**: Reorder menu items. Accepts the complete ordered list of item IDs.

**Request**:

```typescript
interface ReorderMenuItemsRequest {
  orderedIds: string[]; // Complete list of item IDs in new order
}
```

**Example Request**:

```json
{
  "orderedIds": ["ghi789", "abc123", "def456"]
}
```

**Response** (200 OK):

```typescript
interface ReorderMenuItemsResponse {
  message: string;
}
```

**Example Response**:

```json
{
  "message": "Menu items reordered successfully"
}
```

**Error Responses**:
| Status | Body | Cause |
|--------|------|-------|
| 400 | `{ "error": "Invalid request: orderedIds must be an array" }` | Missing/invalid orderedIds |
| 400 | `{ "error": "Invalid item IDs provided" }` | IDs don't match existing items |
| 401 | `{ "error": "Unauthorized" }` | Missing/invalid authentication |
| 500 | `{ "error": "Internal server error" }` | Server error |

---

### DELETE /api/settings/menu/[id]

**Description**: Remove a menu item by ID (passed as URL path parameter).

**URL Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | ID of the menu item to delete |

**Request**: No body required

**Example Request**:

```
DELETE /api/settings/menu/def456
```

**Response** (200 OK):

```typescript
interface DeleteMenuItemResponse {
  message: string;
}
```

**Example Response**:

```json
{
  "message": "Menu item removed successfully"
}
```

**Error Responses**:
| Status | Body | Cause |
|--------|------|-------|
| 404 | `{ "error": "Menu item not found" }` | Item doesn't exist |
| 401 | `{ "error": "Unauthorized" }` | Missing/invalid authentication |
| 500 | `{ "error": "Internal server error" }` | Server error |

---

## TypeScript Types

**Location**: `src/app/api/settings/menu/types.ts`

```typescript
// Request types
export interface AddMenuItemRequest {
  text: string;
}

export interface ReorderMenuItemsRequest {
  orderedIds: string[];
}

// Response types
export interface MenuItemDTO {
  id: string;
  text: string;
  position: number;
}

export interface GetMenuItemsResponse {
  items: MenuItemDTO[];
}

export interface AddMenuItemResponse {
  message: string;
  item: MenuItemDTO;
}

export interface ReorderMenuItemsResponse {
  message: string;
}

export interface DeleteMenuItemResponse {
  message: string;
}

export interface MenuErrorResponse {
  error: string;
}
```

---

## Usage Examples (Client-side)

### Fetching Menu Items

```typescript
const response = await fetch('/api/settings/menu');
const data: GetMenuItemsResponse = await response.json();
```

### Adding a Menu Item

```typescript
const response = await fetch('/api/settings/menu', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'New Page' }),
});
```

### Reordering Menu Items

```typescript
const response = await fetch('/api/settings/menu', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ orderedIds: ['id3', 'id1', 'id2'] }),
});
```

### Deleting a Menu Item

```typescript
const response = await fetch(`/api/settings/menu/${itemId}`, {
  method: 'DELETE',
});
```
