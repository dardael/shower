# Data Model: Overlay Color Configuration

**Feature**: 024-overlay-color-config
**Date**: 2025-12-04

## Entity Extensions

### ImageTextOverlay (Extended)

The existing `ImageTextOverlay` interface is extended with two new properties for overlay background customization.

#### Current Interface (from spec 022)

```typescript
interface ImageTextOverlay {
  text: string; // Overlay text content
  color: string; // Text color (hex, e.g., "#ffffff")
  fontFamily: string; // Google Font name
  fontSize: OverlayFontSize; // 'small' | 'medium' | 'large' | 'extra-large'
  position: OverlayPosition; // 'top' | 'center' | 'bottom'
  align: OverlayAlign; // 'left' | 'center' | 'right'
}
```

#### New Properties (spec 024)

| Property    | Type     | Default     | Description                                   |
| ----------- | -------- | ----------- | --------------------------------------------- |
| `bgColor`   | `string` | `"#000000"` | Background color of the overlay in hex format |
| `bgOpacity` | `number` | `50`        | Background opacity as percentage (0-100)      |

#### Extended Interface

```typescript
interface ImageTextOverlay {
  // Existing properties
  text: string;
  color: string;
  fontFamily: string;
  fontSize: OverlayFontSize;
  position: OverlayPosition;
  align: OverlayAlign;

  // New properties (spec 024)
  bgColor: string; // Background color (hex)
  bgOpacity: number; // Background opacity (0-100)
}
```

#### Default Configuration Update

```typescript
const DEFAULT_OVERLAY_CONFIG: Omit<ImageTextOverlay, 'text'> = {
  // Existing defaults
  color: '#ffffff',
  fontFamily: 'Inter',
  fontSize: 'medium',
  position: 'center',
  align: 'center',

  // New defaults (spec 024)
  bgColor: '#000000',
  bgOpacity: 50,
};
```

## HTML Data Attributes

### New Attributes

| Attribute                 | Format           | Example     |
| ------------------------- | ---------------- | ----------- |
| `data-overlay-bg-color`   | Hex color string | `"#000000"` |
| `data-overlay-bg-opacity` | Integer 0-100    | `"50"`      |

### Complete Attribute List (Updated)

```html
<div
  class="image-with-overlay"
  data-overlay-text="Welcome"
  data-overlay-color="#ffffff"
  data-overlay-font="Inter"
  data-overlay-size="medium"
  data-overlay-position="center"
  data-overlay-align="center"
  data-overlay-bg-color="#000000"
  data-overlay-bg-opacity="50"
>
  <img src="/image.jpg" class="tiptap-image" />
  <div
    class="text-overlay text-overlay-center text-overlay-align-center"
    style="color: #ffffff; font-family: 'Inter', sans-serif; font-size: 18px; background: rgba(0, 0, 0, 0.5);"
  >
    Welcome
  </div>
</div>
```

## Tiptap Node Attributes

### New Attributes for ImageWithOverlay Extension

```typescript
// In ImageWithOverlay.ts addAttributes()
overlayBgColor: {
  default: DEFAULT_OVERLAY_CONFIG.bgColor,
  parseHTML: (element) =>
    element.getAttribute('data-overlay-bg-color') ||
    DEFAULT_OVERLAY_CONFIG.bgColor,
  renderHTML: (attributes) => {
    return { 'data-overlay-bg-color': attributes.overlayBgColor };
  },
},
overlayBgOpacity: {
  default: DEFAULT_OVERLAY_CONFIG.bgOpacity,
  parseHTML: (element) => {
    const value = element.getAttribute('data-overlay-bg-opacity');
    return value ? parseInt(value, 10) : DEFAULT_OVERLAY_CONFIG.bgOpacity;
  },
  renderHTML: (attributes) => {
    return { 'data-overlay-bg-opacity': String(attributes.overlayBgOpacity) };
  },
},
```

## Rendering Logic

### Background Style Generation

Replace the current `getContrastBackground()` auto-generation with configurable values:

```typescript
// Current (auto-generated based on text color)
function getContrastBackground(textColor: string): string {
  const luminance = getColorLuminance(textColor);
  return luminance > 0.5 ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)';
}

// New (configurable)
function getOverlayBackground(bgColor: string, bgOpacity: number): string {
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const alpha = bgOpacity / 100;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
```

## Validation Rules

| Field       | Rule                                | Error Message                       |
| ----------- | ----------------------------------- | ----------------------------------- |
| `bgColor`   | Valid hex color (3 or 6 characters) | "Invalid color format"              |
| `bgOpacity` | Integer between 0 and 100           | "Opacity must be between 0 and 100" |

## State Transitions

This feature has no complex state transitions. The overlay background color and opacity are static configuration values that:

1. Are set by the administrator in the editor
2. Persist with the page content
3. Render identically on public pages

## Backward Compatibility

Existing overlays without `data-overlay-bg-color` and `data-overlay-bg-opacity` attributes will receive default values:

- `bgColor`: `#000000` (black)
- `bgOpacity`: `50` (50%)

This matches the current auto-generated dark background behavior for white text, ensuring visual consistency.
