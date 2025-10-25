'use client';

import { Button } from '@chakra-ui/react';

interface SaveButtonProps {
  isLoading?: boolean;
  disabled?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  width?: string | { base?: string; md?: string };
}

export default function SaveButton({
  isLoading = false,
  disabled = false,
  loadingText = 'Saving...',
  children,
  onClick,
  type = 'button',
  width = 'full',
}: SaveButtonProps) {
  return (
    <Button
      type={type}
      disabled={disabled || isLoading}
      loading={isLoading}
      loadingText={loadingText}
      variant="solid"
      size={{ base: 'md', md: 'lg' }}
      width={width}
      height={{ base: '44px', md: '48px' }}
      borderRadius="lg"
      fontSize={{ base: 'sm', md: 'md' }}
      fontWeight="semibold"
      mt={2}
      onClick={onClick}
      _dark={{
        bg: 'colorPalette.solid',
        _hover: { bg: 'colorPalette.emphasized' },
        _disabled: { bg: 'colorPalette.muted' },
      }}
    >
      {children}
    </Button>
  );
}
