import { Category } from '@/domain/product/entities/Category';

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
  category: CategoryResponse;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
}

export interface UpdateCategoryResponse {
  category: CategoryResponse;
}

export interface DeleteCategoryResponse {
  success: boolean;
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
