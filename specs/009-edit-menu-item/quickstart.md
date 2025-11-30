# Quickstart: Edit Menu Item

**Feature**: 009-edit-menu-item  
**Date**: 2025-01-30

## Overview

This guide provides a quick reference for implementing the Edit Menu Item feature. It follows the existing hexagonal architecture patterns in the codebase.

---

## Implementation Order

```
1. Domain Layer    → MenuItem.withText() method
2. Application     → IUpdateMenuItem interface + UpdateMenuItem use case
3. Infrastructure  → Register use case in container.ts
4. API Layer       → PATCH handler in [id]/route.ts + types
5. Presentation    → Inline editing in MenuConfigForm.tsx
```

---

## 1. Domain Layer

### File: `src/domain/menu/entities/MenuItem.ts`

Add method after `withId()`:

```typescript
withText(text: MenuItemText): MenuItem {
  return new MenuItem(
    this._id,
    text,
    this._position,
    this._createdAt,
    new Date()  // Update updatedAt
  );
}
```

---

## 2. Application Layer

### File: `src/application/menu/IUpdateMenuItem.ts` (NEW)

```typescript
import type { MenuItem } from '@/domain/menu/entities/MenuItem';

export interface IUpdateMenuItem {
  execute(id: string, text: string): Promise<MenuItem>;
}
```

### File: `src/application/menu/UpdateMenuItem.ts` (NEW)

```typescript
import { inject, injectable } from 'tsyringe';
import type { MenuItemRepository } from '@/domain/menu/repositories/MenuItemRepository';
import type { IUpdateMenuItem } from '@/application/menu/IUpdateMenuItem';
import { MenuItem } from '@/domain/menu/entities/MenuItem';
import { MenuItemText } from '@/domain/menu/value-objects/MenuItemText';

@injectable()
export class UpdateMenuItem implements IUpdateMenuItem {
  constructor(
    @inject('MenuItemRepository')
    private readonly repository: MenuItemRepository
  ) {}

  async execute(id: string, text: string): Promise<MenuItem> {
    const existingItem = await this.repository.findById(id);
    if (!existingItem) {
      throw new Error('Menu item not found');
    }

    const menuItemText = MenuItemText.create(text);
    const updatedItem = existingItem.withText(menuItemText);

    return this.repository.save(updatedItem);
  }
}
```

---

## 3. Infrastructure Layer

### File: `src/infrastructure/container.ts`

Add import and registration:

```typescript
import { UpdateMenuItem } from '@/application/menu/UpdateMenuItem';

// In container registration section:
container.register('IUpdateMenuItem', { useClass: UpdateMenuItem });
```

---

## 4. API Layer

### File: `src/app/api/settings/menu/types.ts`

Add types:

```typescript
export interface UpdateMenuItemRequest {
  text: string;
}

export interface UpdateMenuItemResponse {
  message: string;
  item: MenuItemDTO;
}
```

### File: `src/app/api/settings/menu/[id]/route.ts`

Add PATCH handler alongside existing DELETE:

```typescript
import type { UpdateMenuItem } from '@/application/menu/UpdateMenuItem';
import type {
  UpdateMenuItemRequest,
  UpdateMenuItemResponse,
} from '@/app/api/settings/menu/types';

export const PATCH = withApi(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const logger = container.resolve<Logger>('Logger');
    const { id } = await params;

    try {
      const body = (await request.json()) as UpdateMenuItemRequest;

      if (!body.text || typeof body.text !== 'string') {
        return NextResponse.json(
          { error: 'Menu item text is required' },
          { status: 400 }
        );
      }

      const updateMenuItem =
        container.resolve<UpdateMenuItem>('IUpdateMenuItem');
      const menuItem = await updateMenuItem.execute(id, body.text);

      const response: UpdateMenuItemResponse = {
        message: 'Menu item updated successfully',
        item: {
          id: menuItem.id,
          text: menuItem.text.value,
          position: menuItem.position,
        },
      };

      logger.info('Menu item updated successfully', { id });
      return NextResponse.json(response);
    } catch (error) {
      logger.logErrorWithObject(error, 'Error updating menu item');

      if (error instanceof Error) {
        if (error.message === 'Menu item not found') {
          return NextResponse.json({ error: error.message }, { status: 404 });
        }
        if (
          error.message.includes('cannot be empty') ||
          error.message.includes('cannot exceed')
        ) {
          return NextResponse.json({ error: error.message }, { status: 400 });
        }
      }

      return NextResponse.json(
        { error: 'Failed to update menu item' },
        { status: 500 }
      );
    }
  },
  { requireAuth: true }
);
```

---

## 5. Presentation Layer

### File: `src/presentation/admin/components/MenuConfigForm.tsx`

Key changes to SortableMenuItem component:

1. Add edit state: `isEditing`, `editText`
2. Add handlers: `handleEditStart`, `handleEditSave`, `handleEditCancel`
3. Replace static Text with conditional Input when editing
4. Add edit icon button (FiEdit2 from react-icons/fi)

```typescript
// In SortableMenuItem props, add:
onEdit: (id: string, text: string) => void;
isUpdating: boolean;

// In SortableMenuItem component:
const [isEditing, setIsEditing] = useState(false);
const [editText, setEditText] = useState(item.text);

// Replace Text component with:
{isEditing ? (
  <Input
    value={editText}
    onChange={(e) => setEditText(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === 'Enter') handleSave();
      if (e.key === 'Escape') handleCancel();
    }}
    onBlur={handleSave}
    autoFocus
    maxLength={100}
  />
) : (
  <Text onClick={() => setIsEditing(true)} cursor="pointer">
    {item.text}
  </Text>
)}
```

---

## Testing Checklist

Manual testing steps:

1. [ ] Click on menu item text - should become editable
2. [ ] Modify text and press Enter - should save
3. [ ] Modify text and click away - should save
4. [ ] Press Escape while editing - should cancel
5. [ ] Save empty text - should show error
6. [ ] Save text > 100 chars - should show error
7. [ ] Verify position unchanged after edit
8. [ ] Refresh page - verify changes persisted
9. [ ] Test in dark mode - verify contrast

---

## Related Files

| File                                                   | Action            |
| ------------------------------------------------------ | ----------------- |
| `src/domain/menu/entities/MenuItem.ts`                 | Add withText()    |
| `src/application/menu/IUpdateMenuItem.ts`              | Create            |
| `src/application/menu/UpdateMenuItem.ts`               | Create            |
| `src/infrastructure/container.ts`                      | Register use case |
| `src/app/api/settings/menu/types.ts`                   | Add types         |
| `src/app/api/settings/menu/[id]/route.ts`              | Add PATCH         |
| `src/presentation/admin/components/MenuConfigForm.tsx` | Add editing       |
