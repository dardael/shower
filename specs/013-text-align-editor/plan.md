# Implementation Plan: Text Alignment in Rich Text Editor

**Branch**: `013-text-align-editor` | **Date**: 2025-12-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/013-text-align-editor/spec.md`

## Summary

Add text alignment functionality (left, center, right, justify) to the Tiptap rich text editor with toolbar buttons styled consistently with existing buttons. Alignment must persist through save/load and render correctly on public-facing pages.

## Technical Context

**Language/Version**: TypeScript 5.0+ with Next.js 15 App Router  
**Primary Dependencies**: Tiptap (@tiptap/react, @tiptap/extension-text-align), Chakra UI v3, react-icons  
**Storage**: MongoDB via Mongoose (existing PageContent entity - no schema changes needed)  
**Testing**: Jest for unit tests and integration tests (only when explicitly requested)  
**Target Platform**: Web application (browser)  
**Project Type**: Web application with DDD/Hexagonal architecture  
**Performance Goals**: Simplicity over performance monitoring (no performance monitoring in final code)  
**Constraints**: No performance monitoring in production code, simplicity-first approach, proper contrast for light/dark modes, consistent theme color usage, YAGNI (minimal implementation), DRY (no duplication), KISS (simple code)  
**Scale/Scope**: Single admin user editing page content

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Status | Notes                                                          |
| ------------------------------------ | ------ | -------------------------------------------------------------- |
| I. Architecture-First Development    | PASS   | Presentation layer only - no domain/application changes needed |
| II. Focused Testing Approach         | PASS   | Tests only when explicitly requested                           |
| III. Simplicity-First Implementation | PASS   | No performance monitoring, simple button additions             |
| IV. Security by Default              | PASS   | Admin-only editor, DOMPurify sanitization for public display   |
| V. Clean Architecture Compliance     | PASS   | Changes isolated to presentation layer                         |
| VI. Accessibility-First Design       | PASS   | Toolbar buttons follow existing contrast patterns              |
| VII. YAGNI                           | PASS   | Only implementing 4 alignment options as specified             |
| VIII. DRY                            | PASS   | Reusing existing IconButton patterns                           |
| IX. KISS                             | PASS   | Simple Tiptap extension + CSS styles                           |

## Project Structure

### Documentation (this feature)

```text
specs/013-text-align-editor/
├── plan.md              # This file
├── research.md          # Phase 0 output - Tiptap text-align research
├── data-model.md        # Phase 1 output - No changes needed
├── quickstart.md        # Phase 1 output - Implementation guide
├── contracts/           # Phase 1 output - No API changes
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── presentation/
│   ├── admin/
│   │   └── components/
│   │       └── PageContentEditor/
│   │           ├── TiptapEditor.tsx          # Add alignment buttons + extension
│   │           └── tiptap-styles.css         # Add alignment CSS
│   └── shared/
│       └── components/
│           └── PublicPageContent/
│               ├── PublicPageContent.tsx     # Add 'style' to ALLOWED_ATTR
│               └── public-page-content.css   # Add alignment CSS
```

**Structure Decision**: Changes are isolated to the presentation layer. The Tiptap text-align extension stores alignment as inline styles (`style="text-align: center"`), which are already supported by HTML and require only CSS and sanitization updates.

## Implementation Overview

### Phase 0: Research (Completed)

- Tiptap `@tiptap/extension-text-align` provides all required functionality
- Extension stores alignment as `style="text-align: X"` on paragraph/heading nodes
- Commands: `setTextAlign('left'|'center'|'right'|'justify')`
- State detection: `editor.isActive({ textAlign: 'center' })`

### Phase 1: Design

1. **Editor Changes** (TiptapEditor.tsx):
   - Add `@tiptap/extension-text-align` to extensions
   - Add 4 alignment IconButtons following existing pattern
   - Use react-icons: `FiAlignLeft`, `FiAlignCenter`, `FiAlignRight`, `FiAlignJustify`

2. **Style Changes**:
   - Add CSS for text-align in both editor and public stylesheets
   - Use simple CSS: `.tiptap p[style*="text-align: center"] { text-align: center; }`

3. **Sanitization Update** (PublicPageContent.tsx):
   - Add `'style'` to `ALLOWED_ATTR` array for DOMPurify

### No Changes Required

- **Data Model**: Alignment is stored in HTML content (existing `content` field)
- **API Contracts**: No new endpoints - existing save/load works
- **Database Schema**: No changes needed
