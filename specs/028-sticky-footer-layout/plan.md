# Implementation Plan: Sticky Footer Layout

**Branch**: `028-sticky-footer-layout` | **Date**: 2025-12-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/028-sticky-footer-layout/spec.md`

## Summary

Implement a sticky footer layout for public pages where the footer remains at the bottom of the viewport on short pages while flowing naturally on long pages. Additionally, ensure the background color extends from header to footer with no gaps. This is achieved through CSS flexbox restructuring of the `PublicPageLayout` component.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router + React 19  
**Primary Dependencies**: Chakra UI v3, existing PublicPageLayout component  
**Storage**: N/A (CSS-only change, no data persistence)  
**Testing**: Jest for unit tests and integration tests (only when explicitly requested)  
**Target Platform**: Web browsers (responsive: 320px to 1920px viewport widths)  
**Project Type**: Web application (Next.js)  
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)  
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, consistent theme color usage, YAGNI (minimal implementation), DRY (no duplication), KISS (simple code)  
**Scale/Scope**: All public-facing pages using PublicPageLayout

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle               | Status | Notes                                            |
| ----------------------- | ------ | ------------------------------------------------ |
| I. Architecture-First   | PASS   | Changes confined to Presentation layer only      |
| II. Focused Testing     | PASS   | No tests unless explicitly requested             |
| III. Simplicity-First   | PASS   | Pure CSS solution, no JS height calculations     |
| IV. Security by Default | N/A    | No security implications (CSS styling only)      |
| V. Clean Architecture   | PASS   | Single component modification, proper separation |
| VI. Accessibility-First | PASS   | No contrast changes, maintains theme colors      |
| VII. YAGNI              | PASS   | Minimal flexbox properties only                  |
| VIII. DRY               | PASS   | Reuses existing layout component                 |
| IX. KISS                | PASS   | Standard flexbox sticky footer pattern           |

## Project Structure

### Documentation (this feature)

```text
specs/028-sticky-footer-layout/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (minimal - no entities)
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (empty - no APIs)
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── presentation/
│   └── shared/
│       └── components/
│           └── PublicPageLayout/
│               └── PublicPageLayout.tsx  # PRIMARY CHANGE: Add flex wrapper
```

**Structure Decision**: This is a CSS-only change to an existing component. No new files needed. The `PublicPageLayout.tsx` component will be modified to wrap header, main content, and footer in a flex container.

## Complexity Tracking

> No violations requiring justification. Implementation follows all constitution principles.
