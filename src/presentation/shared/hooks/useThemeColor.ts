'use client';

import { useCallback, useEffect, useState } from 'react';
import { ThemeColorToken } from '@/domain/settings/constants/ThemeColorPalette';
import { ThemeColorStorage } from '@/presentation/shared/utils/ThemeColorStorage';

interface UseThemeColorResult {
  themeColor: ThemeColorToken;
  updateThemeColor: (color: ThemeColorToken) => Promise<void>;
  refreshThemeColor: () => Promise<void>;
  isLoading: boolean;
  setThemeColor: (color: ThemeColorToken) => void;
}

export function useThemeColor(): UseThemeColorResult {
  const [themeColor, setThemeColor] = useState<ThemeColorToken>('blue');
  const [isLoading, setIsLoading] = useState(false);

  // Update theme color via API
  const updateThemeColor = useCallback(
    async (color: ThemeColorToken): Promise<void> => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/settings/theme-color', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ themeColor: color }),
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Save to localStorage and dispatch update immediately
        ThemeColorStorage.setThemeColor(color);
        setThemeColor(color);
      } catch {
        throw new Error('Failed to update theme color');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Refresh theme color (with cache busting)
  const refreshThemeColor = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const newColor = await ThemeColorStorage.syncWithServer();
      setThemeColor(newColor);
    } catch {
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize theme color on mount
  useEffect(() => {
    let isMounted = true;

    const initializeThemeColor = async () => {
      try {
        // First try to get from localStorage for immediate UI
        const storedColor = ThemeColorStorage.getThemeColor();
        if (isMounted) {
          setThemeColor(storedColor);
        }

        // Then sync with server to get latest
        const serverColor = await ThemeColorStorage.syncWithServer();
        if (isMounted) {
          setThemeColor(serverColor);
        }
      } catch {}
    };

    initializeThemeColor();

    return () => {
      isMounted = false;
    };
  }, []);

  // Listen for theme color updates from other components/tabs
  useEffect(() => {
    const unsubscribe = ThemeColorStorage.listenToUpdate((color) => {
      setThemeColor(color);
    });

    return unsubscribe;
  }, []);

  return {
    themeColor,
    updateThemeColor,
    refreshThemeColor,
    isLoading,
    setThemeColor: (color: ThemeColorToken) => {
      setThemeColor(color);
    },
  };
}
