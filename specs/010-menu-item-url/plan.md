# Implementation Plan: Menu Item URL Configuration

**Branch**: `010-menu-item-url` | **Date**: 2025-12-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/010-menu-item-url/spec.md`

## Summary

Add URL property to menu items enabling navigation on the public site. URLs must be relative paths only (e.g., `/about`, `contact`). The feature extends the existing MenuItem domain entity with a MenuItemUrl value object, updates the admin UI to capture URLs during creation/editing, and renders clickable links in the public header.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router  
**Primary Dependencies**: React 19, Chakra UI v3, tsyringe (DI), @dnd-kit/core, Mongoose  
**Storage**: MongoDB via Mongoose  
**Testing**: Jest for unit tests (explicitly requested for URL validation logic and public frontend click behavior)  
**Target Platform**: Web application (server-rendered Next.js)  
**Project Type**: Web application with DDD/Hexagonal architecture  
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)  
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, consistent theme color usage, YAGNI (minimal implementation), DRY (no duplication), KISS (simple code)  
**Scale/Scope**: Single-tenant admin dashboard with public showcase website

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Pre-Design Check

| Principle                            | Status | Notes                                                                             |
| ------------------------------------ | ------ | --------------------------------------------------------------------------------- |
| I. Architecture-First Development    | PASS   | Follows existing DDD layers: Domain → Application → Infrastructure → Presentation |
| II. Focused Testing Approach         | PASS   | User explicitly requested tests for URL validation and public frontend navigation |
| III. Simplicity-First Implementation | PASS   | No performance monitoring included                                                |
| IV. Security by Default              | PASS   | Menu config protected by existing admin auth; public display read-only            |
| V. Clean Architecture Compliance     | PASS   | Extends existing MenuItem entity, creates new value object, follows patterns      |
| VI. Accessibility-First Design       | PASS   | Will use semantic link elements with proper contrast                              |
| VII. YAGNI                           | PASS   | Only implementing relative URL support as specified                               |
| VIII. DRY                            | PASS   | Reuses existing patterns from MenuItemText value object                           |
| IX. KISS                             | PASS   | Simple validation: non-empty, no absolute URLs                                    |

### Post-Design Re-Check (After Phase 1)

| Principle                            | Status | Verification                                                                      |
| ------------------------------------ | ------ | --------------------------------------------------------------------------------- |
| I. Architecture-First Development    | PASS   | Design follows DDD layers: MenuItemUrl value object, entity extension, repository |
| II. Focused Testing Approach         | PASS   | Tests scoped to: MenuItemUrl validation, MenuItem entity, PublicHeaderMenuItem    |
| III. Simplicity-First Implementation | PASS   | No performance monitoring in design artifacts                                     |
| IV. Security by Default              | PASS   | API contracts maintain auth requirements; public endpoint read-only               |
| V. Clean Architecture Compliance     | PASS   | Dependency flow: Presentation → API → Application → Domain ← Infrastructure       |
| VI. Accessibility-First Design       | PASS   | PublicHeaderMenuItem uses semantic Link with text content                         |
| VII. YAGNI                           | PASS   | Design limited to relative URLs, no external link handling                        |
| VIII. DRY                            | PASS   | MenuItemUrl follows MenuItemText pattern; shared validation approach              |
| IX. KISS                             | PASS   | Simple string checks for validation; no complex parsing                           |

## Project Structure

### Documentation (this feature)

```text
specs/010-menu-item-url/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api-contracts.md
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── domain/
│   └── menu/
│       ├── entities/
│       │   └── MenuItem.ts              # Extend with url property
│       └── value-objects/
│           ├── MenuItemText.ts          # Existing
│           └── MenuItemUrl.ts           # NEW: URL validation value object
├── application/
│   └── menu/
│       ├── AddMenuItem.ts               # Update to accept url parameter
│       └── UpdateMenuItem.ts            # Update to accept url parameter
├── infrastructure/
│   └── menu/
│       ├── models/
│       │   └── MenuItemModel.ts         # Add url field to schema
│       └── repositories/
│           └── MongooseMenuItemRepository.ts  # Update mapping
├── presentation/
│   ├── admin/
│   │   └── components/
│   │       └── MenuConfigForm.tsx       # Add URL input field
│   └── shared/
│       └── components/
│           └── PublicHeaderMenu/
│               └── PublicHeaderMenuItem.tsx  # Convert to Link component
└── app/
    └── api/
        └── settings/
            └── menu/
                ├── route.ts             # Update POST to accept url
                ├── [id]/route.ts        # Update PATCH to accept url
                └── types.ts             # Add url to DTOs

test/
└── unit/
    ├── domain/
    │   └── menu/
    │       ├── entities/
    │       │   └── MenuItem.test.ts     # Extend tests for url
    │       └── value-objects/
    │           └── MenuItemUrl.test.ts  # NEW: URL validation tests
    ├── application/
    │   └── menu/
    │       ├── AddMenuItem.test.ts      # Update for url
    │       └── UpdateMenuItem.test.ts   # Update for url
    └── presentation/
        └── shared/
            └── components/
                └── PublicHeaderMenuItem.test.tsx  # NEW: Click navigation test
```

**Structure Decision**: Follows existing DDD/Hexagonal architecture with domain value objects, application use cases, infrastructure persistence, and presentation components. Test structure mirrors source structure.

## Complexity Tracking

> No constitution violations - table not needed.
