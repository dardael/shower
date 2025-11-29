'use client';

import { useState, useEffect } from 'react';
import type { PublicMenuItem, PublicLogo } from './types';

interface UsePublicHeaderMenuReturn {
  menuItems: PublicMenuItem[] | null;
  logo: PublicLogo | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for fetching menu items and logo data for header
 * Handles loading states and error management
 */
export function usePublicHeaderMenu(): UsePublicHeaderMenuReturn {
  const [menuItems, setMenuItems] = useState<PublicMenuItem[] | null>(null);
  const [logo, setLogo] = useState<PublicLogo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHeaderData(): Promise<void> {
      try {
        setIsLoading(true);
        setError(null);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const [menuResponse, logoResponse] = await Promise.all([
          fetch('/api/public/menu', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            signal: controller.signal,
          }),
          fetch('/api/public/logo', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            signal: controller.signal,
          }),
        ]);

        clearTimeout(timeoutId);

        if (!menuResponse.ok) {
          throw new Error(`Failed to fetch menu items: ${menuResponse.status}`);
        }

        const menuData = await menuResponse.json();

        if (!menuData.success) {
          throw new Error(menuData.error || 'Failed to fetch menu items');
        }

        setMenuItems(menuData.data || []);

        if (logoResponse.ok) {
          const logoData = await logoResponse.json();
          if (logoData.success && logoData.data) {
            setLogo(logoData.data);
          } else {
            setLogo(null);
          }
        } else {
          setLogo(null);
        }
      } catch (err) {
        let errorMessage = 'Unknown error occurred';

        if (err instanceof Error) {
          if (err.name === 'AbortError') {
            errorMessage = 'Request timeout - please try again';
          } else {
            errorMessage = err.message;
          }
        }

        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHeaderData();
  }, []);

  return {
    menuItems,
    logo,
    isLoading,
    error,
  };
}
