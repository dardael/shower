# Tasks: Shopping Cart

**Input**: Design documents from `/specs/044-shopping-cart/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/cart-api.md, quickstart.md

**Tests**: INCLUDED - Tests explicitly requested for add/remove cart functionality.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project structure and shared domain entities

- [x] T001 Create cart domain directory structure at src/domain/cart/entities/
- [x] T002 [P] Create CartItem entity in src/domain/cart/entities/CartItem.ts
- [x] T003 [P] Create CartStorage utility in src/presentation/shared/utils/CartStorage.ts
- [x] T004 [P] Create Cart components directory at src/presentation/shared/components/Cart/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Context provider and hook that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create CartContext provider in src/presentation/shared/contexts/CartContext.tsx
- [x] T006 Create useCart hook in src/presentation/shared/hooks/useCart.ts
- [x] T007 Add CartProvider to public app layout (wrap below SellingConfigProvider)

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Add Product to Cart (Priority: P1) 🎯 MVP

**Goal**: Users can add products to their cart from product listings

**Independent Test**: Display a product, click "Add to Cart", verify cart count increases and product is stored

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**
> **FOCUS: Unit tests and integration tests ONLY, cover common cases, avoid over-mocking**

- [x] T008 [P] [US1] Unit test for CartStorage.addItem in test/unit/presentation/shared/utils/CartStorage.test.ts
- [x] T009 [P] [US1] Unit test for CartContext addItem in test/unit/presentation/shared/contexts/CartContext.test.tsx
- [x] T010 [P] [US1] Unit test for AddToCartButton in test/unit/presentation/shared/components/Cart/AddToCartButton.test.tsx

### Implementation for User Story 1

- [x] T011 [P] [US1] Implement CartStorage.addItem method (add new item with quantity 1, increment existing)
- [x] T012 [P] [US1] Implement CartStorage.getCart method (read from localStorage)
- [x] T013 [P] [US1] Implement CartStorage.setCart method (persist to localStorage with event dispatch)
- [x] T014 [US1] Implement CartContext.addItem function using CartStorage
- [x] T015 [US1] Create AddToCartButton component in src/presentation/shared/components/Cart/AddToCartButton.tsx
- [x] T016 [US1] Integrate AddToCartButton into ProductListRenderer (grid mode) in src/presentation/shared/components/PublicPageContent/ProductListRenderer.tsx
- [x] T017 [US1] Integrate AddToCartButton into ProductListRenderer (list mode)
- [x] T018 [US1] Conditionally render AddToCartButton based on selling mode (useSellingConfig)
- [x] T019 [US1] Verify YAGNI compliance (minimal implementation for current requirements only)
- [x] T020 [US1] Verify DRY compliance (no code duplication)
- [x] T021 [US1] Verify KISS compliance (simple, readable code)

**Checkpoint**: User Story 1 complete - products can be added to cart from listings

---

## Phase 4: User Story 2 - View Cart Contents (Priority: P1)

**Goal**: Users can open the cart and see all added products with details

**Independent Test**: Add products, click cart icon, verify all products displayed with names, images, prices, quantities

### Tests for User Story 2 ⚠️

- [x] T022 [P] [US2] Unit test for CartDrawer in test/unit/presentation/shared/components/Cart/CartDrawer.test.tsx
- [x] T023 [P] [US2] Unit test for CartItemRow in test/unit/presentation/shared/components/Cart/CartItemRow.test.tsx

### Implementation for User Story 2

- [x] T024 [P] [US2] Create CartItemRow component in src/presentation/shared/components/Cart/CartItemRow.tsx
- [x] T025 [US2] Create CartDrawer component in src/presentation/shared/components/Cart/CartDrawer.tsx
- [x] T026 [US2] Implement product data fetching in CartDrawer (fetch current prices from products API)
- [x] T027 [US2] Implement empty cart state display in CartDrawer
- [x] T028 [US2] Implement cart total calculation (sum of item quantities × current prices)
- [x] T029 [US2] Verify contrast compliance for light and dark modes
- [x] T030 [US2] Verify YAGNI compliance (minimal implementation for current requirements only)
- [x] T031 [US2] Verify DRY compliance (no code duplication)
- [x] T032 [US2] Verify KISS compliance (simple, readable code)

**Checkpoint**: User Story 2 complete - cart contents can be viewed in drawer

---

## Phase 5: User Story 3 - Remove Product from Cart (Priority: P1)

**Goal**: Users can remove products from their cart via quantity controls or remove button

**Independent Test**: Add a product, open cart, remove product, verify cart updated and count decreases

### Tests for User Story 3 ⚠️

- [x] T033 [P] [US3] Unit test for CartStorage.removeItem in test/unit/presentation/shared/utils/CartStorage.test.ts
- [x] T034 [P] [US3] Unit test for CartStorage.updateQuantity in test/unit/presentation/shared/utils/CartStorage.test.ts
- [x] T035 [P] [US3] Unit test for CartContext removeItem/updateQuantity in test/unit/presentation/shared/contexts/CartContext.test.tsx
- [x] T036 [P] [US3] Integration test for cart-add-remove flow in test/integration/cart-add-remove.integration.test.tsx

### Implementation for User Story 3

- [x] T037 [P] [US3] Implement CartStorage.removeItem method (filter out item by productId)
- [x] T038 [P] [US3] Implement CartStorage.updateQuantity method (update or remove if quantity <= 0)
- [x] T039 [US3] Implement CartContext.removeItem function using CartStorage
- [x] T040 [US3] Implement CartContext.updateQuantity function using CartStorage
- [x] T041 [US3] Add remove button to CartItemRow component
- [x] T042 [US3] Add quantity decrease button to CartItemRow component
- [x] T043 [US3] Wire CartItemRow buttons to CartContext functions
- [x] T044 [US3] Verify YAGNI compliance (minimal implementation for current requirements only)
- [x] T045 [US3] Verify DRY compliance (no code duplication)
- [x] T046 [US3] Verify KISS compliance (simple, readable code)

**Checkpoint**: User Story 3 complete - products can be removed from cart

---

## Phase 6: User Story 4 - Cart Persistence Across Sessions (Priority: P2)

**Goal**: Cart contents survive browser close and page refresh

**Independent Test**: Add products, close browser tab, reopen website, verify cart contents restored

### Tests for User Story 4 ⚠️

- [x] T047 [P] [US4] Unit test for CartStorage persistence in test/unit/presentation/shared/utils/CartStorage.test.ts
- [x] T048 [P] [US4] Unit test for BroadcastChannel sync in test/unit/presentation/shared/utils/CartStorage.test.ts

### Implementation for User Story 4

- [x] T049 [US4] Implement CartStorage.listenToUpdate for cross-component sync
- [x] T050 [US4] Implement BroadcastChannel for cross-tab sync (channel: shower-cart-sync)
- [x] T051 [US4] Initialize CartContext from localStorage on mount
- [x] T052 [US4] Subscribe CartContext to storage update events
- [x] T053 [US4] Subscribe CartContext to BroadcastChannel messages
- [x] T054 [US4] Handle localStorage unavailability gracefully (memory-only mode)
- [x] T055 [US4] Verify YAGNI compliance (minimal implementation for current requirements only)
- [x] T056 [US4] Verify DRY compliance (no code duplication)
- [x] T057 [US4] Verify KISS compliance (simple, readable code)

**Checkpoint**: User Story 4 complete - cart persists across sessions and tabs

---

## Phase 7: User Story 5 - Cart Icon with Count in Header (Priority: P2)

**Goal**: Cart icon in header shows item count and opens cart drawer

**Independent Test**: Add/remove products, verify cart icon count updates in real-time on desktop and mobile

### Tests for User Story 5 ⚠️

- [x] T058 [P] [US5] Unit test for CartIcon in test/unit/presentation/shared/components/Cart/CartIcon.test.tsx

### Implementation for User Story 5

- [x] T059 [US5] Create CartIcon component in src/presentation/shared/components/Cart/CartIcon.tsx
- [x] T060 [US5] Implement badge display with itemCount from useCart
- [x] T061 [US5] Implement onClick to open CartDrawer
- [x] T062 [US5] Integrate CartIcon into PublicHeaderMenu desktop view (next to DarkModeToggle)
- [x] T063 [US5] Integrate CartIcon into MobileMenuDrawer
- [x] T064 [US5] Conditionally render CartIcon based on selling mode (useSellingConfig)
- [x] T065 [US5] Verify 44x44px touch targets on mobile
- [x] T066 [US5] Verify contrast compliance for light and dark modes
- [x] T067 [US5] Verify YAGNI compliance (minimal implementation for current requirements only)
- [x] T068 [US5] Verify DRY compliance (no code duplication)
- [x] T069 [US5] Verify KISS compliance (simple, readable code)

**Checkpoint**: User Story 5 complete - cart icon visible in header with count

---

## Phase 8: User Story 6 - Modify Quantities from Cart Panel (Priority: P3)

**Goal**: Users can increase/decrease quantities directly in cart drawer

**Independent Test**: Open cart, use quantity controls, verify quantities and totals update correctly

### Implementation for User Story 6

- [x] T070 [US6] Add quantity increase button to CartItemRow component
- [x] T071 [US6] Wire increase button to CartContext.updateQuantity (increment)
- [x] T072 [US6] Enforce max quantity of 99 in updateQuantity
- [x] T073 [US6] Update line total and cart total on quantity change
- [x] T074 [US6] Verify 44x44px touch targets for quantity controls
- [x] T075 [US6] Verify YAGNI compliance (minimal implementation for current requirements only)
- [x] T076 [US6] Verify DRY compliance (no code duplication)
- [x] T077 [US6] Verify KISS compliance (simple, readable code)

**Checkpoint**: User Story 6 complete - quantities modifiable from cart panel

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and edge case handling

- [x] T078 Handle unavailable products in cart (mark as unavailable, prevent quantity increase)
- [x] T079 Verify keyboard navigation for cart panel (focus trap, Escape to close)
- [x] T080 Verify cart hidden when selling mode disabled (icon and drawer)
- [x] T081 Run all cart tests: `docker compose run --rm app npm test -- --testPathPattern="cart"`
- [x] T082 Run type check: `docker compose run --rm app npm run build:strict`
- [x] T083 Run linting: `docker compose run --rm app npm run lint`
- [x] T084 Run quickstart.md validation checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - US1, US2, US3 are all P1 priority - should complete in order
  - US4, US5 are P2 priority - can start after US3
  - US6 is P3 priority - complete last
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Add to Cart - Foundation only
- **User Story 2 (P1)**: View Cart - Foundation only (but benefits from US1 for testing)
- **User Story 3 (P1)**: Remove from Cart - Foundation only (but benefits from US1, US2 for testing)
- **User Story 4 (P2)**: Persistence - Foundation only
- **User Story 5 (P2)**: Cart Icon - Depends on CartDrawer (US2)
- **User Story 6 (P3)**: Quantity Modify - Depends on CartItemRow (US2, US3)

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Storage methods before context methods
- Context methods before components
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All tests for a user story marked [P] can run in parallel
- CartStorage methods (T011, T012, T013) can run in parallel
- Component creation can run in parallel with storage implementation

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Unit test for CartStorage.addItem in test/unit/presentation/shared/utils/CartStorage.test.ts"
Task: "Unit test for CartContext addItem in test/unit/presentation/shared/contexts/CartContext.test.tsx"
Task: "Unit test for AddToCartButton in test/unit/presentation/shared/components/Cart/AddToCartButton.test.tsx"

# Launch all CartStorage methods together:
Task: "Implement CartStorage.addItem method"
Task: "Implement CartStorage.getCart method"
Task: "Implement CartStorage.setCart method"
```

