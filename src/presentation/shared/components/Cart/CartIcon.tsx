'use client';

import { IconButton, Box, Text } from '@chakra-ui/react';
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '@/presentation/shared/contexts/CartContext';
import { useSellingConfig } from '@/presentation/shared/contexts/SellingConfigContext';

interface CartIconProps {
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function CartIcon({
  onClick,
  size = 'md',
}: CartIconProps): React.JSX.Element | null {
  const { itemCount } = useCart();
  const { sellingEnabled } = useSellingConfig();

  if (!sellingEnabled) {
    return null;
  }

  return (
    <Box position="relative" display="inline-block">
      <IconButton
        aria-label={`Panier avec ${itemCount} articles`}
        onClick={onClick}
        variant="ghost"
        size={size}
      >
        <FiShoppingCart />
      </IconButton>
      {itemCount > 0 && (
        <Box
          position="absolute"
          top="-2px"
          right="-2px"
          bg="red.500"
          color="white"
          borderRadius="full"
          minW="18px"
          h="18px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="xs"
          fontWeight="bold"
        >
          <Text>{itemCount > 99 ? '99+' : itemCount}</Text>
        </Box>
      )}
    </Box>
  );
}
