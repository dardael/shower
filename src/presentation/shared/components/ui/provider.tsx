'use client';

import { ChakraProvider } from '@chakra-ui/react';
import {
  ColorModeProvider,
  useColorMode,
  type ColorModeProviderProps,
} from './color-mode';
import { Toaster } from './toaster';
import { createDynamicSystem } from '@/presentation/shared/theme';
import { DynamicThemeProvider } from '@/presentation/shared/DynamicThemeProvider';
import { useThemeColorContext } from '@/presentation/shared/contexts/ThemeColorContext';
import { useEffect } from 'react';
import { ThemeColorProvider } from '@/presentation/shared/contexts/ThemeColorContext';
import { ThemeColorToken } from '@/domain/settings/constants/ThemeColorPalette';
import { useLogger } from '@/presentation/shared/hooks/useLogger';
import { FontProvider } from '@/presentation/shared/components/FontProvider';
import {
  BackgroundColorProvider,
  useBackgroundColorContext,
} from '@/presentation/shared/contexts/BackgroundColorContext';
import { ThemeModeProvider } from '@/presentation/shared/contexts/ThemeModeContext';
import { SellingConfigProvider } from '@/presentation/shared/contexts/SellingConfigContext';
import { CartProvider } from '@/presentation/shared/contexts/CartContext';

// Background color hex mappings for light and dark modes
export const BACKGROUND_COLOR_MAP: Record<
  ThemeColorToken,
  { light: string; dark: string }
> = {
  blue: { light: '#eff6ff', dark: '#1e3a5f' },
  red: { light: '#fef2f2', dark: '#450a0a' },
  green: { light: '#f0fdf4', dark: '#14532d' },
  purple: { light: '#faf5ff', dark: '#3b0764' },
  orange: { light: '#fff7ed', dark: '#431407' },
  teal: { light: '#f0fdfa', dark: '#134e4a' },
  pink: { light: '#fdf2f8', dark: '#500724' },
  cyan: { light: '#ecfeff', dark: '#164e63' },
  beige: { light: '#cdb99d', dark: '#a89070' },
  cream: { light: '#ede6dd', dark: '#3d3830' },
  gold: { light: '#eeb252', dark: '#8b6914' },
  sand: { light: '#f2e8de', dark: '#4a4238' },
  taupe: { light: '#e2cbac', dark: '#5c4d3a' },
  white: { light: '#ffffff', dark: '#1a1a1a' },
};

// Component that applies background color to the body element
function BackgroundColorApplier({ children }: { children: React.ReactNode }) {
  const { backgroundColor, isLoading } = useBackgroundColorContext();
  const { colorMode } = useColorMode();

  useEffect(() => {
    if (isLoading) return;

    const colorConfig = BACKGROUND_COLOR_MAP[backgroundColor];
    if (!colorConfig) return;

    const bgColor = colorMode === 'dark' ? colorConfig.dark : colorConfig.light;
    document.documentElement.style.backgroundColor = bgColor;
    document.body.style.backgroundColor = bgColor;

    return () => {
      document.documentElement.style.backgroundColor = '';
      document.body.style.backgroundColor = '';
    };
  }, [backgroundColor, colorMode, isLoading]);

  return <>{children}</>;
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
      <BackgroundColorProvider>
        <ThemeModeProvider>
          <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
        </ThemeModeProvider>
      </BackgroundColorProvider>
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
          <FontProvider>
            <div style={{ opacity: 0 }} />
          </FontProvider>
        </DynamicChakraProvider>
      </DynamicThemeProvider>
    );
  }

  // If there was an error fetching theme color, still render with fallback
  return (
    <DynamicThemeProvider>
      <DynamicChakraProvider>
        <FontProvider>{children}</FontProvider>
      </DynamicChakraProvider>
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
      <ColorModeProvider {...props}>
        <SellingConfigProvider>
          <CartProvider>
            <BackgroundColorApplier>{props.children}</BackgroundColorApplier>
          </CartProvider>
        </SellingConfigProvider>
      </ColorModeProvider>
      <Toaster />
    </ThemeProviderWithInitialColor>
  );
}

export function Provider(props: ColorModeProviderProps) {
  return <ProviderWithLogger {...props} />;
}
