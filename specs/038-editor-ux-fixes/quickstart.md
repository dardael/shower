# Quickstart: Editor UX Fixes

**Feature**: 038-editor-ux-fixes
**Date**: 2025-12-17

## Overview

This guide covers implementing three UX improvements to the page content editor:

1. Sticky toolbar that remains visible when scrolling
2. Auto-scroll to editor when clicking "edit page content"
3. Fix button contrast issue (white text on white background)

## Prerequisites

- Node.js and npm installed
- Docker Compose for running the development environment
- Access to the admin interface

## Files to Modify

| File                                                                        | Change                            |
| --------------------------------------------------------------------------- | --------------------------------- |
| `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`      | Add sticky positioning to toolbar |
| `src/presentation/admin/components/MenuConfigForm.tsx`                      | Add auto-scroll to editor         |
| `src/presentation/admin/components/PageContentEditor/PageContentEditor.tsx` | Fix button contrast               |

## Implementation Steps

### 1. Sticky Toolbar (TiptapEditor.tsx)

Locate the toolbar HStack (around line 570) and add sticky positioning:

```tsx
<HStack
  p={2}
  borderBottomWidth="1px"
  borderColor="border"
  bg="bg.subtle"
  flexWrap="wrap"
  gap={1}
  position="sticky"    // ADD
  top={0}              // ADD
  zIndex={10}          // ADD
>
```

### 2. Auto-Scroll to Editor (MenuConfigForm.tsx)

Add a ref and useEffect to scroll when the editor becomes visible:

```tsx
// Add ref to the PageContentEditor container
const editorRef = useRef<HTMLDivElement>(null);

// Add useEffect to scroll when editingContentItem changes
useEffect(() => {
  if (editingContentItem && editorRef.current) {
    editorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}, [editingContentItem]);

// Add ref to the Box wrapping PageContentEditor
<Box mt={6} ref={editorRef}>
  <PageContentEditor ... />
</Box>
```

### 3. Button Contrast Fix (PageContentEditor.tsx)

Ensure the Delete button has proper contrast by verifying color props:

```tsx
<Button
  onClick={() => setDeleteDialogOpen(true)}
  disabled={saving || deleting}
  colorPalette="red"
  variant="outline"
>
```

If contrast issues persist, consider changing to `variant="subtle"` or adding explicit `color` prop.

## Testing

1. **Sticky Toolbar**: Create a page with long content, scroll down, verify toolbar remains visible
2. **Auto-Scroll**: Click edit on a menu item, verify page scrolls to show editor
3. **Button Contrast**: View buttons in both light and dark modes, verify text is readable

## Verification Commands

```bash
# Start development server (run manually)
docker compose up app

# Type check
docker compose run --rm app npm run build:strict

# Lint
docker compose run --rm app npm run lint
```
