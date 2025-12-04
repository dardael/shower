# Data Model: Root Page Redirect to First Menu Item

**Feature**: 020-root-page-redirect  
**Date**: 2025-12-04  
**Status**: Reuses Existing Domain Model

## Overview

This feature does NOT introduce new entities or modify existing ones. It leverages the current domain model to implement root URL page content display.

## Existing Entities (Reused)

### MenuItem

**Location**: `src/domain/menu/entities/MenuItem.ts`

**Purpose**: Represents a navigation menu item with position-based ordering.

**Key Properties**:
| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier (MongoDB ObjectId) |
| `text` | `MenuItemText` | Display text for the menu item |
| `url` | `MenuItemUrl` | URL path for the menu item's page |
| `position` | `number` | Zero-based position for ordering (0 = first) |
| `createdAt` | `Date` | Creation timestamp |
| `updatedAt` | `Date` | Last modification timestamp |

**Validation Rules**:

- Position must be non-negative (`position >= 0`)
- Text must be valid via `MenuItemText` value object validation
- URL must be valid via `MenuItemUrl` value object validation

**Relevant Methods**:

- `get position(): number` - Returns the menu item's position for ordering
- `get id(): string` - Returns ID for page content association
- `get url(): MenuItemUrl` - Returns URL for page routing

**Usage in Feature**:

- Query all menu items via `GetMenuItems` use case
- Repository returns items sorted by `position` (ascending)
- First item in array (`menuItems[0]`) is the menu item with position 0 or lowest position
- Use `id` to query associated page content

---

### PageContent

**Location**: `src/domain/pages/PageContent.ts`

**Purpose**: Represents the rich text content associated with a menu item's page.

**Key Properties**:
| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier matching MenuItem's ID |
| `content` | `PageContentBody` | HTML content for the page |
| `createdAt` | `Date` | Creation timestamp |
| `updatedAt` | `Date` | Last modification timestamp |

**Relevant Methods**:

- `get content(): PageContentBody` - Returns page content body
- `content.value: string` - HTML string for rendering

**Usage in Feature**:

- Query page content by `MenuItem.id` via `GetPageContent` use case
- Extract HTML content via `pageContent.content.value`
- Pass to `PublicPageContent` component for rendering

---

## Value Objects (Reused)

### MenuItemText

**Location**: `src/domain/menu/value-objects/MenuItemText.ts`

**Purpose**: Validated menu item display text

**Usage**: Not directly used in this feature (part of MenuItem entity)

---

### MenuItemUrl

**Location**: `src/domain/menu/value-objects/MenuItemUrl.ts`

**Purpose**: Validated URL path for menu item

**Usage**: Not directly used in this feature (part of MenuItem entity)

---

### PageContentBody

**Location**: `src/domain/pages/PageContentBody.ts`

**Purpose**: Validated HTML content for pages

**Usage**: Access HTML content via `pageContent.content.value`

---

## Repositories (Reused)

### MenuItemRepository

**Interface**: `src/domain/menu/repositories/MenuItemRepository.ts`  
**Implementation**: `src/infrastructure/menu/repositories/MongooseMenuItemRepository.ts`

**Relevant Method**:

```typescript
findAll(): Promise<MenuItem[]>
```

**Behavior**:

- Returns all menu items sorted by `position` (ascending order)
- Lowest position first (position 0 or minimum position value)
- Implementation detail: MongoDB query with `.sort({ position: 1 })`

**Usage in Feature**:

- Called via `GetMenuItems` use case
- Result array's first item is the first menu item

---

### PageContentRepository

**Interface**: `src/domain/pages/repositories/PageContentRepository.ts`  
**Implementation**: `src/infrastructure/pages/repositories/MongoosePageContentRepository.ts`

**Relevant Method**:

```typescript
findById(id: string): Promise<PageContent | null>
```

**Behavior**:

- Returns page content for given menu item ID
- Returns `null` if no content exists

**Usage in Feature**:

- Called via `GetPageContent` use case with `MenuItem.id`
- Handle null case gracefully (empty content)

---

## Relationships

