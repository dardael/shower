# Research: Header Logo Configuration

**Feature**: 008-header-logo  
**Date**: 2025-11-29

## Research Summary

This feature follows well-established patterns in the codebase. No significant unknowns require external research.

## Decision Log

### 1. Logo Storage Approach

**Decision**: Extend existing FileStorageService with logo-specific methods

**Rationale**:

- Existing `LocalFileStorageService` already handles file uploads for website icons
- Same validation logic applies (file type, size limits)
- Same storage pattern works (public/icons directory, API route for serving)
- DRY principle: reuse existing infrastructure

**Alternatives Considered**:

- Create separate LogoStorageService: Rejected (unnecessary duplication)
- Store logo in database as base64: Rejected (performance issues for larger images)
- Use external CDN: Rejected (over-engineering for showcase website)

### 2. Logo Metadata Storage

**Decision**: Store logo metadata in WebsiteSettings collection with new key `header-logo`

**Rationale**:

- Follows existing pattern for website icon (uses `website-icon` key)
- Uses established WebsiteSettingsRepository and WebsiteSetting entity
- Consistent with other site-wide settings
- Simple key-value storage approach

**Alternatives Considered**:

- Create dedicated Logo collection: Rejected (over-engineering, single logo only)
- Store in Menu collection: Rejected (logo is independent of menu items)

### 3. HeaderLogo Value Object

**Decision**: Create new HeaderLogo value object similar to WebsiteIcon

**Rationale**:

- Encapsulates logo validation rules
- Maintains domain model integrity
- Follows existing WebsiteIcon pattern
- Allows different validation rules if needed (e.g., different max size)

**Alternatives Considered**:

- Reuse WebsiteIcon: Rejected (different semantic meaning, may need different constraints)
- Use plain object: Rejected (violates DDD principles)

### 4. Admin UI Integration

**Decision**: Add logo upload section above menu items in MenuConfigForm

**Rationale**:

- User explicitly requested configuration in menu configuration screen
- Logo and menu are visually related (both appear in header)
- Single page for header configuration makes sense
- Reuse existing ImageManager component

**Alternatives Considered**:

- Create separate logo configuration page: Rejected (user specified menu screen)
- Add to website settings page: Rejected (user specified menu screen)

### 5. Public API Design

**Decision**: Create dedicated public endpoint `/api/public/logo` separate from menu endpoint

**Rationale**:

- Follows existing pattern (separate `/api/public/menu` endpoint)
- Allows independent caching strategies
- Clear separation of concerns
- Logo and menu items are different data types

**Alternatives Considered**:

- Include logo in menu response: Rejected (mixing concerns, complicates caching)
- Fetch via admin endpoint: Rejected (requires auth, not suitable for public)

### 6. Logo Display in Header

**Decision**: Add logo as first element in header flex container, before navigation

**Rationale**:

- User specified "left of the header menu"
- Natural reading order (logo, then navigation)
- Consistent with standard website conventions
- Simple CSS positioning

**Alternatives Considered**:

- Separate logo container outside nav: Rejected (more complex layout)
- Logo after navigation: Rejected (user specified left position)

### 7. Logo Sizing

**Decision**: Fixed maximum height (40px on desktop, 32px on mobile) with auto width to maintain aspect ratio

**Rationale**:

- Prevents logo from overwhelming navigation
- Consistent with header padding/height
- Responsive scaling
- No user-configurable sizing (YAGNI)

**Alternatives Considered**:

- User-configurable size: Rejected (YAGNI, adds complexity)
- Percentage-based sizing: Rejected (inconsistent results)
- Fixed width: Rejected (breaks aspect ratio for different logo shapes)

### 8. Missing Logo Handling

**Decision**: Display header without logo area when no logo configured

**Rationale**:

- Graceful degradation
- No placeholder or default logo needed
- Menu items shift left when no logo
- Simplest implementation

**Alternatives Considered**:

- Show placeholder icon: Rejected (adds visual clutter)
- Reserve space for logo: Rejected (wastes space when not configured)

## Technical Validation

### Existing Patterns Verified

| Pattern                      | File Location                                                                | Reusable?                          |
| ---------------------------- | ---------------------------------------------------------------------------- | ---------------------------------- |
| Value object with validation | `src/domain/settings/value-objects/WebsiteIcon.ts`                           | Yes - template for HeaderLogo      |
| File upload service          | `src/infrastructure/shared/services/FileStorageService.ts`                   | Yes - extend with logo methods     |
| Settings storage             | `src/domain/settings/constants/SettingKeys.ts`                               | Yes - add HEADER_LOGO key          |
| Use case pattern             | `src/application/settings/GetWebsiteIcon.ts`                                 | Yes - template for logo use cases  |
| Admin API with auth          | `src/app/api/settings/icon/route.ts`                                         | Yes - template for logo API        |
| Public API                   | `src/app/api/public/menu/route.ts`                                           | Yes - template for public logo API |
| ImageManager component       | `src/presentation/shared/components/ImageManager/`                           | Yes - direct reuse                 |
| Public header hook           | `src/presentation/shared/components/PublicHeaderMenu/usePublicHeaderMenu.ts` | Yes - extend for logo              |

### File Size Limit

**Decision**: 2MB maximum for header logo

**Rationale**:

- Logos should be optimized images
- 2MB is generous for logo files
- Matches ImageManager default
- Prevents excessively large files

## No Clarifications Needed

All technical decisions can be made based on:

1. Existing codebase patterns
2. User requirements (logo left of menu, configured in menu screen)
3. Standard web conventions
4. Constitution principles (YAGNI, DRY, KISS)
