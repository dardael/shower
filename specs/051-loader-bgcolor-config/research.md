# Research: Loader Background Color Configuration

**Feature**: 051-loader-bgcolor-config
**Date**: 2025-12-28

## Research Summary

All technical decisions have been resolved based on existing codebase patterns.

---

## Decision 1: Settings Storage Pattern

**Decision**: Use existing `WebsiteSetting` entity with key-value pattern

**Rationale**:

- Consistent with existing settings (background-color, custom-loader, theme-color)
- Already has MongoDB persistence via `MongooseWebsiteSettingsRepository`
- Automatic integration with export/import system via `VALID_SETTING_KEY_VALUES`

**Alternatives Considered**:

- Separate collection for loader settings → Rejected: Over-engineering, breaks consistency
- Embed in custom-loader setting → Rejected: Violates single responsibility, complicates null handling

---

## Decision 2: Color Picker Component

**Decision**: Create `LoaderBackgroundColorSelector` following `BackgroundColorSelector` pattern

**Rationale**:

- Existing component provides proven UX pattern
- Uses Chakra UI color tokens with proper accessibility
- Grid layout with visual preview already implemented
- Supports both light and dark modes

**Alternatives Considered**:

- Reuse BackgroundColorSelector directly → Rejected: Different use case, may need loader-specific defaults
- Third-party color picker → Rejected: Adds dependency, inconsistent UX

---

## Decision 3: Default Color Behavior

**Decision**: Use white (`#FFFFFF`) for light mode, dark gray (`#1A202C`) for dark mode as defaults

**Rationale**:

- Matches Chakra UI default theme colors
- Ensures proper contrast with default spinner
- Consistent with existing background color defaults

**Alternatives Considered**:

- Single default for all modes → Rejected: Poor UX in dark mode
- Use theme-color as default → Rejected: May not provide enough contrast with loader

---

## Decision 4: API Endpoint Structure

**Decision**: Create dedicated endpoints at `/api/settings/loader-background-color` (admin) and `/api/public/loader-background-color` (public)

**Rationale**:

- Follows existing pattern from custom-loader endpoints
- Separates admin (authenticated) from public (unauthenticated) access
- Simple GET/PUT operations without file handling

**Alternatives Considered**:

- Integrate into main `/api/settings` endpoint → Rejected: Already complex, loader-specific endpoint clearer
- Share with custom-loader endpoint → Rejected: Different data types, complicates error handling

---

## Decision 5: Context Provider Pattern

**Decision**: Create `LoaderBackgroundColorContext` with `useLoaderBackgroundColor` hook

**Rationale**:

- Consistent with existing `BackgroundColorContext` and `ThemeColorContext`
- Enables cross-component state sharing
- Supports localStorage caching for fast initial load

**Alternatives Considered**:

- Props drilling → Rejected: Loader used in multiple locations
- Global state library → Rejected: Overkill for single setting

---

## Decision 6: Export/Import Integration

**Decision**: Add `LOADER_BACKGROUND_COLOR` to `SettingKeys.ts` and increment minor version to 1.1

**Rationale**:

- Automatic inclusion in export via `VALID_SETTING_KEY_VALUES` iteration
- Minor version increment for backward-compatible addition
- No code changes needed in ZipExporter/ZipImporter

**Alternatives Considered**:

- Major version bump → Rejected: Not breaking change
- Custom export handling → Rejected: Unnecessary complexity

---

## Resolved Clarifications

All NEEDS CLARIFICATION items from spec were resolved through research:

1. **Color format**: Hex string (e.g., `#FFFFFF`) - consistent with existing settings
2. **Scope**: Single color for all loading screens (public and admin)
3. **Theme integration**: Separate defaults for light/dark mode, but single configured color applies to both
4. **Validation**: Valid hex color format, 6-digit with # prefix
