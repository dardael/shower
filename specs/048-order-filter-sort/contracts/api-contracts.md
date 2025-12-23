# API Contracts: Order Filter and Sort

**Feature**: 048-order-filter-sort  
**Date**: 2025-12-23

## Overview

This feature uses **client-side filtering and sorting**. No new API endpoints are required. The existing APIs provide all necessary data.

## Existing APIs Used

### GET /api/orders

Returns all orders. Filter/sort logic applied client-side.

**Response**:

```json
{
  "orders": [
    {
      "id": "string",
      "customerFirstName": "string",
      "customerLastName": "string",
      "customerEmail": "string",
      "customerPhone": "string",
      "items": [
        {
          "productId": "string",
          "productName": "string",
          "quantity": "number",
          "unitPrice": "number"
        }
      ],
      "totalPrice": "number",
      "status": "NEW | CONFIRMED | COMPLETED",
      "createdAt": "ISO8601 date string",
      "updatedAt": "ISO8601 date string"
    }
  ]
}
```

### GET /api/products

Returns all products. Used to populate product filter dropdown and map products to categories.

**Response**:

```json
{
  "products": [
    {
      "id": "string",
      "name": "string",
      "categoryIds": ["string"]
    }
  ]
}
```

### GET /api/products/categories

Returns all categories. Used to populate category filter dropdown.

**Response**:

```json
{
  "categories": [
    {
      "id": "string",
      "name": "string"
    }
  ]
}
```

## Client-Side Contracts

### useOrderFilters Hook

```typescript
interface UseOrderFiltersReturn {
  filters: OrderFilterState;
  setStatusFilter: (statuses: OrderStatus[]) => void;
  setCustomerNameFilter: (name: string) => void;
  setProductFilter: (productId: string | null) => void;
  setCategoryFilter: (categoryId: string | null) => void;
  resetFilters: () => void;
  applyFilters: (orders: Order[]) => Order[];
}
```

### useOrderSort Hook

```typescript
interface UseOrderSortReturn {
  sort: OrderSortState;
  setSortField: (field: SortField) => void;
  toggleSortDirection: () => void;
  applySort: (orders: Order[]) => Order[];
}
```

### Combined useOrdersFilterSort Hook

```typescript
interface UseOrdersFilterSortReturn {
  // Filter state and actions
  filters: OrderFilterState;
  setStatusFilter: (statuses: OrderStatus[]) => void;
  setCustomerNameFilter: (name: string) => void;
  setProductFilter: (productId: string | null) => void;
  setCategoryFilter: (categoryId: string | null) => void;
  resetFilters: () => void;

  // Sort state and actions
  sort: OrderSortState;
  setSortField: (field: SortField) => void;
  toggleSortDirection: () => void;

  // Combined processing
  processOrders: (orders: Order[]) => Order[];
  resultCount: number;
}
```
