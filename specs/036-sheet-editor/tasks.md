# Tasks: Sheet Editor

**Input**: Design documents from `/specs/036-sheet-editor/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in specification. Focus on implementation only.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

## Path Conventions

- **Single project**: `src/` at repository root
- Paths follow existing project structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and prepare editor extensions

- [x] T001 Install `@tiptap/extension-table` package via `docker compose run --rm app npm install @tiptap/extension-table`
- [x] T002 [P] Create TableInsertDialog component skeleton in src/presentation/admin/components/PageContentEditor/TableInsertDialog.tsx
- [x] T003 [P] Create TableToolbar component skeleton in src/presentation/admin/components/PageContentEditor/TableToolbar.tsx

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Configure Tiptap Table extension and base styles - MUST be complete before user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Import and configure TableKit extension in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx
- [x] T005 [P] Add base table CSS styles (.tiptap-table, td, th) in src/presentation/admin/components/PageContentEditor/tiptap-styles.css
- [x] T006 [P] Add base table CSS styles for public display in src/presentation/shared/components/PublicPageContent/public-page-content.css

**Checkpoint**: Foundation ready - table extension configured, base styles in place

---

## Phase 3: User Story 1 - Create a Basic Sheet (Priority: P1) 🎯 MVP

**Goal**: Allow administrators to insert a table with configurable dimensions (1-20 rows/columns)

**Independent Test**: Insert a 3x4 table, enter content in cells, save page, verify table displays correctly on public side

### Implementation for User Story 1

- [x] T007 [US1] Implement TableInsertDialog with rows/columns number inputs (1-20 validation) in src/presentation/admin/components/PageContentEditor/TableInsertDialog.tsx
- [x] T008 [US1] Add "Insert Table" button to editor toolbar that opens TableInsertDialog in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx
- [x] T009 [US1] Connect TableInsertDialog to Tiptap insertTable command in src/presentation/admin/components/PageContentEditor/TableInsertDialog.tsx
- [x] T010 [US1] Add cell selection/focus styles in editor in src/presentation/admin/components/PageContentEditor/tiptap-styles.css
- [ ] T011 [US1] Verify table persists through save/reload cycle
- [ ] T012 [US1] Verify table displays correctly on public side with matching structure
- [ ] T013 [US1] Verify YAGNI compliance (minimal implementation for current requirements only)
- [ ] T014 [US1] Verify DRY compliance (no code duplication)
- [ ] T015 [US1] Verify KISS compliance (simple, readable code)

**Checkpoint**: User Story 1 complete - administrators can create tables with defined dimensions

---

## Phase 4: User Story 2 - Add and Remove Rows and Columns (Priority: P2)

**Goal**: Allow administrators to add/remove rows and columns from existing tables

**Independent Test**: Create a table, add/remove rows and columns, verify changes persist and display correctly

### Implementation for User Story 2

- [x] T016 [US2] Implement TableToolbar with row operations (add above/below, delete) in src/presentation/admin/components/PageContentEditor/TableToolbar.tsx
- [x] T017 [US2] Add column operations (add left/right, delete) to TableToolbar in src/presentation/admin/components/PageContentEditor/TableToolbar.tsx
- [x] T018 [US2] Add conditional rendering to show TableToolbar only when cursor is in table in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx
- [x] T019 [US2] Implement delete protection (disable button when only 1 row/column remains) in src/presentation/admin/components/PageContentEditor/TableToolbar.tsx
- [ ] T020 [US2] Add toolbar styling for table context menu in src/presentation/admin/components/PageContentEditor/tiptap-styles.css
- [ ] T021 [US2] Verify row/column operations persist through save/reload
- [ ] T022 [US2] Verify YAGNI compliance (minimal implementation for current requirements only)
- [ ] T023 [US2] Verify DRY compliance (no code duplication)
- [ ] T024 [US2] Verify KISS compliance (simple, readable code)

**Checkpoint**: User Story 2 complete - administrators can adjust table structure dynamically

---

## Phase 5: User Story 3 - Define Row and Column Headers (Priority: P3)

**Goal**: Allow administrators to mark cells as headers with distinct visual styling

**Independent Test**: Create a table, toggle header status on rows/columns, verify visual distinction in editor and public view

### Implementation for User Story 3

- [x] T025 [US3] Add "Toggle Header" button to TableToolbar in src/presentation/admin/components/PageContentEditor/TableToolbar.tsx
- [x] T026 [US3] Add header cell styles (bold, background color) for editor in src/presentation/admin/components/PageContentEditor/tiptap-styles.css
- [x] T027 [US3] Add header cell styles (bold, background color) for public display in src/presentation/shared/components/PublicPageContent/public-page-content.css
- [ ] T028 [US3] Ensure theme color integration for header backgrounds (light/dark mode) in src/presentation/admin/components/PageContentEditor/tiptap-styles.css
- [ ] T029 [US3] Verify contrast compliance for light and dark modes
- [ ] T030 [US3] Verify header styling persists through save/reload
- [ ] T031 [US3] Verify YAGNI compliance (minimal implementation for current requirements only)
- [ ] T032 [US3] Verify DRY compliance (no code duplication)
- [ ] T033 [US3] Verify KISS compliance (simple, readable code)

**Checkpoint**: User Story 3 complete - administrators can define header rows/columns with visual distinction

---

## Phase 6: User Story 4 - Merge Cells (Priority: P4)

**Goal**: Allow administrators to merge multiple adjacent cells into a single spanning cell

**Independent Test**: Select multiple cells, merge them, enter content, verify merged cell displays correctly in editor and public view

### Implementation for User Story 4

- [x] T034 [US4] Add "Merge Cells" button to TableToolbar (enabled when multiple adjacent cells selected) in src/presentation/admin/components/PageContentEditor/TableToolbar.tsx
- [x] T035 [US4] Add cell selection visual feedback in editor in src/presentation/admin/components/PageContentEditor/tiptap-styles.css
- [ ] T036 [US4] Verify merged cells display with correct colspan/rowspan on public side
- [ ] T037 [US4] Verify merged cell content persists through save/reload
- [ ] T038 [US4] Verify YAGNI compliance (minimal implementation for current requirements only)
- [ ] T039 [US4] Verify DRY compliance (no code duplication)
- [ ] T040 [US4] Verify KISS compliance (simple, readable code)

**Checkpoint**: User Story 4 complete - administrators can merge cells for complex layouts

---

## Phase 7: User Story 5 - Split Cells (Priority: P5)

**Goal**: Allow administrators to split previously merged cells back to original structure

**Independent Test**: Merge cells, then split them back, verify original cell structure is restored

### Implementation for User Story 5

- [x] T041 [US5] Add "Split Cell" button to TableToolbar (enabled only for merged cells) in src/presentation/admin/components/PageContentEditor/TableToolbar.tsx
- [ ] T042 [US5] Verify split restores original cell structure
- [ ] T043 [US5] Verify content moves to top-left cell after split
- [ ] T044 [US5] Verify split cells display correctly on public side
- [ ] T045 [US5] Verify YAGNI compliance (minimal implementation for current requirements only)
- [ ] T046 [US5] Verify DRY compliance (no code duplication)
- [ ] T047 [US5] Verify KISS compliance (simple, readable code)

**Checkpoint**: User Story 5 complete - administrators can undo merge operations

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T048 [P] Add responsive horizontal scrolling for tables on mobile viewports in src/presentation/shared/components/PublicPageContent/public-page-content.css
- [x] T049 [P] Add "Delete Table" button to TableToolbar in src/presentation/admin/components/PageContentEditor/TableToolbar.tsx
- [ ] T050 Add keyboard navigation (Tab/Shift+Tab, arrow keys) verification for table cells
- [x] T051 Run build verification: `docker compose run --rm app npm run build`
- [x] T052 Run lint verification: `docker compose run --rm app npm run lint`
- [ ] T053 Run quickstart.md manual validation checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can then proceed in priority order (P1 → P2 → P3 → P4 → P5)
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Extends toolbar, no dependency on US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Extends toolbar, no dependency on US1/US2
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Extends toolbar, no dependency on US1/US2/US3
- **User Story 5 (P5)**: Depends on User Story 4 (merge must exist before split can undo it)

### Within Each User Story

- Core implementation before integration
- CSS styles can be done in parallel with logic
- Verification tasks at end of story

### Parallel Opportunities

- T002 and T003 (component skeletons) can run in parallel
- T005 and T006 (CSS files) can run in parallel
- T048 and T049 (polish tasks) can run in parallel
- US1, US2, US3, US4 can theoretically start in parallel after Foundation (but US5 depends on US4)

---

## Parallel Example: Setup Phase

```bash
# Launch component skeletons together:
Task: "Create TableInsertDialog component skeleton in src/presentation/admin/components/PageContentEditor/TableInsertDialog.tsx"
Task: "Create TableToolbar component skeleton in src/presentation/admin/components/PageContentEditor/TableToolbar.tsx"
```

## Parallel Example: Foundational Phase

```bash
# Launch CSS tasks together:
Task: "Add base table CSS styles in tiptap-styles.css"
Task: "Add base table CSS styles for public display in public-content-styles.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test table creation independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → MVP: Basic table creation
3. Add User Story 2 → Test independently → Row/column management
4. Add User Story 3 → Test independently → Header styling
5. Add User Story 4 → Test independently → Cell merging
6. Add User Story 5 → Test independently → Cell splitting
7. Each story adds value without breaking previous stories

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- No tests included as not explicitly requested in specification
