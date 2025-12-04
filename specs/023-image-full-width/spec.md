# Feature Specification: Image Full Width Button

**Feature Branch**: `023-image-full-width`  
**Created**: 2025-12-04  
**Status**: Draft  
**Input**: User description: "as an administrator, in the rich text editor, i want to have a button only used for images to make it take 100% of the available width. i want it working with image with a text overlay"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Make Image Full Width (Priority: P1)

As an administrator editing page content in the rich text editor, I want to click a dedicated button that makes the selected image expand to 100% of the available container width, so that I can create visually impactful full-width hero images or section dividers.

**Why this priority**: This is the core functionality of the feature. Full-width images are essential for creating visually striking page layouts and hero sections.

**Independent Test**: Can be fully tested by selecting any image (with or without overlay) in the editor, clicking the full-width button, and verifying the image expands to fill the available width.

**Acceptance Scenarios**:

1. **Given** I am in the rich text editor with an image selected (plain image), **When** I click the full-width button, **Then** the image expands to 100% of the available container width
2. **Given** I am in the rich text editor with an image with text overlay selected, **When** I click the full-width button, **Then** the image with its overlay expands to 100% of the available container width while preserving the overlay styling
3. **Given** the full-width button is visible in the toolbar, **When** no image is selected, **Then** the button is hidden or disabled
4. **Given** I have made an image full width, **When** I save and view the page publicly, **Then** the image displays at 100% width on the public page

---

### User Story 2 - Toggle Full Width Off (Priority: P2)

As an administrator, I want to be able to toggle off the full-width setting on an image that is currently full width, so that I can return it to its original size or manually resize it.

**Why this priority**: Provides flexibility for administrators to undo the full-width setting, which is essential for a good editing experience.

**Independent Test**: Can be tested by applying full width to an image, then clicking the button again to toggle it off.

**Acceptance Scenarios**:

1. **Given** I have a full-width image selected, **When** I click the full-width button again, **Then** the image returns to its previous width (or a reasonable default width)
2. **Given** I have toggled full width off, **When** I view the toolbar button, **Then** the button state reflects that full width is no longer active

---

### User Story 3 - Visual Button State Indication (Priority: P3)

As an administrator, I want the full-width button to visually indicate when full width is active on the selected image, so that I can quickly understand the current state.

**Why this priority**: Enhances usability by providing clear visual feedback, consistent with other toolbar buttons in the editor.

**Independent Test**: Can be tested by observing button appearance changes when selecting images with and without full-width applied.

**Acceptance Scenarios**:

1. **Given** I select an image that is already full width, **When** I look at the toolbar, **Then** the full-width button appears in an active/pressed state (solid variant)
2. **Given** I select an image that is not full width, **When** I look at the toolbar, **Then** the full-width button appears in an inactive state (ghost variant)

---

### Edge Cases

- What happens when a full-width image is resized manually using resize handles? The full-width setting should be removed, returning the image to manual width control
- How does the system handle full-width on very small images? They still stretch to 100% width to maintain consistent behavior
- What happens to the text overlay positioning when an image becomes full width? Overlay remains properly positioned and responsive within the full-width container
- How does full-width interact with image alignment (left/center/right)? Full-width takes precedence; alignment is visually irrelevant when image spans the full container

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST display a dedicated full-width button in the toolbar when an image (plain or with overlay) is selected
- **FR-002**: System MUST hide or disable the full-width button when no image is selected
- **FR-003**: Users MUST be able to apply full width by clicking the button when an image is selected
- **FR-004**: System MUST set the image width to 100% of the available container width when full width is applied
- **FR-005**: System MUST preserve text overlay content, styling, and positioning when full width is applied to an image with overlay
- **FR-006**: Users MUST be able to toggle full width off by clicking the button again on a full-width image
- **FR-007**: System MUST restore the image to a reasonable default width when full width is toggled off
- **FR-008**: System MUST persist the full-width state when content is saved
- **FR-009**: System MUST render full-width images at 100% width on the public-facing page
- **FR-010**: System MUST visually indicate the active state of the full-width button when a full-width image is selected
- **FR-011**: System MUST remove the full-width setting when the user manually resizes the image using resize handles
- **FR-012**: System MUST ensure proper contrast ratios for text and UI elements in both light and dark modes
- **FR-013**: UI components MUST be tested for readability across all supported themes
- **FR-014**: Code MUST implement only strict minimum required for current feature (YAGNI principle)
- **FR-015**: Code MUST avoid duplication through reusable functions and components (DRY principle)
- **FR-016**: Code MUST be simple, readable, and clear with straightforward implementations (KISS principle)

### Key Entities _(include if feature involves data)_

- **Image Node**: Existing Tiptap image node, extended with a `fullWidth` boolean attribute to indicate whether the image should span 100% of the container
- **ImageWithOverlay Node**: Existing custom Tiptap node for images with text overlays, extended with a `fullWidth` boolean attribute to indicate whether the image should span 100% of the container

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Administrators can apply full width to any image in under 2 seconds (select image + click button)
- **SC-002**: Full-width images display correctly at 100% container width on both admin preview and public pages
- **SC-003**: Text overlays remain fully readable and properly positioned on full-width images
- **SC-004**: 100% of image types (plain and with overlay) support the full-width feature
- **SC-005**: The toggle behavior (on/off) works consistently without errors or unexpected state changes
