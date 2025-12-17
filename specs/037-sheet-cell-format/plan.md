# Implementation Plan: Sheet Cell Formatting

**Branch**: `037-sheet-cell-format` | **Date**: 2025-12-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/037-sheet-cell-format/spec.md`

## Summary

Add border thickness control (0-10px) and vertical cell alignment (top/center/bottom) options to the sheet editor in the page content editor. These formatting options must be configurable by administrators in the admin panel and render correctly on the public-facing pages.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router + React 19
**Primary Dependencies**: Tiptap (@tiptap/extension-table, @tiptap/extension-table-cell), Chakra UI v3, DOMPurify
**Storage**: HTML string in MongoDB via PageContent entity (existing infrastructure)
**Testing**: Jest for unit tests and integration tests (only when explicitly requested)
**Target Platform**: Web (Next.js App Router)
**Project Type**: Web application (Next.js monorepo structure)
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, consistent theme color usage, YAGNI (minimal implementation), DRY (no duplication), KISS (simple code), configuration portability (sync export/import on config changes - N/A for this feature as data is stored in page content HTML, not site configuration)
**Scale/Scope**: Single website admin/public application

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Status | Notes                                                                     |
| ------------------------------------ | ------ | ------------------------------------------------------------------------- |
| I. Architecture-First Development    | PASS   | Uses existing DDD/Hexagonal architecture, extends Presentation layer only |
| II. Focused Testing Approach         | PASS   | No tests unless explicitly requested                                      |
| III. Simplicity-First Implementation | PASS   | No performance monitoring, simple CSS-based approach                      |
| IV. Security by Default              | PASS   | Admin-only configuration, DOMPurify sanitization for public view          |
| V. Clean Architecture Compliance     | PASS   | Changes isolated to Presentation layer components and CSS                 |
| VI. Accessibility-First Design       | PASS   | UI controls follow Chakra UI patterns, proper contrast in both themes     |
| VII. YAGNI                           | PASS   | Only border thickness and vertical alignment, no additional features      |
| VIII. DRY                            | PASS   | Reuse existing TableToolbar patterns, shared CSS variables                |
| IX. KISS                             | PASS   | Simple data attributes + CSS approach, no complex state management        |
| X. Configuration Portability         | N/A    | Data stored in page content HTML, not site-level configuration            |

**Gate Status**: PASSED - All applicable principles satisfied

## Project Structure

### Documentation (this feature)

```text
specs/037-sheet-cell-format/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no new API endpoints)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── presentation/
│   ├── admin/
│   │   └── components/
│   │       └── PageContentEditor/
│   │           ├── TiptapEditor.tsx           # Extend table extension config
│   │           ├── TableToolbar.tsx           # Add formatting controls
│   │           ├── TableFormatControls.tsx    # NEW: Border/alignment UI component
│   │           └── tiptap-styles.css          # Update table styles for data attributes
│   └── shared/
│       └── components/
│           └── PublicPageContent/
│               ├── PublicPageContent.tsx      # Update DOMPurify allowed attributes
│               └── public-page-content.css    # Update table styles for data attributes

test/
└── unit/
    └── presentation/
        └── admin/
            └── components/
                └── PageContentEditor/
                    └── TableFormatControls.test.tsx  # If tests requested
```

**Structure Decision**: Extends existing Presentation layer structure. New component `TableFormatControls.tsx` for formatting UI, CSS updates to both admin and public stylesheets for data-attribute-driven styling.
