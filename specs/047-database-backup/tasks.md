# Tasks: Database Backup Configuration

**Input**: Design documents from `/specs/047-database-backup/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are explicitly requested in the user input ("implement tests").

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and backup domain structure

- [x] T001 Create backup domain directory structure at src/domain/backup/entities/ and src/domain/backup/ports/
- [x] T002 [P] Create backup application directory structure at src/application/backup/use-cases/ and src/application/backup/services/
- [x] T003 [P] Create backup infrastructure directory structure at src/infrastructure/backup/adapters/ and src/infrastructure/backup/models/
- [x] T004 [P] Create temp/backups/ directory for backup file storage
- [x] T005 Verify mongodump/mongorestore are available in Docker container

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core entities, ports, and infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 [P] Create BackupConfiguration entity in src/domain/backup/entities/BackupConfiguration.ts
- [x] T007 [P] Create DatabaseBackup entity in src/domain/backup/entities/DatabaseBackup.ts
- [x] T008 [P] Create IBackupConfigurationRepository port in src/domain/backup/ports/IBackupConfigurationRepository.ts
- [x] T009 [P] Create IDatabaseBackupService port in src/domain/backup/ports/IDatabaseBackupService.ts
- [x] T010 [P] Create BackupConfigurationModel Mongoose schema in src/infrastructure/backup/models/BackupConfigurationModel.ts
- [x] T011 [P] Create DatabaseBackupModel Mongoose schema in src/infrastructure/backup/models/DatabaseBackupModel.ts
- [x] T012 Create MongoBackupConfigurationRepository adapter in src/infrastructure/backup/adapters/MongoBackupConfigurationRepository.ts
- [x] T013 Create MongoDumpBackupService adapter in src/infrastructure/backup/adapters/MongoDumpBackupService.ts
- [x] T014 Register backup dependencies in src/infrastructure/container.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Enable and Configure Daily Backups (Priority: P1) 🎯 MVP

**Goal**: Allow administrator to enable scheduled daily database backups and configure the time when they occur

**Independent Test**: Can be fully tested by enabling backups, setting a time, and verifying that a backup is created at the configured hour

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**
> **FOCUS: Unit tests and integration tests ONLY, cover common cases, avoid over-mocking**

- [x] T015 [P] [US1] Unit test for BackupConfiguration entity in test/unit/domain/backup/BackupConfiguration.test.ts
- [x] T016 [P] [US1] Unit test for GetBackupConfiguration use-case in test/unit/application/backup/GetBackupConfiguration.test.ts
- [x] T017 [P] [US1] Unit test for UpdateBackupConfiguration use-case in test/unit/application/backup/UpdateBackupConfiguration.test.ts
- [x] T018 [P] [US1] Unit test for BackupSchedulerService in test/unit/application/backup/BackupSchedulerService.test.ts
- [x] T019 [P] [US1] Unit test for useBackupConfiguration hook in test/unit/presentation/admin/useBackupConfiguration.test.ts
- [ ] T020 [P] [US1] Integration test for backup configuration workflow in test/integration/backup-configuration.integration.test.tsx

### Implementation for User Story 1

- [x] T021 [P] [US1] Create GetBackupConfiguration use-case in src/application/backup/use-cases/GetBackupConfiguration.ts
- [x] T022 [P] [US1] Create UpdateBackupConfiguration use-case in src/application/backup/use-cases/UpdateBackupConfiguration.ts
- [x] T023 [US1] Create BackupSchedulerService with node-cron in src/application/backup/services/BackupSchedulerService.ts
- [x] T024 [US1] Create GET /api/backup/configuration route in src/app/api/backup/configuration/route.ts
- [x] T025 [US1] Create PUT /api/backup/configuration route in src/app/api/backup/configuration/route.ts
- [x] T026 [US1] Create useBackupConfiguration hook in src/presentation/admin/hooks/useBackupConfiguration.ts
- [x] T027 [US1] Create BackupConfigurationForm component in src/presentation/admin/components/BackupConfigurationForm.tsx
- [x] T028 [US1] Integrate BackupConfigurationForm into maintenance page in src/app/admin/maintenance/page.tsx
- [x] T029 [US1] Initialize backup scheduler in server startup via src/instrumentation.ts
- [x] T030 [US1] Verify contrast compliance for light and dark modes
- [x] T031 [US1] Verify YAGNI compliance (minimal implementation for current requirements only)
- [x] T032 [US1] Verify DRY compliance (no code duplication)
- [x] T033 [US1] Verify KISS compliance (simple, readable code)
- [x] T034 [US1] Verify French localization (all visible text in French)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Configure Backup Retention (Priority: P2)

**Goal**: Allow administrator to configure how many backups are kept and automatically clean up older backups

**Independent Test**: Can be tested by setting a retention limit of 3, creating 4 backups, and verifying only the 3 most recent remain

### Tests for User Story 2

- [x] T035 [P] [US2] Unit test for retention logic in BackupConfiguration entity in test/unit/domain/backup/BackupConfiguration.test.ts (extend existing)
- [x] T036 [P] [US2] Unit test for automatic cleanup in MongoDumpBackupService in test/unit/infrastructure/backup/MongoDumpBackupService.test.ts

### Implementation for User Story 2

- [x] T037 [US2] Add retention count validation to UpdateBackupConfiguration use-case in src/application/backup/use-cases/UpdateBackupConfiguration.ts
- [x] T038 [US2] Implement automatic cleanup of oldest backups in MongoDumpBackupService in src/infrastructure/backup/adapters/MongoDumpBackupService.ts
- [x] T039 [US2] Add retention count input field to BackupConfigurationForm in src/presentation/admin/components/BackupConfigurationForm.tsx
- [x] T040 [US2] Verify YAGNI compliance (minimal implementation for current requirements only)
- [x] T041 [US2] Verify DRY compliance (no code duplication)
- [x] T042 [US2] Verify KISS compliance (simple, readable code)
- [x] T043 [US2] Verify French localization (all visible text in French)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - View Available Backups (Priority: P2)

**Goal**: Display a list of all available backups with their creation dates and sizes

**Independent Test**: Can be tested by creating several backups and verifying they appear in the list with correct timestamps

### Tests for User Story 3

- [x] T044 [P] [US3] Unit test for DatabaseBackup entity in test/unit/domain/backup/DatabaseBackup.test.ts
- [x] T045 [P] [US3] Unit test for ListDatabaseBackups use-case in test/unit/application/backup/ListDatabaseBackups.test.ts

### Implementation for User Story 3

- [x] T046 [US3] Create ListDatabaseBackups use-case in src/application/backup/use-cases/ListDatabaseBackups.ts
- [x] T047 [US3] Create GET /api/backup/list route in src/app/api/backup/list/route.ts
- [x] T048 [US3] Add backup list display to BackupConfigurationForm in src/presentation/admin/components/BackupConfigurationForm.tsx
- [x] T049 [US3] Add "Aucune sauvegarde disponible" empty state message
- [x] T050 [US3] Verify contrast compliance for light and dark modes
- [x] T051 [US3] Verify YAGNI compliance (minimal implementation for current requirements only)
- [x] T052 [US3] Verify DRY compliance (no code duplication)
- [x] T053 [US3] Verify KISS compliance (simple, readable code)
- [x] T054 [US3] Verify French localization (all visible text in French)

**Checkpoint**: User Story 3 should now be independently functional

---

## Phase 6: User Story 4 - Restore from Backup (Priority: P3)

**Goal**: Allow administrator to select a backup and restore the database to that state

**Independent Test**: Can be tested by creating content, making a backup, modifying content, restoring, and verifying the content returns to the backed-up state

### Tests for User Story 4

- [x] T055 [P] [US4] Unit test for RestoreDatabaseBackup use-case in test/unit/application/backup/RestoreDatabaseBackup.test.ts
- [ ] T056 [P] [US4] Integration test for restore workflow in test/integration/backup-restore.integration.test.tsx

### Implementation for User Story 4

- [x] T057 [US4] Create RestoreDatabaseBackup use-case in src/application/backup/use-cases/RestoreDatabaseBackup.ts
- [x] T058 [US4] Implement mongorestore in MongoDumpBackupService in src/infrastructure/backup/adapters/MongoDumpBackupService.ts
- [x] T059 [US4] Create POST /api/backup/restore/[id]/route.ts in src/app/api/backup/restore/[id]/route.ts
- [x] T060 [US4] Add restore button with 2-step confirmation dialog to BackupConfigurationForm in src/presentation/admin/components/BackupConfigurationForm.tsx
- [x] T061 [US4] Add loading indicator during restore operation
- [x] T062 [US4] Disable all actions during restore operation
- [x] T063 [US4] Verify contrast compliance for confirmation dialog in light and dark modes
- [x] T064 [US4] Verify YAGNI compliance (minimal implementation for current requirements only)
- [x] T065 [US4] Verify DRY compliance (no code duplication)
- [x] T066 [US4] Verify KISS compliance (simple, readable code)
- [x] T067 [US4] Verify French localization (all visible text in French)

**Checkpoint**: User Story 4 should now be independently functional

---

## Phase 7: User Story 5 - Create Manual Backup (Priority: P3)

**Goal**: Allow administrator to manually trigger a backup at any time

**Independent Test**: Can be tested by clicking the manual backup button and verifying a new backup appears in the list immediately

### Tests for User Story 5

- [x] T068 [P] [US5] Unit test for CreateDatabaseBackup use-case in test/unit/application/backup/CreateDatabaseBackup.test.ts

### Implementation for User Story 5

- [x] T069 [US5] Create CreateDatabaseBackup use-case in src/application/backup/use-cases/CreateDatabaseBackup.ts
- [x] T070 [US5] Create POST /api/backup/create route in src/app/api/backup/create/route.ts
- [x] T071 [US5] Add "Créer une sauvegarde maintenant" button to BackupConfigurationForm in src/presentation/admin/components/BackupConfigurationForm.tsx
- [x] T072 [US5] Add loading state to manual backup button during backup operation
- [x] T073 [US5] Verify YAGNI compliance (minimal implementation for current requirements only)
- [x] T074 [US5] Verify DRY compliance (no code duplication)
- [x] T075 [US5] Verify KISS compliance (simple, readable code)
- [x] T076 [US5] Verify French localization (all visible text in French)

**Checkpoint**: User Story 5 should now be independently functional

---

## Phase 8: User Story 6 - Delete Backup (Priority: P3)

**Goal**: Allow administrator to manually delete individual backups

**Independent Test**: Can be tested by creating a backup and deleting it, verifying it's removed from the list

### Tests for User Story 6

- [x] T077 [P] [US6] Unit test for DeleteDatabaseBackup use-case in test/unit/application/backup/DeleteDatabaseBackup.test.ts

### Implementation for User Story 6

- [x] T078 [US6] Create DeleteDatabaseBackup use-case in src/application/backup/use-cases/DeleteDatabaseBackup.ts
- [x] T079 [US6] Create DELETE /api/backup/[id] route in src/app/api/backup/[id]/route.ts
- [x] T080 [US6] Add delete button to each backup item in BackupConfigurationForm in src/presentation/admin/components/BackupConfigurationForm.tsx
- [x] T081 [US6] Verify YAGNI compliance (minimal implementation for current requirements only)
- [x] T082 [US6] Verify DRY compliance (no code duplication)
- [x] T083 [US6] Verify KISS compliance (simple, readable code)
- [x] T084 [US6] Verify French localization (all visible text in French)

**Checkpoint**: All user stories should now be independently functional

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T085 Add BackupConfiguration to export/import configuration sync in existing exporter
- [ ] T086 Run all unit tests and fix any failures
- [ ] T087 Run all integration tests and fix any failures
- [ ] T088 Run quickstart.md validation checklist
- [ ] T089 Code cleanup and refactoring for consistency
- [ ] T090 Final accessibility review for all backup UI components

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational - Extends US1 components but independently testable
- **User Story 3 (P2)**: Can start after Foundational - Uses entities from Phase 2
- **User Story 4 (P3)**: Depends on US3 (needs backup list to select from)
- **User Story 5 (P3)**: Can start after Foundational - Independent of other stories
- **User Story 6 (P3)**: Depends on US3 (needs backup list to delete from)

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Use-cases before API routes
- API routes before hooks
- Hooks before components
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks (T001-T005) can run in parallel
- All Foundational entity/port tasks (T006-T011) can run in parallel
- Once Foundational phase completes, US1, US2, US3, US5 can start in parallel
- All tests for a user story marked [P] can run in parallel

---

## Parallel Example: Foundational Phase

```bash
# Launch all entity/port/model tasks together:
Task: "Create BackupConfiguration entity in src/domain/backup/entities/BackupConfiguration.ts"
Task: "Create DatabaseBackup entity in src/domain/backup/entities/DatabaseBackup.ts"
Task: "Create IBackupConfigurationRepository port in src/domain/backup/ports/IBackupConfigurationRepository.ts"
Task: "Create IDatabaseBackupService port in src/domain/backup/ports/IDatabaseBackupService.ts"
Task: "Create BackupConfigurationModel Mongoose schema in src/infrastructure/backup/models/BackupConfigurationModel.ts"
Task: "Create DatabaseBackupModel Mongoose schema in src/infrastructure/backup/models/DatabaseBackupModel.ts"
```

---

## Parallel Example: User Story 1 Tests

```bash
# Launch all tests for User Story 1 together:
Task: "Unit test for BackupConfiguration entity in test/unit/domain/backup/BackupConfiguration.test.ts"
Task: "Unit test for GetBackupConfiguration use-case in test/unit/application/backup/GetBackupConfiguration.test.ts"
Task: "Unit test for UpdateBackupConfiguration use-case in test/unit/application/backup/UpdateBackupConfiguration.test.ts"
Task: "Unit test for BackupSchedulerService in test/unit/application/backup/BackupSchedulerService.test.ts"
Task: "Unit test for useBackupConfiguration hook in test/unit/presentation/admin/useBackupConfiguration.test.ts"
Task: "Integration test for backup configuration workflow in test/integration/backup-configuration.integration.test.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready - Administrator can enable and configure daily backups

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 + 3 → Test independently → Deploy/Demo (Retention + List)
4. Add User Story 4 + 5 + 6 → Test independently → Deploy/Demo (Full feature)
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2 + 3
   - Developer C: User Story 5
3. After US3 complete:
   - Developer B: User Story 4 + 6
4. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
