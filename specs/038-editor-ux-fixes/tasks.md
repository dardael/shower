# Tasks: Editor UX Fixes

**Input**: Design documents from `/specs/038-editor-ux-fixes/`
**Prerequisites**: plan.md ✓, spec.md ✓, quickstart.md ✓

**Tests**: Not explicitly requested - no test tasks included.

**Organization**: Tasks grouped by user story. All stories modify different files and can be implemented in parallel.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

---

## Phase 1: User Story 1 - Sticky Toolbar for Long Content (Priority: P1) 🎯 MVP

**Goal**: Keep the editor toolbar visible when scrolling through long page content

**Independent Test**: Create a page with content longer than viewport height, scroll down, verify toolbar remains accessible

### Implementation for User Story 1

- [x] T001 [P] [US1] Add sticky positioning to toolbar HStack in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx
- [x] T002 [P] [US1] Verify toolbar sticks to top of editor container (not browser viewport) in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx
- [x] T003 [P] [US1] Verify toolbar remains sticky on mobile viewport sizes in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx

**Checkpoint**: Toolbar remains visible and accessible when scrolling through long content

---

## Phase 2: User Story 2 - Auto-Scroll to Editor on Edit Action (Priority: P2)

**Goal**: Automatically scroll the page to show the editor when clicking "edit page content"

**Independent Test**: Click edit on a menu item from various scroll positions, verify editor becomes visible without manual scrolling

### Implementation for User Story 2

- [x] T004 [P] [US2] Add ref to PageContentEditor container Box in src/presentation/admin/components/MenuConfigForm.tsx
- [x] T005 [US2] Add useEffect to scroll editor into view when editingContentItem changes in src/presentation/admin/components/MenuConfigForm.tsx
- [x] T006 [US2] Verify scroll behavior positions toolbar at top of visible area in src/presentation/admin/components/MenuConfigForm.tsx

**Checkpoint**: Clicking edit page content automatically scrolls to show the editor

---

## Phase 3: User Story 3 - Fix Button Contrast Issue (Priority: P1)

**Goal**: Ensure all button labels are readable with proper contrast in both light and dark modes

**Independent Test**: View the page content editing interface, verify all button labels are readable against their backgrounds in both themes

### Implementation for User Story 3

- [x] T007 [P] [US3] Identify button with contrast issue (Delete/Cancel button) in src/presentation/admin/components/PageContentEditor/PageContentEditor.tsx
- [x] T008 [US3] Fix button styling to ensure proper text contrast in src/presentation/admin/components/PageContentEditor/PageContentEditor.tsx
- [x] T009 [US3] Verify button text is readable in light mode in src/presentation/admin/components/PageContentEditor/PageContentEditor.tsx
- [x] T010 [US3] Verify button text is readable in dark mode in src/presentation/admin/components/PageContentEditor/PageContentEditor.tsx

**Checkpoint**: All button labels meet WCAG AA contrast requirements (4.5:1 ratio)

---

## Phase 4: Polish & Validation

**Purpose**: Final validation across all user stories

- [x] T011 Run type check with `docker compose run --rm app npm run build:strict`
- [x] T012 Run lint check with `docker compose run --rm app npm run lint`
- [ ] T013 Manual validation of all three fixes in browser (light mode)
- [ ] T014 Manual validation of all three fixes in browser (dark mode)
- [x] T015 Verify YAGNI compliance (no unnecessary code added)
- [x] T016 Verify KISS compliance (simple, readable implementations)

---

## Dependencies & Execution Order

### Phase Dependencies

- **User Story 1 (Phase 1)**: No dependencies - can start immediately
- **User Story 2 (Phase 2)**: No dependencies - can start immediately
- **User Story 3 (Phase 3)**: No dependencies - can start immediately
- **Polish (Phase 4)**: Depends on all user stories being complete

### User Story Dependencies

All three user stories are **fully independent**:

- **US1**: TiptapEditor.tsx only
- **US2**: MenuConfigForm.tsx only
- **US3**: PageContentEditor.tsx only

No cross-story dependencies exist.

### Parallel Opportunities

**Maximum parallelization** - all three stories can run simultaneously:

```bash
# All user stories can start in parallel (different files):
Task: T001 [US1] Add sticky positioning in TiptapEditor.tsx
Task: T004 [US2] Add ref to editor container in MenuConfigForm.tsx
Task: T007 [US3] Identify button with contrast issue in PageContentEditor.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 3)

Both P1 stories are critical usability/accessibility fixes:

1. Complete US1: Sticky toolbar (most impactful)
2. Complete US3: Button contrast (accessibility requirement)
3. **STOP and VALIDATE**: Test both fixes
4. Complete US2: Auto-scroll (P2 enhancement)

### Parallel Execution (Recommended)

Since all stories modify different files:

1. Start T001, T004, T007 in parallel
2. Complete each story's remaining tasks
3. Run Polish phase validation

### Estimated Effort

- **US1**: ~15 minutes (3 lines of CSS props)
- **US2**: ~20 minutes (ref + useEffect)
- **US3**: ~15 minutes (button variant/color fix)
- **Polish**: ~10 minutes (type check, lint, manual validation)

**Total**: ~1 hour

---

## Notes

- All changes are CSS/React props only - no logic changes
- All [P] tasks can run in parallel
- Commit after each user story completion
- No tests required unless explicitly requested
