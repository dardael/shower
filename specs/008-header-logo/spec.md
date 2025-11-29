# Feature Specification: Header Logo Configuration

**Feature Branch**: `008-header-logo`  
**Created**: 2025-11-29  
**Status**: Draft  
**Input**: User description: "I want to allow the user to configure an image that will be displayed at the left of the header menu on the public side. This image will be configured in the admin dashboard in the screen to configure the menu."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Configure Header Logo in Admin (Priority: P1)

As an admin user, I want to upload a logo image in the menu configuration screen, so that I can brand my website's header with my logo.

**Why this priority**: This is the core functionality - without the ability to configure the logo in admin, nothing can be displayed on the public side.

**Independent Test**: Can be fully tested by navigating to the admin menu configuration page, uploading an image, and verifying it is saved successfully. Delivers immediate value by allowing admins to personalize their website header.

**Acceptance Scenarios**:

1. **Given** I am logged in as an admin on the menu configuration page, **When** I upload a valid image file (PNG, JPG, SVG, GIF, WebP), **Then** the image is saved and a preview is displayed in the form.

2. **Given** I have previously uploaded a header logo, **When** I visit the menu configuration page, **Then** I see the current logo displayed with options to replace or delete it.

3. **Given** I have uploaded a header logo, **When** I click the replace button and select a new image, **Then** the new image replaces the old one and the preview updates.

4. **Given** I have uploaded a header logo, **When** I click the delete button, **Then** the logo is removed and the upload area returns to its empty state.

---

### User Story 2 - Display Header Logo on Public Site (Priority: P2)

As a website visitor, I want to see the configured logo image at the left of the header menu, so that I can identify the website brand.

**Why this priority**: This is the visible outcome of the feature - displaying the logo to visitors. It depends on P1 being complete first.

**Independent Test**: Can be tested by configuring a logo in admin, then visiting the public site and verifying the logo appears on the left side of the header menu.

**Acceptance Scenarios**:

1. **Given** an admin has uploaded a header logo, **When** a visitor opens the public website, **Then** the logo is displayed on the left side of the header menu before the navigation items.

2. **Given** no header logo has been configured, **When** a visitor opens the public website, **Then** the header menu displays without a logo (navigation items are still visible and positioned correctly).

3. **Given** a header logo is configured, **When** a visitor views the page in dark mode, **Then** the logo remains visible with appropriate contrast against the header background.

---

### User Story 3 - Logo Display Consistency (Priority: P3)

As a website visitor, I want the header logo to display consistently across different screen sizes and color modes, so that the branding is always recognizable.

**Why this priority**: Consistency and visual polish are important but secondary to the core upload and display functionality.

**Independent Test**: Can be tested by viewing the public header with a logo on different viewport sizes and toggling between light/dark modes.

**Acceptance Scenarios**:

1. **Given** a header logo is configured, **When** viewing on desktop viewport, **Then** the logo displays at an appropriate size that does not overwhelm the navigation.

2. **Given** a header logo is configured, **When** viewing on tablet/mobile viewport, **Then** the logo scales appropriately to fit the smaller header.

3. **Given** a header logo is configured, **When** the theme color changes, **Then** the logo remains visible and the header styling adjusts consistently.

---

### Edge Cases

- What happens when an uploaded image has extreme dimensions (very wide or very tall)? The logo should be scaled to fit within maximum height constraints while maintaining aspect ratio.
- How does the system handle transparent PNG/GIF images in both light and dark modes? Transparent areas should work correctly against the themed header background.
- What happens if the logo image file is deleted from storage but the reference remains? The header should gracefully handle missing images without breaking the layout.
- What happens if the logo API is temporarily unavailable? The header should display without a logo rather than showing an error.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST provide a logo upload section in the admin menu configuration page.
- **FR-002**: System MUST accept image files in PNG, JPG, SVG, GIF, and WebP formats for the header logo.
- **FR-003**: System MUST validate uploaded logo files do not exceed the maximum file size (2MB).
- **FR-004**: System MUST display a preview of the uploaded logo in the admin form.
- **FR-005**: System MUST allow admins to replace an existing logo with a new image.
- **FR-006**: System MUST allow admins to delete the current logo.
- **FR-007**: System MUST persist the logo configuration so it survives page refreshes and server restarts.
- **FR-008**: System MUST display the configured logo at the left of the header menu on public pages.
- **FR-009**: System MUST position the logo before (to the left of) navigation menu items.
- **FR-010**: System MUST scale the logo to fit within the header height while maintaining aspect ratio.
- **FR-011**: System MUST handle the case when no logo is configured (display header without logo).
- **FR-012**: System MUST support logo display in both light and dark modes.
- **FR-013**: System MUST ensure proper contrast ratios for the logo against the themed header background.
- **FR-014**: System MUST handle missing or failed-to-load logo images gracefully without breaking the header layout.
- **FR-015**: Code MUST implement only strict minimum required for current feature (YAGNI principle).
- **FR-016**: Code MUST avoid duplication through reusable functions and components (DRY principle).
- **FR-017**: Code MUST be simple, readable, and clear with straightforward implementations (KISS principle).

### Out of Scope (Explicitly Excluded)

- Logo linking to homepage (click behavior) - can be added in a future feature
- Multiple logo variants for light/dark mode
- Logo animation or effects
- Logo position customization (always left-aligned in header)
- Alt text customization for accessibility (will use default "Site logo")
- Mobile-specific logo behavior (hamburger menu integration)

### Key Entities _(include if feature involves data)_

- **HeaderLogo**: Value object representing the header logo image. Key attributes: url (path to stored image), filename (stored filename), originalName (user's original filename), size (file size in bytes), format (file extension), mimeType (MIME type), uploadedAt (upload timestamp).
- **MenuItem**: Existing entity representing navigation items. Relationship: HeaderLogo is displayed before MenuItems in the header.

### Assumptions

- The existing ImageManager component can be reused for logo upload functionality.
- The existing file storage service pattern (used for website icon) can be extended for logo storage.
- The public header menu component already handles theme colors and dark mode.
- The admin menu configuration page exists and can be extended with a new section.
- Logo files will be stored in the same manner as website icons (public/uploads directory or similar).

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Admins can upload a header logo in under 30 seconds from the menu configuration page.
- **SC-002**: Uploaded logos appear on the public site header within 2 seconds of page load.
- **SC-003**: Logo displays correctly in both light and dark modes without visibility issues.
- **SC-004**: Logo maintains aspect ratio and fits within header height on all supported viewport sizes.
- **SC-005**: Public pages load successfully even when no logo is configured (graceful empty state).
- **SC-006**: Public pages load successfully when logo file is missing (graceful fallback without breaking layout).
- **SC-007**: Logo configuration persists across browser sessions and server restarts.
