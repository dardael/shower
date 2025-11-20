# Quickstart Guide: Dark Mode Toggle

**Feature**: Dark Mode Toggle  
**Date**: 2025-11-23  
**Purpose**: Quick implementation guide for developers

## Overview

This guide provides step-by-step instructions for implementing the dark mode toggle feature in the admin panel. The feature allows users to switch between light and dark themes with persistence across browser sessions.

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Existing Shower project with Chakra UI v3 setup
- Admin panel with sidebar layout

## Implementation Steps

### Step 1: Install Dependencies

```bash
# Install Chakra UI v3 if not already present
docker compose run --rm app npm install @chakra-ui/react @chakra-ui/icons

# Install next-themes (usually included with Chakra UI v3)
docker compose run --rm app npm install next-themes
```

### Step 2: Create Theme Value Objects

Create `src/domain/settings/value-objects/ThemeMode.ts`:

```typescript
export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export class ThemeModeValidator {
  static isValid(theme: string): theme is ThemeMode {
    return Object.values(ThemeMode).includes(theme as ThemeMode);
  }

  static validate(theme: string): ThemeMode {
    if (!this.isValid(theme)) {
      throw new Error(`Invalid theme mode: ${theme}`);
    }
    return theme as ThemeMode;
  }
}
```

### Step 3: Create Theme Preference Entity

Create `src/domain/settings/entities/ThemePreference.ts`:

```typescript
import { ThemeMode } from '../value-objects/ThemeMode';

export class ThemePreference {
  constructor(
    public readonly themeMode: ThemeMode,
    public readonly isSystemDefault: boolean,
    public readonly lastUpdated: Date,
    public readonly userId?: string
  ) {}

  static createForNewUser(systemTheme: ThemeMode): ThemePreference {
    return new ThemePreference(systemTheme, true, new Date());
  }

  updateTheme(newTheme: ThemeMode): ThemePreference {
    return new ThemePreference(newTheme, false, new Date(), this.userId);
  }

  resetToSystem(systemTheme: ThemeMode): ThemePreference {
    return new ThemePreference(systemTheme, true, new Date(), this.userId);
  }

  toJSON() {
    return {
      themeMode: this.themeMode,
      isSystemDefault: this.isSystemDefault,
      lastUpdated: this.lastUpdated.toISOString(),
      userId: this.userId,
    };
  }

  static fromJSON(data: any): ThemePreference {
    return new ThemePreference(
      ThemeModeValidator.validate(data.themeMode),
      data.isSystemDefault,
      new Date(data.lastUpdated),
      data.userId
    );
  }
}
```

### Step 4: Create Storage Service Interface

Create `src/domain/settings/services/IThemeStorageService.ts`:

```typescript
import { ThemePreference } from '../entities/ThemePreference';

export interface IThemeStorageService {
  saveThemePreference(preference: ThemePreference): Promise<void>;
  getThemePreference(): Promise<ThemePreference | null>;
  clearThemePreference(): Promise<void>;
  isStorageAvailable(): Promise<boolean>;
}
```

### Step 5: Implement Browser Storage Adapter

Create `src/infrastructure/settings/adapters/BrowserStorageAdapter.ts`:

