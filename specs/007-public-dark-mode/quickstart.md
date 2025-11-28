# Quickstart: Public Dark Mode Toggle

**Feature**: 007-public-dark-mode  
**Date**: 2025-01-28

## Overview

Add the existing DarkModeToggle component to the right side of the public header menu, allowing visitors to switch between light and dark modes.

## Prerequisites

- Existing `DarkModeToggle` component in `src/presentation/shared/components/`
- Existing `PublicHeaderMenu` component in `src/presentation/shared/components/PublicHeaderMenu/`
- Theme persistence mechanism (next-themes) already configured

## Implementation Steps

### Step 1: Modify PublicHeaderMenu Layout

Update `src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenu.tsx`:

1. Import the `DarkModeToggle` component
2. Change the Flex layout to use `justify="space-between"`
3. Wrap menu items in a container on the left
4. Add `DarkModeToggle` on the right with appropriate styling for contrast

### Step 2: Handle Empty Menu Items Case

Ensure the toggle appears even when no menu items are configured:

1. The empty state should still display the header bar
2. Toggle button should be positioned on the right in the empty state as well

### Step 3: Style Toggle for Theme-Colored Background

Configure the DarkModeToggle to work with the colorPalette background:

1. Icons should contrast with the theme color background
2. Wrap toggle in a Box with `color="colorPalette.contrast"` for proper icon colors

## Key Files to Modify

| File                                                                       | Change                       |
| -------------------------------------------------------------------------- | ---------------------------- |
| `src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenu.tsx` | Add DarkModeToggle to layout |

## Testing Checklist

- [ ] Toggle button appears on the right side of header
- [ ] Clicking toggle switches between light/dark mode
- [ ] Toggle button visible on all viewport sizes
- [ ] Toggle button has proper contrast on theme-colored background
- [ ] Theme persists when navigating between pages
- [ ] Toggle works even when no menu items are configured
- [ ] Keyboard navigation works (Tab to button, Enter/Space to toggle)

## Acceptance Criteria

1. Users can toggle dark mode from any public page
2. Toggle button matches admin dashboard appearance
3. Theme preference persists across page navigations
4. Toggle is accessible via keyboard and screen readers
