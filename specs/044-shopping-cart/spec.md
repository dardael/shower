# Feature Specification: Shopping Cart

**Feature Branch**: `044-shopping-cart`  
**Created**: 2025-12-21  
**Status**: Draft  
**Input**: User description: "As a user of the website, I want to add/remove products from a shopping cart. I want this shopping cart persisted on the navigator, and when I retrieve the website, I want to retrieve the shopping cart. I want a button in the header menu (desktop and mobile) which shows the number of products in the shopping cart. When clicking on it, I want to see the content of my shopping cart, and here too I want to be able to add/remove products. This functionality must be available only when the selling mode is enabled. I want it working for products with the cart mode and the list mode."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Add Product to Cart (Priority: P1)

As a website visitor browsing products, I want to add a product to my shopping cart so that I can purchase it later.

**Why this priority**: This is the core functionality that enables the shopping cart feature. Without the ability to add products, no other cart functionality is meaningful.

**Independent Test**: Can be fully tested by displaying a product and clicking "Add to Cart", then verifying the cart count increases and the product is stored.

**Acceptance Scenarios**:

1. **Given** selling mode is enabled and I am viewing a product (in list or grid display mode), **When** I click the "Add to Cart" button, **Then** the product is added to my cart and the cart count in the header increases by 1.
2. **Given** selling mode is enabled and I have a product in my cart, **When** I add the same product again, **Then** the quantity of that product in my cart increases by 1.
3. **Given** selling mode is disabled, **When** I view products, **Then** no "Add to Cart" button is displayed.

---

### User Story 2 - View Cart Contents (Priority: P1)

As a website visitor with items in my cart, I want to view my cart contents so that I can see what I plan to purchase.

**Why this priority**: Users need immediate feedback on what they've added. This is essential for any cart interaction and enables the remove functionality.

**Independent Test**: Can be fully tested by adding products, clicking the cart icon in the header, and verifying all added products are displayed with correct details.

**Acceptance Scenarios**:

1. **Given** I have products in my cart, **When** I click the cart icon in the header, **Then** a cart panel/drawer opens showing all products with their names, images, prices, and quantities.
2. **Given** I have multiple different products in my cart, **When** I view the cart, **Then** I see each product listed separately with individual quantities and a total price.
3. **Given** my cart is empty, **When** I click the cart icon, **Then** the cart panel shows a message indicating the cart is empty.

---

### User Story 3 - Remove Product from Cart (Priority: P1)

As a website visitor, I want to remove products from my cart so that I can change my mind about purchases.

**Why this priority**: Essential for cart management. Users must be able to correct mistakes or change their minds.

**Independent Test**: Can be fully tested by adding a product, opening the cart, removing the product, and verifying the cart is updated correctly.

**Acceptance Scenarios**:

1. **Given** I have a product with quantity 1 in my cart, **When** I click the remove/decrease button, **Then** the product is removed from my cart and the cart count decreases.
2. **Given** I have a product with quantity greater than 1, **When** I decrease the quantity, **Then** the quantity decreases by 1 but the product remains in the cart.
3. **Given** I remove all products from my cart, **When** I view the cart, **Then** the cart shows as empty and the header cart count shows 0 or is hidden.

---

### User Story 4 - Cart Persistence Across Sessions (Priority: P2)

As a returning website visitor, I want my cart to be preserved when I close and reopen the browser so that I don't lose my selections.

**Why this priority**: Important for user experience but the core add/view/remove functionality must work first.

**Independent Test**: Can be fully tested by adding products, closing the browser tab, reopening the website, and verifying the cart contents are restored.

**Acceptance Scenarios**:

1. **Given** I have products in my cart, **When** I close the browser and return to the website later, **Then** my cart contents are restored with the same products and quantities.
2. **Given** I have an empty cart, **When** I return to the website, **Then** my cart remains empty.
3. **Given** I have products in my cart on one tab, **When** I open the website in a new tab, **Then** the cart contents are synchronized across tabs.

---

### User Story 5 - Cart Icon with Count in Header (Priority: P2)

As a website visitor, I want to see a cart icon with the number of items in my cart displayed in the header so that I always know how many items I have.

**Why this priority**: Visual feedback is important but depends on the core cart functionality being in place.

**Independent Test**: Can be fully tested by adding/removing products and verifying the cart icon count updates in real-time on both desktop and mobile views.

**Acceptance Scenarios**:

1. **Given** selling mode is enabled and I have 3 items in my cart, **When** I view the header (desktop or mobile), **Then** I see a cart icon with the number "3" displayed as a badge.
2. **Given** my cart is empty, **When** I view the header, **Then** the cart icon is displayed without a count badge (or shows "0").
3. **Given** selling mode is disabled, **When** I view the header, **Then** no cart icon is displayed.

---

