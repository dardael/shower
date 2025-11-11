import { useState, useCallback } from 'react';
import { useLogger } from '@/presentation/shared/hooks/useLogger';
import {
  ImageMetadata,
  ImageManagerConfig,
  ImageManagerLabels,
} from '@/presentation/shared/components/ImageManager/types';

export interface IconData {
  url: string;
  filename: string;
  size: number;
  format: string;
}

export interface UseIconManagementOptions {
  onIconChange?: (iconData: IconData | null) => void;
  onMessage?: (message: string) => void;
}

export function useIconManagement(options: UseIconManagementOptions = {}) {
  const logger = useLogger();
  const [iconLoading, setIconLoading] = useState(false);

  const handleIconUpload = useCallback(
    async (file: File, metadata: ImageMetadata): Promise<void> => {
      setIconLoading(true);
      try {
        const formData = new FormData();
        formData.append('icon', file);
        formData.append('metadata', JSON.stringify(metadata));

        logger.debug('Uploading website icon', {
          filename: file.name,
          size: file.size,
          type: file.type,
        });

        const response = await fetch('/api/settings/icon', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          const iconDataFormatted: IconData = {
            url: data.icon.url,
            filename: data.icon.filename,
            size: data.icon.size,
            format: data.icon.format,
          };

          options.onIconChange?.(iconDataFormatted);
          options.onMessage?.('Website icon updated successfully!');

          logger.info('Website icon uploaded successfully', {
            filename: iconDataFormatted.filename,
            size: iconDataFormatted.size,
            format: iconDataFormatted.format,
          });
        } else {
          throw new Error(data.error || 'Failed to upload icon');
        }
      } catch (error) {
        logger.error('Failed to upload website icon', { error });
        throw error;
      } finally {
        setIconLoading(false);
      }
    },
    [logger, options]
  );

  const handleIconDelete = useCallback(async (): Promise<void> => {
    setIconLoading(true);
    try {
      logger.debug('Deleting website icon');

      const response = await fetch('/api/settings/icon', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        options.onIconChange?.(null);
        options.onMessage?.('Website icon removed successfully!');

        logger.info('Website icon deleted successfully');
      } else {
        throw new Error(data.error || 'Failed to remove icon');
      }
    } catch (error) {
      logger.error('Failed to delete website icon', { error });
      throw error;
    } finally {
      setIconLoading(false);
    }
  }, [logger, options]);

  const handleIconReplace = useCallback(
    async (file: File, metadata: ImageMetadata): Promise<void> => {
      await handleIconUpload(file, metadata);
    },
    [handleIconUpload]
  );

  const handleIconValidationError = useCallback(
    (error: { message: string }): void => {
      logger.warn('Icon validation error', { error: error.message });
      options.onMessage?.(error.message);
    },
    [logger, options]
  );

  // Icon manager configuration
  const iconConfig: ImageManagerConfig = {
    acceptedFormats: ['ico', 'png', 'jpg', 'jpeg', 'svg', 'gif', 'webp'],
    maxFileSize: 2 * 1024 * 1024, // 2MB
    previewSize: { width: '64px', height: '64px' },
    aspectRatio: '1:1',
  };

  const iconLabels: ImageManagerLabels = {
    uploadLabel: 'Upload Website Icon',
    uploadHint:
      'Upload a favicon for your website (ICO, PNG, JPG, SVG, GIF, WebP)',
    replaceButton: 'Replace Icon',
    deleteButton: 'Remove Icon',
    dragDropText: 'Drag and drop your icon here',
    sizeLimitText: 'Maximum file size: 2MB',
    formatText: 'Supported formats: ICO, PNG, JPG, SVG, GIF, WebP',
  };

  return {
    iconLoading,
    handleIconUpload,
    handleIconDelete,
    handleIconReplace,
    handleIconValidationError,
    iconConfig,
    iconLabels,
  };
}
