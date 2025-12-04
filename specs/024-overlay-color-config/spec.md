# Feature Specification: Overlay Color Configuration

**Feature Branch**: `024-overlay-color-config`  
**Created**: 2025-12-04  
**Status**: Draft  
**Input**: User description: "As an administrator, for image with a text overlay in the rich text editor for page content, I want to choose the color of the overlay behind the text and its opacity. I want this configuration to be visible in the public side."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Administrator Configures Overlay Color (Priority: P1)

As an administrator editing an image with text overlay in the page content editor, I want to choose the background color of the overlay behind my text so that I can match the overlay to my brand colors or create specific visual effects.

**Why this priority**: This is the core functionality requested - allowing administrators to customize the overlay color instead of having an automatically determined color.

**Independent Test**: Can be fully tested by selecting an image with text overlay, opening the overlay color picker, selecting a color, and verifying the overlay background changes to the selected color.

**Acceptance Scenarios**:

1. **Given** I have an image with text overlay in the editor, **When** I access the overlay styling options, **Then** I see a color picker for the overlay background color.
2. **Given** I am configuring the overlay color, **When** I select a color from the color picker, **Then** the overlay background immediately displays the selected color.
3. **Given** I have configured the overlay color, **When** I save the page content, **Then** the overlay color is persisted.
4. **Given** I have saved page content with a custom overlay color, **When** I reload the editor, **Then** the overlay displays with my configured color.

---

### User Story 2 - Administrator Configures Overlay Opacity (Priority: P1)

As an administrator, I want to adjust the opacity of the overlay background so that I can control how much of the underlying image is visible through the overlay.

**Why this priority**: Opacity control is essential for the overlay to be usable - too opaque hides the image, too transparent makes text unreadable. This completes the core customization capability.

**Independent Test**: Can be fully tested by selecting an image with text overlay, adjusting the opacity slider, and verifying the overlay transparency changes in real-time.

**Acceptance Scenarios**:

1. **Given** I have an image with text overlay in the editor, **When** I access the overlay styling options, **Then** I see an opacity control (slider or input).
2. **Given** I am adjusting the overlay opacity, **When** I change the opacity value, **Then** the overlay transparency immediately updates to reflect the new setting.
3. **Given** I set the opacity to 0%, **When** I view the overlay, **Then** the overlay background is completely transparent (text still visible).
4. **Given** I set the opacity to 100%, **When** I view the overlay, **Then** the overlay background is completely opaque.
5. **Given** I set the opacity to 50%, **When** I view the overlay, **Then** the overlay background is semi-transparent showing the image underneath.
6. **Given** I have configured the overlay opacity, **When** I save the page content, **Then** the opacity setting is persisted.

---

### User Story 3 - Public User Views Custom Overlay (Priority: P1)

As a public user visiting a page, I want to see the image text overlays with the custom background color and opacity configured by the administrator so that I experience the visual design as intended.

**Why this priority**: This represents the user-facing value - the configured overlay must be visible on the public side for the feature to be complete.

**Independent Test**: Can be tested by navigating to a page with images that have custom overlay colors and opacities, and verifying they display correctly.

**Acceptance Scenarios**:

1. **Given** a page contains an image with a custom overlay color, **When** I navigate to that page as a public user, **Then** I see the overlay with the configured background color.
2. **Given** a page contains an image with a custom overlay opacity, **When** I navigate to that page, **Then** the overlay displays with the configured transparency level.
3. **Given** I am viewing on different devices (mobile, tablet, desktop), **When** the page loads, **Then** the overlay color and opacity display consistently.

---

### Edge Cases

- What happens when the administrator does not configure a custom overlay color? The system uses a default semi-transparent dark background (black at 50% opacity) to maintain backward compatibility.
- What happens when the overlay color is very similar to the text color? The administrator is responsible for ensuring readability; the system provides a live preview.
- What happens when opacity is set to 0% and the image has a busy background? The text may be hard to read; the administrator sees this in the live preview and can adjust.
- What happens to existing text overlays that were created before this feature? They retain their default appearance (semi-transparent dark background) until the administrator explicitly configures a new color/opacity.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST provide a color picker for selecting the overlay background color
- **FR-002**: System MUST provide an opacity control allowing values from 0% to 100%
- **FR-003**: System MUST display the overlay color and opacity changes in real-time as the administrator adjusts them
- **FR-004**: System MUST persist the overlay color and opacity settings when page content is saved
- **FR-005**: System MUST display the configured overlay color and opacity on the public page view
- **FR-006**: System MUST use a default overlay background (black at 50% opacity) when no custom color/opacity is configured
- **FR-007**: System MUST ensure the overlay styling controls are accessible from the text overlay editing interface
- **FR-008**: System MUST ensure proper contrast ratios for overlay configuration controls in both light and dark modes
- **FR-009**: System MUST implement only strict minimum required for current feature (YAGNI principle)
- **FR-010**: System MUST avoid duplication through reusable functions and components (DRY principle)
- **FR-011**: System MUST be simple, readable, and clear with straightforward implementations (KISS principle)

### Key Entities

- **ImageTextOverlay** (extension): The existing ImageTextOverlay entity is extended with two additional attributes:
  - **overlayColor**: The background color of the overlay (hex value, e.g., "#000000"). Defaults to black if not specified.
  - **overlayOpacity**: The opacity of the overlay background (number 0-100 representing percentage). Defaults to 50 if not specified.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Administrators can change overlay color and see the change reflected immediately in the editor preview
- **SC-002**: Administrators can adjust overlay opacity and see the change reflected immediately in the editor preview
- **SC-003**: 100% of configured overlay colors and opacities display correctly on the public page
- **SC-004**: Administrators can complete the overlay color and opacity configuration in under 30 seconds
- **SC-005**: Existing text overlays without custom configuration continue to display with default styling

## Assumptions

- The administrator is already authenticated via the existing authentication system
- The image text overlay feature (spec 022) is already implemented with text overlay support
- The overlay color and opacity settings will be stored as additional data attributes on the image element
- The existing text overlay editing interface can be extended to include color and opacity controls
- Color picker component follows existing patterns in the application (used for text color configuration)
- Opacity is stored as an integer (0-100) and converted to CSS opacity (0-1) at render time

## Out of Scope

- Gradient backgrounds for the overlay
- Multiple overlay zones with different colors on a single image
- Preset color themes or palettes for quick selection
- Color recommendations based on image content
- Animation effects on overlay color changes
- Border or shadow effects on the overlay
- Per-device opacity settings (responsive opacity)
