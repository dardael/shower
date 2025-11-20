# API Contracts: Dark Mode Toggle

**Feature**: Dark Mode Toggle  
**Date**: 2025-11-23  
**Type**: Client-side Theme Management (No server API required)

## Overview

The dark mode toggle feature is implemented entirely client-side using browser localStorage and Chakra UI v3's color mode system. No server-side API endpoints are required for this feature as theme preferences are stored locally in the user's browser.

## Client-Side Contracts

### Theme Storage Interface

```typescript
interface IThemeStorageService {
  /**
   * Saves theme preference to browser localStorage
   * @param preference - The theme preference to save
   * @throws StorageError when localStorage is unavailable or quota exceeded
   */
  saveThemePreference(preference: ThemePreference): Promise<void>;

  /**
   * Retrieves theme preference from browser localStorage
   * @returns ThemePreference if found, null if no preference exists
   * @throws StorageError when localStorage is unavailable
   */
  getThemePreference(): Promise<ThemePreference | null>;

  /**
   * Removes theme preference from browser localStorage
   * @throws StorageError when localStorage is unavailable
   */
  clearThemePreference(): Promise<void>;

  /**
   * Checks if localStorage is available for use
   * @returns true if localStorage is available, false otherwise
   */
  isStorageAvailable(): Promise<boolean>;
}
```

### Browser Theme Detection Interface

```typescript
interface IBrowserThemeDetector {
  /**
   * Detects the current system/browser theme preference
   * @returns ThemeMode.LIGHT or ThemeMode.DARK based on system preference
   */
  getSystemTheme(): Promise<ThemeMode>;

  /**
   * Watches for system theme changes and calls callback when detected
   * @param callback - Function called when system theme changes
   * @returns Cleanup function to stop watching
   */
  watchThemeChanges(callback: (theme: ThemeMode) => void): () => void;

  /**
   * Checks if the browser supports theme detection
   * @returns true if prefers-color-scheme media query is supported
   */
  isMediaQuerySupported(): boolean;
}
```

### Theme Management Hook Interface

```typescript
interface IThemeManager {
  /**
   * Current active theme mode
   */
  currentTheme: ThemeMode;

  /**
   * Whether theme is currently loading (hydration state)
   */
  isLoading: boolean;

  /**
   * Whether localStorage is available for theme persistence
   */
  isStorageAvailable: boolean;

  /**
   * System detected theme (independent of user preference)
   */
  systemTheme: ThemeMode;

  /**
   * Toggles between light and dark themes
   * @throws ThemeError when theme update fails
   */
  toggleTheme(): Promise<void>;

  /**
   * Sets a specific theme mode
   * @param theme - The theme mode to set
   * @throws ThemeError when theme update fails
   */
  setTheme(theme: ThemeMode): Promise<void>;

  /**
   * Resets theme to system preference
   * @throws ThemeError when reset fails
   */
  resetToSystemTheme(): Promise<void>;
}
```

## Data Contracts

### ThemePreference Entity

```typescript
interface ThemePreference {
  /**
   * The selected theme mode
   */
  themeMode: ThemeMode;

  /**
   * Whether the preference is using system default
   */
  isSystemDefault: boolean;

  /**
   * Timestamp of last preference update
   */
  lastUpdated: Date;

  /**
   * Optional user identifier (for future server-side sync)
   */
  userId?: string;
}
```

### ThemeMode Value Object

```typescript
enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}
```

### Storage Configuration

```typescript
interface StorageConfig {
  /**
   * localStorage key for theme preference
   */
  storageKey: string;

  /**
   * Default theme when no preference exists
   */
  defaultTheme: ThemeMode;

  /**
   * Available theme options
   */
  availableThemes: ThemeMode[];

  /**
   * Whether to sync theme across browser tabs
   */
  syncAcrossTabs: boolean;
}
```

## Error Contracts

### StorageError

```typescript
class StorageError extends Error {
  constructor(
    message: string,
    public readonly operation: 'save' | 'load' | 'clear' | 'check',
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'StorageError';
  }
}
```

### ThemeError

```typescript
class ThemeError extends Error {
  constructor(
    message: string,
    public readonly operation: 'toggle' | 'set' | 'reset' | 'detect',
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'ThemeError';
  }
}
```

## Event Contracts

### ThemeChangedEvent

```typescript
interface ThemeChangedEvent {
  /**
   * Event type identifier
   */
  type: 'theme:changed';

  /**
   * Previous theme mode
   */
  previousTheme: ThemeMode;

  /**
   * New theme mode
   */
  newTheme: ThemeMode;

  /**
   * Source of the change
   */
  source: 'user' | 'system' | 'initialization';

  /**
   * Timestamp of the change
   */
  timestamp: Date;

  /**
   * Whether the change was persisted to storage
   */
  persisted: boolean;
}
```

### StorageErrorEvent

```typescript
interface StorageErrorEvent {
  /**
   * Event type identifier
   */
  type: 'storage:error';

  /**
   * Storage operation that failed
   */
  operation: 'save' | 'load' | 'clear';

  /**
   * Error details
   */
  error: Error;

  /**
   * Whether fallback behavior was applied
   */
  fallbackApplied: boolean;

  /**
   * Timestamp of the error
   */
  timestamp: Date;
}
```

