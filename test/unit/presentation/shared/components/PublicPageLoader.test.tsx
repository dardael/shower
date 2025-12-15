import React from 'react';
import { render, screen } from '@testing-library/react';
import { PublicPageLoader } from '@/presentation/shared/components/PublicPageLoader';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

// Mock Chakra UI Spinner component
jest.mock('@chakra-ui/react', () => {
  const actual = jest.requireActual('@chakra-ui/react');
  return {
    ...actual,
    Spinner: ({
      'data-testid': testId,
      size,
      color,
    }: {
      'data-testid'?: string;
      size?: string;
      color?: string;
    }) => (
      <div
        data-testid={testId || 'chakra-spinner'}
        data-size={size}
        data-color={color}
      >
        Loading...
      </div>
    ),
  };
});

const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider value={defaultSystem}>{ui}</ChakraProvider>);
};

describe('PublicPageLoader', () => {
  describe('when custom loader is configured', () => {
    it('displays custom GIF loader when type is gif', () => {
      const customLoader = {
        type: 'gif' as const,
        url: '/api/loaders/test-loader.gif',
      };

      renderWithChakra(
        <PublicPageLoader
          isLoading={true}
          error={null}
          customLoader={customLoader}
        />
      );

      const gifElement = screen.getByTestId('custom-loader-gif');
      expect(gifElement).toBeInTheDocument();
      expect(gifElement).toHaveAttribute('src', customLoader.url);
      expect(screen.queryByTestId('chakra-spinner')).not.toBeInTheDocument();
    });

    it('displays custom video loader when type is video', () => {
      const customLoader = {
        type: 'video' as const,
        url: '/api/loaders/test-loader.mp4',
      };

      renderWithChakra(
        <PublicPageLoader
          isLoading={true}
          error={null}
          customLoader={customLoader}
        />
      );

      const videoElement = screen.getByTestId('custom-loader-video');
      expect(videoElement).toBeInTheDocument();
      expect(videoElement).toHaveAttribute('src', customLoader.url);
      expect(videoElement).toHaveAttribute('autoplay');
      expect(videoElement).toHaveAttribute('loop');
      expect(screen.queryByTestId('chakra-spinner')).not.toBeInTheDocument();
    });
  });

  describe('when no custom loader is configured', () => {
    it('displays default spinner when customLoader is null', () => {
      renderWithChakra(
        <PublicPageLoader isLoading={true} error={null} customLoader={null} />
      );

      expect(screen.getByTestId('chakra-spinner')).toBeInTheDocument();
      expect(screen.queryByTestId('custom-loader-gif')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('custom-loader-video')
      ).not.toBeInTheDocument();
    });

    it('displays default spinner when customLoader is undefined', () => {
      renderWithChakra(<PublicPageLoader isLoading={true} error={null} />);

      expect(screen.getByTestId('chakra-spinner')).toBeInTheDocument();
      expect(screen.queryByTestId('custom-loader-gif')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('custom-loader-video')
      ).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('maintains ARIA attributes on loader container', () => {
      renderWithChakra(
        <PublicPageLoader isLoading={true} error={null} customLoader={null} />
      );

      const container = screen.getByRole('status');
      expect(container).toHaveAttribute('aria-live', 'polite');
      expect(container).toHaveAttribute('aria-label', 'Loading page content');
    });

    it('maintains ARIA attributes with custom loader', () => {
      const customLoader = {
        type: 'gif' as const,
        url: '/api/loaders/test-loader.gif',
      };

      renderWithChakra(
        <PublicPageLoader
          isLoading={true}
          error={null}
          customLoader={customLoader}
        />
      );

      const container = screen.getByRole('status');
      expect(container).toHaveAttribute('aria-live', 'polite');
      expect(container).toHaveAttribute('aria-label', 'Loading page content');
    });
  });
});
