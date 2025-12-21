'use client';

import { Box, HStack, Text, VStack, IconButton, Image } from '@chakra-ui/react';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useCart } from '@/presentation/shared/contexts/CartContext';
import { formatPrice } from '@/presentation/shared/utils/formatPrice';

interface CartItemRowProps {
  productId: string;
  productName: string;
  productImage?: string;
  price: number;
  quantity: number;
  onRemove?: () => void;
}

export function CartItemRow({
  productId,
  productName,
  productImage,
  price,
  quantity,
  onRemove,
}: CartItemRowProps): React.JSX.Element {
  const { updateQuantity, removeItem } = useCart();

  const handleIncrement = (): void => {
    updateQuantity(productId, quantity + 1);
  };

  const handleDecrement = (): void => {
    if (quantity <= 1) {
      removeItem(productId);
      onRemove?.();
    } else {
      updateQuantity(productId, quantity - 1);
    }
  };

  const handleRemove = (): void => {
    removeItem(productId);
    onRemove?.();
  };

  const lineTotal = price * quantity;

  return (
    <HStack
      p={3}
      borderRadius="md"
      bg="bg.subtle"
      gap={3}
      align="flex-start"
      data-testid={`cart-item-${productId}`}
    >
      {productImage && (
        <Box
          width="60px"
          height="60px"
          borderRadius="md"
          overflow="hidden"
          flexShrink={0}
        >
          <Image
            src={productImage}
            alt={productName}
            width="60px"
            height="60px"
            objectFit="cover"
          />
        </Box>
      )}

      <VStack align="stretch" flex={1} gap={1}>
        <Text fontWeight="semibold" fontSize="sm" lineClamp={2}>
          {productName}
        </Text>
        <Text color="fg.muted" fontSize="xs">
          {formatPrice(price)} / unité
        </Text>
        <Text fontWeight="bold" fontSize="sm">
          {formatPrice(lineTotal)}
        </Text>
      </VStack>

      <VStack gap={1} align="center">
        <HStack gap={1}>
          <IconButton
            aria-label="Diminuer la quantité"
            size="xs"
            variant="outline"
            onClick={handleDecrement}
          >
            <FiMinus />
          </IconButton>
          <Text
            fontSize="sm"
            fontWeight="semibold"
            minW="24px"
            textAlign="center"
          >
            {quantity}
          </Text>
          <IconButton
            aria-label="Augmenter la quantité"
            size="xs"
            variant="outline"
            onClick={handleIncrement}
          >
            <FiPlus />
          </IconButton>
        </HStack>
        <IconButton
          aria-label="Retirer du panier"
          size="xs"
          variant="ghost"
          colorPalette="red"
          onClick={handleRemove}
        >
          <FiTrash2 />
        </IconButton>
      </VStack>
    </HStack>
  );
}
