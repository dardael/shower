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
import { AdminMenuItem } from '@/presentation/admin/components/AdminMenuItem';
import { FocusTrap } from '@/presentation/shared/utils/focusTrap';
import { useLogger } from '@/presentation/shared/hooks/useLogger';
import { useSellingConfig } from '@/presentation/shared/contexts/SellingConfigContext';
import { useAppointmentModule } from '@/presentation/shared/contexts/AppointmentModuleContext';
import DarkModeToggle from '@/presentation/shared/components/DarkModeToggle';
import LogoutButton from '@/presentation/shared/components/LogoutButton';

export interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    href: '/admin/website-settings',
    label: 'Paramètres du site',
    description: "Gérer le nom, l'icône et le thème du site",
  },
  {
    href: '/admin/social-networks',
    label: 'Réseaux sociaux',
    description: 'Configurer les liens vers les réseaux sociaux',
  },
  {
    href: '/admin/menu',
    label: 'Menu de navigation',
    description: 'Configurer la navigation du site',
  },
  {
    href: '/admin/products',
    label: 'Produits',
    description: 'Gérer les produits et catégories',
  },
  {
    href: '/admin/appointments',
    label: 'Rendez-vous',
    description: 'Gérer les rendez-vous et disponibilités',
  },
  {
    href: '/admin/email',
    label: 'Notifications email',
    description: "Configurer les paramètres et modèles d'email",
  },
  {
    href: '/admin/maintenance',
    label: 'Maintenance',
    description: 'Configurer les redémarrages programmés',
  },
  {
    href: '/admin/export-import',
    label: 'Export / Import',
    description: 'Sauvegarder et restaurer la configuration',
  },
];

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const logger = useLogger();
  const { sellingEnabled, isLoading: sellingLoading } = useSellingConfig();
  const { isEnabled: appointmentModuleEnabled, isLoading: appointmentLoading } =
    useAppointmentModule();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Filter menu items based on module enabled states
  // While loading, show email menu to avoid flash of missing content
  const modulesLoading = sellingLoading || appointmentLoading;
  const visibleMenuItems = menuItems.filter((item) => {
    if (item.href === '/admin/products') {
      return sellingEnabled;
    }
    if (item.href === '/admin/appointments') {
      return appointmentModuleEnabled;
    }
    if (item.href === '/admin/email') {
      return modulesLoading || sellingEnabled || appointmentModuleEnabled;
    }
    return true;
  });

  const handleClose = () => {
    if (isMobile) {
      logger.info('Sidebar close requested', {
        trigger: 'manual_close',
        isMobile,
      });
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && isMobile) {
        logger.info('Sidebar close requested', {
          trigger: 'escape_key',
          isMobile,
        });
        onClose();
      }
    };

    if (isOpen && isMobile) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isMobile, onClose, logger]);

  useEffect(() => {
    if (!isOpen || !isMobile) return;

    const focusTrap = new FocusTrap({
      containerSelector: '[data-testid="mobile-sidebar"]',
      onEscape: undefined, // Escape is handled by the separate effect above
    });

    // Activate focus trap
    focusTrap.activate();
    logger.debug('Focus trap activated for mobile sidebar');

    return () => {
      // Clean up focus trap
      focusTrap.deactivate();
      logger.debug('Focus trap deactivated for mobile sidebar');
    };
  }, [isOpen, isMobile, logger]);

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
          Panneau Admin
        </Text>
        <HStack gap={2}>
          <LogoutButton />
          <DarkModeToggle size="sm" />
          {isMobile && (
            <IconButton
              aria-label="Fermer le menu"
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
        {visibleMenuItems.map((item) => (
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
        {/* Sidebar as overlay */}
        {isOpen && (
          <Box
            position="fixed"
            top={0}
            left={0}
            h="100vh"
            w="280px"
            style={{ zIndex: 1001 }}
            data-testid="mobile-sidebar"
            role="navigation"
            aria-label="Admin navigation menu"
          >
            {sidebarContent}
          </Box>
        )}

        {/* Backdrop - positioned after sidebar so it can capture clicks outside sidebar */}
        {isOpen && (
          <Box
            position="fixed"
            inset={0}
            bg="blackAlpha.600"
            style={{ zIndex: 1000 }}
            onClick={() => {
              logger.info('Sidebar close requested', {
                trigger: 'backdrop_click',
                isMobile,
              });
              handleClose();
            }}
            data-testid="sidebar-backdrop"
            aria-hidden="true"
            tabIndex={-1}
            _hover={{ cursor: 'pointer' }}
          />
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
  const logger = useLogger();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    logger.info('Sidebar toggle clicked', { trigger: 'toggle_button' });
    props.onClick?.(event);
  };

  return (
    <IconButton
      aria-label="Afficher/masquer le menu"
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
