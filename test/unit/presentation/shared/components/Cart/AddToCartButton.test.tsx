/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AddToCartButton } from '@/presentation/shared/components/Cart/AddToCartButton';
import { CartProvider } from '@/presentation/shared/contexts/CartContext';
import { SellingConfigProvider } from '@/presentation/shared/contexts/SellingConfigContext';

// Mock the CartStorage
jest.mock('@/presentation/shared/utils/CartStorage', () => ({
  CartStorage: {
    STORAGE_KEY: 'shower-cart',
    UPDATE_EVENT: 'cart-updated',
    BROADCAST_CHANNEL: 'shower-cart-sync',
    getCart: jest.fn(() => []),
    setCart: jest.fn(),
    addItem: jest.fn((productId: string) => [
      {
        productId,
        quantity: 1,
        addedAt: new Date().toISOString(),
      },
    ]),
    removeItem: jest.fn(() => []),
    updateQuantity: jest.fn(() => []),
    clearCart: jest.fn(),
    getItemCount: jest.fn((items: unknown[]) => items.length),
    listenToUpdate: jest.fn(() => jest.fn()),
  },
}));

// Mock SellingConfigContext
jest.mock('@/presentation/shared/contexts/SellingConfigContext', () => ({
  SellingConfigProvider: ({ children }: { children: React.ReactNode }) =>
    children,
  useSellingConfig: () => ({
    sellingEnabled: true,
    isLoading: false,
    error: null,
  }),
}));

const renderWithProviders = (
  ui: React.ReactElement
): ReturnType<typeof render> => {
  return render(
    <SellingConfigProvider>
      <CartProvider>{ui}</CartProvider>
    </SellingConfigProvider>
  );
};

describe('AddToCartButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('rendering', () => {
    it('should render the button with plus icon', () => {
      renderWithProviders(<AddToCartButton productId="product-123" />);

      expect(
        screen.getByRole('button', { name: /ajouter au panier/i })
      ).toBeInTheDocument();
    });

    it('should be disabled when disabled prop is true', () => {
      renderWithProviders(
        <AddToCartButton productId="product-123" disabled={true} />
      );

      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('interactions', () => {
    it('should call addItem when clicked', () => {
      const { CartStorage } = jest.requireMock(
        '@/presentation/shared/utils/CartStorage'
      );

      renderWithProviders(<AddToCartButton productId="product-123" />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(CartStorage.addItem).toHaveBeenCalledWith('product-123');
    });

    it('should call onQuantityChange callback after adding item', () => {
      const onQuantityChangeMock = jest.fn();

      renderWithProviders(
        <AddToCartButton
          productId="product-123"
          onQuantityChange={onQuantityChangeMock}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(onQuantityChangeMock).toHaveBeenCalled();
    });

    it('should not add item when button is disabled', () => {
      const { CartStorage } = jest.requireMock(
        '@/presentation/shared/utils/CartStorage'
      );

      renderWithProviders(
        <AddToCartButton productId="product-123" disabled={true} />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(CartStorage.addItem).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have accessible name', () => {
      renderWithProviders(<AddToCartButton productId="product-123" />);

      const button = screen.getByRole('button');
      expect(button).toHaveAccessibleName();
    });

    it('should be focusable', () => {
      renderWithProviders(<AddToCartButton productId="product-123" />);

      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });
  });
});
