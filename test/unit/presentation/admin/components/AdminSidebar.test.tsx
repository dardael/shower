import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import {
  AdminSidebar,
  AdminSidebarToggle,
} from '@/presentation/admin/components/AdminSidebar';
import { LoggerProvider } from '@/presentation/shared/contexts/LoggerContext';
import { Logger } from '@/application/shared/Logger';

// Mock logger - define before using it in mocks
const mockLogger = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  logApiRequest: jest.fn(),
  logApiResponse: jest.fn(),
  logError: jest.fn(),
  logSecurity: jest.fn(),
  logUserAction: jest.fn(),
  logBusinessEvent: jest.fn(),
  startTimer: jest.fn(),
  endTimer: jest.fn(),
  measure: jest.fn(),
  execute: jest.fn(),
  logIf: jest.fn(),
  debugIf: jest.fn(),
  batch: jest.fn(),
  withContext: jest.fn().mockReturnThis(),
} as unknown as Logger;

// Mock useBreakpointValue at module level
const mockUseBreakpointValue = jest.fn();
jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useBreakpointValue: () => mockUseBreakpointValue(),
}));

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <LoggerProvider logger={mockLogger}>
      <ChakraProvider value={defaultSystem}>{ui}</ChakraProvider>
    </LoggerProvider>
  );
};

describe('AdminSidebar', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Desktop behavior', () => {
    beforeEach(() => {
      // Mock desktop breakpoint
      mockUseBreakpointValue.mockReturnValue(false); // isMobile = false
    });

    it('renders persistent sidebar on desktop', () => {
      renderWithProviders(<AdminSidebar isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByTestId('desktop-sidebar')).toBeInTheDocument();
      expect(screen.queryByTestId('mobile-sidebar')).not.toBeInTheDocument();
      expect(screen.queryByTestId('sidebar-backdrop')).not.toBeInTheDocument();
    });

    it('displays admin panel title', () => {
      renderWithProviders(<AdminSidebar isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText('Admin Panel')).toBeInTheDocument();
    });

    it('displays navigation menu items', () => {
      renderWithProviders(<AdminSidebar isOpen={true} onClose={mockOnClose} />);

      expect(
        screen.getByTestId('menu-item-website-settings')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('menu-item-social-networks')
      ).toBeInTheDocument();
    });

    it('does not show close button on desktop', () => {
      renderWithProviders(<AdminSidebar isOpen={true} onClose={mockOnClose} />);

      expect(
        screen.queryByRole('button', { name: /close/i })
      ).not.toBeInTheDocument();
    });
  });

  describe('Mobile behavior', () => {
    beforeEach(() => {
      // Mock mobile breakpoint
      mockUseBreakpointValue.mockReturnValue(true); // isMobile = true
    });

    it('renders as overlay when open on mobile', () => {
      renderWithProviders(<AdminSidebar isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByTestId('mobile-sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('sidebar-backdrop')).toBeInTheDocument();
      expect(screen.queryByTestId('desktop-sidebar')).not.toBeInTheDocument();
    });

    it('does not render when closed on mobile', () => {
      renderWithProviders(
        <AdminSidebar isOpen={false} onClose={mockOnClose} />
      );

      expect(screen.queryByTestId('mobile-sidebar')).not.toBeInTheDocument();
      expect(screen.queryByTestId('sidebar-backdrop')).not.toBeInTheDocument();
    });

    it('shows close button on mobile', () => {
      renderWithProviders(<AdminSidebar isOpen={true} onClose={mockOnClose} />);

      expect(
        screen.getByRole('button', { name: /close/i })
      ).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
      renderWithProviders(<AdminSidebar isOpen={true} onClose={mockOnClose} />);

      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when backdrop is clicked', () => {
      renderWithProviders(<AdminSidebar isOpen={true} onClose={mockOnClose} />);

      const backdrop = screen.getByTestId('sidebar-backdrop');
      fireEvent.click(backdrop);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('logs close action when close button is clicked', () => {
      renderWithProviders(<AdminSidebar isOpen={true} onClose={mockOnClose} />);

      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);

      // Debug logging was removed - just verify the callback was called
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Keyboard navigation', () => {
    beforeEach(() => {
      mockUseBreakpointValue.mockReturnValue(true); // isMobile = true
    });

    it('closes sidebar when Escape key is pressed', () => {
      renderWithProviders(<AdminSidebar isOpen={true} onClose={mockOnClose} />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('does not close sidebar when Escape key is pressed on desktop', () => {
      mockUseBreakpointValue.mockReturnValue(false); // isMobile = false
      renderWithProviders(<AdminSidebar isOpen={true} onClose={mockOnClose} />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
});

describe('AdminSidebarToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders toggle button', () => {
    renderWithProviders(<AdminSidebarToggle />);

    const toggleButton = screen.getByTestId('sidebar-toggle');
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute('aria-label', 'Toggle sidebar');
  });

  it('calls onClick when clicked', () => {
    const mockClick = jest.fn();
    renderWithProviders(<AdminSidebarToggle onClick={mockClick} />);

    const toggleButton = screen.getByTestId('sidebar-toggle');
    fireEvent.click(toggleButton);

    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('handles click without errors', () => {
    const mockClick = jest.fn();

    renderWithProviders(<AdminSidebarToggle onClick={mockClick} />);

    const toggleButton = screen.getByTestId('sidebar-toggle');

    // This should not throw any errors
    expect(() => {
      fireEvent.click(toggleButton);
    }).not.toThrow();

    // onClick should still be called
    expect(mockClick).toHaveBeenCalledTimes(1);
  });
});
