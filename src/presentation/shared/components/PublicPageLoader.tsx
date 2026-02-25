'use client';

import React, { useState } from 'react';
import { Flex, Spinner, Text, Button, VStack } from '@chakra-ui/react';
import Image from 'next/image';
import type { PageLoadError } from '@/types/page-load-state';

export interface CustomLoaderData {
  type: 'gif' | 'video';
  url: string;
}

export interface PublicPageLoaderProps {
  isLoading: boolean;
  error: PageLoadError | null;
  onRetry?: () => void;
  customLoader?: CustomLoaderData | null;
  backgroundColor?: string | null;
  loaderChecked?: boolean;
}

/**
 * PublicPageLoader component
 * Displays loading spinner, error messages, and retry functionality
 * Supports custom GIF or video loaders with fallback on load error
 * Theme-aware with proper contrast for light/dark modes
 * Includes ARIA labels for accessibility
 */
export function PublicPageLoader({
  isLoading,
  error,
  onRetry,
  customLoader,
  backgroundColor,
  loaderChecked = true,
}: PublicPageLoaderProps): React.ReactElement {
  // Track if custom loader failed to load - fallback to default spinner
  const [loaderError, setLoaderError] = useState(false);

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
    // Wait until we know whether a custom loader exists before rendering anything.
    // This prevents the generic spinner from flashing before the custom loader appears.
    if (!loaderChecked) {
      return <></>;
    }

    const showCustomLoader = customLoader && !loaderError;

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
        background={backgroundColor ?? undefined}
      >
        {showCustomLoader ? (
          customLoader.type === 'gif' ? (
            <Image
              src={customLoader.url}
              alt="Loading"
              data-testid="custom-loader-gif"
              width={300}
              height={300}
              style={{
                maxHeight: '300px',
                maxWidth: '300px',
                objectFit: 'contain',
              }}
              unoptimized
              loader={({ src }) => src}
              onError={() => setLoaderError(true)}
            />
          ) : (
            <video
              src={customLoader.url}
              autoPlay
              loop
              muted
              playsInline
              data-testid="custom-loader-video"
              style={{ maxHeight: '300px', maxWidth: '300px' }}
              onError={() => setLoaderError(true)}
            />
          )
        ) : (
          <Spinner
            size="xl"
            color="fg.emphasized"
            data-testid="chakra-spinner"
          />
        )}
      </Flex>
    );
  }

  // Should not reach here in normal use
  return <></>;
}
