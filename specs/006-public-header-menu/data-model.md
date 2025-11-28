# Data Model: Public Header Menu

**Feature**: 006-public-header-menu  
**Date**: 2025-11-28

## Entities

### MenuItem (Existing - No Changes)

The MenuItem entity already exists in the system and will be reused without modification.

**Location**: `src/domain/menu/entities/MenuItem.ts`

| Field     | Type         | Description                | Validation                  |
| --------- | ------------ | -------------------------- | --------------------------- |
| id        | string       | Unique identifier          | Required after persistence  |
| text      | MenuItemText | Display text for menu item | 1-100 characters, non-empty |
| position  | number       | Order in menu              | Non-negative integer        |
| createdAt | Date         | Creation timestamp         | Auto-generated              |
| updatedAt | Date         | Last update timestamp      | Auto-generated              |

**Value Object**: `MenuItemText` at `src/domain/menu/value-objects/MenuItemText.ts`

- Validates text is non-empty
- Validates text does not exceed 100 characters
- Trims whitespace

---

## DTOs (Data Transfer Objects)

### PublicMenuItemDTO (New)

**Purpose**: Simplified representation of menu item for public API consumption.

| Field    | Type   | Description       |
| -------- | ------ | ----------------- |
| id       | string | Unique identifier |
| text     | string | Display text      |
| position | number | Order in menu     |

**Usage**: Returned by `/api/public/menu` endpoint

### PublicMenuApiResponse (New)

**Purpose**: Standardized API response wrapper for public menu endpoint.

| Field   | Type                | Description                             |
| ------- | ------------------- | --------------------------------------- |
| success | boolean             | Indicates if request was successful     |
| data    | PublicMenuItemDTO[] | Array of menu items (when success=true) |
| error   | string              | Error message (when success=false)      |

---

## Relationships

```
MenuItem (Domain Entity)
    ↓ (mapped by)
MongooseMenuItemRepository
    ↓ (used by)
GetMenuItems (Use Case)
    ↓ (called by)
/api/settings/menu (Admin API)
    ↓ (fetched by)
/api/public/menu (Public API) [NEW]
    ↓ (transforms to)
PublicMenuItemDTO
    ↓ (consumed by)
PublicHeaderMenu (Component) [NEW]
```

---

## State Transitions

No state transitions apply. MenuItem is read-only from the public header menu perspective.

---

## Storage

**Database**: MongoDB (existing)  
**Collection**: `menuitems` (existing)  
**Model**: `MenuItemModel` at `src/infrastructure/menu/models/MenuItemModel.ts`

No changes to storage layer required.

---

## Caching Strategy

- Public API endpoint uses Next.js fetch with cache tags
- Tag: `menu-items` (for cache invalidation when admin updates menu)
- Client-side: Hook fetches on component mount
- No localStorage caching needed (unlike theme color - menu changes less frequently)
