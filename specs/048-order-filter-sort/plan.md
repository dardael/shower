# Implementation Plan: Order Filter and Sort

**Branch**: `048-order-filter-sort` | **Date**: 2025-12-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/048-order-filter-sort/spec.md`

## Summary

Enable administrators to filter orders by status, customer name, product, and category, and sort by date, name, or status. Default behavior hides completed orders and sorts by date descending. Uses client-side filtering/sorting on existing order data.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router + React 19  
**Primary Dependencies**: Chakra UI v3, react-icons, existing Order/Product/Category entities  
**Storage**: N/A (client-side filtering on existing MongoDB data via existing APIs)  
**Testing**: Jest for unit tests and integration tests  
**Target Platform**: Web (admin interface)  
**Project Type**: Web application (Next.js)  
**Performance Goals**: Simplicity over performance monitoring  
**Constraints**: YAGNI, DRY, KISS, French localization, proper contrast for light/dark modes  
**Scale/Scope**: Small-to-medium order volumes (client-side filtering appropriate)

## Constitution Check

_GATE: All gates passed._

| Gate                | Status  | Notes                                       |
| ------------------- | ------- | ------------------------------------------- |
| YAGNI               | ✅ Pass | Only implementing specified filters/sorts   |
| DRY                 | ✅ Pass | Reusable filter/sort hooks                  |
| KISS                | ✅ Pass | Client-side approach, simple implementation |
| French Localization | ✅ Pass | All UI text in French                       |
| Accessibility       | ✅ Pass | Proper contrast in light/dark modes         |

## Project Structure

### Documentation (this feature)

```text
specs/048-order-filter-sort/
├── plan.md              # This file
├── research.md          # Technical research findings
├── data-model.md        # Filter/sort value objects
├── contracts/           # API contracts
│   └── api-contracts.md
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
src/
├── domain/order/
│   └── value-objects/
│       ├── OrderFilterState.ts      # Filter state value object
│       └── OrderSortState.ts        # Sort state value object
├── presentation/admin/
│   ├── hooks/
│   │   ├── useOrderFilters.ts       # Filter logic hook
│   │   ├── useOrderSort.ts          # Sort logic hook
│   │   └── useOrdersFilterSort.ts   # Combined hook
│   └── components/
│       └── OrderFilterSortPanel.tsx # Filter/sort UI component

test/
├── unit/
│   ├── domain/order/
│   │   └── value-objects/
│   │       ├── OrderFilterState.test.ts
│   │       └── OrderSortState.test.ts
│   └── presentation/admin/
│       └── hooks/
│           ├── useOrderFilters.test.ts
│           └── useOrderSort.test.ts
└── integration/
    └── order-filter-sort.integration.test.tsx
