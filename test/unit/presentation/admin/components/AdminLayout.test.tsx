import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import {
  AdminLayout,
  useAdminLayout,
} from '@/presentation/admin/components/AdminLayout';
import { LoggerProvider } from '@/presentation/shared/contexts/LoggerContext';
import { Logger } from '@/application/shared/Logger';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

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

describe('AdminLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  it('renders children content', () => {
    renderWithProviders(
      <AdminLayout>
        <div>Test Content</div>
      </AdminLayout>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders sidebar', () => {
    renderWithProviders(
      <AdminLayout>
        <div>Test Content</div>
      </AdminLayout>
    );

    expect(screen.getByTestId('desktop-sidebar')).toBeInTheDocument();
    expect(screen.getAllByText('Admin Panel')).toHaveLength(2); // One in desktop, one in mobile
  });

  it('loads sidebar state from localStorage on mount', () => {
    localStorageMock.setItem('admin-sidebar-open', 'true');

    renderWithProviders(
      <AdminLayout>
        <div>Test Content</div>
      </AdminLayout>
    );

    expect(localStorageMock.getItem).toHaveBeenCalledWith('admin-sidebar-open');
  });

  it('handles localStorage save errors gracefully', () => {
    localStorageMock.setItem.mockImplementationOnce(() => {
      throw new Error('Storage quota exceeded');
    });

    renderWithProviders(
      <AdminLayout>
        <div>Test Content</div>
      </AdminLayout>
    );

    expect(mockLogger.warn).toHaveBeenCalledWith(
      'Failed to save data from localStorage',
      expect.any(Object)
    );
  });

  it('handles localStorage load errors gracefully', () => {
    localStorageMock.getItem.mockImplementationOnce(() => {
      throw new Error('Security error');
    });

    renderWithProviders(
      <AdminLayout>
        <div>Test Content</div>
      </AdminLayout>
    );

    expect(mockLogger.warn).toHaveBeenCalledWith(
      'Failed to load data from localStorage',
      expect.any(Object)
    );
  });

  it('handles storage quota exceeded error on save', () => {
    localStorageMock.setItem.mockImplementationOnce(() => {
      const error = new Error('Storage quota exceeded');
      error.name = 'QuotaExceededError';
      throw error;
    });

    renderWithProviders(
      <AdminLayout>
        <div>Test Content</div>
      </AdminLayout>
    );

    // Trigger a state change to cause error
    const toggleButton = screen.getByTestId('sidebar-toggle');
    fireEvent.click(toggleButton);

    expect(mockLogger.warn).toHaveBeenCalledWith(
      'Failed to save data from localStorage',
      expect.objectContaining({
        error: expect.any(Error),
        operation: 'save',
        storageKey: 'admin-sidebar-open',
      })
    );
  });

  it('handles security error on load', () => {
    localStorageMock.getItem.mockImplementationOnce(() => {
      const error = new Error('Security error');
      error.name = 'SecurityError';
      throw error;
    });

    renderWithProviders(
      <AdminLayout>
        <div>Test Content</div>
      </AdminLayout>
    );

    expect(mockLogger.warn).toHaveBeenCalledWith(
      'Failed to load data from localStorage',
      expect.objectContaining({
        error: expect.any(Error),
        operation: 'load',
        storageKey: 'admin-sidebar-open',
      })
    );
  });

  it('handles corrupted localStorage data', () => {
    localStorageMock.getItem.mockImplementationOnce(() => {
      throw new SyntaxError('Unexpected token in JSON');
    });

    renderWithProviders(
      <AdminLayout>
        <div>Test Content</div>
      </AdminLayout>
    );

    expect(mockLogger.warn).toHaveBeenCalledWith(
      'Failed to load data from localStorage',
      expect.objectContaining({
        error: expect.any(SyntaxError),
        operation: 'load',
        storageKey: 'admin-sidebar-open',
      })
    );
    expect(mockLogger.info).toHaveBeenCalledWith(
      'Clearing corrupted localStorage data',
      expect.any(Object)
    );
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(
      'admin-sidebar-open'
    );
  });

  it('validates and parses boolean values from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('true');

    renderWithProviders(
      <AdminLayout>
        <div>Test Content</div>
      </AdminLayout>
    );

    expect(localStorageMock.getItem).toHaveBeenCalledWith('admin-sidebar-open');
  });

  it('handles JSON parsing for non-boolean values', () => {
    localStorageMock.getItem.mockReturnValue('1');

    renderWithProviders(
      <AdminLayout>
        <div>Test Content</div>
      </AdminLayout>
    );

    expect(localStorageMock.getItem).toHaveBeenCalledWith('admin-sidebar-open');
  });

  it('renders mobile header with toggle button', () => {
    renderWithProviders(
      <AdminLayout>
        <div>Test Content</div>
      </AdminLayout>
    );

    // Check for mobile header elements
    expect(screen.getByTestId('mobile-header')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-toggle')).toBeInTheDocument();
  });

  it('throws error when used outside AdminLayout', () => {
    const TestComponent = () => {
      useAdminLayout();
      return <div>Test</div>;
    };

    expect(() => {
      renderWithProviders(<TestComponent />);
    }).toThrow('useAdminLayout must be used within an AdminLayout');
  });
});
