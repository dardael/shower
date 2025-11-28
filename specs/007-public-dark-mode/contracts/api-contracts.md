# API Contracts: Public Dark Mode Toggle

**Feature**: 007-public-dark-mode  
**Date**: 2025-01-28  
**Status**: Complete

## Overview

This feature does not introduce any new API endpoints or modify existing APIs. The dark mode toggle functionality is entirely client-side, using browser localStorage for persistence.

## Existing APIs (No Changes)

No API endpoints are affected by this feature. The theme preference is managed client-side through:

1. **Chakra UI Color Mode**: Provides `useColorMode` hook for state management
2. **next-themes**: Handles persistence to localStorage and SSR hydration
3. **Browser localStorage**: Stores the user's theme preference

## Component Contracts

### DarkModeToggle Props Interface

**Location**: `src/presentation/shared/components/DarkModeToggle.tsx`

```typescript
interface DarkModeToggleProps {
  size?: 'xs' | 'sm' | 'md' | 'lg'; // Button size (default: 'sm')
  variant?: 'solid' | 'subtle' | 'outline' | 'ghost'; // Visual variant (default: 'ghost')
  'aria-label'?: string; // Custom accessibility label
  onThemeChange?: (theme: ThemeMode) => void; // Optional callback
  className?: string; // Additional CSS classes
}
```

### PublicHeaderMenuProps Interface

**Location**: `src/presentation/shared/components/PublicHeaderMenu/types.ts`

No changes required to existing interface.

```typescript
interface PublicHeaderMenuProps {
  menuItems?: PublicMenuItem[];
  colorPalette?: ThemeColorToken;
}
```

## Integration Points

| Component        | Role                   | Status               |
| ---------------- | ---------------------- | -------------------- |
| DarkModeToggle   | Provides toggle button | Existing, reuse      |
| PublicHeaderMenu | Container for toggle   | Modify layout        |
| useColorMode     | State management       | Existing, no changes |
