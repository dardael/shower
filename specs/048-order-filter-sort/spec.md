# Feature Specification: Order Filter and Sort

**Feature Branch**: `048-order-filter-sort`  
**Created**: 2025-12-23  
**Status**: Draft  
**Input**: As an administrator handling the commands, I need to filter/sort them to treat them one by one. I need to filter on status, on name, on product, on category product. And I need to sort by date, by name, and by status. By default when coming on the screen I want to hide done commands, and I want to sort by date desc.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Filter Orders by Status (Priority: P1)

As an administrator, I want to filter orders by their status so that I can focus on orders that need my attention and process them efficiently.

**Why this priority**: Status filtering is the most critical filter as it directly enables the administrator to focus on actionable orders. The default behavior of hiding completed orders depends on this capability.

**Independent Test**: Can be fully tested by displaying the order list, applying a status filter, and verifying only orders with the selected status are shown.

**Acceptance Scenarios**:

1. **Given** I am on the order management screen with orders in various statuses, **When** I select "En attente" (Pending) from the status filter, **Then** only orders with "En attente" status are displayed
2. **Given** I am on the order management screen, **When** I first load the page, **Then** orders with "Terminée" (Done/Completed) status are hidden by default
3. **Given** I have filtered orders by status, **When** I clear the status filter, **Then** all orders (including completed) are displayed
4. **Given** I am on the order management screen, **When** I select multiple statuses from the filter, **Then** orders matching any of the selected statuses are displayed

---

### User Story 2 - Sort Orders by Date, Name, or Status (Priority: P1)

As an administrator, I want to sort orders by different criteria so that I can organize my workflow and prioritize which orders to process first.

**Why this priority**: Sorting is essential for efficient order processing. Combined with filtering, it enables administrators to work through orders systematically. Default sort by date descending ensures newest orders are visible first.

**Independent Test**: Can be fully tested by displaying the order list, clicking sort controls, and verifying the order changes correctly.

**Acceptance Scenarios**:

1. **Given** I am on the order management screen, **When** the page loads, **Then** orders are sorted by date in descending order (newest first) by default
2. **Given** I am viewing the order list, **When** I click on the date sort option, **Then** I can toggle between ascending (oldest first) and descending (newest first) order
3. **Given** I am viewing the order list, **When** I sort by customer name, **Then** orders are arranged alphabetically by customer name
4. **Given** I am viewing the order list, **When** I sort by status, **Then** orders are grouped by their status in a logical order (e.g., Pending → Processing → Shipped → Completed → Cancelled)

---

### User Story 3 - Filter Orders by Customer Name (Priority: P2)

As an administrator, I want to search/filter orders by customer name so that I can quickly find orders for a specific customer.

**Why this priority**: Name search is a common need when a customer contacts support or when processing related orders together.

**Independent Test**: Can be fully tested by entering a customer name in the search field and verifying matching orders are displayed.

**Acceptance Scenarios**:

1. **Given** I am on the order management screen, **When** I type a customer name in the name filter field, **Then** only orders from customers whose name contains the search text are displayed
2. **Given** I have entered a partial name "Dup", **When** the filter is applied, **Then** orders from customers like "Dupont", "Dupuis", "Duplan" are all shown
3. **Given** I have a name filter applied, **When** I clear the filter field, **Then** all orders (subject to other active filters) are displayed

---

### User Story 4 - Filter Orders by Product (Priority: P2)

As an administrator, I want to filter orders by product so that I can see all orders containing a specific product.

**Why this priority**: Product filtering helps when managing inventory, handling product-specific issues, or processing orders for products with special handling requirements.

**Independent Test**: Can be fully tested by selecting a product from the filter and verifying only orders containing that product are displayed.

**Acceptance Scenarios**:

1. **Given** I am on the order management screen, **When** I select a product from the product filter, **Then** only orders containing that product are displayed
2. **Given** an order contains multiple products, **When** I filter by one of those products, **Then** that order is included in the results
3. **Given** I have a product filter applied, **When** I clear the filter, **Then** all orders (subject to other active filters) are displayed

---

### User Story 5 - Filter Orders by Product Category (Priority: P2)

As an administrator, I want to filter orders by product category so that I can see all orders containing products from a specific category.

**Why this priority**: Category filtering provides a broader view than product filtering, useful for managing orders by product type or department.

**Independent Test**: Can be fully tested by selecting a category from the filter and verifying only orders with products in that category are displayed.

**Acceptance Scenarios**:

1. **Given** I am on the order management screen, **When** I select a category from the category filter, **Then** only orders containing products from that category are displayed
2. **Given** an order contains products from multiple categories, **When** I filter by one category, **Then** that order is included in the results
3. **Given** I have a category filter applied, **When** I clear the filter, **Then** all orders (subject to other active filters) are displayed