```
┌─────────────┐         ┌──────────────┐
│  MenuItem   │         │ PageContent  │
├─────────────┤         ├──────────────┤
│ id          │────────>│ id           │
│ text        │   1:1   │ content      │
│ url         │         │ createdAt    │
│ position    │         │ updatedAt    │
│ createdAt   │         └──────────────┘
│ updatedAt   │
└─────────────┘
       │
       │ sorted by position
       ▼
┌──────────────────────┐
│ Menu Items Array     │
│ [0] ← First item     │
│ [1] ← Second item    │
│ [2] ← Third item     │
└──────────────────────┘
```

**Key Relationship**:

- MenuItem and PageContent have a 1:1 relationship via `id`
- MenuItems are ordered by `position` property
- First menu item (lowest position) determines root URL content

---

## Data Flow for Feature

```
┌──────────────┐
│ Root URL (/) │
└──────┬───────┘
       │
       ▼
┌────────────────────────┐
│ GetMenuItems.execute() │
└──────┬─────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ MenuItemRepository.findAll() │
│ Returns sorted by position   │
└──────┬──────────────────────┘
       │
       ▼
┌───────────────────────┐
│ menuItems[0] = first  │
│ (lowest position)     │
└──────┬────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ GetPageContent.execute(id)  │
└──────┬──────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ PageContentRepository.findById() │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ pageContent.content.value   │
│ (HTML string)               │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ PublicPageContent component │
│ Renders HTML                │
└─────────────────────────────┘
```

---

## Edge Case Data States

### 1. No Menu Items

**Database State**: `MenuItems` collection is empty

**Data Flow**:

```
GetMenuItems.execute() → []
menuItems.length === 0 → true
Render: Empty state placeholder message
```

**Handling**: Component displays "No content available yet" message

---

### 2. Menu Item Exists, No Page Content

**Database State**:

- `MenuItems` collection has items
- `PageContent` collection missing entry for first menu item's ID

**Data Flow**:

```
GetMenuItems.execute() → [menuItem1, ...]
menuItems[0] → menuItem1
GetPageContent.execute(menuItem1.id) → null
pageContent?.content.value → undefined
Fallback to: ''
PublicPageContent receives: ''
```

**Handling**: `PublicPageContent` component displays its built-in empty state: "This page has no content yet."

---

### 3. Multiple Menu Items with Tie in Position

**Database State**: Multiple items with same position value (data integrity issue)

**Repository Behavior**: MongoDB `.sort({ position: 1 })` uses insertion order as tiebreaker

**Data Flow**:

```
GetMenuItems.execute() → [item_A, item_B] (both position: 0)
menuItems[0] → item_A (first by insertion order)
```

**Handling**: First item by insertion order is used (MongoDB default behavior)

**Note**: This is a data integrity issue that should be prevented by application logic, but the feature handles it gracefully.

---

## Database Schema (Existing)

### MenuItems Collection

```typescript
{
  _id: ObjectId,
  text: string,
  url: string,
  position: number,      // Used for sorting
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: Position field should be indexed for efficient sorting (existing implementation)

---

### PageContents Collection

```typescript
{
  _id: string,           // Matches MenuItem._id
  content: string,       // HTML string
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: Primary key on `_id` (default MongoDB index)

---

## State Transitions

This feature does NOT modify data, only reads it. No state transitions.

**Read-Only Operations**:

1. Query menu items (sorted by position)
2. Query page content by ID

**No Modifications**:

- Menu items are not updated
- Page content is not modified
- Positions are not changed

---

## Validation Requirements

No new validation needed. Feature reuses existing validation:

- **MenuItem validation**: Handled by `MenuItem` entity and value objects
- **PageContent validation**: Handled by `PageContent` entity and value objects
- **Repository validation**: Handled by repository implementations

---

## Summary

**New Entities**: 0  
**Modified Entities**: 0  
**Reused Entities**: 2 (MenuItem, PageContent)  
**New Repositories**: 0  
**Modified Repositories**: 0  
**Reused Repositories**: 2 (MenuItemRepository, PageContentRepository)

**Conclusion**: This feature is a pure read operation leveraging existing domain model. No data model changes required. Implementation complexity is minimal, focusing on querying and presentation logic.
