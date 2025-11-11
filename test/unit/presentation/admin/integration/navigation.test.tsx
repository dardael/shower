import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { AdminLayout } from '@/presentation/admin/components/AdminLayout';
import { LoggerProvider } from '@/presentation/shared/contexts/LoggerContext';
import { Logger } from '@/application/shared/Logger';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

// Mock logger
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

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <LoggerProvider logger={mockLogger}>
      <ChakraProvider value={defaultSystem}>{ui}</ChakraProvider>
    </LoggerProvider>
  );
};

describe('Admin Navigation Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Layout Hierarchy', () => {
    it('renders complete admin layout structure', () => {
      renderWithProviders(
        <AdminLayout>
          <div>Page Content</div>
        </AdminLayout>
      );

      // Check for main layout components
      expect(screen.getAllByText('Admin Panel')).toHaveLength(2); // One in desktop, one in mobile
      expect(screen.getByText('Page Content')).toBeInTheDocument();
      expect(screen.getByTestId('sidebar-toggle')).toBeInTheDocument();
    });

    it('maintains proper component nesting', () => {
      const { container } = renderWithProviders(
        <AdminLayout>
          <div>Page Content</div>
        </AdminLayout>
      );

      // Check that layout structure is maintained
      const layoutContainer = container.querySelector(
        '[style*="min-height: 100vh"]'
      );
      expect(layoutContainer).toBeInTheDocument();
    });
  });

  describe('Sidebar Navigation Flow', () => {
    beforeEach(() => {
      // Mock desktop breakpoint for consistent behavior
      jest
        .spyOn(jest.requireActual('@chakra-ui/react'), 'useBreakpointValue')
        .mockReturnValue(false); // isMobile = false
    });

    it('renders all navigation menu items', () => {
      renderWithProviders(
        <AdminLayout>
          <div>Page Content</div>
        </AdminLayout>
      );

      expect(
        screen.getByTestId('menu-item-website-settings')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('menu-item-social-networks')
      ).toBeInTheDocument();
    });

    it('displays correct labels and descriptions', () => {
      renderWithProviders(
        <AdminLayout>
          <div>Page Content</div>
        </AdminLayout>
      );

      expect(screen.getByText('Website Settings')).toBeInTheDocument();
      expect(
        screen.getByText('Manage website name, icon, and theme')
      ).toBeInTheDocument();
      expect(screen.getByText('Social Networks')).toBeInTheDocument();
      expect(
        screen.getByText('Configure social media links')
      ).toBeInTheDocument();
    });
  });

  describe('Mobile Navigation Flow', () => {
    beforeEach(() => {
      // Mock mobile viewport for mobile-specific tests
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500, // Mobile width
      });
    });

    it('handles mobile navigation correctly', () => {
      renderWithProviders(
        <AdminLayout>
          <div>Page Content</div>
        </AdminLayout>
      );

      // Should render mobile toggle button
      expect(screen.getByTestId('sidebar-toggle')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles navigation errors gracefully', () => {
      const mockPush = jest.fn();

      // Mock useRouter to return our mock
      const { useRouter } = jest.requireMock('next/navigation');
      useRouter.mockReturnValue({
        push: mockPush,
        replace: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
        refresh: jest.fn(),
        prefetch: jest.fn(),
      });

      renderWithProviders(
        <AdminLayout>
          <div>Page Content</div>
        </AdminLayout>
      );

      const menuItem = screen.getByTestId('menu-item-website-settings');
      fireEvent.click(menuItem);

      // Should call navigation function
      expect(mockPush).toHaveBeenCalledWith('/admin/website-settings');

      // Component should still be rendered
      expect(screen.getByText('Page Content')).toBeInTheDocument();
    });
  });
});
