# Research: Products List Page Content

**Feature**: 042-products-list-page  
**Date**: 2025-12-20

## Research Summary

This document consolidates technical research for implementing the products list in page content feature.

---

## 1. Tiptap Custom Node Extension Pattern

**Decision**: Use the established `Node.create()` pattern with data attributes for configuration storage.

**Rationale**: The codebase already has proven patterns (ImageWithOverlay, CustomTable) that demonstrate:

- Atomic nodes with `group: 'block'` and `atom: true`
- Configuration stored in `data-*` attributes via `parseHTML`/`renderHTML`
- Commands for insert/update operations
- Selection tracking in main editor for toolbar activation

**Alternatives Considered**:

- React NodeView: More complex, not used in existing extensions
- Inline node: Not appropriate for block-level product list display

**Implementation Pattern**:

```typescript
export const ProductList = Node.create({
  name: 'productList',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      categoryIds: {
        default: null,
        parseHTML: (el) => el.getAttribute('data-category-ids'),
        renderHTML: (attrs) => ({ 'data-category-ids': attrs.categoryIds }),
      },
    };
  },
});
```

---

## 2. Toolbar Integration Pattern

**Decision**: Add a toolbar button that inserts a ProductList node, with a separate ProductListToolbar for configuration when selected.

**Rationale**: Follows existing patterns:

- OverlayToolbar appears when ImageWithOverlay is selected
- TableToolbar appears when table is selected
- Conditional rendering based on `selectedNodeType` state

**Key Integration Points**:

- Add icon button in main toolbar (FiGrid or FiPackage icon)
- Track selection via `onSelectionUpdate` callback
- Render ProductListToolbar when `selectedNodeType === 'productList'`

---

## 3. Public API Endpoint

**Decision**: Create `/api/public/products` endpoint following existing public API patterns.

**Rationale**:

- No public products API currently exists
- Must follow existing `/api/public/menu` response format
- Uses `GetPublicProducts` use case for clean architecture

**Response Format**:

```typescript
{
  success: true,
  data: Product[]  // Sorted by displayOrder, filtered by categoryIds if provided
}
```

**Query Parameters**:

- `categoryIds`: Optional comma-separated list of category IDs for filtering

---

## 4. Public Rendering Strategy

**Decision**: Use CSS-based rendering with a React component for dynamic data fetching.

**Rationale**:

- HTML sanitization via DOMPurify already allows custom data attributes
- ProductListRenderer component fetches products client-side
- Integrates with existing PublicPageContent processing

**Implementation Approach**:

1. DOMPurify allows `data-category-ids` attribute
2. CSS styles the `.product-list` container
3. JavaScript hydrates product data after page load
4. ProductListRenderer component handles fetch and display

---

## 5. Category Filtering

**Decision**: Store category IDs as comma-separated string in data attribute; filter via API query parameter.

**Rationale**:

- Simple string storage in HTML attribute
- Backend filtering already exists in `ProductRepository.getByCategory()`
- Extend to support multiple categories via array parameter

**Storage Format**: `data-category-ids="cat1,cat2,cat3"` or `null` for all products

---

## 6. Empty State Handling

**Decision**: Display user-friendly message when no products match criteria.

**Rationale**: Per spec FR-008, must handle empty results gracefully.

**Implementation**:

- Check products array length after fetch
- Display "No products available" message with appropriate styling
- Consistent with existing empty state patterns in the application

---

## Dependencies Confirmed

| Dependency    | Version  | Purpose                                  |
| ------------- | -------- | ---------------------------------------- |
| @tiptap/core  | existing | Node.create() extension API              |
| @tiptap/react | existing | useEditor hook integration               |
| react-icons   | existing | Toolbar icon (FiGrid)                    |
| DOMPurify     | existing | HTML sanitization with custom attributes |

---

## No NEEDS CLARIFICATION Items

All technical decisions resolved based on:

- Existing codebase patterns
- Spec requirements (no pagination, grid display, category filtering)
- Constitution principles (YAGNI, KISS, DRY)
