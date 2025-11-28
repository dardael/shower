# Data Model: Public Dark Mode Toggle

**Feature**: 007-public-dark-mode  
**Date**: 2025-01-28  
**Status**: Complete

## Overview

This feature does not introduce any new data entities or modify existing data models. The dark mode toggle functionality uses the existing theme persistence mechanism provided by next-themes (browser localStorage).

## Existing Entities (No Changes)

### ThemeMode (Value Object)

**Location**: `src/domain/settings/value-objects/ThemeMode.ts`

Used by the DarkModeToggle component to represent theme state. No modifications required.

```typescript
enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
}
```

## Storage

**Mechanism**: Browser localStorage  
**Key**: `chakra-ui-color-mode` (managed by Chakra UI/next-themes)  
**Persistence**: Automatic via existing next-themes integration

## State Management

No new state management required. The existing `useColorMode` hook from Chakra UI provides:

- Current color mode (`light` | `dark`)
- Toggle function (`toggleColorMode`)
- Automatic persistence to localStorage
