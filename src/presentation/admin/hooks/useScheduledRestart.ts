'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLogger } from '@/presentation/shared/hooks/useLogger';
import type {
  ScheduledRestartConfigResponse,
  UpdateScheduledRestartRequest,
  UpdateScheduledRestartResponse,
} from '@/app/api/admin/scheduled-restart/types';

const DEFAULT_RESTART_HOUR = 3;

export interface IScheduledRestartManager {
  enabled: boolean;
  restartHour: number;
  timezone: string;
  lastRestartAt: string | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  updateConfig: (enabled: boolean, restartHour: number) => Promise<boolean>;
  refresh: () => Promise<void>;
}

export function useScheduledRestart(): IScheduledRestartManager {
  const [enabled, setEnabled] = useState(false);
  const [restartHour, setRestartHour] = useState(DEFAULT_RESTART_HOUR);
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [lastRestartAt, setLastRestartAt] = useState<string | null>(null);
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
      setTimezone(data.timezone);
      setLastRestartAt(data.lastRestartAt);
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
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
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

        const data: UpdateScheduledRestartResponse = await response.json();
        setEnabled(data.enabled);
        setRestartHour(data.restartHour);
        setTimezone(data.timezone);

        logger.info('Scheduled restart config updated', {
          enabled: data.enabled,
          restartHour: data.restartHour,
          timezone: data.timezone,
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
    timezone,
    lastRestartAt,
    isLoading,
    isSaving,
    error,
    updateConfig,
    refresh,
  };
}
