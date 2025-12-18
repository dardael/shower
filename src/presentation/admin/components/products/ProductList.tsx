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
  Image,
} from '@chakra-ui/react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiMenu } from 'react-icons/fi';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ProductFormModal } from './ProductFormModal';
import { toaster } from '@/presentation/shared/components/ui/toaster';
import { useDynamicTheme } from '@/presentation/shared/DynamicThemeProvider';
import type { Product, ProductCategory } from './types';

interface SortableProductItemProps {
  product: Product;
  categories: ProductCategory[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  getCategoryNames: (categoryIds: string[]) => string;
}

function SortableProductItem({
  product,
  onEdit,
  onDelete,
  getCategoryNames,
}: SortableProductItemProps): React.ReactElement {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

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
      <HStack gap={4}>
        <IconButton
          aria-label="Drag to reorder"
          variant="ghost"
          size="sm"
          cursor="grab"
          {...attributes}
          {...listeners}
        >
          <FiMenu />
        </IconButton>
        {product.imageUrl && (
          <Image
            src={product.imageUrl}
            alt={product.name}
            boxSize="60px"
            objectFit="cover"
            borderRadius="md"
          />
        )}
        <VStack align="start" flex={1} gap={1}>
          <Text fontWeight="bold">{product.name}</Text>
          <Text fontSize="sm" color="gray.500" lineClamp={1}>
            {product.description}
          </Text>
          <HStack fontSize="sm" color="gray.500">
            <Text fontWeight="semibold">€{product.price.toFixed(2)}</Text>
            <Text>•</Text>
            <Text>{getCategoryNames(product.categoryIds)}</Text>
          </HStack>
        </VStack>
        <HStack>
          <IconButton
            aria-label="Edit product"
            variant="ghost"
            size="sm"
            onClick={() => onEdit(product)}
          >
            <FiEdit2 />
          </IconButton>
          <IconButton
            aria-label="Delete product"
            variant="ghost"
            size="sm"
            color="red.500"
            onClick={() => onDelete(product.id)}
          >
            <FiTrash2 />
          </IconButton>
        </HStack>
      </HStack>
    </Box>
  );
}

export function ProductList(): React.ReactElement {
  const { themeColor } = useDynamicTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchProducts = useCallback(async (): Promise<void> => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);

      const response = await fetch(`/api/admin/products?${params.toString()}`, {
        cache: 'no-store',
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
      }
    } catch {
      toaster.error({ title: 'Failed to load products' });
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  const fetchCategories = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch('/api/admin/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch {
      // Silently fail - categories are optional for product display
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const handleDragEnd = async (event: DragEndEvent): Promise<void> => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = products.findIndex((p) => p.id === active.id);
      const newIndex = products.findIndex((p) => p.id === over.id);

      const newProducts = arrayMove(products, oldIndex, newIndex);
      setProducts(newProducts);

      // Save new order to backend
      try {
        const productIds = newProducts.map((p) => p.id);
        const response = await fetch('/api/admin/products/reorder', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productIds }),
        });

        if (!response.ok) {
          throw new Error('Failed to save order');
        }
        toaster.success({ title: 'Order saved' });
      } catch {
        toaster.error({ title: 'Failed to save order' });
        fetchProducts(); // Revert on error
      }
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        toaster.success({ title: 'Product deleted' });
        fetchProducts();
      } else {
        toaster.error({ title: 'Failed to delete product' });
      }
    } catch {
      toaster.error({ title: 'Failed to delete product' });
    }
  };

  const handleEdit = (product: Product): void => {
    setEditingProduct(product);
    fetchCategories();
    setIsModalOpen(true);
  };

  const handleCreate = (): void => {
    setEditingProduct(null);
    fetchCategories();
    setIsModalOpen(true);
  };

  const handleModalClose = (): void => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSave = async (data: {
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    categoryIds: string[];
  }): Promise<void> => {
    try {
      if (editingProduct) {
        const response = await fetch(
          `/api/admin/products/${editingProduct.id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          }
        );
        if (!response.ok) {
          throw new Error('Failed to update product');
        }
        toaster.success({ title: 'Product updated successfully' });
      } else {
        const response = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error('Failed to create product');
        }
        toaster.success({ title: 'Product created successfully' });
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      await fetchProducts();
    } catch {
      toaster.error({
        title: editingProduct
          ? 'Failed to update product'
          : 'Failed to create product',
      });
    }
  };

  const getCategoryNames = (categoryIds: string[]): string => {
    return (
      categoryIds
        .map((id) => categories.find((c) => c.id === id)?.name)
        .filter(Boolean)
        .join(', ') || 'No categories'
    );
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
            placeholder="Search products..."
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
          Add Product
        </Button>
      </HStack>

      {products.length === 0 ? (
        <Box textAlign="center" py={10} color="gray.500">
          <Text>No products found. Create your first product!</Text>
        </Box>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={products.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            <VStack gap={3} align="stretch">
              {products.map((product) => (
                <SortableProductItem
                  key={product.id}
                  product={product}
                  categories={categories}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  getCategoryNames={getCategoryNames}
                />
              ))}
            </VStack>
          </SortableContext>
        </DndContext>
      )}

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSave}
        product={editingProduct}
        categories={categories}
      />
    </VStack>
  );
}
