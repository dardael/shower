# Implementation Plan: Mobile Header Menu for Public Side

**Branch**: `031-mobile-header-menu` | **Date**: 2025-12-14 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/031-mobile-header-menu/spec.md`

## Summary

Implement a mobile-responsive header menu for the public website that displays a hamburger icon on mobile viewports (< 768px), opening a slide-in navigation drawer with vertically stacked menu items. The implementation will adapt the existing AdminSidebar overlay pattern for the public side while preserving the full horizontal menu on desktop/tablet viewports.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router + React 19  
**Primary Dependencies**: Chakra UI v3 (Box, VStack, HStack, IconButton), react-icons (FiMenu, FiX), existing FocusTrap utility  
**Storage**: N/A (uses existing menu data from usePublicHeaderMenu hook)  
**Testing**: Jest for unit tests and integration tests (only when explicitly requested)  
**Target Platform**: Web browsers (desktop and mobile), viewport widths 320px to 1920px+  
**Project Type**: Web application (Next.js App Router)  
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)  
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, consistent theme color usage, YAGNI (minimal implementation), DRY (no duplication), KISS (simple code)  
**Scale/Scope**: Single public website with configurable menu items (typically 3-10 items)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Status | Notes                                                               |
| ------------------------------------ | ------ | ------------------------------------------------------------------- |
| I. Architecture-First Development    | PASS   | Presentation layer only, follows existing component structure       |
| II. Focused Testing Approach         | PASS   | No tests unless explicitly requested                                |
| III. Simplicity-First Implementation | PASS   | No performance monitoring, reuses existing patterns                 |
| IV. Security by Default              | N/A    | Public-facing component, no authentication required                 |
| V. Clean Architecture Compliance     | PASS   | Component stays in presentation layer, uses existing hooks          |
| VI. Accessibility-First Design       | PASS   | Keyboard navigation, ARIA attributes, focus trap, theme support     |
| VII. YAGNI                           | PASS   | Minimal implementation: hamburger, drawer, close functionality only |
| VIII. DRY                            | PASS   | Reuses AdminSidebar patterns, existing hooks, existing components   |
| IX. KISS                             | PASS   | Simple overlay + backdrop pattern from AdminSidebar                 |

**All gates passed. Proceeding to Phase 0.**

### Post-Design Re-evaluation (Phase 1 Complete)

| Principle                            | Status | Notes                                                      |
| ------------------------------------ | ------ | ---------------------------------------------------------- |
| I. Architecture-First Development    | PASS   | Presentation layer only, 2 new components + 1 modification |
| II. Focused Testing Approach         | PASS   | No tests created, testing checklist in quickstart.md       |
| III. Simplicity-First Implementation | PASS   | Reuses AdminSidebar patterns, no new dependencies          |
| IV. Security by Default              | N/A    | Public-facing, no auth required                            |
| V. Clean Architecture Compliance     | PASS   | No domain/application layer changes                        |
| VI. Accessibility-First Design       | PASS   | FocusTrap, Escape key, ARIA, 44px touch targets planned    |
| VII. YAGNI                           | PASS   | Only hamburger, drawer, close - no extra features          |
| VIII. DRY                            | PASS   | Reuses PublicHeaderMenuItem, FocusTrap, useThemeColor      |
| IX. KISS                             | PASS   | Simple overlay pattern, local useState, CSS transitions    |

**All gates passed post-design. Ready for Phase 2 task breakdown.**

## Project Structure

### Documentation (this feature)

```text
specs/031-mobile-header-menu/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── presentation/
│   └── shared/
│       └── components/
│           └── PublicHeaderMenu/
│               ├── PublicHeaderMenu.tsx          # Modify: add responsive toggle
│               ├── PublicHeaderMenuContainer.tsx # No changes needed
│               ├── PublicHeaderMenuItem.tsx      # Reuse in mobile drawer
│               ├── usePublicHeaderMenu.ts        # No changes needed
│               ├── types.ts                      # No changes needed
│               ├── MobileMenuDrawer.tsx          # NEW: mobile drawer component
│               └── MobileMenuToggle.tsx          # NEW: hamburger toggle button
```

**Structure Decision**: Extend existing PublicHeaderMenu component with new sub-components for mobile functionality. No new directories needed, follows existing component co-location pattern.

## Complexity Tracking

> No constitution violations. Table not needed.
