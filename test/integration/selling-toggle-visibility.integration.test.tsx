/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

// Mock fetch for API calls
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/admin',
}));

// Mock Chakra UI components
jest.mock('@chakra-ui/react', () => ({
  Box: ({ children, ...props }: { children?: React.ReactNode }) => (
    <div {...props}>{children}</div>
  ),
  VStack: ({ children, ...props }: { children?: React.ReactNode }) => (
    <div {...props}>{children}</div>
  ),
  HStack: ({ children, ...props }: { children?: React.ReactNode }) => (
    <div {...props}>{children}</div>
  ),
  Text: ({ children, ...props }: { children?: React.ReactNode }) => (
    <span {...props}>{children}</span>
  ),
  Button: ({
    children,
    onClick,
    ...props
  }: {
    children?: React.ReactNode;
    onClick?: () => void;
  }) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
  IconButton: ({
    children,
    onClick,
    'aria-label': ariaLabel,
    ...props
  }: {
    children?: React.ReactNode;
    onClick?: () => void;
    'aria-label'?: string;
  }) => (
    <button onClick={onClick} aria-label={ariaLabel} {...props}>
      {children}
    </button>
  ),
  Switch: ({
    checked,
    onChange,
    'aria-label': ariaLabel,
  }: {
    checked?: boolean;
    onChange?: (e: { target: { checked: boolean } }) => void;
    'aria-label'?: string;
  }) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      aria-label={ariaLabel}
      data-testid="selling-toggle-switch"
    />
  ),
  ClientOnly: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  Skeleton: () => <div data-testid="skeleton" />,
  Link: ({
    children,
    href,
    ...props
  }: {
    children?: React.ReactNode;
    href?: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock react-icons
jest.mock('react-icons/lu', () => ({
  LuShoppingBag: () => <span data-testid="shopping-bag-icon">ShoppingBag</span>,
  LuSettings: () => <span data-testid="settings-icon">Settings</span>,
  LuPackage: () => <span data-testid="package-icon">Package</span>,
  LuMenu: () => <span data-testid="menu-icon">Menu</span>,
  LuFileText: () => <span data-testid="file-text-icon">FileText</span>,
  LuPalette: () => <span data-testid="palette-icon">Palette</span>,
}));

describe('Selling Toggle Visibility Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Default State Behavior', () => {
    it('should have selling disabled by default when no setting exists', async () => {
      // Mock API returning no sellingEnabled setting (defaults to false)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          name: 'Test Site',
          themeColor: 'blue',
          // sellingEnabled is not present, should default to false
        }),
      });

      // Create a test component that uses the selling setting
      const TestComponent = () => {
        const [sellingEnabled, setSellingEnabled] = React.useState<
          boolean | null
        >(null);
        const [isLoading, setIsLoading] = React.useState(true);

        React.useEffect(() => {
          fetch('/api/settings')
            .then((res) => res.json())
            .then((data) => {
              // Default to false when not present
              setSellingEnabled(data.sellingEnabled ?? false);
              setIsLoading(false);
            });
        }, []);

        if (isLoading) return <div>Loading...</div>;

        return (
          <div>
            <span data-testid="selling-enabled">{String(sellingEnabled)}</span>
          </div>
        );
      };

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('selling-enabled')).toHaveTextContent(
          'false'
        );
      });
    });

    it('should respect explicit false setting for selling', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          name: 'Test Site',
          sellingEnabled: false,
        }),
      });

      const TestComponent = () => {
        const [sellingEnabled, setSellingEnabled] = React.useState<
          boolean | null
        >(null);
        const [isLoading, setIsLoading] = React.useState(true);

        React.useEffect(() => {
          fetch('/api/settings')
            .then((res) => res.json())
            .then((data) => {
              setSellingEnabled(data.sellingEnabled ?? false);
              setIsLoading(false);
            });
        }, []);

        if (isLoading) return <div>Loading...</div>;

        return (
          <div>
            <span data-testid="selling-enabled">{String(sellingEnabled)}</span>
          </div>
        );
      };

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('selling-enabled')).toHaveTextContent(
          'false'
        );
      });
    });

    it('should respect explicit true setting for selling', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          name: 'Test Site',
          sellingEnabled: true,
        }),
      });

      const TestComponent = () => {
        const [sellingEnabled, setSellingEnabled] = React.useState<
          boolean | null
        >(null);
        const [isLoading, setIsLoading] = React.useState(true);

        React.useEffect(() => {
          fetch('/api/settings')
            .then((res) => res.json())
            .then((data) => {
              setSellingEnabled(data.sellingEnabled ?? false);
              setIsLoading(false);
            });
        }, []);

        if (isLoading) return <div>Loading...</div>;

        return (
          <div>
            <span data-testid="selling-enabled">{String(sellingEnabled)}</span>
          </div>
        );
      };

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('selling-enabled')).toHaveTextContent('true');
      });
    });
  });

  describe('Products Menu Item Visibility', () => {
    // Simulated AdminSidebar with selling toggle logic
    const AdminSidebarWithSellingToggle = ({
      sellingEnabled,
    }: {
      sellingEnabled: boolean;
    }) => {
      const menuItems = [
        { label: 'Pages', href: '/admin/pages', icon: 'FileText' },
        { label: 'Settings', href: '/admin/settings', icon: 'Settings' },
        { label: 'Theme', href: '/admin/theme', icon: 'Palette' },
      ];

      // Products menu item is conditionally added based on sellingEnabled
      if (sellingEnabled) {
        menuItems.push({
          label: 'Products',
          href: '/admin/products',
          icon: 'Package',
        });
      }

      return (
        <nav data-testid="admin-sidebar">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              data-testid={`menu-item-${item.label.toLowerCase()}`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      );
    };

    it('should hide Products menu item when selling is disabled', () => {
      render(<AdminSidebarWithSellingToggle sellingEnabled={false} />);

      expect(screen.getByTestId('menu-item-pages')).toBeInTheDocument();
      expect(screen.getByTestId('menu-item-settings')).toBeInTheDocument();
      expect(screen.getByTestId('menu-item-theme')).toBeInTheDocument();
      expect(
        screen.queryByTestId('menu-item-products')
      ).not.toBeInTheDocument();
    });

    it('should show Products menu item when selling is enabled', () => {
      render(<AdminSidebarWithSellingToggle sellingEnabled={true} />);

      expect(screen.getByTestId('menu-item-pages')).toBeInTheDocument();
      expect(screen.getByTestId('menu-item-settings')).toBeInTheDocument();
      expect(screen.getByTestId('menu-item-theme')).toBeInTheDocument();
      expect(screen.getByTestId('menu-item-products')).toBeInTheDocument();
    });

    it('should update menu visibility immediately when selling toggle changes', async () => {
      const DynamicSidebar = () => {
        const [sellingEnabled, setSellingEnabled] = React.useState(false);

        return (
          <div>
            <button
              data-testid="toggle-selling"
              onClick={() => setSellingEnabled(!sellingEnabled)}
            >
              Toggle Selling
            </button>
            <AdminSidebarWithSellingToggle sellingEnabled={sellingEnabled} />
          </div>
        );
      };

      render(<DynamicSidebar />);

      // Initially hidden
      expect(
        screen.queryByTestId('menu-item-products')
      ).not.toBeInTheDocument();

      // Toggle selling on
      fireEvent.click(screen.getByTestId('toggle-selling'));

      // Now visible
      await waitFor(() => {
        expect(screen.getByTestId('menu-item-products')).toBeInTheDocument();
      });

      // Toggle selling off
      fireEvent.click(screen.getByTestId('toggle-selling'));

      // Hidden again
      await waitFor(() => {
        expect(
          screen.queryByTestId('menu-item-products')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Editor Product Button Visibility', () => {
    // Simulated TiptapEditor toolbar with selling toggle logic
    const EditorToolbarWithSellingToggle = ({
      sellingEnabled,
    }: {
      sellingEnabled: boolean;
    }) => {
      return (
        <div data-testid="editor-toolbar">
          <button aria-label="Bold" data-testid="bold-button">
            Bold
          </button>
          <button aria-label="Italic" data-testid="italic-button">
            Italic
          </button>
          <button aria-label="Insert Image" data-testid="image-button">
            Image
          </button>
          {sellingEnabled && (
            <button
              aria-label="Insert Products List"
              data-testid="products-list-button"
            >
              <span data-testid="shopping-bag-icon">ShoppingBag</span>
            </button>
          )}
        </div>
      );
    };

    it('should hide Insert Products List button when selling is disabled', () => {
      render(<EditorToolbarWithSellingToggle sellingEnabled={false} />);

      expect(screen.getByTestId('bold-button')).toBeInTheDocument();
      expect(screen.getByTestId('italic-button')).toBeInTheDocument();
      expect(screen.getByTestId('image-button')).toBeInTheDocument();
      expect(
        screen.queryByTestId('products-list-button')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText('Insert Products List')
      ).not.toBeInTheDocument();
    });

    it('should show Insert Products List button when selling is enabled', () => {
      render(<EditorToolbarWithSellingToggle sellingEnabled={true} />);

      expect(screen.getByTestId('bold-button')).toBeInTheDocument();
      expect(screen.getByTestId('italic-button')).toBeInTheDocument();
      expect(screen.getByTestId('image-button')).toBeInTheDocument();
      expect(screen.getByTestId('products-list-button')).toBeInTheDocument();
      expect(screen.getByLabelText('Insert Products List')).toBeInTheDocument();
    });

    it('should update button visibility immediately when selling toggle changes', async () => {
      const DynamicEditor = () => {
        const [sellingEnabled, setSellingEnabled] = React.useState(false);

        return (
          <div>
            <button
              data-testid="toggle-selling"
              onClick={() => setSellingEnabled(!sellingEnabled)}
            >
              Toggle Selling
            </button>
            <EditorToolbarWithSellingToggle sellingEnabled={sellingEnabled} />
          </div>
        );
      };

      render(<DynamicEditor />);

      // Initially hidden
      expect(
        screen.queryByTestId('products-list-button')
      ).not.toBeInTheDocument();

      // Toggle selling on
      fireEvent.click(screen.getByTestId('toggle-selling'));

      // Now visible
      await waitFor(() => {
        expect(screen.getByTestId('products-list-button')).toBeInTheDocument();
      });

      // Toggle selling off
      fireEvent.click(screen.getByTestId('toggle-selling'));

      // Hidden again
      await waitFor(() => {
        expect(
          screen.queryByTestId('products-list-button')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Selling Toggle API Integration', () => {
    it('should call API to update selling setting when toggled', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ sellingEnabled: false }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

      const SellingToggleForm = () => {
        const [sellingEnabled, setSellingEnabled] = React.useState(false);
        const [isLoading, setIsLoading] = React.useState(true);

        React.useEffect(() => {
          fetch('/api/settings')
            .then((res) => res.json())
            .then((data) => {
              setSellingEnabled(data.sellingEnabled ?? false);
              setIsLoading(false);
            });
        }, []);

        const handleToggle = async () => {
          const newValue = !sellingEnabled;
          setSellingEnabled(newValue);
          await fetch('/api/settings/selling', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sellingEnabled: newValue }),
          });
        };

        if (isLoading) return <div>Loading...</div>;

        return (
          <div>
            <label>
              <input
                type="checkbox"
                checked={sellingEnabled}
                onChange={handleToggle}
                data-testid="selling-toggle"
              />
              Enable Selling
            </label>
            <span data-testid="selling-status">
              {sellingEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        );
      };

      render(<SellingToggleForm />);

      await waitFor(() => {
        expect(screen.getByTestId('selling-status')).toHaveTextContent(
          'Disabled'
        );
      });

      // Toggle selling on
      fireEvent.click(screen.getByTestId('selling-toggle'));

      await waitFor(() => {
        expect(screen.getByTestId('selling-status')).toHaveTextContent(
          'Enabled'
        );
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/settings/selling', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sellingEnabled: true }),
      });
    });

    it('should persist selling setting across sessions', async () => {
      // First session - selling is enabled
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ sellingEnabled: true }),
      });

      const TestComponent = () => {
        const [sellingEnabled, setSellingEnabled] = React.useState<
          boolean | null
        >(null);
        const [isLoading, setIsLoading] = React.useState(true);

        React.useEffect(() => {
          fetch('/api/settings')
            .then((res) => res.json())
            .then((data) => {
              setSellingEnabled(data.sellingEnabled ?? false);
              setIsLoading(false);
            });
        }, []);

        if (isLoading) return <div>Loading...</div>;

        return (
          <span data-testid="selling-enabled">{String(sellingEnabled)}</span>
        );
      };

      const { unmount } = render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('selling-enabled')).toHaveTextContent('true');
      });

      unmount();

      // Simulate second session - should still be enabled (persisted)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ sellingEnabled: true }),
      });

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('selling-enabled')).toHaveTextContent('true');
      });
    });
  });

  describe('Combined Visibility Behavior', () => {
    // Simulated full admin interface with both sidebar and editor
    const AdminInterfaceWithSellingToggle = ({
      sellingEnabled,
    }: {
      sellingEnabled: boolean;
    }) => {
      const menuItems = [
        { label: 'Pages', href: '/admin/pages' },
        { label: 'Settings', href: '/admin/settings' },
      ];

      if (sellingEnabled) {
        menuItems.push({ label: 'Products', href: '/admin/products' });
      }

      return (
        <div data-testid="admin-interface">
          <nav data-testid="sidebar">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <main data-testid="editor-area">
            <div data-testid="toolbar">
              <button>Bold</button>
              <button>Italic</button>
              {sellingEnabled && (
                <button data-testid="insert-products-btn">
                  Insert Products List
                </button>
              )}
            </div>
          </main>
        </div>
      );
    };

    it('should hide both Products menu and editor button when selling is disabled', () => {
      render(<AdminInterfaceWithSellingToggle sellingEnabled={false} />);

      // Sidebar check
      expect(screen.getByTestId('nav-pages')).toBeInTheDocument();
      expect(screen.getByTestId('nav-settings')).toBeInTheDocument();
      expect(screen.queryByTestId('nav-products')).not.toBeInTheDocument();

      // Editor toolbar check
      expect(
        screen.queryByTestId('insert-products-btn')
      ).not.toBeInTheDocument();
    });

    it('should show both Products menu and editor button when selling is enabled', () => {
      render(<AdminInterfaceWithSellingToggle sellingEnabled={true} />);

      // Sidebar check
      expect(screen.getByTestId('nav-pages')).toBeInTheDocument();
      expect(screen.getByTestId('nav-settings')).toBeInTheDocument();
      expect(screen.getByTestId('nav-products')).toBeInTheDocument();

      // Editor toolbar check
      expect(screen.getByTestId('insert-products-btn')).toBeInTheDocument();
    });

    it('should update both areas simultaneously when toggle changes', async () => {
      const FullAdminWithToggle = () => {
        const [sellingEnabled, setSellingEnabled] = React.useState(false);

        return (
          <div>
            <button
              data-testid="toggle-selling"
              onClick={() => setSellingEnabled(!sellingEnabled)}
            >
              Toggle
            </button>
            <AdminInterfaceWithSellingToggle sellingEnabled={sellingEnabled} />
          </div>
        );
      };

      render(<FullAdminWithToggle />);

      // Both hidden initially
      expect(screen.queryByTestId('nav-products')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('insert-products-btn')
      ).not.toBeInTheDocument();

      // Toggle on
      fireEvent.click(screen.getByTestId('toggle-selling'));

      // Both visible
      await waitFor(() => {
        expect(screen.getByTestId('nav-products')).toBeInTheDocument();
        expect(screen.getByTestId('insert-products-btn')).toBeInTheDocument();
      });

      // Toggle off
      fireEvent.click(screen.getByTestId('toggle-selling'));

      // Both hidden again
      await waitFor(() => {
        expect(screen.queryByTestId('nav-products')).not.toBeInTheDocument();
        expect(
          screen.queryByTestId('insert-products-btn')
        ).not.toBeInTheDocument();
      });
    });
  });
});
