# Research: Page Content Management

**Date**: 2025-12-01  
**Feature**: 011-page-content-management

## Research Topics

### 1. Rich Text Editor Selection

**Requirement**: Free, production-ready rich text editor with image support and Chakra UI theme color compatibility.

#### Evaluated Options

| Editor                      | License                      | Image Support                     | React Support           | Theming                    | Production Ready | Notes                                  |
| --------------------------- | ---------------------------- | --------------------------------- | ----------------------- | -------------------------- | ---------------- | -------------------------------------- |
| **Tiptap**                  | MIT (core + open extensions) | Yes (via @tiptap/extension-image) | Native (@tiptap/react)  | Headless, CSS customizable | Yes              | Highly extensible, ProseMirror-based   |
| **Quill** (react-quill-new) | BSD-3-Clause                 | Yes (built-in)                    | Via wrapper             | CSS themes (snow, bubble)  | Yes              | Mature, widely used                    |
| **Lexical** (Facebook)      | MIT                          | Yes (custom node)                 | Native (@lexical/react) | Headless, CSS customizable | Yes              | Modern, extensible, framework-agnostic |
| **Slate**                   | MIT                          | Custom implementation             | Native (slate-react)    | Fully customizable         | Beta             | Low-level, requires more work          |

#### Decision: **Tiptap**

**Rationale**:

1. **MIT License**: Core and commonly-used extensions (including Image) are MIT licensed, fully free for production use
2. **Native Image Support**: `@tiptap/extension-image` provides out-of-box image handling with configuration for:
   - Custom HTML attributes (for applying Chakra theme classes)
   - Inline vs block display
   - Image resizing
3. **Headless Architecture**: No built-in UI means we can style everything with Chakra UI components
4. **React Native Support**: First-class React bindings with `@tiptap/react`
5. **Extensible**: Easy to add custom extensions for theme-colored headings
6. **Active Maintenance**: Strong community, regular updates
7. **ProseMirror Foundation**: Battle-tested underlying editor framework

**Chakra UI Theme Color Integration**:

- Tiptap's headless design allows us to:
  - Create custom CSS that references Chakra's semantic tokens
  - Build toolbar components using Chakra UI buttons/icons
  - Style headings with the configured theme color using CSS custom properties

**Alternatives Rejected**:

- **Quill**: Pre-styled themes harder to customize with Chakra; wrapper layer adds complexity
- **Lexical**: More low-level, requires more custom code for basic features
- **Slate**: Still in beta, requires implementing most features from scratch
- **Custom Editor**: Would require significant development time for basic features

### 2. Content Storage Format

**Decision**: HTML

**Rationale**:

- Tiptap outputs HTML natively
- HTML is human-readable and can be rendered directly
- Compatible with server-side rendering
- Easy to sanitize for security (DOMPurify or similar)

**Alternatives Considered**:

- JSON (ProseMirror format): More structured but requires conversion for display
- Markdown: Would lose some formatting capabilities

### 3. Image Storage Strategy

**Decision**: URL-based references (no file upload in initial implementation)

**Rationale**:

- Per YAGNI principle, start with URL-based images
- Administrators paste image URLs from external hosting
- Avoids need for file storage infrastructure
- Can add file upload as future enhancement

**Image Data Flow**:

1. Admin pastes/enters image URL in editor
2. URL stored in content HTML as `<img src="...">` tag
3. Public page renders image from external URL

### 4. PageContent Entity Design

**Decision**: Separate PageContent entity linked to MenuItem by ID

**Rationale**:

- Follows Single Responsibility Principle
- Content can evolve independently of menu structure
- Enables future features (multiple content blocks, versioning)
- Cascade delete when MenuItem is removed

**Entity Structure**:

```
PageContent:
  - id: unique identifier
  - menuItemId: reference to MenuItem (foreign key)
  - content: HTML string
  - createdAt: timestamp
  - updatedAt: timestamp
```

### 5. Test Coverage Strategy

**Decision**: Unit tests for CRUD operations + Integration tests for public display

Per user request and Constitution (Principle II: Focused Testing Approach):

**Unit Tests**:

- PageContent entity validation
- PageContent value objects
- CreatePageContent use case
- UpdatePageContent use case
- DeletePageContent use case
- GetPageContent use case

**Integration Tests**:

- Page content creation via API
- Page content update via API
- Page content deletion via API
- Public page displays correct content
- Empty content placeholder display

### 6. API Design

**Decision**: RESTful endpoints under `/api/settings/pages`

**Endpoints**:

- `GET /api/settings/pages/:menuItemId` - Get content for menu item
- `POST /api/settings/pages` - Create content for menu item
- `PATCH /api/settings/pages/:menuItemId` - Update content
- `DELETE /api/settings/pages/:menuItemId` - Delete content

**Public Endpoint**:

- `GET /api/pages/:menuItemId` - Get published content (no auth required)

## Dependencies to Add

```json
{
  "@tiptap/react": "^2.x",
  "@tiptap/pm": "^2.x",
  "@tiptap/starter-kit": "^2.x",
  "@tiptap/extension-image": "^2.x",
  "@tiptap/extension-link": "^2.x"
}
```

## Open Questions Resolved

| Question                       | Resolution                                          |
| ------------------------------ | --------------------------------------------------- |
| Which rich text editor?        | Tiptap (MIT, image support, headless for Chakra)    |
| Content format?                | HTML                                                |
| Image hosting?                 | External URLs (no file upload initially)            |
| How to integrate theme colors? | CSS custom properties mapped to Chakra tokens       |
| Test scope?                    | Unit tests for CRUD, integration for public display |

## References

- Tiptap Documentation: https://tiptap.dev/docs
- Tiptap Image Extension: https://tiptap.dev/docs/editor/extensions/nodes/image
- Tiptap React: https://tiptap.dev/docs/editor/getting-started/install/react
