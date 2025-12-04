# Data Model: Image Full Width Button

**Feature**: 023-image-full-width
**Date**: 2025-12-04

## Entity Changes

### Extended: Image Node (Tiptap)

The existing Tiptap `image` node is extended with a new attribute.

| Attribute     | Type        | Default   | Description                             |
| ------------- | ----------- | --------- | --------------------------------------- |
| src           | string      | null      | Image source URL                        |
| alt           | string      | null      | Alternative text                        |
| title         | string      | null      | Image title                             |
| width         | number      | null      | Fixed width in pixels (from resize)     |
| textAlign     | string      | null      | Alignment: 'left', 'center', 'right'    |
| **fullWidth** | **boolean** | **false** | **NEW: Whether image spans 100% width** |

**Validation Rules**:

- `fullWidth` is mutually exclusive with fixed `width` - when `fullWidth=true`, `width` is ignored in rendering
- When user manually resizes (sets `width`), `fullWidth` should be set to `false`

### Extended: ImageWithOverlay Node (Tiptap)

The existing custom `imageWithOverlay` node is extended with the same attribute.

| Attribute         | Type        | Default   | Description                             |
| ----------------- | ----------- | --------- | --------------------------------------- |
| src               | string      | null      | Image source URL                        |
| alt               | string      | null      | Alternative text                        |
| title             | string      | null      | Image title                             |
| width             | number      | null      | Fixed width in pixels                   |
| textAlign         | string      | null      | Alignment                               |
| overlayText       | string      | null      | Overlay text content                    |
| overlayColor      | string      | '#ffffff' | Text color                              |
| overlayFontFamily | string      | 'Roboto'  | Font family                             |
| overlayFontSize   | string      | 'medium'  | Size: small/medium/large/extra-large    |
| overlayPosition   | string      | 'center'  | Position: top/center/bottom             |
| overlayAlign      | string      | 'center'  | Alignment: left/center/right            |
| **fullWidth**     | **boolean** | **false** | **NEW: Whether image spans 100% width** |

**Validation Rules**:

- Same as Image node - `fullWidth` and fixed `width` are mutually exclusive
- Overlay attributes remain unchanged when toggling full width

## HTML Serialization

### Plain Image with Full Width

```html
<img
  src="/api/page-content-images/hero.jpg"
  class="tiptap-image"
  data-full-width="true"
  alt="Hero image"
/>
```

### Image with Overlay and Full Width

```html
<div
  class="image-with-overlay"
  data-full-width="true"
  data-overlay-text="Welcome"
  data-overlay-color="#ffffff"
  data-overlay-font="Roboto"
  data-overlay-size="large"
  data-overlay-position="center"
  data-overlay-align="center"
  style="position: relative; display: block; width: 100%;"
>
  <img
    src="/api/page-content-images/hero.jpg"
    class="tiptap-image"
    style="width: 100%;"
  />
  <div
    class="text-overlay text-overlay-center text-overlay-align-center"
    style="color: #ffffff; font-family: 'Roboto', sans-serif; font-size: 24px; background: rgba(0, 0, 0, 0.6);"
  >
    Welcome
  </div>
</div>
```

## State Transitions

```
┌─────────────────┐     Click Button      ┌─────────────────┐
│  Normal Image   │ ───────────────────── │  Full Width     │
│  fullWidth=false│                       │  fullWidth=true │
└─────────────────┘ ◄──────────────────── └─────────────────┘
                       Click Button OR
                       Manual Resize
```

## No Database Changes

Content is stored as HTML string in existing `pageContent.content` field. No schema migration required - the new `data-full-width` attribute is simply included in the HTML.
