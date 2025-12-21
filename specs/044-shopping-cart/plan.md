# Implementation Plan: Shopping Cart

**Branch**: `044-shopping-cart` | **Date**: 2025-12-21 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/044-shopping-cart/spec.md`

## Summary

Implement a client-side shopping cart that persists in browser localStorage, displays a cart icon with item count in the header (desktop and mobile), and allows users to add/remove products. Cart functionality is conditionally visible based on selling mode configuration. Tests for add/remove operations are explicitly requested.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router + React 19
**Primary Dependencies**: Chakra UI v3, react-icons, existing SellingConfigContext, existing Product entity
**Storage**: Browser localStorage (key: `shower-cart`) with BroadcastChannel for cross-tab sync
**Testing**: Jest for unit tests and integration tests (explicitly requested for add/remove cart functionality)
**Target Platform**: Web (responsive: desktop >= 768px, mobile < 768px, minimum 320px width)
**Project Type**: Web application (existing Next.js structure)
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, consistent theme color usage, YAGNI (minimal implementation), DRY (no duplication), KISS (simple code), cart only visible when selling mode enabled
**Scale/Scope**: Guest cart only (no user accounts), max 99 quantity per product, client-side only (no server persistence)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Status | Notes                                                                                                                                                    |
| ------------------------------------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I. Architecture-First Development    | PASS   | Cart follows DDD with domain entity (CartItem), presentation layer (components/contexts), storage utility                                                |
| II. Focused Testing Approach         | PASS   | Tests explicitly requested for add/remove functionality; will include unit tests for CartStorage, CartContext, and integration tests for cart operations |
| III. Simplicity-First Implementation | PASS   | No performance monitoring; client-side only storage                                                                                                      |
| IV. Security by Default              | PASS   | Cart is public/guest functionality, no auth required; no sensitive data stored                                                                           |
| V. Clean Architecture Compliance     | PASS   | Proper layer separation: domain (CartItem), presentation (components/hooks/context), utils (CartStorage)                                                 |
| VI. Accessibility-First Design       | PASS   | Touch targets 44x44px, keyboard navigation, proper contrast in light/dark modes                                                                          |
| VII. YAGNI                           | PASS   | No checkout, no user accounts, no server sync - just add/remove/view cart                                                                                |
| VIII. DRY                            | PASS   | Reuse existing patterns: Storage class pattern, Context provider pattern, Header component pattern                                                       |
| IX. KISS                             | PASS   | Simple localStorage persistence, no complex state management libraries                                                                                   |
| X. Configuration Portability         | N/A    | Cart is client-side only, not part of configuration export/import                                                                                        |

## Project Structure

### Documentation (this feature)

```text
specs/044-shopping-cart/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (client-side API contracts)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── domain/
│   └── cart/
│       └── entities/
│           └── CartItem.ts           # CartItem entity
├── presentation/
│   └── shared/
│       ├── components/
│       │   ├── Cart/
│       │   │   ├── CartIcon.tsx      # Header cart icon with badge
│       │   │   ├── CartDrawer.tsx    # Cart panel/drawer
│       │   │   └── CartItemRow.tsx   # Individual cart item display
│       │   ├── PublicHeaderMenu/
│       │   │   └── (existing files)  # Integrate CartIcon
│       │   └── PublicPageContent/
│       │       └── ProductListRenderer.tsx  # Add "Add to Cart" button
│       ├── contexts/
│       │   └── CartContext.tsx       # Cart state provider
│       ├── hooks/
│       │   └── useCart.ts            # Cart operations hook
│       └── utils/
│           └── CartStorage.ts        # localStorage persistence

test/
├── unit/
│   ├── domain/
│   │   └── cart/
│   │       └── CartItem.test.ts
│   └── presentation/
│       └── shared/
│           ├── utils/
│           │   └── CartStorage.test.ts
│           ├── contexts/
│           │   └── CartContext.test.tsx
│           ├── hooks/
│           │   └── useCart.test.tsx
│           └── components/
│               └── Cart/
│                   ├── CartIcon.test.tsx
│                   ├── CartDrawer.test.tsx
│                   └── CartItemRow.test.tsx
└── integration/
    └── cart-add-remove.integration.test.tsx
```

**Structure Decision**: Follows existing DDD structure with domain entity, presentation components/contexts/hooks, and utility class for storage. Test structure mirrors src/ directory as per existing patterns.

## Test Strategy (Explicitly Requested)

### Unit Tests for Add/Remove

1. **CartStorage.test.ts**: Test localStorage add/remove operations
   - Add item to empty cart
   - Add item to existing cart
   - Add duplicate item (quantity increase)
   - Remove item from cart
   - Remove last item (empty cart)
   - Handle localStorage errors gracefully

2. **CartContext.test.tsx**: Test context add/remove functions
   - addItem increases count
   - removeItem decreases count
   - updateQuantity modifies existing item
   - clearCart empties all items

3. **useCart.test.tsx**: Test hook operations
   - Hook returns correct cart state
   - Hook add/remove functions work correctly

### Integration Tests for Add/Remove

1. **cart-add-remove.integration.test.tsx**:
   - User clicks "Add to Cart" on product → cart count increases
   - User opens cart drawer → sees added product
   - User removes product from cart → cart count decreases
   - User adds same product twice → quantity increases
   - User decreases quantity to 0 → product removed
   - Cart persists after simulated page reload

## Complexity Tracking

> No violations requiring justification. Feature follows all constitution principles.
