# Tasks: Admin Logout Button

**Input**: Design documents from `/specs/004-logout-button/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Unit tests for new code covering common cases only (per user request)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and verification - no new infrastructure needed

**Key Finding**: Research shows LogoutButton component already exists and BetterAuth logout infrastructure is in place. Main work is converting to IconButton format and positioning in sidebar.

- [x] T001 Verify existing project structure matches plan.md specifications
- [x] T002 Verify BetterAuthClientAdapter.signOut() method exists in src/infrastructure/auth/adapters/BetterAuthClientAdapter.ts
- [x] T003 [P] Verify existing LogoutButton component in src/presentation/shared/components/LogoutButton.tsx
- [x] T004 [P] Verify DarkModeToggle component exists in src/presentation/shared/components/DarkModeToggle.tsx for visual reference
- [x] T005 [P] Verify AdminSidebar component exists in src/presentation/admin/components/AdminSidebar.tsx for placement

**Checkpoint**: Infrastructure verified - ready for user story implementation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: No foundational tasks required - all infrastructure exists

**Note**: Skip this phase - existing BetterAuth session management and components already provide all needed infrastructure.

---

## Phase 3: User Story 1 - Administrator Logs Out from Admin Panel (Priority: P1) 🎯 MVP

**Goal**: Enable administrators to securely log out from the admin panel with session termination and redirect to login page

**Independent Test**: Authenticate as admin, click logout button, verify session terminated and user redirected to login page. Attempt to access admin page directly and verify redirect to login.

### Tests for User Story 1 (Common Cases Only)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**
> **FOCUS: Unit tests for new code, common cases only**

- [x] T006 [P] [US1] Unit test for successful logout flow in test/unit/presentation/shared/components/LogoutButton.test.tsx
- [x] T007 [P] [US1] Unit test for error handling (network failure) with graceful fallback in test/unit/presentation/shared/components/LogoutButton.test.tsx

### Implementation for User Story 1

- [x] T008 [US1] Update LogoutButton component in src/presentation/shared/components/LogoutButton.tsx to add loading state with useState hook
- [x] T009 [US1] Add useLogger hook import and error logging to LogoutButton in src/presentation/shared/components/LogoutButton.tsx
- [x] T010 [US1] Update LogoutButton handleSignOut to log success with logger.info in src/presentation/shared/components/LogoutButton.tsx
- [x] T011 [US1] Update LogoutButton handleSignOut to log errors with logger.error in src/presentation/shared/components/LogoutButton.tsx
- [x] T012 [US1] Add router.refresh() call after router.push in LogoutButton to clear cached data in src/presentation/shared/components/LogoutButton.tsx
- [x] T013 [US1] Verify logout redirects to /admin which redirects unauthenticated users to login page
- [x] T014 [US1] Verify session clearing and token removal on logout via BetterAuth
- [x] T015 [US1] Manual test: successful logout flow (login → click logout → redirected → cannot access admin)
- [x] T016 [US1] Manual test: network failure handling (disconnect → click logout → still redirects locally)

**Checkpoint**: Core logout functionality complete and testable independently

---

## Phase 4: User Story 2 - Visual Consistency with Dark Mode Toggle (Priority: P2)

**Goal**: Style logout button as round IconButton matching DarkModeToggle design and position next to dark mode toggle in admin sidebar

**Independent Test**: Load any admin page and visually inspect sidebar to confirm logout button appears next to dark mode toggle with consistent styling (round shape, similar size, appropriate icon). Test in both light and dark modes.

### Tests for User Story 2 (Common Cases Only)

- [x] T017 [P] [US2] Unit test for LogoutButton rendering with correct aria-label and icon in test/unit/presentation/shared/components/LogoutButton.test.tsx
- [x] T018 [P] [US2] Unit test for button disabled state during logout loading in test/unit/presentation/shared/components/LogoutButton.test.tsx

### Implementation for User Story 2

- [x] T019 [US2] Convert LogoutButton from Button to IconButton component in src/presentation/shared/components/LogoutButton.tsx
- [x] T020 [US2] Update LogoutButton styling to match DarkModeToggle pattern (variant="ghost", size="sm", boxSize="8") in src/presentation/shared/components/LogoutButton.tsx
- [x] T021 [US2] Add hover styles (\_hover={{ bg: 'bg.muted', borderColor: 'border.emphasized' }}) to LogoutButton in src/presentation/shared/components/LogoutButton.tsx
- [x] T022 [US2] Add focus styles (\_focusVisible={{ ring: '2px', ringColor: 'border.emphasized', ringOffset: '2px' }}) to LogoutButton in src/presentation/shared/components/LogoutButton.tsx
- [x] T023 [US2] Update FiLogOut icon to use color="currentColor" for theme compatibility in src/presentation/shared/components/LogoutButton.tsx
- [x] T024 [US2] Add aria-label="Sign out" and title="Sign out" for accessibility in src/presentation/shared/components/LogoutButton.tsx
- [x] T025 [US2] Add loading and disabled props to IconButton based on isLoading state in src/presentation/shared/components/LogoutButton.tsx
- [x] T026 [US2] Import LogoutButton in AdminSidebar component in src/presentation/admin/components/AdminSidebar.tsx
- [x] T027 [US2] Position LogoutButton next to DarkModeToggle in AdminSidebar using HStack with gap={2} in src/presentation/admin/components/AdminSidebar.tsx
- [x] T028 [US2] Verify proper contrast ratios for logout icon in light mode (≥4.5:1)
- [x] T029 [US2] Verify proper contrast ratios for logout icon in dark mode (≥4.5:1)
- [x] T030 [US2] Manual test: visual consistency check (same size, shape, spacing as DarkModeToggle)
- [x] T031 [US2] Manual test: hover state works correctly in both light and dark modes
- [x] T032 [US2] Manual test: focus ring visible and accessible with keyboard navigation (Tab, Enter/Space)

**Checkpoint**: Visual design complete and matches DarkModeToggle styling

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and code quality checks

- [x] T033 [P] Run TypeScript strict mode compilation: docker compose run --rm app npm run build:strict
- [x] T034 [P] Run linting: docker compose run --rm app npm run lint
- [x] T035 [P] Run formatting: docker compose run --rm app npm run format
- [x] T036 [P] Run unit tests: docker compose run --rm app npm run test -- LogoutButton.test.tsx
- [x] T037 Run full build: docker compose run --rm app npm run build
- [x] T038 Verify YAGNI compliance: only minimal features implemented (no confirmation dialog, no logout history)
- [x] T039 Verify DRY compliance: reuses BetterAuthClientAdapter and Chakra IconButton pattern, no code duplication
- [x] T040 Verify KISS compliance: simple click → logout → redirect flow with no complex state management
- [x] T041 Verify no performance monitoring code added (per constitution)
- [x] T042 Review quickstart.md and verify all implementation steps followed
- [x] T043 Manual end-to-end test: complete logout flow on all admin pages

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - verification only
- **Foundational (Phase 2)**: Skipped - infrastructure already exists
- **User Story 1 (Phase 3)**: Can start immediately after Setup
- **User Story 2 (Phase 4)**: Can start immediately after Setup (independent of US1)
- **Polish (Phase 5)**: Depends on US1 and US2 completion

### User Story Dependencies

- **User Story 1 (P1)**: Independent - core logout functionality
- **User Story 2 (P2)**: Independent - visual styling and positioning (can be implemented in parallel with US1 if team capacity allows)

### Within Each User Story

- Tests MUST be written and FAIL before implementation (T006-T007 before T008-T016, T017-T018 before T019-T032)
- US1: Loading state and logging before manual tests
- US2: Component styling updates before sidebar integration, then manual visual tests

### Parallel Opportunities

- **Setup Phase (T001-T005)**: All verification tasks can run in parallel
- **US1 Tests (T006-T007)**: Both unit tests can be written in parallel
- **US2 Tests (T017-T018)**: Both unit tests can be written in parallel
- **User Stories**: US1 and US2 can be implemented in parallel by different developers (independent stories)
- **Polish Phase (T033-T036)**: TypeScript, linting, formatting, and unit test runs can all execute in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Unit test for successful logout flow in test/unit/presentation/shared/components/LogoutButton.test.tsx"
Task: "Unit test for error handling with graceful fallback in test/unit/presentation/shared/components/LogoutButton.test.tsx"

# All US1 tests can be written simultaneously as they test different aspects
```