```typescript
import { injectable } from 'tsyringe';
import { Logger } from '@/application/shared/Logger';
import { IThemeStorageService } from '@/domain/settings/services/IThemeStorageService';
import { ThemePreference } from '@/domain/settings/entities/ThemePreference';

const STORAGE_KEY = 'shower-admin-theme';

@injectable()
export class BrowserStorageAdapter implements IThemeStorageService {
  constructor(@inject('Logger') private logger: Logger) {}

  async saveThemePreference(preference: ThemePreference): Promise<void> {
    try {
      const serialized = JSON.stringify(preference.toJSON());
      localStorage.setItem(STORAGE_KEY, serialized);
      this.logger.info('Theme preference saved', {
        themeMode: preference.themeMode,
      });
    } catch (error) {
      this.logger.error('Failed to save theme preference', error as Error, {
        operation: 'save',
        themeMode: preference.themeMode,
      });
      throw new Error(
        `Storage error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getThemePreference(): Promise<ThemePreference | null> {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY);
      if (!serialized) {
        return null;
      }

      const data = JSON.parse(serialized);
      const preference = ThemePreference.fromJSON(data);

      this.logger.debug('Theme preference loaded', {
        themeMode: preference.themeMode,
      });
      return preference;
    } catch (error) {
      this.logger.error('Failed to load theme preference', error as Error, {
        operation: 'load',
      });
      return null;
    }
  }

  async clearThemePreference(): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_KEY);
      this.logger.info('Theme preference cleared');
    } catch (error) {
      this.logger.error('Failed to clear theme preference', error as Error, {
        operation: 'clear',
      });
      throw new Error(
        `Storage error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async isStorageAvailable(): Promise<boolean> {
    try {
      const testKey = '__theme_storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
}
```

### Step 6: Create Theme Management Hook

Create `src/presentation/admin/hooks/useTheme.ts`:

```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useColorMode } from '@/components/ui/color-mode';
import { ThemeMode } from '@/domain/settings/value-objects/ThemeMode';
import { ThemePreference } from '@/domain/settings/entities/ThemePreference';
import { useLogger } from '@/presentation/shared/hooks/useLogger';

export function useTheme() {
  const { colorMode, setColorMode, systemTheme } = useColorMode();
  const [isLoading, setIsLoading] = useState(true);
  const [isStorageAvailable, setIsStorageAvailable] = useState(false);
  const logger = useLogger();

  // Convert Chakra color mode to our ThemeMode
  const toThemeMode = useCallback((mode: string): ThemeMode => {
    switch (mode) {
      case 'light':
        return ThemeMode.LIGHT;
      case 'dark':
        return ThemeMode.DARK;
      case 'system':
        return ThemeMode.SYSTEM;
      default:
        return ThemeMode.LIGHT;
    }
  }, []);

  // Convert our ThemeMode to Chakra color mode
  const fromThemeMode = useCallback((mode: ThemeMode): string => {
    return mode;
  }, []);

  // Check storage availability
  useEffect(() => {
    const checkStorage = async () => {
      try {
        const testKey = '__theme_storage_test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        setIsStorageAvailable(true);
      } catch {
        setIsStorageAvailable(false);
        logger.warn('localStorage not available for theme persistence');
      } finally {
        setIsLoading(false);
      }
    };

    checkStorage();
  }, [logger]);

  // Load saved preference on mount
  useEffect(() => {
    const loadPreference = async () => {
      try {
        const serialized = localStorage.getItem('shower-admin-theme');
        if (serialized) {
          const data = JSON.parse(serialized);
          const preference = ThemePreference.fromJSON(data);
          setColorMode(fromThemeMode(preference.themeMode));
          logger.info('Theme preference loaded', {
            themeMode: preference.themeMode,
          });
        }
      } catch (error) {
        logger.error('Failed to load theme preference', error as Error);
      }
    };

    if (isStorageAvailable) {
      loadPreference();
    }
  }, [isStorageAvailable, setColorMode, fromThemeMode, logger]);

  const toggleTheme = useCallback(async () => {
    const newTheme = colorMode === 'light' ? ThemeMode.DARK : ThemeMode.LIGHT;

    try {
      setColorMode(fromThemeMode(newTheme));

      if (isStorageAvailable) {
        const preference = new ThemePreference(newTheme, false, new Date());
        const serialized = JSON.stringify(preference.toJSON());
        localStorage.setItem('shower-admin-theme', serialized);
      }

      logger.info('Theme toggled', { newTheme, source: 'user' });
    } catch (error) {
      logger.error('Failed to toggle theme', error as Error);
    }
  }, [colorMode, setColorMode, fromThemeMode, isStorageAvailable, logger]);

  const setTheme = useCallback(
    async (theme: ThemeMode) => {
      try {
        setColorMode(fromThemeMode(theme));

        if (isStorageAvailable) {
          const preference = new ThemePreference(theme, false, new Date());
          const serialized = JSON.stringify(preference.toJSON());
          localStorage.setItem('shower-admin-theme', serialized);
        }

        logger.info('Theme set', { theme, source: 'user' });
      } catch (error) {
        logger.error('Failed to set theme', error as Error);
      }
    },
    [setColorMode, fromThemeMode, isStorageAvailable, logger]
  );

  return {
    currentTheme: toThemeMode(colorMode),
    systemTheme: toThemeMode(systemTheme || 'light'),
    isLoading,
    isStorageAvailable,
    toggleTheme,
    setTheme,
  };
}
```

### Step 7: Create Dark Mode Toggle Component

Create `src/presentation/admin/components/DarkModeToggle.tsx`:

```typescript
'use client';

import { IconButton } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useTheme } from '@/presentation/admin/hooks/useTheme';
import { ThemeMode } from '@/domain/settings/value-objects/ThemeMode';

interface DarkModeToggleProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'subtle' | 'outline' | 'ghost';
  'aria-label'?: string;
}

export function DarkModeToggle({
  size = 'sm',
  variant = 'ghost',
  'aria-label': ariaLabel
}: DarkModeToggleProps) {
  const { currentTheme, isLoading, isStorageAvailable, toggleTheme } = useTheme();

  const isDark = currentTheme === ThemeMode.DARK;
  const label = ariaLabel || (isDark ? 'Switch to light mode' : 'Switch to dark mode');

  if (isLoading) {
    return <IconButton boxSize={size === 'xs' ? '6' : size === 'sm' ? '8' : '10'} isDisabled />;
  }

  return (
    <IconButton
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      variant={variant}
      size={size}
      isDisabled={!isStorageAvailable}
      _disabled={{
        opacity: 0.5,
        cursor: 'not-allowed'
      }}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </IconButton>
  );
}
```

### Step 8: Update Admin Sidebar

Modify `src/presentation/admin/components/AdminSidebar.tsx` to include the theme toggle:

```typescript
// Add import
import { DarkModeToggle } from './DarkModeToggle';

// In the sidebar component, add the toggle next to the "Admin Panel" label
<VStack align="start" spacing={4}>
  <HStack justify="space-between" width="full">
    <Text fontSize="lg" fontWeight="bold">Admin Panel</Text>
    <DarkModeToggle size="sm" />
  </HStack>

  {/* Rest of sidebar content */}
</VStack>
```

### Step 9: Update Admin Layout

Ensure the admin layout includes the Chakra UI Provider with color mode support:

```typescript
// src/app/admin/layout.tsx
import { Provider } from "@/components/ui/provider"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <body>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  )
}
```

### Step 10: Add Tests

Create `test/unit/presentation/admin/components/DarkModeToggle.test.tsx`:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { DarkModeToggle } from '@/presentation/admin/components/DarkModeToggle';
import { ThemeMode } from '@/domain/settings/value-objects/ThemeMode';

// Mock the useTheme hook
jest.mock('@/presentation/admin/hooks/useTheme');

describe('DarkModeToggle', () => {
  const mockToggleTheme = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders moon icon in light mode', () => {
    (useTheme as jest.Mock).mockReturnValue({
      currentTheme: ThemeMode.LIGHT,
      isLoading: false,
      isStorageAvailable: true,
      toggleTheme: mockToggleTheme,
    });

    render(<DarkModeToggle />);

    expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument();
  });

  it('renders sun icon in dark mode', () => {
    (useTheme as jest.Mock).mockReturnValue({
      currentTheme: ThemeMode.DARK,
      isLoading: false,
      isStorageAvailable: true,
      toggleTheme: mockToggleTheme,
    });

    render(<DarkModeToggle />);

    expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeInTheDocument();
  });

  it('calls toggleTheme when clicked', () => {
    (useTheme as jest.Mock).mockReturnValue({
      currentTheme: ThemeMode.LIGHT,
      isLoading: false,
      isStorageAvailable: true,
      toggleTheme: mockToggleTheme,
    });

    render(<DarkModeToggle />);

    fireEvent.click(screen.getByRole('button'));
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('is disabled when storage is unavailable', () => {
    (useTheme as jest.Mock).mockReturnValue({
      currentTheme: ThemeMode.LIGHT,
      isLoading: false,
      isStorageAvailable: false,
      toggleTheme: mockToggleTheme,
    });

    render(<DarkModeToggle />);

    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

## Testing

### Run Unit Tests

```bash
docker compose run --rm app npm test -- DarkModeToggle
```

### Run Integration Tests

```bash
docker compose run --rm app npm test -- theme-persistence
```

### Manual Testing

1. Access admin panel in a new browser
2. Verify system theme is detected and applied
3. Click theme toggle button
4. Verify theme changes immediately
5. Refresh page - theme should persist
6. Close/reopen browser - theme should persist
7. Test in different browser - should use system preference

## Troubleshooting

### Common Issues

1. **Hydration Mismatch**: Ensure theme-dependent components use `ClientOnly` or mounted state
2. **Storage Errors**: Check localStorage availability and quota limits
3. **Theme Not Persisting**: Verify localStorage key consistency and error handling
4. **Button Not Working**: Check that useTheme hook is properly implemented

### Debug Tips

- Use browser devtools to inspect localStorage for 'shower-admin-theme' key
- Check console for theme-related error messages
- Verify Chakra UI Provider is properly configured
- Test theme detection with different browser settings

## Next Steps

After implementing the basic dark mode toggle:

1. Add theme transition animations (if desired)
2. Implement theme scheduling (time-based themes)
3. Add custom theme color options
4. Create theme import/export functionality
5. Add analytics for theme usage tracking

## Support

For issues or questions:

1. Check the implementation against the data model and contracts
2. Review the test files for expected behavior
3. Consult the enhanced logging system for runtime errors
4. Refer to Chakra UI v3 documentation for advanced theming options
