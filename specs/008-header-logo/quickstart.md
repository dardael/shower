# Quickstart: Header Logo Configuration

**Feature**: 008-header-logo  
**Date**: 2025-11-29

## Overview

This feature adds header logo configuration capability to the admin dashboard menu screen and displays the logo on the public site header.

## Prerequisites

- Docker and docker-compose installed
- Node.js 18+ (for local development)
- MongoDB running (via docker-compose)
- Existing menu configuration page functional

## Development Setup

```bash
# Start development environment
docker compose up app

# Run in separate terminal for file watching
docker compose run --rm app npm run dev
```

## Implementation Order

### Phase 1: Domain Layer

1. **Add setting key** (`src/domain/settings/constants/SettingKeys.ts`):

   ```typescript
   export const VALID_SETTING_KEYS = {
     // ... existing keys
     HEADER_LOGO: 'header-logo',
   } as const;
   ```

2. **Create HeaderLogo value object** (`src/domain/settings/value-objects/HeaderLogo.ts`):
   - Similar structure to WebsiteIcon
   - 2MB max file size
   - Supported formats: PNG, JPG, SVG, GIF, WebP

### Phase 2: Application Layer

3. **Create GetHeaderLogo use case** (`src/application/settings/GetHeaderLogo.ts`):
   - Interface: `IGetHeaderLogo`
   - Returns `HeaderLogo | null`

4. **Create UpdateHeaderLogo use case** (`src/application/settings/UpdateHeaderLogo.ts`):
   - Interface: `IUpdateHeaderLogo`
   - Accepts `HeaderLogo | null`

5. **Register in container** (`src/infrastructure/container.ts`):
   ```typescript
   container.register('IGetHeaderLogo', { useClass: GetHeaderLogo });
   container.register('IUpdateHeaderLogo', { useClass: UpdateHeaderLogo });
   ```

### Phase 3: Infrastructure Layer

6. **Extend FileStorageService** (`src/infrastructure/shared/services/FileStorageService.ts`):
   - Add `uploadLogo()` method (similar to `uploadIcon()`)
   - Add `deleteLogo()` method (similar to `deleteIcon()`)
   - Use `logo-` prefix for filenames

### Phase 4: API Layer

7. **Create admin logo API** (`src/app/api/settings/logo/route.ts`):
   - GET: Retrieve current logo
   - POST: Upload/replace logo
   - DELETE: Remove logo
   - Protected by withApi wrapper

8. **Create public logo API** (`src/app/api/public/logo/route.ts`):
   - GET only, no authentication
   - Returns logo data or null

### Phase 5: Presentation Layer (Admin)

9. **Update MenuConfigForm** (`src/presentation/admin/components/MenuConfigForm.tsx`):
   - Add logo upload section above menu items
   - Reuse ImageManager component
   - Add logo state management
   - Add upload/replace/delete handlers

### Phase 6: Presentation Layer (Public)

10. **Update usePublicHeaderMenu hook** (`src/presentation/shared/components/PublicHeaderMenu/usePublicHeaderMenu.ts`):
    - Add logo fetching from `/api/public/logo`
    - Return logo data alongside menu items

11. **Update PublicHeaderMenu component** (`src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenu.tsx`):
    - Add logo display before navigation items
    - Handle logo loading/error states
    - Responsive sizing (40px desktop, 32px mobile)

12. **Update types** (`src/presentation/shared/components/PublicHeaderMenu/types.ts`):
    - Add LogoData interface
    - Update component props

## Testing Checklist

### Manual Testing

- [ ] Admin can upload a logo (PNG, JPG, SVG, GIF, WebP)
- [ ] Logo preview displays after upload
- [ ] Admin can replace existing logo
- [ ] Admin can delete logo
- [ ] Logo persists after page refresh
- [ ] Logo displays on public site header
- [ ] Logo displays correctly in light mode
- [ ] Logo displays correctly in dark mode
- [ ] Header renders correctly without logo
- [ ] Header renders correctly when logo fails to load

### Validation Testing

- [ ] Reject files over 2MB
- [ ] Reject invalid file types
- [ ] Handle network errors gracefully

## Key Files Reference

| File                                                                       | Purpose                      |
| -------------------------------------------------------------------------- | ---------------------------- |
| `src/domain/settings/value-objects/HeaderLogo.ts`                          | Value object with validation |
| `src/application/settings/GetHeaderLogo.ts`                                | Get logo use case            |
| `src/application/settings/UpdateHeaderLogo.ts`                             | Update logo use case         |
| `src/app/api/settings/logo/route.ts`                                       | Admin API endpoints          |
| `src/app/api/public/logo/route.ts`                                         | Public API endpoint          |
| `src/presentation/admin/components/MenuConfigForm.tsx`                     | Admin upload UI              |
| `src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenu.tsx` | Public display               |

## Patterns to Follow

- **Value Object**: Copy `WebsiteIcon.ts` structure
- **Use Case**: Copy `GetWebsiteIcon.ts` structure
- **API Route**: Copy `src/app/api/settings/icon/route.ts` structure
- **Public API**: Copy `src/app/api/public/menu/route.ts` structure
- **Image Upload**: Reuse `ImageManager` component

## Common Issues

### Logo not displaying

- Check browser console for errors
- Verify API returns logo data
- Check image URL is accessible

### Upload fails

- Verify file size < 2MB
- Verify file type is supported
- Check API route is protected correctly

### Logo missing after restart

- Verify MongoDB is persisting data
- Check WebsiteSettings collection for `header-logo` key
