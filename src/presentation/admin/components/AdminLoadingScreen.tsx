'use client';

import { type ReactNode } from 'react';
import { PublicPageLoader } from '@/presentation/shared/components/PublicPageLoader';
import { useAdminLoadState } from '@/presentation/admin/hooks/useAdminLoadState';

export interface AdminLoadingScreenProps {
  children: ReactNode;
}

/**
 * Wrapper component that displays a loading screen while essential admin settings are being fetched.
 * Only shows the loading screen if a custom loader is configured.
 * Ensures the loader is displayed for at least 1 second.
 */
export function AdminLoadingScreen({
  children,
}: AdminLoadingScreenProps): ReactNode {
  const { isLoading, customLoader, loaderBackgroundColor } =
    useAdminLoadState();

  if (isLoading && customLoader) {
    return (
      <PublicPageLoader
        isLoading={isLoading}
        error={null}
        customLoader={customLoader}
        backgroundColor={loaderBackgroundColor}
      />
    );
  }

  return children;
}
