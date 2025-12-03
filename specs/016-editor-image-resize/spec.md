# Feature Specification: Editor Image Resize and Move

**Feature Branch**: `016-editor-image-resize`  
**Created**: 2025-12-03  
**Status**: Draft  
**Input**: User description: "as an administrator, i want to can resize or move images that i have uploaded in page content."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Administrator Resizes Image in Editor (Priority: P1)

As an administrator editing page content, I want to resize images I have uploaded so that I can adjust their visual appearance to fit the layout and design of my page without needing external image editing tools.

**Why this priority**: Resizing is the most commonly needed image manipulation - administrators frequently need to adjust image dimensions to fit their content layout. This is the core requested functionality.

**Independent Test**: Can be fully tested by opening the page content editor with an existing image, selecting the image, using resize handles to change its size, and verifying the image displays at the new size both in the editor and on the public page.

**Acceptance Scenarios**:

1. **Given** I am editing page content that contains an uploaded image, **When** I click on the image, **Then** I see visual resize handles appear around the image.
2. **Given** I have selected an image with visible resize handles, **When** I drag a corner handle, **Then** the image resizes proportionally (maintaining aspect ratio).
3. **Given** I am resizing an image, **When** I release the resize handle, **Then** the image retains its new dimensions in the editor.
4. **Given** I have resized an image and saved the page, **When** I view the page publicly, **Then** the image displays at the resized dimensions.
5. **Given** I have resized an image, **When** I reload the editor, **Then** the image retains the dimensions I set.

---

### User Story 2 - Administrator Moves Image Position in Editor (Priority: P1)

As an administrator editing page content, I want to move uploaded images to different positions within the content so that I can place them where they best support the text and layout of my page.

**Why this priority**: Moving images is equally critical to resizing - administrators need both capabilities to properly arrange their page content. Without positioning control, the feature is incomplete.

**Independent Test**: Can be fully tested by opening the page content editor with an existing image, dragging the image to a new position within the content, and verifying it appears at the new location both in the editor and on the public page.

**Acceptance Scenarios**:

1. **Given** I am editing page content that contains an uploaded image, **When** I click and drag the image, **Then** I can move it to a different position within the content.
2. **Given** I am dragging an image, **When** I move it over text content, **Then** I see a visual indicator showing where the image will be placed when I release.
3. **Given** I have moved an image to a new position, **When** I release the drag, **Then** the image is placed at the indicated position.
4. **Given** I have moved an image and saved the page, **When** I view the page publicly, **Then** the image displays in its new position within the content.
5. **Given** I have moved an image, **When** I reload the editor, **Then** the image remains in the position I moved it to.

---

### User Story 3 - Administrator Views Resized Images on Public Page (Priority: P2)

As a public user visiting a page, I want to see images at the sizes the administrator intended so that the page layout appears as designed.

**Why this priority**: This ensures the resize functionality has value - the resized dimensions must persist to the public view. Depends on P1 functionality being complete.

**Independent Test**: Can be tested by navigating to a page that contains resized images and verifying all images display at their configured dimensions.

**Acceptance Scenarios**:

1. **Given** a page contains resized images, **When** I navigate to that page as a public user, **Then** I see all images displayed at their resized dimensions.
2. **Given** I am viewing a page with resized images on different devices, **When** I resize my browser or view on mobile, **Then** images scale proportionally from their resized dimensions to fit the viewport.

---

### Edge Cases

- What happens when an administrator resizes an image to very small dimensions? The system allows resizing but enforces a minimum size (e.g., 50x50 pixels) to ensure images remain visible and selectable.
- What happens when an administrator resizes an image to very large dimensions? The system allows resizing up to the maximum width of the content area; images cannot exceed the editor container width.
- What happens when an administrator tries to resize beyond the original image dimensions? The system allows enlarging images but the display quality may degrade; this is acceptable behavior.
- What happens when an administrator moves an image outside the editable area? The system constrains image movement within the content boundaries; images cannot be dragged outside the editor.
- What happens when an administrator moves an image between text paragraphs? The image is inserted as a block element between paragraphs at the drop location.
- What happens when an administrator clicks on an image but does not drag? The image is selected and resize handles appear; no movement occurs without a drag action.
- What happens on touch devices (tablet, mobile)? The same resize and move functionality works via touch gestures (pinch to resize, touch-drag to move).

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST display resize handles around an image when the administrator clicks/selects it in the editor
- **FR-002**: System MUST allow administrators to resize images by dragging corner handles
- **FR-003**: System MUST maintain image aspect ratio when resizing via corner handles
- **FR-004**: System MUST persist resized image dimensions when the page content is saved
- **FR-005**: System MUST display resized images at their configured dimensions on the public page
- **FR-006**: System MUST allow administrators to drag images to reposition them within the content
- **FR-007**: System MUST display a visual drop indicator when dragging an image to show where it will be placed
- **FR-008**: System MUST persist image position when the page content is saved
- **FR-009**: System MUST enforce a minimum image size of 50x50 pixels during resize
- **FR-010**: System MUST constrain maximum image width to the content area width
- **FR-011**: System MUST constrain image movement within the editor content boundaries
- **FR-012**: System MUST support touch gestures for resize and move on touch-enabled devices
- **FR-013**: System MUST ensure proper contrast for resize handles and selection indicators in both light and dark modes
- **FR-014**: System MUST implement only strict minimum required for current feature (YAGNI principle)
- **FR-015**: System MUST avoid duplication through reusable functions and components (DRY principle)
- **FR-016**: System MUST be simple, readable, and clear with straightforward implementations (KISS principle)

### Key Entities

- **PageContentImage** (extended): In addition to existing attributes (identifier, filename, path, size, MIME type, timestamp), images now include display width and display height attributes that represent the administrator-configured dimensions for rendering.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Administrators can resize an image and see the updated dimensions immediately in the editor
- **SC-002**: Administrators can move an image and see it in the new position immediately in the editor
- **SC-003**: 100% of resized images display at their configured dimensions on the public page
- **SC-004**: 100% of moved images display in their configured positions on the public page
- **SC-005**: Resize and move operations complete within 500 milliseconds of user action
- **SC-006**: Resize handles and selection state are clearly visible against any image background

## Assumptions

- The administrator is already authenticated via the existing authentication system
- The page content editor (Tiptap) is already implemented with image upload functionality (spec 015)
- Uploaded images already exist in the editor and can be selected
- The image resize functionality will use HTML width/height attributes or inline styles; the original image file is not modified
- The image move functionality will change the image position within the HTML content structure
- Aspect ratio is always maintained during proportional resize; non-proportional resize is not required
- The existing Tiptap image extension can be enhanced or replaced to support resize and move capabilities
- Mobile/touch support is expected as administrators may use tablets

## Out of Scope

- Image cropping or editing within the editor
- Image rotation
- Image filters or effects
- Non-proportional resize (stretching/squashing images)
- Text wrapping options (left/right alignment with text flow)
- Image alt text editing
- Image caption editing
- Image link/hyperlink functionality
- Undo/redo specifically for resize/move (uses editor's built-in undo/redo)
- Keyboard shortcuts for resize/move operations
