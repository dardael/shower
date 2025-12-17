# Tasks: Sheet Cell Formatting

**Input**: Design documents from `/specs/037-sheet-cell-format/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not requested - skipping test tasks.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Exact file paths included in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Type definitions and shared constants needed by all user stories

- [x] T001 Create type definitions file at src/presentation/admin/components/PageContentEditor/tableFormatTypes.ts with VerticalAlignment type, TableFormatAttributes interface, CellFormatAttributes interface, and constants (BORDER_THICKNESS_MIN, BORDER_THICKNESS_MAX, BORDER_THICKNESS_DEFAULT, VERTICAL_ALIGN_DEFAULT)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Custom Tiptap extensions that MUST be complete before ANY user story UI can work

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Create custom Table extension with borderThickness attribute in src/presentation/admin/components/PageContentEditor/extensions/CustomTable.ts (parseHTML reads data-border-thickness, renderHTML outputs data-border-thickness and style with CSS variable)
- [x] T003 [P] Create custom TableCell extension with verticalAlign attribute in src/presentation/admin/components/PageContentEditor/extensions/CustomTableCell.ts (parseHTML reads data-vertical-align, renderHTML outputs data-vertical-align)
- [x] T004 [P] Create custom TableHeader extension with verticalAlign attribute in src/presentation/admin/components/PageContentEditor/extensions/CustomTableHeader.ts (same as TableCell for consistency)
- [x] T005 Create extensions index file at src/presentation/admin/components/PageContentEditor/extensions/index.ts exporting all custom extensions
- [x] T006 Update TiptapEditor.tsx to import and use CustomTable, CustomTableCell, CustomTableHeader extensions instead of default @tiptap/extension-table extensions

**Checkpoint**: Foundation ready - custom extensions in place, user story implementation can begin

---

## Phase 3: User Story 1 - Configure Border Thickness (Priority: P1) 🎯 MVP

**Goal**: Administrator can set border thickness (0-10px) for sheets in page content editor

**Independent Test**: Create a sheet, adjust border thickness slider from 0 to 10, verify borders update in real-time in editor preview

### Implementation for User Story 1

- [x] T007 [US1] Add border thickness number input control to TableToolbar.tsx with label, min=0, max=10, step=1, showing current table borderThickness value
- [x] T008 [US1] Implement updateTableBorderThickness editor command helper in TableToolbar.tsx that calls editor.chain().focus().updateAttributes('table', { borderThickness }).run()
- [x] T009 [US1] Implement getCurrentBorderThickness helper in TableToolbar.tsx using findParentNode to get current table's borderThickness attribute
- [x] T010 [US1] Add CSS rules to tiptap-styles.css for border-width using CSS variable: .tiptap table td, .tiptap table th { border-width: var(--table-border-width, 1px); border-style: solid; }
- [x] T011 [US1] Add CSS rule to tiptap-styles.css for hidden borders when border-width is 0: ensure border-style changes to none when --table-border-width is 0px
- [x] T012 [US1] Verify border thickness control is accessible within 2 clicks from table editing interface
- [x] T013 [US1] Verify contrast compliance for border thickness control in light and dark modes
- [x] T014 [US1] Verify YAGNI compliance (only border thickness 0-10px, no color or style options)
- [x] T015 [US1] Verify DRY compliance (reuse existing TableToolbar patterns)
- [x] T016 [US1] Verify KISS compliance (simple number input, no complex state)

**Checkpoint**: Border thickness configuration fully functional - can set 0-10px and see immediate preview

---

## Phase 4: User Story 2 - Configure Vertical Cell Alignment (Priority: P1)

**Goal**: Administrator can set vertical alignment (top/center/bottom) for individual cells

**Independent Test**: Create a sheet with cells of different content heights, apply each vertical alignment option, verify content positions correctly in editor preview

### Implementation for User Story 2

- [x] T017 [US2] Add vertical alignment button group to TableToolbar.tsx with three IconButtons for top, center (middle), bottom alignment using appropriate icons (FiAlignTop, FiAlignCenter, FiAlignBottom or similar from react-icons)
- [x] T018 [US2] Implement updateCellVerticalAlign editor command helper in TableToolbar.tsx that calls editor.chain().focus().updateAttributes('tableCell', { verticalAlign }).run()
- [x] T019 [US2] Implement getCurrentVerticalAlign helper in TableToolbar.tsx using editor.getAttributes('tableCell').verticalAlign
- [x] T020 [US2] Highlight active alignment button based on current cell's verticalAlign attribute
- [x] T021 [US2] Add CSS rules to tiptap-styles.css for vertical alignment using attribute selectors: td[data-vertical-align="top"] { vertical-align: top; }, td[data-vertical-align="center"] { vertical-align: middle; }, td[data-vertical-align="bottom"] { vertical-align: bottom; }
- [x] T022 [US2] Add same CSS rules for th elements in tiptap-styles.css (header cells)
- [x] T023 [US2] Verify vertical alignment controls are accessible within 2 clicks from table editing interface
- [x] T024 [US2] Verify contrast compliance for alignment buttons in light and dark modes
- [x] T025 [US2] Verify YAGNI compliance (only top/center/bottom, no justify or custom options)
- [x] T026 [US2] Verify DRY compliance (reuse icon button patterns from existing TableToolbar)
- [x] T027 [US2] Verify KISS compliance (simple button group, clear visual feedback)

**Checkpoint**: Vertical alignment configuration fully functional - can set top/center/bottom per cell

---

## Phase 5: User Story 3 - Public View Rendering (Priority: P1)

**Goal**: Visitors see formatted sheets correctly on public pages

**Independent Test**: Configure various border and alignment settings in admin, publish page, view public page and verify all formatting renders correctly

### Implementation for User Story 3

- [x] T028 [US3] Update DOMPurify configuration in PublicPageContent.tsx to add 'data-border-thickness' to ALLOWED_ATTR array
- [x] T029 [US3] Update DOMPurify configuration in PublicPageContent.tsx to add 'data-vertical-align' to ALLOWED_ATTR array
- [x] T030 [US3] Update DOMPurify configuration in PublicPageContent.tsx to ensure 'style' attribute is allowed for CSS variable injection
- [x] T031 [US3] Add CSS rules to public-page-content.css for border-width using CSS variable (mirror admin styles): .public-page-content table td, .public-page-content table th { border-width: var(--table-border-width, 1px); border-style: solid; }
- [x] T032 [US3] Add CSS rules to public-page-content.css for vertical alignment using attribute selectors (mirror admin styles for td and th elements)
- [x] T033 [US3] Add CSS rule to public-page-content.css for hidden borders when border-width is 0
- [x] T034 [US3] Verify backward compatibility: existing tables without data attributes display with defaults (1px border, top alignment)
- [x] T035 [US3] Verify combined formatting: test table with both custom border thickness AND custom vertical alignment renders correctly
- [x] T036 [US3] Verify YAGNI compliance (only render what admin configured, no extra public-only features)
- [x] T037 [US3] Verify DRY compliance (CSS rules parallel admin styles)
- [x] T038 [US3] Verify KISS compliance (simple attribute-based CSS, no JavaScript rendering logic)

**Checkpoint**: All formatting visible on public pages - feature complete

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [x] T039 Run manual end-to-end test: create page with sheet, set border to 0px, set various vertical alignments, save, view public page
- [x] T040 Run manual end-to-end test: edit existing pre-feature table, verify defaults applied, modify and save
- [x] T041 Code cleanup: ensure no unused imports or dead code in modified files
- [x] T042 Verify all modified files pass linting (npm run lint)
- [x] T043 Verify all modified files pass type checking (npm run build:strict)
- [x] T044 Run quickstart.md validation checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion
- **User Story 2 (Phase 4)**: Depends on Foundational phase completion - CAN run in parallel with US1
- **User Story 3 (Phase 5)**: Depends on Foundational phase completion - CAN run in parallel with US1/US2
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (Border Thickness)**: Independent after Foundational
- **User Story 2 (Vertical Alignment)**: Independent after Foundational
- **User Story 3 (Public Rendering)**: Independent after Foundational, but best tested after US1/US2 complete

### Within Each User Story

- UI controls before CSS rules
- Core implementation before validation tasks

### Parallel Opportunities

**Phase 2 (Foundational)**:

```bash
# T003 and T004 can run in parallel (different files):
Task: "Create CustomTableCell extension"
Task: "Create CustomTableHeader extension"
```

**Phase 3-5 (User Stories)**:

```bash
# After Foundational complete, all three stories can start in parallel:
Task: "US1 - Border thickness controls"
Task: "US2 - Vertical alignment controls"
Task: "US3 - Public view rendering"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002-T006)
3. Complete Phase 3: User Story 1 (T007-T016)
4. **STOP and VALIDATE**: Test border thickness independently
5. Deploy/demo if ready - admins can hide borders!

### Incremental Delivery

1. Setup + Foundational → Custom extensions ready
2. Add User Story 1 → Border thickness works → Deploy
3. Add User Story 2 → Vertical alignment works → Deploy
4. Add User Story 3 → Public view shows all formatting → Deploy
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers after Foundational is done:

- Developer A: User Story 1 (border thickness)
- Developer B: User Story 2 (vertical alignment)
- Developer C: User Story 3 (public rendering)

All stories complete and integrate independently.

---

## Summary

| Metric                     | Count                                        |
| -------------------------- | -------------------------------------------- |
| **Total Tasks**            | 44                                           |
| **Setup Tasks**            | 1                                            |
| **Foundational Tasks**     | 5                                            |
| **User Story 1 Tasks**     | 10                                           |
| **User Story 2 Tasks**     | 11                                           |
| **User Story 3 Tasks**     | 11                                           |
| **Polish Tasks**           | 6                                            |
| **Parallel Opportunities** | 2 in Phase 2, all stories after Foundational |

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- No tests included (not requested in spec)
