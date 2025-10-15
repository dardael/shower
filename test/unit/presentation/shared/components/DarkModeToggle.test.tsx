import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, beforeEach, afterEach, jest } from '@jest/globals';
import DarkModeToggle from '@/presentation/shared/components/DarkModeToggle';
import { useColorMode } from '@/presentation/shared/components/ui/color-mode';

// Mock the useColorMode hook
jest.mock('@/presentation/shared/components/ui/color-mode');

// Mock Chakra UI IconButton to avoid console errors in test environment
jest.mock('@chakra-ui/react', () => ({
  IconButton: ({
    children,
    onClick,
    'aria-label': ariaLabel,
    'data-testid': dataTestId,
  }: {
    children?: React.ReactNode;
    onClick?: () => void;
    'aria-label'?: string;
    'data-testid'?: string;
  }) => (
    <button onClick={onClick} aria-label={ariaLabel} data-testid={dataTestId}>
      {children}
    </button>
  ),
}));

describe('DarkModeToggle', () => {
  const mockToggleColorMode = jest.fn();
  const mockSetColorMode = jest.fn();
  const mockUseColorMode = useColorMode as jest.MockedFunction<
    typeof useColorMode
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders a toggle button', () => {
    mockUseColorMode.mockReturnValue({
      colorMode: 'light',
      toggleColorMode: mockToggleColorMode,
      setColorMode: mockSetColorMode,
    });

    render(<DarkModeToggle />);

    const button = screen.getByRole('button', { name: /toggle color mode/i });
    expect(button).toBeInTheDocument();
  });

  it('shows moon icon in light mode', () => {
    mockUseColorMode.mockReturnValue({
      colorMode: 'light',
      toggleColorMode: mockToggleColorMode,
      setColorMode: mockSetColorMode,
    });

    render(<DarkModeToggle />);

    const button = screen.getByRole('button', { name: /toggle color mode/i });
    expect(button).toHaveTextContent('🌙');
  });

  it('shows sun icon in dark mode', () => {
    mockUseColorMode.mockReturnValue({
      colorMode: 'dark',
      toggleColorMode: mockToggleColorMode,
      setColorMode: mockSetColorMode,
    });

    render(<DarkModeToggle />);

    const button = screen.getByRole('button', { name: /toggle color mode/i });
    expect(button).toHaveTextContent('☀️');
  });

  it('calls toggleColorMode when clicked', () => {
    mockUseColorMode.mockReturnValue({
      colorMode: 'light',
      toggleColorMode: mockToggleColorMode,
      setColorMode: mockSetColorMode,
    });

    render(<DarkModeToggle />);

    const button = screen.getByRole('button', { name: /toggle color mode/i });
    fireEvent.click(button);

    expect(mockToggleColorMode).toHaveBeenCalledTimes(1);
  });

  it('calls toggleColorMode when clicked in dark mode', () => {
    mockUseColorMode.mockReturnValue({
      colorMode: 'dark',
      toggleColorMode: mockToggleColorMode,
      setColorMode: mockSetColorMode,
    });

    render(<DarkModeToggle />);

    const button = screen.getByRole('button', { name: /toggle color mode/i });
    fireEvent.click(button);

    expect(mockToggleColorMode).toHaveBeenCalledTimes(1);
  });
});
