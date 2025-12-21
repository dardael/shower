'use client';

import { useEffect, useState } from 'react';
import { Box, Text, VStack, HStack } from '@chakra-ui/react';
import NextImage from 'next/image';
import { AddToCartButton } from '@/presentation/shared/components/Cart/AddToCartButton';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
}

interface ProductListRendererProps {
  categoryIds: string[] | null;
  layout: 'grid' | 'list';
  sortBy: string;
  showName: boolean;
  showDescription: boolean;
  showPrice: boolean;
  showImage: boolean;
}

export function ProductListRenderer({
  categoryIds,
  layout,
  sortBy,
  showName,
  showDescription,
  showPrice,
  showImage,
}: ProductListRendererProps): React.ReactElement {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (categoryIds && categoryIds.length > 0) {
          params.set('categoryIds', categoryIds.join(','));
        }
        if (sortBy) {
          params.set('sortBy', sortBy);
        }

        const url = `/api/public/products${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          setError('Failed to load products');
        }
      } catch {
        setError('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [categoryIds, sortBy]);

  if (isLoading) {
    return (
      <Box py={8} textAlign="center">
        <Text color="fg.muted">Loading products...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box py={8} textAlign="center">
        <Text color="fg.error">{error}</Text>
      </Box>
    );
  }

  if (products.length === 0) {
    return (
      <Box py={8} textAlign="center">
        <Text color="fg.muted">No products found</Text>
      </Box>
    );
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  if (layout === 'list') {
    return (
      <VStack align="stretch" gap={4} py={4}>
        {products.map((product) => (
          <HStack
            key={product.id}
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            bg="bg.panel"
            boxShadow="sm"
            gap={4}
            align="flex-start"
            _hover={{ boxShadow: 'md' }}
            transition="box-shadow 0.2s"
          >
            {showImage && (
              <Box
                w="120px"
                h="120px"
                flexShrink={0}
                borderRadius="md"
                overflow="hidden"
                bg="bg.subtle"
              >
                {product.imageUrl ? (
                  <NextImage
                    src={product.imageUrl}
                    alt={product.name}
                    width={120}
                    height={120}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'fill',
                    }}
                  />
                ) : (
                  <Box
                    w="100%"
                    h="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text color="fg.muted" fontSize="xs">
                      No image
                    </Text>
                  </Box>
                )}
              </Box>
            )}
            <VStack align="stretch" flex={1} gap={1}>
              {showName && (
                <Text fontWeight="semibold" fontSize="lg">
                  {product.name}
                </Text>
              )}
              {showDescription && product.description && (
                <Text color="fg.muted" fontSize="sm" lineClamp={2}>
                  {product.description}
                </Text>
              )}
              <HStack justify="space-between" align="center">
                {showPrice && (
                  <Text fontWeight="bold" color="fg" fontSize="lg">
                    {formatPrice(product.price)}
                  </Text>
                )}
                <AddToCartButton productId={product.id} size="sm" />
              </HStack>
            </VStack>
          </HStack>
        ))}
      </VStack>
    );
  }

  // Grid layout (default) - card style with fixed size images
  return (
    <HStack wrap="wrap" gap={3} py={4} justify="center">
      {products.map((product) => (
        <Box
          key={product.id}
          w="300px"
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          bg="bg.panel"
          boxShadow="sm"
          _hover={{ boxShadow: 'md' }}
          transition="box-shadow 0.2s"
          display="flex"
          flexDirection="column"
        >
          {showImage && (
            <Box
              m={4}
              mb={0}
              h="220px"
              minH="220px"
              maxH="220px"
              bg="bg.subtle"
              borderRadius="md"
              overflow="hidden"
            >
              {product.imageUrl ? (
                <NextImage
                  src={product.imageUrl}
                  alt={product.name}
                  width={260}
                  height={204}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'fill',
                  }}
                />
              ) : (
                <Box
                  w="100%"
                  h="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text color="fg.muted" fontSize="sm">
                    No image
                  </Text>
                </Box>
              )}
            </Box>
          )}
          <VStack align="stretch" gap={2} flex={1} p={4}>
            {showName && (
              <Text fontWeight="semibold" fontSize="md">
                {product.name}
              </Text>
            )}
            {showDescription && product.description && (
              <Text color="fg.muted" fontSize="sm" lineClamp={2} flex={1}>
                {product.description}
              </Text>
            )}
            <HStack justify="space-between" align="center">
              {showPrice && (
                <Text fontWeight="bold" color="fg" fontSize="lg">
                  {formatPrice(product.price)}
                </Text>
              )}
              <AddToCartButton productId={product.id} size="sm" />
            </HStack>
          </VStack>
        </Box>
      ))}
    </HStack>
  );
}
