# Quickstart: Editor Image Upload

**Feature**: 015-editor-image-upload  
**Date**: 2025-12-03

## What This Feature Does

Enables administrators to upload images directly from their computer into the page content rich text editor. Images can be added via:

- Toolbar button (file picker)
- Drag and drop
- Clipboard paste (Ctrl+V / Cmd+V)

Uploaded images are stored on the server and displayed to public users when viewing page content.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    TiptapEditor Component                    │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Toolbar: [Bold][Italic]...[Image Upload Button]         ││
│  ├─────────────────────────────────────────────────────────┤│
│  │ Editor Content Area                                      ││
│  │   - Handles drag-and-drop                               ││
│  │   - Handles clipboard paste                             ││
│  └─────────────────────────────────────────────────────────┘│
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ fetch('/api/page-content-images')
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              POST /api/page-content-images                   │
│  - Validates file type (PNG, JPG, GIF, WebP)                │
│  - Validates file size (max 5MB)                            │
│  - Saves to public/page-content-images/                     │
│  - Returns image URL                                         │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              GET /api/page-content-images/[filename]         │
│  - Serves image files publicly                               │
│  - 1-year cache headers                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Files to Modify

### Infrastructure Layer

**1. FileStorageService** (`src/infrastructure/shared/services/FileStorageService.ts`)

- Add `uploadPageContentImage()` method
- Add `deletePageContentImage()` method
- Add `PAGE_CONTENT_IMAGE_CONFIG` constant
- Update `IFileStorageService` interface

### API Layer

**2. Upload Endpoint** (`src/app/api/page-content-images/route.ts`) - NEW

- POST handler for image uploads
- Uses `withApi({ requireAuth: true })` wrapper
- Calls `FileStorageService.uploadPageContentImage()`

**3. Serve Endpoint** (`src/app/api/page-content-images/[filename]/route.ts`) - NEW

- GET handler for serving images
- Public access (no auth required)
- Path traversal protection

### Presentation Layer

**4. TiptapEditor** (`src/presentation/admin/components/PageContentEditor/TiptapEditor.tsx`)

- Replace URL input with file upload
- Add `handleImageUpload()` function
- Add drag-and-drop handler via `editorProps.handleDrop`
- Add paste handler via `editorProps.handlePaste`
- Add loading state during upload

---

## Implementation Steps

### Step 1: Extend FileStorageService

```typescript
// Add to IFileStorageService interface
uploadPageContentImage(file: File): Promise<{ url: string; metadata: IIconMetadata }>;
deletePageContentImage(filename: string): Promise<void>;

// Add configuration
const PAGE_CONTENT_IMAGE_CONFIG: UploadConfig = {
  allowedTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
  maxSizeBytes: 5 * 1024 * 1024,
  filenamePrefix: 'page-content',
  defaultExtension: 'png',
  typeErrorMessage: 'Invalid file type. Only PNG, JPG, GIF, and WebP files are allowed.',
  sizeErrorMessage: 'File size must be less than 5MB.',
  entityName: 'page content image',
};
```

### Step 2: Create Upload API Endpoint

```typescript
// src/app/api/page-content-images/route.ts
import { withApi } from '@/infrastructure/shared/api/withApi';
import { container } from '@/infrastructure/container';
import { IFileStorageService } from '@/infrastructure/shared/services/FileStorageService';

export const POST = withApi(
  async (request: Request) => {
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No image file provided.' }),
        {
          status: 400,
        }
      );
    }

    const fileStorage = container.resolve<IFileStorageService>(
      'IFileStorageService'
    );
    const { url, metadata } = await fileStorage.uploadPageContentImage(file);

    return new Response(
      JSON.stringify({
        message: 'Image uploaded successfully',
        image: { url, ...metadata },
      }),
      { status: 201 }
    );
  },
  { requireAuth: true }
);
```

### Step 3: Create Serve API Endpoint

```typescript
// src/app/api/page-content-images/[filename]/route.ts
// Follow pattern from /api/icons/[filename]/route.ts
// - Sanitize filename
// - Validate file exists in public/page-content-images/
// - Serve with appropriate Content-Type and Cache-Control headers
```

### Step 4: Update TiptapEditor

```typescript
// Key additions to TiptapEditor.tsx

// State for upload progress
const [isUploading, setIsUploading] = useState(false);

// Upload function
const uploadImage = async (file: File): Promise<void> => {
  setIsUploading(true);
  try {
    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch('/api/page-content-images', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    const { image } = await response.json();
    editor?.chain().focus().setImage({ src: image.url }).run();
  } catch (error) {
    // Show toast error
  } finally {
    setIsUploading(false);
  }
};

// Editor props for drag-drop and paste
editorProps: {
  handleDrop: (view, event, slice, moved) => {
    if (moved) return false;
    const file = event.dataTransfer?.files[0];
    if (file?.type.startsWith('image/')) {
      uploadImage(file);
      return true;
    }
    return false;
  },
  handlePaste: (view, event, slice) => {
    const item = Array.from(event.clipboardData?.items || [])
      .find(item => item.type.startsWith('image/'));
    if (item) {
      const file = item.getAsFile();
      if (file) {
        uploadImage(file);
        return true;
      }
    }
    return false;
  },
}
```

---

## Testing Checklist

### Manual Testing

1. **Toolbar Upload**
   - [ ] Click image button → file picker opens
   - [ ] Select valid image → image appears in editor
   - [ ] Loading spinner shows during upload

2. **Drag and Drop**
   - [ ] Drag image file into editor → image uploads and appears
   - [ ] Non-image files are ignored

3. **Clipboard Paste**
   - [ ] Copy image → paste in editor → image uploads and appears
   - [ ] Paste text is not affected

4. **Validation**
   - [ ] Upload file > 5MB → error message
   - [ ] Upload non-image file → error message

5. **Public Display**
   - [ ] Save page with images → view public page → images visible

---

## Dependencies

No new npm packages required. Uses existing:

- `@tiptap/extension-image` (already installed)
- Chakra UI components (already available)
