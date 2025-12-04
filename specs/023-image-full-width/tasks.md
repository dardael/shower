# Tasks: Image Full Width Button

**Input**: Design documents from `/specs/023-image-full-width/`  
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓, quickstart.md ✓

**Tests**: Explicitly requested by user for button functionality and public page rendering.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md structure:

- Source: `src/presentation/` (Presentation layer)
- Tests: `test/unit/` and `test/integration/`

---

## Phase 1: Setup (No Changes Required)

**Purpose**: Project already initialized - no setup tasks needed for this feature

This feature extends existing components. No new project structure or dependencies required.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure changes that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: These changes enable all user stories - must complete first

- [x] T001 Add fullWidth attribute to ImageWithOverlay extension in `src/presentation/admin/components/PageContentEditor/extensions/ImageWithOverlay.ts`
- [x] T002 [P] Add fullWidth attribute to ResizableImage extension in `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`
- [x] T003 [P] Add full-width CSS styles for editor preview in `src/presentation/admin/components/PageContentEditor/tiptap-styles.css`
- [x] T004 [P] Add full-width CSS styles for public page rendering in `src/presentation/shared/components/PublicPageContent/public-page-content.css`

**Checkpoint**: Foundation ready - full-width attribute can be persisted and rendered. User story implementation can now begin.

---

## Phase 3: User Story 1 - Make Image Full Width (Priority: P1) 🎯 MVP

**Goal**: Administrator can click a button to expand images (plain or with overlay) to 100% container width

**Independent Test**: Select any image in editor, click full-width button, verify image expands to fill container width

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**
> **FOCUS: Unit tests and integration tests ONLY, cover common cases, avoid over-mocking**

- [x] T005 [P] [US1] Create integration test for full-width plain images on public page in `test/integration/image-full-width.integration.test.tsx`
- [x] T006 [P] [US1] Create integration test for full-width images with overlay on public page in `test/integration/image-full-width.integration.test.tsx`

### Implementation for User Story 1

- [x] T007 [US1] Add full-width toggle button to toolbar (visible only when image selected) in `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`
- [x] T008 [US1] Implement toggleFullWidth handler function to update node attribute in `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`
- [x] T009 [US1] Update ImageWithOverlay renderHTML to apply width: 100% style when fullWidth is true in `src/presentation/admin/components/PageContentEditor/extensions/ImageWithOverlay.ts`

**Checkpoint**: At this point, User Story 1 should be fully functional - clicking button expands image to full width

---

## Phase 4: User Story 2 - Toggle Full Width Off (Priority: P2)

**Goal**: Administrator can toggle off full-width setting to return image to original/default size

**Independent Test**: Apply full width to image, click button again, verify image returns to previous width

### Tests for User Story 2 ⚠️

- [x] T010 [P] [US2] Add integration test for toggling full width off in `test/integration/image-full-width.integration.test.tsx`

### Implementation for User Story 2

- [x] T011 [US2] Update toggleFullWidth handler to support toggle off (set fullWidth=false) in `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`
- [x] T012 [US2] Update ImageWithOverlay renderHTML to use default width when fullWidth is false in `src/presentation/admin/components/PageContentEditor/extensions/ImageWithOverlay.ts`
- [x] T013 [US2] Handle manual resize interaction - remove fullWidth when user resizes in `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`

**Checkpoint**: Toggle on/off functionality complete and testable independently

---

## Phase 5: User Story 3 - Visual Button State Indication (Priority: P3)

**Goal**: Full-width button visually indicates active/inactive state based on selected image

**Independent Test**: Select full-width image → button shows solid variant; select normal image → button shows ghost variant

### Tests for User Story 3 ⚠️

- [x] T014 [P] [US3] Create unit test for button visibility in `test/unit/presentation/admin/components/PageContentEditor/FullWidthButton.test.tsx`
- [x] T015 [P] [US3] Create unit test for button active state in `test/unit/presentation/admin/components/PageContentEditor/FullWidthButton.test.tsx`

### Implementation for User Story 3

- [x] T016 [US3] Add helper function isFullWidthActive to check current image fullWidth attribute in `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`
- [x] T017 [US3] Update button variant prop to use solid when fullWidth=true, ghost otherwise in `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`

**Checkpoint**: Visual feedback complete - button state matches image fullWidth state

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and quality checks

- [x] T018 Verify contrast compliance for full-width button in both light and dark modes
- [x] T019 [P] Run all tests and verify they pass: `docker compose run --rm app npm run test -- image-full-width`
- [x] T020 [P] Verify YAGNI compliance - no unnecessary features added
- [x] T021 [P] Verify DRY compliance - no code duplication with existing image handling
- [x] T022 [P] Verify KISS compliance - implementation is simple and readable
- [x] T023 Run quickstart.md verification checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: N/A - no setup required
- **Foundational (Phase 2)**: No dependencies - can start immediately - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase (Phase 2) completion
  - User stories can proceed sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - Core full-width functionality
- **User Story 2 (P2)**: Can start after Foundational - Toggle off extends US1 but is independently testable
- **User Story 3 (P3)**: Can start after Foundational - Visual feedback is independent of toggle logic

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Extension changes before toolbar changes
- Core implementation before refinements

### Parallel Opportunities

**Foundational Phase (T001-T004)**:

```bash
# T001 must complete first (ImageWithOverlay is the primary node)
# Then these can run in parallel:
Task T002: "Add fullWidth to ResizableImage"
Task T003: "Add editor CSS styles"
Task T004: "Add public CSS styles"
```

**User Story 1 Tests (T005-T006)**:

```bash
# Both integration tests can run in parallel:
Task T005: "Test full-width plain images"
Task T006: "Test full-width images with overlay"
```

**User Story 3 Tests (T014-T015)**:

```bash
# Both unit tests can run in parallel:
Task T014: "Test button visibility"
Task T015: "Test button active state"
```

**Polish Phase (T018-T023)**:

```bash
# All verification tasks can run in parallel:
Task T019: "Run all tests"
Task T020: "Verify YAGNI"
Task T021: "Verify DRY"
Task T022: "Verify KISS"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (T001-T004)
2. Complete Phase 3: User Story 1 (T005-T009)
3. **STOP and VALIDATE**: Test full-width functionality
4. Deploy/demo if ready - administrators can make images full width

### Incremental Delivery

1. Complete Foundational → Foundation ready
2. Add User Story 1 → Test → Deploy (MVP! Can apply full width)
3. Add User Story 2 → Test → Deploy (Can toggle off)
4. Add User Story 3 → Test → Deploy (Visual feedback complete)
5. Each story adds value without breaking previous stories

---

## Summary

| Phase        | Tasks  | Story | Parallel               |
| ------------ | ------ | ----- | ---------------------- |
| Setup        | 0      | -     | -                      |
| Foundational | 4      | -     | T002, T003, T004       |
| User Story 1 | 5      | US1   | T005, T006             |
| User Story 2 | 4      | US2   | T010                   |
| User Story 3 | 4      | US3   | T014, T015             |
| Polish       | 6      | -     | T019, T020, T021, T022 |
| **Total**    | **23** |       |                        |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Tests explicitly requested by user - included for all user stories
- Focus on unit and integration tests only, covering common cases
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
