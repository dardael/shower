# Implementation Plan: Menu Configuration

**Branch**: `005-menu-config` | **Date**: 2025-01-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-menu-config/spec.md`

## Summary

Implement a menu configuration feature allowing administrators to add, remove, and reorder website navigation menu items via drag-and-drop. The feature includes a new admin sidebar menu item linking to a dedicated configuration page, with full persistence to MongoDB following the existing DDD/Hexagonal architecture patterns.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router  
**Primary Dependencies**: Chakra UI v3, React 19, tsyringe for DI, @dnd-kit/core for drag-and-drop  
**Storage**: MongoDB via Mongoose (following existing WebsiteSettingsModel pattern)  
**Testing**: Jest for unit tests (add, remove, reorder operations as requested)  
**Target Platform**: Web (Server-side rendering with client-side interactivity)  
**Project Type**: Web application (Next.js monorepo)  
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)  
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, consistent theme color usage, YAGNI (minimal implementation), DRY (no duplication), KISS (simple code)  
**Scale/Scope**: Single-tenant admin panel, menu items limited to ~20 items maximum

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Status  | Notes                                                                                                                                    |
| ------------------------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| I. Architecture-First Development    | ✅ PASS | Following DDD with Hexagonal Architecture - Domain entities, Application use cases, Infrastructure repositories, Presentation components |
| II. Focused Testing Approach         | ✅ PASS | Tests explicitly requested for add, remove, reorder operations - will implement unit tests only                                          |
| III. Simplicity-First Implementation | ✅ PASS | No performance monitoring included, focus on readability and maintainability                                                             |
| IV. Security by Default              | ✅ PASS | Using existing admin auth middleware (withApi with requireAuth: true)                                                                    |
| V. Clean Architecture Compliance     | ✅ PASS | Proper layer separation with DI via tsyringe                                                                                             |
| VI. Accessibility-First Design       | ✅ PASS | Using Chakra UI semantic tokens, theme-aware styling                                                                                     |
| VII. YAGNI                           | ✅ PASS | Only implementing text-only menu items as specified, no URLs/links                                                                       |
| VIII. DRY                            | ✅ PASS | Reusing existing patterns (SaveButton, form components, API wrapper)                                                                     |
| IX. KISS                             | ✅ PASS | Simple CRUD operations with straightforward drag-and-drop reordering                                                                     |

## Project Structure

### Documentation (this feature)

```text
specs/005-menu-config/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api-contracts.md
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── domain/
│   └── menu/
│       ├── entities/
│       │   └── MenuItem.ts
│       ├── repositories/
│       │   └── MenuItemRepository.ts
│       └── value-objects/
│           └── MenuItemText.ts
├── application/
│   └── menu/
│       ├── GetMenuItems.ts
│       ├── IGetMenuItems.ts
│       ├── AddMenuItem.ts
│       ├── IAddMenuItem.ts
│       ├── RemoveMenuItem.ts
│       ├── IRemoveMenuItem.ts
│       ├── ReorderMenuItems.ts
│       └── IReorderMenuItems.ts
├── infrastructure/
│   └── menu/
│       ├── models/
│       │   └── MenuItemModel.ts
│       └── repositories/
│           └── MongooseMenuItemRepository.ts
├── presentation/
│   └── admin/
│       ├── components/
│       │   └── MenuConfigForm.tsx
│       └── hooks/
│           └── useMenuConfig.ts
└── app/
    ├── admin/
    │   └── menu/
    │       └── page.tsx
    └── api/
        └── settings/
            └── menu/
                ├── route.ts          # GET, POST, PUT
                ├── types.ts          # TypeScript types
                └── [id]/
                    └── route.ts      # DELETE /api/settings/menu/[id]

test/
└── unit/
    ├── domain/
    │   └── menu/
    │       └── entities/
    │           └── MenuItem.test.ts
    ├── application/
    │   └── menu/
    │       ├── AddMenuItem.test.ts
    │       ├── RemoveMenuItem.test.ts
    │       └── ReorderMenuItems.test.ts
    └── presentation/
        └── admin/
            └── components/
                └── MenuConfigForm.test.tsx
```

**Structure Decision**: Following existing DDD/Hexagonal architecture patterns established in `src/domain/settings/`, `src/application/settings/`, and `src/infrastructure/settings/`. Creating a new `menu` subdomain to maintain separation of concerns.

## Implementation Priority

Based on user requirements, implementation order:

1. **Admin sidebar menu item** (first thing to do as per user)
2. **Menu configuration page** with add/remove/reorder
3. **Unit tests** for add, remove, and reorder operations
4. **Drag-and-drop** using @dnd-kit/core for reordering

## Complexity Tracking

> No violations to justify - following established patterns.

| Aspect                | Decision                    | Rationale                                                                          |
| --------------------- | --------------------------- | ---------------------------------------------------------------------------------- |
| Drag-and-drop library | @dnd-kit/core               | Lightweight, React 18+ compatible, accessible, works with Chakra UI                |
| Storage approach      | Separate MongoDB collection | Follows existing pattern (SocialNetworkModel), enables ordering via position field |
