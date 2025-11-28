# Tasks: Menu Configuration

**Input**: Design documents from `/specs/005-menu-config/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Required - FR-015 explicitly requests unit tests for add, remove, and reorder operations.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependencies, and directory structure

- [x] T001 Install @dnd-kit dependencies: `docker compose run --rm app npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`
- [x] T002 [P] Create domain layer directories: `src/domain/menu/entities/`, `src/domain/menu/value-objects/`, `src/domain/menu/repositories/`
- [x] T003 [P] Create application layer directory: `src/application/menu/`
- [x] T004 [P] Create infrastructure layer directories: `src/infrastructure/menu/models/`, `src/infrastructure/menu/repositories/`
- [x] T005 [P] Create API route directories: `src/app/api/settings/menu/`, `src/app/api/settings/menu/[id]/`
- [x] T006 [P] Create admin page directory: `src/app/admin/menu/`
- [x] T007 [P] Create test directories: `test/unit/domain/menu/entities/`, `test/unit/application/menu/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Domain entities, value objects, repository interfaces, and infrastructure that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Domain Layer

- [x] T008 [P] Create MenuItemText value object in `src/domain/menu/value-objects/MenuItemText.ts` with validation (1-100 chars, non-empty, trimmed)
- [x] T009 [P] Create MenuItem entity in `src/domain/menu/entities/MenuItem.ts` with id, text, position, createdAt, updatedAt fields and factory method
- [x] T010 Create MenuItemRepository interface in `src/domain/menu/repositories/MenuItemRepository.ts` with findAll, findById, save, delete, updatePositions, getNextPosition methods

### Infrastructure Layer

- [x] T011 Create MenuItemModel Mongoose schema in `src/infrastructure/menu/models/MenuItemModel.ts` with position index
- [x] T012 Implement MongooseMenuItemRepository in `src/infrastructure/menu/repositories/MongooseMenuItemRepository.ts` following existing MongooseWebsiteSettingsRepository pattern

### DI Container Registration

- [x] T013 Register MenuItemRepository and use cases in `src/infrastructure/container.ts` with MenuServiceLocator class

### API Types

- [x] T014 Create API types in `src/app/api/settings/menu/types.ts` (AddMenuItemRequest, ReorderMenuItemsRequest, MenuItemDTO, responses)

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 4 - Access Menu Configuration (Priority: P0) 🎯 FIRST

**Goal**: Add menu configuration link to admin sidebar so administrators can access the configuration page

**Independent Test**: Login to admin, verify "Navigation Menu" link appears in sidebar, click it, verify page loads

### Implementation for User Story 4

- [x] T015 [US4] Add menu configuration entry to menuItems array in `src/presentation/admin/components/AdminSidebar.tsx` with href="/admin/menu", label="Navigation Menu", description="Configure website navigation"
- [x] T016 [US4] Create placeholder admin page in `src/app/admin/menu/page.tsx` that renders empty MenuConfigForm with heading "Navigation Menu Configuration"
- [x] T017 [US4] Create MenuConfigForm component skeleton in `src/presentation/admin/components/MenuConfigForm.tsx` with basic Chakra UI layout (VStack, Heading, empty state message)

**Checkpoint**: Admin can now navigate to /admin/menu page via sidebar link

---

## Phase 4: User Story 1 - Add Menu Item (Priority: P1) 🎯 MVP

**Goal**: Allow administrators to add new menu items with display text

**Independent Test**: Navigate to menu config page, enter "About Us" as text, click add, verify item appears in list

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T018 [P] [US1] Create MenuItem entity unit test in `test/unit/domain/menu/entities/MenuItem.test.ts` testing creation with valid text and position
- [x] T019 [P] [US1] Create AddMenuItem use case unit test in `test/unit/application/menu/AddMenuItem.test.ts` testing successful add and empty text validation

### Application Layer for User Story 1

- [x] T020 [P] [US1] Create IAddMenuItem interface in `src/application/menu/IAddMenuItem.ts`
- [x] T021 [P] [US1] Create IGetMenuItems interface in `src/application/menu/IGetMenuItems.ts`
- [x] T022 [US1] Implement AddMenuItem use case in `src/application/menu/AddMenuItem.ts` using repository.getNextPosition() and repository.save()
- [x] T023 [US1] Implement GetMenuItems use case in `src/application/menu/GetMenuItems.ts` using repository.findAll()

### API Layer for User Story 1

- [x] T024 [US1] Implement GET handler in `src/app/api/settings/menu/route.ts` returning ordered menu items using GetMenuItems use case
- [x] T025 [US1] Implement POST handler in `src/app/api/settings/menu/route.ts` adding new item using AddMenuItem use case with validation

