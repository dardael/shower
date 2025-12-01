'use client';

import { useState, useEffect, useCallback } from 'react';
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [hasExistingContent, setHasExistingContent] = useState(false);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/settings/pages/${menuItemId}`);

      if (response.ok) {
        const data = await response.json();
        setContent(data.content);
        setOriginalContent(data.content);
        setHasExistingContent(true);
      } else if (response.status === 404) {
        setContent('');
        setOriginalContent('');
        setHasExistingContent(false);
      } else {
        showToast('Failed to load page content', 'error');
      }
    } catch (error) {
      logger.logErrorWithObject(error, 'Error fetching page content');
      showToast('Failed to load page content', 'error');
    } finally {
      setLoading(false);
    }
  }, [menuItemId, logger, showToast]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleSave = async () => {
    if (!content.trim()) {
      showToast('Content cannot be empty', 'error');
      return;
    }

    try {
      setSaving(true);

      const endpoint = hasExistingContent
        ? `/api/settings/pages/${menuItemId}`
        : '/api/settings/pages';
      const method = hasExistingContent ? 'PATCH' : 'POST';

      const body = hasExistingContent ? { content } : { menuItemId, content };

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        setOriginalContent(data.content);
        setHasExistingContent(true);
        showToast('Page content saved successfully', 'success');
      } else {
        const data = await response.json();
        showToast(data.error || 'Failed to save page content', 'error');
      }
    } catch (error) {
      logger.logErrorWithObject(error, 'Error saving page content');
      showToast('Failed to save page content', 'error');
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
        showToast('Page content deleted successfully', 'success');
      } else {
        const data = await response.json();
        showToast(data.error || 'Failed to delete page content', 'error');
      }
    } catch (error) {
      logger.logErrorWithObject(error, 'Error deleting page content');
      showToast('Failed to delete page content', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const hasChanges = content !== originalContent;

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
          Page Content: {menuItemText}
        </Heading>
        <Text
          fontSize={{ base: 'sm', md: 'md' }}
          color="fg.muted"
          lineHeight="relaxed"
        >
          Edit the content that will be displayed when users visit this page.
        </Text>
      </VStack>

      <VStack gap={4} align="stretch">
        {loading ? (
          <Text color="fg.muted">Loading content...</Text>
        ) : (
          <>
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
                  colorPalette="red"
                  variant="outline"
                >
                  <FiTrash2 />
                  Delete Content
                </Button>
              )}
              <Button
                onClick={handleSave}
                disabled={!hasChanges || saving || deleting || !content.trim()}
                loading={saving}
              >
                <FiSave />
                {hasExistingContent ? 'Update Content' : 'Save Content'}
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
                <Dialog.Title>Delete Page Content</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text>
                  Are you sure you want to delete the content for{' '}
                  <strong>{menuItemText}</strong>? This action cannot be undone.
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <HStack gap={2} justify="flex-end">
                  <Button
                    variant="outline"
                    onClick={() => setDeleteDialogOpen(false)}
                    disabled={deleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    colorPalette="red"
                    onClick={handleDelete}
                    loading={deleting}
                  >
                    Delete
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
