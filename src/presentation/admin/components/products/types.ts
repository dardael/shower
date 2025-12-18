export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  displayOrder: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryIds: string[];
  displayOrder: number;
}
