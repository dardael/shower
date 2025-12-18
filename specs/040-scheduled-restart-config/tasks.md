# Tasks: Scheduled Restart Configuration

**Input**: Design documents from `/specs/040-scheduled-restart-config/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not requested in feature specification - test tasks are excluded.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency installation

- [x] T001 Install node-cron dependency: `docker compose run --rm app npm install node-cron`
- [x] T002 Install @types/node-cron dev dependency: `docker compose run --rm app npm install --save-dev @types/node-cron`
- [x] T003 Add `scheduled-restart` key to `VALID_SETTING_KEYS` in `src/domain/settings/constants/SettingKeys.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core domain and infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create `ScheduledRestartConfig` value object in `src/domain/config/value-objects/ScheduledRestartConfig.ts`
- [x] T005 [P] Create `IScheduledRestartConfigRepository` interface in `src/domain/config/repositories/IScheduledRestartConfigRepository.ts`
- [x] T006 [P] Create `IRestartScheduler` interface in `src/domain/config/services/IRestartScheduler.ts`
- [x] T007 Implement `MongoScheduledRestartConfigRepository` in `src/infrastructure/config/repositories/MongoScheduledRestartConfigRepository.ts`
- [x] T008 Register `MongoScheduledRestartConfigRepository` in DI container at `src/infrastructure/container.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Configure Scheduled Restart Hour (Priority: P1) 🎯 MVP

**Goal**: Enable admins to configure a specific hour (0-23) when the server should restart

**Independent Test**: Configure a restart hour in the admin panel and verify the setting is saved and displayed correctly on page reload

### Implementation for User Story 1

- [x] T009 [P] [US1] Create `GetScheduledRestartConfig` use case in `src/application/config/GetScheduledRestartConfig.ts`
- [x] T010 [P] [US1] Create `UpdateScheduledRestartConfig` use case in `src/application/config/UpdateScheduledRestartConfig.ts`
- [x] T011 [US1] Create API route handler (GET) in `src/app/api/admin/scheduled-restart/route.ts`
- [x] T012 [US1] Add API route handler (POST) in `src/app/api/admin/scheduled-restart/route.ts`
- [x] T013 [US1] Create `useScheduledRestart` hook in `src/presentation/admin/hooks/useScheduledRestart.ts`
- [x] T014 [US1] Create `ScheduledRestartForm` component in `src/presentation/admin/components/ScheduledRestartForm.tsx`
- [x] T015 [US1] Integrate `ScheduledRestartForm` into admin settings page
- [x] T016 [US1] Verify contrast compliance for light and dark modes in form component
- [x] T017 [US1] Verify YAGNI compliance (minimal implementation for current requirements only)
- [x] T018 [US1] Verify DRY compliance (no code duplication)
- [x] T019 [US1] Verify KISS compliance (simple, readable code)

**Checkpoint**: Admin can configure restart hour and see saved configuration - US1 independently testable

---

## Phase 4: User Story 2 - Automatic Server Restart at Scheduled Time (Priority: P1)

**Goal**: Server automatically restarts at the configured hour when feature is enabled

**Independent Test**: Set a restart time (for testing, use current hour + 1 minute offset) and verify the server restarts at that time

### Implementation for User Story 2

- [x] T020 [US2] Create `NodeCronRestartScheduler` in `src/infrastructure/config/services/NodeCronRestartScheduler.ts`
- [x] T021 [US2] Implement cron job scheduling with node-cron in `NodeCronRestartScheduler`
- [x] T022 [US2] Implement graceful restart trigger (process.exit(0) with logging) in `NodeCronRestartScheduler`
- [x] T023 [US2] Add `start()` method to load config and initialize scheduler on startup
- [x] T024 [US2] Register `NodeCronRestartScheduler` in DI container at `src/infrastructure/container.ts`
- [x] T025 [US2] Initialize scheduler on server startup via `instrumentation.ts`
- [x] T026 [US2] Update POST API route to reschedule cron job when config changes in `src/app/api/admin/scheduled-restart/route.ts`
- [x] T027 [US2] Add restart event logging using existing Logger infrastructure
- [x] T028 [US2] Verify Docker `restart: always` policy is configured in `docker-compose.yml`
- [x] T029 [US2] Verify YAGNI compliance (minimal implementation for current requirements only)
- [x] T030 [US2] Verify DRY compliance (no code duplication)
- [x] T031 [US2] Verify KISS compliance (simple, readable code)

**Checkpoint**: Server restarts automatically at configured hour - US2 independently testable

---

## Phase 5: User Story 3 - Disable Scheduled Restart (Priority: P2)

**Goal**: Allow admins to disable automatic restarts without losing the configured hour

**Independent Test**: Toggle the feature off and verify no restart occurs at the previously scheduled time; re-enable and verify the hour is retained

### Implementation for User Story 3

- [x] T032 [US3] Add enable/disable toggle to `ScheduledRestartForm` in `src/presentation/admin/components/ScheduledRestartForm.tsx`
- [x] T033 [US3] Update `NodeCronRestartScheduler` to stop cron job when disabled in `src/infrastructure/config/services/NodeCronRestartScheduler.ts`
- [x] T034 [US3] Ensure disabled state skips restart at scheduled time
- [x] T035 [US3] Verify configured hour is retained when toggling enable/disable
- [x] T036 [US3] Verify contrast compliance for toggle component in light and dark modes
- [x] T037 [US3] Verify YAGNI compliance (minimal implementation for current requirements only)
- [x] T038 [US3] Verify DRY compliance (no code duplication)
- [x] T039 [US3] Verify KISS compliance (simple, readable code)

**Checkpoint**: Admin can enable/disable scheduled restarts - US3 independently testable

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and integration checks

- [x] T040 Verify configuration exports include scheduled-restart setting (via VALID_SETTING_KEYS)
- [x] T041 Verify configuration imports restore scheduled-restart setting (via ZipImporter)
- [x] T042 Code cleanup and remove any unused imports
- [x] T043 Run build and lint validation
- [x] T044 Final accessibility review across all form components

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - US1 and US2 are both P1 but US2 depends on US1's API route
  - US3 depends on US1 (form) and US2 (scheduler service)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after US1's API route (T011-T012) is complete
- **User Story 3 (P2)**: Depends on US1 form (T014) and US2 scheduler (T020) being complete

### Within Each User Story

- Use cases before API routes
- API routes before hooks
- Hooks before UI components
- Core implementation before validation tasks

### Parallel Opportunities

- T005 and T006 can run in parallel (different interface files)
- T009 and T010 can run in parallel (different use case files)
- Setup tasks (T001, T002) can run sequentially in one command

---

## Parallel Example: User Story 1

```bash
# Launch use cases in parallel:
Task: "Create GetScheduledRestartConfig use case in src/application/config/use-cases/GetScheduledRestartConfig.ts"
Task: "Create UpdateScheduledRestartConfig use case in src/application/config/use-cases/UpdateScheduledRestartConfig.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test configuration UI independently
5. Deploy/demo if ready - admins can configure but restarts don't happen yet

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Configuration works
3. Add User Story 2 → Test independently → Automatic restarts work
4. Add User Story 3 → Test independently → Enable/disable toggle works
5. Polish phase → Final validation

### Recommended Order (Single Developer)

1. T001-T003 (Setup)
2. T004-T008 (Foundational)
3. T009-T019 (US1 - Configuration UI)
4. T020-T031 (US2 - Scheduler)
5. T032-T039 (US3 - Toggle)
6. T040-T044 (Polish)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Docker restart policy (`restart: always`) is required for automatic restart to work
