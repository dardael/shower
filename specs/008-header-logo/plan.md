# Implementation Plan: Header Logo Configuration

**Branch**: `008-header-logo` | **Date**: 2025-11-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/008-header-logo/spec.md`

## Summary

Add header logo configuration allowing admins to upload a logo image via the menu configuration page, which displays at the left of the public header menu. Implementation follows existing patterns from website icon feature (WebsiteIcon value object, FileStorageService, ImageManager component).

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router  
**Primary Dependencies**: Chakra UI v3, React 19, tsyringe for DI, existing ImageManager component  
**Storage**: MongoDB via Mongoose (WebsiteSettingsModel for logo metadata)  
**Testing**: Jest for unit tests and integration tests (only when explicitly requested)  
**Target Platform**: Web application (Next.js)  
**Project Type**: Web application with admin and public interfaces  
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)  
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, consistent theme color usage, YAGNI (minimal implementation), DRY (no duplication), KISS (simple code)  
**Scale/Scope**: Single-tenant showcase website, single logo image

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                             | Pre-Design | Post-Design | Notes                                                                                                                                                                          |
| ------------------------------------- | ---------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| I. Architecture-First (DDD/Hexagonal) | PASS       | PASS        | Using existing layer structure: Domain (HeaderLogo value object), Application (use cases), Infrastructure (repository, file storage), Presentation (admin form, public header) |
| II. Focused Testing                   | PASS       | PASS        | Tests only when explicitly requested                                                                                                                                           |
| III. Simplicity-First                 | PASS       | PASS        | No performance monitoring, reusing existing patterns                                                                                                                           |
| IV. Security by Default               | PASS       | PASS        | Admin endpoints protected by withApi wrapper, public endpoint unauthenticated                                                                                                  |
| V. Clean Architecture                 | PASS       | PASS        | Following existing WebsiteIcon pattern with proper separation                                                                                                                  |
| VI. Accessibility-First               | PASS       | PASS        | Logo display in header with proper alt text, works in light/dark modes                                                                                                         |
| VII. YAGNI                            | PASS       | PASS        | Only implementing upload/display, no click behavior or variants                                                                                                                |
| VIII. DRY                             | PASS       | PASS        | Reusing ImageManager, FileStorageService patterns                                                                                                                              |
| IX. KISS                              | PASS       | PASS        | Simple value object, straightforward API endpoints                                                                                                                             |

**Post-Design Verification**: All constitution principles verified after Phase 1 design. Design follows existing patterns and maintains architectural consistency.

## Project Structure

### Documentation (this feature)

```text
specs/008-header-logo/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api-contracts.md # API endpoint specifications
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── domain/
│   └── settings/
│       ├── constants/
│       │   └── SettingKeys.ts           # Add HEADER_LOGO key
│       └── value-objects/
│           └── HeaderLogo.ts            # New value object (similar to WebsiteIcon)
├── application/
│   └── settings/
│       ├── GetHeaderLogo.ts             # New use case
│       ├── IGetHeaderLogo.ts            # Interface
│       ├── UpdateHeaderLogo.ts          # New use case
│       └── IUpdateHeaderLogo.ts         # Interface
├── infrastructure/
│   ├── shared/
│   │   └── services/
│   │       └── FileStorageService.ts    # Add uploadLogo/deleteLogo methods
│   └── container.ts                     # Register new use cases
├── app/
│   └── api/
│       ├── settings/
│       │   └── logo/
│       │       └── route.ts             # Admin logo API (GET, POST, DELETE)
│       └── public/
│           └── logo/
│               └── route.ts             # Public logo API (GET only)
└── presentation/
    ├── admin/
    │   └── components/
    │       └── MenuConfigForm.tsx       # Add logo upload section
    └── shared/
        └── components/
            └── PublicHeaderMenu/
                ├── PublicHeaderMenu.tsx # Add logo display
                ├── usePublicHeaderMenu.ts # Add logo fetching
                └── types.ts             # Add logo types

test/
└── unit/
    ├── domain/
    │   └── settings/
    │       └── value-objects/
    │           └── HeaderLogo.test.ts   # Value object tests (if requested)
    └── application/
        └── settings/
            ├── GetHeaderLogo.test.ts    # Use case tests (if requested)
            └── UpdateHeaderLogo.test.ts # Use case tests (if requested)
```

**Structure Decision**: Following existing Next.js 15 App Router structure with DDD/Hexagonal architecture. Logo feature integrates with existing settings domain and reuses established patterns from website icon feature.

## Complexity Tracking

No violations to justify - all requirements satisfied by existing patterns and simple implementations.
