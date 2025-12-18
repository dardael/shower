# Implementation Plan: Scheduled Restart Configuration

**Branch**: `001-scheduled-restart-config` | **Date**: 2025-12-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-scheduled-restart-config/spec.md`

## Summary

Enable website maintainers to configure a daily hour (0-23) when the production Next.js server should automatically restart. The feature includes an admin UI for configuration, persistent storage of settings, and a scheduling mechanism that triggers graceful server restarts at the configured time.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router + React 19  
**Primary Dependencies**: Chakra UI v3, tsyringe (DI), Mongoose, node-cron (for scheduling)  
**Storage**: MongoDB via Mongoose (existing settings infrastructure)  
**Testing**: Jest for unit tests and integration tests (only when explicitly requested)  
**Target Platform**: Docker container with process management (PM2 or Docker restart)  
**Project Type**: Web application (Next.js)  
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)  
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, consistent theme color usage, YAGNI (minimal implementation), DRY (no duplication), KISS (simple code), configuration portability (sync export/import on config changes)  
**Scale/Scope**: Single-instance production server, single admin user

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Status | Notes                                                                                                                                 |
| ------------------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| I. Architecture-First Development    | PASS   | Will follow DDD with domain entity (ScheduledRestartConfig), application service, infrastructure adapter, and presentation components |
| II. Focused Testing Approach         | PASS   | No tests unless explicitly requested; will avoid over-mocking                                                                         |
| III. Simplicity-First Implementation | PASS   | No performance monitoring; simple scheduling mechanism                                                                                |
| IV. Security by Default              | PASS   | Admin-only access via existing auth middleware; settings protected by authentication                                                  |
| V. Clean Architecture Compliance     | PASS   | Proper layer separation with DI; cross-layer dependencies flow inward                                                                 |
| VI. Accessibility-First Design       | PASS   | Will use Chakra UI semantic tokens for proper contrast                                                                                |
| VII. YAGNI                           | PASS   | Minimal implementation: hour config, enable/disable, restart trigger                                                                  |
| VIII. DRY                            | PASS   | Will use existing settings infrastructure patterns                                                                                    |
| IX. KISS                             | PASS   | Simple hour-based scheduling; no complex cron expressions                                                                             |
| X. Configuration Portability         | PASS   | Will integrate with existing export/import system                                                                                     |

**Gate Result**: PASS - All principles satisfied. Proceeding to Phase 0 research.

## Project Structure

### Documentation (this feature)

```text
specs/001-scheduled-restart-config/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── domain/
│   └── config/
│       └── entities/
│           └── ScheduledRestartConfig.ts
├── application/
│   └── config/
│       └── use-cases/
│           ├── GetScheduledRestartConfig.ts
│           └── UpdateScheduledRestartConfig.ts
├── infrastructure/
│   └── config/
│       ├── repositories/
│       │   └── MongoScheduledRestartConfigRepository.ts
│       └── services/
│           └── RestartSchedulerService.ts
├── presentation/
│   └── admin/
│       └── components/
│           └── ScheduledRestartConfigForm.tsx
└── app/
    └── api/
        └── admin/
            └── scheduled-restart/
                └── route.ts
```

**Structure Decision**: Follows existing DDD/Hexagonal architecture with domain entity, application use cases, infrastructure repository and scheduler service, and presentation component. Integrates with existing admin settings patterns.

## Complexity Tracking

_No violations to justify - all gates passed._

## Post-Design Constitution Re-Check

_GATE: Verify design artifacts comply with constitution principles._

| Principle                            | Status | Notes                                                                                           |
| ------------------------------------ | ------ | ----------------------------------------------------------------------------------------------- |
| I. Architecture-First Development    | PASS   | data-model.md defines ScheduledRestartConfig entity; contracts define clear API boundaries      |
| II. Focused Testing Approach         | PASS   | No test files specified; tests only when requested                                              |
| III. Simplicity-First Implementation | PASS   | Simple process.exit(0) with Docker restart; no complex monitoring                               |
| IV. Security by Default              | PASS   | API routes require admin authentication; no sensitive data exposed                              |
| V. Clean Architecture Compliance     | PASS   | Domain entity → Application use cases → Infrastructure repository/scheduler → Presentation form |
| VI. Accessibility-First Design       | PASS   | Using Chakra UI components with semantic tokens; form uses proper labels                        |
| VII. YAGNI                           | PASS   | Minimal scope: hour config, enable/disable, automatic restart - no extras                       |
| VIII. DRY                            | PASS   | Reuses existing WebsiteSetting pattern and MongooseWebsiteSettingsRepository                    |
| IX. KISS                             | PASS   | Simple hour selection (0-23), toggle for enable/disable, node-cron for scheduling               |
| X. Configuration Portability         | PASS   | Integrates with existing settings export/import via VALID_SETTING_KEYS extension                |

**Post-Design Gate Result**: PASS - Design artifacts comply with all constitution principles. Ready for task generation.
