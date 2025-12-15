# Data Model: Admin Loading Screen

**Feature**: 035-admin-loading-screen  
**Date**: 2025-12-15

## Entities

### AdminLoadState (New - Client-Side Only)

Represents the aggregated loading state of all essential admin settings.

| Field        | Type                     | Required | Description                                       |
| ------------ | ------------------------ | -------- | ------------------------------------------------- |
| isLoading    | boolean                  | Yes      | True while any essential setting is still loading |
| isError      | boolean                  | Yes      | True if any essential setting failed to load      |
| error        | PageLoadError \| null    | Yes      | Error details if loading failed                   |
| customLoader | CustomLoaderData \| null | Yes      | Custom loader configuration if available          |

**Validation Rules**:

- `isLoading` must be true on initial mount until all settings loaded
- `isError` must be true if loading times out (10 seconds)
- `customLoader` can be null if no custom loader is configured

**State Transitions**:

```
INITIAL → LOADING → LOADED (success)
                  → ERROR (failure/timeout)
ERROR → LOADING (retry)
```

### CustomLoaderData (Existing - Reused)

Already defined in `/src/presentation/shared/components/PublicPageLoader.tsx`.

| Field | Type             | Required | Description                     |
| ----- | ---------------- | -------- | ------------------------------- |
| type  | 'gif' \| 'video' | Yes      | Type of custom loader animation |
| url   | string           | Yes      | URL to the loader asset         |

### PageLoadError (Existing - Reused)

Already defined for public loading error handling.

| Field   | Type   | Required | Description                 |
| ------- | ------ | -------- | --------------------------- |
| message | string | Yes      | User-friendly error message |
| code    | string | No       | Error code for debugging    |

## Relationships

```
AdminLoadState
    ├── aggregates → ThemeColorContext.isLoading
    ├── aggregates → BackgroundColorContext.isLoading
    ├── aggregates → ThemeModeContext.isLoading
    ├── aggregates → FontProvider.isLoading
    ├── contains → CustomLoaderData (fetched independently)
    └── contains → PageLoadError (on failure)
```

## Notes

- No database entities are created for this feature
- All state is client-side React state
- Reuses existing context providers for settings loading states
- CustomLoaderData is fetched from existing `/api/public/loader` endpoint
