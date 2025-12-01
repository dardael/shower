# Data Model: Menu Item URL Configuration

**Feature**: 010-menu-item-url  
**Date**: 2025-12-01

## Entities

### MenuItem (Extended)

Core domain entity representing a navigation menu item.

| Property  | Type           | Required | Description                              |
| --------- | -------------- | -------- | ---------------------------------------- |
| id        | string \| null | No       | Unique identifier (null until persisted) |
| text      | MenuItemText   | Yes      | Display text value object                |
| url       | MenuItemUrl    | Yes      | Navigation URL value object (NEW)        |
| position  | number         | Yes      | Order position (≥ 0)                     |
| createdAt | Date           | Yes      | Creation timestamp                       |
| updatedAt | Date           | Yes      | Last modification timestamp              |

**Factory Methods**:

- `create(text: MenuItemText, url: MenuItemUrl, position: number): MenuItem`
- `reconstitute(id: string, text: MenuItemText, url: MenuItemUrl, position: number, createdAt: Date, updatedAt: Date): MenuItem`

**Immutable Update Methods**:

- `withId(id: string): MenuItem`
- `withText(text: MenuItemText): MenuItem`
- `withUrl(url: MenuItemUrl): MenuItem` (NEW)

## Value Objects

### MenuItemText (Existing)

| Property | Type   | Validation                        |
| -------- | ------ | --------------------------------- |
| value    | string | Non-empty, max 100 chars, trimmed |

### MenuItemUrl (New)

| Property | Type   | Validation                                             |
| -------- | ------ | ------------------------------------------------------ |
| value    | string | Non-empty, relative path only, max 2048 chars, trimmed |

**Validation Rules**:

1. Cannot be empty or whitespace-only
2. Must NOT start with `http://`, `https://`, or `//`
3. Maximum 2048 characters
4. Auto-trimmed

**Valid Examples**: `/about`, `contact`, `/pages/info`, `path/to/page`, `/path?query=value`

**Invalid Examples**: `http://example.com`, `https://example.com`, `//cdn.example.com`, `` (empty)

## Database Schema

### MongoDB Collection: `menuItems`

```javascript
{
  _id: ObjectId,
  text: String,      // required, maxlength: 100
  url: String,       // required, maxlength: 2048 (NEW)
  position: Number,  // required, min: 0
  createdAt: Date,   // auto-managed
  updatedAt: Date    // auto-managed
}
```

**Indexes**:

- `position` (existing)

## State Transitions

No state machine - MenuItem is a simple data entity with CRUD operations.

## Relationships

- MenuItem has no relationships to other entities
- MenuItem contains two value objects: MenuItemText and MenuItemUrl
