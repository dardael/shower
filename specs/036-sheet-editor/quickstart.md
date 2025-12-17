# Quickstart Guide: Sheet Editor Feature

**Feature Branch**: `036-sheet-editor`  
**Date**: 2025-12-17

## Prerequisites

- Node.js 18+ installed
- Docker and Docker Compose
- Repository cloned and on `036-sheet-editor` branch

## Quick Setup

### 1. Install Dependencies

```bash
docker compose run --rm app npm install
```

This will install the new Tiptap Table extension:

- `@tiptap/extension-table`

### 2. Start Development Server

```bash
docker compose up app
```

### 3. Access the Editor

1. Navigate to `http://localhost:3000/admin`
2. Sign in with your admin credentials
3. Go to any page's content editor
4. Look for the "Insert Table" button in the toolbar

## Key Files to Modify

### Extension Configuration

**File**: `src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`

Add TableKit to the extensions array:

```typescript
import { TableKit } from '@tiptap/extension-table';

const extensions = [
  // ... existing extensions
  TableKit.configure({
    resizable: false,
    HTMLAttributes: {
      class: 'tiptap-table',
    },
  }),
];
```

### Table Toolbar Component

**Location**: `src/presentation/admin/components/PageContentEditor/TableToolbar.tsx`

New component for table-specific operations:

- Add/remove rows and columns
- Merge/split cells
- Toggle header cells
- Delete table

### Table Insert Dialog

**Location**: `src/presentation/admin/components/PageContentEditor/TableInsertDialog.tsx`

New component for specifying table dimensions (1-20 rows/columns).

### CSS Styles

**File**: `src/presentation/admin/components/PageContentEditor/tiptap-styles.css`

Add table styling for the editor:

```css
.tiptap-table {
  border-collapse: collapse;
  width: 100%;
  margin: 1rem 0;
}

.tiptap-table td,
.tiptap-table th {
  border: 1px solid var(--border-color);
  padding: 0.5rem;
  min-width: 50px;
}

.tiptap-table th {
  background-color: var(--header-bg);
  font-weight: bold;
}
```

### Public Page Styles

**File**: `src/presentation/shared/components/PublicPageContent/public-content-styles.css`

Add matching styles for public table display.

## Testing the Feature

### Manual Test Checklist

1. **Insert Table**
   - Click "Insert Table" button
   - Enter rows=3, columns=3
   - Verify 3x3 table appears

2. **Add/Remove Rows**
   - Click in a cell
   - Click "Add Row Below"
   - Verify new row appears
   - Click "Delete Row"
   - Verify row removed

3. **Add/Remove Columns**
   - Click in a cell
   - Click "Add Column Right"
   - Verify new column appears
   - Click "Delete Column"
   - Verify column removed

4. **Toggle Headers**
   - Select a cell
   - Click "Toggle Header"
   - Verify cell becomes header (bold, background)

5. **Merge Cells**
   - Select 2+ adjacent cells
   - Click "Merge Cells"
   - Verify cells combine

6. **Split Cells**
   - Select merged cell
   - Click "Split Cell"
   - Verify cell splits back

7. **Public View**
   - Save page
   - View public page
   - Verify table displays correctly

## Common Issues

### Table Not Appearing in Toolbar

Ensure `@tiptap/extension-table` is installed:

```bash
docker compose run --rm app npm ls @tiptap/extension-table
```

### Styles Not Applied

Check that CSS variables are defined and the stylesheet is imported.

### Merge Button Disabled

Only works when 2+ adjacent cells are selected. Use Shift+Click or drag to select.

## Build Verification

```bash
docker compose run --rm app npm run build
docker compose run --rm app npm run lint
```
