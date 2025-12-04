# Feature Specification: Image Text Overlay

**Feature Branch**: `022-image-text-overlay`  
**Created**: 2025-12-04  
**Status**: Draft  
**Input**: User description: "as an administrator, i want to can add text and style it on a image that i have uploaded in the pagecontent. and i want to see it in the public side"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Administrator Adds Text Overlay to Image (Priority: P1)

As an administrator editing page content, I want to add text directly on top of an uploaded image so that I can create visually engaging content like banners, hero sections, or captioned images without needing external image editing tools.

**Why this priority**: This is the core functionality - adding text to images is the primary capability requested. Without this, the feature has no value.

**Independent Test**: Can be fully tested by opening the page content editor, selecting an uploaded image, clicking an "Add Text Overlay" option, entering text, and verifying the text appears overlaid on the image.

**Acceptance Scenarios**:

1. **Given** I am editing page content that contains an uploaded image, **When** I select the image and click the "Add Text Overlay" option, **Then** a text input area appears over the image where I can type my text.
2. **Given** I have added text overlay to an image, **When** I click outside the text input, **Then** the text is saved and displayed on top of the image.
3. **Given** I have an image with text overlay, **When** I save the page content, **Then** the text overlay is persisted with the image.
4. **Given** I have saved page content with image text overlay, **When** I reload the editor, **Then** the text overlay appears exactly as I configured it.

---

### User Story 2 - Administrator Styles Text Overlay (Priority: P1)

As an administrator, I want to style the text overlay (font size, color, position) so that the text is readable against the image background and matches my design vision.

**Why this priority**: Styling is essential for text overlays to be useful - unstyled text may be unreadable against image backgrounds. This is tied to P1 as it completes the core functionality.

**Independent Test**: Can be fully tested by selecting an existing text overlay, modifying style properties (color, size, position), and verifying the styles are applied immediately in the editor.

**Acceptance Scenarios**:

1. **Given** I have added text overlay to an image, **When** I select the text, **Then** I see styling options for text color, font size, font family, and text position.
2. **Given** I am styling text overlay, **When** I change the text color, **Then** the text immediately displays in the new color.
3. **Given** I am styling text overlay, **When** I change the font size, **Then** the text immediately displays at the new size.
4. **Given** I am styling text overlay, **When** I change the font family, **Then** the text immediately displays in the selected font.
5. **Given** I am styling text overlay, **When** I select a position (top, center, bottom), **Then** the text moves to that vertical position on the image.
6. **Given** I have styled the text overlay, **When** I save the page, **Then** all style settings are persisted.

---

### User Story 3 - Public User Views Text Overlay on Images (Priority: P1)

As a public user visiting a page, I want to see the text that the administrator added to images so that I can view the complete visual content as designed.

**Why this priority**: This represents the user-facing value - text overlays must be visible on the public side for the feature to be complete.

**Independent Test**: Can be tested by navigating to a page that contains images with text overlays and verifying the text displays correctly positioned and styled.

**Acceptance Scenarios**:

1. **Given** a page contains an image with text overlay, **When** I navigate to that page as a public user, **Then** I see the text displayed on top of the image.
2. **Given** I am viewing an image with styled text overlay, **When** the page loads, **Then** the text appears with the configured color, size, font family, and position.
3. **Given** I am viewing a page with text overlay on different devices, **When** I resize my browser or view on mobile, **Then** the text overlay scales appropriately with the image.

---

### User Story 4 - Administrator Edits Existing Text Overlay (Priority: P2)

As an administrator, I want to edit or remove text overlay from an image so that I can update content as needed.

**Why this priority**: Editing existing content is essential for content management but secondary to initial creation functionality.

**Independent Test**: Can be tested by selecting an image with existing text overlay, modifying the text or removing it, and verifying the changes are saved.

**Acceptance Scenarios**:

1. **Given** I have an image with existing text overlay in the editor, **When** I click on the text, **Then** I can edit the text content.
2. **Given** I have an image with existing text overlay, **When** I select the overlay and click "Remove", **Then** the text overlay is removed from the image.
3. **Given** I have edited or removed text overlay, **When** I save and reload the page, **Then** my changes are persisted.

---

### Edge Cases

