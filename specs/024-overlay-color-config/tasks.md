# Tasks: Overlay Color Configuration

**Input**: Design documents from `/specs/024-overlay-color-config/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Integration tests explicitly requested by user - focusing on public page rendering.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Extend domain types with new overlay properties (shared by all stories)

- [x] T001 Add `bgColor` and `bgOpacity` properties to `ImageTextOverlay` interface in `src/domain/pages/types/ImageOverlay.ts`
- [x] T002 Add default values for `bgColor` (#000000) and `bgOpacity` (50) to `DEFAULT_OVERLAY_CONFIG` in `src/domain/pages/types/ImageOverlay.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Update Tiptap extension with new attributes - required for all UI and rendering stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Add `overlayBgColor` attribute to `addAttributes()` in `src/presentation/admin/components/PageContentEditor/extensions/ImageWithOverlay.ts`
- [x] T004 Add `overlayBgOpacity` attribute to `addAttributes()` in `src/presentation/admin/components/PageContentEditor/extensions/ImageWithOverlay.ts`
- [x] T005 Create `getOverlayBackground(bgColor: string, bgOpacity: number): string` utility function in `src/presentation/admin/components/PageContentEditor/extensions/ImageWithOverlay.ts`
- [x] T006 Update `renderHTML` to use `getOverlayBackground()` instead of `getContrastBackground()` in `src/presentation/admin/components/PageContentEditor/extensions/ImageWithOverlay.ts`
- [x] T007 Update `addOverlay` command to include default `overlayBgColor` and `overlayBgOpacity` in `src/presentation/admin/components/PageContentEditor/extensions/ImageWithOverlay.ts`
- [x] T008 Run type check to verify no TypeScript errors: `docker compose run --rm app npm run build:strict`

**Checkpoint**: Foundation ready - Tiptap extension now supports background color and opacity attributes

---

## Phase 3: User Story 1 - Administrator Configures Overlay Color (Priority: P1) 🎯 MVP

**Goal**: Allow administrators to choose the background color of the overlay using a color picker

**Independent Test**: Select an image with text overlay, open the overlay color picker, select a color, verify the overlay background changes to the selected color

### Implementation for User Story 1

- [x] T009 [US1] Add `overlayBgColor` state variable and handler in `src/presentation/admin/components/PageContentEditor/OverlayToolbar.tsx`
- [x] T010 [US1] Add `ColorPickerPopover` component for background color selection in `src/presentation/admin/components/PageContentEditor/OverlayToolbar.tsx`
- [x] T011 [US1] Wire up color picker to update `overlayBgColor` attribute via `editor.commands.updateOverlay()` in `src/presentation/admin/components/PageContentEditor/OverlayToolbar.tsx`
- [x] T012 [US1] Verify color changes reflect immediately in editor preview (real-time update)
- [x] T013 [US1] Verify KISS compliance - simple color picker integration following existing pattern

**Checkpoint**: User Story 1 complete - administrators can configure overlay background color

---

## Phase 4: User Story 2 - Administrator Configures Overlay Opacity (Priority: P1)

**Goal**: Allow administrators to adjust the opacity of the overlay background using a slider

**Independent Test**: Select an image with text overlay, adjust the opacity slider, verify the overlay transparency changes in real-time

### Implementation for User Story 2

- [x] T014 [US2] Add `overlayBgOpacity` state variable and handler in `src/presentation/admin/components/PageContentEditor/OverlayToolbar.tsx`
- [x] T015 [US2] Add Chakra UI `Slider` component for opacity control (0-100) in `src/presentation/admin/components/PageContentEditor/OverlayToolbar.tsx`
- [x] T016 [US2] Wire up slider to update `overlayBgOpacity` attribute via `editor.commands.updateOverlay()` in `src/presentation/admin/components/PageContentEditor/OverlayToolbar.tsx`
- [x] T017 [US2] Add opacity percentage display label next to slider in `src/presentation/admin/components/PageContentEditor/OverlayToolbar.tsx`
- [x] T018 [US2] Verify opacity changes reflect immediately in editor preview (real-time update)
- [x] T019 [US2] Verify KISS compliance - simple slider integration

**Checkpoint**: User Story 2 complete - administrators can configure overlay opacity

---

## Phase 5: User Story 3 - Public User Views Custom Overlay (Priority: P1)

