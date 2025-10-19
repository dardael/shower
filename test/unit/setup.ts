import '@testing-library/jest-dom';
import React from 'react';

// Polyfill structuredClone for test environment
if (typeof structuredClone === 'undefined') {
  global.structuredClone = (obj: unknown) =>
    JSON.parse(JSON.stringify(obj as string));
}

// Define proper types for component props
interface ComponentProps {
  children?: React.ReactNode;
  [key: string]: unknown;
}

interface InputProps {
  [key: string]: unknown;
}

// Mock Chakra UI components to avoid rendering issues in tests
jest.mock('@chakra-ui/react', () => {
  const mockModule = {
    IconButton: ({ children, ...props }: ComponentProps) => {
      return React.createElement('button', props, children);
    },
    Container: ({ children, ...props }: ComponentProps) =>
      React.createElement('div', props, children),
    Heading: ({ children, ...props }: ComponentProps) =>
      React.createElement('h1', props, children),
    Text: ({ children, ...props }: ComponentProps) => {
      return React.createElement('span', props, children);
    },
    Stack: ({ children, ...props }: ComponentProps) => {
      return React.createElement('div', props, children);
    },
    HStack: ({ children, ...props }: ComponentProps) => {
      return React.createElement('div', props, children);
    },
    VStack: ({ children, ...props }: ComponentProps) => {
      return React.createElement('div', props, children);
    },
    Box: ({ children, ...props }: ComponentProps) => {
      return React.createElement('div', props, children);
    },
    Button: ({ children, ...props }: ComponentProps) => {
      return React.createElement('button', props, children);
    },
    Input: ({ ...props }: InputProps) => React.createElement('input', props),
    Field: {
      Root: ({ children, ...props }: ComponentProps) =>
        React.createElement('div', props, children),
      Label: ({ children, ...props }: ComponentProps) =>
        React.createElement('label', props, children),
      HelperText: ({ children, ...props }: ComponentProps) =>
        React.createElement('span', props, children),
    },
    AbsoluteCenter: ({ children, ...props }: ComponentProps) =>
      React.createElement('div', props, children),
    Image: ({ src, alt, onError, ...props }: ComponentProps) => {
      return React.createElement('img', { src, alt, onError, ...props });
    },
    Spinner: ({ ...props }: ComponentProps) =>
      React.createElement(
        'div',
        { 'data-testid': 'spinner', ...props },
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
