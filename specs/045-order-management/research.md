# Research: Order Management

**Feature**: 045-order-management  
**Date**: 2025-12-22

## Research Tasks Completed

### 1. Shopping Cart Integration

**Decision**: Use existing CartContext and CartStorage utilities for cart access

**Rationale**:

- CartContext already provides `items`, `clearCart()`, and cart state management
- CartStorage uses `localStorage` with key `'shower-cart'`
- Cart items contain `productId`, `quantity`, `addedAt`
- Product details (name, price) fetched from `/api/public/products`

**Alternatives Considered**:

- Creating separate checkout cart state → Rejected (duplicates existing functionality)
- Passing cart via URL params → Rejected (security concerns, data size limits)

### 2. Order Data Persistence Pattern

**Decision**: MongoDB via Mongoose following existing repository pattern

**Rationale**:

- Consistent with existing Product, Settings, and other domain entities
- MongoOrderRepository implementing IOrderRepository interface
- Uses dependency injection via tsyringe container

**Alternatives Considered**:

- File-based storage → Rejected (not scalable, transactional concerns)
- Direct MongoDB calls → Rejected (violates hexagonal architecture)

### 3. Order Page Protection (Outside /admin)

**Decision**: Reuse existing authentication pattern with custom page-level check

**Rationale**:

- `/commandes` route will check session using BetterAuth
- Redirect to login if no session
- Show NotAuthorized if email doesn't match ADMIN_EMAIL
- Pattern already proven in `/admin/page.tsx`

**Alternatives Considered**:

- Middleware-based protection → Rejected (middleware protects `/admin/*` pattern, would need modification)
- Separate auth system → Rejected (violates DRY, adds complexity)

### 4. French Labels Implementation

**Decision**: Inline French text in components (following existing pattern)

**Rationale**:

- Existing cart components use inline French text
- No i18n library in project - single language support
- Examples: "Ajouter au panier", "Votre panier est vide", etc.

**Alternatives Considered**:

- i18n library (next-intl, react-i18next) → Rejected (over-engineering for single language)
- Constants file for translations → Considered but not needed (YAGNI)

### 5. Form Validation Pattern

**Decision**: Client-side validation with Chakra UI form components

**Rationale**:

- Use native HTML5 validation attributes (required, type="email", pattern)
- Custom validation for French phone format (10 digits starting with 0)
- Error messages displayed via Chakra FormControl/FormErrorMessage
- Server-side validation in API route as backup

**Alternatives Considered**:

- React Hook Form + Zod → Rejected (adds dependencies, KISS principle)
- Only server-side validation → Rejected (poor UX, spec requires immediate feedback)

### 6. Order Status Workflow

**Decision**: Simple 3-state enum with any-to-any transitions

**Rationale**:

- States: "Nouveau" (new) → "Confirmée" (confirmed) → "Terminée" (completed)
- Admin can change to any status (no enforced workflow)
- Simpler implementation, meets business requirements

**Alternatives Considered**:

- State machine with enforced transitions → Rejected (spec doesn't require it, YAGNI)
- Additional states (cancelled, refunded) → Rejected (not in requirements)

### 7. Product Snapshot Strategy

**Decision**: Capture product name and price at order creation time

**Rationale**:

- OrderItem stores: productId, productName, quantity, unitPrice
- Preserves historical accuracy if product prices change
- Edge case from spec: "Order should capture product snapshot at time of order"

**Alternatives Considered**:

- Reference only productId → Rejected (prices could change, historical data lost)
- Full product copy → Rejected (over-engineering, only need name and price)

### 8. Thank You Page Data Access

**Decision**: Store order ID in URL, fetch order details on page load

**Rationale**:

- After order creation, redirect to `/checkout/confirmation?orderId={id}`
- Page fetches order details from API
- Handles page refresh (order data persisted in DB)

**Alternatives Considered**:

- Pass order in session/state → Rejected (lost on refresh)
- Store in localStorage → Rejected (could be tampered, already have DB)

## Resolved Clarifications

All technical unknowns have been resolved through codebase exploration:

| Unknown                 | Resolution                                              |
| ----------------------- | ------------------------------------------------------- |
| Cart data structure     | CartItemData: { productId, quantity, addedAt }          |
| Product price access    | Fetch from /api/public/products endpoint                |
| Auth protection pattern | BetterAuth + AdminPageAuthenticator + ADMIN_EMAIL check |
| French labels pattern   | Inline French text in components                        |
| Currency formatting     | Existing formatPrice utility (fr-FR, EUR)               |
