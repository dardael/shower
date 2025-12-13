import { render, screen, fireEvent } from '@testing-library/react';
import DarkModeToggle from '@/presentation/shared/components/DarkModeToggle';

// Track color mode state for the mock
let mockColorModeState = 'light';
const mockToggleColorMode = jest.fn(() => {
  mockColorModeState = mockColorModeState === 'dark' ? 'light' : 'dark';
});
const mockSetColorMode = jest.fn((mode: string) => {
  mockColorModeState = mode;
});

// Mock theme mode config state
let mockThemeModeConfig: {
  themeMode: 'force-light' | 'force-dark' | 'user-choice';
  isForced: boolean;
  forcedMode: 'light' | 'dark' | null;
  shouldShowToggle: boolean;
  isLoading: boolean;
  error: Error | null;
} = {
  themeMode: 'user-choice',
  isForced: false,
  forcedMode: null,
  shouldShowToggle: true,
  isLoading: false,
  error: null,
};

// Mock the useThemeModeConfig hook
jest.mock('@/presentation/shared/hooks/useThemeModeConfig', () => ({
  useThemeModeConfig: () => mockThemeModeConfig,
}));

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
    // Reset theme mode config to default user-choice
    mockThemeModeConfig = {
      themeMode: 'user-choice',
      isForced: false,
      forcedMode: null,
      shouldShowToggle: true,
      isLoading: false,
      error: null,
    };
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

  describe('forced theme mode', () => {
    it('should hide toggle when force-light is configured', () => {
      mockThemeModeConfig = {
        themeMode: 'force-light',
        isForced: true,
        forcedMode: 'light',
        shouldShowToggle: false,
        isLoading: false,
        error: null,
      };

      render(<DarkModeToggle />);

      const button = screen.queryByRole('button');
      expect(button).not.toBeInTheDocument();
    });

    it('should hide toggle when force-dark is configured', () => {
      mockThemeModeConfig = {
        themeMode: 'force-dark',
        isForced: true,
        forcedMode: 'dark',
        shouldShowToggle: false,
        isLoading: false,
        error: null,
      };

      render(<DarkModeToggle />);

      const button = screen.queryByRole('button');
      expect(button).not.toBeInTheDocument();
    });

    it('should show toggle when user-choice is configured', () => {
      mockThemeModeConfig = {
        themeMode: 'user-choice',
        isForced: false,
        forcedMode: null,
        shouldShowToggle: true,
        isLoading: false,
        error: null,
      };

      render(<DarkModeToggle />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should apply light mode when force-light is configured', () => {
      mockThemeModeConfig = {
        themeMode: 'force-light',
        isForced: true,
        forcedMode: 'light',
        shouldShowToggle: false,
        isLoading: false,
        error: null,
      };

      render(<DarkModeToggle />);

      expect(mockSetColorMode).toHaveBeenCalledWith('light');
    });

    it('should apply dark mode when force-dark is configured', () => {
      mockThemeModeConfig = {
        themeMode: 'force-dark',
        isForced: true,
        forcedMode: 'dark',
        shouldShowToggle: false,
        isLoading: false,
        error: null,
      };

      render(<DarkModeToggle />);

      expect(mockSetColorMode).toHaveBeenCalledWith('dark');
    });

    it('should override user preference when forced mode is set', () => {
      // User has dark mode preference (simulated by mockColorModeState)
      mockColorModeState = 'dark';
      // But admin forces light mode
      mockThemeModeConfig = {
        themeMode: 'force-light',
        isForced: true,
        forcedMode: 'light',
        shouldShowToggle: false,
        isLoading: false,
        error: null,
      };

      render(<DarkModeToggle />);

      // Should force light mode despite user preference
      expect(mockSetColorMode).toHaveBeenCalledWith('light');
      // Toggle should be hidden
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });
});
