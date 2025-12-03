# Feature Specification: Editor Image Upload

**Feature Branch**: `015-editor-image-upload`  
**Created**: 2025-12-03  
**Status**: Draft  
**Input**: User description: "as an administrator, i want the possibility to upload images from my computer into the page content in the rich text editor. i want this images to be visible in the public side"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Administrator Uploads Image in Rich Text Editor (Priority: P1)

As an administrator editing page content, I want to upload an image from my computer directly into the rich text editor so that I can include visual content in my pages without needing external image hosting.

**Why this priority**: This is the core functionality - uploading images is the primary capability requested. Without this, the feature has no value.

**Independent Test**: Can be fully tested by opening the page content editor, clicking the image upload button, selecting an image file from the computer, and verifying it appears in the editor.

**Acceptance Scenarios**:

1. **Given** I am logged in as an administrator and editing page content, **When** I click the image upload button in the editor toolbar, **Then** I see a file selection dialog allowing me to choose an image from my computer.
2. **Given** I have selected an image file from my computer, **When** the upload completes, **Then** the image is inserted at the current cursor position in the editor.
3. **Given** I am uploading an image, **When** the upload is in progress, **Then** I see a visual indicator that the upload is processing.
4. **Given** I have inserted an uploaded image, **When** I save the page content, **Then** the image reference is persisted with the content.

---

### User Story 2 - Public User Views Uploaded Images (Priority: P1)

As a public user visiting a page, I want to see the images that the administrator uploaded so that I can view the complete visual content of the page.

**Why this priority**: This is tied with P1 as it represents the user-facing value - images must be visible on the public side for the feature to be complete.

**Independent Test**: Can be tested by navigating to a page that contains uploaded images and verifying all images display correctly.

**Acceptance Scenarios**:

1. **Given** a page contains uploaded images, **When** I navigate to that page as a public user, **Then** I see all uploaded images displayed correctly.
2. **Given** I am viewing a page with images, **When** the page loads, **Then** images load within a reasonable time and display at appropriate sizes.
3. **Given** I am viewing a page with images on different devices, **When** I resize my browser or view on mobile, **Then** images scale appropriately to fit the viewport.

---

### User Story 3 - Administrator Handles Upload Errors (Priority: P2)

As an administrator, I want to receive clear feedback when an image upload fails so that I can understand what went wrong and take corrective action.

**Why this priority**: Error handling is essential for a good user experience, but secondary to the core upload functionality.

**Independent Test**: Can be tested by attempting to upload invalid files or oversized images and verifying appropriate error messages are displayed.

**Acceptance Scenarios**:

1. **Given** I attempt to upload a file that is not a valid image format, **When** the validation fails, **Then** I see an error message explaining that only image files are accepted.
2. **Given** I attempt to upload an image that exceeds the maximum file size, **When** the validation fails, **Then** I see an error message indicating the file is too large and what the limit is.
3. **Given** a network error occurs during upload, **When** the upload fails, **Then** I see an error message and can retry the upload.

---

### Edge Cases

- What happens when an administrator uploads a very large image? The system validates file size before upload and rejects files exceeding 5MB with a clear error message.
- What happens when an administrator tries to upload a non-image file (e.g., PDF, document)? The system validates file type and only accepts common image formats (JPEG, PNG, GIF, WebP).
- What happens when the same image is uploaded multiple times? Each upload creates a new file; duplicate detection is not required.
- What happens when an uploaded image is removed from the editor content but the file remains on the server? Orphaned image files will remain on the server; cleanup is out of scope for this feature.
- What happens when an administrator pastes an image from clipboard? The system handles clipboard paste and uploads the pasted image automatically.
- What happens when an image upload fails mid-way? The system displays an error message and allows the administrator to retry; partial uploads are cleaned up.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST allow administrators to upload images from their computer into the page content editor
- **FR-002**: System MUST insert uploaded images at the current cursor position in the editor
- **FR-003**: System MUST display an upload progress indicator during image upload
- **FR-004**: System MUST display uploaded images on the public page when visitors view the content
- **FR-005**: System MUST validate that uploaded files are images (JPEG, PNG, GIF, WebP formats)
- **FR-006**: System MUST validate that uploaded images do not exceed 5MB in size
- **FR-007**: System MUST display clear error messages when image upload validation fails
- **FR-008**: System MUST display error messages when image upload fails due to network or server errors
- **FR-009**: System MUST persist uploaded images so they remain accessible after page refresh
- **FR-010**: System MUST support drag-and-drop of images into the editor
- **FR-011**: System MUST support pasting images from clipboard into the editor
- **FR-012**: System MUST ensure proper contrast ratios for any image-related UI elements in both light and dark modes
- **FR-013**: System MUST implement only strict minimum required for current feature (YAGNI principle)
- **FR-014**: System MUST avoid duplication through reusable functions and components (DRY principle)
- **FR-015**: System MUST be simple, readable, and clear with straightforward implementations (KISS principle)

### Key Entities

- **PageContentImage**: Represents an uploaded image file. Contains a unique identifier, original filename, stored file path, file size, MIME type, and upload timestamp. Images are referenced within page content HTML by their accessible URL.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Administrators can upload an image and see it appear in the editor within 5 seconds for files under 2MB
- **SC-002**: 100% of uploaded images display correctly on the public page
- **SC-003**: Image upload validation provides feedback within 1 second for invalid files
- **SC-004**: Images on the public page load within 3 seconds for average-sized images (under 1MB)
- **SC-005**: Uploaded images are responsive and scale appropriately on viewports from 320px to 1920px wide

## Assumptions

- The administrator is already authenticated via the existing authentication system
- The page content editor (Tiptap) is already implemented and functional
- The existing file upload infrastructure can be extended for page content images
- Images will be stored on the local file system in the same manner as website icons and logos
- Uploaded images will be accessible via a public URL that can be embedded in HTML content
- The maximum image file size of 5MB is appropriate for most use cases
- Image dimension limits are not required; images will be displayed responsively
- Image optimization (compression, resizing) is not required for this feature
- The system serves static files directly without CDN requirements

## Out of Scope

- Image cropping or editing within the editor
- Image optimization or compression before upload
- Image alt text editing (images will be inserted without alt text)
- Image gallery or library for reusing previously uploaded images
- Bulk image upload functionality
- Automatic cleanup of orphaned images (images no longer referenced in content)
- Image CDN integration
- Video or other media file uploads
- Image dimension restrictions or automatic resizing
