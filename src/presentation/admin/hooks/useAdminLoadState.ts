'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useThemeColorContext } from '@/presentation/shared/contexts/ThemeColorContext';
import { useBackgroundColorContext } from '@/presentation/shared/contexts/BackgroundColorContext';
import { useThemeModeConfig } from '@/presentation/shared/contexts/ThemeModeContext';
import { useWebsiteFontContext } from '@/presentation/shared/contexts/WebsiteFontContext';
import type { PageLoadError } from '@/types/page-load-state';
import type { CustomLoaderData } from '@/presentation/shared/components/PublicPageLoader';
import { useLoaderBackgroundColorContext } from '@/presentation/shared/contexts/LoaderBackgroundColorContext';

// Timeout duration for loading - consistent with public side (PublicPageLoader)
const TIMEOUT_MS = 10000;
// Minimum display time ensures custom loader is visible even when settings load instantly from cache
const MIN_LOADING_DISPLAY_MS = 500;

export interface UseAdminLoadStateReturn {
  isLoading: boolean;
  isError: boolean;
  error: PageLoadError | null;
  customLoader: CustomLoaderData | null;
  loaderBackgroundColor: string | null;
  retry: () => void;
}

/**
 * Hook that aggregates loading states from all essential admin settings contexts.
 * Fetches custom loader configuration and provides timeout/error handling.
 */
export function useAdminLoadState(): UseAdminLoadStateReturn {
  const { isLoading: themeColorLoading, refreshThemeColor } =
    useThemeColorContext();
  const { isLoading: backgroundColorLoading, refreshBackgroundColor } =
    useBackgroundColorContext();
  const { isLoading: themeModeLoading, refreshThemeMode } =
    useThemeModeConfig();
  const { isLoading: fontLoading, refreshWebsiteFont } =
    useWebsiteFontContext();
  const {
    value: loaderBackgroundColor,
    isLoading: loaderBackgroundColorLoading,
    refreshValue: refreshLoaderBackgroundColor,
  } = useLoaderBackgroundColorContext();

  const [customLoader, setCustomLoader] = useState<CustomLoaderData | null>(
    null
  );
  const [loaderFetched, setLoaderFetched] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [error, setError] = useState<PageLoadError | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const hasShownLoader = useRef(false);

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

  // Ensure minimum display time for loading screen on first load
  useEffect(() => {
    if (!hasShownLoader.current) {
      hasShownLoader.current = true;
      const timer = setTimeout(() => {
        setMinTimeElapsed(true);
      }, MIN_LOADING_DISPLAY_MS);
      return () => clearTimeout(timer);
    } else {
      setMinTimeElapsed(true);
    }
  }, []);

  // Settings are loading if any context is still loading
  const settingsLoading =
    themeColorLoading ||
    backgroundColorLoading ||
    themeModeLoading ||
    fontLoading ||
    loaderBackgroundColorLoading;

  // Show loading screen until:
  // 1. Custom loader is fetched
  // 2. AND minimum display time has elapsed (so user can see the loader)
  // 3. AND settings are done loading
  const isLoading = !loaderFetched || !minTimeElapsed || settingsLoading;

  useEffect(() => {
    if (!isLoading) {
      setTimedOut(false);
      setError(null);
      return;
    }

    const timeout = setTimeout(() => {
      if (isLoading) {
        setTimedOut(true);
        setError({
          message: 'Loading timed out. Please try again.',
          failedSources: [],
          isTimeout: true,
          timestamp: Date.now(),
        });
      }
    }, TIMEOUT_MS);

    return (): void => {
      clearTimeout(timeout);
    };
  }, [isLoading]);

  const retry = useCallback((): void => {
    setError(null);
    setTimedOut(false);
    refreshThemeColor();
    refreshBackgroundColor();
    refreshThemeMode();
    refreshWebsiteFont();
    refreshLoaderBackgroundColor();
    fetchCustomLoader();
  }, [
    refreshThemeColor,
    refreshBackgroundColor,
    refreshThemeMode,
    refreshWebsiteFont,
    refreshLoaderBackgroundColor,
    fetchCustomLoader,
  ]);

  return {
    isLoading: isLoading && !timedOut,
    isError: timedOut,
    error,
    customLoader,
    loaderBackgroundColor,
    retry,
  };
}