```

**Structure Decision**: Extends existing order domain with filter/sort value objects and presentation hooks.

## Complexity Tracking

No violations - simple client-side implementation within existing architecture.

## Test Plan

### Unit Tests

#### Domain Layer Tests (`test/unit/domain/order/value-objects/`)

**OrderFilterState.test.ts**
| Test Case | Description |
|-----------|-------------|
| `should create default filter state with COMPLETED status excluded` | Verifies default state hides completed orders |
| `should allow setting multiple statuses` | Tests multi-select status filter |
| `should validate status values against OrderStatus enum` | Ensures only valid statuses accepted |
| `should handle empty customer name filter` | Tests clearing name filter |
| `should handle partial customer name matching` | Tests contains-search behavior |
| `should perform case-insensitive name matching` | Tests "dupont" matches "Dupont" |
| `should perform accent-insensitive name matching` | Tests "Helene" matches "Hélène" |
| `should filter by single product ID` | Tests product filter |
| `should filter by single category ID` | Tests category filter |
| `should combine multiple filters with AND logic` | Tests status + name + product together |
| `should reset to default state` | Tests reset functionality |

**OrderSortState.test.ts**
| Test Case | Description |
|-----------|-------------|
| `should create default sort state with date descending` | Verifies default sort |
| `should toggle date sort direction` | Tests ascending/descending toggle |
| `should sort by customer name alphabetically` | Tests name sort |
| `should sort by status in logical order` | Tests status order: NEW → CONFIRMED → COMPLETED |
| `should only allow one sort field active at a time` | Tests sort field exclusivity |

#### Presentation Layer Tests (`test/unit/presentation/admin/hooks/`)

**useOrderFilters.test.ts**
| Test Case | Description |
|-----------|-------------|
| `should initialize with default filters (hide completed)` | Tests hook initial state |
| `should update status filter` | Tests setStatusFilter |
| `should update customer name filter` | Tests setCustomerNameFilter |
| `should update product filter` | Tests setProductFilter |
| `should update category filter` | Tests setCategoryFilter |
| `should apply filters to order list` | Tests applyFilters returns correct orders |
| `should return empty array when no orders match` | Tests no-match scenario |
| `should reset all filters to defaults` | Tests resetFilters |

**useOrderSort.test.ts**
| Test Case | Description |
|-----------|-------------|
| `should initialize with date descending sort` | Tests hook initial state |
| `should sort orders by date ascending` | Tests date asc sort |
| `should sort orders by date descending` | Tests date desc sort |
| `should sort orders by customer name A-Z` | Tests name asc sort |
| `should sort orders by customer name Z-A` | Tests name desc sort |
| `should sort orders by status in workflow order` | Tests status sort |
| `should toggle sort direction on same field click` | Tests toggle behavior |
| `should reset direction when changing sort field` | Tests field switch |

### Integration Tests (`test/integration/`)

**order-filter-sort.integration.test.tsx**
| Test Case | Description |
|-----------|-------------|
| `should load page with completed orders hidden by default` | Tests FR-002 |
| `should load page with date descending sort by default` | Tests FR-003 |
| `should filter orders by status selection` | Tests FR-004 |
| `should filter orders by customer name input` | Tests FR-005, FR-015 |
| `should filter orders by product selection` | Tests FR-006 |
| `should filter orders by category selection` | Tests FR-007 |
| `should combine multiple filters with AND logic` | Tests FR-011 |
| `should display order count matching filters` | Tests FR-014 |
| `should reset filters to defaults on reset click` | Tests FR-012 |
| `should update list immediately on filter change` | Tests FR-013 |
| `should display "Aucune commande trouvée" when no matches` | Tests edge case |
| `should work correctly in dark mode` | Tests FR-016 |

### Test Data Requirements

```typescript
// Sample test orders covering all scenarios
const testOrders = [
  {
    id: '1',
    customerFirstName: 'Jean',
    customerLastName: 'Dupont',
    status: OrderStatus.NEW,
    createdAt: new Date('2025-12-20'),
    items: [{ productId: 'p1' }],
  },
  {
    id: '2',
    customerFirstName: 'Marie',
    customerLastName: 'Durand',
    status: OrderStatus.CONFIRMED,
    createdAt: new Date('2025-12-21'),
    items: [{ productId: 'p2' }],
  },
  {
    id: '3',
    customerFirstName: 'Hélène',
    customerLastName: 'Martin',
    status: OrderStatus.COMPLETED,
    createdAt: new Date('2025-12-22'),
    items: [{ productId: 'p1' }, { productId: 'p3' }],
  },
  {
    id: '4',
    customerFirstName: 'Pierre',
    customerLastName: 'Dupuis',
    status: OrderStatus.NEW,
    createdAt: new Date('2025-12-23'),
    items: [{ productId: 'p2' }],
  },
];

const testProducts = [
  { id: 'p1', name: 'Produit A', categoryIds: ['c1'] },
  { id: 'p2', name: 'Produit B', categoryIds: ['c2'] },
  { id: 'p3', name: 'Produit C', categoryIds: ['c1', 'c2'] },
];

const testCategories = [
  { id: 'c1', name: 'Catégorie 1' },
  { id: 'c2', name: 'Catégorie 2' },
];
```

### Coverage Requirements

- **Domain value objects**: 100% statement coverage
- **Hooks**: 100% branch coverage for filter/sort logic
- **Integration**: All acceptance scenarios from spec covered
