# Implementation Plan: Public Header Menu

**Branch**: `006-public-header-menu` | **Date**: 2025-11-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-public-header-menu/spec.md`

## Summary

Display a header menu on the public side of the website showing admin-configured menu items in the correct order. The header uses the configured theme color and supports both light and dark modes. Menu items are non-clickable text elements (navigation will be added in a future feature). Mobile-responsive design is out of scope.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router  
**Primary Dependencies**: Chakra UI v3, React 19, tsyringe for DI  
**Storage**: MongoDB via Mongoose (existing MenuItemModel)  
**Testing**: Jest for unit tests and integration tests (only when explicitly requested)  
**Target Platform**: Web (modern browsers)  
**Project Type**: Web application (Next.js App Router)  
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)  
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, consistent theme color usage, YAGNI (minimal implementation), DRY (no duplication), KISS (simple code)  
**Scale/Scope**: Public-facing header displayed on all public pages

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Status  | Notes                                                                                                                                                                                |
| ------------------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| I. Architecture-First Development    | ✅ PASS | Uses existing DDD/Hexagonal patterns with domain entities (MenuItem), application layer (GetMenuItems), infrastructure layer (repository), and presentation layer (React components) |
| II. Focused Testing Approach         | ✅ PASS | No tests created unless explicitly requested                                                                                                                                         |
| III. Simplicity-First Implementation | ✅ PASS | No performance monitoring included; simple component structure                                                                                                                       |
| IV. Security by Default              | ✅ PASS | Public endpoint - no auth required for read-only menu display; follows existing public API pattern                                                                                   |
| V. Clean Architecture Compliance     | ✅ PASS | Reuses existing GetMenuItems use case; new public API endpoint follows existing patterns                                                                                             |
| VI. Accessibility-First Design       | ✅ PASS | Semantic color tokens for light/dark mode; theme color integration; proper contrast                                                                                                  |
| VII. YAGNI                           | ✅ PASS | No navigation, no mobile responsive design, no icons, no dropdowns - strictly minimal implementation                                                                                 |
| VIII. DRY                            | ✅ PASS | Reuses existing MenuItem entity, GetMenuItems use case, ThemeColorContext, and public API patterns                                                                                   |
| IX. KISS                             | ✅ PASS | Simple header component with horizontal text items; straightforward data fetching                                                                                                    |

**Gate Result**: ✅ PASS - Proceed to Phase 0

### Post-Design Re-check (After Phase 1)

| Principle                            | Status  | Notes                                                                        |
| ------------------------------------ | ------- | ---------------------------------------------------------------------------- |
| I. Architecture-First Development    | ✅ PASS | API endpoint follows public API pattern; component follows existing patterns |
| II. Focused Testing Approach         | ✅ PASS | No tests in design artifacts                                                 |
| III. Simplicity-First Implementation | ✅ PASS | Simple data model, straightforward API, minimal components                   |
| IV. Security by Default              | ✅ PASS | Public read-only endpoint; no sensitive data exposed in errors               |
| V. Clean Architecture Compliance     | ✅ PASS | Proper layer separation; reuses existing use cases                           |
| VI. Accessibility-First Design       | ✅ PASS | Design uses semantic tokens; colorPalette for theming                        |
| VII. YAGNI                           | ✅ PASS | Only creates required files; no extra features                               |
| VIII. DRY                            | ✅ PASS | Reuses existing patterns and infrastructure                                  |
| IX. KISS                             | ✅ PASS | Simple API contract; straightforward component structure                     |

**Post-Design Gate Result**: ✅ PASS - Ready for Phase 2 (tasks)

## Project Structure

### Documentation (this feature)

```text
specs/006-public-header-menu/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api-contracts.md
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── api/
│   │   └── public/
│   │       └── menu/
│   │           └── route.ts          # New: Public menu API endpoint
│   └── layout.tsx                    # Modified: Add header component
├── presentation/
│   └── shared/
│       └── components/
│           └── PublicHeaderMenu/     # New: Header menu component directory
│               ├── index.ts
│               ├── types.ts
│               ├── PublicHeaderMenu.tsx
│               ├── PublicHeaderMenuContainer.tsx
│               ├── PublicHeaderMenuItem.tsx
│               └── usePublicHeaderMenu.ts
└── [existing layers - no changes needed]
```

**Structure Decision**: Follows existing Next.js App Router structure with DDD/Hexagonal architecture. New components follow the SocialNetworksFooter pattern (Container + Presentational + Hook + Types). Reuses existing domain/application layers (MenuItem, GetMenuItems).
