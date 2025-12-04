# Quickstart: Inline Text Color in Rich Text Editor

**Feature**: 018-theme-color-text  
**Date**: 2025-12-04

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Access to the admin dashboard (authenticated)

## Setup

### 1. Install New Dependencies

```bash
docker compose run --rm app npm install @tiptap/extension-color @tiptap/extension-text-style
```

### 2. Verify Installation

Check `package.json` includes:

```json
{
  "dependencies": {
    "@tiptap/extension-color": "^2.x.x",
    "@tiptap/extension-text-style": "^2.x.x"
  }
}
```

## Implementation Steps

### Step 1: Create ColorPicker Component

Create `src/presentation/admin/components/PageContentEditor/ColorPicker.tsx`:

- Preset color palette grid (12 colors)
- Hex color input with validation
- Popover UI using Chakra UI

### Step 2: Update TiptapEditor

Modify `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`:

1. Import `Color` and `TextStyle` extensions
2. Add extensions to useEditor configuration
3. Replace ThemeColorMark button with ColorPicker
4. Remove ThemeColorMark import

### Step 3: Remove ThemeColorMark

Delete `src/presentation/admin/components/PageContentEditor/ThemeColorMark.ts`

### Step 4: Update CSS (Legacy Fallback)

Update `src/presentation/admin/components/PageContentEditor/tiptap-styles.css`:

```css
/* Legacy fallback - inherit color for old theme-color-text */
.theme-color-text,
span[data-theme-color] {
  color: inherit;
}
```

Update `src/presentation/shared/components/PublicPageContent/public-page-content.css`:

```css
/* Legacy fallback */
.public-page-content .theme-color-text,
.public-page-content span[data-theme-color] {
  color: inherit;
}
```

## Testing the Feature

### Manual Testing

1. Start the development server:

   ```bash
   docker compose up app
   ```

2. Navigate to admin dashboard → Edit a page

3. Test color application:
   - Select some text
   - Click the color button in toolbar
   - Select a preset color → verify text changes color
   - Enter custom hex color → verify text changes color

4. Test color removal:
   - Select colored text
   - Click color button → select "remove color" option

5. Test persistence:
   - Save the page
   - Reload the page → verify colors persisted

6. Test public display:
   - View the page on the public site
   - Verify colored text displays correctly

## File Checklist

| File                         | Action | Status |
| ---------------------------- | ------ | ------ |
| `ColorPicker.tsx`            | CREATE | ⬜     |
| `TiptapEditor.tsx`           | UPDATE | ⬜     |
| `ThemeColorMark.ts`          | DELETE | ⬜     |
| `tiptap-styles.css`          | UPDATE | ⬜     |
| `public-page-content.css`    | UPDATE | ⬜     |
| `ColorPicker.test.tsx`       | CREATE | ⬜     |
| `PublicPageContent.test.tsx` | CREATE | ⬜     |

## Automated Testing

### Run Unit Tests

```bash
docker compose run --rm app npm test -- --testPathPattern="ColorPicker|PublicPageContent"
```

### Test Coverage

The following test cases are implemented:

**ColorPicker.test.tsx**:

- Applies color to selected text via preset palette
- Applies custom hex color via input
- Removes color from text

**PublicPageContent.test.tsx**:

- Renders colored text with correct inline style
- Renders plain text without color
- Sanitizes malicious content

## Troubleshooting

### Color not applying

- Ensure text is selected before clicking color button
- Check browser console for errors
- Verify Color and TextStyle extensions are registered

### Color not showing on public page

- Check DOMPurify configuration allows `style` attribute (already does)
- Inspect HTML output to confirm `<span style="color: ...">` is present

### Legacy content displaying incorrectly

- Verify CSS fallback for `.theme-color-text` is in place
- Legacy content will inherit parent color (acceptable degradation)