**Goal**: Ensure configured overlay background color and opacity render correctly on public pages

**Independent Test**: Navigate to a page with images that have custom overlay colors and opacities, verify they display correctly

### Integration Tests for User Story 3

> **NOTE: Tests explicitly requested by user for public page rendering**

- [x] T020 [P] [US3] Create integration test file `test/integration/overlay-color-config.integration.test.tsx`
- [x] T021 [P] [US3] Add test: custom overlay background color renders correctly with inline style `background: rgba(r, g, b, opacity)` in `test/integration/overlay-color-config.integration.test.tsx`
- [x] T022 [P] [US3] Add test: custom overlay opacity renders correctly (0%, 50%, 100%) in `test/integration/overlay-color-config.integration.test.tsx`
- [x] T023 [P] [US3] Add test: default values applied when no custom color/opacity configured in `test/integration/overlay-color-config.integration.test.tsx`
- [x] T024 [P] [US3] Add test: multiple images with different overlay configurations render correctly in `test/integration/overlay-color-config.integration.test.tsx`
- [x] T025 [P] [US3] Add test: edge case 0% opacity (transparent background, text visible) in `test/integration/overlay-color-config.integration.test.tsx`
- [x] T026 [P] [US3] Add test: edge case 100% opacity (opaque background) in `test/integration/overlay-color-config.integration.test.tsx`

### Verification for User Story 3

- [x] T027 [US3] Run integration tests: `docker compose run --rm app npm run test -- overlay-color-config.integration.test`
- [x] T028 [US3] Verify all tests pass with correct inline styles

**Checkpoint**: User Story 3 complete - public page renders configured overlay correctly

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [x] T029 Run full test suite: `docker compose run --rm app npm run test`
- [x] T030 Run linter: `docker compose run --rm app npm run lint`
- [x] T031 Run type check: `docker compose run --rm app npm run build:strict`
- [x] T032 Verify backward compatibility - existing overlays display with default styling
- [x] T033 Verify YAGNI compliance - only color and opacity implemented, no extra features
- [x] T034 Verify DRY compliance - reuses existing ColorPickerPopover component
- [x] T035 Run quickstart.md verification checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3, 4, 5)**: All depend on Foundational phase completion
  - US1 and US2 modify same file (OverlayToolbar.tsx) - execute sequentially
  - US3 (tests) can run in parallel with US1/US2 after foundational is done
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Should follow US1 (same file OverlayToolbar.tsx) - Adds to same UI
- **User Story 3 (P1)**: Can start in parallel after Foundational - Tests public rendering

### Within Each User Story

- Implementation tasks are sequential within the same file
- Tests marked [P] can run in parallel

### Parallel Opportunities

- T001 and T002 modify same file - execute sequentially
- T003-T007 modify same file - execute sequentially
- T020-T026 (tests) are all [P] - can be created in parallel
- US1 and US3 can run in parallel (different files)

---

## Parallel Example: User Story 3 Tests

```bash
# Launch all integration tests for User Story 3 together:
Task: "Create test file test/integration/overlay-color-config.integration.test.tsx"
Task: "Add test: custom overlay background color renders correctly"
Task: "Add test: custom overlay opacity renders correctly"
Task: "Add test: default values applied when not configured"
Task: "Add test: multiple images with different configurations"
Task: "Add test: 0% opacity edge case"
Task: "Add test: 100% opacity edge case"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (domain types)
2. Complete Phase 2: Foundational (Tiptap extension)
3. Complete Phase 3: User Story 1 (color picker)
4. **STOP and VALIDATE**: Test color picker works in editor
5. Can deploy with just color configuration

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (Color) → Test → Deploy/Demo (MVP!)
3. Add User Story 2 (Opacity) → Test → Deploy/Demo
4. Add User Story 3 (Public Tests) → Verify public rendering
5. Each story adds value without breaking previous stories

### Suggested Implementation Order

For a single developer:

1. T001-T002 (Setup)
2. T003-T008 (Foundational)
3. T009-T013 (US1: Color)
4. T014-T019 (US2: Opacity)
5. T020-T028 (US3: Tests)
6. T029-T035 (Polish)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- US1 and US2 both modify OverlayToolbar.tsx - execute sequentially
- US3 tests verify public rendering - can be developed in parallel
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
