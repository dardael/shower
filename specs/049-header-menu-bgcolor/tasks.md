# Tasks: Extended Color Palette Options

**Input**: Design documents from `/specs/049-header-menu-bgcolor/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Not requested - no test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: No setup required - extending existing infrastructure only

_No tasks in this phase - existing project structure is used._

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add new color tokens to shared constants that both user stories depend on

**⚠️ CRITICAL**: User story work cannot begin until foundation is complete

- [x] T001 Add color tokens `gold`, `sand`, `taupe`, `white` to THEME_COLOR_PALETTE array in `src/domain/settings/constants/ThemeColorPalette.ts`
- [x] T002 Add color definitions for `gold`, `sand`, `taupe`, `white` with full variant set (solid, muted, subtle, fg, contrast, border) in `src/presentation/shared/theme.ts`

**Checkpoint**: Foundation ready - color tokens exist, user story implementation can now begin

---

## Phase 3: User Story 1 - Extended Header Menu Background Color Options (Priority: P1) 🎯 MVP

**Goal**: Add colors #eeb252 (gold) and #f2e8de (sand) to the header menu color configuration

**Independent Test**: Navigate to admin settings → Theme color selector, verify `gold` and `sand` colors appear alongside existing options, select one, save, verify it applies to header menu on public website

### Implementation for User Story 1

- [x] T003 [P] [US1] Add `gold: '#eeb252'` to CUSTOM_COLOR_DISPLAY in `src/presentation/admin/components/ThemeColorSelector.tsx`
- [x] T004 [P] [US1] Add `sand: '#f2e8de'` to CUSTOM_COLOR_DISPLAY in `src/presentation/admin/components/ThemeColorSelector.tsx`
- [x] T005 [P] [US1] Add `gold: { light: '#eeb252', dark: '#8b6914' }` to BACKGROUND_COLOR_MAP in `src/presentation/shared/components/ui/provider.tsx`
- [x] T006 [P] [US1] Add `sand: { light: '#f2e8de', dark: '#4a4238' }` to BACKGROUND_COLOR_MAP in `src/presentation/shared/components/ui/provider.tsx`
- [x] T007 [US1] Verify gold and sand colors display correctly in ThemeColorSelector UI
- [x] T008 [US1] Verify contrast compliance for gold and sand in light and dark modes

**Checkpoint**: User Story 1 complete - gold and sand colors available for header menu configuration

---

## Phase 4: User Story 2 - Extended Website Background Color Options (Priority: P1)

**Goal**: Add colors #e2cbac (taupe) and #ffffff (white) to the website background color configuration

**Independent Test**: Navigate to admin settings → Background color selector, verify `taupe` and `white` colors appear alongside existing options, select one, save, verify it applies to public website background

### Implementation for User Story 2

- [x] T009 [P] [US2] Add `taupe: '#e2cbac'` to CUSTOM_COLOR_DISPLAY in `src/presentation/admin/components/ThemeColorSelector.tsx`
- [x] T010 [P] [US2] Add `white: '#ffffff'` to CUSTOM_COLOR_DISPLAY in `src/presentation/admin/components/ThemeColorSelector.tsx`
- [x] T011 [P] [US2] Add `taupe: { light: '#e2cbac', dark: '#5c4d3a' }` to BACKGROUND_COLOR_MAP in `src/presentation/shared/components/ui/provider.tsx`
- [x] T012 [P] [US2] Add `white: { light: '#ffffff', dark: '#1a1a1a' }` to BACKGROUND_COLOR_MAP in `src/presentation/shared/components/ui/provider.tsx`
- [x] T013 [US2] Verify taupe and white colors display correctly in BackgroundColorSelector UI
- [x] T014 [US2] Verify contrast compliance for taupe and white in light and dark modes

**Checkpoint**: User Story 2 complete - taupe and white colors available for background configuration

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across all new colors

- [x] T015 Verify all 4 new colors persist correctly after save and page refresh
- [x] T016 Verify existing color selections remain functional and unaffected
- [x] T017 Verify YAGNI compliance (minimal implementation for current requirements only)
- [x] T018 Verify DRY compliance (no code duplication across color additions)
- [x] T019 Verify KISS compliance (simple, readable code)
- [x] T020 Run quickstart.md validation steps

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 2)**: No dependencies - can start immediately
- **User Story 1 (Phase 3)**: Depends on Foundational (T001, T002) completion
- **User Story 2 (Phase 4)**: Depends on Foundational (T001, T002) completion
- **Polish (Phase 5)**: Depends on both User Stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on User Story 2
- **User Story 2 (P1)**: Can start after Foundational - No dependencies on User Story 1
- **Both stories can run in parallel** after Foundational is complete

### Within Each User Story

- CUSTOM_COLOR_DISPLAY and BACKGROUND_COLOR_MAP entries can be added in parallel
- Verification tasks (T007, T008, T013, T014) must wait for implementation tasks

### Parallel Opportunities

- T003, T004, T005, T006 can all run in parallel (different entries, same files but independent additions)
- T009, T010, T011, T012 can all run in parallel
- User Story 1 and User Story 2 can run in parallel after Foundational phase

---

## Parallel Example: Both User Stories

```bash
# After Foundational (T001, T002) completes:

# Launch User Story 1 implementation in parallel:
Task: "Add gold to CUSTOM_COLOR_DISPLAY in ThemeColorSelector.tsx"
Task: "Add sand to CUSTOM_COLOR_DISPLAY in ThemeColorSelector.tsx"
Task: "Add gold to BACKGROUND_COLOR_MAP in provider.tsx"
Task: "Add sand to BACKGROUND_COLOR_MAP in provider.tsx"

# Simultaneously, launch User Story 2 implementation:
Task: "Add taupe to CUSTOM_COLOR_DISPLAY in ThemeColorSelector.tsx"
Task: "Add white to CUSTOM_COLOR_DISPLAY in ThemeColorSelector.tsx"
Task: "Add taupe to BACKGROUND_COLOR_MAP in provider.tsx"
Task: "Add white to BACKGROUND_COLOR_MAP in provider.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (T001, T002)
2. Complete Phase 3: User Story 1 (T003-T008)
3. **STOP and VALIDATE**: Test gold/sand colors independently
4. Header menu colors available - deploy if ready

### Incremental Delivery

1. Complete Foundational → Color tokens defined
2. Add User Story 1 → Test independently → Gold/Sand available for header menu
3. Add User Story 2 → Test independently → Taupe/White available for background
4. Each story adds value without breaking previous stories

### Single Developer Strategy

1. Complete Foundational (T001, T002)
2. Complete User Story 1 in priority order
3. Complete User Story 2
4. Run Polish validation

---

## Notes

- [P] tasks = different entries, can be added simultaneously
- [Story] label maps task to specific user story for traceability
- Each user story is independently testable after Foundational phase
- No new API endpoints or database changes required
- All changes are additive to existing color infrastructure
