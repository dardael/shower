# Data Model: Theme Mode Configuration

**Feature Branch**: `027-theme-mode-config`  
**Created**: 2025-12-13

## Entities

### ThemeModeConfig (Value Object)

**Location**: `src/domain/settings/value-objects/ThemeModeConfig.ts`

**Purpose**: Represents the website-wide theme mode configuration setting.

| Field | Type           | Constraints    | Description               |
| ----- | -------------- | -------------- | ------------------------- |
| value | ThemeModeValue | Required, enum | The configured theme mode |

**Enum Values** (`ThemeModeValue`):

- `"force-light"` - Force light mode, hide toggle
- `"force-dark"` - Force dark mode, hide toggle
- `"user-choice"` - Allow user to toggle (default)

**Validation Rules**:

- Value must be one of the three valid enum values
- Invalid values default to `"user-choice"`

**Factory Methods**:

- `ThemeModeConfig.create(value: string): ThemeModeConfig` - Validates and creates
- `ThemeModeConfig.default(): ThemeModeConfig` - Returns user-choice default

**Behavior Methods**:

- `isForced(): boolean` - Returns true if force-light or force-dark
- `getForcedMode(): 'light' | 'dark' | null` - Returns forced mode or null
- `shouldShowToggle(): boolean` - Returns true only for user-choice

## Setting Key Addition

**File**: `src/domain/settings/constants/SettingKeys.ts`

```typescript
export const SETTING_KEYS = {
  // ... existing keys
  THEME_MODE: 'theme-mode',
} as const;
```

## Storage

**Collection**: `website_settings` (existing MongoDB collection)

**Document Structure**:

```json
{
  "_id": "ObjectId",
  "key": "theme-mode",
  "value": "user-choice"
}
```

## State Transitions

```
[No Setting] ──────────────────────────────────────┐
      │                                             │
      ▼                                             ▼
┌──────────────┐    Admin saves    ┌──────────────────┐
│ user-choice  │ ◄───────────────► │   force-light    │
│  (default)   │                   │                  │
└──────────────┘                   └──────────────────┘
      ▲                                   ▲
      │         Admin saves               │
      │◄──────────────────────────────────┤
      │                                   │
      ▼                                   ▼
┌──────────────────┐
│    force-dark    │
└──────────────────┘
```

All transitions are bidirectional - admin can switch between any mode at any time.

## Relationships

```
WebsiteSettings (aggregate root)
    │
    ├── websiteName: string
    ├── themeColor: ThemeColor
    ├── backgroundColor: BackgroundColor
    ├── websiteFont: WebsiteFont
    ├── headerLogo: HeaderLogo
    └── themeMode: ThemeModeConfig  ← NEW
```

## API Data Transfer Objects

### GetSettingsResponse (updated)

```typescript
interface GetSettingsResponse {
  name: string;
  themeColor: string;
  backgroundColor: string;
  themeMode: ThemeModeValue; // NEW
}
```

### UpdateSettingsRequest (updated)

```typescript
interface UpdateSettingsRequest {
  name?: string;
  themeColor?: string;
  backgroundColor?: string;
  themeMode?: ThemeModeValue; // NEW
}
```
