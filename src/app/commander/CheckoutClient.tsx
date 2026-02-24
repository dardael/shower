'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  Flex,
} from '@chakra-ui/react';
import { useCart } from '@/presentation/shared/contexts/CartContext';
import { CheckoutForm } from '@/presentation/shared/components/checkout/CheckoutForm';
import { OrderSummary } from '@/presentation/shared/components/checkout/OrderSummary';
import { PublicHeaderMenu } from '@/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenu';
import { SocialNetworksFooter } from '@/presentation/shared/components/SocialNetworksFooter/SocialNetworksFooter';
import { PublicPageLoader } from '@/presentation/shared/components/PublicPageLoader';
import { usePublicLayoutData } from '@/presentation/shared/hooks/usePublicLayoutData';
import { useThemeColor } from '@/presentation/shared/hooks/useThemeColor';
import { formatPrice } from '@/presentation/shared/utils/formatPrice';

interface CustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export function CheckoutClient(): React.ReactElement {
  const router = useRouter();
  const { items, itemCount, clearCart, isLoading: cartLoading } = useCart();
  const { state, data, customLoader, loaderChecked } = usePublicLayoutData();
  const { themeColor } = useThemeColor();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<
    Array<{
      id: string;
      name: string;
      price: number;
      imageUrl: string;
    }>
  >([]);

  // Fetch product details for cart items
  useEffect(() => {
    async function fetchProducts(): Promise<void> {
      if (items.length === 0) return;

      try {
        const response = await fetch('/api/public/products');
        if (response.ok) {
          const result = (await response.json()) as {
            success: boolean;
            data: Array<{
              id: string;
              name: string;
              price: number;
              imageUrl: string;
            }>;
          };
          if (result.success && Array.isArray(result.data)) {
            setProducts(result.data);
          }
        }
      } catch {
        // Products will be empty, handled gracefully
      }
    }

    fetchProducts();
  }, [items]);

  // Calculate cart items with product details
  const cartItemsWithDetails = items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      productId: item.productId,
      productName: product?.name ?? 'Produit inconnu',
      quantity: item.quantity,
      unitPrice: product?.price ?? 0,
      imageUrl: product?.imageUrl,
    };
  });

  const totalPrice = cartItemsWithDetails.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0
  );

  const handleSubmit = async (formData: CustomerFormData): Promise<void> => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/public/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerFirstName: formData.firstName,
          customerLastName: formData.lastName,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          items: cartItemsWithDetails.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error: string };
        throw new Error(errorData.error || 'Erreur lors de la commande');
      }

      const responseData = (await response.json()) as { id: string };

      // Clear cart and redirect to confirmation page
      clearCart();
      router.push(`/commander/confirmation?id=${responseData.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erreur lors de la commande'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loader while fetching layout data (menu, footer, theme)
  if (state.isLoading || cartLoading) {
    return (
      <PublicPageLoader
        isLoading={state.isLoading || cartLoading}
        error={null}
        customLoader={customLoader}
        loaderChecked={loaderChecked}
      />
    );
  }

  // Show complete page only when layout data is ready
  if (state.isComplete && data) {
    if (itemCount === 0) {
      return (
        <Flex direction="column" minH="100vh">
          <PublicHeaderMenu
            menuItems={data.menuData}
            logo={data.logo}
            colorPalette={themeColor}
          />
          <Box flex="1">
            <Container maxW="container.lg" py={8}>
              <VStack gap={6} align="center">
                <Heading size="lg">Votre panier est vide</Heading>
                <Text color="gray.600">
                  Ajoutez des produits à votre panier pour passer commande.
                </Text>
                <Button
                  colorPalette={themeColor}
                  onClick={() => router.push('/')}
                >
                  Retour à l&apos;accueil
                </Button>
              </VStack>
            </Container>
          </Box>
          <SocialNetworksFooter
            socialNetworks={data.footerData.socialNetworks ?? []}
          />
        </Flex>
      );
    }

    return (
      <Flex direction="column" minH="100vh">
        <PublicHeaderMenu
          menuItems={data.menuData}
          logo={data.logo}
          colorPalette={themeColor}
        />
        <Box flex="1">
          <Container maxW="container.lg" py={8}>
            <VStack gap={8} align="stretch">
              <Heading size="xl">Récapitulatif de commande</Heading>

              <Box display={{ base: 'block', md: 'flex' }} gap={8}>
                {/* Order Summary */}
                <Box flex={1} mb={{ base: 8, md: 0 }}>
                  <OrderSummary
                    items={cartItemsWithDetails}
                    totalPrice={totalPrice}
                  />
                </Box>

                {/* Checkout Form */}
                <Box flex={1}>
                  <VStack gap={4} align="stretch">
                    <Heading size="md">Vos informations</Heading>
                    {error && (
                      <Box
                        p={4}
                        bg="red.50"
                        borderRadius="md"
                        borderWidth={1}
                        borderColor="red.200"
                      >
                        <Text color="red.600">{error}</Text>
                      </Box>
                    )}
                    <CheckoutForm
                      onSubmit={handleSubmit}
                      isSubmitting={isSubmitting}
                      totalPrice={formatPrice(totalPrice)}
                    />
                  </VStack>
                </Box>
              </Box>
            </VStack>
          </Container>
        </Box>
        <SocialNetworksFooter
          socialNetworks={data.footerData.socialNetworks ?? []}
        />
      </Flex>
    );
  }

  // Fallback loader
  return (
    <PublicPageLoader
      isLoading={true}
      error={null}
      customLoader={customLoader}
    />
  );
}
