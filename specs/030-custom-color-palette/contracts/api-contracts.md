# API Contracts: Custom Color Palette

**Feature**: 030-custom-color-palette  
**Date**: 2025-12-14  
**Status**: Complete

## Overview

This feature does not introduce new API endpoints. It extends existing data structures that are used by the current settings API.

## Existing API Impact

### Settings API

**Endpoint**: `GET/PUT /api/settings`

The existing settings API already handles `themeColor` and `backgroundColor` fields. No API changes are required because:

1. The API accepts string values for color fields
2. Validation is performed by value objects (`ThemeColor`, `BackgroundColor`)
3. New tokens ('beige', 'cream') are automatically valid when added to `THEME_COLOR_PALETTE`

### Request/Response Schema (No Changes)

```typescript
// Existing schema - unchanged
interface WebsiteSettingsDTO {
  themeColor: string; // Now accepts: 'blue' | 'red' | ... | 'beige' | 'cream'
  backgroundColor: string; // Now accepts: 'blue' | 'red' | ... | 'beige' | 'cream'
  // ... other fields
}
```

## Component Contracts

### ThemeColorSelector Props (Unchanged)

```typescript
interface ThemeColorSelectorProps {
  value: ThemeColorToken;
  onChange: (color: ThemeColorToken) => void;
  isLoading?: boolean;
}
// Component auto-renders all colors from THEME_COLOR_PALETTE
```

### BackgroundColorSelector Props (Unchanged)

```typescript
interface BackgroundColorSelectorProps {
  value: ThemeColorToken;
  onChange: (color: ThemeColorToken) => void;
  isLoading?: boolean;
}
// Component auto-renders all colors from THEME_COLOR_PALETTE
```

### ColorPicker Props (Unchanged)

```typescript
interface ColorPickerProps {
  editor: Editor;
}
// Component auto-renders all colors from PRESET_COLORS array
```

## Type Extensions

### ThemeColorToken (Extended)

```typescript
// Before
type ThemeColorToken =
  | 'blue'
  | 'red'
  | 'green'
  | 'purple'
  | 'orange'
  | 'teal'
  | 'pink'
  | 'cyan';

// After
type ThemeColorToken =
  | 'blue'
  | 'red'
  | 'green'
  | 'purple'
  | 'orange'
  | 'teal'
  | 'pink'
  | 'cyan'
  | 'beige'
  | 'cream';
```

## No New Endpoints

This feature is purely a data extension. All interactions use existing:

- Settings API for saving/loading color preferences
- Theme system for applying colors to UI
- ColorPicker for text formatting in editor
