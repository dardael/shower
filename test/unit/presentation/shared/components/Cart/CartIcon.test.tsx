import { render, screen, fireEvent } from '@testing-library/react';
import { CartIcon } from '@/presentation/shared/components/Cart/CartIcon';
import { useCart } from '@/presentation/shared/contexts/CartContext';
import { useSellingConfig } from '@/presentation/shared/contexts/SellingConfigContext';

jest.mock('@/presentation/shared/contexts/CartContext');
jest.mock('@/presentation/shared/contexts/SellingConfigContext');

const mockedUseCart = useCart as jest.MockedFunction<typeof useCart>;
const mockedUseSellingConfig = useSellingConfig as jest.MockedFunction<
  typeof useSellingConfig
>;

describe('CartIcon', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseCart.mockReturnValue({
      items: [],
      itemCount: 0,
      isLoading: false,
      error: null,
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
    });
    mockedUseSellingConfig.mockReturnValue({
      sellingEnabled: true,
      isLoading: false,
      error: null,
      updateSellingEnabled: jest.fn(),
      refreshSellingEnabled: jest.fn(),
    });
  });

  describe('rendering', () => {
    it('should render cart icon when selling mode is enabled', () => {
      render(<CartIcon onClick={mockOnClick} />);

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should not render when selling mode is disabled', () => {
      mockedUseSellingConfig.mockReturnValue({
        sellingEnabled: false,
        isLoading: false,
        error: null,
        updateSellingEnabled: jest.fn(),
        refreshSellingEnabled: jest.fn(),
      });

      const { container } = render(<CartIcon onClick={mockOnClick} />);

      expect(container.firstChild).toBeNull();
    });

    it('should still render while selling config is loading if sellingEnabled is true', () => {
      mockedUseSellingConfig.mockReturnValue({
        sellingEnabled: true,
        isLoading: true,
        error: null,
        updateSellingEnabled: jest.fn(),
        refreshSellingEnabled: jest.fn(),
      });

      const { container } = render(<CartIcon onClick={mockOnClick} />);

      expect(container.firstChild).not.toBeNull();
    });
  });

  describe('badge display', () => {
    it('should not show badge when cart is empty', () => {
      mockedUseCart.mockReturnValue({
        items: [],
        itemCount: 0,
        isLoading: false,
        error: null,
        addItem: jest.fn(),
        removeItem: jest.fn(),
        updateQuantity: jest.fn(),
        clearCart: jest.fn(),
      });

      render(<CartIcon onClick={mockOnClick} />);

      expect(screen.queryByText('0')).not.toBeInTheDocument();
    });

    it('should show badge with item count when cart has items', () => {
      mockedUseCart.mockReturnValue({
        items: [
          { productId: 'product-1', quantity: 2, addedAt: new Date() },
          { productId: 'product-2', quantity: 3, addedAt: new Date() },
        ],
        itemCount: 5,
        isLoading: false,
        error: null,
        addItem: jest.fn(),
        removeItem: jest.fn(),
        updateQuantity: jest.fn(),
        clearCart: jest.fn(),
      });

      render(<CartIcon onClick={mockOnClick} />);

      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('should show 99+ when item count exceeds 99', () => {
      mockedUseCart.mockReturnValue({
        items: [],
        itemCount: 150,
        isLoading: false,
        error: null,
        addItem: jest.fn(),
        removeItem: jest.fn(),
        updateQuantity: jest.fn(),
        clearCart: jest.fn(),
      });

      render(<CartIcon onClick={mockOnClick} />);

      expect(screen.getByText('99+')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('should call onClick when clicked', () => {
      render(<CartIcon onClick={mockOnClick} />);

      fireEvent.click(screen.getByRole('button'));

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should have accessible label', () => {
      mockedUseCart.mockReturnValue({
        items: [],
        itemCount: 3,
        isLoading: false,
        error: null,
        addItem: jest.fn(),
        removeItem: jest.fn(),
        updateQuantity: jest.fn(),
        clearCart: jest.fn(),
      });

      render(<CartIcon onClick={mockOnClick} />);

      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        expect.stringContaining('Panier')
      );
    });
  });
});
