# Tasks: Order Management

**Input**: Design documents from `/specs/045-order-management/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests ARE requested for this feature - specifically for order creation (with purchaser information validation) and order status changes.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and domain layer setup

- [x] T001 [P] Create Order entity in src/domain/order/entities/Order.ts
- [x] T002 [P] Create OrderItem entity in src/domain/order/entities/OrderItem.ts
- [x] T003 [P] Create OrderStatus value object in src/domain/order/value-objects/OrderStatus.ts
- [x] T004 Create IOrderRepository interface in src/domain/order/repositories/IOrderRepository.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create OrderModel Mongoose schema in src/infrastructure/order/OrderModel.ts
- [x] T006 Implement MongoOrderRepository in src/infrastructure/order/MongoOrderRepository.ts
- [x] T007 Register Order dependencies in src/infrastructure/container.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Validate Shopping Cart and Place Order (Priority: P1) 🎯 MVP

**Goal**: Enable customers to validate their cart, provide their information, and place an order

**Independent Test**: Add products to cart, proceed to checkout, fill customer information (nom, prénom, email, téléphone), confirm order, verify order is created

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**
> **FOCUS: Unit tests for order creation with purchaser validation**

- [x] T008 [P] [US1] Unit test for Order entity purchaser validation in test/unit/domain/order/Order.test.ts
- [x] T009 [P] [US1] Unit test for CreateOrder use case in test/unit/application/order/CreateOrder.test.ts

### Implementation for User Story 1

- [x] T010 [US1] Implement CreateOrder use case in src/application/order/CreateOrder.ts
- [x] T011 [US1] Implement POST /api/public/orders route in src/app/api/public/orders/route.ts
- [x] T012 [P] [US1] Create OrderSummary component in src/presentation/shared/components/checkout/OrderSummary.tsx
- [x] T013 [P] [US1] Create CustomerInfoForm component with validation in src/presentation/shared/components/checkout/CustomerInfoForm.tsx
- [x] T014 [US1] Create checkout page in src/app/checkout/page.tsx
- [x] T015 [US1] Add "Valider le panier" button to existing cart component
- [x] T016 [US1] Verify all labels are in French (Nom, Prénom, Email, Téléphone, Valider le panier, Confirmer la commande)
- [x] T017 [US1] Verify contrast compliance for checkout form in light and dark modes

**Checkpoint**: User Story 1 - Customers can place orders with validated information

---

## Phase 4: User Story 2 - View Order Confirmation (Priority: P1)

**Goal**: Display thank you page with order summary after successful order placement

**Independent Test**: Complete an order, verify thank you page displays with "Merci pour votre commande", order details, and return to homepage button

### Implementation for User Story 2

- [x] T018 [US2] Implement GET /api/public/orders/[id] route in src/app/api/public/orders/[id]/route.ts
- [x] T019 [US2] Create ThankYouPage component in src/presentation/shared/components/checkout/ThankYouPage.tsx
- [x] T020 [US2] Create confirmation page in src/app/checkout/confirmation/page.tsx
- [x] T021 [US2] Implement cart clearing after successful order in checkout flow
- [x] T022 [US2] Verify all labels are in French (Merci pour votre commande, Retour à l'accueil)
- [x] T023 [US2] Verify contrast compliance for thank you page in light and dark modes

**Checkpoint**: User Stories 1 AND 2 complete - Full public checkout flow functional

---

## Phase 5: User Story 3 - Administrator Views Orders (Priority: P2)

**Goal**: Enable administrators to view all orders with customer and product details

**Independent Test**: Log in as admin, navigate to /commandes, verify orders list displays with customer name, date, total, status, and expandable details

### Implementation for User Story 3

- [x] T024 [US3] Implement GetAllOrders use case in src/application/order/GetAllOrders.ts
- [x] T025 [US3] Implement GetOrderById use case in src/application/order/GetOrderById.ts
- [x] T026 [US3] Implement GET /api/orders route with auth protection in src/app/api/orders/route.ts
- [x] T027 [US3] Implement GET /api/orders/[id] route with auth protection in src/app/api/orders/[id]/route.ts
- [x] T028 [P] [US3] Create OrdersList component in src/presentation/admin/components/orders/OrdersList.tsx
- [x] T029 [P] [US3] Create OrderDetailsCard component in src/presentation/admin/components/orders/OrderDetailsCard.tsx
- [x] T030 [US3] Create orders management page at src/app/commandes/page.tsx with auth protection
- [x] T031 [US3] Add empty state message in French when no orders exist
- [x] T032 [US3] Verify all admin labels are in French (Commandes, Nouveau, Confirmée, Terminée, etc.)
- [x] T033 [US3] Verify contrast compliance for orders page in light and dark modes

**Checkpoint**: User Story 3 complete - Admins can view all orders

---

## Phase 6: User Story 4 - Administrator Manages Order Status (Priority: P2)

**Goal**: Enable administrators to update order status (Nouveau → Confirmée → Terminée)

**Independent Test**: As admin, change order status, verify change persists and displays correctly

### Tests for User Story 4 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**
> **FOCUS: Unit tests for order status transitions**

- [x] T034 [P] [US4] Unit test for OrderStatus transitions in test/unit/domain/order/OrderStatus.test.ts
- [x] T035 [P] [US4] Unit test for UpdateOrderStatus use case in test/unit/application/order/UpdateOrderStatus.test.ts

### Implementation for User Story 4

- [x] T036 [US4] Implement UpdateOrderStatus use case in src/application/order/UpdateOrderStatus.ts
- [x] T037 [US4] Implement PATCH /api/orders/[id]/status route in src/app/api/orders/[id]/status/route.ts
- [x] T038 [US4] Create OrderStatusSelect component in src/presentation/admin/components/orders/OrderStatusSelect.tsx
- [x] T039 [US4] Integrate status select into OrderDetailsCard component
- [x] T040 [US4] Ensure status changes reflect immediately without page refresh
- [x] T041 [US4] Verify status labels display in French (Nouveau, Confirmée, Terminée)

**Checkpoint**: All user stories complete - Full order management system functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Integration tests and final validation

- [x] T042 [P] Integration test for public checkout flow in test/integration/order-management.integration.test.tsx
- [x] T043 Verify YAGNI compliance (minimal implementation, no payment, no order editing)
- [x] T044 Verify DRY compliance (reuse CartContext, formatPrice, auth patterns)
- [x] T045 Verify KISS compliance (simple 3-status workflow, direct patterns)
- [x] T046 Run quickstart.md validation scenarios

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - Core checkout flow
- **User Story 2 (P1)**: Depends on US1 (needs order creation to display confirmation)
- **User Story 3 (P2)**: Can start after Foundational - Independent admin view
- **User Story 4 (P2)**: Depends on US3 (needs orders list to display status control)

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Domain entities before use cases
- Use cases before API routes
- API routes before UI components
- Core implementation before integration

### Parallel Opportunities

- T001, T002, T003 can run in parallel (different domain files)
- T008, T009 can run in parallel (different test files)
- T012, T013 can run in parallel (different components)
- T028, T029 can run in parallel (different components)
- T034, T035 can run in parallel (different test files)

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Unit test for Order entity purchaser validation in test/unit/domain/order/Order.test.ts"
Task: "Unit test for CreateOrder use case in test/unit/application/order/CreateOrder.test.ts"

# Launch checkout components in parallel:
Task: "Create OrderSummary component in src/presentation/shared/components/checkout/OrderSummary.tsx"
Task: "Create CustomerInfoForm component in src/presentation/shared/components/checkout/CustomerInfoForm.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup (domain layer)
2. Complete Phase 2: Foundational (infrastructure)
3. Complete Phase 3: User Story 1 (order creation with validation)
4. Complete Phase 4: User Story 2 (thank you page)
5. **STOP and VALIDATE**: Test complete public checkout flow
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Stories 1 + 2 → Public checkout works → Deploy/Demo (MVP!)
3. Add User Story 3 → Admin can view orders → Deploy/Demo
4. Add User Story 4 → Admin can manage status → Deploy/Demo
5. Polish → Tests and validation → Final release

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Tests explicitly requested for order creation (purchaser validation) and status changes
- All public and admin labels MUST be in French
- Orders page at /commandes (outside /admin) but protected by admin auth
- Commit after each task or logical group
