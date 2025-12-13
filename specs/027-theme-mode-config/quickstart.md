# Quickstart: Theme Mode Configuration

**Feature Branch**: `027-theme-mode-config`  
**Created**: 2025-12-13

## Overview

This feature adds administrator control over the website's light/dark mode behavior. Administrators can:

- Force light mode (hide toggle, always light)
- Force dark mode (hide toggle, always dark)
- Allow user choice (show toggle, current behavior)

## Key Files

### Domain Layer

- `src/domain/settings/constants/SettingKeys.ts` - Add `THEME_MODE` key
- `src/domain/settings/value-objects/ThemeModeConfig.ts` - NEW: Value object

### Application Layer

- No new use cases needed - uses existing settings infrastructure

### Infrastructure Layer

- No changes needed - uses existing MongoDB settings repository

### Presentation Layer

- `src/presentation/shared/hooks/useThemeModeConfig.ts` - NEW: Config hook
- `src/presentation/shared/components/DarkModeToggle.tsx` - MODIFY: Conditional render
- `src/presentation/admin/components/ThemeModeSelector.tsx` - NEW: Admin UI

### API Layer

- `src/app/api/settings/route.ts` - MODIFY: Add themeMode to GET/POST

### Test Layer

- `test/unit/presentation/shared/components/DarkModeToggle.test.tsx` - NEW
- `test/unit/presentation/shared/hooks/useThemeModeConfig.test.ts` - NEW
- `test/integration/theme-mode-config.integration.test.tsx` - NEW

## Implementation Order

1. **Add THEME_MODE setting key** - Domain layer constant
2. **Create ThemeModeConfig value object** - Domain layer with validation
3. **Update settings API** - Add themeMode to GET/POST endpoints
4. **Create useThemeModeConfig hook** - Fetch and expose theme mode
5. **Modify DarkModeToggle** - Hide when mode is forced
6. **Apply forced mode** - Set theme via useColorMode when forced
7. **Create admin UI** - ThemeModeSelector component in settings
8. **Write unit tests** - Test forced mode logic and toggle visibility
9. **Write integration tests** - Verify end-to-end behavior

## Testing Commands

```bash
# Run all tests
docker compose run --rm app npm run test

# Run specific test file
docker compose run --rm app npm run test -- --testPathPattern="theme-mode"
```

## Validation Checklist

- [ ] Force light mode hides toggle on public side
- [ ] Force light mode hides toggle on admin side
- [ ] Force dark mode hides toggle on public side
- [ ] Force dark mode hides toggle on admin side
- [ ] User choice shows toggle on both sides
- [ ] Forced mode overrides user localStorage preference
- [ ] Default is user-choice when no setting exists
- [ ] All unit tests pass
- [ ] All integration tests pass
