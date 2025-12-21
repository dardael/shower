# Implementation Tasks: Selling Toggle Configuration

**Feature Branch**: `043-selling-toggle-config`  
**Generated**: 2025-12-21  
**Source**: spec.md, codebase research

## Overview

This task list implements the selling toggle configuration feature that allows administrators to enable/disable selling mode, which controls the visibility of product-related UI elements.

**Total Tasks**: 24  
**User Stories**: 3 (all P1 priority)  
**Parallel Opportunities**: 8 tasks can run in parallel

## Phase 1: Setup

Goal: Prepare foundation for selling toggle feature

- [x] T001 Add SELLING_ENABLED constant to src/domain/settings/constants/SettingKeys.ts
- [x] T002 [P] Create SellingEnabled value object in src/domain/settings/value-objects/SellingEnabled.ts
- [x] T003 [P] Add createSellingEnabled factory method to src/domain/settings/entities/WebsiteSetting.ts

## Phase 2: Foundational (Domain & Application Layer)

Goal: Implement core business logic and use cases

- [x] T004 Create IGetSellingEnabled interface in src/application/settings/IGetSellingEnabled.ts
- [x] T005 [P] Create IUpdateSellingEnabled interface in src/application/settings/IUpdateSellingEnabled.ts
- [x] T006 Implement GetSellingEnabled use case in src/application/settings/GetSellingEnabled.ts
- [x] T007 Implement UpdateSellingEnabled use case in src/application/settings/UpdateSellingEnabled.ts
- [x] T008 Add selling-enabled default value case to src/infrastructure/settings/repositories/MongooseWebsiteSettingsRepository.ts
- [x] T009 Register GetSellingEnabled and UpdateSellingEnabled in src/infrastructure/container.ts
- [x] T010 Add getGetSellingEnabled and getUpdateSellingEnabled to SettingsServiceLocator in src/infrastructure/container.ts

## Phase 3: User Story 1 - Enable Selling Mode

Goal: Administrator can enable selling mode and see product-related UI elements

**Independent Test**: Toggle selling mode on in admin settings, verify Products menu item and editor button become visible

- [x] T011 [US1] Add sellingEnabled to GetSettingsResponse interface in src/app/api/settings/types.ts
- [x] T012 [P] [US1] Add sellingEnabled to UpdateSettingsRequest interface in src/app/api/settings/types.ts
- [x] T013 [US1] Add sellingEnabled handling to GET endpoint in src/app/api/settings/route.ts
- [x] T014 [US1] Add sellingEnabled handling to POST endpoint in src/app/api/settings/route.ts
- [x] T015 [US1] Create SellingConfigContext provider in src/presentation/shared/contexts/SellingConfigContext.tsx
- [x] T016 [US1] Create SellingToggleSelector component in src/presentation/admin/components/SellingToggleSelector.tsx
- [x] T017 [US1] Add SellingToggleSelector to WebsiteSettingsForm in src/presentation/admin/components/WebsiteSettingsForm.tsx

## Phase 4: User Story 2 - Disable Selling Mode

Goal: Administrator can disable selling mode and product-related UI elements are hidden

**Independent Test**: Toggle selling mode off in admin settings, verify Products menu item and editor button are hidden

- [x] T018 [US2] Update AdminSidebar to conditionally render Products menu item based on selling config in src/presentation/admin/components/AdminSidebar.tsx
- [x] T019 [US2] Update TiptapEditor to conditionally render product button based on selling config in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx
- [x] T020 [US2] Add SellingConfigContext provider to admin layout in src/app/admin/layout.tsx

## Phase 5: User Story 3 - Default Selling Mode State

Goal: New websites have selling mode disabled by default

**Independent Test**: Fresh website configuration shows selling mode disabled, Products menu and editor button not visible

- [x] T021 [US3] Verify default value returns false in MongooseWebsiteSettingsRepository getDefaultValue method
- [x] T022 [US3] Add SellingConfigContext default state handling in SellingConfigContext.tsx (already created in T015)

## Phase 6: Polish & Cross-Cutting Concerns

Goal: Ensure feature is complete, accessible, and integrated

- [x] T023 Add sellingEnabled to config export/import in src/application/config/ExportConfig.ts and ImportConfig.ts
- [x] T024 Increment export file version for selling config compatibility in src/domain/config/constants/ConfigVersion.ts

## Dependencies

```
T001 → T002, T003 (parallel)
T002, T003 → T004, T005 (parallel)
T004, T005 → T006, T007
T006, T007 → T008 → T009 → T010
T010 → T011, T012 (parallel) → T013, T014 → T015 → T016 → T017
T017 → T018, T019 (parallel) → T020
T020 → T021, T022 → T023 → T024
```

## Parallel Execution Opportunities

### Setup Phase

- T002 and T003 can run in parallel after T001

### Foundational Phase

- T004 and T005 can run in parallel

### User Story 1

- T011 and T012 can run in parallel

### User Story 2

- T018 and T019 can run in parallel (different files)

## Implementation Strategy

### MVP Scope (Recommended First Delivery)

Complete Phase 1-3 (T001-T017) for basic enable/disable functionality with UI toggle.

### Incremental Delivery

1. **Increment 1**: Setup + Foundational (T001-T010) - Backend infrastructure
2. **Increment 2**: User Story 1 (T011-T017) - Enable functionality with UI
3. **Increment 3**: User Story 2 (T018-T020) - Hide UI elements when disabled
4. **Increment 4**: User Story 3 + Polish (T021-T024) - Default state and export/import

## File Summary

| Layer          | Files to Create                                                                                | Files to Modify                                                               |
| -------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Domain         | SellingEnabled.ts                                                                              | SettingKeys.ts, WebsiteSetting.ts                                             |
| Application    | GetSellingEnabled.ts, UpdateSellingEnabled.ts, IGetSellingEnabled.ts, IUpdateSellingEnabled.ts | ExportConfig.ts, ImportConfig.ts                                              |
| Infrastructure | -                                                                                              | MongooseWebsiteSettingsRepository.ts, container.ts, SettingsServiceLocator.ts |
| API            | -                                                                                              | route.ts, types.ts                                                            |
| Presentation   | SellingConfigContext.tsx, SellingToggleSelector.tsx                                            | WebsiteSettingsForm.tsx, AdminSidebar.tsx, TiptapEditor.tsx, layout.tsx       |
| Config         | -                                                                                              | ConfigVersion.ts                                                              |

## Validation Checklist

- [x] All tasks follow checklist format (checkbox, ID, labels, file paths)
- [x] User story tasks have [US#] labels
- [x] Parallel tasks marked with [P]
- [x] Each user story is independently testable
- [x] Dependencies clearly documented
- [x] MVP scope identified
