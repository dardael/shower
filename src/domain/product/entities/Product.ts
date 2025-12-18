import { randomUUID } from 'crypto';

export interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  displayOrder: number;
  categoryIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class Product {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _description: string;
  private readonly _price: number;
  private readonly _imageUrl: string;
  private readonly _displayOrder: number;
  private readonly _categoryIds: string[];
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  constructor(data: ProductData) {
    this._id = data.id;
    this._name = data.name;
    this._description = data.description;
    this._price = data.price;
    this._imageUrl = data.imageUrl;
    this._displayOrder = data.displayOrder;
    this._categoryIds = [...data.categoryIds];
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;

    this.validate();
  }

  private validate(): void {
    if (!this._name || this._name.trim().length === 0) {
      throw new Error('Product name is required');
    }
    if (this._name.length > 200) {
      throw new Error('Product name must be 200 characters or less');
    }
    if (this._price <= 0) {
      throw new Error('Product price must be greater than 0');
    }
    if (this._description.length > 5000) {
      throw new Error('Product description must be 5000 characters or less');
    }
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get price(): number {
    return this._price;
  }

  get imageUrl(): string {
    return this._imageUrl;
  }

  get displayOrder(): number {
    return this._displayOrder;
  }

  get categoryIds(): string[] {
    return [...this._categoryIds];
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  withName(name: string): Product {
    return new Product({
      ...this.toJSON(),
      name,
      updatedAt: new Date(),
    });
  }

  withDescription(description: string): Product {
    return new Product({
      ...this.toJSON(),
      description,
      updatedAt: new Date(),
    });
  }

  withPrice(price: number): Product {
    return new Product({
      ...this.toJSON(),
      price,
      updatedAt: new Date(),
    });
  }

  withImageUrl(imageUrl: string): Product {
    return new Product({
      ...this.toJSON(),
      imageUrl,
      updatedAt: new Date(),
    });
  }

  withDisplayOrder(displayOrder: number): Product {
    return new Product({
      ...this.toJSON(),
      displayOrder,
      updatedAt: new Date(),
    });
  }

  withCategoryIds(categoryIds: string[]): Product {
    return new Product({
      ...this.toJSON(),
      categoryIds: [...categoryIds],
      updatedAt: new Date(),
    });
  }

  addCategory(categoryId: string): Product {
    if (this._categoryIds.includes(categoryId)) {
      return this;
    }
    return this.withCategoryIds([...this._categoryIds, categoryId]);
  }

  removeCategory(categoryId: string): Product {
    return this.withCategoryIds(
      this._categoryIds.filter((id) => id !== categoryId)
    );
  }

  equals(other: Product | null | undefined): boolean {
    if (!other) {
      return false;
    }
    return this._id === other._id;
  }

  static create(data: {
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    displayOrder?: number;
    categoryIds?: string[];
  }): Product {
    const now = new Date();
    return new Product({
      id: randomUUID(),
      name: data.name,
      description: data.description ?? '',
      price: data.price,
      imageUrl: data.imageUrl ?? '',
      displayOrder: data.displayOrder ?? 0,
      categoryIds: data.categoryIds ?? [],
      createdAt: now,
      updatedAt: now,
    });
  }

  toJSON(): ProductData {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      price: this._price,
      imageUrl: this._imageUrl,
      displayOrder: this._displayOrder,
      categoryIds: [...this._categoryIds],
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  static fromJSON(data: ProductData): Product {
    return new Product({
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
  }
}
