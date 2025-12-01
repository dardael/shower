# Tasks: Page Content Management

**Input**: Design documents from `/specs/011-page-content-management/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/api-contracts.md, quickstart.md

**Tests**: Unit tests for CRUD operations and integration tests for public display (as per research.md and user request).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and Tiptap dependencies

- [x] T001 Install Tiptap dependencies: @tiptap/react, @tiptap/pm, @tiptap/starter-kit, @tiptap/extension-image, @tiptap/extension-link

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

### Domain Layer

- [x] T002 [P] Create PageContentBody value object in src/domain/pages/value-objects/PageContentBody.ts
- [x] T003 [P] Create PageContent entity in src/domain/pages/entities/PageContent.ts
- [x] T004 [P] Create IPageContentRepository interface in src/domain/pages/repositories/IPageContentRepository.ts

### Infrastructure Layer

- [x] T005 [P] Create PageContentModel Mongoose schema in src/infrastructure/pages/models/PageContentModel.ts
- [x] T006 Create PageContentRepository implementation in src/infrastructure/pages/repositories/PageContentRepository.ts

### Dependency Injection

- [x] T007 Register PageContentRepository in DI container in src/infrastructure/container.ts

### Application Layer Interfaces

- [x] T008 [P] Create ICreatePageContent interface in src/application/pages/interfaces/ICreatePageContent.ts
- [x] T009 [P] Create IUpdatePageContent interface in src/application/pages/interfaces/IUpdatePageContent.ts
- [x] T010 [P] Create IDeletePageContent interface in src/application/pages/interfaces/IDeletePageContent.ts
- [x] T011 [P] Create IGetPageContent interface in src/application/pages/interfaces/IGetPageContent.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Administrator Creates Page Content (Priority: P1)

**Goal**: Allow administrators to create page content for menu items and display it to public users

**Independent Test**: Create a menu item, add content to its page via admin, then visit the URL as a public user and verify content displays correctly

### Unit Tests for User Story 1

- [x] T012 [P] [US1] Unit test for PageContentBody value object in test/unit/domain/pages/PageContentBody.test.ts
- [x] T013 [P] [US1] Unit test for PageContent entity in test/unit/domain/pages/PageContent.test.ts
- [x] T014 [P] [US1] Unit test for CreatePageContent use case in test/unit/application/pages/CreatePageContent.test.ts
- [x] T015 [P] [US1] Unit test for GetPageContent use case in test/unit/application/pages/GetPageContent.test.ts

### Implementation for User Story 1

- [x] T016 [US1] Create CreatePageContent use case in src/application/pages/use-cases/CreatePageContent.ts
- [x] T017 [US1] Create GetPageContent use case in src/application/pages/use-cases/GetPageContent.ts
- [x] T018 [US1] Create POST /api/settings/pages admin endpoint in src/app/api/settings/pages/route.ts
- [x] T019 [US1] Create GET /api/settings/pages/:menuItemId admin endpoint in src/app/api/settings/pages/[menuItemId]/route.ts
- [x] T020 [US1] Create GET /api/pages/:menuItemId public endpoint in src/app/api/pages/[menuItemId]/route.ts
- [x] T021 [US1] Create TiptapEditor component in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx
- [x] T022 [US1] Create PageContentEditor admin component in src/presentation/admin/components/PageContentEditor/PageContentEditor.tsx
- [x] T023 [US1] Create PublicPageContent component in src/presentation/shared/components/PublicPageContent/PublicPageContent.tsx
- [x] T024 [US1] Create dynamic public page route in src/app/[slug]/page.tsx
- [x] T025 [US1] Verify contrast compliance for editor and public content in light and dark modes
- [x] T026 [US1] Verify YAGNI compliance (minimal implementation for current requirements only)
- [x] T027 [US1] Verify DRY compliance (no code duplication)
- [x] T028 [US1] Verify KISS compliance (simple, readable code)

**Checkpoint**: User Story 1 complete - Administrator can create page content and public users can view it

---

## Phase 4: User Story 2 - Administrator Modifies Page Content (Priority: P2)

**Goal**: Allow administrators to edit existing page content

**Independent Test**: Modify existing page content and verify the updated content appears on the public page

### Unit Tests for User Story 2

- [x] T029 [P] [US2] Unit test for UpdatePageContent use case in test/unit/application/pages/UpdatePageContent.test.ts

### Implementation for User Story 2

- [x] T030 [US2] Create UpdatePageContent use case in src/application/pages/use-cases/UpdatePageContent.ts
- [x] T031 [US2] Add PATCH handler to /api/settings/pages/:menuItemId endpoint in src/app/api/settings/pages/[menuItemId]/route.ts
- [x] T032 [US2] Extend PageContentEditor to support editing existing content (pre-fill editor) in src/presentation/admin/components/PageContentEditor/PageContentEditor.tsx
- [x] T033 [US2] Verify YAGNI compliance (minimal implementation for current requirements only)
- [x] T034 [US2] Verify DRY compliance (no code duplication)
- [x] T035 [US2] Verify KISS compliance (simple, readable code)

**Checkpoint**: User Story 2 complete - Administrator can edit existing page content

---

## Phase 5: User Story 3 - Administrator Deletes Page Content (Priority: P3)

**Goal**: Allow administrators to delete page content with confirmation

**Independent Test**: Delete page content and verify the content no longer displays on the public page (shows placeholder)

### Unit Tests for User Story 3

- [x] T036 [P] [US3] Unit test for DeletePageContent use case in test/unit/application/pages/DeletePageContent.test.ts

### Implementation for User Story 3

- [x] T037 [US3] Create DeletePageContent use case in src/application/pages/use-cases/DeletePageContent.ts
- [x] T038 [US3] Add DELETE handler to /api/settings/pages/:menuItemId endpoint in src/app/api/settings/pages/[menuItemId]/route.ts
- [x] T039 [US3] Add delete confirmation dialog to PageContentEditor in src/presentation/admin/components/PageContentEditor/PageContentEditor.tsx
- [x] T040 [US3] Add empty state placeholder to PublicPageContent in src/presentation/shared/components/PublicPageContent/PublicPageContent.tsx
- [x] T041 [US3] Verify YAGNI compliance (minimal implementation for current requirements only)
- [x] T042 [US3] Verify DRY compliance (no code duplication)
- [x] T043 [US3] Verify KISS compliance (simple, readable code)

**Checkpoint**: User Story 3 complete - Administrator can delete page content

---

## Phase 6: User Story 4 - Public User Views Page Content (Priority: P1)

**Goal**: Public users can view formatted page content when clicking menu items

**Independent Test**: Navigate to a menu item URL and verify the configured content displays correctly with proper formatting

**Note**: Core functionality implemented in US1 (T020, T023, T024). This phase covers integration testing and public-specific enhancements.

### Integration Tests for User Story 4

- [x] T044 [P] [US4] Integration test for page content public display in test/integration/page-content.integration.test.tsx

### Implementation for User Story 4

- [x] T045 [US4] Ensure proper HTML sanitization in PublicPageContent in src/presentation/shared/components/PublicPageContent/PublicPageContent.tsx
- [x] T046 [US4] Apply Chakra UI theme colors to headings in public content in src/presentation/shared/components/PublicPageContent/PublicPageContent.tsx
- [x] T047 [US4] Verify contrast compliance for public content in light and dark modes
- [x] T048 [US4] Verify YAGNI compliance (minimal implementation for current requirements only)
- [x] T049 [US4] Verify DRY compliance (no code duplication)
- [x] T050 [US4] Verify KISS compliance (simple, readable code)

**Checkpoint**: User Story 4 complete - Public users see properly formatted content

---

## Phase 7: Edge Cases & Cascade Behavior

**Purpose**: Handle edge cases for content lifecycle management

- [x] T051 Implement cascade delete when MenuItem is deleted (delete associated PageContent) in src/application/menu/RemoveMenuItem.ts
- [x] T052 Handle direct URL navigation to non-existent menu item (404 response) in src/app/[slug]/page.tsx
- [x] T053 Handle content length validation (max 100,000 characters) in PageContentBody value object in src/domain/pages/value-objects/PageContentBody.ts

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T054 Add toast notifications for save/delete success and error feedback in src/presentation/admin/components/PageContentEditor/PageContentEditor.tsx
- [x] T055 Run quickstart.md validation (curl commands work as documented)
- [x] T056 Final code quality validation (YAGNI, DRY, KISS compliance across all files)
- [x] T057 Verify all accessibility requirements (contrast ratios, theme consistency)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can proceed in priority order (P1 -> P2 -> P3)
  - US1 and US4 are both P1 but US4 depends on US1 core implementation
- **Edge Cases (Phase 7)**: Can run after US1 is complete
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after US1 (extends editor functionality)
- **User Story 3 (P3)**: Can start after US2 (adds delete to existing editor)
- **User Story 4 (P1)**: Depends on US1 core implementation (T020, T023, T024)

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Use cases depend on domain entities and repository interfaces
- API endpoints depend on use cases
- UI components depend on API endpoints
- Story complete before moving to next priority

### Parallel Opportunities

- All Foundational tasks marked [P] can run in parallel (T002-T004, T005, T008-T011)
- All unit tests for a story marked [P] can run in parallel
- Domain layer tasks (T002-T004) can run in parallel with infrastructure model (T005)
- Application interfaces (T008-T011) can run in parallel

---

## Parallel Example: Foundational Phase

```bash
# Launch all domain layer tasks together:
Task: "Create PageContentBody value object in src/domain/pages/value-objects/PageContentBody.ts"
Task: "Create PageContent entity in src/domain/pages/entities/PageContent.ts"
Task: "Create IPageContentRepository interface in src/domain/pages/repositories/IPageContentRepository.ts"

