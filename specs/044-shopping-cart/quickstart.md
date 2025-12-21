# Quickstart: Shopping Cart Implementation

**Feature**: 044-shopping-cart  
**Date**: 2025-12-21

## Prerequisites

- Existing selling mode configuration working
- Existing Product entity and product listing functional
- Public header menu (desktop and mobile) implemented

## Implementation Order

### Phase 1: Domain & Storage Layer

1. **Create CartItem entity** (`src/domain/cart/entities/CartItem.ts`)
   - Define CartItem interface
   - Add validation for quantity (1-99)
   - Add factory method for creating items

2. **Create CartStorage utility** (`src/presentation/shared/utils/CartStorage.ts`)
   - Follow ThemeColorStorage pattern
   - Implement getCart, setCart, addItem, removeItem, updateQuantity, clearCart
   - Add BroadcastChannel for cross-tab sync
   - Add CustomEvent dispatch for component updates

### Phase 2: Context & Hook Layer

3. **Create CartContext** (`src/presentation/shared/contexts/CartContext.tsx`)
   - Follow SellingConfigContext pattern
   - Provide items, itemCount, isLoading, error
   - Expose addItem, removeItem, updateQuantity, clearCart

4. **Create useCart hook** (`src/presentation/shared/hooks/useCart.ts`)
   - Simple wrapper around useContext(CartContext)
   - Throw error if used outside provider

### Phase 3: UI Components

5. **Create CartIcon** (`src/presentation/shared/components/Cart/CartIcon.tsx`)
   - IconButton with FiShoppingCart
   - Badge showing itemCount
   - Only render if selling enabled

6. **Create CartDrawer** (`src/presentation/shared/components/Cart/CartDrawer.tsx`)
   - Chakra UI Drawer (right side)
   - List of CartItemRow components
   - Empty state message
   - Total price display

7. **Create CartItemRow** (`src/presentation/shared/components/Cart/CartItemRow.tsx`)
   - Product image, name, price
   - Quantity controls (+/-)
   - Remove button
   - Handle unavailable products

8. **Create AddToCartButton** (`src/presentation/shared/components/Cart/AddToCartButton.tsx`)
   - Simple button with FiShoppingCart icon
   - Calls addItem on click
   - Only render if selling enabled

### Phase 4: Integration

9. **Integrate CartIcon into PublicHeaderMenu**
   - Add to desktop header (next to DarkModeToggle)
   - Add to mobile header
   - Conditionally render based on selling mode

10. **Integrate AddToCartButton into ProductListRenderer**
    - Add button to each product card
    - Works for both grid and list modes
    - Conditionally render based on selling mode

11. **Add CartProvider to app layout**
    - Wrap public pages with CartProvider
    - Below SellingConfigProvider

## Testing Implementation (Explicitly Requested)

### Unit Tests - Run First

```bash
# Run all cart unit tests
docker compose run --rm app npm test -- --testPathPattern="cart" --testPathIgnorePatterns="integration"
```

#### CartStorage.test.ts

```typescript
describe('CartStorage', () => {
  beforeEach(() => localStorage.clear());

  describe('addItem', () => {
    it('should add new item with quantity 1');
    it('should increment quantity for existing item');
    it('should cap quantity at 99');
  });

  describe('removeItem', () => {
    it('should remove item from cart');
    it('should return empty array when removing last item');
  });

  describe('updateQuantity', () => {
    it('should update quantity for existing item');
    it('should remove item when quantity is 0');
  });
});
```

#### CartContext.test.tsx

```typescript
describe('CartContext', () => {
  it('should provide cart items');
  it('should provide itemCount');
  it('should add item via context');
  it('should remove item via context');
  it('should clear cart via context');
});
```

#### useCart.test.tsx

```typescript
describe('useCart', () => {
  it('should return cart context value');
  it('should throw error outside provider');
});
```

### Integration Tests - Run After Unit Tests

```bash
# Run cart integration tests
docker compose run --rm app npm test -- --testPathPattern="cart.*integration"
```

#### cart-add-remove.integration.test.tsx

```typescript
describe('Cart Add/Remove Integration', () => {
  it('should add product to cart when clicking Add to Cart button');
  it('should update cart count in header after adding');
  it('should show product in cart drawer after adding');
  it('should remove product when clicking remove button');
  it('should decrease quantity when clicking minus button');
  it('should persist cart after simulated page reload');
  it('should hide cart icon when selling mode is disabled');
});
```

## Commands

```bash
# Run all tests
docker compose run --rm app npm test

# Run only cart tests
docker compose run --rm app npm test -- --testPathPattern="cart"

# Run with coverage
docker compose run --rm app npm test -- --coverage --testPathPattern="cart"

# Type check
docker compose run --rm app npm run build:strict

# Lint
docker compose run --rm app npm run lint
```

## Key Files Reference

| Purpose               | File Path                                                                      |
| --------------------- | ------------------------------------------------------------------------------ |
| Storage pattern       | `src/presentation/shared/utils/ThemeColorStorage.ts`                           |
| Context pattern       | `src/presentation/shared/contexts/SellingConfigContext.tsx`                    |
| Header integration    | `src/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenu.tsx`     |
| Mobile drawer pattern | `src/presentation/shared/components/PublicHeaderMenu/MobileMenuDrawer.tsx`     |
| Product listing       | `src/presentation/shared/components/PublicPageContent/ProductListRenderer.tsx` |
| Test setup            | `test/unit/setup.ts`                                                           |

## Validation Checklist

- [ ] Cart icon appears in header when selling mode enabled
- [ ] Cart icon hidden when selling mode disabled
- [ ] Add to Cart button appears on products
- [ ] Clicking Add to Cart increases cart count
- [ ] Opening cart drawer shows added products
- [ ] Quantity controls work in cart drawer
- [ ] Remove button works in cart drawer
- [ ] Cart persists after page refresh
- [ ] Cart syncs across browser tabs
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] No TypeScript errors
- [ ] No ESLint errors
