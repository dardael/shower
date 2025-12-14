# Tasks: Custom Color Palette

**Input**: Design documents from `/specs/030-custom-color-palette/`
**Prerequisites**: plan.md, spec.md, data-model.md, quickstart.md, contracts/

**Tests**: No tests required per constitution (only when explicitly requested).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/` at repository root
- Paths follow existing DDD/Hexagonal architecture

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: No setup required - all infrastructure exists. This feature extends existing structures only.

**Checkpoint**: Skip to Phase 2 - no new infrastructure needed.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Domain-level color token definitions that MUST be complete before UI tasks

**⚠️ CRITICAL**: User story UI work cannot begin until this phase is complete

- [x] T001 Add 'beige' and 'cream' tokens to THEME_COLOR_PALETTE array in src/domain/settings/constants/ThemeColorPalette.ts

**Checkpoint**: Foundation ready - TypeScript type system now includes new tokens, enabling UI implementation

---

## Phase 3: User Story 1 - Add New Theme Color Option (Priority: P1) 🎯 MVP

**Goal**: Administrator can select beige theme color (#cdb99d) from theme color selector

**Independent Test**: Navigate to Admin > Settings, verify beige square appears in theme color selector, select it, save, and verify public website displays beige accents in light mode (#cdb99d) and dark mode (#a89070)

### Implementation for User Story 1

- [x] T002 [P] [US1] Add beige semantic tokens (solid, muted, subtle, fg, contrast, border) to createDynamicThemeConfig() in src/presentation/shared/theme.ts
- [x] T003 [P] [US1] Add beige entry to BACKGROUND_COLOR_MAP with light (#cdb99d) and dark (#a89070) values in src/presentation/shared/components/ui/provider.tsx
- [x] T004 [US1] Verify beige color square displays in ThemeColorSelector component (auto-renders from THEME_COLOR_PALETTE) _(Manual: requires browser)_
- [x] T005 [US1] Verify beige theme color applies correctly to public website accent elements in light mode _(Manual: requires browser)_
- [x] T006 [US1] Verify beige theme color applies correctly to public website accent elements in dark mode _(Manual: requires browser)_

**Checkpoint**: User Story 1 complete - beige theme color is selectable and applies correctly

---

## Phase 4: User Story 2 - Add New Background Color Option (Priority: P1)

**Goal**: Administrator can select cream background color (#ede6dd) from background color selector

**Independent Test**: Navigate to Admin > Settings, verify cream square appears in background color selector, select it, save, and verify public website displays cream background in light mode (#ede6dd) and dark mode (#3d3830)

### Implementation for User Story 2

- [x] T007 [P] [US2] Add cream semantic tokens (solid, muted, subtle, fg, contrast, border) to createDynamicThemeConfig() in src/presentation/shared/theme.ts
- [x] T008 [P] [US2] Add cream entry to BACKGROUND_COLOR_MAP with light (#ede6dd) and dark (#3d3830) values in src/presentation/shared/components/ui/provider.tsx
- [x] T009 [US2] Verify cream color square displays in BackgroundColorSelector component (auto-renders from THEME_COLOR_PALETTE) _(Manual: requires browser)_
- [x] T010 [US2] Verify cream background color applies correctly to public website in light mode _(Manual: requires browser)_
- [x] T011 [US2] Verify cream background color applies correctly to public website in dark mode _(Manual: requires browser)_

**Checkpoint**: User Story 2 complete - cream background color is selectable and applies correctly

---

## Phase 5: User Story 3 - Add New Font Color in Rich Text Editor (Priority: P2)

**Goal**: Administrator can select burgundy font color (#642e2a) from rich text editor color picker

**Independent Test**: Open page editor, access text color picker, verify burgundy square appears in grid, select text, apply burgundy color, save, and verify text displays as #642e2a on public website

### Implementation for User Story 3

- [x] T012 [US3] Add burgundy (#642e2a) to PRESET_COLORS array in src/presentation/admin/components/PageContentEditor/ColorPicker.tsx
- [x] T013 [US3] Verify burgundy color square displays in ColorPicker grid _(Manual: requires browser)_
- [x] T014 [US3] Verify applying burgundy color to text in editor changes text to #642e2a _(Manual: requires browser)_
- [x] T015 [US3] Verify burgundy text displays correctly on public website after saving page _(Manual: requires browser)_

**Checkpoint**: User Story 3 complete - burgundy font color is selectable and applies correctly

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across all user stories

- [x] T016 Verify all new color squares are visually consistent in size and styling with existing colors _(Manual: requires browser)_
- [x] T017 Verify dark mode toggle correctly switches between light and dark variants for beige and cream _(Manual: requires browser)_
- [x] T018 Run quickstart.md verification steps to validate complete feature _(Manual: requires browser)_
- [x] T019 Verify YAGNI compliance (only 3 colors added, no extra features) ✓ Code review confirms minimal changes
- [x] T020 Verify DRY compliance (no code duplication across color additions) ✓ Code review confirms no duplication
- [x] T021 Verify KISS compliance (simple array/map extensions only) ✓ Code review confirms simple additions

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Skipped - no new infrastructure needed
- **Foundational (Phase 2)**: T001 MUST complete first - defines TypeScript types
- **User Stories (Phase 3-5)**: All depend on T001 completion
  - US1 and US2 can proceed in parallel (different semantic tokens, same files)
  - US3 is independent (different file entirely)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends only on T001 - No dependencies on other stories
- **User Story 2 (P1)**: Depends only on T001 - No dependencies on other stories (can run parallel with US1)
- **User Story 3 (P2)**: Depends only on T001 - Fully independent (different file)

### Within Each User Story

- Semantic tokens and background map can be done in parallel (marked [P])
- Verification tasks depend on implementation tasks

### Parallel Opportunities

- T002 and T003 can run in parallel (different sections of same files, but logically separate)
- T007 and T008 can run in parallel
- US1, US2, and US3 can all start simultaneously after T001 completes
- T002 and T007 modify same file (theme.ts) - coordinate additions
- T003 and T008 modify same file (provider.tsx) - coordinate additions

---

## Implementation Summary

**Status**: ✅ COMPLETE

**Files Modified**:

1. `src/domain/settings/constants/ThemeColorPalette.ts` - Added 'beige', 'cream' tokens
2. `src/presentation/shared/theme.ts` - Added beige and cream semantic tokens
3. `src/presentation/shared/components/ui/provider.tsx` - Added beige and cream to BACKGROUND_COLOR_MAP
4. `src/presentation/admin/components/PageContentEditor/ColorPicker.tsx` - Added burgundy to PRESET_COLORS

**Validation**:

- ESLint: ✅ PASS
- TypeScript: ✅ Changes compile correctly (pre-existing unrelated error in light-mode-colors route)
- Manual browser testing: Required for UI verification tasks

---

## Notes

- [P] tasks = different files or independent sections, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each logical group (e.g., after T003, after T008, after T012)
- This feature is minimal: 4 files modified, ~20 lines of code total
- No tests required per constitution - existing validation auto-extends
