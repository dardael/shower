# Research: Public Header Menu

**Feature**: 006-public-header-menu  
**Date**: 2025-11-28

## Research Questions

### 1. Existing Infrastructure Analysis

**Question**: What existing infrastructure can be reused for the public header menu?

**Research Findings**:

1. **Menu Data Access**
   - `GetMenuItems` use case already exists at `src/application/menu/GetMenuItems.ts`
   - `MenuItem` entity exists at `src/domain/menu/entities/MenuItem.ts` with id, text, and position attributes
   - `MongooseMenuItemRepository` exists at `src/infrastructure/menu/repositories/MongooseMenuItemRepository.ts`
   - Menu items are already sorted by position in the repository

2. **Theme Color Access**
   - `useThemeColor` hook exists at `src/presentation/shared/hooks/useThemeColor.ts`
   - `ThemeColorContext` provides theme color to components
   - `ThemeColorStorage` handles localStorage caching and server sync
   - Theme color is available as a Chakra UI color token (e.g., 'blue', 'red', 'green')

3. **Public API Pattern**
   - Public API endpoint pattern established at `src/app/api/public/social-networks/route.ts`
   - Uses internal fetch to authenticated endpoint with cache tags
   - Returns simplified DTO for public consumption
   - No authentication required

4. **Component Pattern**
   - SocialNetworksFooter provides excellent pattern for public components
   - Container component handles data fetching and routing logic
   - Presentational component handles rendering
   - Hook encapsulates data fetching logic
   - Types file defines interfaces

**Decision**: Reuse all existing infrastructure. Create new public API endpoint following social-networks pattern. Create new component following SocialNetworksFooter pattern.

**Rationale**: Maximum code reuse, consistent patterns, minimal new code. Existing infrastructure is well-tested and follows DDD/Hexagonal architecture.

---

### 2. Header Component Design

**Question**: How should the header menu component be structured for light/dark mode and theme color support?

**Research Findings**:

1. **Chakra UI v3 Color Patterns**
   - Use semantic tokens: `bg="bg.subtle"`, `color="fg"`, `borderColor="border"`
   - Use `colorPalette` for theme color: `colorPalette={themeColor}`
   - Dark mode handled automatically by Chakra's color mode system
   - Use virtual colors: `bg="colorPalette.solid"`, `color="colorPalette.contrast"`

2. **Header Placement in Layout**
   - Root layout at `src/app/layout.tsx` already includes Provider and SocialNetworksFooterContainer
   - Header should be added before `{children}` in the layout
   - Container component should hide header on admin routes (like footer does)

3. **Non-Clickable Items**
   - Use `Text` component instead of `Link` or `Button`
   - No href or onClick handlers
   - Apply `cursor="default"` to make it clear items are not interactive

**Decision**:

- Use Chakra semantic tokens for light/dark mode
- Use `colorPalette` prop with theme color for accent styling
- Add header container in root layout before children
- Use Box/Flex/Text components for simple non-interactive menu

**Rationale**: Follows existing patterns, leverages Chakra's built-in dark mode support, minimal implementation for current requirements.

---

### 3. Public Menu API Design

**Question**: What should the public menu API endpoint return?

**Research Findings**:

1. **Existing Admin API Response**

   ```typescript
   interface GetMenuItemsResponse {
     items: MenuItemDTO[];
   }
   interface MenuItemDTO {
     id: string;
     text: string;
     position: number;
   }
   ```

2. **Public API Pattern (from social-networks)**
   - Wrap response in `{ success: boolean, data: T[], error?: string }`
   - Transform to public DTO with only necessary fields
   - No authentication check needed
   - Use fetch with cache tags for invalidation

3. **Public Menu Requirements**
   - Only need `text` and `position` for display
   - `id` not needed for non-clickable items (but useful for future navigation)
   - Items must be ordered by position (already handled by repository)

**Decision**: Create `/api/public/menu` endpoint returning:

```typescript
{
  success: true,
  data: [
    { id: string, text: string, position: number }
  ]
}
```

**Rationale**: Consistent with social-networks pattern. Keep id for future navigation feature. Position included for potential reordering on client-side if needed.

---

## Alternatives Considered

### Server-Side Rendering vs Client-Side Fetching

**Option A**: Server-side data fetching in layout (rejected)

- Would require layout to be async
- More complex SSR hydration
- Not consistent with existing patterns

**Option B**: Client-side fetching with hook (selected)

- Consistent with SocialNetworksFooter pattern
- Simpler implementation
- Menu appears after initial load (acceptable for this feature)

### Direct Repository Access vs Public API

**Option A**: Direct repository access in server component (rejected)

- Would bypass existing API layer
- Inconsistent with hexagonal architecture
- No caching/invalidation strategy

**Option B**: Public API endpoint (selected)

- Follows existing patterns
- Enables caching with tags
- Maintains clean architecture

---

## Dependencies

| Dependency        | Version | Purpose                   | Status   |
| ----------------- | ------- | ------------------------- | -------- |
| Chakra UI         | v3      | UI components and theming | Existing |
| Next.js           | 15      | App Router, API routes    | Existing |
| tsyringe          | -       | Dependency injection      | Existing |
| GetMenuItems      | -       | Application use case      | Existing |
| MenuItem          | -       | Domain entity             | Existing |
| ThemeColorContext | -       | Theme color access        | Existing |

---

## Resolved Clarifications

All technical decisions have been made based on existing patterns. No external clarification needed.
