# Feature Specification: Appointment Booking System

**Feature Branch**: `052-appointment-booking`  
**Created**: 2026-01-10  
**Status**: Draft  
**Input**: User description: "

# Admin side

The admin of the website can need to handle appointment. he need to specify different activity for appointment. He need to specify when he is available. he need to can accept client appointment after booking. He need to can configure in page content a component to allow website users to book appointment.

## Configuration

The admin in the main admin tab can activate the appointment module. By default it is deactivated.
When activated a new tab appear in the admin menu "Appointment".

## Appointment menu

In the new appointment admin menu, the admin can see all the booked appointments with their status (pending, confirmed, cancelled). He can click on an appointment to see its details (client informations, activity, date and time, status). He can change the status of the appointment (for example to confirm or cancel it). He can also delete an appointment.

## Activities

In the new admin menu appointment, the admin can create different activities for appointment. Each activity can have a name, a description, a duration in minutes, a color to identify it, and a price. The admin can also specify which informations to ask to the client when booking an appointment for this activity (name, email, phone, adress, custom text field). it is also possible to specify if a reminder email should be sent to the client before the appointment date. and if so, how many hours before.
An activity can be deleted. already booked appointment for this activity will not be affected.

## Availability

In the appointment admin menu, the admin can specify his availability for each day of the week. He can specify multiple time slots for each day. He can also specify exceptions for specific dates (for example holidays).
He can vizualize a calendar with all his availability and booked appointments. available view are day, week, month. default is week view.

## Emails templates

In the existing email templates admin tab, new email templates are available for appointment booking confirmation, appointment reminder, appointment cancellation. there is also an email template for the admin to notify him of a new booking.

## Page content

When the admin is editing a page content, he can add a new component "Appointment Booking" with the rich text editor. In the component settings, he can choose which activity to offer for booking.

# Client side

When the user go to a page with the appointment booking component, he can choose an activity from a dropdown list. Then he can choose a date and time for the appointment from a calendar that shows the admin availability (it must also include already booked appointment). He then fill the form with the required informations. After submitting the form, he receive a confirmation email and the admin is notified of the new booking. The user can also receive reminder emails before the appointment date.

# Example usage

In my case my admin is a kinesitherapist. He want to offer appointment booking for different types of sessions (initial consultation, follow-up session, specialized therapy). Each session has a different duration and price. The admin specify his availability during the week and add exceptions for his holidays. When a client book an appointment, he receive a confirmation email with the details of the appointment and a reminder email 24 hours before. The admin can see all booked appointments in his admin panel and confirm or cancel them if needed. if there is race condition when two clients try to book the same time slot, only the first one will succeed and the second one will be notified that the time slot is no longer available.
"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Admin Activates Appointment Module (Priority: P1)

As an admin, I want to activate the appointment module from the main admin settings so that I can enable appointment booking functionality on my website.

**Why this priority**: This is the foundational feature that gates all other appointment functionality. Without activation, no other appointment features are accessible.

**Independent Test**: Can be fully tested by toggling the module on/off in admin settings and verifying the "Rendez-vous" tab appears/disappears in the admin menu.

**Acceptance Scenarios**:

1. **Given** I am logged in as admin on the main admin tab, **When** I toggle the appointment module activation switch, **Then** a new "Rendez-vous" tab appears in the admin menu
2. **Given** the appointment module is activated, **When** I toggle it off, **Then** the "Rendez-vous" tab disappears from the admin menu
3. **Given** the appointment module is deactivated, **When** I access the admin menu, **Then** I do not see the "Rendez-vous" tab

---

### User Story 2 - Admin Creates Activities (Priority: P1)

As an admin, I want to create different activities for appointments so that clients can book specific types of sessions with appropriate durations and prices.

**Why this priority**: Activities are the core building blocks for appointments. Without activities, clients cannot book anything.

**Independent Test**: Can be fully tested by creating, editing, and deleting activities and verifying they persist correctly.

**Acceptance Scenarios**:

