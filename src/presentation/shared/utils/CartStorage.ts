/**
 * CartStorage Utility
 *
 * Handles localStorage persistence and cross-tab synchronization for shopping cart.
 * Follows the existing storage pattern (ThemeColorStorage, BackgroundColorStorage).
 */

import { CartItem, CartItemData } from '@/domain/cart/entities/CartItem';

const STORAGE_KEY = 'shower-cart';
const UPDATE_EVENT = 'cart-updated';
const BROADCAST_CHANNEL = 'shower-cart-sync';

export class CartStorage {
  static readonly STORAGE_KEY = STORAGE_KEY;
  static readonly UPDATE_EVENT = UPDATE_EVENT;
  static readonly BROADCAST_CHANNEL = BROADCAST_CHANNEL;

  private static broadcastChannel: BroadcastChannel | null = null;

  /**
   * Gets the storage key.
   */
  static getStorageKey(): string {
    return STORAGE_KEY;
  }

  /**
   * Gets the update event name.
   */
  static getUpdateEvent(): string {
    return UPDATE_EVENT;
  }

  /**
   * Retrieves cart items from localStorage.
   */
  static getCart(): CartItem[] {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return [];
      }

      const parsed = JSON.parse(stored) as unknown[];
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .map((item) => CartItem.fromJSON(item))
        .filter((item): item is CartItem => item !== null);
    } catch {
      return [];
    }
  }

  /**
   * Persists cart items to localStorage.
   */
  static setCart(items: CartItem[]): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const serialized = JSON.stringify(items.map((item) => item.toJSON()));
      localStorage.setItem(STORAGE_KEY, serialized);
      this.dispatchUpdate(items);
      this.broadcastToOtherTabs(items);
    } catch {
      // Silently fail if localStorage is unavailable
    }
  }

  /**
   * Adds a product to cart or increments quantity if exists.
   */
  static addItem(productId: string): CartItem[] {
    const items = this.getCart();
    const existingIndex = items.findIndex(
      (item) => item.productId === productId
    );

    let updatedItems: CartItem[];

    if (existingIndex >= 0) {
      const existingItem = items[existingIndex];
      const updatedItem = existingItem.increment();
      updatedItems = [
        ...items.slice(0, existingIndex),
        updatedItem,
        ...items.slice(existingIndex + 1),
      ];
    } else {
      const newItem = CartItem.createNew(productId);
      updatedItems = [...items, newItem];
    }

    this.setCart(updatedItems);
    return updatedItems;
  }

  /**
   * Removes a product from cart entirely.
   */
  static removeItem(productId: string): CartItem[] {
    const items = this.getCart();
    const updatedItems = items.filter((item) => item.productId !== productId);
    this.setCart(updatedItems);
    return updatedItems;
  }

  /**
   * Updates quantity for a specific product.
   */
  static updateQuantity(productId: string, quantity: number): CartItem[] {
    if (quantity <= 0) {
      return this.removeItem(productId);
    }

    const items = this.getCart();
    const existingIndex = items.findIndex(
      (item) => item.productId === productId
    );

    if (existingIndex < 0) {
      return items;
    }

    const existingItem = items[existingIndex];
    const updatedItem = existingItem.withQuantity(quantity);
    const updatedItems = [
      ...items.slice(0, existingIndex),
      updatedItem,
      ...items.slice(existingIndex + 1),
    ];

    this.setCart(updatedItems);
    return updatedItems;
  }

  /**
   * Removes all items from cart.
   */
  static clearCart(): void {
    this.setCart([]);
  }

  /**
   * Calculates total item count (sum of quantities).
   */
  static getItemCount(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }

  /**
   * Dispatches a custom event when cart is updated.
   */
  static dispatchUpdate(items: CartItem[]): void {
    if (typeof window === 'undefined') {
      return;
    }

    const event = new CustomEvent(UPDATE_EVENT, {
      detail: { items: items.map((item) => item.toJSON()) },
    });
    window.dispatchEvent(event);
  }

  /**
   * Listens for cart update events.
   */
  static listenToUpdate(callback: (items: CartItemData[]) => void): () => void {
    if (typeof window === 'undefined') {
      return () => {};
    }

    const handler = (event: Event): void => {
      const customEvent = event as CustomEvent<{ items: CartItemData[] }>;
      callback(customEvent.detail.items);
    };

    window.addEventListener(UPDATE_EVENT, handler);

    return () => {
      window.removeEventListener(UPDATE_EVENT, handler);
    };
  }

  /**
   * Broadcasts cart update to other browser tabs.
   */
  private static broadcastToOtherTabs(items: CartItem[]): void {
    if (
      typeof window === 'undefined' ||
      typeof BroadcastChannel === 'undefined'
    ) {
      return;
    }

    try {
      if (!this.broadcastChannel) {
        this.broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL);
      }

      this.broadcastChannel.postMessage({
        type: 'cart-updated',
        items: items.map((item) => item.toJSON()),
      });
    } catch {
      // Silently fail if BroadcastChannel is unavailable
    }
  }

  /**
   * Listens for cart updates from other browser tabs.
   */
  static listenToBroadcast(
    callback: (items: CartItemData[]) => void
  ): () => void {
    if (
      typeof window === 'undefined' ||
      typeof BroadcastChannel === 'undefined'
    ) {
      return () => {};
    }

    try {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL);

      channel.onmessage = (event: MessageEvent) => {
        if (event.data?.type === 'cart-updated') {
          callback(event.data.items);
        }
      };

      return () => {
        channel.close();
      };
    } catch {
      return () => {};
    }
  }
}
