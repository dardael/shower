'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Heading,
  Stack,
  Field,
  Input,
  Text,
  Box,
  VStack,
} from '@chakra-ui/react';
import ImageManager from '@/presentation/shared/components/ImageManager/ImageManager';
import SaveButton from '@/presentation/shared/components/SaveButton';
import { ThemeColorSelector } from '@/presentation/admin/components/ThemeColorSelector';
import { useDynamicTheme } from '@/presentation/shared/DynamicThemeProvider';
import { useFormState } from '@/presentation/admin/hooks/useFormState';
import { useLogger } from '@/presentation/shared/hooks/useLogger';
import { useIconManagement } from '@/presentation/admin/hooks/useIconManagement';
import type { ThemeColorToken } from '@/domain/settings/constants/ThemeColorPalette';

import type { ImageData } from '@/presentation/shared/components/ImageManager/types';

interface WebsiteSettingsFormProps {
  initialName: string;
}

export default function WebsiteSettingsForm({
  initialName,
}: WebsiteSettingsFormProps) {
  const logger = useLogger();
  const [name, setName] = useState(initialName);
  const { themeColor, setThemeColor } = useDynamicTheme();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [currentIcon, setCurrentIcon] = useState<ImageData | null>(null);

  // Form state management for unsaved changes detection
  const {
    updateFieldValue,
    updateInitialValues,
    markAsClean,
    markAsInitialized,
  } = useFormState({
    initialValues: {
      websiteName: initialName || '',
      themeColor: themeColor || '#3182ce',
    },
    onBeforeUnload: (hasChanges: boolean) => {
      logger.debug('Form before unload check', { hasChanges });
    },
  });

  const fetchWebsiteSettings = useCallback(async () => {
    try {
      // Fetch all settings in parallel for better performance
      const [settingsResponse, iconResponse] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/settings/icon'),
      ]);

      const newValues: Record<string, unknown> = {};

      // Handle website settings (name and theme color)
      if (settingsResponse.ok) {
        const settingsData = await settingsResponse.json();
        if (settingsData.name) {
          setName(settingsData.name);
          newValues.name = settingsData.name;
        }
        if (settingsData.themeColor) {
          setThemeColor(settingsData.themeColor);
          newValues.themeColor = settingsData.themeColor;
        }
      }

      // Handle icon data
      if (iconResponse.ok) {
        const iconData = await iconResponse.json();
        if (iconData.icon) {
          const iconDataFormatted = {
            url: iconData.icon.url,
            filename: iconData.icon.filename,
            size: iconData.icon.size,
            format: iconData.icon.format,
          };
          setCurrentIcon(iconDataFormatted);
          newValues.icon = iconDataFormatted;
        } else {
          setCurrentIcon(null);
          newValues.icon = null;
        }
      } else {
        setCurrentIcon(null);
        newValues.icon = null;
      }

      // Update all values at once and mark as initialized
      updateInitialValues({
        websiteName: (newValues.name as string) || '',
        themeColor: (newValues.themeColor as ThemeColorToken) || 'blue',
      });
      markAsInitialized();
    } catch {
      setMessage('Failed to load website settings. Please try again later.');
      setCurrentIcon(null);
    }
  }, [setThemeColor, updateInitialValues, markAsInitialized]);

  useEffect(() => {
    fetchWebsiteSettings();
  }, [fetchWebsiteSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, themeColor }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Website settings updated successfully!');
        markAsClean();
        await fetchWebsiteSettings();
      } else {
        setMessage(data.error || 'Failed to update website name');
      }
    } catch {
      setMessage('An error occurred while updating the website name');
    } finally {
      setLoading(false);
    }
  };

  // Icon management using custom hook
  const {
    iconLoading: iconManagementLoading,
    handleIconUpload,
    handleIconDelete,
    handleIconReplace,
    handleIconValidationError,
    iconConfig,
    iconLabels,
  } = useIconManagement({
    onIconChange: (iconData) => {
      setCurrentIcon(iconData);
      updateFieldValue('icon', iconData);
    },
    onMessage: setMessage,
  });

  return (
    <Box
      bg="bg.subtle"
      borderRadius="2xl"
      border="1px solid"
      borderColor="border"
      p={{ base: 4, sm: 6, md: 8 }}
      boxShadow="sm"
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        bg: 'linear-gradient(90deg, colorPalette.solid, colorPalette.muted)',
        borderRadius: '2xl 2xl 0 0',
      }}
    >
      <VStack align="start" gap={2} mb={{ base: 4, md: 6 }}>
        <Heading
          as="h2"
          size={{ base: 'lg', md: 'xl' }}
          fontWeight="semibold"
          color="fg"
          display="flex"
          alignItems="center"
          gap={3}
        >
          <Box w="8px" h="8px" borderRadius="full" bg="colorPalette.solid" />
          Website Settings
        </Heading>
        <Text
          fontSize={{ base: 'sm', md: 'md' }}
          color="fg.muted"
          lineHeight="relaxed"
        >
          Configure your website&apos;s basic information and appearance
        </Text>
      </VStack>

      <form onSubmit={handleSubmit}>
        <Stack gap={{ base: 4, md: 6 }}>
          <Field.Root>
            <Field.Label
              htmlFor="name"
              fontSize="sm"
              fontWeight="semibold"
              color="fg"
              mb={2}
            >
              Website Name
            </Field.Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                updateFieldValue('name', e.target.value);
              }}
              placeholder="Enter your website name"
              maxLength={50}
              required
              bg="bg.canvas"
              borderColor="border"
              borderWidth="2px"
              borderRadius="lg"
              fontSize={{ base: 'sm', md: 'md' }}
              color="fg"
              _placeholder={{ color: 'fg.muted' }}
              _focus={{
                borderColor: 'colorPalette.solid',
                boxShadow: '0 0 0 3px colorPalette.subtle',
              }}
              _hover={{
                borderColor: 'border.emphasized',
              }}
            />
            <Field.HelperText
              fontSize={{ base: 'xs', md: 'sm' }}
              color="fg.muted"
              mt={2}
            >
              This name appears in browser tabs and search results. Maximum 50
              characters.
            </Field.HelperText>
          </Field.Root>

          <Field.Root>
            <Field.Label fontSize="sm" fontWeight="semibold" color="fg" mb={2}>
              Website Icon
            </Field.Label>
            <Box
              bg="bg.canvas"
              borderColor="border"
              borderWidth="2px"
              borderRadius="lg"
              p={4}
            >
              <ImageManager
                currentImage={currentIcon}
                config={iconConfig}
                labels={iconLabels}
                onImageUpload={handleIconUpload}
                onImageDelete={handleIconDelete}
                onImageReplace={handleIconReplace}
                onValidationError={handleIconValidationError}
                disabled={iconManagementLoading}
                loading={iconManagementLoading}
                showFileSize={true}
                showFormatInfo={true}
                allowDelete={true}
                allowReplace={true}
              />
            </Box>
            <Field.HelperText
              fontSize={{ base: 'xs', md: 'sm' }}
              color="fg.muted"
              mt={2}
            >
              Upload a favicon that appears in browser tabs. Recommended size is
              32x32 pixels for ICO format or 16x16 to 32x32 pixels for other
              formats.
            </Field.HelperText>
          </Field.Root>

          <ThemeColorSelector
            selectedColor={themeColor}
            onColorChange={(color) => {
              setThemeColor(color);
              updateFieldValue('themeColor', color);
            }}
            disabled={loading}
          />

          <Box w="full">
            <SaveButton
              type="submit"
              isLoading={loading}
              loadingText="Updating..."
              width="full"
            >
              Update Website
            </SaveButton>
          </Box>
        </Stack>
      </form>

      {message && (
        <Text
          mt={4}
          fontSize="sm"
          fontWeight="medium"
          px={3}
          py={2}
          borderRadius="md"
          bg={
            message.includes('successfully') ? 'success.subtle' : 'error.subtle'
          }
          color={message.includes('successfully') ? 'success.fg' : 'error.fg'}
          border="1px solid"
          borderColor={
            message.includes('successfully') ? 'success.border' : 'error.border'
          }
        >
          {message}
        </Text>
      )}
    </Box>
  );
}
