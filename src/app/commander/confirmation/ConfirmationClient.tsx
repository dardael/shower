'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Container,
  Flex,
} from '@chakra-ui/react';
import { FiCheckCircle } from 'react-icons/fi';
import Link from 'next/link';
import { PublicHeaderMenu } from '@/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenu';
import { SocialNetworksFooter } from '@/presentation/shared/components/SocialNetworksFooter/SocialNetworksFooter';
import { PublicPageLoader } from '@/presentation/shared/components/PublicPageLoader';
import { usePublicLayoutData } from '@/presentation/shared/hooks/usePublicLayoutData';
import { useThemeColor } from '@/presentation/shared/hooks/useThemeColor';
import { formatPrice } from '@/presentation/shared/utils/formatPrice';

interface OrderDetails {
  id: string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  items: Array<{
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
  totalPrice: number;
  createdAt: string;
}

export default function ConfirmationClient(): React.JSX.Element {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const { state, data, retry, customLoader } = usePublicLayoutData();
  const { themeColor } = useThemeColor();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isOrderLoading, setIsOrderLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder(): Promise<void> {
      if (!orderId) {
        setError('Identifiant de commande manquant');
        setIsOrderLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/public/orders/${orderId}`);
        if (!response.ok) {
          throw new Error('Commande introuvable');
        }
        const orderData = (await response.json()) as OrderDetails;
        setOrder(orderData);
      } catch {
        setError('Impossible de charger les détails de la commande');
      } finally {
        setIsOrderLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  // Show loader while layout or order is loading
  if (state.isLoading || isOrderLoading) {
    return (
      <PublicPageLoader
        isLoading={true}
        error={null}
        customLoader={customLoader}
      />
    );
  }

  // Show error if layout failed
  if (state.error) {
    return (
      <PublicPageLoader
        isLoading={false}
        error={state.error}
        onRetry={retry}
        customLoader={customLoader}
      />
    );
  }

  // Render page when layout is ready
  if (state.isComplete && data) {
    if (error || !order) {
      return (
        <Flex direction="column" minH="100vh">
          <PublicHeaderMenu
            menuItems={data.menuData}
            logo={data.logo}
            colorPalette={themeColor}
          />
          <Box flex="1">
            <Container maxW="container.md" py={10}>
              <VStack gap={6} textAlign="center">
                <Heading size="lg" color="red.500">
                  {error || 'Une erreur est survenue'}
                </Heading>
                <Link href="/" passHref>
                  <Button colorPalette={themeColor}>
                    Retour à l&apos;accueil
                  </Button>
                </Link>
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
          <Container maxW="container.md" py={10}>
            <VStack gap={8} textAlign="center">
              <Box color="green.500" fontSize="6xl">
                <FiCheckCircle />
              </Box>

              <VStack gap={2}>
                <Heading size="xl">Merci pour votre commande !</Heading>
                <Text fontSize="lg" color="gray.600">
                  Votre commande a été enregistrée avec succès.
                </Text>
              </VStack>

              <Box
                w="100%"
                bg="white"
                borderRadius="lg"
                boxShadow="md"
                p={6}
                textAlign="left"
              >
                <VStack gap={4} align="stretch">
                  <Heading size="md">Récapitulatif de la commande</Heading>

                  <Box>
                    <Text fontWeight="bold">Numéro de commande :</Text>
                    <Text color="gray.600">{order.id}</Text>
                  </Box>

                  <Box>
                    <Text fontWeight="bold">Client :</Text>
                    <Text color="gray.600">
                      {order.customerFirstName} {order.customerLastName}
                    </Text>
                    <Text color="gray.600">{order.customerEmail}</Text>
                  </Box>

                  <Box>
                    <Text fontWeight="bold" mb={2}>
                      Articles :
                    </Text>
                    <VStack align="stretch" gap={2}>
                      {order.items.map((item, index) => (
                        <Box
                          key={index}
                          display="flex"
                          justifyContent="space-between"
                        >
                          <Text>
                            {item.productName} x{item.quantity}
                          </Text>
                          <Text fontWeight="medium">
                            {formatPrice(item.unitPrice * item.quantity)}
                          </Text>
                        </Box>
                      ))}
                    </VStack>
                  </Box>

                  <Box
                    borderTop="1px solid"
                    borderColor="gray.200"
                    pt={4}
                    display="flex"
                    justifyContent="space-between"
                  >
                    <Text fontWeight="bold" fontSize="lg">
                      Total :
                    </Text>
                    <Text fontWeight="bold" fontSize="lg" color="black">
                      {formatPrice(order.totalPrice)}
                    </Text>
                  </Box>
                </VStack>
              </Box>

              <Link href="/" passHref>
                <Button colorPalette={themeColor} size="lg">
                  Retour à l&apos;accueil
                </Button>
              </Link>
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
