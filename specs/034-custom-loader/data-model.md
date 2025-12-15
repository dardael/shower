# Data Model: Custom Loader Configuration

**Feature**: 034-custom-loader  
**Date**: 2025-12-15

## Entities

### CustomLoaderMetadata (Value Object)

Metadata stored alongside the custom loader URL in the WebsiteSetting value.

| Field      | Type                | Required | Description                                  |
| ---------- | ------------------- | -------- | -------------------------------------------- |
| type       | `'gif' \| 'video'`  | Yes      | Discriminator for rendering logic            |
| filename   | `string`            | Yes      | Original filename for display in admin UI    |
| mimeType   | `string`            | Yes      | MIME type (image/gif, video/mp4, video/webm) |
| size       | `number`            | Yes      | File size in bytes                           |
| uploadedAt | `string` (ISO 8601) | Yes      | Timestamp of upload                          |

### WebsiteSetting (Extended)

Uses existing entity with new setting key.

| Setting Key     | Value Type                                                | Description                 |
| --------------- | --------------------------------------------------------- | --------------------------- |
| `custom-loader` | `{ url: string; metadata: CustomLoaderMetadata } \| null` | Custom loader configuration |

**Validation Rules**:

- `url` must be a valid relative path starting with `/api/loaders/`
- `metadata.type` must be `'gif'` or `'video'`
- `metadata.mimeType` must be one of: `image/gif`, `video/mp4`, `video/webm`
- `metadata.size` must be <= 10MB (10,485,760 bytes)

## State Transitions

```
[No Loader] --upload--> [Loader Configured]
[Loader Configured] --delete--> [No Loader]
[Loader Configured] --upload--> [Loader Configured] (replace)
```

## File Storage

| Directory         | Pattern                             | Example                           |
| ----------------- | ----------------------------------- | --------------------------------- |
| `public/loaders/` | `loader-{timestamp}-{random}.{ext}` | `loader-1734567890123-a1b2c3.mp4` |

## Relationships

```
WebsiteSetting (CUSTOM_LOADER)
    └── references --> File in public/loaders/
```

## Constants

```typescript
// Add to src/domain/settings/constants/SettingKeys.ts
CUSTOM_LOADER: 'custom-loader';

// File validation constants
CUSTOM_LOADER_MAX_SIZE = 10 * 1024 * 1024; // 10MB
CUSTOM_LOADER_ALLOWED_TYPES = ['image/gif', 'video/mp4', 'video/webm'];
```
