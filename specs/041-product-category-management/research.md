# Research: Product and Category Management

**Feature**: 041-product-category-management
**Date**: 2025-12-18

## Summary

All technical decisions for Product and Category Management have been resolved through codebase analysis. This feature follows established patterns with no significant unknowns.

---

## Decision 1: Entity Pattern for Product/Category

**Decision**: Follow existing DDD entity pattern with private fields, immutable updates, and JSON serialization

**Rationale**: Consistency with existing entities (SocialNetwork, PageContent, MenuItem) ensures maintainability and developer familiarity. The pattern provides type safety, immutability, and clean serialization.

**Alternatives Considered**:

- Plain TypeScript interfaces: Rejected - lacks validation and encapsulation
- Class with public fields: Rejected - violates DDD entity encapsulation principles

**Reference**: `src/domain/settings/entities/SocialNetwork.ts`

---

## Decision 2: Image Storage for Products

**Decision**: Use existing `IFileStorageService` with a new `productImages` file type configuration

**Rationale**: The FileStorageService already handles file uploads with validation, size limits, and proper path management. Adding a new file type follows the established pattern and reuses tested code.

**Alternatives Considered**:

- Create separate product image service: Rejected - violates DRY, duplicates existing functionality
- Store images in MongoDB as base64: Rejected - poor performance, storage bloat

**Reference**: `src/infrastructure/shared/services/FileStorageService.ts`

---

## Decision 3: Many-to-Many Relationship Implementation

**Decision**: Store category IDs as array in Product entity; no separate junction collection

**Rationale**:

- Products own the relationship (products belong to categories)
- Simpler schema with embedded references
- Sufficient for expected scale (up to 1000 products, ~50 categories)
- Easy to query products by category using `$in` operator

**Alternatives Considered**:

- Separate ProductCategory junction collection: Rejected - over-engineering for current scale
- Store product IDs in Category: Rejected - harder to manage, risk of orphaned references

---

## Decision 4: Drag-and-Drop Ordering

**Decision**: Use `@dnd-kit/core` for drag-and-drop, store `displayOrder` as integer field on Product

**Rationale**: @dnd-kit is already a project dependency (used elsewhere). Integer ordering allows simple reordering with gap renumbering when needed.

**Alternatives Considered**:

- react-beautiful-dnd: Rejected - not currently in dependencies
- Fractional ordering (floats): Rejected - over-complexity for expected usage

**Reference**: Existing drag-and-drop patterns in menu item ordering

---

## Decision 5: Admin Navigation Integration

**Decision**: Add "Products" menu item to `AdminSidebar.tsx` menuItems array

**Rationale**: Direct modification of the existing sidebar component follows the established pattern. No architectural changes needed.

**Reference**: `src/presentation/admin/components/AdminSidebar.tsx` lines 25-51

---

## Decision 6: Export/Import Integration

**Decision**: Add ProductExporter and CategoryExporter following existing exporter pattern; increment export version

**Rationale**: Configuration Portability principle requires all config changes sync with export/import. Following existing IConfigExporter pattern ensures consistency.

**Alternatives Considered**:

- Skip export/import: Rejected - violates Constitution principle X

**Reference**: `src/infrastructure/config/adapters/BackupService.ts`, existing exporter implementations

---

## Decision 7: Search Implementation

**Decision**: Client-side filtering for initial implementation

**Rationale**:

- Assumption #10 in spec explicitly states client-side filtering is sufficient
- Simpler implementation, no backend search endpoint needed
- Pagination at 50 items keeps client-side filtering performant
- Can add server-side search later if catalogs grow significantly

**Alternatives Considered**:

- Server-side search with text indexes: Deferred - can add later if needed

---

## Decision 8: Concurrent Edit Handling

**Decision**: Last-write-wins with optimistic locking via `updatedAt` timestamp

**Rationale**: Assumption #6 in spec accepts last-write-wins. Adding `updatedAt` comparison provides basic conflict detection without complex merge logic.

**Alternatives Considered**:

- Full conflict resolution UI: Rejected - over-engineering per YAGNI
- No conflict detection: Rejected - could silently lose data

---

## Unresolved Items

None. All technical decisions have been made based on existing patterns and spec requirements.
