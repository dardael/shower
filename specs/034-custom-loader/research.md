# Research: Custom Loader Configuration

**Feature**: 034-custom-loader  
**Date**: 2025-12-15

## Research Summary

All technical decisions resolved through codebase analysis. No external research required.

---

## Decision 1: File Storage Location

**Decision**: Store custom loader files in `public/loaders/` directory

**Rationale**:

- Follows existing pattern used by `public/icons/` and `public/page-content-images/`
- Enables direct static file serving with proper caching
- Consistent with FileStorageService architecture

**Alternatives Considered**:

- Store in database as blob: Rejected - unnecessary complexity, poor performance for media files
- External CDN: Rejected - over-engineering for single-tenant showcase site (YAGNI)

---

## Decision 2: Settings Storage Pattern

**Decision**: Use existing `WebsiteSetting` entity with `CUSTOM_LOADER` key storing an object with `url` and `metadata`

**Rationale**:

- Matches existing patterns for `HEADER_LOGO` and `WEBSITE_ICON` which store `{ url, metadata }` objects
- Reuses existing settings API infrastructure
- No new entity types needed (DRY)

**Alternatives Considered**:

- New CustomLoader entity with repository: Rejected - over-engineering, existing WebsiteSetting handles this pattern
- Separate configuration file: Rejected - inconsistent with existing settings architecture

---

## Decision 3: Video Format Support

**Decision**: Support MP4 (H.264) and WebM (VP8/VP9) formats plus GIF

**Rationale**:

- MP4: Universal browser support, best compression for quality
- WebM: Open format, excellent for web, modern browser support
- GIF: Simple animated images, universal support, user expectation

**Alternatives Considered**:

- APNG: Limited browser support
- Lottie/JSON animations: Requires additional library, over-engineering (YAGNI)
- Only GIF: Would limit quality and file size efficiency for longer animations

---

## Decision 4: Public Loader Data Fetching

**Decision**: Add dedicated `/api/public/loader` endpoint, fetch in parallel with other page data in `usePublicPageData` hook

**Rationale**:

- Follows existing pattern for `/api/public/logo`, `/api/public/website-name`
- Parallel fetching prevents blocking page load
- Separation allows caching of loader URL independently

**Alternatives Considered**:

- Include in existing settings bundle: Rejected - would require fetching all settings for public pages
- Inline in HTML: Rejected - would require server-side rendering changes

---

## Decision 5: Fallback Behavior

**Decision**: Show default Chakra UI Spinner until custom loader loads, then transition; fallback to Spinner on any error

**Rationale**:

- Ensures immediate visual feedback (no blank screen)
- Graceful degradation on slow connections or errors
- Maintains accessibility (Spinner has proper ARIA attributes)

**Alternatives Considered**:

- Preload loader before page: Rejected - would delay initial feedback
- Show nothing until loaded: Rejected - poor UX, accessibility concerns

---

## Decision 6: Admin UI Component

**Decision**: Extend WebsiteSettingsForm with a new section using existing upload patterns

**Rationale**:

- Consistent with existing settings form layout
- Reuses existing upload/preview infrastructure
- Single location for all website settings (KISS)

**Alternatives Considered**:

- Separate admin page for loader: Rejected - fragmenting related settings
- Modal-based configuration: Rejected - inconsistent with existing patterns

---

## Decision 7: Export/Import Integration

**Decision**: Include loader file in ZIP export alongside other media, handle in existing ConfigurationService

**Rationale**:

- Follows established pattern for icons and images in export
- Maintains configuration portability (Constitution Principle X)
- Consistent restoration on import

**Alternatives Considered**:

- Exclude from export: Rejected - violates Configuration Portability principle
- Base64 encode in JSON: Rejected - inflates export size unnecessarily

---

## Decision 8: Unit Testing Strategy

**Decision**: Create unit tests for PublicPageLoader component verifying:

1. Custom loader (GIF) displays when configured
2. Custom loader (video) displays when configured
3. Default spinner displays when no custom loader configured
4. Default spinner displays on custom loader load error

**Rationale**:

- User explicitly requested these specific test scenarios
- Tests behavior, not implementation details
- Covers primary acceptance scenarios from spec

**Alternatives Considered**:

- Integration tests only: Not requested, would be heavier
- E2E tests: Not requested, over-engineering for this feature
