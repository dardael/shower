'use client';

import { useCallback, useEffect, useState } from 'react';
import { ThemeColorToken } from '@/domain/settings/constants/ThemeColorPalette';
import { BackgroundColorStorage } from '@/presentation/shared/utils/BackgroundColorStorage';

interface UseBackgroundColorResult {
  backgroundColor: ThemeColorToken;
  updateBackgroundColor: (color: ThemeColorToken) => Promise<void>;
  refreshBackgroundColor: () => Promise<void>;
  isLoading: boolean;
  setBackgroundColor: (color: ThemeColorToken) => void;
}

export function useBackgroundColor(): UseBackgroundColorResult {
  const [backgroundColor, setBackgroundColor] =
    useState<ThemeColorToken>('blue');
  const [isLoading, setIsLoading] = useState(false);

  // Update background color via API
  const updateBackgroundColor = useCallback(
    async (color: ThemeColorToken): Promise<void> => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ backgroundColor: color }),
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Save to localStorage and dispatch update immediately
        BackgroundColorStorage.setBackgroundColor(color);
        setBackgroundColor(color);
      } catch {
        throw new Error('Failed to update background color');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Refresh background color (with cache busting)
  const refreshBackgroundColor = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const newColor = await BackgroundColorStorage.syncWithServer();
      setBackgroundColor(newColor);
    } catch {
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize background color on mount
  useEffect(() => {
    let isMounted = true;

    const initializeBackgroundColor = async (): Promise<void> => {
      try {
        // First try to get from localStorage for immediate UI
        const storedColor = BackgroundColorStorage.getBackgroundColor();
        if (isMounted) {
          setBackgroundColor(storedColor);
        }

        // Then sync with server to get latest
        const serverColor = await BackgroundColorStorage.syncWithServer();
        if (isMounted) {
          setBackgroundColor(serverColor);
        }
      } catch {}
    };

    initializeBackgroundColor();

    return () => {
      isMounted = false;
    };
  }, []);

  // Listen for background color updates from other components/tabs
  useEffect(() => {
    const unsubscribe = BackgroundColorStorage.listenToUpdate((color) => {
      setBackgroundColor(color);
    });

    return unsubscribe;
  }, []);

  return {
    backgroundColor,
    updateBackgroundColor,
    refreshBackgroundColor,
    isLoading,
    setBackgroundColor: (color: ThemeColorToken) => {
      setBackgroundColor(color);
    },
  };
}
