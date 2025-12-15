# Tasks: Custom Loader Configuration

**Input**: Design documents from `/specs/034-custom-loader/`  
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/api.md, quickstart.md

**Tests**: Unit tests explicitly requested for PublicPageLoader component (custom loader display vs default spinner).

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Exact file paths included in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Domain layer foundation and shared constants

- [x] T001 Add CUSTOM_LOADER key to src/domain/settings/constants/SettingKeys.ts
- [x] T002 [P] Add ICustomLoaderMetadata interface to src/domain/settings/entities/WebsiteSetting.ts
- [x] T003 Add createCustomLoader factory method to src/domain/settings/entities/WebsiteSetting.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: File storage and serving infrastructure that ALL user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Add CUSTOM_LOADER_CONFIG to src/infrastructure/shared/services/FileStorageService.ts
- [x] T005 Add uploadCustomLoader method to src/infrastructure/shared/services/FileStorageService.ts
- [x] T006 Add deleteCustomLoader method to src/infrastructure/shared/services/FileStorageService.ts
- [x] T007 Create public/loaders/ directory for loader file storage
- [x] T008 Create loader file serving endpoint at src/app/api/loaders/[filename]/route.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Configure Custom Loading Animation (Priority: P1)

**Goal**: Allow administrators to upload a custom GIF or video to replace the default spinning loader

**Independent Test**: Upload a GIF/video in admin settings and verify it appears in settings storage with correct metadata

### Implementation for User Story 1

- [x] T009 [US1] Create admin settings loader endpoint GET handler at src/app/api/settings/loader/route.ts
- [x] T010 [US1] Add PUT handler for file upload at src/app/api/settings/loader/route.ts
- [x] T011 [US1] Add DELETE handler for loader removal at src/app/api/settings/loader/route.ts
- [x] T012 [US1] Add loader configuration section to src/presentation/admin/components/WebsiteSettingsForm.tsx
- [x] T013 [US1] Add file upload input accepting GIF, MP4, WebM in WebsiteSettingsForm.tsx
- [x] T014 [US1] Add delete button to remove loader and revert to default in WebsiteSettingsForm.tsx

**Checkpoint**: Admin can upload/delete custom loader, verify in settings storage

---

## Phase 4: User Story 2 - Display Custom Loader on Public Pages (Priority: P1)

**Goal**: Display the custom loading animation on public pages when configured, replacing the default spinner

**Independent Test**: Configure a custom loader, visit a public page, verify custom animation displays during loading

### Unit Tests for User Story 2 (Explicitly Requested)

- [x] T015 [P] [US2] Create test file at test/unit/presentation/shared/components/PublicPageLoader.test.tsx
- [x] T016 [P] [US2] Add unit test: displays custom GIF loader when type is gif in PublicPageLoader.test.tsx
- [x] T017 [P] [US2] Add unit test: displays custom video loader when type is video in PublicPageLoader.test.tsx
- [x] T018 [P] [US2] Add unit test: displays default spinner when customLoader is null in PublicPageLoader.test.tsx
- [x] T019 [P] [US2] Add unit test: displays default spinner when customLoader is undefined in PublicPageLoader.test.tsx

### Implementation for User Story 2

- [x] T020 [US2] Create public loader endpoint at src/app/api/public/loader/route.ts
- [x] T021 [US2] Update PublicPageLoaderProps interface in src/presentation/shared/components/PublicPageLoader.tsx
- [x] T022 [US2] Add GIF rendering logic (img element) to PublicPageLoader.tsx
- [x] T023 [US2] Add video rendering logic (video element with autoPlay, loop, muted, playsInline) to PublicPageLoader.tsx
- [x] T024 [US2] Add fallback to default Spinner when no customLoader or on load error in PublicPageLoader.tsx
- [x] T025 [US2] Preserve ARIA attributes (role="status", aria-live="polite") on loader container in PublicPageLoader.tsx
- [x] T026 [US2] Add loader data fetching to src/presentation/shared/hooks/usePublicPageData.tsx
- [x] T027 [US2] Pass customLoader prop from usePublicPageData to PublicPageLoader in page components

**Checkpoint**: Public pages display custom loader when configured, default spinner otherwise

---

## Phase 5: User Story 3 - Preview Custom Loader in Admin (Priority: P2)

**Goal**: Allow administrators to preview the custom loader animation before saving

**Independent Test**: Upload a loader file, verify animated preview displays in admin interface

### Implementation for User Story 3

- [x] T028 [US3] Add GIF preview component (animated img) to WebsiteSettingsForm.tsx loader section
- [x] T029 [US3] Add video preview component (video player with loop) to WebsiteSettingsForm.tsx loader section
- [x] T030 [US3] Add ability to select different file without saving current one in WebsiteSettingsForm.tsx

**Checkpoint**: Admin can preview loader before saving, replace without saving

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Export/import integration and final validation

- [x] T031 [P] Update export service to include custom loader file in ZIP at src/application/config/services/ConfigurationService.ts
- [x] T032 [P] Update import service to restore custom loader file from ZIP at src/application/config/services/ConfigurationService.ts
- [x] T033 Verify contrast compliance for loader visibility in light and dark modes
- [x] T034 Run all unit tests: docker compose run --rm app npm run test
- [x] T035 Run quickstart.md verification checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase
- **User Story 2 (Phase 4)**: Depends on Foundational phase, can run parallel to US1
- **User Story 3 (Phase 5)**: Depends on User Story 1 (needs upload UI to exist)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational - Independent of US1 (uses same endpoints but different UI)
- **User Story 3 (P2)**: Depends on US1 admin UI existing - Enhances the upload form

### Within Each User Story

- Unit tests (US2) written FIRST, must FAIL before implementation
- API endpoints before UI components
- Core implementation before integration

### Parallel Opportunities

- T002 can run parallel to T001 (different code sections)
- T015-T019 (all unit tests) can run in parallel
- T031-T032 (export/import) can run in parallel

---

## Parallel Example: User Story 2 Tests

```bash
# Launch all unit tests for User Story 2 together:
Task: "Create test file at test/unit/presentation/shared/components/PublicPageLoader.test.tsx"
Task: "Add unit test: displays custom GIF loader when type is gif"
Task: "Add unit test: displays custom video loader when type is video"
Task: "Add unit test: displays default spinner when customLoader is null"
Task: "Add unit test: displays default spinner when customLoader is undefined"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T008)
3. Complete Phase 3: User Story 1 - Admin Configuration (T009-T014)
4. Complete Phase 4: User Story 2 - Public Display (T015-T027)
5. **STOP and VALIDATE**: Test both stories independently
6. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → Admin can configure loader (partial MVP)
3. Add User Story 2 → Public sees custom loader (full MVP!)
4. Add User Story 3 → Enhanced admin preview experience
5. Add Polish → Export/import integration, final validation

---

## Notes

- User explicitly requested unit tests for PublicPageLoader (custom vs default spinner)
- US1 and US2 are both P1 priority but can be implemented sequentially or in parallel
- US3 (P2) is optional enhancement - can be deferred
- Export/import integration (T031-T032) required for Configuration Portability principle
