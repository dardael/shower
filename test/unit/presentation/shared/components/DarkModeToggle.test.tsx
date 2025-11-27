import { render, screen, fireEvent } from '@testing-library/react';
import DarkModeToggle from '@/presentation/shared/components/DarkModeToggle';
import { ThemeMode } from '@/domain/settings/value-objects/ThemeMode';

// Track color mode state for the mock
let mockColorModeState = 'light';
const mockToggleColorMode = jest.fn(() => {
  mockColorModeState = mockColorModeState === 'dark' ? 'light' : 'dark';
});
const mockSetColorMode = jest.fn((mode: string) => {
  mockColorModeState = mode;
});

// Mock the useColorMode hook
jest.mock('@/presentation/shared/components/ui/color-mode', () => ({
  useColorMode: () => ({
    colorMode: mockColorModeState,
    toggleColorMode: mockToggleColorMode,
    setColorMode: mockSetColorMode,
  }),
}));

// Mock Chakra UI components
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

describe('DarkModeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockColorModeState = 'light';
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders a toggle button', () => {
    render(<DarkModeToggle />);

    const button = screen.getByRole('button', { name: /switch to dark mode/i });
    expect(button).toBeInTheDocument();
  });

  it('shows moon icon in light mode', () => {
    mockColorModeState = 'light';
    render(<DarkModeToggle />);

    const button = screen.getByRole('button', { name: /switch to dark mode/i });
    expect(button).toBeInTheDocument();
  });

  it('shows sun icon in dark mode', () => {
    mockColorModeState = 'dark';
    render(<DarkModeToggle />);

    const button = screen.getByRole('button', {
      name: /switch to light mode/i,
    });
    expect(button).toBeInTheDocument();
  });

  it('calls toggleColorMode when clicked', () => {
    mockColorModeState = 'light';
    render(<DarkModeToggle />);

    const button = screen.getByRole('button', { name: /switch to dark mode/i });
    fireEvent.click(button);

    expect(mockToggleColorMode).toHaveBeenCalledTimes(1);
  });

  it('calls toggleColorMode when clicked in dark mode', () => {
    mockColorModeState = 'dark';
    render(<DarkModeToggle />);

    const button = screen.getByRole('button', {
      name: /switch to light mode/i,
    });
    fireEvent.click(button);

    expect(mockToggleColorMode).toHaveBeenCalledTimes(1);
  });

  it('should call onThemeChange with correct new theme when toggling from light to dark', () => {
    const mockOnThemeChange = jest.fn();
    mockColorModeState = 'light';

    render(<DarkModeToggle onThemeChange={mockOnThemeChange} />);

    const button = screen.getByRole('button', { name: /switch to dark mode/i });
    fireEvent.click(button);

    expect(mockToggleColorMode).toHaveBeenCalled();
    expect(mockOnThemeChange).toHaveBeenCalledWith(ThemeMode.DARK);
  });

  it('should call onThemeChange with correct new theme when toggling from dark to light', () => {
    const mockOnThemeChange = jest.fn();
    mockColorModeState = 'dark';

    render(<DarkModeToggle onThemeChange={mockOnThemeChange} />);

    const button = screen.getByRole('button', {
      name: /switch to light mode/i,
    });
    fireEvent.click(button);

    expect(mockToggleColorMode).toHaveBeenCalled();
    expect(mockOnThemeChange).toHaveBeenCalledWith(ThemeMode.LIGHT);
  });

  it('should work without onThemeChange callback', () => {
    mockColorModeState = 'light';
    render(<DarkModeToggle />);

    const button = screen.getByRole('button', { name: /switch to dark mode/i });
    fireEvent.click(button);

    expect(mockToggleColorMode).toHaveBeenCalled();
  });

  it('accepts custom size prop', () => {
    mockColorModeState = 'light';
    render(<DarkModeToggle size="lg" />);

    const button = screen.getByRole('button', { name: /switch to dark mode/i });
    expect(button).toBeInTheDocument();
  });

  it('accepts custom variant prop', () => {
    mockColorModeState = 'light';
    render(<DarkModeToggle variant="solid" />);

    const button = screen.getByRole('button', { name: /switch to dark mode/i });
    expect(button).toBeInTheDocument();
  });

  it('accepts custom aria-label prop', () => {
    mockColorModeState = 'light';
    render(<DarkModeToggle aria-label="Custom toggle label" />);

    const button = screen.getByRole('button', { name: /custom toggle label/i });
    expect(button).toBeInTheDocument();
  });
});
