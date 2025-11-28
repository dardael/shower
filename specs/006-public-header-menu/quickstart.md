# Quickstart: Public Header Menu

**Feature**: 006-public-header-menu  
**Date**: 2025-11-28

## Overview

This feature adds a header menu to the public-facing pages displaying admin-configured menu items. The header uses the configured theme color and supports light/dark modes.

## Prerequisites

- MongoDB running with menu items collection
- Existing menu items configured via admin panel
- Theme color configured via admin panel (optional - uses default if not set)

## Key Files to Create

### 1. Public API Endpoint

**File**: `src/app/api/public/menu/route.ts`

Creates public endpoint to fetch menu items without authentication.

Pattern: Follow `src/app/api/public/social-networks/route.ts`

### 2. Component Directory

**Directory**: `src/presentation/shared/components/PublicHeaderMenu/`

| File                            | Purpose                        |
| ------------------------------- | ------------------------------ |
| `index.ts`                      | Barrel exports                 |
| `types.ts`                      | TypeScript interfaces          |
| `usePublicHeaderMenu.ts`        | Data fetching hook             |
| `PublicHeaderMenuContainer.tsx` | Container with route detection |
| `PublicHeaderMenuItem.tsx`      | Individual menu item display   |
| `PublicHeaderMenu.tsx`          | Main header component          |

Pattern: Follow `src/presentation/shared/components/SocialNetworksFooter/`

### 3. Layout Integration

**File**: `src/app/layout.tsx`

Add `PublicHeaderMenuContainer` before `{children}` in the root layout.

## Implementation Order

1. Create types and interfaces
2. Create public API endpoint
3. Create data fetching hook
4. Create presentational components
5. Create container component
6. Integrate into root layout

## Testing the Feature

1. Configure menu items in admin: `/admin/menu`
2. Set theme color in admin: `/admin/website-settings`
3. Visit public site root: `/`
4. Verify:
   - Header menu appears at top of page
   - All menu items display in correct order
   - Theme color is applied to header styling
   - Toggle dark mode and verify readability
   - Verify empty state when no menu items configured

## Key Patterns to Follow

### Data Fetching Hook Pattern

```typescript
// Similar to useSocialNetworksFooter.ts
export function usePublicHeaderMenu() {
  const [menuItems, setMenuItems] = useState<PublicMenuItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch from /api/public/menu
  }, []);

  return { menuItems, isLoading, error };
}
```

### Container Pattern

```typescript
// Similar to SocialNetworksFooterContainer.tsx
export function PublicHeaderMenuContainer() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  // Don't render on admin routes
  if (isAdmin) return null;

  // Render header component
}
```

### Theme Color Integration

```typescript
// Use colorPalette for theme color styling
<Box colorPalette={themeColor} bg="colorPalette.solid">
  <Text color="colorPalette.contrast">{text}</Text>
</Box>
```

## Out of Scope Reminders

Do NOT implement:

- Click handlers on menu items
- Mobile hamburger menu
- Sticky/fixed positioning
- Menu item icons
- Dropdown/submenu functionality

These will be separate future features.
