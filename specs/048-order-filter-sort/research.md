# Research: Order Filter and Sort

**Feature**: 048-order-filter-sort  
**Date**: 2025-12-23

## Technical Findings

### Existing Order Entity Structure

**Order Fields (from `src/domain/order/entities/Order.ts`):**

- `id: string`
- `customerFirstName: string`
- `customerLastName: string`
- `customerEmail: string`
- `customerPhone: string`
- `items: OrderItemData[]` (contains `productId`, `productName`, `quantity`, `unitPrice`)
- `totalPrice: number`
- `status: OrderStatus`
- `createdAt: Date`
- `updatedAt: Date`

### Order Status Values

**Current OrderStatus enum (from `src/domain/order/value-objects/OrderStatus.ts`):**

- `NEW` = "Nouveau"
- `CONFIRMED` = "Confirmée"
- `COMPLETED` = "Terminée"

**Note**: The spec mentions additional statuses (Pending, Processing, Shipped, Cancelled). These may need to be added or the spec should align with existing statuses.

**Decision**: Use existing statuses (NEW, CONFIRMED, COMPLETED) for filter implementation. Status values are:

- NEW → "Nouveau" (equivalent to Pending)
- CONFIRMED → "Confirmée" (equivalent to Processing)
- COMPLETED → "Terminée" (Done/Completed - hidden by default)

### Product/Category Structure

**Product Fields (from `src/domain/product/entities/Product.ts`):**

- `id: string`
- `name: string`
- `categoryIds: string[]` (array of category IDs)

**Category Fields (from `src/domain/product/entities/Category.ts`):**

- `id: string`
- `name: string`

### Current Implementation

**Key Files:**

- Order page: `src/app/commandes/page.tsx` (server), `src/app/commandes/OrdersClient.tsx` (client)
- Repository: `src/infrastructure/order/repositories/MongooseOrderRepository.ts`
- Existing sort: Orders already sorted by `createdAt` descending

**Existing Indexes:**

- `{ createdAt: -1 }` - for date sorting
- `{ status: 1 }` - for status filtering

## Design Decisions

### Decision 1: Client-side vs Server-side Filtering

**Decision**: Client-side filtering  
**Rationale**: As per spec assumption, filter logic runs on the client for simplicity. Expected order volumes are manageable for small-to-medium businesses.  
**Alternatives Considered**: Server-side filtering with API query params. Rejected for simplicity (KISS principle) given scope.

### Decision 2: Filter State Management

**Decision**: Use React state with custom hook `useOrderFilters`  
**Rationale**: Encapsulates filter logic, reusable, testable. Follows existing hook patterns in codebase.  
**Alternatives Considered**: Context API (overkill for single page), URL params (spec says no persistence needed).

### Decision 3: Customer Name Search

**Decision**: Case-insensitive, accent-insensitive search combining `customerFirstName` and `customerLastName`  
**Rationale**: Spec requires FR-015 accent/case insensitive. Combine names for "full name" search experience.  
**Implementation**: Use `normalize('NFD').replace(/[\u0300-\u036f]/g, '')` for accent removal.

### Decision 4: Product/Category Filter Data Source

**Decision**: Fetch products and categories on page load for dropdown population  
**Rationale**: Products and categories needed for filter dropdowns. API routes already exist.  
**Implementation**: Call existing `/api/products` and `/api/products/categories` endpoints.

### Decision 5: Status Filter Behavior

**Decision**: Multi-select checkboxes with COMPLETED unchecked by default  
**Rationale**: Spec FR-002 requires hiding completed by default. Multi-select supports FR-004 (multiple statuses).  
**UI**: Checkbox list matching status badge colors for visual consistency.

## Testing Strategy

### Unit Tests

1. **Filter Logic Tests** (`useOrderFilters` hook):
   - Filter by single status
   - Filter by multiple statuses
   - Filter by customer name (partial, case-insensitive, accent-insensitive)
   - Filter by product
   - Filter by category
   - Combine multiple filters (AND logic)
   - Reset to defaults

2. **Sort Logic Tests** (`useOrderSort` hook):
   - Sort by date ascending/descending
   - Sort by customer name ascending/descending
   - Sort by status (logical order)
   - Default sort state

### Integration Tests

1. **Filter Panel Tests**:
   - Renders all filter controls
   - Status checkboxes update filter state
   - Name input triggers search
   - Product/category dropdowns filter correctly
   - Reset button restores defaults

2. **Order List Tests**:
   - Displays filtered results
   - Shows "Aucune commande trouvée" when no matches
   - Updates immediately on filter change

## Dependencies

- Existing Order entity and repository
- Existing Product/Category entities
- OrderStatus enum for status values
- Chakra UI for filter components (Select, Input, Checkbox, Button)
