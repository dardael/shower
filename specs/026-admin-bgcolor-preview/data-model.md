# Data Model: Admin Background Color Preview

**Feature**: 026-admin-bgcolor-preview  
**Date**: 2025-12-12

## Entities

### Existing Entities (No Changes)

#### BackgroundColor (Value Object)

**Location**: `src/domain/settings/value-objects/BackgroundColor.ts`

| Field | Type            | Description                                                      |
| ----- | --------------- | ---------------------------------------------------------------- |
| value | ThemeColorToken | Color token (blue, red, green, purple, orange, teal, pink, cyan) |

#### ThemeColorToken (Type)

**Location**: `src/domain/settings/constants/ThemeColorPalette.ts`

```typescript
type ThemeColorToken =
  | 'blue'
  | 'red'
  | 'green'
  | 'purple'
  | 'orange'
  | 'teal'
  | 'pink'
  | 'cyan';
```

### Existing Constants (Reused)

#### BACKGROUND_COLOR_MAP

**Location**: `src/presentation/shared/components/ui/provider.tsx`

| Key               | Value Type                        | Description                    |
| ----------------- | --------------------------------- | ------------------------------ |
| [ThemeColorToken] | `{ light: string; dark: string }` | Hex color values for each mode |

## New Types

None required - all existing types are sufficient.

## State Transitions

N/A - Preview is a pure display component with no state changes.

## Validation Rules

N/A - Uses existing BackgroundColor validation.
