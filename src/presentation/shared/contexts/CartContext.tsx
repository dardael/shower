'use client';

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from 'react';
import { CartStorage } from '../utils/CartStorage';
import { CartItem, type CartItemData } from '@/domain/cart/entities/CartItem';

interface CartContextValue {
  items: CartItemData[];
  itemCount: number;
  isLoading: boolean;
  error: Error | null;
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

interface CartProviderProps {
  children: ReactNode;
}

function cartItemsToData(items: CartItem[]): CartItemData[] {
  return items.map((item) => item.toJSON());
}

export function CartProvider({
  children,
}: CartProviderProps): React.JSX.Element {
  const [items, setItems] = useState<CartItemData[]>(() => {
    if (typeof window !== 'undefined') {
      return cartItemsToData(CartStorage.getCart());
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    setItems(cartItemsToData(CartStorage.getCart()));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      broadcastChannelRef.current = new BroadcastChannel(
        CartStorage.BROADCAST_CHANNEL
      );

      broadcastChannelRef.current.onmessage = (event) => {
        const data = event.data as { type: string; items: CartItemData[] };
        if (data.type === 'cart-updated' && Array.isArray(data.items)) {
          setItems(data.items);
        }
      };

      return () => {
        broadcastChannelRef.current?.close();
      };
    }
    return undefined;
  }, []);

  useEffect(() => {
    const cleanup = CartStorage.listenToUpdate((updatedItems) => {
      setItems(updatedItems);
    });
    return cleanup;
  }, []);

  const addItem = useCallback((productId: string): void => {
    try {
      setError(null);
      const updatedItems = CartStorage.addItem(productId);
      const updatedData = cartItemsToData(updatedItems);
      setItems(updatedData);
      broadcastChannelRef.current?.postMessage({
        type: 'cart-updated',
        items: updatedData,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to add item to cart')
      );
    }
  }, []);

  const removeItem = useCallback((productId: string): void => {
    try {
      setError(null);
      const updatedItems = CartStorage.removeItem(productId);
      const updatedData = cartItemsToData(updatedItems);
      setItems(updatedData);
      broadcastChannelRef.current?.postMessage({
        type: 'cart-updated',
        items: updatedData,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('Failed to remove item from cart')
      );
    }
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number): void => {
      try {
        setError(null);
        const updatedItems = CartStorage.updateQuantity(productId, quantity);
        const updatedData = cartItemsToData(updatedItems);
        setItems(updatedData);
        broadcastChannelRef.current?.postMessage({
          type: 'cart-updated',
          items: updatedData,
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to update item quantity')
        );
      }
    },
    []
  );

  const clearCart = useCallback((): void => {
    try {
      setError(null);
      CartStorage.clearCart();
      setItems([]);
      broadcastChannelRef.current?.postMessage({
        type: 'cart-updated',
        items: [],
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to clear cart'));
    }
  }, []);

  const value: CartContextValue = {
    items,
    itemCount,
    isLoading,
    error,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
