# Implementation Plan: Sheet Column Width Configuration

**Branch**: `039-sheet-column-width` | **Date**: 2025-12-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/039-sheet-column-width/spec.md`

## Summary

Enable administrators to set fixed column widths in sheets (tables) via a numeric input field in the table toolbar. The column width updates in real-time as the user types and persists to the public page. When no width is set, columns auto-adapt to table width.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router + React 19
**Primary Dependencies**: Tiptap (@tiptap/extension-table, @tiptap/extension-table-cell), Chakra UI v3, existing TableToolbar component
**Storage**: HTML string in MongoDB via PageContent entity (existing infrastructure)
**Testing**: Jest for unit tests and integration tests (only when explicitly requested)
**Target Platform**: Web (Admin dashboard + Public pages)
**Project Type**: Web application (Next.js monolith)
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, YAGNI (minimal implementation), DRY (no duplication), KISS (simple code)
**Scale/Scope**: Single admin user, multiple pages with 1-10 sheets per page

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                    | Status  | Notes                                                                      |
| ---------------------------- | ------- | -------------------------------------------------------------------------- |
| I. Architecture-First        | ✅ PASS | UI-only change in Presentation layer, no domain/application changes needed |
| II. Focused Testing          | ✅ PASS | No tests unless explicitly requested                                       |
| III. Simplicity-First        | ✅ PASS | No performance monitoring, simple implementation                           |
| IV. Security by Default      | ✅ PASS | Uses existing authenticated admin routes                                   |
| V. Clean Architecture        | ✅ PASS | Changes contained to Presentation layer components                         |
| VI. Accessibility-First      | ✅ PASS | Input field follows existing toolbar patterns with proper contrast         |
| VII. YAGNI                   | ✅ PASS | Only implementing numeric input (not drag-resize) as requested             |
| VIII. DRY                    | ✅ PASS | Reusing existing attribute patterns from verticalAlign/borderThickness     |
| IX. KISS                     | ✅ PASS | Following established toolbar control patterns                             |
| X. Configuration Portability | ✅ N/A  | No configuration schema changes (column widths stored in HTML content)     |

## Project Structure

### Documentation (this feature)

```text
specs/039-sheet-column-width/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no API changes)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── presentation/
│   └── admin/
│       └── components/
│           └── PageContentEditor/
│               ├── extensions/
│               │   ├── CustomTableCell.ts      # Add colwidth attribute
│               │   ├── CustomTableHeader.ts    # Add colwidth attribute
│               │   └── tableFormatTypes.ts     # Add createColumnWidthAttribute helper
│               └── TableToolbar.tsx            # Add column width input control
└── ...

# Public side already handles data-colwidth in PublicPageContent.tsx (no changes needed)
```

**Structure Decision**: UI-only changes in Presentation layer. The public side rendering already supports `data-colwidth` attributes, so only admin editor components need modification.
