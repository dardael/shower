/**
 * @jest-environment jsdom
 */
import { renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';
import {
  CartProvider,
  useCart,
} from '@/presentation/shared/contexts/CartContext';
import { CartStorage } from '@/presentation/shared/utils/CartStorage';
import { CartItem } from '@/domain/cart/entities/CartItem';

// Mock CartStorage
jest.mock('@/presentation/shared/utils/CartStorage', () => ({
  CartStorage: {
    STORAGE_KEY: 'shower-cart',
    UPDATE_EVENT: 'cart-updated',
    BROADCAST_CHANNEL: 'shower-cart-sync',
    getCart: jest.fn(() => []),
    setCart: jest.fn(),
    addItem: jest.fn(),
    removeItem: jest.fn(),
    updateQuantity: jest.fn(),
    clearCart: jest.fn(),
    getItemCount: jest.fn(() => 0),
    listenToUpdate: jest.fn(() => jest.fn()),
  },
}));

const mockedCartStorage = CartStorage as jest.Mocked<typeof CartStorage>;

function wrapper({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return <CartProvider>{children}</CartProvider>;
}

describe('CartContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedCartStorage.getCart.mockReturnValue([]);
    mockedCartStorage.getItemCount.mockReturnValue(0);
  });

  describe('useCart', () => {
    it('should throw error when used outside CartProvider', () => {
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => {
        renderHook(() => useCart());
      }).toThrow('useCart must be used within a CartProvider');

      consoleError.mockRestore();
    });

    it('should provide cart context values', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      expect(result.current).toHaveProperty('items');
      expect(result.current).toHaveProperty('itemCount');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('addItem');
      expect(result.current).toHaveProperty('removeItem');
      expect(result.current).toHaveProperty('updateQuantity');
      expect(result.current).toHaveProperty('clearCart');
    });
  });

  describe('addItem', () => {
    it('should call CartStorage.addItem with productId', async () => {
      mockedCartStorage.addItem.mockReturnValue([]);

      const { result } = renderHook(() => useCart(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.addItem('product-123');
      });

      expect(mockedCartStorage.addItem).toHaveBeenCalledWith('product-123');
    });

    it('should set error when addItem throws', async () => {
      mockedCartStorage.addItem.mockImplementation(() => {
        throw new Error('Storage full');
      });

      const { result } = renderHook(() => useCart(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.addItem('product-123');
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Storage full');
    });
  });

  describe('removeItem', () => {
    it('should call CartStorage.removeItem with productId', async () => {
      mockedCartStorage.removeItem.mockReturnValue([]);

      const { result } = renderHook(() => useCart(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.removeItem('product-123');
      });

      expect(mockedCartStorage.removeItem).toHaveBeenCalledWith('product-123');
    });
  });

  describe('updateQuantity', () => {
    it('should call CartStorage.updateQuantity with productId and quantity', async () => {
      mockedCartStorage.updateQuantity.mockReturnValue([]);

      const { result } = renderHook(() => useCart(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.updateQuantity('product-123', 5);
      });

      expect(mockedCartStorage.updateQuantity).toHaveBeenCalledWith(
        'product-123',
        5
      );
    });
  });

  describe('clearCart', () => {
    it('should call CartStorage.clearCart', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.clearCart();
      });

      expect(mockedCartStorage.clearCart).toHaveBeenCalled();
    });
  });

  describe('itemCount', () => {
    it('should return total quantity calculated from items', async () => {
      const mockItems = [
        CartItem.createNew('product-123').withQuantity(2),
        CartItem.createNew('product-456').withQuantity(3),
      ];
      mockedCartStorage.getCart.mockReturnValue(mockItems);

      const { result } = renderHook(() => useCart(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.itemCount).toBe(5);
    });
  });

  describe('initial state', () => {
    it('should load cart from storage on mount', () => {
      renderHook(() => useCart(), { wrapper });

      expect(mockedCartStorage.getCart).toHaveBeenCalled();
    });

    it('should set isLoading to false after initial load', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });
});
