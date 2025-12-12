# Quickstart: Admin Background Color Preview

**Feature**: 026-admin-bgcolor-preview  
**Date**: 2025-12-12

## Overview

This feature adds a live preview to the BackgroundColorSelector component showing the actual background color as it appears on the public site, respecting the current color mode (light/dark).

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Access to admin dashboard

## Development Setup

```bash
# Install dependencies
docker compose run --rm app npm install

# Run development server (manual - do not run in agent)
docker compose up app
```

## Key Files

| File                                                            | Purpose                                |
| --------------------------------------------------------------- | -------------------------------------- |
| `src/presentation/admin/components/BackgroundColorSelector.tsx` | Component to enhance with preview      |
| `src/presentation/shared/components/ui/provider.tsx`            | Contains BACKGROUND_COLOR_MAP to reuse |
| `src/presentation/shared/components/ui/color-mode.tsx`          | Contains useColorMode hook             |

## Implementation Checklist

1. [ ] Add preview element to BackgroundColorSelector
2. [ ] Import and use BACKGROUND_COLOR_MAP for color values
3. [ ] Use useColorMode() to detect current mode
4. [ ] Apply correct hex color based on mode
5. [ ] Add data-testid for testing
6. [ ] Write unit tests for preview display
7. [ ] Write integration tests for mode switching

## Testing

```bash
# Run all tests
docker compose run --rm app npm run test

# Run specific test file
docker compose run --rm app npm run test -- BackgroundColorSelector.test.tsx
```

## Verification

1. Navigate to Admin > Website Settings
2. Observe the background color preview below color options
3. Toggle dark mode - preview should update to dark mode color
4. Toggle light mode - preview should update to light mode color
5. Select different colors - preview should update immediately
