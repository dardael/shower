# Quickstart: Editor Font Selection

**Feature**: 019-editor-font-selection  
**Branch**: `019-editor-font-selection`

## Overview

Add font selection capability to the Tiptap rich text editor, allowing administrators to apply specific fonts to selected text. Uses the same 31 fonts available in website font configuration.

## Prerequisites

- Existing project setup with Tiptap editor
- `@tiptap/extension-text-style` already installed (FontFamily is bundled)

## Quick Implementation Steps

### Step 1: Add FontFamily Extension to Editor

Update `TiptapEditor.tsx` to include the FontFamily extension:

```typescript
import { FontFamily } from '@tiptap/extension-text-style/font-family';

const editor = useEditor({
  extensions: [
    StarterKit,
    TextStyle,
    Color,
    FontFamily, // Add this
    // ... other extensions
  ],
  // ... other config
});
```

### Step 2: Create FontPicker Component

Create `src/presentation/admin/components/PageContentEditor/FontPicker.tsx`:

```typescript
import {
  AVAILABLE_FONTS,
  getFontsByCategory,
} from '@/domain/settings/constants/AvailableFonts';

// Component that:
// - Opens a popover with font list grouped by category
// - Displays each font in its own typeface
// - Applies font via editor.chain().focus().setFontFamily('Font Name').run()
// - Removes font via editor.chain().focus().unsetFontFamily().run()
```

### Step 3: Add FontPicker to Toolbar

Add FontPicker next to ColorPicker in TiptapEditor toolbar:

```typescript
<ColorPicker editor={editor} disabled={disabled} />
<FontPicker editor={editor} disabled={disabled} />  {/* Add this */}
```

### Step 4: Update Public Page Font Loading

Modify `PublicPageContent.tsx` to load fonts used in content:

```typescript
const extractFontsFromHtml = (html: string): string[] => {
  const regex = /font-family:\s*'([^']+)'/g;
  const fonts = new Set<string>();
  let match;
  while ((match = regex.exec(html)) !== null) {
    fonts.add(match[1]);
  }
  return Array.from(fonts);
};

// In component:
useEffect(() => {
  const fonts = extractFontsFromHtml(content);
  fonts.forEach((font) => loadGoogleFont(font));
}, [content]);
```

## File Changes Summary

| File                                                           | Change Type |
| -------------------------------------------------------------- | ----------- |
| `src/presentation/admin/components/.../TiptapEditor.tsx`       | Modify      |
| `src/presentation/admin/components/.../FontPicker.tsx`         | Create      |
| `src/presentation/shared/components/.../PublicPageContent.tsx` | Modify      |
| `test/unit/.../FontPicker.test.tsx`                            | Create      |
| `test/integration/editor-font.integration.test.tsx`            | Create      |

## Testing Commands

```bash
# Run all tests
docker compose run --rm app npm run test

# Run specific test file
docker compose run --rm app npm run test -- FontPicker.test.tsx
docker compose run --rm app npm run test -- editor-font.integration.test.tsx
```

## Verification Checklist

- [ ] Font selector button appears in editor toolbar
- [ ] Clicking font button opens dropdown with 31 fonts
- [ ] Fonts are grouped by category (sans-serif, serif, etc.)
- [ ] Each font option displays in its own typeface
- [ ] Selecting a font applies it to selected text
- [ ] "Default" option removes font formatting
- [ ] Saving page content preserves font styling
- [ ] Loading saved content shows font styling in editor
- [ ] Public page renders fonts correctly

## Integration Test Scenarios

### TR-003: Font is saved when configuring page content

```typescript
it('should save font styling in page content', async () => {
  // Apply font to text
  // Save page content
  // Verify API called with HTML containing font-family style
});
```

### TR-004: Font is displayed when editing saved content

```typescript
it('should display font styling when loading saved content', async () => {
  // Load page with font-styled content
  // Verify editor displays styled text
  // Verify font picker shows correct active font
});
```

### TR-005: Font renders on public page

```typescript
it('should render font correctly on public page', async () => {
  // Render PublicPageContent with font-styled HTML
  // Verify span has correct font-family style
  // Verify Google Font link is loaded
});
```
