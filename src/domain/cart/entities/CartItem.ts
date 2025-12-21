/**
 * CartItem Entity
 *
 * Represents a single product entry in the shopping cart.
 * Stores minimal data - product details are fetched at render time.
 */

import {
  MAX_CART_ITEM_QUANTITY,
  MIN_CART_ITEM_QUANTITY,
} from '@/domain/cart/constants';

export interface CartItemData {
  productId: string;
  quantity: number;
  addedAt: Date;
}

export class CartItem {
  private readonly _productId: string;
  private readonly _quantity: number;
  private readonly _addedAt: Date;

  private constructor(data: CartItemData) {
    this._productId = data.productId;
    this._quantity = data.quantity;
    this._addedAt = data.addedAt;
  }

  get productId(): string {
    return this._productId;
  }

  get quantity(): number {
    return this._quantity;
  }

  get addedAt(): Date {
    return this._addedAt;
  }

  /**
   * Creates a new CartItem with validated data.
   */
  static create(data: CartItemData): CartItem {
    if (!data.productId || typeof data.productId !== 'string') {
      throw new Error('CartItem requires a valid productId');
    }

    if (typeof data.quantity !== 'number' || !Number.isInteger(data.quantity)) {
      throw new Error('CartItem quantity must be an integer');
    }

    if (
      data.quantity < MIN_CART_ITEM_QUANTITY ||
      data.quantity > MAX_CART_ITEM_QUANTITY
    ) {
      throw new Error(
        `CartItem quantity must be between ${MIN_CART_ITEM_QUANTITY} and ${MAX_CART_ITEM_QUANTITY}`
      );
    }

    if (!(data.addedAt instanceof Date) || isNaN(data.addedAt.getTime())) {
      throw new Error('CartItem requires a valid addedAt date');
    }

    return new CartItem(data);
  }

  /**
   * Creates a new CartItem for a product with quantity 1.
   */
  static createNew(productId: string): CartItem {
    return CartItem.create({
      productId,
      quantity: 1,
      addedAt: new Date(),
    });
  }

  /**
   * Returns a new CartItem with updated quantity.
   */
  withQuantity(quantity: number): CartItem {
    const clampedQuantity = Math.max(
      MIN_CART_ITEM_QUANTITY,
      Math.min(MAX_CART_ITEM_QUANTITY, quantity)
    );
    return CartItem.create({
      productId: this._productId,
      quantity: clampedQuantity,
      addedAt: this._addedAt,
    });
  }

  /**
   * Returns a new CartItem with quantity incremented by 1.
   */
  increment(): CartItem {
    return this.withQuantity(this._quantity + 1);
  }

  /**
   * Returns a new CartItem with quantity decremented by 1.
   * Returns null if quantity would become 0.
   */
  decrement(): CartItem | null {
    if (this._quantity <= MIN_CART_ITEM_QUANTITY) {
      return null;
    }
    return this.withQuantity(this._quantity - 1);
  }

  /**
   * Converts to a plain object for serialization.
   */
  toJSON(): CartItemData {
    return {
      productId: this._productId,
      quantity: this._quantity,
      addedAt: this._addedAt,
    };
  }

  /**
   * Creates a CartItem from a plain object (e.g., from localStorage).
   * Returns null if the data is invalid.
   */
  static fromJSON(data: unknown): CartItem | null {
    if (!data || typeof data !== 'object') {
      return null;
    }

    const obj = data as Record<string, unknown>;

    if (typeof obj.productId !== 'string' || !obj.productId) {
      return null;
    }

    if (typeof obj.quantity !== 'number' || !Number.isInteger(obj.quantity)) {
      return null;
    }

    if (
      obj.quantity < MIN_CART_ITEM_QUANTITY ||
      obj.quantity > MAX_CART_ITEM_QUANTITY
    ) {
      return null;
    }

    let addedAt: Date;
    if (obj.addedAt instanceof Date) {
      addedAt = obj.addedAt;
    } else if (typeof obj.addedAt === 'string') {
      addedAt = new Date(obj.addedAt);
    } else {
      return null;
    }

    if (isNaN(addedAt.getTime())) {
      return null;
    }

    return new CartItem({
      productId: obj.productId,
      quantity: obj.quantity,
      addedAt,
    });
  }
}
