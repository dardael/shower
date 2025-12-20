# Data Model: Products List Page Content

**Feature**: 042-products-list-page  
**Date**: 2025-12-20

## Overview

This feature introduces a new Tiptap node type for embedding product lists in page content. It reuses existing Product and Category entities without modification.

---

## New Types

### ProductListConfig

**Location**: `src/domain/product/types/ProductListConfig.ts`

Represents the configuration for a ProductList node embedded in page content.

| Field       | Type               | Required | Description                                                    |
| ----------- | ------------------ | -------- | -------------------------------------------------------------- |
| categoryIds | `string[] \| null` | No       | Category IDs to filter products. Null means show all products. |

**Default Values**:

- `categoryIds`: `null` (show all products)

**Validation Rules**:

- `categoryIds`: If provided, must be an array of valid category ID strings

---

## Existing Entities (No Changes Required)

### Product

**Location**: `src/domain/product/entities/Product.ts`

| Field        | Type           | Description                            |
| ------------ | -------------- | -------------------------------------- |
| id           | string         | Unique identifier                      |
| name         | string         | Product name (required, max 200 chars) |
| description  | string         | Product description (max 5000 chars)   |
| price        | number         | Product price (must be > 0)            |
| imageUrl     | string \| null | URL to product image                   |
| displayOrder | number         | Display order for sorting              |
| categoryIds  | string[]       | Associated category IDs                |
| createdAt    | Date           | Creation timestamp                     |
| updatedAt    | Date           | Last update timestamp                  |

### Category

**Location**: `src/domain/product/entities/Category.ts`

| Field        | Type   | Description                             |
| ------------ | ------ | --------------------------------------- |
| id           | string | Unique identifier                       |
| name         | string | Category name (required, max 100 chars) |
| description  | string | Category description (max 2000 chars)   |
| displayOrder | number | Display order for sorting               |
| createdAt    | Date   | Creation timestamp                      |
| updatedAt    | Date   | Last update timestamp                   |

---

## Data Storage

### Tiptap Node Storage (HTML)

The ProductList node is stored as HTML within the PageContent entity's content field:

```html
<div class="product-list" data-category-ids="cat1,cat2,cat3"></div>
```

**Attributes**:

- `data-category-ids`: Comma-separated category IDs, or absent/empty for all products

### No Database Schema Changes

This feature does not require any new MongoDB collections or schema modifications. Product list configuration is embedded in the existing PageContent HTML string.

---

## Relationships

```text
PageContent (existing)
    └── contains ProductList nodes (embedded HTML)
            └── references Category IDs (optional filter)
                    └── filters Product entities

Product (existing)
    └── belongs to Categories via categoryIds array

Category (existing)
    └── has many Products (reverse lookup)
```

---

## State Transitions

### ProductList Node Lifecycle

1. **Created**: Admin inserts ProductList via toolbar → default config (no category filter)
2. **Configured**: Admin selects categories via ProductListToolbar → categoryIds updated
3. **Saved**: Page content saved → ProductList persisted as HTML with data attributes
4. **Rendered**: Public page loads → ProductListRenderer fetches and displays products
5. **Deleted**: Admin removes node → standard Tiptap delete behavior

---

## API Data Transfer Objects

### PublicProductDTO

Used in public API responses:

```typescript
interface PublicProductDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
}
```

**Note**: Excludes `displayOrder`, `categoryIds`, `createdAt`, `updatedAt` from public response for simplicity.
