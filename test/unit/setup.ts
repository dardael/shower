import 'reflect-metadata';
import '@testing-library/jest-dom';
import React from 'react';
import { container } from 'tsyringe';
import { Logger } from '@/application/shared/Logger';
import type { ILogger } from '@/application/shared/ILogger';

// Increase EventEmitter max listeners to prevent memory leak warnings
process.setMaxListeners(50);

// Suppress React act() warnings for renderHook async operations
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    // Convert all args to string for checking
    const fullMessage = args.map((arg) => String(arg)).join(' ');

    // Suppress act() warnings that are known false positives in renderHook tests
    if (
      fullMessage.includes(
        'An update to TestComponent inside a test was not wrapped in act'
      ) ||
      fullMessage.includes(
        'The current testing environment is not configured to support act'
      ) ||
      fullMessage.includes('wrap-tests-with-act') ||
      fullMessage.includes(
        'When testing, code that causes React state updates should be wrapped into act'
      )
    ) {
      return;
    }

    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Polyfill structuredClone for test environment
if (typeof structuredClone === 'undefined') {
  global.structuredClone = (obj: unknown) => JSON.parse(JSON.stringify(obj));
}

// Define proper types for component props
interface ComponentProps {
  children?: React.ReactNode;
  [key: string]: unknown;
}

interface InputProps {
  [key: string]: unknown;
}

// Chakra UI specific props that should be filtered out in tests
const chakraStyleProps = [
  'borderColor',
  'borderRadius',
  'borderWidth',
  'borderStyle',
  'borderTopWidth',
  'textAlign',
  'alignItems',
  'justifyContent',
  'display',
  'bg',
  'color',
  'p',
  'm',
  'py',
  'px',
  'gap',
  'width',
  'height',
  'position',
  'inset',
  'overflow',
  'cursor',
  '_hover',
  '_focusVisible',
  'zIndex',
  'fit',
  'fontSize',
  'fontWeight',
  'variant',
  'size',
  'minW',
  'maxW',
  'textDecoration',
  'transition',
  'ring',
  'ringColor',
  'ringOffset',
  'truncate',
  'justifyItems',
];

// Filter out only Chakra UI style props to avoid DOM warnings, but keep event handlers
function filterChakraProps(
  props: Record<string, unknown>
): Record<string, unknown> {
  const filtered: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    // Keep event handlers and important DOM attributes
    if (!chakraStyleProps.includes(key) && !key.startsWith('_')) {
      filtered[key] = value;
    }
  }
  return filtered;
}

// Mock Chakra UI components to avoid rendering issues in tests
jest.mock('@chakra-ui/react', () => {
  const mockModule = {
    IconButton: ({ children, ...props }: ComponentProps) => {
      return React.createElement('button', filterChakraProps(props), children);
    },
    Container: ({ children, ...props }: ComponentProps) =>
      React.createElement('div', filterChakraProps(props), children),
    Heading: ({ children, ...props }: ComponentProps) =>
      React.createElement('h1', filterChakraProps(props), children),
    Text: ({ children, ...props }: ComponentProps) => {
      return React.createElement('span', filterChakraProps(props), children);
    },
    Stack: ({ children, ...props }: ComponentProps) => {
      return React.createElement('div', filterChakraProps(props), children);
    },
    HStack: ({ children, ...props }: ComponentProps) => {
      return React.createElement('div', filterChakraProps(props), children);
    },
    VStack: ({ children, ...props }: ComponentProps) => {
      return React.createElement('div', filterChakraProps(props), children);
    },
    SimpleGrid: ({ children, ...props }: ComponentProps) => {
      return React.createElement('div', filterChakraProps(props), children);
    },
    Box: ({ children, ...props }: ComponentProps) => {
      return React.createElement('div', filterChakraProps(props), children);
    },
    Button: ({ children, ...props }: ComponentProps) => {
      return React.createElement('button', filterChakraProps(props), children);
    },
    Link: ({ children, ...props }: ComponentProps) => {
      return React.createElement('a', filterChakraProps(props), children);
    },
    Input: ({ ...props }: InputProps) =>
      React.createElement('input', filterChakraProps(props)),
    Field: {
      Root: ({ children, ...props }: ComponentProps) =>
        React.createElement('div', filterChakraProps(props), children),
      Label: ({ children, ...props }: ComponentProps) =>
        React.createElement('label', filterChakraProps(props), children),
      HelperText: ({ children, ...props }: ComponentProps) =>
        React.createElement('span', filterChakraProps(props), children),
    },
    AbsoluteCenter: ({ children, ...props }: ComponentProps) =>
      React.createElement('div', filterChakraProps(props), children),
    Image: ({ src, alt, onError, ...props }: ComponentProps) => {
      return React.createElement('img', {
        src,
        alt,
        onError,
        ...filterChakraProps(props),
      });
    },
    Spinner: ({ ...props }: ComponentProps) =>
      React.createElement(
        'div',
        {
          'data-testid': 'spinner',
          role: 'status',
          'aria-label': 'Loading...',
          ...filterChakraProps(props),
        },
        'Loading...'
      ),
    createToaster: jest.fn(() => ({
      create: jest.fn(),
    })),
  };

  return mockModule;
});

// Mock next/navigation

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

// Register Logger for tests
beforeAll(() => {
  // Mock ILogger for tests
  const mockILogger: ILogger = {
    logDebug: jest.fn(),
    logInfo: jest.fn(),
    logWarning: jest.fn(),
    logError: jest.fn(),
  };

  // Register mock ILogger
  container.register<ILogger>('ILogger', {
    useValue: mockILogger,
  });

  // Register Logger using the mock
  container.register<Logger>('Logger', {
    useFactory: () => new Logger(mockILogger),
  });
});

// Clean up container after tests
afterAll(() => {
  container.clearInstances();
});
