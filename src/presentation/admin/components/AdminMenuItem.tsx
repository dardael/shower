'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { VStack, Text, Link } from '@chakra-ui/react';
import { useLogger } from '@/presentation/shared/hooks/useLogger';

export interface AdminMenuItemProps {
  href: string;
  label: string;
  description: string;
  onClick?: () => void;
}

export function AdminMenuItem({
  href,
  label,
  description,
  onClick,
}: AdminMenuItemProps) {
  const logger = useLogger();
  const router = useRouter();
  const pathname = usePathname();
  const isActive =
    pathname === href || (href.endsWith('/') && pathname === href.slice(0, -1));

  const handleClick = () => {
    logger.info('Menu item clicked', { href, label, isActive });
    router.push(href);
    onClick?.();
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      data-testid={`menu-item-${href.replace('/admin/', '')}`}
      data-active={isActive ? 'true' : undefined}
      w="full"
      p={3}
      borderRadius="lg"
      bg={isActive ? 'colorPalette.subtle' : 'transparent'}
      color={isActive ? 'colorPalette.fg' : 'fg'}
      border="1px solid"
      borderColor={isActive ? 'colorPalette.border' : 'transparent'}
      _hover={{
        bg: isActive ? 'colorPalette.muted' : 'bg.muted',
        borderColor: isActive ? 'colorPalette.border' : 'border',
        textDecoration: 'none',
      }}
      _active={{
        bg: isActive ? 'colorPalette.muted' : 'bg.muted',
      }}
      display="block"
    >
      <VStack align="start" gap={1} w="full">
        <Text
          fontSize="sm"
          fontWeight="medium"
          color="inherit"
          textAlign="left"
        >
          {label}
        </Text>
        <Text fontSize="xs" color="fg.muted" textAlign="left">
          {description}
        </Text>
      </VStack>
    </Link>
  );
}
