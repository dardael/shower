# Implementation Plan: Image Full Width Button

**Branch**: `023-image-full-width` | **Date**: 2025-12-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/023-image-full-width/spec.md`

## Summary

Add a dedicated full-width toggle button to the rich text editor toolbar that allows administrators to expand images (both plain and with text overlay) to 100% of the container width. The button will appear only when an image is selected and provide visual feedback for its active state.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router
**Primary Dependencies**: Tiptap (@tiptap/react, @tiptap/extension-image, @tiptap/core), Chakra UI v3, React 19
**Storage**: MongoDB via Mongoose (page content stored as HTML string)
**Testing**: Jest for unit tests and integration tests (explicitly requested by user)
**Target Platform**: Web browser (admin dashboard and public pages)
**Project Type**: Web application (Next.js monolith with admin and public sections)
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, consistent theme color usage, YAGNI (minimal implementation), DRY (no duplication), KISS (simple code)
**Scale/Scope**: Single feature addition to existing rich text editor

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Gate                    | Requirement                                  | Status                                                            |
| ----------------------- | -------------------------------------------- | ----------------------------------------------------------------- |
| I. Architecture-First   | Follow DDD/Hexagonal patterns                | PASS - Extends existing Tiptap extension architecture             |
| II. Focused Testing     | Unit + Integration tests only when requested | PASS - User explicitly requested tests for button and public page |
| III. Simplicity-First   | No performance monitoring in production      | PASS - Feature is UI toggle, no monitoring needed                 |
| IV. Security by Default | Admin functionality protected                | PASS - Editor already within admin-protected routes               |
| V. Clean Architecture   | Proper layer separation                      | PASS - Changes in Presentation layer only                         |
| VI. Accessibility-First | Proper contrast in light/dark modes          | PASS - Using existing Chakra UI button patterns                   |
| VII. YAGNI              | Minimal implementation                       | PASS - Only adding required full-width toggle                     |
| VIII. DRY               | No code duplication                          | PASS - Will extend existing patterns                              |
| IX. KISS                | Simple, readable code                        | PASS - Simple boolean attribute toggle                            |

## Project Structure

### Documentation (this feature)

```text
specs/023-image-full-width/
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
│               ├── TiptapEditor.tsx          # Add full-width button to toolbar
│               ├── extensions/
│               │   └── ImageWithOverlay.ts   # Add fullWidth attribute
│               └── tiptap-styles.css         # Add full-width editor styles
├── presentation/
│   └── shared/
│       └── components/
│           └── PublicPageContent/
│               └── public-page-content.css   # Add full-width public styles

test/
├── integration/
│   └── image-full-width.integration.test.tsx  # NEW - Public page full-width test
├── unit/
│   └── presentation/
│       └── admin/
│           └── components/
│               └── PageContentEditor/
│                   └── FullWidthButton.test.tsx  # NEW - Button functionality test
```

**Structure Decision**: Follows existing Presentation layer structure. Editor changes in admin components, public rendering changes in shared components. Tests follow existing integration test patterns.

## Complexity Tracking

No violations identified. Feature is a simple extension of existing patterns.
