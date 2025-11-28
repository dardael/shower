# Feature Specification: Public Dark Mode Toggle

**Feature Branch**: `007-public-dark-mode`  
**Created**: 2025-01-28  
**Status**: Draft  
**Input**: User description: "at the right in the header menu in the public page, i want to add the same dark mode toggle button than in the admin dashboard."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Toggle Dark Mode on Public Page (Priority: P1)

As a visitor on the public website, I want to toggle between light and dark mode using a button in the header menu, so that I can view the website in my preferred visual mode.

**Why this priority**: This is the core functionality requested. Without the toggle button in the header, users cannot switch themes on the public pages, which is the primary goal of this feature.

**Independent Test**: Can be fully tested by navigating to any public page, clicking the toggle button in the header, and verifying the theme switches between light and dark modes. Delivers immediate value by giving users control over their viewing experience.

**Acceptance Scenarios**:

1. **Given** I am on the public website in light mode, **When** I click the dark mode toggle button in the header, **Then** the website switches to dark mode and the toggle icon changes to indicate the current mode
2. **Given** I am on the public website in dark mode, **When** I click the dark mode toggle button in the header, **Then** the website switches to light mode and the toggle icon changes to indicate the current mode
3. **Given** I am on the public website, **When** I look at the header menu, **Then** I see the dark mode toggle button positioned at the right side of the header

---

### User Story 2 - Theme Persistence Across Pages (Priority: P2)

As a visitor on the public website, I want my theme preference to persist as I navigate between pages, so that I do not have to re-select my preferred mode on each page.

**Why this priority**: Theme persistence enhances the user experience but is secondary to having the toggle button itself. The toggle must work first before persistence matters.

**Independent Test**: Can be tested by setting a theme on one public page, navigating to another public page, and verifying the selected theme is maintained.

**Acceptance Scenarios**:

1. **Given** I am on the public website and have selected dark mode, **When** I navigate to another public page, **Then** the website remains in dark mode
2. **Given** I am on the public website and have selected light mode, **When** I navigate to another public page, **Then** the website remains in light mode

---

### User Story 3 - Consistent Visual Appearance with Admin Toggle (Priority: P3)

As a visitor on the public website, I expect the dark mode toggle to look and behave the same as the one in the admin dashboard, providing a consistent experience across the application.

**Why this priority**: Visual consistency is important for brand identity and user familiarity, but the functionality itself is more critical than matching exact styling.

**Independent Test**: Can be tested by comparing the toggle button appearance and behavior on the public page against the admin dashboard toggle.

**Acceptance Scenarios**:

1. **Given** I am on the public website, **When** I view the dark mode toggle button, **Then** it displays the same icons (sun for light mode switch, moon for dark mode switch) as the admin dashboard toggle
2. **Given** I am on the public website, **When** I interact with the dark mode toggle, **Then** the toggle behavior (click response, state change) is identical to the admin dashboard toggle

---

### Edge Cases

- What happens when JavaScript is disabled or still loading? The header should display gracefully with a loading skeleton for the toggle button.
- What happens when the user has a system-level dark mode preference? The toggle should respect the user's explicit choice once they interact with it.
- What happens when the header has no menu items configured? The toggle button should still be visible and functional in the header.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST display a dark mode toggle button in the public header menu, positioned at the right side
- **FR-002**: System MUST use the same DarkModeToggle component that exists in the admin dashboard
- **FR-003**: Users MUST be able to switch between light and dark modes by clicking the toggle button
- **FR-004**: System MUST persist the selected theme preference across page navigations using existing theme persistence mechanism
- **FR-005**: System MUST display appropriate icons (sun/moon) based on the current theme state
- **FR-006**: System MUST ensure proper contrast ratios for the toggle button in both light and dark modes, considering the theme-colored header background
- **FR-007**: System MUST display a loading skeleton while the theme state is being determined (client-side hydration)
- **FR-008**: Theme color specified in admin dashboard MUST be used consistently for the header styling while the toggle button remains accessible
- **FR-009**: Code MUST implement only strict minimum required for current feature (YAGNI principle) - reuse existing DarkModeToggle component
- **FR-010**: Code MUST avoid duplication through reusable functions and components (DRY principle) - no new toggle component creation
- **FR-011**: Code MUST be simple, readable, and clear with straightforward implementations (KISS principle)
- **FR-012**: Toggle button MUST be accessible via keyboard navigation
- **FR-013**: Toggle button MUST have appropriate ARIA attributes for screen readers

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can toggle between light and dark modes with a single click from any public page
- **SC-002**: Theme preference persists across all public page navigations within the same session
- **SC-003**: The toggle button is visible and accessible in the header on all viewport sizes (mobile, tablet, desktop)
- **SC-004**: The toggle button visual appearance matches the admin dashboard toggle button
- **SC-005**: Users with screen readers can identify and operate the toggle button through appropriate ARIA labels

## Assumptions

- The existing DarkModeToggle component in the shared components folder is fully functional and can be reused as-is
- The PublicHeaderMenu component can be modified to include the toggle button
- The existing theme persistence mechanism (browser localStorage) will be used
- The header uses the theme color (colorPalette) system, so the toggle button styling needs to work with colored backgrounds
