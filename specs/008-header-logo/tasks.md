# Tasks: Header Logo Configuration

**Input**: Design documents from `/specs/008-header-logo/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are NOT requested in this feature specification. Focus on implementation only.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and core domain components

- [ ] T001 Add HEADER_LOGO key to setting keys in src/domain/settings/constants/SettingKeys.ts
- [ ] T002 [P] Create HeaderLogo value object in src/domain/settings/value-objects/HeaderLogo.ts
- [ ] T003 [P] Create IGetHeaderLogo interface in src/application/settings/IGetHeaderLogo.ts
- [ ] T004 [P] Create IUpdateHeaderLogo interface in src/application/settings/IUpdateHeaderLogo.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 Implement GetHeaderLogo use case in src/application/settings/GetHeaderLogo.ts
- [ ] T006 Implement UpdateHeaderLogo use case in src/application/settings/UpdateHeaderLogo.ts
- [ ] T007 Add uploadLogo and deleteLogo methods to FileStorageService in src/infrastructure/shared/services/FileStorageService.ts
- [ ] T008 Register GetHeaderLogo and UpdateHeaderLogo in DI container in src/infrastructure/container.ts
- [ ] T009 Add SettingsServiceLocator methods for logo use cases in src/infrastructure/container.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Configure Header Logo in Admin (Priority: P1) 🎯 MVP

**Goal**: Allow admin users to upload, replace, and delete a logo image in the menu configuration screen

**Independent Test**: Navigate to admin menu configuration page, upload an image, verify it saves and displays preview

### Implementation for User Story 1

- [ ] T010 [P] [US1] Create admin logo API GET handler in src/app/api/settings/logo/route.ts
- [ ] T011 [P] [US1] Create admin logo API POST handler in src/app/api/settings/logo/route.ts
- [ ] T012 [P] [US1] Create admin logo API DELETE handler in src/app/api/settings/logo/route.ts
- [ ] T013 [US1] Add logo upload section with ImageManager to MenuConfigForm in src/presentation/admin/components/MenuConfigForm.tsx
- [ ] T014 [US1] Add logo state management (fetch, upload, replace, delete) to MenuConfigForm in src/presentation/admin/components/MenuConfigForm.tsx
- [ ] T015 [US1] Add logo preview display and action buttons to MenuConfigForm in src/presentation/admin/components/MenuConfigForm.tsx
- [ ] T016 [US1] Add toast notifications for logo upload/replace/delete operations in MenuConfigForm
- [ ] T017 [US1] Verify YAGNI compliance - only upload/replace/delete functionality, no extras
- [ ] T018 [US1] Verify DRY compliance - reuse ImageManager component, no code duplication
- [ ] T019 [US1] Verify KISS compliance - simple state management and API calls

**Checkpoint**: User Story 1 complete - admin can upload, view, replace, and delete header logo

---

## Phase 4: User Story 2 - Display Header Logo on Public Site (Priority: P2)

**Goal**: Display the configured logo at the left of the header menu on public pages

**Independent Test**: Configure a logo in admin, visit public site, verify logo appears left of navigation items

### Implementation for User Story 2

- [ ] T020 [P] [US2] Create public logo API GET handler in src/app/api/public/logo/route.ts
- [ ] T021 [P] [US2] Add PublicLogo type to header menu types in src/presentation/shared/components/PublicHeaderMenu/types.ts
- [ ] T022 [US2] Add logo fetching to usePublicHeaderMenu hook in src/presentation/shared/components/PublicHeaderMenu/usePublicHeaderMenu.ts
- [ ] T023 [US2] Add logo display to PublicHeaderMenu component in src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenu.tsx
- [ ] T024 [US2] Handle no-logo state gracefully (render header without logo) in PublicHeaderMenu.tsx
- [ ] T025 [US2] Handle logo load error gracefully (fallback to no logo) in PublicHeaderMenu.tsx
- [ ] T026 [US2] Verify logo displays correctly in dark mode in PublicHeaderMenu.tsx
- [ ] T027 [US2] Verify YAGNI compliance - logo display only, no click behavior
- [ ] T028 [US2] Verify DRY compliance - reuse existing header patterns
- [ ] T029 [US2] Verify KISS compliance - simple conditional rendering

**Checkpoint**: User Story 2 complete - logo displays on public site when configured

---

## Phase 5: User Story 3 - Logo Display Consistency (Priority: P3)

**Goal**: Ensure logo displays consistently across viewports and color modes

**Independent Test**: View public header with logo on different viewport sizes and toggle light/dark modes

### Implementation for User Story 3

- [ ] T030 [US3] Add responsive logo sizing (40px desktop, 32px mobile) to PublicHeaderMenu.tsx
- [ ] T031 [US3] Ensure logo maintains aspect ratio with proper CSS in PublicHeaderMenu.tsx
- [ ] T032 [US3] Verify logo visibility against themed header background in light mode
- [ ] T033 [US3] Verify logo visibility against themed header background in dark mode
- [ ] T034 [US3] Ensure logo does not overflow or break header layout on small screens
- [ ] T035 [US3] Verify YAGNI compliance - fixed sizing only, no user-configurable options
- [ ] T036 [US3] Verify DRY compliance - use Chakra responsive syntax
- [ ] T037 [US3] Verify KISS compliance - simple responsive styling

**Checkpoint**: User Story 3 complete - logo displays consistently across all conditions

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [ ] T038 Verify all API endpoints return correct response formats per contracts/api-contracts.md
- [ ] T039 Verify error handling for all edge cases (missing file, oversized file, invalid type)
- [ ] T040 Verify logo persists across browser refresh and server restart
- [ ] T041 Run build to ensure no TypeScript errors: docker compose run --rm app npm run build
- [ ] T042 Run lint to ensure code quality: docker compose run --rm app npm run lint
- [ ] T043 Manual testing: complete quickstart.md testing checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories should proceed sequentially (P1 → P2 → P3) for this feature
  - P2 depends on P1 (logo must be configurable before displaying)
  - P3 refines P2 (consistency improvements to existing display)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - Core admin functionality
- **User Story 2 (P2)**: Depends on US1 (needs logo to be configured to display it)
- **User Story 3 (P3)**: Depends on US2 (refines the display from US2)

### Within Each User Story

- API endpoints before UI components
- UI fetch logic before display components
- Core implementation before polish tasks

### Parallel Opportunities

**Phase 1 (Setup)**:

```
T002, T003, T004 can run in parallel (different files)
```

**Phase 2 (Foundational)**:

```
T005, T006 can run in parallel after T001-T004
T007 can run in parallel with T005, T006
```

**User Story 1**:

```
T010, T011, T012 can run in parallel (same file but separate handlers)
```

**User Story 2**:

```
T020, T021 can run in parallel (different files)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test admin logo upload/replace/delete
5. Deploy/demo if ready - admin can now configure logos

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy (Admin can configure logos!)
3. Add User Story 2 → Test independently → Deploy (Public can see logos!)
4. Add User Story 3 → Test independently → Deploy (Logo displays consistently)
5. Each story adds visible value without breaking previous stories

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Tests not included - not requested in specification
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Reference existing patterns: WebsiteIcon for value object, icon API for endpoints
