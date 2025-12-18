'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Input,
  Textarea,
  VStack,
  HStack,
  Text,
  Dialog,
  Portal,
} from '@chakra-ui/react';
import { useDynamicTheme } from '@/presentation/shared/DynamicThemeProvider';

interface CategoryFormData {
  id?: string;
  name: string;
  description: string;
}

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  category?: CategoryFormData | null;
}

export function CategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  category,
}: CategoryFormModalProps): React.ReactElement {
  const { themeColor } = useDynamicTheme();
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData(category);
    } else {
      setFormData({
        name: '',
        description: '',
      });
    }
  }, [category, isOpen]);

  const handleSubmit = async (): Promise<void> => {
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>
                {category ? 'Edit Category' : 'Add Category'}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <VStack gap={4} align="stretch">
                <Box>
                  <Text fontWeight="medium" mb={1}>
                    Name *
                  </Text>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Category name"
                  />
                </Box>

                <Box>
                  <Text fontWeight="medium" mb={1}>
                    Description
                  </Text>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Category description"
                  />
                </Box>
              </VStack>
            </Dialog.Body>
            <Dialog.Footer>
              <HStack gap={2}>
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorPalette={themeColor}
                  onClick={handleSubmit}
                  loading={isSubmitting}
                  disabled={!formData.name}
                >
                  {category ? 'Update' : 'Create'}
                </Button>
              </HStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
