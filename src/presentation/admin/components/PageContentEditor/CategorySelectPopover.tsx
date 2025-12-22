'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Button,
  HStack,
  Text,
  VStack,
  Popover as ChakraPopover,
} from '@chakra-ui/react';
import { FiFilter } from 'react-icons/fi';

interface Category {
  id: string;
  name: string;
}

interface PopoverOpenChangeDetails {
  open: boolean;
}

interface CategorySelectPopoverProps {
  selectedCategoryIds: string[];
  onChange: (categoryIds: string[]) => void;
  disabled?: boolean;
}

export function CategorySelectPopover({
  selectedCategoryIds,
  onChange,
  disabled = false,
}: CategorySelectPopoverProps): React.ReactElement {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Fetch categories when popover opens
  useEffect(() => {
    if (open && categories.length === 0) {
      setIsLoading(true);
      fetch('/api/admin/categories')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.categories)) {
            setCategories(data.categories);
          } else if (data.success && Array.isArray(data.data)) {
            setCategories(data.data);
          }
        })
        .catch(() => {
          // Silently fail - categories won't be available
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [open, categories.length]);

  const toggleCategory = useCallback(
    (categoryId: string): void => {
      const newIds = selectedCategoryIds.includes(categoryId)
        ? selectedCategoryIds.filter((id) => id !== categoryId)
        : [...selectedCategoryIds, categoryId];
      onChange(newIds);
    },
    [selectedCategoryIds, onChange]
  );

  const clearAll = useCallback((): void => {
    onChange([]);
  }, [onChange]);

  const selectedCount = selectedCategoryIds.length;

  return (
    <ChakraPopover.Root
      open={open}
      onOpenChange={(e: PopoverOpenChangeDetails) => setOpen(e.open)}
    >
      <ChakraPopover.Trigger asChild>
        <Button
          size="xs"
          variant={selectedCount > 0 ? 'solid' : 'ghost'}
          disabled={disabled}
        >
          <FiFilter />
          {selectedCount > 0
            ? `${selectedCount} catégories`
            : 'Toutes les catégories'}
        </Button>
      </ChakraPopover.Trigger>
      <ChakraPopover.Positioner>
        <ChakraPopover.Content width="250px">
          <ChakraPopover.Body p={3}>
            <VStack align="stretch" gap={2}>
              <HStack justify="space-between">
                <Text fontSize="sm" fontWeight="medium">
                  Filtrer par catégorie
                </Text>
                {selectedCount > 0 && (
                  <Button size="xs" variant="ghost" onClick={clearAll}>
                    Effacer
                  </Button>
                )}
              </HStack>

              {isLoading ? (
                <Text fontSize="sm" color="fg.muted">
                  Chargement...
                </Text>
              ) : categories.length === 0 ? (
                <Text fontSize="sm" color="fg.muted">
                  Aucune catégorie trouvée
                </Text>
              ) : (
                <VStack align="stretch" gap={1} maxH="200px" overflowY="auto">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      size="xs"
                      variant={
                        selectedCategoryIds.includes(category.id)
                          ? 'solid'
                          : 'outline'
                      }
                      onClick={() => toggleCategory(category.id)}
                      justifyContent="flex-start"
                    >
                      {category.name}
                    </Button>
                  ))}
                </VStack>
              )}
            </VStack>
          </ChakraPopover.Body>
        </ChakraPopover.Content>
      </ChakraPopover.Positioner>
    </ChakraPopover.Root>
  );
}
