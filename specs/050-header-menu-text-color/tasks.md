# Tasks: Header Menu Text Color Configuration

**Input**: Design documents from `/specs/050-header-menu-text-color/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.md, quickstart.md

**Tests**: Not explicitly requested in feature specification. Test tasks excluded per YAGNI principle.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add new setting key and value object to domain layer

- [x] T001 [P] Add `HEADER_MENU_TEXT_COLOR` key to `src/domain/settings/constants/SettingKeys.ts`
- [x] T002 [P] Create `HeaderMenuTextColor` value object in `src/domain/settings/value-objects/HeaderMenuTextColor.ts` following BackgroundColor.ts pattern with hex validation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 [P] Create `IGetHeaderMenuTextColor` interface in `src/application/settings/interfaces/IGetHeaderMenuTextColor.ts`
- [x] T004 [P] Create `IUpdateHeaderMenuTextColor` interface in `src/application/settings/interfaces/IUpdateHeaderMenuTextColor.ts`
- [x] T005 Create `GetHeaderMenuTextColor` use case in `src/application/settings/use-cases/GetHeaderMenuTextColor.ts` (depends on T003)
- [x] T006 Create `UpdateHeaderMenuTextColor` use case in `src/application/settings/use-cases/UpdateHeaderMenuTextColor.ts` (depends on T004)
- [x] T007 Create API route `GET/POST /api/settings/header-menu-text-color` in `src/app/api/settings/header-menu-text-color/route.ts` (depends on T005, T006)
- [x] T008 Create `HeaderMenuTextColorContext` with provider and hook in `src/presentation/shared/contexts/HeaderMenuTextColorContext.tsx` following ThemeColorContext.tsx pattern

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Configure Header Menu Text Color (Priority: P1) 🎯 MVP

**Goal**: Administrator can configure the text color of the header menu from the admin settings

**Independent Test**: Access admin settings, navigate to header menu settings section, select a text color using the color picker, save, and verify it persists on page refresh

### Implementation for User Story 1

- [x] T009 [US1] Create `HeaderMenuTextColorSelector` component in `src/presentation/admin/components/HeaderMenuTextColorSelector.tsx` following ThemeColorSelector.tsx pattern with French labels
- [x] T010 [US1] Add `HeaderMenuTextColorSelector` to website settings form (locate existing settings form and add the new selector in appropriate section)
- [x] T011 [US1] Add `HeaderMenuTextColorProvider` to admin layout provider hierarchy (wrap existing providers)
- [x] T012 [US1] Update `PublicHeaderMenu.tsx` in `src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenu.tsx` to consume `HeaderMenuTextColorContext` and replace hardcoded `color={{ base: 'black', _dark: 'white' }}` with dynamic color
- [x] T013 [US1] Add `HeaderMenuTextColorProvider` to public layout provider hierarchy
- [x] T014 [US1] Verify French localization: section title "Couleur du texte du menu", save button "Enregistrer", success toast "Couleur du texte enregistrée"
- [x] T015 [US1] Verify YAGNI compliance (minimal implementation for current requirements only)
- [x] T016 [US1] Verify DRY compliance (no code duplication, reuses existing patterns)
- [x] T017 [US1] Verify KISS compliance (simple, readable code following existing patterns)

**Checkpoint**: Administrator can configure and save header menu text color, and it displays on public site

---

## Phase 4: User Story 2 - Visual Preview of Text Color (Priority: P2)

**Goal**: Administrator sees a live preview of the text color before saving

**Independent Test**: Select different colors in the color picker and verify the preview updates in real-time without saving; navigate away and return to verify unsaved changes are discarded

### Implementation for User Story 2

- [x] T018 [US2] Enhance `HeaderMenuTextColorSelector` in `src/presentation/admin/components/HeaderMenuTextColorSelector.tsx` to show live preview of selected color (color swatch or text sample)
- [x] T019 [US2] Ensure unsaved color changes are discarded when navigating away (verify context resets to saved value)
- [x] T020 [US2] Verify preview updates immediately with no perceptible delay
- [x] T021 [US2] Verify YAGNI compliance (preview only, no advanced features)
- [x] T022 [US2] Verify DRY compliance (reuse existing preview patterns if available)

**Checkpoint**: Live preview works without auto-saving

---

## Phase 5: User Story 3 - Default Text Color Behavior (Priority: P3)

**Goal**: Header menu has a sensible default text color when none is configured

**Independent Test**: Access a fresh installation (or clear the setting) and verify the header menu text displays in a readable default color

### Implementation for User Story 3

- [x] T023 [US3] Verify default value `#000000` (black) is returned by `GetHeaderMenuTextColor` use case when no setting exists
- [x] T024 [US3] Verify `HeaderMenuTextColorSelector` shows current default color when no custom color is configured
- [x] T025 [US3] Handle edge case: if color value is corrupted/invalid, fall back to default in `HeaderMenuTextColor` value object
- [x] T026 [US3] Verify YAGNI compliance (single default, no theme-dependent defaults)
- [x] T027 [US3] Verify KISS compliance (simple fallback logic)

**Checkpoint**: Default behavior works correctly for new installations

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T028 [P] Verify configuration portability: ensure new `header-menu-text-color` setting is included in export/import system
- [x] T029 [P] Increment export file version if required for new setting key (not required - setting auto-included via VALID_SETTING_KEYS)
- [x] T030 Verify all header menu text elements (menu items, mobile menu, logo text if applicable) respect the configured color
- [x] T031 Run quickstart.md validation to ensure all implementation steps are complete

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can proceed sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Enhances US1 component - should follow US1 completion
- **User Story 3 (P3)**: Validates default behavior - can be done after US1

### Within Each User Story

- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- T001 and T002 (Setup) can run in parallel (different files)
- T003 and T004 (Foundational interfaces) can run in parallel
- T028 and T029 (Polish) can run in parallel

---

## Parallel Example: Setup Phase

```bash
# Launch all Setup tasks together:
Task: "Add HEADER_MENU_TEXT_COLOR key to src/domain/settings/constants/SettingKeys.ts"
Task: "Create HeaderMenuTextColor value object in src/domain/settings/value-objects/HeaderMenuTextColor.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (2 tasks)
2. Complete Phase 2: Foundational (6 tasks)
3. Complete Phase 3: User Story 1 (9 tasks)
4. **STOP and VALIDATE**: Test color configuration end-to-end
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test preview functionality → Deploy/Demo
4. Add User Story 3 → Verify defaults → Deploy/Demo
5. Polish phase → Final validation

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- French labels required: "Couleur du texte du menu", "Enregistrer", "Couleur du texte enregistrée"
