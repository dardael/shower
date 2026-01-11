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
const originalWarn = console.warn;
const suppressedPatterns = [
  'was not wrapped in act',
  'not configured to support act',
  'wrap-tests-with-act',
  'should be wrapped into act',
  'cannot be a child of',
  'hydration error',
  'does not recognize',
  'on a DOM element',
  'appear in DOM as a custom attribute',
  'spell it as lowercase',
  'passed it from a parent component',
  'not valid as a React child',
  'Theme toggle failed:',
  'unique "key" prop',
  'Each child in a list should have a unique',
  'Error creating appointment',
  'Créneau déjà réservé',
];

const suppressedWarningPatterns = [
  'Paramètres email non configurés',
  'email de rappel ignoré',
  "email d'annulation ignoré",
  'notification admin ignorée',
];

beforeAll(() => {
  console.error = (...args: unknown[]) => {
    const message = args.map((arg) => String(arg)).join(' ');
    if (suppressedPatterns.some((pattern) => message.includes(pattern))) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args: unknown[]) => {
    const message = args.map((arg) => String(arg)).join(' ');
    if (
      suppressedWarningPatterns.some((pattern) => message.includes(pattern))
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// Polyfill structuredClone for test environment
if (typeof structuredClone === 'undefined') {
  global.structuredClone = (obj: unknown) => {
    if (obj === undefined || obj === null) {
      return obj;
    }
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch {
      return obj;
    }
  };
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
  'borderEnd',
  'borderEndColor',
  'borderLeft',
  'borderRight',
  'borderTop',
  'borderBottom',
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
  '_active',
  'zIndex',
  'fit',
  'fontSize',
  'fontWeight',
  'variant',
  'size',
  'minW',
  'maxW',
  'minHeight',
  'minH',
  'maxH',
  'textDecoration',
  'transition',
  'ring',
  'ringColor',
  'ringOffset',
  'truncate',
  'justifyItems',
  'flex',
  'w',
  'h',
  'loading',
  'colorPalette',
  'boxSize',

  'asChild',
];

// Filter out only Chakra UI style props to avoid DOM warnings, but keep event handlers
function filterChakraProps(
  props: Record<string, unknown>
): Record<string, unknown> {
  const filtered: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    // Keep event handlers and important DOM attributes, but filter out Chakra props
    if (
      !chakraStyleProps.includes(key) &&
      !key.startsWith('_') &&
      key !== 'toaster'
    ) {
      filtered[key] = value;
    }
  }
  return filtered;
}

// Special filter for Box component to preserve data-testid and role
function filterBoxProps(
  props: Record<string, unknown>
): Record<string, unknown> {
  const filtered: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    // Keep event handlers, important DOM attributes, and test attributes
    if (!chakraStyleProps.includes(key) && !key.startsWith('_')) {
      filtered[key] = value;
    }
  }
  return filtered;
}

// Mock Chakra UI components to avoid rendering issues in tests
jest.mock('@chakra-ui/react', () => {
  const mockModule = {
    defineConfig: jest.fn(() => ({})),
    createSystem: jest.fn(() => ({})),
    ChakraProvider: ({ children }: ComponentProps) => children,
    ClientOnly: ({ children }: ComponentProps) => children,
    Skeleton: ({ ...props }: ComponentProps) =>
      React.createElement('div', {
        'data-testid': 'skeleton',
        ...filterChakraProps(props),
      }),
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
    Flex: ({ children, ...props }: ComponentProps) => {
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
    Popover: {
      Root: ({ children, open }: ComponentProps & { open?: boolean }) =>
        open
          ? React.createElement(
              'div',
              { 'data-testid': 'popover-root' },
              children
            )
          : children,
      Trigger: ({ children }: ComponentProps) => children,
      Positioner: ({ children }: ComponentProps) =>
        React.createElement(
          'div',
          { 'data-testid': 'popover-positioner' },
          children
        ),
      Content: ({ children, ...props }: ComponentProps) =>
        React.createElement(
          'div',
          { 'data-testid': 'popover-content', ...filterChakraProps(props) },
          children
        ),
      Body: ({ children, ...props }: ComponentProps) =>
        React.createElement(
          'div',
          { 'data-testid': 'popover-body', ...filterChakraProps(props) },
          children
        ),
    },
    Box: ({ children, ...props }: ComponentProps) => {
      return React.createElement('div', filterBoxProps(props), children);
    },
    Button: ({ children, ...props }: ComponentProps) => {
      return React.createElement('button', filterChakraProps(props), children);
    },
    Link: ({ children, ...props }: ComponentProps) => {
      return React.createElement('a', filterBoxProps(props), children);
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
    Toaster: ({ children, ...props }: ComponentProps) => {
      const filteredProps = filterChakraProps(props);
      // Remove toaster prop as it's a function and can't be rendered
      const safeProps = Object.fromEntries(
        Object.entries(filteredProps).filter(([key]) => key !== 'toaster')
      );
      return React.createElement(
        'div',
        { 'data-testid': 'toaster', ...safeProps },
        children
      );
    },
    ChakraToaster: ({ children, ...props }: ComponentProps) => {
      const filteredProps = filterChakraProps(props);
      // Remove toaster prop as it's a function and can't be rendered
      const safeProps = Object.fromEntries(
        Object.entries(filteredProps).filter(([key]) => key !== 'toaster')
      );
      return React.createElement(
        'div',
        { 'data-testid': 'chakra-toaster', ...safeProps },
        children
      );
    },
    Portal: ({ children, ...props }: ComponentProps) =>
      React.createElement(
        'div',
        { 'data-testid': 'portal', ...filterChakraProps(props) },
        children
      ),
    Toast: {
      Root: ({ children, ...props }: ComponentProps) =>
        React.createElement(
          'div',
          { 'data-testid': 'toast-root', ...filterChakraProps(props) },
          children
        ),
      Title: ({ children, ...props }: ComponentProps) =>
        React.createElement(
          'div',
          { 'data-testid': 'toast-title', ...filterChakraProps(props) },
          children
        ),
      Description: ({ children, ...props }: ComponentProps) =>
        React.createElement(
          'div',
          { 'data-testid': 'toast-description', ...filterChakraProps(props) },
          children
        ),
      Indicator: ({ ...props }: ComponentProps) =>
        React.createElement('div', {
          'data-testid': 'toast-indicator',
          ...filterChakraProps(props),
        }),
      ActionTrigger: ({ children, ...props }: ComponentProps) =>
        React.createElement(
          'button',
          { 'data-testid': 'toast-action', ...filterChakraProps(props) },
          children
        ),
      CloseTrigger: ({ ...props }: ComponentProps) =>
        React.createElement('button', {
          'data-testid': 'toast-close',
          ...filterChakraProps(props),
        }),
    },
    Tooltip: {
      Root: ({ children }: ComponentProps) =>
        React.createElement('div', { 'data-testid': 'tooltip-root' }, children),
      Trigger: ({ children }: ComponentProps) => children,
      Positioner: ({ children }: ComponentProps) =>
        React.createElement(
          'div',
          { 'data-testid': 'tooltip-positioner' },
          children
        ),
      Content: ({ children, ...props }: ComponentProps) =>
        React.createElement(
          'div',
          { 'data-testid': 'tooltip-content', ...filterChakraProps(props) },
          children
        ),
      Arrow: () =>
        React.createElement('div', { 'data-testid': 'tooltip-arrow' }),
    },
    useBreakpointValue: jest.fn(),
  };

  return mockModule;
});

// Mock provider components
jest.mock('@/presentation/shared/components/ui/provider', () => ({
  Provider: ({ children }: ComponentProps) => children,
}));

jest.mock('@/presentation/shared/DynamicThemeProvider', () => ({
  DynamicThemeProvider: ({ children }: ComponentProps) => children,
  useDynamicTheme: () => ({ themeColor: 'blue' }),
}));

// Track color mode state for the mock - can be modified by tests
let mockColorModeState = 'light';

// Export for tests to modify
export const setMockColorMode = (mode: string) => {
  mockColorModeState = mode;
};

export const resetMockColorMode = () => {
  mockColorModeState = 'light';
};

// Mock color-mode hook with reactive state
jest.mock('@/presentation/shared/components/ui/color-mode', () => ({
  useColorMode: () => ({
    colorMode: mockColorModeState,
    setColorMode: (mode: string) => {
      mockColorModeState = mode;
    },
    toggleColorMode: () => {
      mockColorModeState = mockColorModeState === 'dark' ? 'light' : 'dark';
    },
  }),
  ColorModeButton: () => null,
  ColorModeProvider: ({ children }: ComponentProps) => children,
}));

// Mock react-icons to return simple icons
jest.mock('react-icons/tb', () => ({
  TbFont: () => React.createElement('svg', { 'data-icon': 'TbFont' }),
}));

jest.mock('react-icons/md', () => ({
  MdTextFields: () =>
    React.createElement('svg', { 'data-icon': 'MdTextFields' }),
  MdFormatColorText: () =>
    React.createElement('svg', { 'data-icon': 'MdFormatColorText' }),
  MdFormatColorReset: () =>
    React.createElement('svg', { 'data-icon': 'MdFormatColorReset' }),
}));

// Mock next/navigation

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/admin',
}));

// Mock problematic ES modules that cause Jest issues
jest.mock(
  '@noble/ciphers/chacha',
  () => ({
    createCipher: jest.fn(),
    createPRG: jest.fn(),
    rotl: jest.fn(),
  }),
  { virtual: true }
);

// Mock better-auth to prevent ES module issues
jest.mock(
  'better-auth',
  () => ({
    betterAuth: jest.fn(() => ({
      handler: jest.fn(),
      $Infer: {},
    })),
  }),
  { virtual: true }
);

jest.mock(
  'better-auth/react',
  () => ({
    createAuthClient: jest.fn(() => ({
      signIn: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn(),
      useSession: jest.fn(() => ({ data: null, isPending: false })),
    })),
  }),
  { virtual: true }
);

jest.mock(
  'nanostores',
  () => ({
    atom: jest.fn(() => ({
      get: jest.fn(),
      set: jest.fn(),
      subscribe: jest.fn(),
    })),
  }),
  { virtual: true }
);

// Mock BetterAuthInstance to prevent module-level execution
jest.mock('@/infrastructure/auth/BetterAuthInstance', () => ({
  auth: {
    handler: jest.fn(),
    $Infer: {},
  },
}));

// Mock AuthServiceLocator
jest.mock('@/infrastructure/container', () => {
  const actualModule = jest.requireActual('@/infrastructure/container');
  return {
    ...actualModule,
    AuthServiceLocator: {
      getAuthorizeAdminAccess: jest.fn(() => ({
        execute: jest.fn(() => true),
      })),
    },
  };
});

jest.mock(
  'better-auth/adapters/mongodb',
  () => ({
    mongodbAdapter: jest.fn(() => ({})),
  }),
  { virtual: true }
);

// Mock WebsiteSettingsModel to avoid mongoose Schema.Types.Mixed issues
jest.mock('@/infrastructure/settings/models/WebsiteSettingsModel', () => ({
  WebsiteSettingsModel: {
    findOne: jest.fn(),
    create: jest.fn(),
    updateOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    deleteOne: jest.fn(),
    find: jest.fn(),
  },
}));

// Mock mongoose and related database modules
jest.mock('mongoose', () => ({
  default: {
    connect: jest.fn(() => Promise.resolve()),
    connection: {
      readyState: 1,
    },
    disconnect: jest.fn(() => Promise.resolve()),
    models: {},
  },
  Schema: Object.assign(
    jest.fn(() => ({
      pre: jest.fn(),
      post: jest.fn(),
      index: jest.fn(),
    })),
    {
      Types: {
        ObjectId: 'ObjectId',
        Mixed: 'Mixed',
      },
    }
  ),
  model: jest.fn(),
  models: {},
}));

jest.mock('mongodb', () => ({
  MongoClient: jest.fn(),
  ObjectId: jest.fn(() => ({ toString: () => '507f1f77bcf86cd799439011' })),
}));

jest.mock('bson', () => ({
  ObjectId: jest.fn(() => ({ toString: () => '507f1f77bcf86cd799439011' })),
  BSON: {},
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
    useFactory: () => new Logger(),
  });
});

// Clean up container after tests
afterAll(() => {
  container.clearInstances();
});

// Shared test utilities
import { render } from '@testing-library/react';

/**
 * Renders a React element wrapped in ChakraProvider for testing.
 * Use this utility for testing components that depend on Chakra UI.
 */
export const renderWithChakra = (ui: React.ReactElement) => {
  // ChakraProvider is mocked in this file, so we just render the element
  // The mock automatically wraps children properly
  return render(ui);
};