1. **Given** I am in the appointment admin menu, **When** I create a new activity with name "Consultation initiale", duration 60 minutes, price 50€, and color blue, **Then** the activity is saved and displayed in the activities list
2. **Given** an activity exists, **When** I edit its properties, **Then** the changes are saved and reflected in the activities list
3. **Given** an activity exists with booked appointments, **When** I delete the activity, **Then** the activity is removed but existing appointments remain unaffected
4. **Given** I am creating an activity, **When** I configure which client information to collect (name, email, phone, address, custom field), **Then** these fields are saved and will be required during booking
5. **Given** I am creating an activity, **When** I enable reminder emails and set hours before (e.g., 24 hours), **Then** these reminder settings are saved with the activity
6. **Given** I am creating an activity, **When** I configure minimum booking notice (e.g., 2 hours), **Then** clients cannot book slots starting within that time window

---

### User Story 3 - Admin Configures Availability (Priority: P1)

As an admin, I want to define my weekly availability and exceptions so that clients can only book during times I am available.

**Why this priority**: Availability is essential for the booking system to function - clients need to know when slots are open.

**Independent Test**: Can be fully tested by setting weekly time slots and date exceptions, then verifying the availability calendar displays correctly.

**Acceptance Scenarios**:

1. **Given** I am in the availability section, **When** I add time slots for Monday (9:00-12:00, 14:00-18:00), **Then** these slots are saved and displayed in my weekly schedule
2. **Given** I have weekly availability configured, **When** I add an exception for a specific date (e.g., holiday on December 25), **Then** that date is marked as unavailable
3. **Given** I have availability and exceptions configured, **When** I view the calendar in week view, **Then** I see my available slots and any booked appointments
4. **Given** I am viewing the calendar, **When** I switch between day, week, and month views, **Then** the calendar updates to show the appropriate time range

---

### User Story 4 - Client Books an Appointment (Priority: P1)

As a website visitor, I want to book an appointment by selecting an activity, choosing an available time slot, and providing my information so that I can schedule a session with the practitioner.

**Why this priority**: This is the core client-facing feature that delivers the primary value of the appointment system.

**Independent Test**: Can be fully tested end-to-end by a visitor selecting an activity, picking a time slot, filling the form, and receiving confirmation.

**Acceptance Scenarios**:

1. **Given** I am on a page with the appointment booking component, **When** I select an activity from the dropdown, **Then** I see a calendar showing available time slots based on admin availability
2. **Given** I have selected an activity, **When** I click on an available time slot, **Then** the slot is highlighted and I can proceed to fill in my information
3. **Given** I have selected a time slot, **When** I fill in the required information and submit, **Then** the appointment is created with "pending" status and I receive a confirmation email
4. **Given** two clients try to book the same time slot simultaneously, **When** the first client completes booking, **Then** the second client is notified that the slot is no longer available
5. **Given** a time slot is already booked, **When** I view the calendar, **Then** that slot appears as unavailable
6. **Given** an activity has minimum booking notice of 2 hours, **When** I view available slots, **Then** slots starting within 2 hours are not selectable

---

### User Story 5 - Admin Manages Appointments (Priority: P2)

As an admin, I want to view, confirm, cancel, and delete appointments so that I can manage my schedule and client bookings effectively.

**Why this priority**: Management capabilities are essential for day-to-day operations but depend on having bookings first.

**Independent Test**: Can be fully tested by viewing the appointments list, clicking on appointments, and changing their status.

**Acceptance Scenarios**:

1. **Given** I am in the appointment admin menu, **When** I view the appointments list, **Then** I see all booked appointments with their status (pending, confirmed, cancelled)
2. **Given** I click on an appointment, **When** the details panel opens, **Then** I see client information, activity, date/time, and status
3. **Given** I am viewing an appointment with "pending" status, **When** I confirm it, **Then** the status changes to "confirmed" and the client receives a confirmation email
4. **Given** I am viewing an appointment, **When** I cancel it, **Then** the status changes to "cancelled" and the client receives a cancellation email
5. **Given** I am viewing an appointment, **When** I delete it, **Then** the appointment is removed from the system

---

### User Story 6 - Admin Adds Booking Component to Page (Priority: P2)

As an admin, I want to add an appointment booking component to my page content so that visitors can book appointments directly from my website pages.

**Why this priority**: This connects the booking system to the public website but requires activities to be configured first.

**Independent Test**: Can be fully tested by adding the component in the rich text editor and verifying it appears on the public page.

**Acceptance Scenarios**:

