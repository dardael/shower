# Tasks: Editor Font Selection

**Input**: Design documents from `/specs/019-editor-font-selection/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are explicitly requested in the spec (TR-001 through TR-005). Including unit tests and integration tests.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify dependencies and prepare development environment

- [x] T001 Verify @tiptap/extension-text-style package includes FontFamily by running `docker compose run --rm app npm ls @tiptap/extension-text-style`
- [x] T002 [P] Create loadGoogleFont utility function in `src/presentation/shared/utils/loadGoogleFont.ts`
- [x] T003 [P] Create extractFontsFromHtml utility function in `src/presentation/shared/utils/extractFontsFromHtml.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add FontFamily extension to TiptapEditor - MUST complete before any user story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Add FontFamily extension import and configuration to `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`

**Checkpoint**: Foundation ready - FontFamily extension active, user story implementation can now begin

---

## Phase 3: User Story 1 - Apply Font to Selected Text (Priority: P1) 🎯 MVP

**Goal**: Enable administrators to select text in the editor and apply a specific font from the 31 available fonts

**Independent Test**: Open page content editor, select text, click font selector, choose font, verify text displays in that font, save and verify font persists

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**
> **FOCUS: Unit tests and integration tests ONLY, cover common cases, avoid over-mocking**

- [x] T005 [P] [US1] Create unit test file with basic FontPicker rendering test in `test/unit/presentation/admin/components/PageContentEditor/FontPicker.test.tsx`
- [x] T006 [P] [US1] Add unit test for font selection applies correct font-family in `test/unit/presentation/admin/components/PageContentEditor/FontPicker.test.tsx`
- [x] T007 [P] [US1] Create integration test file with font save test (TR-003) in `test/integration/editor-font.integration.test.tsx`
- [x] T008 [P] [US1] Add integration test for font displayed when editing saved content (TR-004) in `test/integration/editor-font.integration.test.tsx`

### Implementation for User Story 1

- [x] T009 [US1] Create FontPicker component with Chakra UI Popover in `src/presentation/admin/components/PageContentEditor/FontPicker.tsx`
- [x] T010 [US1] Import AVAILABLE_FONTS and getFontsByCategory from `src/domain/settings/constants/AvailableFonts.ts` in FontPicker
- [x] T011 [US1] Implement setFontFamily command call on font selection in FontPicker component
- [x] T012 [US1] Add FontPicker button to TiptapEditor toolbar next to ColorPicker in `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`
- [x] T013 [US1] Add font loading logic to FontPicker popover using loadGoogleFont utility
- [x] T014 [US1] Verify unit tests pass by running `docker compose run --rm app npm run test -- FontPicker.test.tsx`
- [x] T015 [US1] Verify integration tests pass by running `docker compose run --rm app npm run test -- editor-font.integration.test.tsx`

**Checkpoint**: User Story 1 complete - Font can be applied to text, saved, and reloaded in editor

---

## Phase 4: User Story 2 - Font Preview in Selector (Priority: P2)

**Goal**: Display each font option in its own typeface and organize by category for better UX

**Independent Test**: Open font selector dropdown, verify each font name displays in its own typeface, verify fonts are grouped by category

### Implementation for User Story 2

- [x] T016 [US2] Update FontPicker to display each font option in its own typeface using inline fontFamily style in `src/presentation/admin/components/PageContentEditor/FontPicker.tsx`
- [x] T017 [US2] Group fonts by category (sans-serif, serif, display, handwriting, monospace) with section headers in FontPicker
- [x] T018 [US2] Load fonts dynamically when popover opens using loadGoogleFont utility

**Checkpoint**: User Story 2 complete - Fonts preview in their own typeface and are organized by category

---

## Phase 5: User Story 3 - Remove Font Formatting (Priority: P3)

**Goal**: Allow administrators to remove custom font formatting and revert to default font

**Independent Test**: Select text with custom font, click "Default" option in font selector, verify text reverts to website default font

