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

// Mock useColorMode hook
const mockColorMode: {
  colorMode: 'light' | 'dark';
  setColorMode: jest.Mock;
  toggleColorMode: jest.Mock;
} = {
  colorMode: 'light',
  setColorMode: jest.fn(),
  toggleColorMode: jest.fn(),
};
jest.mock('@/presentation/shared/components/ui/color-mode', () => ({
  useColorMode: () => mockColorMode,
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

describe('BackgroundColorSelector', () => {
  const defaultProps = {
    selectedColor: 'blue' as const,
    onColorChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockColorMode.colorMode = 'light';
  });

  describe('Background Color Preview', () => {
    it('should display preview with correct light mode color for blue', () => {
      mockColorMode.colorMode = 'light';
      render(
        <BackgroundColorSelector {...defaultProps} selectedColor="blue" />
      );

      const preview = screen.getByTestId('background-color-preview');
      expect(preview).toBeInTheDocument();
      expect(preview).toHaveStyle({
        backgroundColor: BACKGROUND_COLOR_MAP.blue.light,
      });
    });

    it('should display preview with correct dark mode color for blue', () => {
      mockColorMode.colorMode = 'dark';
      render(
        <BackgroundColorSelector {...defaultProps} selectedColor="blue" />
      );

      const preview = screen.getByTestId('background-color-preview');
      expect(preview).toBeInTheDocument();
      expect(preview).toHaveStyle({
        backgroundColor: BACKGROUND_COLOR_MAP.blue.dark,
      });
    });

    it('should display preview with correct light mode color for red', () => {
      mockColorMode.colorMode = 'light';
      render(<BackgroundColorSelector {...defaultProps} selectedColor="red" />);

      const preview = screen.getByTestId('background-color-preview');
      expect(preview).toHaveStyle({
        backgroundColor: BACKGROUND_COLOR_MAP.red.light,
      });
    });

    it('should display preview with correct dark mode color for red', () => {
      mockColorMode.colorMode = 'dark';
      render(<BackgroundColorSelector {...defaultProps} selectedColor="red" />);

      const preview = screen.getByTestId('background-color-preview');
      expect(preview).toHaveStyle({
        backgroundColor: BACKGROUND_COLOR_MAP.red.dark,
      });
    });

    it('should display preview with correct light mode color for green', () => {
      mockColorMode.colorMode = 'light';
      render(
        <BackgroundColorSelector {...defaultProps} selectedColor="green" />
      );

      const preview = screen.getByTestId('background-color-preview');
      expect(preview).toHaveStyle({
        backgroundColor: BACKGROUND_COLOR_MAP.green.light,
      });
    });

    it('should display preview with correct dark mode color for green', () => {
      mockColorMode.colorMode = 'dark';
      render(
        <BackgroundColorSelector {...defaultProps} selectedColor="green" />
      );

      const preview = screen.getByTestId('background-color-preview');
      expect(preview).toHaveStyle({
        backgroundColor: BACKGROUND_COLOR_MAP.green.dark,
      });
    });

    it('should display preview with correct light mode color for purple', () => {
      mockColorMode.colorMode = 'light';
      render(
        <BackgroundColorSelector {...defaultProps} selectedColor="purple" />
      );

      const preview = screen.getByTestId('background-color-preview');
      expect(preview).toHaveStyle({
        backgroundColor: BACKGROUND_COLOR_MAP.purple.light,
      });
    });

    it('should display preview with correct dark mode color for purple', () => {
      mockColorMode.colorMode = 'dark';
      render(
        <BackgroundColorSelector {...defaultProps} selectedColor="purple" />
      );

      const preview = screen.getByTestId('background-color-preview');
      expect(preview).toHaveStyle({
        backgroundColor: BACKGROUND_COLOR_MAP.purple.dark,
      });
    });
  });

  describe('Preview Label', () => {
    it('should display preview label text', () => {
      render(<BackgroundColorSelector {...defaultProps} />);

      const label = screen.getByText('Aperçu');
      expect(label).toBeInTheDocument();
    });
  });
});