1. **Given** I am editing a page with the rich text editor, **When** I insert an "Appointment Booking" component, **Then** the component is added to the page content
2. **Given** I have inserted the booking component, **When** I configure it, **Then** I can select which activities to offer for booking
3. **Given** I have configured the booking component, **When** I save and view the public page, **Then** visitors see the booking interface with the selected activities

---

### User Story 7 - Email Notifications (Priority: P2)

As an admin or client, I want to receive appropriate email notifications for appointment events so that I stay informed about bookings and changes.

**Why this priority**: Notifications enhance the user experience but the core booking functionality works without them.

**Independent Test**: Can be fully tested by triggering booking events and verifying emails are sent with correct content.

**Acceptance Scenarios**:

1. **Given** a client books an appointment, **When** the booking is submitted, **Then** the client receives a booking confirmation email and the admin receives a new booking notification email
2. **Given** an appointment is confirmed by admin, **When** the status changes to confirmed, **Then** the client receives a confirmation email
3. **Given** an appointment is cancelled, **When** the status changes to cancelled, **Then** the client receives a cancellation email
4. **Given** an activity has reminder emails enabled, **When** the configured time before the appointment is reached, **Then** the client receives a reminder email
5. **Given** I am in the email templates admin section, **When** I view appointment-related templates, **Then** I can customize templates for booking confirmation, reminder, cancellation, and admin notification

---

### User Story 8 - Admin Configures Email Templates (Priority: P3)

As an admin, I want to customize the email templates for appointment notifications so that the communications match my brand and contain the right information.

**Why this priority**: Template customization is a nice-to-have that enhances professionalism but default templates work for MVP.

**Independent Test**: Can be fully tested by editing templates in the email templates admin section and verifying sent emails use the customized content.

**Acceptance Scenarios**:

1. **Given** I am in the email templates admin section, **When** I see appointment-related templates, **Then** I can view and edit: booking confirmation, appointment reminder, appointment cancellation, and admin new booking notification
2. **Given** I edit an email template, **When** I save changes, **Then** subsequent emails use the updated template content

---

### Edge Cases

- What happens when an admin deletes an activity that has pending appointments? The appointments remain with their original activity details preserved.
- What happens when a client tries to book a slot that gets booked by another client simultaneously? The system uses optimistic locking - the first successful booking wins, the second client receives an error message indicating the slot is no longer available.
- What happens when the admin changes availability after appointments are booked? Existing appointments remain valid; only future bookings are affected by the new availability.
- What happens when a reminder email is scheduled but the appointment is cancelled before the reminder time? The reminder is not sent.
- What happens when the appointment module is deactivated while appointments exist? Existing appointments remain in the database but the admin menu and public booking components are hidden.

## Requirements _(mandatory)_

### Functional Requirements

#### Module Configuration

- **FR-001**: System MUST allow admin to activate/deactivate the appointment module from the main admin settings
- **FR-002**: System MUST show/hide the "Rendez-vous" admin menu tab based on module activation status
- **FR-003**: System MUST persist module activation state across sessions

#### Activities Management

- **FR-004**: System MUST allow admin to create activities with: name, description, duration (in minutes), color, and price
- **FR-005**: System MUST allow admin to configure which client information fields are required for each activity: name (always required), email (always required), phone (optional), address (optional), custom text field (optional with custom label)
- **FR-006**: System MUST allow admin to enable/disable reminder emails per activity and configure hours before appointment
- **FR-006b**: System MUST allow admin to configure minimum booking notice (in hours) per activity - clients cannot book slots starting sooner than this threshold
- **FR-007**: System MUST allow admin to edit existing activities
- **FR-008**: System MUST allow admin to delete activities without affecting existing appointments

#### Availability Management

- **FR-009**: System MUST allow admin to define recurring weekly availability with multiple time slots per day
- **FR-010**: System MUST allow admin to add date-specific exceptions (unavailable dates like holidays)
- **FR-011**: System MUST display a calendar view with day, week, and month options (default: week view)
- **FR-012**: System MUST show both availability slots and booked appointments on the calendar

#### Appointment Booking (Client)

- **FR-013**: System MUST provide an "Appointment Booking" component insertable via rich text editor
- **FR-014**: System MUST allow component configuration to select which activities are available for booking
- **FR-015**: System MUST display a calendar showing only available slots (considering availability, exceptions, and existing bookings) with no time horizon limit - clients can book as far ahead as availability is configured
- **FR-016**: System MUST calculate available slots based on activity duration
- **FR-017**: System MUST display a booking form with fields configured for the selected activity
- **FR-018**: System MUST create appointments with initial status "pending"
- **FR-019**: System MUST prevent double-booking through optimistic locking - first successful submission wins
- **FR-020**: System MUST notify client if selected slot becomes unavailable during booking process

