import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { LoggerProvider } from '@/presentation/shared/contexts/LoggerContext';
import { Logger } from '@/application/shared/Logger';
import { useIconManagement } from '@/presentation/admin/hooks/useIconManagement';

// Mock fetch
global.fetch = jest.fn();

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

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LoggerProvider logger={mockLogger}>{children}</LoggerProvider>
);

describe('useIconManagement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleIconUpload', () => {
    it('should upload icon successfully', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          icon: {
            url: 'https://example.com/icon.png',
            filename: 'icon.png',
            size: 1024,
            format: 'png',
          },
        }),
      };
      (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(
        () =>
          useIconManagement({
            onIconChange: jest.fn(),
            onMessage: jest.fn(),
          }),
        { wrapper }
      );

      const file = new File(['test'], 'icon.png', { type: 'image/png' });

      await act(async () => {
        await result.current.handleIconUpload(file);
      });

      expect(fetch).toHaveBeenCalledWith('/api/settings/icon', {
        method: 'POST',
        body: expect.any(FormData),
      });

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Website icon uploaded successfully',
        {
          filename: 'icon.png',
          size: 1024,
          format: 'png',
        }
      );
    });

    it('should handle upload failure', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({
          error: 'Upload failed',
        }),
      };
      (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const onMessage = jest.fn();
      const { result } = renderHook(
        () =>
          useIconManagement({
            onIconChange: jest.fn(),
            onMessage,
          }),
        { wrapper }
      );

      const file = new File(['test'], 'icon.png', { type: 'image/png' });

      await act(async () => {
        await result.current.handleIconUpload(file);
      });

      expect(onMessage).toHaveBeenCalledWith('Upload failed');
    });

    it('should handle network error', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const onMessage = jest.fn();
      const { result } = renderHook(
        () =>
          useIconManagement({
            onIconChange: jest.fn(),
            onMessage,
          }),
        { wrapper }
      );

      const file = new File(['test'], 'icon.png', { type: 'image/png' });

      await act(async () => {
        await result.current.handleIconUpload(file);
      });

      expect(onMessage).toHaveBeenCalledWith('Network error');
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Failed to upload website icon',
        {
          error: expect.any(Error),
        }
      );
    });
  });

  describe('handleIconDelete', () => {
    it('should delete icon successfully', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      };
      (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(
        () =>
          useIconManagement({
            onIconChange: jest.fn(),
            onMessage: jest.fn(),
          }),
        { wrapper }
      );

      await act(async () => {
        await result.current.handleIconDelete();
      });

      expect(fetch).toHaveBeenCalledWith('/api/settings/icon', {
        method: 'DELETE',
      });

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Website icon deleted successfully'
      );
    });

    it('should handle delete failure', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({
          error: 'Delete failed',
        }),
      };
      (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const onMessage = jest.fn();
      const { result } = renderHook(
        () =>
          useIconManagement({
            onIconChange: jest.fn(),
            onMessage,
          }),
        { wrapper }
      );

      await act(async () => {
        await result.current.handleIconDelete();
      });

      expect(onMessage).toHaveBeenCalledWith('Delete failed');
    });
  });

  describe('handleIconValidationError', () => {
    it('should log validation error and call onMessage', () => {
      const onMessage = jest.fn();

      const { result } = renderHook(
        () =>
          useIconManagement({
            onIconChange: jest.fn(),
            onMessage,
          }),
        { wrapper }
      );

      const error = { message: 'Invalid file format' };

      act(() => {
        result.current.handleIconValidationError(error);
      });

      expect(mockLogger.warn).toHaveBeenCalledWith('Icon validation error', {
        error: error.message,
      });
      expect(onMessage).toHaveBeenCalledWith('Invalid file format');
    });
  });

  describe('icon configuration', () => {
    it('should provide correct icon configuration', () => {
      const { result } = renderHook(() => useIconManagement(), { wrapper });

      expect(result.current.iconConfig).toEqual({
        acceptedFormats: ['ico', 'png', 'jpg', 'jpeg', 'svg', 'gif', 'webp'],
        maxFileSize: 5 * 1024 * 1024, // 5MB
        previewSize: { width: '64px', height: '64px' },
        aspectRatio: '1:1',
      });
    });

    it('should provide correct icon labels', () => {
      const { result } = renderHook(() => useIconManagement(), { wrapper });

      expect(result.current.iconLabels).toEqual({
        uploadLabel: 'Upload Website Icon',
        uploadHint:
          'Upload a favicon for your website (ICO, PNG, JPG, SVG, GIF, WebP)',
        replaceButton: 'Replace Icon',
        deleteButton: 'Remove Icon',
        dragDropText: 'Drag and drop your icon here',
        sizeLimitText: 'Maximum file size: 2MB',
        formatText: 'Supported formats: ICO, PNG, JPG, SVG, GIF, WebP',
      });
    });
  });

  describe('loading state', () => {
    it('should set loading to true during operations', async () => {
      const { result } = renderHook(() => useIconManagement(), { wrapper });

      expect(result.current.iconLoading).toBe(false);

      // Mock a slow response
      (fetch as jest.Mock).mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: jest.fn().mockResolvedValue({
                    icon: {
                      url: 'test',
                      filename: 'test.png',
                      size: 1024,
                      format: 'png',
                    },
                  }),
                }),
              100
            )
          )
      );

      // Start upload
      const file = new File(['test'], 'icon.png', { type: 'image/png' });

      // Start the upload and check loading state
      let uploadPromise: Promise<void>;
      await act(async () => {
        uploadPromise = result.current.handleIconUpload(file);
      });

      // Check loading state after act completes
      expect(result.current.iconLoading).toBe(true);

      // Wait for the upload to complete
      await act(async () => {
        await uploadPromise!;
      });
      expect(result.current.iconLoading).toBe(false);
    });
  });
});
