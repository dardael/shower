# Research: Mobile Header Menu for Public Side

**Feature Branch**: `031-mobile-header-menu`  
**Date**: 2025-12-14

## Research Summary

This document consolidates findings from codebase analysis to inform the mobile header menu implementation.

---

## Decision 1: Mobile Drawer Implementation Pattern

**Decision**: Use custom overlay + backdrop pattern (same as AdminSidebar)

**Rationale**:

- Chakra UI v3 does not include a built-in Drawer component
- AdminSidebar already implements a proven overlay pattern with backdrop
- Maintains consistency across admin and public sides
- Existing pattern includes focus trap, keyboard navigation, and z-index management

**Alternatives Considered**:

- Chakra UI Dialog component: Rejected because Dialog is modal-focused, not optimized for slide-in navigation panels
- Third-party drawer library: Rejected to avoid additional dependencies and maintain consistency with existing patterns

---

## Decision 2: Responsive Breakpoint

**Decision**: Use 768px (`md` breakpoint) as the mobile/desktop threshold

**Rationale**:

- Aligns with existing responsive patterns throughout the codebase
- AdminSidebar uses `useBreakpointValue({ base: true, md: false })` for mobile detection
- PublicHeaderMenu already uses `md` breakpoint for responsive spacing
- 768px is standard tablet/desktop threshold

**Alternatives Considered**:

- 640px (`sm` breakpoint): Rejected as too narrow, would show hamburger menu on tablets
- 1024px (`lg` breakpoint): Rejected as too wide, would hide menu unnecessarily on tablets

---

## Decision 3: State Management Approach

**Decision**: Local component state with `useState` hook

**Rationale**:

- Simple open/close state does not require global state management
- Follows AdminLayout pattern for sidebar state: `useState(false)` with toggle/close functions
- No need for context or external state library
- State resets naturally on route changes

**Alternatives Considered**:

- React Context: Rejected as overkill for single component open/close state
- URL state: Rejected as menu state should not persist in URL or history

---

## Decision 4: Drawer Slide Direction

**Decision**: Slide in from the right side

**Rationale**:

- Right-hand slide is common for mobile menus on content websites
- AdminSidebar slides from left (typical for admin dashboards with persistent navigation)
- Right-side differentiates public navigation from admin navigation
- Hamburger icon positioned on right side of header

**Alternatives Considered**:

- Left-side slide: Rejected to differentiate from AdminSidebar and follow common public website patterns
- Top-down slide: Rejected as less intuitive for navigation panels

---

## Decision 5: Accessibility Implementation

**Decision**: Reuse existing FocusTrap utility and follow AdminSidebar accessibility patterns

**Rationale**:

- FocusTrap utility already exists in codebase
- AdminSidebar implements comprehensive accessibility: focus trap, Escape key, ARIA attributes
- Ensures consistency in accessibility implementation
- Proven patterns reduce implementation risk

**Alternatives Considered**:

- New accessibility implementation: Rejected to maintain DRY principle
- Third-party focus management: Rejected to avoid additional dependencies

---

## Decision 6: Theme Integration

**Decision**: Use existing `useThemeColor` hook and semantic color tokens

**Rationale**:

- PublicHeaderMenu already uses `useThemeColor` for theme integration
- Semantic tokens (`bg.subtle`, `fg`, `border`) ensure proper contrast in light/dark modes
- Maintains visual consistency with existing header
- No additional theme configuration needed

**Alternatives Considered**:

- Custom color props: Rejected to maintain consistency with existing theme system
- Hardcoded colors: Rejected as it would break theme support

---

## Decision 7: Animation Timing

**Decision**: 300ms transition duration for open/close animations

**Rationale**:

- Specified in success criteria (SC-003)
- Follows common mobile UX patterns
- Fast enough to feel responsive, slow enough to be perceivable
- CSS transitions are simple and performant

**Alternatives Considered**:

- No animation: Rejected as it would feel jarring
- Longer animations (500ms+): Rejected as too slow for navigation

---

## Existing Components to Reuse

| Component/Hook         | Location                                                                       | Purpose                               |
| ---------------------- | ------------------------------------------------------------------------------ | ------------------------------------- |
| `usePublicHeaderMenu`  | `src/presentation/shared/components/PublicHeaderMenu/usePublicHeaderMenu.ts`   | Data fetching for menu items and logo |
| `useThemeColor`        | `src/presentation/shared/hooks/useThemeColor.ts`                               | Theme color integration               |
| `PublicHeaderMenuItem` | `src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenuItem.tsx` | Individual menu item rendering        |
| `DarkModeToggle`       | `src/presentation/shared/components/DarkModeToggle.tsx`                        | Theme toggle button                   |
| `FocusTrap`            | `src/presentation/shared/utils/FocusTrap.tsx`                                  | Accessibility focus management        |
| `FiMenu`, `FiX`        | `react-icons/fi`                                                               | Hamburger and close icons             |

---

## Key Implementation Patterns from AdminSidebar

### Overlay Pattern

```typescript
// Mobile drawer overlay
{isOpen && (
  <Box position="fixed" top={0} right={0} h="100vh" w="280px" style={{ zIndex: 1001 }}>
    {drawerContent}
  </Box>
)}

// Backdrop
{isOpen && (
  <Box
    position="fixed"
    inset={0}
    bg="blackAlpha.600"
    style={{ zIndex: 1000 }}
    onClick={onClose}
  />
)}
```

### Responsive Toggle Pattern

```typescript
const isMobile = useBreakpointValue({ base: true, md: false });

// Show hamburger only on mobile
{isMobile && <MobileMenuToggle onClick={toggleMenu} />}

// Show full menu only on desktop
{!isMobile && <FullHorizontalMenu items={menuItems} />}
```

### Keyboard Navigation Pattern

```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      onClose();
    }
  };
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [isOpen, onClose]);
```

---

## No Unresolved Clarifications

All technical decisions have been made based on existing codebase patterns and specification requirements. No NEEDS CLARIFICATION items remain.
