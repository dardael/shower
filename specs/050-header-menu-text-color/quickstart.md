# Quickstart: Header Menu Text Color Configuration

**Feature**: 050-header-menu-text-color  
**Date**: 2025-12-26

## Overview

This feature adds administrator configuration for header menu text color. It follows the established settings infrastructure patterns and integrates with the existing header menu components.

## Key Files

### Domain Layer

| File                                                       | Purpose                          |
| ---------------------------------------------------------- | -------------------------------- |
| `src/domain/settings/constants/SettingKeys.ts`             | Add `HEADER_MENU_TEXT_COLOR` key |
| `src/domain/settings/value-objects/HeaderMenuTextColor.ts` | Value object for type safety     |

### Application Layer

| File                                                                | Purpose                        |
| ------------------------------------------------------------------- | ------------------------------ |
| `src/application/settings/interfaces/IGetHeaderMenuTextColor.ts`    | Get use case interface         |
| `src/application/settings/interfaces/IUpdateHeaderMenuTextColor.ts` | Update use case interface      |
| `src/application/settings/use-cases/GetHeaderMenuTextColor.ts`      | Get use case implementation    |
| `src/application/settings/use-cases/UpdateHeaderMenuTextColor.ts`   | Update use case implementation |

### Infrastructure Layer

| File                                                   | Purpose                 |
| ------------------------------------------------------ | ----------------------- |
| `src/app/api/settings/header-menu-text-color/route.ts` | API endpoint (GET/POST) |

### Presentation Layer

| File                                                                       | Purpose                   |
| -------------------------------------------------------------------------- | ------------------------- |
| `src/presentation/shared/contexts/HeaderMenuTextColorContext.tsx`          | React context + provider  |
| `src/presentation/admin/components/HeaderMenuTextColorSelector.tsx`        | Admin color picker UI     |
| `src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenu.tsx` | Update to consume context |

## Implementation Steps

### Step 1: Add Setting Key

Add to `SettingKeys.ts`:

```typescript
HEADER_MENU_TEXT_COLOR: 'header-menu-text-color';
```

### Step 2: Create Value Object

Create `HeaderMenuTextColor.ts` following `BackgroundColor.ts` pattern with hex validation.

### Step 3: Create Use Cases

Follow `UpdateThemeColor.ts` pattern for both get and update use cases.

### Step 4: Create API Route

Follow `/api/settings/theme-color/route.ts` pattern with GET (public) and POST (admin-protected).

### Step 5: Create Context

Follow `ThemeColorContext.tsx` pattern with:

- Context creation
- Provider with state management
- useHeaderMenuTextColor hook
- localStorage caching
- API synchronization

### Step 6: Create Admin UI

Follow `ThemeColorSelector.tsx` pattern with:

- Color picker input
- Live preview
- Save button with toast feedback
- French labels

### Step 7: Update PublicHeaderMenu

Replace hardcoded `color={{ base: 'black', _dark: 'white' }}` with dynamic color from context.

## Reference Patterns

| Pattern      | Reference File                       |
| ------------ | ------------------------------------ |
| Context      | `ThemeColorContext.tsx`              |
| API Route    | `/api/settings/theme-color/route.ts` |
| Use Case     | `UpdateThemeColor.ts`                |
| Value Object | `BackgroundColor.ts`                 |
| Selector UI  | `ThemeColorSelector.tsx`             |

## Testing Notes

- Tests only when explicitly requested
- Focus on unit tests for value object validation
- Integration tests for API endpoints if needed

## French Labels

| Purpose         | French Text                       |
| --------------- | --------------------------------- |
| Section title   | "Couleur du texte du menu"        |
| Save button     | "Enregistrer"                     |
| Success message | "Couleur du texte enregistrée"    |
| Error message   | "Erreur lors de l'enregistrement" |
