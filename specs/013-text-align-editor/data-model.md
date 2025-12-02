# Data Model: Text Alignment in Rich Text Editor

**Feature**: 013-text-align-editor  
**Date**: 2025-12-02

## Overview

This feature requires **no data model changes**. Text alignment is stored as inline HTML styles within the existing `content` field of the PageContent entity.

## Existing Data Model

### PageContent Entity

**Location**: `src/domain/pages/entities/PageContent.ts`

| Field      | Type            | Description                             |
| ---------- | --------------- | --------------------------------------- |
| id         | string          | Unique identifier                       |
| menuItemId | string          | Reference to menu item                  |
| content    | PageContentBody | HTML content including alignment styles |

### PageContentBody Value Object

**Location**: `src/domain/pages/value-objects/PageContentBody.ts`

| Property | Type   | Description                               |
| -------- | ------ | ----------------------------------------- |
| value    | string | Raw HTML content (max 100,000 characters) |

## Alignment Storage

Text alignment is embedded in the HTML content as inline styles:

```html
<!-- Left aligned (default) -->
<p>This is left-aligned text.</p>

<!-- Center aligned -->
<p style="text-align: center">This is centered text.</p>

<!-- Right aligned -->
<p style="text-align: right">This is right-aligned text.</p>

<!-- Justified -->
<p style="text-align: justify">This is justified text.</p>

<!-- Headings also support alignment -->
<h1 style="text-align: center">Centered Heading</h1>
```

## Why No Schema Changes?

1. **Tiptap Extension**: The `@tiptap/extension-text-align` stores alignment as HTML attributes
2. **Existing Field**: The `content` field already stores HTML content
3. **No Validation Needed**: Alignment is controlled by the editor, not validated separately
4. **No Queries Needed**: No requirement to query by alignment type

## Impact Assessment

| Layer          | Changes Required              |
| -------------- | ----------------------------- |
| Domain         | None                          |
| Application    | None                          |
| Infrastructure | None                          |
| Presentation   | CSS styles + DOMPurify config |
