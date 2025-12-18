import { randomUUID } from 'crypto';

export interface CategoryData {
  id: string;
  name: string;
  description: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Category {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _description: string;
  private readonly _displayOrder: number;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  constructor(data: CategoryData) {
    this._id = data.id;
    this._name = data.name;
    this._description = data.description;
    this._displayOrder = data.displayOrder;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;

    this.validate();
  }

  private validate(): void {
    if (!this._name || this._name.trim().length === 0) {
      throw new Error('Category name is required');
    }
    if (this._name.length > 100) {
      throw new Error('Category name must be 100 characters or less');
    }
    if (this._description.length > 2000) {
      throw new Error('Category description must be 2000 characters or less');
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

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get displayOrder(): number {
    return this._displayOrder;
  }

  withName(name: string): Category {
    return new Category({
      ...this.toJSON(),
      name,
      updatedAt: new Date(),
    });
  }

  withDescription(description: string): Category {
    return new Category({
      ...this.toJSON(),
      description,
      updatedAt: new Date(),
    });
  }

  withDisplayOrder(displayOrder: number): Category {
    return new Category({
      ...this.toJSON(),
      displayOrder,
      updatedAt: new Date(),
    });
  }

  equals(other: Category | null | undefined): boolean {
    if (!other) {
      return false;
    }
    return this._id === other._id;
  }

  static create(data: {
    name: string;
    description?: string;
    displayOrder?: number;
  }): Category {
    const now = new Date();
    return new Category({
      id: randomUUID(),
      name: data.name,
      description: data.description ?? '',
      displayOrder: data.displayOrder ?? 0,
      createdAt: now,
      updatedAt: now,
    });
  }

  toJSON(): CategoryData {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      displayOrder: this._displayOrder,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  static fromJSON(data: CategoryData): Category {
    return new Category({
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
  }
}
