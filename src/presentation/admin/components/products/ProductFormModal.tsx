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
  Image,
  Dialog,
  Portal,
  Icon,
} from '@chakra-ui/react';
import { FiUpload, FiX } from 'react-icons/fi';
import { useDynamicTheme } from '@/presentation/shared/DynamicThemeProvider';

interface Category {
  id: string;
  name: string;
  description: string;
}

interface ProductFormData {
  id?: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryIds: string[];
}

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
  product?: ProductFormData | null;
  categories: Category[];
}

export function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  product,
  categories,
}: ProductFormModalProps): React.ReactElement {
  const { themeColor } = useDynamicTheme();
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    categoryIds: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (product) {
      setFormData(product);
      setImagePreview(product.imageUrl);
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
        categoryIds: [],
      });
      setImagePreview('');
    }
    setImageFile(null);
  }, [product, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = (): void => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return formData.imageUrl;

    const formDataUpload = new FormData();
    formDataUpload.append('file', imageFile);

    const response = await fetch('/api/admin/products/upload-image', {
      method: 'POST',
      body: formDataUpload,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.url;
  };

  const handleSubmit = async (): Promise<void> => {
    setIsSubmitting(true);
    try {
      let imageUrl = formData.imageUrl;
      if (imageFile) {
        imageUrl = await uploadImage();
      }
      await onSubmit({ ...formData, imageUrl });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCategory = (categoryId: string): void => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }));
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>
                {product ? 'Edit Product' : 'Add Product'}
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
                    placeholder="Product name"
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
                    placeholder="Product description"
                  />
                </Box>

                <Box>
                  <Text fontWeight="medium" mb={1}>
                    Price *
                  </Text>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                  />
                </Box>

                <Box>
                  <Text fontWeight="medium" mb={1}>
                    Image
                  </Text>
                  <VStack gap={3} align="stretch">
                    {imagePreview ? (
                      <Box position="relative" maxW="200px">
                        <Box
                          borderRadius="lg"
                          overflow="hidden"
                          borderWidth="1px"
                          borderColor="gray.200"
                        >
                          <Image src={imagePreview} alt="Preview" />
                        </Box>
                        <Button
                          size="xs"
                          colorPalette="red"
                          position="absolute"
                          top={-2}
                          right={-2}
                          borderRadius="full"
                          onClick={() => {
                            setImagePreview('');
                            setImageFile(null);
                            setFormData({ ...formData, imageUrl: '' });
                          }}
                        >
                          <FiX />
                        </Button>
                      </Box>
                    ) : (
                      <label
                        htmlFor="image-upload"
                        style={{ cursor: 'pointer' }}
                      >
                        <Box
                          borderWidth="2px"
                          borderStyle="dashed"
                          borderColor="gray.300"
                          borderRadius="lg"
                          p={6}
                          textAlign="center"
                          transition="all 0.2s"
                          _hover={{
                            borderColor: `${themeColor}.400`,
                            bg: `${themeColor}.50`,
                          }}
                        >
                          <VStack gap={2}>
                            <Icon fontSize="2xl" color="gray.400">
                              <FiUpload />
                            </Icon>
                            <Text fontSize="sm" color="gray.500">
                              Click to upload an image
                            </Text>
                            <Text fontSize="xs" color="gray.400">
                              PNG, JPG, GIF up to 5MB
                            </Text>
                          </VStack>
                        </Box>
                      </label>
                    )}
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      display="none"
                    />
                    {imagePreview && (
                      <label
                        htmlFor="image-upload"
                        style={{ cursor: 'pointer' }}
                      >
                        <Button
                          as="span"
                          size="sm"
                          variant="outline"
                          maxW="200px"
                        >
                          <FiUpload />
                          Change image
                        </Button>
                      </label>
                    )}
                  </VStack>
                </Box>

                <Box>
                  <Text fontWeight="medium" mb={1}>
                    Categories
                  </Text>
                  <HStack wrap="wrap" gap={2}>
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        size="sm"
                        variant={
                          formData.categoryIds.includes(category.id)
                            ? 'solid'
                            : 'outline'
                        }
                        colorPalette={
                          formData.categoryIds.includes(category.id)
                            ? themeColor
                            : 'gray'
                        }
                        onClick={() => toggleCategory(category.id)}
                      >
                        {category.name}
                      </Button>
                    ))}
                    {categories.length === 0 && (
                      <Text color="gray.500" fontSize="sm">
                        No categories available
                      </Text>
                    )}
                  </HStack>
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
                  disabled={!formData.name || formData.price <= 0}
                >
                  {product ? 'Update' : 'Create'}
                </Button>
              </HStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
