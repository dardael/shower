# Research: Header Menu Text Color Configuration

**Feature**: 050-header-menu-text-color  
**Date**: 2025-12-26  
**Status**: Complete

## Research Questions

### 1. How does the existing color context infrastructure work?

**Decision**: Follow ThemeColorContext pattern for HeaderMenuTextColorContext

**Rationale**:

- ThemeColorContext provides proven pattern for color state management
- Includes localStorage caching, API sync, cross-tab synchronization
- Follows established architecture with hooks and providers

**Alternatives Considered**:

- Embed in ThemeColorContext: Rejected - violates single responsibility
- Use Chakra UI color mode: Rejected - not suitable for custom color values

### 2. What color format should be used for text color storage?

**Decision**: Use hex color format (e.g., `#000000`, `#ffffff`)

**Rationale**:

- Consistent with existing color storage patterns (theme colors, background colors)
- Universal browser support
- Easy to validate and display in color picker
- Compact storage format

**Alternatives Considered**:

- RGB format: Rejected - more verbose, harder to store
- Named colors: Rejected - limited palette, less flexible
- HSL format: Rejected - not aligned with existing patterns

### 3. What should be the default text color?

**Decision**: Use `#000000` (black) as default

**Rationale**:

- Black text provides maximum readability on light backgrounds
- Common web convention for default text
- Safe default that works in most cases
- User can override for their specific branding needs

**Alternatives Considered**:

- White: Rejected - poor contrast on light backgrounds
- Theme-dependent: Rejected - adds complexity, violates KISS
- Inherit from theme: Rejected - user wants explicit control

### 4. How to integrate with export/import system?

**Decision**: Add new setting key to settings infrastructure, auto-included in export

**Rationale**:

- Existing settings export includes all WebsiteSettings automatically
- New HEADER_MENU_TEXT_COLOR key will be exported with other settings
- Import handles new keys gracefully through existing infrastructure

**Alternatives Considered**:

- Separate export format: Rejected - unnecessary complexity
- Manual export handling: Rejected - violates DRY

### 5. Where should the color picker appear in admin UI?

**Decision**: Add to Website Settings form, in Header Menu section alongside background color (feature 049)

**Rationale**:

- Groups related header menu settings together
- Consistent with existing settings organization
- Allows side-by-side preview of background and text colors

**Alternatives Considered**:

- Separate settings page: Rejected - unnecessary navigation
- Theme settings section: Rejected - less intuitive grouping

### 6. Should contrast validation be enforced?

**Decision**: No automatic contrast validation; user responsibility

**Rationale**:

- Per spec edge case: "system allows the configuration but does not enforce contrast"
- Maintains simplicity (KISS)
- Avoids blocking valid design choices
- Administrator has final say on branding

**Alternatives Considered**:

- Warning on poor contrast: Rejected - adds complexity, may be annoying
- Block invalid combinations: Rejected - per spec, not required

## Technical Findings

### Existing Infrastructure to Reuse

1. **Context Pattern**: `ThemeColorContext.tsx` provides template for:
   - Context creation with createContext
   - Provider component with state management
   - Custom hook for consuming context
   - localStorage caching
   - API synchronization

2. **API Route Pattern**: `/api/settings/theme-color/route.ts` provides template for:
   - GET handler with dependency injection
   - POST handler with validation
   - Error handling and logging
   - Response formatting

3. **Settings Repository**: `MongooseWebsiteSettingsRepository.ts` handles:
   - Key-value storage in MongoDB
   - Default values for missing settings
   - CRUD operations for settings

4. **Color Selector Pattern**: `ThemeColorSelector.tsx` provides template for:
   - Color picker with preview
   - Save/Cancel buttons
   - Toast notifications for feedback
   - Loading states

### Files to Reference

| Pattern      | Reference File                                                                  |
| ------------ | ------------------------------------------------------------------------------- |
| Context      | `src/presentation/shared/contexts/ThemeColorContext.tsx`                        |
| API Route    | `src/app/api/settings/theme-color/route.ts`                                     |
| Use Case     | `src/application/settings/use-cases/UpdateThemeColor.ts`                        |
| Repository   | `src/infrastructure/settings/repositories/MongooseWebsiteSettingsRepository.ts` |
| Selector UI  | `src/presentation/admin/components/ThemeColorSelector.tsx`                      |
| Setting Keys | `src/domain/settings/constants/SettingKeys.ts`                                  |

## Resolution Summary

All NEEDS CLARIFICATION items resolved. Ready for Phase 1 design.
