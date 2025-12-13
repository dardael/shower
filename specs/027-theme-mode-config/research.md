# Research: Theme Mode Configuration

**Feature Branch**: `027-theme-mode-config`  
**Created**: 2025-12-13

## Existing Infrastructure Analysis

### Current Theme Implementation

**Theme Toggle Component**: `src/presentation/shared/components/DarkModeToggle.tsx`

- Uses `next-themes` library via `useColorMode` hook
- Supports different sizes and variants
- Already implemented in both admin and public headers

**Color Mode Provider**: `src/presentation/shared/components/ui/color-mode.tsx`

- Wraps `next-themes` ThemeProvider
- Custom `useColorMode` hook exposes theme switching functionality

**Admin Theme Hook**: `src/presentation/admin/hooks/useTheme.ts`

- Advanced hook with system theme detection
- Uses localStorage (`shower-admin-theme` key)
- Uses `BrowserThemePreference` entity

### Existing Settings Infrastructure

**Setting Keys** (`src/domain/settings/constants/SettingKeys.ts`):

- `WEBSITE_NAME`, `WEBSITE_ICON`, `THEME_COLOR`, `HEADER_LOGO`, `WEBSITE_FONT`, `BACKGROUND_COLOR`
- **Missing**: `THEME_MODE` key

**Settings API**: `src/app/api/settings/route.ts`

- GET returns: name, themeColor, backgroundColor
- POST updates: name, themeColor, backgroundColor
- **Missing**: themeMode in request/response

**Repository**: `src/infrastructure/settings/repositories/MongooseWebsiteSettingsRepository.ts`

- MongoDB key-value storage pattern
- Ready to store new setting keys

## Technical Decisions

### Decision 1: Theme Mode Values

**Decision**: Use string enum values: `"force-light"`, `"force-dark"`, `"user-choice"`

**Rationale**:

- Consistent with existing setting value patterns
- Clear, readable, and self-documenting
- Easy to validate and serialize

**Alternatives Considered**:

- Numeric values (0, 1, 2) - rejected for lack of clarity
- Boolean with null (forceLight: true/false/null) - rejected for complexity

### Decision 2: Default Behavior

**Decision**: Default to `"user-choice"` when no setting exists

**Rationale**:

- Maintains backward compatibility with current behavior
- Users keep existing toggle functionality by default
- Safe fallback if setting fails to load

### Decision 3: Theme Mode Application

**Decision**: Modify existing `DarkModeToggle` component and create a new `useThemeModeConfig` hook

**Rationale**:

- Minimal changes to existing components
- Single source of truth for theme mode configuration
- Both admin and public can consume the same hook

**Implementation Approach**:

1. Add `THEME_MODE` to setting keys
2. Create `ThemeModeConfig` value object in domain layer
3. Add theme mode to settings API (GET/POST)
4. Create `useThemeModeConfig` hook to fetch and cache theme mode
5. Modify `DarkModeToggle` to check theme mode before rendering
6. Apply forced mode via `useColorMode` when configuration is forced

### Decision 4: Test Strategy

**Decision**: Unit tests for forced mode logic + Integration tests for end-to-end verification

**Rationale**:

- Per constitution: "Testing MUST be limited to unit tests and integration tests ONLY when explicitly requested"
- User explicitly requested tests for forced options
- Unit tests verify component logic in isolation
- Integration tests verify admin setting affects both sides

**Test Files**:

- `test/unit/presentation/shared/components/DarkModeToggle.test.tsx` - Toggle visibility tests
- `test/unit/presentation/shared/hooks/useThemeModeConfig.test.ts` - Hook logic tests
- `test/integration/theme-mode-config.integration.test.tsx` - End-to-end verification

## Integration Points

### Files to Modify

1. `src/domain/settings/constants/SettingKeys.ts` - Add THEME_MODE
2. `src/app/api/settings/route.ts` - Add themeMode to GET/POST
3. `src/presentation/shared/components/DarkModeToggle.tsx` - Conditional rendering
4. `src/presentation/shared/components/ui/color-mode.tsx` - Force mode application

### Files to Create

1. `src/domain/settings/value-objects/ThemeModeConfig.ts` - Value object
2. `src/presentation/shared/hooks/useThemeModeConfig.ts` - Config hook
3. `src/presentation/admin/components/ThemeModeSelector.tsx` - Admin UI
4. Test files as listed above

## Risks and Mitigations

| Risk                                    | Mitigation                                            |
| --------------------------------------- | ----------------------------------------------------- |
| Hydration mismatch with SSR             | Use ClientOnly wrapper (already exists)               |
| Race condition on initial load          | Default to user-choice, apply forced mode once loaded |
| localStorage conflicts with forced mode | Clear/ignore localStorage when forced mode active     |
