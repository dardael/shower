'use client';

import { type ReactNode } from 'react';
import { AdminLoadingScreen } from '@/presentation/admin/components/AdminLoadingScreen';
import { SellingConfigProvider } from '@/presentation/shared/contexts/SellingConfigContext';
import { HeaderMenuTextColorProvider } from '@/presentation/shared/contexts/HeaderMenuTextColorContext';

export interface AdminProviderProps {
  children: ReactNode;
}

/**
 * Provider wrapper for admin pages that includes the loading screen.
 * This should wrap admin content inside the main Provider to have access to all contexts.
 */
export function AdminProvider({ children }: AdminProviderProps): ReactNode {
  return (
    <SellingConfigProvider>
      <HeaderMenuTextColorProvider>
        <AdminLoadingScreen>{children}</AdminLoadingScreen>
      </HeaderMenuTextColorProvider>
    </SellingConfigProvider>
  );
}
