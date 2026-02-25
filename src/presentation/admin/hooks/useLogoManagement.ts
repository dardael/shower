import { useState, useCallback } from 'react';
import { useLogger } from '@/presentation/shared/hooks/useLogger';
import type {
  ImageManagerConfig,
  ImageManagerLabels,
} from '@/presentation/shared/components/ImageManager/types';

export interface LogoData {
  url: string;
  filename: string;
  size: number;
  format: string;
}

export interface UseLogoManagementOptions {
  onLogoChange?: (logoData: LogoData | null) => void;
  onMessage?: (message: string) => void;
  onSuccess?: (message: string) => void;
}

export function useLogoManagement(options: UseLogoManagementOptions = {}) {
  const logger = useLogger();
  const [logoLoading, setLogoLoading] = useState(false);

  const handleLogoUpload = useCallback(
    async (file: File): Promise<void> => {
      setLogoLoading(true);
      try {
        const formData = new FormData();
        formData.append('logo', file);

        logger.debug('Uploading header logo', {
          filename: file.name,
          size: file.size,
          type: file.type,
        });

        const response = await fetch('/api/settings/logo', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          const logoDataFormatted: LogoData = {
            url: data.logo.url,
            filename: data.logo.filename,
            size: data.logo.size,
            format: data.logo.format,
          };

          options.onLogoChange?.(logoDataFormatted);
          options.onSuccess?.('Header logo updated successfully!');

          logger.info('Header logo uploaded successfully', {
            filename: logoDataFormatted.filename,
            size: logoDataFormatted.size,
            format: logoDataFormatted.format,
          });
        } else {
          const errorMessage = data.error || 'Failed to upload logo';
          options.onMessage?.(errorMessage);
        }
      } catch (error) {
        logger.error('Failed to upload header logo', { error });
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred';
        options.onMessage?.(errorMessage);
      } finally {
        setLogoLoading(false);
      }
    },
    [logger, options]
  );

  const handleLogoDelete = useCallback(async (): Promise<void> => {
    setLogoLoading(true);
    try {
      logger.debug('Deleting header logo');

      const response = await fetch('/api/settings/logo', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        options.onLogoChange?.(null);
        options.onSuccess?.('Header logo removed successfully!');

        logger.info('Header logo deleted successfully');
      } else {
        const errorMessage = data.error || 'Failed to remove logo';
        options.onMessage?.(errorMessage);
      }
    } catch (error) {
      logger.error('Failed to delete header logo', { error });
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      options.onMessage?.(errorMessage);
    } finally {
      setLogoLoading(false);
    }
  }, [logger, options]);

  const handleLogoReplace = useCallback(
    async (file: File): Promise<void> => {
      await handleLogoUpload(file);
    },
    [handleLogoUpload]
  );

  const handleLogoValidationError = useCallback(
    (error: { message: string }): void => {
      logger.warn('Logo validation error', { error: error.message });
      options.onMessage?.(error.message);
    },
    [logger, options]
  );

  const logoConfig: ImageManagerConfig = {
    acceptedFormats: ['png', 'jpg', 'jpeg', 'svg', 'gif', 'webp'],
    maxFileSize: 10 * 1024 * 1024, // 10MB limit for logos
    previewSize: { width: '120px', height: '60px' },
  };

  const logoLabels: ImageManagerLabels = {
    uploadLabel: 'Upload Logo',
    uploadHint:
      'Upload a logo for your website header (PNG, JPG, SVG, GIF, WebP)',
    replaceButton: 'Replace Logo',
    deleteButton: 'Remove Logo',
    dragDropText: 'Drag and drop your logo here',
    sizeLimitText: 'Maximum file size: 10MB',
    formatText: 'Supported formats: PNG, JPG, SVG, GIF, WebP',
  };

  return {
    logoLoading,
    handleLogoUpload,
    handleLogoDelete,
    handleLogoReplace,
    handleLogoValidationError,
    logoConfig,
    logoLabels,
  };
}
