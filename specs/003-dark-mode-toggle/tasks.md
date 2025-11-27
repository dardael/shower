# Tasks: Dark Mode Toggle

**Feature**: Dark Mode Toggle  
**Branch**: `003-dark-mode-toggle`  
**Generated**: 2025-11-24  
**Total Tasks**: 49

## Overview

This task list implements a dark mode toggle button in the admin panel menu using Chakra UI v3's color mode system with Next.js 15. The system detects browser theme preference on first access, persists user choice in localStorage, and applies the theme only to the admin interface following DDD architecture principles.

## Phase 1: Setup

**Goal**: Initialize project structure and dependencies for dark mode feature

- [x] T001 Create domain layer structure for theme management in src/domain/settings/
- [x] T002 Create application layer structure for theme use cases in src/application/settings/
- [x] T003 Create infrastructure layer structure for theme adapters in src/infrastructure/settings/
- [x] T004 Create presentation layer structure for theme components in src/presentation/admin/components/
- [x] T005 Create test directory structure for theme feature in test/unit/
- [x] T006 Verify Chakra UI v3 and next-themes dependencies are installed
- [x] T007 Create integration test directory structure in test/integration/

## Phase 2: Foundational

**Goal**: Implement core domain entities and value objects that all user stories depend on

- [x] T008 [P] Create ThemeMode value object in src/domain/settings/value-objects/ThemeMode.ts
- [x] T009 [P] Create StorageKey value object in src/domain/settings/value-objects/StorageKey.ts
- [x] T010 [P] Create BrowserThemePreference entity in src/domain/settings/entities/BrowserThemePreference.ts
- [x] T011 [P] Create IThemeStorageService interface in src/domain/settings/services/IThemeStorageService.ts
- [x] T012 [P] Create IBrowserThemeDetector interface in src/domain/settings/services/IBrowserThemeDetector.ts
- [x] T013 [P] Create IThemePreferenceRepository interface in src/domain/settings/repositories/IThemePreferenceRepository.ts
- [x] T014 [P] Create BrowserStorageAdapter in src/infrastructure/settings/adapters/BrowserStorageAdapter.ts
- [x] T015 [P] Create LocalStorageThemeService in src/application/settings/services/LocalStorageThemeService.ts

## Phase 3: User Story 1 - Initial Theme Detection

**Goal**: Automatically detect and apply browser theme preference on first access

**Independent Test**: Access admin panel with different browser theme settings and verify correct theme is applied automatically

**Implementation Tasks**:

- [x] T016 [US1] Create GetThemePreference use case in src/application/settings/GetThemePreference.ts
- [x] T017 [US1] Create BrowserThemeDetector service in src/infrastructure/settings/services/BrowserThemeDetector.ts
- [x] T018 [US1] Create ThemeProvider component in src/presentation/shared/contexts/DynamicThemeProvider.tsx
- [x] T019 [US1] Create useTheme hook in src/presentation/admin/hooks/useTheme.ts
- [x] T020 [US1] Update admin layout to integrate theme provider in src/app/admin/layout.tsx
- [x] T021 [US1] Create BrowserThemePreference entity tests in test/unit/domain/settings/entities/BrowserThemePreference.test.ts
- [x] T022 [US1] Create BrowserThemeDetector tests in test/unit/infrastructure/settings/services/BrowserThemeDetector.test.ts
- [x] T023 [US1] Create GetThemePreference tests in test/unit/application/settings/GetThemePreference.test.ts

## Phase 4: User Story 2 - Theme Toggle Functionality

**Goal**: Provide toggle button for switching between light and dark modes

**Independent Test**: Click toggle button and verify theme changes immediately and persists across page refreshes

**Implementation Tasks**:

- [x] T024 [US2] Create UpdateThemePreference use case in src/application/settings/UpdateThemePreference.ts
- [x] T025 [US2] Create DarkModeToggle component in src/presentation/admin/components/DarkModeToggle.tsx
- [x] T026 [US2] Update AdminSidebar to include theme toggle in src/presentation/admin/components/AdminSidebar.tsx
- [x] T027 [US2] Create DarkModeToggle component tests in test/unit/presentation/admin/components/DarkModeToggle.test.tsx
- [x] T028 [US2] Create UpdateThemePreference tests in test/unit/application/settings/UpdateThemePreference.test.ts
- [x] T029 [US2] Create useTheme hook tests in test/unit/presentation/admin/hooks/useTheme.test.ts

## Phase 5: User Story 3 - Browser-Local Theme Persistence

**Goal**: Ensure theme preference persists in browser localStorage across sessions

**Independent Test**: Set preference, close/reopen browser, and verify preference is maintained

**Implementation Tasks**:

