# Implementation Tasks: Toast Notifications for Website Settings

**Feature**: Toast Notifications for Website Settings  
**Branch**: `001-toast-notifications`  
**Date**: 2025-11-17  
**Spec**: `/specs/001-toast-notifications/spec.md`

## Summary

Replace inline success/error messages in website settings forms with consistent Chakra UI v3 toast notifications that match the behavior and appearance of existing social network save notifications. Implementation will extract a reusable toast hook from the social networks pattern and apply it to website name, icon, and theme color save operations.

## Implementation Strategy

**MVP First**: Implement User Story 1 (basic toast replacement) to deliver immediate value
**Incremental Delivery**: Add consistency features in User Story 2
**Independent Testing**: Each user story can be tested independently

## Phase 1: Setup

- [x] T001 Create feature branch `001-toast-notifications` from main
- [x] T002 Review existing social networks toast implementation in src/presentation/admin/hooks/useSocialNetworksForm.ts
- [x] T003 Review current website settings form implementation in src/presentation/admin/components/WebsiteSettingsForm.tsx
- [x] T004 Verify global toaster configuration in src/presentation/shared/components/ui/toaster.tsx

## Phase 2: Foundational

- [x] T005 Create reusable toast hook in src/presentation/admin/hooks/useToastNotifications.ts
- [x] T006 [P] Create unit tests for toast hook in test/unit/presentation/admin/hooks/useToastNotifications.test.ts
- [x] T007 Update test dependencies registry in test/e2e/fixtures/test-dependencies.ts
- [x] T008 [P] Integrate enhanced logging system in toast hook for all toast operations
- [x] T009 [P] Add structured logging for toast creation, display, and cleanup events

## Phase 3: User Story 1 - Replace Inline Messages with Toast Notifications

**Story Goal**: Replace inline success/error messages with toast notifications for all website settings save operations
**Independent Test**: Save website name, icon, and theme color settings individually and verify toast notifications appear correctly for both success and error cases

### Implementation Tasks

- [x] T010 [US1] Update WebsiteSettingsForm to use toast hook in src/presentation/admin/components/WebsiteSettingsForm.tsx
- [x] T011 [US1] Remove inline message state and Text components from WebsiteSettingsForm
- [x] T012 [US1] Convert website name save handler to use toast notifications
- [x] T013 [US1] Convert theme color save handler to use toast notifications
- [x] T014 [US1] Convert fetch error handling to use toast notifications
- [x] T015 [US1] Add proper cleanup on component unmount for toast timeouts

### Testing Tasks

- [x] T016 [P] [US1] Create e2e tests for website settings toast notifications in test/e2e/admin/website-settings-toast.spec.ts
- [x] T017 [P] [US1] Update Playwright configuration in playwright.config.ts for new test file
- [x] T018 [P] [US1] Add test data-testid attributes to WebsiteSettingsForm for toast testing

## Phase 4: User Story 2 - Maintain Consistent Toast Behavior

**Story Goal**: Ensure toast notifications for website settings behave identically to social network save notifications
**Independent Test**: Compare behavior, appearance, and timing of toast notifications between website settings and social network saves

### Implementation Tasks

- [x] T019 [US2] Implement toast duration matching social networks (3 seconds)
- [x] T020 [US2] Implement toast placement matching social networks (bottom-end)
- [x] T021 [US2] Implement toast styling matching social networks (success/error types)
- [x] T022 [US2] Implement toast stacking behavior matching social networks
- [x] T023 [US2] Implement deduplication behavior matching social networks
- [x] T024 [US2] Implement conflict notification for rapid saves with "Previous save request was superseded" message

### Testing Tasks

- [x] T025 [P] [US2] Add e2e tests for toast consistency comparison in test/e2e/admin/website-settings-toast.spec.ts
- [x] T026 [P] [US2] Add performance tests for toast display latency (<200ms)
- [x] T027 [P] [US2] Add e2e tests for conflict notification behavior during rapid saves

## Phase 5: Polish & Cross-Cutting Concerns

