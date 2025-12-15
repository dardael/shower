'use client';

import { type ReactNode } from 'react';
import { PublicPageLoader } from '@/presentation/shared/components/PublicPageLoader';
import { useAdminLoadState } from '@/presentation/admin/hooks/useAdminLoadState';

export interface AdminLoadingScreenProps {
  children: ReactNode;
}

/**
 * Wrapper component that displays a loading screen while essential admin settings are being fetched.
 * Uses the custom loader if configured, otherwise falls back to the default spinner.
 * Shows error state with retry option if loading times out.
 */
export function AdminLoadingScreen({
  children,
}: AdminLoadingScreenProps): ReactNode {
  const { isLoading, isError, error, customLoader, retry } =
    useAdminLoadState();

  if (isLoading || isError) {
    return (
      <PublicPageLoader
        isLoading={isLoading}
        error={error}
        onRetry={retry}
        customLoader={customLoader}
      />
    );
  }

  return children;
}
