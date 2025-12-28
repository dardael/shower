# Data Model: Loader Background Color Configuration

**Feature**: 051-loader-bgcolor-config
**Date**: 2025-12-28

## Entities

### LoaderBackgroundColor (Value Object)

**Location**: `src/domain/settings/value-objects/LoaderBackgroundColor.ts`

**Description**: Represents the configured background color for loading screens.

| Field | Type   | Constraints               | Description                |
| ----- | ------ | ------------------------- | -------------------------- |
| value | string | Valid hex color (#RRGGBB) | The background color value |

**Validation Rules**:

- Must be a valid 7-character hex color string (# + 6 hex digits)
- Case insensitive (normalized to uppercase)
- Null/undefined treated as "use default"

**Factory Methods**:

- `create(value: string): LoaderBackgroundColor` - Creates from hex string with validation
- `createDefault(isDarkMode: boolean): LoaderBackgroundColor` - Returns default based on theme mode
- `fromString(value: string | null): LoaderBackgroundColor | null` - Parses stored value

**Default Values**:

- Light mode: `#FFFFFF` (white)
- Dark mode: `#1A202C` (Chakra gray.800)

---

### WebsiteSetting (Extended)

**Location**: `src/domain/settings/entities/WebsiteSetting.ts`

**New Factory Method**:

```typescript
static createLoaderBackgroundColor(color: string): WebsiteSetting
```

**New Validation Method**:

```typescript
static isValidLoaderBackgroundColor(value: SettingValue): boolean
```

---

## Constants

### SettingKeys (Extended)

**Location**: `src/domain/settings/constants/SettingKeys.ts`

**New Key**:

```typescript
LOADER_BACKGROUND_COLOR: 'loader-background-color';
```

**Add to `VALID_SETTING_KEY_VALUES` array** for export/import integration.

---

## State Transitions

```
[No Color Configured]
    ↓ (Admin sets color)
[Custom Color Active]
    ↓ (Admin resets)
[No Color Configured]
```

**Note**: There is no "pending" state. Changes are applied immediately upon save.

---

## Relationships

```
LoaderBackgroundColor (value object)
    ↓ stored as
WebsiteSetting (entity, key: 'loader-background-color')
    ↓ persisted in
MongoDB website_settings collection
    ↓ served via
/api/settings/loader-background-color (admin)
/api/public/loader-background-color (public)
    ↓ consumed by
LoaderBackgroundColorContext (React context)
    ↓ applied to
PublicPageLoader / AdminPageLoader components
```
