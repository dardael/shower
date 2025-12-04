# API Contracts: Image Text Overlay

**Feature**: 022-image-text-overlay  
**Date**: 2025-12-04

## Overview

The Image Text Overlay feature does not require new API endpoints. The overlay data is embedded in the page content HTML and uses the existing page content API for persistence.

## Existing API Usage

### Page Content API

The overlay data is persisted through the existing page content update endpoint:

**Endpoint**: `PUT /api/pages/{pageId}/content`

**Request Body**:

```json
{
  "content": "<div class=\"image-with-overlay\" data-overlay-text=\"...\" ...><img src=\"...\" /><div class=\"text-overlay\">...</div></div>"
}
```

**Response**: Existing page content response format

## TypeScript Interfaces

### Overlay Configuration Types

```typescript
// src/domain/pages/types/ImageOverlay.ts

/**
 * Font size options for text overlay
 */
export type OverlayFontSize = 'small' | 'medium' | 'large' | 'extra-large';

/**
 * Vertical position options for text overlay
 */
export type OverlayPosition = 'top' | 'center' | 'bottom';

/**
 * Horizontal alignment options for text overlay
 */
export type OverlayAlign = 'left' | 'center' | 'right';

/**
 * Text overlay configuration interface
 */
export interface ImageTextOverlay {
  /** The text content to display */
  text: string;
  /** Text color in hex format (e.g., "#ffffff") */
  color: string;
  /** Google Font family name */
  fontFamily: string;
  /** Font size preset */
  fontSize: OverlayFontSize;
  /** Vertical position on the image */
  position: OverlayPosition;
  /** Horizontal text alignment */
  align: OverlayAlign;
}

/**
 * Default overlay configuration
 */
export const DEFAULT_OVERLAY_CONFIG: Omit<ImageTextOverlay, 'text'> = {
  color: '#ffffff',
  fontFamily: 'Inter',
  fontSize: 'medium',
  position: 'center',
  align: 'center',
};

/**
 * Font size to pixel value mapping
 */
export const OVERLAY_FONT_SIZES: Record<OverlayFontSize, number> = {
  small: 14,
  medium: 18,
  large: 24,
  'extra-large': 32,
};
```

### Tiptap Extension Attributes

```typescript
// For use in Tiptap extension definition

export interface ImageWithOverlayAttributes {
  // Standard image attributes
  src: string;
  alt: string | null;
  title: string | null;
  width: number | null;
  height: number | null;
  textAlign: 'left' | 'center' | 'right' | null;

  // Overlay attributes
  overlayText: string | null;
  overlayColor: string;
  overlayFontFamily: string;
  overlayFontSize: OverlayFontSize;
  overlayPosition: OverlayPosition;
  overlayAlign: OverlayAlign;
}
```

## HTML Data Attribute Contracts

### Wrapper Element Attributes

| Attribute               | Type   | Required | Description                                  |
| ----------------------- | ------ | -------- | -------------------------------------------- |
| `class`                 | string | Yes      | Must include `image-with-overlay`            |
| `data-overlay-text`     | string | Yes      | The overlay text content                     |
| `data-overlay-color`    | string | No       | Hex color (default: `#ffffff`)               |
| `data-overlay-font`     | string | No       | Font family name (default: `Inter`)          |
| `data-overlay-size`     | string | No       | Size: `small`/`medium`/`large`/`extra-large` |
| `data-overlay-position` | string | No       | Position: `top`/`center`/`bottom`            |
| `data-overlay-align`    | string | No       | Alignment: `left`/`center`/`right`           |

### Example HTML Output

```html
<div
  class="image-with-overlay"
  data-overlay-text="Welcome to Our Site"
  data-overlay-color="#ffffff"
  data-overlay-font="Roboto"
  data-overlay-size="large"
  data-overlay-position="center"
  data-overlay-align="center"
>
  <img
    src="/api/page-content-images/hero.jpg"
    class="tiptap-image"
    style="width: 800px;"
  />
  <div
    class="text-overlay"
    style="color: #ffffff; font-family: 'Roboto', sans-serif; font-size: 24px;"
  >
    Welcome to Our Site
  </div>
</div>
```

## CSS Class Contracts

### Required CSS Classes

| Class                | Element     | Purpose                              |
| -------------------- | ----------- | ------------------------------------ |
| `image-with-overlay` | wrapper div | Identifies overlay container         |
| `text-overlay`       | inner div   | Contains and styles the overlay text |
| `tiptap-image`       | img         | Standard Tiptap image class          |

### CSS Variable Contracts (Theme Integration)

The overlay toolbar should use existing Chakra UI theme tokens for consistency:

- Background colors: `bg.subtle`, `bg.muted`
- Text colors: `fg`, `fg.muted`
- Border colors: `border.default`
- Accent colors: `accent.default`

## Validation Contracts

### Color Validation

```typescript
const HEX_COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

function isValidHexColor(color: string): boolean {
  return HEX_COLOR_REGEX.test(color);
}
```

### Font Validation

```typescript
import { isValidFont } from '@/domain/settings/constants/AvailableFonts';

function isValidOverlayFont(fontFamily: string): boolean {
  return isValidFont(fontFamily);
}
```

### Size Validation

```typescript
const VALID_SIZES = ['small', 'medium', 'large', 'extra-large'] as const;

function isValidOverlaySize(size: string): size is OverlayFontSize {
  return VALID_SIZES.includes(size as OverlayFontSize);
}
```

## No New API Endpoints Required

This feature operates entirely within the presentation layer and uses existing APIs:

- Page content is saved via existing `PUT /api/pages/{pageId}/content`
- Images are served via existing `GET /api/page-content-images/{filename}`
- No backend processing of overlay data is required
