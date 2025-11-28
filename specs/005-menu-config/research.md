# Research: Menu Configuration Feature

**Branch**: `005-menu-config` | **Date**: 2025-01-28

## Research Summary

All technical decisions have been resolved. No NEEDS CLARIFICATION items remain.

---

## 1. Drag-and-Drop Library Selection

**Decision**: @dnd-kit/sortable (part of @dnd-kit ecosystem)

**Rationale**:

- Lightweight and modular - only import what we need
- Built for React 18+ with hooks-based API
- Excellent accessibility support (keyboard navigation, screen reader announcements)
- Works well with Chakra UI components
- Active maintenance and community support
- Provides `useSortable` hook and `SortableContext` for simple list reordering

**Alternatives Considered**:
| Library | Rejected Because |
|---------|------------------|
| react-beautiful-dnd | Deprecated, no longer maintained by Atlassian |
| react-dnd | More complex setup, heavier bundle size |
| Native HTML5 DnD | Poor accessibility, inconsistent browser support |

**Required Packages**:

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**Implementation Pattern**:

```tsx
// Basic sortable list with dnd-kit
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';

function handleDragEnd(event) {
  const { active, over } = event;
  if (active.id !== over.id) {
    setItems((items) => arrayMove(items, oldIndex, newIndex));
  }
}
```

---

## 2. Data Storage Pattern

**Decision**: Separate MongoDB collection for menu items (following existing `SocialNetworkModel` pattern)

**Rationale**:

- Consistent with existing architecture patterns
- Enables efficient ordering via `position` field
- Simple CRUD operations without affecting other settings
- Clear separation of concerns

**Alternatives Considered**:
| Approach | Rejected Because |
|----------|------------------|
| Store in WebsiteSettingsModel | Would require array manipulation, less efficient queries |
| JSON file storage | Not consistent with existing MongoDB infrastructure |

**Collection Structure**:

- Collection name: `menuItems`
- Fields: `_id`, `text`, `position`, `createdAt`, `updatedAt`
- Index on `position` for efficient ordered retrieval

---

## 3. Admin Sidebar Integration

**Decision**: Add menu configuration link to existing `menuItems` array in `AdminSidebar.tsx`

**Rationale**:

- Follows established pattern for sidebar navigation
- No architectural changes needed
- Consistent user experience

**Implementation**:

```tsx
// Add to menuItems array in AdminSidebar.tsx
{
  href: '/admin/menu',
  label: 'Navigation Menu',
  description: 'Configure website navigation',
}
```

---

## 4. API Design Pattern

**Decision**: RESTful API at `/api/settings/menu` following existing patterns

**Rationale**:

- Consistent with existing `/api/settings/*` structure
- Uses established `withApi` wrapper for authentication
- Standard HTTP methods for CRUD operations

**Endpoints**:
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/settings/menu` | Retrieve all menu items (ordered) |
| POST | `/api/settings/menu` | Add new menu item |
| PUT | `/api/settings/menu` | Update item order (batch reorder) |
| DELETE | `/api/settings/menu` | Remove menu item by ID |

---

## 5. Testing Strategy

**Decision**: Unit tests for core operations as explicitly requested by user

**Tests to Implement**:

1. **AddMenuItem.test.ts** - Test adding menu items with valid/invalid text
2. **RemoveMenuItem.test.ts** - Test removing existing/non-existing items
3. **ReorderMenuItems.test.ts** - Test reordering logic and position updates
4. **MenuItem.test.ts** - Domain entity validation tests

**Pattern**: Follow existing test patterns in `test/unit/application/settings/`

---

## 6. Value Object: MenuItemText

**Decision**: Create value object for menu item text validation

**Validation Rules**:

- Required (non-empty after trimming)
- Maximum 100 characters
- Whitespace trimmed

**Pattern**: Follow existing `WebsiteName`, `ThemeColor` value object patterns

---

## 7. Position Management

**Decision**: Integer-based position field with gap strategy

**Rationale**:

- Simple to understand and implement
- Efficient for small lists (< 20 items as per scope)
- No need for fractional positions or complex algorithms

**Implementation**:

- New items added at `max(position) + 1`
- Reorder updates all affected positions in single transaction
- Positions are 0-indexed

---

## Dependencies to Add

```json
{
  "@dnd-kit/core": "^6.3.1",
  "@dnd-kit/sortable": "^9.0.0",
  "@dnd-kit/utilities": "^3.2.2"
}
```

---

## Architecture Alignment Check

| Constitution Principle          | Status                            |
| ------------------------------- | --------------------------------- |
| DDD with Hexagonal Architecture | ✅ Separate menu domain           |
| Focused Testing                 | ✅ Unit tests only as requested   |
| Simplicity-First                | ✅ No performance monitoring      |
| Security by Default             | ✅ Auth via withApi wrapper       |
| Accessibility-First             | ✅ dnd-kit accessibility features |
| YAGNI                           | ✅ Text-only items, no URLs       |
| DRY                             | ✅ Reusing existing patterns      |
| KISS                            | ✅ Simple CRUD + drag-drop        |
