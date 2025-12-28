# Tasks: Loader Background Color Configuration

**Input**: Design documents from `/specs/051-loader-bgcolor-config/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in the feature specification. Test tasks are excluded.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and domain layer setup

- [x] T001 Add LOADER_BACKGROUND_COLOR constant to `src/domain/settings/constants/SettingKeys.ts`
- [x] T002 [P] Create LoaderBackgroundColor value object in `src/domain/settings/value-objects/LoaderBackgroundColor.ts`
- [x] T003 Add createLoaderBackgroundColor factory method to `src/domain/settings/entities/WebsiteSetting.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create GetLoaderBackgroundColor use case in `src/application/settings/use-cases/GetLoaderBackgroundColor.ts`
- [x] T005 [P] Create SetLoaderBackgroundColor use case in `src/application/settings/use-cases/SetLoaderBackgroundColor.ts`
- [x] T006 Create admin API endpoint GET/PUT/DELETE in `src/app/api/settings/loader-background-color/route.ts`
- [x] T007 [P] Create public API endpoint GET in `src/app/api/public/loader-background-color/route.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Configure Loader Background Color (Priority: P1) 🎯 MVP

**Goal**: Allow administrators to set a custom background color for loading screens

**Independent Test**: Access admin settings, select a background color, save it, verify the loading screen displays with the configured color

### Implementation for User Story 1

- [x] T008 [P] [US1] Create LoaderBackgroundColorContext provider in `src/presentation/shared/contexts/LoaderBackgroundColorContext.tsx`
- [x] T009 [P] [US1] Create useLoaderBackgroundColor hook in `src/presentation/shared/hooks/useLoaderBackgroundColor.ts`
- [x] T010 [US1] Create LoaderBackgroundColorSelector component in `src/presentation/admin/components/LoaderBackgroundColorSelector.tsx`
- [x] T011 [US1] Integrate LoaderBackgroundColorSelector into admin settings page (WebsiteSettingsForm.tsx)
- [x] T012 [US1] Update PublicPageLoader to accept and apply loaderBackgroundColor prop in `src/presentation/shared/components/PublicPageLoader.tsx`
- [x] T013 [US1] Update public page layout to fetch and pass loader background color to PublicPageLoader
- [x] T014 [US1] Verify French localization (all visible text in French: "Couleur de fond du chargement", etc.)
- [x] T015 [US1] Verify YAGNI, DRY, KISS compliance

**Checkpoint**: User Story 1 complete - admin can configure background color and it displays on loading screens

---

## Phase 4: User Story 2 - Preview Background Color Before Saving (Priority: P2)

**Goal**: Allow administrators to preview the background color before saving

**Independent Test**: Select a color, verify preview updates immediately, navigate away without saving, confirm live loading screen unchanged

### Implementation for User Story 2

- [x] T016 [US2] Add real-time preview display to LoaderBackgroundColorSelector in `src/presentation/admin/components/LoaderBackgroundColorSelector.tsx`
- [x] T017 [US2] Ensure preview state is local until save is triggered (no API call on color selection)
- [x] T018 [US2] Verify preview responsiveness and user feedback
- [x] T019 [US2] Verify French localization for preview labels ("Aperçu", etc.)

**Checkpoint**: User Story 2 complete - admin can preview colors before committing changes

---

## Phase 5: User Story 3 - Reset to Default Background Color (Priority: P3)

**Goal**: Allow administrators to reset the background color to the default value

**Independent Test**: Configure a custom color, click reset button, verify background returns to default (white for light mode, dark for dark mode)

### Implementation for User Story 3

- [x] T020 [US3] Add reset button to LoaderBackgroundColorSelector in `src/presentation/admin/components/LoaderBackgroundColorSelector.tsx`
- [x] T021 [US3] Implement DELETE endpoint handler in admin hook useLoaderBackgroundColor
- [x] T022 [US3] Verify reset displays correct default based on theme mode (light/dark)
- [x] T023 [US3] Verify French localization for reset button ("Réinitialiser", etc.)

**Checkpoint**: User Story 3 complete - admin can reset to default color

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final integration and configuration portability

- [x] T024 Increment package version to 1.1 in `src/domain/config/value-objects/PackageVersion.ts` for export/import compatibility
- [x] T025 Verify loader background color is included in configuration export (automatic via SettingKeys)
- [x] T026 Final code review for YAGNI, DRY, KISS compliance across all files
- [x] T027 Verify accessibility: proper contrast for light and dark modes
- [x] T028 Run quickstart.md validation - test all scenarios manually

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Depends on US1 (modifies same component) - Build on existing LoaderBackgroundColorSelector
- **User Story 3 (P3)**: Depends on US1 (modifies same component) - Add reset functionality to existing component

### Within Each Phase

- Tasks marked [P] can run in parallel (different files)
- Non-parallel tasks must be completed in order
- Complete each phase before moving to next

### Parallel Opportunities

**Phase 1 (Setup)**:

```bash
# T002 can run in parallel with T001
Task: "Add LOADER_BACKGROUND_COLOR constant"
Task: "Create LoaderBackgroundColor value object" [P]
```

**Phase 2 (Foundational)**:

```bash
# T005 and T007 can run in parallel
Task: "Create SetLoaderBackgroundColor use case" [P]
Task: "Create public API endpoint" [P]
```

**Phase 3 (User Story 1)**:

```bash
# T008 and T009 can run in parallel
Task: "Create LoaderBackgroundColorContext provider" [P]
Task: "Create useLoaderBackgroundColor admin hook" [P]
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (3 tasks)
2. Complete Phase 2: Foundational (4 tasks)
3. Complete Phase 3: User Story 1 (8 tasks)
4. **STOP and VALIDATE**: Test configuration saves and displays on loading screens
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → Test → Deploy (MVP: core configuration works!)
3. Add User Story 2 → Test → Deploy (Enhanced: preview before save)
4. Add User Story 3 → Test → Deploy (Complete: reset to default)
5. Polish → Final validation

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- User Stories 2 and 3 modify the same component as US1 - implement sequentially
- All visible text must be in French
- Reuse BackgroundColorSelector pattern for consistency
- No tests generated - not explicitly requested in spec
