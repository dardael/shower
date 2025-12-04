# Tasks: Image Text Overlay

**Input**: Design documents from `/specs/022-image-text-overlay/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Integration test explicitly requested for public view rendering (per plan.md).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: Next.js monorepo with `src/` at repository root
- **Tests**: `test/integration/` for integration tests

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create foundational types and extension structure

- [x] T001 Create TypeScript types for overlay configuration in src/domain/pages/types/ImageOverlay.ts
- [x] T002 [P] Create extensions directory structure at src/presentation/admin/components/PageContentEditor/extensions/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core Tiptap extension and CSS that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Create ImageWithOverlay Tiptap extension with overlay attributes in src/presentation/admin/components/PageContentEditor/extensions/ImageWithOverlay.ts
- [x] T004 Add overlay base CSS styles for editor in src/presentation/admin/components/PageContentEditor/tiptap-styles.css
- [x] T005 [P] Add overlay base CSS styles for public view in src/presentation/shared/components/PublicPageContent/public-page-content.css
- [x] T006 Update DOMPurify configuration to allow overlay data attributes in src/presentation/shared/components/PublicPageContent/PublicPageContent.tsx
- [x] T007 [P] Extend extractFontsFromHtml to detect overlay fonts in src/presentation/shared/utils/extractFontsFromHtml.ts
- [x] T008 Register ImageWithOverlay extension in TiptapEditor in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Add Text Overlay to Image (Priority: P1) 🎯 MVP

**Goal**: Administrator can add text overlay to an uploaded image and see it persist

**Independent Test**: Open editor, select image, click "Add Text Overlay", enter text, save, reload - overlay persists

### Implementation for User Story 1

- [x] T009 [US1] Create OverlayToolbar component shell with text input in src/presentation/admin/components/PageContentEditor/OverlayToolbar.tsx
- [x] T010 [US1] Add "Add Text Overlay" button to image selection toolbar in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx
- [x] T011 [US1] Implement addOverlay command in ImageWithOverlay extension in src/presentation/admin/components/PageContentEditor/extensions/ImageWithOverlay.ts
- [x] T012 [US1] Connect OverlayToolbar text input to extension attribute updates in src/presentation/admin/components/PageContentEditor/OverlayToolbar.tsx
- [x] T013 [US1] Add CSS for overlay text display in editor in src/presentation/admin/components/PageContentEditor/tiptap-styles.css
- [x] T014 [US1] Verify overlay persists on page content save and reload
- [x] T015 [US1] Verify YAGNI compliance (text input only, no styling yet)
- [x] T016 [US1] Verify KISS compliance (simple overlay display)

**Checkpoint**: User Story 1 complete - text can be added to images and persists

---

## Phase 4: User Story 2 - Style Text Overlay (Priority: P1)

**Goal**: Administrator can style overlay with color, font, size, position, alignment

**Independent Test**: Select overlay, change styles, verify immediate visual updates, save, reload - styles persist

### Implementation for User Story 2

- [x] T017 [P] [US2] Integrate ColorPicker into OverlayToolbar for text color in src/presentation/admin/components/PageContentEditor/OverlayToolbar.tsx
- [x] T018 [P] [US2] Integrate FontPicker into OverlayToolbar for font family in src/presentation/admin/components/PageContentEditor/OverlayToolbar.tsx
- [x] T019 [US2] Add font size selector (small/medium/large/extra-large) to OverlayToolbar in src/presentation/admin/components/PageContentEditor/OverlayToolbar.tsx
- [x] T020 [US2] Add vertical position selector (top/center/bottom) to OverlayToolbar in src/presentation/admin/components/PageContentEditor/OverlayToolbar.tsx
- [x] T021 [US2] Add horizontal alignment selector (left/center/right) to OverlayToolbar in src/presentation/admin/components/PageContentEditor/OverlayToolbar.tsx
- [x] T022 [US2] Implement auto-contrast background calculation based on text color in src/presentation/admin/components/PageContentEditor/OverlayToolbar.tsx
- [x] T023 [US2] Add CSS for all position and alignment combinations in src/presentation/admin/components/PageContentEditor/tiptap-styles.css
- [x] T024 [US2] Connect style controls to ImageWithOverlay extension attributes in src/presentation/admin/components/PageContentEditor/OverlayToolbar.tsx
- [x] T025 [US2] Verify contrast compliance for toolbar controls in light and dark modes
- [x] T026 [US2] Verify DRY compliance (reuses ColorPicker, FontPicker)
- [x] T027 [US2] Verify KISS compliance (predefined sizes, positions)

**Checkpoint**: User Story 2 complete - overlay can be fully styled

---

## Phase 5: User Story 3 - Public View Rendering (Priority: P1)

**Goal**: Public users see text overlays with all configured styles

**Independent Test**: Navigate to public page with overlay, verify text displays with correct color, font, size, position

### Integration Test for User Story 3 (Requested)

- [x] T028 [P] [US3] Create integration test for public overlay rendering in test/integration/image-text-overlay.integration.test.tsx

### Implementation for User Story 3

- [x] T029 [US3] Add CSS for overlay positioning (top/center/bottom) in public view in src/presentation/shared/components/PublicPageContent/public-page-content.css
- [x] T030 [US3] Add CSS for overlay alignment (left/center/right) in public view in src/presentation/shared/components/PublicPageContent/public-page-content.css
- [x] T031 [US3] Add CSS for font sizes (small/medium/large/extra-large) in public view in src/presentation/shared/components/PublicPageContent/public-page-content.css
- [x] T032 [US3] Add CSS for semi-transparent background in public view in src/presentation/shared/components/PublicPageContent/public-page-content.css
- [x] T033 [US3] Add CSS for responsive overlay scaling on mobile in src/presentation/shared/components/PublicPageContent/public-page-content.css
- [x] T034 [US3] Verify integration test passes - overlay renders with all styles
- [x] T035 [US3] Verify overlay displays correctly across viewports 320px to 1920px

**Checkpoint**: User Story 3 complete - public pages show styled overlays

---

## Phase 6: User Story 4 - Edit/Remove Overlay (Priority: P2)

**Goal**: Administrator can edit existing overlay text and remove overlays

**Independent Test**: Select existing overlay, edit text, verify changes persist; click remove, verify overlay deleted

### Implementation for User Story 4

- [x] T036 [US4] Enable overlay text editing when clicking on existing overlay in src/presentation/admin/components/PageContentEditor/OverlayToolbar.tsx
- [x] T037 [US4] Add "Remove Overlay" button to OverlayToolbar in src/presentation/admin/components/PageContentEditor/OverlayToolbar.tsx
- [x] T038 [US4] Implement removeOverlay command in ImageWithOverlay extension in src/presentation/admin/components/PageContentEditor/extensions/ImageWithOverlay.ts
- [x] T039 [US4] Verify removing overlay converts back to plain image
- [x] T040 [US4] Verify edited/removed overlay persists after save and reload
- [x] T041 [US4] Verify YAGNI compliance (edit and remove only, no additional features)

**Checkpoint**: User Story 4 complete - overlays can be edited and removed

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [x] T042 [P] Verify all overlay functionality works with image resize
- [x] T043 [P] Verify overlay scales proportionally when image is resized
- [x] T044 Code review for DRY compliance across all overlay components
- [x] T045 Code review for KISS compliance - simplify any complex logic
- [x] T046 Run quickstart.md validation steps for admin and public sides

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **User Story 2 (Phase 4)**: Can start after Foundational, independent of US1 but typically done after
- **User Story 3 (Phase 5)**: Can start after Foundational, focuses on public rendering
- **User Story 4 (Phase 6)**: Depends on US1 (needs overlay to edit/remove)
- **Polish (Phase 7)**: Depends on all user stories complete

### User Story Dependencies

- **User Story 1 (P1)**: After Foundational - Core add overlay functionality
- **User Story 2 (P1)**: After Foundational - Can parallelize with US1, extends toolbar
- **User Story 3 (P1)**: After Foundational - CSS/public rendering, needs US1/US2 complete for full testing
- **User Story 4 (P2)**: After US1 - Edit/remove requires overlay to exist

### Within Each User Story

- Toolbar components can be built incrementally
- CSS changes are independent per file
- Extension updates depend on toolbar connections
- Validation tasks after implementation

### Parallel Opportunities

- T001 and T002 can run in parallel (different files)
- T004 and T005 can run in parallel (editor vs public CSS)
- T006 and T007 can run in parallel (different utils)
- T017 and T018 can run in parallel (ColorPicker vs FontPicker integration)
- T028 can run in parallel with implementation (test-first)
- T029-T033 can be grouped as single CSS task or parallelized

---

## Parallel Example: User Story 2 Styling Controls

```bash
# Launch ColorPicker and FontPicker integration together:
Task: "T017 [P] [US2] Integrate ColorPicker into OverlayToolbar"
Task: "T018 [P] [US2] Integrate FontPicker into OverlayToolbar"
```

---

## Parallel Example: Foundational CSS

```bash
# Launch editor and public CSS additions together:
Task: "T004 Add overlay base CSS styles for editor"
Task: "T005 [P] Add overlay base CSS styles for public view"
```

---

## Implementation Strategy

### MVP First (User Stories 1-3)

1. Complete Phase 1: Setup (types)
2. Complete Phase 2: Foundational (extension, base CSS)
3. Complete Phase 3: User Story 1 (add overlay)
4. Complete Phase 4: User Story 2 (style overlay)
5. Complete Phase 5: User Story 3 (public rendering + integration test)
6. **STOP and VALIDATE**: All P1 stories complete, public view working
7. Deploy/demo core functionality

### Incremental Delivery

1. Complete Setup + Foundational → Core extension ready
2. Add User Story 1 → Can add text overlays (MVP!)
3. Add User Story 2 → Can style overlays (Enhanced MVP)
4. Add User Story 3 → Public users see overlays (Full P1 Complete)
5. Add User Story 4 → Can edit/remove overlays (P2 Complete)
6. Polish → Production ready

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story
- Integration test (T028) explicitly requested by user
- ColorPicker and FontPicker are existing components to reuse (DRY)
- CSS handles all overlay positioning (KISS)
- No new API endpoints needed - uses existing page content save
