'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CustomLoaderData } from '@/presentation/shared/components/PublicPageLoader';
import { useLoaderBackgroundColorContext } from '@/presentation/shared/contexts/LoaderBackgroundColorContext';

const MIN_LOADING_DISPLAY_MS = 3000;

export interface UseAdminLoadStateReturn {
  isLoading: boolean;
  customLoader: CustomLoaderData | null;
  loaderBackgroundColor: string | null;
}

/**
 * Hook that fetches custom loader configuration.
 * Only shows the loading screen if a custom loader is configured.
 * Starts the timer immediately on mount so the loader appears before
 * the page content, ensuring no flash of unstyled content.
 * Ensures the loader is displayed for at least MIN_LOADING_DISPLAY_MS.
 */
export function useAdminLoadState(): UseAdminLoadStateReturn {
  const { value: loaderBackgroundColor } = useLoaderBackgroundColorContext();

  const [customLoader, setCustomLoader] = useState<CustomLoaderData | null>(
    null
  );
  const [loaderFetched, setLoaderFetched] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  // Start minimum display timer immediately on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, MIN_LOADING_DISPLAY_MS);
    return () => clearTimeout(timer);
  }, []);

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

  // Show loader until both the fetch is done AND the min time has elapsed.
  // If no custom loader is configured, stop loading immediately after fetch.
  const isLoading =
    !loaderFetched || (customLoader !== null && !minTimeElapsed);

  return {
    isLoading,
    customLoader,
    loaderBackgroundColor,
  };
}
