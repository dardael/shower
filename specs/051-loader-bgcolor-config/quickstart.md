# Quickstart: Loader Background Color Configuration

**Feature**: 051-loader-bgcolor-config
**Date**: 2025-12-28

## Overview

This feature allows administrators to configure the background color of loading screens to match custom loader animations or website branding.

## Implementation Order

### Phase 1: Domain Layer

1. Add `LOADER_BACKGROUND_COLOR` constant to `src/domain/settings/constants/SettingKeys.ts`
2. Create `LoaderBackgroundColor` value object in `src/domain/settings/value-objects/`
3. Add factory method `createLoaderBackgroundColor()` to `WebsiteSetting` entity

### Phase 2: Infrastructure Layer

4. Create `GetLoaderBackgroundColor` use case in `src/application/settings/use-cases/`
5. Create `SetLoaderBackgroundColor` use case in `src/application/settings/use-cases/`

### Phase 3: API Layer

6. Create admin endpoint at `src/app/api/settings/loader-background-color/route.ts`
7. Create public endpoint at `src/app/api/public/loader-background-color/route.ts`

### Phase 4: Presentation Layer

8. Create `LoaderBackgroundColorContext` in `src/presentation/shared/contexts/`
9. Create `useLoaderBackgroundColor` hook in `src/presentation/admin/hooks/`
10. Create `LoaderBackgroundColorSelector` component in `src/presentation/admin/components/`
11. Integrate selector into admin settings page
12. Update `PublicPageLoader` to accept and apply background color

### Phase 5: Integration

13. Increment package version to 1.1 in `PackageVersion.ts`
14. Add integration tests

## Key Files to Modify

| File                                                      | Change                  |
| --------------------------------------------------------- | ----------------------- |
| `src/domain/settings/constants/SettingKeys.ts`            | Add new constant        |
| `src/domain/settings/entities/WebsiteSetting.ts`          | Add factory method      |
| `src/presentation/shared/components/PublicPageLoader.tsx` | Accept bgcolor prop     |
| `src/domain/config/value-objects/PackageVersion.ts`       | Increment minor version |

## Key Files to Create

| File                                                                  | Purpose       |
| --------------------------------------------------------------------- | ------------- |
| `src/domain/settings/value-objects/LoaderBackgroundColor.ts`          | Value object  |
| `src/application/settings/use-cases/GetLoaderBackgroundColor.ts`      | Get use case  |
| `src/application/settings/use-cases/SetLoaderBackgroundColor.ts`      | Set use case  |
| `src/app/api/settings/loader-background-color/route.ts`               | Admin API     |
| `src/app/api/public/loader-background-color/route.ts`                 | Public API    |
| `src/presentation/shared/contexts/LoaderBackgroundColorContext.tsx`   | React context |
| `src/presentation/admin/hooks/useLoaderBackgroundColor.ts`            | Admin hook    |
| `src/presentation/admin/components/LoaderBackgroundColorSelector.tsx` | Color picker  |

## Dependencies

- Existing `WebsiteSetting` entity and repository
- Existing `MongooseWebsiteSettingsRepository`
- Chakra UI color system
- BetterAuth for admin authentication

## Testing Strategy

1. **Unit tests**: Value object validation, use cases
2. **Integration tests**: API endpoints, context providers
3. **E2E tests**: Full flow from admin UI to public loader display

## Reference Implementations

- `BackgroundColorSelector` component for color picker UI pattern
- `BackgroundColorContext` for context provider pattern
- `/api/settings/loader` endpoints for API structure
