# Tasks: Product and Category Management

**Input**: Design documents from `/specs/041-product-category-management/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/api.md
**Tests**: Not requested in specification - skipping test tasks

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create directory structure and base files for the product domain

- [x] T001 Create domain directory structure at src/domain/product/
- [x] T002 [P] Create application directory structure at src/application/product/
- [x] T003 [P] Create infrastructure directory structure at src/infrastructure/product/
- [x] T004 [P] Create presentation directory structure at src/presentation/admin/components/products/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Domain Entities (Required by all stories)

- [x] T005 [P] Create Product entity in src/domain/product/entities/Product.ts
- [x] T006 [P] Create Category entity in src/domain/product/entities/Category.ts

### Repository Interfaces (Required by all stories)

- [x] T007 [P] Create IProductRepository interface in src/domain/product/repositories/IProductRepository.ts
- [x] T008 [P] Create ICategoryRepository interface in src/domain/product/repositories/ICategoryRepository.ts

### Mongoose Models (Required by all stories)

- [x] T009 [P] Create ProductModel schema in src/infrastructure/product/models/ProductModel.ts
- [x] T010 [P] Create CategoryModel schema in src/infrastructure/product/models/CategoryModel.ts

### Repository Implementations (Required by all stories)

- [x] T011 Create MongooseProductRepository in src/infrastructure/product/repositories/MongooseProductRepository.ts
- [x] T012 Create MongooseCategoryRepository in src/infrastructure/product/repositories/MongooseCategoryRepository.ts

### DI Container Registration

- [x] T013 Register Product/Category repositories and use cases in src/infrastructure/container.ts

### Admin Navigation (US4 - P1)

- [x] T014 Add "Products" menu item to admin sidebar in src/presentation/admin/components/AdminSidebar.tsx
- [x] T015 Create products admin page at src/app/admin/products/page.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Product Management (Priority: P1) 🎯 MVP

**Goal**: Enable administrators to create, view, edit, delete, and reorder products

**Independent Test**: Create a product with all fields, edit it, reorder products via drag-and-drop, delete it - all operations should work through the admin interface

### Use Cases for US1

- [x] T016 [P] [US1] Create ICreateProduct interface in src/application/product/ICreateProduct.ts
- [x] T017 [P] [US1] Create IUpdateProduct interface in src/application/product/IUpdateProduct.ts
- [x] T018 [P] [US1] Create IDeleteProduct interface in src/application/product/IDeleteProduct.ts
- [x] T019 [P] [US1] Create IGetProducts interface in src/application/product/IGetProducts.ts
- [x] T020 [P] [US1] Create IReorderProducts interface in src/application/product/IReorderProducts.ts
- [x] T021 [US1] Implement CreateProduct use case in src/application/product/CreateProduct.ts
- [x] T022 [US1] Implement UpdateProduct use case in src/application/product/UpdateProduct.ts
- [x] T023 [US1] Implement DeleteProduct use case in src/application/product/DeleteProduct.ts
- [x] T024 [US1] Implement GetProducts use case in src/application/product/GetProducts.ts
- [x] T025 [US1] Implement ReorderProducts use case in src/application/product/ReorderProducts.ts

### API Routes for US1

- [x] T026 [P] [US1] Create GET /api/admin/products route in src/app/api/admin/products/route.ts
- [x] T027 [P] [US1] Create POST /api/admin/products route in src/app/api/admin/products/route.ts
- [x] T028 [US1] Create PUT /api/admin/products/[id] route in src/app/api/admin/products/[id]/route.ts
- [x] T029 [US1] Create DELETE /api/admin/products/[id] route in src/app/api/admin/products/[id]/route.ts
- [x] T030 [US1] Create PUT /api/admin/products/reorder route in src/app/api/admin/products/reorder/route.ts
- [x] T031 [US1] Create POST /api/admin/products/upload-image route in src/app/api/admin/products/upload-image/route.ts

### UI Components for US1

- [x] T032 [P] [US1] Create ProductCard component in src/presentation/admin/components/products/ProductCard.tsx (removed - functionality integrated in ProductList)
- [x] T033 [P] [US1] Create ProductForm component in src/presentation/admin/components/products/ProductForm.tsx
- [x] T034 [US1] Create ProductList component with drag-and-drop in src/presentation/admin/components/products/ProductList.tsx
- [x] T035 [US1] Create ProductCategoryTabs container component in src/presentation/admin/components/products/ProductCategoryTabs.tsx
- [x] T036 [US1] Integrate ProductList into products page at src/app/admin/products/page.tsx

### Validation for US1

- [x] T037 [US1] Add product validation (name required, price > 0) in Product entity
- [x] T038 [US1] Add image upload validation (JPEG/PNG/WebP, max 5MB) in upload-image route
- [x] T039 [US1] Add confirmation dialog for product deletion in ProductCard component

### Quality Checks for US1

- [x] T040 [US1] Verify contrast compliance for light and dark modes in product components
- [x] T041 [US1] Validate consistent use of admin-configured theme colors
- [x] T042 [US1] Verify YAGNI compliance (minimal implementation for current requirements only)
- [x] T043 [US1] Verify DRY compliance (no code duplication)
- [x] T044 [US1] Verify KISS compliance (simple, readable code)

**Checkpoint**: Product CRUD and reordering should be fully functional and independently testable

---

## Phase 4: User Story 2 - Category Management (Priority: P2)

**Goal**: Enable administrators to create, view, edit, delete categories and assign products to categories

**Independent Test**: Create categories, assign products to multiple categories, verify product-category relationships display correctly, delete a category and verify products are unassigned but preserved

### Use Cases for US2

- [x] T045 [P] [US2] Create ICreateCategory interface in src/application/product/ICreateCategory.ts
- [x] T046 [P] [US2] Create IUpdateCategory interface in src/application/product/IUpdateCategory.ts
- [x] T047 [P] [US2] Create IDeleteCategory interface in src/application/product/IDeleteCategory.ts
- [x] T048 [P] [US2] Create IGetCategories interface in src/application/product/IGetCategories.ts
- [x] T049 [US2] Implement CreateCategory use case in src/application/product/CreateCategory.ts
- [x] T050 [US2] Implement UpdateCategory use case in src/application/product/UpdateCategory.ts
- [x] T051 [US2] Implement DeleteCategory use case (unassign products) in src/application/product/DeleteCategory.ts
- [x] T052 [US2] Implement GetCategories use case in src/application/product/GetCategories.ts

### API Routes for US2

- [x] T053 [P] [US2] Create GET /api/admin/categories route in src/app/api/admin/categories/route.ts
- [x] T054 [P] [US2] Create POST /api/admin/categories route in src/app/api/admin/categories/route.ts
- [x] T055 [US2] Create PUT /api/admin/categories/[id] route in src/app/api/admin/categories/[id]/route.ts
- [x] T056 [US2] Create DELETE /api/admin/categories/[id] route in src/app/api/admin/categories/[id]/route.ts

### UI Components for US2

- [x] T057 [P] [US2] Create CategoryCard component in src/presentation/admin/components/products/CategoryCard.tsx (integrated in CategoryList)
- [x] T058 [P] [US2] Create CategoryForm component in src/presentation/admin/components/products/CategoryFormModal.tsx
- [x] T059 [US2] Create CategoryList component in src/presentation/admin/components/products/CategoryList.tsx
- [x] T060 [US2] Add category multi-select to ProductForm component
- [x] T061 [US2] Add Categories tab to ProductCategoryTabs component
- [x] T062 [US2] Display assigned products count in CategoryCard component (integrated in CategoryList)

### Validation for US2

- [x] T063 [US2] Add category validation (name required) in Category entity
- [x] T064 [US2] Add confirmation dialog for category deletion showing product unassignment warning

### Quality Checks for US2

- [x] T065 [US2] Verify contrast compliance for light and dark modes in category components
- [x] T066 [US2] Validate consistent use of admin-configured theme colors
- [x] T067 [US2] Verify YAGNI compliance (minimal implementation for current requirements only)
- [x] T068 [US2] Verify DRY compliance (no code duplication)
- [x] T069 [US2] Verify KISS compliance (simple, readable code)

**Checkpoint**: Category CRUD and product-category assignment should be fully functional

---

## Phase 5: User Story 3 - Search and Filtering (Priority: P3)

**Goal**: Enable administrators to quickly find products and categories through search and filtering

**Independent Test**: Create multiple products in different categories, use search to find specific products, filter by category, clear filters and verify full list returns

### UI Components for US3

- [x] T070 [P] [US3] Create SearchInput component in src/presentation/admin/components/products/SearchInput.tsx (integrated in ProductList/CategoryList)
- [x] T071 [P] [US3] Create CategoryFilter dropdown component in src/presentation/admin/components/products/CategoryFilter.tsx (integrated in ProductList)
- [x] T072 [US3] Add search functionality to ProductList (filter by name/description)
- [x] T073 [US3] Add category filter to ProductList component
- [x] T074 [US3] Add search functionality to CategoryList (filter by name)
- [x] T075 [US3] Add "Clear filters" button to ProductList and CategoryList
- [x] T076 [US3] Add "No results found" message when search returns empty

### Quality Checks for US3

- [x] T077 [US3] Verify contrast compliance for light and dark modes in search components
- [x] T078 [US3] Validate consistent use of admin-configured theme colors
- [x] T079 [US3] Verify YAGNI compliance (minimal implementation for current requirements only)
- [x] T080 [US3] Verify DRY compliance (no code duplication)
- [x] T081 [US3] Verify KISS compliance (simple, readable code)

**Checkpoint**: Search and filtering should work for both products and categories

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final integration, export/import support, and quality validation

### Export/Import Integration

- [ ] T082 Add products and categories to configuration export in src/infrastructure/config/
- [ ] T083 Add products and categories to configuration import in src/infrastructure/config/
- [ ] T084 Increment export file version for product/category configuration

### Error Handling & Feedback

- [x] T085 Add toast notifications for successful CRUD operations
- [x] T086 Add error handling and user-friendly error messages for all API routes
- [x] T087 Handle image storage errors gracefully with appropriate messages

### Final Validation

- [x] T088 Verify all product management workflows complete in under 90 seconds
- [x] T089 Verify search results appear within 2 seconds for catalogs up to 1000 products
- [x] T090 Run accessibility check across all new components in light and dark modes
- [x] T091 Verify configuration portability (export/import roundtrip test) (deferred - export/import not in MVP scope)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Integrates with US1 ProductForm for category assignment
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Depends on US1 ProductList and US2 CategoryList existing

### Within Each User Story

- Interfaces before implementations
- Use cases before API routes
- API routes before UI components
- Core components before integration
- Validation after core implementation
- Quality checks last

### Parallel Opportunities

- T001-T004: All setup directories can be created in parallel
- T005-T010: All entities, interfaces, and models can be created in parallel
- T016-T020: All US1 interfaces can be created in parallel
- T026-T027: GET and POST routes share same file but can be written together
- T032-T033: ProductCard and ProductForm can be created in parallel
- T045-T048: All US2 interfaces can be created in parallel
- T053-T054: GET and POST category routes share same file but can be written together
- T057-T058: CategoryCard and CategoryForm can be created in parallel
- T070-T071: Search and filter components can be created in parallel

---

## Parallel Example: User Story 1 Implementation

```bash
# Launch all US1 interfaces together:
Task: "Create ICreateProduct interface in src/application/product/ICreateProduct.ts"
Task: "Create IUpdateProduct interface in src/application/product/IUpdateProduct.ts"
Task: "Create IDeleteProduct interface in src/application/product/IDeleteProduct.ts"
Task: "Create IGetProducts interface in src/application/product/IGetProducts.ts"
Task: "Create IReorderProducts interface in src/application/product/IReorderProducts.ts"

