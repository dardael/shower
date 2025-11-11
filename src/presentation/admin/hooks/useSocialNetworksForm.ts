'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { toaster } from '@/presentation/shared/components/ui/toaster';
import { useLogger } from '@/presentation/shared/hooks/useLogger';
import { SocialNetworkType } from '@/domain/settings/value-objects/SocialNetworkType';
import { SOCIAL_NETWORK_CONFIG } from '@/domain/settings/constants/SocialNetworkConfig';
import { useFormState } from './useFormState';

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
  isDirty: boolean;
  hasUnsavedChanges: boolean;
  confirmNavigation: () => boolean;
}

export function useSocialNetworksForm(): UseSocialNetworksFormReturn {
  const [socialNetworks, setSocialNetworks] = useState<SocialNetworkFormData[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const logger = useLogger();

  // Form state management for unsaved changes detection
  const {
    isDirty,
    hasUnsavedChanges,
    updateFieldValue,
    updateInitialValues,
    markAsClean,
    markAsInitialized,
    confirmNavigation,
  } = useFormState({
    initialValues: {
      socialNetworks: [],
    },
    onBeforeUnload: (hasChanges: boolean) => {
      logger.debug('Form before unload check', { hasChanges });
    },
  });

  // Track toast messages to prevent duplicates with proper cleanup
  const toastMessagesRef = useRef<Set<string>>(new Set());
  const toastTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Cleanup function for toast deduplication
  const clearToastMessage = useCallback((message: string) => {
    toastMessagesRef.current.delete(message);
    const timeouts = toastTimeoutsRef.current;
    const timeout = timeouts.get(message);
    if (timeout) {
      clearTimeout(timeout);
      timeouts.delete(message);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    const timeouts = toastTimeoutsRef.current;
    return () => {
      // Clear all pending timeouts when component unmounts
      timeouts.forEach(clearTimeout);
      timeouts.clear();
    };
  }, []);

  const fetchSocialNetworks = useCallback(async () => {
    logger.info('Fetching social networks');
    try {
      const response = await fetch('/api/settings/social-networks');
      const data = await response.json();

      if (data.success) {
        setSocialNetworks(data.data);

        // Update initial values and mark as initialized
        updateInitialValues({ socialNetworks: data.data });
        markAsInitialized();

        logger.info('Social networks fetched successfully', {
          count: data.data.length,
        });
      } else {
        throw new Error(data.error || 'Failed to fetch social networks');
      }
    } catch (error) {
      logger.logErrorWithObject(error, 'Failed to fetch social networks');
      const message = 'Failed to load social networks';
      if (!toastMessagesRef.current.has(message)) {
        toaster.create({
          title: 'Error',
          description: message,
          type: 'error',
          duration: 3000,
        });
        toastMessagesRef.current.add(message);
        const timeout = setTimeout(() => {
          clearToastMessage(message);
        }, 3000);
        toastTimeoutsRef.current.set(message, timeout);
      }
    } finally {
      setIsLoading(false);
    }
  }, [clearToastMessage, logger, updateInitialValues, markAsInitialized]);

  const handleUrlChange = useCallback(
    (type: SocialNetworkType, url: string) => {
      const updatedNetworks = socialNetworks.map((socialNetwork) =>
        socialNetwork.type === type ? { ...socialNetwork, url } : socialNetwork
      );
      setSocialNetworks(updatedNetworks);
      updateFieldValue('socialNetworks', updatedNetworks);
    },
    [socialNetworks, updateFieldValue]
  );

  const handleLabelChange = useCallback(
    (type: SocialNetworkType, label: string) => {
      const updatedNetworks = socialNetworks.map((socialNetwork) =>
        socialNetwork.type === type
          ? { ...socialNetwork, label }
          : socialNetwork
      );
      setSocialNetworks(updatedNetworks);
      updateFieldValue('socialNetworks', updatedNetworks);
    },
    [socialNetworks, updateFieldValue]
  );

  const handleEnabledChange = useCallback(
    (type: SocialNetworkType, details: { checked: string | boolean }) => {
      const enabled =
        typeof details.checked === 'boolean'
          ? details.checked
          : details.checked === 'true';

      const updatedNetworks = socialNetworks.map((socialNetwork) =>
        socialNetwork.type === type
          ? { ...socialNetwork, enabled }
          : socialNetwork
      );
      setSocialNetworks(updatedNetworks);
      updateFieldValue('socialNetworks', updatedNetworks);
    },
    [socialNetworks, updateFieldValue]
  );

  const getConfig = useCallback(
    (type: SocialNetworkType) => SOCIAL_NETWORK_CONFIG[type],
    []
  );

  const validateForm = useCallback((): boolean => {
    for (const socialNetwork of socialNetworks) {
      if (socialNetwork.enabled) {
        if (!socialNetwork.url.trim()) {
          const config = getConfig(socialNetwork.type);
          const message = `${config.label} URL is required when enabled`;
          if (!toastMessagesRef.current.has(message)) {
            toaster.create({
              title: 'Validation Error',
              description: message,
              type: 'error',
              duration: 3000,
            });
            toastMessagesRef.current.add(message);
            const timeout = setTimeout(() => {
              clearToastMessage(message);
            }, 3000);
            toastTimeoutsRef.current.set(message, timeout);
          }
          return false;
        }

        if (!socialNetwork.label.trim()) {
          const config = getConfig(socialNetwork.type);
          const message = `${config.label} label is required when enabled`;
          if (!toastMessagesRef.current.has(message)) {
            toaster.create({
              title: 'Validation Error',
              description: message,
              type: 'error',
              duration: 3000,
            });
            toastMessagesRef.current.add(message);
            const timeout = setTimeout(() => {
              clearToastMessage(message);
            }, 3000);
            toastTimeoutsRef.current.set(message, timeout);
          }
          return false;
        }
      }
    }
    return true;
  }, [socialNetworks, getConfig, clearToastMessage]);

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    logger.info('Updating social networks', { count: socialNetworks.length });
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
        logger.info('Social networks updated successfully');
        markAsClean();
        const message = 'Social networks updated successfully';
        if (!toastMessagesRef.current.has(message)) {
          toaster.create({
            title: 'Success',
            description: message,
            type: 'success',
            duration: 3000,
          });
          toastMessagesRef.current.add(message);
          const timeout = setTimeout(() => {
            clearToastMessage(message);
          }, 3000);
          toastTimeoutsRef.current.set(message, timeout);
        }
      } else {
        throw new Error(data.error || 'Failed to update social networks');
      }
    } catch (error) {
      logger.logErrorWithObject(error, 'Failed to update social networks');
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const message = `Failed to update social networks: ${errorMessage}`;
      if (!toastMessagesRef.current.has(message)) {
        toaster.create({
          title: 'Error',
          description: message,
          type: 'error',
          duration: 3000,
        });
        toastMessagesRef.current.add(message);
        const timeout = setTimeout(() => {
          clearToastMessage(message);
        }, 3000);
        toastTimeoutsRef.current.set(message, timeout);
      }
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchSocialNetworks();
  }, [fetchSocialNetworks]);

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
    isDirty,
    hasUnsavedChanges,
    confirmNavigation,
  };
}
