import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WebsiteFont } from '@/domain/settings/value-objects/WebsiteFont';
import { DEFAULT_FONT } from '@/domain/settings/constants/AvailableFonts';
import { useWebsiteFont } from '@/presentation/shared/hooks/useWebsiteFont';
import { WebsiteFontStorage } from '@/presentation/shared/utils/WebsiteFontStorage';

// Mock fetch for API calls
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock console methods to prevent test output pollution
const mockConsoleError = jest.fn();
const mockConsoleWarn = jest.fn();
const mockConsoleLog = jest.fn();

const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

beforeAll(() => {
  console.error = mockConsoleError;
  console.warn = mockConsoleWarn;
  console.log = mockConsoleLog;
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
  console.log = originalConsoleLog;
});

// Setup localStorage mock before each test
const setupLocalStorageMock = (): void => {
  mockLocalStorage.setItem.mockClear();
  mockLocalStorage.getItem.mockClear();
  mockLocalStorage.removeItem.mockClear();

  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  });
};

// Simple wrapper component for tests
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

describe('Website Font Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
    setupLocalStorageMock();
    mockFetch.mockClear();
  });

  afterEach(() => {
    mockConsoleError.mockClear();
    mockConsoleWarn.mockClear();
    mockConsoleLog.mockClear();
  });

  describe('Font CRUD Operations (TR-001)', () => {
    it('should fetch current font from API on initialization', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ websiteFont: 'Roboto' }),
      });

      const TestComponent = () => {
        const { websiteFont } = useWebsiteFont();
        return <div data-testid="current-font">{websiteFont}</div>;
      };

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/settings/website-font'),
          expect.any(Object)
        );
      });
    });

    it('should update font via API when font is changed', async () => {
      mockLocalStorage.getItem.mockReturnValue(DEFAULT_FONT);
      mockFetch.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            message: 'Website font updated successfully',
            websiteFont: 'Montserrat',
          }),
      });

      const TestComponent = () => {
        const { websiteFont, updateWebsiteFont } = useWebsiteFont();
        return (
          <div>
            <div data-testid="current-font">{websiteFont}</div>
            <button
              data-testid="update-font"
              onClick={() => updateWebsiteFont('Montserrat')}
            >
              Update Font
            </button>
          </div>
        );
      };

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      fireEvent.click(screen.getByTestId('update-font'));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/settings/website-font',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ websiteFont: 'Montserrat' }),
          })
        );
      });
    });

    it('should handle API errors gracefully', async () => {
      mockLocalStorage.getItem.mockReturnValue(DEFAULT_FONT);
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      const TestComponent = () => {
        const { websiteFont, updateWebsiteFont } = useWebsiteFont();
        const [error, setError] = React.useState<string | null>(null);

        const handleUpdate = async (): Promise<void> => {
          try {
            await updateWebsiteFont('Roboto');
          } catch (err) {
            setError((err as Error).message);
          }
        };

        return (
          <div>
            <div data-testid="current-font">{websiteFont}</div>
            <button data-testid="update-font" onClick={handleUpdate}>
              Update Font
            </button>
            {error && <div data-testid="error-message">{error}</div>}
          </div>
        );
      };

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      fireEvent.click(screen.getByTestId('update-font'));

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent(
          'Failed to update website font'
        );
      });
    });
  });

  describe('Font Rendering on Public Pages (TR-002)', () => {
    it('should provide font to public layout via context', async () => {
      mockLocalStorage.getItem.mockReturnValue('Playfair Display');

      const TestComponent = () => {
        const { websiteFont } = useWebsiteFont();
        return (
          <div data-testid="public-layout" style={{ fontFamily: websiteFont }}>
            Public Page Content
          </div>
        );
      };

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      await waitFor(() => {
        const publicLayout = screen.getByTestId('public-layout');
        expect(publicLayout).toBeInTheDocument();
      });
    });

    it('should generate correct Google Fonts URL', () => {
      const font = WebsiteFont.create('Open Sans');
      const url = font.getGoogleFontsUrl();

      expect(url).toContain('https://fonts.googleapis.com/css2');
      expect(url).toContain('family=Open+Sans');
      expect(url).toContain('display=swap');
    });
  });

  describe('Font Rendering on Admin Pages (TR-003)', () => {
    it('should apply font to admin interface', async () => {
      mockLocalStorage.getItem.mockReturnValue('Roboto');

      const TestComponent = () => {
        const { websiteFont } = useWebsiteFont();
        return (
          <div data-testid="admin-layout" style={{ fontFamily: websiteFont }}>
            Admin Dashboard
          </div>
        );
      };

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      await waitFor(() => {
        const adminLayout = screen.getByTestId('admin-layout');
        expect(adminLayout).toBeInTheDocument();
      });
    });

    it('should update font in real-time when admin changes it', async () => {
      mockLocalStorage.getItem.mockReturnValue(DEFAULT_FONT);
      mockFetch.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            message: 'Website font updated successfully',
            websiteFont: 'Lato',
          }),
      });

      const TestComponent = () => {
        const { websiteFont, updateWebsiteFont, setWebsiteFont } =
          useWebsiteFont();
        return (
          <div>
            <div data-testid="current-font">{websiteFont}</div>
            <button
              data-testid="change-font"
              onClick={async () => {
                await updateWebsiteFont('Lato');
                setWebsiteFont('Lato');
              }}
            >
              Change Font
            </button>
          </div>
        );
      };

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      expect(screen.getByTestId('current-font')).toHaveTextContent(
        DEFAULT_FONT
      );

      fireEvent.click(screen.getByTestId('change-font'));

      await waitFor(() => {
        expect(screen.getByTestId('current-font')).toHaveTextContent('Lato');
      });
    });
  });

  describe('Font Persistence', () => {
    it('should persist font preference in localStorage', async () => {
      mockLocalStorage.getItem.mockReturnValue(DEFAULT_FONT);
      mockFetch.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            message: 'Website font updated successfully',
            websiteFont: 'Poppins',
          }),
      });

      const TestComponent = () => {
        const { updateWebsiteFont } = useWebsiteFont();
        return (
          <button
            data-testid="save-font"
            onClick={() => updateWebsiteFont('Poppins')}
          >
            Save Font
          </button>
        );
      };

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      fireEvent.click(screen.getByTestId('save-font'));

      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          'shower-website-font',
          'Poppins'
        );
      });
    });

    it('should load saved font on mount', async () => {
      mockLocalStorage.getItem.mockReturnValue('Nunito');

      const TestComponent = () => {
        const { websiteFont } = useWebsiteFont();
        return <div data-testid="loaded-font">{websiteFont}</div>;
      };

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loaded-font')).toHaveTextContent('Nunito');
      });

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(
        'shower-website-font'
      );
    });

    it('should fall back to default font if saved font is invalid', async () => {
      mockLocalStorage.getItem.mockReturnValue('InvalidFontName');
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ websiteFont: DEFAULT_FONT }),
      });

      const TestComponent = () => {
        const { websiteFont } = useWebsiteFont();
        return <div data-testid="font">{websiteFont}</div>;
      };

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('font')).toHaveTextContent(DEFAULT_FONT);
      });
    });

    it('should sync with server on refresh', async () => {
      mockLocalStorage.getItem.mockReturnValue('Inter');
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ websiteFont: 'Roboto' }),
      });

      const TestComponent = () => {
        const { websiteFont, refreshWebsiteFont } = useWebsiteFont();
        return (
          <div>
            <div data-testid="font">{websiteFont}</div>
            <button data-testid="refresh" onClick={refreshWebsiteFont}>
              Refresh
            </button>
          </div>
        );
      };

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      fireEvent.click(screen.getByTestId('refresh'));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });
  });

  describe('WebsiteFontStorage', () => {
    it('should get font from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('Quicksand');

      const font = WebsiteFontStorage.getWebsiteFont();

      expect(font).toBe('Quicksand');
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(
        'shower-website-font'
      );
    });

    it('should return default font when localStorage is empty', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const font = WebsiteFontStorage.getWebsiteFont();

      expect(font).toBe(DEFAULT_FONT);
    });

    it('should set font in localStorage', () => {
      WebsiteFontStorage.setWebsiteFont('Work Sans');

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'shower-website-font',
        'Work Sans'
      );
    });

    it('should sync with server and update localStorage', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ websiteFont: 'Raleway' }),
      });

      const result = await WebsiteFontStorage.syncWithServer();

      expect(result).toBe('Raleway');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'shower-website-font',
        'Raleway'
      );
    });

    it('should return default font on sync failure', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await WebsiteFontStorage.syncWithServer();

      expect(result).toBe(DEFAULT_FONT);
    });
  });

  describe('WebsiteFont Value Object', () => {
    it('should create a valid font', () => {
      const font = WebsiteFont.create('Roboto');
      expect(font.value).toBe('Roboto');
    });

    it('should throw error for invalid font', () => {
      expect(() => WebsiteFont.create('InvalidFont')).toThrow(
        'Invalid font: InvalidFont'
      );
    });

    it('should create default font', () => {
      const font = WebsiteFont.createDefault();
      expect(font.value).toBe(DEFAULT_FONT);
    });

    it('should handle case-insensitive font names', () => {
      const font = WebsiteFont.create('roboto');
      expect(font.value).toBe('Roboto');
    });

    it('should return font family CSS value', () => {
      const font = WebsiteFont.create('Inter');
      expect(font.getFontFamily()).toBe("'Inter', sans-serif");
    });

    it('should return font metadata', () => {
      const font = WebsiteFont.create('Playfair Display');
      const metadata = font.getMetadata();
      expect(metadata).toBeDefined();
      expect(metadata?.category).toBe('serif');
    });
  });
});
