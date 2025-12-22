# Implementation Plan: Order Management

**Branch**: `045-order-management` | **Date**: 2025-12-22 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/045-order-management/spec.md`

## Summary

Implement complete order management system with public checkout flow (cart validation → order summary → customer info form → confirmation → thank you page) and a dedicated protected orders management page at `/commandes` for administrators to view and manage order statuses. All public and admin labels in French.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router + React 19  
**Primary Dependencies**: Chakra UI v3, tsyringe (DI), Mongoose, existing CartContext, existing BetterAuth authentication  
**Storage**: MongoDB via Mongoose (Order entity), localStorage (`shower-cart`) for cart  
**Testing**: Jest for unit tests and integration tests (only when explicitly requested)  
**Target Platform**: Web (Next.js App Router)  
**Project Type**: Web application  
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)  
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, consistent theme color usage, YAGNI (minimal implementation), DRY (no duplication), KISS (simple code), configuration portability (sync export/import on config changes)  
**Scale/Scope**: Standard e-commerce order flow for small business website

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Status  | Implementation                                                                                                                   |
| ------------------------------------ | ------- | -------------------------------------------------------------------------------------------------------------------------------- |
| I. Architecture-First Development    | ✅ PASS | Order entity in domain, OrderService in application, MongoOrderRepository in infrastructure, checkout components in presentation |
| II. Focused Testing Approach         | ✅ PASS | No tests created unless explicitly requested                                                                                     |
| III. Simplicity-First Implementation | ✅ PASS | No performance monitoring, straightforward CRUD operations                                                                       |
| IV. Security by Default              | ✅ PASS | Orders management page protected by BetterAuth + admin email check                                                               |
| V. Clean Architecture Compliance     | ✅ PASS | Proper layer separation, dependency injection with tsyringe                                                                      |
| VI. Accessibility-First Design       | ✅ PASS | Using Chakra UI semantic tokens, proper form labels, theme-aware components                                                      |
| VII. YAGNI                           | ✅ PASS | Only implementing required features - no payment, no order editing, no cancellation                                              |
| VIII. DRY                            | ✅ PASS | Reusing existing CartContext, formatPrice utility, authentication patterns                                                       |
| IX. KISS                             | ✅ PASS | Simple 3-status workflow, standard form validation, direct patterns                                                              |
| X. Configuration Portability         | ⚠️ N/A  | No new configuration fields added - order data is transactional, not configuration                                               |

**Gate Status**: ✅ PASS - All applicable principles satisfied

## Project Structure

### Documentation (this feature)

```text
specs/045-order-management/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (API contracts)
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── commandes/                    # NEW: Admin order management page
│   │   └── page.tsx
│   ├── checkout/                     # NEW: Public checkout flow
│   │   ├── page.tsx                  # Order summary + customer form
│   │   └── confirmation/
│   │       └── page.tsx              # Thank you page
│   └── api/
│       ├── orders/                   # NEW: Admin order API
│       │   ├── route.ts              # GET all orders
│       │   └── [id]/
│       │       ├── route.ts          # GET single order
│       │       └── status/
│       │           └── route.ts      # PATCH update status
│       └── public/
│           └── orders/               # NEW: Public order creation
│               └── route.ts          # POST create order
├── domain/
│   └── order/                        # NEW: Order domain
│       ├── entities/
│       │   ├── Order.ts
│       │   └── OrderItem.ts
│       ├── value-objects/
│       │   └── OrderStatus.ts
│       └── repositories/
│           └── IOrderRepository.ts
├── application/
│   └── order/                        # NEW: Order use cases
│       ├── CreateOrder.ts
│       ├── GetAllOrders.ts
│       ├── GetOrderById.ts
│       └── UpdateOrderStatus.ts
├── infrastructure/
│   └── order/                        # NEW: Order infrastructure
│       ├── MongoOrderRepository.ts
│       └── OrderModel.ts
└── presentation/
    ├── shared/
    │   └── components/
    │       └── checkout/             # NEW: Checkout components
    │           ├── OrderSummary.tsx
    │           ├── CustomerInfoForm.tsx
    │           └── ThankYouPage.tsx
    └── admin/
        └── components/
            └── orders/               # NEW: Admin order components
                ├── OrdersList.tsx
                ├── OrderDetailsCard.tsx
                └── OrderStatusSelect.tsx

