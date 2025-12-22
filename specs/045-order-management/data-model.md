# Data Model: Order Management

**Feature**: 045-order-management  
**Date**: 2025-12-22

## Domain Entities

### Order

**Location**: `src/domain/order/entities/Order.ts`

| Field             | Type        | Description                    | Validation                                         |
| ----------------- | ----------- | ------------------------------ | -------------------------------------------------- |
| id                | string      | Unique order identifier        | Auto-generated UUID                                |
| customerFirstName | string      | Customer's first name (prénom) | Required, non-empty                                |
| customerLastName  | string      | Customer's last name (nom)     | Required, non-empty                                |
| customerEmail     | string      | Customer's email address       | Required, valid email format                       |
| customerPhone     | string      | Customer's phone number        | Required, French format (10 digits, starts with 0) |
| items             | OrderItem[] | List of ordered products       | Required, min 1 item                               |
| totalPrice        | number      | Total order amount in EUR      | Calculated from items                              |
| status            | OrderStatus | Current order status           | Required, defaults to "Nouveau"                    |
| createdAt         | Date        | Order creation timestamp       | Auto-generated                                     |
| updatedAt         | Date        | Last update timestamp          | Auto-updated                                       |

**Business Rules**:

- Order must have at least one item
- Total price = sum of (quantity × unitPrice) for all items
- Phone must match French format: `/^0[1-9][0-9]{8}$/`

### OrderItem

**Location**: `src/domain/order/entities/OrderItem.ts`

| Field       | Type   | Description                   | Validation              |
| ----------- | ------ | ----------------------------- | ----------------------- |
| productId   | string | Reference to original product | Required                |
| productName | string | Product name snapshot         | Required, non-empty     |
| quantity    | number | Quantity ordered              | Required, min 1, max 99 |
| unitPrice   | number | Price per unit snapshot       | Required, >= 0          |

**Business Rules**:

- Quantity bounded by cart limits (1-99)
- productName and unitPrice captured at order time (snapshot)

### OrderStatus (Value Object)

**Location**: `src/domain/order/value-objects/OrderStatus.ts`

| Value     | French Label | Description                          |
| --------- | ------------ | ------------------------------------ |
| NEW       | "Nouveau"    | Initial status when order is created |
| CONFIRMED | "Confirmée"  | Order has been confirmed by admin    |
| COMPLETED | "Terminée"   | Order has been fulfilled             |

## Repository Interface

### IOrderRepository

**Location**: `src/domain/order/repositories/IOrderRepository.ts`

```typescript
export interface IOrderRepository {
  create(order: Order): Promise<Order>;
  getById(id: string): Promise<Order | null>;
  getAll(): Promise<Order[]>;
  updateStatus(id: string, status: OrderStatus): Promise<Order | null>;
}
```

## MongoDB Schema

### OrderModel

**Location**: `src/infrastructure/order/OrderModel.ts`

```typescript
const OrderItemSchema = new Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1, max: 99 },
  unitPrice: { type: Number, required: true, min: 0 },
});

const OrderSchema = new Schema(
  {
    customerFirstName: { type: String, required: true },
    customerLastName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    items: { type: [OrderItemSchema], required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['NEW', 'CONFIRMED', 'COMPLETED'],
      default: 'NEW',
    },
  },
  { timestamps: true }
);
```

## Entity Relationships

```
Order (1) ──────< OrderItem (*)
   │                  │
   │                  └── productId references Product.id (snapshot, not FK)
   │
   └── status: OrderStatus (value object)
```

## State Transitions

```
┌─────────┐     ┌────────────┐     ┌────────────┐
│ Nouveau │ ──► │ Confirmée  │ ──► │ Terminée   │
└─────────┘     └────────────┘     └────────────┘
     │                │                   │
     └────────────────┴───────────────────┘
           (Any status can change to any other)
```

**Note**: Admin can change status freely between any states. No enforced workflow restrictions.
