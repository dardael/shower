# Tasks: Image Full Bleed Layout

**Input**: Design documents from `/specs/029-image-full-bleed/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not explicitly requested in this feature specification. Focus is on implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: No setup required - feature extends existing infrastructure

This feature adds to existing files only. No new project structure, dependencies, or configuration needed.

**Checkpoint**: Ready to proceed to foundational phase immediately.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add fullBleed attribute to both image node types - required before any user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T001 [P] Add fullBleed attribute to ResizableImage extension in `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`
- [x] T002 [P] Add fullBleed attribute to ImageWithOverlay extension in `src/presentation/admin/components/PageContentEditor/extensions/ImageWithOverlay.ts`

**Checkpoint**: Foundation ready - both image types now support the fullBleed data attribute. User story implementation can begin.

---

## Phase 3: User Story 1 - Enable Full Bleed on Image (Priority: P1) 🎯 MVP

**Goal**: Allow administrators to enable full bleed on plain images and images with overlay so they display edge-to-edge on the public page

**Independent Test**: Add an image to page content, enable the full bleed option, save, and verify the image extends to screen edges on the public page with no visible background color

### Implementation for User Story 1

- [x] T003 [US1] Add isFullBleedActive helper function in `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`
- [x] T004 [US1] Add toggleFullBleed helper function in `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`
- [x] T005 [US1] Add Full Bleed toggle IconButton to image toolbar in `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`
- [x] T006 [P] [US1] Add public page CSS for full-bleed plain images (100vw, negative margins, no border-radius) in `src/presentation/shared/components/PublicPageContent/public-page-content.css`
- [x] T007 [P] [US1] Add public page CSS for full-bleed image-with-overlay (100vw, negative margins, no border-radius) in `src/presentation/shared/components/PublicPageContent/public-page-content.css`
- [x] T008 [US1] Verify full-bleed images maintain aspect ratio on all viewport sizes
- [x] T009 [US1] Verify text overlays remain readable and properly positioned on full-bleed images
- [x] T010 [US1] Verify YAGNI compliance (minimal implementation for current requirements only)
- [x] T011 [US1] Verify DRY compliance (no code duplication - reuses existing toggle pattern)
- [x] T012 [US1] Verify KISS compliance (simple, readable code)

**Checkpoint**: User Story 1 complete - administrators can enable full bleed on images and see them render edge-to-edge on public pages

---

## Phase 4: User Story 2 - Disable Full Bleed on Image (Priority: P2)

**Goal**: Allow administrators to disable full bleed on an image that has it enabled, returning it to normal content width

**Independent Test**: Enable full bleed on an image, then disable it and verify the image respects normal page padding on the public page

### Implementation for User Story 2

- [x] T013 [US2] Verify toggleFullBleed correctly toggles from true to false in `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`
- [x] T014 [US2] Verify toolbar button state correctly reflects disabled state (ghost variant when fullBleed is false)
- [x] T015 [US2] Verify disabled full-bleed images respect page content margins on public page
- [x] T016 [US2] Verify background color is visible on sides when full bleed is disabled

**Checkpoint**: User Story 2 complete - administrators can toggle full bleed off and images return to normal width

---

## Phase 5: User Story 3 - Visual Indication of Full Bleed State (Priority: P3)

**Goal**: Provide clear visual feedback in the editor showing which images have full bleed enabled

**Independent Test**: Enable full bleed on an image in the editor and observe a distinct visual indicator (outline/border) around the image

### Implementation for User Story 3

- [x] T017 [US3] Add editor CSS for full-bleed indicator on plain images (dashed outline) in `src/presentation/admin/components/PageContentEditor/tiptap-styles.css`
- [x] T018 [US3] Add editor CSS for full-bleed indicator on image-with-overlay (dashed outline) in `src/presentation/admin/components/PageContentEditor/tiptap-styles.css`
- [x] T019 [US3] Verify visual indicator has proper contrast in both light and dark modes
- [x] T020 [US3] Verify indicator disappears when full bleed is disabled

**Checkpoint**: User Story 3 complete - administrators can visually distinguish full-bleed images in the editor

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [x] T021 Verify full bleed setting persists correctly across save/reload cycles
- [x] T022 Verify full bleed works correctly on mobile viewports
- [x] T023 Verify adjacent content (text before/after image) remains within normal page padding
- [x] T024 Run quickstart.md validation checklist
- [x] T025 Code cleanup and ensure consistent code style

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No work needed - skipped
- **Foundational (Phase 2)**: No dependencies - can start immediately
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on T001, T002 (attribute definitions)
- **User Story 2 (P2)**: Depends on User Story 1 (toggle function must exist)
- **User Story 3 (P3)**: Depends on T001, T002 (attribute definitions) - can run parallel with US1/US2

### Within Each User Story

- Helper functions before UI components
- UI components before CSS
- CSS before validation

### Parallel Opportunities

- T001 and T002 can run in parallel (different files)
- T006 and T007 can run in parallel (different CSS selectors, same file but additive)
- T017 and T018 can run in parallel (different CSS selectors, same file but additive)
- US3 can run in parallel with US1 once foundational phase is complete

---

## Parallel Example: Foundational Phase

```bash
# Launch both attribute additions together:
Task: "Add fullBleed attribute to ResizableImage extension in TiptapEditor.tsx"
Task: "Add fullBleed attribute to ImageWithOverlay extension in ImageWithOverlay.ts"
```

## Parallel Example: User Story 1 CSS

```bash
# Launch both CSS additions together:
Task: "Add public page CSS for full-bleed plain images in public-page-content.css"
Task: "Add public page CSS for full-bleed image-with-overlay in public-page-content.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (T001, T002)
2. Complete Phase 3: User Story 1 (T003-T012)
3. **STOP and VALIDATE**: Test enabling full bleed on images
4. Deploy/demo if ready - core functionality complete

### Incremental Delivery

1. Foundational → Attributes ready
2. Add User Story 1 → Enable full bleed works → Deploy/Demo (MVP!)
3. Add User Story 2 → Disable full bleed works → Deploy/Demo
4. Add User Story 3 → Visual indicator works → Deploy/Demo
5. Each story adds value without breaking previous stories

---

## Notes

- [P] tasks = different files or additive changes, no dependencies
- [Story] label maps task to specific user story for traceability
- No tests explicitly requested - implementation focus only
- All changes are client-side (no API or database changes)
- Files modified: 4 total (TiptapEditor.tsx, ImageWithOverlay.ts, tiptap-styles.css, public-page-content.css)
- Commit after each task or logical group
