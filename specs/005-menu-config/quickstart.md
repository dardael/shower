# Quickstart: Menu Configuration

**Branch**: `005-menu-config` | **Date**: 2025-01-28

## Prerequisites

1. Project setup complete (Docker, dependencies installed)
2. MongoDB running and accessible
3. Admin user configured in `.env.local` (ADMIN_EMAIL)

---

## Quick Setup

### 1. Install Dependencies

```bash
docker compose run --rm app npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### 2. Add Sidebar Menu Item (First Priority)

Edit `src/presentation/admin/components/AdminSidebar.tsx`:

```tsx
const menuItems = [
  {
    href: '/admin/menu',
    label: 'Navigation Menu',
    description: 'Configure website navigation',
  },
  // ... existing items
];
```

### 3. Create Domain Layer

```bash
# Create directories
mkdir -p src/domain/menu/entities
mkdir -p src/domain/menu/value-objects
mkdir -p src/domain/menu/repositories
```

Files to create:

- `src/domain/menu/entities/MenuItem.ts`
- `src/domain/menu/value-objects/MenuItemText.ts`
- `src/domain/menu/repositories/MenuItemRepository.ts`

### 4. Create Application Layer

```bash
mkdir -p src/application/menu
```

Files to create:

- `src/application/menu/GetMenuItems.ts`
- `src/application/menu/IGetMenuItems.ts`
- `src/application/menu/AddMenuItem.ts`
- `src/application/menu/IAddMenuItem.ts`
- `src/application/menu/RemoveMenuItem.ts`
- `src/application/menu/IRemoveMenuItem.ts`
- `src/application/menu/ReorderMenuItems.ts`
- `src/application/menu/IReorderMenuItems.ts`

### 5. Create Infrastructure Layer

```bash
mkdir -p src/infrastructure/menu/models
mkdir -p src/infrastructure/menu/repositories
```

Files to create:

- `src/infrastructure/menu/models/MenuItemModel.ts`
- `src/infrastructure/menu/repositories/MongooseMenuItemRepository.ts`

### 6. Register in DI Container

Update `src/infrastructure/container.ts`:

```typescript
// Add imports
import type { MenuItemRepository } from '@/domain/menu/repositories/MenuItemRepository';
import { MongooseMenuItemRepository } from '@/infrastructure/menu/repositories/MongooseMenuItemRepository';
// ... other imports

// Register repository
container.register<MenuItemRepository>('MenuItemRepository', {
  useClass: MongooseMenuItemRepository,
});

// Register use cases
container.register<IGetMenuItems>('IGetMenuItems', { useClass: GetMenuItems });
container.register<IAddMenuItem>('IAddMenuItem', { useClass: AddMenuItem });
container.register<IRemoveMenuItem>('IRemoveMenuItem', {
  useClass: RemoveMenuItem,
});
container.register<IReorderMenuItems>('IReorderMenuItems', {
  useClass: ReorderMenuItems,
});
```

### 7. Create API Routes

```bash
mkdir -p src/app/api/settings/menu
mkdir -p "src/app/api/settings/menu/[id]"
```

Files to create:

- `src/app/api/settings/menu/route.ts` - GET (list), POST (add), PUT (reorder)
- `src/app/api/settings/menu/[id]/route.ts` - DELETE (remove by ID)
- `src/app/api/settings/menu/types.ts` - TypeScript types

### 8. Create Admin Page

```bash
mkdir -p src/app/admin/menu
```

Create `src/app/admin/menu/page.tsx` with the menu configuration form.

### 9. Create Presentation Components

Files to create:

- `src/presentation/admin/components/MenuConfigForm.tsx`
- `src/presentation/admin/hooks/useMenuConfig.ts`

---

## Verification Steps

### 1. Build Check

```bash
docker compose run --rm app npm run build
```

### 2. Lint Check

```bash
docker compose run --rm app npm run lint
```

### 3. Type Check

```bash
docker compose run --rm app npm run build:strict
```

### 4. Test

```bash
docker compose run --rm app npm test
```

---

## Key Implementation Notes

### Drag-and-Drop Pattern

```tsx
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';

function MenuConfigForm() {
  const [items, setItems] = useState([]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      // Call API to persist new order
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        {/* Render sortable items */}
      </SortableContext>
    </DndContext>
  );
}
```

### Following Existing Patterns

- Repository: Follow `MongooseWebsiteSettingsRepository` pattern
- API Route: Follow `/api/settings/route.ts` pattern with `withApi` wrapper
- Use Cases: Follow `UpdateWebsiteName`, `GetWebsiteName` patterns
- Form Component: Follow `WebsiteSettingsForm` pattern

---

## Files Checklist

### Domain Layer

- [ ] `src/domain/menu/entities/MenuItem.ts`
- [ ] `src/domain/menu/value-objects/MenuItemText.ts`
- [ ] `src/domain/menu/repositories/MenuItemRepository.ts`

### Application Layer

- [ ] `src/application/menu/GetMenuItems.ts`
- [ ] `src/application/menu/IGetMenuItems.ts`
- [ ] `src/application/menu/AddMenuItem.ts`
- [ ] `src/application/menu/IAddMenuItem.ts`
- [ ] `src/application/menu/RemoveMenuItem.ts`
- [ ] `src/application/menu/IRemoveMenuItem.ts`
- [ ] `src/application/menu/ReorderMenuItems.ts`
- [ ] `src/application/menu/IReorderMenuItems.ts`

### Infrastructure Layer

- [ ] `src/infrastructure/menu/models/MenuItemModel.ts`
- [ ] `src/infrastructure/menu/repositories/MongooseMenuItemRepository.ts`
- [ ] Update `src/infrastructure/container.ts`

### Presentation Layer

- [ ] Update `src/presentation/admin/components/AdminSidebar.tsx`
- [ ] `src/presentation/admin/components/MenuConfigForm.tsx`
- [ ] `src/presentation/admin/hooks/useMenuConfig.ts`

### API Layer

- [ ] `src/app/api/settings/menu/route.ts` (GET, POST, PUT)
- [ ] `src/app/api/settings/menu/[id]/route.ts` (DELETE)
- [ ] `src/app/api/settings/menu/types.ts`

### Pages

- [ ] `src/app/admin/menu/page.tsx`

### Tests

- [ ] `test/unit/domain/menu/entities/MenuItem.test.ts`
- [ ] `test/unit/application/menu/AddMenuItem.test.ts`
- [ ] `test/unit/application/menu/RemoveMenuItem.test.ts`
- [ ] `test/unit/application/menu/ReorderMenuItems.test.ts`
