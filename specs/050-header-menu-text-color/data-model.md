# Data Model: Header Menu Text Color Configuration

**Feature**: 050-header-menu-text-color  
**Date**: 2025-12-26

## Entities

### WebsiteSetting (Extended)

The existing `WebsiteSetting` entity is extended with a new setting key.

| Field | Type   | Description                                        |
| ----- | ------ | -------------------------------------------------- |
| key   | string | Setting identifier (new: `header-menu-text-color`) |
| value | string | Setting value (hex color: `#000000` to `#ffffff`)  |

### HeaderMenuTextColor (Value Object)

New value object for type-safe text color handling.

| Field | Type   | Constraints                   | Description         |
| ----- | ------ | ----------------------------- | ------------------- |
| value | string | Hex format: `#[0-9a-fA-F]{6}` | CSS hex color value |

**Validation Rules**:

- Must be valid 6-digit hex color (e.g., `#000000`, `#ffffff`)
- Case-insensitive (normalized to lowercase)
- Default value: `#000000` (black)

## Setting Keys

Add to `SettingKeys.ts`:

```typescript
export const SETTING_KEYS = {
  // ... existing keys
  HEADER_MENU_TEXT_COLOR: 'header-menu-text-color',
} as const;
```

## State Transitions

```
[No Color Set] --configure--> [Color Configured]
[Color Configured] --update--> [Color Configured]
[Color Configured] --reset--> [Default Color]
```

## Relationships

```
WebsiteSetting (key: header-menu-text-color)
        |
        v
HeaderMenuTextColor (value object)
        |
        v
PublicHeaderMenu (consumes via context)
```

## Storage

- **Location**: MongoDB `website_settings` collection
- **Document Structure**:
  ```json
  {
    "_id": "ObjectId",
    "key": "header-menu-text-color",
    "value": "#000000"
  }
  ```

## Default Values

| Setting                | Default   | Rationale                          |
| ---------------------- | --------- | ---------------------------------- |
| header-menu-text-color | `#000000` | Black text for maximum readability |
