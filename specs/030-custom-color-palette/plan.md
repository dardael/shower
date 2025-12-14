# Implementation Plan: Custom Color Palette

**Branch**: `030-custom-color-palette` | **Date**: 2025-12-14 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/030-custom-color-palette/spec.md`

## Summary

Add three new custom colors to the existing color selection system: a beige theme color (#cdb99d), a cream background color (#ede6dd), and a burgundy font color (#642e2a) for the rich text editor. This requires extending the theme color palette, background color mapping, semantic tokens, and editor preset colors while maintaining visual consistency with existing color squares.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router + React 19
**Primary Dependencies**: Chakra UI v3, Tiptap (@tiptap/react, @tiptap/extension-color), tsyringe for DI
**Storage**: MongoDB via Mongoose (existing settings infrastructure)
**Testing**: Jest for unit tests and integration tests (only when explicitly requested)
**Target Platform**: Web application (modern browsers)
**Project Type**: Next.js App Router with DDD/Hexagonal architecture
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, consistent theme color usage, YAGNI (minimal implementation), DRY (no duplication), KISS (simple code)
**Scale/Scope**: Single-admin showcase website builder

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Status  | Notes                                                                                                                               |
| ------------------------------------ | ------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| I. Architecture-First Development    | ✅ PASS | Changes follow existing layer separation: Domain (ThemeColorPalette), Presentation (theme.ts, provider.tsx, selectors, ColorPicker) |
| II. Focused Testing Approach         | ✅ PASS | No tests required unless explicitly requested; existing validation logic auto-extends                                               |
| III. Simplicity-First Implementation | ✅ PASS | No performance monitoring; minimal changes to existing patterns                                                                     |
| IV. Security by Default              | ✅ PASS | Color settings already protected by admin authentication                                                                            |
| V. Clean Architecture Compliance     | ✅ PASS | Extends existing value objects and constants following established patterns                                                         |
| VI. Accessibility-First Design       | ✅ PASS | Dark mode variants computed for proper contrast; theme colors use semantic tokens                                                   |
| VII. YAGNI                           | ✅ PASS | Only adding the 3 requested colors; no speculative additions                                                                        |
| VIII. DRY                            | ✅ PASS | Reuses existing color selector patterns; extends existing arrays/maps                                                               |
| IX. KISS                             | ✅ PASS | Simple additions to existing data structures; no complex abstractions                                                               |

**Gate Result**: PASSED - All constitution principles satisfied

### Post-Design Re-evaluation (Phase 1 Complete)

| Principle                            | Status  | Notes                                                                    |
| ------------------------------------ | ------- | ------------------------------------------------------------------------ |
| I. Architecture-First Development    | ✅ PASS | Design confirmed: 4 files modified across Domain and Presentation layers |
| II. Focused Testing Approach         | ✅ PASS | No new tests needed; existing validation auto-extends                    |
| III. Simplicity-First Implementation | ✅ PASS | Only array/map extensions; no new abstractions                           |
| IV. Security by Default              | ✅ PASS | Uses existing authenticated admin settings flow                          |
| V. Clean Architecture Compliance     | ✅ PASS | Follows existing patterns exactly                                        |
| VI. Accessibility-First Design       | ✅ PASS | Dark mode variants computed with proper contrast                         |
| VII. YAGNI                           | ✅ PASS | Exactly 3 colors added as requested                                      |
| VIII. DRY                            | ✅ PASS | No duplication; extends existing structures                              |
| IX. KISS                             | ✅ PASS | Simple value additions to existing arrays/maps                           |

**Post-Design Gate Result**: PASSED - Ready for `/speckit.tasks`

## Project Structure

### Documentation (this feature)

```text
specs/030-custom-color-palette/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── domain/
│   └── settings/
│       └── constants/
│           └── ThemeColorPalette.ts    # Add 'beige', 'cream' tokens
├── presentation/
│   ├── shared/
│   │   ├── components/
│   │   │   └── ui/
│   │   │       └── provider.tsx        # Extend BACKGROUND_COLOR_MAP
│   │   └── theme.ts                    # Add semantic tokens for beige, cream
│   └── admin/
│       └── components/
│           └── PageContentEditor/
│               └── ColorPicker.tsx     # Add burgundy to PRESET_COLORS

test/
└── unit/
    └── domain/
        └── settings/
            └── ThemeColorPalette.test.ts  # Validation auto-extends (no changes needed)
```

**Structure Decision**: Follows existing Next.js App Router with DDD/Hexagonal architecture. Changes are minimal extensions to existing files in Domain (constants) and Presentation (theme, UI components) layers.

## Complexity Tracking

> No violations - all changes follow existing patterns with minimal additions.

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| N/A       | N/A        | N/A                                  |
