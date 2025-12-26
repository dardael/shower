'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useHeaderMenuTextColor } from '@/presentation/shared/hooks/useHeaderMenuTextColor';

interface HeaderMenuTextColorContextType {
  headerMenuTextColor: string;
  updateHeaderMenuTextColor: (color: string) => Promise<void>;
  refreshHeaderMenuTextColor: () => Promise<void>;
  isLoading: boolean;
  setHeaderMenuTextColor: (color: string) => void;
}

const HeaderMenuTextColorContext = createContext<
  HeaderMenuTextColorContextType | undefined
>(undefined);

interface HeaderMenuTextColorProviderProps {
  children: ReactNode;
}

export function HeaderMenuTextColorProvider({
  children,
}: HeaderMenuTextColorProviderProps) {
  const headerMenuTextColorData = useHeaderMenuTextColor();

  return (
    <HeaderMenuTextColorContext.Provider value={headerMenuTextColorData}>
      {children}
    </HeaderMenuTextColorContext.Provider>
  );
}

export function useHeaderMenuTextColorContext(): HeaderMenuTextColorContextType {
  const context = useContext(HeaderMenuTextColorContext);
  if (context === undefined) {
    throw new Error(
      'useHeaderMenuTextColorContext must be used within a HeaderMenuTextColorProvider'
    );
  }
  return context;
}
