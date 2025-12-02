# Implementation Plan: Theme Color Text Formatting

**Branch**: `012-theme-color-text` | **Date**: 2025-12-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/012-theme-color-text/spec.md`

## Summary

Add a theme color button to the rich text editor toolbar that allows administrators to apply the website's configured theme color to selected text. The implementation uses a custom Tiptap mark extension that applies a CSS class, enabling dynamic color updates when the theme color is changed in settings.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router  
**Primary Dependencies**: Tiptap 3.11.x (@tiptap/react, @tiptap/core), Chakra UI v3, react-icons  
**Storage**: MongoDB via Mongoose (page content stored as HTML string)  
**Testing**: Jest for unit tests and integration tests (only when explicitly requested)  
**Target Platform**: Web (Next.js App Router with SSR)  
**Project Type**: Web application (Next.js monolith)  
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)  
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, consistent theme color usage, YAGNI (minimal implementation), DRY (no duplication), KISS (simple code)  
**Scale/Scope**: Single admin user editing pages, public viewers

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Status | Notes                                                            |
| ------------------------------------ | ------ | ---------------------------------------------------------------- |
| I. Architecture-First Development    | PASS   | Custom Tiptap extension in Presentation layer, CSS for styling   |
| II. Focused Testing Approach         | PASS   | No tests unless explicitly requested                             |
| III. Simplicity-First Implementation | PASS   | No performance monitoring, simple mark extension                 |
| IV. Security by Default              | N/A    | No security implications - formatting feature in admin area      |
| V. Clean Architecture Compliance     | PASS   | Extension isolated in Presentation layer, no domain impact       |
| VI. Accessibility-First Design       | PASS   | Uses Chakra semantic tokens with proper contrast                 |
| VII. YAGNI                           | PASS   | Only implementing toggle mark, no color picker, no custom colors |
| VIII. DRY                            | PASS   | Reuses existing toolbar button pattern, CSS variable system      |
| IX. KISS                             | PASS   | Simple mark extension with CSS class approach                    |

**Gate Status**: PASSED - All applicable principles satisfied

### Post-Design Review (Phase 1 Complete)

| Principle             | Re-check | Notes                                         |
| --------------------- | -------- | --------------------------------------------- |
| I. Architecture-First | PASS     | ThemeColorMark.ts in Presentation layer only  |
| V. Clean Architecture | PASS     | No domain/application layer changes           |
| VI. Accessibility     | PASS     | CSS uses semantic tokens, works in light/dark |
| VII. YAGNI            | PASS     | ~55 lines of code, no over-engineering        |
| VIII. DRY             | PASS     | Reuses existing patterns (toolbar, CSS vars)  |
| IX. KISS              | PASS     | Single extension file, single CSS rule        |

**Post-Design Gate Status**: PASSED

## Project Structure

### Documentation (this feature)

```text
specs/012-theme-color-text/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no API changes)
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── presentation/
│   ├── admin/
│   │   └── components/
│   │       └── PageContentEditor/
│   │           ├── TiptapEditor.tsx          # Modified: Add color button
│   │           ├── ThemeColorMark.ts         # New: Custom Tiptap mark extension
│   │           └── tiptap-styles.css         # Modified: Add theme-color-text style
│   └── shared/
│       └── theme.ts                          # Reference: CSS variables already defined
```

**Structure Decision**: Minimal changes to existing structure. New ThemeColorMark extension file in PageContentEditor folder alongside TiptapEditor. CSS updates in existing tiptap-styles.css file.

## Complexity Tracking

> No violations to justify - implementation follows all constitution principles.
