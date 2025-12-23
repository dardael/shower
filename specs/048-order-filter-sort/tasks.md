# Tasks: Order Filter and Sort

**Input**: Design documents from `/specs/048-order-filter-sort/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Included as specified in plan.md test plan.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create domain value objects and shared infrastructure

- [x] T001 [P] Create OrderFilterState value object in src/domain/order/value-objects/OrderFilterState.ts
- [x] T002 [P] Create OrderSortState value object in src/domain/order/value-objects/OrderSortState.ts
- [x] T003 [P] Create text normalization utility for accent-insensitive search in src/domain/shared/utils/textNormalization.ts

**Checkpoint**: Domain layer ready for presentation hooks

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create shared hooks that all user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create useOrderFilters hook in src/presentation/admin/hooks/useOrderFilters.ts
- [x] T005 Create useOrderSort hook in src/presentation/admin/hooks/useOrderSort.ts
- [x] T006 Create combined useOrdersFilterSort hook in src/presentation/admin/hooks/useOrdersFilterSort.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Filter Orders by Status (Priority: P1) 🎯 MVP

**Goal**: Enable filtering orders by status with COMPLETED hidden by default

**Independent Test**: Display order list, apply status filter, verify only matching orders shown

### Tests for User Story 1

- [ ] T007 [P] [US1] Unit test for OrderFilterState default state in test/unit/domain/order/value-objects/OrderFilterState.test.ts
- [ ] T008 [P] [US1] Unit test for useOrderFilters status filtering in test/unit/presentation/admin/hooks/useOrderFilters.test.ts

### Implementation for User Story 1

- [x] T009 [US1] Add status filter logic to useOrderFilters hook (filter by statuses array)
- [x] T010 [US1] Create OrderFilterSortPanel component with status checkboxes in src/presentation/admin/components/OrderFilterSortPanel.tsx
- [x] T011 [US1] Integrate OrderFilterSortPanel into existing OrdersClient.tsx in src/app/commandes/OrdersClient.tsx
- [x] T012 [US1] Apply default filter (hide COMPLETED) on page load
- [x] T013 [US1] Display order count matching filters
- [ ] T014 [US1] Verify contrast compliance for status filter UI in light and dark modes
- [x] T015 [US1] Verify French localization (Nouveau, Confirmée, Terminée labels)

**Checkpoint**: Status filtering functional with COMPLETED hidden by default

---

## Phase 4: User Story 2 - Sort Orders (Priority: P1)

**Goal**: Enable sorting orders by date, name, or status with date descending as default

**Independent Test**: Display order list, click sort controls, verify order changes correctly

### Tests for User Story 2

- [ ] T016 [P] [US2] Unit test for OrderSortState in test/unit/domain/order/value-objects/OrderSortState.test.ts
- [ ] T017 [P] [US2] Unit test for useOrderSort hook in test/unit/presentation/admin/hooks/useOrderSort.test.ts

### Implementation for User Story 2

- [x] T018 [US2] Add sort logic to useOrderSort hook (date, customerName, status)
- [x] T019 [US2] Implement status sort order (NEW=1, CONFIRMED=2, COMPLETED=3)
- [x] T020 [US2] Add sort controls to OrderFilterSortPanel (dropdown + direction toggle)
- [x] T021 [US2] Apply default sort (date descending) on page load
- [x] T022 [US2] Verify sort toggle behavior (same field toggles direction, different field resets to desc)
- [x] T023 [US2] Verify French localization (Date, Nom client, Statut labels)

**Checkpoint**: Sorting functional with date descending as default

---

## Phase 5: User Story 3 - Filter Orders by Customer Name (Priority: P2)

**Goal**: Enable searching/filtering orders by customer name with partial, case/accent-insensitive matching

**Independent Test**: Enter customer name in search field, verify matching orders displayed

### Tests for User Story 3

- [ ] T024 [P] [US3] Unit test for text normalization utility in test/unit/domain/shared/utils/textNormalization.test.ts
- [ ] T025 [P] [US3] Unit test for customer name filtering in test/unit/presentation/admin/hooks/useOrderFilters.test.ts

### Implementation for User Story 3

- [x] T026 [US3] Add customer name filter logic to useOrderFilters (combines firstName + lastName)
- [x] T027 [US3] Implement case-insensitive and accent-insensitive matching using normalize('NFD')
- [x] T028 [US3] Add customer name input field to OrderFilterSortPanel
- [x] T029 [US3] Verify partial matching works ("Dup" matches "Dupont", "Dupuis")
- [x] T030 [US3] Verify French localization (Rechercher par nom placeholder)

**Checkpoint**: Customer name search functional

---

## Phase 6: User Story 4 - Filter Orders by Product (Priority: P2)

**Goal**: Enable filtering orders by product (orders containing selected product)

**Independent Test**: Select product from filter dropdown, verify only orders with that product shown

### Tests for User Story 4

- [ ] T031 [P] [US4] Unit test for product filtering in test/unit/presentation/admin/hooks/useOrderFilters.test.ts

### Implementation for User Story 4

- [x] T032 [US4] Fetch products list for dropdown using existing /api/products endpoint
- [x] T033 [US4] Add product filter logic to useOrderFilters (match items[].productId)
- [x] T034 [US4] Add product dropdown to OrderFilterSortPanel
- [x] T035 [US4] Verify French localization (Filtrer par produit placeholder)

**Checkpoint**: Product filtering functional

---

## Phase 7: User Story 5 - Filter Orders by Category (Priority: P2)

**Goal**: Enable filtering orders by product category

**Independent Test**: Select category from filter dropdown, verify only orders with products in that category shown

### Tests for User Story 5

- [ ] T036 [P] [US5] Unit test for category filtering in test/unit/presentation/admin/hooks/useOrderFilters.test.ts

### Implementation for User Story 5

- [x] T037 [US5] Fetch categories list for dropdown using existing /api/products/categories endpoint
- [x] T038 [US5] Build productId → categoryIds map for category lookup
- [x] T039 [US5] Add category filter logic to useOrderFilters (match via product categoryIds)
- [x] T040 [US5] Add category dropdown to OrderFilterSortPanel
- [x] T041 [US5] Verify French localization (Filtrer par catégorie placeholder)

**Checkpoint**: Category filtering functional

---

## Phase 8: User Story 6 - Combine Multiple Filters (Priority: P3)

**Goal**: Apply multiple filters simultaneously with AND logic

**Independent Test**: Apply status + product filters, verify only orders matching both criteria shown

### Tests for User Story 6

- [ ] T042 [P] [US6] Integration test for combined filters in test/integration/order-filter-sort.integration.test.tsx

### Implementation for User Story 6

- [x] T043 [US6] Ensure all filters combine with AND logic in applyFilters function
- [x] T044 [US6] Add "Réinitialiser" (Reset) button to OrderFilterSortPanel
- [x] T045 [US6] Implement reset to restore default filters (hide COMPLETED, clear name/product/category)
- [x] T046 [US6] Display "Aucune commande trouvée" message when no orders match
- [x] T047 [US6] Verify immediate update on filter change (no submit button needed)

**Checkpoint**: All filters work together with reset functionality

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and code quality

- [ ] T048 [P] Run full integration test suite in test/integration/order-filter-sort.integration.test.tsx
- [ ] T049 [P] Verify YAGNI compliance (only implemented specified filters/sorts)
- [ ] T050 [P] Verify DRY compliance (reusable filter/sort hooks)
- [ ] T051 [P] Verify KISS compliance (simple client-side implementation)
- [ ] T052 Verify dark mode compatibility across all filter/sort UI elements
- [ ] T053 Run npm run lint and npm run build to ensure no errors

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (Status Filter)**: Can start after Foundational - creates base UI component
- **US2 (Sorting)**: Can start after Foundational - extends base UI component
- **US3 (Name Filter)**: Can start after Foundational - independent
- **US4 (Product Filter)**: Can start after Foundational - independent
- **US5 (Category Filter)**: Can start after US4 (uses product data)
- **US6 (Combined Filters)**: Depends on US1-US5 completion

### Parallel Opportunities

Within Setup phase:

```bash
Task: T001 "Create OrderFilterState value object"
Task: T002 "Create OrderSortState value object"
Task: T003 "Create text normalization utility"
```

Within Foundational phase (sequential - hooks depend on value objects):

```bash
Task: T004 → T005 → T006
```

User Stories 1-4 can run in parallel after Foundational:

```bash
# Developer A: US1 (Status) + US2 (Sort)
# Developer B: US3 (Name) + US4 (Product)
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: US1 (Status Filter with default hide COMPLETED)
4. Complete Phase 4: US2 (Sorting with default date descending)
5. **STOP and VALIDATE**: Core filter/sort works
6. Deploy/demo MVP

### Incremental Delivery

1. MVP (US1 + US2) → Status filter + sorting works
2. Add US3 → Customer name search works
3. Add US4 → Product filter works
4. Add US5 → Category filter works
5. Add US6 → Combined filters + reset works

---

## Summary

| Metric                 | Count               |
| ---------------------- | ------------------- |
| Total Tasks            | 53                  |
| Setup Tasks            | 3                   |
| Foundational Tasks     | 3                   |
| US1 (Status Filter)    | 9                   |
| US2 (Sorting)          | 8                   |
| US3 (Name Filter)      | 7                   |
| US4 (Product Filter)   | 5                   |
| US5 (Category Filter)  | 6                   |
| US6 (Combined)         | 6                   |
| Polish Tasks           | 6                   |
| Parallel Opportunities | 15 tasks marked [P] |

**MVP Scope**: US1 + US2 (17 tasks after foundational work)
