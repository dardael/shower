# API Contracts: Image Full Bleed Layout

**Feature**: 029-image-full-bleed  
**Date**: 2025-12-14

## Overview

This feature does not introduce new API endpoints. All changes are client-side within the Tiptap editor and CSS rendering.

## Editor Commands (Tiptap)

### toggleFullBleed Command

**Purpose**: Toggle the fullBleed attribute on a selected image or imageWithOverlay node

**Signature**:

```typescript
editor.commands.toggleFullBleed(position: number): boolean
```

**Parameters**:

- `position`: The node position in the editor document

**Returns**: `true` if command executed successfully

**Behavior**:

- If `fullBleed` is `false` or undefined, sets it to `true`
- If `fullBleed` is `true`, sets it to `false`
- Updates the node attributes in the editor state

### isFullBleedActive Query

**Purpose**: Check if a node at the given position has fullBleed enabled

**Signature**:

```typescript
isFullBleedActive(editor: Editor, position: number | null): boolean
```

**Parameters**:

- `editor`: The Tiptap editor instance
- `position`: The node position to check (null returns false)

**Returns**: `true` if the node has `fullBleed: true`

## HTML Data Attributes

### data-full-bleed

**Applied to**: `<img>` elements and `.image-with-overlay` wrapper divs

**Values**:

- `"true"` - Image should render edge-to-edge
- Not present or `"false"` - Image renders within container

**Example**:

```html
<!-- Plain image with full bleed -->
<img src="/path/to/image.jpg" data-full-bleed="true" />

<!-- Image with overlay and full bleed -->
<div class="image-with-overlay" data-full-bleed="true">
  <img src="/path/to/image.jpg" />
  <div class="overlay">Overlay text</div>
</div>
```

## CSS Contract

### Editor Styles

**Selector**: `.ProseMirror img[data-full-bleed='true']`
**Selector**: `.ProseMirror .image-with-overlay[data-full-bleed='true']`

**Visual Indication**: Distinct border or styling to indicate full-bleed state

### Public Page Styles

**Selector**: `.public-page-content img[data-full-bleed='true']`
**Selector**: `.public-page-content .image-with-overlay[data-full-bleed='true']`

**Behavior**:

- Width: 100vw (full viewport width)
- Margin: Negative margins to break out of container
- Border radius: 0 (edge-to-edge, no rounded corners)
