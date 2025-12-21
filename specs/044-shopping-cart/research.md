# Research: Shopping Cart Implementation

**Feature**: 044-shopping-cart  
**Date**: 2025-12-21  
**Status**: Complete

## Research Questions Resolved

### 1. Storage Pattern for Cart Data

**Decision**: Follow existing `ThemeColorStorage` pattern with localStorage + CustomEvent for updates

**Rationale**:

- Consistent with existing codebase patterns (ThemeColorStorage, BackgroundColorStorage, WebsiteFontStorage)
- Proven pattern for SSR-safe localStorage access
- CustomEvent dispatch enables real-time updates across components
- BroadcastChannel enables cross-tab synchronization (following SellingConfigContext pattern)

**Alternatives Considered**:

- Redux/Zustand: Overkill for simple cart state; adds unnecessary dependency
- Server-side storage: Requires user accounts; out of scope for guest cart
- SessionStorage: Would not persist across browser sessions (user requirement)

### 2. Cart Data Structure

**Decision**: Store array of CartItem objects with minimal data (productId, quantity, addedAt)

**Rationale**:

- Product details (name, price, image) fetched at render time to ensure current data
- Minimal storage footprint in localStorage
- Follows spec requirement: "System MUST reflect current product prices"

**Alternatives Considered**:

- Store full product data: Would show stale prices; increases storage size
- Store only product IDs: Would need additional field for quantity tracking

### 3. Context Provider Pattern

**Decision**: Follow `SellingConfigContext` pattern with context + custom hook

**Rationale**:

- Consistent with existing codebase patterns
- Provides loading/error states
- Encapsulates all cart operations in single provider
- Easy to test with mock provider

**Alternatives Considered**:

- Direct localStorage access in components: Violates separation of concerns
- Custom hook without context: Would not share state across component tree

### 4. Cart Icon Placement

**Decision**: Add CartIcon next to DarkModeToggle in both desktop and mobile headers

**Rationale**:

- Consistent positioning in both layouts
- Follows existing header structure pattern
- Visible but not intrusive

**Alternatives Considered**:

- Separate cart section: Adds complexity without benefit
- Only in mobile menu: Inconsistent UX across devices

### 5. Cart Panel Implementation

**Decision**: Use Chakra UI Drawer component (slide-in from right)

**Rationale**:

- Follows existing MobileMenuDrawer pattern
- Non-disruptive to page content
- Built-in accessibility (focus trap, escape key)
- Responsive by default

**Alternatives Considered**:

- Modal: Too intrusive for quick cart view
- Dedicated page: Adds navigation complexity; overkill for cart preview
- Popover: Too small for cart contents with quantity controls

### 6. Testing Strategy for Add/Remove

**Decision**: Combination of unit tests (CartStorage, CartContext, useCart) and integration test (full user flow)

**Rationale**:

- User explicitly requested tests for add/remove functionality
- Unit tests ensure individual components work correctly in isolation
- Integration test verifies complete user flow from product to cart
- Follows existing test patterns in the codebase

**Test Files**:

- `test/unit/presentation/shared/utils/CartStorage.test.ts` - Storage operations
- `test/unit/presentation/shared/contexts/CartContext.test.tsx` - Context provider
- `test/unit/presentation/shared/hooks/useCart.test.tsx` - Hook operations
- `test/integration/cart-add-remove.integration.test.tsx` - Full user flow

### 7. Selling Mode Integration

**Decision**: Use existing `useSellingConfig` hook to conditionally render cart components

**Rationale**:

- Leverages existing infrastructure
- Consistent with how other selling-dependent features work
- No additional state management needed

**Implementation**:

- CartIcon: Render only if `sellingEnabled === true`
- "Add to Cart" button: Render only if `sellingEnabled === true`
- Cart contents preserved in storage even when selling mode disabled

### 8. Product Availability Handling

**Decision**: Fetch product data at cart render time; mark unavailable products with visual indicator

**Rationale**:

- Ensures current prices are displayed (spec requirement FR-017)
- Handles deleted products gracefully (spec requirement FR-016)
- Simple implementation without complex cache invalidation

**Implementation**:

- On cart open: Fetch current product data for all cart items
- If product not found: Show "Product unavailable" with option to remove
- If product found: Display current name, price, image

## Technology Decisions

| Component        | Choice                              | Reason                               |
| ---------------- | ----------------------------------- | ------------------------------------ |
| State Management | React Context + localStorage        | Follows existing patterns            |
| Storage          | localStorage with `shower-cart` key | Consistent with other settings       |
| Cross-tab Sync   | BroadcastChannel                    | Follows SellingConfigContext pattern |
| Cart UI          | Chakra UI Drawer                    | Matches MobileMenuDrawer pattern     |
| Icons            | react-icons (FiShoppingCart)        | Existing dependency                  |
| Testing          | Jest + Testing Library              | Existing test infrastructure         |

## Dependencies

No new dependencies required. All functionality uses existing packages:

- Chakra UI v3 (Drawer, Badge, IconButton, etc.)
- react-icons (FiShoppingCart, FiPlus, FiMinus, FiTrash2)
- @testing-library/react (existing test dependency)
