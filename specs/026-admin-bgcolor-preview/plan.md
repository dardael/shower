# Implementation Plan: Admin Background Color Preview

**Branch**: `026-admin-bgcolor-preview` | **Date**: 2025-12-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/026-admin-bgcolor-preview/spec.md`

## Summary

Add a live preview to the BackgroundColorSelector component that displays the actual background color as it will appear on the public site, respecting the administrator's current color mode (light/dark). The preview uses the existing BACKGROUND_COLOR_MAP to ensure 100% accuracy with public site colors.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router + React 19
**Primary Dependencies**: Chakra UI v3, next-themes (via useColorMode hook)
**Storage**: N/A (uses existing settings infrastructure)
**Testing**: Jest for unit tests and integration tests (explicitly requested by user)
**Target Platform**: Web (admin dashboard)
**Project Type**: Web application (Next.js)
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, consistent theme color usage, YAGNI (minimal implementation), DRY (no duplication), KISS (simple code)
**Scale/Scope**: Single admin component enhancement

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle               | Status | Notes                                              |
| ----------------------- | ------ | -------------------------------------------------- |
| I. Architecture-First   | PASS   | Presentation layer only, no cross-layer violations |
| II. Focused Testing     | PASS   | Tests explicitly requested by user                 |
| III. Simplicity-First   | PASS   | No performance monitoring, simple preview element  |
| IV. Security by Default | N/A    | No security changes, admin-only feature            |
| V. Clean Architecture   | PASS   | Component enhancement within existing structure    |
| VI. Accessibility-First | PASS   | Preview respects color modes, proper contrast      |
| VII. YAGNI              | PASS   | Minimal implementation - preview element only      |
| VIII. DRY               | PASS   | Reuses existing BACKGROUND_COLOR_MAP               |
| IX. KISS                | PASS   | Simple color preview with existing utilities       |

## Project Structure

### Documentation (this feature)

```text
specs/026-admin-bgcolor-preview/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no API changes)
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── presentation/
│   ├── admin/
│   │   └── components/
│   │       └── BackgroundColorSelector.tsx  # Enhanced with preview
│   └── shared/
│       └── components/
│           └── ui/
│               └── provider.tsx             # Contains BACKGROUND_COLOR_MAP (reuse)

test/
├── unit/
│   └── presentation/
│       └── admin/
│           └── components/
│               └── BackgroundColorSelector.test.tsx  # New/enhanced tests
└── integration/
    └── background-color-preview.integration.test.tsx  # New integration tests
```

**Structure Decision**: Single component enhancement in existing presentation layer with dedicated unit and integration tests.

## Complexity Tracking

No violations to justify - implementation follows all constitution principles.
