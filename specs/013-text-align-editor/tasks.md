# Tasks: Text Alignment in Rich Text Editor

**Input**: Design documents from `/specs/013-text-align-editor/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in feature specification. No test tasks included.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and prepare for implementation

- [x] T001 Install @tiptap/extension-text-align package via `docker compose run --rm app npm install @tiptap/extension-text-align`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core changes that MUST be complete before ANY user story alignment buttons work

**CRITICAL**: No alignment buttons will function until this phase is complete

- [x] T002 Add TextAlign extension import and configuration in `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`
- [x] T003 [P] Add text alignment CSS styles to editor in `src/presentation/admin/components/PageContentEditor/tiptap-styles.css`
- [x] T004 [P] Add text alignment CSS styles to public display in `src/presentation/shared/components/PublicPageContent/public-page-content.css`
- [x] T005 [P] Add 'style' to DOMPurify ALLOWED_ATTR array in `src/presentation/shared/components/PublicPageContent/PublicPageContent.tsx`

**Checkpoint**: Foundation ready - alignment extension configured, CSS ready, sanitization updated

---

## Phase 3: User Story 1 - Align Text Left (Priority: P1)

**Goal**: Add left-align button to toolbar with active state feedback

**Independent Test**: Select text, click left-align button, verify text aligns left and button shows active state

### Implementation for User Story 1

- [x] T006 [US1] Add FiAlignLeft icon import in `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`
- [x] T007 [US1] Add left-align IconButton to toolbar following existing button pattern in `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`
- [x] T008 [US1] Verify left-align button shows active state when left-aligned text is selected
- [x] T009 [US1] Verify left alignment is default for new text content
- [x] T010 [US1] Verify contrast compliance for left-align button in light and dark modes

**Checkpoint**: Left alignment button functional and independently testable

---

## Phase 4: User Story 2 - Align Text Center (Priority: P1)

**Goal**: Add center-align button to toolbar with active state feedback

**Independent Test**: Select text, click center-align button, verify text centers and button shows active state

### Implementation for User Story 2

- [x] T011 [US2] Add FiAlignCenter icon import in `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`
- [x] T012 [US2] Add center-align IconButton to toolbar following existing button pattern in `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`
- [x] T013 [US2] Verify center-align button shows active state when centered text is selected
- [x] T014 [US2] Verify centered content renders correctly on public page at `src/app/[slug]/page.tsx`
- [x] T015 [US2] Verify contrast compliance for center-align button in light and dark modes

**Checkpoint**: Center alignment button functional and independently testable

---

## Phase 5: User Story 3 - Align Text Right (Priority: P2)

**Goal**: Add right-align button to toolbar with active state feedback

**Independent Test**: Select text, click right-align button, verify text aligns right and button shows active state

### Implementation for User Story 3

- [x] T016 [US3] Add FiAlignRight icon import in `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`
- [x] T017 [US3] Add right-align IconButton to toolbar following existing button pattern in `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`
- [x] T018 [US3] Verify right-align button shows active state when right-aligned text is selected
- [x] T019 [US3] Verify right-aligned content renders correctly on public page
- [x] T020 [US3] Verify contrast compliance for right-align button in light and dark modes

**Checkpoint**: Right alignment button functional and independently testable

---

## Phase 6: User Story 4 - Justify Text (Priority: P2)

**Goal**: Add justify button to toolbar with active state feedback

**Independent Test**: Select multi-line paragraph, click justify button, verify text justifies and button shows active state

### Implementation for User Story 4

- [x] T021 [US4] Add FiAlignJustify icon import in `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`
- [x] T022 [US4] Add justify IconButton to toolbar following existing button pattern in `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`
- [x] T023 [US4] Verify justify button shows active state when justified text is selected
- [x] T024 [US4] Verify justified content renders correctly on public page
- [x] T025 [US4] Verify contrast compliance for justify button in light and dark modes

**Checkpoint**: Justify button functional and independently testable

---

## Phase 7: User Story 5 - Visual Alignment Button Feedback (Priority: P1)

**Goal**: Ensure mutual exclusivity - only one alignment button active at a time

**Independent Test**: Click different alignment buttons, verify only clicked button shows active, others deactivate

### Implementation for User Story 5

- [x] T026 [US5] Verify only one alignment button shows active state at a time in `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`
- [x] T027 [US5] Verify switching between alignments deactivates previous button immediately
- [x] T028 [US5] Verify mixed alignment selection (multiple paragraphs) shows no active button
- [x] T029 [US5] Verify alignment applies to current paragraph when cursor is placed without selection

**Checkpoint**: Visual feedback works correctly with mutual exclusivity

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and quality checks

- [x] T030 Verify alignment persists after page save and reload
- [x] T031 Verify alignment renders correctly on public page across all 4 alignment types
- [x] T032 [P] Verify YAGNI compliance - only 4 alignment options implemented, no extras
- [x] T033 [P] Verify DRY compliance - button pattern reused, no code duplication
- [x] T034 [P] Verify KISS compliance - simple implementation, no over-engineering
- [x] T035 Run build to ensure no TypeScript errors via `docker compose run --rm app npm run build`
- [x] T036 Run lint to ensure code quality via `docker compose run --rm app npm run lint`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-7)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2)
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 3 (P2)**: Can start after Foundational - No dependencies on other stories
- **User Story 4 (P2)**: Can start after Foundational - No dependencies on other stories
- **User Story 5 (P1)**: Depends on at least 2 alignment buttons existing (US1+US2 minimum)

### Within Each User Story

- Icon import before button implementation
- Button implementation before verification tasks
- All changes in same file (TiptapEditor.tsx) - sequential within story

### Parallel Opportunities

- T003, T004, T005 can run in parallel (different files)
- US1, US2, US3, US4 implementation can run in parallel after Foundational
- T032, T033, T034 can run in parallel (verification tasks)

---

## Parallel Example: Foundational Phase

```bash
# Launch CSS and sanitization tasks in parallel:
Task: "Add text alignment CSS to editor in tiptap-styles.css"
Task: "Add text alignment CSS to public display in public-page-content.css"
Task: "Add 'style' to DOMPurify ALLOWED_ATTR in PublicPageContent.tsx"
```

## Parallel Example: User Stories After Foundational

```bash
# With multiple developers, all stories can start after Phase 2:
Developer A: User Story 1 (Left align) - T006-T010
Developer B: User Story 2 (Center align) - T011-T015
Developer C: User Story 3 (Right align) - T016-T020
Developer D: User Story 4 (Justify) - T021-T025
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 + 5)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002-T005)
3. Complete Phase 3: User Story 1 - Left Align (T006-T010)
4. Complete Phase 4: User Story 2 - Center Align (T011-T015)
5. Complete Phase 7: User Story 5 - Visual Feedback (T026-T029)
6. **STOP and VALIDATE**: Test MVP with 2 alignment options
7. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add US1 (Left) + US2 (Center) + US5 (Feedback) → Test → Deploy (MVP!)
3. Add US3 (Right) → Test → Deploy
4. Add US4 (Justify) → Test → Deploy
5. Polish phase → Final validation

---

## Files Modified Summary

| File                      | Tasks                                                       |
| ------------------------- | ----------------------------------------------------------- |
| `package.json`            | T001                                                        |
| `TiptapEditor.tsx`        | T002, T006-T007, T011-T012, T016-T017, T021-T022, T026-T029 |
| `tiptap-styles.css`       | T003                                                        |
| `public-page-content.css` | T004                                                        |
| `PublicPageContent.tsx`   | T005                                                        |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story independently completable and testable
- All 4 alignment buttons share same implementation pattern (DRY)
- No tests included as not explicitly requested in specification
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
