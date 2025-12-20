# Quickstart: Products List Page Content

**Feature**: 042-products-list-page  
**Date**: 2025-12-20

## Overview

This guide explains how to implement and integrate the products list feature in page content.

---

## Implementation Steps

### 1. Create Domain Types

Create `src/domain/product/types/ProductListConfig.ts`:

```typescript
export interface ProductListConfig {
  readonly categoryIds: string[] | null;
}

export const DEFAULT_PRODUCT_LIST_CONFIG: ProductListConfig = {
  categoryIds: null,
};
```

### 2. Create Public Products Use Case

Create `src/application/product/use-cases/GetPublicProducts.ts`:

```typescript
export interface IGetPublicProducts {
  execute(categoryIds?: string[]): Promise<Product[]>;
}
```

### 3. Create Public Products API

Create `src/app/api/public/products/route.ts`:

```typescript
export async function GET(request: NextRequest): Promise<NextResponse> {
  const categoryIds = request.nextUrl.searchParams.get('categoryIds');
  const useCase = container.resolve<IGetPublicProducts>('IGetPublicProducts');
  const products = await useCase.execute(categoryIds?.split(','));
  return NextResponse.json({ success: true, data: products });
}
```

### 4. Create Tiptap Extension

Create `src/presentation/admin/components/PageContentEditor/extensions/ProductList.ts`:

```typescript
export const ProductList = Node.create({
  name: 'productList',
  group: 'block',
  atom: true,
  // ... full implementation per research.md patterns
});
```

### 5. Create ProductListToolbar

Create `src/presentation/admin/components/PageContentEditor/ProductListToolbar.tsx`:

- Category multi-select dropdown
- Sync with node attributes on selection change
- Update via editor commands

### 6. Update TiptapEditor

Modify `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`:

- Add ProductList to extensions array
- Add toolbar button for insertion
- Track productList selection state
- Render ProductListToolbar when selected

### 7. Create ProductListRenderer

Create `src/presentation/shared/components/PublicPageContent/ProductListRenderer.tsx`:

- Fetch products from `/api/public/products`
- Render product grid with name, image, description, price
- Handle empty state
- Support light/dark mode

### 8. Update PublicPageContent

Modify `src/presentation/shared/components/PublicPageContent/PublicPageContent.tsx`:

- Add `data-category-ids` to DOMPurify allowed attributes
- Process `.product-list` elements for hydration

### 9. Add CSS Styles

Update `src/presentation/shared/components/PublicPageContent/public-page-content.css`:

```css
.public-page-content .product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.public-page-content .product-item {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}
```

---

## Testing Scenario

1. Create products via admin product management
2. Edit a page in the content editor
3. Click "Insert Products List" in toolbar
4. Optionally select category filters
5. Save the page
6. View the public page to see products displayed

---

## Key Files Summary

| File                                                                            | Action |
| ------------------------------------------------------------------------------- | ------ |
| `src/domain/product/types/ProductListConfig.ts`                                 | CREATE |
| `src/application/product/use-cases/GetPublicProducts.ts`                        | CREATE |
| `src/infrastructure/product/services/PublicProductServiceLocator.ts`            | CREATE |
| `src/app/api/public/products/route.ts`                                          | CREATE |
| `src/presentation/admin/components/PageContentEditor/extensions/ProductList.ts` | CREATE |
| `src/presentation/admin/components/PageContentEditor/extensions/index.ts`       | UPDATE |
| `src/presentation/admin/components/PageContentEditor/ProductListToolbar.tsx`    | CREATE |
| `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`          | UPDATE |
| `src/presentation/shared/components/PublicPageContent/ProductListRenderer.tsx`  | CREATE |
| `src/presentation/shared/components/PublicPageContent/PublicPageContent.tsx`    | UPDATE |
| `src/presentation/shared/components/PublicPageContent/public-page-content.css`  | UPDATE |
