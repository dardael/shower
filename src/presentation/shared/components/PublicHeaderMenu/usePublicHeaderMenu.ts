'use client';

import { useState, useEffect } from 'react';
import type { PublicMenuItem } from './types';

interface UsePublicHeaderMenuReturn {
  menuItems: PublicMenuItem[] | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for fetching menu items data for header
 * Handles loading states and error management
 */
export function usePublicHeaderMenu(): UsePublicHeaderMenuReturn {
  const [menuItems, setMenuItems] = useState<PublicMenuItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMenuItems(): Promise<void> {
      try {
        setIsLoading(true);
        setError(null);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch('/api/public/menu', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Failed to fetch menu items: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch menu items');
        }

        setMenuItems(data.data || []);
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

    fetchMenuItems();
  }, []);

  return {
    menuItems,
    isLoading,
    error,
  };
}
