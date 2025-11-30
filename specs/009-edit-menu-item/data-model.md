# Data Model: Edit Menu Item

**Feature**: 009-edit-menu-item  
**Date**: 2025-01-30

## Entity Overview

This feature modifies an existing entity (MenuItem) to support text updates. No new entities are introduced.

---

## MenuItem Entity

### Current State

```
MenuItem
├── _id: string | null       # Unique identifier (MongoDB ObjectId)
├── _text: MenuItemText      # Value object containing display text
├── _position: number        # Order in menu (0-based)
├── _createdAt: Date         # Timestamp when created
└── _updatedAt: Date         # Timestamp when last modified
```

### Changes Required

**Add method**: `withText(text: MenuItemText): MenuItem`

This method follows the existing immutable update pattern (see `withId()`):

- Creates a new MenuItem instance with the updated text
- Preserves id, position, and createdAt
- Sets updatedAt to current timestamp
- Returns the new instance (does not mutate original)

### Validation Rules

Validation is handled by the `MenuItemText` value object (unchanged):

| Rule       | Implementation                      |
| ---------- | ----------------------------------- |
| Required   | Text cannot be empty after trimming |
| Max length | 100 characters                      |
| Trimming   | Whitespace is auto-trimmed          |

Error messages:

- "Menu item text cannot be empty"
- "Menu item text cannot exceed 100 characters"

---

## MenuItemText Value Object

**No changes required.** Existing validation applies to both create and update operations.

```
MenuItemText
└── _value: string           # Validated, trimmed text
```

Factory method `MenuItemText.create(text: string)` throws on invalid input.

---

## State Transitions

```
┌─────────────────────────────────────────────────────────────┐
│                      MenuItem Lifecycle                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [Create]          [Persist]           [Update Text]        │
│     │                  │                    │                │
│     ▼                  ▼                    ▼                │
│  MenuItem ──────► MenuItem ──────────► MenuItem             │
│  (id=null)       (id=ObjectId)        (id=ObjectId)         │
│                                        (text=new)            │
│                                        (updatedAt=now)       │
│                                                              │
│                       │                    │                 │
│                       ▼                    ▼                 │
│                   [Delete]            [Persist]              │
│                       │                    │                 │
│                       ▼                    ▼                 │
│                    (removed)           (saved)               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Key transition for this feature**: Update Text

- Input: Existing MenuItem (with id) + new text string
- Process: Validate via MenuItemText.create(), call withText()
- Output: New MenuItem instance with same id, updated text, new updatedAt
- Persistence: Call repository.save() with updated entity

---

## Database Impact

### MongoDB Collection: menuitems

**Schema** (unchanged):

```javascript
{
  _id: ObjectId,
  text: String,
  position: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**Index** (unchanged):

- `position: 1` for ordered queries

**Update operation**:

```javascript
// Handled by repository.save() when entity has id
db.menuitems.findOneAndUpdate(
  { _id: ObjectId(id) },
  { $set: { text: newText, updatedAt: new Date() } },
  { returnDocument: 'after' }
);
```

---

## Repository Interface

### Current Interface (MenuItemRepository)

```typescript
interface MenuItemRepository {
  findAll(): Promise<MenuItem[]>;
  findById(id: string): Promise<MenuItem | null>;
  save(menuItem: MenuItem): Promise<MenuItem>; // Handles both create and update
  delete(id: string): Promise<void>;
  updatePositions(
    items: Array<{ id: string; position: number }>
  ): Promise<void>;
  getNextPosition(): Promise<number>;
}
```

**No interface changes required.** The existing `save()` method:

- Creates new document when entity has no id
- Updates existing document when entity has id

---

## DTO Structure

### MenuItemDTO (existing - unchanged)

```typescript
interface MenuItemDTO {
  id: string;
  text: string;
  position: number;
}
```

Used in API responses for menu items.
