# Tasks: Theme Color Text Formatting

**Input**: Design documents from `/specs/012-theme-color-text/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not requested in specification. Tests are OPTIONAL and not included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Exact file paths included in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project readiness - no new setup required for this feature

- [x] T001 Verify existing Tiptap dependencies are available in package.json (@tiptap/react, @tiptap/core)
- [x] T002 Verify react-icons package includes MdFormatColorText icon

**Checkpoint**: Dependencies verified - ready for implementation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the core Tiptap extension that all user stories depend on

**⚠️ CRITICAL**: User Story implementation cannot begin until ThemeColorMark extension exists

- [x] T003 Create ThemeColorMark extension with Mark.create() in src/presentation/admin/components/PageContentEditor/ThemeColorMark.ts
- [x] T004 Add TypeScript declaration for themeColor commands (setThemeColor, toggleThemeColor, unsetThemeColor) in src/presentation/admin/components/PageContentEditor/ThemeColorMark.ts
- [x] T005 Implement parseHTML to recognize span.theme-color-text and span[data-theme-color] in src/presentation/admin/components/PageContentEditor/ThemeColorMark.ts
- [x] T006 Implement renderHTML to output span with class="theme-color-text" and data-theme-color="true" in src/presentation/admin/components/PageContentEditor/ThemeColorMark.ts

**Checkpoint**: Foundation ready - ThemeColorMark extension complete

---

## Phase 3: User Story 1 - Apply Theme Color to Selected Text (Priority: P1) 🎯 MVP

**Goal**: Enable administrators to apply theme color to selected text via toolbar button

**Independent Test**: Select text in editor, click color button, verify text displays in theme color. Save and reload to verify persistence.

### Implementation for User Story 1

- [x] T007 [P] [US1] Add CSS rule for .theme-color-text class using var(--chakra-colors-color-palette-solid) in src/presentation/admin/components/PageContentEditor/tiptap-styles.css
- [x] T008 [P] [US1] Add CSS rule for span[data-theme-color] selector as fallback in src/presentation/admin/components/PageContentEditor/tiptap-styles.css
- [x] T009 [US1] Import ThemeColorMark extension in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx
- [x] T010 [US1] Add ThemeColorMark to editor extensions array in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx
- [x] T011 [US1] Import MdFormatColorText icon from react-icons/md in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx
- [x] T012 [US1] Add theme color IconButton to toolbar after italic button in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx
- [x] T013 [US1] Implement onClick handler to call editor.chain().focus().toggleThemeColor().run() in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx
- [x] T014 [US1] Add disabled prop support matching other toolbar buttons in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx
- [x] T015 [US1] Verify YAGNI compliance - no extra features beyond toggle functionality
- [x] T016 [US1] Verify DRY compliance - button follows existing toolbar pattern
- [x] T017 [US1] Verify KISS compliance - simple mark extension with CSS class

**Checkpoint**: User Story 1 complete - can apply/remove theme color to text, content persists on save

---

## Phase 4: User Story 2 - Visual Feedback in Editor (Priority: P2)

**Goal**: Provide visual feedback when theme color is active on selected/cursor text

**Independent Test**: Apply theme color to text, place cursor in colored text, verify toolbar button shows active state. Move cursor to uncolored text, verify button shows inactive state.

### Implementation for User Story 2

- [x] T018 [US2] Add editor.isActive('themeColor') check for button variant (solid/ghost) in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx
- [x] T019 [US2] Add color prop using colorPalette.fg when active, fg when inactive in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx
- [x] T020 [US2] Verify contrast compliance - active state visible in both light and dark modes
- [x] T021 [US2] Verify button states match existing toolbar button patterns (bold, italic)

**Checkpoint**: User Story 2 complete - toolbar button shows correct active/inactive state

---

## Phase 5: User Story 3 - Theme Color Updates Reflect in Content (Priority: P3)

**Goal**: Ensure colored text automatically updates when website theme color changes

**Independent Test**: Create content with theme-colored text, change theme color in settings, verify colored text displays new color without re-editing.

### Implementation for User Story 3

- [x] T022 [US3] Verify CSS variable var(--chakra-colors-color-palette-solid) is used in theme-color-text rule (already done in T007)
- [x] T023 [US3] Test theme color change propagation in admin editor view
- [x] T024 [US3] Test theme color change propagation on public page view
- [x] T025 [US3] Verify no hardcoded color values in CSS or extension code

**Checkpoint**: User Story 3 complete - theme color changes automatically update colored text

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across all user stories

- [x] T026 Run docker compose run --rm app npm run build:strict for type checking
- [x] T027 Run docker compose run --rm app npm run lint for code quality
- [x] T028 Run docker compose run --rm app npm run build for production build
- [ ] T029 Manual testing: verify all acceptance scenarios from spec.md
- [ ] T030 Verify edge case: no text selected - button has no effect
- [ ] T031 Verify edge case: theme color with bold/italic - formatting preserved
- [ ] T032 Verify edge case: theme color in headings - heading style preserved
- [ ] T033 Run quickstart.md validation steps

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - verification only
- **Foundational (Phase 2)**: Depends on Setup - creates ThemeColorMark extension
- **User Story 1 (Phase 3)**: Depends on Foundational - adds button and CSS
- **User Story 2 (Phase 4)**: Depends on US1 button existing - adds visual states
- **User Story 3 (Phase 5)**: Depends on US1 CSS being variable-based - validation only
- **Polish (Phase 6)**: Depends on all user stories complete

### User Story Dependencies

- **User Story 1 (P1)**: Requires Foundational phase (ThemeColorMark)
- **User Story 2 (P2)**: Requires US1 (button must exist to add states)
- **User Story 3 (P3)**: Requires US1 (CSS must exist to verify variable usage)

### Within Each User Story

- CSS tasks (T007, T008) can run in parallel
- Editor modifications are sequential (import → add extension → add button → add handler)

### Parallel Opportunities

- T007 and T008 can run in parallel (different CSS rules, same file is fine)
- T001 and T002 can run in parallel (different verification tasks)

---

## Parallel Example: Phase 3 (User Story 1)

```bash
# Launch CSS tasks in parallel:
Task: "Add CSS rule for .theme-color-text class in tiptap-styles.css" [T007]
Task: "Add CSS rule for span[data-theme-color] selector in tiptap-styles.css" [T008]

