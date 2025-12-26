# Implementation Plan: Header Menu Text Color Configuration

**Branch**: `050-header-menu-text-color` | **Date**: 2025-12-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/050-header-menu-text-color/spec.md`

## Summary

Add administrator configuration for header menu text color, allowing customization of menu text appearance to match website branding and ensure readability against the header background. Follows established patterns from feature 049 (header-menu-bgcolor) using React Context for state management, settings API for persistence, and color picker UI components.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router + React 19  
**Primary Dependencies**: Chakra UI v3, React Context, tsyringe (DI)  
**Storage**: MongoDB via Mongoose (existing settings infrastructure)  
**Testing**: Jest for unit tests and integration tests (only when explicitly requested)  
**Target Platform**: Web (browser)  
**Project Type**: Web application (Next.js)  
**Performance Goals**: Simplicity over performance monitoring  
**Constraints**: No performance monitoring, simplicity-first, proper contrast for light/dark modes, YAGNI, DRY, KISS, configuration portability, French localization  
**Scale/Scope**: Admin configuration feature, single-user at a time

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                             | Status  | Notes                                                           |
| ------------------------------------- | ------- | --------------------------------------------------------------- |
| I. Architecture-First (DDD/Hexagonal) | ✅ PASS | Follows existing domain/application/infrastructure/presentation |
| II. Focused Testing                   | ✅ PASS | No tests required unless explicitly requested                   |
| III. Simplicity-First                 | ✅ PASS | No performance monitoring, follows existing patterns            |
| IV. Security by Default               | ✅ PASS | Uses existing admin-protected settings infrastructure           |
| V. Clean Architecture                 | ✅ PASS | Proper layer separation with DI                                 |
| VI. Accessibility-First               | ✅ PASS | Text color configurable for readability                         |
| VII. YAGNI                            | ✅ PASS | Minimal implementation - single color setting                   |
| VIII. DRY                             | ✅ PASS | Reuses existing settings infrastructure and patterns            |
| IX. KISS                              | ✅ PASS | Simple color picker following existing BackgroundColorSelector  |
| X. Configuration Portability          | ✅ PASS | New setting key integrated with export/import                   |
| XI. French Localization               | ✅ PASS | All labels and messages in French                               |

**Gate Result**: All gates passed. Proceeding to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/050-header-menu-text-color/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api.md           # API contracts
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── domain/
│   └── settings/
│       ├── constants/
│       │   └── SettingKeys.ts              # Add HEADER_MENU_TEXT_COLOR key
│       └── value-objects/
│           └── HeaderMenuTextColor.ts      # New value object
├── application/
│   └── settings/
│       ├── interfaces/
│       │   ├── IGetHeaderMenuTextColor.ts  # New interface
│       │   └── IUpdateHeaderMenuTextColor.ts # New interface
│       └── use-cases/
│           ├── GetHeaderMenuTextColor.ts   # New use case
│           └── UpdateHeaderMenuTextColor.ts # New use case
├── infrastructure/
│   └── settings/
│       └── api/
│           └── header-menu-text-color/     # New API route
│               └── route.ts
├── presentation/
│   ├── admin/
│   │   └── components/
│   │       └── HeaderMenuTextColorSelector.tsx  # New component
│   └── shared/
│       ├── contexts/
│       │   └── HeaderMenuTextColorContext.tsx   # New context
│       └── components/
│           └── PublicHeaderMenu/
│               └── PublicHeaderMenu.tsx    # Update to use context
└── app/
    └── api/
        └── settings/
            └── header-menu-text-color/
                └── route.ts                # New API endpoint
```

**Structure Decision**: Extends existing web application structure following DDD/Hexagonal patterns. Changes follow established settings infrastructure patterns from ThemeColor and BackgroundColor implementations.

## Complexity Tracking

> No violations detected. All changes follow existing patterns with minimal additions.
