'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useWebsiteFont } from '@/presentation/shared/hooks/useWebsiteFont';

interface WebsiteFontContextType {
  websiteFont: string;
  updateWebsiteFont: (font: string) => Promise<void>;
  refreshWebsiteFont: () => Promise<void>;
  isLoading: boolean;
  setWebsiteFont: (font: string) => void;
}

const WebsiteFontContext = createContext<WebsiteFontContextType | undefined>(
  undefined
);

interface WebsiteFontProviderProps {
  children: ReactNode;
}

export function WebsiteFontProvider({ children }: WebsiteFontProviderProps) {
  const websiteFontData = useWebsiteFont();

  return (
    <WebsiteFontContext.Provider value={websiteFontData}>
      {children}
    </WebsiteFontContext.Provider>
  );
}

export function useWebsiteFontContext(): WebsiteFontContextType {
  const context = useContext(WebsiteFontContext);
  if (context === undefined) {
    throw new Error(
      'useWebsiteFontContext must be used within a WebsiteFontProvider'
    );
  }
  return context;
}
