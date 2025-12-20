# API Contracts: Products List Page Content

**Feature**: 042-products-list-page  
**Date**: 2025-12-20

---

## Public Products API

### GET /api/public/products

Fetches products for public display, optionally filtered by category.

**Authentication**: None required (public endpoint)

**Query Parameters**:

| Parameter   | Type   | Required | Description                                       |
| ----------- | ------ | -------- | ------------------------------------------------- |
| categoryIds | string | No       | Comma-separated list of category IDs to filter by |

**Request Example**:

```http
GET /api/public/products?categoryIds=cat1,cat2
```

**Success Response** (200 OK):

```json
{
  "success": true,
  "data": [
    {
      "id": "prod123",
      "name": "Product Name",
      "description": "Product description text",
      "price": 29.99,
      "imageUrl": "/page-content-images/product-image.jpg"
    }
  ]
}
```

**Empty Response** (200 OK):

```json
{
  "success": true,
  "data": []
}
```

**Error Response** (500 Internal Server Error):

```json
{
  "success": false,
  "error": "Failed to fetch products"
}
```

**Business Rules**:

- Products are sorted by `displayOrder` (ascending)
- If `categoryIds` is not provided, all products are returned
- If `categoryIds` contains invalid IDs, those IDs are ignored
- Empty category filter result returns empty array (not error)

---

## Tiptap Extension Commands

### insertProductList

Inserts a new ProductList node at current cursor position.

**Parameters**: None (inserts with default config)

**HTML Output**:

```html
<div class="product-list"></div>
```

### updateProductListCategories

Updates the category filter for selected ProductList node.

**Parameters**:

| Parameter   | Type             | Description                             |
| ----------- | ---------------- | --------------------------------------- |
| categoryIds | string[] \| null | Category IDs to filter, or null for all |

**HTML Output**:

```html
<div class="product-list" data-category-ids="cat1,cat2"></div>
```

### removeProductList

Removes the currently selected ProductList node.

**Parameters**: None (operates on selection)

---

## Component Interfaces

### ProductListToolbar Props

```typescript
interface ProductListToolbarProps {
  editor: Editor;
  disabled: boolean;
  nodePos: number;
}
```

### ProductListRenderer Props

```typescript
interface ProductListRendererProps {
  categoryIds: string[] | null;
}
```

---

## DOMPurify Configuration

The following data attributes must be allowed in PublicPageContent sanitization:

```typescript
ALLOWED_ATTR: [
  // ... existing attributes
  'data-category-ids',
];
```
