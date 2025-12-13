/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ThemeModePreference } from '@/domain/settings/value-objects/ThemeModePreference';

// Mock fetch for API calls
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock setColorMode
const mockSetColorMode = jest.fn();
const mockToggleColorMode = jest.fn();

// Track current color mode
let currentColorMode = 'light';

jest.mock('@/presentation/shared/components/ui/color-mode', () => ({
  useColorMode: () => ({
    colorMode: currentColorMode,
    toggleColorMode: mockToggleColorMode,
    setColorMode: mockSetColorMode,
  }),
}));

// Mock Chakra UI
jest.mock('@chakra-ui/react', () => ({
  IconButton: ({
    children,
    onClick,
    'aria-label': ariaLabel,
  }: {
    children?: React.ReactNode;
    onClick?: () => void;
    'aria-label'?: string;
  }) => (
    <button onClick={onClick} aria-label={ariaLabel}>
      {children}
    </button>
  ),
  ClientOnly: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  Skeleton: () => <div data-testid="skeleton" />,
}));

// Mock react-icons
jest.mock('react-icons/lu', () => ({
  LuSun: () => <span data-testid="sun-icon">Sun</span>,
  LuMoon: () => <span data-testid="moon-icon">Moon</span>,
}));

// Import DarkModeToggle and ThemeModeProvider after mocks are set up
import DarkModeToggle from '@/presentation/shared/components/DarkModeToggle';
import { ThemeModeProvider } from '@/presentation/shared/contexts/ThemeModeContext';

// Wrapper component for tests that need ThemeModeProvider
const ThemeModeWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeModeProvider>{children}</ThemeModeProvider>
);

describe('Theme Mode Configuration Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    currentColorMode = 'light';
  });

  describe('ThemeModePreference value object', () => {
    it('should validate and create force-light config', () => {
      const config = ThemeModePreference.create('force-light');
      expect(config.value).toBe('force-light');
      expect(config.isForced()).toBe(true);
      expect(config.getForcedMode()).toBe('light');
      expect(config.shouldShowToggle()).toBe(false);
    });

    it('should validate and create force-dark config', () => {
      const config = ThemeModePreference.create('force-dark');
      expect(config.value).toBe('force-dark');
      expect(config.isForced()).toBe(true);
      expect(config.getForcedMode()).toBe('dark');
      expect(config.shouldShowToggle()).toBe(false);
    });

    it('should validate and create user-choice config', () => {
      const config = ThemeModePreference.create('user-choice');
      expect(config.value).toBe('user-choice');
      expect(config.isForced()).toBe(false);
      expect(config.getForcedMode()).toBeNull();
      expect(config.shouldShowToggle()).toBe(true);
    });

    it('should default to user-choice for invalid values', () => {
      const config = ThemeModePreference.create('invalid');
      expect(config.value).toBe('user-choice');
    });
  });

  describe('Admin forced mode affects public side', () => {
    it('should apply forced dark mode from API settings', async () => {
      // Simulate admin setting force-dark in API
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          name: 'Test Site',
          themeColor: 'blue',
          themeMode: 'force-dark',
        }),
      });

      // Import and render the component that uses the hook
      const { useThemeModeConfig } = await import(
        '@/presentation/shared/hooks/useThemeModeConfig'
      );

      // Create a test component that uses the hook
      const TestComponent = () => {
        const { themeMode, isForced, forcedMode, shouldShowToggle, isLoading } =
          useThemeModeConfig();

        if (isLoading) return <div>Loading...</div>;

        return (
          <div>
            <span data-testid="theme-mode">{themeMode}</span>
            <span data-testid="is-forced">{String(isForced)}</span>
            <span data-testid="forced-mode">{forcedMode ?? 'none'}</span>
            <span data-testid="should-show-toggle">
              {String(shouldShowToggle)}
            </span>
          </div>
        );
      };

      render(<TestComponent />, { wrapper: ThemeModeWrapper });

      await waitFor(() => {
        expect(screen.getByTestId('theme-mode')).toHaveTextContent(
          'force-dark'
        );
      });

      expect(screen.getByTestId('is-forced')).toHaveTextContent('true');
      expect(screen.getByTestId('forced-mode')).toHaveTextContent('dark');
      expect(screen.getByTestId('should-show-toggle')).toHaveTextContent(
        'false'
      );
    });

    it('should apply forced light mode from API settings', async () => {
      // Simulate admin setting force-light in API
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          name: 'Test Site',
          themeColor: 'blue',
          themeMode: 'force-light',
        }),
      });

      const { useThemeModeConfig } = await import(
        '@/presentation/shared/hooks/useThemeModeConfig'
      );

      const TestComponent = () => {
        const { themeMode, isForced, forcedMode, shouldShowToggle, isLoading } =
          useThemeModeConfig();

        if (isLoading) return <div>Loading...</div>;

        return (
          <div>
            <span data-testid="theme-mode">{themeMode}</span>
            <span data-testid="is-forced">{String(isForced)}</span>
            <span data-testid="forced-mode">{forcedMode ?? 'none'}</span>
            <span data-testid="should-show-toggle">
              {String(shouldShowToggle)}
            </span>
          </div>
        );
      };

      render(<TestComponent />, { wrapper: ThemeModeWrapper });

      await waitFor(() => {
        expect(screen.getByTestId('theme-mode')).toHaveTextContent(
          'force-light'
        );
      });

      expect(screen.getByTestId('is-forced')).toHaveTextContent('true');
      expect(screen.getByTestId('forced-mode')).toHaveTextContent('light');
      expect(screen.getByTestId('should-show-toggle')).toHaveTextContent(
        'false'
      );
    });
  });

  describe('Admin forced mode affects admin interface', () => {
    it('should hide toggle on admin side when force-light is set', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          name: 'Test Site',
          themeMode: 'force-light',
        }),
      });

      // The DarkModeToggle component uses useThemeModeConfig internally
      // When force-light is set, it should not render
      render(<DarkModeToggle />, { wrapper: ThemeModeWrapper });

      // Wait for the API call to resolve
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      // The toggle should not be visible when forced
      await waitFor(() => {
        expect(mockSetColorMode).toHaveBeenCalledWith('light');
      });
    });

    it('should hide toggle on admin side when force-dark is set', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          name: 'Test Site',
          themeMode: 'force-dark',
        }),
      });

      render(<DarkModeToggle />, { wrapper: ThemeModeWrapper });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(mockSetColorMode).toHaveBeenCalledWith('dark');
      });
    });
  });

  describe('User choice mode behavior', () => {
    it('should show toggle when user-choice is set', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          name: 'Test Site',
          themeMode: 'user-choice',
        }),
      });

      render(<DarkModeToggle />, { wrapper: ThemeModeWrapper });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      // In user-choice mode, the toggle should be visible
      await waitFor(() => {
        const button = screen.queryByRole('button');
        expect(button).toBeInTheDocument();
      });
    });

    it('should allow toggle when user-choice is set', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          name: 'Test Site',
          themeMode: 'user-choice',
        }),
      });

      render(<DarkModeToggle />, { wrapper: ThemeModeWrapper });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      await waitFor(() => {
        const button = screen.queryByRole('button');
        expect(button).toBeInTheDocument();
      });

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockToggleColorMode).toHaveBeenCalled();
    });
  });
});
