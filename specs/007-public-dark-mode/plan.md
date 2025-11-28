# Implementation Plan: Public Dark Mode Toggle

**Branch**: `007-public-dark-mode` | **Date**: 2025-01-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-public-dark-mode/spec.md`

## Summary

Add the existing DarkModeToggle component to the right side of the public header menu. The implementation reuses the shared DarkModeToggle component already used in the admin dashboard, requiring only modifications to the PublicHeaderMenu component to include it in the layout.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router  
**Primary Dependencies**: Chakra UI v3, React 19, next-themes (existing)  
**Storage**: Browser localStorage (existing theme persistence via next-themes)  
**Testing**: Jest for unit tests (only when explicitly requested)  
**Target Platform**: Web (all modern browsers)  
**Project Type**: Web application (Next.js App Router)  
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)  
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, consistent theme color usage, YAGNI (minimal implementation), DRY (no duplication), KISS (simple code)  
**Scale/Scope**: Showcase website with admin and public pages

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Status  | Notes                                                      |
| ------------------------------------ | ------- | ---------------------------------------------------------- |
| I. Architecture-First Development    | ✅ PASS | Reuses existing shared component in Presentation layer     |
| II. Focused Testing Approach         | ✅ PASS | No tests required unless explicitly requested              |
| III. Simplicity-First Implementation | ✅ PASS | No performance monitoring, simple component integration    |
| IV. Security by Default              | ✅ PASS | Public feature, no auth required                           |
| V. Clean Architecture Compliance     | ✅ PASS | Uses existing shared component, proper layer separation    |
| VI. Accessibility-First Design       | ✅ PASS | DarkModeToggle has ARIA attributes and keyboard navigation |
| VII. YAGNI                           | ✅ PASS | Reuses existing component, no new features                 |
| VIII. DRY                            | ✅ PASS | No code duplication, reuses DarkModeToggle                 |
| IX. KISS                             | ✅ PASS | Simple integration of existing component                   |

**Gate Status**: ✅ ALL GATES PASSED

## Project Structure

### Documentation (this feature)

```text
specs/007-public-dark-mode/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (N/A - no data changes)
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no API changes)
│   └── api-contracts.md # API contracts documentation
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── presentation/
│   └── shared/
│       └── components/
│           ├── DarkModeToggle.tsx           # Existing (reuse as-is)
│           └── PublicHeaderMenu/
│               ├── index.ts                  # Export barrel (update if needed)
│               ├── types.ts                  # Types (no changes needed)
│               ├── PublicHeaderMenu.tsx      # Main component (MODIFY)
│               ├── PublicHeaderMenuContainer.tsx  # Container (no changes needed)
│               ├── PublicHeaderMenuItem.tsx  # Menu item (no changes needed)
│               └── usePublicHeaderMenu.ts    # Data hook (no changes needed)
```

**Structure Decision**: Uses existing Next.js App Router structure with shared presentation components. Only PublicHeaderMenu.tsx requires modification to include the DarkModeToggle component.

## Complexity Tracking

> No violations - all constitution gates passed. This is a minimal integration task reusing existing components.
