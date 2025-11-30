'use client';

import React from 'react';
import ErrorBoundary from '@/presentation/shared/components/ErrorBoundary';
import { Box, VStack, Heading, Text, Button } from '@chakra-ui/react';

interface AdminErrorFallbackProps {
  error?: Error;
  reset: () => void;
}

function AdminErrorFallback({ error, reset }: AdminErrorFallbackProps) {
  return (
    <Box
      bg="bg.subtle"
      borderRadius="2xl"
      p={{ base: 6, md: 8 }}
      border="1px solid"
      borderColor="border"
      minHeight="400px"
    >
      <VStack align="center" gap={6} maxW="md" textAlign="center" mx="auto">
        <Heading
          as="h2"
          size={{ base: 'lg', md: 'xl' }}
          color="fg"
          fontWeight="semibold"
        >
          Admin Panel Error
        </Heading>

        <Text color="fg.muted" fontSize={{ base: 'sm', md: 'md' }}>
          {process.env.NODE_ENV === 'development'
            ? `Admin error: ${error?.message || 'An unexpected error occurred in the admin panel'}`
            : 'An error occurred in the admin panel. Please try again or contact support.'}
        </Text>

        {process.env.NODE_ENV === 'development' && error?.stack && (
          <Box
            bg="bg.muted"
            borderRadius="md"
            p={4}
            w="full"
            maxH="200px"
            overflow="auto"
          >
            <Text
              as="pre"
              fontSize="xs"
              color="fg.muted"
              fontFamily="mono"
              whiteSpace="pre-wrap"
              wordBreak="break-word"
            >
              {error.stack}
            </Text>
          </Box>
        )}

        <VStack gap={3} w="full" maxW="sm">
          <Button onClick={reset} size="md" w="full">
            Try Again
          </Button>
          <Button
            onClick={() => (window.location.href = '/')}
            variant="outline"
            size="md"
            w="full"
          >
            Go to Homepage
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
}

interface AdminErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export default function AdminErrorBoundary({
  children,
  onError,
}: AdminErrorBoundaryProps) {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }
  };

  return (
    <ErrorBoundary fallback={AdminErrorFallback} onError={handleError}>
      {children}
    </ErrorBoundary>
  );
}
