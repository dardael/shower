# Tasks: Editor Image Resize and Move

**Input**: Design documents from `/specs/016-editor-image-resize/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not requested in feature specification. No test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/` at repository root
- Presentation layer: `src/presentation/admin/components/` and `src/presentation/shared/components/`

---

## Phase 1: Setup (No Tasks Required)

**Purpose**: Project initialization and basic structure

No setup tasks required - this feature extends an existing codebase with all dependencies already installed (@tiptap/extension-image v3.11.1 already in package.json).

---

## Phase 2: Foundational (No Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

No foundational tasks required - all prerequisites from spec 015 (editor-image-upload) are already in place:

- Tiptap editor configured
- Image extension installed
- File upload working
- Content persistence working

**Checkpoint**: Foundation ready - user story implementation can begin

---

## Phase 3: User Story 1 - Administrator Resizes Image in Editor (Priority: P1) 🎯 MVP

**Goal**: Enable administrators to resize images by dragging corner handles while maintaining aspect ratio

**Independent Test**: Open page content editor with an existing image, click on image to see resize handles, drag corner handle to resize, save and verify dimensions persist

### Implementation for User Story 1

- [x] T001 [US1] Create ResizableImage extension with resize configuration in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx
- [x] T002 [US1] Replace Image extension with ResizableImage in useEditor extensions array in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx
- [x] T003 [P] [US1] Add selected image outline styles for light/dark modes in src/presentation/admin/components/PageContentEditor/tiptap-styles.css
- [x] T004 [P] [US1] Add resize handle container styles in src/presentation/admin/components/PageContentEditor/tiptap-styles.css
- [ ] T005 [US1] Verify resize handles appear when clicking an image in the editor
- [ ] T006 [US1] Verify aspect ratio is maintained during corner handle drag
- [ ] T007 [US1] Verify minimum size constraint (50x50px) is enforced
- [ ] T008 [US1] Verify maximum width constraint (content area) is enforced
- [ ] T009 [US1] Verify resized dimensions persist after saving page content
- [ ] T010 [US1] Verify contrast compliance for resize handles in both light and dark modes

**Checkpoint**: User Story 1 complete - image resize is fully functional and testable independently

---

## Phase 4: User Story 2 - Administrator Moves Image Position in Editor (Priority: P1)

**Goal**: Enable administrators to drag images to reposition them within the content

**Independent Test**: Open page content editor with an existing image, drag image to a new position between paragraphs, save and verify position persists

### Implementation for User Story 2

- [x] T011 [US2] Add draggable: true to ResizableImage extension in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx
- [x] T012 [P] [US2] Add cursor styles for draggable images (grab/grabbing) in src/presentation/admin/components/PageContentEditor/tiptap-styles.css
- [ ] T013 [US2] Verify images can be dragged to new positions in the editor
- [ ] T014 [US2] Verify drop indicator shows where image will be placed
- [ ] T015 [US2] Verify image position persists after saving page content
- [ ] T016 [US2] Verify image movement works on touch devices (tablet)

**Checkpoint**: User Story 2 complete - image move is fully functional and testable independently

---

## Phase 5: User Story 3 - Public Page Display of Resized Images (Priority: P2)

**Goal**: Ensure resized images display at their configured dimensions on the public page

**Independent Test**: Navigate to a public page containing resized images and verify they display at their administrator-configured sizes

### Implementation for User Story 3

- [x] T017 [P] [US3] Add CSS rule for images with inline width styles in src/presentation/shared/components/PublicPageContent/public-page-content.css
- [ ] T018 [US3] Verify resized images display at configured dimensions on public page
- [ ] T019 [US3] Verify images scale proportionally on smaller viewports (responsive)
- [ ] T020 [US3] Verify moved images display in their new positions on public page

**Checkpoint**: User Story 3 complete - public display is fully functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T021 Verify YAGNI compliance - no features beyond resize and move implemented
- [x] T022 Verify DRY compliance - no duplicate styles or logic
- [x] T023 Verify KISS compliance - simple, readable implementation using Tiptap built-ins
- [ ] T024 Run quickstart.md manual testing checklist
- [ ] T025 Verify editor undo/redo works for resize and move operations

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: N/A - no setup required
- **Foundational (Phase 2)**: N/A - no foundational tasks
- **User Story 1 (Phase 3)**: Can start immediately
- **User Story 2 (Phase 4)**: Can start after T001-T002 (shares TiptapEditor.tsx)
- **User Story 3 (Phase 5)**: Can start after US1 and US2 complete (verifies their output)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies - core resize functionality
- **User Story 2 (P1)**: Depends on T001-T002 (adds to same ResizableImage extension)
- **User Story 3 (P2)**: Depends on US1 and US2 (verifies their functionality on public side)

### Within Each User Story

- T001-T002 must complete before T003-T004 (extension must exist before styles)
- T011 depends on T001-T002 (extends the same ResizableImage)
- Verification tasks (T005-T010, T013-T016, T018-T020) come after implementation

### Parallel Opportunities

- T003 and T004 can run in parallel (different CSS rules, same file but independent)
- T012 can run in parallel with T011 (different file)
- T017 can run in parallel with US2 tasks (different component)

---

## Parallel Example: User Story 1 CSS Tasks

```bash
# Launch CSS tasks for User Story 1 together:
Task: "Add selected image outline styles in tiptap-styles.css"
Task: "Add resize handle container styles in tiptap-styles.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 3: User Story 1 (resize functionality)
2. **STOP and VALIDATE**: Test image resize independently
3. Resize works → MVP delivered

### Incremental Delivery

1. Add User Story 1 → Test resize → Core value delivered
2. Add User Story 2 → Test move → Full editor capability delivered
3. Add User Story 3 → Test public display → Complete feature delivered
4. Each story adds value without breaking previous stories

### Recommended Execution Order

1. T001 → T002 (create ResizableImage extension)
2. T003, T004 in parallel (CSS for US1)
3. T011 (add draggable to extension)
4. T012 (CSS for US2)
5. T017 (CSS for US3)
6. Verification tasks (T005-T010, T013-T016, T018-T020)
7. Polish tasks (T021-T025)

---

## Notes

- [P] tasks = different files or independent CSS rules, no dependencies
- [Story] label maps task to specific user story for traceability
- No new npm packages required - uses existing @tiptap/extension-image
- Image dimensions stored as inline HTML styles (no backend changes)
- Focus on Tiptap's built-in capabilities per research.md decisions
- Avoid: custom resize implementations, external packages, backend changes
