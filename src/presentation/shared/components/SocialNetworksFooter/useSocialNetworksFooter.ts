'use client';

import { useState, useEffect } from 'react';
import { container } from 'tsyringe';
import { Logger } from '@/application/shared/Logger';
import type { PublicSocialNetwork } from './types';

interface UseSocialNetworksFooterReturn {
  socialNetworks: PublicSocialNetwork[] | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for fetching social networks data for the footer
 * Handles loading states and error management
 */
export function useSocialNetworksFooter(): UseSocialNetworksFooterReturn {
  const [socialNetworks, setSocialNetworks] = useState<
    PublicSocialNetwork[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const logger = container.resolve<Logger>('Logger');

  useEffect(() => {
    async function fetchSocialNetworks() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/public/social-networks', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

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
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        logger.error('Error fetching social networks', { error: errorMessage });
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
