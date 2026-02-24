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
 */
export function PublicPageClient(): React.ReactElement {
  const params = useParams();
  const slug = params?.slug as string;

  // Use custom hook to manage loading state and data fetching
  const {
    state,
    data,
    customLoader,
    loaderBackgroundColor,
    loaderChecked,
    minLoaderElapsed,
  } = usePublicPageData(slug);
  const { themeColor } = useThemeColor();

  // Show loading indicator while data is being fetched or minimum loader time hasn't elapsed
  if (state.isLoading || !minLoaderElapsed) {
    return (
      <PublicPageLoader
        isLoading={true}
        error={null}
        customLoader={customLoader}
        backgroundColor={loaderBackgroundColor}
        loaderChecked={loaderChecked}
      />
    );
  }

  // Show complete page only when all data is loaded and minimum loader time has elapsed
  if (state.isComplete && data) {
    return (
      <PublicPageLayout
        data={data}
        themeColor={themeColor}
        logo={data.logo}
        heroData={data.heroData}
      />
    );
  }

  // Fallback (should not reach here in normal operation)
  return (
    <PublicPageLoader
      isLoading={true}
      error={null}
      customLoader={customLoader}
      backgroundColor={loaderBackgroundColor}
      loaderChecked={loaderChecked}
    />
  );
}
