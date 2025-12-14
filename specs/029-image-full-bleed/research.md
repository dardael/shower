# Research: Image Full Bleed Layout

**Feature**: 029-image-full-bleed  
**Date**: 2025-12-14

## Research Summary

### 1. Existing Image Implementation

**Decision**: Extend existing image node attributes with `fullBleed` boolean  
**Rationale**: Follows established pattern from `fullWidth` feature (spec 023)  
**Alternatives considered**:

- Creating a separate node type (rejected: unnecessary complexity)
- Using CSS classes instead of data attributes (rejected: inconsistent with existing pattern)

**Key Files**:

- `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx` - Main editor with ResizableImage extension and toolbar
- `src/presentation/admin/components/PageContentEditor/extensions/ImageWithOverlay.ts` - Custom node for images with overlays
- `src/presentation/admin/components/PageContentEditor/tiptap-styles.css` - Editor styles

**Existing Pattern**:

- `fullWidth` attribute uses `data-full-width="true"` in HTML
- Toggle function pattern: `toggleFullWidth()` and `isFullWidthActive()`
- IconButton in toolbar with solid/ghost variant based on state

### 2. Container Structure for Full-Bleed Breakout

**Decision**: Use CSS negative margins and viewport width calculation  
**Rationale**: Standard CSS technique for breaking out of containers without DOM changes  
**Alternatives considered**:

- Portal rendering (rejected: complex, breaks content flow)
- Changing container structure (rejected: affects all content)

**Container Hierarchy**:

```
Flex (minH="100vh")
└── Container (maxW="container.lg", py={8})  ← Images must break out of this
    └── Box.public-page-content
        └── img[data-full-bleed="true"]
```

**CSS Technique**:

```css
/* Break out of container to viewport edges */
.public-page-content img[data-full-bleed='true'] {
  width: 100vw;
  max-width: none;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  border-radius: 0; /* Remove rounded corners for edge-to-edge */
}
```

### 3. Data Storage

**Decision**: No schema changes required  
**Rationale**: Content stored as HTML string; data attributes are already supported  
**Alternatives considered**: None needed

**Key Files**:

- `src/domain/pages/entities/PageContent.ts` - Stores content as HTML string
- `src/infrastructure/pages/models/PageContentModel.ts` - MongoDB model with content field

### 4. Public Page Rendering

**Decision**: Add CSS rules to existing public-page-content.css  
**Rationale**: Consistent with existing full-width implementation  
**Alternatives considered**: None needed

**Key File**: `src/presentation/shared/components/PublicPageContent/public-page-content.css`

### 5. Editor Visual Indicator

**Decision**: Add distinct styling in editor to show full-bleed state  
**Rationale**: Administrators need to visually distinguish full-bleed from full-width  
**Alternatives considered**:

- Badge/icon overlay (rejected: clutters UI)
- Different border color (selected: subtle but clear indication)

## Technical Decisions

| Decision          | Choice                            | Rationale                              |
| ----------------- | --------------------------------- | -------------------------------------- |
| Attribute name    | `fullBleed`                       | Descriptive, distinct from `fullWidth` |
| Data attribute    | `data-full-bleed`                 | Consistent with existing patterns      |
| Toolbar icon      | `FiArrowsOut` or similar          | Visually represents breakout concept   |
| Button position   | After fullWidth button            | Logical grouping of width controls     |
| Editor indication | Dashed border or distinct styling | Non-intrusive visual feedback          |
| Full-bleed CSS    | Negative margin technique         | Industry standard, no DOM changes      |

## Resolved Unknowns

All technical aspects have been researched and resolved. No clarifications needed from stakeholders.
