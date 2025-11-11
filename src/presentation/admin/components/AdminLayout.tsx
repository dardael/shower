'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Box, HStack } from '@chakra-ui/react';
import { AdminSidebar, AdminSidebarToggle } from './AdminSidebar';
import AdminErrorBoundary from './AdminErrorBoundary';
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
        if (trimmedState === 'true' || trimmedState === 'false') {
          setIsSidebarOpen(trimmedState === 'true');
        } else {
          const parsed = JSON.parse(savedState);
          setIsSidebarOpen(Boolean(parsed));
        }
      }
    } catch (error) {
      storageErrorHandler.handleError(error, 'load');
    }
  }, [storageErrorHandler]);

  useEffect(() => {
    try {
      const cleanValue = Boolean(isSidebarOpen);
      localStorage.setItem('admin-sidebar-open', JSON.stringify(cleanValue));
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
        <Box bg="bg.canvas" style={{ minHeight: '100vh' }}>
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
                style={{
                  borderBottom: '1px solid var(--chakra-colors-border)',
                }}
                borderColor="border"
                bg="bg.subtle"
                justify="space-between"
                align="center"
                data-testid="mobile-header"
              >
                <Box fontSize="lg" fontWeight="semibold" color="fg">
                  Admin Panel
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
