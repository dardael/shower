# Data Model: Custom Color Palette

**Feature**: 030-custom-color-palette  
**Date**: 2025-12-14  
**Status**: Complete

## Overview

This feature extends existing data structures with new color values. No new entities or database schema changes are required.

## Extended Data Structures

### 1. ThemeColorToken (Type Extension)

**File**: `src/domain/settings/constants/ThemeColorPalette.ts`

**Current State**:

```typescript
export const THEME_COLOR_PALETTE = [
  'blue',
  'red',
  'green',
  'purple',
  'orange',
  'teal',
  'pink',
  'cyan',
] as const;

export type ThemeColorToken = (typeof THEME_COLOR_PALETTE)[number];
```

**Extended State**:

```typescript
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

export type ThemeColorToken = (typeof THEME_COLOR_PALETTE)[number];
// Type now includes: 'blue' | 'red' | 'green' | 'purple' | 'orange' | 'teal' | 'pink' | 'cyan' | 'beige' | 'cream'
```

**Validation**: Existing `isValidThemeColor()` function automatically validates new tokens.

---

### 2. BACKGROUND_COLOR_MAP (Constant Extension)

**File**: `src/presentation/shared/components/ui/provider.tsx`

**Current State**:

```typescript
export const BACKGROUND_COLOR_MAP: Record<
  ThemeColorToken,
  { light: string; dark: string }
> = {
  blue: { light: '#eff6ff', dark: '#1e3a5f' },
  red: { light: '#fef2f2', dark: '#450a0a' },
  green: { light: '#f0fdf4', dark: '#14532d' },
  purple: { light: '#faf5ff', dark: '#3b0764' },
  orange: { light: '#fff7ed', dark: '#431407' },
  teal: { light: '#f0fdfa', dark: '#134e4a' },
  pink: { light: '#fdf2f8', dark: '#500724' },
  cyan: { light: '#ecfeff', dark: '#164e63' },
};
```

**Extended State**:

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

---

### 3. Semantic Tokens (Theme Extension)

**File**: `src/presentation/shared/theme.ts`

**New Semantic Token Definitions**:

```typescript
// Beige semantic tokens (for theme color usage)
beige: {
  solid: { value: { _light: '#cdb99d', _dark: '#a89070' } },
  muted: { value: { _light: '#e8dfd3', _dark: '#4a4235' } },
  subtle: { value: { _light: '#f5f0e8', _dark: '#3d3830' } },
  fg: { value: { _light: '#3d3830', _dark: '#f5f0e8' } },
  contrast: { value: { _light: '#ffffff', _dark: '#1a1815' } },
  border: { value: { _light: '#d4c4a8', _dark: '#6b5d4a' } },
}

// Cream semantic tokens (for background color usage)
cream: {
  solid: { value: { _light: '#ede6dd', _dark: '#3d3830' } },
  muted: { value: { _light: '#f5f0e8', _dark: '#2d2a25' } },
  subtle: { value: { _light: '#faf8f5', _dark: '#252320' } },
  fg: { value: { _light: '#3d3830', _dark: '#f5f0e8' } },
  contrast: { value: { _light: '#1a1815', _dark: '#faf8f5' } },
  border: { value: { _light: '#e0d6c8', _dark: '#4a4540' } },
}
```

---

### 4. PRESET_COLORS (Array Extension)

**File**: `src/presentation/admin/components/PageContentEditor/ColorPicker.tsx`

**Current State**:

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
] as const;
```

**Extended State**:

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
  '#642e2a', // Burgundy
] as const;
```

---

## Color Value Reference

| Color Name | Light Mode Hex | Dark Mode Hex | Usage                                      |
| ---------- | -------------- | ------------- | ------------------------------------------ |
| Beige      | #cdb99d        | #a89070       | Theme color (accents, buttons, highlights) |
| Cream      | #ede6dd        | #3d3830       | Background color (page backgrounds)        |
| Burgundy   | #642e2a        | N/A           | Font color in rich text editor             |

## Database Impact

**No schema changes required**. The `themeColor` and `backgroundColor` fields in `WebsiteSettings` entity already store string values. The new color tokens ('beige', 'cream') are valid strings that will be stored and retrieved without modification.

## Validation Impact

Existing validation automatically extends:

- `isValidThemeColor()` uses `THEME_COLOR_PALETTE.includes()` - new tokens are auto-validated
- `ThemeColor` and `BackgroundColor` value objects use the same validation
- No changes needed to validation logic

## State Diagram

```
[User selects color] → [Validation via isValidThemeColor()] → [Store in WebsiteSettings]
                                      ↓
                        [Auto-validates 'beige', 'cream']
                                      ↓
                        [Apply via semantic tokens in theme.ts]
```
