import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, beforeEach, afterEach } from '@jest/globals';
import DarkModeToggle from '@/presentation/shared/components/DarkModeToggle';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock document.documentElement.classList
const classListMock = {
  toggle: jest.fn(),
  add: jest.fn(),
  remove: jest.fn(),
  contains: jest.fn(),
};
Object.defineProperty(document.documentElement, 'classList', {
  value: classListMock,
});

describe('DarkModeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders a toggle button', () => {
    render(<DarkModeToggle />);

    const button = screen.getByRole('button', { name: /toggle color mode/i });
    expect(button).toBeInTheDocument();
  });

  it('shows moon icon in light mode', () => {
    localStorageMock.getItem.mockReturnValue('light');

    render(<DarkModeToggle />);

    const button = screen.getByRole('button', { name: /toggle color mode/i });
    expect(button).toHaveTextContent('🌙');
  });

  it('shows sun icon in dark mode', () => {
    localStorageMock.getItem.mockReturnValue('dark');

    render(<DarkModeToggle />);

    const button = screen.getByRole('button', { name: /toggle color mode/i });
    expect(button).toHaveTextContent('☀️');
  });

  it('toggles from light to dark mode when clicked', () => {
    localStorageMock.getItem.mockReturnValue('light');

    render(<DarkModeToggle />);

    const button = screen.getByRole('button', { name: /toggle color mode/i });
    fireEvent.click(button);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'chakra-ui-color-mode',
      'dark'
    );
    expect(classListMock.toggle).toHaveBeenCalledWith('dark', true);
  });

  it('toggles from dark to light mode when clicked', () => {
    localStorageMock.getItem.mockReturnValue('dark');

    render(<DarkModeToggle />);

    const button = screen.getByRole('button', { name: /toggle color mode/i });
    fireEvent.click(button);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'chakra-ui-color-mode',
      'light'
    );
    expect(classListMock.toggle).toHaveBeenCalledWith('dark', false);
  });

  it('uses system preference when no saved preference', () => {
    localStorageMock.getItem.mockReturnValue(null);

    render(<DarkModeToggle />);

    expect(window.matchMedia).toHaveBeenCalledWith(
      '(prefers-color-scheme: dark)'
    );
  });
});
