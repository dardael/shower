'use client';

import { createContext, useContext, ReactNode } from 'react';
import { ThemeColorToken } from '@/domain/settings/constants/ThemeColorPalette';
import { useThemeColor } from '@/presentation/shared/hooks/useThemeColor';

interface ThemeColorContextType {
  themeColor: ThemeColorToken;
  updateThemeColor: (color: ThemeColorToken) => Promise<void>;
  refreshThemeColor: () => Promise<void>;
  isLoading: boolean;
  setThemeColor: (color: ThemeColorToken) => void;
}

const ThemeColorContext = createContext<ThemeColorContextType | undefined>(
  undefined
);

interface ThemeColorProviderProps {
  children: ReactNode;
}

export function ThemeColorProvider({ children }: ThemeColorProviderProps) {
  const themeColorData = useThemeColor();

  return (
    <ThemeColorContext.Provider value={themeColorData}>
      {children}
    </ThemeColorContext.Provider>
  );
}

export function useThemeColorContext(): ThemeColorContextType {
  const context = useContext(ThemeColorContext);
  if (context === undefined) {
    throw new Error(
      'useThemeColorContext must be used within a ThemeColorProvider'
    );
  }
  return context;
}

// Global event listener for theme color changes
export function listenToThemeColorChanges(
  callback: (color: ThemeColorToken) => void
) {
  const handleThemeColorChange = (event: CustomEvent<ThemeColorToken>) => {
    callback(event.detail);
  };

  window.addEventListener(
    'themeColorChanged',
    handleThemeColorChange as EventListener
  );

  return () => {
    window.removeEventListener(
      'themeColorChanged',
      handleThemeColorChange as EventListener
    );
  };
}

// Global event dispatcher for theme color changes
export function dispatchThemeColorChange(color: ThemeColorToken) {
  const event = new CustomEvent('themeColorChanged', { detail: color });
  window.dispatchEvent(event);
}
