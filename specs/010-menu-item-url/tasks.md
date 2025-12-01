# Tasks: Menu Item URL Configuration

**Input**: Design documents from `/specs/010-menu-item-url/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Explicitly requested for URL validation logic and public frontend navigation (see spec.md and plan.md).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: No new project setup needed - extending existing codebase

_No setup tasks required - using existing project structure_

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Domain layer changes that ALL user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T001 [P] Create MenuItemUrl value object in src/domain/menu/value-objects/MenuItemUrl.ts
- [x] T002 [P] Create unit tests for MenuItemUrl value object in test/unit/domain/menu/value-objects/MenuItemUrl.test.ts
- [x] T003 Extend MenuItem entity with url property in src/domain/menu/entities/MenuItem.ts
- [x] T004 Update MenuItem entity tests in test/unit/domain/menu/entities/MenuItem.test.ts
- [x] T005 Add url field to Mongoose schema in src/infrastructure/menu/models/MenuItemModel.ts
- [x] T006 Update MongooseMenuItemRepository mapping in src/infrastructure/menu/repositories/MongooseMenuItemRepository.ts
- [x] T007 Update MenuItemDTO types in src/app/api/settings/menu/types.ts

**Checkpoint**: Foundation ready - domain, infrastructure, and types updated

---

## Phase 3: User Story 1 - Create Menu Item with URL (Priority: P1)

**Goal**: Administrator can create menu items with navigation URLs

**Independent Test**: Create a new menu item with text and URL in admin dashboard, verify both are saved and displayed

### Tests for User Story 1

- [x] T008 [P] [US1] Update AddMenuItem use case tests in test/unit/application/menu/AddMenuItem.test.ts

### Implementation for User Story 1

- [x] T009 [US1] Update AddMenuItem use case to accept url parameter in src/application/menu/AddMenuItem.ts
- [x] T010 [US1] Update IAddMenuItem interface in src/application/menu/AddMenuItem.ts
- [x] T011 [US1] Update POST /api/settings/menu endpoint in src/app/api/settings/menu/route.ts
- [x] T012 [US1] Update MenuConfigForm to add URL input for new items in src/presentation/admin/components/MenuConfigForm.tsx
- [x] T013 [US1] Verify YAGNI compliance (minimal implementation for current requirements only)
- [x] T014 [US1] Verify DRY compliance (no code duplication)
- [x] T015 [US1] Verify KISS compliance (simple, readable code)

**Checkpoint**: Can create menu items with URLs via admin dashboard

---

## Phase 4: User Story 2 - Edit Menu Item URL (Priority: P2)

**Goal**: Administrator can modify URLs of existing menu items

**Independent Test**: Edit an existing menu item's URL, verify change persists after save

### Tests for User Story 2

- [x] T016 [P] [US2] Update UpdateMenuItem use case tests in test/unit/application/menu/UpdateMenuItem.test.ts

### Implementation for User Story 2

- [x] T017 [US2] Update UpdateMenuItem use case to accept url parameter in src/application/menu/UpdateMenuItem.ts
- [x] T018 [US2] Update IUpdateMenuItem interface in src/application/menu/UpdateMenuItem.ts
- [x] T019 [US2] Update PATCH /api/settings/menu/[id] endpoint in src/app/api/settings/menu/[id]/route.ts
- [x] T020 [US2] Update MenuConfigForm inline editing to include URL in src/presentation/admin/components/MenuConfigForm.tsx
- [x] T021 [US2] Verify contrast compliance for light and dark modes
- [x] T022 [US2] Verify YAGNI compliance (minimal implementation for current requirements only)
- [x] T023 [US2] Verify DRY compliance (no code duplication)
- [x] T024 [US2] Verify KISS compliance (simple, readable code)

**Checkpoint**: Can edit menu item URLs via admin dashboard

---

## Phase 5: User Story 3 - Display Clickable Menu Items (Priority: P3)

**Goal**: Website visitors can click menu items to navigate to configured URLs

**Independent Test**: View public website header, click menu items to verify navigation

### Tests for User Story 3

- [x] T025 [P] [US3] Create PublicHeaderMenuItem component tests in test/unit/presentation/shared/components/PublicHeaderMenuItem.test.tsx

### Implementation for User Story 3

- [x] T026 [US3] Update PublicMenuItem type to include url in src/presentation/shared/components/PublicHeaderMenu/types.ts
- [x] T027 [US3] Update PublicHeaderMenuItem to render as Next.js Link in src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenuItem.tsx
- [x] T028 [US3] Update PublicHeaderMenu to pass url prop in src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenu.tsx
- [x] T029 [US3] Verify contrast compliance for links in light and dark modes
- [x] T030 [US3] Verify YAGNI compliance (minimal implementation for current requirements only)
- [x] T031 [US3] Verify DRY compliance (no code duplication)
- [x] T032 [US3] Verify KISS compliance (simple, readable code)

**Checkpoint**: Public site menu items are clickable links

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [x] T033 Run full test suite with docker compose run --rm app npm run test
- [x] T034 Run build validation with docker compose run --rm app npm run build
- [x] T035 Run linting with docker compose run --rm app npm run lint
- [ ] T036 Manual testing: create, edit, and click menu items end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No tasks - using existing project
- **Phase 2 (Foundational)**: BLOCKS all user stories - must complete first
- **Phase 3-5 (User Stories)**: All depend on Phase 2 completion
- **Phase 6 (Polish)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Phase 2 - No dependencies on other stories
- **User Story 2 (P2)**: Depends on Phase 2 - Shares MenuConfigForm with US1 but independently testable
- **User Story 3 (P3)**: Depends on Phase 2 - Independent of admin stories (read-only public display)

### Within Each Phase

- Tests SHOULD be written and FAIL before implementation
- Domain layer before infrastructure
- Use cases before API endpoints
- API before presentation layer

### Parallel Opportunities

**Phase 2 (Foundational)**:

```
Parallel: T001 (MenuItemUrl value object) + T002 (MenuItemUrl tests)
Then: T003 (MenuItem entity) → T004 (MenuItem tests)
Then: T005 (Mongoose model) → T006 (Repository) → T007 (DTO types)
```

**User Stories (after Phase 2)**:

```
US1, US2, US3 can all start in parallel if team capacity allows
Within each story: Tests → Use case → API → UI
```

---

## Parallel Example: Phase 2 Foundation

```bash
# Launch value object and tests together:
Task: "Create MenuItemUrl value object in src/domain/menu/value-objects/MenuItemUrl.ts"
Task: "Create unit tests for MenuItemUrl in test/unit/domain/menu/value-objects/MenuItemUrl.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (T001-T007)
2. Complete Phase 3: User Story 1 (T008-T015)
3. **STOP and VALIDATE**: Create menu items with URLs works
4. Deploy/demo if ready

### Incremental Delivery

1. Foundation → Ready for all stories
2. Add User Story 1 → Can create menu items with URLs (MVP!)
3. Add User Story 2 → Can edit menu item URLs
4. Add User Story 3 → Public site shows clickable links
5. Each story adds value independently

### Recommended Sequence (Single Developer)

1. T001 → T002 (parallel) → T003 → T004 → T005 → T006 → T007
2. T008 → T009 → T010 → T011 → T012 → T013-T015
3. T016 → T017 → T018 → T019 → T020 → T021-T024
4. T025 → T026 → T027 → T028 → T029-T032
5. T033 → T034 → T035 → T036

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story
- Each user story is independently completable and testable
- Commit after each task or logical group
- Tests explicitly requested: MenuItemUrl validation + PublicHeaderMenuItem navigation
