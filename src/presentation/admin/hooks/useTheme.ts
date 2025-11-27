'use client';

import { useCallback, useEffect, useState } from 'react';
import { useColorMode } from '@/presentation/shared/components/ui/color-mode';
import { ThemeMode } from '@/domain/settings/value-objects/ThemeMode';
import { BrowserThemePreference } from '@/domain/settings/entities/BrowserThemePreference';
import { useLogger } from '@/presentation/shared/hooks/useLogger';

/**
 * Theme Hook Interface
 *
 * Defines a contract for theme management functionality.
 * Provides comprehensive theme state and operations.
 */
export interface IThemeManager {
  /**
   * Current active theme mode
   */
  currentTheme: ThemeMode;

  /**
   * Whether theme is currently loading (hydration state)
   */
  isLoading: boolean;

  /**
   * Whether localStorage is available for theme persistence
   */
  isStorageAvailable: boolean;

  /**
   * System detected theme (independent of user preference)
   */
  systemTheme: ThemeMode;

  /**
   * Toggles between light and dark themes
   */
  toggleTheme(): Promise<void>;

  /**
   * Sets a specific theme mode
   * @param theme - The theme mode to set
   */
  setTheme(theme: ThemeMode): Promise<void>;

  /**
   * Resets theme to system preference
   */
  resetToSystemTheme(): Promise<void>;

  /**
   * Gets effective theme considering system preference
   */
  getEffectiveTheme(): ThemeMode;

  /**
   * Checks if current theme is dark
   */
  isDarkMode(): boolean;

  /**
   * Checks if current theme is light
   */
  isLightMode(): boolean;

  /**
   * Checks if using system preference
   */
  isSystemPreference(): boolean;

  /**
   * Checks if theme can be toggled
   */
  canToggle(): boolean;
}

/**
 * Theme Hook
 *
 * Custom hook for managing theme state and operations.
 * Integrates with Chakra UI color mode system and localStorage.
 * Follows React hooks best practices with proper dependency management.
 */
