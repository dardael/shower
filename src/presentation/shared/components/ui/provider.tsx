'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { ColorModeProvider, type ColorModeProviderProps } from './color-mode';
import { Toaster } from './toaster';
import { createDynamicSystem } from '@/presentation/shared/theme';
import {
  DynamicThemeProvider,
  useDynamicTheme,
} from '@/presentation/shared/DynamicThemeProvider';

function DynamicChakraProvider({ children }: { children: React.ReactNode }) {
  const { themeColor } = useDynamicTheme();
  const dynamicSystem = createDynamicSystem(themeColor);

  return <ChakraProvider value={dynamicSystem}>{children}</ChakraProvider>;
}

export function Provider(props: ColorModeProviderProps) {
  return (
    <DynamicThemeProvider initialThemeColor="blue">
      <DynamicChakraProvider>
        <ColorModeProvider {...props} />
        <Toaster />
      </DynamicChakraProvider>
    </DynamicThemeProvider>
  );
}
