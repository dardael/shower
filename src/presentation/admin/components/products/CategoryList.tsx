'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  HStack,
  VStack,
  Text,
  Input,
  Spinner,
  IconButton,
} from '@chakra-ui/react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiMenu } from 'react-icons/fi';
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
import { CategoryFormModal } from './CategoryFormModal';
import { toaster } from '@/presentation/shared/components/ui/toaster';
import { useDynamicTheme } from '@/presentation/shared/DynamicThemeProvider';
import type { ProductCategory } from './types';

interface SortableCategoryItemProps {
  category: ProductCategory;
  onEdit: (category: ProductCategory) => void;
  onDelete: (id: string) => void;
}

function SortableCategoryItem({
  category,
  onEdit,
  onDelete,
}: SortableCategoryItemProps): React.ReactElement {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      p={4}
      borderWidth={1}
      borderRadius="md"
      _hover={{ shadow: 'sm' }}
      bg={isDragging ? 'gray.50' : undefined}
    >
      <HStack>
        <Box
          {...attributes}
          {...listeners}
          cursor="grab"
          p={1}
          _hover={{ bg: 'gray.100' }}
          borderRadius="md"
        >
          <FiMenu />
        </Box>
        <VStack align="start" flex={1} gap={1}>
          <Text fontWeight="bold">{category.name}</Text>
          <Text fontSize="sm" color="gray.500" lineClamp={2}>
            {category.description || 'No description'}
          </Text>
        </VStack>
        <HStack>
          <IconButton
            aria-label="Edit category"
            variant="ghost"
            size="sm"
            onClick={() => onEdit(category)}
          >
            <FiEdit2 />
          </IconButton>
          <IconButton
            aria-label="Delete category"
            variant="ghost"
            size="sm"
            color="red.500"
            onClick={() => onDelete(category.id)}
          >
            <FiTrash2 />
          </IconButton>
        </HStack>
      </HStack>
    </Box>
  );
}

export function CategoryList(): React.ReactElement {
  const { themeColor } = useDynamicTheme();
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<ProductCategory | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchCategories = useCallback(async (): Promise<void> => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);

      const response = await fetch(
        `/api/admin/categories?${params.toString()}`,
        { cache: 'no-store' }
      );
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch {
      toaster.error({ title: 'Failed to load categories' });
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDragEnd = async (event: DragEndEvent): Promise<void> => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = categories.findIndex((c) => c.id === active.id);
      const newIndex = categories.findIndex((c) => c.id === over.id);

      const newCategories = arrayMove(categories, oldIndex, newIndex);
      setCategories(newCategories);

      try {
        const response = await fetch('/api/admin/categories/reorder', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderedIds: newCategories.map((c) => c.id) }),
        });

        if (!response.ok) {
          throw new Error('Failed to save order');
        }
      } catch {
        toaster.error({ title: 'Failed to save order' });
        fetchCategories();
      }
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (
      !confirm(
        'Are you sure you want to delete this category? Products will be unassigned.'
      )
    )
      return;

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        toaster.success({ title: 'Category deleted' });
        fetchCategories();
      } else {
        toaster.error({ title: 'Failed to delete category' });
      }
    } catch {
      toaster.error({ title: 'Failed to delete category' });
    }
  };

  const handleEdit = (category: ProductCategory): void => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCreate = (): void => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleModalClose = (): void => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSave = async (data: {
    name: string;
    description: string;
  }): Promise<void> => {
    try {
      if (editingCategory) {
        const response = await fetch(
          `/api/admin/categories/${editingCategory.id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          }
        );
        if (!response.ok) {
          throw new Error('Failed to update category');
        }
        toaster.success({ title: 'Category updated successfully' });
      } else {
        const response = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error('Failed to create category');
        }
        toaster.success({ title: 'Category created successfully' });
      }
      setIsModalOpen(false);
      setEditingCategory(null);
      await fetchCategories();
    } catch {
      toaster.error({
        title: editingCategory
          ? 'Failed to update category'
          : 'Failed to create category',
      });
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="lg" />
      </Box>
    );
  }

  return (
    <VStack gap={4} align="stretch">
      <HStack>
        <Box position="relative" flex={1}>
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            pl={10}
          />
          <Box
            position="absolute"
            left={3}
            top="50%"
            transform="translateY(-50%)"
          >
            <FiSearch />
          </Box>
        </Box>
        <Button colorPalette={themeColor} onClick={handleCreate}>
          <FiPlus />
          Add Category
        </Button>
      </HStack>

      {categories.length === 0 ? (
        <Box textAlign="center" py={10} color="gray.500">
          <Text>No categories found. Create your first category!</Text>
        </Box>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={categories.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <VStack gap={3} align="stretch">
              {categories.map((category) => (
                <SortableCategoryItem
                  key={category.id}
                  category={category}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </VStack>
          </SortableContext>
        </DndContext>
      )}

      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSave}
        category={editingCategory}
      />
    </VStack>
  );
}
