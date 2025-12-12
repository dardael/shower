# API Contracts: Admin Background Color Preview

**Feature**: 026-admin-bgcolor-preview  
**Date**: 2025-12-12

## Summary

No API changes required for this feature. The preview is a purely client-side enhancement that uses existing data structures.

## Existing APIs (Unchanged)

### GET /api/settings

Returns current background color setting (no changes needed).

### POST /api/settings

Updates background color setting (no changes needed).

## Component Interface Changes

### BackgroundColorSelector Props (Unchanged)

```typescript
interface BackgroundColorSelectorProps {
  selectedColor: ThemeColorToken;
  onColorChange: (color: ThemeColorToken) => void;
  disabled?: boolean;
  isLoading?: boolean;
}
```

The preview functionality is internal to the component and does not change its public interface.
