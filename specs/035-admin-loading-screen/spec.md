# Feature Specification: Admin Loading Screen

**Feature Branch**: `035-admin-loading-screen`  
**Created**: 2025-12-15  
**Status**: Complete  
**Input**: User description: "in the admin side, i want to see the screen when each elements are loaded. when waiting for it, i want to have a loading screen with a loader (the custom if it is configured, the default otherwise) as in the public side. it should at least wait for the theme color, the theme mode and the font family. if i forgot something add it to the list"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - View Loading Screen While Admin Initializes (Priority: P1)

As an admin user, when I navigate to the admin panel, I want to see a loading screen with a loader animation while essential settings are being fetched, so that I have clear visual feedback that the application is loading and I don't see an incomplete or unstyled interface.

**Why this priority**: This is the core feature - providing visual feedback during the admin initialization phase. Without this, users may see unstyled content or incomplete UI elements, creating a poor first impression and potential confusion.

**Independent Test**: Can be fully tested by navigating to any admin page and verifying the loading screen appears before content is displayed, delivering a polished loading experience.

**Acceptance Scenarios**:

1. **Given** I am an authenticated admin user, **When** I navigate to the admin panel and settings are being fetched, **Then** I see a full-screen loading screen with a loader animation
2. **Given** I am viewing the loading screen, **When** all essential settings have finished loading, **Then** the loading screen disappears and the admin interface is displayed with proper styling
3. **Given** essential settings are still loading, **When** I view the loading screen, **Then** I cannot interact with the underlying admin interface

---

### User Story 2 - Custom Loader Display in Admin (Priority: P2)

As an admin user who has configured a custom loader, when I access the admin panel, I want to see my custom loader animation during the loading phase, so that the admin experience matches the branding I've set up for my public site.

**Why this priority**: Provides brand consistency between public and admin experiences. Depends on the core loading screen functionality from P1.

**Independent Test**: Can be tested by configuring a custom loader in settings, then navigating to admin and verifying the custom animation is displayed.

**Acceptance Scenarios**:

1. **Given** I have configured a custom loader (GIF or video), **When** the admin is loading, **Then** I see my custom loader animation instead of the default spinner
2. **Given** I have not configured a custom loader, **When** the admin is loading, **Then** I see the default spinner animation
3. **Given** I have configured a custom loader but it fails to load, **When** the admin is loading, **Then** I see the default spinner as a fallback

---

### User Story 3 - Loading Screen Error Handling (Priority: P3)

As an admin user, when essential settings fail to load after a reasonable time, I want to see an error message with a retry option, so that I can attempt to reload without manually refreshing the page.

**Why this priority**: Provides graceful error handling for network issues or server problems. Enhances user experience in edge cases but is not critical for the main functionality.

**Independent Test**: Can be tested by simulating a network failure during admin initialization and verifying the error state with retry functionality appears.

**Acceptance Scenarios**:

1. **Given** essential settings fail to load within the timeout period, **When** the loading completes with errors, **Then** I see an error message with a "Retry" button
2. **Given** I see the error message, **When** I click the "Retry" button, **Then** the system attempts to reload the essential settings
3. **Given** the retry is successful, **When** settings load correctly, **Then** the loading screen disappears and the admin interface is displayed

---

### Edge Cases

| Edge Case                                                        | Decision                                            |
| ---------------------------------------------------------------- | --------------------------------------------------- |
| Only some essential settings load successfully while others fail | Show error state with retry option                  |
| Extremely slow network connections (partial loading)             | No specific handling - standard timeout applies     |
| Custom loader file deleted but configuration still references it | Fall back to default spinner                        |
| Navigating between admin pages when settings already loaded      | Do not show loading screen if settings are cached   |
| User's session expires during loading                            | Redirect to login page (handled by auth middleware) |

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST display a full-screen loading screen when the admin panel is accessed and essential settings are not yet loaded
- **FR-002**: System MUST wait for the following essential settings before displaying the admin interface:
  - Theme color
  - Theme mode (light/dark/auto)
  - Font family
  - Background color
  - Website icon/logo
  - Custom loader configuration (if configured)
- **FR-003**: System MUST display the custom loader animation if one has been configured by the user
- **FR-004**: System MUST fall back to a default spinner if no custom loader is configured or if the custom loader fails to load
- **FR-005**: System MUST hide the loading screen only after all essential settings have been successfully loaded
- **FR-006**: System MUST prevent user interaction with the admin interface while the loading screen is displayed
- **FR-007**: System MUST display an error message with a retry option if essential settings fail to load within a reasonable timeout period (10 seconds, consistent with public side)
- **FR-008**: System MUST NOT show the loading screen when navigating between admin pages if essential settings are already cached/loaded
- **FR-009**: System MUST ensure proper contrast ratios for text and UI elements in the loading screen
- **FR-010**: System MUST provide accessibility attributes (ARIA) for the loading screen, consistent with public side implementation
- **FR-011**: Code MUST implement only strict minimum required for current feature (YAGNI principle)
- **FR-012**: Code MUST avoid duplication through reusing existing loading components where possible (DRY principle)
- **FR-013**: Code MUST be simple, readable, and clear with straightforward implementations (KISS principle)

### Key Entities

- **AdminLoadState**: Represents the loading state of essential admin settings - tracks which settings have loaded (themeColorLoaded, themeModeLoaded, fontFamilyLoaded, backgroundColorLoaded, logoLoaded, loaderLoaded) and overall loading status
- **LoaderConfiguration**: Existing entity representing the custom loader settings (type, url, metadata) - reused from public side implementation

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Loading screen displays within 100ms of navigating to admin panel when settings are not cached
- **SC-002**: 100% of essential settings (theme color, theme mode, font family, background color, logo, loader config) are loaded before showing admin interface
- **SC-003**: Custom loader appears correctly in 100% of cases where one is configured and available
- **SC-004**: Fallback to default spinner occurs within 500ms if custom loader fails to load
- **SC-005**: Error state with retry option displays after 10 seconds of failed loading
- **SC-006**: Loading screen is accessible with proper ARIA attributes and keyboard navigation
- **SC-007**: Subsequent admin page navigations (after initial load) do not show loading screen when settings are cached
- **SC-008**: Admin users experience a consistent, polished loading experience matching the quality of the public side

## Assumptions

- The existing `PublicPageLoader` component and loading patterns can be reused or adapted for the admin side
- The custom loader configuration is already stored and accessible via existing APIs (`/api/settings/loader`)
- Essential settings are already being fetched by various admin components; this feature centralizes and gates that loading
- The same timeout period (10 seconds) used on the public side is appropriate for the admin side
- Settings caching (via context providers or localStorage) exists and can be leveraged to avoid showing the loading screen on subsequent navigations
