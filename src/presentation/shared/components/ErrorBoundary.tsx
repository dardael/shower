'use client';

import React from 'react';
import { Box, VStack, Heading, Text, Button } from '@chakra-ui/react';
import { useColorModeValue } from '@/presentation/shared/components/ui/color-mode';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; reset: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props;

      if (Fallback) {
        return <Fallback error={this.state.error} reset={this.reset} />;
      }

      return (
        <DefaultErrorFallback error={this.state.error} reset={this.reset} />
      );
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  error?: Error;
  reset: () => void;
}

function DefaultErrorFallback({ error, reset }: DefaultErrorFallbackProps) {
  const bg = useColorModeValue('bg.subtle', 'bg.subtle');
  const borderColor = useColorModeValue('border', 'border');
  const headingColor = useColorModeValue('fg', 'fg');
  const textColor = useColorModeValue('fg.muted', 'fg.muted');

  return (
    <Box
      bg={bg}
      borderRadius="2xl"
      p={{ base: 6, md: 8 }}
      border="1px solid"
      borderColor={borderColor}
      minH="400px"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <VStack align="center" gap={6} maxW="md" textAlign="center">
        <Heading
          as="h2"
          size={{ base: 'lg', md: 'xl' }}
          color={headingColor}
          fontWeight="semibold"
        >
          Something went wrong
        </Heading>

        <Text color={textColor} fontSize={{ base: 'sm', md: 'md' }}>
          {process.env.NODE_ENV === 'development'
            ? error?.message || 'An unexpected error occurred'
            : 'An unexpected error occurred. Please try again or contact support if the problem persists.'}
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

        <Button onClick={reset} colorPalette="blue" size="md">
          Try Again
        </Button>
      </VStack>
    </Box>
  );
}

export default ErrorBoundary;