- [x] T028 Run comprehensive unit tests for all toast functionality
- [x] T029 Run e2e tests for complete user workflows
- [x] T030 Verify enhanced logging system works correctly during toast operations (no console methods)
- [x] T031 Verify memory cleanup and no memory leaks from toast timeouts
- [x] T032 Update documentation in doc/technical.md if needed
- [x] T033 Final code review and cleanup

## Dependencies

### Story Completion Order

1. **User Story 1** (P1) - Core functionality, no dependencies
2. **User Story 2** (P2) - Depends on User Story 1 completion

### Parallel Execution Opportunities

**Within User Story 1**:

- Tasks T010, T012, T013, T014 can be executed in parallel (different save handlers)
- Tasks T008, T009 can be executed in parallel (logging infrastructure)
- Tasks T016, T017, T018 can be executed in parallel (testing infrastructure)

**Within User Story 2**:

- Tasks T019, T020, T021, T022, T023 can be executed in parallel (different consistency aspects)
- Tasks T025, T026, T027 can be executed in parallel (testing)

## Implementation Strategy

### MVP Scope (User Story 1 Only)

Deliver immediate value by replacing inline messages with basic toast notifications. This provides the core user benefit and can be shipped independently.

### Full Feature (User Story 1 + 2)

Complete consistency with existing social network behavior for a polished, professional user experience.

### Risk Mitigation

- Leverage existing, proven social networks toast pattern
- Maintain backward compatibility during transition
- Comprehensive testing at unit and e2e levels
- Memory leak prevention through proper cleanup

## Success Criteria

- [x] 100% of website setting save operations display toast notifications instead of inline messages
- [x] Toast notifications appear within 200ms of save operation completion
- [x] Toast notifications automatically disappear after 3 seconds
- [x] Toast notifications appear in bottom-right corner of screen
- [x] Zero inline messages remain in website settings forms
- [x] All tests pass (unit + e2e)
- [x] No memory leaks from toast timeouts
- [x] Consistent behavior with social network toasts

## File Structure

```
src/
├── presentation/
│   ├── admin/
│   │   ├── components/
│   │   │   └── WebsiteSettingsForm.tsx    # Modified: Remove inline messages, add toast integration
│   │   └── hooks/
│   │       ├── useSocialNetworksForm.ts    # Reference: Existing toast pattern
│   │       └── useToastNotifications.ts    # Created: Reusable toast hook
│   └── shared/
│       └── components/
│           └── ui/
│               └── toaster.tsx             # Existing: Global toaster instance

test/
├── unit/
│   └── presentation/
│       └── admin/
│           └── hooks/
│               └── useToastNotifications.test.ts    # Created: Hook unit tests
└── e2e/
    ├── admin/
    │   └── website-settings-toast.spec.ts           # Created: E2e toast tests
    ├── fixtures/
    │   └── test-dependencies.ts                     # Modified: Add test dependencies
    └── playwright.config.ts                         # Modified: Add test project
```

## Total Task Count

**Total Tasks**: 33
**Setup Phase**: 4 tasks
**Foundational Phase**: 5 tasks (2 implementation + 2 logging + 1 infrastructure)
**User Story 1**: 10 tasks (6 implementation + 3 testing + 1 cleanup)
**User Story 2**: 8 tasks (6 implementation + 2 testing)
**Polish Phase**: 6 tasks

**Parallelizable Tasks**: 15 (marked with [P])
**Critical Path Tasks**: 18 (must be executed sequentially)

## Testing Strategy

### Unit Tests

- Toast hook functionality (success/error messages, deduplication, cleanup)
- Mock Chakra UI toaster for isolated testing
- Test edge cases (rapid calls, cleanup, memory management)

### E2E Tests

- Complete user workflows for each setting type
- Toast appearance, content, and timing verification
- Error scenario testing
- Performance validation (display latency)
- Consistency comparison with social network toasts

### Manual Testing

- Visual verification of toast styling and positioning
- User interaction testing (auto-dismiss behavior)
- Cross-browser compatibility check
- Mobile responsiveness verification
