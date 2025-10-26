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
import { container } from '@/infrastructure/container';

function DynamicChakraProvider({ children }: { children: React.ReactNode }) {
  const { themeColor } = useDynamicTheme();
  const dynamicSystem = createDynamicSystem(themeColor);

  return <ChakraProvider value={dynamicSystem}>{children}</ChakraProvider>;
}

async function getInitialThemeColor(): Promise<ThemeColorToken> {
  const logger = container.resolve<Logger>('Logger');

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
}: {
  children: React.ReactNode;
}) {
  const [initialThemeColor, setInitialThemeColor] =
    useState<ThemeColorToken>('blue');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    getInitialThemeColor()
      .then((color) => {
        setInitialThemeColor(color);
        setHasError(false);
      })
      .catch((error) => {
        // Error already logged in getInitialThemeColor, but ensure fallback
        setInitialThemeColor('blue');
        setHasError(true);
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

export function Provider(props: ColorModeProviderProps) {
  return (
    <ThemeProviderWithInitialColor>
      <ColorModeProvider {...props} />
      <Toaster />
    </ThemeProviderWithInitialColor>
  );
}
