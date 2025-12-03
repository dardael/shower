# Quickstart: Background Color Configuration

**Feature**: 017-background-color-config  
**Date**: 2025-12-03

## Overview

This feature adds background color configuration for the public website body. Administrators can select a color from the predefined palette, and it applies to the public site's body background.

---

## Implementation Order

### Layer 1: Domain (Value Objects & Constants)

1. **Add setting key** (`src/domain/settings/constants/SettingKeys.ts`)
   - Add `BACKGROUND_COLOR: 'background-color'` to `VALID_SETTING_KEYS`

2. **Create BackgroundColor value object** (`src/domain/settings/value-objects/BackgroundColor.ts`)
   - Mirror structure of `ThemeColor.ts`
   - Reuse `ThemeColorPalette` for validation
   - Default: `'blue'`

3. **Extend WebsiteSetting entity** (`src/domain/settings/entities/WebsiteSetting.ts`)
   - Add `createBackgroundColor(backgroundColor: BackgroundColor)` factory method
   - Add `isValidBackgroundColorKey(key: string)` validation method
   - Add `createDefaultBackgroundColor()` method

### Layer 2: Application (Use Cases)

4. **Create interfaces**
   - `IGetBackgroundColor.ts`: Interface for get use case
   - `IUpdateBackgroundColor.ts`: Interface for update use case

5. **Create use cases**
   - `GetBackgroundColor.ts`: Retrieve from repository (mirror `GetThemeColor.ts`)
   - `UpdateBackgroundColor.ts`: Save to repository (mirror `UpdateThemeColor.ts`)

### Layer 3: Infrastructure (DI & API)

6. **Register services** (`src/infrastructure/container.ts`)
   - Register `IGetBackgroundColor` → `GetBackgroundColor`
   - Register `IUpdateBackgroundColor` → `UpdateBackgroundColor`
   - Add to `SettingsServiceLocator`

7. **Extend API types** (`src/app/api/settings/types.ts`)
   - Add `backgroundColor?: ThemeColorToken` to `GetSettingsResponse`
   - Add `backgroundColor?: string` to `UpdateSettingsRequest`

8. **Extend API route** (`src/app/api/settings/route.ts`)
   - GET: Fetch and return `backgroundColor`
   - POST: Validate and save `backgroundColor`

### Layer 4: Presentation (UI & State)

9. **Create storage utility** (`src/presentation/shared/utils/BackgroundColorStorage.ts`)
   - Mirror `ThemeColorStorage.ts` pattern
   - Key: `'shower-background-color'`

10. **Create hook** (`src/presentation/shared/hooks/useBackgroundColor.ts`)
    - Mirror `useThemeColor.ts` pattern
    - Initialize from localStorage, sync with server

11. **Create context** (`src/presentation/shared/contexts/BackgroundColorContext.tsx`)
    - Mirror `ThemeColorContext.tsx` pattern
    - Provide background color state to components

12. **Create selector component** (`src/presentation/admin/components/BackgroundColorSelector.tsx`)
    - Mirror `ThemeColorSelector.tsx` pattern
    - Same color palette, different label

13. **Update settings form** (`src/presentation/admin/components/WebsiteSettingsForm.tsx`)
    - Add `BackgroundColorSelector` after `ThemeColorSelector`
    - Wire up state and save logic

14. **Apply to public site** (`src/presentation/shared/components/ui/provider.tsx` or root layout)
    - Use `backgroundColor` from context
    - Apply Chakra color scale (`{color}.50` light, `{color}.900` dark)

---

## Key Files to Modify

| File                      | Change                             |
| ------------------------- | ---------------------------------- |
| `SettingKeys.ts`          | Add `BACKGROUND_COLOR` constant    |
| `WebsiteSetting.ts`       | Add factory/validation methods     |
| `container.ts`            | Register new use cases             |
| `settings/types.ts`       | Extend API types                   |
| `settings/route.ts`       | Handle backgroundColor in GET/POST |
| `WebsiteSettingsForm.tsx` | Add selector component             |

## Key Files to Create

| File                          | Purpose            |
| ----------------------------- | ------------------ |
| `BackgroundColor.ts`          | Value object       |
| `IGetBackgroundColor.ts`      | Interface          |
| `IUpdateBackgroundColor.ts`   | Interface          |
| `GetBackgroundColor.ts`       | Use case           |
| `UpdateBackgroundColor.ts`    | Use case           |
| `BackgroundColorStorage.ts`   | Client storage     |
| `useBackgroundColor.ts`       | React hook         |
| `BackgroundColorContext.tsx`  | React context      |
| `BackgroundColorSelector.tsx` | Admin UI component |

---

## Testing Verification

After implementation, verify:

1. **Admin Panel**: Background color selector appears below theme color selector
2. **Color Selection**: Clicking a color updates the UI immediately
3. **Save**: Changes persist after page refresh
4. **Public Site**: Body background uses the selected color
5. **Dark Mode**: Background adapts appropriately (lighter in light mode, darker in dark mode)

---

## Rollback Plan

If issues occur, revert:

1. Remove `BACKGROUND_COLOR` from `SettingKeys.ts`
2. Remove new files created
3. Revert changes to `route.ts`, `types.ts`, `container.ts`, `WebsiteSettingsForm.tsx`

Database cleanup not required - unused settings are ignored.
