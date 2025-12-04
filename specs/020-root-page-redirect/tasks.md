# Tasks: Root Page Redirect to First Menu Item

**Input**: Design documents from `/specs/020-root-page-redirect/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Unit tests and integration tests explicitly requested by user: "add tests to verify than the root url diplsay the first menu content"

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Web application using Next.js App Router structure
- `src/app/` for page routes and layouts
- `test/unit/` for unit tests mirroring source structure
- `test/integration/` for integration tests

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify existing infrastructure is ready for implementation

- [x] T001 Verify existing `src/app/page.tsx` contains static welcome content to be replaced
- [x] T002 Verify existing `src/app/[slug]/page.tsx` pattern for reference implementation
- [x] T003 [P] Verify existing `GetMenuItems` use case in `src/application/menu/GetMenuItems.ts` returns sorted menu items
- [x] T004 [P] Verify existing `GetPageContent` use case in `src/application/pages/use-cases/GetPageContent.ts` retrieves page content by ID
- [x] T005 [P] Verify existing `PublicPageContent` component in `src/presentation/shared/components/PublicPageContent/PublicPageContent.tsx` handles empty content gracefully

**Checkpoint**: All existing components verified and ready for reuse

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: No foundational work needed - all infrastructure exists and is ready

**⚠️ NOTE**: This feature reuses 100% of existing infrastructure. No new domain entities, use cases, repositories, or components required. Skip directly to User Story implementation.

**Checkpoint**: Foundation ready (pre-existing) - user story implementation can begin immediately

---

## Phase 3: User Story 1 - Visitor Accesses Root URL (Priority: P1) 🎯 MVP

**Goal**: Display first menu item's page content when visitors navigate to root URL ("/"), creating seamless landing experience without manual homepage configuration

**Independent Test**: Navigate to root URL and verify first menu item's page content is displayed without URL redirect

### Tests for User Story 1 (Explicitly Requested)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**
> **FOCUS: Unit tests and integration tests covering common cases with minimal mocking**

- [x] T006 [P] [US1] Create unit test file `test/unit/app/page.test.tsx` with test structure and mocks
- [x] T007 [P] [US1] Unit test: Root page displays first menu item content when menu items exist in `test/unit/app/page.test.tsx`
- [x] T008 [P] [US1] Unit test: Root page displays empty state when no menu items exist in `test/unit/app/page.test.tsx`
- [x] T009 [P] [US1] Unit test: Root page handles missing page content gracefully (null case) in `test/unit/app/page.test.tsx`
- [x] T010 [P] [US1] Unit test: Root page selects first menu item by position (lowest position number) in `test/unit/app/page.test.tsx`
- [x] T011 [P] [US1] Create integration test file `test/integration/root-page-redirect.integration.test.tsx` with test structure
- [x] T012 [P] [US1] Integration test: Root URL renders first menu item HTML content correctly in `test/integration/root-page-redirect.integration.test.tsx`
- [x] T013 [P] [US1] Integration test: Root URL displays empty state when content is empty in `test/integration/root-page-redirect.integration.test.tsx`
- [x] T014 [P] [US1] Integration test: Root URL renders complex content structure (headings, lists, links) in `test/integration/root-page-redirect.integration.test.tsx`

**Checkpoint**: All tests written and FAILING - ready for implementation

### Implementation for User Story 1

- [x] T015 [US1] Replace static content in `src/app/page.tsx` with async server component importing required dependencies (DatabaseConnection, container, GetMenuItems, GetPageContent, PublicPageContent)
- [x] T016 [US1] Implement database connection establishment in `src/app/page.tsx` using `DatabaseConnection.getInstance().connect()`
- [x] T017 [US1] Implement menu items retrieval in `src/app/page.tsx` by resolving `IGetMenuItems` from DI container and calling `execute()`
- [x] T018 [US1] Implement empty menu items check in `src/app/page.tsx` with `menuItems.length === 0` condition
- [x] T019 [US1] Implement empty state UI in `src/app/page.tsx` displaying "No Content Available" heading and "Please add your first menu item" text using Chakra UI VStack, Heading, Text components
- [x] T020 [US1] Implement first menu item selection in `src/app/page.tsx` using `menuItems[0]` (array already sorted by position)
- [x] T021 [US1] Implement page content retrieval in `src/app/page.tsx` by resolving `IGetPageContent` from DI container and calling `execute(firstMenuItem.id)`
- [x] T022 [US1] Implement content rendering in `src/app/page.tsx` using `<PublicPageContent content={pageContent?.content.value || ''} />` with optional chaining and empty string fallback
- [x] T023 [US1] Verify all unit tests pass for User Story 1 by running `docker compose run --rm app npm test test/unit/app/page.test.tsx`
- [x] T024 [US1] Verify all integration tests pass for User Story 1 by running `docker compose run --rm app npm test test/integration/root-page-redirect.integration.test.tsx`
- [x] T025 [US1] Verify contrast compliance: Check root page content displays correctly in light and dark modes with proper text contrast
- [x] T026 [US1] Validate consistent use of theme colors: Verify root page uses same theme styling as other public pages
- [x] T027 [US1] Verify YAGNI compliance: Confirm implementation contains only minimal required code (no speculative features, no custom homepage config, no URL parameters, no advanced caching)
- [x] T028 [US1] Verify DRY compliance: Confirm reuse of existing use cases (GetMenuItems, GetPageContent) and components (PublicPageContent) with no code duplication
- [x] T029 [US1] Verify KISS compliance: Review code for straightforward query → render flow without complex abstractions or unnecessary error handling
- [x] T030 [US1] Manual test: Start dev server with `docker compose up app` and navigate to `http://localhost:3000/` to verify first menu content displays
- [x] T031 [US1] Manual test: Verify browser URL remains "/" without redirect to menu item's dedicated URL
- [x] T032 [US1] Manual test: Verify page loads within 2 seconds (Success Criteria SC-001)

