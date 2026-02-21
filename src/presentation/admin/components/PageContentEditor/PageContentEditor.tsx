'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  HStack,
  Dialog,
  Portal,
} from '@chakra-ui/react';
import { FiSave, FiTrash2 } from 'react-icons/fi';
import TiptapEditor from './TiptapEditor';
import { HeroSectionConfig } from '@/presentation/admin/components/HeroSectionConfig/HeroSectionConfig';
import { useLogger } from '@/presentation/shared/hooks/useLogger';
import { useToastNotifications } from '@/presentation/admin/hooks/useToastNotifications';

interface PageContentEditorProps {
  menuItemId: string;
  menuItemText: string;
}

export default function PageContentEditor({
  menuItemId,
  menuItemText,
}: PageContentEditorProps) {
  const logger = useLogger();
  const { showToast } = useToastNotifications();
  const [content, setContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [heroText, setHeroText] = useState<string | null>(null);
  const [originalHeroText, setOriginalHeroText] = useState<string | null>(null);
  const [heroMediaUrl, setHeroMediaUrl] = useState<string | null>(null);
  const [heroMediaType, setHeroMediaType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [hasExistingContent, setHasExistingContent] = useState(false);
  const heroTextRef = useRef<string | null>(null);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/settings/pages/${menuItemId}`);

      if (response.ok) {
        const data = await response.json();
        setContent(data.content);
        setOriginalContent(data.content);
        setHeroText(data.heroText || null);
        setOriginalHeroText(data.heroText || null);
        heroTextRef.current = data.heroText || null;
        setHeroMediaUrl(data.heroMediaUrl || null);
        setHeroMediaType(data.heroMediaType || null);
        setHasExistingContent(true);
      } else if (response.status === 404) {
        setContent('');
        setOriginalContent('');
        setHeroText(null);
        setOriginalHeroText(null);
        heroTextRef.current = null;
        setHeroMediaUrl(null);
        setHeroMediaType(null);
        setHasExistingContent(false);
      } else {
        showToast('Échec du chargement du contenu de la page', 'error');
      }
    } catch (error) {
      logger.logErrorWithObject(error, 'Error fetching page content');
      showToast('Échec du chargement du contenu de la page', 'error');
    } finally {
      setLoading(false);
    }
  }, [menuItemId, logger, showToast]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleSave = async () => {
    if (!content.trim()) {
      showToast('Le contenu ne peut pas être vide', 'error');
      return;
    }

    try {
      setSaving(true);

      const endpoint = hasExistingContent
        ? `/api/settings/pages/${menuItemId}`
        : '/api/settings/pages';
      const method = hasExistingContent ? 'PATCH' : 'POST';

      const currentHeroText = heroTextRef.current;
      const body = hasExistingContent
        ? { content, heroText: currentHeroText }
        : { menuItemId, content, heroText: currentHeroText };

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        setOriginalContent(data.content);
        setOriginalHeroText(data.heroText || null);
        setHasExistingContent(true);
        showToast('Contenu de la page enregistré avec succès', 'success');
      } else {
        const data = await response.json();
        showToast(
          data.error || "Échec de l'enregistrement du contenu",
          'error'
        );
      }
    } catch (error) {
      logger.logErrorWithObject(error, 'Error saving page content');
      showToast("Échec de l'enregistrement du contenu de la page", 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);

      const response = await fetch(`/api/settings/pages/${menuItemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setContent('');
        setOriginalContent('');
        setHasExistingContent(false);
        setDeleteDialogOpen(false);
        showToast('Contenu de la page supprimé avec succès', 'success');
      } else {
        const data = await response.json();
        showToast(data.error || 'Échec de la suppression du contenu', 'error');
      }
    } catch (error) {
      logger.logErrorWithObject(error, 'Error deleting page content');
      showToast('Échec de la suppression du contenu de la page', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleHeroTextChange = useCallback((text: string): void => {
    setHeroText(text);
    heroTextRef.current = text;
  }, []);

  const hasChanges =
    content !== originalContent || heroText !== originalHeroText;

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
          Contenu de la page : {menuItemText}
        </Heading>
        <Text
          fontSize={{ base: 'sm', md: 'md' }}
          color="fg.muted"
          lineHeight="relaxed"
        >
          Modifiez le contenu qui sera affiché lorsque les utilisateurs
          visiteront cette page.
        </Text>
      </VStack>

      <VStack gap={4} align="stretch">
        {loading ? (
          <Text color="fg.muted">Chargement du contenu...</Text>
        ) : (
          <>
            <HeroSectionConfig
              menuItemId={menuItemId}
              initialMediaUrl={heroMediaUrl}
              initialMediaType={heroMediaType}
              initialHeroText={heroText}
              onHeroTextChange={handleHeroTextChange}
            />
            <TiptapEditor
              content={content}
              onChange={setContent}
              disabled={saving || deleting}
            />
            <HStack justify="flex-end" gap={2}>
              {hasExistingContent && (
                <Button
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={saving || deleting}
                  variant="outline"
                  borderColor="red.500"
                  color="red.500"
                  _hover={{
                    bg: 'red.50',
                    borderColor: 'red.600',
                    color: 'red.600',
                  }}
                >
                  <FiTrash2 />
                  Supprimer le contenu
                </Button>
              )}
              <Button
                onClick={handleSave}
                disabled={!hasChanges || saving || deleting || !content.trim()}
                loading={saving}
              >
                <FiSave />
                {hasExistingContent ? 'Mettre à jour' : 'Enregistrer'}
              </Button>
            </HStack>
          </>
        )}
      </VStack>

      <Dialog.Root
        open={deleteDialogOpen}
        onOpenChange={(e) => setDeleteDialogOpen(e.open)}
        placement="center"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Supprimer le contenu de la page</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text>
                  Êtes-vous sûr de vouloir supprimer le contenu de{' '}
                  <strong>{menuItemText}</strong> ? Cette action est
                  irréversible.
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <HStack gap={2} justify="flex-end">
                  <Button
                    variant="ghost"
                    onClick={() => setDeleteDialogOpen(false)}
                    disabled={deleting}
                  >
                    Annuler
                  </Button>
                  <Button
                    colorPalette="red"
                    onClick={handleDelete}
                    loading={deleting}
                  >
                    Supprimer
                  </Button>
                </HStack>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
}