### User Story 6 - Modify Quantities from Cart Panel (Priority: P3)

As a website visitor viewing my cart, I want to increase or decrease product quantities directly in the cart panel so that I can adjust my order without navigating away.

**Why this priority**: Enhances usability but is a convenience feature after core functionality is complete.

**Independent Test**: Can be fully tested by opening the cart panel, using quantity controls, and verifying quantities and totals update correctly.

**Acceptance Scenarios**:

1. **Given** I have a product in my cart panel, **When** I click the increase quantity button, **Then** the quantity increases and the line total and cart total update accordingly.
2. **Given** I have a product with quantity greater than 1, **When** I click the decrease quantity button, **Then** the quantity decreases and totals update.
3. **Given** I have a product with quantity 1, **When** I click the decrease button, **Then** the product is removed from the cart entirely.

---

### Edge Cases

- What happens when a product in the cart is no longer available (deleted by admin)? The cart displays the product as "unavailable" and allows removal, but prevents quantity increase.
- What happens when the product price changes after being added to cart? The cart displays the current price (prices are not locked at time of addition).
- What happens when selling mode is disabled while items are in the cart? The cart icon is hidden, but cart contents are preserved in storage. When selling mode is re-enabled, the cart contents reappear.
- What happens if localStorage is full or unavailable? The cart operates in memory-only mode for the current session with a warning message.
- What happens with very large quantities? Quantities are capped at a reasonable limit (99 per product).

## Requirements _(mandatory)_

### Functional Requirements

#### Cart Core Functionality

- **FR-001**: System MUST allow users to add products to a shopping cart when selling mode is enabled
- **FR-002**: System MUST allow users to remove products from the shopping cart
- **FR-003**: System MUST allow users to increase or decrease product quantities in the cart
- **FR-004**: System MUST persist cart contents in browser localStorage
- **FR-005**: System MUST restore cart contents when user returns to the website
- **FR-006**: System MUST synchronize cart contents across browser tabs using BroadcastChannel

#### Cart Display

- **FR-007**: System MUST display a cart icon in the header menu (desktop and mobile) when selling mode is enabled
- **FR-008**: System MUST display a badge on the cart icon showing the total number of items in the cart
- **FR-009**: System MUST hide the cart icon when selling mode is disabled
- **FR-010**: System MUST open a cart panel/drawer when the cart icon is clicked
- **FR-011**: Cart panel MUST display product name, image, price, quantity, and line total for each item
- **FR-012**: Cart panel MUST display the total price of all items in the cart
- **FR-013**: Cart panel MUST display an empty state message when the cart has no items

#### Product Integration

- **FR-014**: System MUST display "Add to Cart" button on products when selling mode is enabled
- **FR-015**: "Add to Cart" functionality MUST work for products displayed in both list mode and grid mode
- **FR-016**: System MUST handle products that no longer exist gracefully (mark as unavailable)
- **FR-017**: System MUST reflect current product prices (not cached prices from when added)

#### Accessibility and UX

- **FR-018**: Cart panel MUST be accessible via keyboard navigation
- **FR-019**: Cart icon and panel MUST work correctly on both desktop and mobile layouts
- **FR-020**: System MUST ensure proper contrast ratios for cart UI elements in both light and dark modes
- **FR-021**: Cart quantity controls MUST have adequate touch targets (minimum 44x44px) on mobile

#### Architecture

- **FR-022**: Code MUST implement only strict minimum required for current feature (YAGNI principle)
- **FR-023**: Code MUST avoid duplication through reusable functions and components (DRY principle)
- **FR-024**: Code MUST be simple, readable, and clear with straightforward implementations (KISS principle)

### Key Entities

- **CartItem**: Represents a product in the cart. Contains product ID, quantity, and timestamp when added. References Product entity for current product details (name, price, image).
- **Cart**: Collection of CartItems. Maintains total item count and total price. Persisted in localStorage.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can add a product to their cart within 1 click from the product display
- **SC-002**: Users can view their complete cart contents within 1 click from any page
- **SC-003**: Cart contents persist across browser sessions with 100% reliability when localStorage is available
- **SC-004**: Cart icon count updates in real-time (under 100ms) when items are added or removed
- **SC-005**: Cart functionality is only visible when selling mode is enabled (100% compliance)
- **SC-006**: Cart panel displays correctly on mobile devices (screens 320px and wider)
- **SC-007**: All cart interactions are accessible via keyboard navigation

## Assumptions

- Products have unique IDs that remain stable over time
- Product prices may change and the cart should always reflect current prices
- Users do not need to be authenticated to use the cart (guest cart)
- The cart is for display purposes only in this feature (checkout/payment is out of scope)
- Maximum quantity per product is 99 (reasonable limit for a showcase website)
- Cart storage key follows existing pattern: `'shower-cart'`
