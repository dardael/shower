'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Field,
  Heading,
  Stack,
  Text,
  HStack,
  Button,
  Spinner,
  VStack,
} from '@chakra-ui/react';
import NextImage from 'next/image';
import { FiUpload, FiTrash2 } from 'react-icons/fi';
import { useToastNotifications } from '@/presentation/admin/hooks/useToastNotifications';
import { HeroTextEditor } from './HeroTextEditor';

interface HeroMediaInfo {
  url: string;
  type: 'image' | 'video';
}

interface HeroSectionConfigProps {
  menuItemId: string;
  initialMediaUrl: string | null;
  initialMediaType: string | null;
  initialHeroText: string | null;
  onHeroTextChange: (text: string) => void;
}

const HERO_MEDIA_MAX_SIZE_BYTES = 20 * 1024 * 1024;
const ALLOWED_MEDIA_TYPES = [
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/webm',
];

export function HeroSectionConfig({
  menuItemId,
  initialMediaUrl,
  initialMediaType,
  initialHeroText,
  onHeroTextChange,
}: HeroSectionConfigProps): React.ReactElement {
  const [heroMedia, setHeroMedia] = useState<HeroMediaInfo | null>(
    initialMediaUrl && initialMediaType
      ? { url: initialMediaUrl, type: initialMediaType as 'image' | 'video' }
      : null
  );
  const [heroText, setHeroText] = useState<string>(initialHeroText || '');
  const [mediaLoading, setMediaLoading] = useState(false);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToastNotifications();

  const handleMediaUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!ALLOWED_MEDIA_TYPES.includes(file.type)) {
        showToast(
          'Type de fichier invalide. Seuls les fichiers PNG, JPG, GIF, WebP, MP4 et WebM sont autorisés.',
          'error'
        );
        return;
      }

      if (file.size > HERO_MEDIA_MAX_SIZE_BYTES) {
        showToast(
          'La taille du fichier doit être inférieure à 20 Mo.',
          'error'
        );
        return;
      }

      setMediaLoading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(
          `/api/settings/pages/${menuItemId}/hero-media`,
          {
            method: 'PUT',
            body: formData,
          }
        );

        const data = await response.json();

        if (response.ok) {
          setHeroMedia({
            url: data.heroMediaUrl,
            type: data.heroMediaType,
          });
          showToast(
            'Média de la section héro téléchargé avec succès !',
            'success'
          );
        } else {
          showToast(data.error || 'Échec du téléchargement du média', 'error');
        }
      } catch {
        showToast(
          'Une erreur est survenue lors du téléchargement du média',
          'error'
        );
      } finally {
        setMediaLoading(false);
        if (mediaInputRef.current) {
          mediaInputRef.current.value = '';
        }
      }
    },
    [menuItemId, showToast]
  );

  const handleMediaDelete = useCallback(async (): Promise<void> => {
    setMediaLoading(true);
    try {
      const response = await fetch(
        `/api/settings/pages/${menuItemId}/hero-media`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        setHeroMedia(null);
        showToast('Média de la section héro supprimé avec succès !', 'success');
      } else {
        const data = await response.json();
        showToast(data.error || 'Échec de la suppression du média', 'error');
      }
    } catch {
      showToast(
        'Une erreur est survenue lors de la suppression du média',
        'error'
      );
    } finally {
      setMediaLoading(false);
    }
  }, [menuItemId, showToast]);

  const handleTextChange = useCallback(
    (content: string): void => {
      setHeroText(content);
      onHeroTextChange(content);
    },
    [onHeroTextChange]
  );

  return (
    <Box bg="bg.subtle" borderRadius="2xl" overflow="hidden" boxShadow="md">
      <Box
        h="4px"
        bgGradient="to-r"
        gradientFrom="blue.400"
        gradientTo="purple.500"
      />
      <Box p={{ base: 4, md: 8 }}>
        <Heading size="lg" mb={6}>
          Section héro
        </Heading>

        <Stack gap={{ base: 4, md: 6 }}>
          {/* Hero Media Upload */}
          <Field.Root>
            <Field.Label>Média de fond (image ou vidéo)</Field.Label>
            <Text fontSize="sm" color="fg.muted" mb={2}>
              Téléchargez une image ou une vidéo pour le fond de la section
              héro. Formats acceptés : PNG, JPG, GIF, WebP, MP4, WebM. Taille
              max : 20 Mo.
            </Text>

            <input
              type="file"
              ref={mediaInputRef}
              accept="image/png,image/jpeg,image/gif,image/webp,video/mp4,video/webm"
              style={{ display: 'none' }}
              onChange={handleMediaUpload}
            />

            {heroMedia ? (
              <VStack align="stretch" gap={3}>
                {/* Media Preview */}
                <Box
                  borderRadius="lg"
                  overflow="hidden"
                  maxH="200px"
                  bg="black"
                >
                  {heroMedia.type === 'image' ? (
                    <NextImage
                      src={heroMedia.url}
                      alt="Aperçu du média héro"
                      width={600}
                      height={200}
                      style={{
                        maxHeight: '200px',
                        width: '100%',
                        objectFit: 'cover',
                      }}
                      unoptimized
                      loader={({ src }) => src}
                    />
                  ) : (
                    <video
                      src={heroMedia.url}
                      autoPlay
                      loop
                      muted
                      playsInline
                      style={{
                        maxHeight: '200px',
                        width: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  )}
                </Box>

                {/* Actions */}
                <HStack>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => mediaInputRef.current?.click()}
                    disabled={mediaLoading}
                  >
                    <FiUpload />
                    Remplacer
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    colorPalette="red"
                    onClick={handleMediaDelete}
                    disabled={mediaLoading}
                  >
                    <FiTrash2 />
                    Supprimer
                  </Button>
                  {mediaLoading && <Spinner size="sm" />}
                </HStack>
              </VStack>
            ) : (
              <HStack>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => mediaInputRef.current?.click()}
                  disabled={mediaLoading}
                >
                  <FiUpload />
                  Télécharger un média
                </Button>
                {mediaLoading && <Spinner size="sm" />}
              </HStack>
            )}
          </Field.Root>

          {/* Hero Text Editor */}
          <Field.Root>
            <Field.Label>Texte de la section héro</Field.Label>
            <Text fontSize="sm" color="fg.muted" mb={2}>
              Ce texte s&apos;affichera au centre de la section héro, par-dessus
              le média de fond. Vous pouvez utiliser le bouton lien pour ajouter
              un bouton d&apos;appel à l&apos;action.
            </Text>
            <HeroTextEditor content={heroText} onChange={handleTextChange} />
          </Field.Root>
        </Stack>
      </Box>
    </Box>
  );
}
