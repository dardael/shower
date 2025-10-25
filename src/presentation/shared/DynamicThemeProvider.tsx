'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { ThemeColorToken } from '@/domain/settings/constants/ThemeColorPalette';

interface DynamicThemeContextType {
  themeColor: ThemeColorToken;
  setThemeColor: (color: ThemeColorToken) => void;
}

const DynamicThemeContext = createContext<DynamicThemeContextType | undefined>(
  undefined
);

interface DynamicThemeProviderProps {
  children: ReactNode;
  initialThemeColor: ThemeColorToken;
}

export function DynamicThemeProvider({
  children,
  initialThemeColor,
}: DynamicThemeProviderProps) {
  const [themeColor, setThemeColor] =
    useState<ThemeColorToken>(initialThemeColor);

  const value: DynamicThemeContextType = {
    themeColor,
    setThemeColor,
  };

  return (
    <DynamicThemeContext.Provider value={value}>
      {children}
    </DynamicThemeContext.Provider>
  );
}

export function useDynamicTheme(): DynamicThemeContextType {
  const context = useContext(DynamicThemeContext);
  if (context === undefined) {
    throw new Error(
      'useDynamicTheme must be used within a DynamicThemeProvider'
    );
  }
  return context;
}