### Presentation Layer for User Story 1

- [x] T026 [US1] Create useMenuConfig hook in `src/presentation/admin/hooks/useMenuConfig.ts` with fetchItems, addItem functions and loading/error states (Note: Logic implemented inline in MenuConfigForm.tsx)
- [x] T027 [US1] Update MenuConfigForm in `src/presentation/admin/components/MenuConfigForm.tsx` with text input field, add button, and items list display
- [x] T028 [US1] Add toast notifications for successful add operation using existing Toaster component
- [x] T029 [US1] Verify contrast compliance for light and dark modes in MenuConfigForm
- [x] T030 [US1] Verify YAGNI, DRY, KISS compliance for User Story 1 implementation

**Checkpoint**: Admin can add menu items and see them listed - MVP complete

---

## Phase 5: User Story 2 - Remove Menu Item (Priority: P2)

**Goal**: Allow administrators to remove existing menu items

**Independent Test**: Have existing menu items, click delete on one, confirm removal, verify item no longer in list

### Tests for User Story 2 ⚠️

- [x] T031 [P] [US2] Create RemoveMenuItem use case unit test in `test/unit/application/menu/RemoveMenuItem.test.ts` testing successful removal and non-existent item handling

### Application Layer for User Story 2

- [x] T032 [P] [US2] Create IRemoveMenuItem interface in `src/application/menu/IRemoveMenuItem.ts`
- [x] T033 [US2] Implement RemoveMenuItem use case in `src/application/menu/RemoveMenuItem.ts` using repository.findById() and repository.delete()

### API Layer for User Story 2

- [x] T034 [US2] Implement DELETE handler in `src/app/api/settings/menu/[id]/route.ts` removing item by ID with 404 handling

### Presentation Layer for User Story 2

- [x] T035 [US2] Add removeItem function to useMenuConfig hook in `src/presentation/admin/hooks/useMenuConfig.ts` (Note: Logic implemented inline in MenuConfigForm.tsx)
- [x] T036 [US2] Add delete button to each menu item row in MenuConfigForm with confirmation and toast notification
- [x] T037 [US2] Add empty state message when no menu items exist in MenuConfigForm
- [x] T038 [US2] Verify contrast compliance for delete button in light and dark modes
- [x] T039 [US2] Verify YAGNI, DRY, KISS compliance for User Story 2 implementation

**Checkpoint**: Admin can remove menu items - add/remove functionality complete

---

## Phase 6: User Story 3 - Reorder Menu Items (Priority: P2)

**Goal**: Allow administrators to reorder menu items via drag-and-drop

**Independent Test**: Have multiple menu items, drag one to different position, verify new order persists after page reload

### Tests for User Story 3 ⚠️

- [x] T040 [P] [US3] Create ReorderMenuItems use case unit test in `test/unit/application/menu/ReorderMenuItems.test.ts` testing position updates and invalid IDs handling

### Application Layer for User Story 3

- [x] T041 [P] [US3] Create IReorderMenuItems interface in `src/application/menu/IReorderMenuItems.ts`
- [x] T042 [US3] Implement ReorderMenuItems use case in `src/application/menu/ReorderMenuItems.ts` using repository.updatePositions()

### API Layer for User Story 3

- [x] T043 [US3] Implement PUT handler in `src/app/api/settings/menu/route.ts` accepting orderedIds array and calling ReorderMenuItems use case

### Presentation Layer for User Story 3

- [x] T044 [US3] Add reorderItems function to useMenuConfig hook in `src/presentation/admin/hooks/useMenuConfig.ts` (Note: Logic implemented inline in MenuConfigForm.tsx)
- [x] T045 [US3] Create SortableMenuItem component in `src/presentation/admin/components/SortableMenuItem.tsx` using useSortable hook from @dnd-kit/sortable (Note: Implemented inline in MenuConfigForm.tsx)
- [x] T046 [US3] Update MenuConfigForm with DndContext, SortableContext, and handleDragEnd function using arrayMove
- [x] T047 [US3] Add drag handle icon to each menu item for visual affordance
- [x] T048 [US3] Add toast notification for successful reorder operation
- [x] T049 [US3] Verify drag-and-drop accessibility (keyboard navigation support from @dnd-kit)
- [x] T050 [US3] Verify contrast compliance for drag handle in light and dark modes
- [x] T051 [US3] Verify YAGNI, DRY, KISS compliance for User Story 3 implementation

