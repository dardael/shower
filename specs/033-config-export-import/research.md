# Research: Configuration Export/Import

**Feature**: 033-config-export-import | **Date**: 2025-12-14

## Research Summary

All technical decisions resolved. No blocking unknowns remaining.

---

## 1. ZIP Library Selection

**Decision**: Use `archiver` for creating ZIP files (export) and `adm-zip` for extracting (import)

**Rationale**:

- `archiver` provides streaming support for large files, better memory efficiency
- `adm-zip` is simpler for extraction and validation
- Both are well-maintained, widely used in Node.js ecosystem
- No native dependencies, works in all environments

**Alternatives Considered**:

- `jszip`: Browser-focused, less optimal for server-side streaming
- `yazl/yauzl`: Lower-level, more complex API
- Native `zlib`: Too low-level, no ZIP format support

---

## 2. Package Structure

**Decision**: ZIP archive with the following structure:

```
export-{timestamp}.zip
├── manifest.json          # Package metadata (version, date, source)
├── data/
│   ├── menu-items.json    # All menu items
│   ├── page-contents.json # All page content
│   ├── settings.json      # Website settings
│   └── social-networks.json
└── images/
    └── page-content-images/
        └── *.{jpg,png,gif,webp}
```

**Rationale**:

- Clear separation of data and assets
- `manifest.json` enables version checking before full extraction
- Mirrors existing directory structure for images
- JSON format for data allows easy validation and human readability

**Alternatives Considered**:

- Single large JSON with base64 images: Too memory-intensive, no streaming
- SQLite dump: Overkill, adds dependency
- Custom binary format: Not human-readable, harder to debug

---

## 3. Backup Strategy

**Decision**: Create backup ZIP in temp directory before import, auto-restore on failure

**Rationale**:

- Uses same export logic for backup (DRY principle)
- Temp directory avoids polluting user-visible storage
- Cleanup after successful import
- Simple to implement, easy to understand (KISS)

**Alternatives Considered**:

- Database transactions only: Doesn't cover filesystem images
- Shadow copies: More complex, OS-dependent
- Staged import with commit: More complex implementation

---

## 4. Version Compatibility

**Decision**: Major version must match, minor versions are compatible

**Rationale**:

- Follows semantic versioning conventions
- Major version changes indicate breaking schema changes
- Minor version differences are forward/backward compatible
- Stored in `manifest.json` as `schemaVersion: "1.0"`

**Alternatives Considered**:

- Exact version match: Too restrictive
- Migration scripts: Over-engineering for initial release (YAGNI)

---

## 5. Data Collection Strategy

**Decision**: Use existing repository interfaces via service locators

**Rationale**:

- Reuses existing `MongooseMenuItemRepository`, `MongoosePageContentRepository`, `MongooseWebsiteSettingsRepository`, `MongooseSocialNetworkRepository`
- Maintains hexagonal architecture - domain layer unaware of export
- Single source of truth for data access

**Alternatives Considered**:

- Direct MongoDB queries: Bypasses domain layer, violates architecture
- New dedicated repositories: Duplication (violates DRY)

---

## 6. File Handling for Images

**Decision**: Copy images from `public/page-content-images/` during export, restore to same location during import

**Rationale**:

- Mirrors existing `LocalFileStorageService` patterns
- Preserves original filenames for URL consistency
- Uses streaming for large files to avoid memory issues

**Alternatives Considered**:

- Store images in database as binary: Changes architecture, performance impact
- External storage (S3): Out of scope, not in current infrastructure

---

## 7. Integration Testing Approach

**Decision**: Integration tests for export and import flows using test database and temp directories

**Rationale**:

- User explicitly requested integration tests
- Tests actual ZIP creation/extraction
- Verifies full round-trip: export → import → verify data matches
- Uses existing test infrastructure

**Test Scenarios**:

1. Export creates valid ZIP with all data
2. Import applies all data correctly
3. Import with version mismatch shows error
4. Import failure triggers backup restore

---

## Resolved Unknowns

| Unknown          | Resolution                                 |
| ---------------- | ------------------------------------------ |
| ZIP library      | archiver (export) + adm-zip (import)       |
| Package format   | ZIP with manifest.json, data/, images/     |
| Backup mechanism | Full export to temp before import          |
| Version check    | Major version match required               |
| Data collection  | Existing repositories via service locators |
| Image handling   | Stream copy, preserve filenames            |
| Testing          | Integration tests for export/import flows  |
