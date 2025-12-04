# Tasks: Inline Text Color in Rich Text Editor

**Input**: Design documents from `/specs/018-theme-color-text/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are explicitly requested (TR-001, TR-002, TR-003 in spec.md). Focus on unit tests covering common cases without over-mocking.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Install dependencies and prepare for implementation

- [ ] T001 Install Tiptap color extensions: `docker compose run --rm app npm install @tiptap/extension-color @tiptap/extension-text-style`
- [ ] T002 Verify dependencies added to package.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: CSS fallback for legacy content - MUST be complete before user story implementation

**⚠️ CRITICAL**: Legacy content support must be in place before removing ThemeColorMark

- [ ] T003 [P] Update legacy fallback CSS in src/presentation/admin/components/PageContentEditor/tiptap-styles.css (add `.theme-color-text, span[data-theme-color] { color: inherit; }`)
- [ ] T004 [P] Update legacy fallback CSS in src/presentation/shared/components/PublicPageContent/public-page-content.css (add `.public-page-content .theme-color-text, .public-page-content span[data-theme-color] { color: inherit; }`)

**Checkpoint**: Foundation ready - legacy content protected, user story implementation can begin

---

## Phase 3: User Story 1 - Apply Text Color to Selected Text in Editor (Priority: P1) 🎯 MVP

**Goal**: Administrator can select text and apply a color from preset palette or custom hex input

**Independent Test**: Open page editor, select text, choose a color, verify text displays in that color within editor

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T005 [P] [US1] Create unit test file test/unit/presentation/admin/components/PageContentEditor/ColorPicker.test.tsx
- [ ] T006 [P] [US1] Write test: applies color to selected text via preset palette click
- [ ] T007 [P] [US1] Write test: applies custom hex color via input field

### Implementation for User Story 1

- [ ] T008 [US1] Create ColorPicker component in src/presentation/admin/components/PageContentEditor/ColorPicker.tsx with:
  - PRESET_COLORS constant (12 colors: black, white, red, orange, yellow, green, cyan, blue, purple, pink, gray, brown)
  - Preset color palette grid (clickable swatches)
  - Hex color input with validation
  - Popover UI using Chakra UI
  - Integration with Tiptap editor `setColor` command
- [ ] T009 [US1] Update TiptapEditor in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx:
  - Import Color and TextStyle extensions from @tiptap/extension-color and @tiptap/extension-text-style
  - Add Color and TextStyle extensions to useEditor configuration
  - Replace ThemeColorMark button with ColorPicker component
  - Remove ThemeColorMark import
- [ ] T010 [US1] Delete src/presentation/admin/components/PageContentEditor/ThemeColorMark.ts
- [ ] T011 [US1] Verify tests pass for User Story 1

**Checkpoint**: At this point, User Story 1 should be fully functional - admin can apply colors in editor

---

## Phase 4: User Story 2 - Display Colored Text on Public Pages (Priority: P1)

**Goal**: Public visitors see text displayed with colors applied by administrator

**Independent Test**: Apply text color in editor, save content, view public page, verify colored text appears correctly

### Tests for User Story 2

> **NOTE: PublicPageContent.tsx already allows style attribute - verify rendering works**

- [ ] T012 [P] [US2] Create unit test file test/unit/presentation/shared/components/PublicPageContent/PublicPageContent.test.tsx
- [ ] T013 [P] [US2] Write test: renders colored text with correct inline style (`<span style="color: #3B82F6">text</span>`)
- [ ] T014 [P] [US2] Write test: renders plain text without color style
- [ ] T015 [P] [US2] Write test: sanitizes malicious content in style attribute

### Implementation for User Story 2

- [ ] T016 [US2] Verify PublicPageContent.tsx in src/presentation/shared/components/PublicPageContent/PublicPageContent.tsx allows style attribute in DOMPurify config (already present - confirm no changes needed)
- [ ] T017 [US2] Verify tests pass for User Story 2

**Checkpoint**: At this point, User Story 2 should be fully functional - colored text displays on public pages

---

## Phase 5: User Story 3 - Remove or Change Text Color (Priority: P2)

**Goal**: Administrator can remove or change the color of previously colored text

**Independent Test**: Select colored text, click remove color option, verify text reverts to default color

### Tests for User Story 3

- [ ] T018 [P] [US3] Write test in test/unit/presentation/admin/components/PageContentEditor/ColorPicker.test.tsx: removes color from text via unsetColor command

### Implementation for User Story 3

- [ ] T019 [US3] Add "Remove color" option to ColorPicker component in src/presentation/admin/components/PageContentEditor/ColorPicker.tsx (call editor `unsetColor` command)
- [ ] T020 [US3] Verify tests pass for User Story 3

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [ ] T021 Run all unit tests: `docker compose run --rm app npm test -- --testPathPattern="ColorPicker|PublicPageContent"`
- [ ] T022 Run linter: `docker compose run --rm app npm run lint`
- [ ] T023 Run type check: `docker compose run --rm app npm run build:strict`
- [ ] T024 Manual validation per quickstart.md test scenarios
- [ ] T025 Verify YAGNI compliance (minimal implementation for current requirements only)
- [ ] T026 Verify DRY compliance (no code duplication)
- [ ] T027 Verify KISS compliance (simple, readable code)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS ThemeColorMark removal
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **User Story 2 (Phase 4)**: Can start after Foundational (no dependency on US1)
- **User Story 3 (Phase 5)**: Depends on US1 (extends ColorPicker component)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Creates ColorPicker - no dependencies on other stories
- **User Story 2 (P1)**: Tests public rendering - can run in parallel with US1
- **User Story 3 (P2)**: Extends ColorPicker with remove option - depends on US1 completion

### Parallel Opportunities

```text
Phase 2 (Foundational):
  T003 [P] tiptap-styles.css fallback
  T004 [P] public-page-content.css fallback

