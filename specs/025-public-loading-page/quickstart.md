# Quickstart: Public Loading Page

**Feature**: 025-public-loading-page  
**Date**: 2025-12-06

## Overview

This feature adds a loading indicator to public pages that displays while all required data (menu, footer, page content) is being fetched. The page only displays complete content after all data sources have loaded successfully.

## What's Changing

### New Components

1. **PublicPageLoader** (`src/presentation/shared/components/PublicPageLoader.tsx`)
   - Displays loading spinner while data is fetching
   - Shows error message with retry button on failure
   - Respects theme colors (light/dark mode)
   - Uses Chakra UI Spinner component

2. **usePublicPageData Hook** (`src/presentation/shared/hooks/usePublicPageData.tsx`)
   - Custom hook that manages loading state
   - Coordinates parallel fetching of menu, footer, and page content
   - Handles errors and retry logic
   - Tracks timeout (10 seconds)

### Modified Files

1. **`src/app/[slug]/page.tsx`**
   - Integrate `usePublicPageData` hook for loading coordination
   - Render `PublicPageLoader` during loading state
   - Display complete page only when all data is loaded

### New Types

1. **`src/types/page-load-state.ts`**
   - `PageLoadState`: Loading state tracking
   - `PageLoadError`: Error information
   - `PublicPageData`: Aggregated data container
   - `UsePublicPageDataReturn`: Hook return type

### Integration Tests

1. **`test/integration/public-page-loading.integration.test.tsx`**
   - Tests loading indicator appears immediately
   - Tests loading persists until all data loads
   - Tests no partial content is visible during loading
   - Tests error handling with retry
   - Tests timeout handling
   - Tests theme support (light/dark mode)

## User Experience Flow

### Happy Path (Successful Load)

1. User navigates to `/about` (or any public page)
2. **Immediately**: Loading spinner appears centered on page
3. **Behind the scenes**: Three parallel API calls begin:
   - Fetch menu items
   - Fetch website settings (footer)
   - Fetch page content for "about"
4. **When all complete**: Smooth transition to full page with:
   - Header with menu
   - Page content
   - Footer

### Error Path (Failed Load)

1. User navigates to public page
2. Loading spinner appears
3. One or more API calls fail
4. Loading spinner replaced with error message:
   - "Unable to load page content. Please check your connection and try again."
   - "Retry" button visible
5. User clicks "Retry"
6. Loading spinner reappears, fetching restarts
7. Either succeeds (show page) or fails again (show error)

### Timeout Path (Slow Network)

1. User navigates to public page
2. Loading spinner appears
3. After 10 seconds with no completion:
   - Timeout error message displays:
   - "This page is taking longer than expected to load. Please try again."
   - "Retry" button visible

## Key Requirements Met

✅ **FR-001**: Loading indicator displays immediately  
✅ **FR-002**: Loading persists until all three data sources complete  
✅ **FR-003**: No partial content visible during loading  
✅ **FR-004**: Parallel data fetching for optimal performance  
✅ **FR-005**: Smooth transition without layout shifts  
✅ **FR-006**: Error handling for failed data sources  
✅ **FR-007**: Retry mechanism provided  
✅ **FR-008**: Timeout message after 10 seconds  
✅ **FR-010**: Theme-aware loading indicator (light/dark mode)

## Testing Focus

Integration tests verify:

- Loading indicator appears on mount
- Loading persists until all data is fetched
- No partial content leaks through
- Complete page renders only when ready
- Error states display correctly with retry
- Theme colors work in light/dark mode

## Architecture Compliance

- ✅ **Presentation Layer**: Loading components and state management
- ✅ **Application Layer**: Reuses existing use cases (no changes)
- ✅ **Domain Layer**: Reuses existing entities (no changes)
- ✅ **Infrastructure Layer**: Reuses existing repositories (no changes)

Dependencies flow inward: Presentation → Application → Domain → Infrastructure

## Development Checklist

- [ ] Create `PageLoadState` types in `src/types/page-load-state.ts`
- [ ] Create `PublicPageLoader` component with Spinner
- [ ] Create `usePublicPageData` hook with parallel fetching
- [ ] Modify `src/app/[slug]/page.tsx` to use loading logic
- [ ] Write integration tests for loading behavior
- [ ] Test in light and dark modes
- [ ] Verify no layout shifts during transition
- [ ] Test error and retry functionality
- [ ] Test timeout behavior (simulate slow network)
- [ ] Run full test suite
- [ ] Build and deploy

## Constitution Alignment

✅ **Principle I**: Architecture-First Development - Uses existing architecture  
✅ **Principle II**: Focused Testing - Integration tests explicitly requested  
✅ **Principle III**: Simplicity-First - No performance monitoring  
✅ **Principle VI**: Accessibility-First - Theme-aware with proper contrast  
✅ **Principle VII**: YAGNI - Minimal implementation (no progress bars, complex animations)  
✅ **Principle VIII**: DRY - Reuses Chakra UI Spinner  
✅ **Principle IX**: KISS - Simple loading state management with React hooks

## Next Steps

After this feature is complete:

1. Run integration tests to verify behavior: `docker compose run --rm app npm test public-page-loading`
2. Manual testing in browser (light/dark mode)
3. Verify on slow network connection (Chrome DevTools throttling)
4. Code review focusing on constitution compliance
5. Merge to main branch

---

**Ready for implementation** - All design decisions documented, tests specified, architecture validated.
