# API Contracts: Extended Color Palette Options

**Feature**: 049-header-menu-bgcolor  
**Date**: 2025-12-25

## Overview

**No new API endpoints required.**

This feature extends existing color palettes by adding new valid values to frontend constants. The existing settings API already handles color tokens as string values.

## Existing Endpoints (Unchanged)

### GET /api/settings

Returns current settings including color configuration.

**Response** (relevant fields):

```json
{
  "themeColor": "gold", // Can now be any of 14 tokens
  "backgroundColor": "taupe" // Can now be any of 14 tokens
}
```

### PUT /api/settings

Updates settings including color configuration.

**Request** (relevant fields):

```json
{
  "themeColor": "sand",
  "backgroundColor": "white"
}
```

## Validation

- Frontend validates color tokens against `THEME_COLOR_PALETTE` array
- Backend accepts any string value (no validation change needed)
- Invalid tokens fall back to default on frontend render

## New Valid Token Values

The following tokens are now valid for `themeColor` and `backgroundColor` fields:

| Token   | Hex Value | Purpose                |
| ------- | --------- | ---------------------- |
| `gold`  | `#eeb252` | Header menu background |
| `sand`  | `#f2e8de` | Header menu background |
| `taupe` | `#e2cbac` | Website background     |
| `white` | `#ffffff` | Website background     |

## Backward Compatibility

- Existing color selections remain valid
- No API version change required
- No database migration needed
