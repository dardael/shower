'use client';

import { useCallback, useState } from 'react';
import { useLogger } from '@/presentation/shared/hooks/useLogger';
import { useToastNotifications } from './useToastNotifications';

interface ImportPreviewResult {
  valid: boolean;
  package?: {
    schemaVersion: string;
    exportDate: string;
    sourceIdentifier: string;
    summary: {
      menuItems: number;
      pageContents: number;
      settings: number;
      socialNetworks: number;
      images: number;
      totalSizeBytes: number;
    };
  };
  error?: string;
}

interface ImportResult {
  success: boolean;
  message?: string;
  imported?: {
    menuItems: number;
    pageContents: number;
    settings: number;
    socialNetworks: number;
    images: number;
  };
  error?: string;
  restored?: boolean;
}

interface UseImportConfigurationResult {
  isImporting: boolean;
  isPreviewing: boolean;
  previewResult: ImportPreviewResult | null;
  previewConfiguration: (file: File) => Promise<void>;
  importConfiguration: (file: File) => Promise<void>;
  clearPreview: () => void;
}

export function useImportConfiguration(): UseImportConfigurationResult {
  const [isImporting, setIsImporting] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewResult, setPreviewResult] =
    useState<ImportPreviewResult | null>(null);
  const logger = useLogger();
  const { showToast } = useToastNotifications();

  const previewConfiguration = useCallback(
    async (file: File): Promise<void> => {
      setIsPreviewing(true);
      setPreviewResult(null);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/config/import?preview=true', {
          method: 'POST',
          body: formData,
        });

        const data: ImportPreviewResult = await response.json();

        if (!response.ok) {
          setPreviewResult({
            valid: false,
            error: data.error ?? 'Preview failed',
          });
          showToast(data.error ?? 'Invalid package', 'error');
          return;
        }

        setPreviewResult(data);
        logger.info('Package preview successful');
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Preview failed';
        setPreviewResult({ valid: false, error: message });
        showToast(message, 'error');
        logger.error('Package preview failed', error);
      } finally {
        setIsPreviewing(false);
      }
    },
    [logger, showToast]
  );

  const importConfiguration = useCallback(
    async (file: File): Promise<void> => {
      setIsImporting(true);

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('confirmed', 'true');

        const response = await fetch('/api/config/import', {
          method: 'POST',
          body: formData,
        });

        const data: ImportResult = await response.json();

        if (!response.ok) {
          const errorMessage = data.error ?? 'Import failed';
          if (data.restored) {
            showToast(
              `Import failed, configuration restored: ${errorMessage}`,
              'error'
            );
          } else {
            showToast(errorMessage, 'error');
          }
          logger.error('Configuration import failed', data.error);
          return;
        }

        const counts = data.imported;
        const summary = counts
          ? `${counts.menuItems} menu items, ${counts.pageContents} pages, ${counts.settings} settings, ${counts.socialNetworks} social networks, ${counts.images} images`
          : '';

        showToast(`Configuration imported successfully: ${summary}`, 'success');
        logger.info('Configuration imported successfully');
        setPreviewResult(null);

        // Reload the page to reflect the imported configuration
        window.location.reload();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Import failed';
        showToast(message, 'error');
        logger.error('Configuration import failed', error);
      } finally {
        setIsImporting(false);
      }
    },
    [logger, showToast]
  );

  const clearPreview = useCallback((): void => {
    setPreviewResult(null);
  }, []);

  return {
    isImporting,
    isPreviewing,
    previewResult,
    previewConfiguration,
    importConfiguration,
    clearPreview,
  };
}
