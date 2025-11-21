'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { ColorModeProvider, type ColorModeProviderProps } from './color-mode';
import { Toaster } from './toaster';
import { createDynamicSystem } from '@/presentation/shared/theme';
import { DynamicThemeProvider } from '@/presentation/shared/DynamicThemeProvider';
import { useThemeColorContext } from '@/presentation/shared/contexts/ThemeColorContext';
import { useEffect, useState } from 'react';
import { Logger } from '@/application/shared/Logger';
import { RemoteLoggerAdapter } from '@/infrastructure/shared/adapters/RemoteLoggerAdapter';
import { LoggerProvider } from '@/presentation/shared/contexts/LoggerContext';
import { ThemeColorProvider } from '@/presentation/shared/contexts/ThemeColorContext';
import { ThemeColorToken } from '@/domain/settings/constants/ThemeColorPalette';

// Type guard to check if the adapter is RemoteLoggerAdapter
function isRemoteLoggerAdapter(
  adapter: unknown
): adapter is RemoteLoggerAdapter {
  return adapter instanceof RemoteLoggerAdapter;
}

// Helper function to safely access the RemoteLoggerAdapter from Logger
function getLoggerAdapter(logger: Logger): RemoteLoggerAdapter | null {
  try {
    // Access the private logger property through type assertion with unknown intermediate
    const loggerAsUnknown = logger as unknown;
    const loggerWithAdapter = loggerAsUnknown as { logger: unknown };
    const adapter = loggerWithAdapter.logger;

    if (isRemoteLoggerAdapter(adapter)) {
      return adapter;
    }
    return null;
  } catch {
    return null;
  }
}

// Type definitions for webpack hot module replacement
interface WebpackHot {
  addDisposeHandler: (callback: () => void) => void;
  removeDisposeHandler?: (callback: () => void) => void;
}

interface WebpackRequire {
  hot?: WebpackHot;
}

interface ExtendedWindow extends Window {
  __webpack_require__?: WebpackRequire;
}

function DynamicChakraProvider({ children }: { children: React.ReactNode }) {
  const { themeColor } = useThemeColorContext();
  const dynamicSystem = createDynamicSystem(themeColor);

  return <ChakraProvider value={dynamicSystem}>{children}</ChakraProvider>;
}

function ThemeProviderWithInitialColor({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeColorProvider>
      <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
    </ThemeColorProvider>
  );
}

function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  const { isLoading } = useThemeColorContext();

  if (isLoading) {
    // Show a minimal loading state to prevent visual flicker
    // Get stored theme color to avoid blue flash
    if (typeof window !== 'undefined') {
      void (
        (localStorage.getItem('shower-theme-color') as ThemeColorToken) ||
        'blue'
      );
    }

    return (
      <DynamicThemeProvider>
        <DynamicChakraProvider>
          <div style={{ opacity: 0 }} />
        </DynamicChakraProvider>
      </DynamicThemeProvider>
    );
  }

  // If there was an error fetching theme color, still render with fallback
  return (
    <DynamicThemeProvider>
      <DynamicChakraProvider>{children}</DynamicChakraProvider>
    </DynamicThemeProvider>
  );
}

function ProviderWithLogger(props: ColorModeProviderProps) {
  const [logger] = useState(
    () => new Logger(RemoteLoggerAdapter.getInstance())
  );

  useEffect(() => {
    // Cleanup RemoteLoggerAdapter when component unmounts
    // This prevents memory leaks during development hot reloading
    return () => {
      const adapter = getLoggerAdapter(logger);
      if (adapter && typeof adapter.cleanup === 'function') {
        adapter.cleanup();
      }
    };
  }, [logger]);

  // Development-specific cleanup for hot module reloading
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Add cleanup for hot module replacement
      const handleHotReload = () => {
        const adapter = getLoggerAdapter(logger);
        if (adapter && typeof adapter.cleanup === 'function') {
          adapter.cleanup();
        }
      };

      // Memory leak detection in development
      const checkMemoryLeaks = () => {
        const adapter = getLoggerAdapter(logger);
        if (adapter && typeof adapter.getQueueSize === 'function') {
          // Check for potential memory leaks
          const queueSize = adapter.getQueueSize();
          if (queueSize && queueSize > 100) {
            logger.warn(
              `RemoteLogger: Large queue size detected (${queueSize}), potential memory leak`,
              { queueSize, threshold: 100 }
            );
          }
        }
      };

      // Listen for hot module replacement events
      if (typeof window !== 'undefined') {
        const extendedWindow = window as ExtendedWindow;
        if (extendedWindow.__webpack_require__?.hot) {
          extendedWindow.__webpack_require__.hot.addDisposeHandler(
            handleHotReload
          );
        }
      }

      // Periodic memory leak check in development
      const memoryCheckInterval = setInterval(checkMemoryLeaks, 30000); // Check every 30 seconds

      return () => {
        // Remove hot module replacement handler
        if (typeof window !== 'undefined') {
          const extendedWindow = window as ExtendedWindow;
          if (extendedWindow.__webpack_require__?.hot?.removeDisposeHandler) {
            extendedWindow.__webpack_require__.hot.removeDisposeHandler(
              handleHotReload
            );
          }
        }

        // Clear memory check interval
        clearInterval(memoryCheckInterval);
      };
    }
  }, [logger]);

  return (
    <LoggerProvider logger={logger}>
      <ThemeProviderWithInitialColor>
        <ColorModeProvider {...props} />
        <Toaster />
      </ThemeProviderWithInitialColor>
    </LoggerProvider>
  );
}

export function Provider(props: ColorModeProviderProps) {
  return <ProviderWithLogger {...props} />;
}
