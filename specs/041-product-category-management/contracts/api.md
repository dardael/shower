# API Contracts: Product and Category Management

**Feature**: 041-product-category-management
**Date**: 2025-12-18
**Base Path**: `/api/admin`

---

## Products API

### GET /api/admin/products

Retrieve all products with optional filtering.

**Query Parameters**:
| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| categoryId | string | No | Filter by category ID |

**Response**: `200 OK`

```json
{
  "products": [
    {
      "id": "uuid",
      "name": "Product Name",
      "description": "Description text",
      "price": 29.99,
      "imageUrl": "/page-content-images/products/image.jpg",
      "displayOrder": 1,
      "categoryIds": ["cat-uuid-1", "cat-uuid-2"],
      "createdAt": "2025-12-18T10:00:00Z",
      "updatedAt": "2025-12-18T10:00:00Z"
    }
  ]
}
```

**Errors**:

- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not an admin

---

### POST /api/admin/products

Create a new product.

**Request Body**:

```json
{
  "name": "Product Name",
  "description": "Description text",
  "price": 29.99,
  "imageUrl": "/page-content-images/products/image.jpg",
  "categoryIds": ["cat-uuid-1"]
}
```

**Response**: `201 Created`

```json
{
  "product": {
    "id": "new-uuid",
    "name": "Product Name",
    "description": "Description text",
    "price": 29.99,
    "imageUrl": "/page-content-images/products/image.jpg",
    "displayOrder": 5,
    "categoryIds": ["cat-uuid-1"],
    "createdAt": "2025-12-18T10:00:00Z",
    "updatedAt": "2025-12-18T10:00:00Z"
  }
}
```

**Errors**:

- `400 Bad Request`: Validation error (empty name, invalid price)
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not an admin

---

### PUT /api/admin/products/:id

Update an existing product.

**Path Parameters**:

- `id`: Product UUID

**Request Body**:

```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "price": 39.99,
  "imageUrl": "/page-content-images/products/new-image.jpg",
  "categoryIds": ["cat-uuid-1", "cat-uuid-2"]
}
```

**Response**: `200 OK`

```json
{
  "product": { ... }
}
```

**Errors**:

- `400 Bad Request`: Validation error
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not an admin
- `404 Not Found`: Product not found

---

### DELETE /api/admin/products/:id

Delete a product.

**Path Parameters**:

- `id`: Product UUID

**Response**: `200 OK`

```json
{
  "success": true
}
```

**Errors**:

- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not an admin
- `404 Not Found`: Product not found

---

### PUT /api/admin/products/reorder

Reorder products by updating display order.

**Request Body**:

```json
{
  "orderedIds": ["uuid-1", "uuid-2", "uuid-3"]
}
```

**Response**: `200 OK`

```json
{
  "success": true
}
```

**Errors**:

- `400 Bad Request`: Invalid product IDs
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not an admin

---

## Categories API

### GET /api/admin/categories

Retrieve all categories.

**Response**: `200 OK`

```json
{
  "categories": [
    {
      "id": "uuid",
      "name": "Category Name",
      "description": "Description text",
      "productCount": 5,
      "createdAt": "2025-12-18T10:00:00Z",
      "updatedAt": "2025-12-18T10:00:00Z"
    }
  ]
}
```

**Errors**:

- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not an admin

---

### POST /api/admin/categories

Create a new category.

**Request Body**:

```json
{
  "name": "Category Name",
  "description": "Description text"
}
```

**Response**: `201 Created`

```json
{
  "category": {
    "id": "new-uuid",
    "name": "Category Name",
    "description": "Description text",
    "productCount": 0,
    "createdAt": "2025-12-18T10:00:00Z",
    "updatedAt": "2025-12-18T10:00:00Z"
  }
}
```

**Errors**:

- `400 Bad Request`: Validation error (empty name)
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not an admin

---

### PUT /api/admin/categories/:id

Update an existing category.

**Path Parameters**:

- `id`: Category UUID

**Request Body**:

```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

**Response**: `200 OK`

```json
{
  "category": { ... }
}
```

**Errors**:

- `400 Bad Request`: Validation error
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not an admin
- `404 Not Found`: Category not found

---

### DELETE /api/admin/categories/:id

Delete a category (unassigns products, does not delete them).

**Path Parameters**:

- `id`: Category UUID

**Response**: `200 OK`

```json
{
  "success": true,
  "unassignedProductCount": 3
}
```

**Errors**:

- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not an admin
- `404 Not Found`: Category not found

---

## Image Upload API

### POST /api/admin/products/upload-image

Upload a product image.

**Request**: `multipart/form-data`

- `image`: File (JPEG, PNG, WebP; max 5MB)

**Response**: `200 OK`

```json
{
  "url": "/page-content-images/products/filename.jpg",
  "metadata": {
    "originalName": "photo.jpg",
    "size": 102400,
    "mimeType": "image/jpeg"
  }
}
```

**Errors**:

- `400 Bad Request`: Invalid file type or size exceeded
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not an admin
- `500 Internal Server Error`: Storage error

---

## Common Response Codes

| Code | Description                        |
| ---- | ---------------------------------- |
| 200  | Success                            |
| 201  | Created                            |
| 400  | Bad Request - Validation error     |
| 401  | Unauthorized - Not authenticated   |
| 403  | Forbidden - Not an admin           |
| 404  | Not Found - Resource doesn't exist |
| 500  | Internal Server Error              |

## Authentication

All endpoints require:

1. Valid session cookie (BetterAuth)
2. User email matching `ADMIN_EMAIL` environment variable
