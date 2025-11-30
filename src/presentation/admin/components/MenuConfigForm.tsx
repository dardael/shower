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
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { FiPlus, FiTrash2, FiMenu } from 'react-icons/fi';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useLogger } from '@/presentation/shared/hooks/useLogger';
import { useToastNotifications } from '@/presentation/admin/hooks/useToastNotifications';
import { useLogoManagement } from '@/presentation/admin/hooks/useLogoManagement';
import ImageManager from '@/presentation/shared/components/ImageManager/ImageManager';
import type { ImageData } from '@/presentation/shared/components/ImageManager/types';
import type { MenuItemDTO } from '@/app/api/settings/menu/types';

interface SortableMenuItemProps {
  item: MenuItemDTO;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  isDeleting: boolean;
  isUpdating: boolean;
}

function SortableMenuItem({
  item,
  onDelete,
  onEdit,
  isDeleting,
  isUpdating,
}: SortableMenuItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = (): void => {
    const trimmedText = editText.trim();
    if (trimmedText && trimmedText !== item.text) {
      onEdit(item.id, trimmedText);
    }
    setIsEditing(false);
    setEditText(item.text);
  };

  const handleCancel = (): void => {
    setIsEditing(false);
    setEditText(item.text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleStartEdit = (): void => {
    if (!isUpdating && !isDeleting) {
      setEditText(item.text);
      setIsEditing(true);
    }
  };

  return (
    <HStack
      ref={setNodeRef}
      style={style}
      bg="bg.canvas"
      borderColor="border"
      borderWidth="1px"
      borderRadius="lg"
      p={3}
      gap={3}
      w="full"
    >
      <Box
        {...attributes}
        {...listeners}
        cursor="grab"
        color="fg.muted"
        _hover={{ color: 'fg' }}
        aria-label="Drag to reorder"
      >
        <FiMenu size={18} />
      </Box>
      {isEditing ? (
        <Input
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          autoFocus
          maxLength={100}
          flex={1}
          size="sm"
          bg="bg.canvas"
          borderColor="colorPalette.solid"
          borderWidth="2px"
          color="fg"
          _focus={{
            borderColor: 'colorPalette.solid',
            boxShadow: '0 0 0 2px colorPalette.subtle',
          }}
        />
      ) : (
        <Text
          flex={1}
          color="fg"
          fontSize="md"
          onClick={handleStartEdit}
          cursor={isUpdating || isDeleting ? 'default' : 'pointer'}
          _hover={
            isUpdating || isDeleting
              ? undefined
              : { textDecoration: 'underline' }
          }
          opacity={isUpdating ? 0.6 : 1}
        >
          {item.text}
        </Text>
      )}
      <IconButton
        aria-label="Delete menu item"
        variant="ghost"
        size="sm"
        color="fg.muted"
        _hover={{ color: 'red.500', bg: 'red.50' }}
        onClick={() => onDelete(item.id)}
        disabled={isDeleting || isUpdating || isEditing}
      >
        <FiTrash2 size={16} />
      </IconButton>
    </HStack>
  );
}

export default function MenuConfigForm() {
  const logger = useLogger();
  const { showToast } = useToastNotifications();
  const [items, setItems] = useState<MenuItemDTO[]>([]);
  const [newItemText, setNewItemText] = useState('');
  const [loading, setLoading] = useState(false);
  const [addingItem, setAddingItem] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [currentLogo, setCurrentLogo] = useState<ImageData | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const {
    logoLoading,
    handleLogoUpload,
    handleLogoDelete,
    handleLogoReplace,
    handleLogoValidationError,
    logoConfig,
    logoLabels,
  } = useLogoManagement({
    onLogoChange: (logoData) => {
      setCurrentLogo(logoData);
    },
    onMessage: (message: string) => showToast(message, 'error'),
    onSuccess: (message: string) => showToast(message, 'success'),
  });

  const fetchMenuItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/settings/menu');
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
      } else {
        showToast('Failed to load menu items', 'error');
      }
    } catch (error) {
      logger.logErrorWithObject(error, 'Error fetching menu items');
      showToast('Failed to load menu items', 'error');
    } finally {
      setLoading(false);
    }
  }, [logger, showToast]);

  const fetchLogo = useCallback(async () => {
    try {
      const response = await fetch('/api/settings/logo');
      if (response.ok) {
        const data = await response.json();
        if (data.logo) {
          setCurrentLogo({
            url: data.logo.url,
            filename: data.logo.filename,
            size: data.logo.size,
            format: data.logo.format,
          });
        } else {
          setCurrentLogo(null);
        }
      }
    } catch (error) {
      logger.logErrorWithObject(error, 'Error fetching logo');
    }
  }, [logger]);

  useEffect(() => {
    fetchMenuItems();
    fetchLogo();
  }, [fetchMenuItems, fetchLogo]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    try {
      setAddingItem(true);
      const response = await fetch('/api/settings/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newItemText.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setItems((prev) => [...prev, data.item]);
        setNewItemText('');
        showToast('Menu item added successfully', 'success');
      } else {
        const data = await response.json();
        showToast(data.error || 'Failed to add menu item', 'error');
      }
    } catch (error) {
      logger.logErrorWithObject(error, 'Error adding menu item');
      showToast('Failed to add menu item', 'error');
    } finally {
      setAddingItem(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      setDeletingItemId(id);
      const response = await fetch(`/api/settings/menu/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        showToast('Menu item removed successfully', 'success');
      } else {
        const data = await response.json();
        showToast(data.error || 'Failed to remove menu item', 'error');
      }
    } catch (error) {
      logger.logErrorWithObject(error, 'Error removing menu item');
      showToast('Failed to remove menu item', 'error');
    } finally {
      setDeletingItemId(null);
    }
  };

  const handleUpdateItem = async (id: string, text: string): Promise<void> => {
    try {
      setUpdatingItemId(id);
      const response = await fetch(`/api/settings/menu/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const data = await response.json();
        setItems((prev) =>
          prev.map((item) => (item.id === id ? data.item : item))
        );
        showToast('Menu item updated successfully', 'success');
      } else {
        const data = await response.json();
        showToast(data.error || 'Failed to update menu item', 'error');
      }
    } catch (error) {
      logger.logErrorWithObject(error, 'Error updating menu item');
      showToast('Failed to update menu item', 'error');
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);

    try {
      const response = await fetch('/api/settings/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderedIds: newItems.map((item) => item.id),
        }),
      });

      if (response.ok) {
        showToast('Menu items reordered successfully', 'success');
      } else {
        setItems(items);
        const data = await response.json();
        showToast(data.error || 'Failed to reorder menu items', 'error');
      }
    } catch (error) {
      setItems(items);
      logger.logErrorWithObject(error, 'Error reordering menu items');
      showToast('Failed to reorder menu items', 'error');
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
          Navigation Menu Configuration
        </Heading>
        <Text
          fontSize={{ base: 'sm', md: 'md' }}
          color="fg.muted"
          lineHeight="relaxed"
        >
          Configure your website&apos;s navigation menu items. Drag items to
          reorder.
        </Text>
      </VStack>

      <Stack gap={{ base: 4, md: 6 }}>
        <Field.Root>
          <Field.Label fontSize="sm" fontWeight="semibold" color="fg" mb={2}>
            Header Logo
          </Field.Label>
          <Box
            bg="bg.canvas"
            borderColor="border"
            borderWidth="2px"
            borderRadius="lg"
            p={4}
          >
            <ImageManager
              currentImage={currentLogo}
              config={logoConfig}
              labels={logoLabels}
              onImageUpload={handleLogoUpload}
              onImageDelete={handleLogoDelete}
              onImageReplace={handleLogoReplace}
              onValidationError={handleLogoValidationError}
              disabled={logoLoading}
              loading={logoLoading}
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
            Upload a logo that appears at the left of your header navigation.
            Recommended size is 120x60 pixels or similar aspect ratio.
          </Field.HelperText>
        </Field.Root>

        <form onSubmit={handleAddItem}>
          <Field.Root>
            <Field.Label
              htmlFor="new-menu-item"
              fontSize="sm"
              fontWeight="semibold"
              color="fg"
              mb={2}
            >
              Add New Menu Item
            </Field.Label>
            <HStack gap={2}>
              <Input
                id="new-menu-item"
                data-testid="new-menu-item-input"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="Enter menu item text"
                maxLength={100}
                flex={1}
                minW="200px"
                bg="bg.canvas"
                borderColor="border"
                borderWidth="2px"
                borderRadius="lg"
                fontSize={{ base: 'sm', md: 'md' }}
                px={4}
                py={2}
                h={{ base: '40px', md: '44px' }}
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
              <IconButton
                type="submit"
                data-testid="add-menu-item-button"
                aria-label="Add menu item"
                disabled={!newItemText.trim() || addingItem}
                loading={addingItem}
                variant="solid"
                size="md"
                borderRadius="lg"
                _dark={{
                  bg: 'colorPalette.solid',
                  _hover: { bg: 'colorPalette.emphasized' },
                }}
              >
                <FiPlus size={18} />
              </IconButton>
            </HStack>
            <Field.HelperText
              fontSize={{ base: 'xs', md: 'sm' }}
              color="fg.muted"
              mt={2}
            >
              Enter the display text for the menu item. Maximum 100 characters.
            </Field.HelperText>
          </Field.Root>
        </form>

        <Box>
          <Text fontSize="sm" fontWeight="semibold" color="fg" mb={3}>
            Menu Items
          </Text>
          {loading ? (
            <Text color="fg.muted" fontSize="sm">
              Loading menu items...
            </Text>
          ) : items.length === 0 ? (
            <Box
              bg="bg.canvas"
              borderColor="border"
              borderWidth="1px"
              borderRadius="lg"
              p={6}
              textAlign="center"
            >
              <Text color="fg.muted" fontSize="sm">
                No menu items yet. Add your first menu item above.
              </Text>
            </Box>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={items.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <VStack gap={2} align="stretch">
                  {items.map((item) => (
                    <SortableMenuItem
                      key={item.id}
                      item={item}
                      onDelete={handleDeleteItem}
                      onEdit={handleUpdateItem}
                      isDeleting={deletingItemId === item.id}
                      isUpdating={updatingItemId === item.id}
                    />
                  ))}
                </VStack>
              </SortableContext>
            </DndContext>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
