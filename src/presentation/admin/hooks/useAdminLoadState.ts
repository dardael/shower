'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useThemeColorContext } from '@/presentation/shared/contexts/ThemeColorContext';
import { useBackgroundColorContext } from '@/presentation/shared/contexts/BackgroundColorContext';
import { useThemeModeConfig } from '@/presentation/shared/contexts/ThemeModeContext';
import { useWebsiteFontContext } from '@/presentation/shared/contexts/WebsiteFontContext';
import type { CustomLoaderData } from '@/presentation/shared/components/PublicPageLoader';
import { useLoaderBackgroundColorContext } from '@/presentation/shared/contexts/LoaderBackgroundColorContext';

// Minimum display time ensures custom loader is visible even when settings load instantly from cache
const MIN_LOADING_DISPLAY_MS = 1000;

export interface UseAdminLoadStateReturn {
  isLoading: boolean;
  customLoader: CustomLoaderData | null;
  loaderBackgroundColor: string | null;
}

/**
 * Hook that aggregates loading states from all essential admin settings contexts.
 * Fetches custom loader configuration.
 * Only shows the loading screen if a custom loader is configured.
 * Ensures the loader is displayed for at least MIN_LOADING_DISPLAY_MS.
 */
export function useAdminLoadState(): UseAdminLoadStateReturn {
  const { isLoading: themeColorLoading } = useThemeColorContext();
  const { isLoading: backgroundColorLoading } = useBackgroundColorContext();
  const { isLoading: themeModeLoading } = useThemeModeConfig();
  const { isLoading: fontLoading } = useWebsiteFontContext();
  const {
    value: loaderBackgroundColor,
    isLoading: loaderBackgroundColorLoading,
  } = useLoaderBackgroundColorContext();

  const [customLoader, setCustomLoader] = useState<CustomLoaderData | null>(
    null
  );
  const [loaderFetched, setLoaderFetched] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const minTimerStarted = useRef(false);

  const fetchCustomLoader = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch('/api/public/loader');
      if (response.ok) {
        const data = await response.json();
        setCustomLoader(data.loader ?? null);
      } else {
        setCustomLoader(null);
      }
    } catch {
      setCustomLoader(null);
    } finally {
      setLoaderFetched(true);
    }
  }, []);

  useEffect(() => {
    fetchCustomLoader();
  }, [fetchCustomLoader]);

  // Start minimum display timer only once a custom loader is confirmed
  useEffect(() => {
    if (!loaderFetched || !customLoader || minTimerStarted.current) {
      return;
    }
    minTimerStarted.current = true;
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, MIN_LOADING_DISPLAY_MS);
    return () => clearTimeout(timer);
  }, [loaderFetched, customLoader]);

  const settingsLoading =
    themeColorLoading ||
    backgroundColorLoading ||
    themeModeLoading ||
    fontLoading ||
    loaderBackgroundColorLoading;

  // Only show loading screen if a custom loader is configured,
  // and keep it until min time elapsed and settings are done
  const isLoading =
    !loaderFetched ||
    (customLoader !== null && (!minTimeElapsed || settingsLoading));

  return {
    isLoading,
    customLoader,
    loaderBackgroundColor,
  };
}
