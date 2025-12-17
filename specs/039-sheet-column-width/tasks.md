# Tasks: Sheet Column Width Configuration

**Input**: Design documents from `/specs/039-sheet-column-width/`
**Prerequisites**: plan.md, spec.md, data-model.md

**Tests**: Not explicitly requested in the specification - no test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: No setup required - this feature extends existing infrastructure

_No tasks needed - existing Tiptap table extensions and TableToolbar component are already in place._

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add colwidth attribute support to table cell extensions

**⚠️ CRITICAL**: User story implementation cannot begin until this phase is complete

- [x] T001 [P] Add createColumnWidthAttribute helper function in src/presentation/admin/components/PageContentEditor/tableFormatTypes.ts
- [x] T002 [P] Add colwidth attribute to CustomTableCell extension in src/presentation/admin/components/PageContentEditor/extensions/CustomTableCell.ts
- [x] T003 [P] Add colwidth attribute to CustomTableHeader extension in src/presentation/admin/components/PageContentEditor/extensions/CustomTableHeader.ts

**Checkpoint**: Foundation ready - colwidth attribute is now supported in table cells

---

## Phase 3: User Story 1 - Set Column Width via Numeric Input (Priority: P1) 🎯 MVP

**Goal**: Administrator can enter a pixel width value in a toolbar input field to set column width

**Independent Test**: Select a cell in a sheet, enter a pixel value in the column width input in the toolbar, verify the column width updates immediately

### Implementation for User Story 1

- [x] T004 [US1] Add column width state management (getCurrentColumnWidth, updateColumnWidth functions) in src/presentation/admin/components/PageContentEditor/TableToolbar.tsx
- [x] T005 [US1] Add column width input field to TableToolbar UI in src/presentation/admin/components/PageContentEditor/TableToolbar.tsx
- [x] T006 [US1] Implement minimum width validation (50px) in src/presentation/admin/components/PageContentEditor/TableToolbar.tsx
- [x] T007 [US1] Add proper styling and contrast for light/dark modes in src/presentation/admin/components/PageContentEditor/TableToolbar.tsx
- [x] T008 [US1] Verify YAGNI compliance (minimal implementation for current requirements only)
- [x] T009 [US1] Verify DRY compliance (no code duplication, reuse existing attribute patterns)
- [x] T010 [US1] Verify KISS compliance (simple, readable code following existing patterns)

**Checkpoint**: At this point, User Story 1 should be fully functional - admin can set column widths via input

---

## Phase 4: User Story 2 - Consistent Column Widths Across Multiple Sheets (Priority: P1)

**Goal**: Each sheet on a page remembers its column widths independently, enabling alignment across sheets

**Independent Test**: Create two sheets, set the first column of both to the same width (e.g., 200px), add different amounts of text to the second column, verify alignment

### Implementation for User Story 2

- [x] T011 [US2] Verify column width independence between sheets (each sheet's colwidth attributes are stored separately in HTML)
- [x] T012 [US2] Test multi-sheet scenario: set same width on first column of 5 sheets, verify alignment persists

**Checkpoint**: At this point, multiple sheets can have independently configured column widths

---

## Phase 5: User Story 3 - Visual Feedback During Width Input (Priority: P1)

**Goal**: Column resizes in real-time as administrator types the pixel value

**Independent Test**: Select a cell, type a pixel value digit by digit, observe column resizing in real-time

### Implementation for User Story 3

- [x] T013 [US3] Implement real-time column width update on input change in src/presentation/admin/components/PageContentEditor/TableToolbar.tsx
- [x] T014 [US3] Handle empty input (clear colwidth to null for auto-adapt behavior) in src/presentation/admin/components/PageContentEditor/TableToolbar.tsx
- [x] T015 [US3] Verify adjacent columns adjust proportionally when width changes

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [x] T016 Run quickstart.md validation scenarios
- [x] T017 Verify public page renders column widths correctly (existing PublicPageContent.tsx already handles data-colwidth)
- [x] T018 Code cleanup and ensure consistent patterns with existing toolbar controls

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Skipped - no new infrastructure needed
- **Foundational (Phase 2)**: No dependencies - can start immediately, BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - US1, US2, US3 are all P1 priority but have logical dependencies
  - US1 provides the input mechanism
  - US2 validates multi-sheet behavior (uses US1)
  - US3 refines real-time feedback (enhances US1)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Foundational (T001-T003)
- **User Story 2 (P1)**: Depends on US1 being complete
- **User Story 3 (P1)**: Depends on US1 being complete

### Within Each Phase

- T001, T002, T003 can run in parallel (different files)
- T004-T007 must be sequential (same file, building on each other)

### Parallel Opportunities

```bash
# Launch all foundational tasks in parallel:
Task: "Add createColumnWidthAttribute helper in tableFormatTypes.ts"
Task: "Add colwidth to CustomTableCell.ts"
Task: "Add colwidth to CustomTableHeader.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (T001-T003)
2. Complete Phase 3: User Story 1 (T004-T010)
3. **STOP and VALIDATE**: Test column width input works
4. Deploy/demo if ready

### Full Implementation

1. Complete Foundational → colwidth attribute ready
2. Add User Story 1 → Basic input functionality works
3. Add User Story 2 → Multi-sheet alignment works
4. Add User Story 3 → Real-time feedback polished
5. Complete Polish → Production ready

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- All changes are in the Presentation layer (no API/domain changes)
- Public side rendering already handles data-colwidth (no changes needed)
- Follow existing patterns from borderThickness and verticalAlign implementations
