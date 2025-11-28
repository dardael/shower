'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { PublicHeaderMenu } from './PublicHeaderMenu';
import { usePublicHeaderMenu } from './usePublicHeaderMenu';
import { useThemeColor } from '@/presentation/shared/hooks/useThemeColor';

/**
 * PublicHeaderMenuContainer component
 * Handles data fetching and state management for public header menu
 * Integrates with theme color context
 * Renders loading states and error handling
 */
export function PublicHeaderMenuContainer(): React.ReactElement | null {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  const { menuItems, error } = usePublicHeaderMenu();
  const { themeColor } = useThemeColor();

  if (isAdmin || error) {
    return null;
  }

  return (
    <PublicHeaderMenu
      menuItems={menuItems ?? undefined}
      colorPalette={themeColor}
    />
  );
}
