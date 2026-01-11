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
import { ThemeColorSelector } from '@/presentation/admin/components/ThemeColorSelector';
import { BackgroundColorSelector } from '@/presentation/admin/components/BackgroundColorSelector';
import { HeaderMenuTextColorSelector } from '@/presentation/admin/components/HeaderMenuTextColorSelector';
import { FontSelector } from '@/presentation/admin/components/FontSelector';
import { ThemeModeSelector } from '@/presentation/admin/components/ThemeModeSelector';
import { SellingToggleSelector } from '@/presentation/admin/components/SellingToggleSelector';
import { AppointmentToggleSelector } from '@/presentation/admin/components/AppointmentToggleSelector';
import { LoaderBackgroundColorSelector } from '@/presentation/admin/components/LoaderBackgroundColorSelector';
import { useDynamicTheme } from '@/presentation/shared/DynamicThemeProvider';
import { useThemeColorContext } from '@/presentation/shared/contexts/ThemeColorContext';
import { useHeaderMenuTextColorContext } from '@/presentation/shared/contexts/HeaderMenuTextColorContext';
import { useBackgroundColorContext } from '@/presentation/shared/contexts/BackgroundColorContext';
import { useWebsiteFontContext } from '@/presentation/shared/contexts/WebsiteFontContext';
import { useThemeModeConfig } from '@/presentation/shared/hooks/useThemeModeConfig';
import { useSellingConfig } from '@/presentation/shared/contexts/SellingConfigContext';
import { useAppointmentModule } from '@/presentation/shared/contexts/AppointmentModuleContext';
import { useIconManagement } from '@/presentation/admin/hooks/useIconManagement';
import { useToastNotifications } from '@/presentation/admin/hooks/useToastNotifications';

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
  const { showToast } = useToastNotifications();
  const [name, setName] = useState(initialName);
  const [nameSaving, setNameSaving] = useState(false);
  const initialNameRef = useRef(initialName);
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
    headerMenuTextColor,
    updateHeaderMenuTextColor: updateHeaderMenuTextColorWithCache,
    isLoading: headerMenuTextColorLoading,
  } = useHeaderMenuTextColorContext();
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
  const {
    isEnabled: appointmentEnabled,
    toggle: toggleAppointment,
    isLoading: appointmentLoading,
  } = useAppointmentModule();
  const [loaderBackgroundColor, setLoaderBackgroundColor] = useState<
    string | null
  >(null);
  const [loaderBackgroundColorSaving, setLoaderBackgroundColorSaving] =
    useState(false);
  const [currentIcon, setCurrentIcon] = useState<ImageData | null>(null);
  const [customLoader, setCustomLoader] = useState<CustomLoaderData | null>(
    null
  );
  const [loaderLoading, setLoaderLoading] = useState(false);
  const loaderInputRef = useRef<HTMLInputElement>(null);

  const fetchWebsiteSettingsRef = useRef(async () => {});

  fetchWebsiteSettingsRef.current = async () => {
    try {
      // Fetch all settings in parallel for better performance
      const [
        settingsResponse,
        iconResponse,
        loaderResponse,
        loaderBgColorResponse,
      ] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/settings/icon'),
        fetch('/api/settings/loader'),
        fetch('/api/settings/loader-background-color'),
      ]);

      // Handle website settings (name and theme color)
      if (settingsResponse.ok) {
        const settingsData = await settingsResponse.json();
        if (settingsData.name) {
          setName(settingsData.name);
          initialNameRef.current = settingsData.name;
        }
        if (settingsData.themeColor) {
          setThemeColor(settingsData.themeColor);
        }
        if (settingsData.backgroundColor) {
          setBackgroundColor(settingsData.backgroundColor);
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
        } else {
          setCurrentIcon(null);
        }
      } else {
        setCurrentIcon(null);
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

      // Handle loader background color
      if (loaderBgColorResponse.ok) {
        const loaderBgColorData = await loaderBgColorResponse.json();
        setLoaderBackgroundColor(loaderBgColorData.value || null);
      }
    } catch {
      showToast(
        'Échec du chargement des paramètres du site. Veuillez réessayer plus tard.',
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

  const saveWebsiteName = async (newName: string) => {
    if (newName === initialNameRef.current) {
      return;
    }

    if (!newName.trim()) {
      showToast('Le nom du site ne peut pas être vide', 'error');
      setName(initialNameRef.current);
      return;
    }

    setNameSaving(true);
    try {
      const response = await fetch('/api/settings/name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      });

      const data = await response.json();

      if (response.ok) {
        initialNameRef.current = newName;
        showToast('Nom du site mis à jour avec succès !', 'success');
      } else {
        showToast(
          data.error || 'Échec de la mise à jour du nom du site',
          'error'
        );
        setName(initialNameRef.current);
      }
    } catch {
      showToast(
        'Une erreur est survenue lors de la mise à jour du nom du site',
        'error'
      );
      setName(initialNameRef.current);
    } finally {
      setNameSaving(false);
    }
  };

  const handleNameBlur = () => {
    saveWebsiteName(name);
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
        'Type de fichier invalide. Seuls les fichiers GIF, MP4 et WebM sont autorisés.',
        'error'
      );
      return;
    }

    const maxSize = CUSTOM_LOADER_MAX_SIZE_BYTES;
    if (file.size > maxSize) {
      showToast('La taille du fichier doit être inférieure à 10 Mo.', 'error');
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
        showToast(
          'Animation de chargement personnalisée téléchargée avec succès !',
          'success'
        );
      } else {
        showToast(
          data.error || "Échec du téléchargement de l'animation personnalisée",
          'error'
        );
      }
    } catch {
      showToast(
        "Une erreur est survenue lors du téléchargement de l'animation personnalisée",
        'error'
      );
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
        showToast(
          'Animation de chargement personnalisée supprimée avec succès !',
          'success'
        );
      } else {
        const data = await response.json();
        showToast(
          data.error || "Échec de la suppression de l'animation personnalisée",
          'error'
        );
      }
    } catch {
      showToast(
        "Une erreur est survenue lors de la suppression de l'animation personnalisée",
        'error'
      );
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
          Paramètres du site
        </Heading>
        <Text
          fontSize={{ base: 'sm', md: 'md' }}
          color="fg.muted"
          lineHeight="relaxed"
        >
          Configurez les informations de base et l&apos;apparence de votre site
        </Text>
      </VStack>

      <Stack gap={{ base: 4, md: 6 }}>
        <Field.Root>
          <Field.Label
            htmlFor="name"
            fontSize="sm"
            fontWeight="semibold"
            color="fg"
            mb={2}
          >
            Nom du site
          </Field.Label>
          <Input
            id="name"
            data-testid="website-name-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleNameBlur}
            placeholder="Entrez le nom de votre site"
            maxLength={50}
            required
            disabled={nameSaving}
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
            Ce nom apparaît dans les onglets du navigateur et les résultats de
            recherche. Maximum 50 caractères.
          </Field.HelperText>
        </Field.Root>

        <Field.Root>
          <Field.Label fontSize="sm" fontWeight="semibold" color="fg" mb={2}>
            Icône du site
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
            Téléchargez un favicon qui apparaît dans les onglets du navigateur.
            Taille recommandée : 32x32 pixels pour le format ICO ou 16x16 à
            32x32 pixels pour les autres formats.
          </Field.HelperText>
        </Field.Root>

        <ThemeModeSelector
          selectedMode={themeMode}
          onModeChange={async (mode) => {
            try {
              await updateThemeModeConfig(mode);
            } catch {
              showToast('Échec de la mise à jour du mode de thème', 'error');
            }
          }}
          disabled={false}
          isLoading={themeModeLoading}
        />

        <ThemeColorSelector
          selectedColor={themeColor}
          onColorChange={async (color) => {
            try {
              await updateThemeColorWithCache(color);
              setThemeColor(color);
            } catch {
              // Error is already handled by the hook
            }
          }}
          disabled={false}
        />

        <BackgroundColorSelector
          selectedColor={backgroundColor}
          onColorChange={async (color) => {
            try {
              await updateBackgroundColorWithCache(color);
              setBackgroundColor(color);
            } catch {
              // Error is already handled by the hook
            }
          }}
          disabled={false}
          isLoading={backgroundColorLoading}
        />

        <HeaderMenuTextColorSelector
          selectedColor={headerMenuTextColor}
          onColorChange={async (color) => {
            try {
              await updateHeaderMenuTextColorWithCache(color);
            } catch {
              showToast(
                'Échec de la mise à jour de la couleur du texte du menu',
                'error'
              );
            }
          }}
          disabled={false}
          isLoading={headerMenuTextColorLoading}
        />

        <FontSelector
          selectedFont={websiteFont}
          onFontChange={async (font) => {
            try {
              await updateWebsiteFontWithCache(font);
            } catch {
              showToast('Échec de la mise à jour de la police', 'error');
            }
          }}
          disabled={false}
          isLoading={fontLoading}
        />

        <SellingToggleSelector
          sellingEnabled={sellingEnabled}
          onToggle={async (enabled) => {
            try {
              await updateSellingEnabledConfig(enabled);
            } catch {
              showToast('Échec de la mise à jour du mode vente', 'error');
            }
          }}
          disabled={false}
          isLoading={sellingLoading}
        />

        <AppointmentToggleSelector
          appointmentEnabled={appointmentEnabled}
          onToggle={async (enabled) => {
            try {
              if (enabled !== appointmentEnabled) {
                await toggleAppointment();
              }
            } catch {
              showToast(
                'Échec de la mise à jour du module rendez-vous',
                'error'
              );
            }
          }}
          disabled={false}
          isLoading={appointmentLoading}
        />

        <Field.Root>
          <Field.Label fontSize="sm" fontWeight="semibold" color="fg" mb={2}>
            Animation de chargement
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
                <Text color="fg.muted">Traitement en cours...</Text>
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
                      Remplacer
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      colorPalette="red"
                      onClick={handleLoaderDelete}
                      disabled={loaderLoading}
                    >
                      <FiTrash2 />
                      Supprimer
                    </Button>
                  </HStack>
                </HStack>
              </VStack>
            ) : (
              <VStack gap={3} py={2}>
                <Text fontSize="sm" color="fg.muted" textAlign="center">
                  Aucune animation personnalisée configurée. Utilisation du
                  spinner par défaut.
                </Text>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => loaderInputRef.current?.click()}
                  disabled={loaderLoading}
                >
                  <FiUpload />
                  Télécharger une animation
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
            Téléchargez un GIF ou une vidéo (MP4, WebM) pour remplacer le
            spinner de chargement par défaut. Taille maximale : 10 Mo.
          </Field.HelperText>
        </Field.Root>

        <LoaderBackgroundColorSelector
          selectedColor={loaderBackgroundColor}
          onColorChange={async (color) => {
            setLoaderBackgroundColorSaving(true);
            try {
              const response = await fetch(
                '/api/settings/loader-background-color',
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ value: color }),
                }
              );
              if (response.ok) {
                setLoaderBackgroundColor(color);
                showToast(
                  'Couleur de fond du loader mise à jour avec succès !',
                  'success'
                );
              } else {
                showToast(
                  'Échec de la mise à jour de la couleur de fond du loader',
                  'error'
                );
              }
            } catch {
              showToast(
                'Échec de la mise à jour de la couleur de fond du loader',
                'error'
              );
            } finally {
              setLoaderBackgroundColorSaving(false);
            }
          }}
          disabled={false}
          isLoading={loaderBackgroundColorSaving}
        />
      </Stack>
    </Box>
  );
}
