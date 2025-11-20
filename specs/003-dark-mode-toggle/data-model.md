# Data Model: Dark Mode Toggle

**Feature**: Dark Mode Toggle  
**Date**: 2025-11-23  
**Architecture**: Domain-Driven Design with Hexagonal Architecture

## Core Entities

### ThemePreference

**Purpose**: Represents a user's theme preference stored in browser localStorage

**Attributes**:

- `themeMode: ThemeMode` - The selected theme mode (light/dark)
- `isSystemDefault: boolean` - Indicates if using system preference
- `lastUpdated: Date` - Timestamp of last preference change
- `userId?: string` - Optional user identifier for future server-side persistence

**Behavior**:

- Validates theme mode values
- Handles preference updates with timestamp
- Provides serialization for localStorage storage
- Detects and handles storage unavailability

**Validation Rules**:

- `themeMode` must be a valid ThemeMode value
- `lastUpdated` cannot be in the future
- Storage operations must handle quota exceeded errors

### User (Extended)

**Purpose**: Existing user entity extended with theme preferences

**New Attributes**:

- `themePreference: ThemePreference` - User's theme preference
- `hasCustomTheme: boolean` - Flag indicating custom theme vs system default

## Value Objects

### ThemeMode

**Purpose**: Represents available theme modes with validation

**Values**:

- `LIGHT = 'light'` - Light theme mode
- `DARK = 'dark'` - Dark theme mode
- `SYSTEM = 'system'` - Use browser/system preference

**Behavior**:

- Validates theme mode strings
- Provides browser preference detection
- Handles system theme change detection
- Converts to/from string representation

**Validation Rules**:

- Only accepts predefined theme mode values
- System mode requires browser API support
- String conversion is case-insensitive

### StorageKey

**Purpose**: Type-safe localStorage key management

**Value**:

- `THEME_PREFERENCE = 'shower-admin-theme'` - localStorage key for theme preference

**Behavior**:

- Provides type-safe key access
- Prevents key collisions
- Handles key migration if needed

## Domain Services

### IThemeStorageService

**Purpose**: Interface for theme persistence operations

**Methods**:

```typescript
interface IThemeStorageService {
  saveThemePreference(preference: ThemePreference): Promise<void>;
  getThemePreference(): Promise<ThemePreference | null>;
  clearThemePreference(): Promise<void>;
  isStorageAvailable(): Promise<boolean>;
}
```

**Behavior**:

- Abstracts storage implementation details
- Handles storage errors gracefully
- Provides availability detection
- Supports future storage backend changes

### IBrowserThemeDetector

**Purpose**: Detects browser/system theme preferences

**Methods**:

```typescript
interface IBrowserThemeDetector {
  getSystemTheme(): Promise<ThemeMode>;
  watchThemeChanges(callback: (theme: ThemeMode) => void): () => void;
  isMediaQuerySupported(): boolean;
}
```

**Behavior**:

- Detects initial system theme preference
- Watches for system theme changes
- Provides cleanup for watchers
- Handles browser API unavailability

## Aggregates

### ThemePreferenceAggregate

**Purpose**: Manages theme preference lifecycle and business rules

**Root Entity**: ThemePreference

**Business Rules**:

1. First-time users get system preference as default
2. Explicit user choices override system preference
3. Storage failures fall back to system preference
4. Theme changes are logged for audit purposes
5. Invalid theme modes default to light mode

**Operations**:

- `initializeForNewUser(): ThemePreference` - Creates initial preference
- `updateTheme(mode: ThemeMode): ThemePreference` - Updates with validation
- `resetToSystem(): ThemePreference` - Resets to system preference
- `getEffectiveTheme(systemTheme: ThemeMode): ThemeMode` - Resolves final theme

## Events

### ThemePreferenceChanged

**Purpose**: Domain event for theme preference changes

**Attributes**:

- `userId?: string` - User identifier
- `previousTheme: ThemeMode` - Previous theme mode
- `newTheme: ThemeMode` - New theme mode
- `timestamp: Date` - Change timestamp
- `source: 'user' | 'system' | 'initialization'` - Change source

### ThemeStorageError

**Purpose**: Domain event for storage operation failures

**Attributes**:

- `operation: 'save' | 'load' | 'clear'` - Failed operation
- `error: Error` - Original error
- `fallbackUsed: boolean` - Whether fallback was applied
- `timestamp: Date` - Error timestamp

## Repository Interfaces

### IThemePreferenceRepository

**Purpose**: Repository interface for theme preference persistence

**Methods**:

```typescript
interface IThemePreferenceRepository {
  save(preference: ThemePreference): Promise<void>;
  find(): Promise<ThemePreference | null>;
  clear(): Promise<void>;
}
```

**Implementation Notes**:

- Currently implemented with localStorage adapter
- Future server-side implementation possible
- Handles storage quota and availability issues
- Provides consistent interface across storage backends

## Data Flow

### Theme Initialization Flow

```
1. User accesses admin panel
2. System checks for existing preference in storage
3. If no preference exists:
   - Detect browser/system theme preference
   - Create initial ThemePreference with system theme
   - Save to storage
4. If preference exists:
   - Load and validate preference
   - Apply saved theme
5. Update UI with resolved theme
```

### Theme Toggle Flow

```
1. User clicks theme toggle button
2. System validates new theme mode
3. Update ThemePreference with new mode and timestamp
4. Save updated preference to storage
5. Apply new theme to UI
6. Log theme change event
7. Handle any storage errors gracefully
```

### Error Handling Flow

```
1. Storage operation fails
2. Log ThemeStorageError event
3. Apply fallback behavior (system preference)
4. Show user notification if appropriate
5. Continue with degraded functionality
```

## Integration Points

### Presentation Layer Integration

- **Theme Toggle Component**: Uses theme hooks to trigger preference updates
- **Theme Provider**: Consumes preference to apply appropriate theme
- **Error Boundaries**: Handle storage errors gracefully

### Application Layer Integration

- **Theme Use Cases**: Coordinate preference updates and storage
- **Storage Services**: Implement persistence logic with error handling
- **Event Handlers**: Process domain events for logging and analytics

### Infrastructure Layer Integration

- **Storage Adapters**: Implement localStorage operations
- **Browser APIs**: Detect system theme preferences
- **Error Logging**: Integrate with enhanced logging system

## Testing Considerations

### Unit Tests

- ThemePreference entity validation and behavior
- ThemeMode value object validation
- Domain service interface compliance
- Aggregate business rule enforcement

### Integration Tests

- Storage adapter operations
- Browser theme detection
- Theme persistence across sessions
- Error handling and fallback behavior

### Component Tests

- Theme toggle component interaction
- Theme provider integration
- Error boundary behavior
- Accessibility compliance

## Future Extensibility

### Server-Side Persistence

- Add user identification to ThemePreference
- Implement server-side repository
- Sync preferences across devices
- Support user profile themes

### Advanced Theme Options

- Multiple theme variants (high contrast, custom colors)
- Theme scheduling (time-based themes)
- Theme import/export functionality
- Accessibility-focused themes
