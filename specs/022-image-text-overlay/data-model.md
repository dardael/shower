# Data Model: Image Text Overlay

**Feature**: 022-image-text-overlay  
**Date**: 2025-12-04

## Overview

The Image Text Overlay feature extends the existing image handling in the page content editor to support text overlays. Data is stored as HTML attributes on wrapper elements within the page content, following the established pattern for image metadata.

## Entities

### ImageTextOverlay (Value Object)

Represents the text overlay configuration for an image. This is not a separate database entity but a set of attributes stored on the HTML element.

**Attributes**:

| Attribute           | Type         | Required | Default   | Description                                          |
| ------------------- | ------------ | -------- | --------- | ---------------------------------------------------- |
| `overlayText`       | string       | Yes      | -         | The text content to display on the image             |
| `overlayColor`      | string (hex) | No       | `#ffffff` | Text color in hex format                             |
| `overlayFontFamily` | string       | No       | `Inter`   | Google Font name for the overlay text                |
| `overlayFontSize`   | enum         | No       | `medium`  | Font size: `small`, `medium`, `large`, `extra-large` |
| `overlayPosition`   | enum         | No       | `center`  | Vertical position: `top`, `center`, `bottom`         |
| `overlayAlign`      | enum         | No       | `center`  | Horizontal alignment: `left`, `center`, `right`      |

**Font Size Values**:

| Size          | CSS Value |
| ------------- | --------- |
| `small`       | 14px      |
| `medium`      | 18px      |
| `large`       | 24px      |
| `extra-large` | 32px      |

**Validation Rules**:

- `overlayText`: Must be non-empty when overlay exists; empty text removes the overlay
- `overlayColor`: Must be valid hex color (#RRGGBB or #RGB format)
- `overlayFontFamily`: Must be a valid font from `AvailableFonts` list
- `overlayFontSize`: Must be one of the enum values
- `overlayPosition`: Must be one of the enum values
- `overlayAlign`: Must be one of the enum values

## HTML Structure

### Storage Format

Text overlay data is stored as data attributes on a wrapper `<div>` element:

```html
<div
  class="image-with-overlay"
  data-overlay-text="Welcome to our site"
  data-overlay-color="#ffffff"
  data-overlay-font="Roboto"
  data-overlay-size="large"
  data-overlay-position="center"
  data-overlay-align="center"
>
  <img
    src="/api/page-content-images/example.jpg"
    class="tiptap-image"
    data-text-align="center"
    style="width: 600px;"
  />
  <div class="text-overlay">Welcome to our site</div>
</div>
```

### Tiptap Node Structure

The Tiptap editor represents this as a custom node:

```typescript
interface ImageWithOverlayAttributes {
  // Inherited image attributes
  src: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
  textAlign?: 'left' | 'center' | 'right';

  // Overlay-specific attributes
  overlayText: string | null;
  overlayColor: string;
  overlayFontFamily: string;
  overlayFontSize: 'small' | 'medium' | 'large' | 'extra-large';
  overlayPosition: 'top' | 'center' | 'bottom';
  overlayAlign: 'left' | 'center' | 'right';
}
```

## State Transitions

### Overlay Lifecycle

```
[Image without overlay]
        |
        v (Add text overlay)
[Image with overlay - editing]
        |
        v (Click outside / blur)
[Image with overlay - saved]
        |
        +-- (Edit text) --> [Image with overlay - editing]
        |
        +-- (Style change) --> [Image with overlay - saved] (immediate)
        |
        v (Remove overlay)
[Image without overlay]
```

### Overlay State Conditions

| State       | Condition                                |
| ----------- | ---------------------------------------- |
| No overlay  | `overlayText` is null or empty           |
| Has overlay | `overlayText` is non-empty string        |
| Editing     | Text input is focused                    |
| Saved       | Text input is blurred, content persisted |

## Relationships

### With Existing Entities

- **PageContent**: The overlay is embedded within page content HTML stored in MongoDB
- **Image**: Overlay wraps an existing image element, inheriting its attributes
- **WebsiteSettings.font**: Overlay font defaults to website font if not specified

### With UI Components

- **ColorPicker**: Used for `overlayColor` selection
- **FontPicker**: Used for `overlayFontFamily` selection
- **AvailableFonts**: Source of valid font families

## Data Persistence

### Storage Location

Text overlay data is persisted as part of the page content HTML string in MongoDB:

```
Page Document
└── content (string)
    └── HTML containing <div class="image-with-overlay"> elements
```

### No Additional Database Schema

This feature does not require any new database collections or schema changes. All data is embedded in the HTML content string.

## Sanitization Rules

DOMPurify configuration must allow:

**Tags**: `div`, `img` (already allowed)

**Attributes**:

- `class` (already allowed)
- `data-overlay-text`
- `data-overlay-color`
- `data-overlay-font`
- `data-overlay-size`
- `data-overlay-position`
- `data-overlay-align`
- `style` (already allowed)
