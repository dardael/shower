# Tasks: Edit Menu Item

**Input**: Design documents from `/specs/009-edit-menu-item/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api-contracts.md, quickstart.md

**Tests**: Not explicitly requested in feature specification. Omitted per constitution (Principle II).

**Organization**: Tasks grouped by architectural layer following hexagonal architecture. User Stories 1 and 2 are both P1 and tightly coupled (US2 is inherently satisfied by the design that preserves position).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2)
- Exact file paths included in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: No new project setup needed - feature builds on existing codebase

_No setup tasks required - all infrastructure already exists._

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Domain layer changes that must be complete before application and API layers

- [x] T001 Add `withText(text: MenuItemText): MenuItem` method to `src/domain/menu/entities/MenuItem.ts`

**Checkpoint**: Domain entity ready - use case implementation can begin

---

## Phase 3: User Story 1 - Edit Menu Item Text (Priority: P1) 🎯 MVP

**Goal**: Allow administrators to modify the text of an existing menu item directly from the menu configuration screen

**Independent Test**: Edit an existing menu item's text and verify the change persists after page refresh

### Application Layer

- [x] T002 [P] [US1] Create interface `IUpdateMenuItem` in `src/application/menu/IUpdateMenuItem.ts`
- [x] T003 [P] [US1] Create use case `UpdateMenuItem` in `src/application/menu/UpdateMenuItem.ts`
- [x] T004 [US1] Register `IUpdateMenuItem` in dependency injection container `src/infrastructure/container.ts`

### API Layer

- [x] T005 [P] [US1] Add `UpdateMenuItemRequest` and `UpdateMenuItemResponse` types to `src/app/api/settings/menu/types.ts`
- [x] T006 [US1] Add PATCH handler to `src/app/api/settings/menu/[id]/route.ts`

### Presentation Layer

- [x] T007 [US1] Add inline editing state and handlers to `SortableMenuItem` component in `src/presentation/admin/components/MenuConfigForm.tsx`
- [x] T008 [US1] Add `handleUpdateItem` function to `MenuConfigForm` component in `src/presentation/admin/components/MenuConfigForm.tsx`
- [x] T009 [US1] Update `SortableMenuItem` to render Input when editing in `src/presentation/admin/components/MenuConfigForm.tsx`

### Validation

- [x] T010 [US1] Verify contrast compliance for inline edit input in light and dark modes
- [x] T011 [US1] Verify YAGNI compliance (only text edit, no extra features)
- [x] T012 [US1] Verify DRY compliance (reuses MenuItemText validation, MenuItemDTO, toast patterns)
- [x] T013 [US1] Verify KISS compliance (simple inline edit, no modal)

**Checkpoint**: User Story 1 complete - administrators can edit menu item text inline

---

## Phase 4: User Story 2 - Preserve Position on Edit (Priority: P1)

**Goal**: Menu item retains its position in the list after editing its text

**Independent Test**: Edit a menu item in the middle of a list and verify its position remains unchanged

### Validation

- [x] T014 [US2] Verify position is preserved after text edit (inherent in withText() design)
- [x] T015 [US2] Verify order of all other items remains unchanged after any edit

**Checkpoint**: User Story 2 confirmed - position preservation works correctly

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and quality checks

- [x] T016 Run manual testing checklist from quickstart.md
- [x] T017 Verify error handling for edge cases (empty text, >100 chars, deleted item during edit)
- [x] T018 Run linter and formatter: `docker compose run --rm app npm run lint && docker compose run --rm app npm run format`
- [x] T019 Run build to verify no TypeScript errors: `docker compose run --rm app npm run build`

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1: Setup ──────────────────────────────┐
                                              │
Phase 2: Foundational (T001) ◀───────────────┘
              │
              ▼
Phase 3: User Story 1 (T002-T013)
              │
              ▼
Phase 4: User Story 2 (T014-T015)
              │
              ▼
Phase 5: Polish (T016-T019)
```

### Task Dependencies Within Phases

**Phase 2:**

- T001: No dependencies (entry point)

**Phase 3 (User Story 1):**

- T002, T003: Parallel, depend on T001
- T004: Depends on T003 (needs UpdateMenuItem class to register)
- T005: Parallel with T002-T004 (different file)
- T006: Depends on T004, T005 (needs container registration and types)
- T007, T008, T009: Sequential within same file, depend on T006 (need API to call)
- T010-T013: Validation after implementation, depend on T009

**Phase 4 (User Story 2):**

- T014, T015: Validation only, depend on T009 (need working feature)

**Phase 5:**

- T016-T019: Depend on all previous phases

### Parallel Opportunities

```bash
# After T001 completes, launch in parallel:
Task T002: "Create interface IUpdateMenuItem in src/application/menu/IUpdateMenuItem.ts"
Task T003: "Create use case UpdateMenuItem in src/application/menu/UpdateMenuItem.ts"
Task T005: "Add types to src/app/api/settings/menu/types.ts"
```

---

## Implementation Strategy

### MVP Scope (Recommended)

Complete Phases 1-3 for minimal viable feature:

1. Phase 2: Domain entity update (T001)
2. Phase 3: Full User Story 1 implementation (T002-T013)

At this point, administrators can edit menu items - core value delivered.

### Full Implementation

1. Phase 2: Foundational → T001
2. Phase 3: User Story 1 → T002-T013 → Checkpoint: Edit works
3. Phase 4: User Story 2 → T014-T015 → Checkpoint: Position preserved
4. Phase 5: Polish → T016-T019 → Feature complete

### Single Developer Flow

```
T001 → [T002, T003, T005 parallel] → T004 → T006 → T007 → T008 → T009 →
T010-T013 → T014-T015 → T016-T019
```

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks in same phase
- [US1], [US2] labels map tasks to user stories for traceability
- US2 is inherently satisfied by the design (withText preserves position)
- No tests included per constitution (only when explicitly requested)
- Commit after each task or logical group
- Run `docker compose run --rm app npm run build` periodically to catch TypeScript errors early