---

## Implementation Strategy

### MVP First (User Stories 1-3 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Add to Cart)
4. Complete Phase 4: User Story 2 (View Cart)
5. Complete Phase 5: User Story 3 (Remove from Cart)
6. **STOP and VALIDATE**: Test add/remove flows independently
7. Deploy/demo if ready - core cart functionality complete

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → Can add to cart
3. Add User Story 2 → Can view cart (MVP visible)
4. Add User Story 3 → Can remove from cart (MVP complete!)
5. Add User Story 4 → Cart persists
6. Add User Story 5 → Cart icon in header
7. Add User Story 6 → Quantity controls in cart

---

## Summary

| Metric                      | Count               |
| --------------------------- | ------------------- |
| **Total Tasks**             | 84                  |
| **Setup Phase**             | 4                   |
| **Foundational Phase**      | 3                   |
| **User Story 1 (Add)**      | 14                  |
| **User Story 2 (View)**     | 11                  |
| **User Story 3 (Remove)**   | 14                  |
| **User Story 4 (Persist)**  | 9                   |
| **User Story 5 (Icon)**     | 12                  |
| **User Story 6 (Quantity)** | 8                   |
| **Polish Phase**            | 7                   |
| **Parallel Opportunities**  | 28 tasks marked [P] |

**MVP Scope**: User Stories 1-3 (Add, View, Remove) - 39 tasks total

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Tests explicitly requested for add/remove functionality - included in US1, US3, and integration test
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
