# Quickstart: Theme Color Text Formatting

**Feature**: 012-theme-color-text  
**Date**: 2025-12-02

## Prerequisites

- Node.js and npm installed
- Docker and docker-compose installed
- Project dependencies installed (`docker compose run --rm app npm install`)

## Development Setup

1. **Start the development server** (run manually):

   ```bash
   docker compose up app
   ```

2. **Access the admin area**:
   - Navigate to `http://localhost:3000/admin`
   - Log in with your admin account

3. **Navigate to page editor**:
   - Go to the Pages section
   - Create or edit a page to access the rich text editor

## Implementation Files

### New Files

| File                                                                    | Purpose                      |
| ----------------------------------------------------------------------- | ---------------------------- |
| `src/presentation/admin/components/PageContentEditor/ThemeColorMark.ts` | Custom Tiptap mark extension |

### Modified Files

| File                                                                    | Changes                            |
| ----------------------------------------------------------------------- | ---------------------------------- |
| `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`  | Add theme color button to toolbar  |
| `src/presentation/admin/components/PageContentEditor/tiptap-styles.css` | Add CSS for theme-color-text class |

## Testing the Feature

### Manual Testing Steps

1. **Apply theme color to text**:
   - Open page editor
   - Type some text
   - Select a portion of text
   - Click the color button (palette icon)
   - Verify text changes to theme color

2. **Toggle behavior**:
   - With colored text selected
   - Click the color button again
   - Verify color is removed

3. **Check persistence**:
   - Save the page
   - Reload the page
   - Verify colored text persists

4. **Check public view**:
   - View the page on the public site
   - Verify colored text displays correctly

5. **Theme color update**:
   - Go to Settings
   - Change the theme color
   - Return to the page
   - Verify colored text updated to new theme color

## Verification Commands

```bash
# Type check
docker compose run --rm app npm run build:strict

# Lint
docker compose run --rm app npm run lint

# Build
docker compose run --rm app npm run build
```

## Expected Output

### Editor Toolbar

The toolbar should display a new color button (palette icon) after the italic button:

```
[B] [I] [🎨] [H1] [H2] [H3] [•] [1.] [🔗] [🖼]
```

### HTML Output

Theme-colored text produces this HTML:

```html
<span class="theme-color-text" data-theme-color="true">colored text</span>
```

### Visual Result

- Colored text displays in the current theme color (blue, red, green, etc.)
- Color automatically updates when theme color is changed in settings
- Works in both light and dark modes with appropriate contrast
