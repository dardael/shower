# Tasks: Products List Page Content

**Input**: Design documents from `/specs/042-products-list-page/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not explicitly requested - test tasks excluded per specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create shared types and infrastructure needed by all user stories

- [x] T001 [P] Create ProductListConfig types in src/domain/product/types/ProductListConfig.ts
- [x] T002 [P] Create GetPublicProducts use case interface in src/application/product/IGetPublicProducts.ts
- [x] T003 Implement GetPublicProducts use case in src/application/product/GetPublicProducts.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Public API endpoint that MUST be complete before user stories can render products

**⚠️ CRITICAL**: No public rendering (US3) can work until this phase is complete

- [x] T004 Create PublicProductServiceLocator in src/infrastructure/container.ts (added to ProductServiceLocator)
- [x] T005 Create public products API route in src/app/api/public/products/route.ts

**Checkpoint**: Public products API ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Insert Products List in Page Content (Priority: P1) 🎯 MVP

**Goal**: Enable administrators to insert a products list block into page content via the editor toolbar

**Independent Test**: Insert a products list block in the editor and verify it saves correctly with default configuration

### Implementation for User Story 1

- [x] T006 [P] [US1] Create ProductList Tiptap extension in src/presentation/admin/components/PageContentEditor/extensions/ProductList.ts
- [x] T007 [US1] Update extensions index to export ProductList in src/presentation/admin/components/PageContentEditor/extensions/index.ts
- [x] T008 [US1] Add ProductList extension to TiptapEditor and add toolbar insert button in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx
- [x] T009 [US1] Verify YAGNI compliance (minimal ProductList node with default config only)
- [x] T010 [US1] Verify DRY compliance (reuse existing toolbar button patterns)
- [x] T011 [US1] Verify KISS compliance (simple node structure with data attributes)

**Checkpoint**: User Story 1 complete - administrators can insert products list blocks

---

## Phase 4: User Story 2 - Configure Products List Display Options (Priority: P2)

**Goal**: Enable administrators to configure category filters for the products list

**Independent Test**: Select categories in the toolbar and verify the configuration is saved in the node's data attributes

### Implementation for User Story 2

- [x] T012 [US2] Create ProductListToolbar component in src/presentation/admin/components/PageContentEditor/ProductListToolbar.tsx
- [x] T013 [US2] Integrate ProductListToolbar into TiptapEditor for node selection in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx
- [x] T014 [US2] Add updateProductListCategories command to ProductList extension in src/presentation/admin/components/PageContentEditor/extensions/ProductList.ts
- [x] T015 [US2] Verify contrast compliance for toolbar controls in light and dark modes
- [x] T016 [US2] Verify YAGNI compliance (category filter only, no extra options)
- [x] T017 [US2] Verify DRY compliance (reuse existing toolbar patterns from OverlayToolbar/TableToolbar)
- [x] T018 [US2] Verify KISS compliance (simple category multi-select UI)

**Checkpoint**: User Story 2 complete - administrators can configure category filters

---

## Phase 5: User Story 3 - View Products List on Public Page (Priority: P1)

**Goal**: Enable website visitors to see products displayed on public pages

**Independent Test**: View a public page with a products list block and verify products are displayed correctly

### Implementation for User Story 3

- [x] T019 [P] [US3] Create ProductListRenderer component in src/presentation/shared/components/PublicPageContent/ProductListRenderer.tsx
- [x] T020 [US3] Add product-list CSS styles in src/presentation/shared/components/PublicPageContent/public-page-content.css
- [x] T021 [US3] Update PublicPageContent to render ProductList nodes in src/presentation/shared/components/PublicPageContent/PublicPageContent.tsx
- [x] T022 [US3] Add data-category-ids to DOMPurify allowed attributes in src/presentation/shared/components/PublicPageContent/PublicPageContent.tsx
- [x] T023 [US3] Handle empty state when no products match filter criteria
- [x] T024 [US3] Verify contrast compliance for product display in light and dark modes
- [x] T025 [US3] Verify responsive layout for desktop and mobile screen sizes
- [x] T026 [US3] Verify YAGNI compliance (display name, image, description, price only)
- [x] T027 [US3] Verify DRY compliance (reuse existing PublicPageContent patterns)
- [x] T028 [US3] Verify KISS compliance (simple grid layout with CSS)

**Checkpoint**: User Story 3 complete - visitors can see products on public pages

---

## Phase 6: User Story 4 - Edit Existing Products List Configuration (Priority: P2)

**Goal**: Enable administrators to modify an existing products list block's configuration

**Independent Test**: Click on an existing products list block, modify categories, save, and verify changes persist

### Implementation for User Story 4

- [x] T029 [US4] Add node selection detection for ProductList in TiptapEditor in src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx
- [x] T030 [US4] Sync ProductListToolbar state with selected node attributes in src/presentation/admin/components/PageContentEditor/ProductListToolbar.tsx
- [x] T031 [US4] Verify KISS compliance (toolbar updates node attributes on change)

**Checkpoint**: User Story 4 complete - administrators can edit existing product list configurations

---

## Phase 7: User Story 5 - Remove Products List from Page (Priority: P2)

**Goal**: Enable administrators to delete a products list block from page content

**Independent Test**: Select and delete a products list block, save, and verify removal persists

### Implementation for User Story 5

- [x] T032 [US5] Verify ProductList node supports standard Tiptap delete behavior (backspace, delete key)
- [x] T033 [US5] Add delete button to ProductListToolbar in src/presentation/admin/components/PageContentEditor/ProductListToolbar.tsx

**Checkpoint**: User Story 5 complete - administrators can remove product lists from pages

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases and validation across all user stories

- [x] T034 Handle deleted category references gracefully (ignore invalid categoryIds in filter)
- [x] T035 Verify products display in correct displayOrder from product management
- [x] T036 Verify ProductListRenderer handles product images correctly (missing images, various sizes)
- [x] T037 Final code quality validation (YAGNI, DRY, KISS compliance across all files)
- [x] T038 Run quickstart.md validation scenarios

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS public rendering (US3)
- **User Story 1 (Phase 3)**: Depends on Setup only - can start in parallel with Phase 2
- **User Story 2 (Phase 4)**: Depends on User Story 1 (needs ProductList extension)
- **User Story 3 (Phase 5)**: Depends on Phase 2 (needs public API) and Phase 3 (needs ProductList node in content)
- **User Story 4 (Phase 6)**: Depends on User Story 2 (needs ProductListToolbar)
- **User Story 5 (Phase 7)**: Depends on User Story 2 (needs ProductListToolbar)
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Insert block - No dependencies on other stories
- **User Story 2 (P2)**: Configure - Depends on US1 (extension must exist)
- **User Story 3 (P1)**: Public render - Depends on US1 (content must have blocks) + Phase 2 (API)
- **User Story 4 (P2)**: Edit config - Depends on US2 (toolbar must exist)
- **User Story 5 (P2)**: Remove block - Depends on US2 (toolbar for delete button)

### Parallel Opportunities

**Phase 1 (Setup)**:

```bash
# T001 and T002 can run in parallel (different files)
Task: T001 - Create ProductListConfig types
Task: T002 - Create IGetPublicProducts interface
```

**Phase 3 + Phase 2 (Can overlap)**:

```bash
# US1 (T006-T008) can start while Phase 2 completes
# US1 doesn't need the public API - only US3 does
Task: T006 - Create ProductList extension (US1)
Task: T004 - Create PublicProductServiceLocator (Foundational)
```

**Phase 5 (User Story 3)**:

```bash
# T019 can start in parallel with earlier tasks if Phase 2 is done
Task: T019 - Create ProductListRenderer component
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 3)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T005)
3. Complete Phase 3: User Story 1 - Insert block (T006-T011)
4. Complete Phase 5: User Story 3 - Public render (T019-T028)
5. **STOP and VALIDATE**: Admin can insert products list, visitors can see products
6. Deploy/demo if ready - this is the MVP

### Incremental Delivery

1. **MVP**: Setup + Foundational + US1 + US3 → Basic product list in pages
2. **Enhancement 1**: Add US2 → Category filtering
3. **Enhancement 2**: Add US4 → Edit existing configurations
4. **Enhancement 3**: Add US5 → Delete product lists
5. **Polish**: Edge cases and validation

### Suggested Execution Order

For single developer, recommended order:

1. T001, T002 (parallel)
2. T003
3. T004, T005 (foundational API)
4. T006, T007, T008 (US1 - insert)
5. T019, T020, T021, T022, T023 (US3 - render)
6. T012, T013, T014 (US2 - configure)
7. T029, T030, T031 (US4 - edit)
8. T032, T033 (US5 - delete)
9. T034-T038 (polish)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- US1 and US3 are both P1 priority - complete both for MVP
- US2, US4, US5 are P2 priority - enhancements after MVP
- No test tasks included (not explicitly requested)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
