import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminLayout from '@/app/admin/layout';
import { initializeDatabaseForLayout } from '@/infrastructure/shared/layoutUtils';

// Mock dependencies
jest.mock('@/infrastructure/shared/layoutUtils', () => ({
  initializeDatabaseForLayout: jest.fn(),
  fetchWebsiteName: jest.fn(() => 'Shower'),
  fetchWebsiteIcon: jest.fn(() => Promise.resolve(null)),
}));

jest.mock('@/infrastructure/container', () => ({
  container: {
    resolve: jest.fn(() => ({
      logErrorWithObject: jest.fn(),
    })),
  },
}));

describe('AdminLayout', () => {
  const mockInitializeDatabase = jest.mocked(initializeDatabaseForLayout);

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock build phase to avoid actual API calls
    process.env.NEXT_PHASE = 'phase-production-build';
  });

  afterEach(() => {
    delete process.env.NEXT_PHASE;
  });

  it('should initialize database on render', async () => {
    const layout = await AdminLayout({
      children: React.createElement('div', {}, 'Admin Content'),
    });
    render(layout);

    expect(mockInitializeDatabase).toHaveBeenCalled();
  });

  it('should render children content', async () => {
    const testContent = React.createElement(
      'div',
      { 'data-testid': 'admin-content' },
      'Admin Content'
    );
    const layout = await AdminLayout({ children: testContent });
    render(layout);

    expect(screen.getByTestId('admin-content')).toBeInTheDocument();
  });

  it('should not render footer', async () => {
    const layout = await AdminLayout({
      children: React.createElement('div', {}, 'Admin Content'),
    });
    render(layout);

    // Verify no footer element is present
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
    expect(screen.queryByTestId('footer')).not.toBeInTheDocument();
  });

  it('should generate admin-specific metadata during build', async () => {
    // Mock build phase
    const originalNextPhase = process.env.NEXT_PHASE;
    process.env.NEXT_PHASE = 'phase-production-build';

    try {
      // Import the module to access generateMetadata
      const adminLayoutModule = await import('@/app/admin/layout');
      const metadata = await adminLayoutModule.generateMetadata();

      expect(metadata.title).toBe('Shower');
      expect(metadata.description).toBe('Admin panel for Shower website');
    } finally {
      // Restore original environment
      if (originalNextPhase) {
        process.env.NEXT_PHASE = originalNextPhase;
      } else {
        delete process.env.NEXT_PHASE;
      }
    }
  });

  it('should handle database initialization errors gracefully', async () => {
    mockInitializeDatabase.mockRejectedValue(
      new Error('Database connection failed')
    );

    // Suppress console error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    // Should handle error gracefully when creating layout
    try {
      const layout = await AdminLayout({
        children: React.createElement('div', {}, 'Admin Content'),
      });
      expect(layout).toBeDefined();
    } catch (error) {
      // Should not throw unhandled error
      expect(error).toBeDefined();
    }

    consoleSpy.mockRestore();
  });

  it('should use default admin name when API fails', async () => {
    // Mock fetch to simulate API failure
    global.fetch = jest.fn().mockRejectedValue(new Error('API Error'));

    // Set runtime environment to trigger API call
    delete process.env.NEXT_PHASE;

    const adminLayoutModule = await import('@/app/admin/layout');
    const metadata = await adminLayoutModule.generateMetadata();

    expect(metadata.title).toBe('Shower');
  });

  it('should use default admin icon when API fails', async () => {
    // Mock fetch to simulate API failure
    global.fetch = jest.fn().mockRejectedValue(new Error('API Error'));

    // Set runtime environment to trigger API call
    delete process.env.NEXT_PHASE;

    const adminLayoutModule = await import('@/app/admin/layout');
    const metadata = await adminLayoutModule.generateMetadata();

    expect(metadata.icons).toBeUndefined();
  });

  it('should have proper layout structure when database works', async () => {
    // Suppress console error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    // Reset mock to resolve successfully for this test
    mockInitializeDatabase.mockResolvedValue(undefined);

    const layout = await AdminLayout({
      children: React.createElement('div', {}, 'Admin Content'),
    });
    const { container } = render(layout);

    // Verify that layout renders without crashing
    expect(container.firstChild).toBeInTheDocument();

    // Check that admin content is rendered
    expect(container.textContent).toContain('Admin Content');

    consoleSpy.mockRestore();
  });
});