#### Appointment Management (Admin)

- **FR-021**: System MUST display list of all appointments with status (pending, confirmed, cancelled)
- **FR-022**: System MUST show appointment details: client information, activity, date/time, status
- **FR-023**: System MUST allow admin to change appointment status (confirm, cancel)
- **FR-024**: System MUST allow admin to delete appointments

#### Email Notifications

- **FR-025**: System MUST send booking confirmation email to client upon successful booking
- **FR-026**: System MUST send new booking notification email to admin upon new booking
- **FR-027**: System MUST send confirmation email to client when admin confirms appointment
- **FR-028**: System MUST send cancellation email to client when admin cancels appointment
- **FR-029**: System MUST send reminder email to client at configured hours before appointment (if enabled for activity)
- **FR-030**: System MUST provide customizable email templates for: booking confirmation, appointment reminder, appointment cancellation, admin new booking notification

#### Standard Requirements

- **FR-031**: System MUST ensure proper contrast ratios for text and UI elements in both light and dark modes
- **FR-032**: UI components MUST be tested for readability across all supported themes
- **FR-033**: Theme color specified in admin dashboard MUST be used consistently throughout frontend when color customization is needed
- **FR-034**: Code MUST implement only strict minimum required for current feature (YAGNI principle)
- **FR-035**: Code MUST avoid duplication through reusable functions and components (DRY principle)
- **FR-036**: Code MUST be simple, readable, and clear with straightforward implementations (KISS principle)
- **FR-037**: Configuration changes MUST be synchronized with export/import system and increment export file version (Configuration Portability principle)
- **FR-038**: All visible text displayed on screen MUST be in French (French Localization principle)

### Key Entities

- **Activity**: Represents a bookable service type. Attributes: name, description, duration (minutes), color, price, required client fields configuration, reminder email settings (enabled, hours before), minimum booking notice (hours).
- **Availability**: Represents when the admin is available for appointments. Contains weekly recurring slots (day of week, start time, end time) and date-specific exceptions (date, reason).
- **Appointment**: Represents a booked session. Attributes: client information (name, email, phone, address, custom field), activity reference, date/time, duration, status (pending/confirmed/cancelled), creation timestamp.
- **AppointmentModuleSettings**: Represents module configuration. Attributes: enabled (boolean).

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Admin can activate the appointment module and see the new menu tab within 3 seconds
- **SC-002**: Admin can create a complete activity (all fields) in under 2 minutes
- **SC-003**: Admin can configure a full week of availability in under 5 minutes
- **SC-004**: Client can complete the entire booking process (select activity, choose slot, fill form, submit) in under 3 minutes
- **SC-005**: System handles concurrent booking attempts correctly - only one booking succeeds for the same slot
- **SC-006**: Confirmation emails are sent within 1 minute of booking submission
- **SC-007**: Reminder emails are sent within 5 minutes of the configured reminder time
- **SC-008**: Calendar views load and display within 2 seconds
- **SC-009**: 100% of booked appointments appear correctly in the admin appointments list
- **SC-010**: Admin can change appointment status with immediate visual feedback

## Clarifications

### Session 2026-01-10

- Q: How far in advance can clients book appointments? → A: No limit (as far as availability is configured)
- Q: What is the minimum notice required for booking an appointment? → A: Admin configurable per activity
- Q: Can clients cancel their own appointments? → A: No - only admin can cancel (no user account functionality)

## Assumptions

- The existing email infrastructure (from feature 046-order-email-notifications) will be reused for sending appointment emails
- The existing rich text editor component infrastructure will be extended to support the new booking component
- Time zones are not considered - all times are assumed to be in the admin's local timezone
- The system supports single-practitioner scenarios (one admin's availability)
- Activity prices are for display purposes only - no payment processing is included in this feature
- Client email addresses are not verified before booking

## Out of Scope

- Client self-cancellation of appointments (no user account functionality exists)
- Payment processing for appointments
- Multi-practitioner scheduling
- Time zone handling
- Email address verification
