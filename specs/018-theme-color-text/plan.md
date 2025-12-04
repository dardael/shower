# Implementation Plan: Inline Text Color in Rich Text Editor

**Branch**: `018-theme-color-text` | **Date**: 2025-12-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/018-theme-color-text/spec.md`

## Summary

Replace the existing theme-color-only mark with a flexible text color mark that allows administrators to apply any color (from preset palette or custom picker) to selected text in the Tiptap editor. The color is stored inline in the HTML content and rendered on public pages.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router  
**Primary Dependencies**: @tiptap/react, @tiptap/starter-kit, @tiptap/core, Chakra UI v3  
**Storage**: MongoDB via Mongoose (page content stored as HTML string)  
**Testing**: Jest for unit tests (explicitly requested: add color, remove color, public display)  
**Target Platform**: Web (Next.js SSR/CSR)  
**Project Type**: Web application (Next.js full-stack)  
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)  
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, consistent theme color usage, YAGNI (minimal implementation), DRY (no duplication), KISS (simple code)  
**Scale/Scope**: Single-tenant showcase website builder

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Pre-Design | Post-Design | Notes                                                                            |
| ------------------------------------ | ---------- | ----------- | -------------------------------------------------------------------------------- |
| I. Architecture-First Development    | PASS       | PASS        | Presentation layer only (editor component), no domain/application changes needed |
| II. Focused Testing Approach         | PASS       | PASS        | Tests explicitly requested: add color, remove color, public display              |
| III. Simplicity-First Implementation | PASS       | PASS        | No performance monitoring; using official Tiptap extensions                      |
| IV. Security by Default              | PASS       | PASS        | Editor is admin-only (protected); DOMPurify sanitization on public side          |
| V. Clean Architecture Compliance     | PASS       | PASS        | Changes isolated to presentation layer                                           |
| VI. Accessibility-First Design       | PASS       | PASS        | Color picker UI will use Chakra UI; admin responsible for color contrast choices |
| VII. YAGNI                           | PASS       | PASS        | Minimal: Color + TextStyle extensions + ColorPicker component only               |
| VIII. DRY                            | PASS       | PASS        | Using official Tiptap extensions instead of custom implementation                |
| IX. KISS                             | PASS       | PASS        | Simple integration pattern; preset palette + hex input                           |

**Gate Status**: PASS - Ready for `/speckit.tasks`

## Project Structure

### Documentation (this feature)

```text
specs/018-theme-color-text/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no API changes)
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── presentation/
│   ├── admin/
│   │   └── components/
│   │       └── PageContentEditor/
│   │           ├── TiptapEditor.tsx       # UPDATE: Replace ThemeColorMark with TextColorMark, add color picker
│   │           ├── ColorPicker.tsx        # NEW: Preset palette + custom color picker component
│   │           ├── ThemeColorMark.ts      # DELETE: Replace with Tiptap Color extension
│   │           └── tiptap-styles.css      # UPDATE: Remove theme-color-text styles
│   └── shared/
│       └── components/
│           └── PublicPageContent/
│               ├── PublicPageContent.tsx  # NO CHANGE: style attribute already allowed
│               └── public-page-content.css # UPDATE: Add legacy fallback for theme-color-text

test/
└── unit/
    └── presentation/
        ├── admin/
        │   └── components/
        │       └── PageContentEditor/
        │           └── ColorPicker.test.tsx  # NEW: Test color application and removal
        └── shared/
            └── components/
                └── PublicPageContent/
                    └── PublicPageContent.test.tsx  # NEW: Test colored text rendering
```

**Structure Decision**: Presentation layer only. The text color is stored inline in the HTML content (via style attribute), so no domain or infrastructure changes are needed.

## Complexity Tracking

> No violations - all gates pass.
