# Implementation Plan: Edit Menu Item

**Branch**: `009-edit-menu-item` | **Date**: 2025-01-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/009-edit-menu-item/spec.md`

## Summary

Add the ability for administrators to edit the text of existing menu items directly from the menu configuration screen. This eliminates the tedious workflow of delete-recreate-reorder when a text change is needed. The implementation follows the existing hexagonal architecture pattern with a new `UpdateMenuItem` use case, PATCH endpoint, and inline editing in the UI.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router  
**Primary Dependencies**: React 19, Chakra UI v3, tsyringe for DI, @dnd-kit/core  
**Storage**: MongoDB via Mongoose (existing MenuItemModel)  
**Testing**: Jest for unit tests and integration tests (only when explicitly requested)  
**Target Platform**: Web application (browser)  
**Project Type**: Web application (Next.js full-stack)  
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)  
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, consistent theme color usage, YAGNI (minimal implementation), DRY (no duplication), KISS (simple code)  
**Scale/Scope**: Admin functionality for single-admin showcase website

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Status | Notes                                                                                                                |
| ------------------------------------ | ------ | -------------------------------------------------------------------------------------------------------------------- |
| I. Architecture-First Development    | PASS   | Follows DDD/Hexagonal: Domain entity update, Application use case, Infrastructure repository, Presentation component |
| II. Focused Testing Approach         | PASS   | Tests only when explicitly requested; no over-testing                                                                |
| III. Simplicity-First Implementation | PASS   | No performance monitoring; simple inline editing pattern                                                             |
| IV. Security by Default              | PASS   | Reuses existing `withApi({ requireAuth: true })` pattern                                                             |
| V. Clean Architecture Compliance     | PASS   | Proper layer separation with interfaces and DI                                                                       |
| VI. Accessibility-First Design       | PASS   | Will use Chakra UI semantic tokens (bg="bg.canvas", color="fg")                                                      |
| VII. YAGNI                           | PASS   | Only implementing text edit; no additional fields                                                                    |
| VIII. DRY                            | PASS   | Reuses existing MenuItemText validation, MenuItemDTO, toast patterns                                                 |
| IX. KISS                             | PASS   | Simple inline editing with save/cancel; no modal                                                                     |

**Gate Status**: PASSED - No violations requiring justification.

## Project Structure

### Documentation (this feature)

```text
specs/009-edit-menu-item/
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
│       │   └── MenuItem.ts          # Add withText() method
│       └── repositories/
│           └── MenuItemRepository.ts # Already has save() - no changes needed
├── application/
│   └── menu/
│       ├── IUpdateMenuItem.ts       # NEW: Interface for update use case
│       └── UpdateMenuItem.ts        # NEW: Use case implementation
├── infrastructure/
│   └── menu/
│       └── MongoMenuItemRepository.ts # May need update() if save() doesn't handle updates
│   └── container.ts                 # Register IUpdateMenuItem
├── app/
│   └── api/
│       └── settings/
│           └── menu/
│               ├── [id]/
│               │   └── route.ts     # Add PATCH handler
│               └── types.ts         # Add UpdateMenuItemRequest/Response
└── presentation/
    └── admin/
        └── components/
            └── MenuConfigForm.tsx   # Add inline editing to SortableMenuItem

test/
└── unit/
    └── application/
        └── menu/
            └── UpdateMenuItem.test.ts # NEW: Unit tests (if requested)
```

**Structure Decision**: Follows existing hexagonal architecture pattern. New files are minimal (1 interface, 1 use case, 1 PATCH handler). Most changes are additions to existing files.

## Complexity Tracking

> No violations to justify - all Constitution gates passed.
