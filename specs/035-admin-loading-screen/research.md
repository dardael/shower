# Research: Admin Loading Screen

**Feature**: 035-admin-loading-screen  
**Date**: 2025-12-15

## Research Questions Resolved

### 1. How to Reuse PublicPageLoader for Admin?

**Decision**: Directly reuse `PublicPageLoader` component without modification

**Rationale**: The `PublicPageLoader` component (`/src/presentation/shared/components/PublicPageLoader.tsx`) is already a shared component with the exact interface needed:

- `isLoading: boolean` - controls visibility
- `error: PageLoadError | null` - handles error states
- `onRetry?: () => void` - retry functionality
- `customLoader?: CustomLoaderData | null` - custom loader support

**Alternatives Considered**:

1. Create new AdminLoader component - Rejected (violates DRY)
2. Abstract to a generic Loader component - Rejected (unnecessary complexity, violates KISS)

### 2. How to Orchestrate Admin Settings Loading?

**Decision**: Create a new `useAdminLoadState` hook that aggregates loading states from existing context providers

**Rationale**:

- Existing providers already handle individual setting loading (ThemeColorContext, BackgroundColorContext, ThemeModeContext, FontProvider)
- Each provider exposes an `isLoading` state
- New hook simply aggregates these states and fetches custom loader config
- Custom loader is cached after first fetch and available for all subsequent loading states

**Implementation Pattern**:

```typescript
// Aggregate loading states from existing contexts
const { isLoading: themeColorLoading } = useThemeColorContext();
const { isLoading: backgroundColorLoading } = useBackgroundColorContext();
const { isLoading: themeModeLoading } = useThemeModeContext();
const { isLoading: fontLoading } = useFontContext();

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

**Alternatives Considered**:

1. Centralized settings fetch in single hook - Rejected (would duplicate existing fetch logic, violates DRY)
2. Modify existing contexts to report to central state - Rejected (unnecessary complexity)

### 3. Where to Place the Loading Screen in Admin Layout?

**Decision**: Create `AdminLoadingScreen` wrapper component that conditionally renders loader or children

**Rationale**:

- Admin layout (`/src/app/admin/layout.tsx`) already wraps all admin pages with Provider
- New component wraps content inside Provider to access context states
- Follows same pattern as public side

**Implementation Location**: Inside the Provider wrapper in admin pages, not in layout.tsx (to access context)

**Alternatives Considered**:

1. Modify admin layout.tsx directly - Rejected (layout is async server component, loading is client-side)
2. Add to each admin page individually - Rejected (violates DRY)

### 4. How to Handle Custom Loader Fetch for Admin?

**Decision**: Reuse existing `/api/public/loader` endpoint (or create admin equivalent if auth required)

**Rationale**:

- Custom loader is public data (displayed on public pages)
- Same loader should be used in admin
- No need for separate admin endpoint

**Implementation**: Fetch from `/api/public/loader` in `useAdminLoadState` hook

### 5. How to Prevent Loading Screen on Subsequent Navigations?

**Decision**: Check if settings are already loaded via context `isLoading` states

**Rationale**:

- Existing contexts use localStorage caching with immediate reads
- On subsequent navigations, `isLoading` will be false from the start
- No additional caching mechanism needed

**Implementation**:

- `isLoading` from contexts is false when data already cached
- Loading screen only shows when any context is still loading

### 6. Error Handling Strategy

**Decision**: Aggregate errors from contexts and show error state with retry

**Rationale**:

- Existing contexts handle individual errors
- Aggregate any error into single error display
- Retry triggers refresh on all contexts

**Timeout**: 10 seconds (consistent with public side)

## Key Technical Findings

### Existing Components to Reuse

| Component              | Location                                                       | Purpose                                       |
| ---------------------- | -------------------------------------------------------------- | --------------------------------------------- |
| PublicPageLoader       | `/src/presentation/shared/components/PublicPageLoader.tsx`     | Full-screen loader with custom loader support |
| ThemeColorContext      | `/src/presentation/shared/contexts/ThemeColorContext.tsx`      | Theme color loading state                     |
| BackgroundColorContext | `/src/presentation/shared/contexts/BackgroundColorContext.tsx` | Background color loading state                |
| ThemeModeContext       | `/src/presentation/shared/contexts/ThemeModeContext.tsx`       | Theme mode loading state                      |
| FontProvider           | `/src/presentation/shared/components/FontProvider.tsx`         | Font family loading                           |

### API Endpoints Used

| Endpoint                   | Method | Purpose                                                        |
| -------------------------- | ------ | -------------------------------------------------------------- |
| `/api/public/loader`       | GET    | Fetch custom loader configuration                              |
| `/api/settings`            | GET    | Fetch theme color, background color (already used by contexts) |
| `/api/settings/theme-mode` | GET    | Fetch theme mode (already used by context)                     |

### Caching Strategy (Existing)

- **localStorage**: Immediate read on mount for instant UI
- **Server sync**: Background fetch for latest data
- **Cross-tab sync**: CustomEvent API for theme color/background, BroadcastChannel for theme mode

## Dependencies

No new dependencies required. All implementation uses existing:

- React hooks and context
- Chakra UI components (already in project)
- Existing settings infrastructure