test/
├── unit/
│   ├── domain/order/
│   │   ├── Order.test.ts             # Order entity validation tests
│   │   └── OrderStatus.test.ts       # Status transitions tests
│   └── application/order/
│       ├── CreateOrder.test.ts       # Order creation with purchaser validation
│       └── UpdateOrderStatus.test.ts # Status change tests
└── integration/
    └── order-management.integration.test.tsx  # Full flow tests
```

**Structure Decision**: Following existing project architecture with domain/application/infrastructure/presentation layers. Order management page at `/commandes` (outside `/admin`) as per user requirement, but still protected by admin authentication.

## Complexity Tracking

> No violations - all implementations follow constitution principles.

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| N/A       | N/A        | N/A                                  |

## Test Specifications

### Unit Tests: Order Entity Validation (`test/unit/domain/order/Order.test.ts`)

```text
describe('Order Entity')
  describe('Purchaser Information Validation')
    ✓ should create order with valid purchaser info (nom, prénom, email, téléphone)
    ✓ should reject empty firstName (prénom)
    ✓ should reject empty lastName (nom)
    ✓ should reject empty email
    ✓ should reject invalid email format (missing @)
    ✓ should reject invalid email format (missing domain)
    ✓ should reject empty phone number
    ✓ should reject phone number with invalid characters
    ✓ should accept phone number with spaces and dashes
    ✓ should accept international phone format (+33)
    ✓ should trim whitespace from all fields

  describe('Order Items Validation')
    ✓ should reject order with empty items array
    ✓ should reject order item with quantity < 1
    ✓ should reject order item with quantity > 99
    ✓ should reject order item with negative price
    ✓ should calculate total price correctly from items
```

### Unit Tests: Order Status Transitions (`test/unit/domain/order/OrderStatus.test.ts`)

```text
describe('OrderStatus')
  describe('Valid Transitions')
    ✓ should allow transition from "nouveau" to "confirmée"
    ✓ should allow transition from "confirmée" to "terminée"
    ✓ should allow transition from "nouveau" to "terminée" (skip confirmée)

  describe('Invalid Transitions')
    ✓ should reject transition from "terminée" to "nouveau"
    ✓ should reject transition from "terminée" to "confirmée"
    ✓ should reject transition from "confirmée" to "nouveau"

  describe('Status Values')
    ✓ should have exactly 3 valid statuses: nouveau, confirmée, terminée
    ✓ should reject invalid status value
```

### Unit Tests: CreateOrder Use Case (`test/unit/application/order/CreateOrder.test.ts`)

```text
describe('CreateOrder Use Case')
  describe('Successful Order Creation')
    ✓ should create order with valid data and return order with id
    ✓ should set initial status to "nouveau"
    ✓ should set createdAt to current timestamp
    ✓ should persist order via repository

  describe('Purchaser Validation Errors')
    ✓ should throw validation error for missing firstName
    ✓ should throw validation error for missing lastName
    ✓ should throw validation error for invalid email
    ✓ should throw validation error for invalid phone
    ✓ should include field name in validation error message

  describe('Items Validation Errors')
    ✓ should throw validation error for empty cart
    ✓ should throw validation error for invalid quantity
```

### Unit Tests: UpdateOrderStatus Use Case (`test/unit/application/order/UpdateOrderStatus.test.ts`)

```text
describe('UpdateOrderStatus Use Case')
  describe('Successful Status Update')
    ✓ should update status from "nouveau" to "confirmée"
    ✓ should update status from "confirmée" to "terminée"
    ✓ should set updatedAt timestamp on status change
    ✓ should persist updated order via repository

  describe('Status Transition Errors')
    ✓ should throw error for invalid transition (terminée → nouveau)
    ✓ should throw error for invalid transition (confirmée → nouveau)
    ✓ should throw error for non-existent order id

  describe('Authorization')
    ✓ should only allow admin users to update status
```

### Integration Tests (`test/integration/order-management.integration.test.tsx`)

```text
describe('Order Management Integration')
  describe('Public Checkout Flow')
    ✓ should display cart items on checkout page
    ✓ should show validation errors for invalid customer info
    ✓ should create order and redirect to confirmation page
    ✓ should display order summary on thank you page
    ✓ should clear cart after successful order

  describe('Admin Orders Page')
    ✓ should redirect to login if not authenticated
    ✓ should display orders list for authenticated admin
    ✓ should show order details when expanded
    ✓ should update order status via dropdown
```
