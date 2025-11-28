# Tasks: Public Dark Mode Toggle

**Input**: Design documents from `/specs/007-public-dark-mode/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in the feature specification. Tests are omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Project**: Next.js App Router with `src/` at repository root
- **Components**: `src/presentation/shared/components/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify existing components and dependencies are in place

- [x] T001 Verify DarkModeToggle component exists at src/presentation/shared/components/DarkModeToggle.tsx
- [x] T002 Verify PublicHeaderMenu component exists at src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenu.tsx
- [x] T003 Verify useColorMode hook works with existing theme persistence

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: No foundational tasks needed - all required infrastructure already exists

**⚠️ NOTE**: This feature reuses existing components and theme persistence. No foundational work required.

**Checkpoint**: Foundation ready - user story implementation can begin

---

## Phase 3: User Story 1 - Toggle Dark Mode on Public Page (Priority: P1) 🎯 MVP

**Goal**: Add dark mode toggle button to the right side of public header menu

**Independent Test**: Navigate to any public page, click the toggle button in the header, verify theme switches between light and dark modes

### Implementation for User Story 1

- [x] T004 [US1] Import DarkModeToggle component in src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenu.tsx
- [x] T005 [US1] Modify Flex layout to use justify="space-between" in src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenu.tsx
- [x] T006 [US1] Add DarkModeToggle to right side of header with Box wrapper for colorPalette.contrast in src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenu.tsx
- [x] T007 [US1] Handle empty menu items case to show toggle even when no menu items configured in src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenu.tsx
- [x] T008 [US1] Verify contrast compliance for toggle button on theme-colored background
- [x] T009 [US1] Verify YAGNI compliance (reusing existing DarkModeToggle, no new components)
- [x] T010 [US1] Verify DRY compliance (no code duplication)
- [x] T011 [US1] Verify KISS compliance (simple layout modification only)

**Checkpoint**: Toggle button appears on right side of header and switches themes when clicked

---

## Phase 4: User Story 2 - Theme Persistence Across Pages (Priority: P2)

**Goal**: Ensure theme preference persists when navigating between public pages

**Independent Test**: Set a theme on one public page, navigate to another public page, verify selected theme is maintained

### Implementation for User Story 2

- [x] T012 [US2] Verify existing next-themes/localStorage persistence works with new toggle position
- [x] T013 [US2] Test navigation between multiple public pages to confirm persistence

**Checkpoint**: Theme persists across all public page navigations

---

## Phase 5: User Story 3 - Consistent Visual Appearance with Admin Toggle (Priority: P3)

**Goal**: Toggle button looks and behaves identically to admin dashboard toggle

**Independent Test**: Compare toggle appearance and behavior on public page against admin dashboard

### Implementation for User Story 3

- [x] T014 [US3] Verify toggle uses same icons (LuSun/LuMoon) as admin dashboard toggle
- [x] T015 [US3] Verify toggle uses same size and variant as admin dashboard toggle
- [x] T016 [US3] Verify ARIA attributes and keyboard navigation work identically

**Checkpoint**: Toggle appearance and behavior matches admin dashboard toggle

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and verification

- [x] T017 Verify toggle button visible on all viewport sizes (mobile, tablet, desktop)
- [x] T018 Verify keyboard navigation works (Tab to button, Enter/Space to toggle)
- [x] T019 Verify screen reader accessibility with appropriate ARIA labels
- [x] T020 Run quickstart.md validation checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - verification only
- **Foundational (Phase 2)**: N/A - no foundational tasks
- **User Story 1 (Phase 3)**: Depends on Setup verification
- **User Story 2 (Phase 4)**: Depends on User Story 1 completion
- **User Story 3 (Phase 5)**: Can run in parallel with User Story 2
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies - core implementation
- **User Story 2 (P2)**: Depends on US1 (toggle must exist to test persistence)
- **User Story 3 (P3)**: Depends on US1 (toggle must exist to compare appearance)

### Within Each User Story

- Layout modification (T004-T007) must be sequential (same file)
- Verification tasks (T008-T011) can be done in parallel after implementation

### Parallel Opportunities

- T014, T015, T016 (US3 verification) can run in parallel with T012, T013 (US2 verification)
- T017, T018, T019 (Polish tasks) can run in parallel after all stories complete

---

## Parallel Example: User Story 3 Verification

```bash
# Launch all verification tasks for User Story 3 together:
Task: "Verify toggle uses same icons (LuSun/LuMoon) as admin dashboard toggle"
Task: "Verify toggle uses same size and variant as admin dashboard toggle"
Task: "Verify ARIA attributes and keyboard navigation work identically"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (verify existing components)
2. Skip Phase 2: Foundational (not needed)
3. Complete Phase 3: User Story 1 (T004-T011)
4. **STOP and VALIDATE**: Test toggle appears and works
5. Deploy/demo if ready - users can now toggle dark mode!

### Incremental Delivery

1. Complete Setup → Components verified
2. Add User Story 1 → Toggle works → Deploy (MVP!)
3. Add User Story 2 → Persistence verified → Deploy
4. Add User Story 3 → Visual consistency verified → Deploy
5. Polish → Accessibility and responsiveness verified → Final Deploy

### Single Developer Strategy

This is a small feature - recommended approach:

1. Complete all tasks in sequence (T001-T020)
2. Primary work is in a single file (PublicHeaderMenu.tsx)
3. Most tasks are verification rather than implementation
4. Expected completion time: 1-2 hours

---

## Notes

- This feature requires minimal implementation - only PublicHeaderMenu.tsx needs modification
- All 3 user stories share the same implementation (T004-T007)
- User Stories 2 and 3 are primarily verification of existing behavior
- DarkModeToggle component is reused as-is (no modifications needed)
- Theme persistence is handled by existing next-themes integration
