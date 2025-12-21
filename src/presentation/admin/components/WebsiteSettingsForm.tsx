'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Heading,
  Stack,
  Field,
  Input,
  Text,
  Box,
  VStack,
  HStack,
  Button,
  Spinner,
} from '@chakra-ui/react';
import { FiTrash2, FiUpload } from 'react-icons/fi';
import ImageManager from '@/presentation/shared/components/ImageManager/ImageManager';
import Image from 'next/image';
import SaveButton from '@/presentation/shared/components/SaveButton';
import { ThemeColorSelector } from '@/presentation/admin/components/ThemeColorSelector';
import { BackgroundColorSelector } from '@/presentation/admin/components/BackgroundColorSelector';
import { FontSelector } from '@/presentation/admin/components/FontSelector';
import { ThemeModeSelector } from '@/presentation/admin/components/ThemeModeSelector';
import { SellingToggleSelector } from '@/presentation/admin/components/SellingToggleSelector';
import { useDynamicTheme } from '@/presentation/shared/DynamicThemeProvider';
import { useThemeColorContext } from '@/presentation/shared/contexts/ThemeColorContext';
import { useBackgroundColorContext } from '@/presentation/shared/contexts/BackgroundColorContext';
import { useWebsiteFontContext } from '@/presentation/shared/contexts/WebsiteFontContext';
import { useThemeModeConfig } from '@/presentation/shared/hooks/useThemeModeConfig';
import { useSellingConfig } from '@/presentation/shared/contexts/SellingConfigContext';
import { useFormState } from '@/presentation/admin/hooks/useFormState';
import { useLogger } from '@/presentation/shared/hooks/useLogger';
import { useIconManagement } from '@/presentation/admin/hooks/useIconManagement';
import { useToastNotifications } from '@/presentation/admin/hooks/useToastNotifications';
import type { ThemeColorToken } from '@/domain/settings/constants/ThemeColorPalette';

import { CUSTOM_LOADER_MAX_SIZE_BYTES } from '@/domain/settings/constants/SettingKeys';

import type { ImageData } from '@/presentation/shared/components/ImageManager/types';

interface CustomLoaderData {
  url: string;
  metadata: {
    type: 'gif' | 'video';
    filename: string;
    mimeType: string;
    size: number;
    uploadedAt: string;
  };
}

interface WebsiteSettingsFormProps {
  initialName: string;
}

