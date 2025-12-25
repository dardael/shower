# Quickstart: Extended Color Palette Options

**Feature**: 049-header-menu-bgcolor  
**Date**: 2025-12-25

## Overview

Add 4 new color options to the existing color palette system:

- **Header menu colors**: `gold` (#eeb252), `sand` (#f2e8de)
- **Background colors**: `taupe` (#e2cbac), `white` (#ffffff)

## Files to Modify

| File                                                       | Action                           |
| ---------------------------------------------------------- | -------------------------------- |
| `src/domain/settings/constants/ThemeColorPalette.ts`       | Add 4 tokens to array            |
| `src/presentation/shared/theme.ts`                         | Add color definitions            |
| `src/presentation/shared/components/ui/provider.tsx`       | Add BACKGROUND_COLOR_MAP entries |
| `src/presentation/admin/components/ThemeColorSelector.tsx` | Add CUSTOM_COLOR_DISPLAY entries |

## Implementation Steps

### Step 1: Add Color Tokens

In `ThemeColorPalette.ts`, add to the `THEME_COLOR_PALETTE` array:

```typescript
'gold',   // #eeb252 - Header menu background
'sand',   // #f2e8de - Header menu background
'taupe',  // #e2cbac - Website background
'white',  // #ffffff - Website background
```

### Step 2: Add Theme Definitions

In `theme.ts`, add color definitions following the existing pattern (beige/cream):

- Add `gold`, `sand`, `taupe`, `white` with full variant set (solid, muted, subtle, fg, contrast, border)

### Step 3: Add Background Color Map

In `provider.tsx`, add to `BACKGROUND_COLOR_MAP`:

```typescript
gold: { light: '#eeb252', dark: '#8b6914' },
sand: { light: '#f2e8de', dark: '#4a4238' },
taupe: { light: '#e2cbac', dark: '#5c4d3a' },
white: { light: '#ffffff', dark: '#1a1a1a' },
```

### Step 4: Add Display Values

In `ThemeColorSelector.tsx`, add to `CUSTOM_COLOR_DISPLAY`:

```typescript
gold: '#eeb252',
sand: '#f2e8de',
taupe: '#e2cbac',
white: '#ffffff',
```

## Testing

1. Navigate to admin settings → Theme color selector
2. Verify all 4 new colors appear in the palette
3. Select each color and verify it applies correctly
4. Toggle dark mode and verify dark variants display properly
5. Save and refresh to verify persistence

## No Changes Required

- ❌ API endpoints
- ❌ Database schema
- ❌ Backend validation
- ❌ Export/import system
