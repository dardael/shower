# Cart Client API Contracts

**Feature**: 044-shopping-cart  
**Date**: 2025-12-21  
**Type**: Client-side API (no server endpoints)

## Overview

The shopping cart is a client-side only feature using localStorage for persistence. This document defines the TypeScript interfaces and function contracts for cart operations.

## Type Definitions

### CartItem Interface

```typescript
interface CartItem {
  productId: string;
  quantity: number;
  addedAt: Date;
}
```

### CartContextValue Interface

```typescript
interface CartContextValue {
  // State
  items: CartItem[];
  itemCount: number;
  isLoading: boolean;
  error: Error | null;

  // Operations
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}
```

## CartStorage API

### getCart

Retrieves cart items from localStorage.

```typescript
static getCart(): CartItem[]
```

**Returns**: Array of CartItem objects, or empty array if no cart exists

**Behavior**:

- Returns empty array if `window` is undefined (SSR)
- Returns empty array if localStorage is unavailable
- Parses stored JSON and validates each item
- Removes invalid items from returned array

### setCart

Persists cart items to localStorage.

```typescript
static setCart(items: CartItem[]): void
```

**Parameters**:

- `items`: Array of CartItem objects to persist

**Behavior**:

- No-op if `window` is undefined (SSR)
- Serializes items to JSON
- Dispatches update event after successful save
- Broadcasts to other tabs via BroadcastChannel

### addItem

Adds a product to cart or increments quantity if exists.

```typescript
static addItem(productId: string): CartItem[]
```

**Parameters**:

- `productId`: UUID of product to add

**Returns**: Updated cart items array

**Behavior**:

- If product exists: increment quantity (max 99)
- If product new: create CartItem with quantity=1
- Persists to localStorage
- Returns updated array

### removeItem

Removes a product from cart entirely.

```typescript
static removeItem(productId: string): CartItem[]
```

**Parameters**:

- `productId`: UUID of product to remove

**Returns**: Updated cart items array

**Behavior**:

- Filters out item with matching productId
- Persists to localStorage
- Returns updated array

### updateQuantity

Updates quantity for a specific product.

```typescript
static updateQuantity(productId: string, quantity: number): CartItem[]
```

**Parameters**:

- `productId`: UUID of product to update
- `quantity`: New quantity (1-99)

**Returns**: Updated cart items array

**Behavior**:

- If quantity <= 0: removes item
- If quantity > 99: caps at 99
- Persists to localStorage
- Returns updated array

### clearCart

Removes all items from cart.

```typescript
static clearCart(): void
```

**Behavior**:

- Sets cart to empty array
- Persists to localStorage
- Dispatches update event

## Event Contracts

### cart-updated Event

Dispatched when cart contents change.

```typescript
interface CartUpdatedEvent extends CustomEvent {
  detail: {
    items: CartItem[];
  };
}
```

**Event Name**: `cart-updated`

### BroadcastChannel Message

Sent to synchronize cart across browser tabs.

```typescript
interface CartSyncMessage {
  type: 'cart-updated';
  items: CartItem[];
}
```

**Channel Name**: `shower-cart-sync`

## Hook Contract

### useCart

React hook for cart operations.

```typescript
function useCart(): CartContextValue;
```

**Returns**: CartContextValue with current state and operations

**Throws**: Error if used outside CartProvider

## Component Props Contracts

### CartIcon Props

```typescript
interface CartIconProps {
  onClick: () => void;
}
```

### CartDrawer Props

```typescript
interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}
```

### CartItemRow Props

```typescript
interface CartItemRowProps {
  item: CartItem;
  product: Product | null;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}
```

### AddToCartButton Props

```typescript
interface AddToCartButtonProps {
  productId: string;
}
```
