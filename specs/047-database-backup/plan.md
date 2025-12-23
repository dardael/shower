# Implementation Plan: Database Backup Configuration

**Branch**: `047-database-backup` | **Date**: 2025-12-22 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/047-database-backup/spec.md`

## Summary

Enable administrators to configure scheduled daily MongoDB database backups with retention management and restore functionality. The feature integrates into the existing maintenance tab, using node-cron for scheduling (existing pattern), mongodump/mongorestore for backup operations, and follows the established DDD architecture with tsyringe dependency injection.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router + React 19
**Primary Dependencies**: Chakra UI v3, tsyringe (DI), node-cron (scheduling), Mongoose, archiver (ZIP), child_process (mongodump/mongorestore)
**Storage**: MongoDB via Mongoose (backup configuration), local filesystem (`temp/backups/`) for backup files
**Testing**: Jest for unit tests and integration tests (only when explicitly requested)
**Target Platform**: Linux server (Docker container), web browser for admin UI
**Project Type**: Web application (Next.js monolith)
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, consistent theme color usage, YAGNI (minimal implementation), DRY (no duplication), KISS (simple code), configuration portability (sync export/import on config changes), French localization (all visible text in French)
**Scale/Scope**: Single administrator, small-to-medium database size (suitable for file-based backup)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                             | Status  | Notes                                                                                        |
| ------------------------------------- | ------- | -------------------------------------------------------------------------------------------- |
| I. Architecture-First (DDD/Hexagonal) | ✅ PASS | Following existing patterns: domain entities, application use-cases, infrastructure adapters |
| II. Focused Testing                   | ✅ PASS | Tests only when explicitly requested                                                         |
| III. Simplicity-First                 | ✅ PASS | No performance monitoring in production code                                                 |
| IV. Security by Default               | ✅ PASS | Admin-only access via existing authentication                                                |
| V. Clean Architecture                 | ✅ PASS | Proper layer separation with dependency injection                                            |
| VI. Accessibility-First               | ✅ PASS | Using Chakra UI semantic tokens for contrast                                                 |
| VII. YAGNI                            | ✅ PASS | Minimal implementation for current requirements                                              |
| VIII. DRY                             | ✅ PASS | Reusing existing patterns (scheduler, file storage)                                          |
| IX. KISS                              | ✅ PASS | Simple mongodump/mongorestore approach                                                       |
| X. Configuration Portability          | ✅ PASS | Backup config will sync with export/import                                                   |
| XI. French Localization               | ✅ PASS | All UI text in French                                                                        |

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/admin/maintenance/
│   └── page.tsx                          # Existing - add backup section
├── domain/backup/
│   ├── entities/
│   │   ├── BackupConfiguration.ts        # NEW: Backup settings entity
│   │   └── DatabaseBackup.ts             # NEW: Backup record entity
│   └── ports/
│       ├── IBackupConfigurationRepository.ts  # NEW: Config port
│       └── IDatabaseBackupService.ts     # NEW: Backup operations port
├── application/backup/
│   ├── use-cases/
│   │   ├── GetBackupConfiguration.ts     # NEW
│   │   ├── UpdateBackupConfiguration.ts  # NEW
│   │   ├── CreateDatabaseBackup.ts       # NEW
│   │   ├── ListDatabaseBackups.ts        # NEW
│   │   ├── RestoreDatabaseBackup.ts      # NEW
│   │   └── DeleteDatabaseBackup.ts       # NEW
│   └── services/
│       └── BackupSchedulerService.ts     # NEW: Cron scheduler
├── infrastructure/backup/
│   ├── adapters/
│   │   ├── MongoBackupConfigurationRepository.ts  # NEW
│   │   └── MongoDumpBackupService.ts     # NEW: mongodump/mongorestore
│   └── models/
│       ├── BackupConfigurationModel.ts   # NEW: Mongoose schema
│       └── DatabaseBackupModel.ts        # NEW: Mongoose schema
├── presentation/admin/
│   ├── components/
│   │   └── BackupConfigurationForm.tsx   # NEW: UI component
│   └── hooks/
│       └── useBackupConfiguration.ts     # NEW: React hook

test/
├── unit/
│   ├── domain/backup/
│   ├── application/backup/
│   └── presentation/admin/
└── integration/
    └── backup-configuration.integration.test.tsx
```

**Structure Decision**: Following existing DDD/Hexagonal architecture with domain-driven folder structure per feature domain (backup/). Matches existing patterns from config/, menu/, settings/ domains.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
