'use client';

import React from 'react';
import { IconButton, HStack, Text } from '@chakra-ui/react';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { useCart } from '@/presentation/shared/contexts/CartContext';
import { useSellingConfig } from '@/presentation/shared/contexts/SellingConfigContext';
import { useThemeColor } from '@/presentation/shared/hooks/useThemeColor';

interface AddToCartButtonProps {
  productId: string;
  disabled?: boolean;
  onQuantityChange?: () => void;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export function AddToCartButton({
  productId,
  disabled = false,
  onQuantityChange,
  size = 'md',
}: AddToCartButtonProps): React.JSX.Element | null {
  const { items, addItem, updateQuantity, removeItem } = useCart();
  const { sellingEnabled } = useSellingConfig();
  const { themeColor } = useThemeColor();

  if (!sellingEnabled) {
    return null;
  }

  const cartItem = items.find((item) => item.productId === productId);
  const quantity = cartItem?.quantity ?? 0;

  const handleAdd = (): void => {
    if (disabled) return;
    addItem(productId);
    onQuantityChange?.();
  };

  const handleIncrement = (): void => {
    if (disabled) return;
    updateQuantity(productId, quantity + 1);
    onQuantityChange?.();
  };

  const handleDecrement = (): void => {
    if (disabled) return;
    if (quantity <= 1) {
      removeItem(productId);
    } else {
      updateQuantity(productId, quantity - 1);
    }
    onQuantityChange?.();
  };

  if (quantity === 0) {
    return (
      <IconButton
        onClick={handleAdd}
        disabled={disabled}
        size={size}
        variant="solid"
        colorPalette={themeColor}
        aria-label="Ajouter au panier"
      >
        <FiPlus />
      </IconButton>
    );
  }

  return (
    <HStack gap={1} align="baseline">
      <IconButton
        onClick={handleDecrement}
        disabled={disabled}
        size={size}
        variant="solid"
        colorPalette={themeColor}
        aria-label="Diminuer la quantité"
      >
        <FiMinus />
      </IconButton>
      <Text
        fontSize={size === 'xs' ? 'xs' : size === 'sm' ? 'sm' : 'md'}
        fontWeight="semibold"
        minW="24px"
        textAlign="center"
      >
        {quantity}
      </Text>
      <IconButton
        onClick={handleIncrement}
        disabled={disabled}
        size={size}
        variant="solid"
        colorPalette={themeColor}
        aria-label="Augmenter la quantité"
      >
        <FiPlus />
      </IconButton>
    </HStack>
  );
}
