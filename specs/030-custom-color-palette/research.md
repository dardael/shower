# Research: Custom Color Palette

**Feature**: 030-custom-color-palette  
**Date**: 2025-12-14  
**Status**: Complete

## Research Questions

### 1. How to add custom hex colors to Chakra UI token system?

**Decision**: Define custom semantic tokens with explicit hex values instead of referencing built-in color scales.

**Rationale**: Chakra UI v3's semantic token system allows defining custom colors with light/dark mode variants using explicit hex values. Since beige (#cdb99d) and cream (#ede6dd) are not standard Chakra colors, we define them as custom tokens with computed dark mode variants.

**Alternatives Considered**:

- Use closest Chakra color scale (e.g., `orange.200`): Rejected - doesn't match user's exact hex requirements
- Define entirely new color scale: Rejected - over-engineering for single token usage

### 2. How to compute appropriate dark mode variants?

**Decision**: Use color theory to darken light mode colors while preserving warmth/hue.

**Computed Values**:

- Beige theme (#cdb99d light) → #a89070 dark (reduced lightness, preserved warmth)
- Cream background (#ede6dd light) → #3d3830 dark (deep warm brown for dark backgrounds)

**Rationale**: Dark mode variants should:

- Maintain the same hue family
- Provide sufficient contrast with text
- Feel visually consistent with other dark mode colors

**Alternatives Considered**:

- Simple inversion: Rejected - produces unnatural colors
- Fixed percentage darkening: Rejected - doesn't account for perceptual uniformity

### 3. How does theme color system work for non-Chakra colors?

**Decision**: Extend `THEME_COLOR_PALETTE` array and define complete semantic token set in `theme.ts`.

**Rationale**: The existing architecture in `theme.ts` uses `createDynamicThemeConfig()` which:

1. Sets `colorPalette` globally in CSS
2. Defines semantic tokens (solid, muted, subtle, fg, contrast, border) for each color
3. For custom hex colors, we provide explicit values instead of Chakra token references

**Implementation Pattern**:

```typescript
beige: {
  solid: { value: { _light: '#cdb99d', _dark: '#a89070' } },
  muted: { value: { _light: '#e8dfd3', _dark: '#4a4235' } },
  subtle: { value: { _light: '#f5f0e8', _dark: '#3d3830' } },
  fg: { value: { _light: '#3d3830', _dark: '#f5f0e8' } },
  contrast: { value: { _light: '#ffffff', _dark: '#1a1815' } },
  border: { value: { _light: '#d4c4a8', _dark: '#6b5d4a' } },
}
```

### 4. How to extend ColorPicker preset colors?

**Decision**: Add burgundy (#642e2a) to the `PRESET_COLORS` array in ColorPicker.tsx.

**Rationale**: The ColorPicker uses a simple array of hex strings. Adding a new color is a one-line change. The grid layout will accommodate the 13th color automatically (wrapping to a new row).

**Alternatives Considered**:

- Separate "custom colors" section: Rejected - adds UI complexity for single color
- Theme-aware color integration: Rejected - editor uses direct hex values, not theme tokens

### 5. File modification scope

**Decision**: Modify 4 files only (minimal change set).

| File                                                                  | Change                                   |
| --------------------------------------------------------------------- | ---------------------------------------- |
| `src/domain/settings/constants/ThemeColorPalette.ts`                  | Add 'beige', 'cream' to array            |
| `src/presentation/shared/theme.ts`                                    | Add semantic tokens for beige, cream     |
| `src/presentation/shared/components/ui/provider.tsx`                  | Add beige, cream to BACKGROUND_COLOR_MAP |
| `src/presentation/admin/components/PageContentEditor/ColorPicker.tsx` | Add #642e2a to PRESET_COLORS             |

**Rationale**: Follows YAGNI, DRY, KISS principles. All validation and UI rendering logic automatically extends when these data structures change.

## Dependencies

No new dependencies required. Uses existing:

- Chakra UI v3 semantic token system
- Tiptap color extension
- Existing theme infrastructure

## Risks and Mitigations

| Risk                                                     | Mitigation                                                                  |
| -------------------------------------------------------- | --------------------------------------------------------------------------- |
| Dark mode colors may not look visually appealing         | Values are adjustable; spec notes they can be refined during implementation |
| 13-color grid may wrap awkwardly in ColorPicker          | Existing 4-column grid handles arbitrary counts; 13 = 3 full rows + 1       |
| Semantic token structure may differ from existing colors | Follow exact pattern from existing color definitions in theme.ts            |
