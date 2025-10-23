'use client';

import { useState, useEffect, useCallback } from 'react';
import { toaster } from '@/presentation/shared/components/ui/toaster';
import { SocialNetworkType } from '@/domain/settings/value-objects/SocialNetworkType';
import { SOCIAL_NETWORK_CONFIG } from '@/domain/settings/constants/SocialNetworkConfig';

export interface SocialNetworkFormData {
  type: SocialNetworkType;
  url: string;
  label: string;
  enabled: boolean;
}

export interface UseSocialNetworksFormReturn {
  socialNetworks: SocialNetworkFormData[];
  isLoading: boolean;
  isSaving: boolean;
  fetchSocialNetworks: () => Promise<void>;
  handleUrlChange: (type: SocialNetworkType, url: string) => void;
  handleLabelChange: (type: SocialNetworkType, label: string) => void;
  handleEnabledChange: (
    type: SocialNetworkType,
    details: { checked: string | boolean }
  ) => void;
  handleSubmit: () => Promise<void>;
  validateForm: () => boolean;
}

export function useSocialNetworksForm(): UseSocialNetworksFormReturn {
  const [socialNetworks, setSocialNetworks] = useState<SocialNetworkFormData[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchSocialNetworks = async () => {
    try {
      const response = await fetch('/api/settings/social-networks');
      const data = await response.json();

      if (data.success) {
        setSocialNetworks(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch social networks');
      }
    } catch {
      toaster.create({
        title: 'Error',
        description: 'Failed to load social networks',
        type: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlChange = useCallback(
    (type: SocialNetworkType, url: string) => {
      setSocialNetworks((prev) =>
        prev.map((socialNetwork) =>
          socialNetwork.type === type
            ? { ...socialNetwork, url }
            : socialNetwork
        )
      );
    },
    []
  );

  const handleLabelChange = useCallback(
    (type: SocialNetworkType, label: string) => {
      setSocialNetworks((prev) =>
        prev.map((socialNetwork) =>
          socialNetwork.type === type
            ? { ...socialNetwork, label }
            : socialNetwork
        )
      );
    },
    []
  );

  const handleEnabledChange = useCallback(
    (type: SocialNetworkType, details: { checked: string | boolean }) => {
      const enabled =
        typeof details.checked === 'boolean'
          ? details.checked
          : details.checked === 'true';

      setSocialNetworks((prev) =>
        prev.map((socialNetwork) =>
          socialNetwork.type === type
            ? { ...socialNetwork, enabled }
            : socialNetwork
        )
      );
    },
    []
  );

  const getConfig = useCallback(
    (type: SocialNetworkType) => SOCIAL_NETWORK_CONFIG[type],
    []
  );

  const validateForm = useCallback((): boolean => {
    for (const socialNetwork of socialNetworks) {
      if (socialNetwork.enabled) {
        if (!socialNetwork.url.trim()) {
          toaster.create({
            title: 'Validation Error',
            description: `${getConfig(socialNetwork.type).label} URL is required when enabled`,
            type: 'error',
            duration: 3000,
          });
          return false;
        }

        if (!socialNetwork.label.trim()) {
          toaster.create({
            title: 'Validation Error',
            description: `${getConfig(socialNetwork.type).label} label is required when enabled`,
            type: 'error',
            duration: 3000,
          });
          return false;
        }
      }
    }
    return true;
  }, [socialNetworks, getConfig]);

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      const requestData = {
        socialNetworks: socialNetworks.map((socialNetwork) => ({
          type: socialNetwork.type,
          url: socialNetwork.url,
          label: socialNetwork.label,
          enabled: socialNetwork.enabled,
        })),
      };

      const response = await fetch('/api/settings/social-networks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (data.success) {
        toaster.create({
          title: 'Success',
          description: 'Social networks updated successfully',
          type: 'success',
          duration: 3000,
        });
      } else {
        throw new Error(data.error || 'Failed to update social networks');
      }
    } catch (error) {
      toaster.create({
        title: 'Error',
        description: `Failed to update social networks: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error',
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchSocialNetworks();
  }, []);

  return {
    socialNetworks,
    isLoading,
    isSaving,
    fetchSocialNetworks,
    handleUrlChange,
    handleLabelChange,
    handleEnabledChange,
    handleSubmit,
    validateForm,
  };
}
