# Implementation Plan: Loader Background Color Configuration

**Branch**: `051-loader-bgcolor-config` | **Date**: 2025-12-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/051-loader-bgcolor-config/spec.md`

## Summary

Enable administrators to configure a custom background color for loading screens to create visual cohesion with custom loader animations or website branding. The implementation reuses existing settings infrastructure (WebsiteSetting entity, BackgroundColorSelector component pattern) and integrates with the export/import system.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router + React 19
**Primary Dependencies**: Chakra UI v3, tsyringe (DI), existing BackgroundColorSelector component pattern, existing settings infrastructure
**Storage**: MongoDB via Mongoose (WebsiteSetting collection with key-value pattern)
**Testing**: Jest for unit tests and integration tests (only when explicitly requested)
**Target Platform**: Web (modern browsers)
**Project Type**: Web application (Next.js App Router)
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, consistent theme color usage, YAGNI (minimal implementation), DRY (no duplication), KISS (simple code), configuration portability (sync export/import on config changes), French localization (all visible text in French)
**Scale/Scope**: Single admin user, single loading screen configuration

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Status  | Notes                                                                                                                          |
| ------------------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------ |
| I. Architecture-First Development    | ✅ PASS | Uses existing DDD layers: Domain (value object), Application (use case), Infrastructure (repository), Presentation (component) |
| II. Focused Testing Approach         | ✅ PASS | No tests unless explicitly requested                                                                                           |
| III. Simplicity-First Implementation | ✅ PASS | No performance monitoring, simple color configuration                                                                          |
| IV. Security by Default              | ✅ PASS | Admin-only configuration via existing BetterAuth middleware                                                                    |
| V. Clean Architecture Compliance     | ✅ PASS | Follows existing settings pattern with proper layer separation                                                                 |
| VI. Accessibility-First Design       | ✅ PASS | Color picker with proper contrast, theme-aware defaults                                                                        |
| VII. YAGNI                           | ✅ PASS | Minimal implementation: one color setting for all loading screens                                                              |
| VIII. DRY                            | ✅ PASS | Reuses existing BackgroundColorSelector pattern and settings infrastructure                                                    |
| IX. KISS                             | ✅ PASS | Simple key-value storage, no complex logic                                                                                     |
| X. Configuration Portability         | ✅ PASS | Will add to SettingKeys, automatic export/import support                                                                       |
| XI. French Localization              | ✅ PASS | All UI labels in French                                                                                                        |

## Project Structure

### Documentation (this feature)

```text
specs/051-loader-bgcolor-config/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── domain/settings/
│   ├── constants/
│   │   └── SettingKeys.ts                    # Add LOADER_BACKGROUND_COLOR key
│   └── value-objects/
│       └── LoaderBackgroundColor.ts          # New value object
├── application/settings/
│   └── use-cases/
│       ├── GetLoaderBackgroundColor.ts       # New use case
│       └── UpdateLoaderBackgroundColor.ts    # New use case
├── infrastructure/settings/
│   └── adapters/                             # Existing MongooseWebsiteSettingsRepository
├── presentation/admin/
│   ├── components/
│   │   └── LoaderBackgroundColorSelector.tsx # New component (reuse BackgroundColorSelector pattern)
│   └── hooks/
│       └── useLoaderBackgroundColor.ts       # New hook
├── presentation/shared/
│   └── contexts/
│       └── LoaderBackgroundColorContext.tsx  # New context provider
└── app/
    └── api/
        ├── settings/
        │   └── loader-background-color/
        │       └── route.ts                  # New admin API endpoint
        └── public/
            └── loader-background-color/
                └── route.ts                  # New public API endpoint

test/
├── unit/
│   └── domain/settings/value-objects/
│       └── LoaderBackgroundColor.test.ts     # Unit tests (if requested)
└── integration/
    └── loader-background-color.integration.test.tsx  # Integration tests (if requested)
```

**Structure Decision**: Follows existing DDD + Hexagonal architecture with settings pattern established by background-color and custom-loader features.
