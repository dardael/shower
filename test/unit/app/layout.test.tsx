import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RootLayout from '@/app/layout';
import { initializeDatabaseForLayout } from '@/infrastructure/shared/layoutUtils';

// Mock dependencies
jest.mock('@/infrastructure/shared/layoutUtils');
jest.mock('@/presentation/shared/components/SocialNetworksFooter', () => ({
  SocialNetworksFooterContainer: jest.fn(() =>
    React.createElement('div', { 'data-testid': 'footer' }, 'Footer')
  ),
}));

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
  const { headers: mockHeaders } = jest.requireMock('next/headers');
  const mockInitializeDatabase = jest.mocked(initializeDatabaseForLayout);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize database on render', async () => {
    const headers = new Headers();
    headers.set('x-pathname', '/');
    mockHeaders.mockResolvedValue(headers);

    const layout = await RootLayout({
      children: React.createElement('div', {}, 'Test Content'),
    });
    render(layout);

    expect(mockInitializeDatabase).toHaveBeenCalled();
  });

  it('should render footer on public routes', async () => {
    const headers = new Headers();
    headers.set('x-pathname', '/');
    mockHeaders.mockResolvedValue(headers);

    const layout = await RootLayout({
      children: React.createElement('div', {}, 'Test Content'),
    });
    render(layout);

    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should render footer on admin routes (container handles conditional rendering)', async () => {
    const headers = new Headers();
    headers.set('x-pathname', '/admin');
    mockHeaders.mockResolvedValue(headers);

    const layout = await RootLayout({
      children: React.createElement('div', {}, 'Test Content'),
    });
    render(layout);

    // Footer should always be rendered now, container handles conditional logic
    expect(screen.queryByTestId('footer')).toBeInTheDocument();
  });

  it('should render children content', async () => {
    const headers = new Headers();
    headers.set('x-pathname', '/');
    mockHeaders.mockResolvedValue(headers);

    const testContent = React.createElement(
      'div',
      { 'data-testid': 'test-content' },
      'Test Content'
    );
    const layout = await RootLayout({ children: testContent });
    render(layout);

    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('should handle missing pathname header gracefully', async () => {
    const headers = new Headers();
    mockHeaders.mockResolvedValue(headers);

    const layout = await RootLayout({
      children: React.createElement('div', {}, 'Test Content'),
    });
    render(layout);

    // Should render footer when pathname is missing (defaults to public)
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should render footer on complex public routes', async () => {
    const headers = new Headers();
    headers.set('x-pathname', '/about/team');
    mockHeaders.mockResolvedValue(headers);

    const layout = await RootLayout({
      children: React.createElement('div', {}, 'Test Content'),
    });
    render(layout);

    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