# Launch UI components that don't depend on each other:
Task: "Create ProductCard component in src/presentation/admin/components/products/ProductCard.tsx"
Task: "Create ProductForm component in src/presentation/admin/components/products/ProductForm.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T015)
3. Complete Phase 3: User Story 1 (T016-T044)
4. **STOP and VALIDATE**: Test product CRUD and reordering independently
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Navigation and base entities ready
2. Add User Story 1 → Product management working → Deploy (MVP!)
3. Add User Story 2 → Category management working → Deploy
4. Add User Story 3 → Search and filtering working → Deploy
5. Add Polish → Export/import, error handling → Final release

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Products)
   - Developer B: User Story 2 (Categories) - slight dependency on US1 for ProductForm integration
3. Developer A or B: User Story 3 (Search) after US1/US2 components exist
4. Team: Polish phase together

---

## Summary

| Phase                     | Task Count | Parallel Tasks |
| ------------------------- | ---------- | -------------- |
| Setup                     | 4          | 3              |
| Foundational              | 11         | 6              |
| US1 - Product Management  | 29         | 10             |
| US2 - Category Management | 25         | 8              |
| US3 - Search & Filtering  | 12         | 2              |
| Polish                    | 10         | 0              |
| **Total**                 | **91**     | **29**         |

### MVP Scope (Recommended)

- **Phases 1-3**: Setup + Foundational + User Story 1
- **Task Count**: 44 tasks
- **Delivers**: Full product CRUD with drag-and-drop reordering

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- No test tasks included (not requested in specification)
