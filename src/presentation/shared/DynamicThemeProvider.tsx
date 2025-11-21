'use client';

import { createContext, useContext, ReactNode } from 'react';
import { ThemeColorToken } from '@/domain/settings/constants/ThemeColorPalette';
import { useThemeColorContext } from '@/presentation/shared/contexts/ThemeColorContext';

interface DynamicThemeContextType {
  themeColor: ThemeColorToken;
  setThemeColor: (color: ThemeColorToken) => void;
}

const DynamicThemeContext = createContext<DynamicThemeContextType | undefined>(
  undefined
);

interface DynamicThemeProviderProps {
  children: ReactNode;
  initialThemeColor?: ThemeColorToken;
}

export function DynamicThemeProvider({
  children,
}: Omit<DynamicThemeProviderProps, 'initialThemeColor'>) {
  const { themeColor, setThemeColor } = useThemeColorContext();

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