**Checkpoint**: Full CRUD + reorder functionality complete

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, cleanup, and quality assurance

- [x] T052 [P] Run all unit tests: `docker compose run --rm app npm test`
- [x] T053 [P] Run linting: `docker compose run --rm app npm run lint`
- [x] T054 [P] Run type check: `docker compose run --rm app npm run build:strict`
- [x] T055 Run build: `docker compose run --rm app npm run build`
- [x] T056 Manual validation: test all acceptance scenarios from spec.md
- [x] T057 Verify edge cases: long text (100+ chars), empty menu save, duplicate text
- [x] T058 Final contrast and accessibility review across all themes
- [x] T059 Code cleanup: remove any unused imports or dead code
- [x] T060 Update AGENTS.md with new file structure under `src/domain/menu/`, `src/application/menu/`, `src/infrastructure/menu/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Story 4 (Phase 3)**: Depends on Foundational - FIRST priority (sidebar access)
- **User Story 1 (Phase 4)**: Depends on Foundational - MVP functionality
- **User Story 2 (Phase 5)**: Depends on Foundational - Can run parallel to US1
- **User Story 3 (Phase 6)**: Depends on Foundational - Can run parallel to US1/US2
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 4 (P0)**: Sidebar link - MUST be first (per user requirement)
- **User Story 1 (P1)**: Add items - Core functionality, MVP
- **User Story 2 (P2)**: Remove items - Independent of US1 implementation
- **User Story 3 (P2)**: Reorder items - Independent, uses @dnd-kit

### Parallel Opportunities

**Within Setup (Phase 1)**:

```
T002, T003, T004, T005, T006, T007 can all run in parallel
```

**Within Foundational (Phase 2)**:

```
T008, T009 can run in parallel (value object and entity)
```

**Within User Story 1 (Phase 4)**:

```
T018, T019 (tests) can run in parallel
T020, T021 (interfaces) can run in parallel
```

**Within User Story 2 (Phase 5)**:

```
T031 (test) can run parallel to other test writing
```

**Within User Story 3 (Phase 6)**:

```
T040 (test) can run parallel to other test writing
```

**Cross-Story Parallel** (after Foundational):

```
US4, US1, US2, US3 implementation teams could work in parallel
(Though US4 should be done first per user requirement)
```

---

## Parallel Example: Foundational Phase

```bash
# Launch value object and entity creation together:
Task: "Create MenuItemText value object in src/domain/menu/value-objects/MenuItemText.ts"
Task: "Create MenuItem entity in src/domain/menu/entities/MenuItem.ts"
```

## Parallel Example: User Story 1 Tests

```bash
# Launch all tests for User Story 1 together:
Task: "Create MenuItem entity unit test in test/unit/domain/menu/entities/MenuItem.test.ts"
Task: "Create AddMenuItem use case unit test in test/unit/application/menu/AddMenuItem.test.ts"
```

---

## Implementation Strategy

### MVP First (User Stories 4 + 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 4 (Sidebar link - FIRST)
4. Complete Phase 4: User Story 1 (Add items)
5. **STOP and VALIDATE**: Admin can navigate to page and add items
6. Deploy/demo if ready - this is the MVP

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 4 → Sidebar link works → First checkpoint
3. Add User Story 1 → Add items works → MVP ready
4. Add User Story 2 → Remove items works → CRUD ready
5. Add User Story 3 → Reorder works → Full feature ready
6. Polish → Production ready

### Recommended Sequential Order

Given this is a single-developer project:

1. T001-T007 (Setup)
2. T008-T014 (Foundational)
3. T015-T017 (US4 - Sidebar)
4. T018-T030 (US1 - Add)
5. T031-T039 (US2 - Remove)
6. T040-T051 (US3 - Reorder)
7. T052-T060 (Polish)

---

## Summary

| Phase     | Story        | Task Count | Description               |
| --------- | ------------ | ---------- | ------------------------- |
| 1         | Setup        | 7          | Dependencies, directories |
| 2         | Foundational | 7          | Domain, infra, DI, types  |
| 3         | US4 (P0)     | 3          | Sidebar link              |
| 4         | US1 (P1)     | 13         | Add menu items            |
| 5         | US2 (P2)     | 9          | Remove menu items         |
| 6         | US3 (P2)     | 12         | Reorder via drag-drop     |
| 7         | Polish       | 9          | Validation, cleanup       |
| **Total** |              | **60**     |                           |

**MVP Scope**: Phases 1-4 (US4 + US1) = 30 tasks
**Full Feature**: All phases = 60 tasks
