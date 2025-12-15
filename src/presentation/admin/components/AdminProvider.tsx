'use client';

import { type ReactNode } from 'react';
import { AdminLoadingScreen } from '@/presentation/admin/components/AdminLoadingScreen';

export interface AdminProviderProps {
  children: ReactNode;
}

/**
 * Provider wrapper for admin pages that includes the loading screen.
 * This should wrap admin content inside the main Provider to have access to all contexts.
 */
export function AdminProvider({ children }: AdminProviderProps): ReactNode {
  return <AdminLoadingScreen>{children}</AdminLoadingScreen>;
}
