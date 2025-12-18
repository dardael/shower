'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLogger } from '@/presentation/shared/hooks/useLogger';
import type {
  ScheduledRestartConfigResponse,
  UpdateScheduledRestartRequest,
} from '@/app/api/admin/scheduled-restart/types';

export interface IScheduledRestartManager {
  enabled: boolean;
  restartHour: number;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  updateConfig: (enabled: boolean, restartHour: number) => Promise<boolean>;
  refresh: () => Promise<void>;
}

export function useScheduledRestart(): IScheduledRestartManager {
  const [enabled, setEnabled] = useState(false);
  const [restartHour, setRestartHour] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const logger = useLogger();

  const fetchConfig = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/scheduled-restart');

      if (!response.ok) {
        throw new Error('Failed to fetch scheduled restart configuration');
      }

      const data: ScheduledRestartConfigResponse = await response.json();
      setEnabled(data.enabled);
      setRestartHour(data.restartHour);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unknown error occurred';
      logger.error('Failed to fetch scheduled restart config', err as Error);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [logger]);

  const updateConfig = useCallback(
    async (newEnabled: boolean, newRestartHour: number): Promise<boolean> => {
      setIsSaving(true);
      setError(null);

      try {
        const body: UpdateScheduledRestartRequest = {
          enabled: newEnabled,
          restartHour: newRestartHour,
        };

        const response = await fetch('/api/admin/scheduled-restart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update configuration');
        }

        const data: ScheduledRestartConfigResponse = await response.json();
        setEnabled(data.enabled);
        setRestartHour(data.restartHour);

        logger.info('Scheduled restart config updated', {
          enabled: data.enabled,
          restartHour: data.restartHour,
        });

        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Unknown error occurred';
        logger.error('Failed to update scheduled restart config', err as Error);
        setError(message);
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [logger]
  );

  const refresh = useCallback(async (): Promise<void> => {
    await fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return {
    enabled,
    restartHour,
    isLoading,
    isSaving,
    error,
    updateConfig,
    refresh,
  };
}
