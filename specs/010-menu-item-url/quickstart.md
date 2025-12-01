# Quickstart: Menu Item URL Configuration

**Feature**: 010-menu-item-url  
**Date**: 2025-12-01

## Overview

This feature adds URL configuration to menu items, allowing administrators to specify navigation destinations for each menu entry. URLs must be relative paths (e.g., `/about`, `contact`).

## Key Changes

### Domain Layer

1. **New Value Object**: `MenuItemUrl` in `src/domain/menu/value-objects/`
   - Validates non-empty relative URLs
   - Rejects absolute URLs (http://, https://, //)
   - Max 2048 characters

2. **Extended Entity**: `MenuItem` gains `_url` property
   - New `withUrl()` immutable update method
   - Updated factory methods require url parameter

### Application Layer

3. **Updated Use Cases**:
   - `AddMenuItem.execute(text, url)` - now requires url
   - `UpdateMenuItem.execute(id, text, url)` - now requires url

### Infrastructure Layer

4. **Updated Schema**: `MenuItemModel` adds `url` field (required, string)
5. **Updated Repository**: `MongooseMenuItemRepository` maps url field

### API Layer

6. **Updated Endpoints**:
   - POST `/api/settings/menu` - body includes `url`
   - PATCH `/api/settings/menu/[id]` - body includes `url`
   - GET responses include `url` in MenuItemDTO

### Presentation Layer

7. **Admin Form**: `MenuConfigForm.tsx` adds URL input field
8. **Public Header**: `PublicHeaderMenuItem.tsx` renders as Next.js Link

## Testing

### Unit Tests (Requested)

- `test/unit/domain/menu/value-objects/MenuItemUrl.test.ts`
  - Valid relative URLs
  - Empty URL rejection
  - Absolute URL rejection

- `test/unit/presentation/shared/components/PublicHeaderMenuItem.test.tsx`
  - Link renders with correct href
  - Navigation works on click

## Quick Verification

```bash
# Run tests
docker compose run --rm app npm run test

# Build check
docker compose run --rm app npm run build
```

## API Usage Examples

```bash
# Create menu item with URL
curl -X POST http://localhost:3000/api/settings/menu \
  -H "Content-Type: application/json" \
  -d '{"text": "About", "url": "/about"}'

# Update menu item URL
curl -X PATCH http://localhost:3000/api/settings/menu/abc123 \
  -H "Content-Type: application/json" \
  -d '{"text": "About Us", "url": "/about-us"}'
```
