# Data Model: Shopping Cart

**Feature**: 044-shopping-cart  
**Date**: 2025-12-21

## Entities

### CartItem (Domain Entity)

Represents a single product entry in the shopping cart.

| Field     | Type   | Required | Constraints   | Description                 |
| --------- | ------ | -------- | ------------- | --------------------------- |
| productId | string | Yes      | UUID format   | Reference to Product entity |
| quantity  | number | Yes      | 1-99, integer | Number of units in cart     |
| addedAt   | Date   | Yes      | Valid date    | Timestamp when first added  |

**Validation Rules**:

- `productId` must be a valid UUID string
- `quantity` must be an integer between 1 and 99 (inclusive)
- `addedAt` must be a valid Date object

**State Transitions**:

- Created: When product first added to cart
- Updated: When quantity changes (increase/decrease)
- Removed: When quantity reaches 0 or explicitly removed

### Cart (Value Object / Aggregate)

Collection of CartItems representing the user's shopping cart.

| Property  | Type       | Description                               |
| --------- | ---------- | ----------------------------------------- |
| items     | CartItem[] | Array of cart items                       |
| itemCount | number     | Total number of items (sum of quantities) |
| isEmpty   | boolean    | True if no items in cart                  |

**Computed Properties**:

- `itemCount`: Sum of all `quantity` values across items
- `isEmpty`: `items.length === 0`

**Note**: Total price is computed at render time using current product prices (not stored).

## Storage Schema

### localStorage Structure

**Key**: `shower-cart`

**Value**: JSON string of CartItem array

```json
[
  {
    "productId": "uuid-string",
    "quantity": 2,
    "addedAt": "2025-12-21T10:30:00.000Z"
  }
]
```

### BroadcastChannel

**Channel Name**: `shower-cart-sync`

**Message Format**:

```json
{
  "type": "cart-updated",
  "items": [
    /* CartItem array */
  ]
}
```

## Relationships

```
┌─────────────────┐
│     Product     │ (existing entity)
│─────────────────│
│ id: string      │◄────────────┐
│ name: string    │             │
│ price: number   │             │ references
│ imageUrl: string│             │
│ ...             │             │
└─────────────────┘             │
                                │
┌─────────────────┐             │
│    CartItem     │─────────────┘
│─────────────────│
│ productId: string
│ quantity: number │
│ addedAt: Date   │
└─────────────────┘
        │
        │ aggregated by
        ▼
┌─────────────────┐
│      Cart       │
│─────────────────│
│ items: CartItem[]
│ itemCount: number
│ isEmpty: boolean │
└─────────────────┘
```

## Data Flow

1. **Add to Cart**:
   - User clicks "Add to Cart" on product
   - CartContext receives productId
   - If product already in cart: increment quantity
   - If new product: create CartItem with quantity=1
   - Persist to localStorage
   - Dispatch update event + broadcast to other tabs

2. **Remove from Cart**:
   - User clicks remove or decreases quantity to 0
   - CartContext removes item from array
   - Persist to localStorage
   - Dispatch update event + broadcast to other tabs

3. **Load Cart**:
   - On app mount: read from localStorage
   - Parse JSON to CartItem array
   - Validate each item (remove invalid entries)
   - Set as initial state

4. **Display Cart**:
   - Fetch current product data for each productId
   - Merge with cart quantities
   - Calculate line totals and cart total using current prices
   - Display in CartDrawer
