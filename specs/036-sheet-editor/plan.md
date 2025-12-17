# Implementation Plan: Sheet Editor

**Branch**: `036-sheet-editor` | **Date**: 2025-12-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/036-sheet-editor/spec.md`

## Summary

Add table/sheet editing capabilities to the existing TiptapEditor using the official `@tiptap/extension-table` package. Administrators can insert tables with configurable dimensions (1x1 to 20x20), add/remove rows and columns, toggle header status, merge cells, and split cells. Tables are stored as HTML within the existing PageContent structure and rendered identically on the public side.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router + React 19  
**Primary Dependencies**: Tiptap (@tiptap/extension-table, @tiptap/extension-table-row, @tiptap/extension-table-cell, @tiptap/extension-table-header), Chakra UI v3, react-icons  
**Storage**: MongoDB via Mongoose (existing PageContent entity - HTML string storage)  
**Testing**: Jest for unit tests and integration tests (only when explicitly requested)  
**Target Platform**: Web (modern browsers)  
**Project Type**: Web application (Next.js monolith)  
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)  
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, consistent theme color usage, YAGNI (minimal implementation), DRY (no duplication), KISS (simple code), configuration portability (N/A - no new config fields)  
**Scale/Scope**: Single admin user, tables up to 20x20 cells

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Status | Notes                                                           |
| ------------------------------------ | ------ | --------------------------------------------------------------- |
| I. Architecture-First Development    | PASS   | Presentation layer only - extends existing TiptapEditor         |
| II. Focused Testing Approach         | PASS   | Tests only when explicitly requested                            |
| III. Simplicity-First Implementation | PASS   | No performance monitoring, using battle-tested Tiptap extension |
| IV. Security by Default              | PASS   | Uses existing PageContent authentication/authorization          |
| V. Clean Architecture Compliance     | PASS   | No new domain/application layers needed                         |
| VI. Accessibility-First Design       | PASS   | Proper contrast for header cells, theme-aware styling           |
| VII. YAGNI                           | PASS   | Minimal implementation - only required features                 |
| VIII. DRY                            | PASS   | Reuses existing editor patterns and Tiptap commands             |
| IX. KISS                             | PASS   | Leverages Tiptap's built-in table functionality                 |
| X. Configuration Portability         | N/A    | No new configuration fields added                               |

## Project Structure

### Documentation (this feature)

```text
specs/036-sheet-editor/
├── plan.md              # This file
├── research.md          # Phase 0 output - Tiptap Table research
├── data-model.md        # Phase 1 output - HTML structure
├── quickstart.md        # Phase 1 output - Implementation guide
├── contracts/           # Phase 1 output - Component interfaces
│   └── api.md
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── presentation/
│   ├── admin/
│   │   └── components/
│   │       └── PageContentEditor/
│   │           ├── TiptapEditor.tsx        # MODIFY: Add table extensions
│   │           ├── TableToolbar.tsx        # NEW: Table operations toolbar
│   │           ├── TableInsertDialog.tsx   # NEW: Dimension selection dialog
│   │           └── tiptap-styles.css       # MODIFY: Add table styles
│   └── shared/
│       └── components/
│           └── PublicPageContent/
│               └── public-page-content.css # MODIFY: Add public table styles

test/
└── unit/
    └── presentation/
        └── admin/
            └── components/
                └── PageContentEditor/
                    └── TableToolbar.test.tsx  # NEW: Only if tests requested
```

**Structure Decision**: Presentation layer changes only. Extends existing TiptapEditor with Tiptap's official table extension. No new domain entities, application services, or API endpoints required - tables are stored as HTML within existing PageContent.

## Complexity Tracking

No violations - all constitution gates pass.

## Implementation Phases

### Phase 1: Core Table Extension (P1 - Create Basic Sheet)

1. Install `@tiptap/extension-table` and related packages
2. Configure Table, TableRow, TableCell, TableHeader extensions in TiptapEditor
3. Add "Insert Table" button to toolbar with dimension dialog
4. Add basic table CSS for editor and public display

### Phase 2: Row/Column Operations (P2 - Add/Remove Rows/Columns)

1. Create TableToolbar component with row/column operations
2. Implement add row above/below, add column left/right
3. Implement delete row/column with protection for last row/column
4. Show toolbar contextually when cursor is in table

### Phase 3: Header Styling (P3 - Define Headers)

1. Add toggle header row/column functionality
2. Style header cells distinctly (bold, background color)
3. Ensure theme color integration for header backgrounds

### Phase 4: Cell Merge/Split (P4, P5 - Merge and Split Cells)

1. Enable cell selection for merge operations
2. Implement merge cells command
3. Implement split cell command
4. Visual feedback for merged cell regions

### Phase 5: Public Display

1. Ensure table HTML renders correctly on public side
2. Add responsive scrolling for mobile viewports
3. Theme-aware styling (light/dark mode support)
