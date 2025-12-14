'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { PublicPageLoader } from '@/presentation/shared/components/PublicPageLoader';
import { PublicPageLayout } from '@/presentation/shared/components/PublicPageLayout/PublicPageLayout';
import { usePublicPageData } from '@/presentation/shared/hooks/usePublicPageData';
import { useThemeColor } from '@/presentation/shared/hooks/useThemeColor';

/**
 * Client-side public page component with loading state
 * Coordinates fetching of menu, footer, and page content
 * Displays loading indicator until all data is loaded
 */
export function PublicPageClient(): React.ReactElement {
  const params = useParams();
  const slug = params?.slug as string;

  // Use custom hook to manage loading state and data fetching
  const { state, data, retry } = usePublicPageData(slug);
  const { themeColor } = useThemeColor();

  // Show loading indicator while data is being fetched
  if (state.isLoading || state.error) {
    return (
      <PublicPageLoader
        isLoading={state.isLoading}
        error={state.error}
        onRetry={retry}
      />
    );
  }

  // Show complete page only when all data is loaded
  if (state.isComplete && data) {
    return (
      <PublicPageLayout data={data} themeColor={themeColor} logo={data.logo} />
    );
  }

  // Fallback (should not reach here in normal operation)
  return <PublicPageLoader isLoading={true} error={null} />;
}
