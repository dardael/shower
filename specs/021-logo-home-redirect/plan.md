# Implementation Plan: Logo Home Redirect

**Branch**: `021-logo-home-redirect` | **Date**: 2025-01-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/021-logo-home-redirect/spec.md`

## Summary

Make the website logo in the public header menu clickable to navigate users to the home page ("/"). This follows the standard web pattern where clicking a site logo returns users to the homepage. The implementation wraps the existing logo `Image` component with a Next.js `Link` component.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router  
**Primary Dependencies**: React 19, Chakra UI v3, Next.js Link component  
**Storage**: N/A (no data changes)  
**Testing**: Jest for unit tests (only when explicitly requested)  
**Target Platform**: Web (all modern browsers)  
**Project Type**: Web application with Next.js  
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)  
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, consistent theme color usage, YAGNI (minimal implementation), DRY (no duplication), KISS (simple code)  
**Scale/Scope**: Single component modification (PublicHeaderMenu.tsx)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Status | Notes                                                          |
| ------------------------------------ | ------ | -------------------------------------------------------------- |
| I. Architecture-First Development    | PASS   | Presentation layer only - no cross-layer changes               |
| II. Focused Testing Approach         | PASS   | Tests only if explicitly requested                             |
| III. Simplicity-First Implementation | PASS   | Simple Link wrapper, no performance monitoring                 |
| IV. Security by Default              | PASS   | No security changes - public navigation only                   |
| V. Clean Architecture Compliance     | PASS   | Single component modification                                  |
| VI. Accessibility-First Design       | PASS   | Will add proper ARIA attributes for home link                  |
| VII. YAGNI                           | PASS   | Minimal change - only wrap logo in Link                        |
| VIII. DRY                            | PASS   | Reuses existing Next.js Link pattern from PublicHeaderMenuItem |
| IX. KISS                             | PASS   | Simple, straightforward implementation                         |

**Gate Result**: PASS - No violations

## Project Structure

### Documentation (this feature)

```text
specs/021-logo-home-redirect/
├── plan.md              # This file
├── research.md          # Phase 0 output (minimal - simple feature)
├── data-model.md        # Phase 1 output (N/A - no data changes)
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no API changes)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── presentation/
│   └── shared/
│       └── components/
│           └── PublicHeaderMenu/
│               ├── PublicHeaderMenu.tsx    # MODIFY: Wrap logo Image in Link
│               ├── PublicHeaderMenuItem.tsx # Reference for Link pattern
│               ├── PublicHeaderMenuContainer.tsx
│               └── types.ts
```

**Structure Decision**: Single file modification in existing presentation layer component. No new files needed.

## Complexity Tracking

> No violations to justify - all constitution checks pass.

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| None      | N/A        | N/A                                  |
