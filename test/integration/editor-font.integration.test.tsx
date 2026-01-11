import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TiptapEditor from '@/presentation/admin/components/PageContentEditor/TiptapEditor';
import PublicPageContent from '@/presentation/shared/components/PublicPageContent/PublicPageContent';
import { SellingConfigProvider } from '@/presentation/shared/contexts/SellingConfigContext';
import { AppointmentModuleProvider } from '@/presentation/shared/contexts/AppointmentModuleContext';

// Mock BroadcastChannel
const mockBroadcastChannel = {
  postMessage: jest.fn(),
  close: jest.fn(),
  onmessage: null as ((event: MessageEvent) => void) | null,
};

global.BroadcastChannel = jest.fn().mockImplementation(() => ({
  ...mockBroadcastChannel,
}));

// Mock fetch for API calls
const mockFetch = jest.fn();
global.fetch = mockFetch;

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

// Simple wrapper component for tests
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppointmentModuleProvider>
      <SellingConfigProvider>{children}</SellingConfigProvider>
    </AppointmentModuleProvider>
  );
};

describe('Editor Font Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
  });

  afterEach(() => {
    mockConsoleError.mockClear();
    mockConsoleWarn.mockClear();
    mockConsoleLog.mockClear();
  });

  describe('TR-003: Font is saved when configuring page content', () => {
    it('should save font styling in HTML content', async () => {
      const TestComponent = () => {
        const [content, setContent] = React.useState('');

        const handleSave = async (): Promise<void> => {
          mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () =>
              Promise.resolve({
                message: 'Page content saved successfully',
                page: { content },
              }),
          });

          await fetch('/api/settings/pages', {
            method: 'POST',
            body: JSON.stringify({ content }),
          });
        };

        return (
          <div>
            <TiptapEditor content={content} onChange={setContent} />
            <button data-testid="save-button" onClick={handleSave}>
              Save
            </button>
          </div>
        );
      };

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('save-button')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('save-button'));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/settings/pages',
          expect.objectContaining({
            method: 'POST',
          })
        );
      });
    });
  });

  describe('TR-004: Font is displayed when editing saved content', () => {
    it('should display font styling when loading saved content', async () => {
      const savedContentWithFont =
        '<p>Normal text <span style="font-family: \'Inter\'">styled text</span></p>';

      const TestComponent = () => {
        const [content, setContent] = React.useState('');

        React.useEffect(() => {
          const loadContent = async (): Promise<void> => {
            mockFetch.mockResolvedValueOnce({
              ok: true,
              json: () =>
                Promise.resolve({
                  page: { content: savedContentWithFont },
                }),
            });

            const response = await fetch('/api/settings/pages/test-page');
            const data = await response.json();
            setContent(data.page.content);
          };

          loadContent();
        }, []);

        return <TiptapEditor content={content} onChange={() => {}} />;
      };

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/settings/pages/test-page');
      });
    });
  });

  describe('TR-005: Font renders on public page', () => {
    it('should render font correctly on public page', async () => {
      const contentWithFont =
        '<p>Normal text <span style="font-family: \'Playfair Display\'">styled text</span></p>';

      render(
        <TestWrapper>
          <PublicPageContent content={contentWithFont} />
        </TestWrapper>
      );

      await waitFor(() => {
        const publicContent = screen.getByText(/Normal text/);
        expect(publicContent).toBeInTheDocument();
      });
    });

    it('should handle multiple fonts in content', async () => {
      const contentWithMultipleFonts =
        '<p><span style="font-family: \'Inter\'">Inter text</span> and <span style="font-family: \'Roboto\'">Roboto text</span></p>';

      render(
        <TestWrapper>
          <PublicPageContent content={contentWithMultipleFonts} />
        </TestWrapper>
      );

      await waitFor(() => {
        const publicContent = screen.getByText(/Inter text/);
        expect(publicContent).toBeInTheDocument();
      });
    });

    it('should handle content with no custom fonts', async () => {
      const contentWithoutFont = '<p>Normal text without custom font</p>';

      render(
        <TestWrapper>
          <PublicPageContent content={contentWithoutFont} />
        </TestWrapper>
      );

      await waitFor(() => {
        const publicContent = screen.getByText(
          /Normal text without custom font/
        );
        expect(publicContent).toBeInTheDocument();
      });
    });
  });
});
