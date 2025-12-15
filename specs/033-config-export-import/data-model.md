# Data Model: Configuration Export/Import

**Feature**: 033-config-export-import | **Date**: 2025-12-14

## Overview

This feature introduces a new `config` domain for export/import operations. It does not modify existing entities but defines new structures for package handling and reuses existing domain entities for data collection.

---

## New Entities

### ExportPackage

Represents the metadata and structure of an export package.

```typescript
interface ExportPackage {
  // Metadata
  schemaVersion: string; // Semantic version for compatibility (e.g., "1.0")
  exportDate: Date; // When the export was created
  sourceIdentifier: string; // Optional identifier for source environment

  // Content summary (for preview)
  summary: PackageSummary;
}

interface PackageSummary {
  menuItemCount: number;
  pageContentCount: number;
  settingsCount: number;
  socialNetworkCount: number;
  imageCount: number;
  totalSizeBytes: number;
}
```

**Validation Rules**:

- `schemaVersion` must follow semantic versioning format (major.minor)
- `exportDate` must be a valid ISO date
- All counts must be non-negative integers

---

### PackageVersion (Value Object)

Encapsulates version compatibility logic.

```typescript
interface PackageVersion {
  major: number;
  minor: number;

  // Methods
  isCompatibleWith(other: PackageVersion): boolean; // Major must match
  toString(): string; // Returns "major.minor"
}
```

**Compatibility Rules**:

- Packages are compatible if major versions match
- Minor version differences are acceptable (forward/backward compatible)

---

## Existing Entities (Referenced, Not Modified)

The export collects data from these existing domain entities:

### MenuItem (from `src/domain/menu/entities/MenuItem.ts`)

- `id`: string
- `text`: string
- `url`: string | null
- `position`: number
- `createdAt`: Date
- `updatedAt`: Date

### PageContent (from `src/domain/pages/entities/PageContent.ts`)

- `id`: string
- `menuItemId`: string
- `content`: PageContentBody (HTML string)
- `createdAt`: Date
- `updatedAt`: Date

### WebsiteSetting (from `src/domain/settings/entities/WebsiteSetting.ts`)

- `key`: string
- `value`: string | { url: string, metadata?: object } | null

### SocialNetwork (from `src/domain/settings/entities/SocialNetwork.ts`)

- `type`: SocialNetworkType
- `url`: string
- `label`: string
- `enabled`: boolean

---

## Package File Structure

The ZIP package contains:

```
export-{timestamp}.zip
├── manifest.json           # ExportPackage metadata
├── data/
│   ├── menu-items.json     # MenuItem[] serialized
│   ├── page-contents.json  # PageContent[] serialized
│   ├── settings.json       # WebsiteSetting[] serialized
│   └── social-networks.json # SocialNetwork[] serialized
└── images/
    └── page-content-images/
        └── *.{jpg,png,gif,webp}
```

### manifest.json Schema

```json
{
  "schemaVersion": "1.0",
  "exportDate": "2025-12-14T10:30:00.000Z",
  "sourceIdentifier": "test-environment",
  "summary": {
    "menuItemCount": 5,
    "pageContentCount": 5,
    "settingsCount": 8,
    "socialNetworkCount": 3,
    "imageCount": 12,
    "totalSizeBytes": 2048576
  }
}
```

---

## Data Flow

### Export Flow

1. Collect all MenuItems via `IMenuItemRepository.findAll()`
2. Collect all PageContents via `IPageContentRepository.findAll()`
3. Collect all WebsiteSettings via `IWebsiteSettingsRepository.findAll()`
4. Collect all SocialNetworks via `ISocialNetworkRepository.findAll()`
5. Scan `public/page-content-images/` for all image files
6. Create ZIP with manifest, JSON data files, and images
7. Return downloadable stream

### Import Flow

1. Extract and validate `manifest.json` (version check)
2. Create backup of current configuration (using export logic)
3. Parse and validate all JSON data files
4. Clear existing data in all collections
5. Insert imported data via repositories
6. Copy images to `public/page-content-images/`
7. On success: delete backup; On failure: restore from backup

---

## Serialization Notes

- All dates serialized as ISO 8601 strings
- IDs are preserved from source (allows referential integrity)
- Image filenames preserved to maintain URL consistency in content HTML
- Entity serialization uses existing `toJSON()` methods where available
