'use client';

import { useCallback, useState } from 'react';
import { useLogger } from '@/presentation/shared/hooks/useLogger';
import { useToastNotifications } from './useToastNotifications';

interface UseExportConfigurationResult {
  isExporting: boolean;
  exportConfiguration: () => Promise<void>;
}

export function useExportConfiguration(): UseExportConfigurationResult {
  const [isExporting, setIsExporting] = useState(false);
  const logger = useLogger();
  const { showToast } = useToastNotifications();

  const exportConfiguration = useCallback(async (): Promise<void> => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/config/export');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Export failed');
      }

      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition?.match(/filename="?([^"]+)"?/);
      const filename = filenameMatch?.[1] || 'shower-config.zip';

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showToast('Configuration exported successfully', 'success');
      logger.info('Configuration exported successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Export failed';
      showToast(message, 'error');
      logger.error('Configuration export failed', error);
    } finally {
      setIsExporting(false);
    }
  }, [logger, showToast]);

  return { isExporting, exportConfiguration };
}
