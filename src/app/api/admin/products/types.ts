import type { Product } from '@/domain/product/entities/Product';
import type { Category } from '@/domain/product/entities/Category';

// Product types
export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  displayOrder: number;
  categoryIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GetProductsResponse {
  products: ProductResponse[];
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryIds?: string[];
}

export interface CreateProductResponse {
  message: string;
  product: ProductResponse;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  categoryIds?: string[];
}

export interface UpdateProductResponse {
  message: string;
  product: ProductResponse;
}

export interface DeleteProductResponse {
  message: string;
}

export interface ReorderProductsRequest {
  orderedIds: string[];
}

export interface ReorderProductsResponse {
  message: string;
}

// Category types
export interface CategoryResponse {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetCategoriesResponse {
  categories: CategoryResponse[];
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
}

export interface CreateCategoryResponse {
  message: string;
  category: CategoryResponse;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
}

export interface UpdateCategoryResponse {
  message: string;
  category: CategoryResponse;
}

export interface DeleteCategoryResponse {
  message: string;
}

// Helper functions
export function mapProductToResponse(product: Product): ProductResponse {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    imageUrl: product.imageUrl,
    displayOrder: product.displayOrder,
    categoryIds: product.categoryIds,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export function mapCategoryToResponse(category: Category): CategoryResponse {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}
