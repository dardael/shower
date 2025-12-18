# Implementation Plan: Product and Category Management

**Branch**: `041-product-category-management` | **Date**: 2025-12-18 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/041-product-category-management/spec.md`

## Summary

Enable administrators to configure products and categories through a dedicated admin interface. Products have name, description, price, and image with drag-and-drop ordering. Categories organize products via many-to-many relationships. Implementation follows existing DDD/Hexagonal patterns with Mongoose persistence, existing FileStorageService for images, and integration with the export/import system.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router + React 19
**Primary Dependencies**: Chakra UI v3, tsyringe (DI), Mongoose, @dnd-kit/core (drag-and-drop), react-icons
**Storage**: MongoDB via Mongoose, local filesystem (`public/page-content-images/`) for product images
**Testing**: Jest for unit tests and integration tests (only when explicitly requested)
**Target Platform**: Web (desktop and tablet browsers)
**Project Type**: Web application (Next.js monolith with App Router)
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, consistent theme color usage, YAGNI (minimal implementation), DRY (no duplication), KISS (simple code), configuration portability (sync export/import on config changes)
**Scale/Scope**: Support catalogs up to 1000 products with pagination at 50 items

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                             | Status | Notes                                                                |
| ------------------------------------- | ------ | -------------------------------------------------------------------- |
| I. Architecture-First (DDD/Hexagonal) | PASS   | New domain/application/infrastructure layers for Product/Category    |
| II. Focused Testing                   | PASS   | Tests only when explicitly requested                                 |
| III. Simplicity-First                 | PASS   | No performance monitoring, simple implementations                    |
| IV. Security by Default               | PASS   | Admin auth required, existing middleware protects /admin routes      |
| V. Clean Architecture                 | PASS   | Proper layer separation, DI with tsyringe                            |
| VI. Accessibility-First               | PASS   | Chakra UI semantic tokens, theme-aware components                    |
| VII. YAGNI                            | PASS   | Only implementing specified requirements, no variants/inventory/etc. |
| VIII. DRY                             | PASS   | Reusing existing FileStorageService, patterns, components            |
| IX. KISS                              | PASS   | Simple CRUD operations, straightforward UI                           |
| X. Configuration Portability          | PASS   | Products/categories included in export/import system                 |

**Gate Result**: PASS - No violations requiring justification.

## Project Structure

### Documentation (this feature)

```text
specs/041-product-category-management/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── app/
│   └── admin/
│       └── products/
│           └── page.tsx              # Product management page
├── domain/
│   └── product/
│       ├── entities/
│       │   ├── Product.ts            # Product entity
│       │   └── Category.ts           # Category entity
│       └── repositories/
│           ├── IProductRepository.ts
│           └── ICategoryRepository.ts
├── application/
│   └── product/
│       ├── ICreateProduct.ts
│       ├── CreateProduct.ts
│       ├── IUpdateProduct.ts
│       ├── UpdateProduct.ts
│       ├── IDeleteProduct.ts
│       ├── DeleteProduct.ts
│       ├── IGetProducts.ts
│       ├── GetProducts.ts
│       ├── IReorderProducts.ts
│       ├── ReorderProducts.ts
│       ├── ICreateCategory.ts
│       ├── CreateCategory.ts
│       ├── IUpdateCategory.ts
│       ├── UpdateCategory.ts
│       ├── IDeleteCategory.ts
│       ├── DeleteCategory.ts
│       ├── IGetCategories.ts
│       └── GetCategories.ts
├── infrastructure/
│   └── product/
│       ├── models/
│       │   ├── ProductModel.ts       # Mongoose schema
│       │   └── CategoryModel.ts      # Mongoose schema
│       └── repositories/
│           ├── MongooseProductRepository.ts
│           └── MongooseCategoryRepository.ts
└── presentation/
    └── admin/
        └── components/
            └── products/
                ├── ProductList.tsx
                ├── ProductForm.tsx
                ├── ProductCard.tsx
                ├── CategoryList.tsx
                ├── CategoryForm.tsx
                ├── CategoryCard.tsx
                └── ProductCategoryTabs.tsx

test/
└── unit/
    ├── domain/
    │   └── product/
    │       ├── Product.test.ts
    │       └── Category.test.ts
    └── application/
        └── product/
            └── (use case tests when requested)
```

**Structure Decision**: Following existing DDD/Hexagonal architecture pattern with dedicated `product` subdirectories in each layer. Uses existing patterns from `settings` and `menu` domains.
