import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import AdminErrorBoundary from '@/presentation/admin/components/AdminErrorBoundary';
import { LoggerProvider } from '@/presentation/shared/contexts/LoggerContext';
import { Logger } from '@/application/shared/Logger';

// Mock logger
const mockLogger = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  logApiRequest: jest.fn(),
  logApiResponse: jest.fn(),
  logError: jest.fn(),
  logSecurity: jest.fn(),
  logUserAction: jest.fn(),
  logBusinessEvent: jest.fn(),
  startTimer: jest.fn(),
  endTimer: jest.fn(),
  measure: jest.fn(),
  execute: jest.fn(),
  logIf: jest.fn(),
  debugIf: jest.fn(),
  batch: jest.fn(),
  withContext: jest.fn().mockReturnThis(),
} as unknown as Logger;

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <LoggerProvider logger={mockLogger}>
      <ChakraProvider value={defaultSystem}>{ui}</ChakraProvider>
    </LoggerProvider>
  );
};

describe('AdminErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console.error for intentional error tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.error after each test
    jest.restoreAllMocks();
  });

  it('renders children when no error occurs', () => {
    renderWithProviders(
      <AdminErrorBoundary>
        <div>Test Content</div>
      </AdminErrorBoundary>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders error fallback when error occurs', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    renderWithProviders(
      <AdminErrorBoundary>
        <ThrowError />
      </AdminErrorBoundary>
    );

    expect(screen.getByText('Admin Panel Error')).toBeInTheDocument();
  });

  it('calls onError when provided', () => {
    const onError = jest.fn();
    const ThrowError = () => {
      throw new Error('Test error');
    };

    renderWithProviders(
      <AdminErrorBoundary onError={onError}>
        <ThrowError />
      </AdminErrorBoundary>
    );

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    );
  });

  it('renders error fallback with proper structure', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    renderWithProviders(
      <AdminErrorBoundary>
        <ThrowError />
      </AdminErrorBoundary>
    );

    expect(screen.getByText('Admin Panel Error')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Try Again' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Go to Homepage' })
    ).toBeInTheDocument();
  });
});
