'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { ColorModeProvider, type ColorModeProviderProps } from './color-mode';
import { Toaster } from './toaster';
import { system } from '@/presentation/shared/theme';
import { DynamicThemeProvider } from '@/presentation/shared/DynamicThemeProvider';

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <DynamicThemeProvider initialThemeColor="blue">
        <ColorModeProvider {...props} />
        <Toaster />
      </DynamicThemeProvider>
    </ChakraProvider>
  );
}
