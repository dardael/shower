import { renderHook, act, waitFor } from '@testing-library/react';
import { useTheme } from '@/presentation/admin/hooks/useTheme';
import { ThemeMode } from '@/domain/settings/value-objects/ThemeMode';
import { BrowserThemePreference } from '@/domain/settings/entities/BrowserThemePreference';

// Mock dependencies
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

const mockMatchMedia = jest.fn();

// Mock window object
Object.defineProperty(window, 'localStorage', {
  writable: true,
  value: mockLocalStorage as never,
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia as never,
});

// Mock console methods
jest.spyOn(console, 'error').mockImplementation();
jest.spyOn(console, 'warn').mockImplementation();

// Track color mode state for the mock
let mockColorMode = 'light';
const mockSetColorMode = jest.fn((mode: string) => {
  mockColorMode = mode;
});

jest.mock('@/presentation/shared/components/ui/color-mode', () => ({
  useColorMode: () => ({
    colorMode: mockColorMode,
    setColorMode: mockSetColorMode,
  }),
}));

// Create stable mock logger functions to prevent infinite re-renders
const mockLoggerFunctions = {
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
};

jest.mock('@/presentation/shared/hooks/useLogger', () => ({
  useLogger: () => mockLoggerFunctions,
}));

describe('useTheme', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockColorMode = 'light';

    mockMatchMedia.mockReturnValue({
      matches: false,
      media: '(prefers-color-scheme: dark)',
    } as never);

    mockLocalStorage.getItem.mockReturnValue(null);
    mockLocalStorage.setItem.mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('initialization', () => {
    it('should initialize with system theme by default when no saved preference', async () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.systemTheme).toBe(ThemeMode.LIGHT);
      expect(result.current.isStorageAvailable).toBe(true);
    });

    it('should detect dark system theme', async () => {
      mockMatchMedia.mockReturnValue({
        matches: true,
        media: '(prefers-color-scheme: dark)',
      } as never);

      const { result } = renderHook(() => useTheme());

      act(() => {
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.systemTheme).toBe(ThemeMode.DARK);
      expect(mockMatchMedia).toHaveBeenCalledWith(
        '(prefers-color-scheme: dark)'
      );
    });

    it('should handle storage unavailability', async () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage not available');
      });

      const { result } = renderHook(() => useTheme());

      act(() => {
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isStorageAvailable).toBe(false);
      expect(mockLoggerFunctions.warn).toHaveBeenCalledWith(
        'Storage not available for theme persistence',
        expect.any(Error)
      );
    });

    it('should load saved preference', async () => {
      const savedPreference = BrowserThemePreference.createUserChoice(
        ThemeMode.DARK
      );
      mockLocalStorage.getItem.mockReturnValue(
        JSON.stringify(savedPreference.toJSON())
      );

      const { result } = renderHook(() => useTheme());

      act(() => {
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(
        'shower-admin-theme'
      );
      expect(mockSetColorMode).toHaveBeenCalledWith('dark');
      expect(result.current.currentTheme).toBe(ThemeMode.DARK);
    });

    it('should handle corrupted saved preference', async () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-json');

      const { result } = renderHook(() => useTheme());

      act(() => {
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockLoggerFunctions.error).toHaveBeenCalledWith(
        'Failed to load theme preference',
        expect.any(Error)
      );
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from light to dark', async () => {
      const { result, rerender } = renderHook(() => useTheme());

      act(() => {
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.toggleTheme();
      });

      act(() => {
        jest.runAllTimers();
      });

      expect(mockSetColorMode).toHaveBeenCalledWith('dark');
      // Re-render to pick up the new colorMode from the mock
      rerender();
      expect(result.current.currentTheme).toBe(ThemeMode.DARK);
    });

    it('should toggle from dark to light', async () => {
      const savedPreference = BrowserThemePreference.createUserChoice(
        ThemeMode.DARK
      );
      mockLocalStorage.getItem.mockReturnValue(
        JSON.stringify(savedPreference.toJSON())
      );

      const { result, rerender } = renderHook(() => useTheme());

      act(() => {
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Re-render to pick up the initialized colorMode
      rerender();
      expect(result.current.currentTheme).toBe(ThemeMode.DARK);

      await act(async () => {
        await result.current.toggleTheme();
      });

      act(() => {
        jest.runAllTimers();
      });

      expect(mockSetColorMode).toHaveBeenCalledWith('light');
      // Re-render to pick up the new colorMode from the mock
      rerender();
      expect(result.current.currentTheme).toBe(ThemeMode.LIGHT);
    });

    it('should save preference to storage after toggle', async () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      mockLocalStorage.setItem.mockClear();

      await act(async () => {
        await result.current.toggleTheme();
      });

      act(() => {
        jest.runAllTimers();
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'shower-admin-theme',
        expect.stringContaining('"themeMode":"dark"')
      );
    });
  });

  describe('setTheme', () => {
    it('should set specific theme', async () => {
      const { result, rerender } = renderHook(() => useTheme());

      act(() => {
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.setTheme(ThemeMode.DARK);
      });

      expect(mockSetColorMode).toHaveBeenCalledWith('dark');
      // Re-render to pick up the new colorMode from the mock
      rerender();
      expect(result.current.currentTheme).toBe(ThemeMode.DARK);
    });

    it('should save preference when setting theme', async () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      mockLocalStorage.setItem.mockClear();

      await act(async () => {
        await result.current.setTheme(ThemeMode.DARK);
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'shower-admin-theme',
        expect.stringContaining('"themeMode":"dark"')
      );
    });

    it('should handle storage errors gracefully', async () => {
      const { result, rerender } = renderHook(() => useTheme());

      act(() => {
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage unavailable');
      });

      await act(async () => {
        await result.current.setTheme(ThemeMode.DARK);
      });

      expect(mockLoggerFunctions.error).toHaveBeenCalledWith(
        'Failed to save theme preference',
        expect.any(Error)
      );
      // Re-render to pick up the new colorMode from the mock
      rerender();
      expect(result.current.currentTheme).toBe(ThemeMode.DARK);
    });
  });

  describe('resetToSystemTheme', () => {
    it('should reset to system theme', async () => {
      mockMatchMedia.mockReturnValue({
        matches: true,
        media: '(prefers-color-scheme: dark)',
      } as never);

      const { result, rerender } = renderHook(() => useTheme());

      act(() => {
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.resetToSystemTheme();
      });

      // resetToSystemTheme sets colorMode to the effective system theme (dark)
      expect(mockSetColorMode).toHaveBeenCalledWith('dark');
      rerender();
      expect(result.current.currentTheme).toBe(ThemeMode.DARK);
      expect(result.current.systemTheme).toBe(ThemeMode.DARK);
    });

    it('should handle storage errors gracefully', async () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage failed');
      });

      await act(async () => {
        await result.current.resetToSystemTheme();
      });

      expect(mockLoggerFunctions.error).toHaveBeenCalledWith(
        'Failed to save theme preference',
        expect.any(Error)
      );
    });
  });

  describe('theme state checks', () => {
    it('should correctly identify dark mode', async () => {
      const savedPreference = BrowserThemePreference.createUserChoice(
        ThemeMode.DARK
      );
      mockLocalStorage.getItem.mockReturnValue(
        JSON.stringify(savedPreference.toJSON())
      );

      const { result } = renderHook(() => useTheme());

      act(() => {
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isDarkMode()).toBe(true);
      expect(result.current.isLightMode()).toBe(false);
    });

    it('should correctly identify light mode', async () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isDarkMode()).toBe(false);
      expect(result.current.isLightMode()).toBe(true);
    });

    it('should correctly identify system preference after initialization', async () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // When initialized without saved preference, hook creates system preference
      // but stores effective theme (LIGHT in this case since system is LIGHT)
      expect(result.current.currentTheme).toBe(ThemeMode.LIGHT);
    });

    it('should correctly identify canToggle when storage available', async () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.canToggle()).toBe(true);
    });

    it('should identify cannot toggle when loading', () => {
      const { result } = renderHook(() => useTheme());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.canToggle()).toBe(false);
    });

    it('should identify cannot toggle when storage unavailable', async () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage not available');
      });

      const { result } = renderHook(() => useTheme());

      act(() => {
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isStorageAvailable).toBe(false);
      expect(result.current.canToggle()).toBe(false);
    });
  });

  describe('getEffectiveTheme', () => {
    it('should return user choice when not system preference', async () => {
      const savedPreference = BrowserThemePreference.createUserChoice(
        ThemeMode.DARK
      );
      mockLocalStorage.getItem.mockReturnValue(
        JSON.stringify(savedPreference.toJSON())
      );

      const { result } = renderHook(() => useTheme());

      act(() => {
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.getEffectiveTheme()).toBe(ThemeMode.DARK);
    });

    it('should return system theme when initialized with system preference', async () => {
      mockMatchMedia.mockReturnValue({
        matches: true,
        media: '(prefers-color-scheme: dark)',
      } as never);

      const { result } = renderHook(() => useTheme());

      act(() => {
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Hook applies effective theme (DARK based on system) on initialization
      expect(result.current.systemTheme).toBe(ThemeMode.DARK);
      expect(result.current.getEffectiveTheme()).toBe(ThemeMode.DARK);
    });
  });
});