### Tests for User Story 3 ⚠️

- [x] T019 [P] [US3] Add unit test for remove font option calls unsetFontFamily in `test/unit/presentation/admin/components/PageContentEditor/FontPicker.test.tsx`

### Implementation for User Story 3

- [x] T020 [US3] Add "Default" option at top of font list in FontPicker that calls editor.chain().focus().unsetFontFamily().run()
- [x] T021 [US3] Add visual indicator for currently active font when text with custom font is selected
- [x] T022 [US3] Verify unit test passes for remove font functionality

**Checkpoint**: User Story 3 complete - Font formatting can be removed, current font is indicated

---

## Phase 6: Public Page Rendering

**Goal**: Ensure fonts render correctly on the public-facing page

**Independent Test**: View public page with font-styled content, verify correct fonts are displayed

### Tests for Public Rendering ⚠️

- [x] T023 [P] Add integration test for font renders on public page (TR-005) in `test/integration/editor-font.integration.test.tsx`

### Implementation for Public Rendering

- [x] T024 Update PublicPageContent to extract fonts from HTML content using extractFontsFromHtml utility in `src/presentation/shared/components/PublicPageContent/PublicPageContent.tsx`
- [x] T025 Load extracted fonts via loadGoogleFont in useEffect when content loads in PublicPageContent
- [x] T026 Verify integration test passes for public page font rendering

**Checkpoint**: Public page correctly renders fonts applied in editor

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and code quality checks

- [x] T027 Run full test suite with `docker compose run --rm app npm run test`
- [x] T028 Run linting with `docker compose run --rm app npm run lint`
- [x] T029 Run type check with `docker compose run --rm app npm run build:strict`
- [x] T030 Verify YAGNI compliance - no unnecessary features beyond font selection/removal
- [x] T031 Verify DRY compliance - reuses AVAILABLE_FONTS, follows ColorPicker patterns
- [x] T032 Verify KISS compliance - simple dropdown UI, standard Tiptap commands
- [x] T033 Run quickstart.md verification checklist manually

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
- **Public Rendering (Phase 6)**: Can run after Phase 3 (depends on font saving working)
- **Polish (Phase 7)**: Depends on all implementation phases being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Phase 2 - Enhances US1 but independently testable
- **User Story 3 (P3)**: Can start after Phase 2 - Adds remove capability, independently testable
- **Public Rendering**: Requires US1 save functionality to work

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Component creation before toolbar integration
- Core implementation before enhancements
- Story complete before moving to next priority

### Parallel Opportunities

- T002, T003 can run in parallel (different utility files)
- T005, T006, T007, T008 can run in parallel (test files)
- T019, T023 can run in parallel (different test additions)
- User Stories 2 and 3 can be developed in parallel after US1 foundation

---

## Parallel Example: User Story 1 Tests

```bash
# Launch all tests for User Story 1 together:
Task: "Create unit test file with basic FontPicker rendering test in test/unit/presentation/admin/components/PageContentEditor/FontPicker.test.tsx"
Task: "Create integration test file with font save test in test/integration/editor-font.integration.test.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (utilities)
2. Complete Phase 2: Foundational (FontFamily extension)
3. Complete Phase 3: User Story 1 (apply font to text)
4. **STOP and VALIDATE**: Test font selection and save independently
5. Deploy/demo if ready - core functionality complete

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Better UX with font previews
4. Add User Story 3 → Test independently → Complete editing experience
5. Add Public Rendering → Fonts work on public pages
6. Each story adds value without breaking previous stories

### Suggested MVP Scope

**Phase 1 + Phase 2 + Phase 3 (User Story 1)** = Minimal viable feature

This delivers:

- Font selector in toolbar
- Apply font to selected text
- Font styling persists on save
- Font loads when editing saved content

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Uses existing AVAILABLE_FONTS constant (DRY)
- Follows ColorPicker component pattern (consistency)
