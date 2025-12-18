# Data Model: Product and Category Management

**Feature**: 041-product-category-management
**Date**: 2025-12-18

## Entities

### Product

Represents an item for sale in the administrator's catalog.

| Field        | Type          | Required | Description                                |
| ------------ | ------------- | -------- | ------------------------------------------ |
| id           | string (UUID) | Yes      | Unique identifier                          |
| name         | string        | Yes      | Product name (1-200 characters)            |
| description  | string        | No       | Product description (0-5000 characters)    |
| price        | number        | Yes      | Price as positive decimal (min: 0.01)      |
| imageUrl     | string        | No       | URL to product image (relative path)       |
| displayOrder | number        | Yes      | Integer for sorting (default: 0)           |
| categoryIds  | string[]      | No       | Array of Category IDs (many-to-many)       |
| createdAt    | Date          | Yes      | Creation timestamp (auto-generated)        |
| updatedAt    | Date          | Yes      | Last modification timestamp (auto-updated) |

**Validation Rules**:

- `name`: Required, non-empty, max 200 characters
- `price`: Required, positive number > 0
- `description`: Optional, max 5000 characters
- `imageUrl`: Optional, must be valid relative path if provided
- `categoryIds`: Optional, must reference existing categories

**Business Rules**:

- New products default to `displayOrder` = max existing order + 1
- Deleting a product removes it from all category associations
- Product images stored in `public/page-content-images/products/`

---

### Category

Represents a grouping mechanism for organizing products.

| Field       | Type          | Required | Description                                |
| ----------- | ------------- | -------- | ------------------------------------------ |
| id          | string (UUID) | Yes      | Unique identifier                          |
| name        | string        | Yes      | Category name (1-100 characters)           |
| description | string        | No       | Category description (0-2000 characters)   |
| createdAt   | Date          | Yes      | Creation timestamp (auto-generated)        |
| updatedAt   | Date          | Yes      | Last modification timestamp (auto-updated) |

**Validation Rules**:

- `name`: Required, non-empty, max 100 characters
- `description`: Optional, max 2000 characters

**Business Rules**:

- Deleting a category unassigns all products (products preserved)
- Category names should be unique (soft constraint, warning only)

---

## Relationships

```
┌─────────────┐         ┌─────────────┐
│   Product   │ M ───── │  Category   │
│             │    N    │             │
│ categoryIds │─────────│     id      │
└─────────────┘         └─────────────┘
```

**Relationship Type**: Many-to-Many

- One product can belong to multiple categories
- One category can contain multiple products
- Relationship stored as `categoryIds` array in Product entity
- No separate junction table (embedded references)

---

## MongoDB Schemas

### ProductModel

```typescript
const ProductSchema = new Schema({
  _id: { type: String, default: () => randomUUID() },
  name: { type: String, required: true, maxlength: 200 },
  description: { type: String, default: '', maxlength: 5000 },
  price: { type: Number, required: true, min: 0.01 },
  imageUrl: { type: String, default: '' },
  displayOrder: { type: Number, required: true, default: 0 },
  categoryIds: [{ type: String, ref: 'Category' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ProductSchema.index({ displayOrder: 1 });
ProductSchema.index({ categoryIds: 1 });
```

### CategoryModel

```typescript
const CategorySchema = new Schema({
  _id: { type: String, default: () => randomUUID() },
  name: { type: String, required: true, maxlength: 100 },
  description: { type: String, default: '', maxlength: 2000 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

CategorySchema.index({ name: 1 });
```

---

## State Transitions

### Product Lifecycle

```
[Not Exists] ──create──► [Active] ──delete──► [Deleted]
                            │
                            ├──update──► [Active]
                            └──reorder──► [Active]
```

### Category Lifecycle

```
[Not Exists] ──create──► [Active] ──delete──► [Deleted]
                            │                (unassign products)
                            └──update──► [Active]
```

---

## Export/Import Schema

Products and categories are included in configuration export.

```json
{
  "version": "X.Y.Z",
  "products": [
    {
      "id": "uuid",
      "name": "Product Name",
      "description": "Description",
      "price": 29.99,
      "imageUrl": "/page-content-images/products/image.jpg",
      "displayOrder": 1,
      "categoryIds": ["cat-uuid-1", "cat-uuid-2"]
    }
  ],
  "categories": [
    {
      "id": "uuid",
      "name": "Category Name",
      "description": "Description"
    }
  ]
}
```

**Import Behavior**:

- Categories imported first (products reference them)
- Missing category references logged as warnings, not errors
- Product images copied from backup if present
