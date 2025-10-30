'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { ColorModeProvider, type ColorModeProviderProps } from './color-mode';
import { Toaster } from './toaster';
import { createDynamicSystem } from '@/presentation/shared/theme';
import {
  DynamicThemeProvider,
  useDynamicTheme,
} from '@/presentation/shared/DynamicThemeProvider';
import { useEffect, useState } from 'react';
import { ThemeColorToken } from '@/domain/settings/constants/ThemeColorPalette';
import { Logger } from '@/application/shared/Logger';
import { RemoteLoggerAdapter } from '@/infrastructure/shared/adapters/RemoteLoggerAdapter';
import { LoggerProvider } from '@/presentation/shared/contexts/LoggerContext';

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
  const { themeColor } = useDynamicTheme();
  const dynamicSystem = createDynamicSystem(themeColor);

  return <ChakraProvider value={dynamicSystem}>{children}</ChakraProvider>;
}

async function getInitialThemeColor(logger: Logger): Promise<ThemeColorToken> {
  try {
    const response = await fetch('/api/settings/theme-color', {
      cache: 'force-cache',
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.themeColor || 'blue';
  } catch (error) {
    logger.warn('Failed to fetch initial theme color, using default', {
      error: error instanceof Error ? error.message : 'Unknown error',
      fallbackColor: 'blue',
    });
    return 'blue';
  }
}

function ThemeProviderWithInitialColor({
  children,
  logger,
}: {
  children: React.ReactNode;
  logger: Logger;
}) {
  const [initialThemeColor, setInitialThemeColor] =
    useState<ThemeColorToken>('blue');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getInitialThemeColor(logger)
      .then((color) => {
        setInitialThemeColor(color);
      })
      .catch(() => {
        // Error already logged in getInitialThemeColor, but ensure fallback
        setInitialThemeColor('blue');
      })
      .finally(() => setIsLoading(false));
  }, [logger]);

  if (isLoading) {
    // Show a minimal loading state to prevent visual flicker
    return (
      <DynamicThemeProvider initialThemeColor="blue">
        <DynamicChakraProvider>
          <div style={{ opacity: 0 }} />
        </DynamicChakraProvider>
      </DynamicThemeProvider>
    );
  }

  // If there was an error fetching theme color, still render with fallback
  return (
    <DynamicThemeProvider initialThemeColor={initialThemeColor}>
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
            console.warn(
              `RemoteLogger: Large queue size detected (${queueSize}), potential memory leak`
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
      <ThemeProviderWithInitialColor logger={logger}>
        <ColorModeProvider {...props} />
        <Toaster />
      </ThemeProviderWithInitialColor>
    </LoggerProvider>
  );
}

export function Provider(props: ColorModeProviderProps) {
  return <ProviderWithLogger {...props} />;
}