# Launch all application interfaces together:
Task: "Create ICreatePageContent interface in src/application/pages/interfaces/ICreatePageContent.ts"
Task: "Create IUpdatePageContent interface in src/application/pages/interfaces/IUpdatePageContent.ts"
Task: "Create IDeletePageContent interface in src/application/pages/interfaces/IDeletePageContent.ts"
Task: "Create IGetPageContent interface in src/application/pages/interfaces/IGetPageContent.ts"
```

## Parallel Example: User Story 1 Tests

```bash
# Launch all US1 unit tests together:
Task: "Unit test for PageContentBody value object in test/unit/domain/pages/PageContentBody.test.ts"
Task: "Unit test for PageContent entity in test/unit/domain/pages/PageContent.test.ts"
Task: "Unit test for CreatePageContent use case in test/unit/application/pages/CreatePageContent.test.ts"
Task: "Unit test for GetPageContent use case in test/unit/application/pages/GetPageContent.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (install Tiptap)
2. Complete Phase 2: Foundational (domain, infrastructure, DI)
3. Complete Phase 3: User Story 1 (create + view)
4. **STOP and VALIDATE**: Test creating content and viewing as public user
5. Deploy/demo if ready - basic content management is functional

### Incremental Delivery

1. Setup + Foundational -> Foundation ready
2. Add User Story 1 -> Test independently -> Deploy/Demo (MVP!)
3. Add User Story 2 -> Test editing -> Deploy/Demo
4. Add User Story 3 -> Test deletion -> Deploy/Demo
5. Add User Story 4 -> Test public display polish -> Deploy/Demo
6. Each story adds value without breaking previous stories

---

## Summary

| Phase                 | Tasks  | Parallel Tasks |
| --------------------- | ------ | -------------- |
| Phase 1: Setup        | 1      | 0              |
| Phase 2: Foundational | 10     | 8              |
| Phase 3: User Story 1 | 17     | 4              |
| Phase 4: User Story 2 | 7      | 1              |
| Phase 5: User Story 3 | 8      | 1              |
| Phase 6: User Story 4 | 7      | 1              |
| Phase 7: Edge Cases   | 3      | 0              |
| Phase 8: Polish       | 4      | 0              |
| **Total**             | **57** | **15**         |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Tiptap editor provides: bold, italic, headings, lists, links, images (via URL)
