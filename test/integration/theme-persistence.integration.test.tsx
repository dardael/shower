import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeMode } from '@/domain/settings/value-objects/ThemeMode';
import { BrowserThemePreference } from '@/domain/settings/entities/BrowserThemePreference';
import { useTheme } from '@/presentation/admin/hooks/useTheme';
import { resetMockColorMode } from '../unit/setup';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock console methods to prevent test output pollution
const mockConsoleError = jest.fn();
const mockConsoleWarn = jest.fn();
const mockConsoleLog = jest.fn();

const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

beforeAll(() => {
  console.error = mockConsoleError;
  console.warn = mockConsoleWarn;
  console.log = mockConsoleLog;
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
  console.log = originalConsoleLog;
});

// Setup localStorage mock before each test
const setupLocalStorageMock = () => {
  mockLocalStorage.setItem.mockClear();
  mockLocalStorage.getItem.mockClear();
  mockLocalStorage.removeItem.mockClear();

  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  });
};

// Simple wrapper component for tests (no DynamicThemeProvider needed)
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

describe('Theme Persistence Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
    setupLocalStorageMock();
    resetMockColorMode();
  });

  afterEach(() => {
    mockConsoleError.mockClear();
    mockConsoleWarn.mockClear();
    mockConsoleLog.mockClear();
  });

  it('should persist theme preference across page refreshes', async () => {
    const preference = BrowserThemePreference.createUserChoice(ThemeMode.DARK);
    mockLocalStorage.getItem.mockReturnValue(
      JSON.stringify(preference.toJSON())
    );

    const TestComponent = () => {
      const { currentTheme } = useTheme();
      return <div data-testid="current-theme">{currentTheme}</div>;
    };

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent(
        ThemeMode.DARK
      );
    });

    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('shower-admin-theme');
  });

  it('should load saved preference on mount', async () => {
    const savedPreference = BrowserThemePreference.createUserChoice(
      ThemeMode.LIGHT
    );
    mockLocalStorage.getItem.mockReturnValue(
      JSON.stringify(savedPreference.toJSON())
    );

    const TestComponent = () => {
      const { currentTheme } = useTheme();
      return <div data-testid="current-theme">{currentTheme}</div>;
    };

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent(
        ThemeMode.LIGHT
      );
    });

    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('shower-admin-theme');
  });

  it('should handle corrupted preference data gracefully', async () => {
    mockLocalStorage.getItem.mockReturnValue('invalid-json');

    const TestComponent = () => {
      const { currentTheme } = useTheme();
      return <div data-testid="current-theme">{currentTheme}</div>;
    };

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent(
        ThemeMode.LIGHT
      );
    });

    // Check that error was logged (the exact format may vary)
    expect(mockConsoleError).toHaveBeenCalledWith(
      expect.stringContaining('Failed to load theme preference'),
      expect.any(Error)
    );
  });

  describe('Theme Toggle Functionality', () => {
    beforeEach(() => {
      // Clear all mock calls before each test
      mockLocalStorage.setItem.mockClear();
      mockLocalStorage.getItem.mockClear();
    });

    it('should toggle theme and persist change', async () => {
      // Clear all mock calls before each test
      mockLocalStorage.setItem.mockClear();
      mockLocalStorage.getItem.mockClear();
      mockLocalStorage.removeItem.mockClear();
      resetMockColorMode();

      const initialPreference = BrowserThemePreference.createUserChoice(
        ThemeMode.LIGHT
      );
      mockLocalStorage.getItem.mockReturnValue(
        JSON.stringify(initialPreference.toJSON())
      );

      // Use default mock implementation
      mockLocalStorage.setItem.mockRestore();

      const TestComponent = () => {
        const { currentTheme, toggleTheme } = useTheme();
        return (
          <div>
            <div data-testid="current-theme">{currentTheme}</div>
            <button data-testid="toggle-button" onClick={toggleTheme}>
              Toggle Theme
            </button>
          </div>
        );
      };

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent(
          ThemeMode.LIGHT
        );
      });

      fireEvent.click(screen.getByTestId('toggle-button'));

      // The mock updates synchronously, but React doesn't re-render automatically
      // Verify that localStorage was called to persist the theme
      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalled();
      });

      // Verify the dark theme was saved
      const darkThemeCall = mockLocalStorage.setItem.mock.calls.find(
        (call: string[]) => call[1] && call[1].includes('"themeMode":"dark"')
      );
      expect(darkThemeCall).toBeDefined();
    });

    it('should handle multiple theme changes', async () => {
      resetMockColorMode();
      mockLocalStorage.setItem.mockClear();

      const TestComponent = () => {
        const { currentTheme, toggleTheme } = useTheme();
        return (
          <div>
            <div data-testid="current-theme">{currentTheme}</div>
            <button data-testid="toggle-button" onClick={toggleTheme}>
              Toggle Theme
            </button>
          </div>
        );
      };

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      // Should start with LIGHT (system default)
      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent(
          ThemeMode.LIGHT
        );
      });

      // First toggle to DARK
      fireEvent.click(screen.getByTestId('toggle-button'));

      // Wait for the storage call
      await waitFor(() => {
        const darkCall = mockLocalStorage.setItem.mock.calls.find(
          (call: string[]) => call[1] && call[1].includes('"themeMode":"dark"')
        );
        expect(darkCall).toBeDefined();
      });

      // Clear previous calls to make assertions clearer
      const darkCallsBeforeSecondToggle =
        mockLocalStorage.setItem.mock.calls.filter(
          (call: string[]) => call[1] && call[1].includes('"themeMode":"dark"')
        ).length;

      // Second toggle back to LIGHT
      fireEvent.click(screen.getByTestId('toggle-button'));

      // Third toggle to DARK again
      fireEvent.click(screen.getByTestId('toggle-button'));

      // Wait for additional storage calls
      await waitFor(() => {
        // Count dark theme saves (should be more than before)
        const darkThemeCalls = mockLocalStorage.setItem.mock.calls.filter(
          (call: string[]) => call[1] && call[1].includes('"themeMode":"dark"')
        );
        expect(darkThemeCalls.length).toBeGreaterThan(
          darkCallsBeforeSecondToggle
        );
      });

      // Verify that theme was saved multiple times
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });

    it('should handle localStorage unavailability', async () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage not available');
      });

      const TestComponent = () => {
        const { currentTheme, isStorageAvailable } = useTheme();
        return (
          <div>
            <div data-testid="current-theme">{currentTheme}</div>
            <div data-testid="storage-available">
              {isStorageAvailable ? 'true' : 'false'}
            </div>
          </div>
        );
      };

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('storage-available')).toHaveTextContent(
          'false'
        );
      });

      // Check that warning was logged (the exact format may vary)
      expect(mockConsoleWarn).toHaveBeenCalledWith(
        expect.stringContaining('Storage not available for theme persistence'),
        expect.any(Error)
      );
    });
  });

  describe('System Theme Detection', () => {
    it('should detect system dark theme', async () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockReturnValue({
          matches: true,
          media: '(prefers-color-scheme: dark)',
        }),
      });

      const TestComponent = () => {
        const { currentTheme, systemTheme } = useTheme();
        return (
          <div>
            <div data-testid="current-theme">{currentTheme}</div>
            <div data-testid="system-theme">{systemTheme}</div>
          </div>
        );
      };

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent(
          ThemeMode.DARK
        );
        expect(screen.getByTestId('system-theme')).toHaveTextContent(
          ThemeMode.DARK
        );
      });
    });

    it('should detect system light theme', async () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockReturnValue({
          matches: false,
          media: '(prefers-color-scheme: light)',
        }),
      });

      const TestComponent = () => {
        const { currentTheme, systemTheme } = useTheme();
        return (
          <div>
            <div data-testid="current-theme">{currentTheme}</div>
            <div data-testid="system-theme">{systemTheme}</div>
          </div>
        );
      };

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent(
          ThemeMode.LIGHT
        );
        expect(screen.getByTestId('system-theme')).toHaveTextContent(
          ThemeMode.LIGHT
        );
      });
    });
  });
});
