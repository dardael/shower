'use client';

import { createContext, useContext, ReactNode } from 'react';
import { ThemeColorToken } from '@/domain/settings/constants/ThemeColorPalette';
import { useBackgroundColor } from '@/presentation/shared/hooks/useBackgroundColor';

interface BackgroundColorContextType {
  backgroundColor: ThemeColorToken;
  updateBackgroundColor: (color: ThemeColorToken) => Promise<void>;
  refreshBackgroundColor: () => Promise<void>;
  isLoading: boolean;
  setBackgroundColor: (color: ThemeColorToken) => void;
}

const BackgroundColorContext = createContext<
  BackgroundColorContextType | undefined
>(undefined);

interface BackgroundColorProviderProps {
  children: ReactNode;
}

export function BackgroundColorProvider({
  children,
}: BackgroundColorProviderProps): React.JSX.Element {
  const backgroundColorData = useBackgroundColor();

  return (
    <BackgroundColorContext.Provider value={backgroundColorData}>
      {children}
    </BackgroundColorContext.Provider>
  );
}

export function useBackgroundColorContext(): BackgroundColorContextType {
  const context = useContext(BackgroundColorContext);
  if (context === undefined) {
    throw new Error(
      'useBackgroundColorContext must be used within a BackgroundColorProvider'
    );
  }
  return context;
}

// Global event listener for background color changes
export function listenToBackgroundColorChanges(
  callback: (color: ThemeColorToken) => void
): () => void {
  const handleBackgroundColorChange = (event: CustomEvent<ThemeColorToken>) => {
    callback(event.detail);
  };

  window.addEventListener(
    'backgroundColorChanged',
    handleBackgroundColorChange as EventListener
  );

  return () => {
    window.removeEventListener(
      'backgroundColorChanged',
      handleBackgroundColorChange as EventListener
    );
  };
}

// Global event dispatcher for background color changes
export function dispatchBackgroundColorChange(color: ThemeColorToken): void {
  const event = new CustomEvent('backgroundColorChanged', { detail: color });
  window.dispatchEvent(event);
}
