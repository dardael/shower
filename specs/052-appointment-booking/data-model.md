# Data Model: Appointment Booking System

**Feature**: 052-appointment-booking  
**Date**: 2026-01-10

## Entities

### Activity

Represents a bookable service type offered by the practitioner.

| Field                     | Type                 | Required | Description                                           |
| ------------------------- | -------------------- | -------- | ----------------------------------------------------- |
| id                        | ObjectId             | Yes      | Unique identifier                                     |
| name                      | string               | Yes      | Activity name (e.g., "Consultation initiale")         |
| description               | string               | No       | Detailed description                                  |
| durationMinutes           | number               | Yes      | Session duration in minutes                           |
| color                     | string               | Yes      | Hex color code for calendar display (e.g., "#3B82F6") |
| price                     | number               | Yes      | Price in euros (display only, no payment processing)  |
| requiredFields            | RequiredFieldsConfig | Yes      | Configuration for client booking form                 |
| reminderSettings          | ReminderSettings     | Yes      | Email reminder configuration                          |
| minimumBookingNoticeHours | number               | Yes      | Minimum hours before appointment for booking          |
| createdAt                 | Date                 | Yes      | Creation timestamp                                    |
| updatedAt                 | Date                 | Yes      | Last update timestamp                                 |

**RequiredFieldsConfig** (embedded):
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| phone | boolean | Yes | Whether phone is required |
| address | boolean | Yes | Whether address is required |
| customField | boolean | Yes | Whether custom field is enabled |
| customFieldLabel | string | No | Label for custom field (if enabled) |

**ReminderSettings** (embedded):
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| enabled | boolean | Yes | Whether reminder emails are sent |
| hoursBefore | number | No | Hours before appointment to send reminder |

### Availability

Represents the practitioner's available time slots.

| Field       | Type                    | Required | Description                               |
| ----------- | ----------------------- | -------- | ----------------------------------------- |
| id          | ObjectId                | Yes      | Unique identifier                         |
| weeklySlots | WeeklySlot[]            | Yes      | Recurring weekly availability             |
| exceptions  | AvailabilityException[] | Yes      | Date-specific exceptions (holidays, etc.) |
| updatedAt   | Date                    | Yes      | Last update timestamp                     |

**WeeklySlot** (embedded):
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| dayOfWeek | number | Yes | Day of week (0=Sunday, 1=Monday, ..., 6=Saturday) |
| startTime | string | Yes | Start time in HH:mm format (e.g., "09:00") |
| endTime | string | Yes | End time in HH:mm format (e.g., "12:00") |

**AvailabilityException** (embedded):
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| date | Date | Yes | The exception date |
| reason | string | No | Optional reason (e.g., "Vacances de Noël") |

### Appointment

Represents a booked session with a client.

| Field                   | Type              | Required | Description                          |
| ----------------------- | ----------------- | -------- | ------------------------------------ |
| id                      | ObjectId          | Yes      | Unique identifier                    |
| activityId              | ObjectId          | Yes      | Reference to the activity            |
| activityName            | string            | Yes      | Copied from activity at booking time |
| activityDurationMinutes | number            | Yes      | Copied from activity at booking time |
| activityColor           | string            | Yes      | Copied from activity at booking time |
| dateTime                | Date              | Yes      | Appointment start date and time      |
| status                  | AppointmentStatus | Yes      | Current status                       |
| clientInfo              | ClientInfo        | Yes      | Client contact information           |
| reminderSent            | boolean           | Yes      | Whether reminder email has been sent |
| version                 | number            | Yes      | Optimistic locking version           |
| createdAt               | Date              | Yes      | Creation timestamp                   |
| updatedAt               | Date              | Yes      | Last update timestamp                |

**AppointmentStatus** (enum):

- `pending` - Initial status after booking
- `confirmed` - Confirmed by admin
- `cancelled` - Cancelled by admin

**ClientInfo** (embedded):
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Client full name |
| email | string | Yes | Client email address |
| phone | string | No | Client phone number |
| address | string | No | Client address |
| customFieldValue | string | No | Value for custom field if enabled |

### AppointmentModuleSettings

Module configuration stored as WebsiteSetting.

| Setting Key                | Type    | Description                          |
| -------------------------- | ------- | ------------------------------------ |
| APPOINTMENT_MODULE_ENABLED | boolean | Whether appointment module is active |

## Relationships

```
Activity (1) ----< (many) Appointment
    |
    +-- Appointment stores snapshot of Activity data at booking time
        (activityName, activityDurationMinutes, activityColor)

Availability (1) ---- (1) System
    |
    +-- Single availability configuration for the practitioner
```

## State Transitions

### Appointment Status Flow

```
[New Booking]
     |
     v
  pending ----[Admin Confirms]----> confirmed
     |                                  |
     |                                  |
     +----[Admin Cancels]-----> cancelled <----[Admin Cancels]----+
```

## Validation Rules

### Activity

- `name`: Required, max 100 characters
- `durationMinutes`: Required, minimum 5, maximum 480 (8 hours)
- `color`: Required, valid hex color format
- `price`: Required, minimum 0
- `minimumBookingNoticeHours`: Required, minimum 0

### Availability

- `weeklySlots.startTime`: Must be before `endTime`
- `weeklySlots`: No overlapping slots for the same day
- `exceptions.date`: Must be a valid date

### Appointment

- `dateTime`: Must be in the future (at booking time)
- `dateTime`: Must respect activity's minimum booking notice
- `clientInfo.email`: Valid email format
- `clientInfo.name`: Required, max 100 characters

## Indexes

### Activity Collection

- `id` (unique, primary)

### Appointment Collection

- `id` (unique, primary)
- `dateTime` (for availability queries)
- `status` (for filtering)
- `activityId` (for activity-based queries)
- Compound: `{ dateTime: 1, status: 1 }` (for calendar display)

### Availability Collection

- `id` (unique, primary)