Phase 3 (US1 Tests):
  T005 [P] Create ColorPicker.test.tsx
  T006 [P] Test: preset palette
  T007 [P] Test: custom hex

Phase 4 (US2 Tests - can run parallel to US1 implementation):
  T012 [P] Create PublicPageContent.test.tsx
  T013 [P] Test: render colored text
  T014 [P] Test: render plain text
  T015 [P] Test: sanitize malicious content
```

---

## Parallel Example: User Story 1 & 2 Tests

```bash
# Can run all test file creation in parallel:
Task: T005 "Create ColorPicker.test.tsx"
Task: T012 "Create PublicPageContent.test.tsx"

# Can run all individual test writing in parallel (within each file):
Task: T006 "Test: preset palette"
Task: T007 "Test: custom hex"
Task: T013 "Test: render colored text"
Task: T014 "Test: render plain text"
Task: T015 "Test: sanitize malicious content"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (install dependencies)
2. Complete Phase 2: Foundational (legacy CSS fallback)
3. Complete Phase 3: User Story 1 (ColorPicker + TiptapEditor integration)
4. **STOP and VALIDATE**: Test color application in editor independently
5. Demo: Admin can apply colors to text

### Incremental Delivery

1. Setup + Foundational → Dependencies installed, legacy protected
2. Add User Story 1 → Test color application → Demo (MVP!)
3. Add User Story 2 → Test public display → Demo
4. Add User Story 3 → Test color removal → Demo
5. Polish → All tests pass, lint clean, type-safe

### File Summary

| File                       | Action | Phase |
| -------------------------- | ------ | ----- |
| package.json               | UPDATE | 1     |
| tiptap-styles.css          | UPDATE | 2     |
| public-page-content.css    | UPDATE | 2     |
| ColorPicker.tsx            | CREATE | 3     |
| TiptapEditor.tsx           | UPDATE | 3     |
| ThemeColorMark.ts          | DELETE | 3     |
| ColorPicker.test.tsx       | CREATE | 3, 5  |
| PublicPageContent.test.tsx | CREATE | 4     |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Tests explicitly requested: apply color, remove color, public display
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
