# Quickstart: Appointment Booking System

**Feature**: 052-appointment-booking  
**Date**: 2026-01-10

## Overview

This feature adds a complete appointment booking system allowing website visitors to book sessions with the practitioner. The admin can configure activities, set availability, manage appointments, and receive email notifications.

## Key Components

### Domain Layer (`src/domain/appointment/`)

- **Entities**: `Activity`, `Availability`, `Appointment`
- **Value Objects**: `AppointmentStatus`, `ClientInfo`, `WeeklySlot`, `AvailabilityException`
- **Services**: `IActivityRepository`, `IAvailabilityRepository`, `IAppointmentRepository`

### Application Layer (`src/application/appointment/`)

- **Activities**: `CreateActivity`, `UpdateActivity`, `DeleteActivity`, `GetActivities`, `GetPublicActivities`
- **Availability**: `UpdateAvailability`, `GetAvailability`, `GetAvailableSlots`
- **Appointments**: `CreateAppointment`, `UpdateAppointmentStatus`, `DeleteAppointment`, `GetAppointments`
- **Emails**: `SendAppointmentConfirmationEmail`, `SendAppointmentReminderEmail`, `SendAdminNewBookingEmail`

### Infrastructure Layer (`src/infrastructure/appointment/`)

- **Repositories**: `MongooseActivityRepository`, `MongooseAvailabilityRepository`, `MongooseAppointmentRepository`
- **Models**: Mongoose schemas for Activity, Availability, Appointment
- **Scheduled Jobs**: `AppointmentReminderJob` (node-cron)

### Presentation Layer (`src/presentation/`)

**Admin Components** (`src/presentation/admin/components/appointment/`):

- `ActivityForm` - Create/edit activity
- `ActivityList` - List all activities
- `AvailabilityEditor` - Weekly slots and exceptions editor
- `AppointmentCalendar` - FullCalendar integration (day/week/month views)
- `AppointmentList` - List all appointments with filtering
- `AppointmentDetail` - View and manage single appointment

**Public Components** (`src/presentation/public/components/appointment/`):

- `AppointmentBookingWidget` - Main booking component for pages
- `ActivitySelector` - Dropdown to select activity
- `SlotPicker` - Calendar showing available slots
- `BookingForm` - Client information form

**Tiptap Extension** (`src/presentation/admin/components/PageContentEditor/extensions/`):

- `AppointmentBooking.ts` - Rich text editor node for embedding booking widget

### API Routes (`src/app/api/appointments/`)

- `GET/POST /api/appointments/activities`
- `PUT/DELETE /api/appointments/activities/[id]`
- `GET/PUT /api/appointments/availability`
- `GET /api/appointments/availability/slots`
- `GET/POST /api/appointments`
- `GET/DELETE /api/appointments/[id]`
- `PATCH /api/appointments/[id]/status`
- `GET /api/appointments/calendar`
- `GET/PUT /api/settings/appointment-module`

## Dependencies

### New NPM Packages

```bash
npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction
```

### Existing Dependencies (reused)

- `mongoose` - Database models
- `tsyringe` - Dependency injection
- `node-cron` - Reminder email scheduling
- Existing email infrastructure from 046-order-email-notifications

## Configuration

### Environment Variables

No new environment variables required. Uses existing:

- `MONGODB_URI` - Database connection
- SMTP settings for emails

### Setting Keys

Add to `src/domain/settings/constants/SettingKeys.ts`:

```typescript
APPOINTMENT_MODULE_ENABLED = 'APPOINTMENT_MODULE_ENABLED';
EMAIL_TEMPLATE_APPOINTMENT_CONFIRMATION_SUBJECT =
  'EMAIL_TEMPLATE_APPOINTMENT_CONFIRMATION_SUBJECT';
EMAIL_TEMPLATE_APPOINTMENT_CONFIRMATION_BODY =
  'EMAIL_TEMPLATE_APPOINTMENT_CONFIRMATION_BODY';
EMAIL_TEMPLATE_APPOINTMENT_REMINDER_SUBJECT =
  'EMAIL_TEMPLATE_APPOINTMENT_REMINDER_SUBJECT';
EMAIL_TEMPLATE_APPOINTMENT_REMINDER_BODY =
  'EMAIL_TEMPLATE_APPOINTMENT_REMINDER_BODY';
EMAIL_TEMPLATE_APPOINTMENT_CANCELLATION_SUBJECT =
  'EMAIL_TEMPLATE_APPOINTMENT_CANCELLATION_SUBJECT';
EMAIL_TEMPLATE_APPOINTMENT_CANCELLATION_BODY =
  'EMAIL_TEMPLATE_APPOINTMENT_CANCELLATION_BODY';
EMAIL_TEMPLATE_APPOINTMENT_ADMIN_NEW_SUBJECT =
  'EMAIL_TEMPLATE_APPOINTMENT_ADMIN_NEW_SUBJECT';
EMAIL_TEMPLATE_APPOINTMENT_ADMIN_NEW_BODY =
  'EMAIL_TEMPLATE_APPOINTMENT_ADMIN_NEW_BODY';
```

