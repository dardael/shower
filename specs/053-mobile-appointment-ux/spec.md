# Feature Specification: Mobile Appointment Booking UX Improvements

**Feature Number**: 053

**Feature Branch**: `053-mobile-appointment-ux`  
**Created**: 2025-12-22  
**Status**: Draft  
**Input**: User description: "i choose the option A with the responsive Step Stepper and the option B for the Date picker Adaptation"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Mobile-Friendly Step Navigation (Priority: P1)

Mobile users need to easily navigate through the appointment booking process without content overflowing their screen or requiring horizontal scrolling. Users booking appointments on smartphones should see a step indicator that adapts to their device size, showing the current step and allowing navigation to previous steps.

**Why this priority**: Critical - users cannot complete bookings on mobile devices when the step indicator overflows the screen. This is the most severe UX issue preventing mobile users from using the appointment booking feature.

**Independent Test**: Can be fully tested by accessing the booking widget on a mobile device (375px-428px width) and verifying all step indicators are visible without horizontal scrolling, and navigating through all steps works correctly.

**Acceptance Scenarios**:

1. **Given** a user opens the appointment booking page on a mobile device (375px-428px width), **When** the page loads, **Then** the step indicator displays vertically with step numbers and labels visible without horizontal scrolling
2. **Given** a user is on step 3 (form), **When** they tap on step 1 or 2 in the indicator, **Then** they navigate to that previous step and can modify their selections
3. **Given** a user is on step 2, **When** they try to tap on step 3 or 4, **Then** nothing happens (future steps are not clickable)
4. **Given** a user opens the booking page on a desktop device (768px+ width), **When** the page loads, **Then** the step indicator displays horizontally with step numbers and labels in a single row

---

### User Story 2 - Mobile-Optimized Date Selection (Priority: P1)

Mobile users need to select appointment dates from a calendar that displays comfortably on their screen without cramming 7 days into a single row. The calendar should show fewer days per row and allow horizontal scrolling to view more days, making date selection easier and more accurate on small screens.

**Why this priority**: Critical - the current 7-column date picker is unusable on mobile devices, with dates too small to tap accurately or overflowing the screen. This prevents users from completing the booking process.

**Independent Test**: Can be fully tested by accessing the booking widget on a mobile device, navigating to the date selection step, and verifying that 3-4 days are displayed per row with clear spacing, and all days in the week are accessible through horizontal scrolling.

**Acceptance Scenarios**:

1. **Given** a user is on the date selection step on a mobile device, **When** the calendar loads, **Then** exactly 3 days are displayed per row (or 4 on larger mobile screens) with clear spacing and readable text
2. **Given** a user is viewing days 1-3 of the week, **When** they swipe or scroll horizontally, **Then** they can see days 4-7 of the week with smooth scrolling behavior
3. **Given** a user selects a date with available slots, **When** the slot list appears, **Then** the time slots are displayed in a grid with 2-3 columns per row on mobile (vs 6 columns on desktop)
4. **Given** a user views the date picker on a desktop device, **When** the calendar loads, **Then** all 7 days of the week are displayed in a single row as before

---

### User Story 3 - Responsive Layout Adaptation (Priority: P2)

Users need the entire booking widget to adapt seamlessly to different screen sizes, ensuring that all form fields, buttons, and content remain accessible and readable on both mobile and desktop devices without zooming or excessive scrolling.

**Why this priority**: Important - ensures consistent user experience across devices. While less critical than the specific step and date issues, it prevents other responsive problems that may emerge after fixing the main issues.

**Independent Test**: Can be fully tested by accessing the booking widget on devices ranging from 375px to 1920px width and verifying all UI elements (forms, buttons, text, spacing) are properly sized and readable without horizontal scrolling.

**Acceptance Scenarios**:

1. **Given** a user is on the booking form step on a mobile device, **When** the form displays, **Then** all input fields, labels, and buttons are full-width with adequate spacing and readable text size (at least 16px)
2. **Given** a user is on the confirmation step on a mobile device, **When** the booking summary displays, **Then** all information (activity name, date, time, price, user info) is readable without horizontal scrolling
3. **Given** a user completes a booking successfully, **When** the success message displays, **Then** the success icon, confirmation text, and "Book another appointment" button are centered and readable on mobile
4. **Given** a user rotates their mobile device from portrait to landscape, **When** the layout updates, **Then** the step indicator and date picker adapt appropriately (may show more columns in landscape)

---

### Edge Cases

