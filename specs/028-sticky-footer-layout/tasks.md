# Tasks: Sticky Footer Layout

**Input**: Design documents from `/specs/028-sticky-footer-layout/`  
**Prerequisites**: plan.md, spec.md, research.md, quickstart.md

**Tests**: No tests requested in the feature specification.

**Organization**: Both user stories (P1) are solved by the same implementation change.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: No setup required - modifying existing component

> This feature requires no setup phase. The `PublicPageLayout` component and Chakra UI dependencies already exist.

**Checkpoint**: Ready to proceed directly to implementation.

---

## Phase 2: Foundational

**Purpose**: No foundational work required

> This feature has no blocking prerequisites. The Chakra UI `Flex` and `Box` components are already available in the project.

**Checkpoint**: Ready to proceed directly to user story implementation.

---

## Phase 3: User Story 1 - Footer Stays at Bottom on Short Pages (Priority: P1) 🎯 MVP

**Goal**: Ensure the footer remains anchored at the bottom of the viewport when page content is shorter than the viewport height.

**Independent Test**: Create or view a page with minimal content (one paragraph) and verify the footer appears at the viewport bottom, not immediately after the content.

### Implementation for User Story 1

- [x] T001 [US1] Add Flex import to src/presentation/shared/components/PublicPageLayout/PublicPageLayout.tsx
- [x] T002 [US1] Wrap layout content in Flex container with direction="column" and minH="100vh" in src/presentation/shared/components/PublicPageLayout/PublicPageLayout.tsx
- [x] T003 [US1] Wrap main content Container in Box with flex="1" in src/presentation/shared/components/PublicPageLayout/PublicPageLayout.tsx
- [x] T004 [US1] Verify footer positioning on short content pages (manual test)
- [x] T005 [US1] Verify footer flows naturally on long content pages (manual test)
- [x] T006 [US1] Verify layout on mobile viewport (320px width)
- [x] T007 [US1] Verify layout on desktop viewport (1920px width)

**Checkpoint**: Footer should be at viewport bottom on short pages, flow naturally on long pages.

---

## Phase 4: User Story 2 - Full-Page Background Color (Priority: P1)

**Goal**: Ensure the configured background color extends from the header to the bottom of the viewport with no gaps.

**Independent Test**: Configure a background color in admin settings and verify it fills the entire visible area from header to footer on any page length.

### Implementation for User Story 2

> **Note**: User Story 2 is automatically satisfied by User Story 1's implementation. The `minH="100vh"` on the Flex wrapper ensures the layout fills the viewport, allowing the body background color (applied by existing `BackgroundColorApplier`) to be visible throughout.

- [x] T008 [US2] Verify background color fills entire viewport on short content pages (manual test)
- [x] T009 [US2] Verify background color consistency on long scrolling pages (manual test)
- [x] T010 [US2] Verify background color in light mode
- [x] T011 [US2] Verify background color in dark mode

**Checkpoint**: Background color should fill from header to footer with no white gaps.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across both user stories

- [x] T012 Verify YAGNI compliance - only Flex wrapper and flex="1" added, no extra code
- [x] T013 Verify DRY compliance - no code duplication introduced
- [x] T014 Verify KISS compliance - standard flexbox pattern, simple readable code
- [x] T015 Run quickstart.md validation checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Skipped - no setup required
- **Foundational (Phase 2)**: Skipped - no prerequisites
- **User Story 1 (Phase 3)**: Can start immediately
- **User Story 2 (Phase 4)**: Verification only - depends on US1 completion
- **Polish (Phase 5)**: Depends on US1 and US2 completion

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies - start immediately
- **User Story 2 (P1)**: Implemented by US1, verification tasks depend on US1 completion

### Task Dependencies Within User Story 1

```
T001 (add import)
  ↓
T002 (add Flex wrapper)
  ↓
T003 (add Box flex="1")
  ↓
T004-T007 (verification - can run in parallel)
```

---

## Parallel Opportunities

### Within User Story 1 Verification

```bash
# After T003 completes, run all verification tasks in parallel:
T004: Verify footer on short pages
T005: Verify footer on long pages
T006: Verify mobile viewport
T007: Verify desktop viewport
```

### Within User Story 2 Verification

```bash
# All US2 verification tasks can run in parallel:
T008: Verify background on short pages
T009: Verify background on long pages
T010: Verify light mode
T011: Verify dark mode
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete T001-T003 (code changes)
2. Complete T004-T007 (verification)
3. **STOP and VALIDATE**: Footer should be sticky on short pages
4. Deploy/demo if ready

### Full Implementation

1. Complete User Story 1 (T001-T007)
2. Complete User Story 2 verification (T008-T011)
3. Complete Polish phase (T012-T015)
4. Feature complete

---

## Notes

- This is a minimal CSS-only change to a single file
- Both user stories are solved by the same code change
- No new files created, no dependencies added
- Manual verification required (no automated tests requested)
- Total implementation: ~5 lines of code changes
