import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '@/app/page';
import { MenuItem } from '@/domain/menu/entities/MenuItem';
import { MenuItemText } from '@/domain/menu/value-objects/MenuItemText';
import { MenuItemUrl } from '@/domain/menu/value-objects/MenuItemUrl';
import { PageContent } from '@/domain/pages/entities/PageContent';
import { PageContentBody } from '@/domain/pages/value-objects/PageContentBody';

// Mock database connection
jest.mock('@/infrastructure/shared/databaseConnection', () => ({
  DatabaseConnection: {
    getInstance: jest.fn(() => ({
      connect: jest.fn().mockResolvedValue(undefined),
    })),
  },
}));

// Mock PublicPageContent component
jest.mock(
  '@/presentation/shared/components/PublicPageContent/PublicPageContent',
  () => ({
    __esModule: true,
    default: jest.fn(({ content }: { content: string }) =>
      React.createElement('div', { 'data-testid': 'page-content' }, content)
    ),
  })
);

// Create mock use cases
const mockGetMenuItems = {
  execute: jest.fn(),
};

const mockGetPageContent = {
  execute: jest.fn(),
};

// Mock DI container
jest.mock('@/infrastructure/container', () => ({
  container: {
    resolve: jest.fn((key: string) => {
      if (key === 'IGetMenuItems') return mockGetMenuItems;
      if (key === 'IGetPageContent') return mockGetPageContent;
      return null;
    }),
  },
}));

describe('Home Page (Root URL)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('T007: Display first menu item content when menu items exist', () => {
    it('should display first menu item content when menu items exist', async () => {
      const menuItem = MenuItem.reconstitute(
        'menu-item-1',
        MenuItemText.create('Home'),
        MenuItemUrl.create('/home'),
        0,
        new Date(),
        new Date()
      );

      const pageContent = PageContent.reconstitute(
        'page-content-1',
        'menu-item-1',
        PageContentBody.create('<h1>Welcome to Our Site</h1>'),
        new Date(),
        new Date()
      );

      mockGetMenuItems.execute.mockResolvedValue([menuItem]);
      mockGetPageContent.execute.mockResolvedValue(pageContent);

      const page = await Home();
      render(page);

      expect(screen.getByTestId('page-content')).toHaveTextContent(
        'Welcome to Our Site'
      );
      expect(mockGetPageContent.execute).toHaveBeenCalledWith('menu-item-1');
    });
  });

  describe('T008: Display empty state when no menu items exist', () => {
    it('should display empty state when no menu items exist', async () => {
      mockGetMenuItems.execute.mockResolvedValue([]);

      const page = await Home();
      render(page);

      expect(screen.getByRole('heading')).toHaveTextContent(
        'No Content Available'
      );
      expect(screen.getByText(/add your first menu item/i)).toBeInTheDocument();
    });
  });

  describe('T009: Handle missing page content gracefully', () => {
    it('should handle missing page content gracefully (null case)', async () => {
      const menuItem = MenuItem.reconstitute(
        'menu-item-1',
        MenuItemText.create('Home'),
        MenuItemUrl.create('/home'),
        0,
        new Date(),
        new Date()
      );

      mockGetMenuItems.execute.mockResolvedValue([menuItem]);
      mockGetPageContent.execute.mockResolvedValue(null);

      const page = await Home();
      render(page);

      // PublicPageContent component receives empty string when pageContent is null
      expect(screen.getByTestId('page-content')).toHaveTextContent('');
    });
  });

  describe('T010: Select first menu item by position', () => {
    it('should select first menu item by position (lowest position number)', async () => {
      // Create menu items in order (repository returns sorted by position)
      const menuItem1 = MenuItem.reconstitute(
        'menu-item-1',
        MenuItemText.create('Home'),
        MenuItemUrl.create('/home'),
        0,
        new Date(),
        new Date()
      );

      const menuItem2 = MenuItem.reconstitute(
        'menu-item-2',
        MenuItemText.create('About'),
        MenuItemUrl.create('/about'),
        1,
        new Date(),
        new Date()
      );

      const menuItem3 = MenuItem.reconstitute(
        'menu-item-3',
        MenuItemText.create('Contact'),
        MenuItemUrl.create('/contact'),
        2,
        new Date(),
        new Date()
      );

      const pageContent = PageContent.reconstitute(
        'page-content-1',
        'menu-item-1',
        PageContentBody.create('<h1>Home Page Content</h1>'),
        new Date(),
        new Date()
      );

      // Repository returns items sorted by position ascending
      mockGetMenuItems.execute.mockResolvedValue([
        menuItem1,
        menuItem2,
        menuItem3,
      ]);
      mockGetPageContent.execute.mockResolvedValue(pageContent);

      const page = await Home();
      render(page);

      // Verify first menu item's content is used (ID 'menu-item-1')
      expect(mockGetPageContent.execute).toHaveBeenCalledWith('menu-item-1');
      expect(screen.getByTestId('page-content')).toHaveTextContent(
        'Home Page Content'
      );
    });

    it('should use first item even when positions are non-sequential', async () => {
      // Menu items with non-sequential positions (e.g., after deletions)
      const menuItem1 = MenuItem.reconstitute(
        'menu-item-5',
        MenuItemText.create('Services'),
        MenuItemUrl.create('/services'),
        2,
        new Date(),
        new Date()
      );

      const menuItem2 = MenuItem.reconstitute(
        'menu-item-8',
        MenuItemText.create('Portfolio'),
        MenuItemUrl.create('/portfolio'),
        5,
        new Date(),
        new Date()
      );

      const pageContent = PageContent.reconstitute(
        'page-content-5',
        'menu-item-5',
        PageContentBody.create('<h1>Services Page</h1>'),
        new Date(),
        new Date()
      );

      // Repository returns items sorted by position ascending
      mockGetMenuItems.execute.mockResolvedValue([menuItem1, menuItem2]);
      mockGetPageContent.execute.mockResolvedValue(pageContent);

      const page = await Home();
      render(page);

      // Should use menu-item-5 (position 2 is lowest)
      expect(mockGetPageContent.execute).toHaveBeenCalledWith('menu-item-5');
      expect(screen.getByTestId('page-content')).toHaveTextContent(
        'Services Page'
      );
    });
  });
});
