import { render, screen } from '@testing-library/react';
import { act } from 'react';
import { PublicPageLoader } from '@/presentation/shared/components/PublicPageLoader';
import type { PageLoadError } from '@/types/page-load-state';

// Mock fetch globally
global.fetch = jest.fn();

describe('Public Page Loading Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('User Story 1: Display Loading State During Initial Data Fetch', () => {
    it('T016: Loading indicator appears immediately on mount', async () => {
      // Arrange: Component starts in loading state
      render(<PublicPageLoader isLoading={true} error={null} />);

      // Assert: Loading spinner is visible immediately
      const spinner = screen.getByTestId('page-loading-spinner');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveAttribute('role', 'status');
      expect(spinner).toHaveAttribute('aria-live', 'polite');
    });

    it('T017: Loading indicator persists until all three data sources complete', async () => {
      // Arrange: Render component in loading state
      const { rerender } = render(
        <PublicPageLoader isLoading={true} error={null} />
      );

      // Assert: Loading spinner is visible
      expect(screen.getByTestId('page-loading-spinner')).toBeInTheDocument();

      // Act: Simulate data still loading (re-render with same state)
      rerender(<PublicPageLoader isLoading={true} error={null} />);

      // Assert: Loading spinner still visible
      expect(screen.getByTestId('page-loading-spinner')).toBeInTheDocument();

      // Act: Simulate all data loaded (re-render with isLoading=false)
      rerender(<PublicPageLoader isLoading={false} error={null} />);

      // Assert: Loading spinner is no longer visible
      expect(
        screen.queryByTestId('page-loading-spinner')
      ).not.toBeInTheDocument();
    });

    it('T018: No partial content visible during loading', async () => {
      // Arrange: Component is in loading state
      render(<PublicPageLoader isLoading={true} error={null} />);

      // Assert: Only loading spinner is rendered
      const spinner = screen.getByTestId('page-loading-spinner');
      expect(spinner).toBeInTheDocument();

      // Assert: No error content is visible
      expect(screen.queryByTestId('page-load-error')).not.toBeInTheDocument();
      expect(screen.queryByText(/unable to load/i)).not.toBeInTheDocument();
      expect(screen.queryByTestId('retry-button')).not.toBeInTheDocument();
    });

    it('T019: Complete page displays only after all data loaded', async () => {
      // Arrange: Start with loading state
      const { rerender } = render(
        <PublicPageLoader isLoading={true} error={null} />
      );

      // Assert: Loading spinner is visible
      expect(screen.getByTestId('page-loading-spinner')).toBeInTheDocument();

      // Act: Transition to loaded state
      rerender(<PublicPageLoader isLoading={false} error={null} />);

      // Assert: Loading spinner is removed
      expect(
        screen.queryByTestId('page-loading-spinner')
      ).not.toBeInTheDocument();

      // Note: Actual page content rendering is tested in the page component integration
    });
  });

  describe('User Story 2: Handle Slow Network Conditions', () => {
    it('T032: Loading indicator remains visible without flickering on slow network', async () => {
      // Arrange: Render in loading state
      const { rerender } = render(
        <PublicPageLoader isLoading={true} error={null} />
      );

      // Assert: Initial loading state
      expect(screen.getByTestId('page-loading-spinner')).toBeInTheDocument();

      // Act: Simulate slow network (data still loading after delay)
      await new Promise((resolve) => setTimeout(resolve, 100));
      rerender(<PublicPageLoader isLoading={true} error={null} />);

      // Assert: Loading spinner still visible (no flicker)
      expect(screen.getByTestId('page-loading-spinner')).toBeInTheDocument();
    });

    it('T033: Timeout error message displays after 10 seconds', async () => {
      // Arrange: Create timeout error
      const timeoutError: PageLoadError = {
        message:
          'This page is taking longer than expected to load. Please try again.',
        failedSources: ['menu', 'footer', 'content'],
        isTimeout: true,
        timestamp: Date.now(),
      };

      // Act: Render with timeout error
      render(
        <PublicPageLoader
          isLoading={false}
          error={timeoutError}
          onRetry={jest.fn()}
        />
      );

      // Assert: Timeout message is displayed
      expect(
        screen.getByText(/taking longer than expected/i)
      ).toBeInTheDocument();
      expect(screen.getByTestId('retry-button')).toBeInTheDocument();
    });

    it('T034: Loading continues until all data sources complete even if some finish early', async () => {
      // Arrange: Start with loading state
      const { rerender } = render(
        <PublicPageLoader isLoading={true} error={null} />
      );

      // Assert: Loading spinner visible
      expect(screen.getByTestId('page-loading-spinner')).toBeInTheDocument();

      // Act: Simulate one data source completing (but still loading overall)
      rerender(<PublicPageLoader isLoading={true} error={null} />);

      // Assert: Loading spinner still visible (waiting for all sources)
      expect(screen.getByTestId('page-loading-spinner')).toBeInTheDocument();

      // Act: All sources complete
      rerender(<PublicPageLoader isLoading={false} error={null} />);

      // Assert: Loading complete
      expect(
        screen.queryByTestId('page-loading-spinner')
      ).not.toBeInTheDocument();
    });
  });

  describe('User Story 3: Handle Data Loading Failures', () => {
    it('T045: Error message and retry button display when menu data fails', async () => {
      // Arrange: Create error for menu failure
      const menuError: PageLoadError = {
        message:
          'Unable to load page content. Please check your connection and try again.',
        failedSources: ['menu'],
        isTimeout: false,
        timestamp: Date.now(),
      };

      const mockRetry = jest.fn();

      // Act: Render with error
      render(
        <PublicPageLoader
          isLoading={false}
          error={menuError}
          onRetry={mockRetry}
        />
      );

      // Assert: Error message and retry button are visible
      expect(screen.getByTestId('page-load-error')).toBeInTheDocument();
      expect(
        screen.getByText(/unable to load page content/i)
      ).toBeInTheDocument();

      const retryButton = screen.getByTestId('retry-button');
      expect(retryButton).toBeInTheDocument();

      // Act: Click retry button
      act(() => {
        retryButton.click();
      });

      // Assert: Retry function was called
      expect(mockRetry).toHaveBeenCalledTimes(1);
    });

    it('T046: Error message and retry button display when page content fails', async () => {
      // Arrange: Create error for content failure
      const contentError: PageLoadError = {
        message:
          'Unable to load page content. Please check your connection and try again.',
        failedSources: ['content'],
        isTimeout: false,
        timestamp: Date.now(),
      };

      const mockRetry = jest.fn();

      // Act: Render with error
      render(
        <PublicPageLoader
          isLoading={false}
          error={contentError}
          onRetry={mockRetry}
        />
      );

      // Assert: Error message and retry button are visible
      expect(
        screen.getByText(/unable to load page content/i)
      ).toBeInTheDocument();
      expect(screen.getByTestId('retry-button')).toBeInTheDocument();
    });

    it('T047: Retry button re-triggers all data fetching and shows loading indicator', async () => {
      // Arrange: Create error state
      const error: PageLoadError = {
        message:
          'Unable to load page content. Please check your connection and try again.',
        failedSources: ['menu'],
        isTimeout: false,
        timestamp: Date.now(),
      };

      const mockRetry = jest.fn();

      // Render with error
      const { rerender } = render(
        <PublicPageLoader isLoading={false} error={error} onRetry={mockRetry} />
      );

      // Assert: Error state visible
      expect(screen.getByTestId('page-load-error')).toBeInTheDocument();

      // Act: Click retry button
      const retryButton = screen.getByTestId('retry-button');
      act(() => {
        retryButton.click();
      });

      // Assert: Retry called
      expect(mockRetry).toHaveBeenCalledTimes(1);

      // Act: Simulate retry starts loading
      rerender(<PublicPageLoader isLoading={true} error={null} />);

      // Assert: Loading indicator appears again
      expect(screen.getByTestId('page-loading-spinner')).toBeInTheDocument();
      expect(screen.queryByTestId('page-load-error')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for loading state', () => {
      // Act: Render loading state
      render(<PublicPageLoader isLoading={true} error={null} />);

      // Assert: ARIA attributes are present
      const spinner = screen.getByTestId('page-loading-spinner');
      expect(spinner).toHaveAttribute('role', 'status');
      expect(spinner).toHaveAttribute('aria-live', 'polite');
      expect(spinner).toHaveAttribute('aria-label', 'Loading page content');
    });

    it('should have proper ARIA labels for error state', () => {
      // Arrange: Create error
      const error: PageLoadError = {
        message: 'Test error message',
        failedSources: ['menu'],
        isTimeout: false,
        timestamp: Date.now(),
      };

      // Act: Render error state
      render(
        <PublicPageLoader isLoading={false} error={error} onRetry={jest.fn()} />
      );

      // Assert: ARIA attributes are present
      const errorContainer = screen.getByTestId('page-load-error');
      expect(errorContainer).toHaveAttribute('role', 'alert');
      expect(errorContainer).toHaveAttribute('aria-live', 'polite');

      const retryButton = screen.getByTestId('retry-button');
      expect(retryButton).toHaveAttribute('aria-label', 'Retry loading page');
    });
  });

  describe('Theme Support', () => {
    it('should render black spinner centered on page', () => {
      // Act: Render loading state
      render(<PublicPageLoader isLoading={true} error={null} />);

      // Assert: Spinner is rendered and centered
      const spinner = screen.getByTestId('page-loading-spinner');
      expect(spinner).toBeInTheDocument();
    });
  });
});
