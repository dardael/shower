# Tasks: Admin Background Color Preview

**Input**: Design documents from `/specs/026-admin-bgcolor-preview/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Explicitly requested by user - unit tests for displayed color and integration tests for light/dark mode switching.

**Organization**: Single user story feature - tasks organized for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: No setup required - enhancing existing component

_No tasks - existing project structure is sufficient_

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Export BACKGROUND_COLOR_MAP for reuse

- [x] T001 Export BACKGROUND_COLOR_MAP from src/presentation/shared/components/ui/provider.tsx for reuse in BackgroundColorSelector

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Preview Background Color in Current Mode (Priority: P1) MVP

**Goal**: Display a live preview showing the actual background color as it appears on the public site, respecting the current color mode (light/dark)

**Independent Test**: Select different background colors in admin panel and observe preview updates; toggle light/dark mode and verify preview reflects correct color variant

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**
> **FOCUS: Unit tests and integration tests ONLY, cover common cases, avoid over-mocking**

- [x] T002 [P] [US1] Unit test for preview displaying correct light mode color in test/unit/presentation/admin/components/BackgroundColorSelector.test.tsx
- [x] T003 [P] [US1] Unit test for preview displaying correct dark mode color in test/unit/presentation/admin/components/BackgroundColorSelector.test.tsx
- [x] T004 [P] [US1] Integration test for preview updating when color mode switches in test/integration/background-color-preview.integration.test.tsx

### Implementation for User Story 1

- [x] T005 [US1] Import useColorMode hook and BACKGROUND_COLOR_MAP in src/presentation/admin/components/BackgroundColorSelector.tsx
- [x] T006 [US1] Add preview element with data-testid displaying selected color hex value based on current color mode in src/presentation/admin/components/BackgroundColorSelector.tsx
- [x] T007 [US1] Ensure preview updates immediately on color selection in src/presentation/admin/components/BackgroundColorSelector.tsx
- [x] T008 [US1] Verify contrast compliance for preview text/border in both light and dark modes
- [x] T009 [US1] Verify YAGNI compliance (minimal implementation for current requirements only)
- [x] T010 [US1] Verify DRY compliance (reuses existing BACKGROUND_COLOR_MAP, no code duplication)
- [x] T011 [US1] Verify KISS compliance (simple, readable code)

**Checkpoint**: User Story 1 fully functional - preview displays correct color for current mode and updates on mode toggle

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [x] T012 Run all tests to verify implementation in docker compose run --rm app npm run test
- [ ] T013 Run quickstart.md validation (manual verification steps)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Skipped - no setup needed
- **Foundational (Phase 2)**: T001 must complete before US1 implementation
- **User Story 1 (Phase 3)**: Depends on T001 completion
- **Polish (Phase 4)**: Depends on all US1 tasks complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after T001 - No dependencies on other stories

### Within User Story 1

- T002, T003, T004 (tests) should be written first and FAIL
- T005 (imports) before T006 (preview element)
- T006 before T007 (behavior verification)
- T008-T011 (compliance checks) after implementation

### Parallel Opportunities

- T002, T003, T004 can all run in parallel (different test files/cases)
- T008, T009, T010, T011 can run in parallel (independent checks)

---

## Parallel Example: User Story 1 Tests

```bash
# Launch all tests for User Story 1 together:
Task: "Unit test for preview displaying correct light mode color"
Task: "Unit test for preview displaying correct dark mode color"
Task: "Integration test for preview updating when color mode switches"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete T001: Export BACKGROUND_COLOR_MAP
2. Write tests T002-T004 (ensure they FAIL)
3. Implement T005-T007 (make tests PASS)
4. Verify compliance T008-T011
5. **STOP and VALIDATE**: Run all tests, verify manually
6. Complete T012-T013 for final validation

### Incremental Delivery

Single user story - deliver complete feature after Phase 3.

---

## Notes

- [P] tasks = different files, no dependencies
- [US1] label maps all feature tasks to User Story 1
- Tests must fail before implementation begins
- Commit after each task or logical group
- BACKGROUND_COLOR_MAP must be exported before it can be imported in BackgroundColorSelector