# Then sequential TiptapEditor changes:
Task: "Import ThemeColorMark extension" [T009]
Task: "Add to extensions array" [T010]
Task: "Import icon" [T011]
Task: "Add IconButton" [T012]
Task: "Implement onClick handler" [T013]
Task: "Add disabled prop" [T014]
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (verify dependencies)
2. Complete Phase 2: Foundational (create ThemeColorMark)
3. Complete Phase 3: User Story 1 (button + CSS)
4. **STOP and VALIDATE**: Test applying/removing color, verify persistence
5. Ready for use - basic functionality complete

### Incremental Delivery

1. Setup + Foundational → Extension created
2. User Story 1 → Apply color works → **MVP Ready!**
3. User Story 2 → Visual feedback works → Enhanced UX
4. User Story 3 → Dynamic updates verified → Feature complete
5. Polish → Quality validated → Production ready

### Estimated Effort

| Phase        | Tasks  | Lines of Code    |
| ------------ | ------ | ---------------- |
| Setup        | 2      | 0 (verification) |
| Foundational | 4      | ~40 lines        |
| User Story 1 | 11     | ~15 lines        |
| User Story 2 | 4      | ~5 lines         |
| User Story 3 | 4      | 0 (validation)   |
| Polish       | 8      | 0 (testing)      |
| **Total**    | **33** | **~55 lines**    |

---

## Notes

- No new dependencies required - all packages already installed
- No database changes - HTML stored in existing content field
- No API changes - uses existing page content endpoints
- CSS variables handle theme color updates automatically
- Feature is purely additive - no breaking changes to existing functionality
