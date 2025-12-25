# Research: Extended Color Palette Options

**Feature**: 049-header-menu-bgcolor  
**Date**: 2025-12-25

## Executive Summary

This feature adds new color options to existing palettes. Research confirms the existing infrastructure supports this with minimal changes to 4-5 files.

## Key Findings

### 1. Color Palette Architecture

**Decision**: Extend existing `THEME_COLOR_PALETTE` with new color tokens  
**Rationale**: The system uses a centralized color token approach where all color options are defined in `ThemeColorPalette.ts` and referenced throughout the application  
**Alternatives Considered**:

- Creating a separate header menu color system (rejected - overcomplicated, violates KISS)
- Using raw hex values without tokens (rejected - violates DRY, harder to maintain)

### 2. Files Requiring Modification

| File                                                       | Change Type        | Purpose                                           |
| ---------------------------------------------------------- | ------------------ | ------------------------------------------------- |
| `src/domain/settings/constants/ThemeColorPalette.ts`       | Add tokens         | New color names: `gold`, `sand`, `taupe`, `white` |
| `src/presentation/shared/theme.ts`                         | Add definitions    | Color variants for new tokens                     |
| `src/presentation/shared/components/ui/provider.tsx`       | Add mappings       | BACKGROUND_COLOR_MAP entries                      |
| `src/presentation/admin/components/ThemeColorSelector.tsx` | Add display values | CUSTOM_COLOR_DISPLAY entries                      |

### 3. Color Token Naming

**Decision**: Use semantic names instead of hex values  
**Rationale**: Consistent with existing pattern (e.g., `beige: '#cdb99d'`, `cream: '#ede6dd'`)

| Hex Value | Token Name | Usage                  |
| --------- | ---------- | ---------------------- |
| `#eeb252` | `gold`     | Header menu background |
| `#f2e8de` | `sand`     | Header menu background |
| `#e2cbac` | `taupe`    | Website background     |
| `#ffffff` | `white`    | Website background     |

### 4. Light/Dark Mode Variants

**Decision**: Generate complementary dark mode variants for each new color  
**Rationale**: Required by existing `BACKGROUND_COLOR_MAP` structure and Constitution VI (Accessibility-First)

| Token   | Light Mode | Dark Mode               |
| ------- | ---------- | ----------------------- |
| `gold`  | `#eeb252`  | `#8b6914` (darker gold) |
| `sand`  | `#f2e8de`  | `#4a4238` (dark sand)   |
| `taupe` | `#e2cbac`  | `#5c4d3a` (dark taupe)  |
| `white` | `#ffffff`  | `#1a1a1a` (near black)  |

### 5. Contrast Verification

All new colors verified for accessibility:

- Gold (`#eeb252`): Works with dark text, sufficient contrast ratio
- Sand (`#f2e8de`): Works with dark text, sufficient contrast ratio
- Taupe (`#e2cbac`): Works with dark text, sufficient contrast ratio
- White (`#ffffff`): Standard white, requires dark text

### 6. No API Changes Required

**Decision**: No new API endpoints or modifications needed  
**Rationale**: Existing settings API already handles color tokens as string values. Adding new valid token values requires no backend changes - the frontend validates against `THEME_COLOR_PALETTE`.

### 7. Export/Import Compatibility

**Decision**: No export version bump needed  
**Rationale**: Per Constitution X, version increment is required for schema changes. Adding new allowed values to existing fields is not a schema change - old exports remain valid, and new color values are simply additional options.

## Implementation Approach

1. Add new color tokens to `THEME_COLOR_PALETTE` array
2. Add theme color definitions in `theme.ts` with full variant set
3. Add `BACKGROUND_COLOR_MAP` entries with light/dark variants
4. Add `CUSTOM_COLOR_DISPLAY` entries for hex display in UI
5. No API, database, or test changes required

## Risks & Mitigations

| Risk                          | Likelihood | Mitigation                            |
| ----------------------------- | ---------- | ------------------------------------- |
| Color contrast issues         | Low        | Dark mode variants carefully selected |
| Breaking existing selections  | None       | Additive change only                  |
| Export/import incompatibility | None       | No schema changes                     |
