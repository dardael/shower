'use client';

import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Image,
  Heading,
  Separator,
} from '@chakra-ui/react';
import { formatPrice } from '@/presentation/shared/utils/formatPrice';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  imageUrl?: string;
}

interface OrderSummaryProps {
  items: OrderItem[];
  totalPrice: number;
}

export function OrderSummary({
  items,
  totalPrice,
}: OrderSummaryProps): React.ReactElement {
  return (
    <Box borderWidth={1} borderRadius="lg" p={6}>
      <Heading size="md" mb={4}>
        Votre panier
      </Heading>
      <VStack gap={4} align="stretch">
        {items.map((item) => (
          <HStack key={item.productId} gap={4}>
            {item.imageUrl && (
              <Image
                src={item.imageUrl}
                alt={item.productName}
                boxSize="60px"
                objectFit="cover"
                borderRadius="md"
              />
            )}
            <Box flex={1}>
              <Text fontWeight="medium">{item.productName}</Text>
              <Text fontSize="sm" color="gray.600">
                {item.quantity} x {formatPrice(item.unitPrice)}
              </Text>
            </Box>
            <Text fontWeight="semibold">
              {formatPrice(item.unitPrice * item.quantity)}
            </Text>
          </HStack>
        ))}

        <Separator />

        <HStack justify="space-between">
          <Text fontWeight="bold" fontSize="lg">
            Total
          </Text>
          <Text fontWeight="bold" fontSize="lg">
            {formatPrice(totalPrice)}
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
}