- [x] T030 [US3] Enhance LocalStorageThemeService with error handling in src/application/settings/services/LocalStorageThemeService.ts
- [x] T031 [US3] Add storage availability detection to BrowserStorageAdapter in src/infrastructure/settings/adapters/BrowserStorageAdapter.ts
- [x] T032 [US3] Update DarkModeToggle to handle disabled state in src/presentation/admin/components/DarkModeToggle.tsx
- [x] T033 [US3] Create theme persistence integration tests in test/integration/theme-persistence.integration.test.ts
- [x] T034 [US3] Create LocalStorageThemeService tests including quota exceeded scenario in test/unit/application/settings/LocalStorageThemeService.test.ts
- [x] T035 [US3] Create BrowserStorageAdapter tests in test/unit/infrastructure/settings/adapters/BrowserStorageAdapter.test.ts
- [x] T036 [FR-010] Implement localStorage quota exceeded handling with toast notification in LocalStorageThemeService

## Phase 6: Polish & Cross-Cutting Concerns

**Goal**: Complete feature with accessibility, performance optimization, and production readiness

- [x] T037 [QR-002] Add comprehensive error handling with FrontendLog/BackendLog integration
- [x] T038 [QR-003] Verify admin panel authentication middleware protects theme toggle functionality
- [x] T039 [QR-003] Add authorization checks to theme-related API endpoints (if any)
- [x] T040 [FR-009] Implement WCAG 2.1 AA accessibility features (ARIA labels, keyboard navigation, color contrast) in DarkModeToggle component
- [x] T041 [FR-006,FR-008] Add visual feedback for storage unavailability with explanatory tooltip
- [x] T042 [SC-001] Optimize theme switching performance to meet 1 second requirement
- [x] T043 [SC-001] Implement performance monitoring and measurement for theme switching operations
- [x] T044 [QR-001] Update documentation and README with theme feature usage
- [x] T045 [QR-004] Verify TypeScript strict mode compliance across all new files
- [x] T046 [QR-004] Run linting and formatting checks on all new code
- [x] T047 [QR-004] Validate Chakra UI v3 component usage follows project standards
- [x] T048 [FR-007] Verify theme applies only to admin interface, not public-facing pages
- [x] T049 [QR-004] Final integration testing and bug fixes

## Dependencies

### User Story Completion Order

1. **User Story 1** (Initial Theme Detection) - No dependencies
2. **User Story 2** (Theme Toggle Functionality) - Depends on User Story 1
3. **User Story 3** (Browser-Local Theme Persistence) - No dependencies (can be implemented independently)

### Critical Path

```
Phase 1 (Setup) → Phase 2 (Foundational) → User Story 1 → User Story 2 → User Story 3 → Phase 6 (Polish)
```

## Parallel Execution Opportunities

### Within User Story 1

- Tasks T016, T017, T018, T019 can be developed in parallel
- Tests T021, T022, T023 can be created in parallel with implementation

### Within User Story 2

- Tasks T024, T025 can be developed in parallel
- Tests T027, T028, T029 can be created in parallel with implementation

### Within User Story 3

- Tasks T030, T031, T032 can be developed in parallel
- Tests T034, T035 can be created in parallel with implementation

### Within Polish Phase

- All tasks T036-T048 can be executed in parallel as they are independent improvements

## Implementation Strategy

### MVP Scope (User Story 1 Only)

For minimum viable product, implement only User Story 1 to provide automatic theme detection without toggle functionality:

- Complete Phase 1 and Phase 2
- Implement User Story 1 tasks (T016-T023)
- Skip toggle button and persistence features

### Incremental Delivery

1. **First Increment**: Theme detection and provider setup
2. **Second Increment**: Toggle button functionality
3. **Third Increment**: Persistence and error handling
4. **Final Increment**: Polish, accessibility, and production optimization

### Risk Mitigation

- Test localStorage availability early (T031)
- Implement hydration mismatch prevention in theme provider (T018)
- Add comprehensive error handling before persistence (T036)
- Validate accessibility throughout development (T037)

## Testing Strategy

### Unit Tests Coverage

- Domain entities and value objects: 100%
- Application services: 100%
- Infrastructure adapters: 100%
- Presentation components: 90%+ (focus on user interactions)

### Integration Tests

- Theme persistence across browser sessions
- Storage unavailability scenarios
- Cross-tab synchronization
- End-to-end theme workflow

### Performance Tests

- Theme switching under 1 second (per SC-001)
- Initial theme loading under 1 second
- Storage operations under 1 second

## Success Criteria Validation

Each user story includes specific test criteria that can be validated independently:

- **User Story 1**: Automatic theme detection works correctly
- **User Story 2**: Toggle functionality with immediate visual feedback
- **User Story 3**: Persistence across browser sessions

All tasks follow the strict checklist format with proper IDs, priority markers, story labels, and specific file paths for immediate execution by development agents.
