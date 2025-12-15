# Tasks: Configuration Export/Import

**Input**: Design documents from `/specs/033-config-export-import/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Integration tests explicitly requested for import/export flows. Unit tests for use cases.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and create base project structure for config domain

- [x] T001 Install archiver and adm-zip dependencies: `docker compose run --rm app npm install archiver adm-zip`
- [x] T002 Install type definitions: `docker compose run --rm app npm install -D @types/archiver @types/adm-zip`
- [x] T003 [P] Create domain directory structure: `src/domain/config/entities/`, `src/domain/config/value-objects/`, `src/domain/config/ports/`
- [x] T004 [P] Create application directory structure: `src/application/config/use-cases/`, `src/application/config/services/`
- [x] T005 [P] Create infrastructure directory structure: `src/infrastructure/config/adapters/`, `src/infrastructure/config/services/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core domain entities and ports that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Create PackageVersion value object in `src/domain/config/value-objects/PackageVersion.ts`
- [x] T007 Create ExportPackage entity in `src/domain/config/entities/ExportPackage.ts`
- [x] T008 Create PackageSummary interface in `src/domain/config/entities/PackageSummary.ts`
- [x] T009 [P] Create IConfigurationExporter port interface in `src/domain/config/ports/IConfigurationExporter.ts`
- [x] T010 [P] Create IConfigurationImporter port interface in `src/domain/config/ports/IConfigurationImporter.ts`
- [x] T011 Create ConfigurationServiceLocator in `src/infrastructure/config/services/ConfigurationServiceLocator.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Export Configuration (Priority: P1) 🎯 MVP

**Goal**: Enable administrators to export complete website configuration (database data and images) into a single downloadable ZIP package

**Independent Test**: Navigate to Export/Import tab, click export, verify a complete package is downloaded containing all configuration data and images

### Tests for User Story 1

- [x] T012 [P] [US1] Create export integration test in `test/integration/config-export.integration.test.tsx`
- [x] T013 [P] [US1] Create ExportConfiguration use case unit test in `test/unit/application/config/ExportConfiguration.test.ts`

### Implementation for User Story 1

- [x] T014 [P] [US1] Implement ZipExporter adapter in `src/infrastructure/config/adapters/ZipExporter.ts`
- [x] T015 [US1] Implement ExportConfiguration use case in `src/application/config/use-cases/ExportConfiguration.ts`
- [x] T016 [US1] Implement ConfigurationService (export logic) in `src/application/config/services/ConfigurationService.ts`
- [x] T017 [US1] Create GET /api/config/export route in `src/app/api/config/export/route.ts`
- [x] T018 [P] [US1] Create useExportConfiguration hook in `src/presentation/admin/hooks/useExportConfiguration.ts`
- [x] T019 [US1] Create ExportImportPanel component (export section) in `src/presentation/admin/components/ExportImportPanel.tsx`
- [x] T020 [US1] Update AdminSidebar to add Export/Import menu item in `src/presentation/admin/components/AdminSidebar.tsx`
- [x] T021 [US1] Create admin Export/Import page in `src/app/admin/export-import/page.tsx`
- [x] T022 [US1] Verify contrast compliance for light and dark modes in ExportImportPanel
- [x] T023 [US1] Verify YAGNI, DRY, KISS compliance for export implementation

**Checkpoint**: User Story 1 complete - admin can export configuration to ZIP file

---

## Phase 4: User Story 2 - Import Configuration (Priority: P2)

**Goal**: Enable administrators to import a previously exported configuration package, applying all data and images to the current environment

**Independent Test**: Upload a valid export package and verify all configuration data and images are correctly applied

### Tests for User Story 2

- [x] T024 [P] [US2] Create import integration test in `test/integration/config-import.integration.test.tsx`
- [x] T025 [P] [US2] Create ImportConfiguration use case unit test in `test/unit/application/config/ImportConfiguration.test.ts`

### Implementation for User Story 2

- [x] T026 [P] [US2] Implement ZipImporter adapter in `src/infrastructure/config/adapters/ZipImporter.ts`
- [x] T027 [P] [US2] Implement BackupService adapter in `src/infrastructure/config/adapters/BackupService.ts`
- [x] T028 [US2] Implement ImportConfiguration use case in `src/application/config/use-cases/ImportConfiguration.ts`
- [x] T029 [US2] Extend ConfigurationService (import logic) in `src/application/config/services/ConfigurationService.ts`
- [x] T030 [US2] Create POST /api/config/import route in `src/app/api/config/import/route.ts`
- [x] T031 [P] [US2] Create useImportConfiguration hook in `src/presentation/admin/hooks/useImportConfiguration.ts`
- [x] T032 [US2] Extend ExportImportPanel component (import section with file upload, confirm button) in `src/presentation/admin/components/ExportImportPanel.tsx`
- [x] T033 [US2] Add version compatibility error handling (show package vs current version mismatch)
- [x] T034 [US2] Verify backup/restore works on import failure
- [x] T035 [US2] Verify YAGNI, DRY, KISS compliance for import implementation

**Checkpoint**: User Story 2 complete - admin can import configuration from ZIP file with atomic backup/restore

---

## Phase 5: User Story 3 - Import Conflict Resolution (Priority: P3)

**Goal**: Show administrators a preview of what will be imported before applying changes, including warnings about data replacement

**Independent Test**: Upload a package to an environment with existing data and verify preview shows replacement warning

### Tests for User Story 3

- [x] T036 [P] [US3] Create preview integration test in `test/integration/config-import.integration.test.tsx` (extend existing)
- [x] T037 [P] [US3] Create PreviewImport use case unit test (covered by ImportConfiguration.test.ts)

### Implementation for User Story 3

- [x] T038 [US3] Implement PreviewImport use case (covered by ImportConfiguration.preview())
- [x] T039 [US3] Create POST /api/config/import/preview route (already in import route with ?preview=true)
- [x] T040 [US3] Update useImportConfiguration hook to handle preview flow in `src/presentation/admin/hooks/useImportConfiguration.ts`
- [x] T041 [US3] Extend ExportImportPanel component (preview display, warnings, confirm/cancel buttons) in `src/presentation/admin/components/ExportImportPanel.tsx`
- [x] T042 [US3] Add warning message when existing data will be replaced
- [x] T043 [US3] Verify YAGNI, DRY, KISS compliance for preview implementation

**Checkpoint**: All user stories complete - full export/import workflow with preview and warnings

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [x] T044 Run all integration tests: `docker compose run --rm app npm run test -- --testPathPattern="config-export|config-import"`
- [x] T045 Run type check: `docker compose run --rm app npm run build:strict`
- [x] T046 Run lint: `docker compose run --rm app npm run lint`
- [x] T047 [P] Validate quickstart.md scenarios work correctly
- [x] T048 Code cleanup and remove any unused imports or dead code

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can proceed sequentially in priority order (P1 → P2 → P3)
  - Or in parallel if team capacity allows
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Reuses ZipExporter from US1 for backup
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Builds on import flow from US2

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Domain/Infrastructure before Application layer
- Application layer before API routes
- API routes before UI components
- Core implementation before integration

### Parallel Opportunities

**Phase 1 (Setup)**:

```bash
# Run in parallel:
T003: Create domain directory structure
T004: Create application directory structure
T005: Create infrastructure directory structure
```

**Phase 2 (Foundational)**:

```bash
# Run in parallel:
T009: Create IConfigurationExporter port
T010: Create IConfigurationImporter port
```

**Phase 3 (User Story 1)**:

```bash
# Tests in parallel:
T012: Export integration test
T013: ExportConfiguration unit test

# Implementation in parallel:
T014: ZipExporter adapter
T018: useExportConfiguration hook
```

**Phase 4 (User Story 2)**:

```bash
# Tests in parallel:
T024: Import integration test
T025: ImportConfiguration unit test

# Implementation in parallel:
T026: ZipImporter adapter
T027: BackupService adapter
T031: useImportConfiguration hook
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Export)
4. **STOP and VALIDATE**: Test export independently - admin can download ZIP
5. Deploy/demo if ready - export is immediately useful for backups

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP - export works!)
3. Add User Story 2 → Test independently → Deploy/Demo (full round-trip)
4. Add User Story 3 → Test independently → Deploy/Demo (polished UX)
5. Each story adds value without breaking previous stories

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Integration tests verify full ZIP creation/extraction
- BackupService reuses ZipExporter for DRY compliance
