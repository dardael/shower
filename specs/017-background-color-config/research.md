# Research: Background Color Configuration

**Feature**: 017-background-color-config  
**Date**: 2025-12-03

## Research Summary

This document consolidates research findings for implementing background color configuration. All technical decisions leverage existing patterns in the codebase.

---

## Decision 1: Color Palette Approach

**Decision**: Reuse the existing `ThemeColorPalette` for background colors.

**Rationale**:

- Same predefined color tokens (`blue`, `red`, `green`, `purple`, `orange`, `teal`, `pink`, `cyan`) provide visual consistency
- Existing validation functions (`isValidThemeColor`) can be reused
- Reduces code duplication (DRY principle)
- Users already familiar with the color selection UI

**Alternatives Considered**:

- Create separate `BackgroundColorPalette`: Rejected - adds unnecessary complexity, violates KISS
- Use hex color picker: Rejected - would require contrast validation, increases scope beyond requirement

---

## Decision 2: Value Object Pattern

**Decision**: Create `BackgroundColor` value object mirroring `ThemeColor` structure.

**Rationale**:

- Follows existing DDD pattern in `src/domain/settings/value-objects/`
- Provides type safety with `ThemeColorToken` type
- Enables validation at domain level
- `BackgroundColor.ts` mirrors `ThemeColor.ts` for consistency

**Implementation Pattern** (from `ThemeColor.ts`):

- Constructor validates against palette
- Static factory methods: `create()`, `createDefault()`, `fromString()`
- Default value: `'blue'` (matches theme color default)

---

## Decision 3: Persistence Strategy

**Decision**: Store as `WebsiteSetting` entity with key `'background-color'`.

**Rationale**:

- Follows existing pattern for `theme-color`, `website-font`, `website-name`
- Reuses `WebsiteSettingsRepository` without modification
- Single table design in MongoDB keeps settings together
- Existing `setByKey`/`getByKey` methods handle persistence

**Implementation**:

1. Add `BACKGROUND_COLOR: 'background-color'` to `SettingKeys.ts`
2. Add factory method `createBackgroundColor()` to `WebsiteSetting.ts`

---

## Decision 4: API Extension

**Decision**: Extend existing `/api/settings` endpoint rather than creating new endpoint.

**Rationale**:

- Background color is a website setting, same as theme color and name
- Reduces API surface area
- Single request can update multiple settings atomically
- Follows existing pattern in `route.ts`

**Changes Required**:

- `types.ts`: Add `backgroundColor` to request/response types
- `route.ts`: Add backgroundColor handling in GET (retrieve) and POST (update)

---

## Decision 5: Frontend Component Strategy

**Decision**: Create dedicated `BackgroundColorSelector` component following `ThemeColorSelector` pattern.

**Rationale**:

- Same visual design as theme color selector for consistency
- Positioned immediately after theme color in `WebsiteSettingsForm.tsx`
- Reuses `ColorButton` pattern from `ThemeColorSelector.tsx`
- Separate component allows different labels/descriptions

**Alternative Rejected**:

- Single "ColorSelector" component with mode prop: Adds complexity, violates KISS for minimal gain

---

## Decision 6: Public Site Application

**Decision**: Apply background color via CSS custom property on body element.

**Rationale**:

- Chakra UI v3 uses semantic tokens (`bg.canvas`, `bg.subtle`)
- Background color should use Chakra's color scale for theme mode compatibility
- In light mode: Use `{color}.50` or `{color}.100` (subtle)
- In dark mode: Use `{color}.900` or `{color}.950` (dark variant)

**Implementation Approach**:

1. Create `BackgroundColorContext` (mirrors `ThemeColorContext`)
2. Create `useBackgroundColor` hook (mirrors `useThemeColor`)
3. Create `BackgroundColorStorage` utility (mirrors `ThemeColorStorage`)
4. Apply in `Provider` component or root layout

---

## Decision 7: Dark Mode Handling

**Decision**: Use Chakra UI color scale variants for automatic dark mode adaptation.

**Rationale**:

- Chakra color scales have light variants (50-400) and dark variants (600-950)
- Light mode: `{color}.50` provides subtle, readable background
- Dark mode: `{color}.900` provides appropriate dark background
- Semantic token approach (`bg.canvas`) handles mode switching

**Example**: If admin selects "blue":

- Light mode body: `blue.50` (very light blue)
- Dark mode body: `blue.900` (very dark blue)

---

## Decision 8: Caching Strategy

**Decision**: Use localStorage + server sync pattern (same as theme color).

**Rationale**:

- Immediate UI response from localStorage on page load
- Server sync ensures data consistency
- Cross-tab updates via CustomEvent
- Pattern proven stable in existing `ThemeColorStorage`

---

## Technical Dependencies

| Component                        | Depends On                     | Purpose                |
| -------------------------------- | ------------------------------ | ---------------------- |
| `BackgroundColor` value object   | `ThemeColorPalette`            | Validation             |
| `GetBackgroundColor` use case    | `WebsiteSettingsRepository`    | Data retrieval         |
| `UpdateBackgroundColor` use case | `WebsiteSettingsRepository`    | Data persistence       |
| `BackgroundColorSelector`        | Chakra UI, `ThemeColorPalette` | UI selection           |
| `BackgroundColorContext`         | `useBackgroundColor` hook      | React state management |
| `BackgroundColorStorage`         | localStorage API               | Client-side caching    |

---

## Risk Assessment

| Risk                           | Mitigation                                                       |
| ------------------------------ | ---------------------------------------------------------------- |
| Contrast issues with text      | Use semantic tokens (`fg`, `fg.muted`) which adapt to background |
| Performance (extra API call)   | Cache in localStorage, sync on page load                         |
| Color not visible on dark mode | Use color scale variants (50 for light, 900 for dark)            |

---

## Clarifications Resolved

All technical decisions made based on existing patterns. No external clarifications needed.
