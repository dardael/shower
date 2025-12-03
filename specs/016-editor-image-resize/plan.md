# Implementation Plan: Editor Image Resize and Move

**Branch**: `016-editor-image-resize` | **Date**: 2025-12-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/016-editor-image-resize/spec.md`

## Summary

Add image resize and move capabilities to the page content editor, allowing administrators to resize images by dragging corner handles (maintaining aspect ratio) and reposition images within the content via drag-and-drop. This extends the existing Tiptap image implementation (spec 015) with resize configuration and drag-drop functionality.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router  
**Primary Dependencies**: @tiptap/extension-image (v3.11.1), @tiptap/react, Chakra UI v3  
**Storage**: MongoDB via Mongoose (page content stored as HTML string with inline styles for dimensions)  
**Testing**: Jest for unit tests and integration tests (only when explicitly requested)  
**Target Platform**: Web application (desktop and tablet browsers)
**Project Type**: Web application with Next.js App Router  
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)  
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, consistent theme color usage, YAGNI (minimal implementation), DRY (no duplication), KISS (simple code)  
**Scale/Scope**: Single admin user editing page content, responsive public display

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Gate                                 | Status | Notes                                                    |
| ------------------------------------ | ------ | -------------------------------------------------------- |
| I. Architecture-First Development    | PASS   | Presentation layer only - extends TiptapEditor component |
| II. Focused Testing Approach         | PASS   | No tests unless explicitly requested                     |
| III. Simplicity-First Implementation | PASS   | Use built-in Tiptap resize configuration                 |
| IV. Security by Default              | PASS   | Admin-only functionality via existing auth               |
| V. Clean Architecture Compliance     | PASS   | Component-level changes in presentation layer            |
| VI. Accessibility-First Design       | PASS   | Resize handles visible in light/dark modes               |
| VII. YAGNI                           | PASS   | Only resize + move, no cropping/rotation/etc             |
| VIII. DRY                            | PASS   | Use Tiptap's built-in resize, minimal custom code        |
| IX. KISS                             | PASS   | Configure existing extension, not build from scratch     |

## Project Structure

### Documentation (this feature)

```text
specs/016-editor-image-resize/
├── plan.md              # This file
├── research.md          # Phase 0 output - Tiptap resize approach
├── data-model.md        # Phase 1 output - Image dimension attributes
├── quickstart.md        # Phase 1 output - Implementation steps
├── contracts/           # Phase 1 output - N/A (frontend-only)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── presentation/
│   ├── admin/
│   │   └── components/
│   │       └── PageContentEditor/
│   │           ├── TiptapEditor.tsx        # Add resize config to Image extension
│   │           └── tiptap-styles.css       # Add resize handle styling
│   └── shared/
│       └── components/
│           └── PublicPageContent/
│               └── public-page-content.css # Ensure inline styles work
```

**Structure Decision**: Minimal changes to existing presentation layer components. No new layers or services required - image dimensions stored as inline styles within the HTML content string.

## Complexity Tracking

No complexity violations detected. Implementation uses built-in Tiptap features.
