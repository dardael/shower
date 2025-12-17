# API Contracts: Sheet Editor Feature

**Feature Branch**: `036-sheet-editor`  
**Date**: 2025-12-17

## Overview

This feature does **not** require any new API endpoints. Tables are stored as HTML content within the existing `PageContent` entity, which is already persisted via the existing page content API.

## Existing APIs Used

### Save Page Content

**Endpoint**: `PATCH /api/settings/pages/{menuItemId}`

**Purpose**: Saves page content including embedded table HTML

**Request Body**:

```json
{
  "content": "<p>Some text</p><table class=\"tiptap-table\">...</table><p>More text</p>"
}
```

**Response**: `200 OK`

```json
{
  "id": "page-content-id",
  "menuItemId": "menu-item-id",
  "content": "<p>Some text</p><table class=\"tiptap-table\">...</table><p>More text</p>",
  "createdAt": "2025-12-17T10:00:00Z",
  "updatedAt": "2025-12-17T10:00:00Z"
}
```

### Get Page Content

**Endpoint**: `GET /api/settings/pages/{menuItemId}`

**Purpose**: Retrieves page content including embedded table HTML

**Response**: `200 OK`

```json
{
  "id": "page-content-id",
  "menuItemId": "menu-item-id",
  "content": "<p>Some text</p><table class=\"tiptap-table\">...</table><p>More text</p>",
  "createdAt": "2025-12-17T10:00:00Z",
  "updatedAt": "2025-12-17T10:00:00Z"
}
```

## Client-Side Contracts

All table operations are handled client-side by Tiptap. The following TypeScript interfaces define the component contracts:

### TableInsertDialog Props

```typescript
interface TableInsertDialogProps {
  editor: Editor;
  disabled?: boolean;
}
```

### TableToolbar Props

```typescript
interface TableToolbarProps {
  editor: Editor;
  disabled?: boolean;
}
```

### Tiptap Table Commands

```typescript
// Commands available via editor.chain().focus()
interface TableCommands {
  insertTable(options: {
    rows: number;
    cols: number;
    withHeaderRow?: boolean;
  }): ChainedCommands;
  addRowBefore(): ChainedCommands;
  addRowAfter(): ChainedCommands;
  addColumnBefore(): ChainedCommands;
  addColumnAfter(): ChainedCommands;
  deleteRow(): ChainedCommands;
  deleteColumn(): ChainedCommands;
  deleteTable(): ChainedCommands;
  mergeCells(): ChainedCommands;
  splitCell(): ChainedCommands;
  toggleHeaderCell(): ChainedCommands;
  goToNextCell(): ChainedCommands;
  goToPreviousCell(): ChainedCommands;
}

// Capability checks via editor.can()
interface TableCanCommands {
  addRowBefore(): boolean;
  addRowAfter(): boolean;
  addColumnBefore(): boolean;
  addColumnAfter(): boolean;
  deleteRow(): boolean;
  deleteColumn(): boolean;
  deleteTable(): boolean;
  mergeCells(): boolean;
  splitCell(): boolean;
  toggleHeaderCell(): boolean;
}
```

## HTML Output Contract

Tables rendered by Tiptap follow this structure:

```html
<table class="tiptap-table">
  <tbody>
    <tr>
      <!-- Header cells use <th> -->
      <th colspan="1" rowspan="1">Header Text</th>
      <th colspan="1" rowspan="1">Header Text</th>
    </tr>
    <tr>
      <!-- Data cells use <td> -->
      <td colspan="1" rowspan="1">Cell Text</td>
      <!-- Merged cells have colspan/rowspan > 1 -->
      <td colspan="2" rowspan="1">Merged Cell</td>
    </tr>
  </tbody>
</table>
```

## No New Endpoints Required

| Operation          | Implementation                                    |
| ------------------ | ------------------------------------------------- |
| Insert table       | Tiptap `insertTable()` command                    |
| Add/delete rows    | Tiptap `addRow*()` / `deleteRow()` commands       |
| Add/delete columns | Tiptap `addColumn*()` / `deleteColumn()` commands |
| Merge cells        | Tiptap `mergeCells()` command                     |
| Split cells        | Tiptap `splitCell()` command                      |
| Toggle headers     | Tiptap `toggleHeaderCell()` command               |
| Save table         | Existing `PATCH /api/settings/pages/{menuItemId}` |
| Load table         | Existing `GET /api/settings/pages/{menuItemId}`   |
