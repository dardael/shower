'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { ColorModeProvider, type ColorModeProviderProps } from './color-mode';
import { Toaster } from './toaster';
import { createDynamicSystem } from '@/presentation/shared/theme';
import { DynamicThemeProvider } from '@/presentation/shared/DynamicThemeProvider';
import { useThemeColorContext } from '@/presentation/shared/contexts/ThemeColorContext';
import { useEffect } from 'react';
import { ThemeColorProvider } from '@/presentation/shared/contexts/ThemeColorContext';
import { ThemeColorToken } from '@/domain/settings/constants/ThemeColorPalette';
import { useLogger } from '@/presentation/shared/hooks/useLogger';

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
