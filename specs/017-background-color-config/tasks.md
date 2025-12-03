# Tasks: Background Color Configuration

**Input**: Design documents from `/specs/017-background-color-config/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: No tests specified in feature requirements - tests will only be added if explicitly requested.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Domain Layer)

**Purpose**: Create domain-level components (value objects, constants, entity extensions)

- [ ] T001 Add `BACKGROUND_COLOR: 'background-color'` to `VALID_SETTING_KEYS` in `src/domain/settings/constants/SettingKeys.ts`
- [ ] T002 [P] Create BackgroundColor value object in `src/domain/settings/value-objects/BackgroundColor.ts` (mirror ThemeColor.ts structure)
- [ ] T003 Extend WebsiteSetting entity with `createBackgroundColor()`, `isValidBackgroundColorKey()`, and `createDefaultBackgroundColor()` in `src/domain/settings/entities/WebsiteSetting.ts`

**Checkpoint**: Domain layer complete - value objects and entity ready for use cases

---

## Phase 2: Foundational (Application & Infrastructure Layer)

**Purpose**: Create use cases and register services - MUST be complete before user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 [P] Create IGetBackgroundColor interface in `src/application/settings/IGetBackgroundColor.ts`
- [ ] T005 [P] Create IUpdateBackgroundColor interface in `src/application/settings/IUpdateBackgroundColor.ts`
- [ ] T006 [P] Create GetBackgroundColor use case in `src/application/settings/GetBackgroundColor.ts` (mirror GetThemeColor.ts)
- [ ] T007 [P] Create UpdateBackgroundColor use case in `src/application/settings/UpdateBackgroundColor.ts` (mirror UpdateThemeColor.ts)
- [ ] T008 Register IGetBackgroundColor and IUpdateBackgroundColor in `src/infrastructure/container.ts`
- [ ] T009 Add getGetBackgroundColor() and getUpdateBackgroundColor() to SettingsServiceLocator in `src/infrastructure/container.ts`
- [ ] T010 [P] Add `backgroundColor?: ThemeColorToken` to GetSettingsResponse in `src/app/api/settings/types.ts`
- [ ] T011 [P] Add `backgroundColor?: string` to UpdateSettingsRequest in `src/app/api/settings/types.ts`

**Checkpoint**: Foundation ready - use cases registered, API types extended

---

## Phase 3: User Story 1 - Configure Background Color for Public Site (Priority: P1) 🎯 MVP

**Goal**: Admin can select background color in settings, and it applies to the public site body

**Independent Test**: Navigate to website settings, select background color, save, verify public site displays chosen background color

### Implementation for User Story 1

- [ ] T012 [US1] Extend GET handler to fetch and return backgroundColor in `src/app/api/settings/route.ts`
- [ ] T013 [US1] Extend POST handler to validate and save backgroundColor in `src/app/api/settings/route.ts`
- [ ] T014 [P] [US1] Create BackgroundColorStorage utility in `src/presentation/shared/utils/BackgroundColorStorage.ts` (mirror ThemeColorStorage.ts)
- [ ] T015 [P] [US1] Create useBackgroundColor hook in `src/presentation/shared/hooks/useBackgroundColor.ts` (mirror useThemeColor.ts)
- [ ] T016 [US1] Create BackgroundColorContext in `src/presentation/shared/contexts/BackgroundColorContext.tsx` (mirror ThemeColorContext.tsx)
- [ ] T017 [US1] Create BackgroundColorSelector component in `src/presentation/admin/components/BackgroundColorSelector.tsx` (mirror ThemeColorSelector.tsx, label: "Background Color")
- [ ] T018 [US1] Add BackgroundColorSelector to WebsiteSettingsForm immediately after ThemeColorSelector in `src/presentation/admin/components/WebsiteSettingsForm.tsx`
- [ ] T019 [US1] Apply background color to public site body in `src/presentation/shared/components/ui/provider.tsx` (use `{color}.50` for light mode)
- [ ] T020 [US1] Verify YAGNI compliance - only public body background, no extra features
- [ ] T021 [US1] Verify DRY compliance - reuses ThemeColorPalette and existing patterns
- [ ] T022 [US1] Verify KISS compliance - simple selector, straightforward persistence

**Checkpoint**: User Story 1 complete - admin can configure background color for public site

---

## Phase 4: User Story 2 - Theme Mode Compatibility (Priority: P2)

**Goal**: Background color works seamlessly in both light and dark mode

**Independent Test**: Configure background color, toggle light/dark mode on public site, verify appropriate color rendering in each mode

### Implementation for User Story 2

- [ ] T023 [US2] Update background color application in `src/presentation/shared/components/ui/provider.tsx` to use color scale variants (`{color}.50` light, `{color}.900` dark)
- [ ] T024 [US2] Ensure BackgroundColorContext provides color value that adapts to theme mode in `src/presentation/shared/contexts/BackgroundColorContext.tsx`
- [ ] T025 [US2] Verify contrast compliance for text/UI elements against background in both light and dark modes
- [ ] T026 [US2] Verify YAGNI compliance - only light/dark mode adaptation, no additional features
- [ ] T027 [US2] Verify DRY compliance - reuses Chakra UI color scale system
- [ ] T028 [US2] Verify KISS compliance - leverages existing Chakra theme mode system

**Checkpoint**: User Story 2 complete - background color adapts correctly to light/dark mode

---

## Phase 5: User Story 3 - Background Color Persistence (Priority: P3)

**Goal**: Background color selection persists across browser sessions

**Independent Test**: Configure background color, close browser, reopen admin panel, verify color is still selected and applied

### Implementation for User Story 3

- [ ] T029 [US3] Verify BackgroundColorStorage correctly saves to localStorage in `src/presentation/shared/utils/BackgroundColorStorage.ts`
- [ ] T030 [US3] Verify useBackgroundColor hook initializes from localStorage on mount in `src/presentation/shared/hooks/useBackgroundColor.ts`
- [ ] T031 [US3] Verify BackgroundColorContext syncs with server on page load in `src/presentation/shared/contexts/BackgroundColorContext.tsx`
- [ ] T032 [US3] Ensure WebsiteSettingsForm loads saved backgroundColor on mount in `src/presentation/admin/components/WebsiteSettingsForm.tsx`
- [ ] T033 [US3] Verify cross-tab updates work via CustomEvent dispatch in `src/presentation/shared/utils/BackgroundColorStorage.ts`
- [ ] T034 [US3] Verify YAGNI compliance - localStorage + server sync only, no additional persistence
- [ ] T035 [US3] Verify DRY compliance - mirrors ThemeColorStorage pattern exactly
- [ ] T036 [US3] Verify KISS compliance - simple storage key and event pattern

**Checkpoint**: User Story 3 complete - background color persists across sessions

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [ ] T037 Run quickstart.md validation checklist (admin panel selector, color selection, save, public site, dark mode)
- [ ] T038 Code cleanup - remove any unused imports or dead code
- [ ] T039 Verify all new files follow existing naming conventions
- [ ] T040 Verify accessibility - screen reader announcements in BackgroundColorSelector (mirror ThemeColorSelector pattern)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Phase 2 completion
  - US1 must complete before US2 (dark mode builds on base implementation)
  - US3 can run in parallel with US2 (persistence is independent)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 2 - Core functionality
- **User Story 2 (P2)**: Depends on US1 - Extends the base implementation
- **User Story 3 (P3)**: Can start after Phase 2 - Independent persistence validation

### Within Each Phase

- Tasks marked [P] can run in parallel
- Domain tasks (T001-T003) before application tasks
- Application tasks (T004-T011) before presentation tasks
- API changes before UI changes

### Parallel Opportunities

**Phase 1 (Setup)**:

```bash
# Run in parallel:
Task T002: Create BackgroundColor value object
```

**Phase 2 (Foundational)**:

```bash
# Run in parallel:
Task T004: Create IGetBackgroundColor interface
Task T005: Create IUpdateBackgroundColor interface
Task T006: Create GetBackgroundColor use case
Task T007: Create UpdateBackgroundColor use case
Task T010: Add backgroundColor to GetSettingsResponse
Task T011: Add backgroundColor to UpdateSettingsRequest
```

**Phase 3 (User Story 1)**:

```bash
# Run in parallel:
Task T014: Create BackgroundColorStorage utility
Task T015: Create useBackgroundColor hook
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (3 tasks)
2. Complete Phase 2: Foundational (8 tasks)
3. Complete Phase 3: User Story 1 (11 tasks)
4. **STOP and VALIDATE**: Test background color selection and application
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → Admin can set background color → MVP!
3. Add User Story 2 → Dark mode support
4. Add User Story 3 → Session persistence
5. Polish → Final validation

### Suggested MVP Scope

**MVP = Phase 1 + Phase 2 + Phase 3 (User Story 1)**

This delivers the core functionality:

- Background color selector in admin panel
- Color persisted to database
- Applied to public site body

---

## Notes

- [P] tasks = different files, no dependencies
- [USx] label maps task to specific user story for traceability
- Mirror existing ThemeColor implementation patterns throughout
- Use Chakra UI color scale for theme mode compatibility
- localStorage key: `'shower-background-color'`
- Event name: `'background-color-updated'`
- Default color: `'blue'` (matches theme color default)
