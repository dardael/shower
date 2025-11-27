import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';

// Define mockSignOut before the mock
const mockSignOut = jest.fn();

// Mock the BetterAuthClientAdapter module
jest.mock('@/infrastructure/auth/adapters/BetterAuthClientAdapter', () => ({
  BetterAuthClientAdapter: function () {
    return {
      signOut: mockSignOut,
    };
  },
}));

// Mock the useLogger hook
const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
};
jest.mock('@/presentation/shared/hooks/useLogger', () => ({
  useLogger: () => mockLogger,
}));

// Override the global router mock with our custom mock functions
const mockPush = jest.fn();
const mockRefresh = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

// Import after mocks are set up
import LogoutButton from '@/presentation/shared/components/LogoutButton';

describe('LogoutButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSignOut.mockReset();
  });

  // T006: Unit test for successful logout flow
  describe('successful logout flow', () => {
    it('calls signOut and redirects on successful logout', async () => {
      mockSignOut.mockResolvedValue(undefined);

      render(<LogoutButton />);

      const button = screen.getByLabelText('Sign out');

      await act(async () => {
        fireEvent.click(button);
      });

      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalledTimes(1);
      });

      expect(mockLogger.info).toHaveBeenCalledWith(
        'User logged out successfully'
      );
      expect(mockPush).toHaveBeenCalledWith('/admin');
      expect(mockRefresh).toHaveBeenCalled();
    });

    it('disables button during logout process', async () => {
      mockSignOut.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      render(<LogoutButton />);

      const button = screen.getByLabelText('Sign out');
      fireEvent.click(button);

      // Check immediately after click
      expect(button).toBeDisabled();

      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalledTimes(1);
      });
    });
  });

  // T007: Unit test for error handling (network failure) with graceful fallback
  describe('error handling with graceful fallback', () => {
    it('handles network error gracefully and still redirects', async () => {
      const networkError = new Error('Network error');
      mockSignOut.mockRejectedValue(networkError);

      render(<LogoutButton />);

      const button = screen.getByLabelText('Sign out');

      await act(async () => {
        fireEvent.click(button);
      });

      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalledTimes(1);
      });

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Logout failed, clearing local session',
        networkError
      );
      expect(mockPush).toHaveBeenCalledWith('/admin');
      expect(mockRefresh).toHaveBeenCalled();
    });

    it('does not show error to user, just redirects', async () => {
      mockSignOut.mockRejectedValue(new Error('Server error'));

      render(<LogoutButton />);

      const button = screen.getByLabelText('Sign out');

      await act(async () => {
        fireEvent.click(button);
      });

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/admin');
      });

      // Should not throw or display error UI
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });
  });

  // T017: Unit test for LogoutButton rendering with correct aria-label and icon
  describe('rendering and accessibility', () => {
    it('renders with correct aria-label', () => {
      render(<LogoutButton />);

      const button = screen.getByLabelText('Sign out');
      expect(button).toBeInTheDocument();
    });

    it('renders with title attribute for tooltip', () => {
      render(<LogoutButton />);

      const button = screen.getByLabelText('Sign out');
      expect(button).toHaveAttribute('title', 'Sign out');
    });
  });

  // T018: Unit test for button disabled state during logout loading
  describe('loading state', () => {
    it('is enabled before clicking', () => {
      render(<LogoutButton />);

      const button = screen.getByLabelText('Sign out');
      expect(button).not.toBeDisabled();
    });

    it('is disabled during loading', async () => {
      mockSignOut.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 200))
      );

      render(<LogoutButton />);

      const button = screen.getByLabelText('Sign out');
      fireEvent.click(button);

      expect(button).toBeDisabled();

      await waitFor(
        () => {
          expect(mockPush).toHaveBeenCalled();
        },
        { timeout: 300 }
      );
    });

    it('prevents multiple clicks during loading', async () => {
      mockSignOut.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      render(<LogoutButton />);

      const button = screen.getByLabelText('Sign out');

      // Click multiple times rapidly
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      await waitFor(() => {
        // Should only call signOut once since button is disabled after first click
        expect(mockSignOut).toHaveBeenCalledTimes(1);
      });
    });
  });
});
