# API Contracts: Admin Loading Screen

**Feature**: 035-admin-loading-screen  
**Date**: 2025-12-15

## Overview

This feature does **not** introduce any new API endpoints. It reuses existing endpoints that are already implemented in the codebase.

## Existing Endpoints Used

### GET /api/public/loader

Fetches custom loader configuration. Already implemented for public side.

**Request**: No parameters required

**Response (200 OK)**:

```json
{
  "loader": {
    "type": "gif" | "video",
    "url": "/api/loaders/filename.ext"
  }
}
```

**Response (200 OK - No loader configured)**:

```json
{
  "loader": null
}
```

**Error Response (500)**:

```json
{
  "error": "Failed to fetch loader configuration"
}
```

### GET /api/settings

Fetches theme color and background color. Already used by existing context providers.

**Request**: No parameters required (optional `?t=timestamp` for cache busting)

**Response (200 OK)**:

```json
{
  "themeColor": "#3182CE",
  "backgroundColor": "#FFFFFF",
  "name": "My Website"
}
```

### GET /api/settings/theme-mode

Fetches theme mode configuration. Already used by ThemeModeContext.

**Request**: No parameters required

**Response (200 OK)**:

```json
{
  "themeMode": "light" | "dark" | "auto"
}
```

## Component Contracts

### useAdminLoadState Hook

**Input**: None

**Output**:

```typescript
interface UseAdminLoadStateReturn {
  isLoading: boolean; // True while any setting is loading
  isError: boolean; // True if any setting failed to load
  error: PageLoadError | null; // Error details
  customLoader: CustomLoaderData | null; // Custom loader config
  retry: () => void; // Retry function
}
```

### AdminLoadingScreen Component

**Props**:

```typescript
interface AdminLoadingScreenProps {
  children: React.ReactNode; // Admin content to show after loading
}
```

**Behavior**:

- Shows `PublicPageLoader` when `isLoading` is true
- Shows error state with retry when `isError` is true
- Renders `children` when loading complete and no error

## Notes

- No new API routes are created
- All data fetching uses existing infrastructure
- Component contracts define the interface for new React components
