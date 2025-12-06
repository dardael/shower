---
description: 'Implementation tasks for Public Loading Page feature'
---

# Tasks: Public Loading Page

**Input**: Design documents from `/specs/025-public-loading-page/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Integration tests are explicitly requested for this feature to verify loading state behavior.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Using Next.js App Router structure:

- **Source**: `src/` at repository root
- **Tests**: `test/` at repository root
- **Types**: `src/types/`
- **Components**: `src/presentation/shared/components/`
- **Hooks**: `src/presentation/shared/hooks/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create type definitions and foundational structures for loading state management

- [x] T001 [P] Create PageLoadState interface in src/types/page-load-state.ts
- [x] T002 [P] Create PageLoadError interface in src/types/page-load-state.ts
- [x] T003 [P] Create PublicPageData interface in src/types/page-load-state.ts
- [x] T004 [P] Create UsePublicPageDataReturn interface in src/types/page-load-state.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core hook infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create usePublicPageData custom hook skeleton in src/presentation/shared/hooks/usePublicPageData.tsx
- [x] T006 Implement loading state initialization logic in usePublicPageData hook
- [x] T007 Implement parallel data fetching coordination using Promise.allSettled in usePublicPageData hook
- [x] T008 Implement menu data fetching integration in usePublicPageData hook
- [x] T009 Implement website settings (footer) data fetching integration in usePublicPageData hook
- [x] T010 Implement page content data fetching integration in usePublicPageData hook
- [x] T011 Implement state update logic when data sources complete in usePublicPageData hook
- [x] T012 Create PublicPageLoader component skeleton in src/presentation/shared/components/PublicPageLoader.tsx
- [x] T013 Implement Chakra UI Spinner with theme-aware styling in PublicPageLoader component
- [x] T014 Add ARIA labels and accessibility attributes to loading indicator in PublicPageLoader component

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Display Loading State During Initial Data Fetch (Priority: P1) 🎯 MVP

**Goal**: Show loading indicator while fetching all data (menu, footer, page content) and display complete page only when all data is loaded

**Independent Test**: Navigate to any public page URL and verify loading indicator appears immediately, remains visible until all data is fetched, then transitions smoothly to the complete page

### Integration Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T015 [P] [US1] Create test file for public page loading in test/integration/public-page-loading.integration.test.tsx
- [x] T016 [P] [US1] Write test: Loading indicator appears immediately on mount in test/integration/public-page-loading.integration.test.tsx
- [x] T017 [P] [US1] Write test: Loading indicator persists until all three data sources complete in test/integration/public-page-loading.integration.test.tsx
- [x] T018 [P] [US1] Write test: No partial content visible during loading in test/integration/public-page-loading.integration.test.tsx
- [x] T019 [P] [US1] Write test: Complete page displays only after all data loaded in test/integration/public-page-loading.integration.test.tsx

### Implementation for User Story 1

- [x] T020 [US1] Integrate usePublicPageData hook into src/app/[slug]/page.tsx
- [x] T021 [US1] Add conditional rendering logic to show PublicPageLoader during loading state in src/app/[slug]/page.tsx
- [x] T022 [US1] Add conditional rendering logic to show complete page content only when isComplete=true in src/app/[slug]/page.tsx
- [x] T023 [US1] Ensure no partial content (menu, footer, page body) is rendered during loading in src/app/[slug]/page.tsx
- [x] T024 [US1] Test smooth transition from loading to loaded state without layout shifts
- [x] T025 [US1] Verify loading indicator appears within 100ms of page navigation
- [x] T026 [US1] Verify complete page displays within 3 seconds under normal network conditions
- [x] T027 [US1] Verify contrast compliance for loading indicator in light and dark modes
- [x] T028 [US1] Verify YAGNI compliance (minimal implementation, no progress bars or complex animations)
- [x] T029 [US1] Verify DRY compliance (reuses Chakra UI Spinner)
- [x] T030 [US1] Verify KISS compliance (simple React hooks pattern, clear code structure)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Loading page displays correctly for successful data loads.

---

## Phase 4: User Story 2 - Handle Slow Network Conditions (Priority: P2)

**Goal**: Loading indicator persists gracefully on slow networks with timeout handling after 10 seconds

**Independent Test**: Throttle network speed, navigate to public pages, and verify loading state persists appropriately with timeout message after 10 seconds

