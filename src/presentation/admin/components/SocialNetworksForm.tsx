'use client';

import {
  Box,
  Stack,
  VStack,
  HStack,
  Text,
  Heading,
  Field,
  Input,
  Checkbox,
  Spinner,
} from '@chakra-ui/react';
import { toaster } from '@/presentation/shared/components/ui/toaster';
import SaveButton from '@/presentation/shared/components/SaveButton';
import { useState, useEffect } from 'react';
import {
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
} from 'react-icons/fa';
import { SocialNetworkType } from '@/domain/settings/value-objects/SocialNetworkType';

interface SocialNetworkFormData {
  type: SocialNetworkType;
  url: string;
  label: string;
  enabled: boolean;
}

export default function SocialNetworksForm() {
  const [socialNetworks, setSocialNetworks] = useState<SocialNetworkFormData[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const getIcon = (type: SocialNetworkType) => {
    const icons = {
      [SocialNetworkType.INSTAGRAM]: FaInstagram,
      [SocialNetworkType.FACEBOOK]: FaFacebook,
      [SocialNetworkType.LINKEDIN]: FaLinkedin,
      [SocialNetworkType.EMAIL]: FaEnvelope,
      [SocialNetworkType.PHONE]: FaPhone,
    };
    return icons[type];
  };

  const getDefaultLabel = (type: SocialNetworkType): string => {
    const labels = {
      [SocialNetworkType.INSTAGRAM]: 'Instagram',
      [SocialNetworkType.FACEBOOK]: 'Facebook',
      [SocialNetworkType.LINKEDIN]: 'LinkedIn',
      [SocialNetworkType.EMAIL]: 'Email',
      [SocialNetworkType.PHONE]: 'Phone',
    };
    return labels[type];
  };

  const getUrlPlaceholder = (type: SocialNetworkType): string => {
    const placeholders = {
      [SocialNetworkType.INSTAGRAM]: 'https://instagram.com/username',
      [SocialNetworkType.FACEBOOK]: 'https://facebook.com/page',
      [SocialNetworkType.LINKEDIN]: 'https://linkedin.com/in/profile',
      [SocialNetworkType.EMAIL]: 'mailto:contact@example.com',
      [SocialNetworkType.PHONE]: 'tel:+1234567890',
    };
    return placeholders[type];
  };

  useEffect(() => {
    fetchSocialNetworks();
  }, []);

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

  const handleUrlChange = (type: SocialNetworkType, url: string) => {
    setSocialNetworks((prev) =>
      prev.map((sn) => (sn.type === type ? { ...sn, url } : sn))
    );
  };

  const handleLabelChange = (type: SocialNetworkType, label: string) => {
    setSocialNetworks((prev) =>
      prev.map((sn) => (sn.type === type ? { ...sn, label } : sn))
    );
  };

  const handleEnabledChange = (type: SocialNetworkType, checked: unknown) => {
    // Chakra UI v3 returns { checked: boolean } or boolean directly
    const enabled =
      typeof checked === 'boolean'
        ? checked
        : (checked as { checked: boolean })?.checked || false;

    setSocialNetworks((prev) =>
      prev.map((sn) => (sn.type === type ? { ...sn, enabled } : sn))
    );
  };

  const validateForm = (): boolean => {
    for (const sn of socialNetworks) {
      if (sn.enabled) {
        if (!sn.url.trim()) {
          toaster.create({
            title: 'Validation Error',
            description: `${getDefaultLabel(sn.type)} URL is required when enabled`,
            type: 'error',
            duration: 3000,
          });
          return false;
        }

        if (!sn.label.trim()) {
          toaster.create({
            title: 'Validation Error',
            description: `${getDefaultLabel(sn.type)} label is required when enabled`,
            type: 'error',
            duration: 3000,
          });
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      const requestData = {
        socialNetworks: socialNetworks.map((sn) => ({
          type: sn.type,
          url: sn.url,
          label: sn.label,
          enabled: sn.enabled,
        })),
      };

      console.log(
        'Sending data to server:',
        JSON.stringify(requestData, null, 2)
      );

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
      console.error('Save error:', error);
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

  if (isLoading) {
    return (
      <Box
        bg="bg.subtle"
        borderRadius="2xl"
        p={{ base: 4, md: 6 }}
        border="1px solid"
        borderColor="border"
      >
        <VStack align="center" gap={4} py={8}>
          <Spinner size="lg" />
          <Text color="fg.muted">Loading social networks...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <>
      <Box
        bg="bg.subtle"
        borderRadius="2xl"
        p={{ base: 4, md: 6 }}
        border="1px solid"
        borderColor="border"
      >
        <VStack align="start" gap={6}>
          <Heading
            as="h2"
            size={{ base: 'lg', md: 'xl' }}
            color="fg"
            fontWeight="semibold"
          >
            Social Networks
          </Heading>

          <Text color="fg.muted" fontSize={{ base: 'sm', md: 'md' }}>
            Configure your social network links
          </Text>

          <VStack align="start" gap={4} w="full">
            {socialNetworks.map((socialNetwork, index) => {
              const Icon = getIcon(socialNetwork.type);

              return (
                <Box key={socialNetwork.type} w="full">
                  <VStack align="start" gap={3}>
                    <HStack gap={3}>
                      <Icon size={20} color="fg.muted" />
                      <Text fontWeight="medium" color="fg">
                        {getDefaultLabel(socialNetwork.type)}
                      </Text>
                      <Checkbox.Root
                        checked={socialNetwork.enabled}
                        onCheckedChange={(checked) =>
                          handleEnabledChange(socialNetwork.type, checked)
                        }
                      >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label>Enable</Checkbox.Label>
                      </Checkbox.Root>
                    </HStack>

                    <Stack
                      direction={{ base: 'column', md: 'row' }}
                      gap={4}
                      w="full"
                    >
                      <Field.Root w={{ base: 'full', md: '1/2' }}>
                        <Field.Label>URL</Field.Label>
                        <Input
                          value={socialNetwork.url}
                          onChange={(e) =>
                            handleUrlChange(socialNetwork.type, e.target.value)
                          }
                          placeholder={getUrlPlaceholder(socialNetwork.type)}
                          disabled={!socialNetwork.enabled}
                        />
                        <Field.ErrorText />
                      </Field.Root>

                      <Field.Root w={{ base: 'full', md: '1/2' }}>
                        <Field.Label>Label</Field.Label>
                        <Input
                          value={socialNetwork.label}
                          onChange={(e) =>
                            handleLabelChange(
                              socialNetwork.type,
                              e.target.value
                            )
                          }
                          placeholder={getDefaultLabel(socialNetwork.type)}
                          disabled={!socialNetwork.enabled}
                        />
                        <Field.ErrorText />
                      </Field.Root>
                    </Stack>
                  </VStack>

                  {index < socialNetworks.length - 1 && (
                    <Box my={4} h="1px" bg="border" w="full" />
                  )}
                </Box>
              );
            })}
          </VStack>

          <Box w="full">
            <SaveButton
              isLoading={isSaving}
              onClick={handleSubmit}
              width="full"
            >
              Save Changes
            </SaveButton>
          </Box>
        </VStack>
      </Box>
    </>
  );
}
