import { CartStorage } from '@/presentation/shared/utils/CartStorage';
import { CartItem } from '@/domain/cart/entities/CartItem';

describe('CartStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('addItem', () => {
    it('should add new item with quantity 1 when cart is empty', () => {
      const result = CartStorage.addItem('product-123');

      expect(result).toHaveLength(1);
      expect(result[0].productId).toBe('product-123');
      expect(result[0].quantity).toBe(1);
    });

    it('should increment quantity when product already exists in cart', () => {
      CartStorage.addItem('product-123');
      const result = CartStorage.addItem('product-123');

      expect(result).toHaveLength(1);
      expect(result[0].quantity).toBe(2);
    });

    it('should add different products as separate items', () => {
      CartStorage.addItem('product-123');
      const result = CartStorage.addItem('product-456');

      expect(result).toHaveLength(2);
      expect(
        result.find((item) => item.productId === 'product-123')
      ).toBeDefined();
      expect(
        result.find((item) => item.productId === 'product-456')
      ).toBeDefined();
    });

    it('should persist cart to localStorage', () => {
      CartStorage.addItem('product-123');

      const stored = localStorage.getItem(CartStorage.STORAGE_KEY);
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].productId).toBe('product-123');
    });

    it('should dispatch update event when item is added', () => {
      const mockCallback = jest.fn();
      const cleanup = CartStorage.listenToUpdate(mockCallback);

      CartStorage.addItem('product-123');

      expect(mockCallback).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ productId: 'product-123' }),
        ])
      );

      cleanup();
    });

    it('should not exceed maximum quantity of 99', () => {
      // Add item 100 times
      for (let i = 0; i < 100; i++) {
        CartStorage.addItem('product-123');
      }

      const result = CartStorage.getCart();
      expect(result[0].quantity).toBe(99);
    });
  });

  describe('getCart', () => {
    it('should return empty array when localStorage is empty', () => {
      const result = CartStorage.getCart();
      expect(result).toEqual([]);
    });

    it('should return cart items from localStorage', () => {
      const items = [
        {
          productId: 'product-123',
          quantity: 2,
          addedAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem(CartStorage.STORAGE_KEY, JSON.stringify(items));

      const result = CartStorage.getCart();

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(CartItem);
      expect(result[0].productId).toBe('product-123');
      expect(result[0].quantity).toBe(2);
    });

    it('should return empty array when localStorage contains invalid JSON', () => {
      localStorage.setItem(CartStorage.STORAGE_KEY, 'invalid-json');

      const result = CartStorage.getCart();
      expect(result).toEqual([]);
    });
  });

  describe('setCart', () => {
    it('should persist cart items to localStorage', () => {
      const items = [CartItem.createNew('product-123')];
      CartStorage.setCart(items);

      const stored = localStorage.getItem(CartStorage.STORAGE_KEY);
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed[0].productId).toBe('product-123');
    });

    it('should dispatch update event when cart is set', () => {
      const mockCallback = jest.fn();
      const cleanup = CartStorage.listenToUpdate(mockCallback);

      const items = [CartItem.createNew('product-123')];
      CartStorage.setCart(items);

      expect(mockCallback).toHaveBeenCalled();
      cleanup();
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', () => {
      CartStorage.addItem('product-123');
      CartStorage.addItem('product-456');

      const result = CartStorage.removeItem('product-123');

      expect(result).toHaveLength(1);
      expect(result[0].productId).toBe('product-456');
    });

    it('should return empty array when removing last item', () => {
      CartStorage.addItem('product-123');

      const result = CartStorage.removeItem('product-123');

      expect(result).toEqual([]);
    });

    it('should not modify cart when removing non-existent item', () => {
      CartStorage.addItem('product-123');

      const result = CartStorage.removeItem('non-existent');

      expect(result).toHaveLength(1);
      expect(result[0].productId).toBe('product-123');
    });
  });

  describe('updateQuantity', () => {
    it('should update quantity of existing item', () => {
      CartStorage.addItem('product-123');

      const result = CartStorage.updateQuantity('product-123', 5);

      expect(result[0].quantity).toBe(5);
    });

    it('should remove item when quantity is set to 0', () => {
      CartStorage.addItem('product-123');

      const result = CartStorage.updateQuantity('product-123', 0);

      expect(result).toEqual([]);
    });

    it('should cap quantity at 99', () => {
      CartStorage.addItem('product-123');

      const result = CartStorage.updateQuantity('product-123', 150);

      expect(result[0].quantity).toBe(99);
    });

    it('should not allow negative quantities', () => {
      CartStorage.addItem('product-123');

      const result = CartStorage.updateQuantity('product-123', -5);

      expect(result).toEqual([]);
    });
  });

  describe('clearCart', () => {
    it('should remove all items from cart', () => {
      CartStorage.addItem('product-123');
      CartStorage.addItem('product-456');

      CartStorage.clearCart();
      const result = CartStorage.getCart();

      expect(result).toEqual([]);
    });

    it('should clear localStorage', () => {
      CartStorage.addItem('product-123');

      CartStorage.clearCart();

      const stored = localStorage.getItem(CartStorage.STORAGE_KEY);
      expect(stored).toBe('[]');
    });
  });

  describe('getItemCount', () => {
    it('should return 0 for empty cart', () => {
      const items = CartStorage.getCart();
      const result = CartStorage.getItemCount(items);
      expect(result).toBe(0);
    });

    it('should return total quantity of all items', () => {
      CartStorage.addItem('product-123');
      CartStorage.addItem('product-123');
      CartStorage.addItem('product-456');

      const items = CartStorage.getCart();
      const result = CartStorage.getItemCount(items);
      expect(result).toBe(3);
    });
  });
});