### Integration Tests for User Story 2

- [x] T031 [P] [US2] Write test: Loading indicator remains visible without flickering on slow network in test/integration/public-page-loading.integration.test.tsx
- [x] T032 [P] [US2] Write test: Timeout error message displays after 10 seconds in test/integration/public-page-loading.integration.test.tsx
- [x] T033 [P] [US2] Write test: Loading continues until all data sources complete even if some finish early in test/integration/public-page-loading.integration.test.tsx

### Implementation for User Story 2

- [x] T034 [US2] Add timeout tracking logic to usePublicPageData hook (track startTime)
- [x] T035 [US2] Implement 10-second timeout detection in usePublicPageData hook
- [x] T036 [US2] Create PageLoadError with isTimeout=true when timeout occurs in usePublicPageData hook
- [x] T037 [US2] Add timeout error message UI to PublicPageLoader component
- [x] T038 [US2] Verify loading indicator doesn't flicker when data takes longer than 1 second
- [x] T039 [US2] Verify timeout message displays correctly: "This page is taking longer than expected to load. Please try again."
- [x] T040 [US2] Verify contrast compliance for timeout message in light and dark modes
- [x] T041 [US2] Verify YAGNI compliance (simple timeout detection, no exponential backoff)
- [x] T042 [US2] Verify DRY compliance (no duplicated timeout logic)
- [x] T043 [US2] Verify KISS compliance (straightforward timeout implementation)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Slow networks handled gracefully with timeout.

---

## Phase 5: User Story 3 - Handle Data Loading Failures (Priority: P2)

**Goal**: Display clear error messages with retry functionality when data fetching fails

**Independent Test**: Simulate API failures, verify appropriate error messages display with retry button

### Integration Tests for User Story 3

- [x] T044 [P] [US3] Write test: Error message and retry button display when menu data fails in test/integration/public-page-loading.integration.test.tsx
- [x] T045 [P] [US3] Write test: Error message and retry button display when page content fails in test/integration/public-page-loading.integration.test.tsx
- [x] T046 [P] [US3] Write test: Retry button re-triggers all data fetching and shows loading indicator in test/integration/public-page-loading.integration.test.tsx

### Implementation for User Story 3

- [x] T047 [US3] Implement error catching logic for each data source in usePublicPageData hook
- [x] T048 [US3] Create PageLoadError with failedSources when any data fetch fails in usePublicPageData hook
- [x] T049 [US3] Implement retry function that resets state and restarts all fetches in usePublicPageData hook
- [x] T050 [US3] Add error message UI to PublicPageLoader component
- [x] T051 [US3] Add retry button to PublicPageLoader component
- [x] T052 [US3] Connect retry button click handler to retry function from usePublicPageData hook in PublicPageLoader component
- [x] T053 [US3] Verify error message displays correctly: "Unable to load page content. Please check your connection and try again."
- [x] T054 [US3] Verify retry button functionality restarts data fetching
- [x] T055 [US3] Verify contrast compliance for error message and retry button in light and dark modes
- [x] T056 [US3] Verify YAGNI compliance (simple retry, no exponential backoff or automatic retries)
- [x] T057 [US3] Verify DRY compliance (no duplicated error handling logic)
- [x] T058 [US3] Verify KISS compliance (straightforward error handling and retry)

**Checkpoint**: All user stories should now be independently functional. Error handling and retry work correctly.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and quality checks across all user stories

- [x] T059 [P] Run all integration tests and verify 100% pass rate
- [x] T060 [P] Manual testing in browser: Test light mode rendering and contrast
- [x] T061 [P] Manual testing in browser: Test dark mode rendering and contrast
- [x] T062 [P] Manual testing in browser: Test on slow network (Chrome DevTools throttling)
- [x] T063 [P] Manual testing in browser: Test error scenarios by disabling network
- [x] T064 [P] Verify no layout shifts during loading to loaded transition (CLS = 0)
- [x] T065 [P] Verify loading indicator appears within 100ms requirement
- [x] T066 [P] Verify complete page render within 3 seconds under normal network
- [x] T067 [P] Code review: Verify no performance monitoring code in final implementation
- [x] T068 [P] Code review: Verify accessibility (ARIA labels, screen reader support)
- [x] T069 [P] Code review: Verify clean architecture compliance (dependencies flow inward)
- [x] T070 [P] Run full test suite: docker compose run --rm app npm test
- [x] T071 [P] Run build validation: docker compose run --rm app npm run build
- [x] T072 [P] Run linting: docker compose run --rm app npm run lint
- [x] T073 [P] Run type checking: docker compose run --rm app npm run build:strict
- [x] T074 Update quickstart.md if any implementation details changed
- [x] T075 Update AGENTS.md Active Technologies section if needed

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of US1 but builds on same hook
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Independent of US1/US2 but builds on same hook

