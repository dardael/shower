# Quickstart: Custom Loader Configuration

**Feature**: 034-custom-loader  
**Date**: 2025-12-15

## Overview

This guide provides step-by-step implementation for the custom loader feature, allowing administrators to configure a GIF or video to replace the default spinning loader.

## Implementation Order

1. Domain Layer (constants, entity extension)
2. Infrastructure Layer (file storage, API endpoints)
3. Presentation Layer (PublicPageLoader enhancement, admin UI)
4. Unit Tests
5. Export/Import Integration

---

## Step 1: Domain Layer

### 1.1 Add Setting Key

**File**: `src/domain/settings/constants/SettingKeys.ts`

```typescript
export const VALID_SETTING_KEYS = {
  // ... existing keys
  CUSTOM_LOADER: 'custom-loader',
} as const;
```

### 1.2 Add Factory Method

**File**: `src/domain/settings/entities/WebsiteSetting.ts`

```typescript
interface ICustomLoaderMetadata {
  type: 'gif' | 'video';
  filename: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

static createCustomLoader(
  url: string | null,
  metadata: ICustomLoaderMetadata | null
): WebsiteSetting {
  if (!url || !metadata) {
    return new WebsiteSetting(VALID_SETTING_KEYS.CUSTOM_LOADER, null);
  }
  return new WebsiteSetting(VALID_SETTING_KEYS.CUSTOM_LOADER, { url, metadata });
}
```

---

## Step 2: Infrastructure Layer

### 2.1 Extend FileStorageService

**File**: `src/infrastructure/shared/services/FileStorageService.ts`

Add configuration:

```typescript
const CUSTOM_LOADER_CONFIG: UploadConfig = {
  allowedTypes: ['image/gif', 'video/mp4', 'video/webm'],
  maxSizeBytes: 10 * 1024 * 1024, // 10MB
  filenamePrefix: 'loader',
  defaultExtension: 'gif',
  typeErrorMessage:
    'Invalid file type. Only GIF, MP4, and WebM files are allowed.',
  sizeErrorMessage: 'File size must be less than 10MB.',
  entityName: 'custom loader',
};
```

Add methods:

- `uploadCustomLoader(file: File): Promise<UploadResult>`
- `deleteCustomLoader(filename: string): Promise<void>`

### 2.2 Create Loader File Serving Endpoint

**File**: `src/app/api/loaders/[filename]/route.ts`

- Serve files from `public/loaders/` directory
- Set proper Content-Type based on file extension
- Add caching headers: `Cache-Control: public, max-age=31536000, immutable`
- Validate filename to prevent path traversal

### 2.3 Create Admin Settings Endpoint

**File**: `src/app/api/settings/loader/route.ts`

- GET: Return current loader configuration from settings
- PUT: Upload file, save to storage, update setting
- DELETE: Remove file, clear setting

### 2.4 Create Public Loader Endpoint

**File**: `src/app/api/public/loader/route.ts`

- GET: Return simplified loader config `{ type, url }` or `null`

---

## Step 3: Presentation Layer

### 3.1 Enhance PublicPageLoader

**File**: `src/presentation/shared/components/PublicPageLoader.tsx`

Update props interface:

```typescript
interface PublicPageLoaderProps {
  isLoading: boolean;
  error: PageLoadError | null;
  onRetry?: () => void;
  customLoader?: {
    type: 'gif' | 'video';
    url: string;
  } | null;
}
```

Rendering logic:

1. If `customLoader` is configured and `isLoading`:
   - For `type: 'gif'`: Render `<img>` with the GIF URL
   - For `type: 'video'`: Render `<video autoPlay loop muted playsInline>`
2. If no `customLoader` or loader fails to load: Show default `<Spinner>`
3. Maintain ARIA attributes on container

### 3.2 Update usePublicPageData Hook

**File**: `src/presentation/shared/hooks/usePublicPageData.tsx`

- Add fetch for `/api/public/loader` in parallel with other data
- Include loader data in returned state

### 3.3 Add Loader Section to Admin Settings

**File**: `src/presentation/admin/components/WebsiteSettingsForm.tsx`

- Add "Loading Animation" section
- File upload input accepting GIF, MP4, WebM
- Preview (animated for GIF, video player for video)
- Delete button to remove and revert to default

---

## Step 4: Unit Tests

**File**: `test/unit/presentation/shared/components/PublicPageLoader.test.tsx`

```typescript
describe('PublicPageLoader', () => {
  describe('when custom loader is configured', () => {
    it('displays custom GIF loader when type is gif', () => {
      // Render with customLoader: { type: 'gif', url: '/api/loaders/test.gif' }
      // Assert: img element with src exists
      // Assert: no Spinner component
    });

    it('displays custom video loader when type is video', () => {
      // Render with customLoader: { type: 'video', url: '/api/loaders/test.mp4' }
      // Assert: video element with src, autoplay, loop, muted exists
      // Assert: no Spinner component
    });
  });

  describe('when no custom loader is configured', () => {
    it('displays default spinner when customLoader is null', () => {
      // Render with customLoader: null
      // Assert: Spinner component exists
      // Assert: no img or video element
    });

    it('displays default spinner when customLoader is undefined', () => {
      // Render without customLoader prop
      // Assert: Spinner component exists
    });
  });
});
```

---

## Step 5: Export/Import Integration

### 5.1 Update Export Service

Include custom loader file in ZIP export when configured.

### 5.2 Update Import Service

Restore custom loader file from ZIP and update setting.

---

## Verification Checklist

- [ ] Admin can upload GIF loader
- [ ] Admin can upload MP4/WebM video loader
- [ ] Admin sees preview of uploaded loader
- [ ] Admin can delete loader and revert to default
- [ ] Public pages show custom loader when configured
- [ ] Public pages show default spinner when not configured
- [ ] Video plays looped and muted
- [ ] Graceful fallback on load errors
- [ ] Works in light and dark modes
- [ ] ARIA attributes preserved
- [ ] Unit tests pass
- [ ] Export includes custom loader
- [ ] Import restores custom loader
