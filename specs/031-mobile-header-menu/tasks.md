# Tasks: Mobile Header Menu for Public Side

**Input**: Design documents from `/specs/031-mobile-header-menu/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.md, quickstart.md

**Tests**: No tests requested in feature specification. Testing checklist provided in quickstart.md for manual validation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify existing dependencies and project structure

- [x] T001 Verify existing components are in place: FocusTrap, PublicHeaderMenuItem, DarkModeToggle, useThemeColor in src/presentation/shared/

**Checkpoint**: Setup verified - ready for component creation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create new components that will be used by multiple user stories

**⚠️ CRITICAL**: User story integration cannot begin until these components exist

- [x] T002 [P] Create MobileMenuToggle component with hamburger icon (FiMenu), 44x44px touch target, aria-label, colorPalette prop in src/presentation/shared/components/PublicHeaderMenu/MobileMenuToggle.tsx
- [x] T003 [P] Create MobileMenuDrawer component shell with props interface (isOpen, onClose, menuItems, colorPalette) in src/presentation/shared/components/PublicHeaderMenu/MobileMenuDrawer.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Mobile Navigation Access (Priority: P1) 🎯 MVP

**Goal**: Display hamburger icon on mobile that opens navigation drawer with menu items

**Independent Test**: Visit public site on mobile viewport (< 768px), tap hamburger, verify drawer opens with menu items, tap item to navigate

### Implementation for User Story 1

- [x] T004 [US1] Add useState for isOpen and useBreakpointValue for mobile detection in src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenu.tsx
- [x] T005 [US1] Implement drawer panel with fixed position, right-side slide, 280px width, 300ms CSS transition in src/presentation/shared/components/PublicHeaderMenu/MobileMenuDrawer.tsx
- [x] T006 [US1] Add vertical menu items list using PublicHeaderMenuItem with onClose callback on item click in src/presentation/shared/components/PublicHeaderMenu/MobileMenuDrawer.tsx
- [x] T007 [US1] Conditionally render MobileMenuToggle on mobile (isMobile && ...) in src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenu.tsx
- [x] T008 [US1] Wire toggle onClick to set isOpen true, pass isOpen and onClose to MobileMenuDrawer in src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenu.tsx
- [x] T009 [US1] Handle empty menu state with "No menu items configured" message in src/presentation/shared/components/PublicHeaderMenu/MobileMenuDrawer.tsx
- [x] T010 [US1] Verify theme color applies correctly via colorPalette prop in MobileMenuToggle and MobileMenuDrawer
- [x] T011 [US1] Verify YAGNI compliance (minimal implementation for current requirements only)
- [x] T012 [US1] Verify DRY compliance (reusing existing components, no duplication)
- [x] T013 [US1] Verify KISS compliance (simple overlay pattern, local state)

**Checkpoint**: User Story 1 complete - hamburger icon visible on mobile, opens drawer with menu items

---

## Phase 4: User Story 2 - Desktop Menu Preservation (Priority: P1)

**Goal**: Preserve full horizontal menu on desktop/tablet viewports

**Independent Test**: Visit public site on desktop viewport (>= 768px), verify horizontal menu visible, no hamburger icon

### Implementation for User Story 2

- [x] T014 [US2] Conditionally render horizontal menu items only when !isMobile in src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenu.tsx
- [x] T015 [US2] Ensure DarkModeToggle remains visible on desktop in horizontal menu area in src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenu.tsx
- [x] T016 [US2] Verify hamburger icon hidden on desktop (no display when !isMobile)
- [x] T017 [US2] Verify contrast compliance for light and dark modes on desktop menu
- [x] T018 [US2] Verify consistent theme color usage on desktop menu

**Checkpoint**: User Story 2 complete - desktop shows full horizontal menu, no hamburger

---

## Phase 5: User Story 3 - Mobile Menu Dismissal (Priority: P2)

**Goal**: Allow closing mobile menu via close button, backdrop click, and Escape key

**Independent Test**: Open mobile menu, verify close via X button, backdrop click, and Escape key all work

### Implementation for User Story 3

- [x] T019 [US3] Add close button (FiX icon) with 44x44px touch target, aria-label at top of drawer in src/presentation/shared/components/PublicHeaderMenu/MobileMenuDrawer.tsx
- [x] T020 [US3] Add backdrop overlay with blackAlpha.600 background, onClick={onClose} in src/presentation/shared/components/PublicHeaderMenu/MobileMenuDrawer.tsx
- [x] T021 [US3] Add useEffect for Escape key handler to call onClose in src/presentation/shared/components/PublicHeaderMenu/MobileMenuDrawer.tsx
- [x] T022 [US3] Wrap drawer content with FocusTrap utility for accessibility in src/presentation/shared/components/PublicHeaderMenu/MobileMenuDrawer.tsx
- [x] T023 [US3] Add useEffect to auto-close drawer when viewport resizes to >= 768px in src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenu.tsx
- [x] T024 [US3] Add ARIA attributes (role="dialog", aria-modal="true", aria-label) to drawer in src/presentation/shared/components/PublicHeaderMenu/MobileMenuDrawer.tsx
- [x] T025 [US3] Verify contrast compliance for close button in light and dark modes

**Checkpoint**: User Story 3 complete - drawer can be dismissed via multiple methods

---

## Phase 6: User Story 4 - Logo Visibility on Mobile (Priority: P2)

**Goal**: Display logo in mobile header with home navigation

**Independent Test**: View mobile header, verify logo visible next to hamburger, tap logo navigates home

### Implementation for User Story 4

- [x] T026 [US4] Ensure logo renders in mobile header layout alongside hamburger toggle in src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenu.tsx
- [x] T027 [US4] Verify logo maintains responsive sizing (base: 32px, md: 40px) on mobile in src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenu.tsx
- [x] T028 [US4] Verify logo home navigation link works on mobile
- [x] T029 [US4] Include DarkModeToggle at bottom of mobile drawer in src/presentation/shared/components/PublicHeaderMenu/MobileMenuDrawer.tsx
- [x] T030 [US4] Verify visual consistency between mobile and desktop header (logo, colors, theme)

**Checkpoint**: User Story 4 complete - logo visible and functional on mobile

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [x] T031 Handle long menu item text with textOverflow: 'ellipsis' and whiteSpace: 'nowrap' in MobileMenuDrawer
- [x] T032 Verify z-index layering (backdrop: 1000, drawer: 1001) matches AdminSidebar pattern
- [x] T033 Run quickstart.md testing checklist validation
- [x] T034 Code cleanup: remove any unused imports or commented code
- [x] T035 Verify all touch targets are minimum 44x44px across both components

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - verification only
- **Foundational (Phase 2)**: Can start immediately - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 and US2 are both P1 - can proceed in parallel
  - US3 and US4 are both P2 - can proceed in parallel after P1 stories
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on T002, T003 (foundational components)
- **User Story 2 (P1)**: Depends on T002, T003 - can run in parallel with US1
- **User Story 3 (P2)**: Depends on US1 completion (drawer must exist)
- **User Story 4 (P2)**: Depends on US1 completion (mobile layout must exist)

### Within Each User Story

- Component structure before behavior
- Core functionality before edge cases
- Accessibility after core functionality
- Validation tasks last

### Parallel Opportunities

- **Foundational**: T002 and T003 can run in parallel (different files)
- **US1 + US2**: Can be worked on simultaneously (different aspects of same component)
- **US3 + US4**: Can be worked on simultaneously after US1 is complete

---

## Parallel Example: Foundational Phase

```bash
# Launch both component shells in parallel:
Task: "Create MobileMenuToggle component in src/presentation/shared/components/PublicHeaderMenu/MobileMenuToggle.tsx"
Task: "Create MobileMenuDrawer component shell in src/presentation/shared/components/PublicHeaderMenu/MobileMenuDrawer.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 2)

1. Complete Phase 1: Setup verification
2. Complete Phase 2: Foundational components
3. Complete Phase 3: User Story 1 (Mobile Navigation Access)
4. Complete Phase 4: User Story 2 (Desktop Menu Preservation)
5. **STOP and VALIDATE**: Test mobile hamburger and desktop horizontal menu
6. Deploy/demo if ready - core responsive functionality complete

### Incremental Delivery

1. Setup + Foundational → Component shells ready
2. Add US1 + US2 → Mobile/desktop responsive toggle works → MVP!
3. Add US3 → Menu dismissal methods complete
4. Add US4 → Logo visibility on mobile complete
5. Polish → Edge cases and cleanup

---

## Notes

- No tests included (not requested in specification)
- Uses existing FocusTrap, PublicHeaderMenuItem, DarkModeToggle, useThemeColor
- Follows AdminSidebar pattern for overlay, backdrop, and accessibility
- All new code in src/presentation/shared/components/PublicHeaderMenu/
- Total: 2 new files, 1 modified file
