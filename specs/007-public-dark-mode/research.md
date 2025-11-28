# Research: Public Dark Mode Toggle

**Feature**: 007-public-dark-mode  
**Date**: 2025-01-28  
**Status**: Complete

## Research Summary

This feature requires minimal research as it reuses existing components and patterns already established in the codebase.

## Findings

### 1. Existing DarkModeToggle Component

**Decision**: Reuse the existing `DarkModeToggle` component from `src/presentation/shared/components/DarkModeToggle.tsx`

**Rationale**:

- Component is already fully functional with accessibility support (ARIA attributes, keyboard navigation)
- Uses `ClientOnly` wrapper with `Skeleton` fallback for SSR hydration
- Integrates with existing theme persistence via `useColorMode` from Chakra UI
- Follows established patterns in the codebase

**Alternatives Considered**:

- Create a new toggle component specifically for public pages → Rejected (violates DRY principle)
- Use Chakra UI's built-in `ColorModeButton` → Rejected (DarkModeToggle provides consistent styling)

### 2. PublicHeaderMenu Layout

**Decision**: Modify `PublicHeaderMenu.tsx` to use `justify="space-between"` layout and add DarkModeToggle to the right

**Rationale**:

- Current layout uses `justify="center"` for menu items
- Need to restructure to place menu items on left/center and toggle on right
- Follows the same pattern used in admin sidebar

**Alternatives Considered**:

- Create a separate header bar for the toggle → Rejected (adds unnecessary complexity)
- Place toggle inside navigation → Rejected (toggle is not a navigation item)

### 3. Icon Color Contrast on Theme-Colored Background

**Decision**: Configure DarkModeToggle with icon colors that contrast with the colorPalette background

**Rationale**:

- PublicHeaderMenu uses `bg="colorPalette.solid"` which applies the theme color
- Current DarkModeToggle uses hardcoded `color="white"` and `color="black"` for icons
- Icons should use `colorPalette.contrast` to ensure visibility on any theme color

**Alternatives Considered**:

- Keep hardcoded colors → Rejected (may not contrast with all theme colors)
- Add a prop to DarkModeToggle for icon color → Rejected (violates YAGNI, can use wrapper styling)

### 4. Theme Persistence

**Decision**: Use existing theme persistence mechanism (browser localStorage via next-themes)

**Rationale**:

- Already implemented and working in the application
- DarkModeToggle component already integrates with this mechanism
- No additional work required

**Alternatives Considered**:

- Store theme preference in database → Rejected (unnecessary for anonymous users)
- Use cookies for persistence → Rejected (localStorage is already working)

## Technical Decisions

| Decision         | Choice                    | Justification                         |
| ---------------- | ------------------------- | ------------------------------------- |
| Component Reuse  | DarkModeToggle.tsx        | DRY principle, existing accessibility |
| Layout Approach  | Flex with space-between   | Places toggle on right naturally      |
| Icon Contrast    | Use colorPalette.contrast | Works with any theme color            |
| State Management | Existing useColorMode     | Already integrated with next-themes   |

## Open Items

None - all research items resolved.
