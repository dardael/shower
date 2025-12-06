# API Contracts: Public Loading Page

**Feature**: 025-public-loading-page  
**Date**: 2025-12-06  
**Status**: Complete

## Overview

This feature does not introduce new API endpoints. It coordinates existing data fetching from:

1. Menu items API (existing)
2. Website settings/footer API (existing)
3. Page content API (existing)

## Existing API Usage

### 1. Get Menu Items

**Purpose**: Fetch all menu items for the header navigation

**Application Layer**: `IGetMenuItems` / `GetMenuItems`  
**Method**: `execute(): Promise<MenuItem[]>`

**Response Structure**:

```typescript
interface MenuItem {
  id: string;
  text: string;
  url: string;
  order: number;
}
```

**Usage in Feature**:

- Called once on page load
- Result cached for the duration of the page session
- Failure triggers error state with retry option

---

### 2. Get Website Settings (Footer Data)

**Purpose**: Fetch website configuration including footer settings, theme colors, fonts, etc.

**Application Layer**: Multiple getters for different settings:

- `IGetWebsiteName` / `GetWebsiteName`
- `IGetWebsiteIcon` / `GetWebsiteIcon`
- `IGetBackgroundColor` / `GetBackgroundColor`
- Social network settings
- Font configuration

**Method**: Various `execute()` methods returning specific settings

**Response Structure**:

```typescript
interface WebsiteSettings {
  name: string;
  icon?: string;
  backgroundColor?: string;
  themeColor?: string;
  font?: string;
  socialNetworks?: SocialNetwork[];
}
```

**Usage in Feature**:

- Multiple parallel calls to fetch different settings
- Results aggregated into single `WebsiteSettings` object
- Failure of any setting triggers error state with retry option

---

### 3. Get Page Content

**Purpose**: Fetch the content for a specific page based on menu item ID

**Application Layer**: `IGetPageContent` / `GetPageContent`  
**Method**: `execute(menuItemId: string): Promise<PageContent>`

**Response Structure**:

```typescript
interface PageContent {
  id: string;
  menuItemId: string;
  content: string; // HTML/Markdown content
}
```

**Usage in Feature**:

- Called with menu item ID after menu items are fetched
- Result displayed in the main content area
- Failure triggers error state with retry option

---

## Data Fetching Coordination

### Parallel Fetching Strategy

```typescript
// Pseudo-code for coordination logic
async function fetchAllData(slug: string) {
  // Start all fetches in parallel
  const [menuResult, settingsResult, contentResult] = await Promise.allSettled([
    fetchMenuItems(),
    fetchWebsiteSettings(),
    fetchPageContent(slug),
  ]);

  // Check for failures
  const failures = [];
  if (menuResult.status === 'rejected') failures.push('menu');
  if (settingsResult.status === 'rejected') failures.push('footer');
  if (contentResult.status === 'rejected') failures.push('content');

  // If any failed, throw error with details
  if (failures.length > 0) {
    throw new PageLoadError(failures);
  }

  // Return combined data
  return {
    menuData: menuResult.value,
    footerData: settingsResult.value,
    pageContent: contentResult.value,
  };
}
```

### Error Handling Contract

**Error Types**:

1. **Network Error**: Connection failure, timeout
2. **Not Found Error**: Requested resource doesn't exist (404)
3. **Server Error**: Backend failure (5xx)
4. **Timeout Error**: Fetch exceeds 10 seconds

**Error Response**:

```typescript
interface PageLoadError {
  message: string;
  failedSources: Array<'menu' | 'footer' | 'content'>;
  isTimeout: boolean;
  timestamp: number;
}
```

**Error Messages**:

- Network failure: "Unable to load page content. Please check your connection and try again."
- Timeout: "This page is taking longer than expected to load. Please try again."
- Server error: "Something went wrong while loading the page. Please try again later."

---

## Retry Contract

**Retry Behavior**:

- User clicks "Retry" button
- All three data sources are fetched again from scratch
- Loading indicator reappears
- If successful, complete page is displayed
- If failed again, error message is shown again

**Implementation**:

```typescript
function handleRetry() {
  // Reset all state
  resetLoadingState();

  // Restart all fetches
  fetchAllData(slug);
}
```

---

## Timeout Contract

**Timeout Configuration**:

- **Threshold**: 10 seconds
- **Behavior**: Display timeout error message
- **User Action**: Provide retry option

**Implementation**:

```typescript
const TIMEOUT_MS = 10000;

async function fetchWithTimeout<T>(promise: Promise<T>): Promise<T> {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), TIMEOUT_MS);
  });

  return Promise.race([promise, timeout]);
}
```

---

## No New API Routes Required

This feature is purely client-side coordination of existing API calls. No new routes need to be created:

- ✅ Existing menu API remains unchanged
- ✅ Existing settings API remains unchanged
- ✅ Existing pages API remains unchanged

All coordination logic resides in the presentation layer (`usePublicPageData` hook).

---

## Summary

This contract document describes how existing APIs are coordinated for the public loading page feature. The focus is on parallel data fetching, error handling, and retry mechanisms - all implemented in the presentation layer without requiring backend changes.
