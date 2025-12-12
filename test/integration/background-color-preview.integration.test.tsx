import { render, screen } from '@testing-library/react';
import { BackgroundColorSelector } from '@/presentation/admin/components/BackgroundColorSelector';

// Define the color map directly for testing (matches provider.tsx)
const BACKGROUND_COLOR_MAP = {
  blue: { light: '#eff6ff', dark: '#1e3a5f' },
  red: { light: '#fef2f2', dark: '#450a0a' },
  green: { light: '#f0fdf4', dark: '#14532d' },
  purple: { light: '#faf5ff', dark: '#3b0764' },
  orange: { light: '#fff7ed', dark: '#431407' },
  teal: { light: '#f0fdfa', dark: '#134e4a' },
  pink: { light: '#fdf2f8', dark: '#500724' },
  cyan: { light: '#ecfeff', dark: '#164e63' },
};

// Mutable mock for color mode to test switching
let currentColorMode: 'light' | 'dark' = 'light';

jest.mock('@/presentation/shared/components/ui/color-mode', () => ({
  useColorMode: () => ({
    colorMode: currentColorMode,
    setColorMode: jest.fn(),
    toggleColorMode: jest.fn(),
  }),
}));

// Mock the provider to export BACKGROUND_COLOR_MAP
jest.mock('@/presentation/shared/components/ui/provider', () => ({
  BACKGROUND_COLOR_MAP: {
    blue: { light: '#eff6ff', dark: '#1e3a5f' },
    red: { light: '#fef2f2', dark: '#450a0a' },
    green: { light: '#f0fdf4', dark: '#14532d' },
    purple: { light: '#faf5ff', dark: '#3b0764' },
    orange: { light: '#fff7ed', dark: '#431407' },
    teal: { light: '#f0fdfa', dark: '#134e4a' },
    pink: { light: '#fdf2f8', dark: '#500724' },
    cyan: { light: '#ecfeff', dark: '#164e63' },
  },
}));

// Mock console methods to prevent test output pollution
const mockConsoleError = jest.fn();
const mockConsoleWarn = jest.fn();

const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = mockConsoleError;
  console.warn = mockConsoleWarn;
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

describe('Background Color Preview Integration Tests', () => {
  const defaultProps = {
    selectedColor: 'blue' as const,
    onColorChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    currentColorMode = 'light';
  });

  describe('Color Mode Switching', () => {
    it('should display correct preview color in light mode', () => {
      currentColorMode = 'light';
      render(
        <BackgroundColorSelector {...defaultProps} selectedColor="blue" />
      );

      const preview = screen.getByTestId('background-color-preview');
      expect(preview).toHaveStyle({
        backgroundColor: BACKGROUND_COLOR_MAP.blue.light,
      });
    });

    it('should display correct preview color in dark mode', () => {
      currentColorMode = 'dark';
      render(
        <BackgroundColorSelector {...defaultProps} selectedColor="blue" />
      );

      const preview = screen.getByTestId('background-color-preview');
      expect(preview).toHaveStyle({
        backgroundColor: BACKGROUND_COLOR_MAP.blue.dark,
      });
    });

    it('should display teal preview in light mode', () => {
      currentColorMode = 'light';
      render(
        <BackgroundColorSelector {...defaultProps} selectedColor="teal" />
      );

      const preview = screen.getByTestId('background-color-preview');
      expect(preview).toHaveStyle({
        backgroundColor: BACKGROUND_COLOR_MAP.teal.light,
      });
    });

    it('should display teal preview in dark mode', () => {
      currentColorMode = 'dark';
      render(
        <BackgroundColorSelector {...defaultProps} selectedColor="teal" />
      );

      const preview = screen.getByTestId('background-color-preview');
      expect(preview).toHaveStyle({
        backgroundColor: BACKGROUND_COLOR_MAP.teal.dark,
      });
    });

    it('should show correct preview for each color in light mode', () => {
      currentColorMode = 'light';
      const colors = [
        'blue',
        'red',
        'green',
        'purple',
        'orange',
        'teal',
        'pink',
        'cyan',
      ] as const;

      for (const color of colors) {
        const { unmount } = render(
          <BackgroundColorSelector {...defaultProps} selectedColor={color} />
        );
        const preview = screen.getByTestId('background-color-preview');
        expect(preview).toHaveStyle({
          backgroundColor: BACKGROUND_COLOR_MAP[color].light,
        });
        unmount();
      }
    });

    it('should show correct preview for each color in dark mode', () => {
      currentColorMode = 'dark';
      const colors = [
        'blue',
        'red',
        'green',
        'purple',
        'orange',
        'teal',
        'pink',
        'cyan',
      ] as const;

      for (const color of colors) {
        const { unmount } = render(
          <BackgroundColorSelector {...defaultProps} selectedColor={color} />
        );
        const preview = screen.getByTestId('background-color-preview');
        expect(preview).toHaveStyle({
          backgroundColor: BACKGROUND_COLOR_MAP[color].dark,
        });
        unmount();
      }
    });
  });

  describe('Preview Accuracy', () => {
    it('should use exact hex values from BACKGROUND_COLOR_MAP', () => {
      currentColorMode = 'light';
      render(
        <BackgroundColorSelector {...defaultProps} selectedColor="orange" />
      );

      const preview = screen.getByTestId('background-color-preview');
      // Verify we're using the exact same values as the public site
      expect(preview).toHaveStyle({ backgroundColor: '#fff7ed' });
    });

    it('should use exact dark mode hex values from BACKGROUND_COLOR_MAP', () => {
      currentColorMode = 'dark';
      render(
        <BackgroundColorSelector {...defaultProps} selectedColor="pink" />
      );

      const preview = screen.getByTestId('background-color-preview');
      // Verify we're using the exact same values as the public site
      expect(preview).toHaveStyle({ backgroundColor: '#500724' });
    });
  });
});
