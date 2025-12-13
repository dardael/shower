'use client';

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from 'react';
import type { ThemeModeValue } from '@/domain/settings/value-objects/ThemeModePreference';

interface ThemeModeContextValue {
  themeMode: ThemeModeValue;
  isForced: boolean;
  forcedMode: 'light' | 'dark' | null;
  shouldShowToggle: boolean;
  isLoading: boolean;
  error: Error | null;
  updateThemeMode: (mode: ThemeModeValue) => Promise<void>;
  refreshThemeMode: () => Promise<void>;
}

const DEFAULT_THEME_MODE: ThemeModeValue = 'user-choice';
const THEME_MODE_STORAGE_KEY = 'shower-theme-mode';
const THEME_MODE_BROADCAST_CHANNEL = 'shower-theme-mode-sync';

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

interface ThemeModeProviderProps {
  children: ReactNode;
}

export function ThemeModeProvider({
  children,
}: ThemeModeProviderProps): React.JSX.Element {
  // Initialize from localStorage if available to prevent flash
  const [themeMode, setThemeMode] = useState<ThemeModeValue>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(THEME_MODE_STORAGE_KEY);
      if (
        stored === 'force-light' ||
        stored === 'force-dark' ||
        stored === 'user-choice'
      ) {
        return stored;
      }
    }
    return DEFAULT_THEME_MODE;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  const isForced = themeMode === 'force-light' || themeMode === 'force-dark';
  const forcedMode =
    themeMode === 'force-light'
      ? 'light'
      : themeMode === 'force-dark'
        ? 'dark'
        : null;
  const shouldShowToggle = themeMode === 'user-choice';

  // Sync to localStorage when themeMode changes
  useEffect(() => {
    if (typeof window !== 'undefined' && !isLoading) {
      localStorage.setItem(THEME_MODE_STORAGE_KEY, themeMode);
    }
  }, [themeMode, isLoading]);

  // Set up BroadcastChannel for cross-tab communication
  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      broadcastChannelRef.current = new BroadcastChannel(
        THEME_MODE_BROADCAST_CHANNEL
      );

      broadcastChannelRef.current.onmessage = (event) => {
        const mode = event.data as ThemeModeValue;
        if (
          mode === 'force-light' ||
          mode === 'force-dark' ||
          mode === 'user-choice'
        ) {
          setThemeMode(mode);
        }
      };

      return () => {
        broadcastChannelRef.current?.close();
      };
    }
    return undefined;
  }, []);

  const fetchThemeMode = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/settings', {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const mode = data.themeMode as ThemeModeValue;
      if (
        mode === 'force-light' ||
        mode === 'force-dark' ||
        mode === 'user-choice'
      ) {
        setThemeMode(mode);
      } else {
        setThemeMode(DEFAULT_THEME_MODE);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch theme mode')
      );
      // Keep the localStorage value on error instead of resetting
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateThemeMode = useCallback(
    async (mode: ThemeModeValue): Promise<void> => {
      const previousMode = themeMode;
      // Optimistic update
      setThemeMode(mode);
      setError(null);

      // Broadcast to other tabs immediately
      broadcastChannelRef.current?.postMessage(mode);

      try {
        const response = await fetch('/api/settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ themeMode: mode }),
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (err) {
        // Rollback on error
        setThemeMode(previousMode);
        // Broadcast rollback to other tabs
        broadcastChannelRef.current?.postMessage(previousMode);
        setError(
          err instanceof Error ? err : new Error('Failed to update theme mode')
        );
        throw err;
      }
    },
    [themeMode]
  );

  useEffect(() => {
    fetchThemeMode();
  }, [fetchThemeMode]);

  const value: ThemeModeContextValue = {
    themeMode,
    isForced,
    forcedMode,
    shouldShowToggle,
    isLoading,
    error,
    updateThemeMode,
    refreshThemeMode: fetchThemeMode,
  };

  return (
    <ThemeModeContext.Provider value={value}>
      {children}
    </ThemeModeContext.Provider>
  );
}

export function useThemeModeConfig(): ThemeModeContextValue {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error(
      'useThemeModeConfig must be used within a ThemeModeProvider'
    );
  }
  return context;
}
