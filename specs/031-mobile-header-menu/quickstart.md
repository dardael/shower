# Quickstart: Mobile Header Menu for Public Side

**Feature Branch**: `031-mobile-header-menu`  
**Date**: 2025-12-14

## Overview

Add mobile-responsive navigation to the public website header. On mobile viewports (< 768px), display a hamburger menu icon that opens a slide-in drawer with vertical menu items. Preserve the full horizontal menu on desktop/tablet viewports.

---

## Implementation Steps

### Step 1: Create MobileMenuToggle Component

**File**: `src/presentation/shared/components/PublicHeaderMenu/MobileMenuToggle.tsx`

**Purpose**: Hamburger button to toggle mobile drawer

**Key Points**:

- Use `IconButton` with `FiMenu` icon from react-icons
- Apply theme color via `colorPalette` prop
- Ensure 44x44px minimum touch target
- Add `aria-label="Open menu"`

---

### Step 2: Create MobileMenuDrawer Component

**File**: `src/presentation/shared/components/PublicHeaderMenu/MobileMenuDrawer.tsx`

**Purpose**: Slide-in navigation panel for mobile

**Key Points**:

- Fixed position, slides from right, 280px width
- Backdrop overlay with `blackAlpha.600` background
- Close button (FiX icon) at top
- Vertical list of menu items using existing `PublicHeaderMenuItem`
- Include `DarkModeToggle` at bottom
- Use `FocusTrap` utility for accessibility
- Handle Escape key to close
- 300ms CSS transition for open/close animation

---

### Step 3: Update PublicHeaderMenu Component

**File**: `src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenu.tsx`

**Changes**:

1. Add `useState` for `isOpen` state
2. Add `useBreakpointValue({ base: true, md: false })` for mobile detection
3. Conditionally render:
   - Mobile: Logo + MobileMenuToggle + MobileMenuDrawer
   - Desktop: Logo + horizontal menu items + DarkModeToggle (existing)
4. Pass close handler to drawer for menu item clicks

---

### Step 4: Handle Edge Cases

**Empty Menu**:

- Show drawer with message "No menu items configured"

**Long Text**:

- Apply `textOverflow: 'ellipsis'` and `whiteSpace: 'nowrap'` to menu items

**Viewport Resize**:

- Drawer auto-closes when viewport >= 768px (use `useEffect` with breakpoint value)

---

## Files to Create

| File                   | Type      | Description               |
| ---------------------- | --------- | ------------------------- |
| `MobileMenuToggle.tsx` | Component | Hamburger icon button     |
| `MobileMenuDrawer.tsx` | Component | Slide-in navigation panel |

## Files to Modify

| File                   | Type      | Description                                       |
| ---------------------- | --------- | ------------------------------------------------- |
| `PublicHeaderMenu.tsx` | Component | Add responsive logic and integrate new components |

---

## Testing Checklist

- [ ] Hamburger icon appears on mobile (< 768px)
- [ ] Horizontal menu appears on desktop (>= 768px)
- [ ] Drawer opens on hamburger click
- [ ] Drawer closes on close button click
- [ ] Drawer closes on backdrop click
- [ ] Drawer closes on menu item selection
- [ ] Drawer closes on Escape key press
- [ ] Logo remains visible and functional on mobile
- [ ] Theme colors apply correctly
- [ ] Light/dark mode works in drawer
- [ ] Focus is trapped within open drawer
- [ ] Touch targets are at least 44x44px

---

## Dependencies

**Existing** (no new dependencies):

- `@chakra-ui/react` (Box, VStack, IconButton, useBreakpointValue)
- `react-icons/fi` (FiMenu, FiX)
- Existing FocusTrap utility
- Existing useThemeColor hook
- Existing PublicHeaderMenuItem component
- Existing DarkModeToggle component
