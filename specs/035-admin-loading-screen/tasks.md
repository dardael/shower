# Tasks: Admin Loading Screen

**Input**: Design documents from `/specs/035-admin-loading-screen/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in this feature specification. Test tasks are not included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify existing infrastructure and create directory structure for new files

- [x] T001 Verify existing PublicPageLoader component exists at src/presentation/shared/components/PublicPageLoader.tsx
- [x] T002 [P] Create admin hooks directory if not exists at src/presentation/admin/hooks/
- [x] T003 [P] Create admin components directory if not exists at src/presentation/admin/components/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core hook that aggregates loading states - MUST be complete before UI components

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Implement useAdminLoadState hook in src/presentation/admin/hooks/useAdminLoadState.ts - aggregate isLoading states from ThemeColorContext, BackgroundColorContext, ThemeModeContext, and FontProvider contexts
- [x] T005 Add custom loader fetching logic to useAdminLoadState hook - fetch from /api/public/loader endpoint
- [x] T006 Add timeout handling (10 seconds) to useAdminLoadState hook with error state
- [x] T007 Add retry function to useAdminLoadState hook that triggers refresh on all contexts

**Checkpoint**: Foundation ready - useAdminLoadState hook complete with all loading state aggregation

---

## Phase 3: User Story 1 - View Loading Screen While Admin Initializes (Priority: P1) 🎯 MVP

**Goal**: Display a full-screen loading screen with default spinner while essential settings are being fetched

**Independent Test**: Navigate to any admin page and verify the loading screen appears before content is displayed

### Implementation for User Story 1

- [x] T008 [US1] Create AdminLoadingScreen component in src/presentation/admin/components/AdminLoadingScreen.tsx - wrapper that uses useAdminLoadState hook
- [x] T009 [US1] Implement conditional rendering in AdminLoadingScreen - show PublicPageLoader when isLoading is true, render children when complete
- [x] T010 [US1] Add blocking overlay behavior to AdminLoadingScreen - prevent interaction with underlying content during loading
- [x] T011 [US1] Integrate AdminLoadingScreen into admin layout by wrapping admin content inside Provider in src/app/admin/ pages
- [x] T012 [US1] Verify loading screen blocks all user interaction until settings loaded
- [x] T013 [US1] Verify loading screen does NOT appear when navigating between admin pages if settings already cached
- [x] T014 [US1] Verify YAGNI compliance - minimal implementation using existing PublicPageLoader
- [x] T015 [US1] Verify DRY compliance - reusing PublicPageLoader, no code duplication
- [x] T016 [US1] Verify KISS compliance - simple wrapper component with straightforward logic

**Checkpoint**: User Story 1 complete - loading screen appears with default spinner during admin initialization

---

## Phase 4: User Story 2 - Custom Loader Display in Admin (Priority: P2)

**Goal**: Display custom loader animation (if configured) instead of default spinner

**Independent Test**: Configure a custom loader in settings, navigate to admin, verify custom animation displays

### Implementation for User Story 2

- [x] T017 [US2] Pass customLoader prop from useAdminLoadState to PublicPageLoader in AdminLoadingScreen component
- [x] T018 [US2] Verify custom loader (GIF/video) displays when configured
- [x] T019 [US2] Verify default spinner displays when no custom loader is configured
- [x] T020 [US2] Verify fallback to default spinner when custom loader fails to load (deleted file, network error)
- [x] T021 [US2] Verify DRY compliance - reusing existing custom loader fetch logic from public side

**Checkpoint**: User Story 2 complete - custom loader displays during admin loading when configured

---

## Phase 5: User Story 3 - Loading Screen Error Handling (Priority: P3)

**Goal**: Show error message with retry option when essential settings fail to load

**Independent Test**: Simulate network failure during admin initialization, verify error state with retry button appears

### Implementation for User Story 3

- [x] T022 [US3] Pass error and onRetry props from useAdminLoadState to PublicPageLoader in AdminLoadingScreen component
- [x] T023 [US3] Verify error state displays after 10-second timeout
- [x] T024 [US3] Verify retry button triggers reload of essential settings
- [x] T025 [US3] Verify successful retry dismisses error and loads admin interface
- [x] T026 [US3] Verify partial loading failures (some settings load, some fail) show error state

**Checkpoint**: User Story 3 complete - error handling with retry functionality works

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across all user stories

- [x] T027 Verify accessibility - ARIA attributes present on loading screen (inherited from PublicPageLoader)
- [x] T028 Verify proper contrast ratios for loading screen in both light and dark modes
- [x] T029 Run quickstart.md validation - verify all success verification steps pass
- [x] T030 Verify no performance monitoring code in final implementation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories should proceed sequentially in priority order (P1 → P2 → P3)
  - US2 extends US1 functionality (adds custom loader prop)
  - US3 extends US1 functionality (adds error/retry props)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - Creates base AdminLoadingScreen component
- **User Story 2 (P2)**: Depends on US1 completion - Adds custom loader support to AdminLoadingScreen
- **User Story 3 (P3)**: Depends on US1 completion - Adds error handling to AdminLoadingScreen

### Within Each User Story

- Core implementation before integration
- Implementation before validation tasks
- Story complete before moving to next priority

### Parallel Opportunities

- T002 and T003 can run in parallel (different directories)
- Within Phase 2: T004-T007 must be sequential (same file, building on each other)
- User stories should be sequential due to component extension pattern

---

## Parallel Example: Setup Phase

```bash
# Launch directory creation tasks together:
Task: "Create admin hooks directory if not exists at src/presentation/admin/hooks/"
Task: "Create admin components directory if not exists at src/presentation/admin/components/"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (3 tasks)
2. Complete Phase 2: Foundational (4 tasks) - useAdminLoadState hook
3. Complete Phase 3: User Story 1 (9 tasks) - AdminLoadingScreen with default spinner
4. **STOP and VALIDATE**: Test loading screen appears during admin initialization
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Hook ready
2. Add User Story 1 → Loading screen with default spinner → MVP!
3. Add User Story 2 → Custom loader support
4. Add User Story 3 → Error handling with retry
5. Each story adds value without breaking previous stories

### Key Files Created

| Phase        | File                                                     | Purpose                   |
| ------------ | -------------------------------------------------------- | ------------------------- |
| Foundational | src/presentation/admin/hooks/useAdminLoadState.ts        | Aggregates loading states |
| US1          | src/presentation/admin/components/AdminLoadingScreen.tsx | Wrapper component         |
| US1          | src/presentation/admin/components/AdminProvider.tsx      | Admin-specific provider   |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Tests not included as not explicitly requested in spec
- US2 and US3 extend the component created in US1 (same file modifications)
- PublicPageLoader is reused without modification (DRY principle)
- No new API endpoints needed - uses existing /api/public/loader
