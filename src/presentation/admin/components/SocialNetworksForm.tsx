'use client';

import { useMemo } from 'react';
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
import SaveButton from '@/presentation/shared/components/SaveButton';
import {
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
} from 'react-icons/fa';
import { SocialNetworkType } from '@/domain/settings/value-objects/SocialNetworkType';
import { useSocialNetworksForm } from '@/presentation/admin/hooks/useSocialNetworksForm';

export default function SocialNetworksForm() {
  const {
    socialNetworks,
    isLoading,
    isSaving,
    handleUrlChange,
    handleLabelChange,
    handleEnabledChange,
    handleSubmit,
  } = useSocialNetworksForm();

  const iconMap = useMemo(
    () => ({
      [SocialNetworkType.INSTAGRAM]: FaInstagram,
      [SocialNetworkType.FACEBOOK]: FaFacebook,
      [SocialNetworkType.LINKEDIN]: FaLinkedin,
      [SocialNetworkType.EMAIL]: FaEnvelope,
      [SocialNetworkType.PHONE]: FaPhone,
    }),
    []
  );

  const labelMap = useMemo(
    () => ({
      [SocialNetworkType.INSTAGRAM]: 'Instagram',
      [SocialNetworkType.FACEBOOK]: 'Facebook',
      [SocialNetworkType.LINKEDIN]: 'LinkedIn',
      [SocialNetworkType.EMAIL]: 'Email',
      [SocialNetworkType.PHONE]: 'Phone',
    }),
    []
  );

  const placeholderMap = useMemo(
    () => ({
      [SocialNetworkType.INSTAGRAM]: 'https://instagram.com/username',
      [SocialNetworkType.FACEBOOK]: 'https://facebook.com/page',
      [SocialNetworkType.LINKEDIN]: 'https://linkedin.com/in/profile',
      [SocialNetworkType.EMAIL]: 'mailto:contact@example.com',
      [SocialNetworkType.PHONE]: 'tel:+1234567890',
    }),
    []
  );

  const getIcon = (type: SocialNetworkType) => iconMap[type];
  const getDefaultLabel = (type: SocialNetworkType): string => labelMap[type];
  const getUrlPlaceholder = (type: SocialNetworkType): string =>
    placeholderMap[type];

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
                        data-testid={`checkbox-${socialNetwork.type.toLowerCase()}`}
                        checked={socialNetwork.enabled}
                        onCheckedChange={(checked) =>
                          handleEnabledChange(socialNetwork.type, checked)
                        }
                      >
                        <Checkbox.HiddenInput
                          data-testid={`checkbox-input-${socialNetwork.type.toLowerCase()}`}
                        />
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
