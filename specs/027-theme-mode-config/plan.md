# Implementation Plan: Theme Mode Configuration

**Branch**: `027-theme-mode-config` | **Date**: 2025-12-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/027-theme-mode-config/spec.md`

## Summary

Allow administrators to configure the website's theme mode behavior: force light mode, force dark mode, or allow user choice. When forced, the theme toggle button is hidden and the configured mode is applied to both admin and public interfaces. Includes unit and integration tests to verify forced options work correctly.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router + React 19  
**Primary Dependencies**: Chakra UI v3, next-themes (via useColorMode hook), tsyringe for DI  
**Storage**: MongoDB via Mongoose (existing settings infrastructure)  
**Testing**: Jest for unit tests and integration tests (explicitly requested by user)  
**Target Platform**: Web (browser)  
**Project Type**: Web application (Next.js full-stack)  
**Performance Goals**: Simplicity over performance monitoring  
**Constraints**: YAGNI (minimal implementation), DRY (no duplication), KISS (simple code), proper contrast for light/dark modes  
**Scale/Scope**: Single-tenant showcase website

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle               | Status  | Notes                                                                      |
| ----------------------- | ------- | -------------------------------------------------------------------------- |
| I. Architecture-First   | ✅ PASS | Follows DDD/Hexagonal: domain value object, presentation hooks, API routes |
| II. Focused Testing     | ✅ PASS | Tests explicitly requested by user for forced options verification         |
| III. Simplicity-First   | ✅ PASS | No performance monitoring, minimal implementation                          |
| IV. Security by Default | ✅ PASS | Settings POST requires authentication (existing)                           |
| V. Clean Architecture   | ✅ PASS | Proper layer separation maintained                                         |
| VI. Accessibility-First | ✅ PASS | Theme ensures proper contrast in both modes                                |
| VII. YAGNI              | ✅ PASS | Only implements required functionality                                     |
| VIII. DRY               | ✅ PASS | Reuses existing settings infrastructure                                    |
| IX. KISS                | ✅ PASS | Simple enum-based configuration                                            |

## Project Structure

### Documentation (this feature)

```text
specs/027-theme-mode-config/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── settings-api.md
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── app/
│   └── api/
│       └── settings/
│           └── route.ts              # MODIFY: Add themeMode
├── domain/
│   └── settings/
│       ├── constants/
│       │   └── SettingKeys.ts        # MODIFY: Add THEME_MODE
│       └── value-objects/
│           └── ThemeModeConfig.ts    # NEW: Value object
├── presentation/
│   ├── admin/
│   │   └── components/
│   │       └── ThemeModeSelector.tsx # NEW: Admin UI
│   └── shared/
│       ├── components/
│       │   └── DarkModeToggle.tsx    # MODIFY: Conditional render
│       └── hooks/
│           └── useThemeModeConfig.ts # NEW: Config hook

test/
├── unit/
│   └── presentation/
│       └── shared/
│           ├── components/
│           │   └── DarkModeToggle.test.tsx    # NEW
│           └── hooks/
│               └── useThemeModeConfig.test.ts # NEW
└── integration/
    └── theme-mode-config.integration.test.tsx # NEW
```

**Structure Decision**: Next.js App Router with DDD layers. Uses existing settings infrastructure (MongoDB, API routes, repositories).

## Complexity Tracking

> No violations - all constitution principles pass.
