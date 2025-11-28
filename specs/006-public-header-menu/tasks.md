# Tasks: Public Header Menu

**Input**: Design documents from `/specs/006-public-header-menu/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: No tests requested in feature specification. Tests will not be included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Project type**: Next.js App Router (single project with `src/` at repository root)
- **Components**: `src/presentation/shared/components/`
- **API routes**: `src/app/api/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create component directory structure and TypeScript interfaces

- [x] T001 Create PublicHeaderMenu directory at src/presentation/shared/components/PublicHeaderMenu/
- [x] T002 [P] Create TypeScript interfaces in src/presentation/shared/components/PublicHeaderMenu/types.ts
- [x] T003 [P] Create barrel export in src/presentation/shared/components/PublicHeaderMenu/index.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create public API endpoint that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create public menu API endpoint in src/app/api/public/menu/route.ts following social-networks pattern

**Checkpoint**: API foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - View Header Menu on Public Site (Priority: P1) 🎯 MVP

**Goal**: Display header menu with all admin-configured menu items in correct order

**Independent Test**: Visit public homepage and verify header menu displays all menu items in configured order

### Implementation for User Story 1

- [x] T005 [US1] Create usePublicHeaderMenu hook in src/presentation/shared/components/PublicHeaderMenu/usePublicHeaderMenu.ts
- [x] T006 [US1] Create PublicHeaderMenuItem component in src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenuItem.tsx
- [x] T007 [US1] Create PublicHeaderMenu component in src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenu.tsx
- [x] T008 [US1] Create PublicHeaderMenuContainer component in src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenuContainer.tsx
- [x] T009 [US1] Update barrel export in src/presentation/shared/components/PublicHeaderMenu/index.ts
- [x] T010 [US1] Integrate PublicHeaderMenuContainer into root layout at src/app/layout.tsx
- [x] T011 [US1] Handle empty menu state gracefully in PublicHeaderMenu component
- [x] T012 [US1] Handle API error state gracefully in PublicHeaderMenuContainer component

**Checkpoint**: User Story 1 complete - header menu displays items in correct order, handles empty/error states

---

## Phase 4: User Story 2 - Theme Color Applied to Header (Priority: P2)

**Goal**: Header menu uses configured theme color for accent styling

**Independent Test**: Set theme color in admin and verify header uses that color on public site

### Implementation for User Story 2

- [x] T013 [US2] Add theme color integration using useThemeColor hook in PublicHeaderMenuContainer at src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenuContainer.tsx
- [x] T014 [US2] Apply colorPalette prop to PublicHeaderMenu component for theme-based styling at src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenu.tsx
- [x] T015 [US2] Verify theme color is correctly passed to PublicHeaderMenuItem component at src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenuItem.tsx

**Checkpoint**: User Story 2 complete - header menu displays with admin-configured theme color

---

## Phase 5: User Story 3 - Dark Mode Support in Header (Priority: P3)

**Goal**: Header menu adapts to light and dark mode with appropriate colors and contrast

**Independent Test**: Toggle between light and dark mode and verify header readability in both modes

### Implementation for User Story 3

- [x] T016 [US3] Apply semantic color tokens (bg.subtle, fg, border) for light/dark mode support in PublicHeaderMenu at src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenu.tsx
- [x] T017 [US3] Ensure PublicHeaderMenuItem uses semantic tokens for text color at src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenuItem.tsx
- [x] T018 [US3] Verify contrast compliance for text and UI elements in both light and dark modes

**Checkpoint**: User Story 3 complete - header is readable and visually consistent in both light and dark modes

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and code quality checks

- [x] T019 Verify YAGNI compliance (no navigation, no mobile responsive, no icons, no dropdowns)
- [x] T020 Verify DRY compliance (reuses existing patterns from SocialNetworksFooter)
- [x] T021 Verify KISS compliance (simple Box/Flex/Text components, straightforward data fetching)
- [x] T022 Run quickstart.md validation (test all scenarios listed)
- [x] T023 Run linting and formatting with docker compose run --rm app npm run lint

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Depends on User Story 1 (builds on existing components) - Enhances theme styling
- **User Story 3 (P3)**: Depends on User Story 2 (builds on theme integration) - Adds dark mode support

### Within Each User Story

- Hook before components (T005 before T006-T008)
- Child components before parent (T006 before T007, T007 before T008)
- Container before layout integration (T008 before T010)

### Parallel Opportunities

**Phase 1 Setup**:

```bash
# Launch in parallel:
Task T002: "Create TypeScript interfaces in src/presentation/shared/components/PublicHeaderMenu/types.ts"
Task T003: "Create barrel export in src/presentation/shared/components/PublicHeaderMenu/index.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004)
3. Complete Phase 3: User Story 1 (T005-T012)
4. **STOP and VALIDATE**: Test header menu displays items in correct order
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → API and structure ready
2. Add User Story 1 → Test menu display → Deploy (MVP!)
3. Add User Story 2 → Test theme color → Deploy
4. Add User Story 3 → Test dark mode → Deploy
5. Each story adds visual enhancement without breaking previous stories

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- No test tasks included (not requested in specification)
- Pattern reference: SocialNetworksFooter at src/presentation/shared/components/SocialNetworksFooter/
- API pattern reference: src/app/api/public/social-networks/route.ts
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
