# Data Model: Mobile Header Menu for Public Side

**Feature Branch**: `031-mobile-header-menu`  
**Date**: 2025-12-14

## Overview

This feature is purely presentational and does not introduce new data entities. It consumes existing menu data through the `usePublicHeaderMenu` hook and adds UI state management for the mobile drawer.

---

## Existing Entities (No Changes Required)

### PublicMenuItem

**Source**: `src/presentation/shared/components/PublicHeaderMenu/types.ts`

| Field    | Type   | Description                |
| -------- | ------ | -------------------------- |
| id       | string | Unique identifier          |
| text     | string | Display text for menu item |
| url      | string | Navigation URL             |
| position | number | Sort order                 |

### PublicLogo

**Source**: `src/presentation/shared/components/PublicHeaderMenu/types.ts`

| Field    | Type   | Description                   |
| -------- | ------ | ----------------------------- |
| url      | string | Logo image URL                |
| filename | string | Original filename             |
| format   | string | Image format (png, jpg, etc.) |

---

## New UI State (Component-Level Only)

### MobileMenuState

**Scope**: Local component state in `PublicHeaderMenu.tsx`

| Field  | Type    | Default | Description                             |
| ------ | ------- | ------- | --------------------------------------- |
| isOpen | boolean | false   | Whether mobile drawer is currently open |

**State Transitions**:

```
CLOSED (isOpen: false)
  ├── [User taps hamburger icon] → OPEN
  └── [Viewport resizes to >= 768px] → CLOSED (no-op)

OPEN (isOpen: true)
  ├── [User taps close button] → CLOSED
  ├── [User taps backdrop] → CLOSED
  ├── [User selects menu item] → CLOSED
  ├── [User presses Escape key] → CLOSED
  └── [Viewport resizes to >= 768px] → CLOSED
```

---

## Component Props (New)

### MobileMenuToggleProps

| Prop         | Type            | Required | Description                   |
| ------------ | --------------- | -------- | ----------------------------- |
| onClick      | () => void      | Yes      | Handler to toggle drawer open |
| colorPalette | ThemeColorToken | No       | Theme color for styling       |

### MobileMenuDrawerProps

| Prop         | Type             | Required | Description               |
| ------------ | ---------------- | -------- | ------------------------- |
| isOpen       | boolean          | Yes      | Whether drawer is visible |
| onClose      | () => void       | Yes      | Handler to close drawer   |
| menuItems    | PublicMenuItem[] | Yes      | Menu items to display     |
| colorPalette | ThemeColorToken  | No       | Theme color for styling   |

---

## Validation Rules

1. **Menu Items**: Empty array is valid (drawer shows empty state message)
2. **Menu Item Text**: Long text should be handled with CSS truncation/wrapping
3. **Menu Item URL**: Must be valid relative or absolute URL (validated upstream)

---

## No Database Changes

This feature does not require any database schema changes or new API endpoints. All data is sourced from existing menu configuration APIs.