---

## Parallel Example: User Story 2

```bash
# Launch all tests for User Story 2 together:
Task: "Unit test for LogoutButton rendering with correct aria-label and icon"
Task: "Unit test for button disabled state during logout loading"

# All US2 tests can be written simultaneously as they test different aspects
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T005)
2. Complete Phase 3: User Story 1 (T006-T016)
3. **STOP and VALIDATE**: Test logout functionality independently
4. Deploy/demo if ready - core security feature working

**Estimated Time**: 1-1.5 hours

### Full Feature Delivery

1. Complete Setup (T001-T005) - 10 minutes
2. Complete User Story 1 (T006-T016) - 30-45 minutes
3. Test US1 independently - 15 minutes
4. Complete User Story 2 (T017-T032) - 45-60 minutes
5. Test US2 independently - 15 minutes
6. Complete Polish (T033-T043) - 20 minutes
7. Final validation - 10 minutes

**Total Estimated Time**: 2.5-3 hours

### Parallel Team Strategy

With 2 developers:

1. Both complete Setup together (10 min)
2. Split work:
   - Developer A: User Story 1 (T006-T016) - 45 min
   - Developer B: User Story 2 (T017-T032) - 60 min
3. Both complete Polish together (20 min)

**Total Time**: ~1.5 hours with parallel work

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [US1] = User Story 1 (core logout functionality)
- [US2] = User Story 2 (visual consistency)
- Tests focus on new code only (LogoutButton component modifications)
- Tests cover common cases: successful logout, error handling, rendering, disabled state
- No tests for existing infrastructure (BetterAuthClientAdapter already tested)
- Manual testing required for visual consistency and accessibility
- Each user story independently testable at its checkpoint
- Commit after completing each user story phase
- LogoutButton component already exists - tasks focus on enhancements
- No new infrastructure needed - all dependencies exist

---

## Task Count Summary

- **Total Tasks**: 43
- **Setup Tasks**: 5 (T001-T005)
- **User Story 1 Tasks**: 11 (T006-T016) - includes 2 unit tests
- **User Story 2 Tasks**: 16 (T017-T032) - includes 2 unit tests
- **Polish Tasks**: 11 (T033-T043)
- **Parallel Tasks**: 21 tasks marked [P]
- **Test Tasks**: 4 unit tests (common cases for new code only)
