# API Contracts: Theme Mode Configuration

**Feature Branch**: `027-theme-mode-config`  
**Created**: 2025-12-13

## Settings API (Updated)

### GET /api/settings

**Description**: Retrieve website settings including theme mode configuration.

**Authentication**: Not required for public access

**Response**:

```typescript
// 200 OK
{
  "name": string,
  "themeColor": string,
  "backgroundColor": string,
  "themeMode": "force-light" | "force-dark" | "user-choice"
}
```

**Default Behavior**: If `themeMode` is not set in database, returns `"user-choice"`.

---

### POST /api/settings

**Description**: Update website settings including theme mode configuration.

**Authentication**: Required (admin only)

**Request Body**:

```typescript
{
  "name"?: string,
  "themeColor"?: string,
  "backgroundColor"?: string,
  "themeMode"?: "force-light" | "force-dark" | "user-choice"
}
```

**Validation**:

- `themeMode` must be one of: `"force-light"`, `"force-dark"`, `"user-choice"`
- Invalid values return 400 Bad Request

**Response**:

```typescript
// 200 OK
{
  "success": true
}

// 400 Bad Request
{
  "error": "Invalid theme mode value"
}

// 401 Unauthorized
{
  "error": "Authentication required"
}
```

---

## Type Definitions

### ThemeModeValue

```typescript
type ThemeModeValue = 'force-light' | 'force-dark' | 'user-choice';
```

### ThemeModeConfig Interface

```typescript
interface IThemeModeConfig {
  value: ThemeModeValue;
  isForced(): boolean;
  getForcedMode(): 'light' | 'dark' | null;
  shouldShowToggle(): boolean;
}
```

---

## Client-Side Hooks

### useThemeModeConfig

**Location**: `src/presentation/shared/hooks/useThemeModeConfig.ts`

**Returns**:

```typescript
{
  themeMode: ThemeModeValue;
  isForced: boolean;
  forcedMode: 'light' | 'dark' | null;
  shouldShowToggle: boolean;
  isLoading: boolean;
  error: Error | null;
}
```

**Behavior**:

- Fetches theme mode from `/api/settings`
- Caches result to prevent unnecessary refetches
- Returns `"user-choice"` as default during loading/error
- Used by both admin and public components

---

## Error Codes

| Code | Meaning                       |
| ---- | ----------------------------- |
| 200  | Success                       |
| 400  | Invalid theme mode value      |
| 401  | Not authenticated (POST only) |
| 500  | Server error                  |
