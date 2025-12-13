# Tasks: Theme Mode Configuration

**Input**: Design documents from `/specs/027-theme-mode-config/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Explicitly requested in spec (FR-014, FR-015, FR-016). Unit and integration tests for forced mode verification.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Domain layer foundation required by all user stories

- [x] T001 Add THEME_MODE key to src/domain/settings/constants/SettingKeys.ts
- [x] T002 Create ThemeModeConfig value object in src/domain/settings/value-objects/ThemeModeConfig.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: API and hook infrastructure that MUST be complete before ANY user story UI can work

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Update GET handler to return themeMode in src/app/api/settings/route.ts
- [x] T004 Update POST handler to accept themeMode in src/app/api/settings/route.ts
- [x] T005 Create useThemeModeConfig hook in src/presentation/shared/hooks/useThemeModeConfig.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Configure Theme Mode Setting (Priority: P1) 🎯 MVP

**Goal**: Admin can select theme mode (Force Light, Force Dark, User Choice) and save it

**Independent Test**: Access admin settings, select a theme mode option, verify selection is saved and displayed on return

### Implementation for User Story 1

- [x] T006 [US1] Create ThemeModeSelector component in src/presentation/admin/components/ThemeModeSelector.tsx
- [x] T007 [US1] Integrate ThemeModeSelector into admin settings page (locate existing settings form)
- [x] T008 [US1] Add save confirmation toast notification for theme mode changes
- [x] T009 [US1] Verify YAGNI/DRY/KISS compliance for US1 implementation

**Checkpoint**: Admin can configure and save theme mode setting

---

## Phase 4: User Story 2 - Apply Forced Theme Mode (Priority: P1)

**Goal**: When forced mode is set, theme is applied and toggle is hidden on both admin and public sides

**Independent Test**: Set forced mode in admin, visit public and admin pages, verify theme applied and toggle hidden

### Implementation for User Story 2

- [x] T010 [US2] Modify DarkModeToggle to conditionally render based on shouldShowToggle in src/presentation/shared/components/DarkModeToggle.tsx
- [x] T011 [US2] Add forced mode application logic using useColorMode in src/presentation/shared/components/DarkModeToggle.tsx
- [x] T012 [US2] Ensure public header respects theme mode config in src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenu.tsx
- [x] T013 [US2] Ensure admin header respects theme mode config (locate admin header component)
- [x] T014 [US2] Verify forced mode overrides localStorage user preference
- [x] T015 [US2] Verify YAGNI/DRY/KISS compliance for US2 implementation

**Checkpoint**: Forced mode works on both public and admin interfaces

---

## Phase 5: User Story 3 - User Choice Mode Behavior (Priority: P2)

**Goal**: When user-choice mode is set, toggle is visible and functional on both sides

**Independent Test**: Set user-choice mode, verify toggle appears and works on both public and admin sides

### Implementation for User Story 3

- [x] T016 [US3] Verify toggle visibility when themeMode is "user-choice"
- [x] T017 [US3] Verify user preference persists across navigation in user-choice mode
- [x] T018 [US3] Test default behavior when no themeMode setting exists (should be user-choice)
- [x] T019 [US3] Verify YAGNI/DRY/KISS compliance for US3 implementation

**Checkpoint**: User choice mode maintains backward-compatible toggle behavior

---

## Phase 6: User Story 4 - Verify Forced Options Work (Priority: P1)

**Goal**: Automated unit and integration tests verify forced mode logic

**Independent Test**: Run test suite, all tests pass

### Unit Tests for User Story 4

- [x] T020 [P] [US4] Unit test: ThemeModeConfig value object validation in test/unit/domain/settings/value-objects/ThemeModeConfig.test.ts
- [x] T021 [P] [US4] Unit test: useThemeModeConfig hook behavior in test/unit/presentation/shared/hooks/useThemeModeConfig.test.ts
- [x] T022 [P] [US4] Unit test: DarkModeToggle hidden when forced in test/unit/presentation/shared/components/DarkModeToggle.test.tsx
- [x] T023 [P] [US4] Unit test: DarkModeToggle visible when user-choice in test/unit/presentation/shared/components/DarkModeToggle.test.tsx
- [x] T024 [P] [US4] Unit test: Forced mode overrides user preference in test/unit/presentation/shared/components/DarkModeToggle.test.tsx

### Integration Tests for User Story 4

- [x] T025 [US4] Integration test: Admin forced mode affects public side in test/integration/theme-mode-config.integration.test.tsx
- [x] T026 [US4] Integration test: Admin forced mode affects admin interface in test/integration/theme-mode-config.integration.test.tsx

**Checkpoint**: All forced mode tests pass

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [x] T027 Run full test suite: docker compose run --rm app npm run test
- [x] T028 Run linter: docker compose run --rm app npm run lint
- [x] T029 Run type check: docker compose run --rm app npm run build:strict
- [x] T030 Run quickstart.md validation checklist
- [x] T031 Final YAGNI/DRY/KISS review across all files

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 and US2 are both P1, can run in parallel after Foundational
  - US3 (P2) can start after Foundational but recommended after US2
  - US4 (tests) can run in parallel with or after US1-US3 implementation
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational - Uses same hook from Foundational
- **User Story 3 (P2)**: Can start after Foundational - Verifies default/existing behavior
- **User Story 4 (P1)**: Tests can be written in parallel, verify implementation from US1-US3

### Parallel Opportunities

- T001 and T002 (Setup) are sequential (T002 uses type from T001)
- T003, T004, T005 (Foundational) are sequential (API before hook)
- T020-T024 (Unit tests) can all run in parallel
- US1 and US2 implementation can run in parallel after Foundational

---

## Parallel Example: User Story 4 Tests

```bash
# Launch all unit tests for US4 together:
Task: "Unit test: ThemeModeConfig value object in test/unit/domain/..."
Task: "Unit test: useThemeModeConfig hook in test/unit/presentation/..."
Task: "Unit test: DarkModeToggle hidden when forced in test/unit/..."
Task: "Unit test: DarkModeToggle visible when user-choice in test/unit/..."
Task: "Unit test: Forced mode overrides user preference in test/unit/..."
```

---

## Implementation Strategy

### MVP First (User Story 1 + Foundational)

1. Complete Phase 1: Setup (domain layer)
2. Complete Phase 2: Foundational (API + hook)
3. Complete Phase 3: User Story 1 (admin UI)
4. **STOP and VALIDATE**: Admin can save theme mode setting
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → API and hook ready
2. Add US1 → Admin can configure → Demo (MVP!)
3. Add US2 → Forced mode works → Demo
4. Add US3 → User choice verified → Demo
5. Add US4 → Tests pass → Confidence for production
6. Polish → Production ready

---

## Notes

- Tests explicitly requested in spec (FR-014, FR-015, FR-016)
- Default themeMode is "user-choice" for backward compatibility
- Existing DarkModeToggle component will be modified, not replaced
- useThemeModeConfig hook is shared between admin and public
- All theme mode values: "force-light", "force-dark", "user-choice"
