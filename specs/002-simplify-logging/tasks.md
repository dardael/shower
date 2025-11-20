# Implementation Tasks: Simplify Logging System

**Feature**: 002-simplify-logging  
**Generated**: 2025-11-20  
**Total Tasks**: 62

## Overview

This task list implements the simplification of the logging system by replacing the enhanced logging infrastructure with simple console logging for both frontend and backend. The implementation maintains existing interfaces while removing complex components.

## Phase 1: Setup (Project Initialization)

**Goal**: Prepare the project for logging system changes and establish environment configuration.

- [ ] T001 Create backup branch before logging system changes
- [ ] T002 Add LOG_LEVEL environment variable to .env file with DEBUG default
- [ ] T003 Update .env.local template with LOG_LEVEL documentation
- [ ] T004 Create simple log level utility functions in src/infrastructure/shared/utils/logLevelUtils.ts
- [ ] T005 Document logging changes in README.md development section

## Phase 2: Foundational (Blocking Prerequisites)

**Goal**: Create simple logging wrapper objects that will replace complex infrastructure.

- [ ] T006 Create FrontendLog wrapper class in src/infrastructure/shared/services/FrontendLog.ts
- [ ] T007 Create BackendLog wrapper class in src/infrastructure/shared/services/BackendLog.ts
- [ ] T008 [P] Implement log level filtering in FrontendLog wrapper
- [ ] T009 [P] Implement log level filtering in BackendLog wrapper
- [ ] T010 [P] Add performance measurement methods to both log wrappers (startTimer, endTimer)
- [ ] T011 Update dependency injection container to use BackendLog wrapper

## Phase 3: User Story 1 - Console Logging for Frontend (Priority: P1)

**Goal**: Enable simple console logging for frontend components while maintaining developer experience.

**Independent Test**: Implement console logging in a single component and verify logs appear in browser console during development.

- [ ] T012 [US1] Adapt useLogger hook to use FrontendLog wrapper internally in src/presentation/shared/hooks/useLogger.ts
- [ ] T013 [US1] Remove LoggerProvider context from component tree if it exists
- [ ] T014 [US1] Remove LoggerContext if it exists in src/presentation/shared/contexts/
- [ ] T015 [US1] [P] Update a sample frontend component to test console logging functionality
- [ ] T016 [US1] [P] Verify console.log() calls appear in browser console during development
- [ ] T017 [US1] [P] Verify console.error() calls appear in browser console during development
- [ ] T018 [US1] [P] Verify console.warn() calls appear in browser console during development
- [ ] T019 [US1] [P] Verify console.debug() calls appear in browser console during development
- [ ] T020 [US1] Test log level filtering works correctly in frontend components

## Phase 4: User Story 2 - Console Logging for Backend (Priority: P1)

**Goal**: Enable simple console logging for backend services and API routes.

**Independent Test**: Implement console logging in a single API endpoint and verify logs appear in server console during execution.

- [ ] T021 [US2] Update Logger interface implementation to use BackendLog wrapper in src/application/shared/Logger.ts
- [ ] T022 [US2] [P] Update API route logging in src/app/api/settings/route.ts
- [ ] T023 [US2] [P] Update API route logging in src/app/api/auth/[...all]/route.ts
- [ ] T024 [US2] [P] Update API route logging in src/app/api/settings/icon/route.ts
- [ ] T025 [US2] [P] Update API route logging in src/app/api/settings/name/route.ts
- [ ] T026 [US2] [P] Update API route logging in src/app/api/settings/social-networks/route.ts
- [ ] T027 [US2] [P] Update API route logging in src/app/api/icons/[filename]/route.ts
- [ ] T028 [US2] [P] Update API route logging in src/app/api/logs/token/route.ts
- [ ] T029 [US2] [P] Update API route logging in src/app/api/logs/route.ts
- [ ] T030 [US2] [P] Update service layer logging in src/application/settings/services/
- [ ] T031 [US2] [P] Update service layer logging in src/application/auth/services/
- [ ] T032 [US2] [P] Verify console.log() calls appear in server console during execution
- [ ] T033 [US2] [P] Verify console.error() calls appear in server console during execution
- [ ] T034 [US2] [P] Verify console.warn() calls appear in server console during execution
- [ ] T035 [US2] [P] Verify console.debug() calls appear in server console during execution
- [ ] T036 [US2] Test log level filtering works correctly in backend services

## Phase 5: User Story 3 - Remove Complex Logging Infrastructure (Priority: P2)

**Goal**: Remove all complex logging infrastructure components and dependencies.

**Independent Test**: Remove logging infrastructure files and ensure the application still functions with console logging.

