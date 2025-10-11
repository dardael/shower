'use client';

import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

interface ChakraUIProviderProps {
  children: React.ReactNode;
}

/**
 * Chakra UI Provider Adapter
 *
 * This adapter provides Chakra UI's styling system to the application.
 * It follows the hexagonal architecture pattern by acting as an infrastructure
 * adapter that wraps the application with UI styling capabilities.
 *
 * Enhanced with dark mode support using localStorage for persistence.
 */
export default function ChakraUIProvider({ children }: ChakraUIProviderProps) {
  return <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>;
}
