# Feature Specification: Image Full Bleed Layout

**Feature Branch**: `029-image-full-bleed`  
**Created**: 2025-12-14  
**Status**: Draft  
**Input**: User description: "as an administrator, when i'm configuring a page content and i'm adding an image (with or without overlay), i want to can configure the image to take all the width of the page (more than the padding/marging of the page content). the purpose is to can have an image which touch the left and the right of the screen without seeing the background color."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Enable Full Bleed on Image (Priority: P1)

As an administrator editing page content, I want to enable a "full bleed" option on an image so that it extends beyond the page content padding/margins to touch the left and right edges of the screen, creating a visually striking edge-to-edge effect without any visible background color on the sides.

**Why this priority**: This is the core functionality that enables administrators to create immersive, magazine-style layouts with images that span the entire viewport width.

**Independent Test**: Can be fully tested by adding an image to page content, enabling the full bleed option, and verifying the image extends to the screen edges on the public page.

**Acceptance Scenarios**:

1. **Given** I am editing page content with an image (plain image), **When** I enable the full bleed option, **Then** the image is marked to display edge-to-edge on the public page
2. **Given** I am editing page content with an image with text overlay, **When** I enable the full bleed option, **Then** the image with its overlay is marked to display edge-to-edge while preserving the overlay content and positioning
3. **Given** I have enabled full bleed on an image, **When** I view the public page, **Then** the image spans from the left edge to the right edge of the viewport, breaking out of the normal content padding
4. **Given** I have enabled full bleed on an image, **When** I view the public page, **Then** no background color is visible on either side of the image

---

### User Story 2 - Disable Full Bleed on Image (Priority: P2)

As an administrator, I want to disable the full bleed option on an image that currently has it enabled, so that the image returns to respecting the normal page content padding/margins.

**Why this priority**: Provides flexibility for administrators to undo the full bleed setting, essential for iterating on page design.

**Independent Test**: Can be tested by enabling full bleed on an image, then disabling it and verifying the image returns to normal content width.

**Acceptance Scenarios**:

1. **Given** I have an image with full bleed enabled, **When** I disable the full bleed option, **Then** the image returns to displaying within the normal content padding
2. **Given** I have disabled full bleed, **When** I view the public page, **Then** the image respects the page content margins and the background color is visible on the sides

---

### User Story 3 - Visual Indication of Full Bleed State (Priority: P3)

As an administrator, I want to clearly see which images have full bleed enabled while editing, so that I can understand the current layout configuration at a glance.

**Why this priority**: Enhances usability by providing clear visual feedback about the full bleed state in the editor.

**Independent Test**: Can be tested by observing the visual difference between images with and without full bleed enabled in the editor interface.

**Acceptance Scenarios**:

1. **Given** I am viewing an image in the editor, **When** full bleed is enabled, **Then** there is a clear visual indicator (icon, badge, or styling) showing the full bleed state
2. **Given** I am viewing an image in the editor, **When** full bleed is disabled, **Then** the image appears in its normal editing state without the full bleed indicator

---

### Edge Cases

- What happens when full bleed is applied to a very small image? The image stretches to full viewport width, maintaining aspect ratio (may result in a very tall or very short image depending on original dimensions)
- How does full bleed interact with the existing "full width" button (100% container width)? Full bleed is a separate option that overrides full width behavior - when full bleed is enabled, the image breaks out of the container entirely
- What happens on mobile viewports? The image still spans edge-to-edge, which on mobile is the natural behavior
- How does full bleed affect images with text overlay? The overlay content and styling are preserved, scaling appropriately with the full-bleed image
- What happens to adjacent content (text before/after the image)? Adjacent content remains within normal page padding; only the image breaks out

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST provide a full bleed toggle option for images in the page content editor
- **FR-002**: System MUST provide a full bleed toggle option for images with text overlay in the page content editor
- **FR-003**: Users MUST be able to enable full bleed by activating the toggle when an image is selected
- **FR-004**: Users MUST be able to disable full bleed by deactivating the toggle when a full-bleed image is selected
- **FR-005**: System MUST persist the full bleed state when content is saved
- **FR-006**: System MUST render full-bleed images spanning the entire viewport width on the public page, breaking out of content padding
- **FR-007**: System MUST ensure no background color is visible on either side of a full-bleed image
- **FR-008**: System MUST preserve text overlay content, styling, and positioning when full bleed is applied to an image with overlay
- **FR-009**: System MUST display a visual indicator in the editor showing when full bleed is enabled on an image
- **FR-010**: System MUST maintain aspect ratio of images when displayed in full bleed mode
- **FR-011**: System MUST ensure adjacent content (text, other elements) remains within normal page padding
- **FR-012**: System MUST ensure proper contrast ratios for text and UI elements in both light and dark modes
- **FR-013**: UI components MUST be tested for readability across all supported themes
- **FR-014**: Code MUST implement only strict minimum required for current feature (YAGNI principle)
- **FR-015**: Code MUST avoid duplication through reusable functions and components (DRY principle)
- **FR-016**: Code MUST be simple, readable, and clear with straightforward implementations (KISS principle)

### Key Entities _(include if feature involves data)_

- **Image Node**: Existing Tiptap image node, extended with a `fullBleed` boolean attribute to indicate whether the image should break out of content padding to span the full viewport width
- **ImageWithOverlay Node**: Existing custom Tiptap node for images with text overlays, extended with a `fullBleed` boolean attribute to indicate whether the image should break out of content padding to span the full viewport width

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Administrators can enable/disable full bleed on any image in under 2 seconds (select image + toggle option)
- **SC-002**: Full-bleed images display edge-to-edge on the public page with no visible background color on either side
- **SC-003**: Text overlays remain fully readable and properly positioned on full-bleed images
- **SC-004**: 100% of image types (plain and with overlay) support the full bleed feature
- **SC-005**: Full bleed setting persists correctly across save/reload cycles
- **SC-006**: Full bleed images maintain proper aspect ratio on all viewport sizes

## Assumptions

- The existing Tiptap editor infrastructure supports adding custom attributes to image nodes
- The public page rendering system can apply CSS to break images out of the content container
- The full bleed feature is independent of and can coexist with the existing "full width" (100% container) feature from spec 023
