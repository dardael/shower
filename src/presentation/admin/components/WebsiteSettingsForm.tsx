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
import { ThemeColorSelector } from './ThemeColorSelector';
import { useDynamicTheme } from '@/presentation/shared/DynamicThemeProvider';

import type {
  ImageData,
  ImageMetadata,
  ImageManagerConfig,
  ImageManagerLabels,
  ValidationError,
} from '@/presentation/shared/components/ImageManager/types';

interface WebsiteSettingsFormProps {
  initialName: string;
}

export default function WebsiteSettingsForm({
  initialName,
}: WebsiteSettingsFormProps) {
  const [name, setName] = useState(initialName);
  const { themeColor, setThemeColor } = useDynamicTheme();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [currentIcon, setCurrentIcon] = useState<ImageData | null>(null);
  const [iconLoading, setIconLoading] = useState(false);

  const fetchWebsiteSettings = useCallback(async () => {
    try {
      // Fetch all settings in parallel for better performance
      const [settingsResponse, iconResponse] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/settings/icon'),
      ]);

      // Handle website settings (name and theme color)
      if (settingsResponse.ok) {
        const settingsData = await settingsResponse.json();
        if (settingsData.name) {
          setName(settingsData.name);
        }
        if (settingsData.themeColor) {
          setThemeColor(settingsData.themeColor);
        }
      }

      // Handle icon data
      if (iconResponse.ok) {
        const iconData = await iconResponse.json();
        if (iconData.icon) {
          setCurrentIcon({
            url: iconData.icon.url,
            filename: iconData.icon.filename,
            size: iconData.icon.size,
            format: iconData.icon.format,
          });
        } else {
          setCurrentIcon(null);
        }
      } else {
        setCurrentIcon(null);
      }
    } catch {
      setMessage('Failed to load website settings. Please try again later.');
      setCurrentIcon(null);
    }
  }, [setThemeColor]);

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

  // Icon management functions
  const handleIconUpload = async (
    file: File,
    metadata: ImageMetadata
  ): Promise<void> => {
    setIconLoading(true);
    try {
      const formData = new FormData();
      formData.append('icon', file);
      formData.append('metadata', JSON.stringify(metadata));

      const response = await fetch('/api/settings/icon', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentIcon({
          url: data.icon.url,
          filename: data.icon.filename,
          size: data.icon.size,
          format: data.icon.format,
        });
        setMessage('Website icon updated successfully!');
      } else {
        throw new Error(data.error || 'Failed to upload icon');
      }
    } catch (error) {
      throw error;
    } finally {
      setIconLoading(false);
    }
  };

  const handleIconDelete = async (): Promise<void> => {
    setIconLoading(true);
    try {
      const response = await fetch('/api/settings/icon', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentIcon(null);
        setMessage('Website icon removed successfully!');
      } else {
        throw new Error(data.error || 'Failed to remove icon');
      }
    } catch (error) {
      throw error;
    } finally {
      setIconLoading(false);
    }
  };

  const handleIconReplace = async (
    file: File,
    metadata: ImageMetadata
  ): Promise<void> => {
    await handleIconUpload(file, metadata);
  };

  const handleIconValidationError = (error: ValidationError): void => {
    setMessage(error.message);
  };

  // Icon manager configuration
  const iconConfig: ImageManagerConfig = {
    acceptedFormats: ['ico', 'png', 'jpg', 'jpeg', 'svg', 'gif', 'webp'],
    maxFileSize: 2 * 1024 * 1024, // 2MB
    previewSize: { width: '64px', height: '64px' },
    aspectRatio: '1:1',
  };

  const iconLabels: ImageManagerLabels = {
    uploadLabel: 'Upload Website Icon',
    uploadHint:
      'Upload a favicon for your website (ICO, PNG, JPG, SVG, GIF, WebP)',
    replaceButton: 'Replace Icon',
    deleteButton: 'Remove Icon',
    dragDropText: 'Drag and drop your icon here',
    sizeLimitText: 'Maximum file size: 2MB',
    formatText: 'Supported formats: ICO, PNG, JPG, SVG, GIF, WebP',
  };

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
        bg: 'linear-gradient(90deg, blue.500, purple.500)',
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
              onChange={(e) => setName(e.target.value)}
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
                colorPalette: 'blue',
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
                disabled={iconLoading}
                loading={iconLoading}
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
            onColorChange={setThemeColor}
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
          bg={message.includes('successfully') ? 'green.subtle' : 'red.subtle'}
          color={message.includes('successfully') ? 'green.fg' : 'red.fg'}
          border="1px solid"
          borderColor={
            message.includes('successfully') ? 'green.border' : 'red.border'
          }
        >
          {message}
        </Text>
      )}
    </Box>
  );
}
