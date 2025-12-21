/**
 * Integration test for cart persistence functionality
 * Tests that cart data persists across page reloads and browser sessions
 */
import { CartStorage } from '@/presentation/shared/utils/CartStorage';

describe('Cart Persistence Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('localStorage persistence', () => {
    it('should persist cart items to localStorage when adding items', () => {
      CartStorage.addItem('product-123');
      CartStorage.addItem('product-456');

      const stored = localStorage.getItem(CartStorage.STORAGE_KEY);
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(2);
      expect(parsed[0].productId).toBe('product-123');
      expect(parsed[1].productId).toBe('product-456');
    });

    it('should restore cart items from localStorage on getCart', () => {
      const mockItems = [
        {
          productId: 'product-123',
          quantity: 2,
          addedAt: new Date().toISOString(),
        },
        {
          productId: 'product-456',
          quantity: 1,
          addedAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem(CartStorage.STORAGE_KEY, JSON.stringify(mockItems));

      const cart = CartStorage.getCart();

      expect(cart).toHaveLength(2);
      expect(cart[0].productId).toBe('product-123');
      expect(cart[0].quantity).toBe(2);
      expect(cart[1].productId).toBe('product-456');
      expect(cart[1].quantity).toBe(1);
    });

    it('should handle corrupted localStorage data gracefully', () => {
      localStorage.setItem(CartStorage.STORAGE_KEY, 'invalid-json');

      const cart = CartStorage.getCart();

      expect(cart).toEqual([]);
    });

    it('should return empty cart when localStorage is empty', () => {
      const cart = CartStorage.getCart();

      expect(cart).toEqual([]);
    });

    it('should persist quantity updates to localStorage', () => {
      CartStorage.addItem('product-123');
      CartStorage.updateQuantity('product-123', 5);

      const stored = localStorage.getItem(CartStorage.STORAGE_KEY);
      const parsed = JSON.parse(stored!);

      expect(parsed[0].quantity).toBe(5);
    });

    it('should persist item removal to localStorage', () => {
      CartStorage.addItem('product-123');
      CartStorage.addItem('product-456');
      CartStorage.removeItem('product-123');

      const stored = localStorage.getItem(CartStorage.STORAGE_KEY);
      const parsed = JSON.parse(stored!);

      expect(parsed).toHaveLength(1);
      expect(parsed[0].productId).toBe('product-456');
    });

    it('should persist cart clear to localStorage', () => {
      CartStorage.addItem('product-123');
      CartStorage.addItem('product-456');
      CartStorage.clearCart();

      const stored = localStorage.getItem(CartStorage.STORAGE_KEY);
      expect(stored).toBe('[]');
    });
  });

  describe('cart recovery after simulated page reload', () => {
    it('should recover full cart state after clearing and reloading', () => {
      // Initial cart setup
      CartStorage.addItem('product-123');
      CartStorage.addItem('product-123');
      CartStorage.addItem('product-456');

      // Simulate page reload by getting fresh cart
      const recoveredCart = CartStorage.getCart();

      expect(recoveredCart).toHaveLength(2);
      expect(recoveredCart[0].productId).toBe('product-123');
      expect(recoveredCart[0].quantity).toBe(2);
      expect(recoveredCart[1].productId).toBe('product-456');
      expect(recoveredCart[1].quantity).toBe(1);
    });

    it('should maintain addedAt timestamps after recovery', () => {
      const beforeAdd = new Date().toISOString();
      CartStorage.addItem('product-123');
      const afterAdd = new Date().toISOString();

      const recoveredCart = CartStorage.getCart();
      const item = recoveredCart[0];

      expect(item.addedAt).toBeDefined();
      expect(new Date(item.addedAt).getTime()).toBeGreaterThanOrEqual(
        new Date(beforeAdd).getTime()
      );
      expect(new Date(item.addedAt).getTime()).toBeLessThanOrEqual(
        new Date(afterAdd).getTime()
      );
    });
  });

  describe('event-based updates', () => {
    it('should trigger update callback when cart changes', () => {
      const callback = jest.fn();
      const cleanup = CartStorage.listenToUpdate(callback);

      CartStorage.addItem('product-123');

      expect(callback).toHaveBeenCalled();
      cleanup();
    });

    it('should provide updated cart data in callback', () => {
      const callback = jest.fn();
      const cleanup = CartStorage.listenToUpdate(callback);

      CartStorage.addItem('product-123');

      expect(callback).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ productId: 'product-123' }),
        ])
      );
      cleanup();
    });

    it('should stop receiving updates after cleanup', () => {
      const callback = jest.fn();
      const cleanup = CartStorage.listenToUpdate(callback);

      cleanup();
      CartStorage.addItem('product-123');

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle maximum quantity limit', () => {
      CartStorage.addItem('product-123');

      // Try to set quantity above max (99)
      CartStorage.updateQuantity('product-123', 150);

      const cart = CartStorage.getCart();
      expect(cart[0].quantity).toBe(99);
    });

    it('should handle minimum quantity limit', () => {
      CartStorage.addItem('product-123');

      // Try to set quantity to 0 (should remove item)
      CartStorage.updateQuantity('product-123', 0);

      const cart = CartStorage.getCart();
      expect(cart).toEqual([]);
    });

    it('should handle negative quantity (should remove item)', () => {
      CartStorage.addItem('product-123');

      CartStorage.updateQuantity('product-123', -5);

      const cart = CartStorage.getCart();
      expect(cart).toEqual([]);
    });
  });
});