### Within Each User Story

- Integration tests MUST be written and FAIL before implementation
- Core implementation before testing
- Functionality before validation tasks
- Story complete before moving to next priority

### Parallel Opportunities

- **Phase 1**: All 4 type definition tasks (T001-T004) can run in parallel
- **Phase 2**: Some hook implementation can be parallelized, but coordination logic has dependencies
- **User Story 1 Tests**: All 4 test writing tasks (T016-T019) can run in parallel after test file creation (T015)
- **User Story 2 Tests**: All 3 test writing tasks (T031-T033) can run in parallel
- **User Story 3 Tests**: All 3 test writing tasks (T044-T046) can run in parallel
- **Phase 6**: All manual testing tasks (T060-T066) can run in parallel
- **Phase 6**: All code review and validation tasks (T067-T073) can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all integration tests for User Story 1 together:
Task: "Write test: Loading indicator appears immediately on mount in test/integration/public-page-loading.integration.test.tsx"
Task: "Write test: Loading indicator persists until all three data sources complete in test/integration/public-page-loading.integration.test.tsx"
Task: "Write test: No partial content visible during loading in test/integration/public-page-loading.integration.test.tsx"
Task: "Write test: Complete page displays only after all data loaded in test/integration/public-page-loading.integration.test.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (type definitions)
2. Complete Phase 2: Foundational (hook and component infrastructure) - CRITICAL
3. Complete Phase 3: User Story 1 (basic loading state)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready - MVP delivers core loading page functionality

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP! ✅)
3. Add User Story 2 → Test independently → Deploy/Demo (Timeout handling added)
4. Add User Story 3 → Test independently → Deploy/Demo (Error handling added)
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (Phase 1 + Phase 2)
2. Once Foundational is done:
   - Developer A: User Story 1 (P1 - MVP)
   - Developer B: User Story 2 (P2 - Timeout)
   - Developer C: User Story 3 (P2 - Error handling)
3. Stories complete and integrate independently

---

## Summary

**Total Tasks**: 75 tasks across 6 phases

**Task Breakdown by Phase**:

- Phase 1 (Setup): 4 tasks
- Phase 2 (Foundational): 10 tasks
- Phase 3 (US1 - P1 MVP): 16 tasks (5 tests + 11 implementation)
- Phase 4 (US2 - P2): 13 tasks (3 tests + 10 implementation)
- Phase 5 (US3 - P2): 12 tasks (3 tests + 9 implementation)
- Phase 6 (Polish): 17 tasks

**Parallel Opportunities**: 27 tasks marked [P] can run in parallel within their phases

**Independent Test Criteria**:

- **US1**: Loading indicator shows during data fetch, complete page displays when ready
- **US2**: Timeout handling works correctly on slow networks
- **US3**: Error messages and retry functionality work for failed data fetches

**MVP Scope**: Complete through Phase 3 (User Story 1) for minimal viable product

- Delivers: Basic loading page functionality with loading indicator
- Estimated effort: ~25% of total tasks (20 tasks)

**Constitution Compliance Checks**:

- No performance monitoring (verified in Phase 6, T067)
- Accessibility-first design (verified in Phase 6, T068)
- YAGNI, DRY, KISS compliance (verified in each user story phase)
- Clean architecture (verified in Phase 6, T069)

---

## Notes

- [P] tasks = different files, no dependencies within phase
- [US1], [US2], [US3] labels map tasks to specific user stories for traceability
- Each user story is independently completable and testable
- Integration tests explicitly requested - write tests FIRST, verify they FAIL
- Stop at any checkpoint to validate story independently
- Focus on common cases, avoid over-mocking (per constitution Principle II)
- Commit after each task or logical group for clean history