**Checkpoint**: User Story 1 fully functional - root URL displays first menu item's content with tests passing

---

## Phase 4: User Story 2 - Site Owner Updates Menu Order (Priority: P2)

**Goal**: Ensure root URL automatically reflects new first menu item's content when site owner reorders menu items, maintaining dynamic homepage without manual configuration

**Independent Test**: Reorder menu items in admin dashboard making different item first, then visit root URL to verify new first item's content displays

### Tests for User Story 2 (Explicitly Requested)

- [x] T033 [P] [US2] Integration test: Root URL displays new first menu item content after reordering in `test/integration/root-page-redirect.integration.test.tsx`
- [x] T034 [P] [US2] Integration test: Root URL content updates without caching issues after menu reorder in `test/integration/root-page-redirect.integration.test.tsx`

### Implementation for User Story 2

- [x] T035 [US2] Verify `GetMenuItems` use case in `src/application/menu/GetMenuItems.ts` queries database on each request (no caching layer) ensuring dynamic updates
- [x] T036 [US2] Verify Next.js server-side rendering in `src/app/page.tsx` queries fresh data on each request without client-side caching
- [x] T037 [US2] Manual test: Create multiple menu items with specific order, note first item's content
- [x] T038 [US2] Manual test: Reorder menu items in admin dashboard to make different item first
- [x] T039 [US2] Manual test: Refresh root URL and verify new first item's content displays (Success Criteria SC-003: within 5 seconds)
- [x] T040 [US2] Verify integration tests pass for User Story 2 by running `docker compose run --rm app npm test test/integration/root-page-redirect.integration.test.tsx`

**Checkpoint**: User Story 2 verified - root URL dynamically updates when menu order changes

---

## Phase 5: User Story 3 - Graceful Handling of No Menu Items (Priority: P3)

**Goal**: Display helpful message when website has no menu items configured, guiding site owner to add first menu item rather than showing error

**Independent Test**: Remove all menu items and navigate to root URL to verify graceful degradation with friendly message

### Tests for User Story 3 (Explicitly Requested)