export function useTheme(): IThemeManager {
  const { colorMode, setColorMode } = useColorMode();
  const [isLoading, setIsLoading] = useState(true);
  const [isStorageAvailable, setIsStorageAvailable] = useState(false);
  const [systemTheme, setSystemTheme] = useState<ThemeMode>(ThemeMode.LIGHT);
  const logger = useLogger();

  // Convert Chakra color mode to our ThemeMode
  const toThemeMode = useCallback((mode: string): ThemeMode => {
    return mode === 'dark' ? ThemeMode.DARK : ThemeMode.LIGHT;
  }, []);

  // Get current theme mode from Chakra's color mode
  const currentThemeMode = toThemeMode(colorMode);

  // Convert our ThemeMode to Chakra color mode
  const fromThemeMode = useCallback((mode: ThemeMode): 'light' | 'dark' => {
    return mode === ThemeMode.DARK ? 'dark' : 'light';
  }, []);

  // Detect system theme
  const detectSystemTheme = useCallback(async (): Promise<ThemeMode> => {
    try {
      if (typeof window === 'undefined' || !window.matchMedia) {
        return ThemeMode.LIGHT;
      }

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      return mediaQuery.matches ? ThemeMode.DARK : ThemeMode.LIGHT;
    } catch (error) {
      logger.error('Failed to detect system theme', error as Error);
      return ThemeMode.LIGHT;
    }
  }, [logger]);

  // Check storage availability
  const checkStorageAvailability = useCallback(async (): Promise<boolean> => {
    try {
      if (typeof window === 'undefined') {
        return false;
      }

      const testKey = '__theme_storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      logger.warn(
        'Storage not available for theme persistence',
        error as Error
      );
      return false;
    }
  }, [logger]);

  // Load saved preference
  const loadSavedPreference =
    useCallback(async (): Promise<BrowserThemePreference | null> => {
      try {
        if (typeof window === 'undefined') {
          return null;
        }

        const serialized = localStorage.getItem('shower-admin-theme');
        if (!serialized) {
          return null;
        }

        const data = JSON.parse(serialized);
        return BrowserThemePreference.fromJSON(data);
      } catch (error) {
        logger.error('Failed to load theme preference', error as Error);
        return null;
      }
    }, [logger]);

  // Save preference
  const savePreference = useCallback(
    async (preference: BrowserThemePreference): Promise<void> => {
      try {
        if (typeof window === 'undefined') {
          return;
        }

        const serialized = JSON.stringify(preference.toJSON());
        localStorage.setItem('shower-admin-theme', serialized);
      } catch (error) {
        logger.error('Failed to save theme preference', error as Error);
      }
    },
    [logger]
  );

  // Initialize on mount
  const initializeTheme = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    try {
      const storageAvailable = await checkStorageAvailability();
      setIsStorageAvailable(storageAvailable);

      const detectedSystemTheme = await detectSystemTheme();
      setSystemTheme(detectedSystemTheme);

      let preference: BrowserThemePreference;

      if (storageAvailable) {
        const savedPreference = await loadSavedPreference();
        if (savedPreference) {
          preference = savedPreference;
        } else {
          preference = BrowserThemePreference.createForNewUser(
            ThemeMode.SYSTEM
          );
          await savePreference(preference);
        }
      } else {
        preference = BrowserThemePreference.createForNewUser(ThemeMode.SYSTEM);
      }

      const effectiveTheme = preference.getEffectiveTheme(detectedSystemTheme);
      setColorMode(fromThemeMode(effectiveTheme));

      logger.debug('Theme initialized', { theme: effectiveTheme });
    } catch (error) {
      logger.error('Failed to initialize theme', error as Error);
      setColorMode('light');
      setSystemTheme(ThemeMode.LIGHT);
    } finally {
      setIsLoading(false);
    }
  }, [
    checkStorageAvailability,
    detectSystemTheme,
    loadSavedPreference,
    savePreference,
    setColorMode,
    fromThemeMode,
    logger,
  ]);

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]); // Run only once on mount

  // Get effective theme
  const getEffectiveTheme = useCallback((): ThemeMode => {
    if (currentThemeMode === ThemeMode.SYSTEM) {
      return systemTheme;
    }

    return currentThemeMode;
  }, [currentThemeMode, systemTheme]);

  // Toggle theme
  const toggleTheme = useCallback(async (): Promise<void> => {
    const effectiveMode = getEffectiveTheme();
    const newTheme =
      effectiveMode === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT;

    try {
      setColorMode(fromThemeMode(newTheme));

      if (isStorageAvailable) {
        const preference = BrowserThemePreference.createUserChoice(newTheme);
        setTimeout(async () => {
          try {
            await savePreference(preference);
          } catch (saveError) {
            logger.error('Failed to save theme preference', saveError as Error);
          }
        }, 0);
      }
    } catch (error) {
      logger.error('Failed to toggle theme', error as Error);
    }
  }, [
    getEffectiveTheme,
    isStorageAvailable,
    savePreference,
    logger,
    fromThemeMode,
    setColorMode,
  ]);

  // Set specific theme
  const setTheme = useCallback(
    async (theme: ThemeMode): Promise<void> => {
      try {
        setColorMode(fromThemeMode(theme));

        if (isStorageAvailable) {
          const preference = BrowserThemePreference.createUserChoice(theme);
          await savePreference(preference);
        }
      } catch (error) {
        logger.error('Failed to set theme', error as Error);
      }
    },
    [setColorMode, fromThemeMode, isStorageAvailable, savePreference, logger]
  );

  // Reset to system theme
  const resetToSystemTheme = useCallback(async (): Promise<void> => {
    try {
      const preference = BrowserThemePreference.createForNewUser(systemTheme);
      setColorMode(fromThemeMode(systemTheme));

      if (isStorageAvailable) {
        await savePreference(preference);
      }
    } catch (error) {
      logger.error('Failed to reset theme to system', error as Error);
    }
  }, [
    systemTheme,
    setColorMode,
    fromThemeMode,
    isStorageAvailable,
    savePreference,
    logger,
  ]);

  // Theme state checks
  const isDarkMode = useCallback((): boolean => {
    return getEffectiveTheme() === ThemeMode.DARK;
  }, [getEffectiveTheme]);

  const isLightMode = useCallback((): boolean => {
    return getEffectiveTheme() === ThemeMode.LIGHT;
  }, [getEffectiveTheme]);

  const isSystemPreference = useCallback((): boolean => {
    return currentThemeMode === ThemeMode.SYSTEM;
  }, [currentThemeMode]);

  // Check if theme can be toggled
  const canToggle = useCallback((): boolean => {
    return !isLoading && isStorageAvailable;
  }, [isLoading, isStorageAvailable]);

  return {
    currentTheme: currentThemeMode,
    systemTheme,
    isLoading,
    isStorageAvailable,
    toggleTheme,
    setTheme,
    resetToSystemTheme,
    getEffectiveTheme,
    isDarkMode,
    isLightMode,
    isSystemPreference,
    canToggle,
  };
}
