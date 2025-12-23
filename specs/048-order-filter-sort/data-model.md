# Data Model: Order Filter and Sort

**Feature**: 048-order-filter-sort  
**Date**: 2025-12-23

## Existing Entities (No Modifications Required)

This feature uses client-side filtering on existing entities. No database schema changes needed.

### Order Entity

```typescript
interface OrderData {
  id: string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItemData[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

interface OrderItemData {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

enum OrderStatus {
  NEW = 'NEW',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
}
```

### Product Entity

```typescript
interface ProductData {
  id: string;
  name: string;
  categoryIds: string[];
  // ... other fields not relevant for filtering
}
```

### Category Entity

```typescript
interface CategoryData {
  id: string;
  name: string;
  // ... other fields not relevant for filtering
}
```

## New Value Objects

### OrderFilterState

```typescript
interface OrderFilterState {
  statuses: OrderStatus[]; // Selected statuses (empty = all)
  customerName: string; // Partial name search
  productId: string | null; // Selected product ID
  categoryId: string | null; // Selected category ID
}

const DEFAULT_FILTER_STATE: OrderFilterState = {
  statuses: [OrderStatus.NEW, OrderStatus.CONFIRMED], // Exclude COMPLETED
  customerName: '',
  productId: null,
  categoryId: null,
};
```

### OrderSortState

```typescript
type SortField = 'date' | 'customerName' | 'status';
type SortDirection = 'asc' | 'desc';

interface OrderSortState {
  field: SortField;
  direction: SortDirection;
}

const DEFAULT_SORT_STATE: OrderSortState = {
  field: 'date',
  direction: 'desc', // Newest first
};
```

### Status Sort Order

```typescript
const STATUS_SORT_ORDER: Record<OrderStatus, number> = {
  [OrderStatus.NEW]: 1,
  [OrderStatus.CONFIRMED]: 2,
  [OrderStatus.COMPLETED]: 3,
};
```

## Relationships for Filtering

```
Order
  └── items[] ──────► OrderItem
                          └── productId ──────► Product
                                                    └── categoryIds[] ──────► Category
```

**Filter Logic**:

- **By Product**: Order matches if any `items[].productId` equals selected product
- **By Category**: Order matches if any product in items has `categoryIds` containing selected category
  - Requires product lookup: fetch products, build `productId → categoryIds` map