- [ ] T037 [US3] Remove AsyncFileLoggerAdapter from src/infrastructure/shared/adapters/
- [ ] T038 [US3] Remove RemoteLoggerAdapter from src/infrastructure/shared/adapters/
- [ ] T039 [US3] Remove ContextualLogger from src/application/shared/
- [ ] T040 [US3] Remove PerformanceMonitor from src/application/shared/
- [ ] T041 [US3] Remove EnhancedLogFormatterService from src/domain/shared/services/
- [ ] T042 [US3] Remove LogRotationService from src/infrastructure/shared/services/
- [ ] T043 [US3] Remove POST /api/logs endpoint from src/app/api/logs/route.ts
- [ ] T044 [US3] Remove logging-related middleware if it exists
- [ ] T045 [US3] Remove logging-related dependencies from package.json
- [ ] T046 [US3] Clean up any remaining orphaned imports related to logging infrastructure
- [ ] T047 [US3] Verify application builds successfully after infrastructure removal
- [ ] T048 [US3] Verify application runs without errors after infrastructure removal

## Phase 6: Testing & Validation

**Goal**: Update tests to work with simplified logging system and ensure functionality is preserved.

- [ ] T049 [P] Update unit tests to mock console methods instead of logger instances
- [ ] T050 [P] Update integration tests to verify console output instead of log files
- [ ] T051 [P] Remove logging infrastructure tests that are no longer relevant
- [ ] T052 [P] Test frontend logging functionality across different log levels
- [ ] T053 [P] Test backend logging functionality across different log levels
- [ ] T054 [P] Verify performance measurement methods work correctly
- [ ] T055 [P] Run full test suite to ensure no regressions
- [ ] T056 [P] Validate DDD domain boundaries are maintained in logging implementation
- [ ] T057 [P] Validate hexagonal architecture layer separation for logging components
- [ ] T058 [P] Verify dependency direction follows inward flow rule
- [ ] T059 [P] Validate clean architecture principles compliance

## Phase 7: Polish & Cross-Cutting Concerns

**Goal**: Final cleanup, documentation updates, and performance validation.

- [ ] T056 Update AGENTS.md to reflect simplified logging approach
- [ ] T057 Remove enhanced logging system rules from .opencode/rules/
- [ ] T058 Update development documentation with console logging guidelines
- [ ] T059 Verify bundle size reduction after removing logging infrastructure
- [ ] T060 Perform final end-to-end testing of the complete application
- [ ] T061 Create commit with all logging system simplification changes

## Dependencies

### User Story Completion Order

1. **Phase 1 (Setup)** - Must complete first
2. **Phase 2 (Foundational)** - Must complete before any user stories
3. **Phase 3 (US1)** - Frontend logging - Independent
4. **Phase 4 (US2)** - Backend logging - Independent
5. **Phase 5 (US3)** - Infrastructure removal - Depends on US1 & US2
6. **Phase 6 (Testing)** - Depends on US1, US2, US3
7. **Phase 7 (Polish)** - Final phase

### Parallel Execution Opportunities

**Phase 3 (US1)**: Tasks T015-T019 can be executed in parallel as they test different console methods.

**Phase 4 (US2)**: Tasks T022-T031 can be executed in parallel as they update different API routes and services.

**Phase 5 (US3)**: Tasks T037-T046 can be executed in parallel as they remove different infrastructure components.

**Phase 6 (Testing)**: Tasks T049-T055 can be executed in parallel as they test different aspects.

## Implementation Strategy

### MVP Scope (Recommended First Delivery)

**Minimum Viable Product**: Phase 1 + Phase 2 + Phase 3 (US1 only)

- Enables frontend console logging immediately
- Provides foundation for backend changes
- Allows immediate developer productivity gains
- Can be shipped independently for quick feedback

### Incremental Delivery

1. **Sprint 1**: Setup + Foundational + Frontend logging (US1)
2. **Sprint 2**: Backend logging (US2) + Testing updates
3. **Sprint 3**: Infrastructure removal (US3) + Polish

### Risk Mitigation

- Keep existing interfaces to minimize breaking changes
- Implement log level filtering to prevent console spam in production
- Maintain performance measurement interface for developer experience
- Test thoroughly at each phase to catch regressions early

## Success Criteria Validation

- **SC-001**: Frontend logging complexity reduced by 90% (measured by lines of logging-related code)
- **SC-002**: Backend logging complexity reduced by 90% (measured by lines of logging-related code)
- **SC-003**: Developer debugging time improved by 50% (measured by time to locate and fix issues)
- **SC-004**: Application bundle size reduced by removing logging infrastructure (measured by kilobytes)
- **SC-005**: Code maintainability score improved (measured by reduced cyclomatic complexity in logging areas)

## Notes

- All tasks maintain existing interfaces to minimize breaking changes
- Console logging is filtered by LOG_LEVEL environment variable
- Performance measurement methods are preserved for developer experience
- Tests are updated to mock console methods instead of complex logger instances
- The implementation follows clean architecture principles with proper separation of concerns
