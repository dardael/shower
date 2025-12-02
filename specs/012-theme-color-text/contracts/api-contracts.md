# API Contracts: Theme Color Text Formatting

**Feature**: 012-theme-color-text  
**Date**: 2025-12-02

## Overview

**No API changes required for this feature.**

This feature is a purely frontend enhancement that:

1. Adds a Tiptap editor extension (client-side only)
2. Stores theme-colored text as standard HTML within existing page content
3. Styles the content using CSS variables

## Existing APIs Used (Unchanged)

### Page Content API

The existing page content endpoints continue to work unchanged:

| Method | Endpoint            | Purpose                         |
| ------ | ------------------- | ------------------------------- |
| GET    | `/api/pages/[slug]` | Retrieve page with HTML content |
| POST   | `/api/pages`        | Create page with HTML content   |
| PUT    | `/api/pages/[slug]` | Update page with HTML content   |

The `content` field accepts any valid HTML string. Theme-colored text is stored as:

```html
<span class="theme-color-text" data-theme-color="true">colored text</span>
```

### Theme Color API

The existing theme color endpoints continue to work unchanged:

| Method | Endpoint                    | Purpose                 |
| ------ | --------------------------- | ----------------------- |
| GET    | `/api/settings/theme-color` | Get current theme color |
| POST   | `/api/settings/theme-color` | Update theme color      |

The CSS variable `--chakra-colors-color-palette-solid` is automatically updated when theme color changes, which affects the display of theme-colored text.

## Why No New Endpoints

1. **Content storage**: Existing page content field stores HTML - no schema change needed
2. **Color resolution**: CSS variables handle dynamic color - no API needed
3. **State management**: Tiptap editor handles mark state internally - no server state
