# Research: Editor Image Upload

**Feature**: 015-editor-image-upload  
**Date**: 2025-12-03

## Research Summary

All technical decisions have been resolved. No NEEDS CLARIFICATION items remain.

---

## 1. Tiptap Image Upload Integration

### Decision

Use hidden file input triggered by toolbar button, with drag-and-drop and paste handling via Tiptap editor events. No need for external ImageUploadNode extension.

### Rationale

- The existing Tiptap Image extension already supports `setImage({ src })` command
- A simple file input + fetch upload pattern is simpler than installing additional extensions
- Drag-and-drop and paste can be handled via editor's `handleDrop` and `handlePaste` callbacks
- Keeps dependencies minimal (YAGNI principle)

### Alternatives Considered

1. **Tiptap ImageUploadNode extension** - Requires additional dependency (@tiptap-pro or custom build), adds complexity
2. **Tiptap FileHandler extension** - Pro feature, not available in open source
3. **Third-party upload component** - Would introduce new dependencies and patterns

### Implementation Pattern

```typescript
// Trigger file input from toolbar button
const handleImageUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await fetch('/api/page-content-images', {
    method: 'POST',
    body: formData,
  });
  const { url } = await response.json();
  editor.chain().focus().setImage({ src: url }).run();
};

// Handle paste/drop via editor configuration
useEditor({
  // ... existing extensions
  editorProps: {
    handleDrop: (view, event, slice, moved) => {
      /* upload dropped images */
    },
    handlePaste: (view, event, slice) => {
      /* upload pasted images */
    },
  },
});
```

---

## 2. File Storage Strategy

### Decision

Extend existing `FileStorageService` with new `uploadPageContentImage` and `deletePageContentImage` methods. Store files in `public/page-content-images/` directory.

### Rationale

- Follows DRY principle by reusing existing storage infrastructure
- Consistent patterns with icon/logo uploads
- Separate directory prevents collision with other file types
- Same security and validation patterns already proven

### Alternatives Considered

1. **Store in same icons directory** - Could cause filename collisions, harder to manage
2. **Cloud storage (S3)** - Out of scope per spec, adds complexity
3. **Database blob storage** - Poor performance for large files, not standard pattern

### Configuration

```typescript
const PAGE_CONTENT_IMAGE_CONFIG: UploadConfig = {
  allowedTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
  maxSizeBytes: 5 * 1024 * 1024, // 5MB per spec FR-006
  filenamePrefix: 'page-content',
  defaultExtension: 'png',
  typeErrorMessage:
    'Invalid file type. Only PNG, JPG, GIF, and WebP files are allowed.',
  sizeErrorMessage: 'File size must be less than 5MB.',
  entityName: 'page content image',
};
```

---

## 3. API Endpoint Design

### Decision

Create two endpoints following existing patterns:

- `POST /api/page-content-images` - Upload new image
- `GET /api/page-content-images/[filename]` - Serve uploaded image

### Rationale

- Matches existing `/api/icons/[filename]` pattern
- RESTful design
- Separate from settings endpoints (page content images are distinct resource)
- Admin-only upload, public read access

### Alternatives Considered

1. **Embed in existing settings API** - Violates single responsibility, clutters settings
2. **Generic /api/uploads endpoint** - Too broad, loses semantic meaning
3. **Include in page content API** - Mixes concerns, complicates page content endpoint

---

## 4. Upload Progress Indication

### Decision

Use simple loading spinner/overlay in editor during upload. No progress bar for individual file percentage.

### Rationale

- KISS principle - simpler implementation
- 5MB max file size means uploads are typically < 5 seconds on standard connections
- Progress bar adds complexity without significant UX benefit for small files
- Existing patterns in codebase use simple loading states

### Alternatives Considered

1. **XMLHttpRequest with progress events** - More complex, marginal benefit
2. **No progress indication** - Poor UX, users won't know upload is happening
3. **Toast notifications** - Already available via existing toast system for errors

---

## 5. Drag-and-Drop and Clipboard Paste

### Decision

Handle via Tiptap editor's `editorProps.handleDrop` and `editorProps.handlePaste` callbacks.

### Rationale

- Native Tiptap approach, no additional dependencies
- Full control over upload behavior
- Can reuse same upload function as toolbar button
- Intercepts events before default handling

### Implementation Pattern

```typescript
editorProps: {
  handleDrop: (view, event, slice, moved) => {
    if (moved) return false;
    const files = event.dataTransfer?.files;
    if (files?.length) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        uploadImage(file);
        return true;
      }
    }
    return false;
  },
  handlePaste: (view, event, slice) => {
    const items = event.clipboardData?.items;
    for (const item of items || []) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          uploadImage(file);
          return true;
        }
      }
    }
    return false;
  },
}
```

---

## 6. Image Metadata Storage

### Decision

Do not persist image metadata in database. Images are referenced directly by URL in page content HTML.

### Rationale

- YAGNI - No features require image metadata (no gallery, no cleanup)
- Simpler architecture - images are self-contained files
- Page content already stores image references in HTML
- Follows existing pattern where icon/logo metadata is stored with website settings, not separately

### Alternatives Considered

1. **MongoDB collection for images** - Adds complexity, no current use case
2. **Store with PageContent entity** - Couples image storage to content, complicates model

---

## 7. Error Handling Strategy

### Decision

Return structured error responses from API, display via existing toast notification system.

### Rationale

- Consistent with existing error handling patterns
- User-friendly feedback
- Existing toast infrastructure already in place
- Clear error messages per FR-007 and FR-008

### Error Response Format

```typescript
// Success
{ url: string, filename: string, size: number }

// Error
{ error: string, code?: string }
```

---

## 8. Security Considerations

### Decision

Admin authentication required for upload, file type validation server-side, path traversal protection for serving.

### Rationale

- Matches security requirements from constitution
- Prevents malicious file uploads
- Follows existing security patterns from icon/logo uploads

### Security Measures

1. **Authentication**: `withApi({ requireAuth: true })` wrapper
2. **File type validation**: Server-side MIME type check
3. **File size validation**: Server-side size limit
4. **Filename sanitization**: Use existing `sanitizeFilename` utility
5. **Path traversal protection**: Validate filename before serving

---

## Dependencies

No new package dependencies required. All functionality can be implemented using:

- Existing `@tiptap/extension-image`
- Existing file upload infrastructure
- Existing UI components (IconButton, Spinner from Chakra UI)
