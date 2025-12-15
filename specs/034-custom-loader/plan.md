# Implementation Plan: Custom Loader Configuration

**Branch**: `034-custom-loader` | **Date**: 2025-12-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/034-custom-loader/spec.md`

## Summary

Allow administrators to configure a custom GIF or video to replace the default spinning loader on public pages. The implementation extends the existing settings infrastructure with a new `CUSTOM_LOADER` setting, adds file upload/serving endpoints for loader media, and enhances the `PublicPageLoader` component to conditionally display the custom animation.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router + React 19  
**Primary Dependencies**: Chakra UI v3, tsyringe (DI), existing FileStorageService, existing settings infrastructure  
**Storage**: MongoDB via Mongoose (settings), local filesystem (`public/loaders/`)  
**Testing**: Jest for unit tests and integration tests (only when explicitly requested)  
**Target Platform**: Web (modern browsers with MP4/WebM/GIF support)  
**Project Type**: Web application (Next.js App Router)  
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)  
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, YAGNI (minimal implementation), DRY (no duplication), KISS (simple code), configuration portability (sync export/import on config changes)  
**Scale/Scope**: Single-tenant showcase website builder

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Status | Notes                                                                                                      |
| ------------------------------------ | ------ | ---------------------------------------------------------------------------------------------------------- |
| I. Architecture-First Development    | PASS   | Follows DDD/Hexagonal: Domain entity, Application use-case, Infrastructure storage, Presentation component |
| II. Focused Testing Approach         | PASS   | User explicitly requested unit tests for loader display logic                                              |
| III. Simplicity-First Implementation | PASS   | No performance monitoring included                                                                         |
| IV. Security by Default              | PASS   | Admin upload protected by auth, public endpoint read-only                                                  |
| V. Clean Architecture Compliance     | PASS   | Proper layer separation maintained                                                                         |
| VI. Accessibility-First Design       | PASS   | Preserves ARIA attributes, works in light/dark modes                                                       |
| VII. YAGNI                           | PASS   | Implements only GIF/video upload and display                                                               |
| VIII. DRY                            | PASS   | Reuses existing FileStorageService patterns and settings infrastructure                                    |
| IX. KISS                             | PASS   | Simple conditional rendering in PublicPageLoader                                                           |
| X. Configuration Portability         | PASS   | Export/import sync for custom loader files included                                                        |

## Project Structure

### Documentation (this feature)

```text
specs/034-custom-loader/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── domain/
│   └── settings/
│       ├── constants/
│       │   └── SettingKeys.ts          # Add CUSTOM_LOADER key
│       └── entities/
│           └── WebsiteSetting.ts       # Add createCustomLoader factory
├── application/
│   └── settings/
│       └── use-cases/
│           └── [existing patterns]     # Follows existing use-case patterns
├── infrastructure/
│   └── shared/
│       └── services/
│           └── FileStorageService.ts   # Add uploadCustomLoader, deleteCustomLoader
├── presentation/
│   ├── shared/
│   │   ├── components/
│   │   │   └── PublicPageLoader.tsx    # Enhance for custom loader display
│   │   └── hooks/
│   │       └── usePublicPageData.tsx   # Add loader data fetching
│   └── admin/
│       └── components/
│           └── WebsiteSettingsForm.tsx # Add loader configuration section
└── app/
    └── api/
        ├── loaders/
        │   └── [filename]/
        │       └── route.ts            # New: serve loader files
        ├── settings/
        │   └── loader/
        │       └── route.ts            # New: admin loader config
        └── public/
            └── loader/
                └── route.ts            # New: public loader endpoint

test/
└── unit/
    └── presentation/
        └── shared/
            └── components/
                └── PublicPageLoader.test.tsx  # Unit tests for loader display
```

**Structure Decision**: Follows existing Next.js App Router structure with DDD layers. New endpoints follow established patterns for settings and file serving.

## Complexity Tracking

> No violations - all gates pass.
