# Data Model: Extended Color Palette Options

**Feature**: 049-header-menu-bgcolor  
**Date**: 2025-12-25

## Overview

This feature extends existing data structures with no new entities. The changes are additive to the existing color token system.

## Entities Modified

### ThemeColorToken (Type Extension)

**Location**: `src/domain/settings/constants/ThemeColorPalette.ts`

**Current Values**:

```
'blue' | 'red' | 'green' | 'purple' | 'orange' | 'teal' | 'pink' | 'cyan' | 'beige' | 'cream'
```

**New Values Added**:

```
'gold' | 'sand' | 'taupe' | 'white'
```

**Final Type**:

```
'blue' | 'red' | 'green' | 'purple' | 'orange' | 'teal' | 'pink' | 'cyan' | 'beige' | 'cream' | 'gold' | 'sand' | 'taupe' | 'white'
```

### BACKGROUND_COLOR_MAP (Record Extension)

**Location**: `src/presentation/shared/components/ui/provider.tsx`

**New Entries**:

| Token   | Light Mode | Dark Mode |
| ------- | ---------- | --------- |
| `gold`  | `#eeb252`  | `#8b6914` |
| `sand`  | `#f2e8de`  | `#4a4238` |
| `taupe` | `#e2cbac`  | `#5c4d3a` |
| `white` | `#ffffff`  | `#1a1a1a` |

### CUSTOM_COLOR_DISPLAY (Record Extension)

**Location**: `src/presentation/admin/components/ThemeColorSelector.tsx`

**New Entries**:

| Token   | Display Hex |
| ------- | ----------- |
| `gold`  | `#eeb252`   |
| `sand`  | `#f2e8de`   |
| `taupe` | `#e2cbac`   |
| `white` | `#ffffff`   |

## Database Impact

**None** - Color tokens are stored as string values. The existing settings schema accepts any string for color fields. Adding new valid token values requires no database migration.

## Validation Rules

- Color tokens validated against `THEME_COLOR_PALETTE` array on frontend
- Backend accepts any string (no change needed)
- Invalid tokens gracefully fall back to default theme color

## State Transitions

**None** - Colors are static configuration values with no state machine.