---

### User Story 6 - Combine Multiple Filters (Priority: P3)

As an administrator, I want to apply multiple filters simultaneously so that I can narrow down the order list to exactly the orders I need to process.

**Why this priority**: While individual filters provide value, combining them enables more precise order management for complex workflows.

**Independent Test**: Can be fully tested by applying multiple filters and verifying the results match all applied criteria.

**Acceptance Scenarios**:

1. **Given** I am on the order management screen, **When** I apply both a status filter and a product filter, **Then** only orders matching both criteria are displayed
2. **Given** I have multiple filters applied, **When** I clear one filter, **Then** the remaining filters continue to apply
3. **Given** I have multiple filters applied, **When** I click "Réinitialiser les filtres" (Reset filters), **Then** all filters are cleared except the default (hide completed orders)

---

### Edge Cases

- What happens when no orders match the applied filters? Display "Aucune commande trouvée" (No orders found) message
- What happens when the product or category list is empty? Display an empty dropdown with a placeholder message
- How does the system handle special characters in customer names when filtering? Search should be accent-insensitive and case-insensitive
- What happens when an order's product or category has been deleted? Order remains visible; filter by deleted product/category returns no results for that item
- What happens when filters and sorting are combined? Filtering is applied first, then sorting is applied to the filtered results

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST display a filter panel on the order management screen with options for status, customer name, product, and category
- **FR-002**: System MUST hide orders with "Terminée" (Completed) status by default when the order management screen loads
- **FR-003**: System MUST sort orders by date in descending order (newest first) by default when the order management screen loads
- **FR-004**: System MUST allow filtering orders by one or more statuses simultaneously
- **FR-005**: System MUST allow filtering orders by customer name using partial text matching (contains search)
- **FR-006**: System MUST allow filtering orders by product, showing only orders containing the selected product
- **FR-007**: System MUST allow filtering orders by category, showing only orders containing products from the selected category
- **FR-008**: System MUST allow sorting orders by date (ascending/descending)
- **FR-009**: System MUST allow sorting orders by customer name (alphabetical ascending/descending)
- **FR-010**: System MUST allow sorting orders by status (logical order: Pending → Processing → Shipped → Completed → Cancelled)
- **FR-011**: System MUST apply multiple filters using AND logic (orders must match all active filters)
- **FR-012**: System MUST provide a "Réinitialiser" (Reset) button to clear all filters and restore defaults
- **FR-013**: System MUST update the order list immediately when filters or sort options change
- **FR-014**: System MUST display the current number of orders matching the applied filters
- **FR-015**: System MUST perform case-insensitive and accent-insensitive search for customer name filter
- **FR-016**: System MUST ensure proper contrast ratios for text and UI elements in both light and dark modes
- **FR-017**: Code MUST implement only strict minimum required for current feature (YAGNI principle)
- **FR-018**: Code MUST avoid duplication through reusable functions and components (DRY principle)
- **FR-019**: Code MUST be simple, readable, and clear with straightforward implementations (KISS principle)
- **FR-020**: All visible text displayed on screen MUST be in French (French Localization principle)

### Key Entities

- **Order**: Existing entity representing a customer order. Key attributes for filtering/sorting: status, customerName, createdAt, products (array of product references)
- **Product**: Existing entity representing a product. Key attributes: name, categoryId
- **Category**: Existing entity representing a product category. Key attributes: name
- **OrderStatus**: Value object representing order status. Possible values: En attente (Pending), En cours (Processing), Expédiée (Shipped), Terminée (Completed), Annulée (Cancelled)

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Administrator can filter orders by any single criterion in under 2 seconds
- **SC-002**: Administrator can apply up to 4 simultaneous filters and see results in under 3 seconds
- **SC-003**: Administrator can change sort order and see reordered results in under 1 second
- **SC-004**: Page loads with default filters (hide completed) and default sort (date descending) applied automatically
- **SC-005**: Administrator can find a specific customer's orders by typing at least 3 characters of their name
- **SC-006**: Administrator can reset all filters to defaults with a single action
- **SC-007**: 100% of filter and sort UI elements are accessible and functional in both light and dark modes

## Assumptions

- Order statuses follow the standard e-commerce workflow: Pending → Processing → Shipped → Completed, with Cancelled as an alternative final state
- The existing order management screen from spec 045-order-management is the target for these filter/sort enhancements
- Product and Category entities from spec 041-product-category-management are available for filtering
- Filter state does not need to persist across page refreshes or sessions (resets to defaults each visit)
- The order list uses client-side filtering for simplicity given expected order volumes (reasonable for small-to-medium businesses)
