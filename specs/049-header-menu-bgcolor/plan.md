# Implementation Plan: Extended Color Palette Options

**Branch**: `049-header-menu-bgcolor` | **Date**: 2025-12-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/049-header-menu-bgcolor/spec.md`

## Summary

Extend existing color configuration system by adding new color options to two palettes:

- Header menu background: Add `#eeb252` and `#f2e8de` to existing theme color palette
- Website background: Add `#e2cbac` and `#ffffff` to existing background color map

Technical approach: Add new color tokens to `ThemeColorPalette.ts` and corresponding entries in `BACKGROUND_COLOR_MAP`, `CUSTOM_COLOR_DISPLAY`, and theme definitions.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router + React 19  
**Primary Dependencies**: Chakra UI v3, React Context (ThemeColorContext, BackgroundColorContext)  
**Storage**: MongoDB via Mongoose (existing settings infrastructure)  
**Testing**: Jest for unit tests and integration tests (only when explicitly requested)  
**Target Platform**: Web (browser)  
**Project Type**: Web application (Next.js)  
**Performance Goals**: Simplicity over performance monitoring  
**Constraints**: No performance monitoring, simplicity-first, proper contrast for light/dark modes, YAGNI, DRY, KISS, configuration portability, French localization  
**Scale/Scope**: Admin configuration feature, single-user at a time

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                             | Status  | Notes                                                         |
| ------------------------------------- | ------- | ------------------------------------------------------------- |
| I. Architecture-First (DDD/Hexagonal) | ✅ PASS | Extends existing domain constants and presentation components |
| II. Focused Testing                   | ✅ PASS | No tests required unless explicitly requested                 |
| III. Simplicity-First                 | ✅ PASS | No performance monitoring, minimal changes                    |
| IV. Security by Default               | ✅ PASS | Uses existing admin-protected settings infrastructure         |
| V. Clean Architecture                 | ✅ PASS | Changes follow existing layer patterns                        |
| VI. Accessibility-First               | ✅ PASS | Colors must have proper contrast (verified in research)       |
| VII. YAGNI                            | ✅ PASS | Only adding requested colors, no extra features               |
| VIII. DRY                             | ✅ PASS | Reuses existing color infrastructure                          |
| IX. KISS                              | ✅ PASS | Simple addition to existing arrays/objects                    |
| X. Configuration Portability          | ✅ PASS | No new config fields, just new allowed values                 |
| XI. French Localization               | ✅ PASS | No new user-facing text required                              |

**Gate Result**: All gates passed. Proceeding to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/049-header-menu-bgcolor/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no API changes)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── domain/
│   └── settings/
│       └── constants/
│           └── ThemeColorPalette.ts    # Add new color tokens
├── presentation/
│   ├── admin/
│   │   └── components/
│   │       ├── ThemeColorSelector.tsx  # Update CUSTOM_COLOR_DISPLAY
│   │       └── BackgroundColorSelector.tsx  # Update for new colors
│   └── shared/
│       ├── components/
│       │   └── ui/
│       │       └── provider.tsx        # Add to BACKGROUND_COLOR_MAP
│       └── theme.ts                    # Add color definitions
```

**Structure Decision**: Extends existing web application structure. Changes isolated to domain constants and presentation components only.

## Complexity Tracking

> No violations detected. All changes follow existing patterns with minimal additions.
