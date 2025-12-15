# Feature Specification: Custom Loader Configuration

**Feature Branch**: `034-custom-loader`  
**Created**: 2025-12-15  
**Status**: Draft  
**Input**: User description: "I want to configure a gif or a video to be used instead of the spinning loader. When the spinner appears and a video is configured, it must be displayed instead"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Configure Custom Loading Animation (Priority: P1)

As a website administrator, I want to upload a custom GIF or video to replace the default spinning loader, so that the loading experience matches my brand identity and provides a more engaging user experience.

**Why this priority**: This is the core functionality that enables the entire feature. Without the ability to configure a custom loader, the feature has no value.

**Independent Test**: Can be fully tested by uploading a GIF/video in admin settings and verifying it appears in the settings storage. Delivers the foundational configuration capability.

**Acceptance Scenarios**:

1. **Given** I am on the admin settings page, **When** I navigate to the loader configuration section, **Then** I see an option to upload a custom loading animation (GIF or video)
2. **Given** I am configuring the loader, **When** I upload a valid GIF file, **Then** the file is saved and a preview is displayed
3. **Given** I am configuring the loader, **When** I upload a valid video file (MP4, WebM), **Then** the file is saved and a preview is displayed
4. **Given** I have uploaded a custom loader, **When** I want to revert to the default spinner, **Then** I can remove the custom loader and restore the default behavior

---

### User Story 2 - Display Custom Loader on Public Pages (Priority: P1)

As a website visitor, I want to see the custom loading animation when the page is loading, so that I have a branded and visually consistent experience while waiting.

**Why this priority**: This delivers the user-facing value of the feature. The custom loader must actually appear for visitors, making this equally critical as configuration.

**Independent Test**: Can be fully tested by configuring a custom loader, then visiting a public page and verifying the custom animation displays during loading instead of the default spinner.

**Acceptance Scenarios**:

1. **Given** a custom GIF loader is configured, **When** I visit a public page that is loading, **Then** I see the custom GIF animation instead of the default spinner
2. **Given** a custom video loader is configured, **When** I visit a public page that is loading, **Then** I see the custom video playing (looped, muted) instead of the default spinner
3. **Given** no custom loader is configured, **When** I visit a public page that is loading, **Then** I see the default spinning loader
4. **Given** a custom loader is configured, **When** the page finishes loading, **Then** the custom loader disappears and the page content is displayed

---

### User Story 3 - Preview Custom Loader in Admin (Priority: P2)

As a website administrator, I want to preview how my custom loader will appear before saving, so that I can verify it looks correct and make adjustments if needed.

**Why this priority**: Enhances the admin experience but is not strictly required for the feature to function. Administrators could save and check on the public site.

**Independent Test**: Can be fully tested by uploading a loader file and verifying an animated preview displays in the admin interface before saving.

**Acceptance Scenarios**:

1. **Given** I have selected a GIF file for upload, **When** the file is processed, **Then** I see an animated preview of the GIF
2. **Given** I have selected a video file for upload, **When** the file is processed, **Then** I see a video preview playing in a loop
3. **Given** I am viewing the preview, **When** I decide the animation is not suitable, **Then** I can select a different file without saving the current one

---

### Edge Cases

- What happens when the uploaded file is corrupted or cannot be played? The system displays an error message and does not save the file. The default spinner remains active.
- What happens when the custom loader file is deleted from storage? The system gracefully falls back to the default spinner.
- What happens when the video/GIF takes too long to load on slow connections? The system shows the default spinner until the custom loader asset is ready, then transitions to the custom loader.
- What happens when the user uploads a very large file? The system rejects files exceeding the maximum size limit (10MB) with a clear error message.
- What happens when the browser does not support the video format? The system falls back to the default spinner for unsupported browsers.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST allow administrators to upload a custom loading animation file (GIF or video)
- **FR-002**: System MUST support GIF format for custom loaders
- **FR-003**: System MUST support MP4 and WebM video formats for custom loaders
- **FR-004**: System MUST validate uploaded files for correct format and maximum size (10MB limit)
- **FR-005**: System MUST store the custom loader file path in website settings
- **FR-006**: System MUST display the custom loader on public pages when configured, replacing the default spinner
- **FR-007**: System MUST loop video loaders continuously during the loading state
- **FR-008**: System MUST mute video loaders (no audio playback)
- **FR-009**: System MUST fall back to the default spinner when no custom loader is configured
- **FR-010**: System MUST fall back to the default spinner when the custom loader file fails to load
- **FR-011**: System MUST allow administrators to remove the custom loader and revert to the default spinner
- **FR-012**: System MUST provide a preview of the uploaded animation in the admin interface
- **FR-013**: System MUST ensure proper contrast and visibility of the loader in both light and dark modes
- **FR-014**: System MUST maintain accessibility by preserving ARIA attributes (role="status", aria-live="polite") on the loading container
- **FR-015**: Configuration changes MUST be synchronized with export/import system and increment export file version (Configuration Portability principle)
- **FR-016**: Code MUST implement only strict minimum required for current feature (YAGNI principle)
- **FR-017**: Code MUST avoid duplication through reusable functions and components (DRY principle)
- **FR-018**: Code MUST be simple, readable, and clear with straightforward implementations (KISS principle)

### Key Entities

- **CustomLoader**: Represents the custom loading animation configuration
  - `type`: The type of loader ("gif" | "video" | null)
  - `url`: The URL path to the uploaded file
  - `filename`: Original filename for display purposes
  - `mimeType`: The MIME type of the uploaded file
  - `uploadedAt`: Timestamp of when the file was uploaded

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Administrators can upload and configure a custom loader in under 1 minute
- **SC-002**: Custom loader appears within 100ms of page load initiation (no perceivable delay before showing)
- **SC-003**: 100% of public page loads display the custom loader when configured (no fallback to default unless intended)
- **SC-004**: Custom loader gracefully degrades to default spinner in 100% of error scenarios (corrupted file, missing file, unsupported browser)
- **SC-005**: Uploaded files are validated with clear error messages for 100% of invalid uploads (wrong format, oversized files)
- **SC-006**: Custom loader maintains proper visibility in both light and dark theme modes

## Assumptions

- The existing file storage infrastructure will be extended to support video files
- Video files will be stored in a dedicated directory similar to existing image storage
- The existing settings infrastructure can accommodate the new loader configuration
- Modern browsers support the required video formats (MP4 with H.264, WebM with VP8/VP9)
- The 10MB file size limit is reasonable for loading animations while preventing excessive storage usage
- Administrators understand that very long or high-resolution videos may impact page load performance
