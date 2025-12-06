# Data Model: Public Loading Page

**Feature**: 025-public-loading-page  
**Date**: 2025-12-06  
**Status**: Complete

## Overview

This feature introduces loading state management for public pages. The data model focuses on tracking the loading state of three concurrent data sources and managing transitions between loading, loaded, and error states.

## Entities

### PageLoadState

Represents the overall loading state for a public page, coordinating multiple data sources.

**Purpose**: Track whether all required data (menu, footer, page content) has been successfully loaded.

**Attributes**:

- `isLoading: boolean` - True when any data source is still loading
- `isComplete: boolean` - True only when all three data sources have loaded successfully
- `error: PageLoadError | null` - Error information if any data source failed
- `menuLoaded: boolean` - True when menu data has loaded
- `footerLoaded: boolean` - True when footer/settings data has loaded
- `contentLoaded: boolean` - True when page content has loaded
- `startTime: number` - Timestamp when loading began (for timeout detection)

**Validation Rules**:

- `isComplete` can only be true when `menuLoaded`, `footerLoaded`, and `contentLoaded` are all true
- `isLoading` is true when any of the three data sources are still loading
- `error` is set when any data source fails to load

**State Transitions**:

1. Initial state: `isLoading=true, isComplete=false, all *Loaded=false`
2. Data source completes: Update corresponding `*Loaded` flag
3. All sources complete: `isLoading=false, isComplete=true`
4. Any source fails: `isLoading=false, error=<details>`
5. Retry action: Reset to initial state

---

### PageLoadError

Represents an error that occurred during data loading.

**Purpose**: Provide context about which data source(s) failed and enable retry functionality.

**Attributes**:

- `message: string` - User-friendly error message
- `failedSources: Array<'menu' | 'footer' | 'content'>` - Which data sources failed
- `isTimeout: boolean` - True if error is due to timeout (>10 seconds)
- `timestamp: number` - When the error occurred

**Validation Rules**:

- `failedSources` must contain at least one value
- `message` must be non-empty and user-friendly
- `isTimeout` is true only when loading exceeds 10 seconds

---

### PublicPageData

Represents the complete data required to render a public page.

**Purpose**: Container for all successfully loaded data sources.

**Attributes**:

- `menuData: MenuItem[]` - Navigation menu structure
- `footerData: WebsiteSettings` - Footer configuration and website settings
- `pageContent: PageContent` - The actual page content to display

**Relationships**:

- Uses existing domain entities: `MenuItem` (from menu domain), `WebsiteSettings` (from settings domain), `PageContent` (from pages domain)
- No new domain entities required - this is a presentation layer aggregation

**Validation Rules**:

- All three fields must be present and non-null for page to be considered fully loaded
- Individual fields validated by their respective domain layers

---

## Type Definitions

The following TypeScript interfaces will be defined in `src/types/page-load-state.ts`:

```typescript
// Loading state tracking
interface PageLoadState {
  isLoading: boolean;
  isComplete: boolean;
  error: PageLoadError | null;
  menuLoaded: boolean;
  footerLoaded: boolean;
  contentLoaded: boolean;
  startTime: number;
}

// Error information
interface PageLoadError {
  message: string;
  failedSources: Array<'menu' | 'footer' | 'content'>;
  isTimeout: boolean;
  timestamp: number;
}

// Complete page data (aggregation of existing domain entities)
interface PublicPageData {
  menuData: MenuItem[]; // From menu domain
  footerData: WebsiteSettings; // From settings domain
  pageContent: PageContent; // From pages domain
}

// Hook return type
interface UsePublicPageDataReturn {
  state: PageLoadState;
  data: PublicPageData | null;
  retry: () => void;
}
```

---

## State Management Flow

### Initial Load Sequence

1. User navigates to public page URL
2. Component mounts, initializes `PageLoadState` with `isLoading=true`
3. Three parallel data fetches begin (menu, footer, content)
4. As each fetch completes, update corresponding `*Loaded` flag
5. When all three flags are true, set `isComplete=true`, `isLoading=false`
6. Render complete page content

### Error Handling Flow

1. If any fetch fails, catch error
2. Create `PageLoadError` with failed sources
3. Set `state.error`, `isLoading=false`
4. Display error UI with retry button
5. On retry: Reset state to initial, restart all fetches

### Timeout Flow

1. Track `startTime` when loading begins
2. If loading exceeds 10 seconds without completion:
   - Create `PageLoadError` with `isTimeout=true`
   - Display timeout message
   - Provide retry option

---

## Architecture Alignment

### Layer Responsibilities

- **Domain Layer**: No changes required (existing entities used)
- **Application Layer**: No changes required (existing use cases used)
- **Infrastructure Layer**: No changes required (existing repositories used)
- **Presentation Layer**:
  - New custom hook `usePublicPageData` manages loading state
  - New component `PublicPageLoader` displays loading indicator
  - Modified `app/[slug]/page.tsx` integrates loading logic

### Dependency Direction

```
Presentation (PublicPageLoader, usePublicPageData)
    ↓ uses
Application (existing menu/settings/pages use cases)
    ↓ uses
Domain (MenuItem, WebsiteSettings, PageContent entities)
    ↓ uses
Infrastructure (existing repositories)
```

All dependencies flow inward, maintaining clean architecture compliance.

---

## Testing Considerations

### Unit Tests (not required for this feature)

N/A - Integration tests explicitly requested instead.

### Integration Tests (required)

**File**: `test/integration/public-page-loading.integration.test.tsx`

**Test Cases**:

1. Loading indicator appears immediately on mount
2. Loading indicator persists until all three data sources complete
3. No partial content visible during loading
4. Complete page displays only after all data loaded
5. Error handling with retry for failed fetches
6. Timeout handling after 10 seconds
7. Theme support (light/dark mode contrast)

**Mocking Strategy**:

- Mock data fetching functions with controllable promises
- Use real component rendering (not shallow rendering)
- Verify visual state changes using React Testing Library queries

---

## Summary

This data model introduces minimal new types focused on loading state coordination. It leverages existing domain entities and maintains clean architecture separation. The model supports all functional requirements while adhering to YAGNI (no unnecessary fields), DRY (reuses existing entities), and KISS (simple state structure) principles.
