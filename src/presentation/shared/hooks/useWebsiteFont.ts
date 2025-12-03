'use client';

import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_FONT } from '@/domain/settings/constants/AvailableFonts';
import { WebsiteFontStorage } from '@/presentation/shared/utils/WebsiteFontStorage';

interface UseWebsiteFontResult {
  websiteFont: string;
  updateWebsiteFont: (font: string) => Promise<void>;
  refreshWebsiteFont: () => Promise<void>;
  isLoading: boolean;
  setWebsiteFont: (font: string) => void;
}

export function useWebsiteFont(): UseWebsiteFontResult {
  const [websiteFont, setWebsiteFont] = useState<string>(DEFAULT_FONT);
  const [isLoading, setIsLoading] = useState(false);

  // Update website font via API
  const updateWebsiteFont = useCallback(async (font: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/settings/website-font', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ websiteFont: font }),
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Save to localStorage and dispatch update immediately
      WebsiteFontStorage.setWebsiteFont(font);
      setWebsiteFont(font);
    } catch {
      throw new Error('Failed to update website font');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh website font (with cache busting)
  const refreshWebsiteFont = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const newFont = await WebsiteFontStorage.syncWithServer();
      setWebsiteFont(newFont);
    } catch {
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize website font on mount
  useEffect(() => {
    let isMounted = true;

    const initializeWebsiteFont = async () => {
      try {
        // First try to get from localStorage for immediate UI
        const storedFont = WebsiteFontStorage.getWebsiteFont();
        if (isMounted) {
          setWebsiteFont(storedFont);
        }

        // Then sync with server to get latest
        const serverFont = await WebsiteFontStorage.syncWithServer();
        if (isMounted) {
          setWebsiteFont(serverFont);
        }
      } catch {}
    };

    initializeWebsiteFont();

    return () => {
      isMounted = false;
    };
  }, []);

  // Listen for website font updates from other components/tabs
  useEffect(() => {
    const unsubscribe = WebsiteFontStorage.listenToUpdate((font) => {
      setWebsiteFont(font);
    });

    return unsubscribe;
  }, []);

  return {
    websiteFont,
    updateWebsiteFont,
    refreshWebsiteFont,
    isLoading,
    setWebsiteFont: (font: string) => {
      setWebsiteFont(font);
    },
  };
}
