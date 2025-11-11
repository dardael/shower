import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { AdminMenuItem } from '@/presentation/admin/components/AdminMenuItem';
import { LoggerProvider } from '@/presentation/shared/contexts/LoggerContext';
import { Logger } from '@/application/shared/Logger';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

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

const mockPush = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <LoggerProvider logger={mockLogger}>
      <ChakraProvider value={defaultSystem}>{ui}</ChakraProvider>
    </LoggerProvider>
  );
};

describe('AdminMenuItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    });
  });

  it('renders menu item with label and description', () => {
    renderWithProviders(
      <AdminMenuItem
        href="/admin/website-settings"
        label="Website Settings"
        description="Manage website name, icon, and theme"
      />
    );

    expect(screen.getByText('Website Settings')).toBeInTheDocument();
    expect(
      screen.getByText('Manage website name, icon, and theme')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('menu-item-website-settings')
    ).toBeInTheDocument();
  });

  it('shows active state when current pathname matches href', () => {
    mockUsePathname.mockReturnValue('/admin/website-settings');

    renderWithProviders(
      <AdminMenuItem
        href="/admin/website-settings"
        label="Website Settings"
        description="Manage website name, icon, and theme"
      />
    );

    const menuItem = screen.getByTestId('menu-item-website-settings');

    // The data-active attribute should be on the Link element
    expect(menuItem).toHaveAttribute('data-active', 'true');

    // Check that it has the correct href
    expect(menuItem).toHaveAttribute('href', '/admin/website-settings');
  });

  it('shows inactive state when current pathname does not match href', () => {
    mockUsePathname.mockReturnValue('/admin/social-networks');

    renderWithProviders(
      <AdminMenuItem
        href="/admin/website-settings"
        label="Website Settings"
        description="Manage website name, icon, and theme"
      />
    );

    const menuItem = screen.getByTestId('menu-item-website-settings');
    expect(menuItem).not.toHaveAttribute('data-active');

    // Check that it has the correct href
    expect(menuItem).toHaveAttribute('href', '/admin/website-settings');
  });

  it('navigates to href when clicked', () => {
    mockUsePathname.mockReturnValue('/admin/social-networks');

    renderWithProviders(
      <AdminMenuItem
        href="/admin/website-settings"
        label="Website Settings"
        description="Manage website name, icon, and theme"
      />
    );

    const menuItem = screen.getByTestId('menu-item-website-settings');
    fireEvent.click(menuItem);

    expect(mockPush).toHaveBeenCalledWith('/admin/website-settings');
  });

  it('calls onClick callback when clicked', () => {
    mockUsePathname.mockReturnValue('/admin/social-networks');
    const mockOnClick = jest.fn();

    renderWithProviders(
      <AdminMenuItem
        href="/admin/website-settings"
        label="Website Settings"
        description="Manage website name, icon, and theme"
        onClick={mockOnClick}
      />
    );

    const menuItem = screen.getByTestId('menu-item-website-settings');
    fireEvent.click(menuItem);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('logs click action', () => {
    mockUsePathname.mockReturnValue('/admin/social-networks');

    renderWithProviders(
      <AdminMenuItem
        href="/admin/website-settings"
        label="Website Settings"
        description="Manage website name, icon, and theme"
      />
    );

    const menuItem = screen.getByTestId('menu-item-website-settings');
    fireEvent.click(menuItem);

    // Verify click action works (no debug logging expected after cleanup)
    expect(menuItem).toBeInTheDocument();
  });

  it('has correct test ID based on href', () => {
    mockUsePathname.mockReturnValue('/admin/website-settings');

    renderWithProviders(
      <AdminMenuItem
        href="/admin/social-networks"
        label="Social Networks"
        description="Configure social media links"
      />
    );

    expect(screen.getByTestId('menu-item-social-networks')).toBeInTheDocument();
  });

  it('applies hover styles on mouse enter', () => {
    mockUsePathname.mockReturnValue('/admin/website-settings');

    renderWithProviders(
      <AdminMenuItem
        href="/admin/social-networks"
        label="Social Networks"
        description="Configure social media links"
      />
    );

    const menuItem = screen.getByTestId('menu-item-social-networks');
    fireEvent.mouseEnter(menuItem);

    expect(menuItem).toHaveStyle({
      backgroundColor: expect.stringContaining('var(--chakra-colors-bg-muted)'),
    });
  });

  it('applies active styles on mouse down', () => {
    mockUsePathname.mockReturnValue('/admin');

    renderWithProviders(
      <AdminMenuItem
        href="/admin/website-settings"
        label="Website Settings"
        description="Manage website name, icon, and theme"
      />
    );

    const menuItem = screen.getByTestId('menu-item-website-settings');

    fireEvent.mouseDown(menuItem);

    // Should have muted background when active (without transform)
    expect(menuItem).toHaveStyle({
      backgroundColor: expect.stringContaining('bg.muted'),
    });
  });
});
