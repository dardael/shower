# Quickstart: Order Management

**Feature**: 045-order-management  
**Date**: 2025-12-22

## Overview

This feature implements:

1. **Public checkout flow**: Cart validation → Order summary → Customer info form → Confirmation → Thank you page
2. **Admin order management**: Protected page at `/commandes` to view and manage orders

## Prerequisites

- Existing shopping cart functionality (044-shopping-cart)
- BetterAuth authentication configured
- MongoDB database connection
- Product entity and API endpoints

## Key Files to Create

### Domain Layer

```
src/domain/order/
├── entities/
│   ├── Order.ts              # Order entity with validation
│   └── OrderItem.ts          # OrderItem entity
├── value-objects/
│   └── OrderStatus.ts        # OrderStatus enum (NEW, CONFIRMED, COMPLETED)
└── repositories/
    └── IOrderRepository.ts   # Repository interface
```

### Application Layer

```
src/application/order/
├── CreateOrder.ts            # Create order use case
├── GetAllOrders.ts           # Get all orders (admin)
├── GetOrderById.ts           # Get single order
└── UpdateOrderStatus.ts      # Update order status (admin)
```

### Infrastructure Layer

```
src/infrastructure/order/
├── MongoOrderRepository.ts   # MongoDB implementation
└── OrderModel.ts             # Mongoose schema
```

### Presentation Layer

```
src/presentation/shared/components/checkout/
├── OrderSummary.tsx          # Displays cart items for review
├── CustomerInfoForm.tsx      # Customer information form with validation
└── ThankYouPage.tsx          # Order confirmation display

src/presentation/admin/components/orders/
├── OrdersList.tsx            # List of all orders
├── OrderDetailsCard.tsx      # Single order details
└── OrderStatusSelect.tsx     # Status dropdown selector
```

### App Routes

```
src/app/
├── checkout/
│   ├── page.tsx              # Order summary + customer form
│   └── confirmation/
│       └── page.tsx          # Thank you page
├── commandes/
│   └── page.tsx              # Admin order management
└── api/
    ├── orders/
    │   ├── route.ts          # GET all orders (admin)
    │   └── [id]/
    │       ├── route.ts      # GET single order (admin)
    │       └── status/
    │           └── route.ts  # PATCH update status
    └── public/
        └── orders/
            ├── route.ts      # POST create order
            └── [id]/
                └── route.ts  # GET order for thank you page
```

## Implementation Order

1. **Domain Layer First**
   - Create OrderStatus value object
   - Create OrderItem entity
   - Create Order entity with validation
   - Define IOrderRepository interface

2. **Infrastructure Layer**
   - Create Mongoose OrderModel
   - Implement MongoOrderRepository
   - Register in DI container

3. **Application Layer**
   - Implement CreateOrder use case
   - Implement GetAllOrders use case
   - Implement GetOrderById use case
   - Implement UpdateOrderStatus use case

4. **API Routes**
   - POST /api/public/orders (create order)
   - GET /api/public/orders/[id] (for thank you page)
   - GET /api/orders (admin - all orders)
   - GET /api/orders/[id] (admin - single order)
   - PATCH /api/orders/[id]/status (admin - update status)

5. **Presentation Components**
   - OrderSummary component
   - CustomerInfoForm component
   - ThankYouPage component
   - OrdersList component
   - OrderDetailsCard component
   - OrderStatusSelect component

6. **Page Integration**
   - /checkout page with form and cart integration
   - /checkout/confirmation thank you page
   - /commandes admin page with auth protection

## French Labels Reference

### Public Checkout

- "Valider le panier" - Validate cart button
- "Récapitulatif de votre commande" - Order summary title
- "Nom" - Last name field
- "Prénom" - First name field
- "Email" - Email field
- "Téléphone" - Phone field
- "Confirmer la commande" - Confirm order button
- "Merci pour votre commande" - Thank you message
- "Retour à l'accueil" - Return to homepage button
- "Total" - Total price label
- "Quantité" - Quantity label

### Validation Errors

- "Ce champ est obligatoire" - Required field
- "Veuillez entrer une adresse email valide" - Invalid email
- "Veuillez entrer un numéro de téléphone valide (10 chiffres)" - Invalid phone

### Admin Orders

- "Gestion des commandes" - Page title
- "Nouveau" - New status
- "Confirmée" - Confirmed status
- "Terminée" - Completed status
- "Aucune commande" - No orders message
- "Client" - Customer column
- "Date" - Date column
- "Total" - Total column
- "Statut" - Status column
- "Détails de la commande" - Order details title

## Validation Rules

### Customer Info Form

- **Prénom**: Required, non-empty
- **Nom**: Required, non-empty
- **Email**: Required, valid email format
- **Téléphone**: Required, French format (10 digits starting with 0)

### Phone Regex

```typescript
const FRENCH_PHONE_REGEX = /^0[1-9][0-9]{8}$/;
```

## Authentication Pattern (for /commandes)

```typescript
// Reuse existing pattern from /admin/page.tsx
const session = await AdminPageAuthenticator.getSession();
if (!session) {
  return <LoginPage />;
}

const isAuthorized = await AdminPageAuthenticator.isAuthorized(session);
if (!isAuthorized) {
  return <NotAuthorized />;
}

// Render orders management UI
```
