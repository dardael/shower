'use client';

import React from 'react';
import { Flex, Spinner, Text, Button, VStack } from '@chakra-ui/react';
import type { PageLoadError } from '@/types/page-load-state';

export interface PublicPageLoaderProps {
  isLoading: boolean;
  error: PageLoadError | null;
  onRetry?: () => void;
}

/**
 * PublicPageLoader component
 * Displays loading spinner, error messages, and retry functionality
 * Theme-aware with proper contrast for light/dark modes
 * Includes ARIA labels for accessibility
 */
export function PublicPageLoader({
  isLoading,
  error,
  onRetry,
}: PublicPageLoaderProps): React.ReactElement {
  // Show error state
  if (error) {
    return (
      <Flex
        minH="60vh"
        align="center"
        justify="center"
        role="alert"
        aria-live="polite"
        data-testid="page-load-error"
      >
        <VStack gap={4} maxW="md" px={4}>
          <Text
            fontSize="lg"
            color="fg.emphasized"
            textAlign="center"
            fontWeight="medium"
          >
            {error.message}
          </Text>
          {onRetry && (
            <Button
              onClick={onRetry}
              colorPalette="blue"
              size="md"
              aria-label="Retry loading page"
              data-testid="retry-button"
            >
              Retry
            </Button>
          )}
        </VStack>
      </Flex>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <Flex
        minH="100vh"
        width="100vw"
        align="center"
        justify="center"
        role="status"
        aria-live="polite"
        aria-label="Loading page content"
        data-testid="page-loading-spinner"
      >
        <Spinner size="xl" color="fg.emphasized" />
      </Flex>
    );
  }

  // Should not reach here in normal use
  return <></>;
}
