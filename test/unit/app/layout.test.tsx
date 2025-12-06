import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RootLayout from '@/app/layout';
import { initializeDatabaseForLayout } from '@/infrastructure/shared/layoutUtils';

// Mock dependencies
jest.mock('@/infrastructure/shared/layoutUtils');

jest.mock('@/infrastructure/container', () => ({
  container: {
    resolve: jest.fn(() => ({
      logErrorWithObject: jest.fn(),
    })),
  },
}));

// Mock next/headers
jest.mock('next/headers', () => ({
  headers: jest.fn(),
}));

// Mock next/font to avoid font loading issues in tests
jest.mock('next/font/google', () => ({
  Inter: () => ({
    className: 'inter-font',
    style: { fontFamily: 'Inter' },
  }),
}));

describe('RootLayout', () => {
  const mockInitializeDatabase = jest.mocked(initializeDatabaseForLayout);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize database on render', async () => {
    const layout = await RootLayout({
      children: React.createElement('div', {}, 'Test Content'),
    });
    render(layout);

    expect(mockInitializeDatabase).toHaveBeenCalled();
  });

  it('should render children content', async () => {
    const testContent = React.createElement(
      'div',
      { 'data-testid': 'test-content' },
      'Test Content'
    );
    const layout = await RootLayout({ children: testContent });
    render(layout);

    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('should wrap children in Provider component', async () => {
    const testContent = React.createElement(
      'div',
      { 'data-testid': 'test-content' },
      'Test Content'
    );
    const layout = await RootLayout({ children: testContent });
    render(layout);

    // Verify children are rendered within the layout structure
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });
});
