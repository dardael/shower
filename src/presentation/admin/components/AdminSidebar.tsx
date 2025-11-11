'use client';

import React, { useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  IconButton,
  useBreakpointValue,
  type IconButtonProps,
} from '@chakra-ui/react';
import { FiMenu, FiX } from 'react-icons/fi';
import { AdminMenuItem } from './AdminMenuItem';
import { FocusTrap } from '@/presentation/shared/utils/focusTrap';

export interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    href: '/admin/website-settings',
    label: 'Website Settings',
    description: 'Manage website name, icon, and theme',
  },
  {
    href: '/admin/social-networks',
    label: 'Social Networks',
    description: 'Configure social media links',
  },
];

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleClose = () => {
    if (isMobile) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && isMobile) {
        onClose();
      }
    };

    if (isOpen && isMobile) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isMobile, onClose]);

  useEffect(() => {
    if (!isOpen || !isMobile) return;

    const focusTrap = new FocusTrap({
      containerSelector: '[data-testid="mobile-sidebar"]',
      onEscape: undefined, // Escape is handled by the separate effect above
    });

    focusTrap.activate();

    return () => {
      focusTrap.deactivate();
    };
  }, [isOpen, isMobile]);

  const sidebarContent = (
    <VStack
      align="start"
      gap={1}
      h="full"
      w={{ base: '280px', md: '260px' }}
      bg="bg.subtle"
      borderEnd="1px solid"
      borderEndColor="border"
      p={{ base: 4, md: 6 }}
    >
      {/* Header */}
      <HStack
        justify="space-between"
        align="center"
        w="full"
        mb={{ base: 6, md: 8 }}
      >
        <Text
          fontSize={{ base: 'lg', md: 'xl' }}
          fontWeight="semibold"
          color="fg"
        >
          Admin Panel
        </Text>
        {isMobile && (
          <IconButton
            aria-label="Close sidebar"
            variant="ghost"
            size="sm"
            onClick={handleClose}
            color="fg.muted"
            _hover={{ bg: 'bg.muted', color: 'fg' }}
          >
            <FiX size={18} />
          </IconButton>
        )}
      </HStack>

      {/* Navigation Menu */}
      <VStack
        as="nav"
        align="start"
        gap={2}
        w="full"
        flex={1}
        role="navigation"
        aria-label="Admin sections"
      >
        {menuItems.map((item) => (
          <AdminMenuItem
            key={item.href}
            href={item.href}
            label={item.label}
            description={item.description}
            onClick={handleClose}
          />
        ))}
      </VStack>
    </VStack>
  );

  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        {isOpen && (
          <Box
            position="fixed"
            inset={0}
            bg="blackAlpha.600"
            zIndex="overlay"
            onClick={handleClose}
            data-testid="sidebar-backdrop"
            aria-hidden="true"
            tabIndex={-1}
          />
        )}

        {/* Sidebar as overlay */}
        {isOpen && (
          <Box
            position="fixed"
            top={0}
            left={0}
            h="100vh"
            w="280px"
            zIndex="modal"
            data-testid="mobile-sidebar"
            role="navigation"
            aria-label="Admin navigation menu"
          >
            {sidebarContent}
          </Box>
        )}
      </>
    );
  }

  return (
    <Box
      h="100vh"
      position="sticky"
      top={0}
      display={{ base: 'none', md: 'block' }}
      data-testid="desktop-sidebar"
    >
      {sidebarContent}
    </Box>
  );
}

export function AdminSidebarToggle(props: IconButtonProps) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    props.onClick?.(event);
  };

  return (
    <IconButton
      aria-label="Toggle sidebar"
      variant="ghost"
      size="sm"
      onClick={handleClick}
      color="fg.muted"
      _hover={{ bg: 'bg.muted', color: 'fg' }}
      _active={{ bg: 'bg.muted' }}
      data-testid="sidebar-toggle"
      {...props}
    >
      <FiMenu size={18} />
    </IconButton>
  );
}