- [x] T041 [P] [US3] Unit test: Verify empty state message displays when `menuItems.length === 0` in `test/unit/app/page.test.tsx` (already covered by T008)
- [x] T042 [P] [US3] Integration test: Verify empty state message content and styling in `test/integration/root-page-redirect.integration.test.tsx`

### Implementation for User Story 3

- [x] T043 [US3] Verify empty state implementation in `src/app/page.tsx` from User Story 1 Task T019 displays appropriate message
- [x] T044 [US3] Enhance empty state message in `src/app/page.tsx` to explicitly guide admin users: "Please add your first menu item to get started"
- [x] T045 [US3] Manual test: Delete all menu items from database or use fresh database
- [x] T046 [US3] Manual test: Navigate to `http://localhost:3000/` and verify "No Content Available" message displays
- [x] T047 [US3] Manual test: Verify message provides clear call-to-action for adding menu items
- [x] T048 [US3] Verify integration tests pass for User Story 3 by running `docker compose run --rm app npm test test/integration/root-page-redirect.integration.test.tsx`

**Checkpoint**: All user stories complete - root URL handles all scenarios gracefully

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and improvements across all user stories

- [x] T049 [P] Run full test suite: `docker compose run --rm app npm test` and verify all tests pass
- [x] T050 [P] Run linting: `docker compose run --rm app npm run lint` and fix any issues
- [x] T051 [P] Run type check: `docker compose run --rm app npm run build:strict` and resolve any TypeScript errors
- [x] T052 [P] Run build: `docker compose run --rm app npm run build` and verify successful compilation (NOTE: Pre-existing build error in /api/settings/logo unrelated to this feature)
- [ ] T053 Verify quickstart.md scenarios: Follow manual verification steps in `specs/020-root-page-redirect/quickstart.md` for all three scenarios
- [ ] T054 Performance validation: Measure root URL load time and compare with `[slug]` page URLs to verify similar performance (Success Criteria SC-004)
- [x] T055 Code review: Verify implementation matches research decisions in `specs/020-root-page-redirect/research.md`
- [x] T056 Constitution compliance review: Verify all 9 constitution principles (Architecture-First, Focused Testing, Simplicity-First, Security, Clean Architecture, Accessibility, YAGNI, DRY, KISS) are satisfied
- [x] T057 Success criteria validation: Verify all 5 success criteria from `specs/020-root-page-redirect/spec.md` are met (SC-001 through SC-005)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - verification tasks can start immediately
- **Foundational (Phase 2)**: Skipped - all infrastructure pre-exists
- **User Stories (Phase 3-5)**: Can proceed immediately after Setup verification
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start immediately after Setup - No dependencies on other stories
- **User Story 2 (P2)**: Can start immediately after Setup - Builds on US1 implementation but independently testable
- **User Story 3 (P3)**: Can start immediately after Setup - Enhances US1 empty state but independently testable

### Within Each User Story

**Critical Test-First Approach**:

1. Write ALL tests for the user story first (T006-T014 for US1)
2. Run tests and verify they FAIL (red)
3. Implement user story functionality (T015-T022 for US1)
4. Run tests and verify they PASS (green)
5. Validate compliance and manual testing (T023-T032 for US1)

**Execution Order**:

- Tests MUST be written and FAIL before implementation
- Implementation tasks follow logical dependency order
- Compliance verification after implementation
- Manual testing for real-world validation

### Parallel Opportunities

**Within Phase 1 (Setup Verification)**:

- Tasks T001-T005 can all run in parallel (different verification targets)

**Within User Story 1 Tests**:

- Tasks T006-T014 can run in parallel (different test files and scenarios)

**Within User Story 2 Tests**:

- Tasks T033-T034 can run in parallel (different integration test scenarios)

**Within User Story 3 Tests**:

- Tasks T041-T042 can run in parallel (different test scenarios)

**Within Phase 6 (Polish)**:

- Tasks T049-T052 can run in parallel (different validation tools)