## Testing Strategy

### Unit Tests (`test/unit/`)

- **Domain**: Entity creation, validation rules, status transitions
- **Application**: Use case logic with mocked repositories
- **Presentation**: Component rendering, form validation

### Integration Tests (`test/integration/`)

- **API Routes**: Full request/response cycle with test database
- **Repositories**: Database operations with MongoDB Memory Server
- **Booking Flow**: Complete booking with concurrent access tests

## Key Patterns

### Optimistic Locking

```typescript
// In MongooseAppointmentRepository
async createWithSlotCheck(appointment: Appointment): Promise<Appointment | null> {
  // Check slot availability and create atomically
  const existing = await this.model.findOne({
    dateTime: appointment.dateTime,
    status: { $ne: 'cancelled' }
  });
  if (existing) return null; // Slot taken
  return this.model.create(appointment);
}
```

### Module Activation Context

```typescript
// AppointmentModuleContext.tsx
const AppointmentModuleContext = createContext<boolean>(false);

export function useAppointmentModuleEnabled(): boolean {
  return useContext(AppointmentModuleContext);
}
```

### FullCalendar Integration

```tsx
<FullCalendar
  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
  initialView="timeGridWeek"
  headerToolbar={{
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay',
  }}
  selectable={true}
  select={handleSlotSelect}
  events={calendarEvents}
/>
```

## File Structure

```
src/
├── domain/appointment/
│   ├── entities/
│   │   ├── Activity.ts
│   │   ├── Availability.ts
│   │   └── Appointment.ts
│   ├── value-objects/
│   │   ├── AppointmentStatus.ts
│   │   ├── ClientInfo.ts
│   │   ├── WeeklySlot.ts
│   │   └── AvailabilityException.ts
│   └── repositories/
│       ├── IActivityRepository.ts
│       ├── IAvailabilityRepository.ts
│       └── IAppointmentRepository.ts
├── application/appointment/
│   ├── CreateActivity.ts
│   ├── UpdateActivity.ts
│   ├── DeleteActivity.ts
│   ├── GetActivities.ts
│   ├── UpdateAvailability.ts
│   ├── GetAvailability.ts
│   ├── GetAvailableSlots.ts
│   ├── CreateAppointment.ts
│   ├── UpdateAppointmentStatus.ts
│   ├── DeleteAppointment.ts
│   ├── GetAppointments.ts
│   └── SendAppointmentEmails.ts
├── infrastructure/appointment/
│   ├── models/
│   │   ├── ActivityModel.ts
│   │   ├── AvailabilityModel.ts
│   │   └── AppointmentModel.ts
│   ├── repositories/
│   │   ├── MongooseActivityRepository.ts
│   │   ├── MongooseAvailabilityRepository.ts
│   │   └── MongooseAppointmentRepository.ts
│   └── jobs/
│       └── AppointmentReminderJob.ts
├── presentation/
│   ├── admin/components/appointment/
│   │   ├── ActivityForm.tsx
│   │   ├── ActivityList.tsx
│   │   ├── AvailabilityEditor.tsx
│   │   ├── AppointmentCalendar.tsx
│   │   ├── AppointmentList.tsx
│   │   └── AppointmentDetail.tsx
│   ├── public/components/appointment/
│   │   ├── AppointmentBookingWidget.tsx
│   │   ├── ActivitySelector.tsx
│   │   ├── SlotPicker.tsx
│   │   └── BookingForm.tsx
│   └── shared/contexts/
│       └── AppointmentModuleContext.tsx
└── app/
    ├── admin/appointments/
    │   ├── page.tsx
    │   ├── activities/page.tsx
    │   └── availability/page.tsx
    └── api/appointments/
        ├── route.ts
        ├── activities/route.ts
        ├── activities/[id]/route.ts
        ├── availability/route.ts
        ├── availability/slots/route.ts
        ├── [id]/route.ts
        ├── [id]/status/route.ts
        └── calendar/route.ts
```