- What happens when an administrator adds very long text? The text wraps within the image boundaries or is truncated with ellipsis based on the image width.
- What happens when the image is resized after adding text overlay? The text overlay scales proportionally with the image.
- What happens when text color matches the image background? The administrator is responsible for choosing readable colors; the system provides color picker with preview.
- What happens when an image with text overlay is deleted? Both the image and its text overlay are removed from the content.
- What happens when viewing on a very small screen (mobile)? The text overlay scales down with the image while maintaining readability (minimum font size enforced).
- What happens when the administrator does not enter any text? An empty overlay is not saved; the overlay is only persisted when it contains text.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST allow administrators to add text overlay to uploaded images in the page content editor
- **FR-002**: System MUST provide a text input area positioned over the image for entering overlay text
- **FR-003**: System MUST allow administrators to change the text color using a color picker
- **FR-004**: System MUST allow administrators to change the font size from a predefined set of sizes (small, medium, large, extra-large)
- **FR-004b**: System MUST allow administrators to select a font family from the same Google Fonts available in the website settings and rich text editor
- **FR-005**: System MUST allow administrators to position text overlay vertically (top, center, bottom) on the image
- **FR-006**: System MUST allow administrators to align text horizontally (left, center, right) within the overlay area
- **FR-007**: System MUST display text overlay in real-time as the administrator types and styles
- **FR-008**: System MUST persist text overlay content and styles when page content is saved
- **FR-009**: System MUST display text overlay on images in the public page view
- **FR-010**: System MUST scale text overlay proportionally when images are resized
- **FR-011**: System MUST allow administrators to edit existing text overlay content
- **FR-012**: System MUST allow administrators to remove text overlay from an image
- **FR-013**: System MUST ensure text overlay remains visible when image is resized in the editor
- **FR-014**: System MUST display text overlay responsively on the public page across different viewport sizes
- **FR-015**: System MUST add a semi-transparent background behind text to ensure readability
- **FR-016**: System MUST ensure proper contrast ratios for text overlay controls in both light and dark modes
- **FR-017**: System MUST implement only strict minimum required for current feature (YAGNI principle)
- **FR-018**: System MUST avoid duplication through reusable functions and components (DRY principle)
- **FR-019**: System MUST be simple, readable, and clear with straightforward implementations (KISS principle)

### Key Entities

- **ImageTextOverlay**: Represents text overlay on an image. Contains text content, text color (hex value), font family (Google Font name), font size (small/medium/large/extra-large), vertical position (top/center/bottom), horizontal alignment (left/center/right), and background opacity. This overlay is stored as part of the image element attributes in the page content.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Administrators can add text overlay to an image and see it appear immediately in the editor
- **SC-002**: Administrators can style text overlay (color, size, font family, position) and see changes in under 500 milliseconds
- **SC-003**: 100% of text overlays display correctly on the public page with configured styles
- **SC-004**: Text overlays remain readable on the public page across viewports from 320px to 1920px wide
- **SC-005**: Administrators can complete the text overlay creation flow (add text, style, save) in under 1 minute

## Clarifications

### Session 2025-12-04

- Q: Should administrators be able to select font family for text overlay? → A: Yes, using the same Google Fonts available in the website settings and rich text editor

## Assumptions

- The administrator is already authenticated via the existing authentication system
- The page content editor (Tiptap) is already implemented with image upload and resize functionality (specs 015 and 016)
- Uploaded images already exist in the editor and can be selected
- Text overlay will be stored as data attributes on the image element in the HTML content
- The existing Tiptap ResizableImage extension can be enhanced to support text overlay capabilities
- A predefined set of font sizes is sufficient; arbitrary pixel values are not required
- The semi-transparent background color will be automatically determined (dark or light) based on the text color to ensure contrast
- Font family selection for text overlay reuses the existing Google Fonts integration from website settings and rich text editor

## Out of Scope

- Multiple text overlays on a single image
- Rich text formatting within the overlay (bold, italic, underline)
- Text rotation or transformation
- Animation effects on text overlay
- Custom background shape or border for text overlay
- Gradient backgrounds for text overlay
- Shadow or outline effects on text
- Drag-and-drop positioning of text overlay (uses preset positions only)
- Image filters or effects under text overlay
