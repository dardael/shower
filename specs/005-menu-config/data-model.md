# Data Model: Menu Configuration

**Branch**: `005-menu-config` | **Date**: 2025-01-28

## Entity Overview

```
┌─────────────────────────────────────────────────────────┐
│                      MenuItem                           │
├─────────────────────────────────────────────────────────┤
│  id: string (unique identifier)                         │
│  text: MenuItemText (display text, 1-100 chars)         │
│  position: number (0-indexed order)                     │
│  createdAt: Date                                        │
│  updatedAt: Date                                        │
└─────────────────────────────────────────────────────────┘
```

---

## Domain Entities

### MenuItem

**Location**: `src/domain/menu/entities/MenuItem.ts`

| Field     | Type         | Description           | Constraints                |
| --------- | ------------ | --------------------- | -------------------------- |
| id        | string       | Unique identifier     | Auto-generated             |
| text      | MenuItemText | Display text          | 1-100 characters, required |
| position  | number       | Order in menu         | 0-indexed, non-negative    |
| createdAt | Date         | Creation timestamp    | Auto-generated             |
| updatedAt | Date         | Last update timestamp | Auto-updated               |

**Business Rules**:

- Text must be non-empty after trimming whitespace
- Position must be a non-negative integer
- Items are uniquely identified by ID
- Duplicate text values are allowed (per spec assumptions)

**Methods**:

- `create(text: MenuItemText, position: number): MenuItem` - Factory method
- `updateText(newText: MenuItemText): void` - Update display text
- `updatePosition(newPosition: number): void` - Update order position
- `equals(other: MenuItem): boolean` - Equality comparison

---

## Value Objects

### MenuItemText

**Location**: `src/domain/menu/value-objects/MenuItemText.ts`

| Property | Type   | Description              |
| -------- | ------ | ------------------------ |
| value    | string | The validated text value |

**Validation Rules**:

- Required: cannot be empty or whitespace-only
- Maximum length: 100 characters
- Whitespace is trimmed from both ends

**Methods**:

- `static create(text: string): MenuItemText` - Factory with validation
- `equals(other: MenuItemText): boolean` - Value equality

**Error Cases**:

- Empty or whitespace-only text → "Menu item text cannot be empty"
- Exceeds 100 characters → "Menu item text cannot exceed 100 characters"

---

## Repository Interface

### MenuItemRepository

**Location**: `src/domain/menu/repositories/MenuItemRepository.ts`

```typescript
interface MenuItemRepository {
  findAll(): Promise<MenuItem[]>; // Returns ordered by position
  findById(id: string): Promise<MenuItem | null>;
  save(menuItem: MenuItem): Promise<void>;
  delete(id: string): Promise<void>;
  updatePositions(
    items: Array<{ id: string; position: number }>
  ): Promise<void>;
  getNextPosition(): Promise<number>; // Returns max(position) + 1
}
```

---

## Infrastructure Model

### MenuItemModel (Mongoose)

**Location**: `src/infrastructure/menu/models/MenuItemModel.ts`

**Collection**: `menuItems`

```typescript
interface IMenuItem extends Document {
  text: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema = new Schema(
  {
    text: { type: String, required: true, maxlength: 100 },
    position: { type: Number, required: true, min: 0 },
  },
  {
    collection: 'menuItems',
    timestamps: true,
  }
);

// Index for efficient ordered queries
MenuItemSchema.index({ position: 1 });
```

---

## State Transitions

```
┌──────────────┐                           ┌──────────────┐
│   Created    │──── updateText() ─────────│   Updated    │
└──────────────┘                           └──────────────┘
       │                                          │
       └──── updatePosition() ────────────────────┘
       │                                          │
       │                                          │
       ▼                                          ▼
┌──────────────┐                           ┌──────────────┐
│   Deleted    │◄──────────────────────────│   Deleted    │
└──────────────┘                           └──────────────┘
```

**State Lifecycle**:

1. **Created**: New item with text and position
2. **Updated**: Text or position modified
3. **Deleted**: Item permanently removed

---

## Relationships

```
MenuConfiguration (conceptual aggregate)
        │
        │ contains (ordered)
        ▼
   MenuItem[]
```

**Notes**:

- MenuConfiguration is not a persisted entity; it's a conceptual aggregate representing the ordered collection of menu items
- The ordering is maintained via the `position` field
- No relationships to other domain entities (menu is independent)

---

## Data Validation Summary

| Field    | Validation           | Error Message                                 |
| -------- | -------------------- | --------------------------------------------- |
| text     | Required, non-empty  | "Menu item text cannot be empty"              |
| text     | Max 100 chars        | "Menu item text cannot exceed 100 characters" |
| position | Non-negative integer | "Position must be a non-negative number"      |
