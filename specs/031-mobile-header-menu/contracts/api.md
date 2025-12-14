# API Contracts: Mobile Header Menu for Public Side

**Feature Branch**: `031-mobile-header-menu`  
**Date**: 2025-12-14

## Overview

This feature does not introduce new API endpoints. It is a purely presentational enhancement that consumes existing APIs.

---

## Existing APIs Used (No Changes Required)

### GET /api/menu/items

**Purpose**: Fetches public menu items for navigation

**Response**:

```typescript
{
  items: Array<{
    id: string;
    text: string;
    url: string;
    position: number;
  }>;
}
```

**Used By**: `usePublicHeaderMenu` hook (existing)

---

### GET /api/settings/logo

**Purpose**: Fetches website logo configuration

**Response**:

```typescript
{
  logo: {
    url: string;
    filename: string;
    format: string;
  } | null
}
```

**Used By**: `usePublicHeaderMenu` hook (existing)

---

### GET /api/settings/theme-color

**Purpose**: Fetches configured theme color

**Response**:

```typescript
{
  themeColor: 'blue' |
    'red' |
    'green' |
    'purple' |
    'orange' |
    'teal' |
    'pink' |
    'cyan' |
    'beige' |
    'cream';
}
```

**Used By**: `useThemeColor` hook (existing)

---

## Component Contracts

Since this feature is purely presentational, the contracts are defined at the component level.

### MobileMenuToggle Component

**Input Props**:

```typescript
interface MobileMenuToggleProps {
  onClick: () => void;
  colorPalette?: ThemeColorToken;
}
```

**Behavior**:

- Renders hamburger icon (FiMenu)
- Calls `onClick` when tapped/clicked
- Minimum touch target: 44x44 pixels

---

### MobileMenuDrawer Component

**Input Props**:

```typescript
interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: PublicMenuItem[];
  colorPalette?: ThemeColorToken;
}
```

**Behavior**:

- Renders slide-in panel from right side when `isOpen` is true
- Renders backdrop overlay that closes drawer on click
- Displays menu items vertically
- Calls `onClose` on: close button click, backdrop click, Escape key, menu item selection
- Animation duration: 300ms

---

## No New API Endpoints Required

This feature operates entirely within the presentation layer using existing data sources.
