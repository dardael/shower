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
import { useLogger } from '@/presentation/shared/hooks/useLogger';
import { FrontendLog } from '@/infrastructure/shared/services/FrontendLog';

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

async function getInitialThemeColor(): Promise<ThemeColorToken> {
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
    // Use FrontendLog for consistent logging
    const frontendLog = new FrontendLog();
    frontendLog.warn('Failed to fetch initial theme color, using default', {
      error: error instanceof Error ? error.message : 'Unknown error',
      fallbackColor: 'blue',
    });
    return 'blue';
  }
}

function ThemeProviderWithInitialColor({
  children,
}: {
  children: React.ReactNode;
}) {
  const [initialThemeColor, setInitialThemeColor] =
    useState<ThemeColorToken>('blue');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getInitialThemeColor()
      .then((color) => {
        setInitialThemeColor(color);
      })
      .catch(() => {
        // Error already logged in getInitialThemeColor, but ensure fallback
        setInitialThemeColor('blue');
      })
      .finally(() => setIsLoading(false));
  }, []);

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
  const logger = useLogger();

  // Development-specific cleanup for hot module reloading
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Listen for hot module replacement events
      if (typeof window !== 'undefined') {
        const extendedWindow = window as ExtendedWindow;
        if (extendedWindow.__webpack_require__?.hot) {
          const handleHotReload = () => {
            logger.info('Hot module replacement triggered');
          };

          extendedWindow.__webpack_require__.hot.addDisposeHandler(
            handleHotReload
          );
        }
      }
    }
  }, [logger]);

  return (
    <ThemeProviderWithInitialColor>
      <ColorModeProvider {...props} />
      <Toaster />
    </ThemeProviderWithInitialColor>
  );
}

export function Provider(props: ColorModeProviderProps) {
  return <ProviderWithLogger {...props} />;
}
