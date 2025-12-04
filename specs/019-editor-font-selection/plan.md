# Implementation Plan: Editor Font Selection

**Branch**: `019-editor-font-selection` | **Date**: 2025-12-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/019-editor-font-selection/spec.md`

## Summary

Add font selection capability to the Tiptap rich text editor for page content, allowing administrators to apply specific fonts to selected text. Reuses the existing 31 fonts from the website font configuration feature. The font styling is persisted in HTML content and rendered correctly on both admin and public pages.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router  
**Primary Dependencies**: Tiptap (with @tiptap/extension-text-style), React 19, Chakra UI v3, Google Fonts CSS API  
**Storage**: MongoDB via Mongoose (page content stored as HTML string)  
**Testing**: Jest for unit tests and integration tests (explicitly requested)  
**Target Platform**: Web (Chrome, Firefox, Safari, Edge)  
**Project Type**: Web application (Next.js monolith)  
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)  
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, consistent theme color usage, YAGNI (minimal implementation), DRY (no duplication), KISS (simple code)  
**Scale/Scope**: Single admin user per website, public viewers

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Gate                              | Status | Notes                                                                                     |
| --------------------------------- | ------ | ----------------------------------------------------------------------------------------- |
| I. Architecture-First Development | ✅     | Follows existing Tiptap editor patterns in presentation layer                             |
| II. Focused Testing Approach      | ✅     | Tests explicitly requested: unit tests + integration tests for save/display functionality |
| III. Simplicity-First             | ✅     | No performance monitoring, reuses existing font constants                                 |
| IV. Security by Default           | ✅     | Admin-only feature, existing auth protects editor pages                                   |
| V. Clean Architecture Compliance  | ✅     | Font selector component in presentation layer, reuses domain constants                    |
| VI. Accessibility-First Design    | ✅     | Font preview uses accessible contrast, follows existing ColorPicker patterns              |
| VII. YAGNI                        | ✅     | Minimal implementation: font selector dropdown, apply/remove font commands                |
| VIII. DRY                         | ✅     | Reuses AVAILABLE_FONTS constant, follows ColorPicker component pattern                    |
| IX. KISS                          | ✅     | Simple Tiptap extension with FontFamily, dropdown selector UI                             |

## Project Structure

### Documentation (this feature)

```text
specs/019-editor-font-selection/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no new API endpoints)
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── domain/
│   └── settings/
│       └── constants/
│           └── AvailableFonts.ts        # Existing - reuse 31 fonts
├── presentation/
│   └── admin/
│       └── components/
│           └── PageContentEditor/
│               ├── TiptapEditor.tsx     # Modify - add font selector
│               ├── FontPicker.tsx       # New - font selector dropdown component
│               └── tiptap-styles.css    # Modify - add font-related styles
│   └── shared/
│       └── components/
│           └── PublicPageContent/
│               ├── PublicPageContent.tsx    # Modify - load fonts for styled text
│               └── public-content-styles.css # Modify - add font styles

test/
├── unit/
│   └── presentation/
│       └── admin/
│           └── components/
│               └── PageContentEditor/
│                   └── FontPicker.test.tsx  # New - unit tests for font picker
└── integration/
    └── editor-font.integration.test.tsx     # New - integration tests for font persistence
```

**Structure Decision**: Web application with Next.js App Router. Presentation layer components for editor UI, reusing domain constants for available fonts. No new API endpoints needed - font styling is embedded in HTML content.

## Complexity Tracking

No violations to justify - implementation follows existing patterns and reuses existing code.
