# Research: Appointment Booking System

**Feature**: 052-appointment-booking  
**Date**: 2026-01-10

## Calendar Component Library

### Decision: FullCalendar with React

**Rationale**: FullCalendar is the most comprehensive calendar library with extensive documentation (1350+ code snippets), high source reputation, and native React support. It provides day/week/month views out of the box with selectable time slots.

**Alternatives Considered**:

- **react-big-calendar**: Good option (164 snippets, 83.2 benchmark) but less comprehensive documentation
- **Schedule X**: Higher benchmark (88.5) but less mature ecosystem
- **react-calendar**: Simple date picker, lacks time slot selection needed for appointments

**Key Integration Points**:

- `@fullcalendar/react` - React component wrapper
- `@fullcalendar/daygrid` - Month view
- `@fullcalendar/timegrid` - Day/Week views with time slots
- `@fullcalendar/interaction` - Click and select interactions
- `selectable: true` enables time slot selection
- `dateClick` and `select` callbacks for booking flow

## Email Infrastructure Reuse

### Decision: Extend existing email infrastructure from 046-order-email-notifications

**Rationale**: The project already has a robust email system with NodemailerEmailService, template management, and placeholder replacement.

**Existing Patterns to Reuse**:

- **Service**: `/src/infrastructure/email/services/NodemailerEmailService.ts`
- **Interface**: `/src/domain/email/services/IEmailService.ts`
- **Templates**: Stored in MongoDB via `WebsiteSetting` entities
- **Placeholders**: `/src/infrastructure/email/services/PlaceholderReplacer.ts`

**New Templates Required**:

1. `EMAIL_TEMPLATE_APPOINTMENT_CONFIRMATION_*` - Client booking confirmation
2. `EMAIL_TEMPLATE_APPOINTMENT_REMINDER_*` - Client reminder
3. `EMAIL_TEMPLATE_APPOINTMENT_CANCELLATION_*` - Cancellation notification
4. `EMAIL_TEMPLATE_APPOINTMENT_ADMIN_NEW_*` - Admin new booking notification
5. `EMAIL_TEMPLATE_APPOINTMENT_ADMIN_CONFIRMED_*` - Client notification when admin confirms

## Module Activation Pattern

### Decision: Follow SellingEnabled pattern for AppointmentModuleEnabled

**Rationale**: The project has an established pattern for module activation using value objects and React contexts.

**Pattern to Follow**:

- **Value Object**: `SellingEnabled` in `/src/domain/settings/value-objects/`
- **Context Provider**: `SellingConfigContext` in `/src/presentation/shared/contexts/`
- **Setting Key**: Add to `/src/domain/settings/constants/SettingKeys.ts`
- **API Integration**: Fetch from `/api/settings` endpoint
- **Local Storage**: Cache with `BroadcastChannel` sync

## Admin Menu Integration

### Decision: Add "Rendez-vous" tab conditionally like Products tab

**Rationale**: The AdminSidebar already implements conditional menu items based on module state.

**Implementation**:

- Add menu item to `menuItems` array in `AdminSidebar.tsx`
- Filter based on `appointmentModuleEnabled` context value
- Create routes under `/src/app/admin/appointments/`

## Rich Text Editor Extension

### Decision: Create AppointmentBooking Tiptap Node extension

**Rationale**: The project uses Tiptap with custom Node extensions for embeddable components (e.g., ProductList).

**Pattern to Follow**:

- Location: `/src/presentation/admin/components/PageContentEditor/extensions/`
- Pattern: `Node.create()` with `atom: true`, `draggable: true`
- Attributes: `activityIds` (array of selected activities)
- Register in extension index file

## Concurrency Handling

### Decision: Optimistic locking with version field on Appointment

**Rationale**: Spec requires handling race conditions where two clients book the same slot.

**Implementation**:

- Add `version` field to Appointment entity
- Use MongoDB `findOneAndUpdate` with version check
- Return error if version mismatch (slot already booked)
- Alternative: Use MongoDB transaction with slot availability check

## Reminder Email Scheduling

### Decision: Use node-cron with database-backed scheduling

**Rationale**: Project already uses node-cron for scheduled tasks (047-database-backup pattern).

**Implementation**:

- Scheduled job runs periodically (every 5 minutes)
- Queries appointments where:
  - Status is "confirmed" or "pending"
  - Activity has reminder enabled
  - Reminder time has passed but email not sent
- Marks appointments as reminder sent after sending

## Data Model Decisions

### Activity Entity

- Store required fields as JSON array: `["name", "email", "phone", "address", "custom"]`
- Store custom field label separately
- Color as hex string for flexibility

### Availability Entity

- Weekly slots: Array of `{ dayOfWeek: number, startTime: string, endTime: string }`
- Exceptions: Array of `{ date: Date, reason?: string }`
- Single document per admin (since single-practitioner)

### Appointment Entity

- Reference activity by ID (but copy name/duration at booking time for historical accuracy)
- Store client info as embedded document
- Status enum: `pending`, `confirmed`, `cancelled`
