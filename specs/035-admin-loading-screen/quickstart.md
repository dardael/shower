# Quickstart: Admin Loading Screen

**Feature**: 035-admin-loading-screen  
**Date**: 2025-12-15

## Overview

This feature adds a full-screen loading screen to the admin panel that displays while essential settings are being fetched. It reuses the existing `PublicPageLoader` component and aggregates loading states from existing context providers.

## Implementation Summary

### New Files Created

1. **`src/presentation/admin/hooks/useAdminLoadState.ts`**
   - Hook that aggregates loading states from existing contexts
   - Fetches custom loader configuration from `/api/public/loader`
   - Provides `isLoading`, `isError`, `error`, `customLoader`, and `retry`

2. **`src/presentation/admin/components/AdminLoadingScreen.tsx`**
   - Wrapper component that shows loading screen or children
   - Uses `useAdminLoadState` hook
   - Renders `PublicPageLoader` with aggregated state

3. **`src/presentation/admin/components/AdminProvider.tsx`**
   - Admin-specific provider that wraps content with AdminLoadingScreen

### Existing Files Modified

1. **`src/app/admin/layout.tsx`**
   - Wrapped admin content with `AdminProvider` component
   - Placed inside Provider to access context states

## Key Patterns to Follow

### 1. Reuse PublicPageLoader

```typescript
import { PublicPageLoader } from '@/presentation/shared/components/PublicPageLoader';

// Use directly with aggregated state
<PublicPageLoader
  isLoading={isLoading}
  error={error}
  onRetry={retry}
  customLoader={customLoader}
/>
```

### 2. Aggregate Loading States with Cached Custom Loader

```typescript
// From existing contexts
const { isLoading: themeColorLoading } = useThemeColorContext();
const { isLoading: bgColorLoading } = useBackgroundColorContext();
const { isLoading: themeModeLoading } = useThemeModeContext();

// Custom loader is fetched once and cached for all loading states
const [customLoader, setCustomLoader] = useState<CustomLoaderData | null>(null);
const [loaderFetched, setLoaderFetched] = useState(false);
const [minTimeElapsed, setMinTimeElapsed] = useState(false);

// Minimum display time (500ms) ensures custom loader is visible
// even when settings load instantly from localStorage cache
useEffect(() => {
  const timer = setTimeout(() => setMinTimeElapsed(true), 500);
  return () => clearTimeout(timer);
}, []);

// Show loading screen until:
// 1. Custom loader is fetched
// 2. AND minimum display time has elapsed
// 3. AND settings are done loading
const isLoading = !loaderFetched || !minTimeElapsed || settingsLoading;
```

### 3. Fetch Custom Loader

```typescript
// Fetch from existing public endpoint
const response = await fetch('/api/public/loader');
const data = await response.json();
const customLoader = data.loader; // { type, url } or null
```

### 4. Timeout Handling

```typescript
// 10 second timeout consistent with public side
const TIMEOUT_MS = 10000;

useEffect(() => {
  const timeout = setTimeout(() => {
    if (isLoading) {
      setError({ message: 'Loading timed out. Please try again.' });
    }
  }, TIMEOUT_MS);

  return () => clearTimeout(timeout);
}, [isLoading]);
```

## Testing Approach

### Unit Tests (when requested)

- `useAdminLoadState.test.ts` - Test hook aggregation logic
- `AdminLoadingScreen.test.tsx` - Test component rendering states

### Integration Tests (when requested)

- Test loading screen appears on admin navigation
- Test custom loader display
- Test error state with retry

## Dependencies

No new dependencies. Uses:

- React hooks and context (built-in)
- Chakra UI (existing)
- Existing settings contexts and hooks

## Success Verification

1. Navigate to admin panel → loading screen appears
2. Settings load → loading screen disappears, admin UI shows
3. Custom loader configured → custom animation displays
4. No custom loader → default spinner displays
5. Network error → error message with retry button
6. Navigate between admin pages → no loading screen if settings cached