**Across User Stories** (with team capacity):

- After Setup verification completes, all three user stories can be worked on in parallel by different developers
- Example: Developer A works on US1 tests+implementation, Developer B works on US2 tests+implementation, Developer C works on US3 tests+implementation

---

## Parallel Example: User Story 1 Tests

```bash
# Launch all test file creation tasks together:
Task T006: "Create unit test file test/unit/app/page.test.tsx with test structure and mocks"
Task T011: "Create integration test file test/integration/root-page-redirect.integration.test.tsx with test structure"

# Launch all unit test implementation tasks together:
Task T007: "Unit test: Root page displays first menu item content when menu items exist"
Task T008: "Unit test: Root page displays empty state when no menu items exist"
Task T009: "Unit test: Root page handles missing page content gracefully"
Task T010: "Unit test: Root page selects first menu item by position"

# Launch all integration test implementation tasks together:
Task T012: "Integration test: Root URL renders first menu item HTML content correctly"
Task T013: "Integration test: Root URL displays empty state when content is empty"
Task T014: "Integration test: Root URL renders complex content structure"
```

---

## Parallel Example: Multiple User Stories (Team Strategy)

```bash
# After Setup verification (Phase 1) completes:

# Developer A: User Story 1 (P1) - Core functionality
Execute T006-T032 sequentially (tests first, then implementation, then validation)

# Developer B: User Story 2 (P2) - Dynamic updates
Execute T033-T040 sequentially (tests first, then verification)

# Developer C: User Story 3 (P3) - Edge case handling
Execute T041-T048 sequentially (tests first, then enhancements)

# All developers merge independently testable increments
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup Verification (T001-T005)
2. Complete Phase 3: User Story 1 (T006-T032)
   - Write tests first (T006-T014) - verify FAIL
   - Implement functionality (T015-T022)
   - Verify tests PASS (T023-T024)
   - Validate compliance (T025-T029)
   - Manual testing (T030-T032)
3. **STOP and VALIDATE**: Test User Story 1 independently
4. Deploy/demo MVP: Root URL displays first menu item's content

### Incremental Delivery

1. Complete Setup Verification → Infrastructure verified
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (Dynamic updates)
4. Add User Story 3 → Test independently → Deploy/Demo (Edge cases)
5. Complete Polish → Final validation → Production ready

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup Verification together (T001-T005)
2. Developers work on user stories in parallel:
   - Developer A: User Story 1 (T006-T032)
   - Developer B: User Story 2 (T033-T040)
   - Developer C: User Story 3 (T041-T048)
3. Team completes Polish together (T049-T057)
4. Stories integrate independently without conflicts

---

## Notes

### Task Format Compliance

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story (US1, US2, US3) for traceability
- Each task includes exact file path for clarity

### Test-First Development

- Tests MUST be written before implementation
- Verify tests fail (red) before implementing
- Implement feature until tests pass (green)
- User explicitly requested tests, so all test tasks are required

### Independent User Stories

- Each user story should be independently completable and testable
- User Story 1: Core functionality (MVP)
- User Story 2: Dynamic behavior verification
- User Story 3: Edge case graceful degradation
- Stop at any checkpoint to validate story independently

### Code Quality

- All constitution principles enforced in validation tasks
- YAGNI: Minimal implementation, no speculative features
- DRY: Reuse existing components and use cases
- KISS: Straightforward query → render flow
- Accessibility: Theme color consistency and contrast compliance
- No performance monitoring in production code

### Commit Strategy

- Commit after each task or logical group
- Suggested commit points:
  - After test file creation (T006, T011, etc.)
  - After all tests written and failing
  - After implementation complete and tests passing
  - After each user story validation complete

### Success Criteria Verification

- SC-001: Page loads within 2 seconds (T032)
- SC-002: 100% visitors see first menu content (T023, T030)
- SC-003: Menu reordering reflected within 5 seconds (T039)
- SC-004: Same performance as dedicated pages (T054)
- SC-005: Site owners can verify homepage (T032, manual navigation)
