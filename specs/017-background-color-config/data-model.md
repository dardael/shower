# Data Model: Background Color Configuration

**Feature**: 017-background-color-config  
**Date**: 2025-12-03

## Entities

### BackgroundColor (Value Object)

A value object representing a validated background color selection.

| Field   | Type              | Description              | Constraints                 |
| ------- | ----------------- | ------------------------ | --------------------------- |
| `value` | `ThemeColorToken` | The selected color token | Must be valid palette color |

**Validation Rules**:

- Must be one of: `blue`, `red`, `green`, `purple`, `orange`, `teal`, `pink`, `cyan`
- Invalid values rejected at construction

**Default Value**: `'blue'`

**Factory Methods**:

- `create(color: string)`: Creates with validation
- `createDefault()`: Returns default (`'blue'`)
- `fromString(color: string | null)`: Safe creation with fallback to default

---

### WebsiteSetting (Extended)

Existing entity extended with new setting key.

| Key                  | Value Type                 | Description                           |
| -------------------- | -------------------------- | ------------------------------------- |
| `'background-color'` | `string` (ThemeColorToken) | Background color for public site body |

**New Factory Method**:

```
createBackgroundColor(backgroundColor: BackgroundColor): WebsiteSetting
```

**New Validation Method**:

```
isValidBackgroundColorKey(key: string): boolean
```

---

## Constants

### SettingKeys (Extended)

| Constant           | Value                | Purpose                                   |
| ------------------ | -------------------- | ----------------------------------------- |
| `BACKGROUND_COLOR` | `'background-color'` | Database key for background color setting |

---

## State Transitions

### Background Color Lifecycle

```
┌─────────────────┐     Admin saves     ┌──────────────────┐
│   Not Set       │ ─────────────────▶  │   Configured     │
│  (default: blue)│                     │  (user's choice) │
└─────────────────┘                     └──────────────────┘
        ▲                                        │
        │         Admin changes color            │
        └────────────────────────────────────────┘
```

**States**:

1. **Not Set**: No `background-color` key in database → use default `'blue'`
2. **Configured**: Valid color stored → use stored value

---

## Relationships

```
BackgroundColor ─────uses────▶ ThemeColorPalette (constants)
       │
       ▼
WebsiteSetting ─────persists───▶ MongoDB (website_settings collection)
       │
       ▼
BackgroundColorContext ───────▶ React Components (public site)
```

---

## Database Schema

Uses existing `website_settings` MongoDB collection:

```javascript
{
  _id: ObjectId,
  key: "background-color",    // String (SettingKey)
  value: "blue",              // String (ThemeColorToken)
  createdAt: ISODate,
  updatedAt: ISODate
}
```

No schema migration required - uses existing flexible key-value structure.

---

## Type Definitions

```typescript
// Reuses existing type from ThemeColorPalette
type ThemeColorToken =
  | 'blue'
  | 'red'
  | 'green'
  | 'purple'
  | 'orange'
  | 'teal'
  | 'pink'
  | 'cyan';

// New value object interface
interface IBackgroundColor {
  value: ThemeColorToken;
  equals(other: BackgroundColor): boolean;
  toString(): string;
}

// API types extension
interface GetSettingsResponse {
  name: string;
  themeColor?: ThemeColorToken;
  backgroundColor?: ThemeColorToken; // NEW
}

interface UpdateSettingsRequest {
  name?: string;
  themeColor?: string;
  backgroundColor?: string; // NEW
}
```

---

## Client-Side State

### BackgroundColorStorage

Mirrors `ThemeColorStorage` pattern:

| Method                      | Purpose                               |
| --------------------------- | ------------------------------------- |
| `getBackgroundColor()`      | Get from localStorage                 |
| `setBackgroundColor(color)` | Save to localStorage + dispatch event |
| `syncWithServer()`          | Fetch from API, update localStorage   |
| `listenToUpdate(callback)`  | Subscribe to color changes            |

**Storage Key**: `'shower-background-color'`

**Event Name**: `'background-color-updated'`