## Component Contracts

### DarkModeToggle Component Props

```typescript
interface DarkModeToggleProps {
  /**
   * Additional CSS classes to apply
   */
  className?: string;

  /**
   * Size of the toggle button
   * @default 'sm'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg';

  /**
   * Visual variant of the toggle button
   * @default 'ghost'
   */
  variant?: 'solid' | 'subtle' | 'outline' | 'ghost';

  /**
   * Position of the toggle relative to label
   * @default 'right'
   */
  position?: 'left' | 'right';

  /**
   * Whether to show the theme label
   * @default false
   */
  showLabel?: boolean;

  /**
   * Custom aria-label for accessibility
   */
  'aria-label'?: string;

  /**
   * Callback when theme changes
   */
  onThemeChange?: (theme: ThemeMode) => void;
}
```

### ThemeProvider Props

```typescript
interface ThemeProviderProps {
  /**
   * Child components
   */
  children: React.ReactNode;

  /**
   * Initial theme mode (overrides detection)
   */
  initialTheme?: ThemeMode;

  /**
   * Storage configuration
   */
  storageConfig?: Partial<StorageConfig>;

  /**
   * Whether to disable theme persistence
   * @default false
   */
  disablePersistence?: boolean;

  /**
   * Callback for theme changes
   */
  onThemeChange?: (event: ThemeChangedEvent) => void;

  /**
   * Callback for storage errors
   */
  onStorageError?: (event: StorageErrorEvent) => void;
}
```

## Integration Contracts

### Admin Layout Integration

```typescript
interface AdminLayoutThemeIntegration {
  /**
   * Theme provider wrapper for admin pages
   */
  themeProvider: React.ComponentType<ThemeProviderProps>;

  /**
   * Theme toggle component for sidebar
   */
  themeToggle: React.ComponentType<DarkModeToggleProps>;

  /**
   * Hook for accessing theme in admin components
   */
  useTheme: () => IThemeManager;

  /**
   * Theme-aware styling utilities
   */
  themeStyles: {
    getBackgroundColor: (theme: ThemeMode) => string;
    getTextColor: (theme: ThemeMode) => string;
    getBorderColor: (theme: ThemeMode) => string;
  };
}
```

## Testing Contracts

### Mock Interfaces for Testing

```typescript
interface MockThemeStorageService extends IThemeStorageService {
  /**
   * Simulates storage being unavailable
   */
  setStorageUnavailable(unavailable: boolean): void;

  /**
   * Simulates storage quota exceeded
   */
  setQuotaExceeded(exceeded: boolean): void;

  /**
   * Gets the current stored preference (for test assertions)
   */
  getStoredPreference(): ThemePreference | null;

  /**
   * Clears all mock data
   */
  reset(): void;
}
```

```typescript
interface MockBrowserThemeDetector extends IBrowserThemeDetector {
  /**
   * Sets the mock system theme
   */
  setSystemTheme(theme: ThemeMode): void;

  /**
   * Triggers a system theme change event
   */
  triggerThemeChange(theme: ThemeMode): void;

  /**
   * Sets media query support
   */
  setMediaQuerySupported(supported: boolean): void;
}
```

## Performance Contracts

### Performance Requirements

```typescript
interface PerformanceContracts {
  /**
   * Theme switching must complete within this time
   */
  themeSwitchTimeout: 100; // milliseconds

  /**
   * Storage operations must complete within this time
   */
  storageOperationTimeout: 50; // milliseconds

  /**
   * Theme detection must complete within this time
   */
  themeDetectionTimeout: 20; // milliseconds

  /**
   * Maximum time for initial theme loading
   */
  initialLoadTimeout: 200; // milliseconds
}
```

## Security Contracts

### Security Requirements

```typescript
interface SecurityContracts {
  /**
   * Theme data must not contain sensitive information
   */
  dataSanitization: {
    /**
     * Validates theme preference data before storage
     */
    validateThemeData: (data: unknown) => boolean;

    /**
     * Sanitizes theme data to prevent injection attacks
     */
    sanitizeThemeData: (data: unknown) => ThemePreference;
  };

  /**
   * Storage access must be limited to theme data
   */
  storageAccess: {
    /**
     * Allowed storage keys for theme feature
     */
    allowedKeys: string[];

    /**
     * Maximum data size for theme storage
     */
    maxDataSize: number; // bytes
  };
}
```

## Browser Compatibility Contracts

### Supported Browsers

```typescript
interface BrowserSupport {
  /**
   * Minimum browser versions for theme support
   */
  minimumVersions: {
    chrome: 88; // supports prefers-color-scheme
    firefox: 85; // supports prefers-color-scheme
    safari: 14; // supports prefers-color-scheme
    edge: 88; // supports prefers-color-scheme
  };

  /**
   * Required browser APIs
   */
  requiredAPIs: {
    localStorage: boolean;
    matchMedia: boolean;
    addEventListener: boolean;
  };

  /**
   * Fallback behavior for unsupported browsers
   */
  fallbackBehavior: {
    themeDetection: 'always-light' | 'always-dark' | 'user-choice';
    storageSupport: 'memory-only' | 'no-persistence';
  };
}
```