- What happens when a user with a very small mobile device (320px width) accesses the booking widget?
- What happens when a user is in the middle of booking and rotates their device from portrait to landscape?
- How does the date picker behave when a user swipes quickly multiple times to navigate through weeks?
- What happens when a user selects a date that has no available slots on mobile?
- How does the step indicator display on devices with intermediate screen sizes (tablets in portrait mode, 500-700px width)?
- What happens when the user has a very long activity name or custom field label on mobile - does it overflow or wrap properly?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The step indicator MUST display vertically on mobile devices (screen width < 768px) with step numbers and labels stacked vertically
- **FR-002**: The step indicator MUST display horizontally on desktop devices (screen width ≥ 768px) with step numbers and labels in a single row
- **FR-003**: The step indicator MUST allow navigation to previous steps on both mobile and desktop when tapped/clicked
- **FR-004**: The step indicator MUST prevent navigation to future steps (user cannot skip ahead)
- **FR-005**: Step labels MUST be fully visible on mobile devices without truncation or horizontal overflow
- **FR-006**: The date picker MUST display 3 days per row on small mobile devices (screen width < 400px)
- **FR-007**: The date picker MUST display 4 days per row on larger mobile devices (screen width 400px - 767px)
- **FR-008**: The date picker MUST display 7 days per row on desktop devices (screen width ≥ 768px)
- **FR-009**: The date picker MUST support horizontal scrolling to view all 7 days of the week on mobile devices
- **FR-010**: The date picker MUST maintain the same functionality (select date, show availability, select slot) on both mobile and desktop
- **FR-011**: Time slot buttons MUST display in 2-3 columns per row on mobile devices (vs 6 columns on desktop)
- **FR-012**: All form inputs MUST be full-width with minimum 16px font size on mobile devices to prevent auto-zoom on iOS
- **FR-013**: All buttons MUST have minimum touch target size of 44px × 44px on mobile devices
- **FR-014**: The booking widget container MUST not exceed the viewport width on any device (no horizontal scrolling at container level)
- **FR-015**: Text content MUST wrap appropriately on mobile devices without overflowing containers
- **FR-016**: The booking confirmation summary MUST display all information in a single column on mobile devices
- **FR-017**: The step indicator MUST use the theme color configured in admin dashboard for active and completed steps
- **FR-018**: The date picker MUST highlight the selected date using the theme color configured in admin dashboard
- **FR-019**: The booking widget MUST maintain proper color contrast ratios for all text and UI elements in both light and dark modes (VI. Accessibility-First Design principle)
- **FR-020**: All visible text displayed on screen MUST be in French (XI. French Localization principle)
- **FR-021**: Code MUST implement only strict minimum required for current feature (VII. YAGNI principle)
- **FR-022**: Code MUST avoid duplication through reusable components and responsive utility patterns (VIII. DRY principle)
- **FR-023**: Code MUST be simple, readable, and clear with straightforward responsive implementations (IX. KISS principle)

### Key Entities

No new data entities are introduced by this feature. The changes are purely presentation layer modifications to the existing booking widget components.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Mobile users (screen width 375px-428px) can view and interact with the step indicator without horizontal scrolling in 100% of test cases
- **SC-002**: Mobile users can navigate between all booking steps (activity → slot → form → confirm) without encountering overflow or layout issues
- **SC-003**: The date picker displays 3-4 days per row on mobile devices with all 7 days accessible through horizontal scrolling in 100% of test cases
- **SC-004**: Users can successfully select a date and time slot on mobile devices with the same success rate as on desktop devices (target: ≥ 95%)
- **SC-005**: Time slot buttons are easily tappable on mobile devices with minimum 44px × 44px touch targets, resulting in zero mis-taps in usability testing
- **SC-006**: Form inputs are fully usable on mobile devices without requiring zoom or horizontal scrolling
- **SC-007**: The booking widget works correctly across the full range of screen sizes from 320px to 1920px width without layout breaks
- **SC-008**: Mobile users can complete the full booking flow (activity selection → date selection → form → confirmation → success) in under 3 minutes
- **SC-009**: User satisfaction scores for mobile booking experience improve from baseline to ≥ 4 out of 5 stars in post-booking surveys
- **SC-010**: Reduction in mobile booking abandonment rate by at least 30% compared to baseline measurement

## Assumptions

- The responsive breakpoints are defined as: mobile (< 768px), tablet (768px - 1023px), desktop (≥ 1024px)
- Users primarily access the booking widget on smartphones in portrait orientation (375px-428px width)
- The existing Chakra UI responsive utilities (base, md, lg breakpoints) will be used for responsive styling
- The existing theme color context provider will continue to supply the theme color for consistent branding
- No changes to the backend API or data models are required for this feature
- Horizontal scrolling on mobile devices will use native touch scrolling behavior (no custom swipe gestures needed)
- The booking widget will continue to support the same user flows and business rules after responsive changes

## Out of Scope

- Adding new features to the booking process (e.g., additional steps, new fields)
- Changing the business logic of appointment booking or availability checking
- Implementing progressive web app (PWA) features or offline support
- Adding touch gestures beyond native scrolling (e.g., swipe to change steps)
- Supporting devices smaller than 320px width (e.g., very old phones)
- Redesigning the visual style or branding of the booking widget (only responsive layout changes)
- Performance optimizations beyond ensuring smooth responsive behavior
- Accessibility features beyond WCAG 2.1 AA compliance (already required by constitution)