export default function WebsiteSettingsForm({
  initialName,
}: WebsiteSettingsFormProps) {
  const logger = useLogger();
  const { showToast } = useToastNotifications();
  const [name, setName] = useState(initialName);
  const { themeColor, setThemeColor } = useDynamicTheme();
  const { updateThemeColor: updateThemeColorWithCache } =
    useThemeColorContext();
  const {
    backgroundColor,
    updateBackgroundColor: updateBackgroundColorWithCache,
    setBackgroundColor,
    isLoading: backgroundColorLoading,
  } = useBackgroundColorContext();
  const {
    websiteFont,
    updateWebsiteFont: updateWebsiteFontWithCache,
    isLoading: fontLoading,
  } = useWebsiteFontContext();
  const {
    themeMode,
    updateThemeMode: updateThemeModeConfig,
    isLoading: themeModeLoading,
  } = useThemeModeConfig();
  const {
    sellingEnabled,
    updateSellingEnabled: updateSellingEnabledConfig,
    isLoading: sellingLoading,
  } = useSellingConfig();
  const [loading, setLoading] = useState(false);
  const [currentIcon, setCurrentIcon] = useState<ImageData | null>(null);
  const [customLoader, setCustomLoader] = useState<CustomLoaderData | null>(
    null
  );
  const [loaderLoading, setLoaderLoading] = useState(false);
  const loaderInputRef = useRef<HTMLInputElement>(null);

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

  const fetchWebsiteSettingsRef = useRef(async () => {});

  fetchWebsiteSettingsRef.current = async () => {
    try {
      // Fetch all settings in parallel for better performance
      const [settingsResponse, iconResponse, loaderResponse] =
        await Promise.all([
          fetch('/api/settings'),
          fetch('/api/settings/icon'),
          fetch('/api/settings/loader'),
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
        if (settingsData.backgroundColor) {
          setBackgroundColor(settingsData.backgroundColor);
          newValues.backgroundColor = settingsData.backgroundColor;
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

      // Handle custom loader data
      if (loaderResponse.ok) {
        const loaderData = await loaderResponse.json();
        if (loaderData.loader) {
          setCustomLoader(loaderData.loader);
        } else {
          setCustomLoader(null);
        }
      } else {
        setCustomLoader(null);
      }

      // Update all values at once and mark as initialized
      updateInitialValues({
        websiteName: (newValues.name as string) || '',
        themeColor: (newValues.themeColor as ThemeColorToken) || 'blue',
      });
      markAsInitialized();
    } catch {
      showToast(
        'Failed to load website settings. Please try again later.',
        'error'
      );
      setCurrentIcon(null);
    }
  };

  const fetchWebsiteSettings = useCallback(() => {
    return fetchWebsiteSettingsRef.current();
  }, []);

  useEffect(() => {
    fetchWebsiteSettings();
  }, [fetchWebsiteSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, themeColor, backgroundColor }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Website settings updated successfully!', 'success');
        markAsClean();
        // Refresh theme color and background color to invalidate cache
        await updateThemeColorWithCache(themeColor);
        await updateBackgroundColorWithCache(backgroundColor);
        await fetchWebsiteSettings();
      } else {
        showToast(data.error || 'Failed to update website name', 'error');
      }
    } catch {
      showToast('An error occurred while updating the website name', 'error');
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
    onMessage: (message: string) => showToast(message, 'error'),
    onSuccess: (message: string) => showToast(message, 'success'),
  });

  // Custom loader handlers
  const handleLoaderUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/gif', 'video/mp4', 'video/webm'];
    if (!allowedTypes.includes(file.type)) {
      showToast(
        'Invalid file type. Only GIF, MP4, and WebM files are allowed.',
        'error'
      );
      return;
    }

    const maxSize = CUSTOM_LOADER_MAX_SIZE_BYTES;
    if (file.size > maxSize) {
      showToast('File size must be less than 10MB.', 'error');
      return;
    }

    setLoaderLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/settings/loader', {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setCustomLoader(data.loader);
        showToast('Custom loader uploaded successfully!', 'success');
      } else {
        showToast(data.error || 'Failed to upload custom loader', 'error');
      }
    } catch {
      showToast('An error occurred while uploading the custom loader', 'error');
    } finally {
      setLoaderLoading(false);
      if (loaderInputRef.current) {
        loaderInputRef.current.value = '';
      }
    }
  };

  const handleLoaderDelete = async () => {
    setLoaderLoading(true);
    try {
      const response = await fetch('/api/settings/loader', {
        method: 'DELETE',
      });

      if (response.ok) {
        setCustomLoader(null);
        showToast('Custom loader removed successfully!', 'success');
      } else {
        const data = await response.json();
        showToast(data.error || 'Failed to remove custom loader', 'error');
      }
    } catch {
      showToast('An error occurred while removing the custom loader', 'error');
    } finally {
      setLoaderLoading(false);
    }
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
              data-testid="website-name-input"
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
                disableSuccessToast={true}
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

          <ThemeModeSelector
            selectedMode={themeMode}
            onModeChange={async (mode) => {
              try {
                await updateThemeModeConfig(mode);
              } catch {
                showToast('Failed to update theme mode', 'error');
              }
            }}
            disabled={loading}
            isLoading={themeModeLoading}
          />

          <ThemeColorSelector
            selectedColor={themeColor}
            onColorChange={async (color) => {
              try {
                await updateThemeColorWithCache(color);
                setThemeColor(color);
                updateFieldValue('themeColor', color);
              } catch {
                // Error is already handled by the hook
              }
            }}
            disabled={loading}
          />

          <BackgroundColorSelector
            selectedColor={backgroundColor}
            onColorChange={async (color) => {
              try {
                await updateBackgroundColorWithCache(color);
                setBackgroundColor(color);
                updateFieldValue('backgroundColor', color);
              } catch {
                // Error is already handled by the hook
              }
            }}
            disabled={loading}
            isLoading={backgroundColorLoading}
          />

          <FontSelector
            selectedFont={websiteFont}
            onFontChange={async (font) => {
              try {
                await updateWebsiteFontWithCache(font);
                updateFieldValue('websiteFont', font);
              } catch {
                showToast('Failed to update website font', 'error');
              }
            }}
            disabled={loading}
            isLoading={fontLoading}
          />

          <SellingToggleSelector
            sellingEnabled={sellingEnabled}
            onToggle={async (enabled) => {
              try {
                await updateSellingEnabledConfig(enabled);
              } catch {
                showToast('Failed to update selling mode', 'error');
              }
            }}
            disabled={loading}
            isLoading={sellingLoading}
          />

          <Field.Root>
            <Field.Label fontSize="sm" fontWeight="semibold" color="fg" mb={2}>
              Loading Animation
            </Field.Label>
            <Box
              bg="bg.canvas"
              borderColor="border"
              borderWidth="2px"
              borderRadius="lg"
              p={4}
            >
              {loaderLoading ? (
                <HStack justify="center" py={4}>
                  <Spinner size="md" />
                  <Text color="fg.muted">Processing...</Text>
                </HStack>
              ) : customLoader ? (
                <VStack align="stretch" gap={4}>
                  <Box
                    borderRadius="md"
                    overflow="hidden"
                    bg="bg.subtle"
                    p={4}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minH="120px"
                  >
                    {customLoader.metadata.type === 'gif' ? (
                      <Image
                        src={customLoader.url}
                        alt="Custom loader preview"
                        width={100}
                        height={100}
                        style={{
                          maxHeight: '100px',
                          maxWidth: '100%',
                          objectFit: 'contain',
                        }}
                        unoptimized
                        loader={({ src }) => src}
                      />
                    ) : (
                      <video
                        src={customLoader.url}
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{
                          maxHeight: '100px',
                          maxWidth: '100%',
                        }}
                      />
                    )}
                  </Box>
                  <HStack justify="space-between" align="center">
                    <VStack align="start" gap={0}>
                      <Text fontSize="sm" fontWeight="medium" color="fg">
                        {customLoader.metadata.filename}
                      </Text>
                      <Text fontSize="xs" color="fg.muted">
                        {customLoader.metadata.type.toUpperCase()} -{' '}
                        {(customLoader.metadata.size / 1024).toFixed(1)} KB
                      </Text>
                    </VStack>
                    <HStack gap={2}>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => loaderInputRef.current?.click()}
                        disabled={loaderLoading}
                      >
                        <FiUpload />
                        Replace
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        colorPalette="red"
                        onClick={handleLoaderDelete}
                        disabled={loaderLoading}
                      >
                        <FiTrash2 />
                        Remove
                      </Button>
                    </HStack>
                  </HStack>
                </VStack>
              ) : (
                <VStack gap={3} py={2}>
                  <Text fontSize="sm" color="fg.muted" textAlign="center">
                    No custom loader configured. Using default spinner.
                  </Text>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => loaderInputRef.current?.click()}
                    disabled={loaderLoading}
                  >
                    <FiUpload />
                    Upload Custom Loader
                  </Button>
                </VStack>
              )}
              <input
                ref={loaderInputRef}
                type="file"
                accept=".gif,.mp4,.webm,image/gif,video/mp4,video/webm"
                onChange={handleLoaderUpload}
                style={{ display: 'none' }}
              />
            </Box>
            <Field.HelperText
              fontSize={{ base: 'xs', md: 'sm' }}
              color="fg.muted"
              mt={2}
            >
              Upload a GIF or video (MP4, WebM) to replace the default loading
              spinner. Maximum file size is 10MB.
            </Field.HelperText>
          </Field.Root>

          <Box w="full">
            <SaveButton
              type="submit"
              data-testid="save-website-button"
              isLoading={loading}
              loadingText="Updating..."
              width="full"
            >
              Update Website
            </SaveButton>
          </Box>
        </Stack>
      </form>
    </Box>
  );
}
