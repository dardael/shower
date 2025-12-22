'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  IconButton,
  Spinner,
  Button,
} from '@chakra-ui/react';
import { FiX, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useCart } from '@/presentation/shared/contexts/CartContext';
import { CartItemRow } from './CartItemRow';
import { formatPrice } from '@/presentation/shared/utils/formatPrice';
import { useLogger } from '@/presentation/shared/hooks/useLogger';

interface ProductDetails {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
}: CartDrawerProps): React.JSX.Element | null {
  const { items, itemCount, clearCart } = useCart();
  const logger = useLogger();
  const router = useRouter();
  const [products, setProducts] = useState<Map<string, ProductDetails>>(
    new Map()
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || items.length === 0) return;

    const fetchProducts = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const productIds = items.map((item) => item.productId);
        const uniqueIds = [...new Set(productIds)];

        const response = await fetch('/api/public/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const responseData = await response.json();
        const allProducts: ProductDetails[] = responseData.data ?? [];
        const productMap = new Map<string, ProductDetails>();

        for (const product of allProducts) {
          if (uniqueIds.includes(product.id)) {
            productMap.set(product.id, product);
          }
        }

        setProducts(productMap);
      } catch (error) {
        logger.error('Failed to fetch product details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchProducts();
  }, [isOpen, items, logger]);

  const calculateTotal = (): number => {
    return items.reduce((total, item) => {
      const product = products.get(item.productId);
      if (product) {
        return total + product.price * item.quantity;
      }
      return total;
    }, 0);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="blackAlpha.600"
        zIndex={1000}
        onClick={onClose}
        data-testid="cart-backdrop"
      />

      {/* Drawer */}
      <Box
        position="fixed"
        top={0}
        right={0}
        bottom={0}
        width={{ base: '100%', sm: '380px' }}
        maxWidth="100vw"
        bg="bg"
        zIndex={1001}
        boxShadow="lg"
        display="flex"
        flexDirection="column"
        data-testid="cart-drawer"
      >
        {/* Header */}
        <HStack
          p={4}
          borderBottomWidth={1}
          borderColor="border.subtle"
          justify="space-between"
        >
          <HStack gap={2}>
            <FiShoppingCart />
            <Text fontWeight="bold" fontSize="lg">
              Panier ({itemCount})
            </Text>
          </HStack>
          <IconButton
            aria-label="Fermer le panier"
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <FiX />
          </IconButton>
        </HStack>

        {/* Content */}
        <Box flex={1} overflowY="auto" p={4}>
          {isLoading ? (
            <VStack py={8}>
              <Spinner size="lg" />
              <Text color="fg.muted">Chargement du panier...</Text>
            </VStack>
          ) : items.length === 0 ? (
            <VStack py={8} gap={3}>
              <FiShoppingCart size={48} />
              <Text color="fg.muted" textAlign="center">
                Votre panier est vide
              </Text>
              <Text color="fg.muted" fontSize="sm" textAlign="center">
                Ajoutez des produits pour commencer
              </Text>
            </VStack>
          ) : (
            <VStack gap={3} align="stretch">
              {items.map((item) => {
                const product = products.get(item.productId);
                if (!product) return null;

                return (
                  <CartItemRow
                    key={item.productId}
                    productId={item.productId}
                    productName={product.name}
                    productImage={product.imageUrl}
                    price={product.price}
                    quantity={item.quantity}
                  />
                );
              })}
            </VStack>
          )}
        </Box>

        {/* Footer */}
        {items.length > 0 && (
          <Box p={4} borderTopWidth={1} borderColor="border.subtle">
            <VStack gap={3} align="stretch">
              <HStack justify="space-between">
                <Text fontWeight="semibold">Total</Text>
                <Text fontWeight="bold" fontSize="xl">
                  {formatPrice(calculateTotal())}
                </Text>
              </HStack>
              <HStack gap={2}>
                <Button
                  variant="solid"
                  colorPalette="green"
                  flex={2}
                  onClick={() => {
                    onClose();
                    router.push('/commander');
                  }}
                >
                  Valider le panier
                </Button>
                <IconButton
                  aria-label="Vider le panier"
                  variant="solid"
                  colorPalette="red"
                  color="white"
                  onClick={clearCart}
                >
                  <FiTrash2 />
                </IconButton>
              </HStack>
            </VStack>
          </Box>
        )}
      </Box>
    </>
  );
}
