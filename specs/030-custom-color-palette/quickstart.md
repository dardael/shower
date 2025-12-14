# Quickstart: Custom Color Palette

**Feature**: 030-custom-color-palette  
**Date**: 2025-12-14

## Implementation Summary

Add 3 new colors to the existing color selection system:

- **Beige** theme color (#cdb99d light / #a89070 dark)
- **Cream** background color (#ede6dd light / #3d3830 dark)
- **Burgundy** font color (#642e2a) for rich text editor

## Files to Modify

| File                                                                  | Change                                            |
| --------------------------------------------------------------------- | ------------------------------------------------- |
| `src/domain/settings/constants/ThemeColorPalette.ts`                  | Add 'beige', 'cream' to THEME_COLOR_PALETTE array |
| `src/presentation/shared/theme.ts`                                    | Add semantic tokens for beige and cream           |
| `src/presentation/shared/components/ui/provider.tsx`                  | Add beige, cream to BACKGROUND_COLOR_MAP          |
| `src/presentation/admin/components/PageContentEditor/ColorPicker.tsx` | Add #642e2a to PRESET_COLORS                      |

## Step-by-Step Implementation

### Step 1: Extend ThemeColorPalette.ts

```typescript
// Add 'beige' and 'cream' to the palette array
export const THEME_COLOR_PALETTE = [
  'blue',
  'red',
  'green',
  'purple',
  'orange',
  'teal',
  'pink',
  'cyan',
  'beige',
  'cream',
] as const;
```

### Step 2: Add Semantic Tokens in theme.ts

Add beige and cream semantic token definitions in `createDynamicThemeConfig()`:

```typescript
beige: {
  solid: { value: { _light: '#cdb99d', _dark: '#a89070' } },
  muted: { value: { _light: '#e8dfd3', _dark: '#4a4235' } },
  subtle: { value: { _light: '#f5f0e8', _dark: '#3d3830' } },
  fg: { value: { _light: '#3d3830', _dark: '#f5f0e8' } },
  contrast: { value: { _light: '#ffffff', _dark: '#1a1815' } },
  border: { value: { _light: '#d4c4a8', _dark: '#6b5d4a' } },
},
cream: {
  solid: { value: { _light: '#ede6dd', _dark: '#3d3830' } },
  muted: { value: { _light: '#f5f0e8', _dark: '#2d2a25' } },
  subtle: { value: { _light: '#faf8f5', _dark: '#252320' } },
  fg: { value: { _light: '#3d3830', _dark: '#f5f0e8' } },
  contrast: { value: { _light: '#1a1815', _dark: '#faf8f5' } },
  border: { value: { _light: '#e0d6c8', _dark: '#4a4540' } },
},
```

### Step 3: Extend BACKGROUND_COLOR_MAP in provider.tsx

```typescript
export const BACKGROUND_COLOR_MAP: Record<
  ThemeColorToken,
  { light: string; dark: string }
> = {
  // ... existing colors ...
  beige: { light: '#cdb99d', dark: '#a89070' },
  cream: { light: '#ede6dd', dark: '#3d3830' },
};
```

### Step 4: Add Burgundy to ColorPicker.tsx

```typescript
export const PRESET_COLORS: readonly string[] = [
  '#000000',
  '#FFFFFF',
  '#EF4444',
  '#F97316',
  '#EAB308',
  '#22C55E',
  '#06B6D4',
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
  '#6B7280',
  '#78716C',
  '#642e2a',
] as const;
```

## Verification

1. **Theme Color**: Navigate to Admin > Settings, verify beige square appears in theme color selector
2. **Background Color**: Navigate to Admin > Settings, verify cream square appears in background color selector
3. **Font Color**: Open page editor, open color picker, verify burgundy square appears in grid
4. **Dark Mode**: Toggle dark mode, verify colors display appropriate dark variants

## No Tests Required

Per constitution: No tests unless explicitly requested. Existing validation auto-extends.
