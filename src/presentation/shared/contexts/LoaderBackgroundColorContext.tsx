'use client';

import { createContext, useContext, type ReactNode } from 'react';
import {
  useLoaderBackgroundColor,
  type UseLoaderBackgroundColorResult,
} from '@/presentation/shared/hooks/useLoaderBackgroundColor';

const LoaderBackgroundColorContext = createContext<
  UseLoaderBackgroundColorResult | undefined
>(undefined);

export interface LoaderBackgroundColorProviderProps {
  children: ReactNode;
}

export function LoaderBackgroundColorProvider({
  children,
}: LoaderBackgroundColorProviderProps): React.ReactElement {
  const data = useLoaderBackgroundColor();
  return (
    <LoaderBackgroundColorContext.Provider value={data}>
      {children}
    </LoaderBackgroundColorContext.Provider>
  );
}

export function useLoaderBackgroundColorContext(): UseLoaderBackgroundColorResult {
  const context = useContext(LoaderBackgroundColorContext);
  if (context === undefined) {
    throw new Error(
      'useLoaderBackgroundColorContext must be used within LoaderBackgroundColorProvider'
    );
  }
  return context;
}
