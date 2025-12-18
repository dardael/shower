# Quickstart: Product and Category Management

**Feature**: 041-product-category-management
**Date**: 2025-12-18

## Overview

This feature adds product and category management to the admin dashboard, allowing administrators to configure a product catalog with categorization.

## Key Files

### Domain Layer

- `src/domain/product/entities/Product.ts` - Product entity with validation
- `src/domain/product/entities/Category.ts` - Category entity
- `src/domain/product/repositories/IProductRepository.ts` - Product repository interface
- `src/domain/product/repositories/ICategoryRepository.ts` - Category repository interface

### Application Layer

- `src/application/product/CreateProduct.ts` - Create product use case
- `src/application/product/UpdateProduct.ts` - Update product use case
- `src/application/product/DeleteProduct.ts` - Delete product use case
- `src/application/product/GetProducts.ts` - Get products use case
- `src/application/product/ReorderProducts.ts` - Reorder products use case
- `src/application/product/CreateCategory.ts` - Create category use case
- `src/application/product/UpdateCategory.ts` - Update category use case
- `src/application/product/DeleteCategory.ts` - Delete category use case
- `src/application/product/GetCategories.ts` - Get categories use case

### Infrastructure Layer

- `src/infrastructure/product/models/ProductModel.ts` - Mongoose schema
- `src/infrastructure/product/models/CategoryModel.ts` - Mongoose schema
- `src/infrastructure/product/repositories/MongooseProductRepository.ts` - Product persistence
- `src/infrastructure/product/repositories/MongooseCategoryRepository.ts` - Category persistence

### Presentation Layer

- `src/app/admin/products/page.tsx` - Products admin page
- `src/presentation/admin/components/products/ProductList.tsx` - Product list component
- `src/presentation/admin/components/products/ProductForm.tsx` - Product form component
- `src/presentation/admin/components/products/CategoryList.tsx` - Category list component
- `src/presentation/admin/components/products/CategoryForm.tsx` - Category form component

### API Routes

- `src/app/api/admin/products/route.ts` - GET/POST products
- `src/app/api/admin/products/[id]/route.ts` - PUT/DELETE product
- `src/app/api/admin/products/reorder/route.ts` - PUT reorder
- `src/app/api/admin/products/upload-image/route.ts` - POST image upload
- `src/app/api/admin/categories/route.ts` - GET/POST categories
- `src/app/api/admin/categories/[id]/route.ts` - PUT/DELETE category

## Development Commands

```bash
# Start development server
docker compose up app

# Run linting
docker compose run --rm app npm run lint

# Run type checking
docker compose run --rm app npm run build:strict

# Run tests (when implemented)
docker compose run --rm app npm run test
```

## Implementation Order

1. **Domain entities** - Product and Category with validation
2. **Repository interfaces** - IProductRepository, ICategoryRepository
3. **Mongoose models** - ProductModel, CategoryModel
4. **Repository implementations** - MongooseProductRepository, MongooseCategoryRepository
5. **Use cases** - CRUD operations for products and categories
6. **DI container registration** - Register repositories and use cases
7. **API routes** - REST endpoints for all operations
8. **UI components** - Forms, lists, cards
9. **Admin page** - Products page with tabs
10. **Navigation** - Add Products menu item to AdminSidebar
11. **Export/import integration** - Add exporters/importers

## Patterns to Follow

### Entity Pattern

See: `src/domain/settings/entities/SocialNetwork.ts`

- Private readonly fields with `_` prefix
- Constructor validation
- Immutable `with*` update methods
- `toJSON()`/`fromJSON()` serialization

### Repository Pattern

See: `src/infrastructure/settings/repositories/MongooseSocialNetworkRepository.ts`

- `@injectable()` decorator
- Implements domain interface
- `mapToDomain()` and `mapToDatabase()` private methods

### Use Case Pattern

See: `src/application/settings/UpdateSocialNetworks.ts`

- `@injectable()` decorator
- Constructor injection
- Single `execute()` method

### File Upload

See: `src/infrastructure/shared/services/FileStorageService.ts`

- Use existing `IFileStorageService`
- Add `productImages` file type configuration
