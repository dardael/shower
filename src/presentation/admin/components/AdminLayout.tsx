'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Box, HStack } from '@chakra-ui/react';
import {
  AdminSidebar,
  AdminSidebarToggle,
} from '@/presentation/admin/components/AdminSidebar';
import AdminErrorBoundary from '@/presentation/admin/components/AdminErrorBoundary';
import { useLogger } from '@/presentation/shared/hooks/useLogger';
import { LocalStorageErrorHandler } from '@/presentation/shared/utils/localStorageErrorHandler';

interface AdminLayoutContextValue {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

const AdminLayoutContext = createContext<AdminLayoutContextValue | null>(null);

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const logger = useLogger();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  const storageErrorHandler = React.useMemo(
    () =>
      new LocalStorageErrorHandler({
        logger,
        onError: setStorageError,
        storageKey: 'admin-sidebar-open',
      }),
    [logger]
  );

  useEffect(() => {
    try {
      const savedState = localStorage.getItem('admin-sidebar-open');
      if (savedState !== null) {
        const trimmedState = savedState.trim();

        // Handle migration from old formats to new boolean format
        let isOpen = false;
        if (trimmedState === 'true') {
          isOpen = true;
        } else if (trimmedState === 'false') {
          isOpen = false;
        } else {
          // Try parsing as JSON (old format) and migrate to boolean
          try {
            isOpen = Boolean(JSON.parse(savedState));
          } catch {
            // Fallback to false if parsing fails
            isOpen = false;
          }
        }

        setIsSidebarOpen(isOpen);
      }
    } catch (error) {
      storageErrorHandler.handleError(error, 'load');
    }
  }, [storageErrorHandler]);

  useEffect(() => {
    try {
      // Store as simple boolean string for consistency
      const cleanValue = Boolean(isSidebarOpen);
      localStorage.setItem('admin-sidebar-open', cleanValue.toString());
      setStorageError(null);
    } catch (error) {
      storageErrorHandler.handleError(error, 'save');
    }
  }, [isSidebarOpen, storageErrorHandler]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const contextValue: AdminLayoutContextValue = {
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
  };

  return (
    <AdminErrorBoundary>
      <AdminLayoutContext.Provider value={contextValue}>
        <Box bg="bg.canvas" minH="100vh">
          {/* Storage error notification */}
          {storageError && (
            <Box
              bg="warning.subtle"
              color="warning.fg"
              border="1px solid"
              borderColor="warning.border"
              p={3}
              textAlign="center"
              fontSize="sm"
            >
              {storageError}
            </Box>
          )}

          <HStack align="start" gap={0}>
            {/* Sidebar navigation */}
            <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

            {/* Main content area */}
            <Box flex={1} w="full" position="relative">
              {/* Mobile header with sidebar toggle */}
              <HStack
                display={{ base: 'flex', md: 'none' }}
                p={4}
                borderBottom="1px solid"
                borderBottomColor="border"
                bg="bg.subtle"
                justify="space-between"
                align="center"
                data-testid="mobile-header"
              >
                <Box fontSize="lg" fontWeight="semibold" color="fg">
                  Panneau Admin
                </Box>
                <AdminSidebarToggle onClick={toggleSidebar} />
              </HStack>

              {/* Page content */}
              <Box p={{ base: 4, md: 6 }} data-testid="main-content">
                {children}
              </Box>
            </Box>
          </HStack>
        </Box>
      </AdminLayoutContext.Provider>
    </AdminErrorBoundary>
  );
}

export function useAdminLayout(): AdminLayoutContextValue {
  const context = useContext(AdminLayoutContext);

  if (!context) {
    throw new Error('useAdminLayout must be used within an AdminLayout');
  }

  return context;
}
