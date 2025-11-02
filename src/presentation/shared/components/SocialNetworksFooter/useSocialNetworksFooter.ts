'use client';

import { useState, useEffect } from 'react';
import type { PublicSocialNetwork } from './types';

interface UseSocialNetworksFooterReturn {
  socialNetworks: PublicSocialNetwork[] | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for fetching social networks data for footer
 * Handles loading states and error management
 * Note: Admin route detection is handled by container component
 */
export function useSocialNetworksFooter(): UseSocialNetworksFooterReturn {
  const [socialNetworks, setSocialNetworks] = useState<
    PublicSocialNetwork[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSocialNetworks() {
      try {
        setIsLoading(true);
        setError(null);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch('/api/public/social-networks', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch social networks: ${response.status}`
          );
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch social networks');
        }

        setSocialNetworks(data.data || []);
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

    fetchSocialNetworks();
  }, []);

  return {
    socialNetworks,
    isLoading,
    error,
  };
}
